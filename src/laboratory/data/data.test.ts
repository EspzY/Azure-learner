import { describe, expect, test } from 'vitest';
import { analyseDatabaseConnection, analyseFunctionInvocation } from './analysis';
import { applyDataCommand, dataReferences, dataResources, freshDataState } from './domain';
import { dataTypes as T, type DataCommand, type DataContext } from './contract';

const identity = { workspace: 'workspace-data', model: 'laboratory@3.8.0', revision: 12 };
function harness(overrides: Partial<DataContext> = {}) {
  let state = freshDataState(),
    nextId = 1,
    count = 0,
    sequence = 0;
  const input: DataContext = {
    groups: [
      { id: 'rg-app', subscriptionId: 'sub-app' },
      { id: 'rg-data', subscriptionId: 'sub-app' },
      { id: 'rg-other', subscriptionId: 'sub-shared' },
    ],
    accounts: [
      {
        id: 'storage-1',
        groupId: 'rg-data',
        region: 'westeurope',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      },
    ],
    containers: [
      { id: 'container-1', accountId: 'storage-1', access: 'private' },
      { id: 'container-2', accountId: 'storage-1', access: 'private' },
    ],
    blobs: [{ id: 'blob-1', containerId: 'container-2', text: '<script>alert("text")</script>' }],
    applications: [
      {
        id: 'web-app-1',
        type: 'Microsoft.Web/sites',
        name: 'web-app',
        groupId: 'rg-app',
        subscriptionId: 'sub-app',
        region: 'norwayeast',
        enabled: true,
        publicNetworkAccess: 'Enabled',
        httpsOnly: true,
        origin: 'original-web-create',
      },
    ],
    nextId,
    resourceCount: count,
    origin: 'data-0',
    ...overrides,
  };
  const context = () => ({
    ...input,
    nextId,
    resourceCount: count + dataResources(state).length,
    origin: `data-${sequence + 1}`,
  });
  const run = (command: DataCommand) => {
    const result = applyDataCommand(state, command, context());
    sequence++;
    if (result.ok) {
      state = result.state;
      nextId = result.nextId;
    }
    return result;
  };
  const create = (command: DataCommand) => {
    const result = run(command);
    expect(result.ok).toBe(true);
    if (!result.ok) throw Error(JSON.stringify(result));
    return result.addedIds.at(-1)!;
  };
  return {
    get state() {
      return state;
    },
    get nextId() {
      return nextId;
    },
    context,
    run,
    create,
    setCount: (v: number) => {
      count = v;
    },
    input,
  };
}
const pg = (
  extra: Partial<Extract<DataCommand, { type: 'CreatePostgresServer' }>> = {},
): DataCommand => ({
  type: 'CreatePostgresServer',
  groupId: 'rg-data',
  name: 'pg-data',
  region: 'westeurope',
  version: '16',
  sku: 'Standard_B1ms',
  storageGiB: '32',
  publicNetworkAccess: 'Enabled',
  ...extra,
});
const sql = (
  extra: Partial<Extract<DataCommand, { type: 'CreateSqlServer' }>> = {},
): DataCommand => ({
  type: 'CreateSqlServer',
  groupId: 'rg-data',
  name: 'sql-data',
  region: 'westeurope',
  version: '12.0',
  publicNetworkAccess: 'Enabled',
  ...extra,
});
const fa = (
  extra: Partial<Extract<DataCommand, { type: 'CreateFunctionApp' }>> = {},
): DataCommand => ({
  type: 'CreateFunctionApp',
  groupId: 'rg-app',
  name: 'functions-app',
  region: 'westeurope',
  planName: 'plan-functions',
  storageAccountId: 'storage-1',
  deploymentContainerId: 'container-1',
  runtime: 'node22',
  publicNetworkAccess: 'Enabled',
  ...extra,
});
function postgresSetup() {
  const h = harness(),
    serverId = h.create(pg());
  const databaseId = h.create({
    type: 'CreatePostgresDatabase',
    serverId,
    name: 'appdb',
    charset: 'UTF8',
  });
  const connectionId = h.create({
    type: 'CreateDatabaseConnection',
    appId: 'web-app-1',
    databaseId,
    databaseType: T.postgresDatabase,
    settingName: 'APP_DATABASE',
    tls: '1.2',
  });
  return { h, serverId, databaseId, connectionId };
}
function functionSetup() {
  const h = harness(),
    appId = h.create(fa());
  const functionId = h.create({
    type: 'CreateFunction',
    appId,
    name: 'hello',
    trigger: 'http',
    method: 'POST',
    route: '/hello',
    containerId: '',
    behavior: 'echo-text',
    responseText: '',
  });
  return { h, appId, functionId };
}
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(frozen);
  }
  return value;
}

