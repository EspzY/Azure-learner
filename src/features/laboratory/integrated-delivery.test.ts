import { describe, expect, it } from 'vitest';
import { execute, freshWorld } from '@/laboratory/v39/domain';
import type { Command } from '@/laboratory/v39/contract';
import { deliveryCommandTypes } from '@/laboratory/delivery/domain';
import { analyseFrontDoor } from '@/laboratory/delivery/analysis';
import { deliveryContext } from '@/laboratory/v39/projection';
import { deliveryFamilies, deliveryInventory } from './integrated-delivery';
import type { IntegratedOperation, IntegratedResource } from './integrated-resource';

function fixture() {
  let world = freshWorld(),
    sequence = 0;
  const run = (command: Command) => {
    const result = execute(
      world,
      { commandId: `delivery-ui-${sequence}`, expectedRevision: world.revision, command },
      ++sequence,
    );
    world = result.world;
    return result.receipt;
  };
  for (const command of [
    {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-delivery',
      metadataRegion: 'norwayeast',
    },
    {
      type: 'CreateAppServicePlan',
      groupId: 'group-1',
      name: 'plan-delivery',
      region: 'norwayeast',
      os: 'Linux',
      sku: 'B1',
    },
    {
      type: 'CreateWebApp',
      groupId: 'group-1',
      name: 'app-delivery',
      planId: 'app-plan-2',
      runtime: 'NODE|24-lts',
      httpsOnly: 'true',
      publicNetworkAccess: 'Enabled',
    },
    {
      type: 'DeploySyntheticApplication',
      webAppId: 'web-app-3',
      template: 'hello-world',
      healthPath: '/health',
      responseStatus: '200',
    },
    {
      type: 'CreateVirtualNetwork',
      groupId: 'group-1',
      name: 'vnet-delivery',
      region: 'norwayeast',
      addressSpace: '10.6.0.0/16',
    },
    {
      type: 'CreateSubnet',
      vnetId: 'vnet-5',
      name: 'subnet-delivery',
      addressPrefix: '10.6.1.0/24',
    },
  ] as Command[]) {
    expect(run(command).outcome).toBe('accepted');
  }
  const getOperation = (type: string) => {
    const operation = deliveryFamilies
      .flatMap((family) => family.operations)
      .find((o) => o.type === type);
    if (!operation) throw Error(`Missing UI operation: ${type}`);
    return operation;
  };
  const values = (operation: IntegratedOperation, resource?: IntegratedResource) =>
    typeof operation.defaults === 'function'
      ? operation.defaults(world, resource)
      : (operation.defaults ?? {});
  const command = (
    type: string,
    overrides: Record<string, string> = {},
    resource?: IntegratedResource,
  ): Command => {
    const operation = getOperation(type),
      defaults = { ...values(operation, resource), ...overrides };
    return {
      type,
      ...Object.fromEntries(operation.fields.map((field) => [field, defaults[field] ?? ''])),
    } as Command;
  };
  const build = () => {
    for (const [index, type] of [
      'CreateFrontDoor',
      'CreateFrontDoorEndpoint',
      'CreateOriginGroup',
      'CreateFrontDoorOrigin',
      'CreateFrontDoorRoute',
      'CreateFrontDoorWafPolicy',
      'CreateFrontDoorWafRule',
      'CreateFrontDoorSecurityPolicy',
      'CreateApplicationGateway',
      'CreateGatewayBackendPool',
      'CreateGatewayListener',
      'CreateGatewayProbe',
      'CreateGatewayBackendSetting',
      'CreateGatewayRoutingRule',
    ].entries()) {
      const receipt = run(command(type, { name: `delivery${index}` }));
      expect(receipt, type).toMatchObject({ outcome: 'accepted', code: 'created' });
    }
  };
  return {
    get world() {
      return world;
    },
    run,
    getOperation,
    values,
    command,
    build,
  };
}

