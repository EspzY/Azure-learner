import { managementTopics } from '../curriculum/architecture-management';
import { costTopics } from '../curriculum/cost';
import { physicalTopics } from '../curriculum/architecture-physical';
import { replayEngine } from '../sandbox/replay';
import { types, type Engine } from '../chapter01/model';
import { validResourceGroupName } from '../simulation';
import { topics, type PortalLocation } from '../portal/model';
import { unitIds } from '../curriculum/manifest';
import { v2Routes } from '../curriculum/foundations-v2';
import { serverlessTopics } from '../curriculum/serverless';
import { routes } from '../curriculum/expansion';

export const courseKey = 'azurelab.course.v1';
export const moduleIds = ['computing', 'benefits', 'services', 'architecture', 'cost'] as const;
export type CourseModule = (typeof moduleIds)[number];
export const guideTargets = [
  'search',
  'vm-image',
  'vm-profile',
  'vm-disk',
  'vm-network',
  'vm-details',
  'inspect-practical',
  'settings',
  'groups',
  'create',
  'subscription',
  'name',
  'region',
  'group',
  'plan',
  'review',
  'validation',
  'commit',
  'resource',
  'receipt',
  'policy',
  'architecture',
  'relationship',
] as const;
export type GuideTarget = (typeof guideTargets)[number];
export const stepIds = [
  'find-groups',
  'create-group',
  'subscription',
  'group-name',
  'metadata',
  'review-group',
  'commit-group',
  'inspect-group',
  'create-plan',
  'plan-group',
  'plan-name',
  'plan-region',
  'review-plan',
  'commit-plan',
  'inspect-denial',
  'inspect-policy',
  'correct-plan',
  'create-app',
  'app-group',
  'app-name',
  'hosting',
  'review-app',
  'commit-app',
  'inspect-app',
  'architecture',
  'relationship',
  'complete',
  'unverifiable',
  'fix-validation',
] as const;
export type StepId = (typeof stepIds)[number];
export interface LabSession {
  origin?: 'computing-v2' | 'services-v1' | 'services-v2' | 'architecture-management';
  version: 'web-platform@1';
  attempt: number;
  boundary: string | null;
  policy: string | null;
  relationship: string | null;
  reflection: 'data' | 'provider' | null;
}
export interface CourseSave {
  schema: 1;
  resume: { module: CourseModule; topic: string } | null;
  lab: LabSession | null;
}
export const freshCourse = (): CourseSave => ({ schema: 1, resume: null, lab: null });
const id = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const exact = (v: object, keys: string[]) =>
  Object.keys(v).sort().join(',') === keys.sort().join(',');
export function courseTopic(module: CourseModule, topic: string | null) {
  if (module === 'cost')
    return (costTopics as readonly string[]).includes(topic ?? '') ? topic! : 'introduction';
  if (module !== 'architecture' && topic === 'transfer') return 'transfer';
  if (module === 'architecture')
    return ([...physicalTopics, ...managementTopics] as readonly string[]).includes(topic ?? '')
      ? topic!
      : 'datacenters';
  const allowed: readonly string[] =
    module === 'benefits'
      ? routes('benefits')
      : module === 'services'
        ? [...topics, 'assessment', 'summary']
        : [...unitIds, 'assessment', 'summary', ...v2Routes, ...serverlessTopics];
  return allowed.includes(topic ?? '')
    ? topic!
    : module === 'benefits'
      ? 'availability'
      : module === 'services'
        ? 'overview'
        : 'intro-request';
}
export const courseHref = (module: CourseModule, topic: string) =>
  `/learn/${module}?topic=${courseTopic(module, topic)}`;
export const courseLabHref = (complete: boolean, origin?: LabSession['origin']) =>
  `${origin === 'architecture-management' ? courseHref('architecture', 'scope') : origin === 'computing-v2' ? courseHref('computing', 'resource-bridge') : courseHref('services', 'practice')}${origin === 'services-v1' ? '&version=1' : ''}&activity=${complete ? 'debrief' : 'lab'}`;
