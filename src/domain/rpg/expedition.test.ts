import { describe, expect, it } from 'vitest';
import {
  freshLearning,
  initialProbe,
  applyLearning,
  type LearningSave,
} from '@/domain/curriculum/foundations';
import { unitIds } from '@/domain/curriculum/manifest';
import { freshAttempt, applyEvent } from '@/domain/chapter01/scenario';
import { freshGame } from './persistence';
import { expeditionFacts, orientationKey, parseOrientation } from './expedition';
import { OrientationStore } from './orientation-store';
import { entryNode, storyFacts } from './story';

describe('authoritative expedition projection', () => {
  it('recognizes an older saved walk as navigation history without creating learning evidence', () => {
    const game = { ...freshGame(), pose: { x: 0, z: 9, yaw: Math.PI } };
    const facts = expeditionFacts(freshLearning(), game, freshAttempt());
    expect(facts.hasNavigationHistory).toBe(true);
    expect(facts.hasHistory).toBe(false);
    expect(Object.values(facts.statuses).every((s) => s === 'available')).toBe(true);
    expect(facts.lesson.guidedComplete).toBe(false);
    expect(expeditionFacts(freshLearning(), freshGame(), freshAttempt()).hasNavigationHistory).toBe(
      false,
    );
  });
  it('recommends Foundations without converting orientation/visits/acceptance into learning', () => {
    const save = freshLearning(),
      story = freshGame(),
      attempt = freshAttempt();
    const before = structuredClone({ save, story, attempt });
    const initial = expeditionFacts(save, story, attempt);
    expect(initial.recommended).toBe('foundations');
    expect(initial.hasHistory).toBe(false);
    const met = expeditionFacts(save, { events: [{ kind: 'meet', npc: 'guide' }] }, attempt);
    expect(met.metGuide).toBe(true);
    expect(met.hasModels).toBe(false);
    expect(met.quest.accepted).toBe(false);
    expect(Object.values(initial.statuses).every((s) => s === 'available')).toBe(true);
    const visited = applyLearning(save, { kind: 'visit', unit: 'models' })!;
    const next = expeditionFacts(visited, { events: [{ kind: 'accept' }] }, attempt);
    expect(next.lastUnit).toBe('models');
    expect(next.lesson.observations.models.introduced).toBe(true);
    expect(next.lesson.observations.models.guided).toBe(false);
    expect(next.statuses.foundations).toBe('in-progress');
    expect(next.statuses.assignment).toBe('in-progress');
    expect(next.recommended).toBe('service');
    expect(next.statuses.infrastructure).toBe('available');
    expect({ save, story, attempt }).toEqual(before);
  });
  it('prioritizes real unfinished work even before a resource exists; reset removes that recommendation', () => {
    const a = applyEvent(freshAttempt(), {
      kind: 'responsibility',
      model: 'paas',
      os: 'microsoft',
      code: 'customer',
    })!;
    const f = expeditionFacts(freshLearning(), freshGame(), a);
    expect(a.engine.world.revision).toBe(0);
    expect(f.recommended).toBe('infrastructure');
    expect(f.findings.filter((x) => x.met).map((x) => x.id)).toEqual(['responsibility']);
    expect(f.built).toBe(false);
    expect(expeditionFacts(freshLearning(), freshGame(), freshAttempt()).recommended).toBe(
      'foundations',
    );
    expect(entryNode('engineer', freshGame(), { hasWork: true, guidedBuilt: false })).toBe(
      'engineer-progress',
    );
  });
  it('requires every guided predicate and keeps the independent task separate', () => {
    let s: LearningSave = freshLearning();
    for (const unit of unitIds) {
      s = applyLearning(s, { kind: 'visit', unit })!;
      const inputs =
        unit === 'capacity'
          ? ['campaign', 'steady'].flatMap((profile) =>
              ['owned', 'cloud'].map((mode) => ({ ...initialProbe, profile, mode })),
            )
          : unit === 'models'
            ? ['public', 'private', 'hybrid'].map((topology) => ({ ...initialProbe, topology }))
            : unit === 'metering'
              ? [false, true].map((released) => ({
                  ...initialProbe,
                  profile: 'idle',
                  mode: 'cloud',
                  released,
                }))
              : unit === 'pricing'
                ? ['steady', 'uncertain'].flatMap((profile) =>
                    ['usage', 'commitment'].map((pricing) => ({
                      ...initialProbe,
                      mode: 'cloud',
                      profile,
                      pricing,
                    })),
                  )
                : [{ ...initialProbe, ...(unit === 'responsibility' ? { mode: 'cloud' } : {}) }];
      for (const input of inputs) {
        const next = applyLearning(s, { kind: 'probe', unit, input, prediction: 4 });
        expect(next).not.toBeNull();
        s = next!;
      }
      const answer = {
        capacity: 'provisioning',
        responsibility: 'provider,customer,customer',
        models: 'private',
        placement: 'public,private,hybrid',
        metering: 'allocated',
        pricing: 'usage',
      }[unit];
      s = applyLearning(s, { kind: 'answer', unit, answer })!;
    }
    const f = expeditionFacts(s, freshGame(), freshAttempt());
    expect(f.statuses.foundations).toBe('guided-completed');
    expect(f.recommended).toBe('service');
    expect(f.lesson.submissions).toHaveLength(0);
    expect(Object.values(f.lesson.evidence).some((x) => x.independent)).toBe(false);
    const corrected = applyLearning(s, { kind: 'answer', unit: 'pricing', answer: 'commitment' });
    expect(corrected).not.toBeNull();
    expect(expeditionFacts(corrected!, freshGame(), freshAttempt()).statuses.foundations).not.toBe(
      'guided-completed',
    );
  });
});

