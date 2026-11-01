import {
  securityModelVersion,
  validSecurityInput,
  runSecurity,
  type SecurityInput,
  type Outcome,
} from './security-model';
import {
  securityItems,
  securityItemIds,
  evaluateSecurity,
  type SecurityAnswer,
  type SecurityItemId,
} from './security-items';
export { securityItems, securityItemIds, evaluateSecurity };
export type { SecurityAnswer, SecurityItemId };
export const securityKey = 'azurelab.learning.security-principles.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const securityVersion = '1.0.0';
export const securityLimit = 800;
/** Leave ample JSON-envelope and terminal-event reserve for bounded scope snapshots. */
export const securityNormalCharacters = 480000;
export const securityTopics = [
  'introduction',
  'zero-trust',
  'depth',
  'encryption',
  'defender',
  'posture',
  'protection',
  'score',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type SecurityTopic = (typeof securityTopics)[number];
export const securityMissions = ['trust', 'depth', 'defender'] as const;
export type SecurityMission = (typeof securityMissions)[number];
export const securityGuidedAnswer = { trust: 1, depth: 2, defender: 0 } as const;
export const securityMissionTopic = {
  trust: 'studio',
  depth: 'studio',
  defender: 'studio',
} as const;
export const securityHref = (topic: SecurityTopic, item?: SecurityItemId) =>
  `/learn/security?topic=${topic}${item ? `&case=${item}` : ''}`;
export const securityManifest = {
  id: 'security',
  content: securityVersion,
  model: securityModelVersion,
  rubric: securityVersion,
  reviewed: '2026-11-01',
  prerequisites: ['ID01', 'AC01', 'MON03'],
  objectives: { SEC01: ['ID01', 'AC01'], SEC02: ['AC01', 'MON03'], SEC03: ['MON03'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.4.06', '2.4.07', '2.4.08'],
    supplement: 'encryption-key-management',
    deferred: ['P16 Migration', 'Whole-course pedagogical audit'],
  },
  teaching: securityTopics,
  activities: securityMissions,
  assessment: securityItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface SecurityAttempt {
  id: number;
  item: SecurityItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: SecurityAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateSecurityAttempt = (a: SecurityAttempt) => evaluateSecurity(a.item, a.answer);
export interface SecurityRun {
  kind: 'run';
  input: SecurityInput;
  prediction: Outcome;
}
export interface SecurityGuide {
  id: number;
  mission: SecurityMission;
  runs: SecurityRun[];
  configuration: Partial<Record<SecurityMission, SecurityInput>>;
  answer: number | null;
}
export type SecurityEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | SecurityRun
  | { kind: 'visit'; topic: SecurityTopic }
  | { kind: 'mission'; mission: SecurityMission }
  | { kind: 'configure'; input: SecurityInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: SecurityItemId }
  | { kind: 'draft'; answer: SecurityAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface SecuritySave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: SecurityEvent[];
}
export const freshSecurity = (): SecuritySave => ({
  schema: 1,
  content: securityVersion,
  model: securityModelVersion,
  rubric: securityVersion,
  events: [],
});
/** Completion requires persisted contrasts, never visits, control clicks or elapsed time. */
function comparable(v: unknown, omitted: string[], path = ''): unknown {
  if (Array.isArray(v)) return v.map((x, i) => comparable(x, omitted, `${path}.${i}`));
  if (!v || typeof v !== 'object') return v;
  return Object.fromEntries(
    Object.entries(v)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([k]) => !omitted.includes(path ? `${path}.${k}` : k))
      .map(([k, x]) => [k, comparable(x, omitted, path ? `${path}.${k}` : k)]),
  );
}
const pair = <T extends { input: SecurityInput }>(
  runs: T[],
  a: (x: T) => boolean,
  b: (x: T) => boolean,
  except: string[],
) =>
  runs.some(
    (x) =>
      a(x) &&
      runs.some(
        (y) =>
          b(y) &&
          JSON.stringify(comparable(x.input, except)) ===
            JSON.stringify(comparable(y.input, except)),
      ),
  );
export function securityWitnesses(g: SecurityGuide) {
  const r = g.runs.flatMap((x) => {
    const v = runSecurity(x.input);
    return v ? [v] : [];
  });
  const t = r.filter((x) => x.kind === 'trust'),
    d = r.filter((x) => x.kind === 'depth'),
    f = r.filter((x) => x.kind === 'defender');
  if (g.mission === 'trust')
    return [
      pair(
        t,
        (x) => x.input.network === 'internal' && x.input.mfa && !x.verificationDescribed,
        (y) => y.input.network === 'external' && !y.verificationDescribed,
        ['network'],
      ),
      pair(
        t,
        (x) => !x.verificationDescribed && x.input.device === 'unknown',
        (y) => y.verificationDescribed,
        ['device', 'contextReview'],
      ),
      pair(
        t,
        (x) => !x.privilegeBounded,
        (y) => y.privilegeBounded,
        ['scope', 'duration'],
      ),
      pair(
        t,
        (x) => !x.breachPrepared,
        (y) => y.breachPrepared,
        ['segmented', 'dataProtection', 'observability', 'recovery'],
      ),
    ];
  if (g.mission === 'depth')
    return [
      pair(
        d,
        (x) =>
          x.input.risk === 'password' &&
          x.inspectedRelevant &&
          x.primaryContribution &&
          !x.complementContribution,
        (y) => y.primaryContribution && y.complementContribution,
        ['complementConfigured'],
      ),
      pair(
        d,
        (x) =>
          x.input.risk === 'password' &&
          x.inspectedRelevant &&
          x.primaryContribution &&
          x.complementContribution,
        (y) => !y.primaryContribution && y.complementContribution && y.originalWeaknessStillPresent,
        ['failure'],
      ),
      pair(
        d,
        (x) =>
          x.input.risk === 'host' &&
          x.inspectedRelevant &&
          x.primaryContribution &&
          x.complementContribution,
        (y) => !y.primaryContribution && y.complementContribution && y.contribution === 'recovery',
        ['failure'],
      ),
      pair(
        d,
        (x) =>
          x.input.risk === 'application' &&
          x.inspectedRelevant &&
          x.primaryContribution &&
          !x.complementFits,
        (y) => y.primaryContribution && y.complementContribution,
        ['complement'],
      ),
    ];
  return [
    pair(
      f,
      (x) =>
        x.recommendationVisible &&
        !x.alertVisible &&
        !x.workloadAvailable &&
        x.input.feature === 'posture',
      (y) => y.input.feature === 'workload' && y.needsCoverage && y.followUpFits,
      ['feature', 'followUp'],
    ),
    pair(
      f,
      (x) => x.input.feature === 'workload' && !x.alertVisible && x.needsCoverage && x.followUpFits,
      (y) => y.alertVisible && y.workloadAvailable && y.followUpFits,
      ['workloadPlan', 'followUp'],
    ),
    pair(
      f,
      (x) => x.input.feature === 'risk-prioritization' && !x.advancedAvailable && x.followUpFits,
      (y) => y.advancedAvailable && y.recommendationVisible && y.followUpFits,
      ['posturePlan', 'followUp'],
    ),
    pair(
      f,
      (x) => x.input.scoreView === 'classic',
      (y) => y.input.scoreView === 'cloud-risk' && !y.scoreModelsIdentical && y.scoreValue === null,
      ['scoreView'],
    ),
  ];
}
export function securityGuidedFacts(g: SecurityGuide) {
  const witnesses = securityWitnesses(g),
    modeled = witnesses.every(Boolean),
    correct = g.answer === securityGuidedAnswer[g.mission];
  return { witnesses, modeled, witnessed: modeled, correct, complete: modeled && correct };
}
export function securityFacts(save: SecuritySave) {
  const attempts: SecurityAttempt[] = [],
    guided: SecurityGuide[] = [],
    visited: SecurityTopic[] = [];
  let current: SecurityAttempt | undefined,
    guide: SecurityGuide | undefined,
    topic: SecurityTopic = 'introduction';
  for (const e of save.events) {
    if (e.kind === 'resume') guide = guided.find((g) => g.id === e.id);
    if (e.kind === 'pause') guide = undefined;
    if (e.kind === 'visit') {
      topic = e.topic;
      if (!visited.includes(e.topic)) visited.push(e.topic);
    }
    if (e.kind === 'mission') {
      guide = {
        id: guided.length + 1,
        mission: e.mission,
        runs: [],
        configuration: {},
        answer: null,
      };
      guided.push(guide);
    }
    if (e.kind === 'configure' && guide) guide.configuration[e.input.kind] = e.input;
    if (e.kind === 'run') guide?.runs.push(e);
    if (e.kind === 'explain' && guide) guide.answer = e.answer;
    if (e.kind === 'begin') {
      const d = securityItems[e.item];
      current = {
        id: attempts.length + 1,
        item: e.item,
        family: d.family,
        variant: d.variant,
        itemVersion: d.itemVersion,
        rubricVersion: d.rubricVersion,
        answer: { decision: null, reason: null },
        assisted: false,
        retry: attempts.some((a) => a.family === d.family),
        status: 'active',
      };
      attempts.push(current);
    } else if (current?.status === 'active') {
      if (e.kind === 'draft') current.answer = e.answer;
      if (e.kind === 'aid') current.assisted = true;
      if (e.kind === 'submit') current.status = 'submitted';
      if (e.kind === 'abandon') current.status = 'abandoned';
    }
  }
  return {
    attempts,
    current,
    active: current?.status === 'active',
    assisted: current?.status === 'active' && current.assisted,
    guided,
    guide,
    visited,
    topic,
    firsts: securityItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: securityMissions.filter((id) =>
      guided.some((g) => g.mission === id && securityGuidedFacts(g).complete),
    ),
    full:
      save.events.length >= securityLimit - 5 ||
      JSON.stringify(save).length >= securityNormalCharacters,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is SecurityEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && securityTopics.includes(v.topic as SecurityTopic);
  if (v.kind === 'mission')
    return keys(v, ['kind', 'mission']) && securityMissions.includes(v.mission as SecurityMission);
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validSecurityInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && securityItemIds.includes(v.item as SecurityItemId);
  if (v.kind === 'draft')
    return (
      keys(v, ['kind', 'answer']) &&
      object(v.answer) &&
      keys(v.answer, ['decision', 'reason']) &&
      choice(v.answer.decision) &&
      choice(v.answer.reason)
    );
  return ['aid', 'submit', 'abandon'].includes(v.kind as string) && keys(v, ['kind']);
}
export function applySecurity(save: SecuritySave, raw: unknown): SecuritySave | null {
  if (!validEvent(raw)) return null;
  const f = securityFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= securityLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= securityLimit - 1) return null;
    }
    if (
      raw.kind === 'submit' &&
      (f.current.answer.decision === null || f.current.answer.reason === null)
    )
      return null;
  } else {
    if (raw.kind === 'visit' && f.topic === raw.topic && f.visited.includes(raw.topic)) return save;
    if (f.active) return null;
    if (raw.kind === 'explain') {
      if (!g || !securityGuidedFacts(g).modeled) return null;
      if (g.answer === raw.answer || g.answer === securityGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (save.events.length >= securityLimit - 1 && raw.answer !== securityGuidedAnswer[g.mission])
        return null;
    } else if (raw.kind === 'pause') {
      if (!g) return save;
      if (f.full) return null;
    } else if (raw.kind === 'resume') {
      const target = f.guided.find((g) => g.id === raw.id);
      if (!target) return null;
      if (g?.id === raw.id) return save;
      // A previously paused witnessed mission may use one reserved recovery event,
      // leaving the last event for its causal explanation; no new model work fits.
      if (
        f.full &&
        (!securityGuidedFacts(target).modeled || save.events.length >= securityLimit - 1)
      )
        return null;
    } else if (f.full) return null;
    if (raw.kind === 'mission' && f.guided.filter((x) => x.mission === raw.mission).length >= 24)
      return null;
    if (raw.kind === 'configure' || raw.kind === 'run') {
      if (!g || g.mission !== raw.input.kind) return null;
      if (
        raw.kind === 'configure' &&
        JSON.stringify(g.configuration[raw.input.kind]) === JSON.stringify(raw.input)
      )
        return save;
      if (raw.kind === 'run' && g.runs.length >= 24) return null;
    }
  }
  if (save.events.length >= securityLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreSecurity(raw: string | null): {
  save: SecuritySave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshSecurity(), issue });
  if (raw === null) return { save: freshSecurity(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== securityVersion ||
      s.model !== securityModelVersion ||
      s.rubric !== securityVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > securityLimit
    )
      return invalid('corrupt');
    let save = freshSecurity();
    for (const e of s.events) {
      const next = applySecurity(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function securityMilestoneFacts(save: SecuritySave) {
  const f = securityFacts(save);
  return Object.fromEntries(
    securityMissions.map((id) => [
      id,
      f.guided.some((g) => g.mission === id && securityGuidedFacts(g).witnessed),
    ]),
  ) as Record<SecurityMission, boolean>;
}
