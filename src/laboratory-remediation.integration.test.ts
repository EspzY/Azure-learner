import { it, expect, vi, afterAll } from 'vitest';
vi.mock('server-only', () => ({}));
import { readFileSync, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Pool, Client } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import { models, canonical, type Request as LabRequest, type Model } from './laboratory/engine';
import { laboratoryModel } from './laboratory/v36/contract';
import {
  remediationWorld,
  ambiguousChanges,
  ruleChanges,
} from '../tests/fixtures/remediation-world';
import { firewallWorld } from '../tests/fixtures/firewall-world';
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
  throw Error('Dedicated local test databases required');
const pool = new Pool({ connectionString: url, max: 5 }),
  repo = new Repository(pool);
afterAll(async () => {
  await pool.end();
  vi.unstubAllEnvs();
});
async function ready() {
  const a = await repo.createSession(laboratoryModel),
    f = remediationWorld();
  for (const e of f.s.entries)
    expect((await repo.command(a.token, e.request, a.snapshot.workspace)).receipt).toEqual(
      e.receipt,
    );
  return { ...a, f, snapshot: await repo.read(a.token) };
}
const edit = (a: Awaited<ReturnType<typeof ready>>, port = '1433'): LabRequest => {
  a.f.s.updateNsg(a.f.appRule, { destinationPort: port });
  return {
    ...a.f.s.entries.at(-1)!.request,
    commandId: randomUUID(),
    expectedRevision: a.snapshot.world.revision,
  };
};
it.each([0, 1, 2, 3])(
  'actual PostgreSQL rejects empty unsupported key on lifecycle command%s and retains exact original resources history and through',
  async (index) => {
    const a = await ready(),
      before = a.snapshot,
      request = {
        commandId: randomUUID(),
        expectedRevision: before.world.revision,
        command: { ...ruleChanges(a.f)[index]!, '': 'forbidden' },
      } as unknown as LabRequest;
    const result = await repo.command(a.token, request, before.workspace);
    expect(result.receipt).toMatchObject({
      outcome: 'unsupported',
      code: 'unsupported-field',
      field: '',
    });
    expect(result.world).toEqual(before.world);
    const after = await repo.read(a.token);
    expect(after.world).toEqual(before.world);
    expect(after.entries.slice(0, before.entries.length)).toEqual(before.entries);
    expect(after.entries.at(-1)!.receipt).toEqual(result.receipt);
    expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
    expect((await repo.read(a.token, result.receipt.sequence)).world).toEqual(before.world);
    expect((await repo.command(a.token, request, before.workspace)).receipt).toEqual(
      result.receipt,
    );
    expect(await repo.read(a.token)).toEqual(after);
  },
);
it.each([0, 1, 2, 3, 4])(
  'real JSONB preserves rejected receipt, readable workspace, idempotency and through for multiple extra fields on operation index%s',
  async (index) => {
    const a = await ready(),
      before = a.snapshot,
      item = ambiguousChanges(a.f)[index]!;
    for (const extras of [
      { [item.extra]: '100', action: 'Allow' },
      { action: 'Allow', [item.extra]: '100' },
    ]) {
      const request = {
        commandId: randomUUID(),
        expectedRevision: before.world.revision,
        command: { ...item.command, ...extras },
      } as LabRequest;
      const result = await repo.command(a.token, request, before.workspace);
      expect(result.receipt).toMatchObject({
        code: 'unsupported-field',
        field: 'action',
        outcome: 'unsupported',
      });
      expect(result.world).toEqual(before.world);
      const after = await repo.read(a.token);
      expect(after.world).toEqual(before.world);
      expect(after.entries.at(-1)!.receipt).toEqual(result.receipt);
      expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
      expect((await repo.read(a.token, result.receipt.sequence)).world).toEqual(before.world);
      expect((await repo.command(a.token, request, before.workspace)).receipt).toEqual(
        result.receipt,
      );
      expect(await repo.read(a.token)).toEqual(after);
    }
  },
);
it('real Review is read-only; updates/deletes commit atomically, rollback exposes no receipt, concurrent and idempotent commands preserve original history', async () => {
  const a = await ready(),
    before = a.snapshot,
    request = edit(a),
    review = await repo.review(a.token, request, before.workspace);
  expect(review.preview.outcome).toBe('accepted');
  expect(await repo.read(a.token)).toEqual(before);
  const broken = new Repository(pool, () => {
    throw Error('lifecycle-before-commit');
  });
  await expect(broken.command(a.token, request, before.workspace)).rejects.toThrow(
    'lifecycle-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(before);
  const rival = {
    ...request,
    commandId: randomUUID(),
    command: { ...request.command, destinationPort: '443' },
  } as LabRequest;
  const results = await Promise.all(
    [request, rival].map((r) => repo.command(a.token, r, before.workspace)),
  );
  expect(results.map((r) => r.receipt.code).sort()).toEqual(['stale-revision', 'updated']);
  const winner = results.find((r) => r.receipt.outcome === 'accepted')!,
    original = winner.receipt.commandId === request.commandId ? request : rival;
  const after = await repo.read(a.token);
  expect(
    after.world.model === laboratoryModel &&
      after.world.securityRules.find((r) => r.id === a.f.appRule)?.origin,
  ).toBe(
    before.world.model === laboratoryModel &&
      before.world.securityRules.find((r) => r.id === a.f.appRule)?.origin,
  );
  expect(after.entries.slice(0, before.entries.length)).toEqual(before.entries);
  expect(after.entries).toHaveLength(before.entries.length + 2);
  expect((await repo.command(a.token, original, before.workspace)).receipt).toEqual(winner.receipt);
  expect(await repo.read(a.token)).toEqual(after);
  await expect(
    repo.command(
      a.token,
      { ...original, command: { ...original.command, destinationPort: '3389' } } as LabRequest,
      before.workspace,
    ),
  ).rejects.toMatchObject({ code: 'command-id-conflict', status: 409 });
  const remove: LabRequest = {
    commandId: randomUUID(),
    expectedRevision: after.world.revision,
    command: { type: 'DeleteSecurityRule', ruleId: a.f.appRule, nsgId: a.f.appNsg },
  };
  await expect(broken.command(a.token, remove, before.workspace)).rejects.toThrow(
    'lifecycle-before-commit',
  );
  expect(await repo.read(a.token)).toEqual(after);
  const deleted = await repo.command(a.token, remove, before.workspace);
  expect(deleted.receipt.change?.after).toBeNull();
  expect(
    deleted.world.model === laboratoryModel &&
      deleted.world.securityRules.some((r) => r.id === a.f.appRule),
  ).toBe(false);
  expect((await repo.read(a.token, before.entries.length)).world).toEqual(before.world);
  expect((await repo.read(a.token, winner.receipt.sequence)).world).toEqual(after.world);
  expect((await repo.command(a.token, remove, before.workspace)).receipt).toEqual(deleted.receipt);
  const reset = await repo.command(
    a.token,
    {
      commandId: randomUUID(),
      expectedRevision: deleted.world.revision,
      command: { type: 'ResetWorkspace' },
    },
    before.workspace,
  );
  expect(reset.world.model === laboratoryModel && reset.world.firewalls).toEqual([]);
  expect((await repo.read(a.token, deleted.entries.length)).world).toEqual(deleted.world);
  const b = await repo.createSession(laboratoryModel);
  await expect(repo.review(b.token, request, a.snapshot.workspace)).rejects.toMatchObject({
    code: 'workspace-changed',
    status: 409,
  });
  await expect(repo.command(b.token, request, a.snapshot.workspace)).rejects.toMatchObject({
    code: 'workspace-changed',
    status: 409,
  });
  expect((await repo.read(b.token)).entries).toEqual([]);
});
it('actual server routes reuse analyses after Firewall edits/deletes and reject foreign scopes, invalid fields, old-model mutation and unavailable backend', async () => {
  vi.stubEnv('LAB_DATABASE_URL', url);
  vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
  const a = await ready(),
    state = a.snapshot,
    headers = {
      Origin: 'http://127.0.0.1:3000',
      'Content-Type': 'application/json',
      'If-Laboratory-Workspace': state.workspace,
      Cookie: 'azurelab_lab_v3=' + a.token,
    };
  const request: LabRequest = {
    commandId: randomUUID(),
    expectedRevision: state.world.revision,
    command: {
      type: 'UpdateFirewallNetworkRule',
      ruleId: a.f.rule,
      collectionId: a.f.collection,
      source: '10.10.1.10',
      destination: '10.20.1.10',
      protocol: 'Tcp',
      destinationPort: '1433',
    },
  };
  const post = (action: 'review' | 'command', body: unknown, h = headers) =>
    handle(
      new Request('http://127.0.0.1:3000/api/laboratory/' + action, {
        method: 'POST',
        headers: h,
        body: JSON.stringify(body),
      }),
      action,
    );
  const r = await post('review', request);
  expect(r.status).toBe(200);
  expect((await r.json()).preview.change.after.source).toBe('10.10.1.10');
  expect(await repo.read(a.token)).toEqual(state);
  expect((await post('command', request)).status).toBe(200);
  const analysis = () =>
    handle(
      new Request(
        'http://127.0.0.1:3000/api/laboratory/policy-analysis?' + new URLSearchParams(a.f.input),
        { headers },
      ),
      'policy-analysis',
    );
  const body = await (await analysis()).json();
  expect(body.analysis).toMatchObject({
    workspace: state.workspace,
    model: laboratoryModel,
    revision: state.world.revision + 1,
    status: 'allowed-by-modeled-network-policy',
    firewallPath: { decision: { matchedRuleId: a.f.rule } },
  });
  expect(body.analysis.route.model).toBe(laboratoryModel);
  const after = await repo.read(a.token);
  expect(
    (
      await post('command', {
        commandId: randomUUID(),
        expectedRevision: after.world.revision,
        command: {
          type: 'DeleteFirewallNetworkRule',
          ruleId: a.f.rule,
          collectionId: a.f.collection,
        },
      })
    ).status,
  ).toBe(200);
  expect((await (await analysis()).json()).analysis.firewallPath.decision).toMatchObject({
    status: 'deny',
    reason: 'default-deny',
    matchedRuleId: null,
  });
  expect((await repo.read(a.token, state.entries.length)).world).toEqual(state.world);
  const foreign = await repo.createSession(laboratoryModel);
  expect(
    (await post('command', request, { ...headers, Cookie: 'azurelab_lab_v3=' + foreign.token }))
      .status,
  ).toBe(409);
  expect(
    (await post('command', request, { ...headers, Origin: 'https://untrusted.invalid' })).status,
  ).toBe(403);
  const old = await repo.createSession('laboratory@3.5.0'),
    fixture = firewallWorld();
  for (const e of fixture.s.entries)
    await repo.command(old.token, e.request, old.snapshot.workspace);
  const oldBefore = await repo.read(old.token),
    reject = await repo.command(
      old.token,
      { ...request, commandId: randomUUID(), expectedRevision: oldBefore.world.revision },
      oldBefore.workspace,
    );
  expect(reject.receipt.code).toBe('unsupported-capability');
  expect(reject.world).toEqual(oldBefore.world);
  expect((await repo.read(old.token, oldBefore.entries.length)).world).toEqual(oldBefore.world);
  vi.stubEnv('LAB_DATABASE_URL', '');
  expect((await analysis()).status).toBe(503);
});
it.each([
  ['cold', []],
  ['3.2', ['003-routing.sql']],
  ['3.3', ['004-endpoints.sql']],
  ['3.4', ['005-compute.sql']],
  ['3.5', ['006-firewall.sql']],
] as const)(
  '007 %s install/upgrade preserves historical snapshots, repeat setup and permissions',
  async (_label, prefix) => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const run = async (prefix: readonly string[]) => {
      const name = 'azurelab_lab_test_remediation_' + randomUUID().replaceAll('-', '').slice(0, 10);
      await admin.query(`CREATE DATABASE "${name}"`);
      const own = new URL(adminUrl);
      own.pathname = '/' + name;
      const runtime = new URL(url);
      runtime.pathname = '/' + name;
      const owner = new Client({ connectionString: own.href }),
        rp = new Pool({ connectionString: runtime.href, max: 3 });
      await owner.connect();
      try {
        for (const f of ['001.sql', '002-networking.sql', ...prefix])
          await owner.query(readFileSync('database/laboratory-v3/' + f, 'utf8'));
        const beforeModels: Model[] =
          prefix.length === 0
            ? models.slice(0, 2)
            : models.slice(0, Number(prefix[0]!.slice(0, 3)) - 0);
        const rr = new Repository(rp),
          saved = [];
        for (const model of beforeModels.filter((m) => m !== laboratoryModel)) {
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
          await owner.query(readFileSync('database/laboratory-v3/007-security-rules.sql', 'utf8'));
          for (const a of saved)
            expect(canonical(await rr.read(a.token))).toBe(canonical(a.snapshot));
        }
        const current = await rr.createSession(laboratoryModel);
        expect(current.snapshot.world.model).toBe(laboratoryModel);
        await expect(
          owner.query(readFileSync('database/laboratory-v3/006-firewall.sql', 'utf8')),
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
      }
    };
    try {
      await run(prefix);
    } finally {
      await admin.end();
    }
  },
);
