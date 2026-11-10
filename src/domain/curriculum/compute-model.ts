/** Pure teaching models; no World, commands, runtime, price or health measurements. */
export const computeModelVersion = '1.0.0';
export const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
export const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export type Outcome = 0 | 1 | 2;
export interface ContainerInput {
  kind: 'container';
  platform: 'vm' | 'container' | 'functions';
  image: boolean;
  runtime: boolean;
  guestRequired: boolean;
  isolation: 'process' | 'hyperv';
  host: 'managed' | 'customer-vm';
  storage: 'ephemeral' | 'external';
  action: 'inspect' | 'recreate';
}
export const initialContainer: ContainerInput = {
  kind: 'container',
  platform: 'container',
  image: true,
  runtime: true,
  guestRequired: false,
  isolation: 'process',
  host: 'managed',
  storage: 'ephemeral',
  action: 'recreate',
};
export function validContainer(v: unknown): v is ContainerInput {
  return (
    object(v) &&
    keys(v, [
      'kind',
      'platform',
      'image',
      'runtime',
      'guestRequired',
      'isolation',
      'host',
      'storage',
      'action',
    ]) &&
    v.kind === 'container' &&
    ['vm', 'container', 'functions'].includes(v.platform as string) &&
    typeof v.image === 'boolean' &&
    typeof v.runtime === 'boolean' &&
    typeof v.guestRequired === 'boolean' &&
    ['process', 'hyperv'].includes(v.isolation as string) &&
    ['managed', 'customer-vm'].includes(v.host as string) &&
    ['ephemeral', 'external'].includes(v.storage as string) &&
    ['inspect', 'recreate'].includes(v.action as string)
  );
}
export function runContainer(raw: unknown) {
  if (!validContainer(raw)) return null;
  const i = raw,
    ownGuest = i.platform === 'vm',
    ownKernel = ownGuest || (i.platform === 'container' && i.isolation === 'hyperv');
  const compatible = !i.guestRequired || ownGuest;
  const created =
    compatible && i.runtime && (i.action === 'inspect' || i.platform === 'functions' || i.image);
  // A already held the report. Inspect does not fetch its image again;
  // recreate explicitly removes A first. Missing execution does not delete external data.
  const retained = i.storage === 'external' || i.action === 'inspect';
  return {
    input: i,
    ownGuest,
    ownKernel,
    hostResponsibility:
      i.platform === 'vm' || (i.platform === 'container' && i.host === 'customer-vm')
        ? 'customer'
        : 'provider',
    compatible,
    created,
    retained,
    instance: created ? (i.action === 'recreate' ? 'instance-B' : 'instance-A') : null,
    outcome: (!created ? 0 : retained ? 2 : 1) as Outcome,
  };
}
export type CapacityMode = 'single' | 'set' | 'vmss' | 'zones';
export interface CapacityInput {
  kind: 'capacity';
  mode: CapacityMode;
  count: number;
  demand: number;
  auto: boolean;
  failure: 'none' | 'instance' | 'fault' | 'update' | 'zone' | 'region' | 'data';
  target: number;
  routing: 'primary' | 'balanced';
  data: boolean;
}
export const initialCapacity: CapacityInput = {
  kind: 'capacity',
  mode: 'single',
  count: 1,
  demand: 20,
  auto: false,
  failure: 'none',
  target: 0,
  routing: 'balanced',
  data: true,
};
export function validCapacity(v: unknown): v is CapacityInput {
  return (
    object(v) &&
    keys(v, ['kind', 'mode', 'count', 'demand', 'auto', 'failure', 'target', 'routing', 'data']) &&
    v.kind === 'capacity' &&
    ['single', 'set', 'vmss', 'zones'].includes(v.mode as string) &&
    integer(v.count, 1, 6) &&
    (v.mode !== 'single' || v.count === 1) &&
    integer(v.demand, 0, 60) &&
    typeof v.auto === 'boolean' &&
    (!v.auto || v.mode === 'vmss') &&
    ['none', 'instance', 'fault', 'update', 'zone', 'region', 'data'].includes(
      v.failure as string,
    ) &&
    (v.failure !== 'update' || v.mode === 'set') &&
    integer(v.target, 0, 2) &&
    ['primary', 'balanced'].includes(v.routing as string) &&
    typeof v.data === 'boolean'
  );
}
export function runCapacity(raw: unknown) {
  if (!validCapacity(raw)) return null;
  const i = raw,
    count =
      i.mode === 'vmss' && i.auto ? Math.max(1, Math.min(6, Math.ceil(i.demand / 10))) : i.count;
  const instances = Array.from({ length: count }, (_, n) => {
    const site = i.mode === 'zones' ? n % 3 : 0,
      zone = i.mode === 'zones' ? n % 3 : null,
      fault = i.mode === 'single' ? 0 : n % 3,
      update = i.mode === 'set' ? n % 2 : null;
    const affected =
      i.failure === 'region' ||
      (i.failure === 'instance' && n === i.target) ||
      (i.failure === 'fault' && fault === i.target) ||
      (i.failure === 'update' && update === i.target) ||
      (i.failure === 'zone' && site === i.target);
    const routed = i.routing === 'balanced' || n === 0;
    return {
      id: n + 1,
      zone,
      site,
      fault,
      update,
      affected,
      routed,
      capacity: !affected && routed && i.data && i.failure !== 'data' ? 10 : 0,
    };
  });
  const surviving = instances.filter((x) => !x.affected).length,
    capacity = instances.reduce((n, x) => n + x.capacity, 0),
    served = Math.min(i.demand, capacity);
  return {
    input: i,
    count,
    instances,
    surviving,
    capacity,
    served,
    unmet: i.demand - served,
    outcome: (i.demand === 0 || served === i.demand ? 2 : served === 0 ? 0 : 1) as Outcome,
  };
}
export interface DesktopInput {
  kind: 'desktop';
  pool: 'personal' | 'pooled';
  publication: 'desktop' | 'remoteapp';
  session: 'single' | 'multi';
  linked: boolean;
  assigned: boolean;
  hosts: number;
}
export const initialDesktop: DesktopInput = {
  kind: 'desktop',
  pool: 'pooled',
  publication: 'remoteapp',
  session: 'multi',
  linked: true,
  assigned: true,
  hosts: 2,
};
export function validDesktop(v: unknown): v is DesktopInput {
  return (
    object(v) &&
    keys(v, ['kind', 'pool', 'publication', 'session', 'linked', 'assigned', 'hosts']) &&
    v.kind === 'desktop' &&
    ['personal', 'pooled'].includes(v.pool as string) &&
    ['desktop', 'remoteapp'].includes(v.publication as string) &&
    ['single', 'multi'].includes(v.session as string) &&
    typeof v.linked === 'boolean' &&
    typeof v.assigned === 'boolean' &&
    integer(v.hosts, 0, 4)
  );
}
export function runDesktop(raw: unknown) {
  if (!validDesktop(raw)) return null;
  const i = raw,
    compatible = i.pool === 'pooled' || (i.publication === 'desktop' && i.session === 'single'),
    published = compatible && i.linked && i.assigned,
    backed = published && i.hosts > 0;
  return {
    input: i,
    compatible,
    published,
    backed,
    outcome: (!published ? 0 : backed ? 2 : 1) as Outcome,
  };
}
export const hostingServices = [
  'vm',
  'app-service',
  'functions',
  'aci',
  'container-apps',
  'aks',
] as const;
export type HostingService = (typeof hostingServices)[number];
export const hostingWorkloads = [
  'web-code',
  'web-image',
  'cluster-api',
  'guest-driver',
  'event',
] as const;
export type HostingWorkload = (typeof hostingWorkloads)[number];
/** Requirements rather than a one-size-fits-all service ranking. */
export const hostingRequirements = {
  'web-code': { format: 'code', guest: false, kubernetes: false, event: false, minimalOps: true },
  'web-image': { format: 'image', guest: false, kubernetes: false, event: false, minimalOps: true },
  'cluster-api': {
    format: 'image',
    guest: false,
    kubernetes: true,
    event: false,
    minimalOps: false,
  },
  'guest-driver': {
    format: 'code',
    guest: true,
    kubernetes: false,
    event: false,
    minimalOps: false,
  },
  event: { format: 'function', guest: false, kubernetes: false, event: true, minimalOps: true },
} as const;
export const hostingCapabilities = {
  vm: {
    formats: ['code', 'image'],
    guest: true,
    kubernetes: false,
    event: false,
    minimalOps: false,
    reason: 'guest',
  },
  'app-service': {
    formats: ['code', 'image'],
    guest: false,
    kubernetes: false,
    event: false,
    minimalOps: true,
    reason: 'web',
  },
  functions: {
    formats: ['function'],
    guest: false,
    kubernetes: false,
    event: true,
    minimalOps: true,
    reason: 'event',
  },
  aci: {
    formats: ['image'],
    guest: false,
    kubernetes: false,
    event: false,
    minimalOps: true,
    reason: 'instance',
  },
  'container-apps': {
    formats: ['image'],
    guest: false,
    kubernetes: false,
    event: false,
    minimalOps: true,
    reason: 'managed-container',
  },
  aks: {
    formats: ['image'],
    guest: false,
    kubernetes: true,
    event: false,
    minimalOps: false,
    reason: 'kubernetes',
  },
} as const;
export const hostingReasons = [
  'guest',
  'web',
  'event',
  'instance',
  'managed-container',
  'kubernetes',
] as const;
export interface HostingInput {
  kind: 'hosting';
  workload: HostingWorkload;
  service: HostingService;
  reason: (typeof hostingReasons)[number];
}
export const initialHosting: HostingInput = {
  kind: 'hosting',
  workload: 'web-code',
  service: 'app-service',
  reason: 'web',
};
export function validHosting(v: unknown): v is HostingInput {
  return (
    object(v) &&
    keys(v, ['kind', 'workload', 'service', 'reason']) &&
    v.kind === 'hosting' &&
    hostingWorkloads.includes(v.workload as HostingWorkload) &&
    hostingServices.includes(v.service as HostingService) &&
    hostingReasons.includes(v.reason as HostingInput['reason'])
  );
}
export function hostingMismatch(workload: HostingWorkload, service: HostingService) {
  const r = hostingRequirements[workload];
  const c = hostingCapabilities[service];
  return [
    ...((c.formats as readonly string[]).includes(r.format) ? [] : (['format'] as const)),
    ...(r.guest && !c.guest ? (['guest'] as const) : []),
    ...(r.kubernetes && !c.kubernetes ? (['kubernetes'] as const) : []),
    ...(r.event && !c.event ? (['event'] as const) : []),
    ...(r.minimalOps && !c.minimalOps ? (['operations'] as const) : []),
    ...(workload === 'web-image' && service === 'aci' ? (['ingress'] as const) : []),
  ];
}
export function hostingCandidates(workload: HostingWorkload) {
  return hostingServices.filter((service) => hostingMismatch(workload, service).length === 0);
}
export function runHosting(raw: unknown) {
  if (!validHosting(raw)) return null;
  const i = raw,
    candidates = hostingCandidates(i.workload),
    decision = candidates.includes(i.service),
    reason = hostingCapabilities[i.service].reason === i.reason;
  return {
    input: i,
    candidates,
    decision,
    reason,
    outcome: (!decision ? 0 : reason ? 2 : 1) as Outcome,
  };
}
export type ComputeInput = ContainerInput | CapacityInput | DesktopInput | HostingInput;
export const validComputeInput = (v: unknown): v is ComputeInput =>
  validContainer(v) || validCapacity(v) || validDesktop(v) || validHosting(v);
export function runCompute(i: ComputeInput) {
  if (i.kind === 'container') return runContainer(i);
  if (i.kind === 'capacity') return runCapacity(i);
  if (i.kind === 'desktop') return runDesktop(i);
  return runHosting(i);
}
