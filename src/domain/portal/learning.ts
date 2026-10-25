import { replayEngine } from '../sandbox/replay';
import { freshEngine, types, type Engine } from '../chapter01/model';
export const serviceModule = {
  id: 'service-types',
  version: '1.0.0',
  rubric: 'portal-transfer@1',
  objectives: ['ST01', 'ST02', 'ST03', 'ST04'],
  competencies: ['F01', 'G01', 'C01', 'G03'],
  sources: ['P03', 'P04', 'S01', 'S12', 'S39', 'P08', 'P09', 'P10'],
  humanSme: null,
} as const;
export const serviceLearningKey = 'azurelab.portal.learning.v1';
export const models = ['iaas', 'paas', 'saas'] as const;
export type Model = (typeof models)[number];
export const cases = ['legacy', 'custom', 'ready'] as const;
export type CaseId = (typeof cases)[number];
export const reasons = ['os-control', 'managed-platform', 'ready-service'] as const;
export type Reason = (typeof reasons)[number];
export const expected = {
  legacy: { model: 'iaas', reason: 'os-control' },
  custom: { model: 'paas', reason: 'managed-platform' },
  ready: { model: 'saas', reason: 'ready-service' },
} as const;
export function evaluateCase(caseId: CaseId, model: Model, reason: Reason) {
  return model === expected[caseId].model && reason === expected[caseId].reason;
}
export interface Answers {
  osModel?: Model;
  webModel?: Model;
  readyModel?: Model;
  reason?: Reason;
  locationCause?: 'plan' | 'metadata' | 'policy-everywhere';
  groupId?: string;
  planId?: string;
  appId?: string;
}
export type ModuleEvent =
  | { kind: 'compare'; model: Model }
  | { kind: 'guided'; caseId: CaseId; model: Model; reason: Reason }
  | { kind: 'begin'; boundary: string | null; attemptNumber: number }
  | { kind: 'aid' }
  | { kind: 'abandon' }
  | { kind: 'draft'; answers: Answers }
  | { kind: 'submit'; through: string };
export interface ServiceSave {
  schema: 1;
  content: '1.0.0';
  rubric: 'portal-transfer@1';
  events: ModuleEvent[];
}
export const freshServices = (): ServiceSave => ({
  schema: 1,
  content: '1.0.0',
  rubric: 'portal-transfer@1',
  events: [],
});
const exact = (v: object, keys: string[]) =>
  Object.keys(v).sort().join(',') === keys.sort().join(',');
