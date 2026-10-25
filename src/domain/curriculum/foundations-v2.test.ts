import { describe, it, expect } from 'vitest';
import {
  applyV2,
  freshV2,
  restoreV2,
  v2Facts,
  hostAllocation,
  provisioningResult,
  v2Bindings,
  v2Topics,
  v2Criteria,
  foundationsV2Key,
  registrationResult,
  type FoundationsV2Save,
} from './foundations-v2';
import { FoundationsV2Store } from './v2-store';
import { freshLearning, learningKey, restoreLearning, initialProbe } from './foundations';
import { capacityProof } from '../design-proof/capacity';
import { nb } from '@/content/nb';
const event = (s: FoundationsV2Save, e: unknown) => {
  const n = applyV2(s, e);
  expect(n).not.toBeNull();
  return n!;
};
describe('Foundations 2.0.0 version boundaries and instructional contracts', () => {
  it('binds S01–S13, V01–V06 and every official objective to real manuscripts without SME claims', () => {
    expect(v2Bindings.map((b) => b.topic)).toEqual(v2Topics);
    expect(new Set(v2Bindings.flatMap((b) => b.storyboard)).size).toBe(13);
    for (const b of v2Bindings) {
      const c = nb.foundationsV2.topics[b.topic];
      expect(c.title && c.text && c.detail && c.objective).toBeTruthy();
      expect(b.sources.length).toBeGreaterThan(0);
    }
    for (const id of ['FC01', 'FC02', 'FC03', 'FC04', 'FC05', 'FC06', 'FC07'])
      expect(v2Bindings.some((b) => (b.objectives as readonly string[]).includes(id))).toBe(true);
    expect(
      v2Criteria.every((c) =>
        [...nb.foundationsV2.extraItems, ...nb.foundations.transferItems].some(
          (i) => i.id === c.id,
        ),
      ),
    ).toBe(true);
  });
  it('does not infer learning from navigation and rejects events without their taught context', () => {
    let s = freshV2();
    expect(applyV2(s, { kind: 'check', topic: 'intro-request', answer: 'server' })).toBeNull();
    s = event(s, { kind: 'visit', topic: 'intro-request' });
    s = event(s, { kind: 'check', topic: 'intro-request', answer: 'server' });
    expect(v2Facts(s).guided('intro-request')).toBe(false);
    s = event(s, { kind: 'request' });
    expect(v2Facts(s).guided('intro-request')).toBe(true);
    expect(v2Facts(s).complete).toBe(false);
    expect(applyV2(s, { kind: 'visit', topic: 'unknown' })).toBeNull();
  });
  it('rejects over-budget guest allocation without mutation and retains the accepted budget on replay', () => {
    const accepted: [number, number] = [5, 3];
    expect(hostAllocation(accepted, [5, 4])).toEqual({
      requested: [5, 4],
      accepted: [5, 3],
      outcome: 'rejected',
    });
    expect(accepted).toEqual([5, 3]);
    expect(hostAllocation([3, 3], [5, 3]).outcome).toBe('accepted');
    expect(hostAllocation([3, 3], [NaN, 3]).outcome).toBe('rejected');
    let s = event(freshV2(), { kind: 'visit', topic: 'virtualization' });
    s = event(s, { kind: 'memory', requested: [5, 3] });
    s = event(s, { kind: 'memory', requested: [5, 4] });
    expect(v2Facts(restoreV2(JSON.stringify(s)).save).memory).toEqual([5, 3]);
    expect(provisioningResult(false)).toBe('unavailable');
    expect(provisioningResult(true)).toBe('allocated');
  });
  it('preserves first predictions, requires executed comparisons and never silently recomputes a run', () => {
    let s = event(freshV2(), { kind: 'visit', topic: 'v2-capacity' });
    s = event(s, { kind: 'capacity', allocation: 6, prediction: 9 });
    s = event(s, { kind: 'check', topic: 'v2-capacity', answer: 'same-hour' });
    expect(v2Facts(s).guided('v2-capacity')).toBe(false);
    s = event(s, { kind: 'capacity', allocation: 10, prediction: 0 });
    expect(v2Facts(s).guided('v2-capacity')).toBe(true);
    expect(v2Facts(s).runs[0]?.prediction).toBe(9);
    expect(capacityProof({ allocation: 6, demand: [3, 3, 8, 3] })).toMatchObject({
      peakUnmet: 2,
      unusedTotal: 9,
    });
    expect(capacityProof({ allocation: 10, demand: [3, 3, 8, 3] })).toMatchObject({
      peakUnmet: 0,
      unusedTotal: 23,
    });
    expect(registrationResult()).toMatchObject({
      peakUnmet: 2,
      unusedTotal: 8,
    });
    expect(applyV2(s, { kind: 'capacity', allocation: 5, prediction: 2 })).toBeNull();
  });
  it('isolates the reused later-unit evaluator from all v1 data and rejects transfer injection', () => {
    let s = freshV2();
    expect(
      applyV2(s, {
        kind: 'practice',
        event: { kind: 'probe', unit: 'models', input: initialProbe, prediction: 0 },
      }),
    ).toBeNull();
    s = event(s, { kind: 'practice', event: { kind: 'visit', unit: 'models' } });
    expect(v2Facts(s).observed.observations.models.introduced).toBe(true);
    expect(freshLearning().events).toEqual([]);
    expect(applyV2(s, { kind: 'practice', event: { kind: 'begin-transfer' } })).toBeNull();
  });
  it('commits the entire changed task before feedback, retains first/help/retry, drafts and invalid answer rejection', () => {
    const correct = Object.fromEntries(v2Criteria.map((c) => [c.id, c.answer]));
    let s = event(freshV2(), { kind: 'begin' });
    s = event(s, { kind: 'draft', answers: { shortfall: '9' } });
    expect(v2Facts(restoreV2(JSON.stringify(s)).save).draft.shortfall).toBe('9');
    expect(v2Facts(s).submissions).toEqual([]);
    expect(applyV2(s, { kind: 'submit', answers: { shortfall: '2' } })).toBeNull();
    expect(applyV2(s, { kind: 'draft', answers: { shortfall: '999' } })).toBeNull();
    s = event(s, { kind: 'submit', answers: { ...correct, shortfall: '9' } });
    s = event(s, { kind: 'begin' });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'submit', answers: correct });
    const f = v2Facts(s);
    expect(f.submissions[0]).toMatchObject({
      assisted: false,
      retry: false,
      criteria: { shortfall: false },
    });
    expect(f.submissions[1]).toMatchObject({ assisted: true, retry: true });
    expect(restoreV2(JSON.stringify(s)).save).toEqual(s);
  });
  it('quarantines malformed/unknown records, stops stale writes, reports denied storage and preserves the old raw record', () => {
    const old = JSON.stringify(freshLearning()),
      data = new Map([[learningKey, old]]);
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const a = new FoundationsV2Store(storage),
      b = new FoundationsV2Store(storage);
    a.load();
    b.load();
    a.choose('v2');
    expect(b.choose('v1')).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    a.event({ kind: 'visit', topic: 'intro-request' });
    a.clear();
    expect(data.get(learningKey)).toBe(old);
    expect(restoreLearning(old).issue).toBeNull();
    expect(restoreV2('{').issue).toBe('corrupt');
    expect(restoreV2(JSON.stringify({ ...freshV2(), model: '9' })).issue).toBe('unsupported');
    expect(
      restoreV2(JSON.stringify({ ...freshV2(), events: [{ kind: 'submit', answers: {} }] })).issue,
    ).toBe('corrupt');
    storage.setItem(foundationsV2Key, '{');
    a.load();
    expect(a.event({ kind: 'visit', topic: 'intro-request' })).toBe(false);
    const denied = new FoundationsV2Store({
      ...storage,
      getItem: () => null,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    denied.event({ kind: 'visit', topic: 'intro-request' });
    expect(denied.getSnapshot().issue).toBe('unsaved');
    expect(denied.getSnapshot().save.events.length).toBe(1);
  });
});
