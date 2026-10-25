import { types, type Engine as BaseEngine } from '../chapter01/model';
import { appSettings, infrastructure } from './model';
import { replayEngine } from './replay';
import { replaySaas, userIds, type SaasEngine } from './saas';
export const practicalKey = 'azurelab.practical-labs.v1';
export const labKinds = ['vm', 'paas', 'saas'] as const;
export type LabKind = (typeof labKinds)[number];
export const labDefinitions = {
  vm: {
    id: 'iaas-vm@1',
    objectives: ['ST01', 'ST04'],
    model: 'sandbox@2.0.0',
    rubric: 'vm-transfer@1',
    sources: ['S321-VM', 'S321-LINUX', 'S321-NIC', 'S321-DISK', 'S321-NAME'],
    supported: ['CreateVmBundle', 'DeleteVmBundle'],
    unavailable: ['guest-execution', 'remote-login', 'network-traffic', 'pricing'],
  },
  paas: {
    id: 'paas-settings@1',
    objectives: ['ST02', 'ST04'],
    model: 'sandbox@2.0.0',
    rubric: 'paas-config-transfer@1',
    sources: ['S12', 'S38', 'S321-APPSETTINGS', 'S321-PLAN', 'S321-PATCH'],
    supported: ['CreateGroup', 'CreatePlan', 'CreateWebApp', 'SetAppSettings'],
    unavailable: ['code-deployment', 'runtime-health', 'restart-execution'],
  },
  saas: {
    id: 'saas-administration@1',
    objectives: ['ST03', 'ST04'],
    model: 'fictional-admin@1',
    rubric: 'saas-departure-transfer@1',
    sources: ['S321-USERS', 'S321-ROLES', 'S321-DEPARTURE'],
    supported: ['SetLicense', 'SetRole', 'SetBlocked', 'SetSharing', 'ReviewDepartureData'],
    unavailable: ['authentication', 'invitation', 'billing', 'session-revocation'],
  },
} as const;
export interface Origin {
  module: 'services' | 'benefits';
  topic: string;
}
export interface Session {
  id: number;
  kind: LabKind;
  mode: 'guided' | 'independent';
  origin: Origin;
  attempt: number;
  boundary: string | null;
  inspected: string[];
  reason: string | null;
  aided: boolean;
  through: string | null;
  status: 'active' | 'submitted' | 'abandoned';
}
export type PracticalEvent =
  | {
      type: 'start';
      kind: LabKind;
      mode: Session['mode'];
      origin: Origin;
      attempt: number;
      boundary: string | null;
    }
  | { type: 'inspect'; id: string }
  | { type: 'resume'; id: number }
  | { type: 'reason'; value: string }
  | { type: 'aid' }
  | { type: 'submit'; through: string }
  | { type: 'abandon' };
export interface PracticalSave {
  schema: 1;
  content: 'practical-labs@1';
  events: PracticalEvent[];
}
export const freshPractical = (): PracticalSave => ({
  schema: 1,
  content: 'practical-labs@1',
  events: [],
});
const id = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(v);
const topics = {
  services: ['iaas', 'paas', 'saas', 'practice', 'selection'],
  benefits: ['availability', 'reliability', 'governance', 'management', 'sustainability'],
};
export const validOrigin = (o: Origin) =>
  o &&
  Object.keys(o).sort().join(',') === 'module,topic' &&
  Object.hasOwn(topics, o.module) &&
  topics[o.module].includes(o.topic);
