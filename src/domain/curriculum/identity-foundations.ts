import {
  identityModelVersion,
  validIdentityInput,
  runDirectory,
  runJourney,
  runExternal,
  type IdentityInput,
  type Outcome,
} from './identity-foundations-model';
import {
  identityItems,
  identityItemIds,
  evaluateIdentity,
  type IdentityAnswer,
  type IdentityItemId,
} from './identity-foundations-items';
export { identityItems, identityItemIds, evaluateIdentity };
export type { IdentityAnswer, IdentityItemId };
export const identityKey = 'azurelab.learning.identity-foundations.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const identityVersion = '1.0.0';
export const identityLimit = 800;
export const identityTopics = [
  'introduction',
  'directory',
  'domain',
  'authentication',
  'sso',
  'mfa',
  'passwordless',
  'external',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type IdentityTopic = (typeof identityTopics)[number];
export const identityMissions = ['directory', 'journey', 'external'] as const;
export type IdentityMission = (typeof identityMissions)[number];
export const identityGuidedAnswer = { directory: 1, journey: 2, external: 0 } as const;
export const identityMissionTopic = {
  directory: 'studio',
  journey: 'studio',
  external: 'studio',
} as const;
export const identityHref = (topic: IdentityTopic, item?: IdentityItemId) =>
  `/learn/identity?topic=${topic}${item ? `&case=${item}` : ''}`;
export const identityManifest = {
  id: 'identity-foundations',
  content: identityVersion,
  model: identityModelVersion,
  rubric: identityVersion,
  reviewed: '2026-10-31',
  prerequisites: ['CA05', 'ST03'],
  objectives: { IDF01: ['I01'], IDF02: ['I01'], IDF03: ['I01'] },
  objectiveSources: {
    IDF01: ['IF03', 'IF04', 'IF12', 'IF16', 'IF17', 'IF23'],
    IDF02: ['IF05', 'IF06', 'IF07', 'IF13', 'IF18', 'IF19', 'IF24', 'IF26', 'IF27', 'IF28'],
    IDF03: ['IF08', 'IF09', 'IF10', 'IF14', 'IF20', 'IF21', 'IF22', 'IF25'],
  },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.4.01', '2.4.02', '2.4.03'],
    facets: {
      'Entra ID / tenant': 'IDF01',
      'Domain Services / traditional AD DS': 'IDF01',
      'SSO / MFA / passwordless': 'IDF02',
      'Authentication / authorization': 'IDF02',
      'B2B / direct connect': 'IDF03',
      'Customer external tenant': 'IDF03',
    },
  },
  teaching: identityTopics,
  activities: identityMissions,
  assessment: identityItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface IdentityAttempt {
  id: number;
  item: IdentityItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: IdentityAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateIdentityAttempt = (a: IdentityAttempt) => evaluateIdentity(a.item, a.answer);
export interface IdentityRun {
  kind: 'run';
  input: IdentityInput;
  prediction: Outcome;
}
export interface IdentityGuide {
  id: number;
  mission: IdentityMission;
  runs: IdentityRun[];
  configuration: Partial<Record<IdentityMission, IdentityInput>>;
  answer: number | null;
}
export type IdentityEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | IdentityRun
  | { kind: 'visit'; topic: IdentityTopic }
  | { kind: 'mission'; mission: IdentityMission }
  | { kind: 'configure'; input: IdentityInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: IdentityItemId }
  | { kind: 'draft'; answer: IdentityAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface IdentitySave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: IdentityEvent[];
}
export const freshIdentity = (): IdentitySave => ({
  schema: 1,
  content: identityVersion,
  model: identityModelVersion,
  rubric: identityVersion,
  events: [],
});
/** Completion requires persisted contrasts, never visits, control clicks or elapsed time. */
export function identityWitnesses(g: IdentityGuide) {
  const ds = g.runs.flatMap((r) => {
    const v = runDirectory(r.input);
    return v ? [v] : [];
  });
  const js = g.runs.flatMap((r) => {
    const v = runJourney(r.input);
    return v ? [v] : [];
  });
  const es = g.runs.flatMap((r) => {
    const v = runExternal(r.input);
    return v ? [v] : [];
  });
  if (g.mission === 'directory')
    return [
      ds.some((x) => x.input.workload === 'modern' && x.input.solution === 'entra' && x.ready),
      ds.some(
        (x) => x.input.workload === 'legacy' && x.input.solution === 'entra' && !x.compatible,
      ) &&
        ds.some((x) => x.input.workload === 'legacy' && x.input.solution === 'managed' && x.ready),
      ds.some(
        (x) =>
          x.input.workload === 'legacy' &&
          x.input.solution === 'managed' &&
          x.input.sync === 'pending' &&
          !x.ready,
      ) &&
        ds.some(
          (x) =>
            x.input.workload === 'legacy' &&
            x.input.solution === 'managed' &&
            x.input.sync === 'ready' &&
            x.ready,
        ),
      ds.some(
        (x) => x.input.solution === 'managed' && x.input.change === 'synced' && !x.writeAllowed,
      ) &&
        ds.some(
          (x) =>
            x.input.solution === 'managed' &&
            x.input.change === 'local' &&
            x.writeAllowed &&
            !x.syncBack,
        ),
      ds.some(
        (x) => x.input.workload === 'schema' && x.input.solution === 'managed' && !x.compatible,
      ) && ds.some((x) => x.input.workload === 'schema' && x.input.solution === 'adds' && x.ready),
    ];
  if (g.mission === 'journey')
    return [
      js.some(
        (x) =>
          x.input.method === 'two-secrets' &&
          x.input.session === 'none' &&
          x.input.requirement === 'mfa' &&
          x.identityProven &&
          !x.requirementsMet,
      ),
      js.some(
        (x) =>
          x.input.session === 'single' &&
          x.input.method === 'password' &&
          x.input.requirement === 'mfa' &&
          x.identityProven &&
          !x.requirementsMet,
      ) &&
        js.some(
          (x) =>
            x.input.method === 'passkey' &&
            x.input.session === 'single' &&
            x.input.requirement === 'mfa' &&
            x.requirementsMet &&
            !x.reused,
        ),
      js.some(
        (x) =>
          x.input.session === 'mfa' &&
          x.input.requirement === 'mfa' &&
          x.reused &&
          !x.methodChecked,
      ),
      js.some(
        (a) =>
          a.requirementsMet &&
          a.access === 'denied' &&
          js.some(
            (b) =>
              b.access === 'allowed' &&
              JSON.stringify({ ...a.input, access: 'allow' }) === JSON.stringify(b.input),
          ),
      ),
      js.some(
        (x) =>
          x.input.method === 'sms' &&
          x.input.session === 'none' &&
          x.input.requirement === 'mfa' &&
          !x.requirementsMet &&
          x.method.passwordless,
      ) &&
        js.some(
          (x) =>
            x.input.method === 'hello' &&
            x.input.session === 'none' &&
            x.input.requirement === 'mfa' &&
            x.requirementsMet,
        ),
    ];
  return [
    es.some(
      (x) => x.input.audience === 'partner' && x.input.approach === 'b2b' && !x.representationReady,
    ) &&
      es.some(
        (x) =>
          x.input.audience === 'partner' &&
          x.input.approach === 'b2b' &&
          x.resourceAccepted &&
          x.access === 'denied',
      ),
    es.some((x) => x.input.audience === 'customer' && x.input.approach === 'b2b' && !x.fit) &&
      es.some(
        (x) =>
          x.input.audience === 'customer' &&
          x.input.approach === 'customer' &&
          x.resourceAccepted &&
          x.tenant === 'external',
      ),
    es.some(
      (x) =>
        x.input.audience === 'shared' &&
        x.input.approach === 'direct' &&
        x.input.home === 'entra' &&
        !x.crossAllowed,
    ) &&
      es.some(
        (x) =>
          x.input.audience === 'shared' &&
          x.input.approach === 'direct' &&
          x.input.home === 'entra' &&
          x.resourceAccepted &&
          !x.guestRequired,
      ),
    es.some(
      (x) =>
        x.input.audience === 'partner' &&
        x.input.approach === 'b2b' &&
        x.input.guest &&
        !x.input.invitation &&
        x.ready &&
        !x.adminGranted,
    ),
  ];
}
export function identityGuidedFacts(g: IdentityGuide) {
  const witnesses = identityWitnesses(g),
    witnessed = witnesses.every(Boolean),
    correct = g.answer === identityGuidedAnswer[g.mission];
  return { witnesses, witnessed, correct, complete: witnessed && correct };
}
export function identityFacts(save: IdentitySave) {
  const attempts: IdentityAttempt[] = [],
    guided: IdentityGuide[] = [],
    visited: IdentityTopic[] = [];
  let current: IdentityAttempt | undefined,
    guide: IdentityGuide | undefined,
    topic: IdentityTopic = 'introduction';
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
      const d = identityItems[e.item];
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
    firsts: identityItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: identityMissions.filter((id) =>
      guided.some((g) => g.mission === id && identityGuidedFacts(g).complete),
    ),
    full: save.events.length >= identityLimit - 5,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is IdentityEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && identityTopics.includes(v.topic as IdentityTopic);
  if (v.kind === 'mission')
    return keys(v, ['kind', 'mission']) && identityMissions.includes(v.mission as IdentityMission);
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validIdentityInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && identityItemIds.includes(v.item as IdentityItemId);
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
export function applyIdentity(save: IdentitySave, raw: unknown): IdentitySave | null {
  if (!validEvent(raw)) return null;
  const f = identityFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= identityLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= identityLimit - 1) return null;
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
      if (!g || !identityGuidedFacts(g).witnessed) return null;
      if (g.answer === raw.answer || g.answer === identityGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (save.events.length >= identityLimit - 1 && raw.answer !== identityGuidedAnswer[g.mission])
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
        (!identityGuidedFacts(target).witnessed || save.events.length >= identityLimit - 1)
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
  if (save.events.length >= identityLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreIdentity(raw: string | null): {
  save: IdentitySave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshIdentity(), issue });
  if (raw === null) return { save: freshIdentity(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== identityVersion ||
      s.model !== identityModelVersion ||
      s.rubric !== identityVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > identityLimit
    )
      return invalid('corrupt');
    let save = freshIdentity();
    for (const e of s.events) {
      const next = applyIdentity(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function identityMilestoneFacts(save: IdentitySave) {
  const gs = identityFacts(save).guided;
  return {
    directory: gs.some((g) => g.mission === 'directory' && identityWitnesses(g)[1]),
    journey: gs.some((g) => g.mission === 'journey' && identityWitnesses(g)[3]),
    external: gs.some((g) => g.mission === 'external' && identityWitnesses(g)[1]),
  };
}
