/** Conceptual physical model only. Never imports Portal inventory or dispatches Azure commands. */
export const physicalKey = 'azurelab.learning.architecture-physical.v1';
export const physicalTopics = [
  'datacenters',
  'regions',
  'zones',
  'pairs',
  'sovereign',
  'explorer',
  'assessment',
  'summary',
] as const;
export type PhysicalTopic = (typeof physicalTopics)[number];
export const isPhysicalTopic = (v: unknown): v is PhysicalTopic =>
  typeof v === 'string' && (physicalTopics as readonly string[]).includes(v);
export const physicalSources = {
  AR01: 'credentials/certifications/resources/study-guides/az-900',
  AR02: 'training/modules/describe-core-architectural-components-of-azure/',
  AR03: 'azure/reliability/regions-overview',
  AR04: 'azure/reliability/regions-list',
  AR05: 'azure/reliability/regions-paired',
  AR06: 'azure/reliability/availability-zones-overview',
  AR07: 'azure/reliability/availability-zones-zonal-resource-resiliency',
  AR08: 'azure/reliability/availability-zones-service-support',
  AR09: 'azure/security/fundamentals/physical-security',
  AR10: 'azure/cloud-adoption-framework/ready/azure-setup-guide/regions',
  AR11: 'azure/azure-government/documentation-government-welcome',
  AR12: 'azure/china/overview-operations',
  AR13: 'azure/reliability/concept-reliability-sovereignty',
  AR14: 'training/paths/azure-fundamentals-describe-azure-architecture-services/',
} as const;
export const physicalManifest = {
  id: 'core-physical',
  version: '1.0.0',
  competency: 'F02',
  objectives: ['CA01', 'CA02', 'CA03'],
  exam: { version: '2026-07-20', CA01: '2.1.01', CA02: '2.1.02', CA03: '2.1.03' },
  remainingObjectives: ['2.1.04', '2.1.05', '2.1.06', '2.1.07'],
  prerequisites: ['physical-server', 'virtualization', 'v2-responsibility', 'availability'],
  activities: ['teach-physical', 'explore-infrastructure', 'apply-physical'],
  sourceReviewed: '2026-10-27',
  humanSme: null,
  learnerStudy: null,
  sources: physicalSources,
} as const;
/** Dated teaching subset, NOT a live region/SKU catalogue or actual datacenter topology. */
export const regionExamples = {
  norwayeast: { geography: 'norway', zones: true, pair: 'norwaywest', restricted: false },
  norwaywest: { geography: 'norway', zones: false, pair: 'norwayeast', restricted: true },
  westeurope: { geography: 'europe', zones: true, pair: 'northeurope', restricted: false },
  northeurope: { geography: 'europe', zones: true, pair: 'westeurope', restricted: false },
  italynorth: { geography: 'italy', zones: true, pair: null, restricted: false },
} as const;
export type ExampleRegion = keyof typeof regionExamples;
export type Geography = (typeof regionExamples)[ExampleRegion]['geography'];
export type PhysicalState = 'up' | 'down' | 'unknown';
export type ServiceState = 'serving' | 'unavailable' | 'uncertain';
export interface InfrastructureInput {
  region: ExampleRegion;
  secondary: ExampleRegion;
  placement: 'single' | 'same-zone' | 'multi-zone' | 'multi-region' | 'nonzonal';
  data: 'single' | 'replicated';
  routing: 'primary' | 'healthy';
  failure: 'none' | 'datacenter' | 'zone' | 'region';
  target: string;
}
export interface PhysicalPlacement {
  region: ExampleRegion;
  zone: string | null;
  facility: string | null;
}
export const initialInfrastructure: InfrastructureInput = {
  region: 'norwayeast',
  secondary: 'northeurope',
  placement: 'single',
  data: 'single',
  routing: 'primary',
  failure: 'datacenter',
  target: 'norwayeast:a1',
};
const exact = (o: object, keys: string[]) =>
  Object.keys(o).sort().join() === [...keys].sort().join();
const regionKnown = (v: unknown): v is ExampleRegion =>
  typeof v === 'string' && Object.hasOwn(regionExamples, v);
