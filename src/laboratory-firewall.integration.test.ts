import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { readFileSync, existsSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { canonical, replay, type Model } from './laboratory/engine';
import { laboratoryModel, type Command } from './laboratory/v35/contract';
import { firewallWorld } from '../tests/fixtures/firewall-world';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL;
if (
  !url ||
  !new URL(url).pathname.startsWith('/azurelab_lab_test_') ||
  !['127.0.0.1', 'localhost'].includes(new URL(url).hostname)
)
  throw Error('Dedicated isolated local test database required');
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
afterAll(async () => {
  await pool.end();
  vi.unstubAllEnvs();
});
it('rolls back the actual Firewall/Public IP bundle and serializes concurrent creations without partial resources or lost original response', async () => {
  const fixture = firewallWorld(),
    index = fixture.s.entries.findIndex((e) => e.request.command.type === 'CreateAzureFirewall'),
    a = await repo.createSession(laboratoryModel);
  for (const e of fixture.s.entries.slice(0, index))
    await repo.command(a.token, e.request, a.snapshot.workspace);
  const before = await repo.read(a.token),
    request = fixture.s.entries[index]!.request,
    broken = new Repository(pool, () => {
      throw Error('firewall-bundle-before-commit');
    });
  await expect(broken.command(a.token, request, before.workspace)).rejects.toThrow(
    'firewall-bundle-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(before);
  expect(
    (
      await pool.query(
        'SELECT 1 FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
        [before.workspace, request.commandId],
      )
    ).rowCount,
  ).toBe(0);
  const rival = {
    ...request,
    commandId: randomUUID(),
    command: { ...request.command, name: 'fw-rival' },
  } as typeof request;
  const results = await Promise.all(
    [request, rival].map((r) => repo.command(a.token, r, before.workspace)),
  );
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const winner = results.find((r) => r.receipt.code === 'created')!,
    original = winner.receipt.commandId === request.commandId ? request : rival;
  expect(winner.receipt.addedIds).toHaveLength(2);
  const state = await repo.read(a.token);
  expect(state.world.model === laboratoryModel && state.world.firewalls.length).toBe(1);
  expect(state.world.model === laboratoryModel && state.world.publicIps.length).toBe(1);
  expect(state.entries.length - before.entries.length).toBe(2);
  expect((await repo.command(a.token, original, before.workspace)).receipt).toEqual(winner.receipt);
  expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
  expect(replay(state.entries, laboratoryModel)).toEqual(state.world);
});
async function ready() {
  const a = await repo.createSession(laboratoryModel),
    fixture = firewallWorld();
  for (const e of fixture.s.entries) {
    const r = await repo.command(a.token, e.request, a.snapshot.workspace);
    expect(r.receipt).toEqual(e.receipt);
  }
  return { ...a, fixture, snapshot: await repo.read(a.token) };
}
it('commits the actual composed scenario, exact original Firewall/PIP receipt, through/reset and session isolation with no receipt rewriting', async () => {
  const a = await ready(),
    b = await repo.createSession(laboratoryModel),
    before = a.snapshot;
  expect(before.world).toEqual(a.fixture.s.world);
  expect(replay(before.entries, laboratoryModel)).toEqual(before.world);
  const original = before.entries.find((e) => e.request.command.type === 'CreateAzureFirewall')!;
  expect(
    (
      await pool.query(
        'SELECT receipt FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
        [before.workspace, original.request.commandId],
      )
    ).rows[0].receipt,
  ).toEqual(original.receipt);
  await repo.command(
    a.token,
    {
      commandId: randomUUID(),
      expectedRevision: before.world.revision,
      command: { type: 'ResetWorkspace' },
    },
    before.workspace,
  );
  expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
  const current = await repo.read(a.token);
  expect(current.world.model === laboratoryModel && current.world.firewalls).toEqual([]);
  expect(current.entries.slice(0, before.entries.length)).toEqual(before.entries);
  expect((await repo.read(b.token)).entries).toEqual([]);
  await expect(
    repo.command(
      b.token,
      { commandId: randomUUID(), expectedRevision: 0, command: { type: 'ResetWorkspace' } },
      before.workspace,
    ),
  ).rejects.toMatchObject({ code: 'workspace-changed' });
  await expect(
    pool.query("UPDATE laboratory_v3.events SET receipt='{}' WHERE workspace_id=$1", [
      before.workspace,
    ]),
  ).rejects.toThrow();
});
it('serializes competing writes, preserves idempotent identity after lost response, rejects changed request and rolls back precommit failure', async () => {
  const a = await repo.createSession(laboratoryModel),
    before = await repo.read(a.token);
  const commands: Command[] = ['first', 'second'].map((name) => ({
    type: 'CreateGroup',
    name,
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  }));
  const requests = commands.map((command) => ({
    commandId: randomUUID(),
    expectedRevision: 0,
    command,
  }));
  const results = await Promise.all(
    requests.map((r) => repo.command(a.token, r, before.workspace)),
  );
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const winner = results.find((r) => r.receipt.code === 'created')!,
    request = requests.find((r) => r.commandId === winner.receipt.commandId)!;
  const redelivery = await repo.command(a.token, request, before.workspace);
  expect(redelivery.redelivered).toBe(true);
  expect(redelivery.receipt).toEqual(winner.receipt);
  await expect(
    repo.command(
      a.token,
      { ...request, command: commands.find((c) => c !== request.command)! },
      before.workspace,
    ),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  const state = await repo.read(a.token),
    failing = new Repository(pool, () => {
      throw Error('firewall-before-commit');
    }),
    r = {
      commandId: randomUUID(),
      expectedRevision: state.world.revision,
      command: {
        type: 'CreateFirewallPolicy',
        groupId: state.world.groups[0]!.id,
        name: 'policy',
        region: 'norwayeast',
        tier: 'Standard',
        threatIntelMode: 'Off',
      } as Command,
    };
  await expect(failing.command(a.token, r, state.workspace)).rejects.toThrow(
    'firewall-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(state);
  expect(
    (
      await pool.query(
        'SELECT 1 FROM laboratory_v3.events WHERE workspace_id=$1 AND command_id=$2',
        [state.workspace, r.commandId],
      )
    ).rowCount,
  ).toBe(0);
  expect((await repo.command(a.token, r, state.workspace)).receipt.outcome).toBe('accepted');
});
it('server analyses bind actual workspace/model/revision and identities, do not write events and fail closed on corrupt history', async () => {
  const a = await ready();
  vi.stubEnv('LAB_DATABASE_URL', url!);
  vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
  const params = new URLSearchParams(a.fixture.input),
    request = () =>
      new Request('http://127.0.0.1:3000/api/laboratory/policy-analysis?' + params, {
        headers: {
          Cookie: 'azurelab_lab_v3=' + a.token,
          'If-Laboratory-Workspace': a.snapshot.workspace,
        },
      });
  const response = await handle(request(), 'policy-analysis');
  expect(response.status).toBe(200);
  const value = await response.json();
  expect(value.analysis).toMatchObject({
    model: laboratoryModel,
    workspace: a.snapshot.workspace,
    revision: a.snapshot.world.revision,
    sourceNicId: a.fixture.appNic,
    destinationNicId: a.fixture.dataNic,
    firewallPath: { disposition: 'allowed-via-firewall', configurationPathAssessed: true },
  });
  expect(await repo.read(a.token)).toEqual(a.snapshot);
  const wrong = new Request(request(), {
    headers: { Cookie: 'azurelab_lab_v3=' + a.token, 'If-Laboratory-Workspace': randomUUID() },
  });
  expect((await handle(wrong, 'policy-analysis')).status).toBe(409);
  expect(
    (await handle(new Request('http://127.0.0.1:3000/api/laboratory/state'), 'state')).status,
  ).toBe(401);
  const adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
  if (!adminUrl) throw Error('Isolated local test admin required');
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    await admin.query(
      "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{revision}','999') WHERE id=$1",
      [a.snapshot.workspace],
    );
    expect((await handle(request(), 'policy-analysis')).status).toBe(503);
  } finally {
    await admin.end();
  }
});
it('cold and populated005→006, historical003/004 chains and repeated initialization preserve original3.0–3.4 raw records', async () => {
  const adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
  if (!adminUrl) throw Error('Isolated local migration admin required');
  const parent = new URL(adminUrl);
  if (!['localhost', '127.0.0.1'].includes(parent.hostname)) throw Error('Local only');
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    for (const path of [
      ['001.sql', '002-networking.sql'],
      ['001.sql', '002-networking.sql', '003-routing.sql'],
      ['001.sql', '002-networking.sql', '004-endpoints.sql'],
      ['001.sql', '002-networking.sql', '005-compute.sql'],
    ]) {
      const name = 'azurelab_lab_test_migration67_' + randomBytes(5).toString('hex');
      await admin.query('CREATE DATABASE "' + name + '"');
      const u = new URL(adminUrl);
      u.pathname = '/' + name;
      const client = new Client({ connectionString: u.href });
      await client.connect();
      const runtime = new URL(url!);
      runtime.pathname = '/' + name;
      const p = new Pool({ connectionString: runtime.href, max: 2 });
      const r = new Repository(p);
      try {
        for (const migration of path)
          await client.query(readFileSync('database/laboratory-v3/' + migration, 'utf8'));
        const maximum =
          path.at(-1) === '005-compute.sql'
            ? 4
            : path.at(-1) === '004-endpoints.sql'
              ? 3
              : path.at(-1) === '003-routing.sql'
                ? 2
                : 1;
        for (let n = 0; n <= maximum; n++) {
          const a = await r.createSession(('laboratory@3.' + n + '.0') as Model);
          await r.command(
            a.token,
            {
              commandId: 'historical-firewall-unsupported',
              expectedRevision: 0,
              command: {
                type: 'CreateFirewallPolicy',
                groupId: 'absent',
                name: 'policy',
                region: 'norwayeast',
                tier: 'Standard',
                threatIntelMode: 'Off',
              },
            },
            a.snapshot.workspace,
          );
          expect((await r.read(a.token)).entries[0]!.receipt.code).toBe('unsupported-capability');
        }
        const before = await client.query(
            'SELECT row_to_json(e) AS raw FROM laboratory_v3.events e ORDER BY workspace_id,sequence',
          ),
          worlds = await client.query('SELECT id,world FROM laboratory_v3.workspaces ORDER BY id');
        await expect(r.createSession(laboratoryModel)).rejects.toThrow();
        for (let repeat = 0; repeat < 2; repeat++)
          for (const migration of ['001.sql', '002-networking.sql', '006-firewall.sql'])
            await client.query(readFileSync('database/laboratory-v3/' + migration, 'utf8'));
        expect(
          (
            await client.query(
              'SELECT row_to_json(e) AS raw FROM laboratory_v3.events e ORDER BY workspace_id,sequence',
            )
          ).rows,
        ).toEqual(before.rows);
        expect(
          (await client.query('SELECT id,world FROM laboratory_v3.workspaces ORDER BY id')).rows,
        ).toEqual(worlds.rows);
        const current = await r.createSession(laboratoryModel);
        expect(current.snapshot.world.model).toBe(laboratoryModel);
        for (const w of worlds.rows) {
          const es = await client.query(
            'SELECT model,attempt,request,receipt FROM laboratory_v3.events WHERE workspace_id=$1 ORDER BY sequence',
            [w.id],
          );
          expect(canonical(replay(es.rows, w.world.model))).toBe(canonical(w.world));
        }
      } finally {
        await p.end();
        await client.end();
        await admin.query('DROP DATABASE "' + name + '" WITH (FORCE)');
      }
    }
  } finally {
    await admin.end();
  }
});
