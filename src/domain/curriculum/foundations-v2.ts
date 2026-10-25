import {
  applyLearning,
  freshLearning,
  learningFacts,
  parseLearningEvent,
  type LearningSave,
} from './foundations';
import { capacityProof } from '../design-proof/capacity';

export const foundationsV2Key = 'azurelab.learning.foundations.v2';
export const beginnerSources = {
  BL01: 'https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/overview',
  BL02: 'https://learn.microsoft.com/en-us/azure/virtual-machines/overview',
  BL03: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming',
  BL04: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations',
  BL05: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules',
  BL06: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal',
} as const;
/** Changed, fixed assessment fixture; allocation 5 is intentionally not a guided/proof control. */
export function registrationResult() {
  const periods = [1, 7, 4, 2].map((demand) => ({
    demand,
    allocation: 5,
    served: Math.min(demand, 5),
    unused: Math.max(0, 5 - demand),
    unmet: Math.max(0, demand - 5),
  }));
  return {
    periods,
    peakUnmet: Math.max(...periods.map((p) => p.unmet)),
    unusedTotal: periods.reduce((sum, p) => sum + p.unused, 0),
  };
}
export const v2Topics = [
  'intro-request',
  'physical-server',
  'virtualization',
  'provisioning',
  'capacity-basics',
  'v2-capacity',
  'v2-responsibility',
  'v2-models',
  'v2-placement',
  'v2-metering',
  'v2-pricing',
  'resource-bridge',
] as const;
export type V2Topic = (typeof v2Topics)[number];
export const v2Routes = [...v2Topics, 'v2-assessment', 'v2-summary'] as const;
export const laterUnits = ['responsibility', 'models', 'placement', 'metering', 'pricing'] as const;
export const isV2Topic = (v: string) => (v2Routes as readonly string[]).includes(v);
export const v2Bindings = [
  {
    topic: 'intro-request',
    storyboard: ['S01'],
    visual: 'V01',
    objectives: ['B01'],
    sources: ['L02'],
  },
  {
    topic: 'physical-server',
    storyboard: ['S02', 'S03'],
    visual: 'V02',
    objectives: ['B02', 'B03'],
    sources: ['BL01', 'BL02'],
  },
  {
    topic: 'virtualization',
    storyboard: ['S04'],
    visual: 'V03',
    objectives: ['B04'],
    sources: ['BL01', 'BL02'],
  },
  {
    topic: 'provisioning',
    storyboard: ['S05'],
    visual: 'V04',
    objectives: ['B05', 'FC01'],
    sources: ['L02', 'BL02'],
  },
  {
    topic: 'capacity-basics',
    storyboard: ['S06'],
    visual: 'V05',
    objectives: ['FC02'],
    sources: ['L02'],
  },
  {
    topic: 'v2-capacity',
    storyboard: ['S07'],
    visual: 'V05',
    objectives: ['FC02'],
    sources: ['L02'],
  },
  {
    topic: 'v2-responsibility',
    storyboard: ['S08'],
    visual: 'V06',
    objectives: ['FC03'],
    sources: ['L03'],
  },
  {
    topic: 'v2-models',
    storyboard: ['S09'],
    visual: 'topology',
    objectives: ['FC04'],
    sources: ['L04'],
  },
  {
    topic: 'v2-placement',
    storyboard: ['S10'],
    visual: 'decision',
    objectives: ['FC05'],
    sources: ['L04'],
  },
  {
    topic: 'v2-metering',
    storyboard: ['S11'],
    visual: 'meter',
    objectives: ['FC06'],
    sources: ['L05'],
  },
  {
    topic: 'v2-pricing',
    storyboard: ['S12'],
    visual: 'comparison',
    objectives: ['FC07'],
    sources: ['L06', 'L07', 'L08'],
  },
  {
    topic: 'resource-bridge',
    storyboard: ['S13'],
    visual: 'live-hierarchy',
    objectives: ['G01'],
    sources: ['BL03', 'BL04', 'BL05', 'BL06'],
  },
] as const;
export const checks = {
  'intro-request': ['server', 'browser'],
  'physical-server': ['storage', 'ram'],
  virtualization: ['finite', 'new-memory'],
  provisioning: ['control', 'traffic'],
  'capacity-basics': ['unused', 'unmet'],
  'v2-capacity': ['same-hour', 'carry'],
} as const;
export type CheckId = keyof typeof checks;
export const v2Criteria = [
  {
    id: 'shortfall',
    objective: 'FC02',
    answer: '2',
    choices: Array.from({ length: 13 }, (_, i) => String(i)),
    numeric: true,
  },
  { id: 'unused', objective: 'FC02', answer: '1,3,4', choices: ['1,3,4', '2', '1,2,3,4'] },
  { id: 'cause', objective: 'FC02', answer: 'allocation', choices: ['allocation', 'provider'] },
  { id: 'host', objective: 'B04', answer: 'finite', choices: ['finite', 'infinite'] },
  {
    id: 'service',
    objective: 'FC01',
    answer: 'provisioning',
    choices: ['provisioning', 'internet', 'no-hardware'],
  },
  { id: 'duties', objective: 'FC03', answer: 'customer', choices: ['customer', 'provider'] },
  {
    id: 'exclusive',
    objective: 'FC04',
    answer: 'private',
    choices: ['private', 'public', 'hybrid'],
  },
  {
    id: 'integration',
    objective: 'FC05',
    answer: 'hybrid',
    choices: ['hybrid', 'public', 'private'],
  },
  { id: 'idle', objective: 'FC06', answer: 'allocated', choices: ['allocated', 'traffic'] },
  { id: 'uncertain', objective: 'FC07', answer: 'usage', choices: ['usage', 'commitment', 'spot'] },
  { id: 'commitment', objective: 'FC07', answer: 'paid', choices: ['paid', 'free'] },
] as const;
export type V2Event =
  | { kind: 'visit'; topic: V2Topic }
  | { kind: 'request' }
  | { kind: 'inspect'; part: 'cpu' | 'ram' | 'storage' | 'network' | 'os' | 'app' }
  | { kind: 'memory'; requested: [number, number] }
  | { kind: 'provision'; supported: boolean }
  | { kind: 'check'; topic: CheckId; answer: string }
  | { kind: 'capacity'; allocation: 4 | 6 | 10; prediction: number }
  | { kind: 'practice'; event: unknown }
  | { kind: 'begin' | 'aid' }
  | { kind: 'draft' | 'submit'; answers: Record<string, string> };