export function facilities(region: ExampleRegion): PhysicalPlacement[] {
  return regionExamples[region].zones
    ? ['a', 'b', 'c'].flatMap((zone) =>
        [1, 2].map((n) => ({ region, zone, facility: `${zone}${n}` })),
      )
    : [1, 2].map((n) => ({ region, zone: null, facility: `d${n}` }));
}
export function failureTargets(
  input: Pick<InfrastructureInput, 'region' | 'secondary' | 'placement' | 'failure'>,
): string[] {
  const regions =
    input.placement === 'multi-region' ? [input.region, input.secondary] : [input.region];
  if (input.failure === 'none') return ['none'];
  if (input.failure === 'region') return [...regions];
  return regions.flatMap((r) =>
    input.failure === 'zone'
      ? regionExamples[r].zones
        ? ['a', 'b', 'c'].map((z) => `${r}:${z}`)
        : []
      : facilities(r).map((d) => `${r}:${d.facility}`),
  );
}
export function validInfrastructure(raw: unknown): raw is InfrastructureInput {
  if (
    !raw ||
    typeof raw !== 'object' ||
    Array.isArray(raw) ||
    !exact(raw, ['region', 'secondary', 'placement', 'data', 'routing', 'failure', 'target'])
  )
    return false;
  const v = raw as InfrastructureInput;
  return (
    regionKnown(v.region) &&
    regionKnown(v.secondary) &&
    ['single', 'same-zone', 'multi-zone', 'multi-region', 'nonzonal'].includes(v.placement) &&
    ['single', 'replicated'].includes(v.data) &&
    ['primary', 'healthy'].includes(v.routing) &&
    ['none', 'datacenter', 'zone', 'region'].includes(v.failure) &&
    (!(v.placement === 'same-zone' || v.placement === 'multi-zone') ||
      regionExamples[v.region].zones) &&
    (v.placement !== 'multi-region' || v.region !== v.secondary) &&
    failureTargets(v).includes(v.target)
  );
}
export function evaluateInfrastructure(raw: unknown) {
  if (!validInfrastructure(raw)) return null;
  const input = { ...raw };
  const first = facilities(input.region)[0]!;
  const positions: PhysicalPlacement[] =
    input.placement === 'nonzonal'
      ? [{ region: input.region, zone: null, facility: null }]
      : input.placement === 'same-zone'
        ? [first, facilities(input.region)[1]!]
        : input.placement === 'multi-zone'
          ? [first, facilities(input.region)[2]!]
          : input.placement === 'multi-region'
            ? [first, facilities(input.secondary)[0]!]
            : [first];
  const affected = (p: PhysicalPlacement): PhysicalState => {
    if (input.failure === 'none') return 'up';
    const targetRegion = input.target.split(':')[0];
    if (p.region !== targetRegion) return 'up';
    if (input.failure === 'region') return 'down';
    if (!p.facility) return 'unknown';
    return (input.failure === 'zone' ? `${p.region}:${p.zone}` : `${p.region}:${p.facility}`) ===
      input.target
      ? 'down'
      : 'up';
  };
  const apps = positions.map((p, i) => ({
    id: `app-${i + 1}`,
    role: 'app' as const,
    ...p,
    state: affected(p),
  }));
  const data = (input.data === 'replicated' ? positions : positions.slice(0, 1)).map((p, i) => ({
    id: `data-${i + 1}`,
    role: 'data' as const,
    ...p,
    state: affected(p),
  }));
  const chosen =
    input.routing === 'healthy' ? apps.filter((a) => a.state !== 'down') : apps.slice(0, 1);
  const liveData = data.some((d) => d.state === 'up'),
    possibleData = data.some((d) => d.state !== 'down');
  const usable = chosen.filter((a) => a.state === 'up' && liveData);
  const possible = chosen.filter((a) => a.state !== 'down' && possibleData);
  const status: ServiceState = usable.length
    ? 'serving'
    : possible.length
      ? 'uncertain'
      : 'unavailable';
  return {
    input,
    apps,
    data,
    components: [...apps, ...data],
    status,
    usable: usable.map((a) => a.id),
    physicalSurvivors: apps.filter((a) => a.state === 'up').length,
    routed: chosen.map((a) => a.id),
    relations: [
      ...apps.flatMap((a) =>
        data.map((d) => ({ from: a.id, to: d.id, type: 'requires-data' as const })),
      ),
      ...chosen.map((a) => ({ from: 'routing', to: a.id, type: 'routes-to' as const })),
    ],
    sites: [...new Set(positions.map((p) => p.region))]
      .flatMap(facilities)
      .map((p) => ({ ...p, state: affected(p) })),
  };
}
export type InfrastructureResult = NonNullable<ReturnType<typeof evaluateInfrastructure>>;
export const physicalStudy = {
  datacenters: {
    objective: 'CA03',
    options: ['management', 'isolated', 'safe'],
    answer: 'management',
  },
  regions: {
    objective: 'CA01',
    options: ['requirements', 'name', 'group'],
    answer: 'requirements',
  },
  zones: {
    objective: 'CA02',
    options: ['vulnerable', 'automatic', 'labels'],
    answer: 'vulnerable',
  },
  pairs: {
    objective: 'CA01',
    options: ['relationship', 'copy', 'unpaired'],
    answer: 'relationship',
  },
  sovereign: {
    objective: 'CA01',
    options: ['environment', 'same', 'guarantee'],
    answer: 'environment',
  },
} as const;
export type PhysicalSection = keyof typeof physicalStudy;
export const physicalCriteria = {
  zoneDesign: { objective: 'CA02', options: ['complete', 'apps', 'same'], answer: 'complete' },
  zoneReason: {
    objective: 'CA02',
    options: ['boundary', 'region', 'provider'],
    answer: 'boundary',
  },
  mapping: { objective: 'CA02', options: ['check', 'same', 'different'], answer: 'check' },
  regions: {
    objective: 'CA01',
    options: ['configured', 'pair-only', 'pair-auto'],
    answer: 'configured',
  },
  regionReason: {
    objective: 'CA01',
    options: ['all-data', 'primary', 'label'],
    answer: 'all-data',
  },
  sovereign: {
    objective: 'CA01',
    options: ['government', 'us-region', 'china'],
    answer: 'government',
  },
  asymmetric: {
    objective: 'CA01',
    options: ['asymmetric', 'invalid', 'automatic'],
    answer: 'asymmetric',
  },
  facility: {
    objective: 'CA03',
    options: ['datacenter', 'subscription', 'pair'],
    answer: 'datacenter',
  },
  grouping: {
    objective: 'CA03',
    options: ['facilities', 'regions', 'groups'],
    answer: 'facilities',
  },
  fault: {
    objective: 'CA03',
    options: ['shared-zone', 'one-building', 'metadata'],
    answer: 'shared-zone',
  },
} as const;
export type PhysicalCriterion = keyof typeof physicalCriteria;
export type PhysicalEvent =
  | { kind: 'visit'; topic: PhysicalTopic }
  | { kind: 'study'; section: PhysicalSection; answer: string }
  | { kind: 'run'; input: InfrastructureInput; prediction: ServiceState }
  | { kind: 'explain'; answer: 'dependencies' | 'pair' | 'zones' }
  | { kind: 'begin' | 'aid' | 'abandon' }
  | { kind: 'draft' | 'submit'; answers: Record<string, string> };
