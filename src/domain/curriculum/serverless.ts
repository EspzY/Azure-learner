/** FC08 supplement. Never changes Foundations v1/v2 rubrics, commands or XP. */
export const serverlessKey = 'azurelab.learning.serverless.v1';
export const serverlessTopics = [
  'serverless-concept',
  'serverless-mechanism',
  'serverless-hosting',
  'serverless-explorer',
  'serverless-assessment',
  'serverless-summary',
] as const;
export type ServerlessTopic = (typeof serverlessTopics)[number];
export const isServerlessTopic = (v: string): v is ServerlessTopic =>
  (serverlessTopics as readonly string[]).includes(v);
export const serverlessManifest = {
  id: 'serverless-foundations',
  sourceReviewed: '2026-10-27',
  objective: 'FC08',
  competency: 'C04',
  version: '1.0.0',
  exam: { version: '2026-07-20', primary: '1.1.07', preparationOnly: '2.2.01' },
  prerequisites: ['provisioning', 'v2-responsibility', 'v2-metering', 'v2-pricing'],
  activities: ['teach-serverless', 'execute-serverless', 'apply-serverless'],
  humanSme: null,
  learnerStudy: null,
  sources: {
    SL01: 'credentials/certifications/resources/study-guides/az-900',
    SL02: 'training/modules/describe-cloud-compute/',
    SL03: 'azure/azure-functions/functions-overview',
    SL04: 'azure/azure-functions/functions-triggers-bindings',
    SL05: 'azure/azure-functions/functions-scale',
    SL06: 'azure/azure-functions/flex-consumption-plan',
    SL07: 'azure/azure-functions/functions-premium-plan',
    SL08: 'azure/azure-functions/dedicated-plan',
    SL09: 'azure/azure-functions/performance-reliability',
    SL10: 'azure/security/fundamentals/shared-responsibility',
    SL11: 'azure/architecture/guide/technology-choices/compute-decision-tree',
    SL12: 'azure/logic-apps/logic-apps-overview',
  },
} as const;
export interface ExecutionInput {
  event: 'upload' | 'http' | 'queue' | 'timer';
  count: number;
  slots: number;
  rounds: number;
  situation: 'warm' | 'cold' | 'code-error';
}
export const initialExecution: ExecutionInput = {
  event: 'upload',
  count: 7,
  slots: 2,
  rounds: 2,
  situation: 'warm',
};
const exact = (o: object, keys: string[]) =>
  Object.keys(o).sort().join() === [...keys].sort().join();
