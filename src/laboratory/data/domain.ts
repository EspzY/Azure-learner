import { regions, type Region } from '../../domain/simulation';
import { ipv4 } from '../v31/ip';
import {
  dataLimits,
  dataTypes as T,
  type DataCommand,
  type DataContext,
  type DataFailureCode,
  type DataResult,
  type DataState,
  type DatabaseConnection,
  type DatabaseFirewallRule,
  type FunctionApp,
  type FunctionDefinition,
  type Resource,
} from './contract';

export const freshDataState = (): DataState => ({
  postgresServers: [],
  postgresDatabases: [],
  sqlServers: [],
  sqlDatabases: [],
  databaseFirewallRules: [],
  functionPlans: [],
  functionApps: [],
  functions: [],
  databaseConnections: [],
});
export const dataResources = (state: DataState) => [
  ...state.postgresServers,
  ...state.postgresDatabases,
  ...state.sqlServers,
  ...state.sqlDatabases,
  ...state.databaseFirewallRules,
  ...state.functionPlans,
  ...state.functionApps,
  ...state.functions,
  ...state.databaseConnections,
];

const fields: Record<DataCommand['type'], readonly string[]> = {
  CreatePostgresServer: [
    'type',
    'groupId',
    'name',
    'region',
    'version',
    'sku',
    'storageGiB',
    'publicNetworkAccess',
  ],
  UpdatePostgresServer: ['type', 'serverId', 'storageGiB', 'publicNetworkAccess'],
  DeletePostgresServer: ['type', 'serverId'],
  CreatePostgresDatabase: ['type', 'serverId', 'name', 'charset'],
  DeletePostgresDatabase: ['type', 'databaseId'],
  CreateSqlServer: ['type', 'groupId', 'name', 'region', 'version', 'publicNetworkAccess'],
  UpdateSqlServer: ['type', 'serverId', 'publicNetworkAccess'],
  DeleteSqlServer: ['type', 'serverId'],
  CreateSqlDatabase: ['type', 'serverId', 'name', 'sku', 'maxSizeGiB'],
  DeleteSqlDatabase: ['type', 'databaseId'],
  CreateDatabaseFirewallRule: ['type', 'serverId', 'name', 'startIp', 'endIp'],
  UpdateDatabaseFirewallRule: ['type', 'ruleId', 'startIp', 'endIp'],
  DeleteDatabaseFirewallRule: ['type', 'ruleId'],
  CreateFunctionApp: [
    'type',
    'groupId',
    'name',
    'region',
    'planName',
    'storageAccountId',
    'deploymentContainerId',
    'runtime',
    'publicNetworkAccess',
  ],
  UpdateFunctionApp: ['type', 'appId', 'enabled', 'publicNetworkAccess'],
  DeleteFunctionApp: ['type', 'appId'],
  CreateFunction: [
    'type',
    'appId',
    'name',
    'trigger',
    'method',
    'route',
    'containerId',
    'behavior',
    'responseText',
  ],
  UpdateFunction: [
    'type',
    'functionId',
    'enabled',
    'method',
    'route',
    'containerId',
    'behavior',
    'responseText',
  ],
  DeleteFunction: ['type', 'functionId'],
  CreateDatabaseConnection: ['type', 'appId', 'databaseId', 'databaseType', 'settingName', 'tls'],
  UpdateDatabaseConnection: ['type', 'connectionId', 'databaseId', 'databaseType', 'tls'],
  DeleteDatabaseConnection: ['type', 'connectionId'],
};
const fail = (code: DataFailureCode, field?: string): DataResult => ({
  ok: false,
  code,
  ...(field === undefined ? {} : { field }),
});
const access = (v: string) => v === 'Enabled' || v === 'Disabled';
const bool = (v: string) => v === 'true' || v === 'false';
const serverName = (v: string) => /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/.test(v);
const databaseName = (v: string) => /^[A-Za-z][A-Za-z0-9_]{0,62}$/.test(v);
const configName = (v: string) => /^[A-Za-z][A-Za-z0-9_-]{0,59}$/.test(v);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const sqlSystem = ['master', 'tempdb', 'model', 'msdb'];
const pgSystem = ['postgres', 'template0', 'template1'];
const lower = (v: string) => v.toLowerCase();
const range = (start: string, end: string) => {
  const a = ipv4(start),
    b = ipv4(end);
  // 0.0.0.0 has special Azure semantics, not an ordinary client allow-range.
  return a !== null && b !== null && a > 0 && b >= a && b < 0xe0000000 && a >= 0x01000000;
};
export const dataCommandTypes: readonly string[] = Object.keys(fields);

