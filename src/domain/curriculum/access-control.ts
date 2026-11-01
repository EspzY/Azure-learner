import {
  accessModelVersion,
  validAccessInput,
  runRbac,
  runConditional,
  type AccessInput,
  type Outcome,
} from './access-control-model';
import {
  accessItems,
  accessItemIds,
  evaluateAccess,
  type AccessAnswer,
  type AccessItemId,
} from './access-control-items';
export { accessItems, accessItemIds, evaluateAccess };
export type { AccessAnswer, AccessItemId };
export const accessKey = 'azurelab.learning.access-control.v1';
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const accessVersion = '1.0.0';
export const accessLimit = 800;
/** Leave ample JSON-envelope and terminal-event reserve for bounded scope snapshots. */
export const accessNormalCharacters = 480000;
export const accessTopics = [
  'introduction',
  'rbac',
  'scope',
  'roles',
  'planes',
  'conditional',
  'policies',
  'testing',
  'studio',
  'missions',
  'assessment',
  'summary',
] as const;
export type AccessTopic = (typeof accessTopics)[number];
export const accessMissions = ['rbac', 'conditional'] as const;
export type AccessMission = (typeof accessMissions)[number];
export const accessGuidedAnswer = { rbac: 1, conditional: 2 } as const;
export const accessMissionTopic = { rbac: 'studio', conditional: 'studio' } as const;
export const accessHref = (topic: AccessTopic, item?: AccessItemId) =>
  `/learn/access-control?topic=${topic}${item ? `&case=${item}` : ''}`;
