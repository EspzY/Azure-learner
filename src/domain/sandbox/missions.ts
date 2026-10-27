import type { Engine, World } from '../chapter01/model';
import { appSettings, infrastructure, types } from './model';
import { replayEngine } from './replay';

export const missionKey = 'azurelab.practical-missions.v1';
export const missionIds = ['diagnose', 'governance', 'infrastructure', 'platform'] as const;
export type MissionId = (typeof missionIds)[number];
export const missionDefinitions = {
  diagnose: {
    module: 'benefits',
    topic: 'reliability',
    objectives: ['CB01', 'CB02'],
    sources: ['PM03', 'PM04', 'PM09', 'PM10', 'PM11', 'PM12'],
    rubric: 'dependency-diagnosis@1',
  },
  governance: {
    module: 'benefits',
    topic: 'governance',
    objectives: ['CB03', 'CB04'],
    sources: ['PM05', 'PM06', 'PM14', 'PM15', 'PM16'],
    rubric: 'governed-correction@1',
  },
  infrastructure: {
    module: 'services',
    topic: 'iaas',
    objectives: ['ST01', 'ST04'],
    sources: ['PM07', 'PM08', 'PM11', 'PM12', 'PM13'],
    rubric: 'guest-control@1',
  },
  platform: {
    module: 'services',
    topic: 'paas',
    objectives: ['ST02', 'ST04'],
    sources: ['PM07', 'PM08', 'PM17', 'PM18', 'PM19'],
    rubric: 'configuration-restoration@1',
  },
} as const;
export const missionVersion = '1.0.0';
export const isMission = (v: unknown): v is MissionId => missionIds.includes(v as MissionId);
export const missionOrigin = (id: MissionId) => {
  const d = missionDefinitions[id];
  return `/learn/${d.module}?topic=${d.topic}&activity=mission${d.module === 'services' ? '&version=2' : ''}`;
};
export const missionPortal = (id: MissionId, area = 'home') => `/portal?area=${area}&mission=${id}`;
const reference = (v: unknown): v is string =>
  typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const ledgerRef = (v: unknown): v is string | null => v === null || reference(v);
const exact = (v: object, keys: string) => Object.keys(v).sort().join(',') === keys;

