import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { Pool } from 'pg';
import { Repository, tokenHash } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { type Request } from './laboratory/v3/contract';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL;
if (
  !url ||
  !/^\/azurelab_lab_test_[a-z0-9_]+$/.test(new URL(url).pathname) ||
  !['127.0.0.1', 'localhost'].includes(new URL(url).hostname)
)
  throw Error(
    'Real isolated local LAB_TEST_DATABASE_URL required; integration is never silently skipped',
  );
vi.stubEnv('LAB_DATABASE_URL', url);
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
const request = (name = 'rg-server', id = 'create', revision = 0): Request => ({
  commandId: id,
  expectedRevision: revision,
  command: {
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name,
    metadataRegion: 'norwayeast',
  },
});
beforeAll(async () => {
  await pool.query('SELECT 1 FROM laboratory_v3.workspaces LIMIT 0');
});
afterAll(async () => {
  await pool.end();
  vi.unstubAllEnvs();
});
describe('actual PostgreSQL authority, isolation and concurrent commit', () => {
  it('serializes concurrent writers: accepted commit survives; other request records stale conflict', async () => {
    const s = await repo.createSession();
    const result = await Promise.all([
      repo.command(s.token, request('rg-alpha', 'alpha')),
      repo.command(s.token, request('rg-beta', 'beta')),
    ]);
    expect(result.map((r) => r.receipt.code).sort()).toEqual(['created', 'stale-revision']);
    const snapshot = await repo.read(s.token);
    expect(snapshot.world.groups).toHaveLength(1);
    expect(snapshot.entries).toHaveLength(2);
    expect(snapshot.world.revision).toBe(1);
    expect(snapshot.world.groups[0]!.name).toBe(
      result.find((r) => r.receipt.code === 'created')!.world.groups[0]!.name,
    );
  });
  it('concurrent identical commandId is idempotent; conflicting payload cannot replace original', async () => {
    const s = await repo.createSession();
    const results = await Promise.all([
      repo.command(s.token, request()),
      repo.command(s.token, request()),
    ]);
    expect(results[0]!.receipt).toEqual(results[1]!.receipt);
    expect(results.map((r) => r.redelivered).sort()).toEqual([false, true]);
    await expect(repo.command(s.token, request('different'))).rejects.toMatchObject({
      code: 'command-id-conflict',
    });
    const snapshot = await repo.read(s.token);
    expect(snapshot.entries).toHaveLength(1);
    expect(snapshot.world.groups[0]!.name).toBe('rg-server');
  });
  it('rolls back actual event and World writes before a failed commit acknowledgement', async () => {
    const s = await repo.createSession(),
      failing = new Repository(pool, () => {
        throw Error('Controlled abort before commit');
      });
    await expect(failing.command(s.token, request())).rejects.toThrow('Controlled abort');
    const snapshot = await repo.read(s.token);
    expect(snapshot.world.revision).toBe(0);
    expect(snapshot.entries).toEqual([]);
  });
  it('reload/through replay preserves original chain after explicit reset and redelivery cannot roll it back', async () => {
    const s = await repo.createSession();
    await repo.command(s.token, request());
    const reset: Request = {
      commandId: 'reset',
      expectedRevision: 1,
      command: { type: 'ResetWorkspace' },
    };
    await repo.command(s.token, reset);
    const before = await repo.read(s.token, 1),
      current = await repo.read(s.token);
    expect(before.world.groups).toHaveLength(1);
    expect(current.world.groups).toHaveLength(0);
    expect(current.world.attempt).toBe(2);
    const again = await repo.command(s.token, request());
    expect(again.redelivered).toBe(true);
    expect(again.receipt.afterRevision).toBe(1);
    expect(again.world).toEqual(current.world);
  });
  it('isolates anonymous sessions and rejects a guessed token or foreign parent', async () => {
    const a = await repo.createSession(),
      b = await repo.createSession();
    expect(a.token).not.toBe(b.token);
    expect(a.token).toHaveLength(43);
    await repo.command(a.token, request());
    expect((await repo.read(b.token)).world.groups).toHaveLength(0);
    const r = await repo.command(b.token, {
      commandId: 'foreign',
      expectedRevision: 0,
      command: {
        type: 'CreateStorageAccount',
        groupId: 'group-1',
        name: 'foreign',
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      },
    });
    expect(r.receipt.code).toBe('invalid-parent');
    await expect(repo.read(randomBytes(32).toString('base64url'))).rejects.toMatchObject({
      code: 'session-required',
    });
  });
  it('runtime role cannot alter/delete original receipts or create arbitrary database tables', async () => {
    for (const sql of [
      'UPDATE laboratory_v3.events SET receipt=receipt',
      'DELETE FROM laboratory_v3.events',
      'TRUNCATE laboratory_v3.events',
      'CREATE TABLE laboratory_v3.not_allowed(id int)',
    ])
      await expect(pool.query(sql)).rejects.toMatchObject({ code: '42501' });
  });
  it('review has no technical effect and invalid input gets an original atomic rejected receipt', async () => {
    const s = await repo.createSession(),
      r = request('!invalid');
    const preview = await repo.review(s.token, r);
    expect(preview.preview.code).toBe('invalid-name');
    expect((await repo.read(s.token)).entries).toHaveLength(0);
    const rejected = await repo.command(s.token, r);
    expect(rejected.receipt.code).toBe('invalid-name');
    expect(rejected.world.revision).toBe(0);
    expect((await repo.read(s.token)).entries).toHaveLength(1);
  });
  it('HTTP enforces exact Origin, bounded requests, cookie ownership and unknown query rejection', async () => {
    const origin = process.env.LAB_ORIGIN!;
    const denied = await handle(
      new globalThis.Request(origin + '/api/laboratory/session', {
        method: 'POST',
        headers: { Origin: 'https://attacker.invalid', 'Content-Type': 'application/json' },
        body: '{}',
      }),
      'session',
    );
    expect(denied.status).toBe(403);
    const oversized = await handle(
      new globalThis.Request(origin + '/api/laboratory/session', {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: 'x'.repeat(5000),
      }),
      'session',
    );
    expect(oversized.status).toBe(413);
    const unscoped = await handle(
      new globalThis.Request(origin + '/api/laboratory/state'),
      'state',
    );
    expect(unscoped.status).toBe(401);
    const id = await handle(
      new globalThis.Request(origin + '/api/laboratory/state?sessionId=other'),
      'state',
    );
    expect(id.status).toBe(400);
  });
  it('unknown/corrupt historical state fails closed rather than replacing it with current or empty success', async () => {
    const s = await repo.createSession();
    await repo.command(s.token, request());
    // Fault injection into a dedicated test workspace; never a positive World seed.
    await pool.query(
      "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{revision}','99') WHERE token_hash=$1",
      [tokenHash(s.token)],
    );
    await expect(repo.read(s.token)).rejects.toMatchObject({ code: 'unverifiable-history' });
  });
});

