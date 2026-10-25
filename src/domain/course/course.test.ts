import { describe, it, expect } from 'vitest';
import { execute, freshEngine, type Engine, type Command } from '../chapter01/model';
import { parseLocation, portalHref } from '../portal/model';
import {
  courseHref,
  courseTopic,
  freshCourse,
  restoreCourse,
  startLab,
  labFacts,
  guideStep,
  guideDefinitions,
  stepIds,
  courseKey,
} from './model';
import { CourseStore } from './store';
import { nb } from '../../content/nb';
import { serviceSources } from '../portal/content';
import { competencies } from '../curriculum/manifest';
const run = (e: Engine, command: Command) =>
  execute(e, {
    commandId: `course-${e.ledger.length + 1}`,
    expectedWorldRevision: e.world.revision,
    command,
  });
function build() {
  let e = freshEngine();
  const session = startLab(e, 1);
  e = run(e, {
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    name: 'rg-course',
    metadataRegion: 'norwayeast',
  }).engine;
  const group = e.world.groups[0]!;
  e = run(e, {
    type: 'CreatePlan',
    groupId: group.id,
    name: 'plan-denied',
    region: 'northeurope',
    profile: 'linux-learning-v1',
  }).engine;
  const denied = e.ledger.at(-1)!.receipt;
  e = run(e, {
    type: 'CreatePlan',
    groupId: group.id,
    name: 'plan-course',
    region: 'westeurope',
    profile: 'linux-learning-v1',
  }).engine;
  const plan = e.world.resources[0]!;
  e = run(e, {
    type: 'CreateWebApp',
    groupId: group.id,
    name: 'app-course',
    planId: plan.id,
  }).engine;
  return { e, session, denied, app: e.world.resources[1]! };
}
describe('course and guided sandbox boundary', () => {
  it('allowlists course destinations and keeps a lab hint through actual portal navigation', () => {
    expect(courseTopic('services', 'https://bad')).toBe('overview');
    expect(courseHref('computing', 'bad')).toBe('/learn/computing?topic=capacity');
    const l = parseLocation(new URLSearchParams('lab=web-platform&area=groups'));
    expect(l.lab).toBe(true);
    expect(portalHref(l, 'create', { kind: 'group' })).toContain('lab=web-platform');
    expect(parseLocation(new URLSearchParams('lab=unknown')).lab).toBeUndefined();
  });
  it('has authored bounded definitions for each guide step, not scripts or counters', () => {
    expect(Object.keys(guideDefinitions)).toEqual([...stepIds]);
    for (const s of Object.values(guideDefinitions)) {
      expect(s.objective).toMatch(/G01|C01/);
      expect(s.returnTo).toBe('/learn/services?topic=practice');
      expect(s.validation).toMatch(/@1$/);
      expect(s.sourceIds.length).toBeGreaterThan(0);
      expect(s.sourceIds.every((id) => !!serviceSources[id]?.url)).toBe(true);
      expect(competencies).toContain(s.objective);
      expect(nb.course.guidance[s.copyKey]).toHaveLength(4);
      expect(nb.course.guidance[s.copyKey].every((v) => v.trim().length > 0)).toBe(true);
    }
  });
  it('requires real accepted builds, actual denial and validated relationship inspection', () => {
    const { e, session, denied, app } = build();
    const f = labFacts(session, e, 1);
    expect(f.verifiable).toBe(true);
    expect(f.complete).toBe(false);
    expect(f.group?.metadataLocation).toBe('norwayeast');
    expect(f.plan?.location).toBe('westeurope');
    expect(f.app?.id).toBe(app.id);
    expect(denied.beforeCount).toBe(denied.afterCount);
    expect(
      labFacts({ ...session, policy: denied.commandId, relationship: app.id }, e, 1).complete,
    ).toBe(true);
    expect(labFacts({ ...session, policy: 'invented', relationship: app.id }, e, 1).complete).toBe(
      false,
    );
  });
  it('does not accept a prior build or restarted/missing technical history', () => {
    const { e, session, denied, app } = build();
    const observed = { ...session, policy: denied.commandId, relationship: app.id };
    expect(labFacts(observed, e, 2).verifiable).toBe(false);
    expect(labFacts(observed, freshEngine(), 1).complete).toBe(false);
    expect(labFacts({ ...observed, boundary: 'missing' }, e, 1).verifiable).toBe(false);
    expect(labFacts(startLab(e, 1), e, 1).complete).toBe(false);
  });
  it('rejects tampered receipts and never makes a denied plan inventory', () => {
    const { e, session } = build();
    const copy = structuredClone(e);
    copy.ledger[1]!.receipt.outcome = 'accepted';
    expect(labFacts(session, copy, 1).verifiable).toBe(false);
    expect(e.world.resources.some((r) => r.name === 'plan-denied')).toBe(false);
  });
  it('does not turn technically valid wrong-subscription work into scenario success', () => {
    let e = freshEngine();
    const s = startLab(e, 1);
    e = run(e, {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
      name: 'rg-other',
    }).engine;
    expect(e.world.groups).toHaveLength(1);
    expect(labFacts(s, e, 1).group).toBeUndefined();
    expect(labFacts(s, e, 1).complete).toBe(false);
  });
  it('uses actual context and field values for highlighting while technical completion stays false', () => {
    const e = freshEngine(),
      s = startLab(e, 1),
      l = parseLocation(new URLSearchParams('lab=web-platform'));
    expect(guideStep(s, e, 1, l, null).id).toBe('find-groups');
    const create = { ...l, area: 'create' as const, kind: 'group' as const };
    const f = {
      step: 'basics',
      subscription: '',
      name: '',
      region: '',
      group: '',
      plan: '',
      valid: false,
    };
    expect(guideStep(s, e, 1, create, f).target).toBe('subscription');
    expect(guideStep(s, e, 1, create, { ...f, subscription: 'sub-app' }).target).toBe('name');
    expect(
      guideStep(s, e, 1, create, { ...f, subscription: 'sub-app', name: 'rg-course' }).target,
    ).toBe('region');
    expect(
      guideStep(s, e, 1, create, {
        ...f,
        subscription: 'sub-app',
        name: 'rg-course',
        region: 'norwayeast',
      }).id,
    ).toBe('review-group');
    expect(labFacts(s, e, 1).complete).toBe(false);
  });
  it('guides real denial inspection before accepted plan/app work', () => {
    const { e, session, denied } = build();
    const l = parseLocation(new URLSearchParams('lab=web-platform&area=activity'));
    expect(guideStep(session, e, 1, l, null).id).toBe('inspect-denial');
    expect(guideStep(session, e, 1, { ...l, area: 'policy' }, null).id).toBe('inspect-policy');
    expect(guideStep({ ...session, policy: denied.commandId }, e, 1, l, null).id).toBe(
      'architecture',
    );
  });
  it('strictly restores only versioned bounded records, not imported completion scores', () => {
    const s = {
      ...freshCourse(),
      resume: { module: 'services' as const, topic: 'practice' },
      lab: startLab(freshEngine(), 1),
    };
    expect(restoreCourse(JSON.stringify(s)).save).toEqual(s);
    for (const raw of [
      '{',
      JSON.stringify({ ...s, complete: true }),
      JSON.stringify({ ...s, resume: { module: 'services', topic: 'bad' } }),
      JSON.stringify({ ...s, lab: { ...s.lab, attempt: 0 } }),
      'x'.repeat(8001),
    ])
      expect(restoreCourse(raw).issue).toBe('corrupt');
    expect(restoreCourse('{"schema":2}').issue).toBe('unsupported');
  });
  it('preserves context, quarantines corruption, detects conflicts and keeps denied writes in memory', () => {
    const data = new Map<string, string>([['old-awards', 'untouched']]);
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const store = new CourseStore(storage);
    store.load();
    expect(store.getServerSnapshot().ready).toBe(false);
    expect(store.getSnapshot().ready).toBe(true);
    expect(store.update({ ...freshCourse(), resume: { module: 'services', topic: 'paas' } })).toBe(
      true,
    );
    const restored = new CourseStore(storage);
    restored.load();
    expect(restored.getSnapshot().save.resume?.topic).toBe('paas');
    data.set(courseKey, '{}');
    expect(store.update(freshCourse())).toBe(false);
    expect(store.getSnapshot().issue).toBe('conflict');
    restored.load();
    expect(restored.getSnapshot().issue).toBe('unsupported');
    expect(restored.update(freshCourse())).toBe(false);
    restored.clear();
    expect(data.get('old-awards')).toBe('untouched');
    const denied = new CourseStore({
      ...storage,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    denied.update({ ...freshCourse(), resume: { module: 'computing', topic: 'pricing' } });
    expect(denied.getSnapshot().issue).toBe('unsaved');
    expect(denied.getSnapshot().save.resume?.topic).toBe('pricing');
  });
});
