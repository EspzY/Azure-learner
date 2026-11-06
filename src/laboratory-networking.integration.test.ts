import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository, tokenHash } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { laboratoryModel, type Command } from './laboratory/v31/contract';
import { canonical, replay } from './laboratory/engine';
import * as old from './laboratory/v3/domain';
import type { Request as OldRequest, Entry as OldEntry } from './laboratory/v3/contract';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL;
if (
  !url ||
  !/^\/azurelab_lab_test_[a-z0-9_]+$/.test(new URL(url).pathname) ||
  !['127.0.0.1', 'localhost'].includes(new URL(url).hostname)
)
  throw Error('Explicit isolated local test database required');
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
afterAll(async () => {
  await pool.end();
  vi.unstubAllEnvs();
});
const group: Command = {
  type: 'CreateGroup',
  subscriptionId: 'sub-shared',
  name: 'rg-network',
  metadataRegion: 'norwayeast',
};
const vnet: Command = {
  type: 'CreateVirtualNetwork',
  groupId: 'group-1',
  name: 'vnet-app',
  region: 'norwayeast',
  addressSpace: '10.20.0.0/16',
};
async function run(token: string, command: Command, id = randomUUID()) {
  const s = await repo.read(token);
  return repo.command(
    token,
    { commandId: id, expectedRevision: s.world.revision, command },
    s.workspace,
  );
}
it('commits actual networking with original receipts, shared Storage, historical through, reset and isolated sessions', async () => {
  const a = await repo.createSession(laboratoryModel),
    b = await repo.createSession(laboratoryModel);
  await run(a.token, group);
  await run(a.token, vnet);
  await run(a.token, {
    type: 'CreateSubnet',
    vnetId: 'vnet-2',
    name: 'web',
    addressPrefix: '10.20.1.0/24',
  });
  await run(a.token, {
    type: 'CreateNetworkSecurityGroup',
    groupId: 'group-1',
    name: 'nsg-web',
    region: 'norwayeast',
  });
  await run(a.token, { type: 'AssociateSubnetNsg', subnetId: 'subnet-3', nsgId: 'nsg-4' });
  await run(a.token, {
    type: 'CreateStorageAccount',
    groupId: 'group-1',
    name: 'netstorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const s = await repo.read(a.token);
  expect(s.world.model).toBe(laboratoryModel);
  expect(s.world.accounts).toHaveLength(1);
  expect(s.entries.every((e) => e.model === laboratoryModel)).toBe(true);
  expect(replay(s.entries, laboratoryModel)).toEqual(s.world);
  const before = await repo.read(a.token, 4);
  expect(before.world.model === laboratoryModel && before.world.subnets[0]?.nsgId).toBeNull();
  await run(a.token, { type: 'ResetWorkspace' });
  expect((await repo.read(a.token, 6)).world).toEqual(s.world);
  const reset = await repo.read(a.token);
  expect(reset.world.model).toBe(laboratoryModel);
  expect(reset.world.model === laboratoryModel && reset.world.vnets).toEqual([]);
  expect(reset.entries).toHaveLength(7);
  expect((await repo.read(b.token)).entries).toEqual([]);
});
it('serializes real concurrent operations without lost update and preserves original duplicate command identities', async () => {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, group);
  const requests = ['first', 'second'].map((id) => ({
    commandId: id,
    expectedRevision: 1,
    command: { ...vnet, name: id },
  }));
  const result = await Promise.all(requests.map((r) => repo.command(a.token, r)));
  expect(result.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const accepted = result.find((r) => r.receipt.code === 'created')!;
  const original = requests.find((r) => r.commandId === accepted.receipt.commandId)!;
  const again = await repo.command(a.token, original);
  expect(again.receipt).toEqual(accepted.receipt);
  expect(again.redelivered).toBe(true);
  await expect(
    repo.command(a.token, { ...original, command: { ...vnet, name: 'different' } }),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  expect((await repo.read(a.token)).entries).toHaveLength(3);
});
it('rolls back networking World and receipt writes if commit cannot complete', async () => {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, group);
  const before = await repo.read(a.token);
  const broken = new Repository(pool, () => {
    throw Error('controlled-before-commit');
  });
  await expect(
    broken.command(a.token, { commandId: 'rollback-vnet', expectedRevision: 1, command: vnet }),
  ).rejects.toThrow('controlled-before-commit');
  expect(await repo.read(a.token)).toEqual(before);
});
it('rejects stale workspace, cross-version events, schema mutation and implicit model upgrade', async () => {
  const a = await repo.createSession(),
    b = await repo.createSession(laboratoryModel);
  await expect(
    repo.command(
      a.token,
      { commandId: 'wrong', expectedRevision: 0, command: group },
      b.snapshot.workspace,
    ),
  ).rejects.toMatchObject({ code: 'workspace-changed' });
  const denied = await run(a.token, vnet);
  expect(denied.receipt.code).toBe('unsupported-capability');
  expect(denied.world.model).toBe('laboratory@3.0.0');
  await run(a.token, { type: 'ResetWorkspace' });
  expect((await repo.read(a.token)).world.model).toBe('laboratory@3.0.0');
  await expect(
    pool.query("UPDATE laboratory_v3.workspaces SET model='laboratory@3.1.0' WHERE token_hash=$1", [
      tokenHash(a.token),
    ]),
  ).rejects.toThrow('immutable');
  await expect(
    pool.query(
      'INSERT INTO laboratory_v3.events(workspace_id,sequence,command_id,model,attempt,request,receipt) VALUES($1,1,$2,$3,1,$4,$5)',
      [
        b.snapshot.workspace,
        'mixed',
        'laboratory@3.0.0',
        denied.entries[0]!.request,
        denied.receipt,
      ],
    ),
  ).rejects.toMatchObject({ code: '23503' });
  expect((await repo.read(b.token)).entries).toEqual([]);
});
it('requires explicit valid session model and resumes existing cookie version without starting an upgraded workspace', async () => {
  vi.stubEnv('LAB_DATABASE_URL', url!);
  const origin = process.env.LAB_ORIGIN!;
  const call = (body: unknown, cookie?: string) =>
    handle(
      new Request(origin + '/api/laboratory/session', {
        method: 'POST',
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify(body),
      }),
      'session',
    );
  expect((await call({ model: 'laboratory@9.0.0' })).status).toBe(400);
  const first = await call({});
  expect(first.status).toBe(201);
  const oldSnapshot = await first.json(),
    cookie = first.headers.get('set-cookie')!.split(';')[0]!;
  const next = await call({ model: laboratoryModel }, cookie);
  expect((await next.json()).workspace).toBe(oldSnapshot.workspace);
  const fresh = await call({ model: laboratoryModel });
  expect((await fresh.json()).world.model).toBe(laboratoryModel);
});
it('applies original001 then additive002 on a fresh isolated database without rewriting original Storage history or unsupported networking', async () => {
  const adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
  if (!adminUrl) throw Error('Local migration fixture needs isolated admin URL');
  const originalUrl = new URL(adminUrl);
  if (
    !['127.0.0.1', 'localhost'].includes(originalUrl.hostname) ||
    !originalUrl.pathname.startsWith('/azurelab_lab_test_')
  )
    throw Error('Local-only fixture');
  const name = 'azurelab_lab_test_migration62_' + randomBytes(5).toString('hex');
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  let fixture: Client | undefined, runtime: Pool | undefined;
  try {
    await admin.query('CREATE DATABASE ' + name);
    const target = new URL(adminUrl);
    target.pathname = '/' + name;
    fixture = new Client({ connectionString: target.href });
    await fixture.connect();
    await fixture.query(readFileSync('database/laboratory-v3/001.sql', 'utf8'));
    const token = randomBytes(32).toString('base64url'),
      id = randomUUID();
    let world = old.freshWorld();
    const entries: OldEntry[] = [];
    for (const command of [
      group,
      { type: 'CreateVirtualNetwork', name: 'historical-unsupported' },
    ]) {
      const request: OldRequest = {
        commandId: 'old-' + entries.length,
        expectedRevision: world.revision,
        command: command as never,
      };
      const result = old.execute(world, request, entries.length + 1);
      entries.push({ model: 'laboratory@3.0.0', attempt: 1, request, receipt: result.receipt });
      world = result.world;
    }
    await fixture.query(
      "INSERT INTO laboratory_v3.workspaces(id,token_hash,expires_at,world,sequence) VALUES($1,$2,now()+interval '1 day',$3,$4)",
      [id, tokenHash(token), world, entries.length],
    );
    for (const [i, e] of entries.entries())
      await fixture.query(
        'INSERT INTO laboratory_v3.events(workspace_id,sequence,command_id,model,attempt,request,receipt) VALUES($1,$2,$3,$4,1,$5,$6)',
        [id, i + 1, e.request.commandId, e.model, e.request, e.receipt],
      );
    const before = canonical({ world, entries });
    await fixture.query(readFileSync('database/laboratory-v3/002-networking.sql', 'utf8'));
    await fixture.query(readFileSync('database/laboratory-v3/002-networking.sql', 'utf8'));
    const u = new URL(url!);
    u.pathname = '/' + name;
    runtime = new Pool({ connectionString: u.href, max: 2 });
    const r = new Repository(runtime);
    const result = await r.read(token);
    expect(canonical({ world: result.world, entries: result.entries })).toBe(before);
    expect(result.world.model).toBe('laboratory@3.0.0');
    expect(result.entries[1]!.receipt.code).toBe('unsupported-capability');
    const current = await r.createSession(laboratoryModel);
    expect(current.snapshot.world.model).toBe(laboratoryModel);
    await expect(
      runtime.query('UPDATE laboratory_v3.events SET receipt=receipt'),
    ).rejects.toMatchObject({ code: '42501' });
  } finally {
    await runtime?.end();
    await fixture?.end();
    await admin.query('DROP DATABASE IF EXISTS ' + name);
    await admin.end();
  }
});

it('fails closed on an altered3.1 network snapshot instead of accepting a current-looking resource', async () => {
  const a = await repo.createSession(laboratoryModel);
  await run(a.token, group);
  await run(a.token, vnet);
  const before = await repo.read(a.token);
  await pool.query(
    "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{vnets,0,addressSpace}','\"10.99.0.0/16\"') WHERE token_hash=$1",
    [tokenHash(a.token)],
  );
  await expect(repo.read(a.token)).rejects.toMatchObject({ code: 'unverifiable-history' });
  const actual = await pool.query(
    'SELECT receipt FROM laboratory_v3.events WHERE workspace_id=$1 ORDER BY sequence',
    [before.workspace],
  );
  expect(actual.rows.map((x) => x.receipt)).toEqual(before.entries.map((x) => x.receipt));
});
