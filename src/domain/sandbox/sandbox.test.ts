import { describe, expect, it } from 'vitest';
import { execute as legacyExecute, freshEngine as legacyFresh } from '../chapter01/model';
import { freshAttempt, applyEvent } from '../chapter01/scenario';
import { chapterKey, snapshotOf } from '../chapter01/persistence';
import { continueEngine, execute, freshEngine, type Engine } from './model';
import { replayEngine } from './replay';
import { SandboxStore, sandboxKey, restoreSandbox } from './store';
const group = {
  type: 'CreateGroup',
  subscriptionId: 'sub-app',
  name: 'rg-learning-dev',
  metadataRegion: 'norwayeast',
};
const vm = {
  type: 'CreateVmBundle',
  groupId: 'group-1',
  name: 'vm-learning',
  region: 'northeurope',
  image: 'ubuntu-22-04',
  profile: 'small',
  dataDiskGiB: '32',
  subnetId: '',
};
function send(e: Engine, command: Record<string, string>, id = `c-${e.ledger.length}`) {
  return execute(e, { commandId: id, expectedWorldRevision: e.world.revision, command });
}
const fixture = () => send(freshEngine(), group).engine;
describe('versioned shared sandbox', () => {
  it('distinguishes an unsupported cross-group topology from invalid cross-subscription/region references', () => {
    let e = send(fixture(), vm).engine;
    const subnetId = e.world.infrastructure.find((r) => r.kind === 'subnet')!.id;
    e = send(e, { ...group, name: 'rg-second' }).engine;
    const target = e.world.groups.at(-1)!.id;
    const unsupported = send(e, { ...vm, name: 'vm-cross', groupId: target, subnetId });
    expect(unsupported.receipt.outcome).toBe('unsupported');
    expect(unsupported.engine.world).toBe(e.world);
    expect(send(e, { ...vm, name: 'vm-region', region: 'westeurope', subnetId }).receipt.code).toBe(
      'invalid-region',
    );
    e = send(e, { ...group, name: 'rg-shared', subscriptionId: 'sub-shared' }).engine;
    expect(
      send(e, { ...vm, name: 'vm-sub', groupId: e.world.groups.at(-1)!.id, subnetId }).receipt.code,
    ).toBe('invalid-parent');
  });
  it('creates an atomic persisted VM dependency set independently of group metadata and Web policy', () => {
    const e = fixture(),
      r = send(e, vm);
    expect(r.receipt.outcome).toBe('accepted');
    expect(r.receipt.addedIds).toHaveLength(6);
    expect(r.engine.world.infrastructure).toHaveLength(6);
    expect(r.engine.world.groups[0]?.metadataLocation).toBe('norwayeast');
    expect(r.engine.world.infrastructure.every((r) => r.location === 'northeurope')).toBe(true);
    expect(replayEngine(r.engine)?.world).toEqual(r.engine.world);
  });
  it.each([
    { groupId: 'absent' },
    { name: 'BAD' },
    { region: 'moon' },
    { image: 'arbitrary' },
    { profile: 'unlimited' },
    { dataDiskGiB: '7' },
    { subnetId: 'missing' },
  ])('rejects invalid bundles atomically: %j', (change) => {
    const e = fixture(),
      r = send(e, { ...vm, ...change });
    expect(r.receipt.outcome).not.toBe('accepted');
    expect(r.engine.world).toBe(e.world);
    expect(r.receipt.addedIds).toEqual([]);
  });
  it('rejects duplicate resource names and whole-object capacity without partial allocations', () => {
    const initial = send(fixture(), vm).engine;
    expect(send(initial, vm).receipt.code).toBe('duplicate-name');
    let full = fixture();
    for (let i = 0; i < 87; i++)
      full = send(full, {
        type: 'CreatePlan',
        groupId: 'group-1',
        name: `plan-fill-${i}`,
        region: 'westeurope',
        profile: 'linux-learning-v1',
      }).engine;
    const r = send(full, vm);
    expect(r.receipt.code).toBe('capacity');
    expect(r.engine.world).toBe(full.world);
    expect(r.receipt.addedIds).toEqual([]);
  });
  it('validates subnet references, preserves shared network on cleanup and prevents nonempty group deletion', () => {
    let e = send(fixture(), vm).engine;
    const subnet = e.world.infrastructure.find((r) => r.kind === 'subnet')!;
    e = send(e, { ...vm, name: 'vm-second', subnetId: subnet.id }).engine;
    expect(e.world.infrastructure).toHaveLength(10);
    expect(send(e, { type: 'DeleteEmptyGroup', groupId: 'group-1' }).receipt.outcome).toBe(
      'unsupported',
    );
    const first = e.world.infrastructure.find((r) => r.kind === 'vm')!;
    e = send(e, { type: 'DeleteVmBundle', vmId: first.id }).engine;
    expect(e.world.infrastructure.some((r) => r.id === subnet.id)).toBe(true);
    expect(e.world.infrastructure.filter((r) => r.kind === 'vm')).toHaveLength(1);
  });
  it('suppresses duplicate delivery, rejects conflict/stale/unsupported without mutation and enforces whole capacity', () => {
    const e = fixture(),
      req = { commandId: 'vm-create', expectedWorldRevision: e.world.revision, command: vm },
      a = execute(e, req);
    expect(execute(a.engine, req).engine).toBe(a.engine);
    expect(execute(a.engine, { ...req, command: { ...vm, name: 'other' } }).receipt.code).toBe(
      'command-id-conflict',
    );
    expect(execute(a.engine, { ...req, commandId: 'stale' }).receipt.code).toBe('stale-revision');
    expect(send(e, { type: 'RunScript' }).receipt.outcome).toBe('unsupported');
    let full = e;
    for (let i = 0; i < 8; i++) full = send(full, { ...vm, name: `vm-test-${i}` }).engine;
    const rejected = send(full, { ...vm, name: 'vm-over-limit' });
    expect(rejected.receipt.code).toBe('capacity');
    expect(rejected.engine.world).toBe(full.world);
  });
  it('persists real app settings without resources/runtime effects and retains hosting rejection', () => {
    let e = fixture();
    expect(
      send(e, { type: 'CreateWebApp', groupId: 'group-1', name: 'app-missing', planId: 'absent' })
        .receipt.code,
    ).toBe('missing-plan');
    expect(
      send(e, {
        type: 'CreatePlan',
        groupId: 'group-1',
        name: 'plan-denied',
        region: 'northeurope',
        profile: 'linux-learning-v1',
      }).receipt.code,
    ).toBe('policy-location-denied');
    e = send(e, {
      type: 'CreatePlan',
      groupId: 'group-1',
      name: 'plan-valid',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    }).engine;
    e = send(e, {
      type: 'CreateWebApp',
      groupId: 'group-1',
      name: 'app-valid',
      planId: 'plan-2',
    }).engine;
    const command = {
        type: 'SetAppSettings',
        appId: 'app-3',
        environment: 'staging',
        catalogMode: 'read-only',
      },
      updated = send(e, command);
    expect(updated.receipt.code).toBe('updated');
    expect(updated.receipt.addedIds).toEqual([]);
    expect(updated.engine.world.appSettings[0]).toEqual({
      appId: 'app-3',
      environment: 'staging',
      catalogMode: 'read-only',
    });
    expect(send(e, { ...command, environment: 'secret-script' }).engine.world).toBe(e.world);
    expect(replayEngine(updated.engine)?.world).toEqual(updated.engine.world);
  });
  it('preserves exact old receipts at migration, including old capacity and rejected inputs', () => {
    let e = legacyFresh();
    for (let i = 0; i < 4; i++)
      e = legacyExecute(e, {
        commandId: `legacy-${i}`,
        expectedWorldRevision: e.world.revision,
        command: { ...group, name: `rg-${i}` },
      }).engine;
    const next = continueEngine(e),
      r = send(next, { ...group, name: 'rg-next' });
    expect(r.receipt.outcome).toBe('accepted');
    expect(r.engine.ledger.slice(0, 4)).toEqual(e.ledger);
    expect(replayEngine(r.engine)).not.toBeNull();
    const tamper = structuredClone(r.engine);
    tamper.ledger[0]!.receipt.afterCount++;
    expect(replayEngine(tamper)).toBeNull();
  });
});
describe('sandbox migration and defensive persistence', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      data,
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
  };
  it('imports and leaves v1 bytes intact, replays new work and archives explicit reset', () => {
    const port = memory();
    const old = applyEvent(freshAttempt(), {
      kind: 'command',
      bindResult: false,
      request: { commandId: 'old-one', expectedWorldRevision: 0, command: group },
    })!;
    const raw = JSON.stringify(snapshotOf(old, 1, 7));
    port.setItem(chapterKey, raw);
    const store = new SandboxStore(port);
    store.load();
    expect(store.getSnapshot().attemptNumber).toBe(7);
    store.dispatch({
      kind: 'command',
      request: { commandId: 'new-vm', expectedWorldRevision: 1, command: vm },
    });
    expect(port.getItem(chapterKey)).toBe(raw);
    const loaded = new SandboxStore(port);
    loaded.load();
    expect(loaded.getSnapshot().attempt.engine.world.infrastructure).toHaveLength(6);
    loaded.restart();
    expect(loaded.engineFor(7)?.world.infrastructure).toHaveLength(6);
    expect(loaded.engineFor(8)?.world.infrastructure).toHaveLength(0);
    expect(loaded.getSnapshot().attemptNumber).toBe(8);
    expect(restoreSandbox(port.getItem(sandboxKey)!).save.archive).toHaveLength(1);
    expect(port.getItem(chapterKey)).toBe(raw);
  });
  it('quarantines malformed/unknown state and detects cross-tab writes', () => {
    for (const raw of ['{', '{"schema":77}', '{"schema":2,"model":"sandbox@2.0.0"}']) {
      const p = memory();
      p.setItem(sandboxKey, raw);
      const s = new SandboxStore(p);
      s.load();
      expect(s.getSnapshot().issue).not.toBeNull();
      expect(s.dispatch({})).toBe(false);
      expect(p.getItem(sandboxKey)).toBe(raw);
    }
    const p = memory(),
      a = new SandboxStore(p),
      b = new SandboxStore(p);
    a.load();
    b.load();
    a.dispatch({
      kind: 'command',
      request: { commandId: 'a', expectedWorldRevision: 0, command: group },
    });
    b.dispatch({
      kind: 'command',
      request: { commandId: 'b', expectedWorldRevision: 0, command: group },
    });
    expect(b.getSnapshot().issue).toBe('conflict');
  });
  it('reports denied writes without inventing durable progress', () => {
    const p = {
      getItem: () => null,
      setItem: () => {
        throw Error('denied');
      },
      removeItem: () => {},
    };
    const s = new SandboxStore(p);
    s.load();
    s.dispatch({
      kind: 'command',
      request: { commandId: 'memory', expectedWorldRevision: 0, command: group },
    });
    expect(s.getSnapshot().issue).toBe('unsaved');
    expect(s.getSnapshot().attempt.engine.world.groups).toHaveLength(1);
  });
});