describe('integrated delivery controls', () => {
  it('exposes every module operation and drives actual create/update/delete proposals from current form defaults', () => {
    const f = fixture();
    expect(
      deliveryFamilies.flatMap((family) => family.operations.map((o) => o.type)).sort(),
    ).toEqual([...deliveryCommandTypes].sort());
    f.build();
    const records = deliveryInventory(f.world);
    expect(records).toHaveLength(14);
    for (const family of deliveryFamilies) {
      const resource = family.resources(f.world)[0]!;
      expect(resource.parentId).toBeTruthy();
      for (const operation of family.operations.filter((o) => o.type.startsWith('Update'))) {
        const receipt = f.run(f.command(operation.type, {}, resource));
        expect(receipt, operation.type).toMatchObject({ outcome: 'rejected', code: 'no-change' });
        expect(family.resources(f.world)[0]).toEqual(resource);
      }
    }
    for (const view of [
      'gatewayRoutingRule',
      'gatewayBackendSetting',
      'gatewayProbe',
      'gatewayListener',
      'gatewayBackendPool',
      'applicationGateway',
      'frontDoorSecurityPolicy',
      'frontDoorWafRule',
      'frontDoorWafPolicy',
      'frontDoorRoute',
      'frontDoorOrigin',
      'originGroup',
      'frontDoorEndpoint',
      'frontDoor',
    ]) {
      const family = deliveryFamilies.find((item) => item.view === view)!,
        resource = family.resources(f.world)[0]!,
        deletion = family.operations.find((operation) => operation.type.startsWith('Delete'))!;
      const receipt = f.run(f.command(deletion.type, {}, resource));
      expect(receipt, deletion.type).toMatchObject({ outcome: 'accepted', code: 'deleted' });
      expect(receipt.removedIds).toEqual([resource.id]);
    }
    expect(deliveryInventory(f.world)).toEqual([]);
  });

  it('offers actual scoped references and locks update/delete resource targets', () => {
    const f = fixture();
    f.build();
    const originFamily = deliveryFamilies.find((item) => item.view === 'frontDoorOrigin')!,
      origin = originFamily.resources(f.world)[0]!,
      edit = f.getOperation('UpdateFrontDoorOrigin'),
      values = f.values(edit, origin);
    expect(edit.options?.('originId', f.world, origin, values)).toEqual([
      [origin.id, `${origin.name} · ${origin.id}`],
    ]);
    expect(edit.options?.('webAppId', f.world, origin, values)?.map(([id]) => id)).toEqual([
      f.world.webApps[0]!.id,
    ]);
    expect(edit.lockedFields).toContain('originId');
    const profile = f.world.delivery.frontDoors[0]!,
      route = f.getOperation('CreateFrontDoorRoute');
    expect(route.options?.('originGroupId', f.world, undefined, { profileId: profile.id })).toEqual(
      [
        [
          f.world.delivery.originGroups[0]!.id,
          `${f.world.delivery.originGroups[0]!.name} · ${f.world.delivery.originGroups[0]!.id}`,
        ],
      ],
    );
    expect(
      route.options?.('originGroupId', f.world, undefined, { profileId: 'absent-profile' }),
    ).toEqual([]);
    expect(f.run(f.command('CreateFrontDoor', { name: 'secondprofile' })).outcome).toBe('accepted');
    const secondProfileId = f.world.delivery.frontDoors.at(-1)!.id;
    expect(
      f.run(
        f.command('CreateFrontDoorEndpoint', {
          name: 'secondendpoint',
          profileId: secondProfileId,
        }),
      ).outcome,
    ).toBe('accepted');
    expect(
      f.run(f.command('CreateOriginGroup', { name: 'secondgroup', profileId: secondProfileId }))
        .outcome,
    ).toBe('accepted');
    const secondEndpointId = f.world.delivery.frontDoorEndpoints.at(-1)!.id,
      changedValues = route.change?.(
        'endpointId',
        secondEndpointId,
        { ...f.values(route), endpointId: secondEndpointId },
        f.world,
      );
    expect(changedValues?.originGroupId).toBe(f.world.delivery.originGroups.at(-1)!.id);
  });

  it('uses actual configured WAF changes in revision-bound analysis without changing runtime claims', () => {
    const f = fixture();
    f.build();
    const endpointId = f.world.delivery.frontDoorEndpoints[0]!.id;
    const analyse = () =>
      analyseFrontDoor(
        f.world.delivery,
        { endpointId, protocol: 'Https', path: '/blocked' },
        {
          ...deliveryContext(f.world),
          workspace: 'delivery-ui',
          model: f.world.model,
          revision: f.world.revision,
        },
      );
    const blocked = analyse();
    expect(blocked).toMatchObject({ status: 'blocked-by-waf', connectivity: 'not-verified' });
    const family = deliveryFamilies.find((item) => item.view === 'frontDoorWafPolicy')!,
      resource = family.resources(f.world)[0]!;
    expect(
      f.run(f.command('UpdateFrontDoorWafPolicy', { mode: 'Detection' }, resource)).outcome,
    ).toBe('accepted');
    const permitted = analyse();
    expect(permitted).toMatchObject({
      status: 'configuration-consistent',
      connectivity: 'not-verified',
      networkPolicy: 'not-evaluated',
    });
    expect(permitted.binding.revision).toBeGreaterThan(blocked.binding.revision);
    expect(permitted.waf).toMatchObject({ action: 'Block', mode: 'Detection' });
    expect(permitted.backendIds).toEqual([f.world.webApps[0]!.id]);
  });
});
