import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { canonical, replay, type Model } from './laboratory/engine';
import { laboratoryModel, type Command } from './laboratory/v33/contract';
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
const nic = (name = 'nic-web', ip = '10.10.1.10'): Command => ({
  type: 'CreateNetworkInterface',
  groupId: 'group-1',
  region: 'norwayeast',
  vnetId: 'vnet-2',
  subnetId: 'subnet-3',
  name,
  allocation: 'Static',
  privateIpAddress: ip,
});
async function ready() {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, {
    type: 'CreateGroup',
    name: 'rg-endpoint',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  await run(a.token, {
    type: 'CreateVirtualNetwork',
    groupId: 'group-1',
    name: 'vnet-app',
    region: 'norwayeast',
    addressSpace: '10.10.0.0/16',
  });
  await run(a.token, {
    type: 'CreateSubnet',
    vnetId: 'vnet-2',
    name: 'snet-web',
    addressPrefix: '10.10.1.0/24',
  });
  return a;
}
it('persists original NIC IP and association receipts, Storage and Networking together, exact historical through/reset and isolated sessions', async () => {
  const a = await ready(),
    b = await repo.createSession(laboratoryModel),
    created = await run(a.token, nic());
  expect(created.receipt.code).toBe('created');
  await run(a.token, {
    type: 'CreateNetworkSecurityGroup',
    groupId: 'group-1',
    region: 'norwayeast',
    name: 'nsg-web',
  });
  const assoc = await run(a.token, { type: 'AssociateNicNsg', nicId: 'nic-4', nsgId: 'nsg-5' }),
    before = await repo.read(a.token);
  expect(before.world.model === laboratoryModel && before.world.nics[0]?.associationOrigin).toBe(
    assoc.receipt.commandId,
  );
  expect(replay(before.entries, laboratoryModel)).toEqual(before.world);
  await run(a.token, {
    type: 'CreateStorageAccount',
    groupId: 'group-1',
    name: 'endpointstorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const reset = await run(a.token, { type: 'ResetWorkspace' });
  expect(reset.world.model === laboratoryModel && reset.world.nics).toEqual([]);
  expect(reset.receipt.removedIds).toContain('nic-4');
  expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
  expect((await repo.read(b.token)).entries).toEqual([]);
  expect(
    (
      await pool.query(
        'SELECT receipt FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
        [a.snapshot.workspace, created.receipt.commandId],
      )
    ).rows[0].receipt,
  ).toEqual(created.receipt);
});
it('serializes real concurrent IP allocations, idempotent requests, stale revisions, conflicts and precommit rollback without positive receipts', async () => {
  const a = await ready(),
    s = await repo.read(a.token),
    requests = ['one', 'two'].map((name) => ({
      commandId: randomUUID(),
      expectedRevision: s.world.revision,
      command: nic(name),
    }));
  const results = await Promise.all(requests.map((r) => repo.command(a.token, r, s.workspace)));
  expect(results.map((x) => x.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const winner = results.find((x) => x.receipt.code === 'created')!,
    request = requests.find((x) => x.commandId === winner.receipt.commandId)!;
  expect((await repo.command(a.token, request, s.workspace)).receipt).toEqual(winner.receipt);
  await expect(
    repo.command(a.token, { ...request, command: nic('different', '10.10.1.11') }, s.workspace),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  expect((await run(a.token, nic('duplicate'))).receipt.code).toBe('duplicate-private-ip');
  const before = await repo.read(a.token),
    broken = new Repository(pool, () => {
      throw Error('endpoint-before-commit');
    });
  await expect(
    broken.command(
      a.token,
      {
        commandId: randomUUID(),
        expectedRevision: before.world.revision,
        command: nic('rollback', '10.10.1.11'),
      },
      s.workspace,
    ),
  ).rejects.toThrow('endpoint-before-commit');
  expect(await repo.read(a.token)).toEqual(before);
  await expect(
    repo.command(
      a.token,
      { commandId: randomUUID(), expectedRevision: before.world.revision, command: nic() },
      randomUUID(),
    ),
  ).rejects.toMatchObject({ code: 'workspace-changed' });
});
it('serves policy from verified authorized persisted revision only; strict read-only inputs, original model, session boundary and corrupt snapshot fail closed', async () => {
  vi.stubEnv('LAB_DATABASE_URL', url!);
  vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
  const a = await ready(),
    b = await repo.createSession(laboratoryModel);
  await run(a.token, nic());
  await run(a.token, nic('nic-data', '10.10.1.11'));
  const before = await repo.read(a.token),
    query =
      'sourceNicId=nic-4&destinationNicId=nic-5&protocol=Tcp&sourcePort=50000&destinationPort=1433';
  const read = (token: string, workspace: string, q = query, origin?: string) =>
    handle(
      new Request('http://127.0.0.1:3000/api/laboratory/policy-analysis?' + q, {
        headers: {
          Cookie: 'azurelab_lab_v3=' + token,
          'If-Laboratory-Workspace': workspace,
          ...(origin ? { Origin: origin } : {}),
        },
      }),
      'policy-analysis',
    );
  const response = await read(a.token, a.snapshot.workspace);
  expect(response.status).toBe(200);
  const result = await response.json();
  expect(result.analysis.status).toBe('allowed-by-modeled-network-policy');
  expect(result.analysis.revision).toBe(before.world.revision);
  expect(result.analysis.traffic).toBe('not-sent');
  expect(await repo.read(a.token)).toEqual(before);
  expect((await read(b.token, a.snapshot.workspace)).status).toBe(409);
  expect((await read(b.token, b.snapshot.workspace)).status).toBe(422);
  expect((await read(a.token, a.snapshot.workspace, query + '&destinationPort=3389')).status).toBe(
    400,
  );
  expect((await read(a.token, a.snapshot.workspace, query + '&through=1')).status).toBe(400);
  expect(
    (await read(a.token, a.snapshot.workspace, query.replace('protocol=Tcp', 'protocol=Icmp')))
      .status,
  ).toBe(422);
  expect((await read(a.token, a.snapshot.workspace, query, 'https://other.invalid')).status).toBe(
    403,
  );
  const old = await repo.createSession('laboratory@3.2.0');
  expect((await read(old.token, old.snapshot.workspace)).status).toBe(422);
  await pool.query(
    "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{revision}','99') WHERE id=$1",
    [a.snapshot.workspace],
  );
  const corrupt = await read(a.token, a.snapshot.workspace);
  expect(corrupt.status).toBe(503);
  expect(await corrupt.json()).toEqual({ error: 'unverifiable-history' });
});
it('004 safely extends populated003 and cold002, repeated current initialization keeps all3.0/3.1/3.2 raw events immutable and3.3 executable', async () => {
  const adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
  if (!adminUrl) throw Error('Local test admin required');
  const u = new URL(adminUrl);
  if (
    !['127.0.0.1', 'localhost'].includes(u.hostname) ||
    !u.pathname.startsWith('/azurelab_lab_test_')
  )
    throw Error('Local isolated only');
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    for (const with003 of [false, true]) {
      const name = 'azurelab_lab_test_migration65_' + randomBytes(5).toString('hex');
      await admin.query('CREATE DATABASE ' + name);
      u.pathname = '/' + name;
      const fixture = new Client({ connectionString: u.href });
      await fixture.connect();
      const ru = new URL(url!);
      ru.pathname = '/' + name;
      const runtime = new Pool({ connectionString: ru.href, max: 2 });
      try {
        for (const file of [
          '001.sql',
          '002-networking.sql',
          ...(with003 ? ['003-routing.sql'] : []),
        ])
          await fixture.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
        const historical = new Repository(runtime),
          sessions = [];
        for (const model of [
          'laboratory@3.0.0',
          'laboratory@3.1.0',
          ...(with003 ? ['laboratory@3.2.0'] : []),
        ] as Model[]) {
          const a = await historical.createSession(model);
          const result = await historical.command(
            a.token,
            { commandId: 'historical-unsupported-nic', expectedRevision: 0, command: nic() },
            a.snapshot.workspace,
          );
          expect(result.receipt.code).toBe('unsupported-capability');
          sessions.push({ a, result });
        }
        const raw = await fixture.query(
          'SELECT row_to_json(e) AS raw FROM laboratory_v3.events e ORDER BY workspace_id,sequence',
        );
        await fixture.query(readFileSync('database/laboratory-v3/004-endpoints.sql', 'utf8'));
        const latest = await historical.createSession(laboratoryModel);
        await historical.command(
          latest.token,
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
          latest.snapshot.workspace,
        );
        for (const file of ['001.sql', '002-networking.sql', '004-endpoints.sql'])
          await fixture.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
        for (const { a, result } of sessions)
          expect(await historical.read(a.token)).toEqual({
            historical: false,
            workspace: result.workspace,
            world: result.world,
            entries: result.entries,
          });
        const oldRaw = await fixture.query(
          "SELECT row_to_json(e) AS raw FROM laboratory_v3.events e WHERE command_id='historical-unsupported-nic' ORDER BY workspace_id,sequence",
        );
        expect(canonical(oldRaw.rows)).toBe(canonical(raw.rows));
        expect((await historical.read(latest.token)).world.model).toBe(laboratoryModel);
        await expect(
          runtime.query(
            "UPDATE laboratory_v3.events SET receipt='{}' WHERE command_id='new-group'",
          ),
        ).rejects.toThrow();
        await expect(
          fixture.query(
            "UPDATE laboratory_v3.workspaces SET model='laboratory@3.2.0' WHERE id=$1",
            [latest.snapshot.workspace],
          ),
        ).rejects.toThrow();
      } finally {
        await runtime.end();
        await fixture.end();
        await admin.query('DROP DATABASE ' + name);
      }
    }
  } finally {
    await admin.end();
  }
});
