import { unitIds, type UnitId, units, transferCriteria, type ObjectiveId } from './manifest';
export const profiles = {
  campaign: [2, 2, 10, 2],
  steady: [6, 6, 6, 6],
  uncertain: [0, 0, 0, 4],
  idle: [0, 0, 0, 0],
} as const;
export type Profile = keyof typeof profiles;
export interface Probe {
  profile: Profile;
  mode: 'owned' | 'cloud';
  capacity: 6 | 10;
  released: boolean;
  pricing: 'usage' | 'commitment';
  topology: 'public' | 'private' | 'hybrid';
}
export const initialProbe: Probe = {
  profile: 'campaign',
  mode: 'owned',
  capacity: 6,
  released: false,
  pricing: 'usage',
  topology: 'public',
};
/** Deliberately synthetic four-period arithmetic. Not an Azure billing/scaling model. */
export function experiment(p: Probe) {
  const demand = profiles[p.profile];
  const allocated = demand.map((d) =>
    p.mode === 'owned' ? p.capacity : p.released ? 0 : p.profile === 'idle' ? 6 : d,
  );
  const served = demand.map((d, i) => Math.min(d, allocated[i]!));
  const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
  const total = sum(allocated),
    useful = sum(served),
    requested = sum(demand);
  const cost =
    p.mode === 'owned'
      ? 4 * p.capacity + 12
      : p.pricing === 'commitment'
        ? 24 + 2 * sum(allocated.map((n) => Math.max(0, n - 6)))
        : 2 * total;
  const commitmentUnused =
    p.mode === 'cloud' && p.pricing === 'commitment'
      ? sum(allocated.map((n) => Math.max(0, 6 - n)))
      : 0;
  const overflow =
    p.mode === 'cloud' && p.pricing === 'commitment'
      ? sum(allocated.map((n) => Math.max(0, n - 6)))
      : 0;
  return {
    demand: [...demand],
    allocated,
    served,
    shortfall: requested - useful,
    idle: total - useful,
    utilization: total ? Math.round((100 * useful) / total) : 0,
    cost,
    commitmentUnused,
    overflow,
  };
}
export function parseProbe(raw: unknown): Probe | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const p = raw as Record<string, unknown>;
  if (
    Object.keys(p).sort().join(',') !== 'capacity,mode,pricing,profile,released,topology' ||
    typeof p.profile !== 'string' ||
    !Object.hasOwn(profiles, p.profile) ||
    typeof p.mode !== 'string' ||
    !['owned', 'cloud'].includes(p.mode) ||
    ![6, 10].includes(p.capacity as number) ||
    typeof p.released !== 'boolean' ||
    typeof p.pricing !== 'string' ||
    !['usage', 'commitment'].includes(p.pricing) ||
    typeof p.topology !== 'string' ||
    !['public', 'private', 'hybrid'].includes(p.topology)
  )
    return null;
  return { ...p } as unknown as Probe;
}
export function supportedProbe(unit: UnitId, p: Probe) {
  if (unit === 'capacity')
    return p.profile !== 'idle' && p.pricing === 'usage' && !p.released && p.topology === 'public';
  if (unit === 'pricing')
    return (
      p.profile !== 'idle' &&
      p.mode === 'cloud' &&
      p.capacity === 6 &&
      !p.released &&
      p.topology === 'public'
    );
  if (unit === 'metering')
    return (
      p.profile === 'idle' &&
      p.mode === 'cloud' &&
      p.capacity === 6 &&
      p.pricing === 'usage' &&
      p.topology === 'public'
    );
  if (unit === 'responsibility')
    return (
      p.profile === 'campaign' &&
      p.mode === 'cloud' &&
      p.capacity === 6 &&
      !p.released &&
      p.pricing === 'usage' &&
      p.topology === 'public'
    );
  return (
    p.profile === 'campaign' &&
    p.mode === 'owned' &&
    p.capacity === 6 &&
    !p.released &&
    p.pricing === 'usage'
  );
}
export function observationKey(unit: UnitId, p: Probe) {
  if (unit === 'capacity')
    return experiment(p).shortfall > 0 ? 'shortfall' : p.mode === 'owned' ? 'owned' : 'provisioned';
  if (unit === 'models' || unit === 'placement') return p.topology;
  if (unit === 'responsibility') return 'retained';
  if (unit === 'metering') return p.released ? 'released' : 'metered';
  return p.pricing === 'usage'
    ? 'flexible'
    : experiment(p).commitmentUnused > 0
      ? 'wasted'
      : 'committed';
}
const roleAnswers = [
  'provider,customer,customer',
  ...['provider', 'customer'].flatMap((a) =>
    ['provider', 'customer'].flatMap((b) => ['provider', 'customer'].map((c) => `${a},${b},${c}`)),
  ),
];
const placementAnswers = [
  'public,private,hybrid',
  ...['public', 'private', 'hybrid'].flatMap((a) =>
    ['public', 'private', 'hybrid'].flatMap((b) =>
      ['public', 'private', 'hybrid'].map((c) => `${a},${b},${c}`),
    ),
  ),
];
export const answerOptions: Record<UnitId, readonly string[]> = {
  capacity: ['provisioning', 'internet', 'no-hardware'],
  responsibility: [...new Set(roleAnswers)],
  models: ['private', 'public', 'building-only'],
  placement: [...new Set(placementAnswers)],
  metering: ['allocated', 'traffic', 'everything-free'],
  pricing: ['usage', 'commitment', 'spot'],
};
export function correctPractice(unit: UnitId, answer: string) {
  return answer === answerOptions[unit][0];
}
export type LearningEvent =
  | { kind: 'visit'; unit: UnitId }
  | { kind: 'probe'; unit: UnitId; input: Probe; prediction: number }
  | { kind: 'answer'; unit: UnitId; answer: string }
  | { kind: 'begin-transfer' }
  | { kind: 'aid' }
  | { kind: 'submit' | 'draft'; answers: Record<string, string> };
