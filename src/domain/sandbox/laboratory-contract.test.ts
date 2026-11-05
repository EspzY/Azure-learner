import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { execute as legacyExecute, freshEngine as legacyFresh } from '../chapter01/model';
import {
  continueEngine,
  execute,
  infrastructureRelations,
  type Command,
  type Engine,
} from './model';
import { replayEngine } from './replay';
import { SandboxStore, sandboxKey, type StoragePort } from './store';
import { inventory, projectArchitecture, reviewCommand } from '../portal/model';
import { receiptReferences, resourceOperations } from '../portal/inspection';
import { vmChain } from './missions';
import golden from '../../../docs/reviews/evidence/laboratory-stage0/command-golden.json';
import preservation from '../../../docs/reviews/evidence/laboratory-stage0/preservation.json';

// JSON imports widen discriminants; the tests below validate actual replay and every receipt.
const original = () => structuredClone(golden.engine) as unknown as Engine;
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function memory(): StoragePort & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}
const group: Command = {
  type: 'CreateGroup',
  subscriptionId: 'sub-shared',
  name: 'rg-contract',
  metadataRegion: 'norwayeast',
};
const dispatchGroup = (store: SandboxStore, id = 'same-id') =>
  store.dispatch({
    kind: 'command',
    request: { commandId: id, expectedWorldRevision: 0, command: group },
  });

