import { regions, validResourceGroupName, type Region } from '../simulation';
import {
  types,
  parseRequest as parseLegacyRequest,
  locationWitness,
  guidedFixture,
  type World as BaseWorld,
  type Engine as BaseEngine,
  type Group,
  type Plan,
  type WebApp,
  type Code,
  type Outcome,
  type PolicyWitness,
  type Request,
  type Receipt,
  type Command as WebCommand,
} from '../chapter01/model';
export { types };
export type { Group, Plan, WebApp, Code, Outcome, PolicyWitness, Request, Receipt };
export const modelVersion = 'sandbox@2.0.0';
export const infrastructureTypes = {
  vm: 'Microsoft.Compute/virtualMachines',
  disk: 'Microsoft.Compute/disks',
  nic: 'Microsoft.Network/networkInterfaces',
  vnet: 'Microsoft.Network/virtualNetworks',
  subnet: 'Microsoft.Network/virtualNetworks/subnets',
} as const;
export type InfrastructureKind = keyof typeof infrastructureTypes;
interface ResourceBase {
  id: string;
  name: string;
  groupId: string;
  location: Region;
  origin: string;
}
export type Infrastructure = ResourceBase &
  (
    | {
        kind: 'vm';
        image: 'ubuntu-22-04' | 'windows-2022';
        profile: 'small' | 'standard';
        osDiskId: string;
        dataDiskId: string | null;
        nicId: string;
      }
    | { kind: 'disk'; role: 'os' | 'data'; gib: number }
    | { kind: 'nic'; subnetId: string }
    | { kind: 'vnet'; addressSpace: '10.42.0.0/16' }
    | { kind: 'subnet'; vnetId: string; addressPrefix: '10.42.1.0/24' }
  );
export interface AppSettings {
  appId: string;
  environment: 'development' | 'staging' | 'production';
  catalogMode: 'standard' | 'read-only';
}
export interface World extends BaseWorld {
  infrastructure: Infrastructure[];
  appSettings: AppSettings[];
}
export interface Engine extends BaseEngine {
  world: World;
  modelVersion: typeof modelVersion;
  prefix: number;
}
export type Command =
  | WebCommand
  | {
      type: 'CreateVmBundle';
      groupId: string;
      name: string;
      region: string;
      image: string;
      profile: string;
      dataDiskGiB: string;
      subnetId: string;
    }
  | { type: 'DeleteVmBundle'; vmId: string }
  | { type: 'SetAppSettings'; appId: string; environment: string; catalogMode: string };
export function continueEngine(base: BaseEngine): Engine {
  return {
    ...base,
    modelVersion,
    prefix: base.ledger.length,
    world: { ...base.world, infrastructure: [], appSettings: [] },
  };
}
export const freshEngine = () => continueEngine({ world: guidedFixture, ledger: [] });
export const infrastructure = (world: BaseWorld): Infrastructure[] =>
  (world as Partial<World>).infrastructure ?? [];
export const appSettings = (world: BaseWorld): AppSettings[] =>
  (world as Partial<World>).appSettings ?? [];
export function infrastructureRelations(world: BaseWorld) {
  type Kind =
    'resource-member' | 'disk-attachment' | 'nic-attachment' | 'subnet-member' | 'vnet-parent';
  return infrastructure(world).flatMap((r): { kind: Kind; from: string; to: string }[] => [
    { kind: 'resource-member', from: r.id, to: r.groupId },
    ...(r.kind === 'vm'
      ? [
          { kind: 'disk-attachment' as const, from: r.id, to: r.osDiskId },
          ...(r.dataDiskId
            ? [{ kind: 'disk-attachment' as const, from: r.id, to: r.dataDiskId }]
            : []),
          { kind: 'nic-attachment' as const, from: r.id, to: r.nicId },
        ]
      : []),
    ...(r.kind === 'nic' ? [{ kind: 'subnet-member' as const, from: r.id, to: r.subnetId }] : []),
    ...(r.kind === 'subnet' ? [{ kind: 'vnet-parent' as const, from: r.id, to: r.vnetId }] : []),
  ]);
}
export const ruleRegistry = {
  'vm-profile@2': ['S321-VM', 'S321-NIC', 'S321-DISK'],
  'vm-dependency@2': ['S321-NIC', 'S321-DISK'],
  'app-settings@2': ['S321-APPSETTINGS'],
  'input@1': ['S03', 'S05'],
  'group-name@1': ['S03'],
  'resource-name@1': ['S12'],
  'scope@1': ['S03', 'S04'],
  'uniqueness@1': ['S03'],
  'capacity@2': [],
  'web-profile@1': ['S12'],
  'hosting-dependency@1': ['S12'],
  'web-plan-location@1': ['S12'],
  'allowed-web-location@1': ['S07', 'S38'],
  'delivery@1': [],
  'supported-operation@1': [],
} as const;
const supportedFields = {
  CreateGroup: ['type', 'subscriptionId', 'name', 'metadataRegion'],
  DeleteEmptyGroup: ['type', 'groupId'],
  CreatePlan: ['type', 'groupId', 'name', 'region', 'profile'],
  CreateWebApp: ['type', 'groupId', 'name', 'planId'],
  CreateVmBundle: [
    'type',
    'groupId',
    'name',
    'region',
    'image',
    'profile',
    'dataDiskGiB',
    'subnetId',
  ],
  DeleteVmBundle: ['type', 'vmId'],
  SetAppSettings: ['type', 'appId', 'environment', 'catalogMode'],
} as const;
export const parseRequest = parseLegacyRequest;
const canonical = (request: Request) =>
  JSON.stringify([
    request.expectedWorldRevision,
    Object.entries(request.command).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  ]);
