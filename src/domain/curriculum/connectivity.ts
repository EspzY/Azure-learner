import {
  connectivityModelVersion,
  integer,
  object,
  keys,
  validConnectivityInput,
  runHybrid,
  runEndpoint,
  type ConnectivityInput,
  type Outcome,
} from './connectivity-model';
import {
  connectivityItems,
  connectivityItemIds,
  evaluateConnectivity,
  type ConnectivityAnswer,
  type ConnectivityItemId,
} from './connectivity-items';
export { connectivityItems, connectivityItemIds, evaluateConnectivity };
export type { ConnectivityAnswer, ConnectivityItemId };
export const connectivityKey = 'azurelab.learning.networking-connectivity.v1';
export const connectivityVersion = '1.0.0';
export const connectivityLimit = 800;
export const connectivityTopics = [
  'introduction',
  'vpn',
  'expressroute',
  'endpoints',
  'private-dns',
  'hybrid',
  'explorer',
  'missions',
  'assessment',
  'summary',
] as const;
export type ConnectivityTopic = (typeof connectivityTopics)[number];
export const connectivityMissions = ['choose', 'diagnose', 'endpoint', 'dns'] as const;
export type ConnectivityMission = (typeof connectivityMissions)[number];
export const connectivityGuidedAnswer = { choose: 0, diagnose: 2, endpoint: 1, dns: 0 } as const;
export const connectivityMissionTopic = {
  choose: 'expressroute',
  diagnose: 'vpn',
  endpoint: 'endpoints',
  dns: 'private-dns',
} as const;
export const connectivityHref = (topic: ConnectivityTopic, item?: ConnectivityItemId) =>
  `/learn/connectivity?topic=${topic}${item ? `&case=${item}` : ''}`;