describe('Data resource proposals and authoritative integration boundaries', () => {
  test('PostgreSQL parent, region, immutable create origin and growth are concrete configuration', () => {
    const h = harness(),
      id = h.create(pg());
    const original = structuredClone(h.state.postgresServers[0]);
    const r = h.run({
      type: 'UpdatePostgresServer',
      serverId: id,
      storageGiB: '64',
      publicNetworkAccess: 'Disabled',
    });
    expect(r).toMatchObject({
      ok: true,
      nextId: 2,
      addedIds: [],
      updatedIds: [id],
      before: original,
    });
    expect(h.state.postgresServers[0]).toEqual({
      ...original,
      storageGiB: 64,
      publicNetworkAccess: 'Disabled',
    });
    expect(
      h.run({
        type: 'UpdatePostgresServer',
        serverId: id,
        storageGiB: '32',
        publicNetworkAccess: 'Enabled',
      }),
    ).toEqual({ ok: false, code: 'unsupported-profile', field: 'storageGiB' });
  });
  test.each([
    ['parent', { groupId: 'missing' }, 'invalid-parent'],
    ['region', { region: 'unsupported' }, 'invalid-region'],
    ['version', { version: '9.6' }, 'unsupported-profile'],
    ['sku', { sku: 'Premium' }, 'unsupported-profile'],
    ['storage', { storageGiB: '33' }, 'unsupported-profile'],
    ['public access', { publicNetworkAccess: 'true' }, 'unsupported-profile'],
    ['leading dash', { name: '-server' }, 'invalid-name'],
    ['trailing dash', { name: 'server-' }, 'invalid-name'],
    ['short name', { name: 'ab' }, 'invalid-name'],
  ])('rejects invalid PostgreSQL %s without allocating', (_, extra, code) => {
    const h = harness(),
      before = structuredClone(h.state);
    expect(h.run(pg(extra))).toMatchObject({ ok: false, code });
    expect(h.state).toEqual(before);
    expect(h.nextId).toBe(1);
  });
  test('SQL database inherits server region, namespace and exact parent type', () => {
    const h = harness(),
      s = h.create(sql()),
      p = h.create(pg());
    const d = h.create({
      type: 'CreateSqlDatabase',
      serverId: s,
      name: 'appdb',
      sku: 'Basic',
      maxSizeGiB: '2',
    });
    expect(h.state.sqlDatabases[0]).toMatchObject({
      id: d,
      serverId: s,
      groupId: 'rg-data',
      region: 'westeurope',
      type: T.sqlDatabase,
      sku: 'Basic',
      maxSizeGiB: 2,
    });
    expect(
      h.run({
        type: 'CreateSqlDatabase',
        serverId: p,
        name: 'another',
        sku: 'Basic',
        maxSizeGiB: '2',
      }),
    ).toMatchObject({ ok: false, code: 'invalid-parent' });
    expect(
      h.run({
        type: 'CreateSqlDatabase',
        serverId: s,
        name: 'APPDB',
        sku: 'Basic',
        maxSizeGiB: '2',
      }),
    ).toMatchObject({ ok: false, code: 'duplicate-name' });
    expect(
      h.run({
        type: 'CreateSqlDatabase',
        serverId: s,
        name: 'master',
        sku: 'Basic',
        maxSizeGiB: '2',
      }),
    ).toMatchObject({ ok: false, code: 'invalid-name' });
  });
  test('database creation rejects unsupported tuning fields and profiles', () => {
    const h = harness(),
      s = h.create(sql());
    expect(
      h.run({
        type: 'CreateSqlDatabase',
        serverId: s,
        name: 'appdb',
        sku: 'Basic',
        maxSizeGiB: '20',
      }),
    ).toMatchObject({ ok: false, code: 'unsupported-profile' });
    expect(
      h.run({
        type: 'CreateSqlDatabase',
        serverId: s,
        name: 'appdb',
        sku: 'Basic',
        maxSizeGiB: '2',
        administratorPassword: 'secret',
      } as DataCommand),
    ).toEqual({ ok: false, code: 'unsupported-field', field: 'administratorPassword' });
    expect(h.state.sqlDatabases).toEqual([]);
  });
  test('same DB name is valid on different logical parents, servers are locally unique', () => {
    const h = harness(),
      a = h.create(sql()),
      b = h.create(sql({ name: 'second-server' }));
    for (const serverId of [a, b])
      h.create({
        type: 'CreateSqlDatabase',
        serverId,
        name: 'appdb',
        sku: 'Basic',
        maxSizeGiB: '2',
      });
    expect(h.state.sqlDatabases.map((d) => d.serverId)).toEqual([a, b]);
    expect(h.run(sql({ groupId: 'rg-app' }))).toMatchObject({ ok: false, code: 'duplicate-name' });
  });
  test('database dependencies block delete until explicitly disconnected; create origin is retained', () => {
    const { h, serverId, databaseId, connectionId } = postgresSetup();
    expect(h.run({ type: 'DeletePostgresServer', serverId })).toMatchObject({
      ok: false,
      code: 'cascade-delete-unsupported',
    });
    expect(h.run({ type: 'DeletePostgresDatabase', databaseId })).toMatchObject({
      ok: false,
      code: 'cascade-delete-unsupported',
    });
    expect(h.run({ type: 'DeleteDatabaseConnection', connectionId })).toMatchObject({
      ok: true,
      removedIds: [connectionId],
    });
    expect(h.run({ type: 'DeletePostgresDatabase', databaseId })).toMatchObject({
      ok: true,
      removedIds: [databaseId],
    });
    expect(h.run({ type: 'DeletePostgresServer', serverId })).toMatchObject({
      ok: true,
      removedIds: [serverId],
    });
    expect(h.state).toEqual(freshDataState());
    expect(h.create(pg())).not.toBe(serverId);
  });
  test('rules retain server parent; their own deletion does not delete the server', () => {
    const h = harness(),
      serverId = h.create(sql());
    const ruleId = h.create({
      type: 'CreateDatabaseFirewallRule',
      serverId,
      name: 'app-egress',
      startIp: '192.0.2.10',
      endIp: '192.0.2.20',
    });
    const before = structuredClone(h.state.databaseFirewallRules[0]);
    expect(
      h.run({
        type: 'UpdateDatabaseFirewallRule',
        ruleId,
        startIp: '192.0.2.10',
        endIp: '192.0.2.10',
      }),
    ).toMatchObject({ ok: true, updatedIds: [ruleId], before });
    expect(h.state.databaseFirewallRules[0]?.origin).toBe(before?.origin);
    expect(h.run({ type: 'DeleteSqlServer', serverId })).toMatchObject({
      ok: false,
      code: 'cascade-delete-unsupported',
    });
    expect(h.run({ type: 'DeleteDatabaseFirewallRule', ruleId })).toMatchObject({
      ok: true,
      removedIds: [ruleId],
    });
    expect(h.state.sqlServers).toHaveLength(1);
  });
  test.each([
    ['0.0.0.0', '0.0.0.0'],
    ['192.0.2.20', '192.0.2.10'],
    ['192.000.2.1', '192.0.2.10'],
    ['10.0.0.1/24', '10.0.0.20'],
    ['::1', '::1'],
    ['224.0.0.1', '224.0.0.2'],
  ])('rejects unsupported public firewall range %s – %s', (startIp, endIp) => {
    const h = harness(),
      serverId = h.create(pg());
    expect(
      h.run({ type: 'CreateDatabaseFirewallRule', serverId, name: 'bad', startIp, endIp }),
    ).toMatchObject({ ok: false, code: 'unsupported-profile' });
    expect(h.state.databaseFirewallRules).toEqual([]);
  });
  test('complete configuration equality yields no-change without new identity', () => {
    const h = harness(),
      serverId = h.create(pg());
    expect(
      h.run({
        type: 'UpdatePostgresServer',
        serverId,
        storageGiB: '32',
        publicNetworkAccess: 'Enabled',
      }),
    ).toEqual({ ok: false, code: 'no-change' });
    expect(h.nextId).toBe(2);
  });
  test('external consumers prohibit deletion even without local child objects', () => {
    const h = harness({
        externalReferences: [{ sourceId: 'external-app-config', targetId: 'sql-server-1' }],
      }),
      serverId = h.create(sql());
    expect(h.run({ type: 'DeleteSqlServer', serverId })).toMatchObject({
      ok: false,
      code: 'cascade-delete-unsupported',
    });
    expect(h.state.sqlServers).toHaveLength(1);
  });
  test('capacity includes the whole caller World and atomic Function App + plan allocation', () => {
    const h = harness();
    h.setCount(95);
    expect(h.run(fa())).toEqual({ ok: false, code: 'capacity' });
    expect(h.state.functionPlans).toEqual([]);
    expect(h.state.functionApps).toEqual([]);
    expect(h.nextId).toBe(1);
    expect(h.run(pg())).toMatchObject({ ok: true, nextId: 2 });
    expect(h.run(sql())).toMatchObject({ ok: false, code: 'capacity' });
  });
  test('unknown fields have stable sorted denial independent of JSON key order', () => {
    const h = harness();
    const a = { ...pg(), zzz: 'z', '': 'x', aaa: 'a' } as unknown as DataCommand;
    const b = Object.fromEntries(Object.entries(a).reverse()) as DataCommand;
    expect(h.run(a)).toEqual({ ok: false, code: 'unsupported-field', field: '' });
    expect(h.run(b)).toEqual(h.run(a));
    expect(h.state).toEqual(freshDataState());
  });
  test.each([
    { ...pg(), storageGiB: 32 },
    { ...pg(), name: 'x'.repeat(121) },
    { ...pg(), name: 'bad\0name' },
    { ...pg(), name: '\ud800' },
    { type: 'UnknownDataOperation' },
    { type: '__proto__' },
  ])('malformed or unknown operations fail deterministically: %j', (command) => {
    const h = harness();
    expect(h.run(command as unknown as DataCommand).ok).toBe(false);
    expect(h.state).toEqual(freshDataState());
  });
  test('inputs are deeply immutable; replaying proposals after JSON normalization is deterministic', () => {
    const commands = [
      pg(),
      {
        type: 'CreatePostgresDatabase',
        serverId: 'postgres-server-1',
        name: 'orders',
        charset: 'UTF8',
      },
      {
        type: 'UpdatePostgresServer',
        serverId: 'postgres-server-1',
        storageGiB: '64',
        publicNetworkAccess: 'Disabled',
      },
    ] as DataCommand[];
    const a = harness(),
      b = harness();
    for (const c of commands) {
      const ctx = a.context(),
        before = JSON.stringify(a.state);
      const r = applyDataCommand(frozen(a.state), frozen(c), frozen(ctx));
      expect(JSON.stringify(a.state)).toBe(before);
      expect(r.ok).toBe(true);
      a.run(c);
      b.run(
        JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(c).reverse()))) as DataCommand,
      );
    }
    expect(a.state).toEqual(b.state);
    expect(a.nextId).toBe(b.nextId);
  });
  test('required command fields cannot be supplied by a prototype', () => {
    const h = harness();
    const inherited = Object.assign(Object.create(pg()), {
      type: 'CreatePostgresServer',
    }) as DataCommand;
    expect(h.run(inherited)).toEqual({ ok: false, code: 'invalid-command' });
    expect(h.state).toEqual(freshDataState());
  });
  test('per-family capacities apply even when total World budget remains', () => {
    const h = harness();
    for (let i = 0; i < 4; i++) h.create(pg({ name: `postgres-${i}` }));
    expect(h.run(pg({ name: 'postgres-fifth' }))).toEqual({ ok: false, code: 'capacity' });
    expect(h.state.postgresServers).toHaveLength(4);
  });
  test('documented minimum/maximum names and narrow SQL simulator names are explicit', () => {
    const h = harness();
    h.create(pg({ name: 'abc' }));
    h.create(pg({ name: 'a'.repeat(63) }));
    expect(h.run(pg({ name: 'a'.repeat(64) }))).toMatchObject({ ok: false, code: 'invalid-name' });
    // SQL itself accepts shorter names: this bounded profile deliberately uses 3–63.
    expect(h.run(sql({ name: 'x' }))).toMatchObject({ ok: false, code: 'invalid-name' });
  });
});

