import { describe, it, expect } from 'vitest';
import { storageResilienceNb as c, resilienceItemsNb } from '../../content/nb';
import {
  initialTiers,
  initialReplication,
  runTiers,
  runReplication,
  validResilienceInput,
  tiers,
  redundancies,
  targets,
  type ResilienceInput,
} from './storage-resilience-model';
import {
  freshResilience,
  applyResilience,
  restoreResilience,
  resilienceFacts,
  resilienceGuidedFacts,
  resilienceMilestoneFacts,
  resilienceKey,
  resilienceLimit,
  resilienceManifest,
  resilienceItems,
  resilienceItemIds,
  evaluateResilience,
  type ResilienceSave,
  type ResilienceMission,
} from './storage-resilience';
import { ResilienceStore } from './storage-resilience-store';
import { resilienceSources, resilienceStudySources } from './storage-resilience-sources';
import { freshStorage, storageKey } from './storage';
import { prepareExistingTeaching } from './teaching-access';
const event = (s: ResilienceSave, e: unknown) => {
  const next = applyResilience(s, e);
  expect(next).not.toBeNull();
  return next!;
};
const run = (s: ResilienceSave, input: ResilienceInput) =>
  event(s, { kind: 'run', input, prediction: 0 });
function witnessedResilience(mission: ResilienceMission) {
  let s = event(freshResilience(), { kind: 'mission', mission });
  const t = initialTiers,
    p = initialReplication;
  const inputs: ResilienceInput[] =
    mission === 'tiers'
      ? [
          t,
          { ...t, usage: 'frequent' },
          { ...t, usage: 'frequent', tier: 'hot' },
          { ...t, tier: 'archive', retrieval: 'flexible', phase: 'stored' },
          { ...t, tier: 'archive', phase: 'pending' },
          { ...t, tier: 'archive', phase: 'complete' },
          { ...t, tier: 'archive', redundancy: 'ZRS' },
        ]
      : [
          p,
          { ...p, failure: 'zone' },
          { ...p, redundancy: 'ZRS', failure: 'zone' },
          { ...p, redundancy: 'GRS', failure: 'region' },
          { ...p, redundancy: 'RA-GRS', failure: 'region' },
          { ...p, redundancy: 'RA-GZRS', failure: 'deletion' },
        ];
  for (const input of inputs) s = run(s, input);
  return s;
}
function memory() {
  const values = new Map<string, string>();
  let denied = false;
  return {
    values,
    deny: (v = true) => {
      denied = v;
    },
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (denied) throw Error('denied');
      values.set(k, v);
    },
    removeItem: (k: string) => {
      if (denied) throw Error('denied');
      values.delete(k);
    },
  };
}
describe('Storage B tier and lifecycle mechanism', () => {
  it('distinguishes Cold online and every declared Archive phase, not a listing or timer', () => {
    expect(runTiers(initialTiers)).toMatchObject({
      selected: 'cold',
      online: true,
      minimum: 90,
      state: 'online',
    });
    for (const [phase, online, state] of [
      ['stored', false, 'offline'],
      ['pending', false, 'pending'],
      ['complete', true, 'rehydrated'],
    ] as const)
      expect(runTiers({ ...initialTiers, tier: 'archive', phase })).toMatchObject({
        online,
        state,
        current: online ? 'hot' : 'archive',
        minimum: 180,
      });
  });
  it('rejects unsupported service/account and Archive/zonal combinations while preserving Cold', () => {
    for (const service of ['append', 'files', 'queue', 'table', 'disk'] as const)
      expect(runTiers({ ...initialTiers, service })?.supported).toBe(false);
    expect(runTiers({ ...initialTiers, account: 'premium' })?.supported).toBe(false);
    for (const redundancy of redundancies)
      for (const tier of tiers) {
        const r = runTiers({ ...initialTiers, redundancy, tier })!;
        expect(r.supported).toBe(
          tier !== 'archive' || ['LRS', 'GRS', 'RA-GRS'].includes(redundancy),
        );
      }
  });
  it('calculates a declared early exit without turning minimum billing into a deletion lock', () => {
    expect(
      runTiers({ ...initialTiers, tier: 'cool', days: 20, amount: 3, change: 'delete' }),
    ).toMatchObject({
      supported: true,
      remaining: 10,
      minimum: 30,
      costs: { early: 20 },
      outcome: 2,
    });
    expect(runTiers({ ...initialTiers, tier: 'archive', days: 45, change: 'tier' })).toMatchObject({
      remaining: 135,
    });
    expect(runTiers({ ...initialTiers, tier: 'archive', change: 'overwrite' })).toMatchObject({
      overwriteBlocked: true,
      remaining: 0,
      outcome: 1,
    });
    expect(runTiers({ ...initialTiers, tier: 'cold', change: 'keep' })).toMatchObject({
      remaining: 0,
    });
  });
  it('keeps inferred and explicit assignments separate and models only fictional total drivers', () => {
    expect(
      runTiers({ ...initialTiers, tier: 'hot', assignment: 'inherit', defaultTier: 'cold' })
        ?.selected,
    ).toBe('cold');
    expect(
      runTiers({ ...initialTiers, tier: 'hot', assignment: 'explicit', defaultTier: 'cold' })
        ?.selected,
    ).toBe('hot');
    const cold = runTiers({ ...initialTiers, usage: 'frequent' })!,
      hot = runTiers({ ...initialTiers, usage: 'frequent', tier: 'hot' })!;
    expect(hot.costs!.total).toBeLessThan(cold.costs!.total);
    expect(cold.costs!.capacity).toBeLessThan(hot.costs!.capacity);
    expect(runTiers({ ...initialTiers, amount: 20 })!.costs!.total).toBe(
      runTiers(initialTiers)!.costs!.total * 2,
    );
  });
  it('never lets a lifecycle rule rehydrate Archive or hide rearchiving eligibility', () => {
    expect(runTiers({ ...initialTiers, tier: 'archive', rule: 'guarded' })).toMatchObject({
      online: false,
      lifecycleRisk: false,
    });
    expect(
      runTiers({ ...initialTiers, tier: 'archive', phase: 'complete', rule: 'unguarded' }),
    ).toMatchObject({ online: true, lifecycleRisk: true, costs: { rehydrate: 250 } });
    expect(
      runTiers({ ...initialTiers, tier: 'archive', phase: 'complete', rule: 'guarded' })
        ?.lifecycleRisk,
    ).toBe(false);
  });
});
describe('physical protection, access, version and service boundaries', () => {
  it('checks six declared configurations against independently specified physical/access expectations', () => {
    const expected = {
      LRS: { zones: false, geo: false, ra: false },
      ZRS: { zones: true, geo: false, ra: false },
      GRS: { zones: false, geo: true, ra: false },
      'RA-GRS': { zones: false, geo: true, ra: true },
      GZRS: { zones: true, geo: true, ra: false },
      'RA-GZRS': { zones: true, geo: true, ra: true },
    };
    for (const redundancy of redundancies)
      for (const failure of ['rack', 'datacenter', 'zone', 'region', 'deletion'] as const) {
        const e = expected[redundancy],
          r = runReplication({ ...initialReplication, redundancy, failure })!;
        const primary =
          failure !== 'deletion' && failure !== 'region' && (e.zones || failure === 'rack');
        expect(r.primaryRead).toBe(primary);
        expect(r.secondaryRead).toBe(e.ra && failure !== 'deletion');
        expect(r.protectedCopy).toBe(failure !== 'deletion' && (primary || e.geo));
        expect(r.secondaryWrite).toBe(false);
        expect(r.zeroLossGuarantee).toBe(false);
        expect(r.appRecovered).toBeNull();
        expect(r.failoverRequired).toBe(e.geo && failure !== 'deletion' && !primary);
        expect(r.replicas).toHaveLength(e.geo ? 6 : 3);
        expect(
          new Set(r.replicas.filter((p) => p.region === 'primary').map((p) => p.site)).size,
        ).toBe(e.zones ? 3 : 1);
      }
  });
  it('GRS is not RA, RA is not write access, and copied data does not guarantee zero loss', () => {
    const grs = runReplication({ ...initialReplication, redundancy: 'GRS', failure: 'region' })!;
    const ra = runReplication({ ...initialReplication, redundancy: 'RA-GRS', failure: 'region' })!;
    expect(grs).toMatchObject({
      primaryRead: false,
      secondaryRead: false,
      protectedCopy: true,
      failoverRequired: true,
      pendingWrite: true,
    });
    expect(ra).toMatchObject({
      primaryRead: false,
      secondaryRead: true,
      secondaryWrite: false,
      pendingWrite: true,
    });
    expect(ra.replicas.filter((p) => p.region === 'secondary').map((p) => p.version)).toEqual([
      1, 1, 1,
    ]);
    expect(
      runReplication({ ...initialReplication, redundancy: 'RA-GZRS', lag: 'current' }),
    ).toMatchObject({ pendingWrite: false, zeroLossGuarantee: false, appRecovered: null });
  });
  it('propagates a declared logical deletion rather than using replicas as backup', () => {
    for (const redundancy of redundancies) {
      const r = runReplication({ ...initialReplication, redundancy, failure: 'deletion' })!;
      expect(r).toMatchObject({
        protectedCopy: false,
        primaryRead: false,
        secondaryRead: false,
        failoverRequired: false,
      });
      expect(r.replicas.every((p) => p.state === 'deleted' && p.version === null)).toBe(true);
    }
  });
  it('distinguishes account capability, Files RA behavior, disk types and Archive compatibility', () => {
    for (const target of targets)
      for (const redundancy of redundancies) {
        const r = runReplication({ ...initialReplication, target, redundancy })!;
        expect(r.typeSupported).toBe(
          ['blob', 'queue', 'table', 'filesHdd'].includes(target) ||
            ['LRS', 'ZRS'].includes(redundancy),
        );
      }
    expect(
      runReplication({
        ...initialReplication,
        target: 'filesHdd',
        redundancy: 'RA-GRS',
        failure: 'region',
      }),
    ).toMatchObject({
      supported: true,
      protectedCopy: true,
      secondaryRead: false,
      readAccess: false,
    });
    for (const target of targets)
      for (const redundancy of redundancies) {
        const r = runReplication({ ...initialReplication, target, redundancy, tier: 'archive' })!;
        expect(r.tierSupported).toBe(
          target === 'blob' && ['LRS', 'GRS', 'RA-GRS'].includes(redundancy),
        );
        expect(r.secondaryRead).toBe(false);
      }
    expect(runReplication({ ...initialReplication, region: false })).toMatchObject({
      supported: true,
      qualified: false,
      replicas: [],
      primaryRead: false,
      protectedCopy: false,
      outcome: 1,
    });
  });
  it.each([
    {},
    null,
    { ...initialTiers, days: 0 },
    { ...initialTiers, amount: 1.5 },
    { ...initialTiers, defaultTier: 'archive' },
    { ...initialTiers, actualPrice: 9 },
    { ...initialReplication, region: 'yes' },
    { ...initialReplication, failover: true },
    { ...initialReplication, target: '__proto__' },
  ])('rejects malformed and fictitious runtime input %#', (input) =>
    expect(validResilienceInput(input)).toBe(false),
  );
});
describe('isolated causal progress, first/help/retry and durable evidence', () => {
  it.each(['tiers', 'replication'] as const)(
    '%s requires real persisted contrasts and a correct cause',
    (mission) => {
      let s = witnessedResilience(mission);
      expect(resilienceGuidedFacts(resilienceFacts(s).guide!)).toMatchObject({
        witnessed: true,
        complete: false,
      });
      s = event(s, { kind: 'explain', answer: mission === 'tiers' ? 1 : 2 });
      expect(resilienceFacts(s).completed).toEqual([mission]);
      expect(restoreResilience(JSON.stringify(s))).toEqual({ save: s, issue: null });
    },
  );
  it('does not complete via navigation, configurations, repeated identical baselines or comparing different datasets', () => {
    let s = event(freshResilience(), { kind: 'visit', topic: 'tiers' });
    s = event(s, { kind: 'mission', mission: 'tiers' });
    s = event(s, { kind: 'configure', input: initialTiers });
    expect(applyResilience(s, { kind: 'explain', answer: 1 })).toBeNull();
    expect(resilienceFacts(s).completed).toEqual([]);
    s = run(s, { ...initialTiers, usage: 'frequent' });
    s = run(s, { ...initialTiers, usage: 'frequent', tier: 'hot', amount: 1 });
    expect(resilienceGuidedFacts(resilienceFacts(s).guide!).witnesses[1]).toBe(false);
  });
  it('pause/resume, milestones and terminal reserve use saved status, not old Part A evidence', () => {
    let s = witnessedResilience('tiers');
    const before = JSON.stringify(resilienceFacts(s).guide);
    s = event(s, { kind: 'pause' });
    expect(resilienceFacts(s).guide).toBeUndefined();
    s = event(s, { kind: 'resume', id: 1 });
    expect(JSON.stringify(resilienceFacts(s).guide)).toBe(before);
    expect(resilienceMilestoneFacts(freshResilience())).toEqual({
      tiers: false,
      replication: false,
    });
    expect(resilienceMilestoneFacts(s).tiers).toBe(true);
    while (s.events.length < resilienceLimit - 5)
      s = event(s, { kind: 'visit', topic: s.events.length % 2 ? 'tiers' : 'lifecycle' });
    while (s.events.length < resilienceLimit - 1)
      s = event(s, { kind: 'explain', answer: s.events.length % 2 ? 0 : 2 });
    expect(
      applyResilience(s, {
        kind: 'explain',
        answer: resilienceFacts(s).guide?.answer === 0 ? 2 : 0,
      }),
    ).toBeNull();
    s = event(s, { kind: 'explain', answer: 1 });
    expect(resilienceFacts(s).completed).toEqual(['tiers']);
    expect(restoreResilience(JSON.stringify(s)).issue).toBeNull();
  });
  it('grades all90 pairs against independently locked indexes and refuses correct decision/wrong rationale', () => {
    const locked = [
      [1, 2],
      [2, 0],
      [0, 1],
      [2, 0],
      [1, 2],
      [0, 1],
      [0, 2],
      [2, 1],
      [1, 0],
      [0, 2],
    ];
    resilienceItemIds.forEach((item, i) => {
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateResilience(item, { decision: d, reason: r }).relation).toBe(
            d === locked[i]![0] && r === locked[i]![1],
          );
    });
  });
  it('keeps first event prefix immutable through helped retry and sibling exposure after abandon', () => {
    let s = event(freshResilience(), { kind: 'begin', item: 'rb01' });
    s = event(s, { kind: 'draft', answer: { decision: 1, reason: 0 } });
    s = event(s, { kind: 'submit' });
    const prefix = JSON.stringify(s.events),
      first = JSON.stringify(resilienceFacts(s).firsts);
    s = event(s, { kind: 'begin', item: 'rb01' });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    s = event(s, { kind: 'submit' });
    expect(JSON.stringify(resilienceFacts(s).firsts)).toBe(first);
    expect(JSON.stringify(s.events.slice(0, 3))).toBe(prefix);
    s = event(s, { kind: 'begin', item: 'rb06' });
    s = event(s, { kind: 'abandon' });
    s = event(s, { kind: 'begin', item: 'rb07' });
    expect(resilienceFacts(s).current?.retry).toBe(true);
    expect(applyResilience(s, { kind: 'mission', mission: 'tiers' })).toBeNull();
  });
  it('reserves final draft/aid/submit at capacity and validates strict replay/version pins', () => {
    let s = freshResilience();
    while (s.events.length < resilienceLimit - 6)
      s = event(s, { kind: 'visit', topic: s.events.length % 2 ? 'tiers' : 'recovery' });
    s = event(s, { kind: 'begin', item: 'rb04' });
    expect(resilienceFacts(s).full).toBe(true);
    s = event(s, { kind: 'draft', answer: { decision: 2, reason: 0 } });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'submit' });
    expect(resilienceFacts(s).firsts[0]).toMatchObject({ assisted: true, status: 'submitted' });
    expect(restoreResilience(JSON.stringify(s)).issue).toBeNull();
    for (const bad of [
      '[]',
      'bad',
      JSON.stringify({ ...s, rubric: '2.0.0' }),
      JSON.stringify({ ...freshResilience(), world: {} }),
      JSON.stringify({ ...freshResilience(), events: [{ kind: 'aid' }] }),
      JSON.stringify({
        ...freshResilience(),
        events: [
          { kind: 'visit', topic: 'tiers' },
          { kind: 'visit', topic: 'tiers' },
        ],
      }),
    ])
      expect(restoreResilience(bad).issue).not.toBeNull();
  });
  it('isolates Part A bytes, rejects denied aid/stale writers and compares before scoped deletion', () => {
    const m = memory(),
      old = JSON.stringify(freshStorage());
    m.values.set(storageKey, old);
    m.values.set('azurelab.sandbox.v2', 'technical bytes');
    const a = new ResilienceStore(m),
      b = new ResilienceStore(m);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin', item: 'rb01' })).toBe(true);
    expect(b.event({ kind: 'visit', topic: 'tiers' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    m.deny();
    expect(
      prepareExistingTeaching(a, resilienceKey, m.getItem, restoreResilience, resilienceFacts, () =>
        a.event({ kind: 'aid' }),
      ),
    ).toBe(false);
    expect(resilienceFacts(restoreResilience(m.values.get(resilienceKey)!).save).assisted).toBe(
      false,
    );
    m.deny(false);
    a.load();
    expect(a.prepareTeaching()).toBe(true);
    expect(a.getSnapshot().save.events.at(-1)).toEqual({ kind: 'aid' });
    m.values.set(resilienceKey, '{bad');
    a.load();
    const newer = JSON.stringify(freshResilience());
    m.values.set(resilienceKey, newer);
    expect(a.recoverInvalid()).toBe(false);
    expect(m.getItem(resilienceKey)).toBe(newer);
    expect(m.getItem(storageKey)).toBe(old);
    expect(m.getItem('azurelab.sandbox.v2')).toBe('technical bytes');
  });
  it('binds substantive original theory, every scenario/feedback/source and both scoped objectives', () => {
    expect(resilienceManifest.certificationOverlay.slots).toEqual(['2.3.02', '2.3.03']);
    expect(Object.keys(resilienceItemsNb)).toEqual(resilienceItemIds);
    for (const id of resilienceItemIds) {
      const item = resilienceItems[id],
        copy = resilienceItemsNb[id];
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback[0]).toHaveLength(3);
      expect(copy.feedback[1]).toHaveLength(3);
      for (const source of item.sources) expect(resilienceSources).toHaveProperty(source);
      expect(c.sections).toHaveProperty(item.repeat);
    }
    for (const objective of Object.keys(resilienceManifest.objectives))
      expect(
        resilienceItemIds.filter((id) =>
          (resilienceItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    for (const ids of Object.values(resilienceStudySources))
      for (const id of ids)
        expect(resilienceSources[id][1]).toMatch(/^https:\/\/learn.microsoft.com\//);
  });
});
