import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { canonical, replay } from './laboratory/engine';
import { laboratoryModel, type Command } from './laboratory/v32/contract';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL;
if (
  !url ||
  !new URL(url).pathname.startsWith('/azurelab_lab_test_') ||
  !['localhost', '127.0.0.1'].includes(new URL(url).hostname)
)
  throw Error('Dedicated local test database required');
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
afterAll(async () => {
  await pool.end();
  vi.unstubAllEnvs();
});
const group: Command = {
  type: 'CreateGroup',
  name: 'rg-routing',
  subscriptionId: 'sub-shared',
  metadataRegion: 'norwayeast',
};
async function run(token: string, command: Command) {
  const s = await repo.read(token);
  return repo.command(
    token,
    { commandId: randomUUID(), expectedRevision: s.world.revision, command },
    s.workspace,
  );
}
async function ready() {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, group);
  for (const [name, addressSpace] of [
    ['vnet-hub', '10.0.0.0/16'],
    ['vnet-app', '10.10.0.0/16'],
  ])
    await run(a.token, {
      type: 'CreateVirtualNetwork',
      groupId: 'group-1',
      name: name!,
      region: 'norwayeast',
      addressSpace: addressSpace!,
    });
  await run(a.token, {
    type: 'CreateSubnet',
    vnetId: 'vnet-2',
    name: 'snet-shared',
    addressPrefix: '10.0.1.0/24',
  });
  return a;
}
it('commits peering, routes, explicit reassignment, original receipts, historical through/reset and session isolation in PostgreSQL', async () => {
  const a = await ready(),
    b = await repo.createSession(laboratoryModel);
  await run(a.token, {
    type: 'CreateVnetPeering',
    vnetId: 'vnet-2',
    remoteVnetId: 'vnet-3',
    name: 'hub-app',
  });
  await run(a.token, {
    type: 'CreateVnetPeering',
    vnetId: 'vnet-3',
    remoteVnetId: 'vnet-2',
    name: 'app-hub',
  });
  const table = await run(a.token, {
      type: 'CreateRouteTable',
      groupId: 'group-1',
      region: 'norwayeast',
      name: 'rt-hub',
    }),
    tableId = table.receipt.addedIds[0]!;
  await run(a.token, {
    type: 'CreateRoute',
    routeTableId: tableId,
    name: 'discard-app',
    addressPrefix: '10.10.0.0/16',
    nextHopType: 'None',
  });
  const association = await run(a.token, {
    type: 'AssociateSubnetRouteTable',
    subnetId: 'subnet-4',
    routeTableId: tableId,
  });
  const before = await repo.read(a.token);
  expect(before.world.model).toBe(laboratoryModel);
  expect(replay(before.entries, laboratoryModel)).toEqual(before.world);
  expect(
    before.world.model === laboratoryModel && before.world.subnets[0]?.routeAssociationOrigin,
  ).toBe(association.receipt.commandId);
  const reset = await run(a.token, { type: 'ResetWorkspace' });
  expect(reset.world.model === laboratoryModel && reset.world.routeTables).toEqual([]);
  expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
  expect((await repo.read(b.token)).entries).toEqual([]);
  const stored = await pool.query(
    'SELECT receipt FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
    [a.snapshot.workspace, association.receipt.commandId],
  );
  expect(stored.rows[0].receipt).toEqual(association.receipt);
});
it('serializes concurrent real route-table commits, redelivers exact command identity, rejects stale mutation and rolls back before commit', async () => {
  const a = await ready(),
    s = await repo.read(a.token);
  const requests = ['one', 'two'].map((name) => ({
    commandId: randomUUID(),
    expectedRevision: s.world.revision,
    command: {
      type: 'CreateRouteTable',
      groupId: 'group-1',
      region: 'norwayeast',
      name,
    } as Command,
  }));
  const results = await Promise.all(requests.map((r) => repo.command(a.token, r, s.workspace)));
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const accepted = results.find((r) => r.receipt.outcome === 'accepted')!,
    request = requests.find((r) => r.commandId === accepted.receipt.commandId)!;
  expect((await repo.command(a.token, request, s.workspace)).receipt).toEqual(accepted.receipt);
  await expect(
    repo.command(
      a.token,
      { ...request, command: { ...request.command, name: 'different' } as Command },
      s.workspace,
    ),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  const before = await repo.read(a.token),
    broken = new Repository(pool, () => {
      throw Error('routing-before-commit');
    });
  await expect(
    broken.command(
      a.token,
      {
        commandId: randomUUID(),
        expectedRevision: before.world.revision,
        command: {
          type: 'CreateRouteTable',
          groupId: 'group-1',
          region: 'norwayeast',
          name: 'rollback',
        },
      },
      s.workspace,
    ),
  ).rejects.toThrow('routing-before-commit');
  expect(await repo.read(a.token)).toEqual(before);
});
it('serves analysis only from verified authorized persisted World; read-only, pinned workspace, strict input and no cross-session evidence', async () => {
  vi.stubEnv('LAB_DATABASE_URL', url!);
  vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
  const a = await ready(),
    b = await repo.createSession(laboratoryModel),
    before = await repo.read(a.token);
  const read = (
    token: string,
    workspace: string,
    query = 'subnetId=subnet-4&destination=10.10.1.5',
  ) =>
    handle(
      new Request('http://127.0.0.1:3000/api/laboratory/analysis?' + query, {
        headers: { Cookie: 'azurelab_lab_v3=' + token, 'If-Laboratory-Workspace': workspace },
      }),
      'analysis',
    );
  const response = await read(a.token, a.snapshot.workspace);
  expect(response.status).toBe(200);
  const result = await response.json();
  expect(result.analysis.selected.nextHop).toBe('None');
  expect(result.analysis.traffic).toBe('not-evaluated');
  expect(await repo.read(a.token)).toEqual(before);
  expect((await read(b.token, a.snapshot.workspace)).status).toBe(409);
  expect((await read(b.token, b.snapshot.workspace)).status).toBe(422);
  expect(
    (await read(a.token, a.snapshot.workspace, 'subnetId=subnet-4&destination=8.8.8.8&through=1'))
      .status,
  ).toBe(400);
  expect(
    (
      await read(
        a.token,
        a.snapshot.workspace,
        'subnetId=subnet-4&destination=8.8.8.8&destination=1.1.1.1',
      )
    ).status,
  ).toBe(400);
  expect(
    (await read(a.token, a.snapshot.workspace, 'subnetId=subnet-4&destination=168.63.129.16'))
      .status,
  ).toBe(422);
  const old = await repo.createSession('laboratory@3.1.0');
  expect((await read(old.token, old.snapshot.workspace)).status).toBe(422);
  await pool.query(
    "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{revision}','99') WHERE id=$1",
    [a.snapshot.workspace],
  );
  const corrupt = await read(a.token, a.snapshot.workspace);
  expect(corrupt.status).toBe(503);
  expect(await corrupt.json()).toEqual({ error: 'unverifiable-history' });
});
it('applies003 additively twice, preserving exact3.0/3.1 snapshots and originally unsupported Part B receipts, roles and immutable models', async () => {
  const adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
  if (!adminUrl) throw Error('Local test admin required');
  const u = new URL(adminUrl);
  if (
    !['127.0.0.1', 'localhost'].includes(u.hostname) ||
    !u.pathname.startsWith('/azurelab_lab_test_')
  )
    throw Error('Isolated local only');
  const name = 'azurelab_lab_test_migration64_' + randomBytes(5).toString('hex'),
    admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  let fixture: Client | undefined, runtime: Pool | undefined;
  try {
    await admin.query('CREATE DATABASE ' + name);
    u.pathname = '/' + name;
    fixture = new Client({ connectionString: u.href });
    await fixture.connect();
    for (const file of ['001.sql', '002-networking.sql'])
      await fixture.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
    const ru = new URL(url!);
    ru.pathname = '/' + name;
    runtime = new Pool({ connectionString: ru.href, max: 2 });
    const historical = new Repository(runtime);
    const sessions = [];
    for (const model of ['laboratory@3.0.0', 'laboratory@3.1.0'] as const) {
      const session = await historical.createSession(model);
      const request = {
        commandId: 'historical-unsupported',
        expectedRevision: 0,
        command: {
          type: 'CreateRouteTable',
          name: 'rt-old',
          groupId: 'group-1',
          region: 'norwayeast',
        } as Command,
      };
      await historical.command(session.token, request);
      const snapshot = await historical.read(session.token);
      expect(snapshot.entries[0]?.receipt.code).toBe('unsupported-capability');
      sessions.push({ session, snapshot });
    }
    const before = (
      await fixture.query(
        'SELECT id,world,sequence,model FROM laboratory_v3.workspaces ORDER BY id',
      )
    ).rows;
    const events = (
      await fixture.query('SELECT * FROM laboratory_v3.events ORDER BY workspace_id,sequence')
    ).rows;
    for (let i = 0; i < 2; i++)
      await fixture.query(readFileSync('database/laboratory-v3/003-routing.sql', 'utf8'));
    expect(
      (
        await fixture.query(
          'SELECT id,world,sequence,model FROM laboratory_v3.workspaces ORDER BY id',
        )
      ).rows,
    ).toEqual(before);
    expect(
      (await fixture.query('SELECT * FROM laboratory_v3.events ORDER BY workspace_id,sequence'))
        .rows,
    ).toEqual(events);
    for (const { session, snapshot } of sessions)
      expect(canonical(await historical.read(session.token))).toBe(canonical(snapshot));
    const current = await historical.createSession(laboratoryModel);
    expect(current.snapshot.world.model).toBe(laboratoryModel);
    await expect(
      runtime.query("UPDATE laboratory_v3.workspaces SET model='laboratory@3.2.0' WHERE id=$1", [
        sessions[0]!.snapshot.workspace,
      ]),
    ).rejects.toThrow('immutable');
    await expect(
      runtime.query('UPDATE laboratory_v3.events SET receipt=receipt'),
    ).rejects.toMatchObject({ code: '42501' });
    await expect(
      runtime.query('ALTER TABLE laboratory_v3.workspaces ADD COLUMN forbidden text'),
    ).rejects.toMatchObject({ code: '42501' });
  } finally {
    await runtime?.end();
    await fixture?.end();
    await admin.query('DROP DATABASE IF EXISTS ' + name);
    await admin.end();
  }
});
