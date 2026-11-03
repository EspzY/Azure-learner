import { describe, expect, it } from 'vitest';
import {
  applyV2,
  freshV2,
  restoreV2,
  v2Facts,
  v2Criteria,
  leaveV2,
  foundationsV2Key,
  type FoundationsV2Save,
} from './foundations-v2';
import { FoundationsV2Store } from './v2-store';
const event = (s: FoundationsV2Save, e: unknown) => {
  const n = applyV2(s, e);
  expect(n).not.toBeNull();
  return n!;
};
const answers = Object.fromEntries(v2Criteria.map((c) => [c.id, c.answer]));
const active = () =>
  event(event(freshV2(), { kind: 'begin' }), {
    kind: 'draft',
    answers: { host: 'finite', shortfall: '3' },
  });
function storage(raw = JSON.stringify(active())) {
  const data = new Map([[foundationsV2Key, raw]]);
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}
describe('Foundations v2 explicit navigation lifecycle1, frozen rubric2', () => {
  it('reads old schema2 and golden submissions unchanged before and after explicit schema3 promotion', () => {
    let old = event(event(freshV2(), { kind: 'begin' }), { kind: 'submit', answers });
    old = event(event(event(old, { kind: 'begin' }), { kind: 'aid' }), {
      kind: 'submit',
      answers: { ...answers, host: 'infinite' },
    });
    const expected = [
      {
        answers,
        assisted: false,
        retry: false,
        criteria: Object.fromEntries(v2Criteria.map((c) => [c.id, true])),
      },
      {
        answers: { ...answers, host: 'infinite' },
        assisted: true,
        retry: true,
        criteria: Object.fromEntries(v2Criteria.map((c) => [c.id, c.id !== 'host'])),
      },
    ];
    expect(v2Facts(restoreV2(JSON.stringify(old)).save).submissions).toEqual(expected);
    const begun = event(old, { kind: 'begin' });
    const closed = leaveV2(begun, true)!;
    expect(closed.schema).toBe(3);
    expect(closed.events.slice(0, begun.events.length)).toEqual(begun.events);
    expect(v2Facts(restoreV2(JSON.stringify(closed)).save).submissions).toEqual(expected);
    expect(v2Facts(closed).active).toBe(false);
  });
  it('preserves abandoned drafts without a result, and cannot manufacture a fresh unaided first', () => {
    const original = active();
    const closed = leaveV2(original, true)!;
    expect(closed.events.slice(-2).map((e) => e.kind)).toEqual(['aid', 'abandon']);
    expect(v2Facts(closed)).toMatchObject({
      active: false,
      submissions: [],
      abandoned: [{ answers: { host: 'finite', shortfall: '3' }, assisted: true }],
    });
    const submitted = event(event(closed, { kind: 'begin' }), { kind: 'submit', answers });
    expect(v2Facts(submitted).submissions[0]).toMatchObject({ assisted: true, retry: true });
    const neutral = leaveV2(original, false)!;
    expect(
      v2Facts(event(event(neutral, { kind: 'begin' }), { kind: 'submit', answers })).submissions[0],
    ).toMatchObject({ assisted: false, retry: true });
    expect(leaveV2(closed, true)).toBeNull();
    expect(restoreV2(JSON.stringify(closed))).toEqual({ save: closed, issue: null });
  });
  it('only accepts the explicit versioned lifecycle event under schema3 and enforces bounded terminal reserve', () => {
    expect(
      applyV2(active(), { kind: 'abandon', lifecycle: '1.0.0', reason: 'navigation' }),
    ).toBeNull();
    let full = active();
    while (full.events.length < 600)
      full = event(full, {
        kind: 'draft',
        answers: { shortfall: String(full.events.length % 12) },
      });
    const closed = leaveV2(full, true)!;
    expect(closed.events.length).toBeLessThanOrEqual(604);
    expect(restoreV2(JSON.stringify(closed)).issue).toBeNull();
    expect(applyV2(closed, { kind: 'begin' })).toBeNull();
    for (const altered of [
      { ...closed, lifecycle: '2.0.0' },
      { ...closed, extra: true },
      {
        ...closed,
        events: [...closed.events, { kind: 'abandon', lifecycle: '1.0.0', reason: 'navigation' }],
      },
    ])
      expect(restoreV2(JSON.stringify(altered)).issue).not.toBeNull();
  });
  it('persists required aid and abandon in one checked write; reload alone never abandons', () => {
    const io = storage();
    const store = new FoundationsV2Store(io);
    store.load();
    expect(v2Facts(store.getSnapshot().save).active).toBe(true);
    expect(store.leaveForNavigation(0, true)).toBe(true);
    const persisted = restoreV2(io.getItem(foundationsV2Key));
    expect(persisted.issue).toBeNull();
    expect(v2Facts(persisted.save).active).toBe(false);
    expect(persisted.save.events.slice(-2).map((e) => e.kind)).toEqual(['aid', 'abandon']);
    const reloaded = new FoundationsV2Store(io);
    reloaded.load();
    expect(reloaded.getSnapshot().save).toEqual(store.getSnapshot().save);
    expect(reloaded.leaveForNavigation(0, true)).toBe(false);
  });
  it('denied/no-op/readback-conflicting writes never publish a false closure or result', () => {
    for (const mode of ['denied', 'noop', 'overwrite', 'read-denied']) {
      const io = storage();
      const old = io.getItem(foundationsV2Key);
      const store = new FoundationsV2Store(io);
      store.load();
      if (mode === 'read-denied')
        io.getItem = () => {
          throw Error('denied');
        };
      else
        io.setItem = (key, value) => {
          if (mode === 'denied') throw Error('denied');
          if (mode === 'overwrite') io.data.set(key, value + ' ');
        };
      expect(store.leaveForNavigation(0, true), mode).toBe(false);
      expect(v2Facts(store.getSnapshot().save).active, mode).toBe(true);
      expect(v2Facts(store.getSnapshot().save).submissions).toEqual([]);
      expect(store.getSnapshot().issue).not.toBeNull();
      if (mode !== 'overwrite') expect(io.data.get(foundationsV2Key)).toBe(old);
    }
  });
  it('stale tabs cannot submit/abandon a newer attempt, including identical stale-event dedup', () => {
    const io = storage();
    const a = new FoundationsV2Store(io),
      b = new FoundationsV2Store(io);
    a.load();
    b.load();
    expect(a.leaveForNavigation(0, false)).toBe(true);
    expect(a.event({ kind: 'begin' })).toBe(true);
    const current = io.getItem(foundationsV2Key);
    expect(b.event({ kind: 'draft', answers: { host: 'finite', shortfall: '3' } })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    expect(b.leaveForNavigation(0, true)).toBe(false);
    expect(b.event({ kind: 'submit', answers })).toBe(false);
    expect(io.getItem(foundationsV2Key)).toBe(current);
    expect(a.leaveForNavigation(0, false)).toBe(false);
  });
});

import { createHash } from 'node:crypto';
import legacy from '../../../docs/reviews/evidence/pr51-owner-legacy-v2.json';
it('matches independently captured baseline schema2 facts and rubric byte-for-byte including active drafts and all prior submissions', () => {
  expect(createHash('sha256').update(JSON.stringify(v2Criteria)).digest('hex')).toBe(
    legacy.rubricSHA256,
  );
  for (const fixture of legacy.cases) {
    const restored = restoreV2(JSON.stringify(fixture.save));
    expect(restored.issue, fixture.name).toBeNull();
    expect(restored.save, fixture.name).toEqual(fixture.save);
    const actual = JSON.parse(JSON.stringify(v2Facts(restored.save)));
    expect(actual.abandoned).toEqual([]);
    delete actual.abandoned;
    expect(actual, fixture.name).toEqual(fixture.facts);
  }
});

it('keeps schema3 aid/submit terminal reserve usable after a normal action reports capacity limit', () => {
  let save: FoundationsV2Save = { ...active(), schema: 3, lifecycle: '1.0.0' };
  while (save.events.length < 600)
    save = event(save, { kind: 'draft', answers: { shortfall: String(save.events.length % 12) } });
  const io = storage(JSON.stringify(save)),
    store = new FoundationsV2Store(io);
  store.load();
  expect(store.event({ kind: 'draft', answers: { shortfall: '2' } })).toBe(false);
  expect(store.getSnapshot().issue).toBe('limit');
  expect(store.event({ kind: 'aid' })).toBe(true);
  expect(store.event({ kind: 'submit', answers })).toBe(true);
  expect(v2Facts(restoreV2(io.getItem(foundationsV2Key)).save).submissions[0]).toMatchObject({
    assisted: true,
    retry: false,
  });
});
