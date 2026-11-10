import {
  computeModelVersion,
  integer,
  object,
  keys,
  validComputeInput,
  runCompute,
  type ComputeInput,
  type Outcome,
} from './compute-model';
import {
  computeItems,
  computeItemIds,
  evaluateCompute,
  type ComputeAnswer,
  type ComputeItemId,
} from './compute-items';
export { computeItems, computeItemIds, evaluateCompute };
export const evaluateComputeAttempt = (a: ComputeAttempt) => evaluateCompute(a.item, a.answer);
export type { ComputeAnswer, ComputeItemId };
export const computeKey = 'azurelab.learning.compute-hosting.v1';
export const computeVersion = '1.0.0';
export const computeLimit = 800;
export const computeTopics = [
  'introduction',
  'fundamentals',
  'vm',
  'dependencies',
  'containers',
  'functions',
  'options',
  'resilience',
  'desktop',
  'hosting',
  'context',
  'missions',
  'assessment',
  'summary',
] as const;
export type ComputeTopic = (typeof computeTopics)[number];
export const computeMissions = ['vm', 'container', 'capacity', 'hosting'] as const;
export type ComputeMission = (typeof computeMissions)[number];
export const computeGuidedAnswer = { vm: 1, container: 2, capacity: 1, hosting: 0 } as const;
export const computeMissionTopic = {
  vm: 'dependencies',
  container: 'containers',
  capacity: 'resilience',
  hosting: 'hosting',
} as const;
export const computeHref = (topic: ComputeTopic, item?: ComputeItemId) =>
  `/learn/compute?topic=${topic}${item ? `&case=${item}` : ''}`;