export const accessManifest = {
  id: 'access-control',
  content: accessVersion,
  model: accessModelVersion,
  rubric: accessVersion,
  reviewed: '2026-10-31',
  prerequisites: ['I01', 'CA07'],
  objectives: { ACF01: ['I03'], ACF02: ['I02'] },
  objectiveSources: {
    ACF01: ['AC03', 'AC09', 'AC10', 'AC11', 'AC12', 'AC13', 'AC14', 'AC15', 'AC16', 'AC17', 'AC25'],
    ACF02: [
      'AC04',
      'AC05',
      'AC06',
      'AC07',
      'AC08',
      'AC18',
      'AC19',
      'AC20',
      'AC21',
      'AC22',
      'AC23',
      'AC26',
      'AC27',
    ],
  },
  certificationOverlay: {
    exam: 'AZ-900',
    version: '2026-07-20',
    slots: ['2.4.04', '2.4.05'],
    facets: {
      'Conditional Access signals/targeting/controls': 'ACF01',
      'RBAC principal/role/scope': 'ACF02',
    },
  },
  teaching: accessTopics,
  activities: accessMissions,
  assessment: accessItemIds,
  humanSme: null,
  learnerStudy: null,
} as const;
export interface AccessAttempt {
  id: number;
  item: AccessItemId;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: AccessAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export const evaluateAccessAttempt = (a: AccessAttempt) => evaluateAccess(a.item, a.answer);
export interface AccessRun {
  kind: 'run';
  input: AccessInput;
  prediction: Outcome;
}
export interface AccessGuide {
  id: number;
  mission: AccessMission;
  runs: AccessRun[];
  configuration: Partial<Record<AccessMission, AccessInput>>;
  answer: number | null;
}
export type AccessEvent =
  | { kind: 'resume'; id: number }
  | { kind: 'pause' }
  | AccessRun
  | { kind: 'visit'; topic: AccessTopic }
  | { kind: 'mission'; mission: AccessMission }
  | { kind: 'configure'; input: AccessInput }
  | { kind: 'explain'; answer: number }
  | { kind: 'begin'; item: AccessItemId }
  | { kind: 'draft'; answer: AccessAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface AccessSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: AccessEvent[];
}
export const freshAccess = (): AccessSave => ({
  schema: 1,
  content: accessVersion,
  model: accessModelVersion,
  rubric: accessVersion,
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
const pair = <T extends { input: AccessInput }>(
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
export function accessWitnesses(g: AccessGuide) {
  const rs = g.runs.flatMap((r) => {
    const v = runRbac(r.input);
    return v ? [v] : [];
  });
  const cs = g.runs.flatMap((r) => {
    const v = runConditional(r.input);
    return v ? [v] : [];
  });
  if (g.mission === 'rbac')
    return [
      pair(
        rs,
        (x) =>
          x.input.role === 'reader' &&
          x.input.scope === 'sub-app' &&
          x.input.target === 'vm' &&
          x.input.action === 'view' &&
          x.allowed,
        (x) => x.input.action === 'modify-vm' && !x.allowed,
        ['action'],
      ),
      pair(
        rs,
        (x) =>
          x.input.role === 'contributor' &&
          x.input.scope === 'rg-app' &&
          x.input.target === 'vm' &&
          x.input.action === 'modify-vm' &&
          x.allowed,
        (x) => x.input.action === 'assign-role' && !x.allowed,
        ['action'],
      ),
      pair(
        rs,
        (x) =>
          x.input.role === 'contributor' &&
          x.input.scope === 'mg' &&
          x.input.target === 'vm' &&
          x.input.action === 'modify-vm' &&
          x.allowed,
        (x) =>
          x.input.role === 'vm-contributor' &&
          x.input.scope === 'vm' &&
          x.input.second === 'none' &&
          x.allowed &&
          x.scopeBreadth === 1,
        ['role', 'scope'],
      ),
      pair(
        rs,
        (x) =>
          x.input.role === 'reader' &&
          x.input.scope === 'vm' &&
          x.input.target === 'rg-app' &&
          x.input.action === 'view' &&
          !x.allowed,
        (x) => x.input.scope === 'sub-app' && x.allowed,
        ['scope'],
      ),
    ];
  const normal = (x: NonNullable<ReturnType<typeof runConditional>>) =>
    x.input.subject === 'employee' && x.input.app === 'azure' && x.input.authenticated;
  return [
    pair(
      cs,
      (x) =>
        normal(x) &&
        x.input.policyA.state === 'on' &&
        x.input.policyA.control === 'mfa' &&
        x.input.policyB.state === 'on' &&
        x.input.policyB.control === 'device' &&
        x.policies.every((p) => p.applies) &&
        x.input.mfa &&
        !x.input.compliant &&
        x.status === 'requirements',
      (x) => x.input.compliant && x.caMet,
      ['compliant'],
    ),
    pair(
      cs,
      (x) =>
        normal(x) &&
        x.input.mfa &&
        x.input.compliant &&
        x.input.policyB.control === 'block' &&
        x.input.policyB.state === 'on' &&
        x.status === 'blocked',
      (x) => x.input.policyB.state === 'report' && x.policies[1]!.reportOnly && x.caMet,
      ['policyB.state'],
    ),
    pair(
      cs,
      (x) =>
        normal(x) &&
        x.input.policyB.state === 'off' &&
        x.input.policyA.audience === 'team' &&
        x.input.policyA.control === 'mfa' &&
        x.input.policyA.state === 'on' &&
        !x.input.mfa &&
        !x.input.member &&
        x.status === 'not-applicable',
      (x) => x.input.member && x.status === 'requirements',
      ['member'],
    ),
    pair(
      cs,
      (x) => normal(x) && x.caMet && !x.rbac.allowed,
      (x) => x.combined,
      ['authorization'],
    ) &&
      pair(
        cs,
        (x) => normal(x) && x.combined,
        (x) => !x.caMet && x.rbac.allowed && x.status === 'requirements',
        ['mfa'],
      ) &&
      cs.some((x) => normal(x) && !x.caMet && !x.rbac.allowed && x.status === 'requirements'),
  ];
}
export function accessGuidedFacts(g: AccessGuide) {
  const witnesses = accessWitnesses(g),
    witnessed = witnesses.every(Boolean),
    correct = g.answer === accessGuidedAnswer[g.mission];
  return { witnesses, witnessed, correct, complete: witnessed && correct };
}
export function accessFacts(save: AccessSave) {
  const attempts: AccessAttempt[] = [],
    guided: AccessGuide[] = [],
    visited: AccessTopic[] = [];
  let current: AccessAttempt | undefined,
    guide: AccessGuide | undefined,
    topic: AccessTopic = 'introduction';
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
      const d = accessItems[e.item];
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
    firsts: accessItemIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    completed: accessMissions.filter((id) =>
      guided.some((g) => g.mission === id && accessGuidedFacts(g).complete),
    ),
    full:
      save.events.length >= accessLimit - 5 ||
      JSON.stringify(save).length >= accessNormalCharacters,
  };
}
const choice = (v: unknown) => v === null || integer(v, 0, 2);
function validEvent(v: unknown): v is AccessEvent {
  if (!object(v)) return false;
  if (v.kind === 'resume') return keys(v, ['kind', 'id']) && integer(v.id, 1, 800);
  if (v.kind === 'pause') return keys(v, ['kind']);
  if (v.kind === 'visit')
    return keys(v, ['kind', 'topic']) && accessTopics.includes(v.topic as AccessTopic);
  if (v.kind === 'mission')
    return keys(v, ['kind', 'mission']) && accessMissions.includes(v.mission as AccessMission);
  if (v.kind === 'configure' || v.kind === 'run')
    return (
      keys(v, v.kind === 'run' ? ['kind', 'input', 'prediction'] : ['kind', 'input']) &&
      validAccessInput(v.input) &&
      (v.kind !== 'run' || integer(v.prediction, 0, 2))
    );
  if (v.kind === 'explain') return keys(v, ['kind', 'answer']) && integer(v.answer, 0, 2);
  if (v.kind === 'begin')
    return keys(v, ['kind', 'item']) && accessItemIds.includes(v.item as AccessItemId);
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
export function applyAccess(save: AccessSave, raw: unknown): AccessSave | null {
  if (!validEvent(raw)) return null;
  const f = accessFacts(save),
    g = f.guide;
  if (raw.kind === 'begin') {
    if (f.active || f.full) return null;
  } else if (['draft', 'aid', 'submit', 'abandon'].includes(raw.kind)) {
    if (!f.active || !f.current) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(f.current.answer)) return save;
      if (save.events.length >= accessLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (f.assisted) return save;
      if (save.events.length >= accessLimit - 1) return null;
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
      if (!g || !accessGuidedFacts(g).witnessed) return null;
      if (g.answer === raw.answer || g.answer === accessGuidedAnswer[g.mission]) return save;
      // Preserve a final correction even after repeated wrong causal choices.
      if (save.events.length >= accessLimit - 1 && raw.answer !== accessGuidedAnswer[g.mission])
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
      if (f.full && (!accessGuidedFacts(target).witnessed || save.events.length >= accessLimit - 1))
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
  if (save.events.length >= accessLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw)] };
}
export function restoreAccess(raw: string | null): {
  save: AccessSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  const invalid = (issue: 'corrupt' | 'unsupported') => ({ save: freshAccess(), issue });
  if (raw === null) return { save: freshAccess(), issue: null };
  if (raw.length > 600000) return invalid('corrupt');
  try {
    const s: unknown = JSON.parse(raw);
    if (!object(s)) return invalid('corrupt');
    if (
      s.schema !== 1 ||
      s.content !== accessVersion ||
      s.model !== accessModelVersion ||
      s.rubric !== accessVersion
    )
      return invalid('unsupported');
    if (
      !keys(s, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(s.events) ||
      s.events.length > accessLimit
    )
      return invalid('corrupt');
    let save = freshAccess();
    for (const e of s.events) {
      const next = applyAccess(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
export function accessMilestoneFacts(save: AccessSave) {
  const f = accessFacts(save);
  return Object.fromEntries(
    accessMissions.map((id) => [
      id,
      f.guided.some((g) => g.mission === id && accessWitnesses(g).every(Boolean)),
    ]),
  ) as Record<AccessMission, boolean>;
}
