import { describe, expect, it } from 'vitest';
import { refinedAssessmentNb as c } from '@/content/nb';
import {
  tracks,
  fresh as legacyFresh,
  apply as legacyApply,
  facts as legacyFacts,
  restore as legacyRestore,
} from './expansion';
import {
  applyRefined,
  freshRefined,
  refinedItems,
  refinedFacts,
  gradeRefined,
  restoreRefined,
  refinedKeys,
  refinedLimit,
  type RefinedSave,
  type RefinedAnswers,
} from './refined-assessment';
import { RefinedStore } from './refined-assessment-store';
const event = (s: RefinedSave, e: unknown) => {
  const n = applyRefined(s, e);
  expect(n).not.toBeNull();
  return n!;
};
const valid = (s: RefinedSave) => {
  for (const i of refinedItems(s.track)) {
    const [decision, reason] = c.feedback[i.id].pairs[0]!;
    for (const [field, value] of Object.entries({
      decision,
      reason,
      ...(i.id === 'b-capacity' ? { number: '5' } : {}),
    }))
      s = event(s, { kind: 'answer', item: i.id, field, value });
  }
  return s;
};
describe('PR46 bounded versioned successor contracts', () => {
  for (const track of tracks) {
    it(`${track}: paired decisions, exact display reconstruction and immutable first/help/retry/abandon`, () => {
      let s = event(freshRefined(track), { kind: 'begin' });
      s = valid(s);
      s = event(s, { kind: 'submit' });
      const first = JSON.stringify(refinedFacts(s).first);
      expect(refinedFacts(s).first!.result!.every((r) => r.correct)).toBe(true);
      s = event(s, { kind: 'begin' });
      s = event(s, { kind: 'aid' });
      s = event(s, { kind: 'abandon' });
      s = event(s, { kind: 'begin' });
      s = valid(s);
      s = event(s, { kind: 'aid' });
      s = event(s, { kind: 'submit' });
      expect(JSON.stringify(refinedFacts(s).first)).toBe(first);
      expect(refinedFacts(s).submissions[1]).toMatchObject({ retry: true, assisted: true });
      expect(restoreRefined(track, JSON.stringify(s))).toEqual({ save: s, issue: null });
      expect(restoreRefined(track, JSON.stringify({ ...s, presentation: 'next' })).issue).toBe(
        'unsupported',
      );
    });
    it(`${track}: no content-blind positional or length strategy earns full credit`, () => {
      const strategies = {
        first: () => 0,
        second: () => 1,
        last: (xs: readonly { text: string }[]) => xs.length - 1,
        longest: (xs: readonly { text: string }[]) =>
          xs.reduce((best, x, n) => (x.text.length > xs[best]!.text.length ? n : best), 0),
        shortest: (xs: readonly { text: string }[]) =>
          xs.reduce((best, x, n) => (x.text.length < xs[best]!.text.length ? n : best), 0),
        absolute: (xs: readonly { text: string }[]) =>
          xs.reduce(
            (best, x, n) =>
              (x.text.match(/alltid|automatisk|garanter|alle|samme/gi) || []).length >
              (xs[best]!.text.match(/alltid|automatisk|garanter|alle|samme/gi) || []).length
                ? n
                : best,
            0,
          ),
      };
      for (const choose of Object.values(strategies)) {
        const answers: RefinedAnswers = {};
        for (const i of refinedItems(track))
          answers[i.id] = {
            decision: i.decisions[choose(i.decisions)]!.id,
            reason: i.reasons[choose(i.reasons)]!.id,
            ...(i.id === 'b-capacity' ? { number: '5' } : {}),
          };
        expect(gradeRefined(track, answers).every((r) => r.correct)).toBe(false);
      }
    });
    it(`${track}: every answer pair matches explicit rubric, not position`, () => {
      for (const i of refinedItems(track))
        for (const d of i.decisions)
          for (const r of i.reasons) {
            const result = gradeRefined(track, {
              [i.id]: { decision: d.id, reason: r.id, number: '5' },
            }).find((x) => x.id === i.id)!.correct;
            expect(result).toBe(c.feedback[i.id].pairs.some(([a, b]) => a === d.id && b === r.id));
          }
    });
  }
  it('no deterministic mapping from decision position to reason position solves a whole form', () => {
    for (const track of tracks)
      for (let a = 0; a < 3; a++)
        for (let b = 0; b < 3; b++)
          for (let d = 0; d < 3; d++) {
            const mapping = [a, b, d];
            expect(
              refinedItems(track).every((i) =>
                c.feedback[i.id].pairs.some(
                  ([decision, reason]) =>
                    mapping[i.decisions.findIndex((o) => o.id === decision)] ===
                    i.reasons.findIndex((o) => o.id === reason),
                ),
              ),
            ).toBe(false);
          }
  });
  it('numeric result is scoped to new scenario; incompatible IaaS/PaaS cross pairs fail', () => {
    expect(
      gradeRefined('benefits', {
        'b-capacity': { decision: 'add', reason: 'capacity', number: '1' },
      })[0]!.correct,
    ).toBe(false);
    expect(
      gradeRefined('benefits', {
        'b-capacity': { decision: 'add', reason: 'capacity', number: '005' },
      })[0]!.correct,
    ).toBe(true);
    for (const [d, r, ok] of [
      ['iaas', 'os', true],
      ['paas', 'platform', true],
      ['iaas', 'platform', false],
      ['paas', 'os', false],
    ] as const)
      expect(
        gradeRefined('services', { 's-choice': { decision: d, reason: r } }).find(
          (x) => x.id === 's-choice',
        )!.correct,
      ).toBe(ok);
  });
  it('rejects malformed, cross-track, premature, future and over-bound replay with terminal reserve', () => {
    let s = freshRefined('benefits');
    expect(applyRefined(s, { kind: 'submit' })).toBeNull();
    s = event(s, { kind: 'begin' });
    expect(applyRefined(s, { kind: 'begin' })).toBeNull();
    expect(applyRefined(s, { kind: 'submit' })).toBeNull();
    for (const e of [
      { kind: 'answer', item: 's-driver', field: 'decision', value: 'iaas' },
      { kind: 'answer', item: 'b-capacity', field: ['decision'], value: 'capacity' },
      { kind: 'answer', item: 'b-capacity', field: 'decision', value: 'unknown' },
      { kind: 'answer', item: 'b-capacity', field: 'number', value: '5.0' },
      { kind: 'aid', extra: true },
    ])
      expect(applyRefined(s, e)).toBeNull();
    s = valid(s);
    while (s.events.length < refinedLimit - 3)
      s = event(s, { kind: 'answer', item: 'b-capacity', field: 'number', value: '5' });
    expect(
      applyRefined(s, { kind: 'answer', item: 'b-capacity', field: 'number', value: '4' }),
    ).toBeNull();
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'submit' });
    expect(restoreRefined('benefits', JSON.stringify(s)).issue).toBeNull();
    expect(restoreRefined('benefits', 'x'.repeat(220001)).issue).toBe('corrupt');
    expect(
      restoreRefined(
        'benefits',
        JSON.stringify({ ...freshRefined('benefits'), events: [{ kind: 'submit' }] }),
      ).issue,
    ).toBe('corrupt');
  });
  it('durable-only writes, stale writer, readback rejection and compare-before-delete recovery', () => {
    const data = new Map<string, string>();
    let denied = false;
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        if (denied) throw Error('quota');
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const a = new RefinedStore('benefits', storage),
      b = new RefinedStore('benefits', storage);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin' })).toBe(true);
    expect(b.event({ kind: 'begin' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    for (const e of valid(event(freshRefined('benefits'), { kind: 'begin' })).events.slice(1))
      expect(a.event(e)).toBe(true);
    denied = true;
    expect(a.event({ kind: 'submit' })).toBe(false);
    expect(refinedFacts(a.getSnapshot().save).first).toBeNull();
    a.load();
    expect(a.prepareTeaching()).toBe(false);
    expect(refinedFacts(a.getSnapshot().save).assisted).toBe(false);
    a.load();
    denied = false;
    expect(a.prepareTeaching()).toBe(true);
    data.set(refinedKeys.benefits, 'bad');
    a.load();
    data.set(refinedKeys.benefits, JSON.stringify(freshRefined('benefits')));
    expect(a.recoverInvalid()).toBe(false);
    expect(data.has(refinedKeys.benefits)).toBe(true);
    const silent = new RefinedStore('services', { ...storage, setItem: () => {} });
    silent.load();
    expect(silent.event({ kind: 'begin' })).toBe(false);
    expect(refinedFacts(silent.getSnapshot().save).active).toBe(false);
  });
  it('old replay and original paired rubrics retain their original results', () => {
    for (const track of tracks) {
      let s = legacyApply(legacyFresh(track), { kind: 'begin' })!;
      const answers =
        track === 'benefits'
          ? {
              unmet: '1',
              dependency: 'restore',
              policy: 'one-rule',
              template: 'review',
              sustainability: 'data',
              forecast: 'usage',
            }
          : {
              guest: 'iaas',
              patch: 'customer',
              runtime: 'adapt',
              departure: 'access',
              architecture: 'iaas',
              reason: 'os-team',
              hosting: 'plan',
            };
      s = legacyApply(s, { kind: 'draft', answers })!;
      s = legacyApply(s, { kind: 'submit' })!;
      const raw = JSON.stringify(s);
      expect(legacyRestore(track, raw).save).toEqual(s);
      expect(Object.values(legacyFacts(s).submissions[0]!.criteria).every(Boolean)).toBe(true);
      expect(restoreRefined(track, raw).issue).toBeTruthy();
    }
  });
});
