import {
  toolsModelVersion,
  validToolsInput,
  runTools,
  type ToolsInput,
  type Outcome,
} from './management-tools-model';
import {
  toolsItems,
  toolsItemIds,
  evaluateTools,
  type ToolsAnswer,
  type ToolsItemId,
} from './management-tools-items';
export { toolsItems, toolsItemIds, evaluateTools };
export type { ToolsAnswer, ToolsItemId };
export const toolsKey = 'azurelab.learning.management-tools.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const toolsVersion = '1.0.0';
export const toolsLimit = 800;
/** Leave ample JSON-envelope and terminal-event reserve for bounded scope snapshots. */
export const toolsNormalCharacters = 480000;
export const toolsTopics = [
  'introduction',
  'portal',
  'shell',
  'cli',
  'powershell',
  'arm',
  'iac',
  'templates',
  'bicep',
  'changes',
  'arc',
  'copilot',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type ToolsTopic = (typeof toolsTopics)[number];
export const toolsMissions = ['intent', 'change', 'arc'] as const;
export type ToolsMission = (typeof toolsMissions)[number];
export const toolsGuidedAnswer = { intent: 1, change: 2, arc: 0 } as const;
export const toolsMissionTopic = { intent: 'studio', change: 'studio', arc: 'studio' } as const;
export const toolsHref = (topic: ToolsTopic, item?: ToolsItemId) =>
  `/learn/management-tools?topic=${topic}${item ? `&case=${item}` : ''}`;
export const toolsManifest = {
  id: 'management-tools',
  content: toolsVersion,
  model: toolsModelVersion,
  rubric: toolsVersion,
  reviewed: '2026-11-01',
  prerequisites: ['CA04', 'CA05', 'CA07', 'ACF02', 'GOV02', 'GOV03'],
  objectives: {
    MGT01: ['CB04'],
    MGT02: ['CB04'],
    MGT03: ['G03'],
    MGT04: ['CB04'],
    MGT05: ['CA04', 'CA07'],
  },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['3.3.01', '3.3.02', '3.3.03', '3.3.04', '3.3.05'],
    supplement: 'Azure Copilot; not a sixth exam goal',
    deferred: ['P14 Monitoring', 'P15 Security', 'P16 Migration'],
  },
  teaching: toolsTopics,
  activities: toolsMissions,
  assessment: toolsItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface ToolsAttempt {
  id: number;
  item: ToolsItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: ToolsAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateToolsAttempt = (a: ToolsAttempt) => evaluateTools(a.item, a.answer);
export interface ToolsRun {
  kind: 'run';
  input: ToolsInput;
  prediction: Outcome;
}
export interface ToolsGuide {
  id: number;
  mission: ToolsMission;
  attempt: number | null;
  boundary: string | null;
  through: string | null;
  inspected: string[];
  runs: ToolsRun[];
  configuration: Partial<Record<ToolsMission, ToolsInput>>;
  answer: number | null;
}
export type ToolsEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | ToolsRun
  | { kind: 'visit'; topic: ToolsTopic }
  | { kind: 'mission'; mission: ToolsMission; attempt: number | null; boundary: string | null }
  | { kind: 'inspect'; ref: string; through: string | null }
  | { kind: 'configure'; input: ToolsInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: ToolsItemId }
  | { kind: 'draft'; answer: ToolsAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface ToolsSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: ToolsEvent[];
}
export const freshTools = (): ToolsSave => ({
  schema: 1,
  content: toolsVersion,
  model: toolsModelVersion,
  rubric: toolsVersion,
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
const pair = <T extends { input: ToolsInput }>(
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
export function toolsWitnesses(g: ToolsGuide) {
  const runs = g.runs.flatMap((r) => {
    const x = runTools(r.input);
    return x ? [x] : [];
  });
  const ins = runs.filter((x) => x.kind === 'intent');
  const ch = runs.filter((x) => x.kind === 'change');
  const ar = runs.filter((x) => x.kind === 'arc');
  if (g.mission === 'intent')
    return [
      pair(
        ins,
        (x) =>
          x.input.tool === 'cli' && x.input.host === 'local-bash' && !x.input.installed && !x.ready,
        (y) => y.input.installed && y.ready,
        ['installed'],
      ),
      ['portal', 'cli', 'powershell', 'arm', 'bicep'].every((tool) =>
        ins.some(
          (x) =>
            x.input.tool === tool &&
            x.ready &&
            x.input.subscription === 'app' &&
            x.input.metadataRegion === 'norwayeast',
        ),
      ),
    ];
  if (g.mission === 'change')
    return [
      pair(
        ch,
        (x) =>
          x.input.syntax === 'arm' &&
          x.input.baseline === 'empty' &&
          x.referenceValid &&
          x.input.order === 'none' &&
          x.missingOrder,
        (y) => y.input.order === 'explicit' && y.ready,
        ['order'],
      ),
      pair(
        ch,
        (x) =>
          x.input.baseline === 'dev' &&
          x.input.stage === 'dev' &&
          x.input.costCenter === 'engineering' &&
          x.ready &&
          x.changes.every((v) => v.change === 'no-change'),
        (y) =>
          y.input.costCenter === 'sales' &&
          y.ready &&
          y.changes.every((v) => v.change === 'modify'),
        ['costCenter'],
      ),
      pair(
        ch,
        (x) => x.input.baseline === 'dev' && x.input.stage === 'dev' && x.ready,
        (y) =>
          y.input.stage === 'prod' &&
          y.ready &&
          y.changes.every((v) => v.change === 'create') &&
          y.retainedOld.length === 2,
        ['stage'],
      ),
      pair(
        ch,
        (x) =>
          x.input.syntax === 'arm' &&
          x.input.baseline === 'empty' &&
          x.input.order === 'none' &&
          x.missingOrder,
        (y) => y.input.syntax === 'bicep' && y.implicit && y.ready,
        ['syntax'],
      ),
    ];
  return [
    pair(
      ar,
      (x) =>
        x.input.resource === 'onprem-server' && x.input.approach === 'native' && !x.correctApproach,
      (y) =>
        y.input.approach === 'servers' &&
        y.capabilityReady &&
        y.physical === 'onprem' &&
        !y.migrated,
      ['approach'],
    ),
    pair(
      ar,
      (x) =>
        x.input.resource === 'onprem-kubernetes' &&
        x.input.approach === 'servers' &&
        !x.correctApproach,
      (y) => y.input.approach === 'kubernetes' && y.capabilityReady,
      ['approach'],
    ),
    pair(
      ar,
      (x) => x.input.resource === 'othercloud-server' && x.capabilityReady,
      (y) => !y.input.connected && y.represented && y.stale && !y.available && !y.capabilityReady,
      ['connected'],
    ),
  ];
}
export function toolsGuidedFacts(g: ToolsGuide, technicalVerified = false) {
  const witnesses = toolsWitnesses(g),
    modeled = witnesses.every(Boolean),
    correct = g.answer === toolsGuidedAnswer[g.mission];
  const witnessed = modeled && (g.mission !== 'intent' || technicalVerified);
  return { witnesses, modeled, witnessed, correct, complete: witnessed && correct };
}
export function toolsFacts(save: ToolsSave, verify?: (g: ToolsGuide) => boolean) {
  const attempts: ToolsAttempt[] = [],
    guided: ToolsGuide[] = [],
    visited: ToolsTopic[] = [];
  let current: ToolsAttempt | undefined,
    guide: ToolsGuide | undefined,
    topic: ToolsTopic = 'introduction';
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
      const d = toolsItems[e.item];
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
    firsts: toolsItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: toolsMissions.filter((id) =>
      guided.some((g) => g.mission === id && toolsGuidedFacts(g, verify?.(g) ?? false).complete),
    ),
    full:
      save.events.length >= toolsLimit - 5 || JSON.stringify(save).length >= toolsNormalCharacters,
  };
}
const ref = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const nullableRef = (v: unknown) => v === null || ref(v);
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is ToolsEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && toolsTopics.includes(v.topic as ToolsTopic);
  if (v.kind === 'mission')
    return (
      keys(v, ['kind', 'mission', 'attempt', 'boundary']) &&
      toolsMissions.includes(v.mission as ToolsMission) &&
      (v.mission === 'intent'
        ? integer(v.attempt, 1, 100000) && nullableRef(v.boundary)
        : v.attempt === null && v.boundary === null)
    );
  if (v.kind === 'inspect')
    return (
      keys(v, ['kind', 'ref', 'through']) &&
      typeof v.ref === 'string' &&
      /^(resource|dependency|receipt):[a-zA-Z0-9_-]{1,64}$/.test(v.ref) &&
      nullableRef(v.through)
    );
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validToolsInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && toolsItemIds.includes(v.item as ToolsItemId);
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
export function applyTools(save: ToolsSave, raw: unknown): ToolsSave | null {
  if (!validEvent(raw)) return null;
  const f = toolsFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= toolsLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= toolsLimit - 1) return null;
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
      if (!g || !toolsGuidedFacts(g).modeled) return null;
      if (g.answer === raw.answer || g.answer === toolsGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (save.events.length >= toolsLimit - 1 && raw.answer !== toolsGuidedAnswer[g.mission])
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
      if (f.full && (!toolsGuidedFacts(target).modeled || save.events.length >= toolsLimit - 1))
        return null;
    } else if (f.full) return null;
    if (raw.kind === 'inspect') {
      if (!g || g.mission !== 'intent' || f.full) return null;
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
  if (save.events.length >= toolsLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreTools(raw: string | null): {
  save: ToolsSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshTools(), issue });
  if (raw === null) return { save: freshTools(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== toolsVersion ||
      s.model !== toolsModelVersion ||
      s.rubric !== toolsVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > toolsLimit
    )
      return invalid('corrupt');
    let save = freshTools();
    for (const e of s.events) {
      const next = applyTools(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function toolsMilestoneFacts(save: ToolsSave, verify?: (g: ToolsGuide) => boolean) {
  const f = toolsFacts(save, verify);
  return Object.fromEntries(
    toolsMissions.map((id) => [
      id,
      f.guided.some((g) => g.mission === id && toolsGuidedFacts(g, verify?.(g) ?? false).witnessed),
    ]),
  ) as Record<ToolsMission, boolean>;
}
