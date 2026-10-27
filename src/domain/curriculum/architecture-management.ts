import { inventory } from '../portal/model';
import { relations, types, type World, type Engine } from '../chapter01/model';
export const managementKey = 'azurelab.learning.architecture-management.v1';
export const managementTopics = [
  'organization',
  'resources',
  'groups',
  'subscriptions',
  'management',
  'hierarchy',
  'scope',
  'management-assessment',
  'core-summary',
] as const;
export type ManagementTopic = (typeof managementTopics)[number];
export const isManagementTopic = (v: unknown): v is ManagementTopic =>
  typeof v === 'string' && (managementTopics as readonly string[]).includes(v);
export const managementSources = {
  AM01: 'credentials/certifications/resources/study-guides/az-900',
  AM02: 'training/modules/describe-core-architectural-components-of-azure/',
  AM03: 'azure/azure-resource-manager/management/overview',
  AM04: 'azure/governance/management-groups/overview',
  AM05: 'azure/azure-resource-manager/management/manage-resource-groups-portal',
  AM06: 'azure/governance/policy/overview',
  AM07: 'azure/role-based-access-control/scope-overview',
  AM08: 'entra/fundamentals/how-subscriptions-associated-directory',
  AM09: 'azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org',
  AM10: 'azure/governance/policy/concepts/scope',
  AM11: 'azure/governance/policy/concepts/effect-basics',
  AM12: 'azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups',
  AM13: 'azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions',
  AM14: 'azure/cost-management-billing/manage/view-all-accounts',
  AM15: 'azure/azure-resource-manager/management/resource-providers-and-types',
  AM16: 'azure/azure-resource-manager/management/delete-resource-group',
  AM17: 'azure/azure-resource-manager/management/control-plane-and-data-plane',
  AM18: 'cli/azure/webapp?view=azure-cli-latest#az-webapp-create',
  AM19: 'azure/app-service/app-service-plan-manage',
} as const;
export const managementManifest = {
  id: 'core-management',
  version: '1.0.0',
  competency: 'F02',
  objectives: ['CA04', 'CA05', 'CA06', 'CA07'],
  exam: { version: '2026-07-20', CA04: '2.1.04', CA05: '2.1.05', CA06: '2.1.06', CA07: '2.1.07' },
  prerequisites: ['core-physical', 'service-types'],
  activities: ['teach-management', 'explore-management', 'apply-management'],
  sourceReviewed: '2026-10-27',
  humanSme: null,
  learnerStudy: null,
  sources: managementSources,
} as const;
export interface HierarchyNode {
  id: string;
  name: string;
  kind: string;
  parentId?: string;
  location?: string;
  type: string;
}
/** Read-only projection; identity association is explicitly NOT an ARM ancestor. */
export function managementHierarchy(world: World): HierarchyNode[] {
  return [
    ...world.scopes.map((s) => ({
      id: s.id,
      name: s.name,
      kind: s.kind === 'root' ? 'management' : s.kind,
      parentId: s.parentId,
      type:
        s.kind === 'subscription'
          ? 'Microsoft.Resources/subscriptions'
          : 'Microsoft.Management/managementGroups',
    })),
    ...inventory(world)
      .filter((r) => r.kind !== 'subscription')
      .map((r) => ({
        id: r.id,
        name: r.name,
        kind: r.kind,
        parentId: r.kind === 'group' ? r.subscriptionId : (r.parentId ?? r.groupId),
        location: r.location,
        type: r.type,
      })),
  ];
}
export function ancestry(nodes: readonly HierarchyNode[], id: string): string[] | null {
  const result: string[] = [];
  let node = nodes.find((n) => n.id === id);
  if (!node) return null;
  while (node) {
    if (result.includes(node.id)) return null;
    result.push(node.id);
    if (!node.parentId) break;
    const p = nodes.find((n) => n.id === node!.parentId);
    if (!p) return null;
    node = p;
  }
  return result;
}
export const scopeFixture: readonly HierarchyNode[] = [
  { id: 'root', name: 'root', kind: 'management', type: 'management' },
  { id: 'parent', name: 'parent', kind: 'management', parentId: 'root', type: 'management' },
  {
    id: 'development',
    name: 'development',
    kind: 'subscription',
    parentId: 'parent',
    type: 'subscription',
  },
  {
    id: 'production',
    name: 'production',
    kind: 'subscription',
    parentId: 'parent',
    type: 'subscription',
  },
  {
    id: 'dev-group',
    name: 'dev-group',
    kind: 'group',
    parentId: 'development',
    type: types.group,
  },
  {
    id: 'prod-group',
    name: 'prod-group',
    kind: 'group',
    parentId: 'production',
    type: types.group,
  },
  {
    id: 'dev-plan',
    name: 'dev-plan',
    kind: 'plan',
    parentId: 'dev-group',
    type: types.plan,
    location: 'northeurope',
  },
  {
    id: 'prod-plan',
    name: 'prod-plan',
    kind: 'plan',
    parentId: 'prod-group',
    type: types.plan,
    location: 'westeurope',
  },
  {
    id: 'dev-vm',
    name: 'dev-vm',
    kind: 'vm',
    parentId: 'dev-group',
    type: 'Microsoft.Compute/virtualMachines',
    location: 'northeurope',
  },
  {
    id: 'prod-app',
    name: 'prod-app',
    kind: 'app',
    parentId: 'prod-group',
    type: types.app,
    location: 'northeurope',
  },
];
export interface ScopeInput {
  scope: 'parent' | 'development' | 'production' | 'dev-group';
  target: 'plan' | 'app' | 'vm';
  effect: 'deny' | 'audit' | 'disabled';
  allowed: 'westeurope' | 'northeurope';
}
export const initialScope: ScopeInput = {
  scope: 'development',
  target: 'plan',
  effect: 'deny',
  allowed: 'westeurope',
};
const exact = (o: object, keys: string[]) =>
  Object.keys(o).sort().join() === [...keys].sort().join();