describe('Secret-free database connection analysis', () => {
  test('missing egress is explicitly undetermined, never invented from WebApp region', () => {
    const { h, connectionId } = postgresSetup();
    const r = analyseDatabaseConnection(h.state, h.context(), identity, { connectionId });
    expect(r).toMatchObject({
      ...identity,
      status: 'undetermined',
      code: 'source-egress-ip-unknown',
    });
    expect(r.limitations.join(' ')).toContain('never a discovered');
  });
  test('explicit hypothetical source matches only actual server rules and changes after Update/Delete', () => {
    const { h, serverId, connectionId } = postgresSetup();
    const query = () =>
      analyseDatabaseConnection(h.state, h.context(), identity, {
        connectionId,
        sourceIp: '192.0.2.10',
      });
    expect(query()).toMatchObject({
      status: 'denied-by-configuration',
      code: 'source-ip-not-allowed',
    });
    const ruleId = h.create({
      type: 'CreateDatabaseFirewallRule',
      serverId,
      name: 'app',
      startIp: '192.0.2.10',
      endIp: '192.0.2.10',
    });
    expect(query()).toMatchObject({
      status: 'configuration-consistent',
      code: 'modeled-public-network-requirements-satisfied',
    });
    expect(query().references).toContainEqual({ id: ruleId, type: T.postgresFirewallRule });
    h.run({
      type: 'UpdateDatabaseFirewallRule',
      ruleId,
      startIp: '192.0.2.11',
      endIp: '192.0.2.11',
    });
    expect(query().status).toBe('denied-by-configuration');
    h.run({ type: 'DeleteDatabaseFirewallRule', ruleId });
    expect(query().status).toBe('denied-by-configuration');
  });
  test('disabled public endpoint dominates an allowed client rule; auth remains unverified', () => {
    const { h, serverId, connectionId } = postgresSetup();
    h.create({
      type: 'CreateDatabaseFirewallRule',
      serverId,
      name: 'app',
      startIp: '192.0.2.10',
      endIp: '192.0.2.10',
    });
    const input = { connectionId, sourceIp: '192.0.2.10' };
    expect(analyseDatabaseConnection(h.state, h.context(), identity, input).facts).toContainEqual({
      name: 'authentication',
      value: 'not-evaluated',
    });
    h.run({
      type: 'UpdatePostgresServer',
      serverId,
      storageGiB: '32',
      publicNetworkAccess: 'Disabled',
    });
    expect(analyseDatabaseConnection(h.state, h.context(), identity, input)).toMatchObject({
      status: 'denied-by-configuration',
      code: 'public-endpoint-disabled',
    });
  });
  test('SQL uses its logical server firewall, not a rule from another server', () => {
    const h = harness(),
      a = h.create(sql()),
      b = h.create(sql({ name: 'sql-second' }));
    const databaseId = h.create({
      type: 'CreateSqlDatabase',
      serverId: a,
      name: 'orders',
      sku: 'Basic',
      maxSizeGiB: '2',
    });
    const connectionId = h.create({
      type: 'CreateDatabaseConnection',
      appId: 'web-app-1',
      databaseId,
      databaseType: T.sqlDatabase,
      settingName: 'DB',
      tls: '1.2',
    });
    h.create({
      type: 'CreateDatabaseFirewallRule',
      serverId: b,
      name: 'allow',
      startIp: '198.51.100.1',
      endIp: '198.51.100.1',
    });
    const r = analyseDatabaseConnection(h.state, h.context(), identity, {
      connectionId,
      sourceIp: '198.51.100.1',
    });
    expect(r.status).toBe('denied-by-configuration');
    h.create({
      type: 'CreateDatabaseFirewallRule',
      serverId: a,
      name: 'allow',
      startIp: '198.51.100.1',
      endIp: '198.51.100.1',
    });
    expect(
      analyseDatabaseConnection(h.state, h.context(), identity, {
        connectionId,
        sourceIp: '198.51.100.1',
      }).status,
    ).toBe('configuration-consistent');
  });
  test('retargeting preserves connection ID/create origin and updates real dependencies', () => {
    const { h, connectionId, databaseId } = postgresSetup(),
      s = h.create(sql());
    const target = h.create({
      type: 'CreateSqlDatabase',
      serverId: s,
      name: 'orders',
      sku: 'Basic',
      maxSizeGiB: '2',
    });
    const before = structuredClone(h.state.databaseConnections[0]);
    expect(
      h.run({
        type: 'UpdateDatabaseConnection',
        connectionId,
        databaseId: target,
        databaseType: T.sqlDatabase,
        tls: '1.2',
      }),
    ).toMatchObject({ ok: true, updatedIds: [connectionId], before });
    expect(h.state.databaseConnections[0]).toMatchObject({
      id: connectionId,
      origin: before?.origin,
      source: before?.source,
      database: { id: target, type: T.sqlDatabase },
    });
    expect(dataReferences(h.state)).not.toContainEqual({
      sourceId: connectionId,
      targetId: databaseId,
    });
    expect(dataReferences(h.state)).toContainEqual({ sourceId: connectionId, targetId: target });
  });
  test('cross-subscription, stale source identity, wrong target type and secrets cannot be smuggled', () => {
    const h = harness(),
      serverId = h.create(pg({ groupId: 'rg-other' })),
      databaseId = h.create({
        type: 'CreatePostgresDatabase',
        serverId,
        name: 'orders',
        charset: 'UTF8',
      });
    const c = {
      type: 'CreateDatabaseConnection',
      appId: 'web-app-1',
      databaseId,
      databaseType: T.postgresDatabase,
      settingName: 'DB',
      tls: '1.2',
    } as const;
    expect(h.run(c)).toMatchObject({ ok: false, code: 'incompatible-association' });
    expect(h.run({ ...c, databaseType: T.sqlDatabase })).toMatchObject({
      ok: false,
      code: 'invalid-parent',
    });
    expect(h.run({ ...c, appId: 'missing' })).toMatchObject({ ok: false, code: 'invalid-parent' });
    expect(h.run({ ...c, password: 'not-supported' } as DataCommand)).toMatchObject({
      ok: false,
      code: 'unsupported-field',
      field: 'password',
    });
  });
  test('analysis is read-only, revision-bound and rejects extra unmodeled options', () => {
    const { h, connectionId } = postgresSetup(),
      before = JSON.stringify(h.state),
      ctx = frozen(h.context());
    const r = analyseDatabaseConnection(frozen(h.state), ctx, identity, {
      connectionId,
      sourceIp: 'bad',
    });
    expect(r).toMatchObject({ ...identity, status: 'unsupported', code: 'invalid-source-ip' });
    expect(
      analyseDatabaseConnection(h.state, ctx, identity, {
        connectionId,
        bypassAuth: 'true',
      } as unknown as { connectionId: string }).status,
    ).toBe('unsupported');
    expect(JSON.stringify(h.state)).toBe(before);
  });
  test('analysis references cannot mutate binding identities through a returned object', () => {
    const { h, connectionId } = postgresSetup();
    const before = JSON.stringify(h.state);
    const r = analyseDatabaseConnection(h.state, h.context(), identity, { connectionId });
    (r.references.find((r) => r.type === T.postgresDatabase)! as { id: string }).id =
      'mutated-output';
    expect(JSON.stringify(h.state)).toBe(before);
  });
});

