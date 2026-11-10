import {
  networkingModelVersion,
  integer,
  object,
  keys,
  validNetworkInput,
  runNetwork,
  type NetworkInput,
  type Outcome,
  runAddress,
  runPeering,
  runDns,
  type Peer,
} from './networking-model';
import {
  networkingItems,
  networkingItemIds,
  evaluateNetworking,
  type NetworkingAnswer,
  type NetworkingItemId,
} from './networking-items';
export { networkingItems, networkingItemIds, evaluateNetworking };
export const evaluateNetworkingAttempt = (a: NetworkingAttempt) =>
  evaluateNetworking(a.item, a.answer);
export type { NetworkingAnswer, NetworkingItemId };
export const networkingKey = 'azurelab.learning.networking-foundations.v1';
export const networkingVersion = '1.0.0';
export const networkingLimit = 800;
export const networkingTopics = [
  'introduction',
  'fundamentals',
  'vnet',
  'addressing',
  'dependencies',
  'peering',
  'dns',
  'explorer',
  'missions',
  'assessment',
  'summary',
] as const;
export type NetworkingTopic = (typeof networkingTopics)[number];
export const networkingMissions = ['inspect', 'address', 'peering', 'dns'] as const;
export type NetworkingMission = (typeof networkingMissions)[number];
export const networkingGuidedAnswer = { inspect: 1, address: 0, peering: 2, dns: 1 } as const;
export const networkingMissionTopic = {
  inspect: 'dependencies',
  address: 'addressing',
  peering: 'peering',
  dns: 'dns',
} as const;
export const networkingHref = (topic: NetworkingTopic, item?: NetworkingItemId) =>
  `/learn/networking?topic=${topic}${item ? `&case=${item}` : ''}`;