export interface FoundationsV2Save {
  schema: 2;
  content: '2.0.0';
  model: '2.0.0';
  rubric: '2.0.0';
  choice: 'v1' | 'v2' | null;
  events: V2Event[];
}
export const freshV2 = (): FoundationsV2Save => ({
  schema: 2,
  content: '2.0.0',
  model: '2.0.0',
  rubric: '2.0.0',
  choice: null,
  events: [],
});
export function hostAllocation(
  accepted: readonly [number, number],
  requested: readonly [number, number],
) {
  const valid =
    [...requested].every((n) => Number.isInteger(n) && n >= 1 && n <= 8) &&
    requested[0] + requested[1] <= 8;
  return {
    accepted: valid ? [...requested] : [...accepted],
    requested: [...requested],
    outcome: valid ? ('accepted' as const) : ('rejected' as const),
  };
}
export const provisioningResult = (supported: boolean) => (supported ? 'allocated' : 'unavailable');
const exact = (value: object, keys: string[]) =>
  Object.keys(value).sort().join(',') === keys.sort().join(',');
export function v2Facts(save: FoundationsV2Save) {
  let practice: LearningSave = freshLearning(),
    active = false,
    assisted = false,
    draft: Record<string, string> = {},
    memory: [number, number] = [3, 3];
  const submissions: {
    answers: Record<string, string>;
    assisted: boolean;
    retry: boolean;
    criteria: Record<string, boolean>;
  }[] = [];
  for (const e of save.events) {
    if (e.kind === 'memory')
      memory = hostAllocation(memory, e.requested).accepted as [number, number];
    if (e.kind === 'practice') practice = applyLearning(practice, e.event) ?? practice;
    if (e.kind === 'begin') {
      active = true;
      assisted = false;
      draft = {};
    } else if (e.kind === 'submit' && active) {
      submissions.push({
        answers: e.answers,
        assisted,
        retry: submissions.length > 0,
        criteria: Object.fromEntries(v2Criteria.map((c) => [c.id, e.answers[c.id] === c.answer])),
      });
      active = false;
      draft = {};
    } else if (e.kind === 'draft' && active) draft = e.answers;
    else if (active && !['draft', 'submit'].includes(e.kind)) assisted = true;
  }
  const visited = (topic: V2Topic) =>
    save.events.some((e) => e.kind === 'visit' && e.topic === topic);
  const correct = (topic: CheckId) =>
    save.events.findLast((e) => e.kind === 'check' && e.topic === topic);
  const checked = (topic: CheckId) => {
    const e = correct(topic);
    return e?.kind === 'check' && e.answer === checks[topic][0];
  };
  const runs = save.events.filter(
    (e): e is Extract<V2Event, { kind: 'capacity' }> => e.kind === 'capacity',
  );
  const observed = learningFacts(practice);
  const guided = (topic: V2Topic) => {
    if (topic === 'v2-capacity')
      return checked(topic) && [6, 10].every((n) => runs.some((r) => r.allocation === n));
    if (Object.hasOwn(checks, topic)) {
      const demonstrated =
        topic === 'intro-request'
          ? save.events.some((e) => e.kind === 'request')
          : topic === 'physical-server'
            ? ['ram', 'storage', 'os'].every((part) =>
                save.events.some((e) => e.kind === 'inspect' && e.part === part),
              )
            : topic === 'virtualization'
              ? save.events.some((e) => e.kind === 'memory' && e.requested[0] + e.requested[1] > 8)
              : topic === 'provisioning'
                ? [true, false].every((supported) =>
                    save.events.some((e) => e.kind === 'provision' && e.supported === supported),
                  )
                : true;
      return visited(topic) && demonstrated && checked(topic as CheckId);
    }
    const unit = laterUnits.find((u) => topic === `v2-${u}`);
    return unit ? observed.observations[unit].guided : false;
  };
  return {
    practice,
    observed,
    memory,
    visited,
    guided,
    runs,
    active,
    assisted,
    draft,
    submissions,
    complete: v2Topics.filter((t) => t !== 'resource-bridge').every(guided),
  };
}
export function applyV2(save: FoundationsV2Save, raw: unknown): FoundationsV2Save | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || save.events.length >= 600)
    return null;
  const e = raw as V2Event,
    f = v2Facts(save);
  let valid = false;
  if (e.kind === 'request') valid = exact(e, ['kind']) && f.visited('intro-request');
  if (e.kind === 'inspect')
    valid =
      exact(e, ['kind', 'part']) &&
      f.visited('physical-server') &&
      ['cpu', 'ram', 'storage', 'network', 'os', 'app'].includes(e.part);
  if (e.kind === 'memory')
    valid =
      exact(e, ['kind', 'requested']) &&
      f.visited('virtualization') &&
      Array.isArray(e.requested) &&
      e.requested.length === 2 &&
      e.requested.every((n) => Number.isInteger(n) && n >= 1 && n <= 8);
  if (e.kind === 'provision')
    valid =
      exact(e, ['kind', 'supported']) &&
      f.visited('provisioning') &&
      typeof e.supported === 'boolean';
  if (e.kind === 'visit')
    valid = exact(e, ['kind', 'topic']) && (v2Topics as readonly string[]).includes(e.topic);
  if (e.kind === 'check')
    valid =
      exact(e, ['kind', 'topic', 'answer']) &&
      Object.hasOwn(checks, e.topic) &&
      f.visited(e.topic) &&
      (checks[e.topic] as readonly string[]).includes(e.answer);
  if (e.kind === 'capacity')
    valid =
      exact(e, ['kind', 'allocation', 'prediction']) &&
      f.visited('v2-capacity') &&
      !!capacityProof({ allocation: e.allocation, demand: [3, 3, 8, 3] }) &&
      Number.isInteger(e.prediction) &&
      e.prediction >= 0 &&
      e.prediction <= 12;
  if (e.kind === 'practice') {
    const p = parseLearningEvent(e.event);
    valid =
      exact(e, ['kind', 'event']) &&
      !!p &&
      'unit' in p &&
      (laterUnits as readonly string[]).includes(p.unit) &&
      !!applyLearning(f.practice, p);
  }
  if (e.kind === 'begin') valid = exact(e, ['kind']) && !f.active;
  if (e.kind === 'aid') valid = exact(e, ['kind']) && f.active;
  if (e.kind === 'draft' || e.kind === 'submit') {
    const a = e.answers;
    valid =
      exact(e, ['kind', 'answers']) &&
      f.active &&
      !!a &&
      typeof a === 'object' &&
      !Array.isArray(a) &&
      Object.entries(a).every(
        ([id, v]) =>
          typeof v === 'string' &&
          ((e.kind === 'draft' && v === '') ||
            v2Criteria.some((c) => c.id === id && (c.choices as readonly string[]).includes(v))),
      ) &&
      (e.kind === 'draft' ||
        exact(
          a,
          v2Criteria.map((c) => c.id),
        ));
  }
  if (!valid) return null;
  if (JSON.stringify(save.events.at(-1)) === JSON.stringify(e)) return save;
  return { ...save, events: [...save.events, structuredClone(e)] };
}
export function restoreV2(raw: string | null): {
  save: FoundationsV2Save;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshV2(), issue: null };
  try {
    if (raw.length > 220000) throw Error('size');
    const s = JSON.parse(raw);
    if (
      !s ||
      s.schema !== 2 ||
      s.content !== '2.0.0' ||
      s.model !== '2.0.0' ||
      s.rubric !== '2.0.0'
    )
      return { save: freshV2(), issue: 'unsupported' };
    if (
      !exact(s, ['schema', 'content', 'model', 'rubric', 'choice', 'events']) ||
      ![null, 'v1', 'v2'].includes(s.choice) ||
      !Array.isArray(s.events) ||
      s.events.length > 600
    )
      throw Error('shape');
    let save = freshV2();
    for (const e of s.events) {
      const next = applyV2(save, e);
      if (!next) throw Error('event');
      save = next;
    }
    return { save: { ...save, choice: s.choice }, issue: null };
  } catch {
    return { save: freshV2(), issue: 'corrupt' };
  }
}