export const connectivityManifest = {
  id: 'networking-connectivity',
  content: connectivityVersion,
  model: connectivityModelVersion,
  rubric: connectivityVersion,
  reviewed: '2026-10-29',
  prerequisites: ['NW01', 'NW02', 'NW03', 'NW04'],
  objectives: { CN01: ['N03'], CN02: ['N03'], CN03: ['N03'], CN04: ['N01', 'N03'] },
  objectiveSources: {
    CN01: ['CS05', 'CS09', 'CS10', 'CS11'],
    CN02: ['CS06', 'CS12', 'CS13', 'CS14', 'CS15'],
    CN03: ['CS04', 'CS16', 'CS19', 'CS20'],
    CN04: ['CS07', 'CS17', 'CS18', 'CS19'],
  },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.2.05', '2.2.06'],
    facets: {
      'VPN Gateway': 'CN01',
      ExpressRoute: 'CN02',
      'Public endpoints': 'CN03',
      'Private endpoints': 'CN03',
      'DNS and access': 'CN04',
    },
  },
  teaching: connectivityTopics,
  activities: connectivityMissions,
  assessment: connectivityItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface ConnectivityAttempt {
  id: number;
  item: ConnectivityItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: ConnectivityAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateConnectivityAttempt = (a: ConnectivityAttempt) =>
  evaluateConnectivity(a.item, a.answer);
export interface ConnectivityRun {
  kind: 'run';
  input: ConnectivityInput;
  prediction: Outcome;
}
export interface ConnectivityGuide {
  id: number;
  mission: ConnectivityMission;
  runs: ConnectivityRun[];
  configuration: Partial<Record<ConnectivityMission, ConnectivityInput>>;
  answer: number | null;
}
export type ConnectivityEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | ConnectivityRun
  | { kind: 'visit'; topic: ConnectivityTopic }
  | { kind: 'mission'; mission: ConnectivityMission }
  | { kind: 'configure'; input: ConnectivityInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: ConnectivityItemId }
  | { kind: 'draft'; answer: ConnectivityAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface ConnectivitySave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: ConnectivityEvent[];
}
export const freshConnectivity = (): ConnectivitySave => ({
  schema: 1,
  content: connectivityVersion,
  model: connectivityModelVersion,
  rubric: connectivityVersion,
  events: [],
});
export function connectivityGuidedFacts(g: ConnectivityGuide) {
  const hybrid = g.runs.flatMap((r) => {
    const result = runHybrid(r.input);
    return result ? [result] : [];
  });
  const endpoints = g.runs.flatMap((r) => {
    const result = runEndpoint(r.input);
    return result ? [result] : [];
  });
  const choose =
    g.mission === 'choose' &&
    hybrid.some(
      (r) =>
        r.input.demand === 'site' &&
        r.input.requirePrivate &&
        r.input.requireEncryption &&
        r.input.transport === 'vpn' &&
        r.encrypted &&
        !r.privateTransport &&
        r.knownPath,
    ) &&
    hybrid.some(
      (r) =>
        r.input.demand === 'site' &&
        r.input.requirePrivate &&
        r.input.requireEncryption &&
        r.input.transport === 'expressroute' &&
        !r.usedBackup &&
        r.input.encryption === 'none' &&
        !r.encrypted &&
        r.knownPath,
    ) &&
    hybrid.some(
      (r) =>
        r.input.demand === 'site' &&
        r.input.requirePrivate &&
        r.input.requireEncryption &&
        r.input.transport === 'expressroute' &&
        !r.usedBackup &&
        r.requirementsMet,
    );
  const diagnose =
    g.mission === 'diagnose' &&
    hybrid.some(
      (r) =>
        r.input.transport === 'expressroute' &&
        !r.input.circuitUp &&
        !r.input.backupReady &&
        !r.knownPath,
    ) &&
    hybrid.some(
      (r) =>
        r.input.transport === 'expressroute' &&
        !r.input.circuitUp &&
        r.usedBackup &&
        r.requirementsMet,
    ) &&
    hybrid.some(
      (r) =>
        r.input.transport === 'expressroute' &&
        !r.input.circuitUp &&
        r.usedBackup &&
        !r.input.routeReady &&
        !r.knownPath,
    );
  const endpoint =
    g.mission === 'endpoint' &&
    endpoints.some(
      (r) =>
        r.input.endpoint === 'private' &&
        r.actualEndpoint === 'private' &&
        r.input.publicAccess === 'enabled' &&
        r.authorized,
    ) &&
    endpoints.some(
      (r) =>
        r.input.endpoint === 'private' &&
        r.actualEndpoint === 'private' &&
        r.input.publicAccess === 'disabled' &&
        r.authorized,
    ) &&
    endpoints.some(
      (r) =>
        r.input.endpoint === 'public' &&
        r.actualEndpoint === 'public' &&
        r.input.publicAccess === 'disabled' &&
        r.resolved &&
        r.knownPath &&
        r.input.networkRule === 'allow' &&
        !r.networkAllowed,
    );
  const dns =
    g.mission === 'dns' &&
    endpoints.some(
      (r) =>
        r.input.endpoint === 'private' &&
        r.input.publicAccess === 'disabled' &&
        r.actualEndpoint === 'public' &&
        r.knownPath &&
        !r.networkAllowed,
    ) &&
    endpoints.some(
      (r) =>
        r.input.endpoint === 'private' &&
        r.actualEndpoint === 'private' &&
        !r.input.path &&
        !r.knownPath,
    ) &&
    endpoints.some(
      (r) =>
        r.input.endpoint === 'private' &&
        r.actualEndpoint === 'private' &&
        r.networkAllowed &&
        r.input.appAuth === 'deny' &&
        !r.authorized,
    );
  const witnessed = choose || diagnose || endpoint || dns;
  const correct = g.answer === connectivityGuidedAnswer[g.mission];
  return { witnessed, correct, complete: witnessed && correct };
}
export function connectivityFacts(save: ConnectivitySave) {
  const attempts: ConnectivityAttempt[] = [],
    guided: ConnectivityGuide[] = [],
    visited: ConnectivityTopic[] = [];
  let current: ConnectivityAttempt | undefined,
    guide: ConnectivityGuide | undefined,
    topic: ConnectivityTopic = 'introduction';
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
      const d = connectivityItems[e.item];
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
    firsts: connectivityItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: connectivityMissions.filter((id) =>
      guided.some((g) => g.mission === id && connectivityGuidedFacts(g).complete),
    ),
    full: save.events.length >= connectivityLimit - 5,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is ConnectivityEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && connectivityTopics.includes(v.topic as ConnectivityTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission']) &&
      connectivityMissions.includes(v.mission as ConnectivityMission)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validConnectivityInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && connectivityItemIds.includes(v.item as ConnectivityItemId);
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
export function applyConnectivity(save: ConnectivitySave, raw: unknown): ConnectivitySave | null {
  if (!validEvent(raw)) return null;
  const f = connectivityFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= connectivityLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= connectivityLimit - 1) return null;
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
      if (!g || !connectivityGuidedFacts(g).witnessed) return null;
      if (g.answer === raw.answer || g.answer === connectivityGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (
        save.events.length >= connectivityLimit - 1 &&
        raw.answer !== connectivityGuidedAnswer[g.mission]
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
        (!connectivityGuidedFacts(target).witnessed || save.events.length >= connectivityLimit - 1)
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
  if (save.events.length >= connectivityLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreConnectivity(raw: string | null): {
  save: ConnectivitySave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshConnectivity(), issue });
  if (raw === null) return { save: freshConnectivity(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== connectivityVersion ||
      s.model !== connectivityModelVersion ||
      s.rubric !== connectivityVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > connectivityLimit
    )
      return invalid('corrupt');
    let save = freshConnectivity();
    for (const e of s.events) {
      const next = applyConnectivity(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function connectivityMilestoneFacts(save: ConnectivitySave) {
  const runs = connectivityFacts(save).guided.flatMap((g) => g.runs);
  const guides = connectivityFacts(save).guided;
  return {
    diagnose: guides.some(
      (g) =>
        g.mission === 'diagnose' &&
        g.runs.some((r) => {
          const x = runHybrid(r.input);
          return x && !x.input.circuitUp && !x.input.backupReady && !x.knownPath;
        }) &&
        g.runs.some((r) => {
          const x = runHybrid(r.input);
          return x && !x.input.circuitUp && x.usedBackup && x.requirementsMet;
        }),
    ),
    dns: runs.some((r) => {
      const x = runEndpoint(r.input);
      return x && x.actualEndpoint === 'private' && !x.knownPath;
    }),
  };
}
