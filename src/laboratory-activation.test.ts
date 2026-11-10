import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chapterKey, snapshotOf } from './domain/chapter01/persistence';
import { applyEvent, freshAttempt } from './domain/chapter01/scenario';
import { SandboxStore, sandboxKey, type StoragePort } from './domain/sandbox/store';
import { replayEngine } from './domain/sandbox/replay';
import {
  activateCandidate,
  inspectCandidate,
  prepareCandidate,
  probeKey,
} from '../tests/laboratory-activation-probe';
import proof from '../docs/reviews/evidence/laboratory-stage0/preservation.json';
function memory() {
  const values = new Map<string, string>();
  const port: StoragePort = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, raw) => {
      values.set(key, raw);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
  return { values, port };
}
const group = (name: string) => ({
  kind: 'command',
  request: {
    commandId: 'portal-1',
    expectedWorldRevision: 0,
    command: {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name,
      metadataRegion: 'norwayeast',
    },
  },
});
describe('PR59 activation investigation: expected counterexamples are NOT security passes', () => {
  it('keeps all 169 original domain files and source receipts frozen', () => {
    const entries = Object.entries(proof.files).filter(([p]) => p.startsWith('src/domain/'));
    expect(entries).toHaveLength(169);
    for (const [p, hash] of entries)
      expect(createHash('sha256').update(readFileSync(p)).digest('hex'), p).toBe(hash);
  });
  it('prepares explicitly without mutating v2, preserves original attempt, and requires explicit activation', () => {
    const { port } = memory();
    const old = new SandboxStore(port);
    old.load();
    expect(old.dispatch(group('rg-source'))).toBe(true);
    const before = port.getItem(sandboxKey);
    expect(inspectCandidate(port).status).toBe('no-v3');
    expect(prepareCandidate(port, 'epoch-1', false)).toBe(false);
    expect(port.getItem(probeKey)).toBeNull();
    expect(prepareCandidate(port, 'epoch-1', true)).toBe(true);
    expect(inspectCandidate(port)).toEqual({ status: 'blocked', reason: 'prepared-recovery' });
    expect(activateCandidate(port, false)).toBe(false);
    expect(activateCandidate(port, true)).toBe(true);
    const result = inspectCandidate(port);
    expect(result.status).toBe('candidate-accepts');
    if (result.status !== 'candidate-accepts') throw Error('Unexpected probe failure');
    expect(result.checkpoint.sourceV2).toBe(before);
    expect(result.checkpoint.original).toBe(old.exportSnapshot());
    expect(result.checkpoint.attemptNumber).toBe(old.getSnapshot().attemptNumber);
    expect(port.getItem(sandboxKey)).toBe(before);
  });
  it('blocks changed source, removed source, corrupt and unsupported records without fallback', () => {
    const { port, values } = memory();
    const old = new SandboxStore(port);
    old.load();
    expect(old.dispatch(group('rg-source'))).toBe(true);
    const original = port.getItem(sandboxKey)!;
    expect(prepareCandidate(port, 'epoch', true)).toBe(true);
    expect(activateCandidate(port, true)).toBe(true);
    const checkpoint = port.getItem(probeKey)!;
    for (const source of ['{', null]) {
      if (source === null) values.delete(sandboxKey);
      else values.set(sandboxKey, source);
      expect(inspectCandidate(port)).toEqual({ status: 'blocked', reason: 'source-conflict' });
      expect(values.get(probeKey)).toBe(checkpoint);
    }
    values.set(sandboxKey, original);
    for (const bad of ['{', '{"schema":99}', '{"schema":3,"model":"sandbox@3.0.0"}']) {
      values.set(probeKey, bad);
      expect(inspectCandidate(port).status).toBe('blocked');
      expect(prepareCandidate(port, 'retry', true)).toBe(false);
      expect(values.get(sandboxKey)).toBe(original);
    }
  });
  it('does not claim success for quota failure or failed readback; prepared state survives a failed second write', () => {
    const { port, values } = memory();
    const denied: StoragePort = {
      ...port,
      setItem: () => {
        throw new DOMException('Synthetic controlled quota failure', 'QuotaExceededError');
      },
    };
    expect(prepareCandidate(denied, 'epoch', true)).toBe(false);
    expect(values.size).toBe(0);
    const discarded: StoragePort = { ...port, setItem: () => {} };
    expect(prepareCandidate(discarded, 'epoch', true)).toBe(false);
    expect(prepareCandidate(port, 'epoch', true)).toBe(true);
    const prepared = port.getItem(probeKey);
    expect(activateCandidate(denied, true)).toBe(false);
    expect(activateCandidate(discarded, true)).toBe(false);
    expect(port.getItem(probeKey)).toBe(prepared);
    expect(inspectCandidate(port)).toEqual({ status: 'blocked', reason: 'prepared-recovery' });
  });
  it('rejects preparation when the old source changes during validation or a new tab already prepared', () => {
    const { port, values } = memory();
    const old = new SandboxStore(port);
    old.load();
    expect(old.dispatch(group('rg-before'))).toBe(true);
    let reads = 0;
    const changed: StoragePort = {
      ...port,
      getItem: (key) => {
        if (key === sandboxKey && ++reads === 2) values.set(sandboxKey, '{');
        return port.getItem(key);
      },
    };
    expect(prepareCandidate(changed, 'first', true)).toBe(false);
    expect(port.getItem(probeKey)).toBeNull();
    values.delete(sandboxKey);
    expect(prepareCandidate(port, 'first', true)).toBe(true);
    const prepared = port.getItem(probeKey);
    expect(prepareCandidate(port, 'second', true)).toBe(false);
    expect(port.getItem(probeKey)).toBe(prepared);
  });
  it('preserves a genuine nonempty Chapter01 prefix and its technical attempt without a v2 key', () => {
    const { port } = memory();
    const event = {
      kind: 'command' as const,
      request: group('rg-chapter').request,
      bindResult: false,
    };
    const attempt = applyEvent(freshAttempt(), event)!;
    expect(attempt.engine.world.groups).toHaveLength(1);
    const chapter = JSON.stringify(snapshotOf(attempt, 1, 7));
    port.setItem(chapterKey, chapter);
    const old = new SandboxStore(port);
    old.load();
    expect(old.getSnapshot().attemptNumber).toBe(7);
    expect(prepareCandidate(port, 'chapter-epoch', true)).toBe(true);
    expect(activateCandidate(port, true)).toBe(true);
    expect(port.getItem(chapterKey)).toBe(chapter);
    expect(port.getItem(sandboxKey)).toBeNull();
    const inspected = inspectCandidate(port);
    expect(inspected.status).toBe('candidate-accepts');
    if (inspected.status !== 'candidate-accepts') throw Error('Unexpected probe failure');
    expect(inspected.checkpoint.original).toBe(old.exportSnapshot());
    expect(inspected.checkpoint.attemptNumber).toBe(7);
  });
  it('preserves current attempt, earlier archived attempt, VM and applied app settings through the probe', () => {
    const { port } = memory();
    const old = new SandboxStore(port);
    old.load();
    expect(old.dispatch(group('rg-archive'))).toBe(true);
    const archive = structuredClone(old.getSnapshot().attempt.engine);
    expect(old.restart()).toBe(true);
    expect(old.dispatch(group('rg-current'))).toBe(true);
    for (const command of [
      {
        type: 'CreateVmBundle',
        groupId: 'group-1',
        name: 'vm-saved',
        region: 'norwayeast',
        image: 'ubuntu-22-04',
        profile: 'standard',
        dataDiskGiB: '32',
        subnetId: '',
      },
      {
        type: 'CreatePlan',
        groupId: 'group-1',
        name: 'plan-saved',
        region: 'norwayeast',
        profile: 'linux-learning-v1',
      },
    ]) {
      const e = old.getSnapshot().attempt.engine;
      expect(
        old.dispatch({
          kind: 'command',
          request: {
            commandId: `fixture-${e.ledger.length}`,
            expectedWorldRevision: e.world.revision,
            command,
          },
        }),
      ).toBe(true);
    }
    const planId = old.getSnapshot().attempt.engine.world.resources[0]!.id;
    for (const command of [
      { type: 'CreateWebApp', groupId: 'group-1', name: 'app-saved', planId },
      { type: 'SetAppSettings', appId: 'app-9', environment: 'staging', catalogMode: 'read-only' },
    ]) {
      const e = old.getSnapshot().attempt.engine;
      const actual =
        command.type === 'SetAppSettings'
          ? {
              ...command,
              appId: e.world.resources.find((r) => r.type === 'Microsoft.Web/sites')!.id,
            }
          : command;
      expect(
        old.dispatch({
          kind: 'command',
          request: {
            commandId: `fixture-${e.ledger.length}`,
            expectedWorldRevision: e.world.revision,
            command: actual,
          },
        }),
      ).toBe(true);
    }
    const prior = structuredClone(old.getSnapshot());
    expect(prior.attempt.engine.world.infrastructure.length).toBeGreaterThan(0);
    expect(prior.attempt.engine.world.appSettings).toHaveLength(1);
    const raw = port.getItem(sandboxKey);
    const chapter = port.getItem(chapterKey);
    expect(prepareCandidate(port, 'epoch', true)).toBe(true);
    expect(activateCandidate(port, true)).toBe(true);
    expect(old.getSnapshot()).toEqual(prior);
    expect(old.engineFor(1)).toEqual(archive);
    expect(port.getItem(sandboxKey)).toBe(raw);
    expect(port.getItem(chapterKey)).toBe(chapter);
    const reload = new SandboxStore(port);
    reload.load();
    expect(reload.getSnapshot()).toEqual(prior);
    expect(reload.engineFor(1)).toEqual(archive);
    expect(replayEngine(reload.getSnapshot().attempt.engine)).toEqual(prior.attempt.engine);
  });
  it('keeps historical unsupported Storage receipt and every through-world identical', () => {
    const { port } = memory();
    const old = new SandboxStore(port);
    old.load();
    expect(old.dispatch(group('rg-history'))).toBe(true);
    expect(
      old.dispatch({
        kind: 'command',
        request: {
          commandId: 'unsupported-storage',
          expectedWorldRevision: 1,
          command: { type: 'CreateStorageAccount', groupId: 'group-1', name: 'historical' },
        },
      }),
    ).toBe(true);
    const e = structuredClone(old.getSnapshot().attempt.engine);
    expect(e.ledger.at(-1)!.receipt.code).toBe('unsupported-capability');
    expect(prepareCandidate(port, 'epoch', true)).toBe(true);
    expect(activateCandidate(port, true)).toBe(true);
    const reload = new SandboxStore(port);
    reload.load();
    expect(reload.getSnapshot().attempt.engine).toEqual(e);
    for (let through = 0; through <= e.ledger.length; through++)
      expect(replayEngine(reload.getSnapshot().attempt.engine, through)).toEqual(
        replayEngine(e, through),
      );
    expect(reload.engineFor(999)).toBeUndefined();
  });
});