export const networkingManifest = {
  id: 'networking-foundations',
  content: networkingVersion,
  model: networkingModelVersion,
  rubric: networkingVersion,
  reviewed: '2026-10-28',
  prerequisites: ['CA04', 'CA05', 'CP03'],
  objectives: { NW01: ['N01'], NW02: ['N01'], NW03: ['N01', 'N02'], NW04: ['N03'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slot: '2.2.05',
    facets: { VNet: 'NW01', Subnet: 'NW02', Peering: 'NW03', 'Azure DNS': 'NW04' },
    deferred: ['VPN Gateway', 'ExpressRoute', '2.2.06'],
  },
  teaching: networkingTopics,
  activities: networkingMissions,
  assessment: networkingItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface NetworkingAttempt {
  id: number;
  item: NetworkingItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: NetworkingAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export interface NetworkingRun {
  kind: 'run';
  input: NetworkInput;
  prediction: Outcome;
}
export interface NetworkingGuide {
  id: number;
  mission: NetworkingMission;
  attempt: number | null;
  boundary: string | null;
  target: string | null;
  inspected: string[];
  through: string | null;
  runs: NetworkingRun[];
  configuration: Partial<Record<NetworkInput['kind'], NetworkInput>>;
  answer: number | null;
}
export type NetworkingEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | NetworkingRun
  | { kind: 'visit'; topic: NetworkingTopic }
  | { kind: 'mission'; mission: NetworkingMission; attempt: number | null; boundary: string | null }
  | { kind: 'configure'; input: NetworkInput }
  | { kind: 'select'; target: string }
  | { kind: 'inspect'; ref: string; through: string | null }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: NetworkingItemId }
  | { kind: 'draft'; answer: NetworkingAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface NetworkingSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: NetworkingEvent[];
}
export const freshNetworking = (): NetworkingSave => ({
  schema: 1,
  content: networkingVersion,
  model: networkingVersion,
  rubric: networkingVersion,
  events: [],
});
export function networkingGuidedFacts(g: NetworkingGuide) {
  const runs = g.runs;
  const address =
    g.mission === 'address' &&
    runs.some(
      (r) =>
        r.input.kind === 'address' &&
        r.input.vnet === '10.84.0.0/16' &&
        r.input.required === 40 &&
        runNetwork(r.input)?.outcome === 0 &&
        runAddress(r.input)?.overlap,
    ) &&
    runs.some(
      (r) =>
        r.input.kind === 'address' &&
        r.input.vnet === '10.84.0.0/16' &&
        r.input.required === 40 &&
        runNetwork(r.input)?.outcome === 2,
    );
  const peering =
    g.mission === 'peering' &&
    runs.some(
      (r) =>
        r.input.kind === 'peering' &&
        r.input.destination === 'c' &&
        !r.input.overlap &&
        ['ab', 'ba', 'bc', 'cb'].every(
          (p) => r.input.kind === 'peering' && r.input.configured.includes(p as Peer),
        ) &&
        !runPeering(r.input)?.direct,
    ) &&
    runs.some(
      (r) =>
        r.input.kind === 'peering' && r.input.destination === 'c' && runPeering(r.input)?.permitted,
    ) &&
    runs.some(
      (r) =>
        r.input.kind === 'peering' &&
        r.input.overlap &&
        r.input.destination === 'b' &&
        r.input.configured.includes('ab') &&
        r.input.configured.includes('ba') &&
        runPeering(r.input)?.outcome === 0,
    );
  const dns =
    g.mission === 'dns' &&
    runs.some(
      (r) =>
        r.input.kind === 'dns' &&
        r.input.zone === 'private' &&
        r.input.resolver === 'azure' &&
        !r.input.linked &&
        r.input.record === 'a' &&
        !runDns(r.input)?.resolved,
    ) &&
    runs.some(
      (r) =>
        r.input.kind === 'dns' &&
        r.input.zone === 'private' &&
        r.input.linked &&
        r.input.resolver === 'azure' &&
        runDns(r.input)?.correctDestination &&
        !runDns(r.input)?.knownPath,
    );
  const witnessed = address || peering || dns;
  const correct = g.answer === networkingGuidedAnswer[g.mission];
  return { witnessed, correct, complete: witnessed && correct };
}
export function networkingFacts(save: NetworkingSave) {
  const attempts: NetworkingAttempt[] = [],
    guided: NetworkingGuide[] = [],
    visited: NetworkingTopic[] = [];
  let current: NetworkingAttempt | undefined,
    guide: NetworkingGuide | undefined,
    topic: NetworkingTopic = 'introduction';
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
      const d = networkingItems[e.item];
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
    firsts: networkingItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: networkingMissions.filter((id) =>
      guided.some((g) => g.mission === id && networkingGuidedFacts(g).complete),
    ),
    full: save.events.length >= networkingLimit - 5,
  };
}
const ref = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const nullableRef = (v: unknown): v is string | null => v === null || ref(v);
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is NetworkingEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && networkingTopics.includes(v.topic as NetworkingTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission', 'attempt', 'boundary']) &&
      networkingMissions.includes(v.mission as NetworkingMission) &&
      nullableRef(v.boundary) &&
      (v.mission === 'inspect'
        ? integer(v.attempt, 1, 100000)
        : v.attempt === null && v.boundary === null)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validNetworkInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'select') return keys(v, ['kind', 'target']) && ref(v.target);
  if (v.kind === 'inspect')
    return keys(v, ['kind', 'ref', 'through']) && ref(v.ref) && nullableRef(v.through);
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && networkingItemIds.includes(v.item as NetworkingItemId);
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
export function applyNetworking(save: NetworkingSave, raw: unknown): NetworkingSave | null {
  if (!validEvent(raw)) return null;
  const f = networkingFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= networkingLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= networkingLimit - 1) return null;
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
        !(g.mission === 'inspect'
          ? g.target && g.inspected.length >= 7
          : networkingGuidedFacts(g).witnessed)
      )
        return null;
      if (g.answer === raw.answer || g.answer === networkingGuidedAnswer[g.mission]) return save;
    } else if (raw.kind === 'pause') {
      if (!g) return save;
    } else if (raw.kind === 'resume') {
      if (!f.guided.some((g) => g.id === raw.id)) return null;
      if (g?.id === raw.id) return save;
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
    if (raw.kind === 'select') {
      if (g?.mission !== 'inspect') return null;
      if (g.target === raw.target) return save;
      if (g.answer === networkingGuidedAnswer[g.mission]) return null;
    }
    if (raw.kind === 'inspect') {
      if (g?.mission !== 'inspect' || !g.target) return null;
      if (g.inspected.includes(raw.ref)) return save;
      if (g.inspected.length >= 12) return null;
    }
  }
  if (save.events.length >= networkingLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreNetworking(raw: string | null): {
  save: NetworkingSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshNetworking(), issue });
  if (raw === null) return { save: freshNetworking(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== networkingVersion ||
      s.model !== networkingModelVersion ||
      s.rubric !== networkingVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > networkingLimit
    )
      return invalid('corrupt');
    let save = freshNetworking();
    for (const e of s.events) {
      const next = applyNetworking(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function networkingMilestoneFacts(save: NetworkingSave) {
  const f = networkingFacts(save);
  return {
    peering: f.guided.some(
      (g) =>
        g.mission === 'peering' &&
        g.runs.some(
          (r) =>
            r.input.kind === 'peering' &&
            r.input.overlap &&
            r.input.destination === 'b' &&
            runPeering(r.input)?.links.some((l) => l.pair === 'ab' && l.conflict),
        ),
    ),
    dns: f.guided.some(
      (g) =>
        g.mission === 'dns' &&
        g.runs.some(
          (r) =>
            r.input.kind === 'dns' &&
            r.input.zone === 'private' &&
            r.input.resolver === 'azure' &&
            r.input.linked &&
            runDns(r.input)?.correctDestination &&
            !runDns(r.input)?.knownPath,
        ),
    ),
  };
}
