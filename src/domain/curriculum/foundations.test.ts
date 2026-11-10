import { describe, it, expect } from 'vitest';
import {
  applyLearning,
  experiment,
  freshLearning,
  initialProbe,
  learningFacts,
  parseLearningEvent,
  restoreLearning,
  learningKey,
  type LearningSave,
  type LearningEvent,
} from './foundations';
import { unitIds, transferCriteria } from './manifest';
import { LearningStore } from './store';
const answers = Object.fromEntries(transferCriteria.map((c) => [c.id, c.answer]));
function event(s: LearningSave, e: LearningEvent) {
  const next = applyLearning(s, e);
  expect(next).not.toBeNull();
  return next!;
}
describe('bounded capacity, ownership and pricing investigation', () => {
  it('calculates actual shortfall, idle, utilization and synthetic cost deterministically without mutating input', () => {
    const original = structuredClone(initialProbe),
      a = experiment(initialProbe);
    expect(a).toEqual({
      demand: [2, 2, 10, 2],
      allocated: [6, 6, 6, 6],
      served: [2, 2, 6, 2],
      shortfall: 4,
      idle: 12,
      utilization: 50,
      cost: 36,
      commitmentUnused: 0,
      overflow: 0,
    });
    expect(experiment(initialProbe)).toEqual(a);
    expect(initialProbe).toEqual(original);
    expect(experiment({ ...initialProbe, mode: 'cloud' }).cost).toBe(32);
    expect(experiment({ ...initialProbe, profile: 'steady' }).cost).toBe(36);
    expect(experiment({ ...initialProbe, profile: 'steady', mode: 'cloud' }).cost).toBe(48);
  });
  it('does not universally favor cloud or commitment; idle provisioned compute remains metered', () => {
    expect(experiment({ ...initialProbe, profile: 'uncertain', mode: 'cloud' }).cost).toBe(8);
    expect(
      experiment({ ...initialProbe, profile: 'uncertain', mode: 'cloud', pricing: 'commitment' })
        .cost,
    ).toBe(24);
    expect(
      experiment({ ...initialProbe, profile: 'steady', mode: 'cloud', pricing: 'commitment' }).cost,
    ).toBe(24);
    expect(experiment({ ...initialProbe, profile: 'idle', mode: 'cloud' }).cost).toBe(48);
    expect(
      experiment({ ...initialProbe, profile: 'idle', mode: 'cloud', released: true }).cost,
    ).toBe(0);
    expect(
      experiment({
        ...initialProbe,
        profile: 'idle',
        mode: 'cloud',
        released: true,
        pricing: 'commitment',
      }).cost,
    ).toBe(24);
  });
  it('requires paired investigations and actual correct guided decisions, never visits or one service answer', () => {
    let s = freshLearning();
    for (const unit of unitIds) s = event(s, { kind: 'visit', unit });
    expect(learningFacts(s).guidedComplete).toBe(false);
    expect(
      applyLearning(s, { kind: 'answer', unit: 'capacity', answer: 'provisioning' }),
    ).toBeNull();
    for (const profile of ['campaign', 'steady'] as const)
      for (const mode of ['owned', 'cloud'] as const)
        s = event(s, {
          kind: 'probe',
          unit: 'capacity',
          input: { ...initialProbe, profile, mode },
          prediction: 9,
        });
    s = event(s, { kind: 'answer', unit: 'capacity', answer: 'internet' });
    expect(learningFacts(s).observations.capacity.guided).toBe(false);
    s = event(s, { kind: 'answer', unit: 'capacity', answer: 'provisioning' });
    expect(learningFacts(s).observations.capacity.guided).toBe(true);
    expect(learningFacts(s).guidedComplete).toBe(false);
    expect(learningFacts(s).observations.capacity.probes[0]?.prediction).toBe(9);
  });
  it('separates first unaided criteria, help, retries and guided completion', () => {
    let s = event(freshLearning(), { kind: 'begin-transfer' });
    s = event(s, { kind: 'submit', answers: { ...answers, shortfall: '4' } });
    expect(learningFacts(s).evidence.FC02.independent).toBe(false);
    expect(learningFacts(s).evidence.FC01.independent).toBe(true);
    s = event(s, { kind: 'begin-transfer' });
    s = event(s, { kind: 'submit', answers });
    expect(learningFacts(s).submissions[1]?.retry).toBe(true);
    expect(learningFacts(s).evidence.FC02.independent).toBe(false);
    expect(learningFacts(s).guidedComplete).toBe(false);
    let aided = event(freshLearning(), { kind: 'begin-transfer' });
    aided = event(aided, { kind: 'aid' });
    aided = event(aided, { kind: 'submit', answers });
    expect(learningFacts(aided).evidence.FC01.independent).toBe(false);
    let teaching = event(freshLearning(), { kind: 'begin-transfer' });
    teaching = event(teaching, { kind: 'visit', unit: 'capacity' });
    teaching = event(teaching, { kind: 'submit', answers });
    expect(learningFacts(teaching).submissions[0]?.assisted).toBe(true);
  });
  it('replays pinned evidence, suppresses duplicate observations and quarantines corrupt/unknown results', () => {
    const s = event(freshLearning(), { kind: 'visit', unit: 'capacity' });
    expect(applyLearning(s, { kind: 'visit', unit: 'capacity' })).toBe(s);
    expect(restoreLearning(JSON.stringify(s))).toEqual({ save: s, issue: null });
    expect(restoreLearning('{broken').issue).toBe('corrupt');
    expect(restoreLearning(JSON.stringify({ ...s, content: '2.0.0' })).issue).toBe('unsupported');
    expect(restoreLearning(JSON.stringify({ ...s, completed: true })).issue).toBe('corrupt');
    expect(
      restoreLearning(JSON.stringify({ ...s, events: [{ kind: 'submit', answers }] })).issue,
    ).toBe('corrupt');
    expect(
      parseLearningEvent({
        kind: 'probe',
        unit: 'capacity',
        input: { ...initialProbe, capacity: NaN },
        prediction: 0,
      }),
    ).toBeNull();
    expect(parseLearningEvent({ kind: 'answer', unit: 'capacity', answer: 'script()' })).toBeNull();
    expect(parseLearningEvent({ kind: 'aid', score: 100 })).toBeNull();
    expect(
      parseLearningEvent({
        kind: 'probe',
        unit: 'capacity',
        input: { ...initialProbe, profile: ['steady'] },
        prediction: 0,
      }),
    ).toBeNull();
    expect(
      parseLearningEvent({
        kind: 'probe',
        unit: 'metering',
        input: { ...initialProbe, profile: 'idle', mode: 'cloud', pricing: 'commitment' },
        prediction: 0,
      }),
    ).toBeNull();
    expect(restoreLearning('x'.repeat(180001)).issue).toBe('corrupt');
  });
  it('accepts a constructed wrong numeric prediction as evidence but rejects unsupported values', () => {
    const s = event(event(freshLearning(), { kind: 'begin-transfer' }), {
      kind: 'submit',
      answers: { ...answers, shortfall: '2' },
    });
    expect(learningFacts(s).submissions[0]?.answers.shortfall).toBe('2');
    expect(learningFacts(s).evidence.FC02.independent).toBe(false);
    for (const shortfall of ['-1', '41', 'NaN', '2.5', ''])
      expect(parseLearningEvent({ kind: 'submit', answers: { ...answers, shortfall } })).toBeNull();
  });
  it('restores unfinished answer drafts without turning them into submitted evidence', () => {
    const s = event(event(freshLearning(), { kind: 'begin-transfer' }), {
      kind: 'draft',
      answers: { shortfall: '2', exclusive: 'private' },
    });
    const restored = restoreLearning(JSON.stringify(s));
    expect(restored.issue).toBeNull();
    expect(learningFacts(restored.save).draft).toEqual({ shortfall: '2', exclusive: 'private' });
    expect(learningFacts(restored.save).submissions).toHaveLength(0);
    expect(learningFacts(restored.save).evidence.FC02.independent).toBe(false);
    expect(
      applyLearning(freshLearning(), { kind: 'draft', answers: { shortfall: '2' } }),
    ).toBeNull();
    expect(parseLearningEvent({ kind: 'draft', answers: { unknown: 'yes' } })).toBeNull();
  });
  it('preserves legacy data, refuses stale writes, handles denied writes and explicit recovery', () => {
    const data = new Map<string, string>([['azurelab.progress.v1', 'legacy']]);
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const store = new LearningStore(storage);
    store.load();
    expect(store.event({ kind: 'visit', unit: 'models' })).toBe(true);
    const copy = new LearningStore(storage);
    copy.load();
    expect(copy.getSnapshot().save.unit).toBe('models');
    data.set(learningKey, JSON.stringify(freshLearning()));
    expect(store.event({ kind: 'visit', unit: 'pricing' })).toBe(false);
    expect(store.getSnapshot().issue).toBe('conflict');
    store.load();
    expect(store.event({ kind: 'visit', unit: 'pricing' })).toBe(true);
    store.clear();
    expect(data.get('azurelab.progress.v1')).toBe('legacy');
    const denied = new LearningStore({
      ...storage,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    denied.event({ kind: 'visit', unit: 'capacity' });
    expect(denied.getSnapshot().issue).toBe('unsaved');
    expect(denied.getSnapshot().save.events).toHaveLength(1);
    data.set(learningKey, 'bad');
    store.load();
    expect(store.getSnapshot().issue).toBe('corrupt');
    expect(store.event({ kind: 'visit', unit: 'pricing' })).toBe(false);
    expect(data.get(learningKey)).toBe('bad');
  });
});