/** All writes are proposals only. A successful caller must still atomically persist
 * the new authoritative World and original receipt before showing committed success. */
export function applyDataCommand(
  state: DataState,
  command: DataCommand,
  context: DataContext,
): DataResult {
  if (!command || typeof command !== 'object' || Array.isArray(command))
    return fail('invalid-command');
  const raw = command as unknown as Record<string, unknown>,
    type = raw.type;
  if (typeof type !== 'string' || !Object.hasOwn(fields, type))
    return fail('unsupported-capability', 'type');
  const keys = fields[type as DataCommand['type']];
  const extra = Object.keys(raw)
    .sort()
    .find((k) => !keys.includes(k));
  if (extra !== undefined) return fail('unsupported-field', extra);
  if (
    keys.some(
      (k) =>
        !Object.hasOwn(raw, k) ||
        typeof raw[k] !== 'string' ||
        (raw[k] as string).length > 120 ||
        !(raw[k] as string).isWellFormed() ||
        (raw[k] as string).includes('\0'),
    )
  )
    return fail('invalid-command');
  if (
    !Number.isSafeInteger(context.nextId) ||
    context.nextId < 1 ||
    !Number.isSafeInteger(context.resourceCount) ||
    context.resourceCount < dataResources(state).length ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(context.origin)
  )
    return fail('invalid-command');
  const next = structuredClone(state);
  let before: Resource | null = null,
    after: Resource | null = null;
  let targetType = '',
    scopeId = '',
    region = '',
    allocated = 0;
  const addedIds: string[] = [],
    updatedIds: string[] = [],
    removedIds: string[] = [];
  const id = (family: string) => `${family}-${context.nextId + allocated++}`;
  const capacity = (n: number, length: number, max: number) =>
    context.resourceCount + n <= dataLimits.entities && length < max;
  const group = (groupId: string) => context.groups.find((g) => g.id === groupId);
  const subscription = (groupId: string) => group(groupId)?.subscriptionId;
  const external = (resourceId: string) =>
    context.externalReferences?.some((r) => r.targetId === resourceId) ?? false;
  const begin = (r: Resource & { type: string }) => {
    before = structuredClone(r);
    targetType = r.type;
    scopeId = r.groupId;
    region = r.region;
  };
  const changed = (r: Resource) => {
    after = r;
    updatedIds.push(r.id);
  };
  const created = (r: Resource & { type: string }) => {
    after = r;
    targetType = r.type;
    scopeId = r.groupId;
    region = r.region;
    addedIds.push(r.id);
  };
  const removed = (r: Resource) => {
    removedIds.push(r.id);
  };
  const server = (serverId: string) =>
    state.postgresServers.find((s) => s.id === serverId) ??
    state.sqlServers.find((s) => s.id === serverId);
  const database = (databaseId: string, databaseType: string) =>
    dataResources(state).find(
      (r) =>
        r.id === databaseId &&
        r.type === databaseType &&
        [T.postgresDatabase, T.sqlDatabase].includes(r.type as typeof T.postgresDatabase),
    );
  const app = (appId: string) =>
    state.functionApps.find((a) => a.id === appId) ??
    context.applications.find((a) => a.id === appId && a.type === T.functionApp);
  const blockedDatabase = (databaseId: string) =>
    external(databaseId) || state.databaseConnections.some((b) => b.database.id === databaseId);
  const base = (name: string, groupId: string, location: string): Resource => ({
    id: '',
    name,
    groupId,
    region: location,
    origin: context.origin,
  });
  const creationScope = (groupId: string, location: string): DataResult | null =>
    !group(groupId)
      ? fail('invalid-parent', 'groupId')
      : !regions.includes(location as Region)
        ? fail('invalid-region', 'region')
        : null;

  if (command.type === 'CreatePostgresServer' || command.type === 'CreateSqlServer') {
    const c = command,
      problem = creationScope(c.groupId, c.region);
    if (problem) return problem;
    if (!serverName(c.name)) return fail('invalid-name', 'name');
    if (!access(c.publicNetworkAccess)) return fail('unsupported-profile', 'publicNetworkAccess');
    const pg = c.type === 'CreatePostgresServer',
      existing = pg ? state.postgresServers : state.sqlServers;
    if (existing.some((s) => lower(s.name) === lower(c.name)))
      return fail('duplicate-name', 'name');
    if (!capacity(1, existing.length, pg ? dataLimits.postgresServers : dataLimits.sqlServers))
      return fail('capacity');
    if (c.type === 'CreatePostgresServer') {
      if (c.version !== '16' || c.sku !== 'Standard_B1ms' || !['32', '64'].includes(c.storageGiB))
        return fail(
          'unsupported-profile',
          c.version !== '16' ? 'version' : c.sku !== 'Standard_B1ms' ? 'sku' : 'storageGiB',
        );
      const r = {
        ...base(c.name, c.groupId, c.region),
        id: id('postgres-server'),
        type: T.postgresServer,
        version: '16' as const,
        sku: 'Standard_B1ms' as const,
        storageGiB: Number(c.storageGiB) as 32 | 64,
        publicNetworkAccess: c.publicNetworkAccess as 'Enabled' | 'Disabled',
        minimumTls: '1.2' as const,
      };
      next.postgresServers.push(r);
      created(r);
    } else {
      if (c.version !== '12.0') return fail('unsupported-profile', 'version');
      const r = {
        ...base(c.name, c.groupId, c.region),
        id: id('sql-server'),
        type: T.sqlServer,
        version: '12.0' as const,
        publicNetworkAccess: c.publicNetworkAccess as 'Enabled' | 'Disabled',
        minimumTls: '1.2' as const,
      };
      next.sqlServers.push(r);
      created(r);
    }
  } else if (command.type === 'UpdatePostgresServer' || command.type === 'UpdateSqlServer') {
    const c = command,
      pg = c.type === 'UpdatePostgresServer',
      s = pg
        ? next.postgresServers.find((r) => r.id === c.serverId)
        : next.sqlServers.find((r) => r.id === c.serverId);
    if (!s) return fail('invalid-parent', 'serverId');
    if (!access(c.publicNetworkAccess)) return fail('unsupported-profile', 'publicNetworkAccess');
    begin(s);
    if (c.type === 'UpdatePostgresServer') {
      if (!['32', '64'].includes(c.storageGiB)) return fail('unsupported-profile', 'storageGiB');
      const p = next.postgresServers.find((r) => r.id === c.serverId)!;
      // Azure Flexible Server storage can grow, not shrink in-place.
      if (Number(c.storageGiB) < p.storageGiB) return fail('unsupported-profile', 'storageGiB');
      p.storageGiB = Number(c.storageGiB) as 32 | 64;
    }
    s.publicNetworkAccess = c.publicNetworkAccess as 'Enabled' | 'Disabled';
    changed(s);
  } else if (command.type === 'DeletePostgresServer' || command.type === 'DeleteSqlServer') {
    const c = command,
      s = server(c.serverId),
      expected = c.type === 'DeletePostgresServer' ? T.postgresServer : T.sqlServer;
    if (!s || s.type !== expected) return fail('invalid-parent', 'serverId');
    if (
      external(s.id) ||
      state.databaseFirewallRules.some((r) => r.server.id === s.id) ||
      [...state.postgresDatabases, ...state.sqlDatabases].some((d) => d.serverId === s.id)
    )
      return fail('cascade-delete-unsupported', 'serverId');
    begin(s);
    next.postgresServers = next.postgresServers.filter((r) => r.id !== s.id);
    next.sqlServers = next.sqlServers.filter((r) => r.id !== s.id);
    removed(s);
  } else if (command.type === 'CreatePostgresDatabase' || command.type === 'CreateSqlDatabase') {
    const c = command,
      s = server(c.serverId),
      pg = c.type === 'CreatePostgresDatabase';
    if (!s || s.type !== (pg ? T.postgresServer : T.sqlServer))
      return fail('invalid-parent', 'serverId');
    if (!databaseName(c.name) || (pg ? pgSystem : sqlSystem).includes(lower(c.name)))
      return fail('invalid-name', 'name');
    const existing = pg ? state.postgresDatabases : state.sqlDatabases;
    if (existing.some((d) => d.serverId === s.id && lower(d.name) === lower(c.name)))
      return fail('duplicate-name', 'name');
    if (!capacity(1, existing.length, pg ? dataLimits.postgresDatabases : dataLimits.sqlDatabases))
      return fail('capacity');
    if (c.type === 'CreatePostgresDatabase') {
      if (c.charset !== 'UTF8') return fail('unsupported-profile', 'charset');
      const r = {
        ...base(c.name, s.groupId, s.region),
        id: id('postgres-database'),
        type: T.postgresDatabase,
        serverId: s.id,
        charset: 'UTF8' as const,
      };
      next.postgresDatabases.push(r);
      created(r);
      scopeId = s.id;
    } else {
      if (c.sku !== 'Basic' || c.maxSizeGiB !== '2')
        return fail('unsupported-profile', c.sku !== 'Basic' ? 'sku' : 'maxSizeGiB');
      const r = {
        ...base(c.name, s.groupId, s.region),
        id: id('sql-database'),
        type: T.sqlDatabase,
        serverId: s.id,
        sku: 'Basic' as const,
        maxSizeGiB: 2 as const,
      };
      next.sqlDatabases.push(r);
      created(r);
      scopeId = s.id;
    }
  } else if (command.type === 'DeletePostgresDatabase' || command.type === 'DeleteSqlDatabase') {
    const c = command,
      pg = c.type === 'DeletePostgresDatabase',
      d = (pg ? state.postgresDatabases : state.sqlDatabases).find((r) => r.id === c.databaseId);
    if (!d) return fail('invalid-parent', 'databaseId');
    if (blockedDatabase(d.id)) return fail('cascade-delete-unsupported', 'databaseId');
    begin(d);
    scopeId = d.serverId;
    next.postgresDatabases = next.postgresDatabases.filter((r) => r.id !== d.id);
    next.sqlDatabases = next.sqlDatabases.filter((r) => r.id !== d.id);
    removed(d);
  } else if (
    command.type === 'CreateDatabaseFirewallRule' ||
    command.type === 'UpdateDatabaseFirewallRule'
  ) {
    const c = command,
      old =
        c.type === 'UpdateDatabaseFirewallRule'
          ? state.databaseFirewallRules.find((r) => r.id === c.ruleId)
          : undefined;
    if (c.type === 'UpdateDatabaseFirewallRule' && !old) return fail('invalid-parent', 'ruleId');
    const s = server(c.type === 'CreateDatabaseFirewallRule' ? c.serverId : old!.server.id);
    if (!s) return fail('invalid-parent', 'serverId');
    if (!range(c.startIp, c.endIp)) return fail('unsupported-profile', 'startIp');
    if (c.type === 'CreateDatabaseFirewallRule') {
      if (!configName(c.name)) return fail('invalid-name', 'name');
      if (
        state.databaseFirewallRules.some(
          (r) => r.server.id === s.id && lower(r.name) === lower(c.name),
        )
      )
        return fail('duplicate-name', 'name');
      if (!capacity(1, state.databaseFirewallRules.length, dataLimits.databaseFirewallRules))
        return fail('capacity');
      const r: DatabaseFirewallRule = {
        ...base(c.name, s.groupId, s.region),
        id: id('database-firewall-rule'),
        type: s.type === T.postgresServer ? T.postgresFirewallRule : T.sqlFirewallRule,
        server: { id: s.id, type: s.type },
        startIp: c.startIp,
        endIp: c.endIp,
      };
      next.databaseFirewallRules.push(r);
      created(r);
    } else {
      const r = next.databaseFirewallRules.find((r) => r.id === c.ruleId)!;
      begin(r);
      r.startIp = c.startIp;
      r.endIp = c.endIp;
      changed(r);
    }
    scopeId = s.id;
  } else if (command.type === 'DeleteDatabaseFirewallRule') {
    const r = state.databaseFirewallRules.find((r) => r.id === command.ruleId);
    if (!r) return fail('invalid-parent', 'ruleId');
    if (external(r.id)) return fail('cascade-delete-unsupported', 'ruleId');
    begin(r);
    scopeId = r.server.id;
    next.databaseFirewallRules = next.databaseFirewallRules.filter((x) => x.id !== r.id);
    removed(r);
  } else if (command.type === 'CreateFunctionApp') {
    const c = command,
      problem = creationScope(c.groupId, c.region);
    if (problem) return problem;
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,58}[A-Za-z0-9])$/.test(c.name))
      return fail('invalid-name', 'name');
    if (!configName(c.planName)) return fail('invalid-name', 'planName');
    if (
      state.functionApps.some((a) => lower(a.name) === lower(c.name)) ||
      context.applications.some((a) => lower(a.name) === lower(c.name))
    )
      return fail('duplicate-name', 'name');
    if (
      state.functionPlans.some(
        (p) => p.groupId === c.groupId && lower(p.name) === lower(c.planName),
      ) ||
      context.applicationPlans?.some(
        (p) => p.groupId === c.groupId && lower(p.name) === lower(c.planName),
      )
    )
      return fail('duplicate-name', 'planName');
    if (c.runtime !== 'node22' || !access(c.publicNetworkAccess))
      return fail(
        'unsupported-profile',
        c.runtime !== 'node22' ? 'runtime' : 'publicNetworkAccess',
      );
    const account = context.accounts.find((a) => a.id === c.storageAccountId),
      container = context.containers.find((x) => x.id === c.deploymentContainerId);
    if (!account || !container)
      return fail('invalid-parent', !account ? 'storageAccountId' : 'deploymentContainerId');
    if (
      account.region !== c.region ||
      subscription(account.groupId) !== subscription(c.groupId) ||
      container.accountId !== account.id
    )
      return fail('incompatible-association', 'storageAccountId');
    if (
      account.kind !== 'StorageV2' ||
      account.sku !== 'Standard_LRS' ||
      container.access !== 'private'
    )
      return fail('unsupported-profile', 'storageAccountId');
    if (!capacity(2, state.functionApps.length, dataLimits.functionApps)) return fail('capacity');
    const planId = id('function-plan'),
      appId = id('function-app');
    next.functionPlans.push({
      ...base(c.planName, c.groupId, c.region),
      id: planId,
      type: T.functionPlan,
      sku: 'FC1',
      os: 'Linux',
      ownerAppId: appId,
    });
    addedIds.push(planId);
    const r: FunctionApp = {
      ...base(c.name, c.groupId, c.region),
      id: appId,
      type: T.functionApp,
      kind: 'functionapp',
      planId,
      storageAccountId: account.id,
      deploymentContainerId: container.id,
      runtime: 'node22',
      functionsVersion: '~4',
      instanceMemoryMB: 2048,
      enabled: true,
      publicNetworkAccess: c.publicNetworkAccess as 'Enabled' | 'Disabled',
      httpsOnly: true,
    };
    next.functionApps.push(r);
    created(r);
  } else if (command.type === 'UpdateFunctionApp') {
    const c = command,
      a = next.functionApps.find((r) => r.id === c.appId);
    if (!a) return fail('invalid-parent', 'appId');
    if (!bool(c.enabled) || !access(c.publicNetworkAccess))
      return fail('unsupported-profile', !bool(c.enabled) ? 'enabled' : 'publicNetworkAccess');
    begin(a);
    a.enabled = c.enabled === 'true';
    a.publicNetworkAccess = c.publicNetworkAccess as 'Enabled' | 'Disabled';
    changed(a);
  } else if (command.type === 'DeleteFunctionApp') {
    const a = state.functionApps.find((r) => r.id === command.appId);
    if (!a) return fail('invalid-parent', 'appId');
    if (
      external(a.id) ||
      external(a.planId) ||
      state.functions.some((f) => f.appId === a.id) ||
      state.databaseConnections.some((b) => b.source.id === a.id)
    )
      return fail('cascade-delete-unsupported', 'appId');
    const p = state.functionPlans.find((p) => p.id === a.planId && p.ownerAppId === a.id);
    if (!p) return fail('invalid-parent', 'planId');
    begin(a);
    next.functionApps = next.functionApps.filter((r) => r.id !== a.id);
    next.functionPlans = next.functionPlans.filter((r) => r.id !== p.id);
    removed(a);
    removed(p);
  } else if (command.type === 'CreateFunction' || command.type === 'UpdateFunction') {
    const c = command,
      old =
        c.type === 'UpdateFunction'
          ? state.functions.find((f) => f.id === c.functionId)
          : undefined;
    if (c.type === 'UpdateFunction' && !old) return fail('invalid-parent', 'functionId');
    const a = state.functionApps.find(
      (a) => a.id === (c.type === 'CreateFunction' ? c.appId : old!.appId),
    );
    if (!a) return fail('invalid-parent', 'appId');
    if (c.type === 'CreateFunction' && !configName(c.name)) return fail('invalid-name', 'name');
    if (c.type === 'UpdateFunction' && !bool(c.enabled))
      return fail('unsupported-profile', 'enabled');
    if (!['static-text', 'echo-text'].includes(c.behavior))
      return fail('unsupported-profile', 'behavior');
    const trigger = c.type === 'CreateFunction' ? c.trigger : old!.trigger.kind;
    let config: FunctionDefinition['trigger'];
    if (trigger === 'http') {
      if (
        !['GET', 'POST'].includes(c.method) ||
        !/^\/[A-Za-z0-9/_-]{1,79}$/.test(c.route) ||
        c.containerId !== ''
      )
        return fail('unsupported-profile', 'route');
      if (
        state.functions.some(
          (f) =>
            f.id !== old?.id &&
            f.appId === a.id &&
            f.trigger.kind === 'http' &&
            f.trigger.method === c.method &&
            lower(f.trigger.route) === lower(c.route),
        )
      )
        return fail('duplicate-name', 'route');
      config = {
        kind: 'http',
        method: c.method as 'GET' | 'POST',
        route: c.route,
        authLevel: 'anonymous',
      };
    } else if (trigger === 'blob-event') {
      const container = context.containers.find((x) => x.id === c.containerId);
      if (!container) return fail('invalid-parent', 'containerId');
      if (container.accountId !== a.storageAccountId || c.method !== '' || c.route !== '')
        return fail('unsupported-profile', 'containerId');
      config = { kind: 'blob-event', containerId: container.id };
    } else return fail('unsupported-profile', 'trigger');
    if (c.type === 'CreateFunction') {
      if (state.functions.some((f) => f.appId === a.id && lower(f.name) === lower(c.name)))
        return fail('duplicate-name', 'name');
      if (!capacity(1, state.functions.length, dataLimits.functions)) return fail('capacity');
      const r: FunctionDefinition = {
        ...base(c.name, a.groupId, a.region),
        id: id('function'),
        type: T.function,
        appId: a.id,
        enabled: true,
        trigger: config,
        behavior: c.behavior as FunctionDefinition['behavior'],
        responseText: c.responseText,
      };
      next.functions.push(r);
      created(r);
    } else {
      const r = next.functions.find((f) => f.id === c.functionId)!;
      begin(r);
      r.enabled = c.enabled === 'true';
      r.trigger = config;
      r.behavior = c.behavior as FunctionDefinition['behavior'];
      r.responseText = c.responseText;
      changed(r);
    }
    scopeId = a.id;
  } else if (command.type === 'DeleteFunction') {
    const f = state.functions.find((f) => f.id === command.functionId);
    if (!f) return fail('invalid-parent', 'functionId');
    if (external(f.id)) return fail('cascade-delete-unsupported', 'functionId');
    begin(f);
    scopeId = f.appId;
    next.functions = next.functions.filter((x) => x.id !== f.id);
    removed(f);
  } else if (
    command.type === 'CreateDatabaseConnection' ||
    command.type === 'UpdateDatabaseConnection'
  ) {
    const c = command,
      old =
        c.type === 'UpdateDatabaseConnection'
          ? state.databaseConnections.find((b) => b.id === c.connectionId)
          : undefined;
    if (c.type === 'UpdateDatabaseConnection' && !old)
      return fail('invalid-parent', 'connectionId');
    const source = app(c.type === 'CreateDatabaseConnection' ? c.appId : old!.source.id),
      target = database(c.databaseId, c.databaseType);
    if (!source || !target) return fail('invalid-parent', !source ? 'appId' : 'databaseId');
    if (
      subscription(source.groupId) !== subscription(target.groupId) ||
      !subscription(source.groupId)
    )
      return fail('incompatible-association', 'databaseId');
    if (c.tls !== '1.2') return fail('unsupported-profile', 'tls');
    if (c.type === 'CreateDatabaseConnection') {
      if (!/^[A-Z][A-Z0-9_]{0,39}$/.test(c.settingName)) return fail('invalid-name', 'settingName');
      if (
        state.databaseConnections.some(
          (b) => b.source.id === source.id && b.settingName === c.settingName,
        )
      )
        return fail('duplicate-name', 'settingName');
      if (!capacity(1, state.databaseConnections.length, dataLimits.databaseConnections))
        return fail('capacity');
      const r: DatabaseConnection = {
        ...base(c.settingName, source.groupId, source.region),
        id: id('database-connection'),
        type: T.connection,
        source: { id: source.id, type: T.functionApp },
        database: { id: target.id, type: target.type as DatabaseConnection['database']['type'] },
        settingName: c.settingName,
        tls: '1.2',
      };
      next.databaseConnections.push(r);
      created(r);
    } else {
      const r = next.databaseConnections.find((b) => b.id === c.connectionId)!;
      begin(r);
      r.database = { id: target.id, type: target.type as DatabaseConnection['database']['type'] };
      changed(r);
    }
    scopeId = source.id;
  } else if (command.type === 'DeleteDatabaseConnection') {
    const b = state.databaseConnections.find((b) => b.id === command.connectionId);
    if (!b) return fail('invalid-parent', 'connectionId');
    begin(b);
    scopeId = b.source.id;
    next.databaseConnections = next.databaseConnections.filter((x) => x.id !== b.id);
    removed(b);
  } else return fail('unsupported-capability', 'type');

  if (before && after && same(before, after)) return fail('no-change');
  return {
    ok: true,
    state: next,
    nextId: context.nextId + allocated,
    addedIds,
    updatedIds,
    removedIds,
    targetType,
    scopeId,
    region,
    before: before as Record<string, unknown> | null,
    after: after as Record<string, unknown> | null,
  };
}

/** Cross-module dependencies derived from actual configuration, for use by the
 * single engine's deletion/Studio adapters. Never a second stored relationship index. */
export function dataReferences(
  state: DataState,
): readonly { sourceId: string; targetId: string }[] {
  return [
    ...[...state.postgresDatabases, ...state.sqlDatabases].map((d) => ({
      sourceId: d.id,
      targetId: d.serverId,
    })),
    ...state.databaseFirewallRules.map((r) => ({ sourceId: r.id, targetId: r.server.id })),
    ...state.functionApps.flatMap((a) =>
      [a.planId, a.storageAccountId, a.deploymentContainerId].map((targetId) => ({
        sourceId: a.id,
        targetId,
      })),
    ),
    ...state.functions.flatMap((f) =>
      [f.appId, ...(f.trigger.kind === 'blob-event' ? [f.trigger.containerId] : [])].map(
        (targetId) => ({ sourceId: f.id, targetId }),
      ),
    ),
    ...state.databaseConnections.flatMap((b) =>
      [b.source.id, b.database.id].map((targetId) => ({ sourceId: b.id, targetId })),
    ),
  ];
}