export function practicalFacts(save: PracticalSave) {
  const sessions: Session[] = [];
  let selected = 0;
  for (const e of save.events) {
    const s = sessions.find((s) => s.id === selected);
    if (e.type === 'start') {
      sessions.push({
        ...e,
        id: sessions.length + 1,
        inspected: [],
        reason: null,
        aided: false,
        through: null,
        status: 'active',
      });
      selected = sessions.length;
    } else if (e.type === 'resume') selected = e.id;
    else if (s && s.status === 'active') {
      if (e.type === 'inspect') s.inspected = [...new Set([...s.inspected, e.id])];
      if (e.type === 'reason') s.reason = e.value;
      if (e.type === 'aid') s.aided = true;
      if (e.type === 'submit') {
        s.through = e.through;
        s.status = 'submitted';
      }
      if (e.type === 'abandon') s.status = 'abandoned';
    }
  }
  return {
    sessions,
    current: sessions.find((s) => s.id === selected) ?? null,
    activeIndependent: sessions.some((s) => s.status === 'active' && s.mode === 'independent'),
  };
}
export function applyPractical(save: PracticalSave, raw: unknown): PracticalSave | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || save.events.length >= 400)
    return null;
  const e = raw as PracticalEvent,
    s = practicalFacts(save).current;
  const exact = (keys: string) => Object.keys(e).sort().join(',') === keys;
  if (e.type === 'resume') {
    const facts = practicalFacts(save);
    if (
      !exact('id,type') ||
      !Number.isSafeInteger(e.id) ||
      !facts.sessions.some((s) => s.id === e.id) ||
      (facts.activeIndependent && s?.id !== e.id)
    )
      return null;
  } else if (e.type === 'start') {
    if (
      !exact('attempt,boundary,kind,mode,origin,type') ||
      !labKinds.includes(e.kind) ||
      !['guided', 'independent'].includes(e.mode) ||
      !validOrigin(e.origin) ||
      !Number.isSafeInteger(e.attempt) ||
      e.attempt < 1 ||
      e.attempt > 100000 ||
      !(e.boundary === null || id(e.boundary)) ||
      (s?.status === 'active' && s.mode === 'independent')
    )
      return null;
  } else {
    if (!s || s.status !== 'active') return null;
    if (e.type === 'inspect') {
      if (!exact('id,type') || !id(e.id)) return null;
    } else if (e.type === 'reason') {
      if (
        !exact('type,value') ||
        ![
          'customer-os',
          'cloud-handles-all',
          'customer-code',
          'provider-code',
          'retained-access',
          'license-is-admin',
        ].includes(e.value)
      )
        return null;
    } else if (e.type === 'submit') {
      if (!exact('through,type') || !id(e.through)) return null;
    } else if (e.type === 'aid' || e.type === 'abandon') {
      if (!exact('type')) return null;
      if (e.type === 'aid' && s.aided) return save;
    } else return null;
  }
  return { ...save, events: [...save.events, e] };
}
export function restorePractical(raw: string | null) {
  if (raw === null) return freshPractical();
  if (raw.length > 160000) throw Error('corrupt');
  const v = JSON.parse(raw) as PracticalSave;
  if (!v || v.schema !== 1 || v.content !== 'practical-labs@1') throw Error('unsupported');
  if (
    Object.keys(v).sort().join(',') !== 'content,events,schema' ||
    !Array.isArray(v.events) ||
    v.events.length > 400
  )
    throw Error('corrupt');
  let s = freshPractical();
  for (const e of v.events) {
    const next = applyPractical(s, e);
    if (!next) throw Error('corrupt');
    s = next;
  }
  return s;
}
export function practicalHref(s: Session, engine?: BaseEngine) {
  if (s.kind === 'saas') return '/labs/saas';
  let prerequisite = false;
  if (s.kind === 'paas' && s.mode === 'guided' && engine) {
    const boundary =
      s.boundary === null ? -1 : engine.ledger.findIndex((e) => e.request.commandId === s.boundary);
    const atStart = replayEngine(engine, boundary + 1);
    prerequisite = !!atStart && !atStart.world.resources.some((r) => r.type === types.app);
  }
  return `/portal?area=home&practice=${s.kind}${prerequisite ? '&lab=web-platform' : ''}`;
}
export function practicalReturn(s: Session) {
  return `/learn/${s.origin.module}?topic=${s.origin.topic}&activity=practical${s.origin.module === 'services' ? '&version=2' : ''}`;
}
export function evaluatePractical(
  s: Session | null,
  technical: BaseEngine,
  technicalAttempt: number,
  saas: SaasEngine,
  saasAttempt: number,
) {
  const empty = {
    verifiable: false,
    configured: false,
    inspected: false,
    reason: false,
    complete: false,
    ids: [] as string[],
    details: {} as Record<string, string>,
    criteria: {} as Record<string, boolean>,
  };
  if (!s || s.status === 'abandoned') return empty;
  const independent = s.mode === 'independent';
  const source = s.kind === 'saas' ? saas.ledger : technical.ledger;
  const boundary =
    s.boundary === null ? -1 : source.findIndex((e) => e.request.commandId === s.boundary);
  const end =
    s.through === null
      ? source.length - 1
      : source.findIndex((e) => e.request.commandId === s.through);
  if (
    s.attempt !== (s.kind === 'saas' ? saasAttempt : technicalAttempt) ||
    (s.boundary !== null && boundary < 0) ||
    end < boundary ||
    (s.through !== null && end < 0)
  )
    return empty;
  const entries = source.slice(boundary + 1, end + 1),
    changed = new Set(
      entries
        .filter((e) => e.receipt.outcome === 'accepted')
        .flatMap((e) => ('addedIds' in e.receipt ? e.receipt.addedIds : [e.receipt.subject])),
    );
  const ids: string[] = [];
  const details: Record<string, string> = {};
  const criteria: Record<string, boolean> = {};
  if (s.kind === 'saas') {
    const saasEntries = saas.ledger.slice(boundary + 1, end + 1);
    const replay = replaySaas(saas, end + 1);
    if (!replay) return empty;
    const departing = independent ? 'leo' : 'mina',
      u = replay.state.accounts.find((u) => u.id === departing)!;
    const performed = (action: string) =>
      saasEntries.some(
        (e) =>
          e.receipt.outcome === 'accepted' &&
          e.receipt.action === action &&
          e.receipt.subject === departing,
      );
    criteria.blocked = u.blocked && (!independent || performed('SetBlocked'));
    criteria.role = u.role === 'member' && (!independent || performed('SetRole'));
    criteria.license = !u.licensed && (!independent || performed('SetLicense'));
    criteria.sharing =
      replay.state.sharing === 'team' &&
      (!independent ||
        saasEntries.some(
          (e) => e.receipt.action === 'SetSharing' && e.receipt.outcome === 'accepted',
        ));
    criteria.dataReview = u.dataReviewed && (!independent || performed('ReviewDepartureData'));
    if (!independent) {
      criteria.seatRejection = saasEntries.some((e) => e.receipt.reason === 'seats-full');
      criteria.newLicense = replay.state.accounts.find((u) => u.id === 'erin')!.licensed;
    }
    ids.push(departing);
    Object.assign(details, {
      account: departing,
      role: u.role,
      licensed: String(u.licensed),
      blocked: String(u.blocked),
      sharing: replay.state.sharing,
    });
  } else {
    const replay = replayEngine(technical, end + 1);
    if (!replay) return empty;
    const w = replay.world;
    if (s.kind === 'vm') {
      const vm = infrastructure(w).find(
        (r) =>
          r.kind === 'vm' &&
          changed.has(r.id) &&
          (!independent ||
            (r.image === 'windows-2022' &&
              r.profile === 'standard' &&
              w.groups.find((g) => g.id === r.groupId)?.subscriptionId === 'sub-shared' &&
              infrastructure(w).some(
                (d) => d.id === r.dataDiskId && d.kind === 'disk' && d.gib === 64,
              ))),
      );
      criteria.vm = !!vm;
      if (vm?.kind === 'vm') {
        criteria.os = infrastructure(w).some(
          (d) => d.id === vm.osDiskId && d.kind === 'disk' && d.role === 'os',
        );
        criteria.nic = infrastructure(w).some(
          (n) =>
            n.id === vm.nicId &&
            n.kind === 'nic' &&
            infrastructure(w).some((sub) => sub.id === n.subnetId && sub.kind === 'subnet'),
        );
        ids.push(vm.id, vm.osDiskId, vm.nicId);
        Object.assign(details, {
          resource: vm.name,
          image: vm.image,
          profile: vm.profile,
          resourceLocation: vm.location,
          group: w.groups.find((g) => g.id === vm.groupId)?.name ?? '',
          metadataLocation: w.groups.find((g) => g.id === vm.groupId)?.metadataLocation ?? '',
        });
      }
    } else {
      const candidates = appSettings(w).filter(
        (a) =>
          a.environment === (independent ? 'production' : 'staging') &&
          a.catalogMode === 'read-only' &&
          entries.some(
            (e) =>
              e.request.command.type === 'SetAppSettings' &&
              e.request.command.appId === a.appId &&
              e.receipt.outcome === 'accepted',
          ),
      );
      const settings =
        candidates.find(
          (s) =>
            !independent ||
            w.resources.some(
              (a) =>
                a.id === s.appId &&
                a.type === types.app &&
                changed.has(a.id) &&
                changed.has(a.planId),
            ),
        ) ?? candidates[0];
      const app = settings
        ? w.resources.find((a) => a.id === settings.appId && a.type === types.app)
        : w.resources.find((a) => a.type === types.app && (!independent || changed.has(a.id)));
      criteria.settings = !!settings;
      criteria.hosting =
        !!app &&
        app.type === types.app &&
        w.resources.some((p) => p.id === app.planId && p.type === types.plan);
      if (independent) {
        criteria.newPlan = !!app && app.type === types.app && changed.has(app.planId);
        criteria.newApp = !!app && changed.has(app.id);
      }
      if (app && app.type === types.app) {
        ids.push(app.id);
        Object.assign(details, {
          resource: app.name,
          plan: w.resources.find((p) => p.id === app.planId)?.name ?? '',
          resourceLocation: app.location,
          environment: settings?.environment ?? '',
          catalogMode: settings?.catalogMode ?? '',
        });
      }
    }
  }
  const configured = Object.keys(criteria).length > 0 && Object.values(criteria).every(Boolean);
  const inspected = ids.length > 0 && ids.every((id) => s.inspected.includes(id));
  const reason =
    s.reason ===
    (s.kind === 'vm' ? 'customer-os' : s.kind === 'paas' ? 'customer-code' : 'retained-access');
  return {
    verifiable: true,
    configured,
    inspected,
    reason,
    complete: configured && inspected && reason,
    ids,
    criteria,
    details,
  };
}
export const fictionalUsers = userIds;

export function saasGuideStep(criteria: Record<string, boolean>, inspected: boolean) {
  for (const [criterion, step] of [
    ['seatRejection', 'capacity'],
    ['license', 'release'],
    ['newLicense', 'assign'],
    ['blocked', 'block'],
    ['role', 'role'],
    ['sharing', 'sharing'],
    ['dataReview', 'data'],
  ] as const)
    if (!criteria[criterion]) return step;
  return inspected ? 'reflect' : 'inspect';
}