export const computeManifest = {
  id: 'compute-hosting',
  content: computeVersion,
  model: computeModelVersion,
  rubric: computeVersion,
  reviewed: '2026-10-28',
  prerequisites: ['ST01', 'ST02', 'FC08', 'CA01', 'CA02', 'CA04', 'CA05', 'CM01'],
  objectives: { CP01: ['C01', 'C02'], CP02: ['C02'], CP03: ['C02', 'N01'], CP04: ['C01', 'C02'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: { '2.2.01': 'CP01', '2.2.02': 'CP02', '2.2.03': 'CP03', '2.2.04': 'CP04' },
  },
  teaching: computeTopics,
  activities: computeMissions,
  assessment: computeItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface ComputeAttempt {
  id: number;
  item: ComputeItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: ComputeAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export interface ComputeRun {
  kind: 'run';
  input: ComputeInput;
  prediction: Outcome;
}
export interface ComputeGuide {
  id: number;
  mission: ComputeMission;
  attempt: number | null;
  boundary: string | null;
  target: string | null;
  inspected: string[];
  through: string | null;
  runs: ComputeRun[];
  configuration: Partial<Record<ComputeInput['kind'], ComputeInput>>;
  answer: number | null;
}
export type ComputeEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | ComputeRun
  | { kind: 'visit'; topic: ComputeTopic }
  | { kind: 'mission'; mission: ComputeMission; attempt: number | null; boundary: string | null }
  | { kind: 'configure'; input: ComputeInput }
  | { kind: 'select'; target: string }
  | { kind: 'inspect'; ref: string; through: string | null }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: ComputeItemId }
  | { kind: 'draft'; answer: ComputeAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface ComputeSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: ComputeEvent[];
}
export const freshCompute = (): ComputeSave => ({
  schema: 1,
  content: computeVersion,
  model: computeVersion,
  rubric: computeVersion,
  events: [],
});
export function computeGuidedFacts(g: ComputeGuide) {
  const containers = g.runs.filter((r) => r.input.kind === 'container'),
    capacities = g.runs.filter((r) => r.input.kind === 'capacity'),
    hostings = g.runs.filter((r) => r.input.kind === 'hosting');
  const container =
    g.mission === 'container' &&
    containers.some(
      (r) =>
        r.input.kind === 'container' &&
        r.input.platform === 'container' &&
        r.input.action === 'recreate' &&
        r.input.storage === 'ephemeral' &&
        runCompute(r.input)?.outcome === 1,
    ) &&
    containers.some(
      (r) =>
        r.input.kind === 'container' &&
        r.input.platform === 'container' &&
        r.input.action === 'recreate' &&
        r.input.storage === 'external' &&
        runCompute(r.input)?.outcome === 2,
    );
  const capacity =
    g.mission === 'capacity' &&
    capacities.some(
      (r) =>
        r.input.kind === 'capacity' &&
        r.input.mode === 'set' &&
        r.input.failure === 'zone' &&
        r.input.target === 0 &&
        runCompute(r.input)?.outcome === 0,
    ) &&
    capacities.some(
      (r) =>
        r.input.kind === 'capacity' &&
        r.input.mode === 'zones' &&
        r.input.count >= 3 &&
        r.input.failure === 'zone' &&
        r.input.target === 0 &&
        r.input.data &&
        r.input.routing === 'balanced' &&
        r.input.demand > 0 &&
        runCompute(r.input)?.outcome === 2,
    ) &&
    capacities.some(
      (r) =>
        r.input.kind === 'capacity' &&
        r.input.mode === 'vmss' &&
        r.input.auto &&
        r.input.failure === 'none' &&
        r.input.demand >= 30 &&
        runCompute(r.input)?.outcome === 2,
    );
  const hosting =
    g.mission === 'hosting' &&
    ['web-image', 'cluster-api'].every((w) =>
      hostings.some(
        (r) =>
          r.input.kind === 'hosting' &&
          r.input.workload === w &&
          runCompute(r.input)?.outcome === 2,
      ),
    );
  const witnessed = container || capacity || hosting;
  const correct = g.answer === computeGuidedAnswer[g.mission];
  return { witnessed, correct, complete: witnessed && correct };
}
export function computeFacts(save: ComputeSave) {
  const attempts: ComputeAttempt[] = [],
    guided: ComputeGuide[] = [],
    visited: ComputeTopic[] = [];
  let current: ComputeAttempt | undefined,
    guide: ComputeGuide | undefined,
    topic: ComputeTopic = 'introduction';
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
        attempt: e.attempt,
        boundary: e.boundary,
        target: null,
        through: null,
        inspected: [],
        runs: [],
        configuration: {},
        answer: null,
      };
      guided.push(guide);
    }
    if (e.kind === 'configure' && guide) guide.configuration[e.input.kind] = e.input;
    if (e.kind === 'run') guide?.runs.push(e);
    if (e.kind === 'select' && guide) {
      guide.target = e.target;
      guide.inspected = [];
      guide.through = null;
      guide.answer = null;
    }
    if (e.kind === 'inspect' && guide) {
      guide.inspected.push(e.ref);
      guide.through = e.through;
    }
    if (e.kind === 'explain' && guide) guide.answer = e.answer;
    if (e.kind === 'begin') {
      const d = computeItems[e.item];
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
    firsts: computeItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: computeMissions.filter((id) =>
      guided.some((g) => g.mission === id && computeGuidedFacts(g).complete),
    ),
    full: save.events.length >= computeLimit - 5,
  };
}
const ref = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const nullableRef = (v: unknown): v is string | null => v === null || ref(v);
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is ComputeEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && computeTopics.includes(v.topic as ComputeTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission', 'attempt', 'boundary']) &&
      computeMissions.includes(v.mission as ComputeMission) &&
      nullableRef(v.boundary) &&
      (v.mission === 'vm'
        ? integer(v.attempt, 1, 100000)
        : v.attempt === null && v.boundary === null)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validComputeInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'select') return keys(v, ['kind', 'target']) && ref(v.target);
  if (v.kind === 'inspect')
    return keys(v, ['kind', 'ref', 'through']) && ref(v.ref) && nullableRef(v.through);
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && computeItemIds.includes(v.item as ComputeItemId);
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
export function applyCompute(save: ComputeSave, raw: unknown): ComputeSave | null {
  if (!validEvent(raw)) return null;
  const f = computeFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= computeLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= computeLimit - 1) return null;
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
      if (
        !g ||
        !(g.mission === 'vm'
          ? g.target && g.inspected.length >= 7
          : computeGuidedFacts(g).witnessed)
      )
        return null;
      if (g.answer === raw.answer || g.answer === computeGuidedAnswer[g.mission]) return save;
    } else if (raw.kind === 'pause') {
      if (!g) return save;
    } else if (raw.kind === 'resume') {
      if (!f.guided.some((g) => g.id === raw.id)) return null;
      if (g?.id === raw.id) return save;
    } else if (f.full) return null;
    if (raw.kind === 'configure' || raw.kind === 'run') {
      if (
        !g ||
        (g.mission === 'container'
          ? raw.input.kind !== 'container'
          : g.mission === 'capacity'
            ? raw.input.kind !== 'capacity'
            : g.mission === 'hosting'
              ? !['hosting', 'desktop'].includes(raw.input.kind)
              : true)
      )
        return null;
      if (
        raw.kind === 'configure' &&
        JSON.stringify(g.configuration[raw.input.kind]) === JSON.stringify(raw.input)
      )
        return save;
      if (raw.kind === 'run' && g.runs.length >= 24) return null;
    }
    if (raw.kind === 'select') {
      if (g?.mission !== 'vm') return null;
      if (g.target === raw.target) return save;
      if (g.answer === computeGuidedAnswer[g.mission]) return null;
    }
    if (raw.kind === 'inspect') {
      if (g?.mission !== 'vm' || !g.target) return null;
      if (g.inspected.includes(raw.ref)) return save;
      if (g.inspected.length >= 12) return null;
    }
  }
  if (save.events.length >= computeLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreCompute(raw: string | null): {
  save: ComputeSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshCompute(), issue });
  if (raw === null) return { save: freshCompute(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== computeVersion ||
      s.model !== computeModelVersion ||
      s.rubric !== computeVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > computeLimit
    )
      return invalid('corrupt');
    let save = freshCompute();
    for (const e of s.events) {
      const next = applyCompute(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function computeMilestoneFacts(save: ComputeSave) {
  const f = computeFacts(save);
  return {
    container: f.guided.some((g) => g.mission === 'container' && computeGuidedFacts(g).witnessed),
    capacity: f.guided.some((g) => g.mission === 'capacity' && computeGuidedFacts(g).witnessed),
  };
}
