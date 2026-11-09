import { describe, expect, it } from 'vitest';
import { freshWorld, execute, replay, canonical, resources } from './laboratory/v39/domain';
import { laboratoryModel, type Command, type Entry, type World } from './laboratory/v39/contract';
import { analyseFrontDoor } from './laboratory/delivery/analysis';
import { analyseDatabaseConnection } from './laboratory/data/analysis';
import { dataContext, deliveryContext } from './laboratory/v39/projection';
import * as frozen from './laboratory/v38/domain';
import * as engine from './laboratory/engine';
import { laboratoryInventory } from './features/laboratory/portal-adapter';
import { projectTopology } from './features/laboratory/studio-model';

function fixture() {
  let world = freshWorld();
  const entries: Entry[] = [];
  const run = (command: Command, expectedRevision = world.revision) => {
    const request = { commandId: `integrated-${entries.length}`, expectedRevision, command };
    const result = execute(world, request, entries.length + 1);
    entries.push({
      model: laboratoryModel,
      attempt: world.attempt,
      request,
      receipt: result.receipt,
    });
    world = result.world;
    return result.receipt;
  };
  run({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-chain',
    metadataRegion: 'norwayeast',
  });
  return {
    run,
    entries,
    get world() {
      return world;
    },
  };
}
const plan = (groupId: string, name = 'hosting'): Command => ({
  type: 'CreateAppServicePlan',
  groupId,
  name,
  region: 'norwayeast',
  os: 'Linux',
  sku: 'B1',
});
function chain() {
  const f = fixture(),
    groupId = f.world.groups[0]!.id;
  f.run(plan(groupId));
  f.run({
    type: 'CreateWebApp',
    groupId,
    name: 'chain-app',
    planId: f.world.plans[0]!.id,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  });
  const app = f.world.webApps[0]!;
  f.run({
    type: 'DeploySyntheticApplication',
    webAppId: app.id,
    template: 'api',
    healthPath: '/health',
    responseStatus: '200',
  });
  f.run({
    type: 'CreatePostgresServer',
    groupId,
    name: 'chain-postgres',
    region: 'norwayeast',
    version: '16',
    sku: 'Standard_B1ms',
    storageGiB: '32',
    publicNetworkAccess: 'Enabled',
  });
  f.run({
    type: 'CreatePostgresDatabase',
    serverId: f.world.data.postgresServers[0]!.id,
    name: 'appdata',
    charset: 'UTF8',
  });
  const database = f.world.data.postgresDatabases[0]!;
  f.run({
    type: 'CreateDatabaseConnection',
    appId: app.id,
    databaseId: database.id,
    databaseType: database.type,
    settingName: 'APP_DATABASE',
    tls: '1.2',
  });
  f.run({ type: 'CreateFrontDoor', groupId, name: 'chain-edge', sku: 'Standard_AzureFrontDoor' });
  const profileId = f.world.delivery.frontDoors[0]!.id;
  f.run({ type: 'CreateFrontDoorEndpoint', profileId, name: 'public-endpoint', enabled: 'true' });
  f.run({
    type: 'CreateOriginGroup',
    profileId,
    name: 'application-origins',
    probePath: '/health',
  });
  const originGroupId = f.world.delivery.originGroups[0]!.id;
  f.run({
    type: 'CreateFrontDoorOrigin',
    originGroupId,
    name: 'application-origin',
    webAppId: app.id,
    enabled: 'true',
    priority: '1',
  });
  f.run({
    type: 'CreateFrontDoorRoute',
    endpointId: f.world.delivery.frontDoorEndpoints[0]!.id,
    name: 'default-route',
    originGroupId,
    pattern: '/*',
    enabled: 'true',
  });
  return f;
}
describe('explicit staged integrated Laboratory3.9 host', () => {
  it('rejects the same HTTP Function configuration identically after nested JSON key reordering without a World or ID delta', () => {
    const f = fixture(),
      groupId = f.world.groups[0]!.id;
    f.run({
      type: 'CreateStorageAccount',
      groupId,
      name: 'noopstorage',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    f.run({
      type: 'CreateBlobContainer',
      accountId: f.world.accounts[0]!.id,
      name: 'deployment',
      access: 'private',
    });
    f.run({
      type: 'CreateFunctionApp',
      groupId,
      name: 'noop-functions',
      region: 'norwayeast',
      planName: 'noop-hosting',
      storageAccountId: f.world.accounts[0]!.id,
      deploymentContainerId: f.world.containers[0]!.id,
      runtime: 'node22',
      publicNetworkAccess: 'Enabled',
    });
    f.run({
      type: 'CreateFunction',
      appId: f.world.data.functionApps[0]!.id,
      name: 'http-noop',
      trigger: 'http',
      method: 'GET',
      route: '/hello',
      containerId: '',
      behavior: 'static-text',
      responseText: 'Synthetic output',
    });
    const before = structuredClone(f.world),
      fn = before.data.functions[0]!;
    const request = {
      commandId: 'same-function-config',
      expectedRevision: before.revision,
      command: {
        type: 'UpdateFunction',
        functionId: fn.id,
        enabled: 'true',
        method: 'GET',
        route: '/hello',
        containerId: '',
        behavior: fn.behavior,
        responseText: fn.responseText,
      } as Command,
    };
    const baseline = execute(before, request, f.entries.length + 1);
    expect(baseline.receipt.code).toBe('no-change');
    const jsonbLike = structuredClone(before);
    jsonbLike.data.functions[0]!.trigger = {
      kind: 'http',
      route: '/hello',
      method: 'GET',
      authLevel: 'anonymous',
    };
    for (const variant of [before, JSON.parse(canonical(before)) as World, jsonbLike]) {
      const result = execute(variant, request, f.entries.length + 1);
      expect(result.receipt).toEqual(baseline.receipt);
      expect(result.world).toEqual(variant);
      expect(canonical(result.world)).toBe(canonical(before));
      expect(result.world.nextId).toBe(before.nextId);
    }
    expect(
      replay([
        ...f.entries,
        { model: laboratoryModel, attempt: before.attempt, request, receipt: baseline.receipt },
      ]),
    ).toEqual(before);
  });
  it('projects every actual record and typed dependency into the same Portal and Studio without confusing hosting with ARM ancestry', () => {
    const f = chain(),
      rows = laboratoryInventory(f.world);
    expect(rows.map((r) => r.id).sort()).toEqual(
      resources(f.world)
        .map((r) => r.id)
        .sort(),
    );
    const app = f.world.webApps[0]!,
      database = f.world.data.postgresDatabases[0]!,
      binding = f.world.data.databaseConnections[0]!,
      origin = f.world.delivery.origins[0]!;
    expect(rows.find((r) => r.id === app.id)?.parentId).toBe(app.groupId);
    expect(rows.find((r) => r.id === database.id)).toMatchObject({
      parentId: database.serverId,
      category: 'resource',
    });
    expect(rows.find((r) => r.id === origin.id)?.parentId).toBe(origin.originGroupId);
    const topology = projectTopology(
      { workspace: 'integrated', world: f.world, entries: f.entries, historical: false },
      rows,
    );
    expect(topology.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ from: app.id, to: app.planId, kind: 'app-plan-hosting' }),
        expect.objectContaining({
          from: binding.id,
          to: database.id,
          kind: 'configured-dependency',
        }),
        expect.objectContaining({ from: origin.id, to: app.id, kind: 'configured-dependency' }),
      ]),
    );
    expect(
      topology.edges.some((e) => e.from === app.planId && e.to === app.id && e.kind === 'parent'),
    ).toBe(false);
  });
  it('forms one actual app/data/delivery chain with original receipts and exact full/through replay', () => {
    const f = chain();
    expect(f.entries.every((e) => e.receipt.outcome === 'accepted')).toBe(true);
    expect(new Set(resources(f.world).map((r) => r.id)).size).toBe(resources(f.world).length);
    expect(f.world.nextId).toBe(resources(f.world).length + 1);
    expect(replay(f.entries)).toEqual(f.world);
    expect(replay(JSON.parse(canonical(f.entries)))).toEqual(f.world);
    expect(replay(f.entries, 4)?.delivery.frontDoors).toEqual([]);
    const binding = f.world.data.databaseConnections[0]!;
    expect(
      analyseDatabaseConnection(
        f.world.data,
        dataContext(f.world),
        { workspace: 'workspace', model: laboratoryModel, revision: f.world.revision },
        { connectionId: binding.id },
      ),
    ).toMatchObject({ status: 'undetermined', code: 'source-egress-ip-unknown' });
    const r = analyseFrontDoor(
      f.world.delivery,
      { endpointId: f.world.delivery.frontDoorEndpoints[0]!.id, path: '/hello', protocol: 'Https' },
      {
        ...deliveryContext(f.world),
        workspace: 'workspace',
        model: laboratoryModel,
        revision: f.world.revision,
      },
    );
    expect(r).toMatchObject({
      status: 'configuration-consistent',
      binding: { revision: f.world.revision },
    });
  });
  it('retains explicit global resource configuration without reporting a regional receipt location', () => {
    const f = chain(),
      groupId = f.world.groups[0]!.id;
    expect(f.world.delivery.frontDoors[0]!.region).toBe('global');
    expect(
      f.entries.find((e) => e.request.command.type === 'CreateFrontDoor')!.receipt.location,
    ).toBeNull();
    expect(
      f.run({ type: 'CreateFrontDoorWafPolicy', groupId, name: 'GlobalPolicy', mode: 'Prevention' })
        .location,
    ).toBeNull();
    const policy = f.world.delivery.wafPolicies[0]!;
    expect(policy.region).toBe('global');
    expect(
      f.run({ type: 'UpdateFrontDoorWafPolicy', policyId: policy.id, groupId, mode: 'Detection' })
        .location,
    ).toBeNull();
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('blocks real origin/binding deletion dependencies and setting collisions without any partial World or ID allocation', () => {
    const f = chain(),
      app = f.world.webApps[0]!,
      before = structuredClone(f.world);
    expect(f.run({ type: 'DeleteWebApp', webAppId: app.id }).code).toBe('resource-in-use');
    expect(f.world).toEqual(before);
    expect(
      f.run({
        type: 'SetWebAppSetting',
        webAppId: app.id,
        name: 'app_database',
        value: 'synthetic',
      }).code,
    ).toBe('duplicate-name');
    expect(f.world).toEqual(before);
    expect(
      f.run({ type: 'DeletePostgresDatabase', databaseId: f.world.data.postgresDatabases[0]!.id })
        .outcome,
    ).toBe('rejected');
    expect(f.world).toEqual(before);
    expect(
      f.run({
        type: 'CreateFrontDoorOrigin',
        originGroupId: f.world.delivery.originGroups[0]!.id,
        name: 'wrong-kind',
        webAppId: f.world.data.postgresServers[0]!.id,
        enabled: 'true',
        priority: '2',
      }).code,
    ).toBe('invalid-parent');
    expect(f.world).toEqual(before);
    expect(replay(f.entries)).toEqual(before);
  });
  it('preserves original create origin on updates and reset clears every slice while preserving increasing IDs and original history', () => {
    const f = chain(),
      before = structuredClone(f.world),
      server = f.world.data.postgresServers[0]!;
    const receipt = f.run({
      type: 'UpdatePostgresServer',
      serverId: server.id,
      storageGiB: '64',
      publicNetworkAccess: 'Disabled',
    });
    expect(receipt.integrationChange).toMatchObject({
      id: server.id,
      createOrigin: server.origin,
      before: { storageGiB: 32 },
      after: { storageGiB: 64 },
    });
    expect(f.world.data.postgresServers[0]!.origin).toBe(server.origin);
    const through = f.entries.length;
    expect(f.run({ type: 'ResetWorkspace' }).outcome).toBe('accepted');
    expect(resources(f.world)).toHaveLength(0);
    expect(f.world.nextId).toBe(before.nextId);
    expect(replay(f.entries, through)?.data.postgresServers[0]!.storageGiB).toBe(64);
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('does not add new commands to frozen3.8 and fails stale new commands before proposing a delta', () => {
    const f = chain(),
      before = structuredClone(f.world);
    expect(f.run(plan(f.world.groups[0]!.id, 'stale'), 0).code).toBe('stale-revision');
    expect(f.world).toEqual(before);
    const old = frozen.freshWorld();
    expect(
      frozen.execute(
        old,
        {
          commandId: 'historical',
          expectedRevision: 0,
          command: {
            type: 'CreateFrontDoor',
            groupId: 'group-1',
            name: 'edge',
            sku: 'Standard_AzureFrontDoor',
          } as never,
        },
        1,
      ).receipt.outcome,
    ).toBe('unsupported');
    for (const model of engine.models.filter((m) => (m as string) !== laboratoryModel)) {
      for (const command of [
        {
          type: 'CreateFrontDoor',
          groupId: 'group-1',
          name: 'edge',
          sku: 'Standard_AzureFrontDoor',
        },
        { type: 'CreatePostgresDatabase', serverId: 'server-1', name: 'appdata', charset: 'UTF8' },
        { type: 'DeleteStorageAccount', accountId: 'account-1' },
        { type: 'DeleteBlobContainer', containerId: 'container-1' },
      ]) {
        const oldWorld = engine.freshWorld(model);
        const result = engine.execute(
          oldWorld,
          { commandId: 'old-unsupported', expectedRevision: 0, command: command as never },
          1,
        );
        expect(result.world).toEqual(oldWorld);
        expect(result.receipt.code).toBe('unsupported-capability');
        expect(result.receipt.outcome).toBe('unsupported');
      }
    }
  });
  it('reserves gateway subnet in both directions against actual NIC/VM and NSG writes atomically', () => {
    const f = fixture(),
      groupId = f.world.groups[0]!.id;
    f.run({
      type: 'CreateVirtualNetwork',
      groupId,
      name: 'network',
      region: 'norwayeast',
      addressSpace: '10.20.0.0/16',
    });
    const vnetId = f.world.vnets[0]!.id;
    for (const [name, addressPrefix] of [
      ['gateway', '10.20.1.0/24'],
      ['occupied', '10.20.2.0/24'],
    ])
      f.run({ type: 'CreateSubnet', vnetId, name: name!, addressPrefix: addressPrefix! });
    const [subnet, occupied] = f.world.subnets;
    f.run({
      type: 'CreateNetworkInterface',
      groupId,
      name: 'existing-nic',
      region: 'norwayeast',
      vnetId,
      subnetId: occupied!.id,
      privateIpAddress: '10.20.2.10',
      allocation: 'Static',
    });
    const old = structuredClone(f.world);
    expect(
      f.run({
        type: 'CreateApplicationGateway',
        groupId,
        name: 'occupied-gateway',
        region: 'norwayeast',
        subnetId: occupied!.id,
        sku: 'Standard_v2',
      }).code,
    ).toBe('incompatible-association');
    expect(f.world).toEqual(old);
    expect(
      f.run({
        type: 'CreateApplicationGateway',
        groupId,
        name: 'private-gateway',
        region: 'norwayeast',
        subnetId: subnet!.id,
        sku: 'Standard_v2',
      }).outcome,
    ).toBe('accepted');
    const before = structuredClone(f.world);
    expect(
      f.run({
        type: 'CreateNetworkInterface',
        groupId,
        name: 'new-nic',
        region: 'norwayeast',
        vnetId,
        subnetId: subnet!.id,
        privateIpAddress: '10.20.1.10',
        allocation: 'Static',
      }).code,
    ).toBe('incompatible-association');
    expect(f.world).toEqual(before);
    expect(
      f.run({
        type: 'CreateVirtualMachine',
        groupId,
        name: 'new-vm',
        region: 'norwayeast',
        image: 'ubuntu-22.04-gen2',
        size: 'Standard_D2s_v4',
        subnetId: subnet!.id,
        privateIpAddress: '10.20.1.10',
        allocation: 'Static',
        nsgId: 'none',
        osDiskSku: 'StandardSSD_LRS',
        osDiskSizeGiB: '128',
      }).code,
    ).toBe('incompatible-association');
    expect(f.world).toEqual(before);
    f.run({ type: 'CreateNetworkSecurityGroup', groupId, name: 'security', region: 'norwayeast' });
    const withNsg = structuredClone(f.world);
    expect(
      f.run({ type: 'AssociateSubnetNsg', subnetId: subnet!.id, nsgId: f.world.nsgs[0]!.id }).code,
    ).toBe('unsupported-profile');
    expect(f.world).toEqual(withNsg);
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('shares plan and application namespaces with Functions in both command directions', () => {
    const f = fixture(),
      groupId = f.world.groups[0]!.id;
    f.run({
      type: 'CreateStorageAccount',
      groupId,
      name: 'functionstorage',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    f.run({
      type: 'CreateBlobContainer',
      accountId: f.world.accounts[0]!.id,
      name: 'deployment',
      access: 'private',
    });
    const create: Command = {
      type: 'CreateFunctionApp',
      groupId,
      name: 'function-app',
      region: 'norwayeast',
      planName: 'function-hosting',
      storageAccountId: f.world.accounts[0]!.id,
      deploymentContainerId: f.world.containers[0]!.id,
      runtime: 'node22',
      publicNetworkAccess: 'Enabled',
    };
    expect(f.run(create).outcome).toBe('accepted');
    const before = structuredClone(f.world);
    expect(f.run(plan(groupId, 'FUNCTION-HOSTING')).code).toBe('duplicate-name');
    expect(f.world).toEqual(before);
    f.run(plan(groupId, 'normal-hosting'));
    expect(
      f.run({
        type: 'CreateWebApp',
        groupId,
        name: 'FUNCTION-APP',
        planId: f.world.plans[0]!.id,
        runtime: 'NODE|24-lts',
        httpsOnly: 'true',
        publicNetworkAccess: 'Enabled',
      }).code,
    ).toBe('duplicate-name');
    expect(f.run({ ...create, name: 'another-function', planName: 'NORMAL-HOSTING' }).code).toBe(
      'duplicate-name',
    );
    f.run({
      type: 'CreateWebApp',
      groupId,
      name: 'normal-app',
      planId: f.world.plans[0]!.id,
      runtime: 'NODE|24-lts',
      httpsOnly: 'true',
      publicNetworkAccess: 'Enabled',
    });
    expect(f.run({ ...create, name: 'NORMAL-APP', planName: 'another-plan' }).code).toBe(
      'duplicate-name',
    );
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('only deletes empty unreferenced Storage resources and preserves Create origin without reusing IDs', () => {
    const f = fixture(),
      groupId = f.world.groups[0]!.id;
    f.run({
      type: 'CreateStorageAccount',
      groupId,
      name: 'functionstorage',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    const account = f.world.accounts[0]!;
    f.run({
      type: 'CreateBlobContainer',
      accountId: account.id,
      name: 'deployment',
      access: 'private',
    });
    const container = f.world.containers[0]!;
    const fn: Command = {
      type: 'CreateFunctionApp',
      groupId,
      name: 'storage-function',
      region: 'norwayeast',
      planName: 'storage-plan',
      storageAccountId: account.id,
      deploymentContainerId: container.id,
      runtime: 'node22',
      publicNetworkAccess: 'Enabled',
    };
    f.run(fn);
    const before = structuredClone(f.world);
    expect(f.run({ type: 'DeleteBlobContainer', containerId: container.id }).code).toBe(
      'resource-in-use',
    );
    expect(f.run({ type: 'DeleteStorageAccount', accountId: account.id }).code).toBe(
      'resource-in-use',
    );
    expect(f.world).toEqual(before);
    f.run({ type: 'DeleteFunctionApp', appId: f.world.data.functionApps[0]!.id });
    const through = f.entries.length,
      nextId = f.world.nextId;
    expect(
      f.run({ type: 'DeleteBlobContainer', containerId: container.id }).integrationChange,
    ).toMatchObject({ id: container.id, createOrigin: container.origin, after: null });
    expect(f.run({ type: 'DeleteStorageAccount', accountId: account.id }).outcome).toBe('accepted');
    expect(f.world.nextId).toBe(nextId);
    expect(replay(f.entries, through)?.containers[0]).toEqual(container);
    expect(replay(f.entries)).toEqual(f.world);
    const old = frozen.freshWorld();
    expect(
      frozen.execute(
        old,
        {
          commandId: 'old-storage-delete',
          expectedRevision: 0,
          command: { type: 'DeleteStorageAccount', accountId: account.id } as never,
        },
        1,
      ).receipt.code,
    ).toBe('unsupported-capability');
    f.run({
      type: 'CreateStorageAccount',
      groupId,
      name: 'nonemptystorage',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    f.run({
      type: 'CreateBlobContainer',
      accountId: f.world.accounts[0]!.id,
      name: 'content',
      access: 'private',
    });
    f.run({
      type: 'CreateTextBlob',
      containerId: f.world.containers[0]!.id,
      name: 'sample.txt',
      text: 'synthetic',
      contentType: 'text/plain',
    });
    const populated = structuredClone(f.world);
    expect(
      f.run({ type: 'DeleteBlobContainer', containerId: f.world.containers[0]!.id }).code,
    ).toBe('resource-in-use');
    expect(f.world).toEqual(populated);
  });
  it('rejects empty and reordered unknown Storage lifecycle keys before deletion with deterministic original receipts', () => {
    const f = fixture(),
      groupId = f.world.groups[0]!.id;
    f.run({
      type: 'CreateStorageAccount',
      groupId,
      name: 'emptyaccount',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    const accountId = f.world.accounts[0]!.id;
    f.run({
      type: 'CreateStorageAccount',
      groupId,
      name: 'containeraccount',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    f.run({
      type: 'CreateBlobContainer',
      accountId: f.world.accounts[1]!.id,
      name: 'empty-container',
      access: 'private',
    });
    const before = structuredClone(f.world);
    for (const command of [
      { type: 'DeleteStorageAccount', accountId },
      { type: 'DeleteBlobContainer', containerId: f.world.containers[0]!.id },
    ]) {
      for (const extra of [
        { '': 'unknown' },
        { z: 'unknown', a: 'unknown' },
        { a: 'unknown', z: 'unknown' },
      ]) {
        const result = f.run({ ...command, ...extra } as Command);
        expect(result).toMatchObject({
          outcome: 'unsupported',
          code: 'unsupported-field',
          field: Object.hasOwn(extra, '') ? '' : 'a',
          addedIds: [],
          removedIds: [],
          updatedIds: [],
        });
        expect(f.world).toEqual(before);
      }
      const request = {
        commandId: 'same-shape',
        expectedRevision: before.revision,
        command: { ...command, z: 'unknown', a: 'unknown' } as unknown as Command,
      };
      expect(execute(before, request, 1).receipt).toEqual(
        execute(
          before,
          { ...request, command: { a: 'unknown', z: 'unknown', ...command } as unknown as Command },
          1,
        ).receipt,
      );
    }
    expect(replay(JSON.parse(canonical(f.entries)))).toEqual(before);
  });
  it('enforces one96 resource budget for data, delivery and inherited writes without consuming denied IDs', () => {
    const f = fixture(),
      groupId = f.world.groups[0]!.id;
    for (let i = 0; i < 8; i++) f.run(plan(groupId, `plan-${i}`));
    for (let i = 0; i < 12; i++)
      f.run({
        type: 'CreateWebApp',
        groupId,
        name: `budget-app-${i}`,
        planId: f.world.plans[0]!.id,
        runtime: 'NODE|24-lts',
        httpsOnly: 'true',
        publicNetworkAccess: 'Enabled',
      });
    for (let i = 0; i < 24; i++)
      f.run({
        type: 'DeploySyntheticApplication',
        webAppId: f.world.webApps[0]!.id,
        template: 'api',
        healthPath: '/health',
        responseStatus: '200',
      });
    for (let i = 0; i < 32; i++)
      f.run({
        type: 'SetWebAppSetting',
        webAppId: f.world.webApps[0]!.id,
        name: `SYNTHETIC_${i}`,
        value: 'fixture',
      });
    for (let i = 0; i < 4; i++)
      f.run({
        type: 'CreatePostgresServer',
        groupId,
        name: `budget-server-${i}`,
        region: 'norwayeast',
        version: '16',
        sku: 'Standard_B1ms',
        storageGiB: '32',
        publicNetworkAccess: 'Enabled',
      });
    for (let i = 0; i < 8; i++)
      f.run({
        type: 'CreatePostgresDatabase',
        serverId: f.world.data.postgresServers[0]!.id,
        name: `budget_${i}`,
        charset: 'UTF8',
      });
    for (let i = 0; i < 4; i++)
      f.run({
        type: 'CreateFrontDoor',
        groupId,
        name: `budget-edge-${i}`,
        sku: 'Standard_AzureFrontDoor',
      });
    for (let i = 0; i < 3; i++)
      f.run({
        type: 'CreateFrontDoorEndpoint',
        profileId: f.world.delivery.frontDoors[0]!.id,
        name: `budget-endpoint-${i}`,
        enabled: 'true',
      });
    expect(f.entries.every((e) => e.receipt.outcome === 'accepted')).toBe(true);
    expect(resources(f.world)).toHaveLength(96);
    const before = structuredClone(f.world);
    expect(
      f.run({
        type: 'CreateStorageAccount',
        groupId,
        name: 'overbudget',
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      }).code,
    ).toBe('capacity');
    expect(
      f.run({
        type: 'CreateSqlServer',
        groupId,
        name: 'over-budget',
        region: 'norwayeast',
        version: '12.0',
        publicNetworkAccess: 'Enabled',
      }).code,
    ).toBe('capacity');
    expect(
      f.run({
        type: 'CreateFrontDoorEndpoint',
        profileId: f.world.delivery.frontDoors[0]!.id,
        name: 'over-budget',
        enabled: 'true',
      }).code,
    ).toBe('capacity');
    expect(f.world).toEqual(before);
    expect(replay(f.entries)).toEqual(before);
  });
});