const id = (v: unknown) => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
function validAnswers(raw: unknown): raw is Answers {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  return Object.entries(raw).every(([k, v]) =>
    ['osModel', 'webModel', 'readyModel'].includes(k)
      ? models.includes(v as Model)
      : k === 'reason'
        ? reasons.includes(v as Reason)
        : k === 'locationCause'
          ? ['plan', 'metadata', 'policy-everywhere'].includes(v as string)
          : ['groupId', 'planId', 'appId'].includes(k) && (v === '' || id(v)),
  );
}
export function parseModuleEvent(raw: unknown): ModuleEvent | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const e = raw as Record<string, unknown>;
  switch (e.kind) {
    case 'compare':
      return exact(e, ['kind', 'model']) && models.includes(e.model as Model)
        ? (e as ModuleEvent)
        : null;
    case 'guided':
      return exact(e, ['kind', 'caseId', 'model', 'reason']) &&
        cases.includes(e.caseId as CaseId) &&
        models.includes(e.model as Model) &&
        reasons.includes(e.reason as Reason)
        ? (e as ModuleEvent)
        : null;
    case 'begin':
      return exact(e, ['kind', 'boundary', 'attemptNumber']) &&
        (e.boundary === null || id(e.boundary)) &&
        Number.isSafeInteger(e.attemptNumber) &&
        (e.attemptNumber as number) >= 1 &&
        (e.attemptNumber as number) <= 100000
        ? (e as ModuleEvent)
        : null;
    case 'aid':
    case 'abandon':
      return exact(e, ['kind']) ? { kind: e.kind } : null;
    case 'draft':
      return exact(e, ['kind', 'answers']) && validAnswers(e.answers)
        ? { kind: 'draft', answers: { ...e.answers } }
        : null;
    case 'submit':
      return exact(e, ['kind', 'through']) && id(e.through) ? (e as ModuleEvent) : null;
    default:
      return null;
  }
}
export function serviceFacts(save: ServiceSave) {
  const compared = new Set<Model>();
  const guided: Partial<Record<CaseId, Extract<ModuleEvent, { kind: 'guided' }>>> = {};
  const submissions: {
    answers: Answers;
    boundary: string | null;
    attemptNumber: number;
    through: string;
    assisted: boolean;
    abandoned: boolean;
  }[] = [];
  let active = false,
    assisted = false,
    boundary: string | null = null,
    attemptNumber = 1,
    draft: Answers = {};
  for (const e of save.events) {
    if (e.kind === 'compare') {
      compared.add(e.model);
      if (active) assisted = true;
    }
    if (e.kind === 'guided') {
      guided[e.caseId] = e;
      if (active) assisted = true;
    }
    if (e.kind === 'begin') {
      active = true;
      assisted = false;
      boundary = e.boundary;
      attemptNumber = e.attemptNumber;
      draft = {};
    }
    if (e.kind === 'aid' && active) assisted = true;
    if (e.kind === 'draft' && active) draft = { ...draft, ...e.answers };
    if ((e.kind === 'submit' || e.kind === 'abandon') && active) {
      submissions.push({
        answers: { ...draft },
        boundary,
        attemptNumber,
        through: e.kind === 'submit' ? e.through : 'no-technical-command',
        assisted,
        abandoned: e.kind === 'abandon',
      });
      active = false;
    }
  }
  return {
    compared,
    guided,
    active,
    assisted,
    draft,
    submissions,
    guidedComplete:
      compared.size === 3 &&
      cases.every((c) => {
        const e = guided[c];
        return e && evaluateCase(c, e.model, e.reason);
      }),
  };
}
export function applyModuleEvent(save: ServiceSave, raw: unknown): ServiceSave | null {
  const event = parseModuleEvent(raw);
  if (!event || save.events.length >= 400) return null;
  const facts = serviceFacts(save);
  if (event.kind === 'begin' && facts.active) return null;
  if (['draft', 'submit', 'aid', 'abandon'].includes(event.kind) && !facts.active) return null;
  if (event.kind === 'aid' && facts.assisted) return save;
  if (event.kind === 'compare' && facts.compared.has(event.model) && !facts.active) return save;
  return { ...save, events: [...save.events, event] };
}
export function restoreServices(raw: string | null): {
  save: ServiceSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshServices(), issue: null };
  try {
    if (raw.length > 120000) throw Error('size');
    const v = JSON.parse(raw);
    if (!v || !exact(v, ['schema', 'content', 'rubric', 'events'])) throw Error('shape');
    if (v.schema !== 1 || v.content !== '1.0.0' || v.rubric !== 'portal-transfer@1')
      return { save: freshServices(), issue: 'unsupported' };
    if (!Array.isArray(v.events) || v.events.length > 400) throw Error('events');
    let save = freshServices();
    for (const e of v.events) {
      const next = applyModuleEvent(save, e);
      if (!next) throw Error('replay');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return { save: freshServices(), issue: 'corrupt' };
  }
}
export function evaluateSubmission(
  submission: ReturnType<typeof serviceFacts>['submissions'][number],
  engine: Engine,
  attemptNumber: number,
) {
  const end = engine.ledger.findIndex((x) => x.request.commandId === submission.through);
  const start =
    submission.boundary === null
      ? -1
      : engine.ledger.findIndex((x) => x.request.commandId === submission.boundary);
  const verifiable =
    !submission.abandoned &&
    submission.attemptNumber === attemptNumber &&
    end >= 0 &&
    (submission.boundary === null || start >= 0) &&
    end >= start;
  const verifiedReplay = verifiable ? replayEngine(engine, end + 1) : null;
  const replay = verifiedReplay ?? freshEngine();
  const a = submission.answers,
    world = replay.world;
  const group = world.groups.find((g) => g.id === a.groupId),
    plan = world.resources.find((r) => r.id === a.planId && r.type === types.plan),
    app = world.resources.find((r) => r.id === a.appId && r.type === types.app);
  const created = new Set(
    engine.ledger
      .slice(start + 1, end + 1)
      .filter((e) => e.receipt.outcome === 'accepted')
      .flatMap((e) => e.receipt.addedIds),
  );
  const criteria = {
    service: a.webModel === 'paas' && a.reason === 'managed-platform',
    os: a.osModel === 'iaas',
    ready: a.readyModel === 'saas',
    scope:
      verifiable &&
      !!group &&
      group.subscriptionId === 'sub-shared' &&
      group.metadataLocation === 'norwayeast' &&
      created.has(group.id),
    hosting:
      verifiable &&
      !!group &&
      !!plan &&
      !!app &&
      plan.groupId === group.id &&
      app.groupId === group.id &&
      app.type === types.app &&
      app.planId === plan.id &&
      plan.location === 'northeurope' &&
      app.location === plan.location &&
      created.has(plan.id) &&
      created.has(app.id),
    cause: a.locationCause === 'plan',
  };
  return {
    verifiable: verifiable && !!verifiedReplay,
    criteria,
    correct: verifiable && !!verifiedReplay && Object.values(criteria).every(Boolean),
  };
}