describe('Laboratory Stage 0: authoritative existing platform contract', () => {
  it('pins all 169 historical domain files to the verified base', () => {
    expect(Object.keys(preservation.files)).toHaveLength(1875);
    // Whole-repository hashes are delivery evidence. Keep the recurring unit
    // guard focused on frozen technical/assessment semantics rather than images/docs/UI.
    const contracts = Object.entries(preservation.files).filter(([path]) =>
      path.startsWith('src/domain/'),
    );
    expect(contracts).toHaveLength(169);
    for (const [path, expected] of contracts) {
      expect(createHash('sha256').update(readFileSync(path)).digest('hex'), path).toBe(expected);
    }
  });

  it('reproduces all seven command families and original denied receipts across the frozen prefix', () => {
    const supported: Record<Command['type'], true> = {
      CreateGroup: true,
      DeleteEmptyGroup: true,
      CreatePlan: true,
      CreateWebApp: true,
      CreateVmBundle: true,
      DeleteVmBundle: true,
      SetAppSettings: true,
    };
    const expected = freeze(original());
    let old = legacyFresh();
    for (const entry of expected.ledger.slice(0, expected.prefix)) {
      const next = legacyExecute(old, entry.request);
      expect(next.receipt).toEqual(entry.receipt);
      old = next.engine;
    }
    let current = continueEngine(old);
    const seen = new Set<string>();
    for (const entry of expected.ledger.slice(expected.prefix)) {
      const next = execute(current, entry.request);
      expect(next.receipt).toEqual(entry.receipt);
      if (next.receipt.outcome === 'accepted') seen.add(next.receipt.operation);
      current = next.engine;
    }
    expect([...seen].sort()).toEqual(Object.keys(supported).sort());
    expect(current).toEqual(expected);
    expect(current.ledger.slice(0, current.prefix)).toEqual(old.ledger);
  });

  it('verifies every captured historical continuation World without consulting the current inventory', () => {
    const source = freeze(original());
    const before = JSON.stringify(source);
    golden.continuationWorlds.forEach((world, offset) => {
      expect(replayEngine(source, source.prefix + offset)?.world).toEqual(world);
    });
    expect(JSON.stringify(source)).toBe(before);
    expect(replayEngine(source)).toEqual(source);
    const tamperedReceipt = original();
    tamperedReceipt.ledger[8]!.receipt.afterCount++;
    expect(replayEngine(tamperedReceipt, 9)).toBeNull();
    const laterWorld = original();
    laterWorld.world.groups = [];
    expect(replayEngine(laterWorld)).toBeNull();
    expect(replayEngine(laterWorld, 8)?.world).toEqual(golden.continuationWorlds[4]);
    for (const invalid of [-1, 0.5, Number.NaN, source.ledger.length + 1])
      expect(replayEngine(source, invalid)).toBeNull();
  });

  it('keeps a future Storage command unsupported under sandbox@2 rather than reinterpreting history', () => {
    const source = original(),
      entry = source.ledger.at(-1)!;
    expect(entry.request.command.type).toBe('CreateStorageAccount');
    expect(entry.receipt).toMatchObject({
      outcome: 'unsupported',
      code: 'unsupported-capability',
      addedIds: [],
      removedIds: [],
    });
    expect(entry.receipt.afterRevision).toBe(entry.receipt.beforeRevision);
    const prior = replayEngine(source, source.ledger.length - 1) as Engine;
    expect(execute(prior, entry.request).receipt).toEqual(entry.receipt);
    expect(replayEngine(source)?.world).toEqual(prior.world);
  });

  it('derives Portal rows, dependency edges and original evidence from the same replayed VM World', () => {
    const source = freeze(replayEngine(original(), 8) as Engine);
    const before = JSON.stringify(source),
      chain = vmChain(source.world, 'vm-6')!;
    expect(chain).not.toBeNull();
    const rows = inventory(source.world),
      graph = projectArchitecture(source.world);
    for (const resource of [chain.vm, chain.os, chain.data!, chain.nic, chain.subnet, chain.vnet]) {
      expect(rows.find((row) => row.id === resource.id)).toMatchObject({
        id: resource.id,
        groupId: resource.groupId,
        location: resource.location,
        subscriptionId: 'sub-shared',
      });
      expect(graph.nodes.some((node) => node.id === resource.id)).toBe(true);
    }
    expect(infrastructureRelations(source.world)).toContainEqual({
      kind: 'subnet-member',
      from: chain.nic.id,
      to: chain.subnet.id,
    });
    const operation = resourceOperations(source, chain.vm.id).find(
      (item) => item.basis === 'resource',
    )!;
    expect(operation.entry).toBe(source.ledger[7]);
    expect(
      receiptReferences(source, operation.entry)
        .filter((ref) => ref.added)
        .map((ref) => ref.id),
    ).toEqual(operation.entry.receipt.addedIds);
    expect(vmChain(original().world, chain.vm.id)).toBeNull();
    expect(JSON.stringify(source)).toBe(before);
  });

  it('retains a reused network after both bundle owners are removed; origin is not a live dependency', () => {
    const source = original(),
      world = source.world;
    expect(world.infrastructure.filter((resource) => resource.kind === 'vm')).toEqual([]);
    expect(world.infrastructure.map((resource) => resource.kind).sort()).toEqual([
      'subnet',
      'vnet',
    ]);
    expect(world.infrastructure.every((resource) => resource.origin === 'vm-6')).toBe(true);
    const denied = execute(source, {
      commandId: 'retained-network',
      expectedWorldRevision: world.revision,
      command: { type: 'DeleteEmptyGroup', groupId: 'group-5' },
    });
    expect(denied.receipt.code).toBe('cascade-delete-unsupported');
    expect(denied.engine.world).toBe(world);
  });

  it('distinguishes a review fork and transient delivery errors from original ledger evidence', () => {
    const engine = freeze(original()),
      before = JSON.stringify(engine);
    expect(reviewCommand(engine, { ...group, name: 'rg-reviewed' }, 900).outcome).toBe('accepted');
    expect(JSON.stringify(engine)).toBe(before);
    const last = engine.ledger.at(-1)!;
    expect(execute(engine, last.request)).toEqual({ engine, receipt: last.receipt });
    const conflict = execute(engine, { ...last.request, command: group });
    expect(conflict.engine).toBe(engine);
    expect(conflict.receipt.code).toBe('command-id-conflict');
    expect(
      execute(engine, { commandId: 'invalid', expectedWorldRevision: -1, command: group }).engine,
    ).toBe(engine);
    const stale = execute(engine, {
      commandId: 'stale-contract',
      expectedWorldRevision: 0,
      command: group,
    });
    expect(stale.engine.world).toBe(engine.world);
    expect(stale.engine.ledger.at(-1)?.receipt.code).toBe('stale-revision');
    expect(stale.engine.ledger).toHaveLength(engine.ledger.length + 1);
  });

  it('rejects extra, missing and non-string command fields before making any atomic World change', () => {
    const engine = freeze(original());
    for (const command of [
      { ...group, credentials: 'not-supported' },
      { type: 'CreateGroup' },
      { ...group, name: 123 },
    ]) {
      const result = execute(engine, {
        commandId: 'bad-fields',
        expectedWorldRevision: engine.world.revision,
        command,
      });
      expect(result.receipt.outcome).not.toBe('accepted');
      expect(result.engine.world).toBe(engine.world);
      expect(result.receipt.addedIds).toEqual([]);
    }
  });

  it('does not treat memory-only accepted dispatch as a durable technical result', () => {
    const port = memory();
    port.setItem = () => {
      throw Error('denied');
    };
    const store = new SandboxStore(port);
    store.load();
    expect(dispatchGroup(store)).toBe(true); // Existing best-effort API, not a commit receipt.
    expect(store.getSnapshot().issue).toBe('unsaved');
    expect(store.getSnapshot().attempt.engine.ledger[0]?.receipt.outcome).toBe('accepted');
    expect(port.getItem(sandboxKey)).toBeNull();
    const reloaded = new SandboxStore(port);
    reloaded.load();
    expect(reloaded.getSnapshot().attempt.engine.ledger).toEqual([]);
  });

  it('keeps responses-only delivery conflicts out of persisted evidence and blocks a stale tab', () => {
    const port = memory(),
      a = new SandboxStore(port),
      b = new SandboxStore(port);
    a.load();
    b.load();
    expect(dispatchGroup(a)).toBe(true);
    const raw = port.getItem(sandboxKey),
      ledger = a.getSnapshot().attempt.engine.ledger;
    expect(
      a.dispatch({
        kind: 'command',
        request: { ...ledger[0]!.request, command: { ...group, name: 'rg-conflict' } },
      }),
    ).toBe(true);
    expect(a.getSnapshot().attempt.responses.at(-1)?.code).toBe('command-id-conflict');
    expect(a.getSnapshot().attempt.engine.ledger).toBe(ledger);
    expect(port.getItem(sandboxKey)).toBe(raw);
    expect(dispatchGroup(b, 'stale-tab')).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    expect(port.getItem(sandboxKey)).toBe(raw);
  });

  it('scopes reused resource and command IDs by attempt and never invents evicted historical evidence', () => {
    const port = memory();
    port.data.set('azurelab.portal.learning.v1', 'historical-assessment-sentinel');
    port.data.set('azurelab.practical-missions.v1', 'historical-mission-sentinel');
    const store = new SandboxStore(port);
    store.load();
    dispatchGroup(store);
    const first = structuredClone(store.getSnapshot().attempt.engine);
    expect(store.restart()).toBe(true);
    dispatchGroup(store);
    expect(store.getSnapshot().attempt.engine.ledger[0]!.receipt.addedIds).toEqual(
      first.ledger[0]!.receipt.addedIds,
    );
    expect(store.engineFor(1)).toEqual(first);
    expect(store.restart()).toBe(true);
    expect(store.engineFor(1)).toBeUndefined();
    expect(store.engineFor(2)).toBeDefined();
    const reloaded = new SandboxStore(port);
    reloaded.load();
    expect(reloaded.engineFor(1)).toBeUndefined();
    expect(port.getItem('azurelab.portal.learning.v1')).toBe('historical-assessment-sentinel');
    expect(port.getItem('azurelab.practical-missions.v1')).toBe('historical-mission-sentinel');
    const saved = JSON.parse(port.getItem(sandboxKey)!);
    saved.archive[0].commands[0].commandId = '?invalid';
    const corrupt = JSON.stringify(saved);
    port.setItem(sandboxKey, corrupt);
    const rejected = new SandboxStore(port);
    rejected.load();
    expect(rejected.getSnapshot().issue).toBe('corrupt');
    expect(dispatchGroup(rejected)).toBe(false);
    expect(port.getItem(sandboxKey)).toBe(corrupt);
  });
});
