import { describe, it, expect } from 'vitest';
import { transferNb } from '@/content/nb';
import {
  applyTransfer,
  evaluateTransfer,
  freshTransfer,
  restoreTransfer,
  transferFacts,
  transferIds,
  transferItems,
  transferKey,
  transferLimit,
  transferObjectiveMap,
  transferVariants,
  transferCase,
  transferHref,
  type TransferSave,
  type TransferItemId,
} from './transfer';
import { TransferStore } from './transfer-store';
import { transferSources } from './transfer-sources';
const add = (s: TransferSave, e: unknown) => {
  const next = applyTransfer(s, e);
  expect(next).not.toBeNull();
  return next!;
};
function submitted(id: TransferItemId, decision: number, reason: number) {
  let s = add(freshTransfer(), { kind: 'begin', item: id });
  s = add(s, { kind: 'draft', answer: { decision, reason } });
  return add(s, { kind: 'submit' });
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
describe('P03 original independent transfer', () => {
  it('binds every scoped objective to at least two materially authored contexts and complete alternative rationales', () => {
    expect(transferIds).toHaveLength(19);
    expect(new Set(Object.values(transferVariants)).size).toBe(19);
    for (const id of transferIds) {
      expect(transferHref(id)).toMatch(/case=cc\d{2}$/);
      expect(transferCase(transferVariants[id])).toBe(id);
      expect(transferHref(id)).not.toContain(`case=${id}`);
    }
    expect(transferCase('public-information')).toBeUndefined();
    expect(transferCase('cc99')).toBeUndefined();
    for (const objective of Object.values(transferObjectiveMap))
      expect(
        transferIds.filter((id) => transferItems[id].objectives.includes(objective)).length,
      ).toBeGreaterThanOrEqual(2);
    for (const id of transferIds) {
      const c = transferNb.items[id];
      expect(c.situation.length).toBeGreaterThan(180);
      expect(new Set(c.decisions).size).toBe(3);
      expect(new Set(c.reasons).size).toBe(3);
      for (const field of [
        'decisionFeedback',
        'reasonFeedback',
        'decisionWhen',
        'reasonWhen',
      ] as const) {
        expect(c[field]).toHaveLength(3);
        expect(c[field].every((s) => s.length > 25)).toBe(true);
      }
      expect(transferItems[id].repeat).toMatch(/^\/learn\/.*\?topic=/);
      expect(transferItems[id].sources.length).toBeGreaterThan(0);
      for (const source of transferItems[id].sources)
        expect(transferSources[source as keyof typeof transferSources]?.url).toMatch(
          /^https:\/\/learn.microsoft.com\/en-us\//,
        );
    }
  });
  it.each(transferIds)(
    '%s requires the correct relationship, not lucky method recognition',
    (id) => {
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++) {
          const save = submitted(id, d, r),
            a = transferFacts(save).submitted[0]!;
          expect(evaluateTransfer(a).relation).toBe(
            transferItems[id].accepted.some(([decision, reason]) => d === decision && r === reason),
          );
          expect(restoreTransfer(JSON.stringify(save)).save).toEqual(save);
        }
    },
  );
  it('accepts two distinct architectures only with their matching responsibility', () => {
    for (const [d, r] of [
      [1, 0],
      [2, 1],
    ])
      expect(
        evaluateTransfer(transferFacts(submitted('two-valid-hosts', d!, r!)).submitted[0]!)
          .relation,
      ).toBe(true);
    for (const [d, r] of [
      [1, 1],
      [2, 0],
    ])
      expect(
        evaluateTransfer(transferFacts(submitted('two-valid-hosts', d!, r!)).submitted[0]!)
          .relation,
      ).toBe(false);
  });
  it('locks first, keeps help/retry/abandon separate and does not reset exposure on another variant', () => {
    let s = submitted('public-information', 0, 0);
    const prefix = JSON.stringify(s.events);
    s = add(s, { kind: 'begin', item: 'exclusive-research' });
    expect(transferFacts(s).current?.retry).toBe(true);
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'abandon' });
    s = add(s, { kind: 'begin', item: 'public-information' });
    s = add(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    s = add(s, { kind: 'submit' });
    const f = transferFacts(s);
    expect(JSON.stringify(s.events.slice(0, 3))).toBe(prefix);
    expect(f.submitted[0]?.answer).toEqual({ decision: 0, reason: 0 });
    expect(f.submitted[1]?.retry).toBe(true);
    expect(f.attempts[1]).toMatchObject({ status: 'abandoned', assisted: true });
  });
  it('reserves terminal and durable aid capacity after bounded drafts', () => {
    let s = add(freshTransfer(), { kind: 'begin', item: 'batch-pricing' });
    for (let n = 1; n < transferLimit - 2; n++)
      s = add(s, { kind: 'draft', answer: { decision: n % 3, reason: 0 } });
    expect(s.events).toHaveLength(transferLimit - 2);
    expect(applyTransfer(s, { kind: 'draft', answer: { decision: 1, reason: 2 } })).toBeNull();
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(s.events).toHaveLength(transferLimit);
    expect(restoreTransfer(JSON.stringify(s)).issue).toBeNull();
    expect(applyTransfer(s, { kind: 'begin', item: 'batch-pricing' })).toBeNull();
  });
  it('rejects invalid transitions, untrusted arrays, bounds and unsupported versions', () => {
    for (const raw of [
      { kind: 'submit' },
      { kind: 'aid' },
      { kind: 'draft', answer: { decision: 0, reason: 0 } },
      { kind: 'begin', item: 'bogus' },
      null,
      [],
    ])
      expect(applyTransfer(freshTransfer(), raw)).toBeNull();
    const active = add(freshTransfer(), { kind: 'begin', item: 'public-information' });
    expect(applyTransfer(active, { kind: 'begin', item: 'batch-pricing' })).toBeNull();
    expect(applyTransfer(active, { kind: 'submit' })).toBeNull();
    for (const answer of [
      { decision: 4, reason: 0 },
      { decision: 0, reason: 'x' },
      { decision: -1, reason: 0 },
      { decision: 0, reason: 0, extra: true },
    ])
      expect(applyTransfer(active, { kind: 'draft', answer })).toBeNull();
    expect(restoreTransfer('{broken').issue).toBe('corrupt');
    expect(restoreTransfer(JSON.stringify({ ...freshTransfer(), schema: 2 })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreTransfer(JSON.stringify({ ...active, events: [...active.events, { kind: 'submit' }] }))
        .issue,
    ).toBe('corrupt');
    expect(restoreTransfer('x'.repeat(220001)).issue).toBe('corrupt');
  });
  it('never reads or mutates older learner, receipt, mission or XP keys', () => {
    const storage = memory();
    storage.data.set('azurelab.learning.foundations.v2', 'old-first');
    storage.data.set('azurelab.progress.v1', 'old-xp');
    storage.data.set('azurelab.sandbox.v1', 'old-world');
    const before = [...storage.data];
    const store = new TransferStore(storage);
    store.load();
    store.event({ kind: 'begin', item: 'public-information' });
    store.event({ kind: 'abandon' });
    for (const [key, value] of before) expect(storage.getItem(key)).toBe(value);
    expect([...storage.data.keys()].filter((k) => !before.some(([old]) => old === k))).toEqual([
      transferKey,
    ]);
  });
  it('rejects stale writes, preserves newer valid records during scoped recovery and restores drafts', () => {
    const storage = memory(),
      a = new TransferStore(storage),
      b = new TransferStore(storage);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin', item: 'public-information' })).toBe(true);
    expect(b.event({ kind: 'begin', item: 'batch-pricing' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    b.load();
    expect(b.getSnapshot().save).toEqual(a.getSnapshot().save);
    storage.setItem(transferKey, 'bad');
    b.load();
    storage.setItem(transferKey, JSON.stringify(a.getSnapshot().save));
    expect(b.recoverInvalid()).toBe(false);
    expect(transferFacts(b.getSnapshot().save).active).toBe(true);
    storage.setItem(transferKey, 'bad');
    b.load();
    expect(b.recoverInvalid()).toBe(true);
    expect(storage.getItem(transferKey)).toBeNull();
  });
  it('does not expose teaching or claim a saved transition after denied or overwritten writes', () => {
    const storage = memory(),
      store = new TransferStore(storage);
    store.load();
    store.event({ kind: 'begin', item: 'public-information' });
    const bytes = storage.getItem(transferKey);
    storage.setItem = () => {
      throw Error('denied');
    };
    expect(store.prepareTeaching()).toBe(false);
    expect(transferFacts(store.getSnapshot().save).assisted).toBe(false);
    expect(storage.getItem(transferKey)).toBe(bytes);
    expect(store.getSnapshot().issue).toBe('unsaved');
    const racing = memory(),
      race = new TransferStore(racing);
    race.load();
    racing.setItem = (k) => racing.data.set(k, JSON.stringify(freshTransfer()));
    expect(race.event({ kind: 'begin', item: 'public-information' })).toBe(false);
    expect(race.getSnapshot().issue).toBe('conflict');
    expect(transferFacts(race.getSnapshot().save).active).toBe(false);
  });
});
