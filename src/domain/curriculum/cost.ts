import {
  allocateCost,
  estimateCost,
  exactCostKeys,
  record,
  validBudget,
  validEstimate,
  validTags,
  type EstimateInput,
  type AnalysisScope,
  type AnalysisDimension,
  type BudgetInput,
  type TagInput,
} from './cost-model';
export const costKey = 'azurelab.learning.cost-management.v1';
export const costVersion = '1.0.0';
export const costLimit = 800;
export const costTopics = [
  'introduction',
  'drivers',
  'estimate',
  'analysis',
  'budgets',
  'tags',
  'optimization',
  'assessment',
  'summary',
] as const;
export type CostTopic = (typeof costTopics)[number];
export const costMissions = ['estimate', 'analysis', 'budgets', 'tags'] as const;
export type CostMission = (typeof costMissions)[number];
export type Prediction = 'lower' | 'same' | 'higher';
const item = (
  family: string,
  objectives: string[],
  decision: number,
  reason: number,
  repeat: CostTopic,
  sources: string[],
) => ({
  family,
  objectives,
  accepted: [decision, reason] as const,
  repeat,
  sources,
  itemVersion: costVersion,
  rubricVersion: costVersion,
});
export const costItems = {
  cm01: item('drivers', ['CM01'], 1, 2, 'drivers', ['CS03', 'CS10']),
  cm02: item('drivers', ['CM01'], 0, 1, 'drivers', ['CS03', 'CS20']),
  cm03: item('calculator', ['CM02'], 2, 0, 'estimate', ['CS04', 'CS10']),
  cm04: item('calculator', ['CM02', 'CM01'], 1, 2, 'estimate', ['CS03', 'CS10']),
  cm05: item('management', ['CM03'], 0, 1, 'analysis', ['CS11', 'CS12']),
  cm06: item('management', ['CM03'], 2, 1, 'budgets', ['CS13', 'CS14']),
  cm07: item('tags', ['CM04'], 1, 2, 'tags', ['CS15', 'CS16', 'CS17']),
  cm08: item('tags', ['CM04'], 2, 0, 'tags', ['CS15', 'CS17']),
  cm09: item('optimization', ['CM05', 'CM01'], 0, 1, 'optimization', ['CS18', 'CS19', 'CS21']),
  cm10: item('optimization', ['CM05', 'CM01'], 1, 2, 'optimization', ['CS20', 'CS22']),
} as const;
export type CostItemId = keyof typeof costItems;
export const costItemIds = Object.keys(costItems) as CostItemId[];
export const costManifest = {
  id: 'cost-management',
  content: costVersion,
  model: costVersion,
  rubric: costVersion,
  reviewed: '2026-10-27',
  prerequisites: ['FC06', 'FC07', 'ST01', 'ST02', 'CA04', 'CA05'],
  objectives: { CM01: ['F03'], CM02: ['F03'], CM03: ['F03', 'G04'], CM04: ['G04'], CM05: ['F03'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: { '3.1.01': 'CM01', '3.1.02': 'CM02', '3.1.03': 'CM03', '3.1.04': 'CM04' },
  },
  teaching: costTopics,
  activities: costMissions,
  assessment: costItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export const costHref = (topic: CostTopic, item?: CostItemId) =>
  `/learn/cost?topic=${topic}${item ? `&case=${item}` : ''}`;
export interface CostAnswer {
  decision: number | null;
  reason: number | null;
}
export interface CostAttempt {
  id: number;
  item: CostItemId;
  family: string;
  itemVersion: string;
  rubricVersion: string;
  answer: CostAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export type CostRun =
  | {
      kind: 'run';
      mission: 'estimate';
      input: EstimateInput;
      baseline: EstimateInput;
      prediction: Prediction;
    }
  | {
      kind: 'run';
      mission: 'analysis';
      input: { scope: AnalysisScope; dimension: AnalysisDimension };
      prediction: Prediction;
    }
  | { kind: 'run'; mission: 'budgets'; input: BudgetInput; prediction: Prediction }
  | { kind: 'run'; mission: 'tags'; input: TagInput; prediction: Prediction };
export type CostConfiguration = CostRun extends infer R
  ? R extends CostRun
    ? Omit<R, 'kind' | 'prediction'> & { kind: 'configure' }
    : never
  : never;
export type CostEvent =
  | CostRun
  | CostConfiguration
  | { kind: 'visit'; topic: CostTopic }
  | { kind: 'mission'; mission: CostMission }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: CostItemId }
  | { kind: 'draft'; answer: CostAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface CostSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: CostEvent[];
}
export const freshCost = (): CostSave => ({
  schema: 1,
  content: costVersion,
  model: costVersion,
  rubric: costVersion,
  events: [],
});
export interface CostGuided {
  id: number;
  mission: CostMission;
  runs: CostRun[];
  answer: number | null;
  configuration: CostConfiguration | null;
}
const sameExceptHours = (a: EstimateInput, b: EstimateInput) =>
  (Object.keys(a) as (keyof EstimateInput)[]).every((key) => key === 'hours' || a[key] === b[key]);
export function guidedCostFacts(g: CostGuided) {
  const runs = g.runs;
  let witnessed = false;
  if (g.mission === 'estimate') {
    const estimates = runs.filter(
      (r): r is Extract<CostRun, { mission: 'estimate' }> => r.mission === 'estimate',
    );
    witnessed = estimates.some((a, idx) =>
      estimates
        .slice(idx + 1)
        .some(
          (b) =>
            a.input.hours === 720 &&
            b.input.hours === 240 &&
            a.input.count === 1 &&
            a.input.size === 'standard' &&
            a.input.storage === 100 &&
            a.input.egress === 50 &&
            sameExceptHours(a.input, b.input),
        ),
    );
  }
  if (g.mission === 'analysis')
    witnessed = runs.some(
      (r) =>
        r.mission === 'analysis' && r.input.scope === 'app' && r.input.dimension === 'component',
    );
  if (g.mission === 'budgets')
    witnessed =
      runs.some(
        (r) =>
          r.mission === 'budgets' &&
          r.input.scope === 'app' &&
          r.input.amount === 600 &&
          r.input.type === 'actual' &&
          r.input.percent === 80,
      ) &&
      runs.some(
        (r) =>
          r.mission === 'budgets' &&
          r.input.scope === 'app' &&
          r.input.amount === 600 &&
          r.input.type === 'forecast' &&
          r.input.percent === 100,
      );
  if (g.mission === 'tags') {
    const tagged = runs.filter(
      (r): r is Extract<CostRun, { mission: 'tags' }> => r.mission === 'tags',
    );
    witnessed =
      tagged.some((r) => r.input.mode === 'off' && allocateCost(r.input)!.unassigned > 0) &&
      ['keep-resource', 'prefer-parent'].every((mode) =>
        tagged.some(
          (r) =>
            r.input.mode === mode &&
            ['fixture-large', 'fixture-disk'].every((id) => {
              const t = r.input.values[id as keyof TagInput['values']];
              return t.department === 'Product' && t.environment === 'Development';
            }),
        ),
      );
  }
  const expected = { estimate: 0, analysis: 1, budgets: 2, tags: 0 }[g.mission];
  return {
    witnessed,
    correct: g.answer === expected,
    complete: witnessed && g.answer === expected,
  };
}
export function costFacts(save: CostSave) {
  const attempts: CostAttempt[] = [],
    guided: CostGuided[] = [],
    visited: CostTopic[] = [];
  let current: CostAttempt | undefined,
    guide: CostGuided | undefined,
    topic: CostTopic = 'introduction';
  for (const e of save.events) {
    if (e.kind === 'visit') {
      topic = e.topic;
      if (!visited.includes(topic)) visited.push(topic);
    }
    if (e.kind === 'mission') {
      guide = {
        id: guided.length + 1,
        mission: e.mission,
        runs: [],
        answer: null,
        configuration: null,
      };
      guided.push(guide);
    }
    if (e.kind === 'configure' && guide) guide.configuration = e;
    if (e.kind === 'run') guide?.runs.push(e);
    if (e.kind === 'explain' && guide) guide.answer = e.answer;
    if (e.kind === 'begin') {
      const d = costItems[e.item];
      current = {
        id: attempts.length + 1,
        item: e.item,
        family: d.family,
        itemVersion: d.itemVersion,
        rubricVersion: d.rubricVersion,
        answer: { decision: null, reason: null },
        assisted: false,
        retry: attempts.some((a) => a.family === d.family),
        status: 'active',
      };
      attempts.push(current);
    } else if (current?.status === 'active') {
      if (e.kind === 'draft') current.answer = { ...e.answer };
      if (e.kind === 'aid') current.assisted = true;
      if (e.kind === 'submit') current.status = 'submitted';
      if (e.kind === 'abandon') current.status = 'abandoned';
    }
  }
  const firsts = costItemIds.flatMap((item) => {
    const first = attempts.find((a) => a.item === item && a.status === 'submitted');
    return first ? [first] : [];
  });
  return {
    attempts,
    current,
    active: current?.status === 'active',
    assisted: current?.status === 'active' && current.assisted,
    guided,
    guide,
    visited,
    topic,
    firsts,
    completed: costMissions.filter((id) =>
      guided.some((g) => g.mission === id && guidedCostFacts(g).complete),
    ),
    full: save.events.length >= costLimit - 5,
  };
}
export const evaluateCostAttempt = (a: CostAttempt) => ({
  decision: a.answer.decision === costItems[a.item].accepted[0],
  relation:
    a.answer.decision === costItems[a.item].accepted[0] &&
    a.answer.reason === costItems[a.item].accepted[1],
  misconceptions: (['decision', 'reason'] as const)
    .filter((f, i) => a.answer[f] !== costItems[a.item].accepted[i])
    .map((f) => `cost.${a.item}.${f}.${a.answer[f]}`),
});
const choice = (v: unknown) =>
  v === null || (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < 3);
function validEvent(e: unknown): e is CostEvent {
  if (!record(e)) return false;
  if (e.kind === 'configure')
    return (
      exactCostKeys(e, [
        'kind',
        'mission',
        'input',
        ...(e.mission === 'estimate' ? ['baseline'] : []),
      ]) &&
      validEvent({
        ...e,
        kind: 'run',
        prediction: 'same',
      })
    );
  if (e.kind === 'visit')
    return exactCostKeys(e, ['kind', 'topic']) && costTopics.includes(e.topic as CostTopic);
  if (e.kind === 'mission')
    return exactCostKeys(e, ['kind', 'mission']) && costMissions.includes(e.mission as CostMission);
  if (e.kind === 'explain')
    return exactCostKeys(e, ['kind', 'answer']) && e.answer !== null && choice(e.answer);
  if (e.kind === 'run') {
    if (
      !exactCostKeys(e, [
        'kind',
        'mission',
        'input',
        'prediction',
        ...(e.mission === 'estimate' ? ['baseline'] : []),
      ]) ||
      !['lower', 'same', 'higher'].includes(e.prediction as string)
    )
      return false;
    if (e.mission === 'estimate') return validEstimate(e.input) && validEstimate(e.baseline);
    if (e.mission === 'budgets') return validBudget(e.input);
    if (e.mission === 'tags') return validTags(e.input);
    return (
      e.mission === 'analysis' &&
      record(e.input) &&
      exactCostKeys(e.input, ['scope', 'dimension']) &&
      ['all', 'app', 'shared'].includes(e.input.scope as string) &&
      ['component', 'service', 'scope', 'group'].includes(e.input.dimension as string)
    );
  }
  if (e.kind === 'begin')
    return exactCostKeys(e, ['kind', 'item']) && costItemIds.includes(e.item as CostItemId);
  if (e.kind === 'draft')
    return (
      exactCostKeys(e, ['kind', 'answer']) &&
      record(e.answer) &&
      exactCostKeys(e.answer, ['decision', 'reason']) &&
      choice(e.answer.decision) &&
      choice(e.answer.reason)
    );
  return ['aid', 'submit', 'abandon'].includes(e.kind as string) && exactCostKeys(e, ['kind']);
}
export function applyCost(save: CostSave, raw: unknown): CostSave | null {
  if (!validEvent(raw)) return null;
  const f = costFacts(save);
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= costLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= costLimit - 1) return null;
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
      if (!f.guide || !guidedCostFacts(f.guide).witnessed) return null;
      if (f.guide.answer === raw.answer || guidedCostFacts(f.guide).complete) return save;
    } else if (save.events.length >= costLimit - 5) return null;
    if (
      (raw.kind === 'run' || raw.kind === 'configure') &&
      (!f.guide || f.guide.mission !== raw.mission)
    )
      return null;
    if (raw.kind === 'configure' && JSON.stringify(raw) === JSON.stringify(f.guide?.configuration))
      return save;
  }
  if (save.events.length >= costLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreCost(raw: string | null): {
  save: CostSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshCost(), issue });
  if (raw === null) return { save: freshCost(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const p: unknown = JSON.parse(raw);
    if (!record(p)) return invalid('corrupt');
    if (
      p.schema !== 1 ||
      p.content !== costVersion ||
      p.model !== costVersion ||
      p.rubric !== costVersion
    )
      return invalid('unsupported');
    if (
      !exactCostKeys(p, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(p.events) ||
      p.events.length > costLimit
    )
      return invalid('corrupt');
    let save = freshCost();
    for (const e of p.events) {
      const next = applyCost(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
/** Model-derived milestone evidence; display history is kept in the existing UI-only store. */
export function costMilestoneFacts(save: CostSave) {
  const f = costFacts(save);
  const time = f.guided.some(
    (g) =>
      g.mission === 'estimate' &&
      g.runs.some(
        (a, idx) =>
          a.mission === 'estimate' &&
          g.runs
            .slice(idx + 1)
            .some(
              (b) =>
                b.mission === 'estimate' &&
                b.input.hours < a.input.hours &&
                sameExceptHours(a.input, b.input) &&
                estimateCost(b.input)!.cents < estimateCost(a.input)!.cents,
            ),
      ),
  );
  const budget = f.guided.some((g) => g.mission === 'budgets' && guidedCostFacts(g).witnessed);
  return { time, budget };
}