export function validExecution(raw: unknown): raw is ExecutionInput {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const v = raw as ExecutionInput;
  return (
    exact(v, ['event', 'count', 'slots', 'rounds', 'situation']) &&
    ['upload', 'http', 'queue', 'timer'].includes(v.event) &&
    ['warm', 'cold', 'code-error'].includes(v.situation) &&
    Number.isInteger(v.count) &&
    v.count >= 0 &&
    v.count <= 12 &&
    Number.isInteger(v.slots) &&
    v.slots >= 1 &&
    v.slots <= 4 &&
    Number.isInteger(v.rounds) &&
    v.rounds >= 1 &&
    v.rounds <= 3
  );
}
/** Fixed observation window, NOT Azure autoscaling, latency, queue or billing emulation. */
export function executeEvents(raw: unknown) {
  if (!validExecution(raw)) return null;
  const input = { ...raw };
  const capacity = input.slots * Math.max(0, input.rounds - (input.situation === 'cold' ? 1 : 0));
  const started = Math.min(input.count, capacity);
  const events = Array.from({ length: input.count }, (_, i) => ({
    id: i + 1,
    round:
      i < started ? Math.floor(i / input.slots) + 1 + (input.situation === 'cold' ? 1 : 0) : null,
    state:
      i >= started
        ? ('pending' as const)
        : input.situation === 'code-error' && i === 0
          ? ('failed' as const)
          : ('completed' as const),
  }));
  return {
    input,
    events,
    started,
    completed: events.filter((e) => e.state === 'completed').length,
    failed: events.filter((e) => e.state === 'failed').length,
    pending: input.count - started,
    preparationRounds: input.situation === 'cold' && input.count > 0 ? 1 : 0,
  };
}
export const studyKeys = ['concept', 'mechanism', 'hosting'] as const;
export const studyAnswers = {
  concept: 'managed-servers',
  mechanism: 'invocation',
  hosting: 'plan-dependent',
} as const;
export const studyOptions = {
  concept: ['managed-servers', 'no-servers', 'no-duties'],
  mechanism: ['invocation', 'success', 'binding-required'],
  hosting: ['plan-dependent', 'all-free', 'all-zero'],
} as const;
export const serverlessCriteria = {
  webhook: { options: ['functions', 'vm', 'saas'], answer: 'functions' },
  webhookReason: { options: ['events', 'free', 'no-security'], answer: 'events' },
  agent: { options: ['functions', 'vm', 'app-service'], answer: 'vm' },
  agentReason: {
    options: ['guest-control', 'continuous-impossible', 'cheapest'],
    answer: 'guest-control',
  },
  result: { options: ['trigger', 'successful-output', 'configured'], answer: 'successful-output' },
  duties: { options: ['customer', 'provider', 'none'], answer: 'customer' },
  bill: { options: ['zero', 'plan', 'executions-only'], answer: 'plan' },
} as const;
export type ServerlessCriterion = keyof typeof serverlessCriteria;
export type ServerlessEvent =
  | { kind: 'visit'; topic: ServerlessTopic }
  | { kind: 'study'; section: (typeof studyKeys)[number]; answer: string }
  | { kind: 'run'; input: ExecutionInput; prediction: number }
  | { kind: 'explain'; answer: 'code-result' | 'trigger-guarantee' | 'no-servers' }
  | { kind: 'begin' | 'aid' | 'abandon' }
  | { kind: 'draft' | 'submit'; answers: Record<string, string> };