export interface DiagnosisInput {
  failure: 'os' | 'nic' | 'subnet';
  copies: 1 | 2;
  isolation: 'shared' | 'independent';
  routing: 'single' | 'balanced';
}
export function validDiagnosis(v: unknown): v is DiagnosisInput {
  if (
    !v ||
    typeof v !== 'object' ||
    Array.isArray(v) ||
    !exact(v, 'copies,failure,isolation,routing')
  )
    return false;
  const i = v as DiagnosisInput;
  return (
    ['os', 'nic', 'subnet'].includes(i.failure) &&
    [1, 2].includes(i.copies) &&
    ['shared', 'independent'].includes(i.isolation) &&
    ['single', 'balanced'].includes(i.routing)
  );
}
export function vmChain(world: World, id: string | null) {
  const rs = infrastructure(world),
    vm = rs.find((r) => r.id === id && r.kind === 'vm');
  if (vm?.kind !== 'vm') return null;
  const os = rs.find((r) => r.id === vm.osDiskId && r.kind === 'disk' && r.role === 'os'),
    nic = rs.find((r) => r.id === vm.nicId && r.kind === 'nic'),
    subnet =
      nic?.kind === 'nic' ? rs.find((r) => r.id === nic.subnetId && r.kind === 'subnet') : null,
    vnet =
      subnet?.kind === 'subnet'
        ? rs.find((r) => r.id === subnet.vnetId && r.kind === 'vnet')
        : null,
    data = rs.find((r) => r.id === vm.dataDiskId && r.kind === 'disk' && r.role === 'data');
  return os && nic && subnet && vnet ? { vm, os, nic, subnet, vnet, data } : null;
}
/** A declared teaching hypothesis, NEVER failover/traffic/health in the Portal. */
export function diagnose(world: World, id: string | null, raw: unknown) {
  const chain = vmChain(world, id);
  if (!chain || !validDiagnosis(raw)) return null;
  const input = raw;
  const paths = Array.from({ length: input.copies }, (_, n) => {
    const affected = n === 0 || (input.failure === 'subnet' && input.isolation === 'shared');
    return {
      path: n + 1,
      affected,
      routed: n === 0 || input.routing === 'balanced',
      usable: !affected && (n === 0 || input.routing === 'balanced'),
    };
  });
  return {
    input,
    paths,
    available: paths.filter((p) => !p.affected).length,
    usable: paths.filter((p) => p.usable).length,
    dependency: chain[input.failure].id,
  };
}
export interface MissionRun {
  target: string;
  through: string | null;
  input: DiagnosisInput;
  prediction: number;
}
export interface MissionSession {
  id: number;
  mission: MissionId;
  mode: 'guided' | 'independent';
  attempt: number;
  boundary: string | null;
  target: string | null;
  inspected: string[];
  runs: MissionRun[];
  drafts: { target: string; through: string | null; environment: string; catalogMode: string }[];
  answers: { decision: string | null; reason: string | null };
  aided: boolean;
  status: 'active' | 'submitted' | 'abandoned';
  through: string | null;
}
export type MissionEvent =
  | {
      type: 'start';
      mission: MissionId;
      mode: MissionSession['mode'];
      attempt: number;
      boundary: string | null;
    }
  | { type: 'select'; target: string }
  | { type: 'inspect'; ref: string }
  | { type: 'run'; run: MissionRun }
  | {
      type: 'draft';
      target: string;
      through: string | null;
      environment: string;
      catalogMode: string;
    }
  | { type: 'answer'; field: 'decision' | 'reason'; value: string }
  | { type: 'aid' }
  | { type: 'submit'; through: string | null }
  | { type: 'abandon' }
  | { type: 'resume'; id: number };
