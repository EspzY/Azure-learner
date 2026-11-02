import { describe, expect, it } from 'vitest';
import { applicationNb as copy } from '@/content/nb';
import { ApplicationStore } from './application-store';
import {
  applicationIds,
  applicationItems,
  applicationKey,
  applicationFacts,
  applicationLimit,
  applyApplication,
  freshApplication,
  restoreApplication,
  evaluateApplication,
  type ApplicationSave,
  type ApplicationItem,
} from './application-transfer';
import { applicationExposure } from './application-exposure';
import {
  networkingKey,
  freshNetworking,
  applyNetworking,
  networkingFacts,
  evaluateNetworkingAttempt,
} from './networking';
import {
  storageKey,
  freshStorage,
  applyStorage,
  storageFacts,
  evaluateStorageAttempt,
} from './storage';
import { costKey, freshCost, applyCost, costFacts, evaluateCostAttempt } from './cost';
import {
  transferKey,
  freshTransfer,
  applyTransfer,
  transferFacts,
  evaluateTransfer,
} from './transfer';

const exposure = { related: [], uncertain: [] };
function add(save: ApplicationSave, event: unknown) {
  const next = applyApplication(save, event);
  expect(next).not.toBeNull();
  return next!;
}
function begin(item: ApplicationItem = 'at-network-01') {
  return add(freshApplication(), { kind: 'begin', item, exposure });
}
function answer(save: ApplicationSave, decision?: string, reason?: string) {
  const a = applicationFacts(save).current!,
    pair = applicationItems[a.item].accepted[0]!;
  return add(save, {
    kind: 'draft',
    answer: { decision: decision ?? pair[0], reason: reason ?? pair[1] },
  });
}
function memory() {
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
}
describe('AS-02 isolated application evidence', () => {
  it('pins stable IDs, exact displayed order and six materially paired cases without position-based keys', () => {
    expect(applicationIds).toHaveLength(6);
    for (const id of applicationIds) {
      const d = applicationItems[id],
        c = copy.items[id];
      expect(c.decisions.map((o) => o.id)).toEqual(d.decisions);
      expect(c.reasons.map((o) => o.id)).toEqual(d.reasons);
      expect(new Set(d.decisions).size).toBe(3);
      expect(new Set(d.reasons).size).toBe(3);
      expect(d.itemVersion).toBe('1.0.0');
      expect(d.presentation).toBe('1.0.0');
      expect(d.slots.length).toBeGreaterThan(0);
      for (const field of ['decision', 'reason'] as const)
        for (const o of field === 'decision' ? c.decisions : c.reasons)
          expect((c.feedback[field] as Record<string, string>)[o.id]?.length).toBeGreaterThan(35);
    }
    for (const group of ['networking', 'storage', 'cost'] as const) {
      const [a, b] = applicationIds.filter((id) => applicationItems[id].group === group);
      expect(applicationItems[a!].family).toBe(applicationItems[b!].family);
      expect(applicationItems[a!].variant).not.toBe(applicationItems[b!].variant);
      expect(applicationItems[a!].accepted).not.toEqual(applicationItems[b!].accepted);
      expect(copy.items[a!].premises).not.toEqual(copy.items[b!].premises);
    }
  });
  it('checks every decision/reason combination, including both valid storage adapters and rejecting cross-pairs', () => {
    for (const id of applicationIds) {
      const d = applicationItems[id],
        pairs: readonly (readonly [string, string])[] = d.accepted;
      for (const decision of d.decisions)
        for (const reason of d.reasons) {
          const a = applicationFacts(answer(begin(id), decision, reason)).current!;
          expect(evaluateApplication(a).relation).toBe(
            pairs.some(([x, y]) => x === decision && y === reason),
          );
        }
    }
    expect(applicationItems['at-storage-02'].accepted).toHaveLength(2);
  });
  it('rejects fixed positions and length/absolute-language strategies as perfect-bank solutions', () => {
    const strategies = [
      ...[0, 1, 2].map((i) => () => i),
      (xs: readonly { text: string }[]) =>
        xs.reduce((best, x, i) => (x.text.length > xs[best]!.text.length ? i : best), 0),
      (xs: readonly { text: string }[]) =>
        xs.reduce((best, x, i) => (x.text.length < xs[best]!.text.length ? i : best), 0),
      (xs: readonly { text: string }[]) =>
        xs.reduce(
          (best, x, i) =>
            (x.text.match(/alltid|automatisk|garanter|alle|bare|uten/gi)?.length ?? 0) >
            (xs[best]!.text.match(/alltid|automatisk|garanter|alle|bare|uten/gi)?.length ?? 0)
              ? i
              : best,
          0,
        ),
    ];
    for (const decisionStrategy of strategies)
      for (const reasonStrategy of strategies) {
        const passed = applicationIds.filter((id) => {
          const c = copy.items[id];
          return evaluateApplication(
            applicationFacts(
              answer(
                begin(id),
                c.decisions[decisionStrategy(c.decisions)]!.id,
                c.reasons[reasonStrategy(c.reasons)]!.id,
              ),
            ).current!,
          ).relation;
        });
        expect(passed.length).toBeLessThan(applicationIds.length);
      }
  });
  it('preserves first submission and pinned exposure after aid, another variant, retry and abandon', () => {
    let s = add(answer(begin()), { kind: 'submit' });
    const first = structuredClone(applicationFacts(s).firsts[0]);
    s = add(s, {
      kind: 'begin',
      item: 'at-network-02',
      exposure: { related: ['networking'], uncertain: [] },
    });
    expect(applicationFacts(s).current?.retry).toBe(true);
    s = add(answer(s), { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    s = add(s, { kind: 'begin', item: 'at-network-01', exposure });
    s = add(s, { kind: 'abandon' });
    expect(applicationFacts(s).firsts[0]).toEqual(first);
    expect(restoreApplication(JSON.stringify(s)).save).toEqual(s);
    expect(applicationFacts(s).attempts[1]?.exposure.related).toEqual(['networking']);
  });
  it('strictly rejects invalid IDs, mismatched answers, extra fields, illegal transitions and mutated versions', () => {
    let s = begin();
    for (const bad of [
      { kind: 'begin', item: 'nw12', exposure },
      { kind: 'submit' },
      { kind: 'draft', answer: { decision: 'blob-pilot', reason: null } },
      { kind: 'aid', score: 1 },
      { kind: 'draft', answer: { decision: null, reason: null, credit: 1 } },
    ])
      expect(applyApplication(s, bad)).toBeNull();
    expect(
      applyApplication(freshApplication(), {
        kind: 'begin',
        item: 'at-network-01',
        exposure: { related: ['cost'], uncertain: [] },
      }),
    ).toBeNull();
    expect(
      applyApplication(freshApplication(), {
        kind: 'begin',
        item: 'at-cost-01',
        exposure: { related: ['cost'], uncertain: ['cost'] },
      }),
    ).toBeNull();
    s = add(answer(s), { kind: 'submit' });
    expect(
      applyApplication(s, { kind: 'draft', answer: { decision: null, reason: null } }),
    ).toBeNull();
    expect(restoreApplication(JSON.stringify({ ...s, rubric: 'next' })).issue).toBe('unsupported');
    expect(restoreApplication(JSON.stringify({ ...s, extra: true })).issue).toBe('corrupt');
    expect(
      restoreApplication(JSON.stringify({ ...s, events: [...s.events, { kind: 'submit' }] })).issue,
    ).toBe('corrupt');
    expect(restoreApplication('[').issue).toBe('corrupt');
  });
  it('reserves bounded terminal events for durable aid and submit after the normal draft capacity is exhausted', () => {
    let s = answer(begin());
    const pair = applicationItems['at-network-01'].accepted[0]!;
    while (s.events.length < applicationLimit - 2)
      s = add(s, {
        kind: 'draft',
        answer: {
          decision: applicationFacts(s).current!.answer.decision === null ? pair[0] : null,
          reason: pair[1],
        },
      });
    if (applicationFacts(s).current!.answer.decision === null) {
      // Select the opposite parity at the beginning; no limit or terminal rule is relaxed.
      s = begin();
      s = add(s, { kind: 'draft', answer: { decision: null, reason: pair[1] } });
      while (s.events.length < applicationLimit - 2)
        s = add(s, {
          kind: 'draft',
          answer: {
            decision: applicationFacts(s).current!.answer.decision === null ? pair[0] : null,
            reason: pair[1],
          },
        });
    }
    expect(applicationFacts(s).current!.answer.decision).not.toBeNull();
    expect(
      applyApplication(s, { kind: 'draft', answer: { decision: null, reason: null } }),
    ).toBeNull();
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(s.events.length).toBe(applicationLimit);
    expect(restoreApplication(JSON.stringify(s)).issue).toBeNull();
    expect(applyApplication(s, { kind: 'begin', item: 'at-cost-01', exposure })).toBeNull();
  });
  it('uses durable-only CAS/readback and cannot publish a false begin or stale first', () => {
    const m = memory(),
      a = new ApplicationStore(m),
      b = new ApplicationStore(m);
    a.load();
    b.load();
    expect(a.begin('at-network-01')).toBe(true);
    expect(b.begin('at-storage-01')).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    expect(applicationFacts(b.getSnapshot().save).attempts).toHaveLength(0);
    expect(
      a.event({ kind: 'draft', answer: { decision: 'dns-object', reason: 'split-evidence' } }),
    ).toBe(true);
    const raw = m.getItem(applicationKey);
    m.setItem = () => {
      throw Error('denied');
    };
    // Store holds the same adapter object, so write failure is observable.
    expect(a.event({ kind: 'submit' })).toBe(false);
    expect(a.getSnapshot().issue).toBe('unsaved');
    expect(applicationFacts(a.getSnapshot().save).submitted).toHaveLength(0);
    expect(m.getItem(applicationKey)).toBe(raw);
    const noReadback = { ...memory(), setItem: () => {} };
    const c = new ApplicationStore(noReadback);
    c.load();
    expect(c.begin('at-cost-01')).toBe(false);
    expect(c.getSnapshot().issue).toBe('conflict');
  });
  it('scoped recovery retains a newer valid record and all original keys', () => {
    const m = memory();
    m.data.set(applicationKey, 'invalid');
    m.data.set(networkingKey, 'original');
    const s = new ApplicationStore(m);
    s.load();
    m.data.set(applicationKey, JSON.stringify(begin()));
    expect(s.recoverInvalid()).toBe(false);
    expect(m.getItem(networkingKey)).toBe('original');
    expect(applicationFacts(s.getSnapshot().save).active).toBe(true);
    m.data.set(applicationKey, 'invalid');
    s.changed();
    s.load();
    expect(s.recoverInvalid()).toBe(true);
    expect(m.getItem(networkingKey)).toBe('original');
    expect(m.getItem(applicationKey)).toBeNull();
  });
  it('reads original semantic families conservatively and preserves all historical replay outcomes and bytes', () => {
    let n = applyNetworking(freshNetworking(), { kind: 'begin', item: 'nw12' })!;
    n = applyNetworking(n, { kind: 'draft', answer: { decision: 0, reason: 1 } })!;
    n = applyNetworking(n, { kind: 'submit' })!;
    let st = freshStorage();
    for (const [item, decision, reason] of [
      ['sa02', 0, 1],
      ['sa12', 1, 0],
    ] as const) {
      st = applyStorage(st, { kind: 'begin', item })!;
      st = applyStorage(st, { kind: 'draft', answer: { decision, reason } })!;
      st = applyStorage(st, { kind: 'submit' })!;
    }
    let c = applyCost(freshCost(), { kind: 'begin', item: 'cm10' })!;
    c = applyCost(c, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
    c = applyCost(c, { kind: 'submit' })!;
    let t = applyTransfer(freshTransfer(), { kind: 'begin', item: 'campaign-pricing' })!;
    t = applyTransfer(t, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
    t = applyTransfer(t, { kind: 'submit' })!;
    const m = memory();
    for (const [key, save] of [
      [networkingKey, n],
      [storageKey, st],
      [costKey, c],
      [transferKey, t],
    ] as const)
      m.data.set(key, JSON.stringify(save));
    const bytes = [...m.data];
    expect(applicationExposure('networking', m.getItem).related).toEqual(['networking']);
    expect(applicationExposure('storage', m.getItem).related).toEqual(['storage']);
    expect(applicationExposure('cost', m.getItem).related).toEqual(['cloud-transfer', 'cost']);
    expect(evaluateNetworkingAttempt(networkingFacts(n).firsts[0]!).relation).toBe(true);
    expect(storageFacts(st).firsts.every((a) => evaluateStorageAttempt(a).relation)).toBe(true);
    expect(evaluateCostAttempt(costFacts(c).attempts[0]!).relation).toBe(true);
    expect(evaluateTransfer(transferFacts(t).submitted[0]!).relation).toBe(true);
    const app = new ApplicationStore(m);
    app.load();
    expect(app.begin('at-cost-01')).toBe(true);
    expect(applicationFacts(app.getSnapshot().save).current?.exposure.related).toEqual([
      'cloud-transfer',
      'cost',
    ]);
    for (const [key, raw] of bytes) expect(m.getItem(key)).toBe(raw);
    m.data.set(transferKey, 'corrupt');
    expect(applicationExposure('cost', m.getItem)).toEqual({
      related: ['cost'],
      uncertain: ['cloud-transfer'],
    });
    expect(applicationExposure('networking', () => null)).toEqual(exposure);
    expect(
      applicationExposure('storage', () => {
        throw Error('blocked');
      }),
    ).toEqual({ related: [], uncertain: ['storage'] });
  });
  it('classifies guided family exposure without granting competence and handles an invalid runtime begin safely', () => {
    const n = applyNetworking(freshNetworking(), {
      kind: 'mission',
      mission: 'dns',
      attempt: null,
      boundary: null,
    })!;
    const st = applyStorage(freshStorage(), { kind: 'mission', mission: 'design' })!;
    const cost = applyCost(freshCost(), { kind: 'mission', mission: 'estimate' })!;
    const m = memory();
    m.data.set(networkingKey, JSON.stringify(n));
    m.data.set(storageKey, JSON.stringify(st));
    m.data.set(costKey, JSON.stringify(cost));
    expect(applicationExposure('networking', m.getItem).related).toEqual(['networking']);
    expect(applicationExposure('storage', m.getItem).related).toEqual(['storage']);
    expect(applicationExposure('cost', m.getItem).related).toEqual(['cost']);
    const a = new ApplicationStore(m);
    a.load();
    expect(a.begin('unknown' as ApplicationItem)).toBe(false);
    expect(applicationFacts(a.getSnapshot().save).firsts).toHaveLength(0);
  });
});
