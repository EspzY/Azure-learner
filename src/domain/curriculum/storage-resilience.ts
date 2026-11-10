import {
  resilienceModelVersion,
  validResilienceInput,
  runTiers,
  runReplication,
  type ResilienceInput,
  type Outcome,
} from './storage-resilience-model';
import {
  resilienceItems,
  resilienceItemIds,
  evaluateResilience,
  type ResilienceAnswer,
  type ResilienceItemId,
} from './storage-resilience-items';
export { resilienceItems, resilienceItemIds, evaluateResilience };
export type { ResilienceAnswer, ResilienceItemId };
export const resilienceKey = 'azurelab.learning.storage-resilience.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const resilienceVersion = '1.0.0';
export const resilienceLimit = 800;
export const resilienceTopics = [
  'introduction',
  'tiers',
  'lifecycle',
  'redundancy',
  'recovery',
  'boundaries',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type ResilienceTopic = (typeof resilienceTopics)[number];
export const resilienceMissions = ['tiers', 'replication'] as const;
export type ResilienceMission = (typeof resilienceMissions)[number];
export const resilienceGuidedAnswer = { tiers: 1, replication: 2 } as const;
export const resilienceMissionTopic = { tiers: 'studio', replication: 'studio' } as const;
export const resilienceHref = (topic: ResilienceTopic, item?: ResilienceItemId) =>
  `/learn/storage-resilience?topic=${topic}${item ? `&case=${item}` : ''}`;
export const resilienceManifest = {
  id: 'storage-resilience',
  content: resilienceVersion,
  model: resilienceModelVersion,
  rubric: resilienceVersion,
  reviewed: '2026-10-31',
  prerequisites: ['SG01', 'SG03', 'CA02', 'CM01'],
  objectives: { STB01: ['D01', 'F03'], STB02: ['D01', 'O03'] },
  objectiveSources: {
    STB01: ['SB03', 'SB05', 'SB06', 'SB07', 'SB12', 'SB16', 'SB20'],
    STB02: ['SB04', 'SB08', 'SB11', 'SB14', 'SB15', 'SB17', 'SB18', 'SB21', 'SB22', 'SB23'],
  },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.3.02', '2.3.03'],
    facets: {
      'Hot/Cool/Cold/Archive': 'STB01',
      'Online/offline and billing': 'STB01',
      'Lifecycle and rehydration': 'STB01',
      'LRS/ZRS/GRS/GZRS and RA': 'STB02',
      'Physical failure/data loss/recovery': 'STB02',
      'Service and Archive compatibility': 'STB02',
    },
  },
  teaching: resilienceTopics,
  activities: resilienceMissions,
  assessment: resilienceItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface ResilienceAttempt {
  id: number;
  item: ResilienceItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: ResilienceAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateResilienceAttempt = (a: ResilienceAttempt) =>
  evaluateResilience(a.item, a.answer);
export interface ResilienceRun {
  kind: 'run';
  input: ResilienceInput;
  prediction: Outcome;
}
export interface ResilienceGuide {
  id: number;
  mission: ResilienceMission;
  runs: ResilienceRun[];
  configuration: Partial<Record<ResilienceMission, ResilienceInput>>;
  answer: number | null;
}
export type ResilienceEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | ResilienceRun
  | { kind: 'visit'; topic: ResilienceTopic }
  | { kind: 'mission'; mission: ResilienceMission }
  | { kind: 'configure'; input: ResilienceInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: ResilienceItemId }
  | { kind: 'draft'; answer: ResilienceAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface ResilienceSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: ResilienceEvent[];
}
export const freshResilience = (): ResilienceSave => ({
  schema: 1,
  content: resilienceVersion,
  model: resilienceModelVersion,
  rubric: resilienceVersion,
  events: [],
});
/** Completion requires persisted contrasts, never visits, control clicks or elapsed time. */
export function resilienceWitnesses(g: ResilienceGuide) {
  const tierRuns = g.runs.flatMap((r) => {
    const x = runTiers(r.input);
    return x ? [x] : [];
  });
  const rep = g.runs.flatMap((r) => {
    const x = runReplication(r.input);
    return x ? [x] : [];
  });
  const paired = tierRuns.some(
    (a) =>
      a.input.usage === 'frequent' &&
      a.selected === 'cold' &&
      a.supported &&
      tierRuns.some(
        (b) =>
          b.selected === 'hot' &&
          b.supported &&
          b.costs!.total < a.costs!.total &&
          JSON.stringify({ ...a.input, tier: 'hot' }) === JSON.stringify(b.input),
      ),
  );
  return g.mission === 'tiers'
    ? [
        tierRuns.some(
          (x) =>
            x.input.usage === 'rare' &&
            x.input.days === 120 &&
            x.selected === 'cold' &&
            x.online &&
            x.input.retrieval === 'immediate',
        ),
        paired,
        ['stored', 'pending', 'complete'].every((phase) =>
          tierRuns.some((x) => x.selected === 'archive' && x.supported && x.input.phase === phase),
        ) &&
          tierRuns.some(
            (x) =>
              x.selected === 'archive' &&
              x.input.phase === 'pending' &&
              x.input.retrieval === 'immediate' &&
              !x.online,
          ),
        tierRuns.some(
          (x) => x.selected === 'archive' && x.input.redundancy === 'ZRS' && !x.compatible,
        ),
      ]
    : [
        rep.some(
          (x) =>
            x.qualified &&
            x.input.target === 'blob' &&
            x.input.redundancy === 'LRS' &&
            x.input.failure === 'rack' &&
            x.primaryRead,
        ) &&
          rep.some(
            (x) =>
              x.qualified &&
              x.input.target === 'blob' &&
              x.input.redundancy === 'LRS' &&
              x.input.failure === 'zone' &&
              !x.primaryRead,
          ),
        rep.some(
          (x) =>
            x.qualified &&
            x.input.target === 'blob' &&
            x.input.redundancy === 'ZRS' &&
            x.input.failure === 'zone' &&
            x.primaryRead,
        ),
        rep.some(
          (x) =>
            x.qualified &&
            x.input.target === 'blob' &&
            x.input.redundancy === 'GRS' &&
            x.input.failure === 'region' &&
            x.pendingWrite &&
            !x.secondaryRead,
        ) &&
          rep.some(
            (x) =>
              x.qualified &&
              x.input.target === 'blob' &&
              x.input.redundancy === 'RA-GRS' &&
              x.input.failure === 'region' &&
              x.pendingWrite &&
              x.secondaryRead &&
              !x.secondaryWrite,
          ),
        rep.some(
          (x) =>
            x.qualified &&
            x.input.target === 'blob' &&
            x.input.redundancy === 'RA-GZRS' &&
            x.input.failure === 'deletion' &&
            !x.protectedCopy &&
            !x.secondaryRead,
        ),
      ];
}
export function resilienceGuidedFacts(g: ResilienceGuide) {
  const witnesses = resilienceWitnesses(g),
    witnessed = witnesses.every(Boolean),
    correct = g.answer === resilienceGuidedAnswer[g.mission];
  return { witnesses, witnessed, correct, complete: witnessed && correct };
}
export function resilienceFacts(save: ResilienceSave) {
  const attempts: ResilienceAttempt[] = [],
    guided: ResilienceGuide[] = [],
    visited: ResilienceTopic[] = [];
  let current: ResilienceAttempt | undefined,
    guide: ResilienceGuide | undefined,
    topic: ResilienceTopic = 'introduction';
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
        runs: [],
        configuration: {},
        answer: null,
      };
      guided.push(guide);
    }
    if (e.kind === 'configure' && guide) guide.configuration[e.input.kind] = e.input;
    if (e.kind === 'run') guide?.runs.push(e);
    if (e.kind === 'explain' && guide) guide.answer = e.answer;
    if (e.kind === 'begin') {
      const d = resilienceItems[e.item];
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
    firsts: resilienceItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: resilienceMissions.filter((id) =>
      guided.some((g) => g.mission === id && resilienceGuidedFacts(g).complete),
    ),
    full: save.events.length >= resilienceLimit - 5,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is ResilienceEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && resilienceTopics.includes(v.topic as ResilienceTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission']) && resilienceMissions.includes(v.mission as ResilienceMission)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validResilienceInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && resilienceItemIds.includes(v.item as ResilienceItemId);
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
export function applyResilience(save: ResilienceSave, raw: unknown): ResilienceSave | null {
  if (!validEvent(raw)) return null;
  const f = resilienceFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= resilienceLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= resilienceLimit - 1) return null;
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
      if (!g || !resilienceGuidedFacts(g).witnessed) return null;
      if (g.answer === raw.answer || g.answer === resilienceGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (
        save.events.length >= resilienceLimit - 1 &&
        raw.answer !== resilienceGuidedAnswer[g.mission]
      )
        return null;
    } else if (raw.kind === 'pause') {
      if (!g) return save;
      if (f.full) return null;
    } else if (raw.kind === 'resume') {
      const target = f.guided.find((g) => g.id === raw.id);
      if (!target) return null;
      if (g?.id === raw.id) return save;
      // A previously paused witnessed mission may use one reserved recovery event,
      // leaving the last event for its causal explanation; no new model work fits.
      if (
        f.full &&
        (!resilienceGuidedFacts(target).witnessed || save.events.length >= resilienceLimit - 1)
      )
        return null;
    } else if (f.full) return null;
    if (raw.kind === 'configure' || raw.kind === 'run') {
      if (!g || g.mission !== raw.input.kind) return null;
      if (
        raw.kind === 'configure' &&
        JSON.stringify(g.configuration[raw.input.kind]) === JSON.stringify(raw.input)
      )
        return save;
      if (raw.kind === 'run' && g.runs.length >= 24) return null;
    }
  }
  if (save.events.length >= resilienceLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreResilience(raw: string | null): {
  save: ResilienceSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshResilience(), issue });
  if (raw === null) return { save: freshResilience(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== resilienceVersion ||
      s.model !== resilienceModelVersion ||
      s.rubric !== resilienceVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > resilienceLimit
    )
      return invalid('corrupt');
    let save = freshResilience();
    for (const e of s.events) {
      const next = applyResilience(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function resilienceMilestoneFacts(save: ResilienceSave) {
  const gs = resilienceFacts(save).guided;
  return {
    tiers: gs.some((g) => g.mission === 'tiers' && resilienceWitnesses(g)[2]),
    replication: gs.some((g) => g.mission === 'replication' && resilienceWitnesses(g)[2]),
  };
}
