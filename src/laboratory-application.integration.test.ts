import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { canonical, replay, type Request, type Model } from './laboratory/engine';
import { laboratoryModel } from './laboratory/v38/contract';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL!,
  adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL!;
if (
  !url ||
  !adminUrl ||
  ![url, adminUrl].every(
    (s) =>
      ['127.0.0.1', 'localhost'].includes(new URL(s).hostname) &&
      new URL(s).pathname.startsWith('/azurelab_lab_test_'),
  )
)
  throw Error('Dedicated isolated local test database required');
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
afterAll(async () => {
  await pool.end();
});
async function ready() {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, {
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-app',
    metadataRegion: 'norwayeast',
  });
  return a;
}
async function run(token: string, command: Request['command']) {
  const s = await repo.read(token);
  return repo.command(
    token,
    { commandId: randomUUID(), expectedRevision: s.world.revision, command },
    s.workspace,
  );
}
const plan = (name = 'plan'): Request['command'] => ({
  type: 'CreateAppServicePlan',
  groupId: 'group-1',
  name,
  region: 'norwayeast',
  os: 'Linux',
  sku: 'B1',
});
it('real3.8 PostgreSQL serializes competing writers, redelivers original receipt and rejects same ID/different request', async () => {
  const a = await ready(),
    before = await repo.read(a.token),
    requests = ['plan-a', 'plan-b'].map((n) => ({
      commandId: randomUUID(),
      expectedRevision: before.world.revision,
      command: plan(n),
    }));
  const results = await Promise.all(
    requests.map((r) => repo.command(a.token, r, before.workspace)),
  );
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const winner = results.find((r) => r.receipt.outcome === 'accepted')!,
    request = requests.find((r) => r.commandId === winner.receipt.commandId)!;
  const after = await repo.read(a.token);
  expect(after.world.revision).toBe(before.world.revision + 1);
  expect(after.world.model === laboratoryModel && after.world.plans).toHaveLength(1);
  expect((await repo.command(a.token, request, before.workspace)).receipt).toEqual(winner.receipt);
  expect(await repo.read(a.token)).toEqual(after);
  await expect(
    repo.command(a.token, { ...request, command: plan('different') }, before.workspace),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  expect(replay(after.entries, laboratoryModel)).toEqual(after.world);
});
it('actual rollback leaves no positive receipt, original SQL receipt is immutable and sessions are isolated', async () => {
  const a = await ready(),
    foreign = await ready(),
    before = await repo.read(a.token),
    request = { commandId: randomUUID(), expectedRevision: before.world.revision, command: plan() };
  const broken = new Repository(pool, () => {
    throw Error('application-before-commit');
  });
  await expect(broken.command(a.token, request, before.workspace)).rejects.toThrow(
    'application-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(before);
  await expect(repo.command(foreign.token, request, before.workspace)).rejects.toMatchObject({
    code: 'workspace-changed',
  });
  const created = await repo.command(a.token, request, before.workspace);
  expect(
    (
      await pool.query(
        'SELECT receipt FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
        [before.workspace, request.commandId],
      )
    ).rows[0].receipt,
  ).toEqual(created.receipt);
  await expect(
    pool.query("UPDATE laboratory_v3.events SET receipt='{}'::jsonb WHERE workspace_id=$1", [
      before.workspace,
    ]),
  ).rejects.toThrow();
  expect((await repo.read(foreign.token)).entries).toHaveLength(1);
});
it('stores exact stable app/settings changes, through-before/delete/reset and canonical adversarial denials after JSONB', async () => {
  const a = await ready();
  await run(a.token, plan());
  await run(a.token, {
    type: 'CreateWebApp',
    groupId: 'group-1',
    name: 'app-db',
    planId: 'app-plan-2',
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  });
  const original = await repo.read(a.token),
    id = 'web-app-3';
  for (const extra of [{ z: 'last', a: 'first' }, { a: 'first', z: 'last' }, { '': 'bad' }]) {
    const result = await run(a.token, {
      type: 'UpdateWebApp',
      webAppId: id,
      runtime: 'NODE|24-lts',
      httpsOnly: 'true',
      publicNetworkAccess: 'Disabled',
      enabled: 'true',
      ...extra,
    } as Request['command']);
    expect(result.receipt.outcome).toBe('unsupported');
    expect((await repo.read(a.token)).world).toEqual(original.world);
  }
  const updated = await run(a.token, {
    type: 'UpdateWebApp',
    webAppId: id,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Disabled',
    enabled: 'false',
  });
  expect(updated.receipt.applicationChange).toMatchObject({
    id,
    createOrigin: original.world.model === laboratoryModel ? original.world.webApps[0]!.origin : '',
  });
  expect((await repo.read(a.token, original.entries.length)).world).toEqual(original.world);
  await run(a.token, { type: 'DeleteWebApp', webAppId: id });
  const deleted = await repo.read(a.token);
  expect(deleted.world.model === laboratoryModel && deleted.world.webApps).toEqual([]);
  await run(a.token, { type: 'ResetWorkspace' });
  const reset = await repo.read(a.token);
  expect(reset.world.model === laboratoryModel && reset.world.plans).toEqual([]);
  expect((await repo.read(a.token, updated.receipt.sequence)).world).toEqual(updated.world);
  expect(replay(reset.entries, laboratoryModel)).toEqual(reset.world);
});
it.each(['cold', 'historical3.7'] as const)(
  '009 additive %s install retains old workspaces and supports repeated setup without narrowing',
  async (kind) => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const name = 'azurelab_lab_test_application_' + randomUUID().replaceAll('-', '').slice(0, 10);
    await admin.query(`CREATE DATABASE "${name}"`);
    const own = new URL(adminUrl),
      runtime = new URL(url);
    own.pathname = '/' + name;
    runtime.pathname = '/' + name;
    const owner = new Client({ connectionString: own.href }),
      rp = new Pool({ connectionString: runtime.href, max: 3 });
    await owner.connect();
    try {
      for (const f of [
        '001.sql',
        '002-networking.sql',
        ...(kind === 'historical3.7' ? ['008-topology-remediation.sql'] : []),
      ])
        await owner.query(readFileSync('database/laboratory-v3/' + f, 'utf8'));
      const rr = new Repository(rp),
        saved = [];
      const oldModels: Model[] =
        kind === 'historical3.7'
          ? [
              'laboratory@3.0.0',
              'laboratory@3.1.0',
              'laboratory@3.2.0',
              'laboratory@3.3.0',
              'laboratory@3.4.0',
              'laboratory@3.5.0',
              'laboratory@3.6.0',
              'laboratory@3.7.0',
            ]
          : ['laboratory@3.0.0', 'laboratory@3.1.0'];
      for (const model of oldModels) {
        const a = await rr.createSession(model);
        await rr.command(
          a.token,
          {
            commandId: randomUUID(),
            expectedRevision: 0,
            command: {
              type: 'CreateGroup',
              subscriptionId: 'sub-shared',
              name: 'preserved',
              metadataRegion: 'norwayeast',
            },
          },
          a.snapshot.workspace,
        );
        saved.push({ token: a.token, snapshot: await rr.read(a.token) });
      }
      const before = (
        await owner.query('SELECT id,model,world FROM laboratory_v3.workspaces ORDER BY id')
      ).rows;
      await owner.query(
        readFileSync('database/laboratory-v3/009-application-platform.sql', 'utf8'),
      );
      for (const s of saved) expect(await rr.read(s.token)).toEqual(s.snapshot);
      expect(
        canonical(
          (await owner.query('SELECT id,model,world FROM laboratory_v3.workspaces ORDER BY id'))
            .rows,
        ),
      ).toBe(canonical(before));
      const current = await rr.createSession(laboratoryModel);
      expect(current.snapshot.world.model).toBe(laboratoryModel);
      for (const f of ['001.sql', '002-networking.sql', '009-application-platform.sql'])
        await owner.query(readFileSync('database/laboratory-v3/' + f, 'utf8'));
      expect(await rr.read(current.token)).toEqual(current.snapshot);
      for (const s of saved) expect(await rr.read(s.token)).toEqual(s.snapshot);
    } finally {
      await rp.end();
      await owner.end();
      await admin.query(`DROP DATABASE "${name}" WITH (FORCE)`);
      await admin.end();
    }
  },
);