describe('Functions configuration and deterministic synthetic templates', () => {
  test('Function App atomically owns an explicit FC1 plan and requires actual supported Storage', () => {
    const h = harness(),
      r = h.run(fa());
    expect(r).toMatchObject({
      ok: true,
      addedIds: ['function-plan-1', 'function-app-2'],
      nextId: 3,
    });
    expect(h.state.functionApps[0]).toMatchObject({
      id: 'function-app-2',
      planId: 'function-plan-1',
      runtime: 'node22',
      functionsVersion: '~4',
      instanceMemoryMB: 2048,
    });
    expect(h.state.functionPlans[0]).toMatchObject({
      ownerAppId: 'function-app-2',
      sku: 'FC1',
      os: 'Linux',
      type: 'Microsoft.Web/serverfarms',
    });
    expect(dataReferences(h.state)).toEqual(
      expect.arrayContaining([
        { sourceId: 'function-app-2', targetId: 'storage-1' },
        { sourceId: 'function-app-2', targetId: 'container-1' },
      ]),
    );
  });
  test.each([
    { storageAccountId: 'missing' },
    { deploymentContainerId: 'missing' },
    { region: 'norwayeast' },
    { groupId: 'rg-other' },
    { runtime: 'node10' },
    { name: '-bad' },
    { planName: 'plan_invalid' },
  ])('invalid Function App dependency/profile %j produces no orphan plan', (extra) => {
    const h = harness();
    expect(h.run(fa(extra)).ok).toBe(false);
    expect(h.state.functionPlans).toEqual([]);
    expect(h.state.functionApps).toEqual([]);
    expect(h.nextId).toBe(1);
  });
  test('Web Apps and Function Apps cannot collide in the same modeled app namespace', () => {
    const h = harness();
    expect(h.run(fa({ name: 'WEB-APP' }))).toMatchObject({ ok: false, code: 'duplicate-name' });
  });
  test('Function plans cannot collide with an existing App Service plan in the same RG', () => {
    const h = harness({
      applicationPlans: [{ id: 'plan-existing', name: 'PLAN-FUNCTIONS', groupId: 'rg-app' }],
    });
    expect(h.run(fa())).toMatchObject({ ok: false, code: 'duplicate-name', field: 'planName' });
    expect(h.state.functionPlans).toEqual([]);
  });
  test('same-region private deployment container and storage profile are mandatory', () => {
    const h = harness({
      accounts: [
        {
          id: 'storage-1',
          groupId: 'rg-data',
          region: 'westeurope',
          kind: 'BlobStorage',
          sku: 'Premium_LRS',
        },
      ],
    });
    expect(h.run(fa())).toMatchObject({ ok: false, code: 'unsupported-profile' });
    const publicContainer = harness({
      containers: [{ id: 'container-1', accountId: 'storage-1', access: 'public' }],
    });
    expect(publicContainer.run(fa())).toMatchObject({ ok: false, code: 'unsupported-profile' });
  });
  test('HTTP template returns escaped-data-ready plain text without executing code', () => {
    const { h, functionId } = functionSetup(),
      text = '<script>throw "must not execute"</script>';
    const r = analyseFunctionInvocation(frozen(h.state), frozen(h.context()), identity, {
      functionId,
      trigger: 'http',
      method: 'POST',
      path: '/api/hello',
      transport: 'HTTPS',
      text,
    });
    expect(r).toMatchObject({
      ...identity,
      status: 'configuration-consistent',
      code: 'synthetic-template-evaluated',
      syntheticOutput: { contentType: 'text/plain', text },
    });
    expect(r.limitations.join(' ')).toContain('no JavaScript');
  });
  test.each([
    ['method', { method: 'GET' }, 'http-trigger-not-matched'],
    ['path', { path: '/hello' }, 'http-trigger-not-matched'],
    ['transport', { transport: 'HTTP' }, 'https-required'],
  ])('HTTP %s mismatch is a concrete configuration denial', (_, extra, code) => {
    const { h, functionId } = functionSetup();
    expect(
      analyseFunctionInvocation(h.state, h.context(), identity, {
        functionId,
        trigger: 'http',
        method: 'POST',
        path: '/api/hello',
        transport: 'HTTPS',
        text: '',
        ...extra,
      }),
    ).toMatchObject({ status: 'denied-by-configuration', code, syntheticOutput: null });
  });
  test('Update changes future output but keeps identity/create origin and old state immutable', () => {
    const { h, functionId } = functionSetup(),
      original = structuredClone(h.state),
      origin = h.state.functions[0]!.origin;
    expect(
      h.run({
        type: 'UpdateFunction',
        functionId,
        enabled: 'true',
        method: 'GET',
        route: '/hello',
        containerId: '',
        behavior: 'static-text',
        responseText: 'new synthetic config',
      }),
    ).toMatchObject({ ok: true, updatedIds: [functionId] });
    expect(h.state.functions[0]).toMatchObject({ id: functionId, origin });
    expect(original.functions[0]!.trigger).toMatchObject({ method: 'POST' });
    expect(
      analyseFunctionInvocation(
        h.state,
        h.context(),
        { ...identity, revision: 13 },
        {
          functionId,
          trigger: 'http',
          method: 'GET',
          path: '/api/hello',
          transport: 'HTTPS',
          text: 'ignored',
        },
      ),
    ).toMatchObject({ revision: 13, syntheticOutput: { text: 'new synthetic config' } });
  });
  test('disabled declarations/app or missing backing resource never fabricate invocation success', () => {
    const { h, appId, functionId } = functionSetup(),
      input = {
        functionId,
        trigger: 'http' as const,
        method: 'POST',
        path: '/api/hello',
        transport: 'HTTPS',
        text: '',
      };
    h.run({ type: 'UpdateFunctionApp', appId, enabled: 'false', publicNetworkAccess: 'Enabled' });
    expect(analyseFunctionInvocation(h.state, h.context(), identity, input)).toMatchObject({
      status: 'denied-by-configuration',
      code: 'function-app-disabled',
      syntheticOutput: null,
    });
    h.run({ type: 'UpdateFunctionApp', appId, enabled: 'true', publicNetworkAccess: 'Disabled' });
    expect(analyseFunctionInvocation(h.state, h.context(), identity, input)).toMatchObject({
      status: 'denied-by-configuration',
      code: 'public-endpoint-disabled',
    });
    expect(
      analyseFunctionInvocation(h.state, { ...h.context(), accounts: [] }, identity, input),
    ).toMatchObject({ status: 'undetermined', code: 'required-storage-or-plan-missing' });
  });
  test('blob-event evaluates only the explicitly selected real modeled blob/container', () => {
    const h = harness(),
      appId = h.create(fa());
    const functionId = h.create({
      type: 'CreateFunction',
      appId,
      name: 'onblob',
      trigger: 'blob-event',
      method: '',
      route: '',
      containerId: 'container-2',
      behavior: 'echo-text',
      responseText: '',
    });
    const r = analyseFunctionInvocation(h.state, h.context(), identity, {
      functionId,
      trigger: 'blob-event',
      blobId: 'blob-1',
    });
    expect(r).toMatchObject({
      status: 'configuration-consistent',
      syntheticOutput: { text: '<script>alert("text")</script>' },
    });
    expect(r.facts).toContainEqual({ name: 'eventDelivery', value: 'not-performed' });
    expect(
      analyseFunctionInvocation(h.state, h.context(), identity, {
        functionId,
        trigger: 'blob-event',
        blobId: 'absent',
      }),
    ).toMatchObject({ status: 'undetermined', syntheticOutput: null });
    const wrong = {
      ...h.context(),
      blobs: [{ id: 'blob-1', containerId: 'container-1', text: 'wrong source' }],
    };
    expect(
      analyseFunctionInvocation(h.state, wrong, identity, {
        functionId,
        trigger: 'blob-event',
        blobId: 'blob-1',
      }),
    ).toMatchObject({
      status: 'denied-by-configuration',
      code: 'blob-event-source-not-matched',
      syntheticOutput: null,
    });
  });
  test('explicit child removal precedes app/owned-plan deletion, with no resource ID reuse', () => {
    const { h, appId, functionId } = functionSetup();
    expect(h.run({ type: 'DeleteFunctionApp', appId })).toMatchObject({
      ok: false,
      code: 'cascade-delete-unsupported',
    });
    expect(h.run({ type: 'DeleteFunction', functionId })).toMatchObject({
      ok: true,
      removedIds: [functionId],
    });
    expect(h.run({ type: 'DeleteFunctionApp', appId })).toMatchObject({
      ok: true,
      removedIds: [appId, 'function-plan-1'],
    });
    expect(h.state.functionPlans).toEqual([]);
    expect(h.state.functionApps).toEqual([]);
    expect(h.create(fa())).not.toBe(appId);
  });
  test('route/name conflicts and unsupported auth/code fields are rejected', () => {
    const { h, appId } = functionSetup();
    const c = {
      type: 'CreateFunction',
      appId,
      name: 'another',
      trigger: 'http',
      method: 'POST',
      route: '/hello',
      containerId: '',
      behavior: 'echo-text',
      responseText: '',
    } as const;
    expect(h.run(c)).toMatchObject({ ok: false, code: 'duplicate-name', field: 'route' });
    expect(
      h.run({ ...c, route: '/different', authLevel: 'function' } as DataCommand),
    ).toMatchObject({ ok: false, code: 'unsupported-field', field: 'authLevel' });
    expect(
      h.run({ ...c, route: '/different', code: 'fetch("external")' } as DataCommand),
    ).toMatchObject({ ok: false, code: 'unsupported-field', field: 'code' });
  });
  test('analysis rejects extra credential/key/payload fields rather than interpreting them', () => {
    const { h, functionId } = functionSetup(),
      before = JSON.stringify(h.state);
    const result = analyseFunctionInvocation(h.state, h.context(), identity, {
      functionId,
      trigger: 'http',
      method: 'POST',
      path: '/api/hello',
      transport: 'HTTPS',
      text: '',
      code: 'key',
    } as never);
    expect(result).toMatchObject({
      status: 'unsupported',
      code: 'invalid-analysis-input',
      syntheticOutput: null,
    });
    expect(JSON.stringify(h.state)).toBe(before);
  });
});