export function restoreCourse(raw: string | null): {
  save: CourseSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshCourse(), issue: null };
  try {
    if (raw.length > 8000) throw Error('size');
    const s = JSON.parse(raw) as CourseSave;
    if (!s || typeof s !== 'object' || Array.isArray(s)) throw Error('shape');
    if (s.schema !== 1) return { save: freshCourse(), issue: 'unsupported' };
    if (!exact(s, ['schema', 'resume', 'lab'])) throw Error('keys');
    if (
      s.resume !== null &&
      (!s.resume ||
        !exact(s.resume, ['module', 'topic']) ||
        !moduleIds.includes(s.resume.module) ||
        courseTopic(s.resume.module, s.resume.topic) !== s.resume.topic)
    )
      throw Error('resume');
    const l = s.lab;
    if (
      l !== null &&
      (!l ||
        !exact(l, [
          'version',
          'attempt',
          'boundary',
          'policy',
          'relationship',
          'reflection',
          ...(l.origin === undefined ? [] : ['origin']),
        ]) ||
        (l.origin !== undefined &&
          !['computing-v2', 'services-v1', 'services-v2', 'architecture-management'].includes(
            l.origin,
          )) ||
        l.version !== 'web-platform@1' ||
        !Number.isSafeInteger(l.attempt) ||
        l.attempt < 1 ||
        l.attempt > 100000 ||
        ![l.boundary, l.policy, l.relationship].every((v) => v === null || id(v)) ||
        ![null, 'data', 'provider'].includes(l.reflection))
    )
      throw Error('lab');
    return { save: s, issue: null };
  } catch {
    return { save: freshCourse(), issue: 'corrupt' };
  }
}
export function startLab(engine: Engine, attempt: number): LabSession {
  return {
    version: 'web-platform@1',
    attempt,
    boundary: engine.ledger.at(-1)?.request.commandId ?? null,
    policy: null,
    relationship: null,
    reflection: null,
  };
}
export function labFacts(session: LabSession | null, engine: Engine, attempt: number) {
  const empty = {
    verifiable: false,
    group: undefined,
    plan: undefined,
    app: undefined,
    denial: undefined,
    policy: false,
    relationship: false,
    complete: false,
  };
  if (!session || session.attempt !== attempt) return empty;
  const boundary =
    session.boundary === null
      ? -1
      : engine.ledger.findIndex((e) => e.request.commandId === session.boundary);
  if (session.boundary !== null && boundary < 0) return empty;
  const replay = replayEngine(engine);
  if (!replay) return empty;
  const entries = engine.ledger.slice(boundary + 1),
    w = replay.world;
  const created = new Set(
    entries.filter((e) => e.receipt.outcome === 'accepted').flatMap((e) => e.receipt.addedIds),
  );
  const group = w.groups.find(
    (g) =>
      created.has(g.id) && g.subscriptionId === 'sub-app' && g.metadataLocation === 'norwayeast',
  );
  const plan = w.resources.find(
    (r) =>
      r.type === types.plan &&
      created.has(r.id) &&
      r.groupId === group?.id &&
      r.location === 'westeurope',
  );
  const app = w.resources.find(
    (r) =>
      r.type === types.app && created.has(r.id) && r.groupId === group?.id && r.planId === plan?.id,
  );
  const denial = entries.find(
    (e) =>
      e.receipt.code === 'policy-location-denied' &&
      e.receipt.targetType === types.plan &&
      e.receipt.scopeId === group?.id,
  )?.receipt;
  const policy = !!denial && session.policy === denial.commandId;
  const relationship = !!app && session.relationship === app.id;
  return {
    verifiable: true,
    group,
    plan,
    app,
    denial,
    policy,
    relationship,
    complete: !!group && !!plan && !!app && !!denial && policy && relationship,
  };
}
export interface LabForm {
  step: string;
  subscription: string;
  name: string;
  region: string;
  group: string;
  plan: string;
  valid: boolean;
}
export interface GuideStep {
  id: StepId;
  objective: 'G01' | 'C01' | 'F01';
  target: GuideTarget;
  targetKind: 'action' | 'inspection';
  context: { area: PortalLocation['area']; kind?: 'group' | 'plan' | 'app' };
  action: 'navigate' | 'configure' | 'review' | 'submit' | 'inspect' | 'return';
  sourceIds: readonly string[];
  copyKey: StepId;
  validation: string;
  returnTo: string;
}
const targetMap: Record<StepId, GuideTarget> = {
  'find-groups': 'search',
  'create-group': 'create',
  subscription: 'subscription',
  'group-name': 'name',
  metadata: 'region',
  'review-group': 'review',
  'commit-group': 'commit',
  'inspect-group': 'resource',
  'create-plan': 'create',
  'plan-group': 'group',
  'plan-name': 'name',
  'plan-region': 'region',
  'review-plan': 'review',
  'commit-plan': 'commit',
  'inspect-denial': 'receipt',
  'inspect-policy': 'policy',
  'correct-plan': 'region',
  'create-app': 'create',
  'app-group': 'group',
  'app-name': 'name',
  hosting: 'plan',
  'review-app': 'review',
  'commit-app': 'commit',
  'inspect-app': 'resource',
  architecture: 'architecture',
  relationship: 'relationship',
  complete: 'resource',
  unverifiable: 'resource',
  'fix-validation': 'validation',
};
export const guideDefinitions = Object.fromEntries(
  stepIds.map((id): [StepId, GuideStep] => [
    id,
    {
      id,
      objective: id.includes('group') || ['subscription', 'metadata'].includes(id) ? 'G01' : 'C01',
      target: targetMap[id],
      targetKind:
        id.startsWith('inspect-') ||
        ['relationship', 'complete', 'unverifiable', 'fix-validation'].includes(id)
          ? 'inspection'
          : 'action',
      context: {
        area: ['find-groups'].includes(id)
          ? 'home'
          : id === 'create-group'
            ? 'groups'
            : id === 'create-plan'
              ? 'plans'
              : id === 'create-app'
                ? 'apps'
                : id === 'inspect-denial'
                  ? 'activity'
                  : id === 'inspect-policy'
                    ? 'policy'
                    : ['architecture', 'relationship'].includes(id)
                      ? 'architecture'
                      : ['complete', 'unverifiable', 'inspect-group', 'inspect-app'].includes(id)
                        ? 'resource'
                        : 'create',
        kind:
          id.includes('group') || ['subscription', 'metadata'].includes(id)
            ? 'group'
            : id.includes('app') || id === 'hosting'
              ? 'app'
              : 'plan',
      },
      action: id.startsWith('commit-')
        ? 'submit'
        : id.startsWith('review-')
          ? 'review'
          : ['complete', 'unverifiable'].includes(id)
            ? 'return'
            : id.startsWith('inspect-') || id === 'relationship'
              ? 'inspect'
              : id.startsWith('create-') || id === 'find-groups' || id === 'architecture'
                ? 'navigate'
                : 'configure',
      sourceIds:
        id.includes('group') || ['subscription', 'metadata'].includes(id)
          ? ['P03']
          : ['P04', 'S12', 'S39'],
      copyKey: id,
      validation:
        id === 'complete'
          ? 'replayed-world-and-inspections@1'
          : 'observed-context-or-validated-receipt@1',
      returnTo: courseHref('services', 'practice'),
    },
  ]),
) as Record<StepId, GuideStep>;
/** Presentation eligibility only: never advances the lab or validates a command. */
export function guideContextMatches(step: GuideStep, location: PortalLocation): boolean {
  if (step.id === 'unverifiable') return false;
  if (step.target === 'search' || step.target === 'architecture') return true;
  if (location.area !== step.context.area) return false;
  return (
    location.area !== 'create' ||
    step.id === 'fix-validation' ||
    location.kind === step.context.kind
  );
}
export function guideStep(
  session: LabSession,
  engine: Engine,
  attempt: number,
  location: PortalLocation,
  form: LabForm | null,
): GuideStep {
  const f = labFacts(session, engine, attempt);
  const pick = (id: StepId) => guideDefinitions[id];
  if (!f.verifiable) return pick('unverifiable');
  if (f.complete) return pick('complete');
  if (f.app && f.policy)
    return pick(
      location.area === 'resource' && location.id === f.app.id
        ? 'inspect-app'
        : location.area === 'architecture'
          ? 'relationship'
          : 'architecture',
    );
  if (f.denial && !f.policy)
    return pick(location.area === 'policy' ? 'inspect-policy' : 'inspect-denial');
  if (f.group && !f.plan && !f.denial && location.area === 'resource' && location.id === f.group.id)
    return pick('inspect-group');
  const kind = !f.group ? 'group' : !f.plan || !f.denial ? 'plan' : 'app';
  if (location.area !== 'create' || location.kind !== kind) {
    if (!f.group) return pick(location.area === 'groups' ? 'create-group' : 'find-groups');
    if (kind === 'plan') return pick('create-plan');
    return pick('create-app');
  }
  if (!form)
    return pick(kind === 'group' ? 'subscription' : kind === 'plan' ? 'plan-group' : 'app-group');
  if (form.step === 'review' && !form.valid) return pick('fix-validation');
  if (form.step === 'review')
    return pick(kind === 'group' ? 'commit-group' : kind === 'plan' ? 'commit-plan' : 'commit-app');
  if (kind === 'group') {
    if (form.subscription !== 'sub-app') return pick('subscription');
    if (!validResourceGroupName(form.name)) return pick('group-name');
    if (form.region !== 'norwayeast') return pick('metadata');
    return pick('review-group');
  }
  if (form.group !== f.group?.id) return pick(kind === 'plan' ? 'plan-group' : 'app-group');
  if (!/^[a-z][a-z0-9-]{2,39}$/.test(form.name))
    return pick(kind === 'plan' ? 'plan-name' : 'app-name');
  if (kind === 'plan') {
    if (!f.denial && form.region !== 'northeurope') return pick('plan-region');
    if (f.denial && form.region !== 'westeurope') return pick('correct-plan');
    return pick('review-plan');
  }
  if (form.plan !== f.plan?.id) return pick('hosting');
  return pick('review-app');
}