export function validScope(v: unknown): v is ScopeInput {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const s = v as ScopeInput;
  return (
    exact(s, ['scope', 'target', 'effect', 'allowed']) &&
    ['parent', 'development', 'production', 'dev-group'].includes(s.scope) &&
    ['plan', 'app', 'vm'].includes(s.target) &&
    ['deny', 'audit', 'disabled'].includes(s.effect) &&
    ['westeurope', 'northeurope'].includes(s.allowed)
  );
}
/** Counterfactual create evaluation, not real Policy/receipt/compliance state. */
export function evaluateScope(raw: unknown) {
  if (!validScope(raw)) return null;
  return scopeFixture
    .filter((n) => ['plan', 'app', 'vm'].includes(n.kind))
    .map((n) => {
      const path = ancestry(scopeFixture, n.id)!;
      const included = path.includes(raw.scope),
        target = n.kind === raw.target,
        condition = n.location !== raw.allowed;
      return {
        id: n.id,
        included,
        target,
        condition,
        inherited: included && n.id !== raw.scope,
        effect: raw.effect,
        status: !included
          ? 'outside'
          : !target
            ? 'other-type'
            : raw.effect === 'disabled'
              ? 'disabled'
              : !condition
                ? 'compliant'
                : raw.effect === 'audit'
                  ? 'finding'
                  : 'denied',
      };
    });
}
export function liveManagementObservation(engine: Engine) {
  const app = engine.world.resources.find((r) => r.type === types.app),
    plan = app && engine.world.resources.find((r) => r.id === app.planId && r.type === types.plan),
    group = app && engine.world.groups.find((g) => g.id === app.groupId);
  const denial = engine.ledger.findLast(
    ({ receipt: r }) =>
      r.outcome === 'rejected' &&
      r.code === 'policy-location-denied' &&
      r.policy?.assignmentScope === 'sub-app' &&
      r.addedIds.length === 0 &&
      r.beforeRevision === r.afterRevision,
  )?.receipt;
  return {
    relation:
      app && plan && group && plan.groupId === group.id
        ? { app: app.id, plan: plan.id, group: group.id, subscription: group.subscriptionId }
        : null,
    denial: denial?.policy
      ? {
          command: denial.commandId,
          scope: denial.policy.assignmentScope,
          assignment: denial.policy.assignmentId,
          location: denial.policy.requestedLocation,
        }
      : null,
    relations: relations(engine.world),
  };
}
export const managementStudy = {
  organization: {
    objective: 'CA07',
    options: ['separate', 'geography', 'automatic'],
    answer: 'separate',
  },
  resources: { objective: 'CA04', options: ['type', 'running', 'same'], answer: 'type' },
  groups: { objective: 'CA04', options: ['lifecycle', 'region', 'nested'], answer: 'lifecycle' },
  subscriptions: {
    objective: 'CA05',
    options: ['context', 'physical', 'invoice'],
    answer: 'context',
  },
  management: { objective: 'CA06', options: ['parent', 'network', 'automatic'], answer: 'parent' },
} as const;
export type ManagementSection = keyof typeof managementStudy;
export const managementCriteria = {
  subscription: {
    objective: 'CA05',
    options: ['development', 'production', 'region'],
    answer: 'production',
  },
  subscriptionReason: {
    objective: 'CA05',
    options: ['invoice', 'physical', 'boundary'],
    answer: 'boundary',
  },
  lifecycle: {
    objective: 'CA04',
    options: ['all', 'separate-app', 'location'],
    answer: 'separate-app',
  },
  lifecycleReason: {
    objective: 'CA04',
    options: ['shared-lifetime', 'relocate', 'hosting'],
    answer: 'shared-lifetime',
  },
  assignment: { objective: 'CA06', options: ['both', 'none', 'platform'], answer: 'platform' },
  effect: { objective: 'CA06', options: ['deny-all', 'conditions', 'web'], answer: 'conditions' },
  physical: { objective: 'CA07', options: ['subscriptions', 'groups', 'zones'], answer: 'zones' },
  relation: { objective: 'CA07', options: ['distinct', 'same', 'identity'], answer: 'distinct' },
} as const;
export type ManagementCriterion = keyof typeof managementCriteria;
export type ManagementEvent =
  | { kind: 'visit'; topic: ManagementTopic }
  | { kind: 'study'; section: ManagementSection; answer: string }
  | { kind: 'run'; input: ScopeInput; prediction: number }
  | { kind: 'explain'; answer: 'conditions' | 'all' | 'physical' }
  | {
      kind: 'observe';
      app: string;
      plan: string;
      group: string;
      subscription: string;
      answer: 'distinct' | 'same';
    }
  | {
      kind: 'policy';
      command: string;
      scope: 'sub-app';
      assignment: 'policy-web-location';
      location: string;
    }
  | { kind: 'begin' | 'aid' | 'abandon' }
  | { kind: 'draft' | 'submit'; answers: Record<string, string> };
