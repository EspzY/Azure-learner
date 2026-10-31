import {
  storageModelVersion,
  integer,
  object,
  keys,
  validStorageInput,
  runDesign,
  runAccounts,
  runDelivery,
  type StorageInput,
  type Outcome,
} from './storage-model';
import {
  storageItems,
  storageItemIds,
  evaluateStorage,
  type StorageAnswer,
  type StorageItemId,
} from './storage-items';
export { storageItems, storageItemIds, evaluateStorage };
export type { StorageAnswer, StorageItemId };
export const storageKey = 'azurelab.learning.storage-services.v1';
export const storageVersion = '1.0.0';
export const storageLimit = 800;
export const storageTopics = [
  'introduction',
  'blob',
  'files',
  'queues',
  'tables',
  'accounts',
  'disks',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type StorageTopic = (typeof storageTopics)[number];
export const storageMissions = ['design', 'accounts', 'delivery'] as const;
export type StorageMission = (typeof storageMissions)[number];
export const storageGuidedAnswer = { design: 1, accounts: 0, delivery: 2 } as const;
export const storageMissionTopic = {
  design: 'studio',
  accounts: 'studio',
  delivery: 'studio',
} as const;
export const storageHref = (topic: StorageTopic, item?: StorageItemId) =>
  `/learn/storage?topic=${topic}${item ? `&case=${item}` : ''}`;
export const storageManifest = {
  id: 'storage-services',
  content: storageVersion,
  model: storageModelVersion,
  rubric: storageVersion,
  reviewed: '2026-10-31',
  prerequisites: ['CN03', 'CP01'],
  objectives: { SG01: ['D01'], SG02: ['D01'], SG03: ['D01', 'G02'], SG04: ['D01', 'C01'] },
  objectiveSources: {
    SG01: ['SS05', 'SS09', 'SS10', 'SS11', 'SS12', 'SS21'],
    SG02: ['SS13', 'SS14', 'SS15', 'SS16', 'SS17'],
    SG03: ['SS04', 'SS08', 'SS12', 'SS20', 'SS21'],
    SG04: ['SS05', 'SS18'],
  },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.3.01', '2.3.04'],
    facets: {
      Blob: 'SG01',
      Files: 'SG01',
      Queues: 'SG02',
      Tables: 'SG02',
      'Account options': 'SG03',
      'Storage types': 'SG03',
      'Managed disks comparison': 'SG04',
    },
  },
  teaching: storageTopics,
  activities: storageMissions,
  assessment: storageItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface StorageAttempt {
  id: number;
  item: StorageItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: StorageAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateStorageAttempt = (a: StorageAttempt) => evaluateStorage(a.item, a.answer);
export interface StorageRun {
  kind: 'run';
  input: StorageInput;
  prediction: Outcome;
}
export interface StorageGuide {
  id: number;
  mission: StorageMission;
  runs: StorageRun[];
  configuration: Partial<Record<StorageMission, StorageInput>>;
  answer: number | null;
}
export type StorageEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | StorageRun
  | { kind: 'visit'; topic: StorageTopic }
  | { kind: 'mission'; mission: StorageMission }
  | { kind: 'configure'; input: StorageInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: StorageItemId }
  | { kind: 'draft'; answer: StorageAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface StorageSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: StorageEvent[];
}
export const freshStorage = (): StorageSave => ({
  schema: 1,
  content: storageVersion,
  model: storageModelVersion,
  rubric: storageVersion,
  events: [],
});
/** Causal witnesses from persisted model runs, never visits or button counts. */
export function storageWitnesses(g: StorageGuide) {
  const designs = g.runs.flatMap((r) => {
    const x = runDesign(r.input);
    return x ? [x] : [];
  });
  const accounts = g.runs.flatMap((r) => {
    const x = runAccounts(r.input);
    return x ? [x] : [];
  });
  const deliveries = g.runs.flatMap((r) => {
    const x = runDelivery(r.input);
    return x ? [x] : [];
  });
  return g.mission === 'design'
    ? [
        designs.some((x) => x.input.imageAccess === 'http' && x.requirementsMet),
        designs.some(
          (x) =>
            x.input.imageAccess === 'smb' &&
            x.input.services.images === 'blob' &&
            !x.requirementsMet,
        ),
        designs.some((x) => x.input.imageAccess === 'smb' && x.requirementsMet),
      ]
    : g.mission === 'accounts'
      ? [
          accounts.some(
            (x) => x.input.account === 'block' && x.input.request === 'queue' && !x.supported,
          ) &&
            accounts.some(
              (x) => x.input.account === 'gpv2' && x.input.request === 'queue' && x.qualified,
            ),
          accounts.some(
            (x) => x.input.account === 'gpv2' && x.input.request === 'nfs' && !x.supported,
          ) &&
            accounts.some(
              (x) => x.input.account === 'fileSsd' && x.input.request === 'nfs' && x.qualified,
            ),
          accounts.some(
            (x) =>
              x.input.account === 'fileSsd' &&
              x.input.request === 'nfs' &&
              x.supported &&
              !x.input.regionDeclared,
          ),
        ]
      : [
          deliveries.some((x) => x.accepted && x.deliveries === 2 && x.effects === 2),
          deliveries.some((x) => x.accepted && x.deliveries === 2 && x.effects === 1),
          deliveries.some((x) => !x.accepted && x.input.payload === 'large'),
        ];
}
export function storageGuidedFacts(g: StorageGuide) {
  const witnesses = storageWitnesses(g),
    witnessed = witnesses.every(Boolean),
    correct = g.answer === storageGuidedAnswer[g.mission];
  return { witnesses, witnessed, correct, complete: witnessed && correct };
}
export function storageFacts(save: StorageSave) {
  const attempts: StorageAttempt[] = [],
    guided: StorageGuide[] = [],
    visited: StorageTopic[] = [];
  let current: StorageAttempt | undefined,
    guide: StorageGuide | undefined,
    topic: StorageTopic = 'introduction';
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
      const d = storageItems[e.item];
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
    firsts: storageItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: storageMissions.filter((id) =>
      guided.some((g) => g.mission === id && storageGuidedFacts(g).complete),
    ),
    full: save.events.length >= storageLimit - 5,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is StorageEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && storageTopics.includes(v.topic as StorageTopic);
  if (v.kind === 'mission')
    return keys(v, ['kind', 'mission']) && storageMissions.includes(v.mission as StorageMission);
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validStorageInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && storageItemIds.includes(v.item as StorageItemId);
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
export function applyStorage(save: StorageSave, raw: unknown): StorageSave | null {
  if (!validEvent(raw)) return null;
  const f = storageFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= storageLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= storageLimit - 1) return null;
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
      if (!g || !storageGuidedFacts(g).witnessed) return null;
      if (g.answer === raw.answer || g.answer === storageGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (save.events.length >= storageLimit - 1 && raw.answer !== storageGuidedAnswer[g.mission])
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
        (!storageGuidedFacts(target).witnessed || save.events.length >= storageLimit - 1)
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
  if (save.events.length >= storageLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreStorage(raw: string | null): {
  save: StorageSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshStorage(), issue });
  if (raw === null) return { save: freshStorage(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== storageVersion ||
      s.model !== storageModelVersion ||
      s.rubric !== storageVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > storageLimit
    )
      return invalid('corrupt');
    let save = freshStorage();
    for (const e of s.events) {
      const next = applyStorage(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function storageMilestoneFacts(save: StorageSave) {
  const guides = storageFacts(save).guided;
  return {
    accounts: guides.some((g) => g.mission === 'accounts' && storageWitnesses(g)[0]),
    delivery: guides.some(
      (g) => g.mission === 'delivery' && storageWitnesses(g)[0] && storageWitnesses(g)[1],
    ),
  };
}