it('server-issued workspace precondition cannot authorize a different anonymous cookie scope', async () => {
  const a = await repo.createSession(),
    b = await repo.createSession();
  await expect(repo.command(b.token, request(), a.snapshot.workspace)).rejects.toMatchObject({
    code: 'workspace-changed',
  });
  expect((await repo.read(b.token)).entries).toHaveLength(0);
});
it('HTTPS session response sets only a Secure HttpOnly SameSite Host cookie after a real database commit', async () => {
  const original = process.env.LAB_ORIGIN!;
  vi.stubEnv('LAB_ORIGIN', 'https://laboratory.example');
  try {
    const response = await handle(
      new globalThis.Request('https://laboratory.example/api/laboratory/session', {
        method: 'POST',
        headers: { Origin: 'https://laboratory.example', 'Content-Type': 'application/json' },
        body: '{}',
      }),
      'session',
    );
    expect(response.status).toBe(201);
    const cookie = response.headers.get('set-cookie')!;
    expect(cookie).toMatch(/^__Host-azurelab_lab_v3=/);
    expect(cookie).toContain('; Secure');
    expect(cookie).toContain('; HttpOnly');
    expect(cookie).toContain('; SameSite=Strict');
    const value = await response.json();
    expect(value.token).toBeUndefined();
    expect(value.world.revision).toBe(0);
  } finally {
    vi.stubEnv('LAB_ORIGIN', original);
  }
});