export interface ManagementSave {
  schema: 1;
  module: 'core-management';
  content: '1.0.0';
  model: '1.0.0';
  rubric: '1.0.0';
  events: ManagementEvent[];
}
export const freshManagement = (): ManagementSave => ({
  schema: 1,
  module: 'core-management',
  content: '1.0.0',
  model: '1.0.0',
  rubric: '1.0.0',
  events: [],
});
export function managementFacts(save: ManagementSave) {
  let active = false,
    assisted = false,
    attempts = 0,
    abandoned = 0,
    draft: Record<string, string> = {};
  const submissions: {
    answers: Record<string, string>;
    assisted: boolean;
    retry: boolean;
    criteria: Record<ManagementCriterion, boolean>;
  }[] = [];
  for (const e of save.events) {
    if (e.kind === 'begin') {
      active = true;
      assisted = false;
      draft = {};
      attempts++;
    } else if (e.kind === 'abandon') {
      active = false;
      abandoned++;
      draft = {};
    } else if (e.kind === 'draft') draft = { ...e.answers };
    else if (e.kind === 'submit') {
      submissions.push({
        answers: e.answers,
        assisted,
        retry: attempts > 1,
        criteria: Object.fromEntries(
          Object.entries(managementCriteria).map(([id, c]) => [id, e.answers[id] === c.answer]),
        ) as Record<ManagementCriterion, boolean>,
      });
      active = false;
      draft = {};
    } else if (active && (e.kind !== 'visit' || e.topic !== 'management-assessment'))
      assisted = true;
  }
  const studied = (section: ManagementSection) => {
    const e = save.events.findLast((e) => e.kind === 'study' && e.section === section);
    return e?.kind === 'study' && e.answer === managementStudy[section].answer;
  };
  const runs = save.events.filter(
    (e): e is Extract<ManagementEvent, { kind: 'run' }> => e.kind === 'run',
  );
  const scoped = runs.some(
    (e) =>
      e.input.scope === 'development' &&
      e.input.effect === 'deny' &&
      evaluateScope(e.input)!.some((r) => r.status === 'denied'),
  );
  const widened = runs.some(
    (e) =>
      e.input.scope === 'parent' &&
      e.input.effect === 'audit' &&
      evaluateScope(e.input)!.some((r) => r.status === 'finding'),
  );
  const explained = save.events.findLast((e) => e.kind === 'explain');
  const observed = save.events.findLast((e) => e.kind === 'observe');
  const objective = (id: string) => {
    const criteria = Object.entries(managementCriteria)
      .filter(([, c]) => c.objective === id)
      .map(([k]) => k as ManagementCriterion);
    return {
      taught: Object.entries(managementStudy)
        .filter(([, s]) => s.objective === id)
        .every(([s]) => studied(s as ManagementSection)),
      first:
        submissions[0] &&
        !submissions[0].assisted &&
        !submissions[0].retry &&
        criteria.every((k) => submissions[0]!.criteria[k]),
      criteria,
    };
  };
  return {
    active,
    full: save.events.length >= 400,
    assisted,
    attempts,
    abandoned,
    draft,
    submissions,
    runs,
    studied,
    witnesses: [scoped, widened, observed?.kind === 'observe' && observed.answer === 'distinct'],
    guided:
      scoped &&
      widened &&
      observed?.kind === 'observe' &&
      observed.answer === 'distinct' &&
      explained?.kind === 'explain' &&
      explained.answer === 'conditions',
    objective,
    lastTopic: save.events.findLast((e) => e.kind === 'visit')?.topic,
  };
}
export function applyManagement(save: ManagementSave, raw: unknown): ManagementSave | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const e = raw as ManagementEvent,
    f = managementFacts(save);
  // Normal activity is bounded. Reserve one truthful assistance observation and
  // one terminal event so a full history can never strand an active assessment.
  // Full, valid history is safely read-only; it is not corrupt/uncertain state.
  if (save.events.length >= 400) {
    if (
      e.kind === 'visit' &&
      exact(e, ['kind', 'topic']) &&
      isManagementTopic(e.topic) &&
      e.topic !== 'management-assessment' &&
      f.active
    )
      return applyManagement(save, { kind: 'aid' });
    if (e.kind === 'aid' && exact(e, ['kind']) && f.active && f.assisted) return save;
    if (
      save.events.length >= 402 ||
      !f.active ||
      !(
        ['submit', 'abandon'].includes(e.kind) ||
        (e.kind === 'aid' && !f.assisted && save.events.length === 400)
      )
    )
      return null;
  }
  let valid = false;
  if (e.kind === 'visit') valid = exact(e, ['kind', 'topic']) && isManagementTopic(e.topic);
  if (e.kind === 'study')
    valid =
      exact(e, ['kind', 'section', 'answer']) &&
      Object.hasOwn(managementStudy, e.section) &&
      (managementStudy[e.section].options as readonly string[]).includes(e.answer);
  if (e.kind === 'run')
    valid =
      exact(e, ['kind', 'input', 'prediction']) &&
      validScope(e.input) &&
      Number.isSafeInteger(e.prediction) &&
      e.prediction >= 0 &&
      e.prediction <= 4;
  if (e.kind === 'explain')
    valid =
      exact(e, ['kind', 'answer']) &&
      f.runs.length > 0 &&
      ['conditions', 'all', 'physical'].includes(e.answer);
  if (e.kind === 'observe')
    valid =
      exact(e, ['kind', 'app', 'plan', 'group', 'subscription', 'answer']) &&
      [e.app, e.plan, e.group].every(
        (v) => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v),
      ) &&
      e.app !== e.plan &&
      ['sub-app', 'sub-shared'].includes(e.subscription) &&
      ['distinct', 'same'].includes(e.answer);
  if (e.kind === 'policy')
    valid =
      exact(e, ['kind', 'command', 'scope', 'assignment', 'location']) &&
      typeof e.command === 'string' &&
      /^[a-zA-Z0-9_-]{1,64}$/.test(e.command) &&
      e.scope === 'sub-app' &&
      e.assignment === 'policy-web-location' &&
      ['northeurope', 'norwayeast'].includes(e.location);
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
          Object.hasOwn(managementCriteria, k) &&
          typeof v === 'string' &&
          ((e.kind === 'draft' && v === '') ||
            (managementCriteria[k as ManagementCriterion].options as readonly string[]).includes(
              v,
            )),
      ) &&
      (e.kind === 'draft' || exact(a, Object.keys(managementCriteria)));
  }
  if (!valid) return null;
  if (JSON.stringify(save.events.at(-1)) === JSON.stringify(e)) return save;
  return { ...save, events: [...save.events, structuredClone(e)] };
}
export function restoreManagement(raw: string | null): {
  save: ManagementSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshManagement(), issue: null };
  try {
    if (raw.length > 200000) throw Error('size');
    const v = JSON.parse(raw);
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw Error('shape');
    if (
      v.schema !== 1 ||
      v.module !== 'core-management' ||
      v.content !== '1.0.0' ||
      v.model !== '1.0.0' ||
      v.rubric !== '1.0.0'
    )
      return { save: freshManagement(), issue: 'unsupported' };
    if (
      !exact(v, ['schema', 'module', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(v.events) ||
      v.events.length > 402 ||
      (v.events.length > 400 && !['aid', 'submit', 'abandon'].includes(v.events[400]?.kind)) ||
      (v.events.length > 401 && !['submit', 'abandon'].includes(v.events[401]?.kind))
    )
      throw Error('shape');
    let save = freshManagement();
    for (const e of v.events) {
      const n = applyManagement(save, e);
      if (!n) throw Error('event');
      save = n;
    }
    return { save, issue: null };
  } catch {
    return { save: freshManagement(), issue: 'corrupt' };
  }
}
export const managementActivities = {
  'teach-management': {
    objectives: managementManifest.objectives,
    kind: 'teaching',
    presenter: 'ManagementLesson.Theory',
  },
  'explore-management': {
    objectives: managementManifest.objectives,
    kind: 'practice',
    presenter: 'ManagementExplorer',
  },
  'apply-management': {
    objectives: managementManifest.objectives,
    kind: 'assessment',
    presenter: 'ManagementAssessment',
  },
} as const;
