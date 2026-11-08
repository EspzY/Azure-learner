import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { canonical, replay, type Model } from './laboratory/engine';
import { laboratoryModel, type Command, type ComputeCommand } from './laboratory/v34/contract';
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
async function run(token: string, command: Command) {
  const s = await repo.read(token);
  return repo.command(
    token,
    { commandId: randomUUID(), expectedRevision: s.world.revision, command },
    s.workspace,
  );
}
const vm = (name = 'vm-app-01', ip = '10.30.1.10'): ComputeCommand => ({
  type: 'CreateVirtualMachine',
  name,
  groupId: 'group-1',
  region: 'norwayeast',
  image: 'ubuntu-22.04-gen2',
  size: 'Standard_D2s_v4',
  subnetId: 'subnet-3',
  privateIpAddress: ip,
  allocation: 'Static',
  nsgId: 'none',
  osDiskSku: 'StandardSSD_LRS',
  osDiskSizeGiB: '128',
});
async function ready() {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, {
    type: 'CreateGroup',
    name: 'rg-compute',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  await run(a.token, {
    type: 'CreateVirtualNetwork',
    name: 'vnet-compute',
    groupId: 'group-1',
    region: 'norwayeast',
    addressSpace: '10.30.0.0/16',
  });
  await run(a.token, {
    type: 'CreateSubnet',
    name: 'snet-app',
    vnetId: 'vnet-2',
    addressPrefix: '10.30.1.0/24',
  });
  return a;
}
it('persists one original atomic VM/NIC/disk receipt, exact through/reset, independent sessions and original append-only evidence', async () => {
  const a = await ready(),
    b = await repo.createSession(laboratoryModel),
    created = await run(a.token, vm()),
    snapshot = await repo.read(a.token);
  expect(created.receipt).toMatchObject({
    outcome: 'accepted',
    beforeRevision: 3,
    afterRevision: 4,
    addedIds: ['vm-5', 'nic-4', 'disk-6'],
  });
  expect(snapshot.entries).toHaveLength(4);
  expect(snapshot.world.model === laboratoryModel && snapshot.world.vms[0]!.nicId).toBe('nic-4');
  expect(replay(snapshot.entries, laboratoryModel)).toEqual(snapshot.world);
  const original = (
    await pool.query(
      'SELECT receipt FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
      [snapshot.workspace, created.receipt.commandId],
    )
  ).rows[0].receipt;
  expect(original).toEqual(created.receipt);
  await run(a.token, {
    type: 'CreateStorageAccount',
    groupId: 'group-1',
    name: 'computestorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  await run(a.token, { type: 'ResetWorkspace' });
  expect(
    (await repo.read(a.token)).world.model === laboratoryModel &&
      (await repo.read(a.token)).world.revision,
  ).toBe(6);
  expect((await repo.read(a.token, snapshot.entries.length)).world).toEqual(snapshot.world);
  expect((await repo.read(b.token)).entries).toEqual([]);
  await expect(
    pool.query("UPDATE laboratory_v3.events SET receipt='{}' WHERE workspace_id=$1", [
      snapshot.workspace,
    ]),
  ).rejects.toThrow();
});
it('serializes concurrent VM commits without lost updates; original command-ID redelivery recovers a lost response and rejects changed request', async () => {
  const a = await ready(),
    s = await repo.read(a.token),
    requests = [vm(), vm('vm-app-02', '10.30.1.11')].map((command) => ({
      commandId: randomUUID(),
      expectedRevision: s.world.revision,
      command,
    }));
  const results = await Promise.all(requests.map((r) => repo.command(a.token, r, s.workspace)));
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const winner = results.find((r) => r.receipt.code === 'created')!,
    request = requests.find((r) => r.commandId === winner.receipt.commandId)!;
  const redelivery = await repo.command(a.token, request, s.workspace);
  expect(redelivery.redelivered).toBe(true);
  expect(redelivery.receipt).toEqual(winner.receipt);
  await expect(
    repo.command(a.token, { ...request, command: vm('different', '10.30.1.12') }, s.workspace),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  const loser = requests.find((r) => r.commandId !== request.commandId)!;
  expect((await run(a.token, loser.command)).receipt.code).toBe('created');
  const final = await repo.read(a.token);
  expect(final.world.model === laboratoryModel && final.world.vms.length).toBe(2);
  expect(
    final.world.model === laboratoryModel && final.world.nics.map((n) => n.privateIpAddress).sort(),
  ).toEqual(['10.30.1.10', '10.30.1.11']);
});
it('rolls back every bundle component and receipt on precommit failure, and rejects invalid parent/scope/revision without partial resources', async () => {
  const a = await ready(),
    before = await repo.read(a.token),
    id = randomUUID(),
    request = { commandId: id, expectedRevision: before.world.revision, command: vm() };
  const broken = new Repository(pool, () => {
    throw Error('compute-before-commit');
  });
  await expect(broken.command(a.token, request, before.workspace)).rejects.toThrow(
    'compute-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(before);
  expect(
    (
      await pool.query(
        'SELECT 1 FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
        [before.workspace, id],
      )
    ).rowCount,
  ).toBe(0);
  const retry = await repo.command(a.token, request, before.workspace);
  expect(retry.receipt.code).toBe('created');
  const snapshot = await repo.read(a.token);
  expect((await run(a.token, vm('vm-duplicate'))).receipt.code).toBe('duplicate-private-ip');
  expect((await repo.read(a.token)).world).toEqual(snapshot.world);
  await expect(
    repo.command(a.token, { ...request, commandId: randomUUID() }, randomUUID()),
  ).rejects.toMatchObject({ code: 'workspace-changed' });
});
it('reuses server route/policy analysis for persisted VM NICs, read-only and session scoped; corrupt snapshots fail closed', async () => {
  const a = await ready();
  await run(a.token, vm());
  await run(a.token, vm('vm-app-02', '10.30.1.11'));
  const before = await repo.read(a.token),
    origin = 'http://127.0.0.1:3000';
  vi.stubEnv('LAB_DATABASE_URL', url!);
  vi.stubEnv('LAB_ORIGIN', origin);
  const read = (token = a.token, workspace = before.workspace) =>
    handle(
      new Request(
        origin +
          '/api/laboratory/policy-analysis?sourceNicId=nic-4&destinationNicId=nic-7&protocol=Tcp&sourcePort=50000&destinationPort=443',
        {
          headers: {
            cookie: 'azurelab_lab_v3=' + token,
            'If-Laboratory-Workspace': workspace,
          },
        },
      ),
      'policy-analysis',
    );
  const response = await read();
  expect(response.status).toBe(200);
  expect((await response.json()).analysis).toMatchObject({
    model: laboratoryModel,
    sourceNicId: 'nic-4',
    destinationNicId: 'nic-7',
    status: 'allowed-by-modeled-network-policy',
    connectivity: 'not-verified',
  });
  expect(await repo.read(a.token)).toEqual(before);
  const other = await repo.createSession(laboratoryModel);
  expect((await read(other.token)).status).toBe(409);
  await pool.query(
    "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{revision}','99') WHERE id=$1",
    [before.workspace],
  );
  expect((await read()).status).toBe(503);
});
it('005 safely extends cold002 and populated003/004; raw old events stay identical, current initializer can repeat without narrowing3.4', async () => {
  const adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
  if (!adminUrl) throw Error('Local isolated admin required');
  const u = new URL(adminUrl);
  if (
    !['127.0.0.1', 'localhost'].includes(u.hostname) ||
    !u.pathname.startsWith('/azurelab_lab_test_')
  )
    throw Error('Dedicated local only');
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    for (const last of [2, 3, 4]) {
      const name = 'azurelab_lab_test_migration66_' + randomBytes(5).toString('hex');
      await admin.query('CREATE DATABASE ' + name);
      u.pathname = '/' + name;
      const owner = new Client({ connectionString: u.href });
      await owner.connect();
      const runtimeUrl = new URL(url!);
      runtimeUrl.pathname = '/' + name;
      const runtime = new Pool({ connectionString: runtimeUrl.href, max: 2 });
      try {
        for (const file of [
          '001.sql',
          '002-networking.sql',
          ...(last === 3 ? ['003-routing.sql'] : last === 4 ? ['004-endpoints.sql'] : []),
        ])
          await owner.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
        const r = new Repository(runtime),
          sessions = [];
        for (const model of [
          'laboratory@3.0.0',
          'laboratory@3.1.0',
          ...(last >= 3 ? ['laboratory@3.2.0'] : []),
          ...(last >= 4 ? ['laboratory@3.3.0'] : []),
        ] as Model[]) {
          const a = await r.createSession(model),
            original = await r.command(
              a.token,
              { commandId: 'historical-unsupported-vm', expectedRevision: 0, command: vm() },
              a.snapshot.workspace,
            );
          expect(original.receipt.code).toBe('unsupported-capability');
          sessions.push({ a, original });
        }
        const old = await owner.query(
          'SELECT row_to_json(e) AS raw FROM laboratory_v3.events e ORDER BY workspace_id,sequence',
        );
        await owner.query(readFileSync('database/laboratory-v3/005-compute.sql', 'utf8'));
        const current = await r.createSession(laboratoryModel);
        await r.command(
          current.token,
          {
            commandId: 'new-group',
            expectedRevision: 0,
            command: {
              type: 'CreateGroup',
              name: 'rg-current',
              subscriptionId: 'sub-shared',
              metadataRegion: 'norwayeast',
            },
          },
          current.snapshot.workspace,
        );
        for (const file of ['001.sql', '002-networking.sql', '005-compute.sql'])
          await owner.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
        for (const { a, original } of sessions)
          expect((await r.read(a.token)).world).toEqual(original.world);
        const after = await owner.query(
          "SELECT row_to_json(e) AS raw FROM laboratory_v3.events e WHERE command_id='historical-unsupported-vm' ORDER BY workspace_id,sequence",
        );
        expect(canonical(after.rows)).toBe(canonical(old.rows));
        expect((await r.read(current.token)).world.model).toBe(laboratoryModel);
        await expect(
          runtime.query(
            "UPDATE laboratory_v3.events SET receipt='{}' WHERE command_id='new-group'",
          ),
        ).rejects.toThrow();
        await expect(
          owner.query("UPDATE laboratory_v3.workspaces SET model='laboratory@3.3.0' WHERE id=$1", [
            current.snapshot.workspace,
          ]),
        ).rejects.toThrow();
      } finally {
        await runtime.end();
        await owner.end();
        await admin.query('DROP DATABASE ' + name);
      }
    }
  } finally {
    await admin.end();
  }
});
