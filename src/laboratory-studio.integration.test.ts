import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { Pool } from 'pg';
import { existsSync } from 'node:fs';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { models, canonical, replay } from './laboratory/engine';
import { studioWorld } from '../tests/fixtures/studio-world';
import { laboratoryInventory } from './features/laboratory/portal-adapter';
import { projectTopology, diagnosticReferences } from './features/laboratory/studio-model';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL,
  adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL;
if (
  !url ||
  !adminUrl ||
  !new URL(url).pathname.startsWith('/azurelab_lab_test_') ||
  !['127.0.0.1', 'localhost'].includes(new URL(url).hostname)
)
  throw Error('Dedicated isolated local test database required');
const pool = new Pool({ connectionString: url, max: 3 }),
  admin = new Pool({ connectionString: adminUrl, max: 1 }),
  repo = new Repository(pool);
vi.stubEnv('LAB_DATABASE_URL', url);
vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
afterAll(async () => {
  await pool.end();
  await admin.end();
  vi.unstubAllEnvs();
});
it('projects real owned persisted resources and server Firewall diagnostics without writing any World/event/receipt or leaking another session', async () => {
  const a = await repo.createSession('laboratory@3.5.0'),
    b = await repo.createSession('laboratory@3.5.0'),
    f = studioWorld();
  for (const entry of f.s.entries)
    expect((await repo.command(a.token, entry.request, a.snapshot.workspace)).receipt).toEqual(
      entry.receipt,
    );
  const before = await repo.read(a.token),
    bytes = canonical(before);
  const request = (token: string, workspace: string) =>
    new Request(
      'http://127.0.0.1:3000/api/laboratory/policy-analysis?' + new URLSearchParams(f.input),
      { headers: { Cookie: 'azurelab_lab_v3=' + token, 'If-Laboratory-Workspace': workspace } },
    );
  const response = await handle(request(a.token, before.workspace), 'policy-analysis');
  expect(response.status).toBe(200);
  const value = await response.json(),
    graph = projectTopology(value, laboratoryInventory(value.world));
  expect(graph.workspace).toBe(before.workspace);
  expect(graph.revision).toBe(before.world.revision);
  expect(value.analysis.firewallPath.configurationPathAssessed).toBe(true);
  expect(diagnosticReferences(value, value.analysis)).toContain(f.firewall);
  expect(canonical(await repo.read(a.token))).toBe(bytes);
  expect(replay(before.entries, before.world.model)).toEqual(before.world);
  const denied = await handle(request(b.token, before.workspace), 'policy-analysis');
  expect(denied.status).toBe(409);
  expect(await denied.json()).toEqual({ error: 'workspace-changed' });
  expect((await repo.read(b.token)).entries).toEqual([]);
});
it('keeps all six historical models and original through snapshots separate during topology reads and reset', async () => {
  for (const model of models) {
    const a = await repo.createSession(model);
    const created = await repo.command(
      a.token,
      {
        commandId: 'studio-historical-group',
        expectedRevision: 0,
        command: {
          type: 'CreateGroup',
          subscriptionId: 'sub-shared',
          name: 'historical',
          metadataRegion: 'norwayeast',
        },
      },
      a.snapshot.workspace,
    );
    const before = await repo.read(a.token),
      original = canonical(before.entries);
    const topology = projectTopology(before, laboratoryInventory(before.world));
    expect(topology.nodes.some((n) => n.id === created.receipt.addedIds[0])).toBe(true);
    expect(topology.model).toBe(model);
    expect(canonical((await repo.read(a.token)).entries)).toBe(original);
    await repo.command(
      a.token,
      {
        commandId: 'studio-reset',
        expectedRevision: before.world.revision,
        command: { type: 'ResetWorkspace' },
      },
      a.snapshot.workspace,
    );
    const historical = await repo.read(a.token, before.entries.length);
    expect(historical.world).toEqual(before.world);
    expect(projectTopology(historical, laboratoryInventory(historical.world))).toEqual(topology);
    const current = await repo.read(a.token);
    expect(current.world.model).toBe(model);
    expect(projectTopology(current, laboratoryInventory(current.world)).nodes).toEqual([]);
  }
});
it('refuses corrupt persisted evidence before a topology or analysis can be returned; missing backend remains503', async () => {
  const a = await repo.createSession('laboratory@3.5.0');
  await admin.query(
    "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{nextId}','999') WHERE id=$1",
    [a.snapshot.workspace],
  );
  await expect(repo.read(a.token)).rejects.toThrow('unverifiable-history');
  const response = await handle(
    new Request('http://127.0.0.1:3000/api/laboratory/state', {
      headers: { Cookie: 'azurelab_lab_v3=' + a.token },
    }),
    'state',
  );
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ error: 'unverifiable-history' });
  vi.stubEnv('LAB_DATABASE_URL', '');
  const unavailable = await handle(
    new Request('http://127.0.0.1:3000/api/laboratory/state'),
    'state',
  );
  expect(unavailable.status).toBe(503);
  expect(await unavailable.json()).toEqual({ error: 'backend-unavailable' });
  vi.stubEnv('LAB_DATABASE_URL', url!);
});