export interface MissionSave {
  schema: 1;
  content: '1.0.0';
  model: '1.0.0';
  rubric: '1.0.0';
  events: MissionEvent[];
}
export const freshMissions = (): MissionSave => ({
  schema: 1,
  content: missionVersion,
  model: missionVersion,
  rubric: missionVersion,
  events: [],
});
export function missionFacts(save: MissionSave) {
  const sessions: MissionSession[] = [];
  let selected = 0;
  for (const e of save.events) {
    const s = sessions.find((x) => x.id === selected);
    if (e.type === 'start') {
      selected = sessions.length + 1;
      sessions.push({
        ...e,
        id: selected,
        target: null,
        inspected: [],
        runs: [],
        drafts: [],
        answers: { decision: null, reason: null },
        aided: false,
        status: 'active',
        through: null,
      });
    } else if (e.type === 'resume') selected = e.id;
    else if (s?.status === 'active') {
      if (e.type === 'select') s.target = e.target;
      if (e.type === 'inspect') s.inspected = [...new Set([...s.inspected, e.ref])];
      if (e.type === 'run') s.runs.push(e.run);
      if (e.type === 'draft')
        s.drafts.push({
          target: e.target,
          through: e.through,
          environment: e.environment,
          catalogMode: e.catalogMode,
        });
      if (e.type === 'answer') s.answers[e.field] = e.value;
      if (e.type === 'aid') s.aided = true;
      if (e.type === 'submit') {
        s.through = e.through;
        s.status = 'submitted';
      }
      if (e.type === 'abandon') s.status = 'abandoned';
    }
  }
  const current = sessions.find((x) => x.id === selected) ?? null;
  const activeSession = sessions.find((x) => x.status === 'active') ?? null;
  return {
    sessions,
    current,
    activeSession,
    active: activeSession?.mode === 'independent',
    assisted: activeSession?.aided ?? false,
  };
}
export const answerIds = {
  diagnose: {
    decision: ['dependency', 'more-compute', 'new-group'],
    reason: ['declared-path', 'azure-measured', 'guaranteed'],
  },
  governance: {
    decision: ['resource-location', 'metadata-location', 'other-subscription'],
    reason: ['bounded-check', 'secure-app', 'full-compliance'],
  },
  infrastructure: {
    decision: ['guest-control', 'managed-guest', 'ready-app'],
    reason: ['retained-operations', 'provider-patches', 'network-proven'],
  },
  platform: {
    decision: ['managed-os', 'custom-kernel', 'license-only'],
    reason: ['config-only', 'running-proven', 'provider-code'],
  },
} as const;
export function missionAnswerIds(s: Pick<MissionSession, 'mission' | 'mode'>) {
  return s.mission === 'platform' && s.mode === 'independent'
    ? {
        decision: ['app-scope', 'plan-scope', 'group-scope'],
        reason: ['isolated-config', 'shared-values', 'live-isolation'],
      }
    : answerIds[s.mission];
}
export function applyMission(save: MissionSave, raw: unknown): MissionSave | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || save.events.length >= 604)
    return null;
  const e = raw as MissionEvent,
    f = missionFacts(save),
    s = f.current;
  const terminal = e.type === 'aid' || e.type === 'abandon' || e.type === 'submit';
  const missingAnswer =
    e.type === 'answer' &&
    s &&
    ['decision', 'reason'].includes(e.field) &&
    s.answers[e.field] === null;
  if (save.events.length >= 600 && !terminal && !missingAnswer) return null;
  if (e.type === 'start') {
    if (
      !exact(e, 'attempt,boundary,mission,mode,type') ||
      !isMission(e.mission) ||
      !['guided', 'independent'].includes(e.mode) ||
      !Number.isSafeInteger(e.attempt) ||
      e.attempt < 1 ||
      e.attempt > 100000 ||
      !ledgerRef(e.boundary) ||
      f.activeSession
    )
      return null;
  } else if (e.type === 'resume') {
    if (
      !exact(e, 'id,type') ||
      !Number.isSafeInteger(e.id) ||
      !f.sessions.some((x) => x.id === e.id) ||
      (f.activeSession && f.activeSession.id !== e.id)
    )
      return null;
  } else {
    if (!s || s.status !== 'active') return null;
    if (e.type === 'select') {
      if (!exact(e, 'target,type') || !reference(e.target)) return null;
      if (s.target === e.target) return save;
    } else if (e.type === 'inspect') {
      if (
        !exact(e, 'ref,type') ||
        typeof e.ref !== 'string' ||
        !/^(resource|receipt|policy|graph):[a-zA-Z0-9_-]{1,64}$/.test(e.ref)
      )
        return null;
      if (s.inspected.includes(e.ref)) return save;
    } else if (e.type === 'run') {
      const r = e.run;
      if (
        s.mission !== 'diagnose' ||
        !exact(e, 'run,type') ||
        !r ||
        !exact(r, 'input,prediction,target,through') ||
        !reference(r.target) ||
        !ledgerRef(r.through) ||
        !validDiagnosis(r.input) ||
        ![0, 1, 2].includes(r.prediction) ||
        s.runs.length >= 24
      )
        return null;
    } else if (e.type === 'draft') {
      if (
        s.mission !== 'platform' ||
        !exact(e, 'catalogMode,environment,target,through,type') ||
        !reference(e.target) ||
        !ledgerRef(e.through) ||
        !['development', 'staging', 'production'].includes(e.environment) ||
        !['read-only', 'standard'].includes(e.catalogMode) ||
        s.drafts.length >= 24
      )
        return null;
    } else if (e.type === 'answer') {
      if (
        !exact(e, 'field,type,value') ||
        !['decision', 'reason'].includes(e.field) ||
        !(missionAnswerIds(s)[e.field] as readonly string[]).includes(e.value)
      )
        return null;
      if (s.answers[e.field] === e.value) return save;
    } else if (e.type === 'submit') {
      if (
        !exact(e, 'through,type') ||
        !ledgerRef(e.through) ||
        !s.answers.decision ||
        !s.answers.reason
      )
        return null;
    } else if (e.type === 'aid' || e.type === 'abandon') {
      if (!exact(e, 'type')) return null;
      if (e.type === 'aid' && s.aided) return save;
    } else return null;
  }
  return { ...save, events: [...save.events, e] };
}
export function restoreMissions(raw: string | null): {
  save: MissionSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshMissions(), issue: null };
  try {
    if (raw.length > 240000) throw Error('corrupt');
    const v = JSON.parse(raw) as MissionSave;
    if (
      !v ||
      v.schema !== 1 ||
      v.content !== missionVersion ||
      v.model !== missionVersion ||
      v.rubric !== missionVersion
    )
      return { save: freshMissions(), issue: 'unsupported' };
    if (
      !exact(v, 'content,events,model,rubric,schema') ||
      !Array.isArray(v.events) ||
      v.events.length > 604
    )
      throw Error('corrupt');
    let save = freshMissions();
    for (const event of v.events) {
      const next = applyMission(save, event);
      if (!next) throw Error('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return { save: freshMissions(), issue: 'corrupt' };
  }
}
const index = (engine: Engine, ref: string | null) =>
  ref === null ? -1 : engine.ledger.findIndex((e) => e.receipt.commandId === ref);
export function missionEvaluation(s: MissionSession | null, engine: Engine, attempt: number) {
  const checks: Record<string, boolean> = {},
    refs: string[] = [],
    receipts: string[] = [];
  const empty = {
    verifiable: false,
    checks,
    refs,
    receipts,
    complete: false,
    world: null as World | null,
    chain: null as ReturnType<typeof vmChain>,
    appId: null as string | null,
    reused: false,
  };
  if (!s || s.status === 'abandoned' || s.attempt !== attempt) return empty;
  const boundary = index(engine, s.boundary),
    end = s.status === 'submitted' ? index(engine, s.through) : engine.ledger.length - 1;
  if ((s.boundary !== null && boundary < 0) || (s.through !== null && end < 0) || end < boundary)
    return empty;
  const replay = replayEngine(engine, end + 1);
  if (!replay) return empty;
  const w = replay.world,
    entries = engine.ledger.slice(boundary + 1, end + 1),
    inspected = (kind: string, id: string) => s.inspected.includes(`${kind}:${id}`);
  const chain = vmChain(w, s.target),
    app = w.resources.find((r) => r.id === s.target && r.type === types.app);
  let reused = false;
  if (s.mission === 'diagnose' || s.mission === 'infrastructure') {
    checks.subject = !!chain;
    if (chain) {
      const ids = [
        chain.vm.id,
        chain.os.id,
        chain.nic.id,
        chain.subnet.id,
        ...(s.mission === 'infrastructure' && chain.data ? [chain.data.id] : []),
      ];
      refs.push(...ids);
      checks.attachments = ids.every((id) => inspected('resource', id));
      const created = entries.find(
        (e) =>
          e.receipt.operation === 'CreateVmBundle' &&
          e.receipt.outcome === 'accepted' &&
          e.receipt.addedIds.includes(chain.vm.id),
      );
      reused = !created;
      if (s.mission === 'infrastructure') {
        checks.newBuild = !!created;
        checks.receipt = !!created && inspected('receipt', created.receipt.commandId);
        if (created) receipts.push(created.receipt.commandId);
        const independent = s.mode === 'independent';
        checks.requirements =
          chain.vm.image === (independent ? 'windows-2022' : 'ubuntu-22-04') &&
          chain.vm.profile === (independent ? 'small' : 'standard') &&
          chain.data?.kind === 'disk' &&
          chain.data.gib === 32 &&
          w.groups.find((g) => g.id === chain.vm.groupId)?.subscriptionId ===
            (independent ? 'sub-app' : 'sub-shared');
      } else {
        const runs = s.runs.flatMap((r) => {
          const at = index(engine, r.through);
          if (
            r.target !== chain.vm.id ||
            (r.through !== null && at < 0) ||
            at < boundary ||
            at > end
          )
            return [];
          const snapshot = replayEngine(engine, at + 1),
            result = snapshot && diagnose(snapshot.world, r.target, r.input);
          return result ? [result] : [];
        });
        checks.contrast =
          s.mode === 'guided'
            ? runs.some(
                (r) =>
                  r.input.failure === 'subnet' &&
                  r.input.copies === 2 &&
                  r.input.isolation === 'shared' &&
                  r.input.routing === 'balanced' &&
                  r.usable === 0,
              ) &&
              runs.some(
                (r) =>
                  r.input.failure === 'subnet' &&
                  r.input.copies === 2 &&
                  r.input.isolation === 'independent' &&
                  r.input.routing === 'balanced' &&
                  r.usable === 1,
              )
            : runs.some(
                (r) =>
                  r.input.failure === 'os' &&
                  r.input.copies === 2 &&
                  r.input.routing === 'single' &&
                  r.usable === 0,
              ) &&
              runs.some(
                (r) =>
                  r.input.failure === 'os' &&
                  r.input.copies === 2 &&
                  r.input.routing === 'balanced' &&
                  r.usable === 1,
              );
      }
    }
  } else if (s.mission === 'governance') {
    checks.subject = !!app && app.type === types.app;
    if (app?.type === types.app) {
      reused = !entries.some(
        (e) =>
          e.receipt.operation === 'CreateWebApp' &&
          e.receipt.outcome === 'accepted' &&
          e.receipt.addedIds.includes(app.id),
      );
      const group = w.groups.find((g) => g.id === app.groupId),
        plan = w.resources.find((p) => p.id === app.planId && p.type === types.plan);
      const accepted = entries.find(
        (e) =>
          e.receipt.operation === 'CreatePlan' &&
          e.receipt.outcome === 'accepted' &&
          e.receipt.addedIds.includes(app.planId),
      );
      const rejected = entries.find(
        (e) =>
          e.receipt.code === 'policy-location-denied' &&
          e.receipt.operation === 'CreatePlan' &&
          e.receipt.scopeId === app.groupId &&
          e.receipt.policy?.assignmentScope === 'sub-app' &&
          e.receipt.addedIds.length === 0 &&
          e.receipt.beforeRevision === e.receipt.afterRevision,
      );
      const correctedOrder =
        accepted && rejected && engine.ledger.indexOf(accepted) > engine.ledger.indexOf(rejected);
      checks.denied = !!rejected;
      checks.corrected =
        !!correctedOrder &&
        !!plan &&
        plan.location === 'westeurope' &&
        group?.subscriptionId === 'sub-app';
      checks.metadata = !!group && !!plan && group.metadataLocation !== plan.location;
      checks.newApp = entries.some(
        (e) =>
          e.receipt.operation === 'CreateWebApp' &&
          e.receipt.outcome === 'accepted' &&
          e.receipt.addedIds.includes(app.id),
      );
      refs.push(app.id, app.planId, app.groupId);
      if (group) refs.push(group.subscriptionId);
      checks.scopeInspection =
        refs.every((id) => inspected('resource', id)) && inspected('policy', 'policy-web-location');
      for (const e of [rejected, accepted]) if (e) receipts.push(e.receipt.commandId);
      checks.receipts = receipts.length === 2 && receipts.every((id) => inspected('receipt', id));
      if (s.mode === 'independent') {
        const counterexample = entries.find(
          (e) =>
            e.receipt.operation === 'CreateVmBundle' &&
            e.receipt.outcome === 'accepted' &&
            infrastructure(w).some(
              (v) =>
                v.kind === 'vm' &&
                e.receipt.addedIds.includes(v.id) &&
                v.location !== 'westeurope' &&
                w.groups.find((g) => g.id === v.groupId)?.subscriptionId === 'sub-app',
            ),
        );
        checks.typeCounterexample =
          !!counterexample && inspected('receipt', counterexample.receipt.commandId);
        if (counterexample) receipts.push(counterexample.receipt.commandId);
      }
    }
  } else if (app?.type === types.app) {
    const plan = w.resources.find((p) => p.id === app.planId && p.type === types.plan);
    checks.subject = !!plan;
    const independent = s.mode === 'independent',
      environment = independent ? 'production' : 'staging';
    const updates = entries.filter(
      (e) =>
        e.receipt.outcome === 'accepted' &&
        e.request.command.type === 'SetAppSettings' &&
        e.request.command.appId === app.id,
    );
    const validDraftBefore = (entry: (typeof updates)[number]) =>
      s.drafts.some((d) => {
        const at = index(engine, d.through),
          before = at >= boundary && at <= end ? replayEngine(engine, at + 1) : null;
        const previous = before && appSettings(before.world).find((a) => a.appId === d.target);
        return (
          d.target === app.id &&
          d.environment === environment &&
          d.catalogMode === (independent ? 'standard' : 'read-only') &&
          !!before &&
          (d.through === null || at >= 0) &&
          (!previous ||
            previous.catalogMode !== d.catalogMode ||
            previous.environment !== d.environment) &&
          at < engine.ledger.indexOf(entry)
        );
      });
    const maintenance = updates.find(
      (e) =>
        e.request.command.type === 'SetAppSettings' &&
        e.request.command.environment === environment &&
        e.request.command.catalogMode === 'read-only' &&
        validDraftBefore(e),
    );
    const restored = independent
      ? updates.find(
          (e) =>
            e.request.command.environment === 'production' &&
            e.request.command.catalogMode === 'standard' &&
            validDraftBefore(e),
        )
      : maintenance &&
        updates.find(
          (e) =>
            engine.ledger.indexOf(e) > engine.ledger.indexOf(maintenance) &&
            e.request.command.type === 'SetAppSettings' &&
            e.request.command.environment === environment &&
            e.request.command.catalogMode === 'standard',
        );
    refs.push(app.id, app.planId, app.groupId);
    let siblingWrite: (typeof entries)[number] | undefined;
    const finalTarget = appSettings(w).some(
      (a) => a.appId === app.id && a.environment === environment && a.catalogMode === 'standard',
    );
    if (independent) {
      const sibling = w.resources.find(
        (r) =>
          r.type === types.app &&
          r.id !== app.id &&
          r.planId === app.planId &&
          appSettings(w).some(
            (a) => a.appId === r.id && a.environment === 'staging' && a.catalogMode === 'read-only',
          ) &&
          entries.some(
            (e) =>
              e.receipt.outcome === 'accepted' &&
              e.request.command.type === 'SetAppSettings' &&
              e.request.command.appId === r.id &&
              e.request.command.environment === 'staging' &&
              e.request.command.catalogMode === 'read-only',
          ),
      );
      if (sibling) {
        refs.push(sibling.id);
        siblingWrite = entries.findLast(
          (e) =>
            e.receipt.outcome === 'accepted' &&
            e.request.command.type === 'SetAppSettings' &&
            e.request.command.appId === sibling.id &&
            e.request.command.environment === 'staging' &&
            e.request.command.catalogMode === 'read-only',
        );
      }
      checks.production = !!restored && finalTarget;
      checks.staging = !!siblingWrite;
      checks.isolation = !!sibling && sibling.id !== app.id;
      checks.draft = !!restored && validDraftBefore(restored);
    } else {
      checks.maintenance = !!maintenance;
      checks.restoration = !!restored && finalTarget;
      checks.draft = !!maintenance && validDraftBefore(maintenance);
    }
    checks.attachments = refs.every((id) => inspected('resource', id));
    for (const e of independent ? [restored, siblingWrite] : [maintenance, restored])
      if (e) receipts.push(e.receipt.commandId);
    checks.receipts = receipts.length === 2 && receipts.every((id) => inspected('receipt', id));
    reused = !entries.some(
      (e) => e.receipt.outcome === 'accepted' && e.receipt.addedIds.includes(app.id),
    );
  } else checks.subject = false;
  checks.decision = s.answers.decision === missionAnswerIds(s).decision[0];
  checks.reason = s.answers.reason === missionAnswerIds(s).reason[0];
  return {
    ...empty,
    verifiable: true,
    checks,
    refs,
    receipts,
    complete: Object.values(checks).every(Boolean),
    world: w,
    chain,
    appId: app?.id ?? null,
    reused,
  };
}