it('allows an explicit technical debrief without inventing prerequisite mastery', () => {
  const reported = storyFacts(
    { events: [{ kind: 'report' }] },
    { hasWork: true, guidedBuilt: true },
  );
  expect(reported.reported).toBe(true);
  expect(reported.canDebrief).toBe(true);
  expect(reported.challenge).toBe(false);
  expect(reported.accepted).toBe(false);
  expect(reported.compared).toBe(false);
  expect(
    storyFacts({ events: [{ kind: 'report' }] }, { hasWork: true, guidedBuilt: false }).reported,
  ).toBe(false);
});

describe('non-evidentiary orientation preferences', () => {
  it.each([
    'broken',
    '{}',
    '[]',
    '{"schema":2,"seen":true,"goal":null}',
    '{"schema":1,"seen":true,"goal":"fake"}',
    'x'.repeat(501),
  ])('quarantines invalid/unsupported preferences: %s', (raw) => {
    expect(parseOrientation(raw)).toBeNull();
    let disk = raw;
    const store = new OrientationStore({
      getItem: () => disk,
      setItem: (_, value) => {
        disk = value;
      },
      removeItem: () => {
        disk = '';
      },
    });
    store.load();
    store.update({ seen: true });
    expect(store.getSnapshot().issue).toBe(true);
    expect(disk).toBe(raw);
  });
  it('saves only preferences, detects stale tabs, handles denied writes and clears only its key', () => {
    const disk = new Map<string, string>([['azurelab.progress.v1', 'legacy']]);
    const port = {
      getItem: (k: string) => disk.get(k) ?? null,
      setItem: (k: string, v: string) => {
        disk.set(k, v);
      },
      removeItem: (k: string) => {
        disk.delete(k);
      },
    };
    const a = new OrientationStore(port),
      b = new OrientationStore(port);
    a.load();
    b.load();
    a.update({ seen: true, goal: 'infrastructure' });
    expect(parseOrientation(disk.get(orientationKey)!)).toEqual({
      schema: 1,
      seen: true,
      goal: 'infrastructure',
    });
    b.update({ goal: 'foundations' });
    expect(b.getSnapshot().issue).toBe(true);
    expect(parseOrientation(disk.get(orientationKey)!)?.goal).toBe('infrastructure');
    const denied = new OrientationStore({
      ...port,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    denied.update({ seen: true });
    expect(denied.getSnapshot().issue).toBe(true);
    a.clear();
    expect(disk.get(orientationKey)).toBeUndefined();
    expect(disk.get('azurelab.progress.v1')).toBe('legacy');
  });
});