export interface ServerlessSave {
  schema: 1;
  content: '1.0.0';
  model: '1.0.0';
  rubric: '1.0.0';
  events: ServerlessEvent[];
}
export const freshServerless = (): ServerlessSave => ({
  schema: 1,
  content: '1.0.0',
  model: '1.0.0',
  rubric: '1.0.0',
  events: [],
});
export function serverlessFacts(s: ServerlessSave) {
  let active = false,
    assisted = false,
    attempts = 0,
    abandoned = 0,
    draft: Record<string, string> = {};
  const submissions: {
    answers: Record<string, string>;
    assisted: boolean;
    retry: boolean;
    criteria: Record<string, boolean>;
  }[] = [];
  for (const e of s.events) {
    if (e.kind === 'begin') {
      active = true;
      assisted = false;
      attempts++;
      draft = {};
    } else if (e.kind === 'aid' && active) assisted = true;
    else if (e.kind === 'draft' && active) draft = e.answers;
    else if (e.kind === 'abandon' && active) {
      active = false;
      abandoned++;
      draft = {};
    } else if (e.kind === 'submit' && active) {
      submissions.push({
        answers: e.answers,
        assisted,
        retry: attempts > 1,
        criteria: Object.fromEntries(
          Object.entries(serverlessCriteria).map(([id, c]) => [id, e.answers[id] === c.answer]),
        ),
      });
      active = false;
      draft = {};
    } else if (active && e.kind !== 'visit') assisted = true;
  }
  const studied = (section: (typeof studyKeys)[number]) => {
    const e = s.events.findLast((e) => e.kind === 'study' && e.section === section);
    return e?.kind === 'study' && e.answer === studyAnswers[section];
  };
  const runs = s.events.filter(
    (e): e is Extract<ServerlessEvent, { kind: 'run' }> => e.kind === 'run',
  );
  const explained = s.events.findLast((e) => e.kind === 'explain');
  const guided =
    runs.some((e) => {
      const r = executeEvents(e.input)!;
      return e.input.situation === 'warm' && r.pending > 0 && r.completed > 0;
    }) &&
    runs.some((e) => e.input.situation !== 'warm' && executeEvents(e.input)!.started > 0) &&
    explained?.kind === 'explain' &&
    explained.answer === 'code-result';
  return {
    active,
    assisted,
    draft,
    attempts,
    abandoned,
    submissions,
    runs,
    studied,
    guided,
    taught: studyKeys.every(studied),
    firstIndependent:
      submissions[0] &&
      !submissions[0].assisted &&
      !submissions[0].retry &&
      Object.values(submissions[0].criteria).every(Boolean),
    lastTopic: s.events.findLast((e) => e.kind === 'visit')?.topic,
  };
}
export function applyServerless(s: ServerlessSave, raw: unknown): ServerlessSave | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || s.events.length >= 400) return null;
  const e = raw as ServerlessEvent,
    f = serverlessFacts(s);
  let valid = false;
  if (e.kind === 'visit') valid = exact(e, ['kind', 'topic']) && isServerlessTopic(e.topic);
  if (e.kind === 'study')
    valid =
      exact(e, ['kind', 'section', 'answer']) &&
      Object.hasOwn(studyOptions, e.section) &&
      (studyOptions[e.section] as readonly string[]).includes(e.answer);
  if (e.kind === 'run')
    valid =
      exact(e, ['kind', 'input', 'prediction']) &&
      validExecution(e.input) &&
      Number.isInteger(e.prediction) &&
      e.prediction >= 0 &&
      e.prediction <= 12;
  if (e.kind === 'explain')
    valid =
      exact(e, ['kind', 'answer']) &&
      f.runs.length > 0 &&
      ['code-result', 'trigger-guarantee', 'no-servers'].includes(e.answer);
  if (e.kind === 'begin') valid = exact(e, ['kind']) && !f.active;
  if (e.kind === 'aid' || e.kind === 'abandon') valid = exact(e, ['kind']) && f.active;
  if (e.kind === 'draft' || e.kind === 'submit') {
    const a = e.answers;
    valid =
      exact(e, ['kind', 'answers']) &&
      f.active &&
      !!a &&
      typeof a === 'object' &&
      !Array.isArray(a) &&
      Object.entries(a).every(
        ([k, v]) =>
          Object.hasOwn(serverlessCriteria, k) &&
          typeof v === 'string' &&
          ((e.kind === 'draft' && v === '') ||
            (serverlessCriteria[k as ServerlessCriterion].options as readonly string[]).includes(
              v,
            )),
      ) &&
      (e.kind === 'draft' || exact(a, Object.keys(serverlessCriteria)));
  }
  if (!valid) return null;
  if (JSON.stringify(s.events.at(-1)) === JSON.stringify(e)) return s;
  return { ...s, events: [...s.events, structuredClone(e)] };
}
export function restoreServerless(raw: string | null): {
  save: ServerlessSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshServerless(), issue: null };
  try {
    if (raw.length > 160000) throw Error('size');
    const v = JSON.parse(raw);
    if (
      !v ||
      v.schema !== 1 ||
      v.content !== '1.0.0' ||
      v.model !== '1.0.0' ||
      v.rubric !== '1.0.0'
    )
      return { save: freshServerless(), issue: 'unsupported' };
    if (
      !exact(v, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(v.events) ||
      v.events.length > 400
    )
      throw Error('shape');
    let s = freshServerless();
    for (const e of v.events) {
      const n = applyServerless(s, e);
      if (!n) throw Error('event');
      s = n;
    }
    return { save: s, issue: null };
  } catch {
    return { save: freshServerless(), issue: 'corrupt' };
  }
}

/** Explicit existing-curriculum activity bindings, not an executable content DSL. */
export const serverlessActivities = {
  'teach-serverless': { objective: 'FC08', kind: 'teaching', presenter: 'ServerlessLesson.Theory' },
  'execute-serverless': { objective: 'FC08', kind: 'practice', evaluate: executeEvents },
  'apply-serverless': { objective: 'FC08', kind: 'independent', evaluate: serverlessFacts },
} as const;