export const entityCount = (world: World) =>
  1 +
  world.scopes.length +
  world.groups.length +
  world.resources.length +
  world.infrastructure.length;
type Decision = {
  world: World;
  code: Code;
  ruleId: keyof typeof ruleRegistry;
  outcome: Outcome;
  addedIds?: string[];
  removedIds?: string[];
  policy?: PolicyWitness;
  field?: string;
  location?: Region;
};
const reject = (
  world: World,
  code: Code,
  ruleId: Decision['ruleId'],
  field?: string,
  outcome: Outcome = 'rejected',
): Decision => ({ world, code, ruleId, field, outcome });
function createGroup(world: World, command: Extract<Command, { type: 'CreateGroup' }>): Decision {
  const name = command.name.trim();
  if (!validResourceGroupName(name)) return reject(world, 'invalid-name', 'group-name@1', 'name');
  if (!regions.includes(command.metadataRegion as Region))
    return reject(world, 'invalid-region', 'input@1', 'metadataRegion');
  if (
    !world.scopes.some(
      (scope) => scope.id === command.subscriptionId && scope.kind === 'subscription',
    )
  )
    return reject(world, 'invalid-parent', 'scope@1', 'subscriptionId');
  if (
    world.groups.some(
      (group) =>
        group.subscriptionId === command.subscriptionId &&
        group.name.toLowerCase() === name.toLowerCase(),
    )
  )
    return reject(world, 'duplicate-name', 'uniqueness@1', 'name');
  if (world.groups.length >= 8 || entityCount(world) >= 96)
    return reject(world, 'capacity', 'capacity@2');
  const group: Group = {
    id: `group-${world.nextId}`,
    name,
    subscriptionId: command.subscriptionId,
    metadataLocation: command.metadataRegion as Region,
  };
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      nextId: world.nextId + 1,
      groups: [...world.groups, group],
    },
    code: 'created',
    ruleId: 'scope@1',
    outcome: 'accepted',
    addedIds: [group.id],
    location: group.metadataLocation,
  };
}
function deleteGroup(
  world: World,
  command: Extract<Command, { type: 'DeleteEmptyGroup' }>,
): Decision {
  if (!world.groups.some((group) => group.id === command.groupId))
    return reject(world, 'invalid-parent', 'scope@1', 'groupId');
  if (
    world.resources.some((resource) => resource.groupId === command.groupId) ||
    world.infrastructure.some((resource) => resource.groupId === command.groupId)
  )
    return reject(
      world,
      'cascade-delete-unsupported',
      'supported-operation@1',
      undefined,
      'unsupported',
    );
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      groups: world.groups.filter((group) => group.id !== command.groupId),
    },
    code: 'deleted',
    ruleId: 'scope@1',
    outcome: 'accepted',
    removedIds: [command.groupId],
  };
}
function webInput(
  world: World,
  command: Extract<Command, { type: 'CreatePlan' | 'CreateWebApp' }>,
): Decision | undefined {
  if (!world.groups.some((group) => group.id === command.groupId))
    return reject(world, 'invalid-parent', 'scope@1', 'groupId');
  if (!/^[a-z][a-z0-9-]{2,39}$/.test(command.name))
    return reject(world, 'invalid-name', 'resource-name@1', 'name');
  const type = command.type === 'CreatePlan' ? types.plan : types.app;
  if (
    world.resources.some(
      (resource) =>
        resource.groupId === command.groupId &&
        resource.type === type &&
        resource.name === command.name,
    )
  )
    return reject(world, 'duplicate-name', 'uniqueness@1', 'name');
}
function createPlan(world: World, command: Extract<Command, { type: 'CreatePlan' }>): Decision {
  const invalid = webInput(world, command);
  if (invalid) return invalid;
  if (!regions.includes(command.region as Region))
    return reject(world, 'invalid-region', 'input@1', 'region');
  if (command.profile !== 'linux-learning-v1')
    return reject(world, 'unsupported-profile', 'web-profile@1', 'profile', 'unsupported');
  const location = command.region as Region;
  const policy = locationWitness(world, command.groupId, types.plan, location);
  if (policy)
    return {
      ...reject(world, 'policy-location-denied', 'allowed-web-location@1', 'region'),
      policy,
      location,
    };
  if (entityCount(world) >= 96) return reject(world, 'capacity', 'capacity@2');
  const plan: Plan = {
    id: `plan-${world.nextId}`,
    type: types.plan,
    name: command.name,
    groupId: command.groupId,
    location,
    os: 'linux',
    profile: 'linux-learning-v1',
  };
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      nextId: world.nextId + 1,
      resources: [...world.resources, plan],
    },
    code: 'created',
    ruleId: 'web-profile@1',
    outcome: 'accepted',
    addedIds: [plan.id],
    location,
  };
}
function createApp(world: World, command: Extract<Command, { type: 'CreateWebApp' }>): Decision {
  const invalid = webInput(world, command);
  if (invalid) return invalid;
  const plan = world.resources.find(
    (resource): resource is Plan => resource.id === command.planId && resource.type === types.plan,
  );
  if (!plan) return reject(world, 'missing-plan', 'hosting-dependency@1', 'planId');
  if (plan.groupId !== command.groupId)
    return reject(world, 'cross-group-hosting', 'hosting-dependency@1', 'planId', 'unsupported');
  const policy = locationWitness(world, command.groupId, types.app, plan.location);
  if (policy)
    return {
      ...reject(world, 'policy-location-denied', 'allowed-web-location@1', 'planId'),
      policy,
      location: plan.location,
    };
  if (entityCount(world) >= 96) return reject(world, 'capacity', 'capacity@2');
  const app: WebApp = {
    id: `app-${world.nextId}`,
    type: types.app,
    name: command.name,
    groupId: command.groupId,
    planId: plan.id,
    location: plan.location,
    os: plan.os,
  };
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      nextId: world.nextId + 1,
      resources: [...world.resources, app],
    },
    code: 'created',
    ruleId: 'web-plan-location@1',
    outcome: 'accepted',
    addedIds: [app.id],
    location: app.location,
  };
}
function createVm(world: World, c: Extract<Command, { type: 'CreateVmBundle' }>): Decision {
  const group = world.groups.find((g) => g.id === c.groupId);
  if (!group) return reject(world, 'invalid-parent', 'scope@1', 'groupId');
  if (!/^[a-z][a-z0-9-]{1,13}[a-z0-9]$/.test(c.name))
    return reject(world, 'invalid-name', 'vm-profile@2', 'name');
  if (!regions.includes(c.region as Region))
    return reject(world, 'invalid-region', 'vm-profile@2', 'region');
  if (!['ubuntu-22-04', 'windows-2022'].includes(c.image))
    return reject(world, 'unsupported-profile', 'vm-profile@2', 'image', 'unsupported');
  if (!['small', 'standard'].includes(c.profile))
    return reject(world, 'unsupported-profile', 'vm-profile@2', 'profile', 'unsupported');
  if (!['0', '32', '64'].includes(c.dataDiskGiB))
    return reject(world, 'unsupported-profile', 'vm-profile@2', 'dataDiskGiB', 'unsupported');
  if (
    world.infrastructure.some(
      (r) => r.kind === 'vm' && r.groupId === c.groupId && r.name === c.name,
    )
  )
    return reject(world, 'duplicate-name', 'uniqueness@1', 'name');
  const subnet = world.infrastructure.find((r) => r.id === c.subnetId && r.kind === 'subnet');
  if (c.subnetId && !subnet) return reject(world, 'invalid-parent', 'vm-dependency@2', 'subnetId');
  if (
    subnet &&
    world.groups.find((g) => g.id === subnet.groupId)?.subscriptionId !== group.subscriptionId
  )
    return reject(world, 'invalid-parent', 'vm-dependency@2', 'subnetId');
  if (subnet && subnet.location !== c.region)
    return reject(world, 'invalid-region', 'vm-dependency@2', 'subnetId');
  if (subnet && subnet.groupId !== c.groupId)
    return reject(world, 'unsupported-capability', 'vm-dependency@2', 'subnetId', 'unsupported');
  const count = (subnet ? 3 : 5) + (c.dataDiskGiB === '0' ? 0 : 1);
  if (
    entityCount(world) + count > 96 ||
    world.infrastructure.filter((r) => r.kind === 'vm').length >= 8
  )
    return reject(world, 'capacity', 'capacity@2');
  let next = world.nextId;
  const vmId = `vm-${next++}`,
    osId = `disk-${next++}`,
    nicId = `nic-${next++}`;
  const vnetId = subnet ? '' : `vnet-${next++}`,
    subnetId = subnet?.id ?? `subnet-${next++}`;
  const dataId = c.dataDiskGiB === '0' ? null : `disk-${next++}`;
  const common = { groupId: c.groupId, location: c.region as Region, origin: vmId };
  const created: Infrastructure[] = [
    {
      ...common,
      id: vmId,
      name: c.name,
      kind: 'vm',
      image: c.image as 'ubuntu-22-04' | 'windows-2022',
      profile: c.profile as 'small' | 'standard',
      osDiskId: osId,
      dataDiskId: dataId,
      nicId,
    },
    {
      ...common,
      id: osId,
      name: `${c.name}-os`,
      kind: 'disk',
      role: 'os',
      gib: c.image === 'windows-2022' ? 128 : 64,
    },
    { ...common, id: nicId, name: `${c.name}-nic`, kind: 'nic', subnetId },
    ...(subnet
      ? []
      : [
          {
            ...common,
            id: vnetId,
            name: `${c.name}-vnet`,
            kind: 'vnet' as const,
            addressSpace: '10.42.0.0/16' as const,
          },
          {
            ...common,
            id: subnetId,
            name: `${c.name}-subnet`,
            kind: 'subnet' as const,
            vnetId,
            addressPrefix: '10.42.1.0/24' as const,
          },
        ]),
    ...(dataId
      ? [
          {
            ...common,
            id: dataId,
            name: `${c.name}-data`,
            kind: 'disk' as const,
            role: 'data' as const,
            gib: Number(c.dataDiskGiB),
          },
        ]
      : []),
  ];
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      nextId: next,
      infrastructure: [...world.infrastructure, ...created],
    },
    code: 'created',
    ruleId: 'vm-profile@2',
    outcome: 'accepted',
    addedIds: created.map((r) => r.id),
    location: c.region as Region,
  };
}
function deleteVm(world: World, c: Extract<Command, { type: 'DeleteVmBundle' }>): Decision {
  const vm = world.infrastructure.find((r) => r.id === c.vmId && r.kind === 'vm');
  if (!vm) return reject(world, 'invalid-parent', 'vm-dependency@2', 'vmId');
  const remove = new Set(
    world.infrastructure
      .filter((r) => r.origin === vm.id && r.kind !== 'vnet' && r.kind !== 'subnet')
      .map((r) => r.id),
  );
  for (const r of world.infrastructure.filter((r) => r.origin === vm.id && r.kind === 'subnet'))
    if (
      !world.infrastructure.some(
        (n) => n.kind === 'nic' && n.subnetId === r.id && !remove.has(n.id),
      )
    )
      remove.add(r.id);
  for (const r of world.infrastructure.filter((r) => r.origin === vm.id && r.kind === 'vnet'))
    if (
      !world.infrastructure.some(
        (n) => n.kind === 'subnet' && n.vnetId === r.id && !remove.has(n.id),
      )
    )
      remove.add(r.id);
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      infrastructure: world.infrastructure.filter((r) => !remove.has(r.id)),
    },
    code: 'deleted',
    ruleId: 'vm-dependency@2',
    outcome: 'accepted',
    removedIds: [...remove],
  };
}
function setSettings(world: World, c: Extract<Command, { type: 'SetAppSettings' }>): Decision {
  const app = world.resources.find((r) => r.id === c.appId && r.type === types.app);
  if (
    !app ||
    app.type !== types.app ||
    !world.resources.some((r) => r.id === app.planId && r.type === types.plan)
  )
    return reject(world, 'invalid-parent', 'hosting-dependency@1', 'appId');
  if (
    !['development', 'staging', 'production'].includes(c.environment) ||
    !['standard', 'read-only'].includes(c.catalogMode)
  )
    return reject(world, 'unsupported-profile', 'app-settings@2', 'settings', 'unsupported');
  const settings = {
    appId: app.id,
    environment: c.environment,
    catalogMode: c.catalogMode,
  } as AppSettings;
  return {
    world: {
      ...world,
      revision: world.revision + 1,
      appSettings: [...world.appSettings.filter((s) => s.appId !== app.id), settings],
    },
    code: 'updated',
    ruleId: 'app-settings@2',
    outcome: 'accepted',
    location: app.location,
  };
}
// Registered bounded handlers, not a remote policy/command interpreter.
const handlers = {
  CreateGroup: createGroup,
  DeleteEmptyGroup: deleteGroup,
  CreatePlan: createPlan,
  CreateWebApp: createApp,
  CreateVmBundle: createVm,
  DeleteVmBundle: deleteVm,
  SetAppSettings: setSettings,
};
export function execute(engine: Engine, raw: unknown): { engine: Engine; receipt: Receipt } {
  const request = parseRequest(raw);
  const world = engine.world;
  const command = request?.command;
  const operation = typeof command?.type === 'string' ? command.type : 'unknown';
  const old =
    request && engine.ledger.find((entry) => entry.request.commandId === request.commandId);
  if (old && canonical(old.request) === canonical(request!))
    return { engine, receipt: old.receipt };
  let decision: Decision;
  if (!request) decision = reject(world, 'invalid-envelope', 'input@1');
  else if (old) decision = reject(world, 'command-id-conflict', 'delivery@1');
  else if (engine.ledger.length >= 900) decision = reject(world, 'history-limit', 'delivery@1');
  else if (request.expectedWorldRevision !== world.revision)
    decision = reject(world, 'stale-revision', 'delivery@1');
  else if (!Object.hasOwn(supportedFields, operation))
    decision = reject(
      world,
      'unsupported-capability',
      'supported-operation@1',
      undefined,
      'unsupported',
    );
  else {
    const fields = supportedFields[operation as Command['type']];
    if (Object.keys(command!).some((key) => !(fields as readonly string[]).includes(key)))
      decision = reject(world, 'unsupported-field', 'input@1', undefined, 'unsupported');
    else if (fields.some((key) => typeof command![key] !== 'string'))
      decision = reject(world, 'invalid-command', 'input@1');
    else {
      const handler = handlers[operation as Command['type']] as (
        world: World,
        command: Command,
      ) => Decision;
      decision = handler(world, command as unknown as Command);
    }
  }
  const receipt: Receipt = {
    commandId: request?.commandId ?? 'invalid',
    sequence: engine.ledger.length + 1,
    beforeRevision: world.revision,
    afterRevision: decision.world.revision,
    operation,
    targetType:
      operation === 'CreateVmBundle' || operation === 'DeleteVmBundle'
        ? infrastructureTypes.vm
        : operation === 'SetAppSettings'
          ? types.app
          : operation === 'CreatePlan'
            ? types.plan
            : operation === 'CreateWebApp'
              ? types.app
              : operation === 'CreateGroup' || operation === 'DeleteEmptyGroup'
                ? types.group
                : 'unsupported',
    scopeId:
      typeof command?.subscriptionId === 'string'
        ? command.subscriptionId
        : typeof command?.groupId === 'string'
          ? command.groupId
          : typeof command?.appId === 'string'
            ? (world.resources.find((r) => r.id === command.appId)?.groupId ?? '')
            : typeof command?.vmId === 'string'
              ? (world.infrastructure.find((r) => r.id === command.vmId)?.groupId ?? '')
              : '',
    location:
      decision.location ??
      (typeof command?.region === 'string' && regions.includes(command.region as Region)
        ? (command.region as Region)
        : null),
    outcome: decision.outcome,
    code: decision.code,
    ruleId: decision.ruleId,
    addedIds: decision.addedIds ?? [],
    removedIds: decision.removedIds ?? [],
    beforeCount: entityCount(world),
    afterCount: entityCount(decision.world),
    ...(decision.field ? { field: decision.field } : {}),
    ...(decision.policy ? { policy: decision.policy } : {}),
  };
  if (!request || old || engine.ledger.length >= 900) return { engine, receipt };
  return {
    engine: { ...engine, world: decision.world, ledger: [...engine.ledger, { request, receipt }] },
    receipt,
  };
}
