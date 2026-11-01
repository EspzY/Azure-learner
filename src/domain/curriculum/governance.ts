import {
  governanceModelVersion,
  validGovernanceInput,
  runGovernance,
  type GovernanceInput,
  type Outcome,
} from './governance-model';
import {
  governanceItems,
  governanceItemIds,
  evaluateGovernance,
  type GovernanceAnswer,
  type GovernanceItemId,
} from './governance-items';
export { governanceItems, governanceItemIds, evaluateGovernance };
export type { GovernanceAnswer, GovernanceItemId };
export const governanceKey = 'azurelab.learning.governance-compliance.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const governanceVersion = '1.0.0';
export const governanceLimit = 800;
/** Leave ample JSON-envelope and terminal-event reserve for bounded scope snapshots. */
export const governanceNormalCharacters = 480000;
export const governanceTopics = [
  'introduction',
  'purview',
  'catalog',
  'policy',
  'assignments',
  'compliance',
  'locks',
  'planes',
  'trust',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type GovernanceTopic = (typeof governanceTopics)[number];
export const governanceMissions = ['data', 'policy', 'locks'] as const;
export type GovernanceMission = (typeof governanceMissions)[number];
export const governanceGuidedAnswer = { data: 1, policy: 2, locks: 0 } as const;
export const governanceMissionTopic = {
  data: 'studio',
  policy: 'studio',
  locks: 'studio',
} as const;
export const governanceHref = (topic: GovernanceTopic, item?: GovernanceItemId) =>
  `/learn/governance?topic=${topic}${item ? `&case=${item}` : ''}`;
export const governanceManifest = {
  id: 'governance-compliance',
  content: governanceVersion,
  model: governanceModelVersion,
  rubric: governanceVersion,
  reviewed: '2026-11-01',
  prerequisites: ['CA04', 'CA05', 'CA06', 'CA07', 'ACF02', 'CM04'],
  objectives: { GOV01: ['G03', 'I03'], GOV02: ['G03'], GOV03: ['G04'] },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['3.2.01', '3.2.02', '3.2.03'],
    supplement: 'Service Trust Portal is a Learn goal,not a fourth exam row',
    deferred: ['P13 Management Tools', 'P14 Monitoring'],
  },
  teaching: governanceTopics,
  activities: governanceMissions,
  assessment: governanceItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface GovernanceAttempt {
  id: number;
  item: GovernanceItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: GovernanceAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateGovernanceAttempt = (a: GovernanceAttempt) =>
  evaluateGovernance(a.item, a.answer);
export interface GovernanceRun {
  kind: 'run';
  input: GovernanceInput;
  prediction: Outcome;
}
export interface GovernanceGuide {
  id: number;
  mission: GovernanceMission;
  attempt: number | null;
  boundary: string | null;
  through: string | null;
  inspected: string[];
  runs: GovernanceRun[];
  configuration: Partial<Record<GovernanceMission, GovernanceInput>>;
  answer: number | null;
}
export type GovernanceEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | GovernanceRun
  | { kind: 'visit'; topic: GovernanceTopic }
  | { kind: 'mission'; mission: GovernanceMission; attempt: number | null; boundary: string | null }
  | { kind: 'inspect'; ref: string; through: string | null }
  | { kind: 'configure'; input: GovernanceInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: GovernanceItemId }
  | { kind: 'draft'; answer: GovernanceAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface GovernanceSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: GovernanceEvent[];
}
export const freshGovernance = (): GovernanceSave => ({
  schema: 1,
  content: governanceVersion,
  model: governanceModelVersion,
  rubric: governanceVersion,
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
const pair = <T extends { input: GovernanceInput }>(
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
export function governanceWitnesses(g: GovernanceGuide) {
  const runs = g.runs.flatMap((r) => {
    const x = runGovernance(r.input);
    return x ? [x] : [];
  });
  const ds = runs.filter((x) => x.input.kind === 'data') as NonNullable<
    ReturnType<typeof import('./governance-model').runData>
  >[];
  const ps = runs.filter((x) => x.input.kind === 'policy') as NonNullable<
    ReturnType<typeof import('./governance-model').runPolicy>
  >[];
  const ls = runs.filter((x) => x.input.kind === 'locks') as NonNullable<
    ReturnType<typeof import('./governance-model').runLocks>
  >[];
  if (g.mission === 'data')
    return [
      pair(
        ds,
        (x) => x.input.asset === 'sales' && !x.input.registered && !x.discoverable,
        (y) => y.input.registered && y.discoverable,
        ['registered'],
      ),
      pair(
        ds,
        (x) => x.discoverable && !x.input.sourceAuthorized && x.input.classification === 'unknown',
        (y) => y.input.classification === 'business' && y.classified && !y.input.sourceAuthorized,
        ['classification'],
      ),
      pair(
        ds,
        (x) => x.discoverable && x.classified && x.accountable && x.input.glossary && !x.traceable,
        (y) => y.curated,
        ['lineage'],
      ),
      pair(
        ds,
        (x) => x.curated && !x.input.sourceAuthorized,
        (y) => y.curated && y.input.sourceAuthorized,
        ['sourceAuthorized'],
      ),
    ];
  if (g.mission === 'policy')
    return [
      pair(
        ps,
        (x) =>
          x.input.rule === 'location' &&
          x.input.resourceType === 'plan' &&
          x.input.resourceScope === 'rg-app' &&
          x.input.assignment === 'sub-app' &&
          x.nonCompliant &&
          x.input.phase === 'request' &&
          x.input.effect === 'audit' &&
          !x.blocked,
        (y) => y.input.effect === 'deny' && y.blocked,
        ['effect'],
      ),
      pair(
        ps,
        (x) =>
          x.input.rule === 'location' &&
          x.input.resourceType === 'plan' &&
          x.input.resourceScope === 'rg-shared' &&
          x.input.assignment === 'sub-app' &&
          x.input.effect === 'deny' &&
          !x.inScope,
        (y) => y.input.assignment === 'mg-lab' && y.blocked,
        ['assignment'],
      ),
      g.inspected.includes('policy:policy-web-location'),
      new Set(g.inspected.filter((r) => r.startsWith('receipt:'))).size >= 2,
    ];
  return [
    pair(
      ls,
      (x) =>
        x.input.target === 'vm' &&
        x.input.lock === 'delete' &&
        x.input.authorized &&
        x.input.operation === 'modify-vm' &&
        x.allowed,
      (y) => y.input.operation === 'delete-vm' && y.lockBlocked,
      ['operation'],
    ),
    pair(
      ls,
      (x) =>
        x.input.target === 'vm' &&
        x.input.scope === 'rg-app' &&
        x.input.lock === 'delete' &&
        x.input.operation === 'start-vm' &&
        x.allowed,
      (y) => y.input.lock === 'readonly' && y.lockBlocked,
      ['lock'],
    ),
    pair(
      ls,
      (x) =>
        x.input.target === 'account' &&
        x.input.scope === 'account' &&
        x.input.lock === 'readonly' &&
        x.input.operation === 'list-keys' &&
        x.lockBlocked,
      (y) => y.input.operation === 'delete-blob' && y.dataPlane && y.allowed,
      ['operation'],
    ),
    pair(
      ls,
      (x) =>
        x.input.target === 'rg-app' &&
        x.input.operation === 'delete-group' &&
        x.input.scope === 'vm' &&
        x.input.lock === 'none' &&
        x.allowed,
      (y) => y.input.lock === 'delete' && y.descendantBlock,
      ['lock'],
    ),
  ];
}
export function governanceGuidedFacts(g: GovernanceGuide, technicalVerified = false) {
  const witnesses = governanceWitnesses(g),
    modeled = witnesses.every(Boolean),
    correct = g.answer === governanceGuidedAnswer[g.mission];
  const witnessed = modeled && (g.mission !== 'policy' || technicalVerified);
  return { witnesses, modeled, witnessed, correct, complete: witnessed && correct };
}
export function governanceFacts(save: GovernanceSave, verify?: (g: GovernanceGuide) => boolean) {
  const attempts: GovernanceAttempt[] = [],
    guided: GovernanceGuide[] = [],
    visited: GovernanceTopic[] = [];
  let current: GovernanceAttempt | undefined,
    guide: GovernanceGuide | undefined,
    topic: GovernanceTopic = 'introduction';
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
    if (e.kind === 'inspect' && guide) {
      guide.inspected.push(e.ref);
      guide.through = e.through;
    }
    if (e.kind === 'explain' && guide) guide.answer = e.answer;
    if (e.kind === 'begin') {
      const d = governanceItems[e.item];
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
    firsts: governanceItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: governanceMissions.filter((id) =>
      guided.some(
        (g) => g.mission === id && governanceGuidedFacts(g, verify?.(g) ?? false).complete,
      ),
    ),
    full:
      save.events.length >= governanceLimit - 5 ||
      JSON.stringify(save).length >= governanceNormalCharacters,
  };
}
const ref = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const nullableRef = (v: unknown) => v === null || ref(v);
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is GovernanceEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && governanceTopics.includes(v.topic as GovernanceTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission', 'attempt', 'boundary']) &&
      governanceMissions.includes(v.mission as GovernanceMission) &&
      (v.mission === 'policy'
        ? integer(v.attempt, 1, 100000) && nullableRef(v.boundary)
        : v.attempt === null && v.boundary === null)
    );
  if (v.kind === 'inspect')
    return (
      keys(v, ['kind', 'ref', 'through']) &&
      typeof v.ref === 'string' &&
      /^(resource|policy|receipt):[a-zA-Z0-9_-]{1,64}$/.test(v.ref) &&
      nullableRef(v.through)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validGovernanceInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && governanceItemIds.includes(v.item as GovernanceItemId);
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
export function applyGovernance(save: GovernanceSave, raw: unknown): GovernanceSave | null {
  if (!validEvent(raw)) return null;
  const f = governanceFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= governanceLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= governanceLimit - 1) return null;
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
      if (!g || !governanceGuidedFacts(g).modeled) return null;
      if (g.answer === raw.answer || g.answer === governanceGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (
        save.events.length >= governanceLimit - 1 &&
        raw.answer !== governanceGuidedAnswer[g.mission]
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
        (!governanceGuidedFacts(target).modeled || save.events.length >= governanceLimit - 1)
      )
        return null;
    } else if (f.full) return null;
    if (raw.kind === 'inspect') {
      if (!g || g.mission !== 'policy' || f.full) return null;
      if (g.inspected.includes(raw.ref)) return save;
      if (g.inspected.length >= 32) return null;
    }
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
  if (save.events.length >= governanceLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreGovernance(raw: string | null): {
  save: GovernanceSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshGovernance(), issue });
  if (raw === null) return { save: freshGovernance(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== governanceVersion ||
      s.model !== governanceModelVersion ||
      s.rubric !== governanceVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > governanceLimit
    )
      return invalid('corrupt');
    let save = freshGovernance();
    for (const e of s.events) {
      const next = applyGovernance(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function governanceMilestoneFacts(
  save: GovernanceSave,
  verify?: (g: GovernanceGuide) => boolean,
) {
  const f = governanceFacts(save, verify);
  return Object.fromEntries(
    governanceMissions.map((id) => [
      id,
      f.guided.some(
        (g) => g.mission === id && governanceGuidedFacts(g, verify?.(g) ?? false).witnessed,
      ),
    ]),
  ) as Record<GovernanceMission, boolean>;
}
