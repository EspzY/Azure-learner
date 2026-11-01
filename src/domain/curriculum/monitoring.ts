import {
  monitoringModelVersion,
  validMonitoringInput,
  runMonitoring,
  type MonitoringInput,
  type Outcome,
} from './monitoring-model';
import {
  monitoringItems,
  monitoringItemIds,
  evaluateMonitoring,
  type MonitoringAnswer,
  type MonitoringItemId,
} from './monitoring-items';
export { monitoringItems, monitoringItemIds, evaluateMonitoring };
export type { MonitoringAnswer, MonitoringItemId };
export const monitoringKey = 'azurelab.learning.monitoring-diagnostics.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const monitoringVersion = '1.0.0';
export const monitoringLimit = 800;
/** Leave ample JSON-envelope and terminal-event reserve for bounded scope snapshots. */
export const monitoringNormalCharacters = 480000;
export const monitoringTopics = [
  'introduction',
  'advisor',
  'health',
  'monitor',
  'signals',
  'logs',
  'alerts',
  'insights',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type MonitoringTopic = (typeof monitoringTopics)[number];
export const monitoringMissions = ['evidence', 'health', 'telemetry'] as const;
export type MonitoringMission = (typeof monitoringMissions)[number];
export const monitoringGuidedAnswer = { evidence: 1, health: 2, telemetry: 0 } as const;
export const monitoringMissionTopic = {
  evidence: 'studio',
  health: 'studio',
  telemetry: 'studio',
} as const;
export const monitoringHref = (topic: MonitoringTopic, item?: MonitoringItemId) =>
  `/learn/monitoring?topic=${topic}${item ? `&case=${item}` : ''}`;
export const monitoringManifest = {
  id: 'monitoring',
  content: monitoringVersion,
  model: monitoringModelVersion,
  rubric: monitoringVersion,
  reviewed: '2026-11-01',
  prerequisites: ['CA04', 'CM01', 'MGT01', 'MGT05'],
  objectives: { MON01: ['CB04', 'CM01'], MON02: ['CA01', 'CB02'], MON03: ['CB04', 'MGT05'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['3.4.01', '3.4.02', '3.4.03'],
    deferred: ['P15 Security', 'P16 Migration'],
  },
  teaching: monitoringTopics,
  activities: monitoringMissions,
  assessment: monitoringItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface MonitoringAttempt {
  id: number;
  item: MonitoringItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: MonitoringAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateMonitoringAttempt = (a: MonitoringAttempt) =>
  evaluateMonitoring(a.item, a.answer);
export interface MonitoringRun {
  kind: 'run';
  input: MonitoringInput;
  prediction: Outcome;
}
export interface MonitoringGuide {
  id: number;
  mission: MonitoringMission;
  runs: MonitoringRun[];
  configuration: Partial<Record<MonitoringMission, MonitoringInput>>;
  answer: number | null;
}
export type MonitoringEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | MonitoringRun
  | { kind: 'visit'; topic: MonitoringTopic }
  | { kind: 'mission'; mission: MonitoringMission }
  | { kind: 'configure'; input: MonitoringInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: MonitoringItemId }
  | { kind: 'draft'; answer: MonitoringAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface MonitoringSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: MonitoringEvent[];
}
export const freshMonitoring = (): MonitoringSave => ({
  schema: 1,
  content: monitoringVersion,
  model: monitoringModelVersion,
  rubric: monitoringVersion,
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
const pair = <T extends { input: MonitoringInput }>(
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
export function monitoringWitnesses(g: MonitoringGuide) {
  const results = g.runs.flatMap((r) => {
    const v = runMonitoring(r.input);
    return v ? [v] : [];
  });
  const e = results.filter((x) => x.kind === 'evidence'),
    h = results.filter((x) => x.kind === 'health'),
    t = results.filter((x) => x.kind === 'telemetry');
  if (g.mission === 'evidence')
    return [
      pair(
        e,
        (x) =>
          x.input.question === 'request-failure' &&
          x.input.tool === 'advisor' &&
          x.input.signal === 'recommendation' &&
          !x.supported,
        (y) =>
          y.input.tool === 'application-insights' &&
          y.input.signal === 'correlated-records' &&
          y.supported,
        ['tool', 'signal'],
      ),
      pair(
        e,
        (x) =>
          x.input.question === 'cost-review' &&
          x.input.tool === 'advisor' &&
          !x.input.fresh &&
          !x.supported,
        (y) => y.input.fresh && y.supported,
        ['fresh'],
      ),
      e.some(
        (x) =>
          x.input.question === 'performance-review' && x.input.tool === 'advisor' && x.supported,
      ),
    ];
  if (g.mission === 'health')
    return [
      pair(
        h,
        (x) =>
          x.relevant &&
          x.current &&
          x.input.health === 'available' &&
          x.input.appObservation === 'errors' &&
          !x.globalVisible,
        (y) => y.input.subscription === 'shared' && !y.relevant,
        ['subscription'],
      ),
      pair(
        h,
        (x) => x.relevant && x.current && x.currentHealth === 'available' && x.appFailureObserved,
        (y) => y.currentHealth === 'unknown' && y.appFailureObserved && !y.healthUnavailable,
        ['health'],
      ),
      pair(
        h,
        (x) => x.relevant && x.current && x.input.health === 'available' && x.appFailureObserved,
        (y) => !y.current && y.currentHealth === 'unknown' && !y.eventActive,
        ['inspection'],
      ),
    ];
  return [
    pair(
      t,
      (x) => x.conditionMet === true && x.input.rule === 'none' && !x.input.actionGroup && !x.fired,
      (y) => y.fired && !y.input.actionGroup,
      ['rule'],
    ),
    pair(
      t,
      (x) => x.fired && !x.input.actionGroup && !x.notificationPath,
      (y) => y.fired && y.input.actionGroup && y.notificationPath,
      ['actionGroup'],
    ),
    pair(
      t,
      (x) =>
        x.input.fixture === 'morning' &&
        x.input.signal === 'cpu' &&
        x.input.window === 5 &&
        x.input.threshold === 70 &&
        x.input.aggregation === 'average' &&
        x.conditionMet === false,
      (y) => y.input.aggregation === 'maximum' && y.conditionMet === true,
      ['aggregation'],
    ),
    pair(
      t,
      (x) => x.completeWindow && x.conditionMet === true,
      (y) =>
        y.input.coverage === 'gap' &&
        !y.completeWindow &&
        y.conditionMet === null &&
        y.observedAggregate !== null,
      ['coverage'],
    ),
    pair(
      t,
      (x) => x.input.logSource === 'resource' && !x.input.routed && !x.logsAvailable,
      (y) => y.input.routed && y.logsAvailable && y.records.length > 0,
      ['routed'],
    ) &&
      pair(
        t,
        (x) =>
          x.input.logSource === 'resource' &&
          x.input.filter === 'all' &&
          x.logsAvailable &&
          x.records.length > 1,
        (y) =>
          y.input.filter === 'errors' &&
          y.logsAvailable &&
          y.records.length > 0 &&
          y.records.every((r) => r.result === 'error'),
        ['filter'],
      ),
  ];
}
export function monitoringGuidedFacts(g: MonitoringGuide) {
  const witnesses = monitoringWitnesses(g),
    modeled = witnesses.every(Boolean),
    correct = g.answer === monitoringGuidedAnswer[g.mission];
  return { witnesses, modeled, witnessed: modeled, correct, complete: modeled && correct };
}
export function monitoringFacts(save: MonitoringSave) {
  const attempts: MonitoringAttempt[] = [],
    guided: MonitoringGuide[] = [],
    visited: MonitoringTopic[] = [];
  let current: MonitoringAttempt | undefined,
    guide: MonitoringGuide | undefined,
    topic: MonitoringTopic = 'introduction';
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
      const d = monitoringItems[e.item];
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
    firsts: monitoringItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: monitoringMissions.filter((id) =>
      guided.some((g) => g.mission === id && monitoringGuidedFacts(g).complete),
    ),
    full:
      save.events.length >= monitoringLimit - 5 ||
      JSON.stringify(save).length >= monitoringNormalCharacters,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is MonitoringEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && monitoringTopics.includes(v.topic as MonitoringTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission']) && monitoringMissions.includes(v.mission as MonitoringMission)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validMonitoringInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && monitoringItemIds.includes(v.item as MonitoringItemId);
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
export function applyMonitoring(save: MonitoringSave, raw: unknown): MonitoringSave | null {
  if (!validEvent(raw)) return null;
  const f = monitoringFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= monitoringLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= monitoringLimit - 1) return null;
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
      if (!g || !monitoringGuidedFacts(g).modeled) return null;
      if (g.answer === raw.answer || g.answer === monitoringGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (
        save.events.length >= monitoringLimit - 1 &&
        raw.answer !== monitoringGuidedAnswer[g.mission]
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
        (!monitoringGuidedFacts(target).modeled || save.events.length >= monitoringLimit - 1)
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
  if (save.events.length >= monitoringLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreMonitoring(raw: string | null): {
  save: MonitoringSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshMonitoring(), issue });
  if (raw === null) return { save: freshMonitoring(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== monitoringVersion ||
      s.model !== monitoringModelVersion ||
      s.rubric !== monitoringVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > monitoringLimit
    )
      return invalid('corrupt');
    let save = freshMonitoring();
    for (const e of s.events) {
      const next = applyMonitoring(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function monitoringMilestoneFacts(save: MonitoringSave) {
  const f = monitoringFacts(save);
  return Object.fromEntries(
    monitoringMissions.map((id) => [
      id,
      f.guided.some((g) => g.mission === id && monitoringGuidedFacts(g).witnessed),
    ]),
  ) as Record<MonitoringMission, boolean>;
}
