import { afterAll, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Client, Pool } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { canonical, replay, type Model, type Snapshot, type Request } from './laboratory/engine';
import { laboratoryModel, type Command, type World } from './laboratory/v39/contract';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL!,
  adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL!;
if (
  !url ||
  !adminUrl ||
  ![url, adminUrl].every(
    (s) =>
      ['localhost', '127.0.0.1'].includes(new URL(s).hostname) &&
      new URL(s).pathname.startsWith('/azurelab_lab_test_'),
  )
)
  throw Error('Dedicated isolated local test database required');
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
afterAll(async () => {
  await pool.end();
});
const active = (snapshot: Snapshot): World => {
  expect(snapshot.world.model).toBe(laboratoryModel);
  return snapshot.world as unknown as World;
};
async function run(token: string, command: Command) {
  const s = await repo.read(token);
  return repo.command(
    token,
    {
      commandId: randomUUID(),
      expectedRevision: s.world.revision,
      command: command as Request['command'],
    },
    s.workspace,
  );
}
async function ready() {
  const session = await repo.createSession(laboratoryModel as Model);
  const snapshot = await run(session.token, {
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-integrated',
    metadataRegion: 'norwayeast',
  });
  return { ...session, snapshot };
}
const plan = (groupId: string, name = 'hosting'): Command => ({
  type: 'CreateAppServicePlan',
  groupId,
  name,
  region: 'norwayeast',
  os: 'Linux',
  sku: 'B1',
});
const pg = (groupId: string, name = 'chain-postgres'): Command => ({
  type: 'CreatePostgresServer',
  groupId,
  name,
  region: 'norwayeast',
  version: '16',
  sku: 'Standard_B1ms',
  storageGiB: '32',
  publicNetworkAccess: 'Enabled',
});
it('real3.9 PostgreSQL commits one app/database/typed-binding/delivery chain with exact original receipt and through replay', async () => {
  const a = await ready(),
    groupId = active(a.snapshot).groups[0]!.id;
  let s = await run(a.token, plan(groupId));
  s = await run(a.token, {
    type: 'CreateWebApp',
    groupId,
    name: 'integrated-app',
    planId: active(s).plans[0]!.id,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  });
  const appId = active(s).webApps[0]!.id;
  await run(a.token, {
    type: 'DeploySyntheticApplication',
    webAppId: appId,
    template: 'api',
    healthPath: '/health',
    responseStatus: '200',
  });
  s = await run(a.token, pg(groupId));
  s = await run(a.token, {
    type: 'CreatePostgresDatabase',
    serverId: active(s).data.postgresServers[0]!.id,
    name: 'appdata',
    charset: 'UTF8',
  });
  const database = active(s).data.postgresDatabases[0]!;
  await run(a.token, {
    type: 'CreateDatabaseConnection',
    appId,
    databaseId: database.id,
    databaseType: database.type,
    settingName: 'APP_DATABASE',
    tls: '1.2',
  });
  s = await run(a.token, {
    type: 'CreateFrontDoor',
    groupId,
    name: 'integrated-edge',
    sku: 'Standard_AzureFrontDoor',
  });
  const profileId = active(s).delivery.frontDoors[0]!.id;
  await run(a.token, {
    type: 'CreateFrontDoorEndpoint',
    profileId,
    name: 'public-endpoint',
    enabled: 'true',
  });
  s = await run(a.token, {
    type: 'CreateOriginGroup',
    profileId,
    name: 'origins',
    probePath: '/health',
  });
  const originGroupId = active(s).delivery.originGroups[0]!.id;
  s = await run(a.token, {
    type: 'CreateFrontDoorOrigin',
    originGroupId,
    name: 'real-app-origin',
    webAppId: appId,
    enabled: 'true',
    priority: '1',
  });
  s = await run(a.token, {
    type: 'CreateFrontDoorRoute',
    endpointId: active(s).delivery.frontDoorEndpoints[0]!.id,
    name: 'default-route',
    originGroupId,
    pattern: '/*',
    enabled: 'true',
  });
  expect(s.entries.every((e) => e.receipt.outcome === 'accepted')).toBe(true);
  const original = await repo.read(a.token),
    before = canonical(original.world);
  expect((await run(a.token, { type: 'DeleteWebApp', webAppId: appId })).receipt.code).toBe(
    'resource-in-use',
  );
  expect(canonical((await repo.read(a.token)).world)).toBe(before);
  expect(replay(s.entries, laboratoryModel as Model)).toEqual(s.world);
  expect((await repo.read(a.token, 4)).world).toEqual(
    replay(s.entries, laboratoryModel as Model, 4),
  );
  const stored = await pool.query(
    'SELECT request,receipt FROM laboratory_v3.events WHERE workspace_id=$1 ORDER BY sequence',
    [s.workspace],
  );
  expect(stored.rows).toEqual(
    (await repo.read(a.token)).entries.map(({ request, receipt }) => ({ request, receipt })),
  );
});
it('real3.9 serializes cross-family writers and redelivers stale original IDs before re-evaluation without duplicate events', async () => {
  const a = await ready(),
    groupId = active(a.snapshot).groups[0]!.id;
  const requests = [plan(groupId), pg(groupId)].map((command) => ({
    commandId: randomUUID(),
    expectedRevision: a.snapshot.world.revision,
    command: command as Request['command'],
  }));
  const results = await Promise.all(
    requests.map((request) => repo.command(a.token, request, a.snapshot.workspace)),
  );
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const accepted = results.find((r) => r.receipt.outcome === 'accepted')!,
    request = requests.find((r) => r.commandId === accepted.receipt.commandId)!;
  const before = await repo.read(a.token);
  const redelivered = await repo.command(a.token, request, before.workspace);
  expect(redelivered.redelivered).toBe(true);
  expect(redelivered.receipt).toEqual(accepted.receipt);
  expect(await repo.read(a.token)).toEqual(before);
  await expect(
    repo.command(
      a.token,
      { ...request, command: plan(groupId, 'collision') as Request['command'] },
      before.workspace,
    ),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  const reviewed = {
    commandId: randomUUID(),
    expectedRevision: before.world.revision,
    command: plan(groupId, 'stale-review') as Request['command'],
  };
  expect((await repo.review(a.token, reviewed, before.workspace)).preview.outcome).toBe('accepted');
  await run(a.token, plan(groupId, 'competing-plan'));
  expect((await repo.command(a.token, reviewed, before.workspace)).receipt.code).toBe(
    'stale-revision',
  );
});
it('real3.9 rollback, ownership and immutable SQL receipts fail closed and reset retains original through history', async () => {
  const a = await ready(),
    foreign = await ready(),
    before = await repo.read(a.token);
  const request = {
    commandId: randomUUID(),
    expectedRevision: before.world.revision,
    command: pg(active(before).groups[0]!.id) as Request['command'],
  };
  const broken = new Repository(pool, () => {
    throw Error('integrated-before-commit');
  });
  await expect(broken.command(a.token, request, before.workspace)).rejects.toThrow(
    'integrated-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(before);
  await expect(repo.command(foreign.token, request, before.workspace)).rejects.toMatchObject({
    code: 'workspace-changed',
  });
  const made = await repo.command(a.token, request, before.workspace),
    server = active(made).data.postgresServers[0]!;
  const changed = await run(a.token, {
    type: 'UpdatePostgresServer',
    serverId: server.id,
    storageGiB: '64',
    publicNetworkAccess: 'Disabled',
  });
  expect(changed.receipt.integrationChange).toMatchObject({
    createOrigin: server.origin,
    before: { storageGiB: 32 },
    after: { storageGiB: 64 },
  });
  await expect(
    pool.query("UPDATE laboratory_v3.events SET receipt='{}'::jsonb WHERE workspace_id=$1", [
      made.workspace,
    ]),
  ).rejects.toThrow();
  const reset = await run(a.token, { type: 'ResetWorkspace' });
  expect(active(reset).data.postgresServers).toEqual([]);
  expect(active(reset).nextId).toBe(active(changed).nextId);
  expect((await repo.read(a.token, changed.entries.length)).world).toEqual(changed.world);
  expect(replay(reset.entries, laboratoryModel as Model)).toEqual(reset.world);
});
it('real3.9 Storage dependency rejection, empty deletes and original redelivery survive transaction rollback', async () => {
  const a = await ready(),
    groupId = active(a.snapshot).groups[0]!.id;
  let s = await run(a.token, {
    type: 'CreateStorageAccount',
    groupId,
    name: 'functionstorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const account = active(s).accounts[0]!;
  s = await run(a.token, {
    type: 'CreateBlobContainer',
    accountId: account.id,
    name: 'deployment',
    access: 'private',
  });
  const container = active(s).containers[0]!;
  s = await run(a.token, {
    type: 'CreateFunctionApp',
    groupId,
    name: 'storage-functions',
    region: 'norwayeast',
    planName: 'storage-hosting',
    storageAccountId: account.id,
    deploymentContainerId: container.id,
    runtime: 'node22',
    publicNetworkAccess: 'Enabled',
  });
  const before = canonical(s.world);
  expect(
    (await run(a.token, { type: 'DeleteBlobContainer', containerId: container.id })).receipt.code,
  ).toBe('resource-in-use');
  expect(canonical((await repo.read(a.token)).world)).toBe(before);
  s = await run(a.token, { type: 'DeleteFunctionApp', appId: active(s).data.functionApps[0]!.id });
  const request = {
    commandId: randomUUID(),
    expectedRevision: s.world.revision,
    command: { type: 'DeleteBlobContainer', containerId: container.id } as Request['command'],
  };
  const broken = new Repository(pool, () => {
    throw Error('delete-before-commit');
  });
  await expect(broken.command(a.token, request, s.workspace)).rejects.toThrow(
    'delete-before-commit',
  );
  expect((await repo.read(a.token)).world).toEqual(s.world);
  const deleted = await repo.command(a.token, request, s.workspace);
  expect(deleted.receipt.integrationChange?.createOrigin).toBe(container.origin);
  expect((await repo.command(a.token, request, s.workspace)).receipt).toEqual(deleted.receipt);
  expect(
    (await run(a.token, { type: 'DeleteStorageAccount', accountId: account.id })).receipt.outcome,
  ).toBe('accepted');
});
it('real3.9 JSONB preserves deterministic unsupported empty and reordered unknown Storage lifecycle fields without deletion', async () => {
  const a = await ready(),
    groupId = active(a.snapshot).groups[0]!.id;
  let s = await run(a.token, {
    type: 'CreateStorageAccount',
    groupId,
    name: 'emptyaccount',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const accountId = active(s).accounts[0]!.id;
  s = await run(a.token, {
    type: 'CreateStorageAccount',
    groupId,
    name: 'containeraccount',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  s = await run(a.token, {
    type: 'CreateBlobContainer',
    accountId: active(s).accounts[1]!.id,
    name: 'empty-container',
    access: 'private',
  });
  const before = canonical(s.world);
  for (const command of [
    { type: 'DeleteStorageAccount', accountId },
    { type: 'DeleteBlobContainer', containerId: active(s).containers[0]!.id },
  ]) {
    for (const extra of [
      { '': 'unknown' },
      { z: 'unknown', a: 'unknown' },
      { a: 'unknown', z: 'unknown' },
    ]) {
      const made = await run(a.token, { ...command, ...extra } as Command);
      expect(made.receipt).toMatchObject({
        outcome: 'unsupported',
        code: 'unsupported-field',
        field: Object.hasOwn(extra, '') ? '' : 'a',
        removedIds: [],
      });
      expect(canonical(made.world)).toBe(before);
      expect(canonical((await repo.read(a.token)).world)).toBe(before);
    }
  }
  const stored = await repo.read(a.token);
  expect(canonical(replay(stored.entries, laboratoryModel as Model))).toBe(before);
  const jsonb = (
    await pool.query(
      'SELECT request,receipt FROM laboratory_v3.events WHERE workspace_id=$1 ORDER BY sequence',
      [s.workspace],
    )
  ).rows;
  expect(jsonb).toEqual(stored.entries.map(({ request, receipt }) => ({ request, receipt })));
});
it('real isolated3.9 JSONB HTTP Function no-op cannot commit a false update or make original history unverifiable', async () => {
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  const name = 'azurelab_lab_test_integrated_noop_' + randomUUID().replaceAll('-', '').slice(0, 10);
  await admin.query(`CREATE DATABASE "${name}"`);
  const ownUrl = new URL(adminUrl),
    runtimeUrl = new URL(url);
  ownUrl.pathname = '/' + name;
  runtimeUrl.pathname = '/' + name;
  const owner = new Client({ connectionString: ownUrl.href }),
    runtime = new Pool({ connectionString: runtimeUrl.href, max: 3 });
  await owner.connect();
  try {
    for (const file of ['001.sql', '002-networking.sql', '010-integrated-application-chain.sql'])
      await owner.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
    const local = new Repository(runtime),
      session = await local.createSession(laboratoryModel as Model);
    let snapshot = session.snapshot;
    const localRun = async (command: Command) => {
      const result = await local.command(
        session.token,
        {
          commandId: randomUUID(),
          expectedRevision: snapshot.world.revision,
          command: command as Request['command'],
        },
        snapshot.workspace,
      );
      snapshot = result;
      return result;
    };
    await localRun({
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-jsonb-noop',
      metadataRegion: 'norwayeast',
    });
    const groupId = snapshot.world.groups[0]!.id;
    await localRun({
      type: 'CreateStorageAccount',
      groupId,
      name: 'jsonbnoopstorage',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    await localRun({
      type: 'CreateBlobContainer',
      accountId: active(snapshot).accounts[0]!.id,
      name: 'deployment',
      access: 'private',
    });
    await localRun({
      type: 'CreateFunctionApp',
      groupId,
      name: 'jsonb-noop-app',
      region: 'norwayeast',
      planName: 'jsonb-noop-plan',
      storageAccountId: active(snapshot).accounts[0]!.id,
      deploymentContainerId: active(snapshot).containers[0]!.id,
      runtime: 'node22',
      publicNetworkAccess: 'Enabled',
    });
    await localRun({
      type: 'CreateFunction',
      appId: active(snapshot).data.functionApps[0]!.id,
      name: 'http-noop',
      trigger: 'http',
      method: 'GET',
      route: '/hello',
      containerId: '',
      behavior: 'static-text',
      responseText: 'Synthetic HTTP output',
    });
    const before = await local.read(session.token),
      f = active(before).data.functions[0]!;
    const request: Request = {
      commandId: randomUUID(),
      expectedRevision: before.world.revision,
      command: {
        type: 'UpdateFunction',
        functionId: f.id,
        enabled: String(f.enabled),
        method: 'GET',
        route: '/hello',
        containerId: '',
        behavior: f.behavior,
        responseText: f.responseText,
      } as Request['command'],
    };
    const reviewed = await local.review(session.token, request, before.workspace);
    const made = await local.command(session.token, request, before.workspace);
    let reread: Snapshot | undefined, readError: { code?: string; status?: number } | undefined;
    try {
      reread = await local.read(session.token);
    } catch (error) {
      readError = error as { code?: string; status?: number };
    }
    if (made.receipt.code !== 'no-change' || readError)
      console.info(
        'JSONB_HTTP_FUNCTION_NOOP_WITNESS',
        JSON.stringify({
          request,
          receipt: made.receipt,
          triggerKeysBefore: Object.keys(f.trigger),
          beforeRevision: before.world.revision,
          afterRevision: made.world.revision,
          beforeNextId: active(before).nextId,
          afterNextId: active(made).nextId,
          nextReadError: readError ? { code: readError.code, status: readError.status } : null,
        }),
      );
    expect(made.receipt).toMatchObject({
      outcome: 'rejected',
      code: 'no-change',
      beforeRevision: before.world.revision,
      afterRevision: before.world.revision,
      addedIds: [],
      updatedIds: [],
      removedIds: [],
    });
    expect(reviewed.preview).toEqual(made.receipt);
    expect(made.world).toEqual(before.world);
    expect(readError).toBeUndefined();
    expect(reread?.world).toEqual(before.world);
    expect(replay(made.entries, laboratoryModel as Model)).toEqual(made.world);
    expect((await local.read(session.token, before.entries.length)).world).toEqual(before.world);
    expect((await local.command(session.token, request, before.workspace)).receipt).toEqual(
      made.receipt,
    );
    expect(active(made).data.functions[0]!.origin).toBe(f.origin);
  } finally {
    await runtime.end();
    await owner.end();
    await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1', [
      name,
    ]);
    await admin.query(`DROP DATABASE "${name}"`);
    await admin.end();
  }
});
it.each(['cold', 'populated3.8'] as const)(
  '010 additive %s and repeated001/002/010 preserve historical payloads and admit explicit3.9',
  async (kind) => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const name = 'azurelab_lab_test_integrated_' + randomUUID().replaceAll('-', '').slice(0, 10);
    await admin.query(`CREATE DATABASE "${name}"`);
    const ownUrl = new URL(adminUrl),
      runtimeUrl = new URL(url);
    ownUrl.pathname = '/' + name;
    runtimeUrl.pathname = '/' + name;
    const owner = new Client({ connectionString: ownUrl.href }),
      runtime = new Pool({ connectionString: runtimeUrl.href, max: 3 });
    await owner.connect();
    try {
      for (const file of [
        '001.sql',
        '002-networking.sql',
        ...(kind === 'populated3.8' ? ['009-application-platform.sql'] : []),
      ])
        await owner.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
      const local = new Repository(runtime),
        saved: { token: string; snapshot: Snapshot }[] = [];
      const models: Model[] =
        kind === 'populated3.8'
          ? [
              'laboratory@3.0.0',
              'laboratory@3.1.0',
              'laboratory@3.2.0',
              'laboratory@3.3.0',
              'laboratory@3.4.0',
              'laboratory@3.5.0',
              'laboratory@3.6.0',
              'laboratory@3.7.0',
              'laboratory@3.8.0',
            ]
          : ['laboratory@3.0.0', 'laboratory@3.1.0'];
      for (const model of models) {
        const session = await local.createSession(model);
        const snapshot = await local.command(
          session.token,
          {
            commandId: randomUUID(),
            expectedRevision: 0,
            command: {
              type: 'CreateGroup',
              subscriptionId: 'sub-shared',
              name: 'historical',
              metadataRegion: 'norwayeast',
            },
          },
          session.snapshot.workspace,
        );
        saved.push({
          token: session.token,
          snapshot: {
            workspace: snapshot.workspace,
            world: snapshot.world,
            entries: snapshot.entries,
            historical: snapshot.historical,
          },
        });
      }
      const before = (
        await owner.query(
          'SELECT workspace_id,model,request,receipt FROM laboratory_v3.events ORDER BY workspace_id,sequence',
        )
      ).rows;
      await owner.query(
        readFileSync('database/laboratory-v3/010-integrated-application-chain.sql', 'utf8'),
      );
      const latest = await local.createSession(laboratoryModel as Model);
      const made = await local.command(
        latest.token,
        {
          commandId: randomUUID(),
          expectedRevision: 0,
          command: {
            type: 'CreateGroup',
            subscriptionId: 'sub-app',
            name: 'integrated',
            metadataRegion: 'norwayeast',
          },
        },
        latest.snapshot.workspace,
      );
      for (const file of ['001.sql', '002-networking.sql', '010-integrated-application-chain.sql'])
        await owner.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
      for (const savedSession of saved)
        expect(await local.read(savedSession.token)).toEqual(savedSession.snapshot);
      expect(await local.read(latest.token)).toEqual({
        workspace: made.workspace,
        world: made.world,
        entries: made.entries,
        historical: made.historical,
      });
      const after = (
        await owner.query(
          'SELECT workspace_id,model,request,receipt FROM laboratory_v3.events WHERE workspace_id<>$1 ORDER BY workspace_id,sequence',
          [latest.snapshot.workspace],
        )
      ).rows;
      expect(after).toEqual(before);
      await expect(
        owner.query('UPDATE laboratory_v3.workspaces SET model=$1 WHERE id=$2', [
          'laboratory@3.9.0',
          saved[0]!.snapshot.workspace,
        ]),
      ).rejects.toThrow();
    } finally {
      await runtime.end();
      await owner.end();
      await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1', [
        name,
      ]);
      await admin.query(`DROP DATABASE "${name}"`);
      await admin.end();
    }
  },
);
