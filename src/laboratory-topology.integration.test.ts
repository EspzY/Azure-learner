import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { readFileSync, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { models, canonical, type Request as LabRequest, type Model } from './laboratory/engine';
import { laboratoryModel } from './laboratory/v37/contract';
import { topologyWorld, routeUpdate } from '../tests/fixtures/topology-world';
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
  vi.unstubAllEnvs();
});
async function ready() {
  const a = await repo.createSession(laboratoryModel),
    f = topologyWorld();
  for (const e of f.s.entries)
    expect((await repo.command(a.token, e.request, a.snapshot.workspace)).receipt).toEqual(
      e.receipt,
    );
  return { ...a, f, snapshot: await repo.read(a.token) };
}
const request = (a: Awaited<ReturnType<typeof ready>>, hop = 'None'): LabRequest => ({
  commandId: randomUUID(),
  expectedRevision: a.snapshot.world.revision,
  command: routeUpdate(a.f, hop),
});
it('real PostgreSQL Review is read-only, Update rollback commits nothing, concurrent writers/idempotency retain stable identity and exact JSONB replay', async () => {
  const a = await ready(),
    before = a.snapshot,
    r = request(a);
  expect((await repo.review(a.token, r, before.workspace)).preview).toMatchObject({
    outcome: 'accepted',
    topologyChange: { id: a.f.route, after: { nextHopType: 'None' } },
  });
  expect(await repo.read(a.token)).toEqual(before);
  const broken = new Repository(pool, () => {
    throw Error('topology-precommit');
  });
  await expect(broken.command(a.token, r, before.workspace)).rejects.toThrow('topology-precommit');
  expect(await repo.read(a.token)).toEqual(before);
  const other = request(a, 'Internet'),
    results = await Promise.all([r, other].map((x) => repo.command(a.token, x, before.workspace)));
  expect(results.map((x) => x.receipt.code).sort()).toEqual(['stale-revision', 'updated']);
  const winner = results.find((x) => x.receipt.outcome === 'accepted')!,
    original = winner.receipt.commandId === r.commandId ? r : other;
  const after = await repo.read(a.token);
  expect(after.world.revision).toBe(before.world.revision + 1);
  expect(after.entries.slice(0, before.entries.length)).toEqual(before.entries);
  expect((await repo.command(a.token, original, before.workspace)).receipt).toEqual(winner.receipt);
  expect(await repo.read(a.token)).toEqual(after);
  await expect(
    repo.command(
      a.token,
      {
        ...original,
        command: { ...original.command, addressPrefix: '10.21.0.0/16' } as LabRequest['command'],
      },
      before.workspace,
    ),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
  expect((await repo.read(a.token, winner.receipt.sequence)).world).toEqual(winner.world);
});
it.each([0, 1, 2, 3])(
  'real JSONB rejects unknown/empty fields and key permutations for topology/inherited command%s without unverifiable history',
  async (index) => {
    const a = await ready(),
      before = a.snapshot,
      p = a.f.s.world.peerings[0]!,
      commands: LabRequest['command'][] = [
        routeUpdate(a.f, 'None'),
        { type: 'DisassociateSubnetNsg', subnetId: a.f.appSubnet, nsgId: a.f.appNsg },
        {
          type: 'SetPeeringVirtualNetworkAccess',
          peeringId: p.id,
          vnetId: p.vnetId,
          value: 'false',
        },
        {
          type: 'CreateGroup',
          name: 'bad-fields',
          subscriptionId: 'sub-shared',
          metadataRegion: 'norwayeast',
        },
      ];
    for (const extras of [{ z: 'x', action: 'x' }, { action: 'x', z: 'x' }, { '': 'x' }]) {
      const r: LabRequest = {
        commandId: randomUUID(),
        expectedRevision: before.world.revision,
        command: { ...commands[index], ...extras } as LabRequest['command'],
      };
      const result = await repo.command(a.token, r, before.workspace);
      expect(result.receipt.outcome).toBe('unsupported');
      expect(result.world).toEqual(before.world);
      const current = await repo.read(a.token);
      expect(current.world).toEqual(before.world);
      expect(current.entries.at(-1)!.receipt).toEqual(result.receipt);
      expect((await repo.read(a.token, result.receipt.sequence)).world).toEqual(before.world);
      expect((await repo.command(a.token, r, before.workspace)).receipt).toEqual(result.receipt);
      expect(await repo.read(a.token)).toEqual(current);
    }
  },
);
it('HTTP topology APIs enforce actual session/CSRF, bind read-only analyses and original history, and return503 without fallback', async () => {
  vi.stubEnv('LAB_DATABASE_URL', url);
  vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
  const a = await ready(),
    h = {
      'Content-Type': 'application/json',
      Origin: 'http://127.0.0.1:3000',
      Cookie: 'azurelab_lab_v3=' + a.token,
      'If-Laboratory-Workspace': a.snapshot.workspace,
    };
  const post = (action: 'review' | 'command', r: LabRequest, headers = h) =>
    handle(
      new Request('http://127.0.0.1:3000/api/laboratory/' + action, {
        method: 'POST',
        headers,
        body: JSON.stringify(r),
      }),
      action,
    );
  const r = request(a);
  expect((await post('review', r)).status).toBe(200);
  expect(await repo.read(a.token)).toEqual(a.snapshot);
  expect((await post('command', r)).status).toBe(200);
  const current = await repo.read(a.token);
  const analysis = () =>
    handle(
      new Request(
        'http://127.0.0.1:3000/api/laboratory/policy-analysis?' + new URLSearchParams(a.f.input),
        { headers: h },
      ),
      'policy-analysis',
    );
  const response = await analysis();
  expect(response.status).toBe(200);
  expect((await response.json()).analysis).toMatchObject({
    model: laboratoryModel,
    workspace: a.snapshot.workspace,
    revision: current.world.revision,
    status: 'dropped-by-modeled-routing',
  });
  expect(await repo.read(a.token)).toEqual(current);
  const foreign = await repo.createSession(laboratoryModel);
  expect(
    (await post('command', r, { ...h, Cookie: 'azurelab_lab_v3=' + foreign.token })).status,
  ).toBe(409);
  expect((await repo.read(foreign.token)).entries).toEqual([]);
  expect((await post('command', r, { ...h, Origin: 'https://untrusted.invalid' })).status).toBe(
    403,
  );
  const update: LabRequest = {
    commandId: randomUUID(),
    expectedRevision: current.world.revision,
    command: routeUpdate(a.f),
  };
  expect((await post('command', update)).status).toBe(200);
  const restored = await repo.read(a.token);
  const subnet =
    restored.world.model === laboratoryModel &&
    restored.world.subnets.find((s) => s.id === a.f.appSubnet)!;
  if (!subnet) throw Error('missing authoritative subnet');
  const detach: LabRequest = {
    commandId: randomUUID(),
    expectedRevision: restored.world.revision,
    command: { type: 'DisassociateSubnetNsg', subnetId: subnet.id, nsgId: subnet.nsgId! },
  };
  expect((await post('command', detach)).status).toBe(200);
  const detached = await repo.read(a.token);
  expect(
    detached.world.model === laboratoryModel &&
      detached.world.subnets.find((s) => s.id === subnet.id)?.nsgId,
  ).toBeNull();
  const p = a.f.s.world.peerings.find((p) => p.id === a.f.appHub)!;
  expect(
    (
      await post('command', {
        commandId: randomUUID(),
        expectedRevision: detached.world.revision,
        command: {
          type: 'SetPeeringVirtualNetworkAccess',
          peeringId: p.id,
          vnetId: p.vnetId,
          value: 'false',
        },
      })
    ).status,
  ).toBe(200);
  expect((await (await analysis()).json()).analysis).toMatchObject({
    status: 'undetermined',
    accessEvaluation: 'undetermined',
    firewallPath: { configurationPathAssessed: false },
  });
  const old = await repo.read(a.token, a.snapshot.entries.length);
  expect(old).toEqual({ ...a.snapshot, historical: true });
  vi.stubEnv('LAB_DATABASE_URL', '');
  expect((await analysis()).status).toBe(503);
});
it.each([
  ['cold', []],
  ['3.2', ['003-routing.sql']],
  ['3.3', ['004-endpoints.sql']],
  ['3.4', ['005-compute.sql']],
  ['3.5', ['006-firewall.sql']],
  ['3.6', ['007-security-rules.sql']],
] as const)(
  '008 %s install/upgrade preserves all historical workspaces and repeat setup without narrowing constraints',
  async (_label, prefix) => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const name = 'azurelab_lab_test_topology_' + randomUUID().replaceAll('-', '').slice(0, 10);
    await admin.query(`CREATE DATABASE "${name}"`);
    const own = new URL(adminUrl),
      runtime = new URL(url);
    own.pathname = '/' + name;
    runtime.pathname = '/' + name;
    const owner = new Client({ connectionString: own.href }),
      rp = new Pool({ connectionString: runtime.href, max: 3 });
    await owner.connect();
    try {
      for (const f of ['001.sql', '002-networking.sql', ...prefix])
        await owner.query(readFileSync('database/laboratory-v3/' + f, 'utf8'));
      const prior: Model[] =
        prefix.length === 0 ? models.slice(0, 2) : models.slice(0, Number(prefix[0]!.slice(0, 3)));
      const rr = new Repository(rp),
        saved = [];
      for (const model of prior) {
        const a = await rr.createSession(model);
        await rr.command(
          a.token,
          {
            commandId: randomUUID(),
            expectedRevision: 0,
            command: {
              type: 'CreateGroup',
              name: 'historical',
              subscriptionId: 'sub-shared',
              metadataRegion: 'norwayeast',
            },
          },
          a.snapshot.workspace,
        );
        saved.push({ token: a.token, snapshot: await rr.read(a.token) });
      }
      for (let i = 0; i < 2; i++) {
        await owner.query(
          readFileSync('database/laboratory-v3/008-topology-remediation.sql', 'utf8'),
        );
        for (const s of saved)
          expect(canonical(await rr.read(s.token))).toBe(canonical(s.snapshot));
      }
      const current = await rr.createSession(laboratoryModel);
      expect(current.snapshot.world.model).toBe(laboratoryModel);
      await expect(
        owner.query(readFileSync('database/laboratory-v3/007-security-rules.sql', 'utf8')),
      ).rejects.toMatchObject({ code: '23514' });
      await owner.query('ROLLBACK');
      expect((await rr.read(current.token)).world.model).toBe(laboratoryModel);
      await expect(
        rp.query('UPDATE laboratory_v3.events SET receipt=receipt'),
      ).rejects.toMatchObject({ code: '42501' });
    } finally {
      await rp.end();
      await owner.end();
      await admin.query(`DROP DATABASE "${name}" WITH (FORCE)`);
      await admin.end();
    }
  },
);