export interface LearningSave {
  schema: 1;
  content: '1.0.0';
  model: '1.0.0';
  rubric: '1.0.0';
  unit: UnitId;
  events: LearningEvent[];
}
export const learningKey = 'azurelab.learning.foundations.v1';
export const freshLearning = (): LearningSave => ({
  schema: 1,
  content: '1.0.0',
  model: '1.0.0',
  rubric: '1.0.0',
  unit: 'capacity',
  events: [],
});
export function parseLearningEvent(raw: unknown): LearningEvent | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const e = raw as Record<string, unknown>,
    keys = Object.keys(e).sort().join(',');
  if ((e.kind === 'aid' || e.kind === 'begin-transfer') && keys === 'kind') return { kind: e.kind };
  if ((e.kind === 'submit' || e.kind === 'draft') && keys === 'answers,kind') {
    if (!e.answers || typeof e.answers !== 'object' || Array.isArray(e.answers)) return null;
    const a = e.answers as Record<string, unknown>;
    if (
      (e.kind === 'submit' &&
        Object.keys(a).sort().join(',') !==
          transferCriteria
            .map((c) => c.id)
            .sort()
            .join(',')) ||
      Object.keys(a).some((id) => !transferCriteria.some((c) => c.id === id)) ||
      Object.values(a).some((v) => typeof v !== 'string' || v.length > 40)
    )
      return null;
    // Values must belong to the finite choice register; unknown strings cannot become evidence.
    const allowed: Record<string, readonly string[]> = {
      service: ['provisioning', 'internet', 'no-hardware'],
      shortfall: Array.from({ length: 41 }, (_, i) => String(i)),
      duties: ['customer', 'provider'],
      exclusive: ['private', 'public', 'hybrid'],
      integration: ['hybrid', 'public', 'private'],
      idle: ['allocated', 'traffic'],
      uncertain: ['usage', 'commitment', 'spot'],
      commitment: ['paid', 'free'],
    };
    if (
      Object.entries(a).some(
        ([id, v]) => !(e.kind === 'draft' && v === '') && !allowed[id]?.includes(v as string),
      )
    )
      return null;
    return { kind: e.kind, answers: { ...a } as Record<string, string> };
  }
  if (!unitIds.includes(e.unit as UnitId)) return null;
  const unit = e.unit as UnitId;
  if (e.kind === 'visit' && keys === 'kind,unit') return { kind: 'visit', unit };
  if (
    e.kind === 'answer' &&
    keys === 'answer,kind,unit' &&
    answerOptions[unit].includes(e.answer as string)
  )
    return { kind: 'answer', unit, answer: e.answer as string };
  if (e.kind === 'probe' && keys === 'input,kind,prediction,unit') {
    const input = parseProbe(e.input);
    if (
      input &&
      supportedProbe(unit, input) &&
      Number.isInteger(e.prediction) &&
      Number(e.prediction) >= 0 &&
      Number(e.prediction) <= 40
    )
      return { kind: 'probe', unit, input, prediction: Number(e.prediction) };
  }
  return null;
}
export function learningFacts(save: LearningSave) {
  const observations = Object.fromEntries(
    unitIds.map((unit) => {
      const probes = save.events.filter(
        (e): e is Extract<LearningEvent, { kind: 'probe' }> =>
          e.kind === 'probe' && e.unit === unit,
      );
      const tested = (fn: (p: Probe) => boolean) => probes.some((e) => fn(e.input));
      const practiced =
        unit === 'capacity'
          ? (['campaign', 'steady'] as const).every((profile) =>
              (['owned', 'cloud'] as const).every((mode) =>
                tested((p) => p.profile === profile && p.mode === mode && !p.released),
              ),
            )
          : unit === 'models'
            ? (['public', 'private', 'hybrid'] as const).every((t) =>
                tested((p) => p.topology === t),
              )
            : unit === 'metering'
              ? tested((p) => p.profile === 'idle' && p.mode === 'cloud' && !p.released) &&
                tested((p) => p.profile === 'idle' && p.mode === 'cloud' && p.released)
              : unit === 'pricing'
                ? (['steady', 'uncertain'] as const).every((profile) =>
                    (['usage', 'commitment'] as const).every((pricing) =>
                      tested(
                        (p) =>
                          p.profile === profile &&
                          p.pricing === pricing &&
                          p.mode === 'cloud' &&
                          !p.released,
                      ),
                    ),
                  )
                : probes.length > 0;
      const introduced = save.events.some((e) => e.kind === 'visit' && e.unit === unit);
      const last = save.events.findLast((e) => e.kind === 'answer' && e.unit === unit);
      const guided =
        introduced && practiced && last?.kind === 'answer' && correctPractice(unit, last.answer);
      return [unit, { introduced, practiced, guided, probes, last }];
    }),
  ) as Record<
    UnitId,
    {
      introduced: boolean;
      practiced: boolean;
      guided: boolean;
      probes: Extract<LearningEvent, { kind: 'probe' }>[];
      last: LearningEvent | undefined;
    }
  >;
  let active = false,
    assisted = false;
  let draft: Record<string, string> = {};
  const submissions: {
    answers: Record<string, string>;
    assisted: boolean;
    retry: boolean;
    criteria: Record<string, boolean>;
  }[] = [];
  for (const event of save.events) {
    if (event.kind === 'begin-transfer') {
      active = true;
      assisted = false;
      draft = {};
    } else if (
      active &&
      (event.kind === 'aid' ||
        event.kind === 'visit' ||
        event.kind === 'probe' ||
        event.kind === 'answer')
    )
      assisted = true;
    else if (active && event.kind === 'draft') draft = event.answers;
    else if (active && event.kind === 'submit') {
      submissions.push({
        answers: event.answers,
        assisted,
        retry: submissions.length > 0,
        criteria: Object.fromEntries(
          transferCriteria.map((c) => [c.id, event.answers[c.id] === c.answer]),
        ),
      });
      active = false;
      draft = {};
    }
  }
  const first = submissions[0];
  const evidence = Object.fromEntries(
    units.flatMap((u) =>
      u.objectives.map((id) => [
        id,
        {
          introduced: observations[u.id].introduced,
          practiced: observations[u.id].practiced,
          guided: observations[u.id].guided,
          independent:
            !!first &&
            !first.assisted &&
            transferCriteria.filter((c) => c.objective === id).every((c) => first.criteria[c.id]),
        },
      ]),
    ),
  ) as Record<
    ObjectiveId,
    { introduced: boolean; practiced: boolean; guided: boolean; independent: boolean }
  >;
  return {
    observations,
    evidence,
    submissions,
    active,
    draft,
    assisted,
    guidedComplete: unitIds.every((id) => observations[id].guided),
  };
}
/** Reject impossible event order; results are always recomputed, never imported. */
export function applyLearning(save: LearningSave, raw: unknown): LearningSave | null {
  const e = parseLearningEvent(raw);
  if (!e || save.events.length >= 500) return null;
  const facts = learningFacts(save);
  if (e.kind === 'begin-transfer' && facts.active) return null;
  if ((e.kind === 'submit' || e.kind === 'aid' || e.kind === 'draft') && !facts.active) return null;
  if ((e.kind === 'probe' || e.kind === 'answer') && !facts.observations[e.unit].introduced)
    return null;
  if (e.kind === 'answer' && !facts.observations[e.unit].practiced) return null;
  const previous = save.events.at(-1);
  if (JSON.stringify(previous) === JSON.stringify(e)) return save;
  return { ...save, unit: 'unit' in e ? e.unit : save.unit, events: [...save.events, e] };
}
export function restoreLearning(raw: string | null): {
  save: LearningSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshLearning(), issue: null };
  try {
    if (raw.length > 180000) throw Error('size');
    const s = JSON.parse(raw);
    if (s?.schema !== 1 || s.content !== '1.0.0' || s.model !== '1.0.0' || s.rubric !== '1.0.0')
      return { save: freshLearning(), issue: 'unsupported' };
    if (
      Object.keys(s).sort().join(',') !== 'content,events,model,rubric,schema,unit' ||
      !unitIds.includes(s.unit) ||
      !Array.isArray(s.events) ||
      s.events.length > 500
    )
      throw Error('schema');
    let save = freshLearning();
    for (const event of s.events) {
      const next = applyLearning(save, event);
      if (!next) throw Error('event');
      save = next;
    }
    return { save: { ...save, unit: s.unit }, issue: null };
  } catch {
    return { save: freshLearning(), issue: 'corrupt' };
  }
}
