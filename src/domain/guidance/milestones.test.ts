import { describe, expect, it } from 'vitest';
import { execute, freshEngine, type Engine } from '../sandbox/model';
import {
  milestoneAutoContext,
  milestoneDefinitions,
  milestoneObservations,
  type GuidedMilestoneContext,
} from './milestones';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from './milestone-preferences';
import { practicalSources } from '../sandbox/content';
import { guideTargets } from '../course/model';
import { nb } from '@/content/nb';
const send = (e: Engine, command: object) =>
  execute(e, {
    commandId: `m-${e.ledger.length}`,
    expectedWorldRevision: e.world.revision,
    command,
  });
function fixture() {
  return send(freshEngine(), {
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
    name: 'rg-milestones',
  }).engine;
}
const context: GuidedMilestoneContext = {
  scope: 'test-1',
  attempt: 1,
  boundary: null,
  kind: 'paas',
  inspected: [],
  groupId: 'group-1',
};
describe('read-only registered learning milestones', () => {
  it('binds existing competencies, reviewed source IDs, complete causal copy and every guide target location', () => {
    for (const [id, def] of Object.entries(milestoneDefinitions)) {
      expect(def.version).toBe('1.0.0');
      expect(def.objectives.length).toBeGreaterThan(0);
      for (const source of def.sources)
        expect(practicalSources[source]).toMatch(/^https:\/\/learn.microsoft.com\//);
      const c = id === 'policy-denial' ? nb.milestones.policy : nb.milestones.vm;
      for (const key of ['title', 'main', 'cause', 'consequence', 'next'] as const)
        expect(c[key]).toBeTruthy();
    }
    for (const target of guideTargets) expect(nb.milestones.targetLocations[target]).toBeTruthy();
  });
  it('observes a real rejection and unchanged state, never an allowed operation or unrelated scope', () => {
    const e = fixture();
    const denied = send(e, {
      type: 'CreatePlan',
      groupId: 'group-1',
      name: 'plan-denied',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    });
    expect(denied.receipt.code).toBe('policy-location-denied');
    const before = JSON.stringify(denied.engine);
    const [o] = milestoneObservations(denied.engine, 1, context, false);
    expect(o).toMatchObject({
      id: 'policy-denial',
      receiptId: denied.receipt.commandId,
      beforeCount: denied.receipt.beforeCount,
      afterCount: denied.receipt.beforeCount,
    });
    expect(milestoneAutoContext(o!, context, 'activity', denied.receipt.commandId)).toBe(false);
    expect(milestoneAutoContext(o!, context, 'policy', '')).toBe(true);
    expect(
      milestoneObservations(denied.engine, 1, { ...context, groupId: 'unrelated' }, false),
    ).toEqual([]);
    expect(JSON.stringify(denied.engine)).toBe(before);
    expect(milestoneObservations(e, 1, context, false)).toEqual([]);
  });
  it('uses accepted VM attachments and only requests auto presentation after explicit inspection', () => {
    const r = send(fixture(), {
      type: 'CreateVmBundle',
      groupId: 'group-1',
      name: 'vm-milestone',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '32',
      subnetId: '',
    });
    expect(r.receipt.outcome).toBe('accepted');
    const c = { ...context, kind: 'vm' as const };
    const [o] = milestoneObservations(r.engine, 1, c, false);
    expect(o?.resources.map((x) => x.role)).toEqual(['vm', 'osDisk', 'nic', 'subnet', 'vnet']);
    const vm = o!.resources[0]!.id;
    expect(milestoneAutoContext(o!, c, 'resource', vm)).toBe(false);
    expect(milestoneAutoContext(o!, { ...c, inspected: [vm] }, 'resource', vm)).toBe(true);
    expect(milestoneAutoContext(o!, { ...c, inspected: [vm] }, 'resource', 'other')).toBe(false);
    expect(milestoneObservations(r.engine, 1, c, true)).toEqual([]);
    expect(milestoneObservations(r.engine, 2, c, false)).toEqual([]);
    expect(milestoneObservations(r.engine, 1, { ...c, boundary: 'missing' }, false)).toEqual([]);
    expect(
      milestoneObservations(r.engine, 1, { ...c, boundary: r.receipt.commandId }, false),
    ).toEqual([]);
    const corrupt = structuredClone(r.engine);
    corrupt.world.infrastructure[0]!.name = 'invented';
    expect(milestoneObservations(corrupt, 1, c, false)).toEqual([]);
  });
});
describe('isolated, non-evidentiary milestone visibility history', () => {
  it('claims once across instances/reload and never writes any learner/simulator key', () => {
    const values = new Map<string, string>(),
      writes: string[] = [];
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        writes.push(key);
        values.set(key, value);
      },
    };
    expect(claimMilestone(storage, 'policy-denial@1.0.0:1:test')).toBe('claimed');
    expect(claimMilestone(storage, 'policy-denial@1.0.0:1:test')).toBe('seen');
    expect(claimMilestone({ ...storage }, 'policy-denial@1.0.0:1:test')).toBe('seen');
    expect(writes).toEqual([milestonePreferenceKey]);
  });
  it('fails closed for malformed/unknown/oversized/full state and denied storage', () => {
    for (const raw of [
      '{',
      '{"schema":2,"seen":[]}',
      '{"schema":1,"seen":["a","a"]}',
      '{"schema":1,"seen":[],"complete":true}',
      JSON.stringify({ schema: 1, seen: [7] }),
    ]) {
      expect(parseMilestonePreferences(raw)).toBeNull();
      expect(
        claimMilestone(
          {
            getItem: () => raw,
            setItem: () => {
              throw Error('must not overwrite');
            },
          },
          'a',
        ),
      ).toBe('unavailable');
    }
    expect(
      claimMilestone(
        {
          getItem: () => null,
          setItem: () => {
            throw Error('denied');
          },
        },
        'a',
      ),
    ).toBe('unavailable');
    expect(
      claimMilestone(
        {
          getItem: () => {
            throw Error('denied');
          },
          setItem: () => {},
        },
        'a',
      ),
    ).toBe('unavailable');
    expect(
      claimMilestone(
        {
          getItem: () =>
            JSON.stringify({ schema: 1, seen: Array.from({ length: 256 }, (_, i) => `s${i}`) }),
          setItem: () => {
            throw Error('must not evict');
          },
        },
        'new',
      ),
    ).toBe('unavailable');
  });
});
