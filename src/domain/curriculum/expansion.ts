import { activities, experiment, type Activity, type Input } from './expansion-models';
export const tracks = ['benefits', 'services'] as const;
export type Track = (typeof tracks)[number];
export const trackUnits = {
  benefits: ['availability', 'reliability', 'governance', 'management', 'sustainability'],
  services: ['overview', 'iaas', 'paas', 'saas', 'selection', 'practice'],
} as const;
export type Unit = Activity | 'practice';
export const expansionKeys = {
  benefits: 'azurelab.learning.benefits.v1',
  services: 'azurelab.learning.service-types.v2',
} as const;
export const expansionVersion = (track: Track) => (track === 'benefits' ? '1.0.0' : '2.0.0');
export const routes = (track: Track): readonly string[] => [
  ...trackUnits[track],
  'assessment',
  'summary',
];
const correct: Record<Unit, string> = {
  availability: 'recovery',
  reliability: 'dependency',
  governance: 'policy',
  management: 'review',
  sustainability: 'measure',
  overview: 'fit',
  iaas: 'control',
  paas: 'verify',
  saas: 'least',
  selection: 'tradeoff',
  practice: 'retained',
};
const choices: Record<Unit, readonly string[]> = {
  availability: ['recovery', 'size', 'cloud'],
  reliability: ['dependency', 'scale', 'region'],
  governance: ['policy', 'secure', 'role'],
  management: ['review', 'consistent', 'manual'],
  sustainability: ['measure', 'carbon', 'off'],
  overview: ['fit', 'done'],
  iaas: ['control', 'managed', 'cpu'],
  paas: ['verify', 'bigger', 'rg'],
  saas: ['least', 'admin', 'provider'],
  selection: ['tradeoff', 'always', 'saas'],
  practice: ['retained', 'none'],
};
export const criteria = {
  benefits: {
    unmet: ['1', '0', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    dependency: ['restore', 'scale'],
    policy: ['one-rule', 'all'],
    template: ['review', 'nothing'],
    sustainability: ['data', 'none'],
    forecast: ['usage', 'sla'],
  },
  services: {
    guest: ['iaas', 'saas'],
    patch: ['customer', 'provider'],
    runtime: ['adapt', 'size'],
    departure: ['access', 'patch'],
    architecture: ['iaas', 'paas', 'saas'],
    reason: ['os-team', 'platform-supported', 'no-work'],
    hosting: ['plan', 'group'],
  },
} as const;
export type Answers = Record<string, string>;
export function assess(track: Track, a: Answers): Record<string, boolean> {
  if (track === 'benefits')
    return {
      unmet: a.unmet === '1',
      dependency: a.dependency === 'restore',
      policy: a.policy === 'one-rule',
      template: a.template === 'review',
      sustainability: a.sustainability === 'data',
      forecast: a.forecast === 'usage',
    };
  const pair =
    (a.architecture === 'iaas' && a.reason === 'os-team') ||
    (a.architecture === 'paas' && a.reason === 'platform-supported');
  return {
    guest: a.guest === 'iaas',
    patch: a.patch === 'customer',
    runtime: a.runtime === 'adapt',
    departure: a.departure === 'access',
    architecture: pair,
    reason: pair,
    hosting: a.hosting === 'plan',
  };
}
export type Event =
  | { kind: 'visit'; unit: Unit }
  | { kind: 'run'; unit: Activity; input: Input; prediction: number | null }
  | { kind: 'answer'; unit: Unit; answer: string }
  | { kind: 'begin' | 'aid' | 'abandon' | 'submit' }
  | { kind: 'draft'; answers: Answers }
  | { kind: 'choose'; version: 'v1' | 'v2' };
export interface Save {
  schema: 1;
  track: Track;
  content: string;
  model: '1.0.0';
  rubric: string;
  events: Event[];
}
export const fresh = (track: Track): Save => ({
  schema: 1,
  track,
  content: expansionVersion(track),
  model: '1.0.0',
  rubric: expansionVersion(track),
  events: [],
});
const exact = (o: object, keys: string[]) =>
  Object.keys(o).sort().join(',') === keys.sort().join(',');
const object = (o: unknown): o is Record<string, unknown> =>
  !!o && typeof o === 'object' && !Array.isArray(o);
const belongs = (track: Track, u: unknown): u is Unit =>
  typeof u === 'string' && (trackUnits[track] as readonly string[]).includes(u);
export function parseEvent(track: Track, raw: unknown): Event | null {
  if (!object(raw) || typeof raw.kind !== 'string') return null;
  const e = raw;
  if (e.kind === 'visit' && exact(e, ['kind', 'unit']) && belongs(track, e.unit)) return e as Event;
  if (
    e.kind === 'run' &&
    exact(e, ['kind', 'unit', 'input', 'prediction']) &&
    belongs(track, e.unit) &&
    Object.hasOwn(activities, String(e.unit)) &&
    experiment(e.unit as Activity, e.input) &&
    ((e.unit === 'availability' &&
      Number.isInteger(e.prediction) &&
      Number(e.prediction) >= 0 &&
      Number(e.prediction) <= 30) ||
      (e.unit !== 'availability' && e.prediction === null))
  )
    return e as Event;
  if (
    e.kind === 'answer' &&
    exact(e, ['kind', 'unit', 'answer']) &&
    belongs(track, e.unit) &&
    typeof e.answer === 'string' &&
    choices[e.unit].includes(String(e.answer))
  )
    return e as Event;
  if (['begin', 'aid', 'abandon', 'submit'].includes(String(e.kind)) && exact(e, ['kind']))
    return e as Event;
  if (
    e.kind === 'choose' &&
    track === 'services' &&
    exact(e, ['kind', 'version']) &&
    typeof e.version === 'string' &&
    ['v1', 'v2'].includes(String(e.version))
  )
    return e as Event;
  if (
    e.kind === 'draft' &&
    exact(e, ['kind', 'answers']) &&
    object(e.answers) &&
    Object.entries(e.answers).every(
      ([k, v]) =>
        Object.hasOwn(criteria[track], k) &&
        (criteria[track] as Record<string, readonly string[]>)[k]!.includes(String(v)) &&
        typeof v === 'string',
    )
  )
    return { kind: 'draft', answers: e.answers as Answers };
  return null;
}
export function facts(save: Save, technicalReady = false) {
  const introduced = new Set<Unit>(),
    witnesses = new Map<Unit, Set<string>>(),
    answers: Partial<Record<Unit, string>> = {},
    runs: Extract<Event, { kind: 'run' }>[] = [];
  const submissions: {
      answers: Answers;
      criteria: Record<string, boolean>;
      assisted: boolean;
      retry: boolean;
      attempt: number;
    }[] = [],
    attempts: { status: 'submitted' | 'abandoned'; assisted: boolean; number: number }[] = [];
  let active = false,
    assisted = false,
    draft: Answers = {},
    choice: 'v1' | 'v2' | null = null;
  for (const e of save.events) {
    if (e.kind === 'choose') choice = e.version;
    if (e.kind === 'visit') introduced.add(e.unit);
    if (e.kind === 'run') {
      runs.push(e);
      const set = witnesses.get(e.unit) ?? new Set<string>();
      experiment(e.unit, e.input)!.witnesses.forEach((w) => set.add(w));
      witnesses.set(e.unit, set);
    }
    if (e.kind === 'answer') answers[e.unit] = e.answer;
    if (e.kind === 'begin') {
      active = true;
      assisted = false;
      draft = {};
    }
    if (active && ['aid', 'visit', 'run', 'answer'].includes(e.kind)) assisted = true;
    if (e.kind === 'draft') draft = { ...e.answers };
    if (e.kind === 'abandon') {
      attempts.push({ status: 'abandoned', assisted, number: attempts.length + 1 });
      active = false;
      draft = {};
    }
    if (e.kind === 'submit') {
      submissions.push({
        answers: { ...draft },
        criteria: assess(save.track, draft),
        assisted,
        retry: attempts.length > 0,
        attempt: attempts.length + 1,
      });
      attempts.push({ status: 'submitted', assisted, number: attempts.length + 1 });
      active = false;
      draft = {};
    }
  }
  const observed = (unit: Unit) =>
    unit === 'practice' || activities[unit].required.every((w) => witnesses.get(unit)?.has(w));
  const guided = (unit: Unit) =>
    introduced.has(unit) &&
    observed(unit) &&
    answers[unit] === correct[unit] &&
    (unit !== 'practice' || technicalReady);
  return {
    introduced,
    witnesses,
    answers,
    runs,
    submissions,
    attempts,
    active,
    assisted,
    draft,
    choice,
    observed,
    guided,
    guidedComplete: trackUnits[save.track].every(guided),
  };
}
export function apply(save: Save, raw: unknown): Save | null {
  const e = parseEvent(save.track, raw);
  if (!e || save.events.length >= 600) return null;
  const state = facts(save);
  if (e.kind === 'begin' && state.active) return null;
  if (['draft', 'submit', 'abandon'].includes(e.kind) && !state.active) return null;
  if (e.kind === 'submit' && Object.keys(criteria[save.track]).some((k) => !state.draft[k]))
    return null;
  if (e.kind === 'answer' && !state.observed(e.unit)) return null;
  if (e.kind === 'aid' && (!state.active || state.assisted)) return save;
  if (e.kind === 'visit' && state.introduced.has(e.unit) && !state.active) return save;
  if (JSON.stringify(e) === JSON.stringify(save.events.at(-1))) return save;
  return { ...save, events: [...save.events, e] };
}
export function restore(
  track: Track,
  raw: string | null,
): { save: Save; issue: 'corrupt' | 'unsupported' | null } {
  if (raw === null) return { save: fresh(track), issue: null };
  try {
    if (raw.length > 300000) throw Error('size');
    const data = JSON.parse(raw);
    if (!object(data)) throw Error('shape');
    if (
      data.schema !== 1 ||
      data.content !== expansionVersion(track) ||
      data.model !== '1.0.0' ||
      data.rubric !== expansionVersion(track)
    )
      return { save: fresh(track), issue: 'unsupported' };
    if (
      !exact(data, ['schema', 'track', 'content', 'model', 'rubric', 'events']) ||
      data.track !== track ||
      !Array.isArray(data.events) ||
      data.events.length > 600
    )
      throw Error('shape');
    let save = fresh(track);
    for (const e of data.events) {
      const next = apply(save, e);
      if (!next) throw Error('event');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return { save: fresh(track), issue: 'corrupt' };
  }
}