export interface PhysicalSave {
  schema: 1;
  module: 'core-physical';
  content: '1.0.0';
  model: '1.0.0';
  rubric: '1.0.0';
  events: PhysicalEvent[];
}
export const freshPhysical = (): PhysicalSave => ({
  schema: 1,
  module: 'core-physical',
  content: '1.0.0',
  model: '1.0.0',
  rubric: '1.0.0',
  events: [],
});
export function physicalFacts(save: PhysicalSave) {
  let active = false,
    assisted = false,
    attempts = 0,
    abandoned = 0,
    draft: Record<string, string> = {};
  const submissions: {
    answers: Record<string, string>;
    assisted: boolean;
    retry: boolean;
    criteria: Record<PhysicalCriterion, boolean>;
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
          Object.entries(physicalCriteria).map(([id, c]) => [id, e.answers[id] === c.answer]),
        ) as Record<PhysicalCriterion, boolean>,
      });
      active = false;
      draft = {};
    } else if (active && (e.kind !== 'visit' || e.topic !== 'assessment')) assisted = true;
  }
  const studied = (section: PhysicalSection) => {
    const e = save.events.findLast((e) => e.kind === 'study' && e.section === section);
    return e?.kind === 'study' && e.answer === physicalStudy[section].answer;
  };
  const runs = save.events.filter(
    (e): e is Extract<PhysicalEvent, { kind: 'run' }> => e.kind === 'run',
  );
  const loss = runs.find(
    (e) =>
      e.input.placement === 'single' &&
      e.input.failure === 'datacenter' &&
      evaluateInfrastructure(e.input)!.apps[0]!.state === 'down',
  );
  const dependency = runs.find(
    (e) =>
      e.input.placement === 'multi-zone' &&
      e.input.data === 'single' &&
      e.input.routing === 'healthy' &&
      e.input.failure === 'zone' &&
      evaluateInfrastructure(e.input)!.physicalSurvivors > 0 &&
      evaluateInfrastructure(e.input)!.status === 'unavailable',
  );
  const resilient = runs.find(
    (e) =>
      e.input.placement === 'multi-zone' &&
      e.input.data === 'replicated' &&
      e.input.routing === 'healthy' &&
      e.input.failure === 'zone' &&
      evaluateInfrastructure(e.input)!.status === 'serving' &&
      evaluateInfrastructure(e.input)!.components.some((c) => c.state === 'down'),
  );
  const explained = save.events.findLast((e) => e.kind === 'explain');
  const objective = (id: string) => {
    const criteria = Object.entries(physicalCriteria)
      .filter(([, c]) => c.objective === id)
      .map(([k]) => k as PhysicalCriterion);
    return {
      taught: Object.entries(physicalStudy)
        .filter(([, s]) => s.objective === id)
        .every(([s]) => studied(s as PhysicalSection)),
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
    witnesses: [loss, dependency, resilient],
    guided:
      !!loss &&
      !!dependency &&
      !!resilient &&
      explained?.kind === 'explain' &&
      explained.answer === 'dependencies',
    objective,
    lastTopic: save.events.findLast((e) => e.kind === 'visit')?.topic,
  };
}
export function applyPhysical(save: PhysicalSave, raw: unknown): PhysicalSave | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const e = raw as PhysicalEvent,
    f = physicalFacts(save);
  // Normal activity is bounded. Reserve one truthful assistance observation and
  // one terminal event so a full history can never strand an active assessment.
  // Full, valid history is safely read-only; it is not corrupt/uncertain state.
  if (save.events.length >= 400) {
    if (
      e.kind === 'visit' &&
      exact(e, ['kind', 'topic']) &&
      isPhysicalTopic(e.topic) &&
      e.topic !== 'assessment' &&
      f.active
    )
      return applyPhysical(save, { kind: 'aid' });
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
  if (e.kind === 'visit') valid = exact(e, ['kind', 'topic']) && isPhysicalTopic(e.topic);
  if (e.kind === 'study')
    valid =
      exact(e, ['kind', 'section', 'answer']) &&
      Object.hasOwn(physicalStudy, e.section) &&
      (physicalStudy[e.section].options as readonly string[]).includes(e.answer);
  if (e.kind === 'run')
    valid =
      exact(e, ['kind', 'input', 'prediction']) &&
      validInfrastructure(e.input) &&
      ['serving', 'unavailable', 'uncertain'].includes(e.prediction);
  if (e.kind === 'explain')
    valid =
      exact(e, ['kind', 'answer']) &&
      f.runs.length > 0 &&
      ['dependencies', 'pair', 'zones'].includes(e.answer);
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
          Object.hasOwn(physicalCriteria, k) &&
          typeof v === 'string' &&
          ((e.kind === 'draft' && v === '') ||
            (physicalCriteria[k as PhysicalCriterion].options as readonly string[]).includes(v)),
      ) &&
      (e.kind === 'draft' || exact(a, Object.keys(physicalCriteria)));
  }
  if (!valid) return null;
  if (JSON.stringify(save.events.at(-1)) === JSON.stringify(e)) return save;
  return { ...save, events: [...save.events, structuredClone(e)] };
}
export function restorePhysical(raw: string | null): {
  save: PhysicalSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshPhysical(), issue: null };
  try {
    if (raw.length > 200000) throw Error('size');
    const v = JSON.parse(raw);
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw Error('shape');
    if (
      v.schema !== 1 ||
      v.module !== 'core-physical' ||
      v.content !== '1.0.0' ||
      v.model !== '1.0.0' ||
      v.rubric !== '1.0.0'
    )
      return { save: freshPhysical(), issue: 'unsupported' };
    if (
      !exact(v, ['schema', 'module', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(v.events) ||
      v.events.length > 402 ||
      (v.events.length > 400 && !['aid', 'submit', 'abandon'].includes(v.events[400]?.kind)) ||
      (v.events.length > 401 && !['submit', 'abandon'].includes(v.events[401]?.kind))
    )
      throw Error('shape');
    let save = freshPhysical();
    for (const e of v.events) {
      const n = applyPhysical(save, e);
      if (!n) throw Error('event');
      save = n;
    }
    return { save, issue: null };
  } catch {
    return { save: freshPhysical(), issue: 'corrupt' };
  }
}
export const physicalActivities = {
  'teach-physical': {
    objectives: physicalManifest.objectives,
    kind: 'teaching',
    presenter: 'PhysicalLesson.Theory',
  },
  'explore-infrastructure': {
    objectives: physicalManifest.objectives,
    kind: 'practice',
    evaluate: evaluateInfrastructure,
  },
  'apply-physical': {
    objectives: physicalManifest.objectives,
    kind: 'independent',
    evaluate: physicalFacts,
  },
} as const;
