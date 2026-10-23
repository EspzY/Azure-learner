import { regions, validResourceGroupName, type Region } from '../simulation';

export const modelVersion = 'organization-web@1.0.0';
export const types = {
  group: 'Microsoft.Resources/resourceGroups',
  plan: 'Microsoft.Web/serverfarms',
  app: 'Microsoft.Web/sites',
} as const;
export interface Group {
  id: string;
  name: string;
  subscriptionId: string;
  metadataLocation: Region;
}
export interface Plan {
  id: string;
  type: typeof types.plan;
  name: string;
  groupId: string;
  location: Region;
  os: 'linux';
  profile: 'linux-learning-v1';
}
export interface WebApp {
  id: string;
  type: typeof types.app;
  name: string;
  groupId: string;
  planId: string;
  location: Region;
  os: 'linux';
}
export interface LocationPolicy {
  id: string;
  scopeId: string;
  mode: 'all';
  targetTypes: readonly string[];
  allowedLocations: readonly Region[];
}
export interface World {
  revision: number;
  nextId: number;
  identity: { id: string; name: string };
  scopes: {
    id: string;
    kind: 'root' | 'management' | 'subscription';
    name: string;
    parentId?: string;
    tenantId?: string;
  }[];
  groups: Group[];
  resources: (Plan | WebApp)[];
  policies: LocationPolicy[];
}
export const guidedFixture: World = {
  revision: 0,
  nextId: 1,
  identity: { id: 'tenant-lab', name: 'AzureLab Directory' },
  scopes: [
    { id: 'root-lab', kind: 'root', name: 'Tenant root group', tenantId: 'tenant-lab' },
    { id: 'mg-lab', kind: 'management', name: 'Learning', parentId: 'root-lab' },
    {
      id: 'sub-app',
      kind: 'subscription',
      name: 'App Sandbox',
      parentId: 'mg-lab',
      tenantId: 'tenant-lab',
    },
    {
      id: 'sub-shared',
      kind: 'subscription',
      name: 'Shared Sandbox',
      parentId: 'mg-lab',
      tenantId: 'tenant-lab',
    },
  ],
  groups: [],
  resources: [],
  policies: [
    {
      id: 'policy-web-location',
      scopeId: 'sub-app',
      mode: 'all',
      targetTypes: [types.plan, types.app],
      allowedLocations: ['westeurope'],
    },
  ],
};
export type Command =
  | { type: 'CreateGroup'; subscriptionId: string; name: string; metadataRegion: string }
  | { type: 'DeleteEmptyGroup'; groupId: string }
  | { type: 'CreatePlan'; groupId: string; name: string; region: string; profile: string }
  | { type: 'CreateWebApp'; groupId: string; name: string; planId: string };
type Scalar = string | number | boolean | null;
export interface Request {
  commandId: string;
  expectedWorldRevision: number;
  command: Record<string, Scalar>;
}
export type Outcome = 'accepted' | 'rejected' | 'unsupported';
export type Code =
  | 'created'
  | 'deleted'
  | 'invalid-envelope'
  | 'invalid-command'
  | 'invalid-name'
  | 'invalid-region'
  | 'invalid-parent'
  | 'duplicate-name'
  | 'missing-plan'
  | 'policy-location-denied'
  | 'unsupported-capability'
  | 'unsupported-field'
  | 'unsupported-profile'
  | 'cross-group-hosting'
  | 'cascade-delete-unsupported'
  | 'capacity'
  | 'stale-revision'
  | 'command-id-conflict'
  | 'history-limit';
