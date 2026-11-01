import { describe, expect, it } from 'vitest';
import {
  freshSecurity,
  applySecurity,
  securityFacts,
  securityMissions,
  securityGuidedFacts,
  securityGuidedAnswer,
  securityHref,
  type SecuritySave,
} from '@/domain/curriculum/security';
import { securityNb } from '@/content/nb';
import { securityContrasts } from '../../../tests/fixtures/security';
import { guidedNext, guidedResume, projectGuides } from './learning-flow';

function fixture() {
  let save = freshSecurity();
  let writes = 0;
  const send = (event: unknown) => {
    const next = applySecurity(save, event);
    if (!next) throw Error('invalid test event');
    save = next;
  };
  const module = (issue: string | null = null, ready = true) =>
    projectGuides(
      'security',
      {
        ready,
        issue,
        facts: securityFacts(save),
        store: {
          event(e: unknown) {
            writes++;
            const next = applySecurity(save, e);
            if (!next) return false;
            save = next;
            return true;
          },
        },
      },
      securityMissions,
      securityNb.missions,
      (id) => securityHref('studio') + '&perspective=' + id,
      securityHref('assessment'),
      securityGuidedFacts,
    );
  return { send, module, raw: () => JSON.stringify(save), writes: () => writes };
}
describe('authoritative guided state becomes recommended navigation without new progress', () => {
  it('keeps theory free, opens only an explicitly requested briefing, and never starts from projection', () => {
    const f = fixture(),
      before = f.raw();
    expect(guidedNext(f.module(), 'introduction')).toBeUndefined();
    expect(guidedNext(f.module(), 'studio', 'trust')).toMatchObject({
      kind: 'brief',
      href: '/learn/security?topic=studio&perspective=trust&brief=trust',
    });
    expect(f.raw()).toBe(before);
    expect(f.writes()).toBe(0);
  });
  it('returns to the actual active guide even when a different perspective is selected', () => {
    const f = fixture();
    f.send({ kind: 'mission', mission: 'trust' });
    f.send({ kind: 'run', input: securityContrasts.trust[0], prediction: 1 });
    const before = f.raw();
    expect(guidedNext(f.module(), 'studio', 'depth')).toMatchObject({
      kind: 'work',
      href: '/learn/security?topic=studio&perspective=trust#guided-work',
    });
    expect(f.raw()).toBe(before);
    expect(securityFacts(JSON.parse(before) as SecuritySave).completed).toEqual([]);
  });
  it('requires the cause after real validated contrasts and recommends the next guide only after explanation', () => {
    const f = fixture();
    f.send({ kind: 'mission', mission: 'trust' });
    for (const input of securityContrasts.trust) f.send({ kind: 'run', input, prediction: 1 });
    expect(guidedNext(f.module(), 'studio', 'trust')?.kind).toBe('cause');
    f.send({ kind: 'explain', answer: securityGuidedAnswer.trust });
    expect(guidedNext(f.module(), 'studio', 'trust')).toMatchObject({
      kind: 'next',
      href: '/learn/security?topic=studio&perspective=depth',
    });
    expect(guidedResume(f.module())).toBe('/learn/security?topic=studio&perspective=depth');
  });
  it('resumes the same paused session only on an explicit action', () => {
    const f = fixture();
    f.send({ kind: 'mission', mission: 'trust' });
    f.send({ kind: 'pause' });
    expect(guidedResume(f.module())).toBe('/learn/security?topic=studio&perspective=trust');
    const action = guidedNext(f.module(), 'studio', 'trust')!;
    expect(action.kind).toBe('resume');
    expect(f.writes()).toBe(0);
    expect(action.activate?.()).toBe(true);
    expect(f.writes()).toBe(1);
    expect(f.module().guides.find((g) => g.id === 'trust')).toMatchObject({
      current: true,
      session: 1,
      phase: 'active',
    });
  });
  it.each(['corrupt', 'external', 'unsaved'])(
    'withholds completion/recommendations from retained %s snapshots',
    (issue) => {
      const f = fixture();
      f.send({ kind: 'mission', mission: 'trust' });
      expect(guidedNext(f.module(issue), 'studio', 'trust')?.kind).toBe('recovery');
      expect(guidedResume(f.module(issue))).toBeUndefined();
      expect(f.writes()).toBe(0);
    },
  );
  it('does not upgrade a new repetition from an older completed investigation', () => {
    const f = fixture();
    f.send({ kind: 'mission', mission: 'trust' });
    for (const input of securityContrasts.trust) f.send({ kind: 'run', input, prediction: 1 });
    f.send({ kind: 'explain', answer: securityGuidedAnswer.trust });
    f.send({ kind: 'mission', mission: 'trust' });
    expect(f.module().guides[0]).toMatchObject({
      phase: 'active',
      completedBefore: true,
      session: 2,
    });
    expect(guidedNext(f.module(), 'studio', 'trust')?.kind).toBe('work');
  });
  it('resumes the most recently paused session inside its own module, rather than the first mission in a list', () => {
    const f = fixture();
    f.send({ kind: 'mission', mission: 'trust' });
    f.send({ kind: 'pause' });
    f.send({ kind: 'mission', mission: 'depth' });
    f.send({ kind: 'pause' });
    expect(guidedResume(f.module())).toBe('/learn/security?topic=studio&perspective=depth');
    expect(guidedNext(f.module(), 'missions')).toMatchObject({
      kind: 'resume',
      title: securityNb.missions.depth.title,
    });
  });
  it('recommends independent application only after all guides and does not begin an assessment', () => {
    const f = fixture();
    for (const mission of securityMissions) {
      f.send({ kind: 'mission', mission });
      for (const input of securityContrasts[mission]) f.send({ kind: 'run', input, prediction: 1 });
      f.send({ kind: 'explain', answer: securityGuidedAnswer[mission] });
    }
    const before = f.raw();
    expect(guidedNext(f.module(), 'studio', 'defender')).toMatchObject({
      kind: 'assessment',
      href: '/learn/security?topic=assessment',
    });
    expect(f.raw()).toBe(before);
    expect(securityFacts(JSON.parse(before) as SecuritySave).attempts).toEqual([]);
  });
  it('requires actual native verification rather than assuming receipts or an inspection are complete', () => {
    const native = projectGuides(
      'compute',
      {
        ready: true,
        issue: null,
        facts: {
          guide: { id: 1, mission: 'vm', runs: [] },
          guided: [{ id: 1, mission: 'vm', runs: [] }],
          completed: [],
        },
        store: {
          event: () => {
            throw Error('read-only');
          },
        },
      },
      ['vm'],
      { vm: { title: 'VM' } },
      () => '/learn/compute?topic=dependencies',
      '/learn/compute?topic=assessment',
      () => ({ witnessed: false, complete: false, valid: false }),
    );
    expect(guidedNext(native, 'dependencies')).toMatchObject({ kind: 'recovery' });
    expect(native.guides[0]!.phase).toBe('unavailable');
  });
});
