import type { Engine } from '../chapter01/model';
import {
  validChallengeOrigin,
  challengeResumeHref,
  challengeReturnHref,
  type ChallengeOrigin,
} from './challenge-origin';
import {
  applyModuleEvent,
  freshServices,
  serviceFacts,
  evaluateSubmission,
  parseModuleEvent,
  type Answers,
  type ModuleEvent,
} from './learning';
export const challenge2Key = 'azurelab.portal.challenge.v2';
export const challenge2Limit = 400;
export type Challenge2Answers = Answers & {
  osReason?: 'component-settings' | 'guest-lifecycle' | 'finished-product';
  platformModel?: 'iaas' | 'paas' | 'saas';
  platformReason?: 'supported-platform' | 'windows-control' | 'finished-product';
};
export type Challenge2Event =
  | Exclude<ModuleEvent, { kind: 'compare' | 'guided' | 'begin' | 'draft' }>
  | {
      kind: 'begin';
      boundary: string | null;
      attemptNumber: number;
      origin: ChallengeOrigin | null;
      prior: 'documented' | 'none-recorded';
    }
  | { kind: 'draft'; answers: Challenge2Answers };
export type Challenge2Save = {
  schema: 1;
  content: '2.0.0';
  rubric: 'portal-transfer@2';
  events: Challenge2Event[];
};
export const freshChallenge2 = (): Challenge2Save => ({
  schema: 1,
  content: '2.0.0',
  rubric: 'portal-transfer@2',
  events: [],
});
const exact = (v: object, keys: string[]) => Object.keys(v).sort().join() === keys.sort().join();
export function challenge2Projection(save: Challenge2Save) {
  let legacy = freshServices();
  for (const e of save.events) {
    const raw =
      e.kind === 'begin'
        ? { kind: e.kind, boundary: e.boundary, attemptNumber: e.attemptNumber }
        : e.kind === 'draft'
          ? {
              kind: e.kind,
              answers: Object.fromEntries(
                Object.entries(e.answers).filter(
                  ([key]) => !['osReason', 'platformModel', 'platformReason'].includes(key),
                ),
              ),
            }
          : e;
    const next = applyModuleEvent(legacy, raw);
    if (!next) throw Error('invalid projection');
    legacy = next;
  }
  return legacy;
}
export function challenge2Facts(save: Challenge2Save) {
  const base = serviceFacts(challenge2Projection(save));
  let answers: Challenge2Answers = {},
    origin: ChallengeOrigin | null = null,
    prior: 'documented' | 'none-recorded' = 'none-recorded';
  const extras: {
    answers: Challenge2Answers;
    origin: ChallengeOrigin | null;
    prior: 'documented' | 'none-recorded';
  }[] = [];
  for (const e of save.events) {
    if (e.kind === 'begin') {
      answers = {};
      origin = e.origin;
      prior = e.prior;
    }
    if (e.kind === 'draft') answers = { ...answers, ...e.answers };
    if (e.kind === 'submit' || e.kind === 'abandon')
      extras.push({ answers: { ...answers }, origin, prior });
  }
  return {
    ...base,
    draft: answers,
    origin,
    prior,
    submissions: base.submissions.map((s, i) => ({
      ...s,
      ...extras[i]!,
      answers: extras[i]!.answers,
    })),
  };
}
export function applyChallenge2(save: Challenge2Save, raw: unknown): Challenge2Save | null {
  if (
    !raw ||
    typeof raw !== 'object' ||
    Array.isArray(raw) ||
    save.events.length >= challenge2Limit
  )
    return null;
  const e = raw as Challenge2Event;
  const active = challenge2Facts(save).active;
  if (e.kind === 'begin') {
    if (
      !exact(e, ['kind', 'boundary', 'attemptNumber', 'origin', 'prior']) ||
      active ||
      save.events.length >= challenge2Limit - 3 ||
      (e.origin !== null && !validChallengeOrigin(e.origin)) ||
      !['documented', 'none-recorded'].includes(e.prior) ||
      !parseModuleEvent({ kind: 'begin', boundary: e.boundary, attemptNumber: e.attemptNumber })
    )
      return null;
  } else if (e.kind === 'draft') {
    if (
      !active ||
      save.events.length >= challenge2Limit - 3 ||
      !exact(e, ['kind', 'answers']) ||
      !e.answers ||
      typeof e.answers !== 'object' ||
      Array.isArray(e.answers)
    )
      return null;
    const { osReason, platformModel, platformReason, ...old } = e.answers;
    if (
      !parseModuleEvent({ kind: 'draft', answers: old }) ||
      (osReason !== undefined &&
        !['component-settings', 'guest-lifecycle', 'finished-product'].includes(osReason)) ||
      (platformModel !== undefined && !['iaas', 'paas', 'saas'].includes(platformModel)) ||
      (platformReason !== undefined &&
        !['supported-platform', 'windows-control', 'finished-product'].includes(platformReason))
    )
      return null;
  } else if (!['aid', 'submit', 'abandon'].includes(e.kind) || !active || !parseModuleEvent(e))
    return null;
  if (e.kind === 'aid' && challenge2Facts(save).assisted) return save;
  return { ...save, events: [...save.events, structuredClone(e)] };
}
export function restoreChallenge2(raw: string | null): {
  save: Challenge2Save;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshChallenge2(), issue: null };
  try {
    if (raw.length > 160000) throw Error('size');
    const v = JSON.parse(raw);
    if (!v || !exact(v, ['schema', 'content', 'rubric', 'events'])) throw Error('shape');
    if (v.schema !== 1 || v.content !== '2.0.0' || v.rubric !== 'portal-transfer@2')
      return { save: freshChallenge2(), issue: 'unsupported' };
    if (!Array.isArray(v.events) || v.events.length > challenge2Limit) throw Error('events');
    let save = freshChallenge2();
    for (const event of v.events) {
      const next = applyChallenge2(save, event);
      if (!next) throw Error('replay');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return { save: freshChallenge2(), issue: 'corrupt' };
  }
}
export function evaluateChallenge2(
  submission: ReturnType<typeof challenge2Facts>['submissions'][number],
  engine: Engine,
  attemptNumber: number,
) {
  const legacy = evaluateSubmission(submission, engine, attemptNumber),
    a = submission.answers;
  const criteria = {
    ...legacy.criteria,
    os: a.osModel === 'iaas' && a.osReason === 'guest-lifecycle',
    platform: a.platformModel === 'paas' && a.platformReason === 'supported-platform',
  };
  return {
    verifiable: legacy.verifiable,
    criteria,
    correct: legacy.verifiable && Object.values(criteria).every(Boolean),
  };
}
export const challenge2Href = (origin: ChallengeOrigin | null) =>
  challengeResumeHref(origin) + '&assessment=updated';
export const challenge2Return = (origin: ChallengeOrigin | null, active: boolean) =>
  challengeReturnHref(origin, active) +
  (challengeReturnHref(origin, active).includes('?') ? '&' : '?') +
  'assessment=updated';
