import { describe, expect, test } from 'vitest';
import { dataCommandTypes } from '@/laboratory/data/domain';
import { dataTypes as T } from '@/laboratory/data/contract';
import { execute, freshWorld } from '@/laboratory/v39/domain';
import type { Command, World } from '@/laboratory/v39/contract';
import { dataFamilies } from './integrated-data';
import type { IntegratedResource } from './integrated-resource';

const operation = (type: string) => {
  const result = dataFamilies
    .flatMap((family) => family.operations)
    .find((row) => row.type === type);
  if (!result) throw Error(`Missing UI operation ${type}`);
  return result;
};
const configured = (type: string, world: World, resource?: IntegratedResource) => {
  const defaults = operation(type).defaults;
  return typeof defaults === 'function' ? defaults(world, resource) : (defaults ?? {});
};
const metadataCommand = (
  type: string,
  world: World,
  input: Record<string, string> = {},
  resource?: IntegratedResource,
): Command => {
  const definition = operation(type),
    values = { ...configured(type, world, resource), ...input };
  return {
    type,
    ...Object.fromEntries(definition.fields.map((field) => [field, values[field] ?? ''])),
  } as Command;
};
function harness() {
  let world = freshWorld(),
    sequence = 0;
  const run = (command: Command) => {
    sequence++;
    const result = execute(
      world,
      { commandId: `data-ui-${sequence}`, expectedRevision: world.revision, command },
      sequence,
    );
    expect(result.receipt.outcome, JSON.stringify(result.receipt)).toBe('accepted');
    world = result.world;
    return result.receipt.addedIds;
  };
  const create = (type: string, input: Record<string, string> = {}) =>
    run(metadataCommand(type, world, input));
  const groupId = run({
    type: 'CreateGroup',
    name: 'rg-data-ui',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
  })[0]!;
  const accountId = run({
    type: 'CreateStorageAccount',
    groupId,
    name: 'datauistorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  })[0]!;
  const containerId = run({
    type: 'CreateBlobContainer',
    accountId,
    name: 'deployment',
    access: 'private',
  })[0]!;
  const planId = run({
    type: 'CreateAppServicePlan',
    groupId,
    name: 'plan-data-ui',
    region: 'norwayeast',
    os: 'Linux',
    sku: 'B1',
  })[0]!;
  const webAppId = run({
    type: 'CreateWebApp',
    groupId,
    name: 'app-data-ui',
    planId,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  })[0]!;
  return {
    get world() {
      return world;
    },
    run,
    create,
    groupId,
    accountId,
    containerId,
    webAppId,
  };
}

describe('integrated Data/Function controls', () => {
  test('exposes the exact supported command set and no independent FC1-plan mutation', () => {
    const supported = dataFamilies.flatMap((family) => family.operations.map((row) => row.type));
    expect(supported.toSorted()).toEqual([...dataCommandTypes].toSorted());
    expect(new Set(supported).size).toBe(supported.length);
    expect(dataFamilies.find((family) => family.view === 'functionPlan')?.operations).toEqual([]);
    expect(dataFamilies.map((family) => family.view)).toEqual([
      'postgresServer',
      'postgresDatabase',
      'sqlServer',
      'sqlDatabase',
      'databaseFirewallRule',
      'functionPlan',
      'functionApp',
      'function',
      'databaseConnection',
    ]);
  });

  test('uses actual typed database and application IDs and derives a changed target type', () => {
    const h = harness();
    h.create('CreatePostgresServer', { name: 'pg-data-ui' });
    const pgId = h.create('CreatePostgresDatabase', { name: 'appdb' })[0]!;
    h.create('CreateSqlServer', { name: 'sql-data-ui' });
    const sqlId = h.create('CreateSqlDatabase', { name: 'appdb' })[0]!;
    const definition = operation('CreateDatabaseConnection'),
      initial = configured(definition.type, h.world);
    expect(initial.appId).toBe(h.webAppId);
    expect(initial.databaseId).toBe(pgId);
    expect(initial.databaseType).toBe(T.postgresDatabase);
    expect(definition.options?.('appId', h.world)?.map(([id]) => id)).toEqual([h.webAppId]);
    expect(definition.options?.('databaseId', h.world)?.map(([id]) => id)).toEqual([pgId, sqlId]);
    const changed = definition.change!('databaseId', sqlId, initial, h.world);
    expect(changed.databaseType).toBe(T.sqlDatabase);
    expect(definition.lockedFields).toContain('databaseType');
    h.run(metadataCommand(definition.type, h.world, changed));
    const binding = dataFamilies
      .find((family) => family.view === 'databaseConnection')!
      .resources(h.world)[0]!;
    expect(binding.parentId).toBe(h.webAppId);
    expect(binding.source.database).toEqual({ id: sqlId, type: T.sqlDatabase });
    expect(configured('DeleteDatabaseConnection', h.world, binding).connectionId).toBe(binding.id);
  });

  test('keeps create on lists and binds every detail mutation to its stable selected target', () => {
    const targets: Record<string, string> = {
      postgresServer: 'serverId',
      postgresDatabase: 'databaseId',
      sqlServer: 'serverId',
      sqlDatabase: 'databaseId',
      databaseFirewallRule: 'ruleId',
      functionApp: 'appId',
      function: 'functionId',
      databaseConnection: 'connectionId',
    };
    for (const family of dataFamilies) {
      for (const definition of family.operations) {
        if (definition.type.startsWith('Create')) {
          expect(definition.availableIn).toBe('list');
        } else {
          expect(definition.availableIn).toBe('resource');
          expect(definition.lockedFields).toContain(targets[family.view]);
        }
      }
    }
    expect(operation('CreateDatabaseConnection').lockedFields).toContain('databaseType');
    expect(operation('UpdateDatabaseConnection').lockedFields).toContain('databaseType');
  });

  test('switches HTTP/blob inputs coherently and keeps Function storage selectors within the real parent', () => {
    const h = harness();
    const created = h.create('CreateFunctionApp', {
      name: 'functions-data-ui',
      planName: 'plan-functions-ui',
    });
    const appId = created.at(-1)!;
    expect(configured('CreateFunctionApp', h.world).storageAccountId).toBe(h.accountId);
    expect(configured('CreateFunctionApp', h.world).deploymentContainerId).toBe(h.containerId);
    const definition = operation('CreateFunction'),
      initial = configured(definition.type, h.world);
    expect(initial.appId).toBe(appId);
    expect(initial.trigger).toBe('http');
    expect(initial.containerId).toBe('');
    const blob = definition.change!('trigger', 'blob-event', initial, h.world);
    expect(blob).toMatchObject({ method: '', route: '', containerId: h.containerId });
    expect(
      definition.options?.('containerId', h.world, undefined, blob)?.map(([id]) => id),
    ).toEqual([h.containerId]);
    h.run(metadataCommand(definition.type, h.world, { ...blob, name: 'blob-handler' }));
    const http = definition.change!('trigger', 'http', blob, h.world);
    expect(http).toMatchObject({ method: 'GET', route: '/hello', containerId: '' });
    h.run(metadataCommand(definition.type, h.world, { ...http, name: 'http-handler' }));
    const functions = dataFamilies.find((family) => family.view === 'function')!.resources(h.world);
    expect(functions).toHaveLength(2);
    expect(functions.every((resource) => resource.parentId === appId)).toBe(true);
    const app = dataFamilies
        .find((family) => family.view === 'functionApp')!
        .resources(h.world)[0]!,
      plan = dataFamilies.find((family) => family.view === 'functionPlan')!.resources(h.world)[0]!;
    expect(app.parentId).toBe(h.groupId);
    expect(plan.parentId).toBe(h.groupId);
    expect(plan.source.ownerAppId).toBe(app.id);
    const blobFunction = functions.find(
      (resource) => recordTrigger(resource).kind === 'blob-event',
    )!;
    expect(configured('UpdateFunction', h.world, blobFunction)).toMatchObject({
      functionId: blobFunction.id,
      method: '',
      route: '',
      containerId: h.containerId,
    });
  });

  test('projects actual SQL/PG firewall types and database ARM parents without replacing origins', () => {
    const h = harness();
    const pgServerId = h.create('CreatePostgresServer', { name: 'pg-data-ui' })[0]!;
    h.create('CreatePostgresDatabase', { name: 'pgdb' });
    const sqlServerId = h.create('CreateSqlServer', { name: 'sql-data-ui' })[0]!;
    h.create('CreateSqlDatabase', { name: 'sqldb' });
    h.create('CreateDatabaseFirewallRule', { serverId: pgServerId, name: 'allow-pg' });
    h.create('CreateDatabaseFirewallRule', { serverId: sqlServerId, name: 'allow-sql' });
    const rules = dataFamilies
      .find((family) => family.view === 'databaseFirewallRule')!
      .resources(h.world);
    expect(rules.map((rule) => rule.type)).toEqual([T.postgresFirewallRule, T.sqlFirewallRule]);
    expect(rules.map((rule) => rule.parentId)).toEqual([pgServerId, sqlServerId]);
    for (const family of dataFamilies.filter(
      (row) => row.view === 'postgresDatabase' || row.view === 'sqlDatabase',
    )) {
      const resource = family.resources(h.world)[0]!;
      expect(resource.parentId).toBe(resource.source.serverId);
      expect(resource.origin).toBe(resource.source.origin);
    }
  });
});

const recordTrigger = (resource: IntegratedResource) => resource.source.trigger as { kind: string };
