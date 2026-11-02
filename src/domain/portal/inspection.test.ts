import { describe, it, expect } from 'vitest';
import { freshEngine, execute, infrastructure, type Command } from '../sandbox/model';
import { parseLocation, portalHref } from './model';
import {
  inspectionChoices,
  inspectionHref,
  resourceOperations,
  requestConfiguration,
  receiptReferences,
} from './inspection';
function fixture() {
  let engine = freshEngine(),
    seq = 0;
  const commit = (command: Command) => {
    const result = execute(engine, {
      commandId: `inspect-${++seq}`,
      expectedWorldRevision: engine.world.revision,
      command,
    });
    engine = result.engine;
    return result.receipt;
  };
  commit({
    type: 'CreateGroup',
    name: 'rg-inspection',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
  });
  const groupId = engine.world.groups[0]!.id;
  const denied = commit({
    type: 'CreatePlan',
    groupId,
    name: 'plan-denied',
    region: 'northeurope',
    profile: 'linux-learning-v1',
  });
  commit({
    type: 'CreatePlan',
    groupId,
    name: 'plan-inspection',
    region: 'westeurope',
    profile: 'linux-learning-v1',
  });
  const planId = engine.world.resources[0]!.id;
  commit({ type: 'CreateWebApp', groupId, name: 'app-inspection', planId });
  commit({
    type: 'CreateVmBundle',
    groupId,
    name: 'vm-inspection',
    region: 'norwayeast',
    image: 'ubuntu-22-04',
    profile: 'small',
    dataDiskGiB: '32',
    subnetId: '',
  });
  return {
    get engine() {
      return engine;
    },
    commit,
    groupId,
    planId,
    denied,
  };
}
describe('PR01 Stage A original World and ledger projections', () => {
  it('selects only actual VM, Web App and Policy-denial targets without creating evidence', () => {
    const f = fixture(),
      raw = JSON.stringify(f.engine);
    expect(inspectionChoices(f.engine, 'vm').map((x) => x.name)).toEqual(['vm-inspection']);
    expect(inspectionChoices(f.engine, 'app').map((x) => x.name)).toEqual(['app-inspection']);
    expect(inspectionChoices(f.engine, 'policy').map((x) => x.id)).toEqual([f.denied.commandId]);
    expect(f.denied).toMatchObject({
      beforeRevision: 1,
      afterRevision: 1,
      addedIds: [],
      outcome: 'rejected',
      code: 'policy-location-denied',
    });
    expect(f.engine.world.resources.some((r) => r.name === 'plan-denied')).toBe(false);
    expect(JSON.stringify(f.engine)).toBe(raw);
  });
  it('separates direct resource evidence, dependency references and scoped operations', () => {
    const f = fixture(),
      app = f.engine.world.resources.find((r) => r.name === 'app-inspection')!;
    expect(resourceOperations(f.engine, app.id)).toHaveLength(1);
    expect(resourceOperations(f.engine, f.planId).map((x) => x.basis)).toEqual([
      'resource',
      'reference',
    ]);
    expect(
      resourceOperations(f.engine, f.groupId).find(
        (x) => x.entry.receipt.commandId === f.denied.commandId,
      )?.basis,
    ).toBe('scope');
    const vm = infrastructure(f.engine.world).find((r) => r.kind === 'vm')!;
    expect(resourceOperations(f.engine, vm.id).every((x) => x.basis === 'resource')).toBe(true);
    expect(resourceOperations(f.engine, 'not-a-resource')).toEqual([]);
    expect(resourceOperations(f.engine, '')).toEqual([]);
  });
  it('includes actual descendant scope operations and preserves ancestry of a deleted empty group', () => {
    const f = fixture(),
      initial = f.engine.ledger.length;
    expect(resourceOperations(f.engine, 'sub-app')).toHaveLength(initial);
    f.commit({
      type: 'CreateGroup',
      name: 'rg-other-scope',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    });
    const group = f.engine.world.groups.find((g) => g.name === 'rg-other-scope')!;
    f.commit({ type: 'DeleteEmptyGroup', groupId: group.id });
    expect(resourceOperations(f.engine, 'sub-app')).toHaveLength(initial);
    expect(resourceOperations(f.engine, 'sub-shared')).toHaveLength(2);
    expect(f.engine.world.groups.some((g) => g.id === group.id)).toBe(false);
  });
  it('retains original receipts after deletion while refusing to invent a current object', () => {
    const f = fixture(),
      vm = infrastructure(f.engine.world).find((r) => r.kind === 'vm')!;
    const original = f.engine.ledger.at(-1)!,
      saved = JSON.stringify(original);
    f.commit({ type: 'DeleteVmBundle', vmId: vm.id });
    const refs = receiptReferences(f.engine, original);
    expect(refs.find((x) => x.id === vm.id)).toMatchObject({
      row: undefined,
      added: true,
      removed: false,
    });
    expect(resourceOperations(f.engine, vm.id)).toHaveLength(2);
    expect(inspectionChoices(f.engine, 'vm')).toEqual([]);
    expect(JSON.stringify(original)).toBe(saved);
  });
  it('projects changed current settings separately from the immutable submitted request', () => {
    const f = fixture(),
      app = f.engine.world.resources.find((r) => r.name === 'app-inspection')!;
    f.commit({
      type: 'SetAppSettings',
      appId: app.id,
      environment: 'staging',
      catalogMode: 'read-only',
    });
    const first = f.engine.ledger.at(-1)!;
    f.commit({
      type: 'SetAppSettings',
      appId: app.id,
      environment: 'production',
      catalogMode: 'standard',
    });
    expect(first.request.command.environment).toBe('staging');
    expect(f.engine.world.appSettings.find((s) => s.appId === app.id)?.environment).toBe(
      'production',
    );
    expect(receiptReferences(f.engine, first).find((x) => x.id === app.id)?.row?.name).toBe(
      'app-inspection',
    );
    expect(resourceOperations(f.engine, app.id)).toHaveLength(3);
  });
  it('keeps existing native origins and view/history context across serialized navigation', () => {
    for (const [context, flag] of [
      ['vm', 'compute'],
      ['policy', 'governance'],
      ['app', 'tools'],
    ] as const) {
      const href = inspectionHref(context, 'subject-1'),
        loc = parseLocation(new URL(href, 'https://local.test').searchParams);
      expect(loc[flag]).toBe(true);
      expect(loc.id).toBe('subject-1');
      const properties = portalHref(loc, 'resource', { id: 'child-2', view: 'properties' });
      const reload = parseLocation(new URL(properties, 'https://local.test').searchParams);
      expect(reload.view).toBe('properties');
      expect(reload[flag]).toBe(true);
      const activity = parseLocation(
        new URL(
          portalHref(reload, 'activity', { resource: 'child-2', id: 'inspect-1' }),
          'https://local.test',
        ).searchParams,
      );
      expect(activity.resource).toBe('child-2');
      expect(activity.view).toBeUndefined();
      expect(
        parseLocation(
          new URL(portalHref(activity, 'resource', { id: 'child-3' }), 'https://local.test')
            .searchParams,
        ).resource,
      ).toBeUndefined();
    }
  });
  it('renders only supported scalar request fields without exposing unknown input or mutating receipts', () => {
    const f = fixture(),
      original = f.engine.ledger.at(-1)!;
    const entry = {
      ...original,
      request: {
        ...original.request,
        command: {
          ...original.request.command,
          password: 'not-a-real-secret',
          opaque: 42,
        },
      },
    };
    const raw = JSON.stringify(entry);
    expect(requestConfiguration(entry).map(([key]) => key)).not.toContain('password');
    expect(requestConfiguration(entry).map(([key]) => key)).not.toContain('opaque');
    expect(requestConfiguration(entry)).toContainEqual(['name', 'vm-inspection']);
    expect(JSON.stringify(entry)).toBe(raw);
  });
  it('rejects unsupported view and external/resource query values without commands', () => {
    expect(
      parseLocation(new URLSearchParams('area=resource&id=https://evil.test&view=cpu')).id,
    ).toBe('');
    expect(parseLocation(new URLSearchParams('area=resource&view=cpu')).view).toBeUndefined();
    expect(
      parseLocation(new URLSearchParams('area=activity&resource=../../outside')).resource,
    ).toBeUndefined();
    expect(
      parseLocation(new URLSearchParams('area=create&view=properties&resource=vm-1')).view,
    ).toBeUndefined();
  });
});