export interface PolicyWitness {
  assignmentId: string;
  assignmentScope: string;
  targetType: string;
  requestedLocation: Region;
  allowedLocations: readonly Region[];
}
export interface Receipt {
  commandId: string;
  sequence: number;
  beforeRevision: number;
  afterRevision: number;
  operation: string;
  targetType: string;
  scopeId: string;
  location: Region | null;
  outcome: Outcome;
  code: Code;
  ruleId: string;
  addedIds: string[];
  removedIds: string[];
  beforeCount: number;
  afterCount: number;
  field?: string;
  policy?: PolicyWitness;
}
export interface Engine {
  world: World;
  ledger: { request: Request; receipt: Receipt }[];
}
export const freshEngine = (): Engine => ({ world: guidedFixture, ledger: [] });
export const ruleRegistry = {
  'input@1': ['S03', 'S05'],
  'group-name@1': ['S03'],
  'resource-name@1': ['S12'],
  'scope@1': ['S03', 'S04'],
  'uniqueness@1': ['S03'],
  'capacity@1': [],
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
} as const;
export function parseRequest(value: unknown): Request | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (
    Object.keys(item).some(
      (key) => !['commandId', 'expectedWorldRevision', 'command'].includes(key),
    ) ||
    typeof item.commandId !== 'string' ||
    !/^[a-zA-Z0-9_-]{1,64}$/.test(item.commandId) ||
    !Number.isSafeInteger(item.expectedWorldRevision) ||
    (item.expectedWorldRevision as number) < 0 ||
    !item.command ||
    typeof item.command !== 'object' ||
    Array.isArray(item.command)
  )
    return null;
  const command = item.command as Record<string, unknown>;
  if (
    Object.keys(command).length > 12 ||
    Object.keys(command).some((key) => key.length > 40) ||
    typeof command.type !== 'string' ||
    command.type.length > 64 ||
    Object.values(command).some(
      (v) =>
        !(
          v === null ||
          typeof v === 'boolean' ||
          (typeof v === 'number' && Number.isFinite(v)) ||
          (typeof v === 'string' && v.length <= 120)
        ),
    )
  )
    return null;
  return {
    commandId: item.commandId,
    expectedWorldRevision: item.expectedWorldRevision as number,
    command: { ...command } as Request['command'],
  };
}
const canonical = (request: Request) =>
  JSON.stringify([
    request.expectedWorldRevision,
    Object.entries(request.command).sort(([a], [b]) => a.localeCompare(b)),
  ]);
export const entityCount = (world: World) =>
  1 + world.scopes.length + world.groups.length + world.resources.length;
export function locationWitness(
  world: World,
  groupId: string,
  targetType: string,
  location: Region,
): PolicyWitness | undefined {
  const group = world.groups.find((item) => item.id === groupId);
  const policy = world.policies.find(
    (item) =>
      item.scopeId === group?.subscriptionId &&
      item.targetTypes.includes(targetType) &&
      !item.allowedLocations.includes(location),
  );
  return policy
    ? {
        assignmentId: policy.id,
        assignmentScope: policy.scopeId,
        targetType,
        requestedLocation: location,
        allowedLocations: policy.allowedLocations,
      }
    : undefined;
}
export function policyFindings(world: World) {
  return world.resources.flatMap((resource) => {
    const witness = locationWitness(world, resource.groupId, resource.type, resource.location);
    return witness ? [{ resourceId: resource.id, witness }] : [];
  });
}
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
  if (world.groups.length >= 3 || entityCount(world) >= 16)
    return reject(world, 'capacity', 'capacity@1');
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
  if (world.resources.some((resource) => resource.groupId === command.groupId))
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
  if (entityCount(world) >= 16) return reject(world, 'capacity', 'capacity@1');
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
  if (entityCount(world) >= 16) return reject(world, 'capacity', 'capacity@1');
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
// Registered bounded handlers, not a remote policy/command interpreter.
const handlers = {
  CreateGroup: createGroup,
  DeleteEmptyGroup: deleteGroup,
  CreatePlan: createPlan,
  CreateWebApp: createApp,
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
  else if (engine.ledger.length >= 500) decision = reject(world, 'history-limit', 'delivery@1');
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
      operation === 'CreatePlan'
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
  if (!request || old || engine.ledger.length >= 500) return { engine, receipt };
  return {
    engine: { world: decision.world, ledger: [...engine.ledger, { request, receipt }] },
    receipt,
  };
}
export type Relation = {
  kind: 'identity-authority' | 'management-parent' | 'resource-member' | 'depends-on';
  from: string;
  to: string;
};
export function relations(world: World): Relation[] {
  return [
    ...world.scopes.flatMap((scope): Relation[] => [
      ...(scope.parentId
        ? [{ kind: 'management-parent' as const, from: scope.id, to: scope.parentId }]
        : []),
      ...(scope.tenantId
        ? [{ kind: 'identity-authority' as const, from: scope.id, to: scope.tenantId }]
        : []),
    ]),
    ...world.groups.map((group): Relation => ({
      kind: 'management-parent',
      from: group.id,
      to: group.subscriptionId,
    })),
    ...world.resources.flatMap((resource): Relation[] => [
      { kind: 'resource-member', from: resource.id, to: resource.groupId },
      ...(resource.type === types.app
        ? [{ kind: 'depends-on' as const, from: resource.id, to: resource.planId }]
        : []),
    ]),
  ];
}
