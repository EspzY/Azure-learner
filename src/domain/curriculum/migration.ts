import {
  migrationModelVersion,
  validMigrationInput,
  runMigration,
  type MigrationInput,
  type Outcome,
} from './migration-model';
import {
  migrationItems,
  migrationItemIds,
  evaluateMigration,
  type MigrationAnswer,
  type MigrationItemId,
} from './migration-items';
export { migrationItems, migrationItemIds, evaluateMigration };
export type { MigrationAnswer, MigrationItemId };
export const migrationKey = 'azurelab.learning.file-movement-migration.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const migrationVersion = '1.0.0';
export const migrationLimit = 800;
/** Leave ample JSON-envelope and terminal-event reserve for bounded scope snapshots. */
export const migrationNormalCharacters = 480000;
export const migrationTopics = [
  'introduction',
  'methods',
  'azcopy',
  'explorer',
  'file-sync',
  'migrate',
  'databox',
  'validation',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type MigrationTopic = (typeof migrationTopics)[number];
export const migrationMissions = ['method', 'sync', 'planning'] as const;
export type MigrationMission = (typeof migrationMissions)[number];
export const migrationGuidedAnswer = { method: 2, sync: 0, planning: 1 } as const;
export const migrationMissionTopic = {
  method: 'studio',
  sync: 'studio',
  planning: 'studio',
} as const;
export const migrationHref = (topic: MigrationTopic, item?: MigrationItemId) =>
  `/learn/migration?topic=${topic}${item ? `&case=${item}` : ''}`;
export const migrationManifest = {
  id: 'migration',
  content: migrationVersion,
  model: migrationModelVersion,
  rubric: migrationVersion,
  reviewed: '2026-11-01',
  prerequisites: ['ST01', 'SB01', 'AC01'],
  objectives: { MOVE01: ['ST01', 'ST02'], MOVE02: ['ST01', 'SB02'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.3.05', '2.3.06'],
    deferred: ['End-to-End Learning Journey Audit before P17/P18'],
  },
  teaching: migrationTopics,
  activities: migrationMissions,
  assessment: migrationItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface MigrationAttempt {
  id: number;
  item: MigrationItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: MigrationAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateMigrationAttempt = (a: MigrationAttempt) =>
  evaluateMigration(a.item, a.answer);
export interface MigrationRun {
  kind: 'run';
  input: MigrationInput;
  prediction: Outcome;
}
export interface MigrationGuide {
  id: number;
  mission: MigrationMission;
  runs: MigrationRun[];
  configuration: Partial<Record<MigrationMission, MigrationInput>>;
  answer: number | null;
}
export type MigrationEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | MigrationRun
  | { kind: 'visit'; topic: MigrationTopic }
  | { kind: 'mission'; mission: MigrationMission }
  | { kind: 'configure'; input: MigrationInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: MigrationItemId }
  | { kind: 'draft'; answer: MigrationAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface MigrationSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: MigrationEvent[];
}
export const freshMigration = (): MigrationSave => ({
  schema: 1,
  content: migrationVersion,
  model: migrationModelVersion,
  rubric: migrationVersion,
  events: [],
});
/** Completion requires persisted contrasts, never visits, control clicks or elapsed time. */
function comparable(v: unknown, omitted: string[], path = ''): unknown {
  if (Array.isArray(v)) return v.map((x, i) => comparable(x, omitted, `${path}.${i}`));
  if (!v || typeof v !== 'object') return v;
  return Object.fromEntries(
    Object.entries(v)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([k]) => !omitted.includes(path ? `${path}.${k}` : k))
      .map(([k, x]) => [k, comparable(x, omitted, path ? `${path}.${k}` : k)]),
  );
}
const pair = <T extends { input: MigrationInput }>(
  runs: T[],
  a: (x: T) => boolean,
  b: (x: T) => boolean,
  except: string[],
) =>
  runs.some(
    (x) =>
      a(x) &&
      runs.some(
        (y) =>
          b(y) &&
          JSON.stringify(comparable(x.input, except)) ===
            JSON.stringify(comparable(y.input, except)),
      ),
  );
export function migrationWitnesses(g: MigrationGuide) {
  const r = g.runs.flatMap((x) => {
      const v = runMigration(x.input);
      return v ? [v] : [];
    }),
    m = r.filter((x) => x.kind === 'method'),
    s = r.filter((x) => x.kind === 'sync'),
    p = r.filter((x) => x.kind === 'planning');
  if (g.mission === 'method')
    return [
      pair(
        m,
        (x) => x.input.tool === 'azcopy' && x.multipleCandidates && x.methodFits,
        (y) => y.input.tool === 'explorer' && y.multipleCandidates && y.methodFits,
        ['tool'],
      ),
      pair(
        m,
        (x) =>
          x.input.cadence === 'scheduled' &&
          x.input.interface === 'scripted' &&
          x.input.tool === 'azcopy' &&
          x.methodFits,
        (y) => y.input.tool === 'explorer' && !y.methodFits,
        ['tool'],
      ),
      pair(
        m,
        (x) => x.input.cadence === 'hybrid' && x.input.tool === 'file-sync' && x.methodFits,
        (y) => y.input.destination === 'files-nfs' && !y.methodFits,
        ['destination'],
      ),
      pair(
        m,
        (x) => x.input.fidelity === 'required' && !x.fidelityMet && x.methodFits,
        (y) => y.fidelityMet && y.methodFits,
        ['fidelityChecked'],
      ),
    ];
  if (g.mission === 'sync')
    return [
      pair(
        s,
        (x) =>
          x.input.method === 'copy' &&
          x.rows.some((r) => r.before.name === 'arkiv.txt' && r.after.cloud !== null),
        (y) =>
          y.input.method === 'directional' &&
          y.rows.some((r) => r.before.name === 'arkiv.txt' && r.action === 'delete-target'),
        ['method', 'deleteDestination'],
      ),
      pair(
        s,
        (x) =>
          x.input.method === 'directional' && x.input.direction === 'a-to-cloud' && !x.bTouched,
        (y) => y.input.direction === 'cloud-to-a' && !y.bTouched,
        ['direction'],
      ),
      pair(
        s,
        (x) => x.input.method === 'file-sync' && x.conflict,
        (y) => !y.conflict && y.rows.some((r) => r.action === 'declared-propagation'),
        ['scenario'],
      ),
      pair(
        s,
        (x) =>
          x.input.method === 'file-sync' &&
          x.input.cloudTiering &&
          !x.input.localContent &&
          x.contentState === 'offline-unavailable',
        (y) => y.contentState === 'recall-required',
        ['connected'],
      ),
    ];
  return [
    pair(
      p,
      (x) => !x.input.dependencies && !x.assessmentReady,
      (y) => y.assessmentReady,
      ['dependencies'],
    ),
    pair(
      p,
      (x) => x.assessmentReady && x.input.assessmentFresh,
      (y) => !y.input.assessmentFresh && !y.assessmentReady,
      ['assessmentFresh'],
    ),
    pair(
      p,
      (x) => x.input.strategy === 'online' && x.networkRuledOut,
      (y) => y.input.strategy === 'physical' && y.transport === 'candidate' && y.planReady,
      ['strategy'],
    ),
    pair(
      p,
      (x) => x.dataCheckDeclared && !x.validationDeclared,
      (y) => y.validationDeclared,
      ['phase', 'writersControlled', 'appValidated'],
    ),
  ];
}
export function migrationGuidedFacts(g: MigrationGuide) {
  const witnesses = migrationWitnesses(g),
    modeled = witnesses.every(Boolean),
    correct = g.answer === migrationGuidedAnswer[g.mission];
  return { witnesses, modeled, witnessed: modeled, correct, complete: modeled && correct };
}
export function migrationFacts(save: MigrationSave) {
  const attempts: MigrationAttempt[] = [],
    guided: MigrationGuide[] = [],
    visited: MigrationTopic[] = [];
  let current: MigrationAttempt | undefined,
    guide: MigrationGuide | undefined,
    topic: MigrationTopic = 'introduction';
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
      const d = migrationItems[e.item];
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
    firsts: migrationItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: migrationMissions.filter((id) =>
      guided.some((g) => g.mission === id && migrationGuidedFacts(g).complete),
    ),
    full:
      save.events.length >= migrationLimit - 5 ||
      JSON.stringify(save).length >= migrationNormalCharacters,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is MigrationEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && migrationTopics.includes(v.topic as MigrationTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission']) && migrationMissions.includes(v.mission as MigrationMission)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validMigrationInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && migrationItemIds.includes(v.item as MigrationItemId);
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
export function applyMigration(save: MigrationSave, raw: unknown): MigrationSave | null {
  if (!validEvent(raw)) return null;
  const f = migrationFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= migrationLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= migrationLimit - 1) return null;
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
      if (!g || !migrationGuidedFacts(g).modeled) return null;
      if (g.answer === raw.answer || g.answer === migrationGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (
        save.events.length >= migrationLimit - 1 &&
        raw.answer !== migrationGuidedAnswer[g.mission]
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
        (!migrationGuidedFacts(target).modeled || save.events.length >= migrationLimit - 1)
      )
        return null;
    } else if (f.full) return null;
    if (raw.kind === 'mission' && f.guided.filter((x) => x.mission === raw.mission).length >= 24)
      return null;
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
  if (save.events.length >= migrationLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreMigration(raw: string | null): {
  save: MigrationSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshMigration(), issue });
  if (raw === null) return { save: freshMigration(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== migrationVersion ||
      s.model !== migrationModelVersion ||
      s.rubric !== migrationVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > migrationLimit
    )
      return invalid('corrupt');
    let save = freshMigration();
    for (const e of s.events) {
      const next = applyMigration(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function migrationMilestoneFacts(save: MigrationSave) {
  const f = migrationFacts(save);
  return Object.fromEntries(
    migrationMissions.map((id) => [
      id,
      f.guided.some((g) => g.mission === id && migrationGuidedFacts(g).witnessed),
    ]),
  ) as Record<MigrationMission, boolean>;
}
