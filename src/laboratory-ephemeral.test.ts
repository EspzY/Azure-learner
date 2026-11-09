import { describe, expect, it } from 'vitest';
import { POST } from './app/api/laboratory/ephemeral/route';
import { canonical, execute, type Snapshot, type Command } from './laboratory/engine';
import { topologyWorld, routeUpdate } from '../tests/fixtures/topology-world';

const origin = 'https://azurelab.example';
const url = origin + '/api/laboratory/ephemeral';
const snapshot = (v: Snapshot): Snapshot => ({
  workspace: v.workspace,
  world: v.world,
  entries: v.entries,
  historical: v.historical,
});
async function call(body: unknown, headers: Record<string, string> = {}) {
  const result = await POST(
    new Request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin, ...headers },
      body: JSON.stringify(body),
    }),
  );
  return { status: result.status, headers: result.headers, data: await result.json() };
}
const start = async () =>
  (await call({ action: 'session', model: 'laboratory@3.7.0' })).data as Snapshot;
const request = (command: Command, expectedRevision: number, commandId = 'memory-command') => ({
  commandId,
  expectedRevision,
  command,
});
const group: Command = {
  type: 'CreateGroup',
  subscriptionId: 'sub-shared',
  name: 'rg-memory',
  metadataRegion: 'norwayeast',
};
const invoke = (s: Snapshot, action: string, values: object = {}) =>
  call({ action, snapshot: snapshot(s), workspace: s.workspace, ...values });
async function seeded() {
  const f = topologyWorld();
  let s = await start();
  for (const e of f.s.entries) {
    const result = await invoke(s, 'command', { request: e.request });
    expect(result.status).toBe(200);
    expect(result.data.receipt).toEqual(e.receipt);
    s = result.data;
  }
  expect(s.world).toEqual(f.s.world);
  return { f, s };
}
describe('bounded memory-only transport reuses frozen3.7 without a database', () => {
  it('starts distinct latest workspaces with no cookies and no storage/cache claim', async () => {
    const a = await call({ action: 'session' }),
      b = await start();
    expect(a.status).toBe(201);
    expect(a.data.world.model).toBe('laboratory@3.7.0');
    expect(a.data.entries).toEqual([]);
    expect(a.data.workspace).not.toBe(b.workspace);
    expect(a.headers.get('set-cookie')).toBeNull();
    expect(a.headers.get('cache-control')).toBe('no-store');
    expect((await call({ action: 'session', model: 'laboratory@3.5.0' })).status).toBe(422);
  });
  it('checks actual HTTP Host rather than Next internal URL host, requiring a matching non-cross-site origin', async () => {
    const r = await POST(
      new Request('http://localhost:3000/api/laboratory/ephemeral', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          host: '127.0.0.1:3000',
          origin: 'http://127.0.0.1:3000',
          'sec-fetch-site': 'same-origin',
        },
        body: '{"action":"session"}',
      }),
    );
    expect(r.status).toBe(201);
    for (const headers of [
      { Origin: 'https://evil.example' },
      { Origin: '' },
      { Origin: 'null' },
      { Origin: origin + '/path' },
      { 'Sec-Fetch-Site': 'cross-site' },
      { 'Sec-Fetch-Site': 'same-site' },
      { Host: 'wrong.example', 'X-Forwarded-Host': 'azurelab.example' },
    ] as Record<string, string>[])
      expect((await call({ action: 'session' }, headers)).status).toBe(403);
  });
  it('reviews read-only then returns actual original receipts, idempotency, stale rejection, historical through and explicit reset', async () => {
    const empty = await start(),
      req = request(group, 0),
      before = canonical(empty);
    const review = await invoke(empty, 'review', { request: req });
    expect(review.data.preview).toEqual(execute(empty.world, req, 1).receipt);
    expect(canonical(empty)).toBe(before);
    const made = await invoke(empty, 'command', { request: req });
    expect(made.data.receipt).toEqual(review.data.preview);
    expect(made.data.world.groups).toHaveLength(1);
    const duplicate = await invoke(made.data, 'command', { request: req });
    expect(duplicate.data.redelivered).toBe(true);
    expect(duplicate.data.entries).toHaveLength(1);
    expect(
      (await invoke(made.data, 'command', { request: { ...req, expectedRevision: 1 } })).data.error,
    ).toBe('command-id-conflict');
    const stale = await invoke(made.data, 'command', { request: { ...req, commandId: 'stale' } });
    expect(stale.data.receipt.code).toBe('stale-revision');
    expect(stale.data.world).toEqual(made.data.world);
    expect(stale.data.entries).toHaveLength(2);
    const historic = await invoke(stale.data, 'state', { through: 0 });
    expect(historic.data.world.groups).toHaveLength(0);
    expect(historic.data.historical).toBe(true);
    const reset = await invoke(stale.data, 'command', {
      request: request({ type: 'ResetWorkspace' }, 1, 'reset'),
    });
    expect(reset.data.receipt.outcome).toBe('accepted');
    expect(reset.data.world.groups).toHaveLength(0);
    expect(reset.data.entries).toHaveLength(3);
    expect((await invoke(reset.data, 'state', { through: 1 })).data.world).toEqual(made.data.world);
  });
  it('uses existing Storage, Compute/NIC/Disk, NSG, peering, routes, Firewall, rule edit and topology edit semantics', async () => {
    const seededResult = await seeded();
    let s = seededResult.s;
    const f = seededResult.f;
    for (const [index, command] of [
      routeUpdate(f, 'None'),
      routeUpdate(f),
      {
        type: 'UpdateSecurityRule',
        ruleId: f.appRule,
        nsgId: f.appNsg,
        priority: '210',
        direction: 'Outbound',
        protocol: 'Tcp',
        source: '10.10.1.0/24',
        sourcePort: '*',
        destination: '10.20.1.0/24',
        destinationPort: '1433',
        access: 'Allow',
      } as Command,
    ].entries()) {
      const req = request(command, s.world.revision, 'lifecycle-' + index);
      const expected = execute(s.world, req, s.entries.length + 1);
      const r = await invoke(s, 'command', { request: req });
      expect(r.data.receipt).toEqual(expected.receipt);
      expect(r.data.world).toEqual(expected.world);
      s = r.data;
    }
    const groupId = s.world.groups[0]!.id;
    let r = await invoke(s, 'command', {
      request: request(
        {
          type: 'CreateStorageAccount',
          name: 'memoryaccount',
          groupId,
          region: 'norwayeast',
          kind: 'StorageV2',
          sku: 'Standard_LRS',
        },
        s.world.revision,
        'account',
      ),
    });
    expect(r.data.receipt.outcome).toBe('accepted');
    s = r.data;
    r = await invoke(s, 'command', {
      request: request(
        {
          type: 'CreateBlobContainer',
          name: 'private-text',
          accountId: r.data.receipt.addedIds[0],
          access: 'private',
        },
        s.world.revision,
        'container',
      ),
    });
    expect(r.data.receipt.outcome).toBe('accepted');
    s = r.data;
    r = await invoke(s, 'command', {
      request: request(
        {
          type: 'CreateTextBlob',
          name: 'sample.txt',
          containerId: r.data.receipt.addedIds[0],
          contentType: 'text/plain',
          text: '<script>ikke HTML</script> æøå',
        },
        s.world.revision,
        'blob',
      ),
    });
    expect(r.data.receipt.outcome).toBe('accepted');
    s = r.data;
    expect(s.world.blobs[0]!.text).toBe('<script>ikke HTML</script> æøå');
    expect((await invoke(s, 'state')).data).toEqual(snapshot(s));
  });
  it('reuses route and Firewall/NSG policy analyses with workspace/revision binding and no command/event mutation', async () => {
    const { s } = await seeded();
    if (s.world.model !== 'laboratory@3.7.0') throw Error('model');
    const before = canonical(s),
      source = s.world.vms.find((v) => v.name === 'vm-app-01')!.nicId,
      destination = s.world.vms.find((v) => v.name === 'vm-data-01')!.nicId;
    const result = await invoke(s, 'policy-analysis', {
      values: {
        sourceNicId: source,
        destinationNicId: destination,
        protocol: 'Tcp',
        sourcePort: '50000',
        destinationPort: '1433',
      },
    });
    expect(result.status).toBe(200);
    expect(result.data.analysis.workspace).toBe(s.workspace);
    expect(result.data.analysis.revision).toBe(s.world.revision);
    expect(result.data.analysis.firewallPath.disposition).toBe('allowed-via-firewall');
    const route = await invoke(s, 'analysis', {
      values: {
        subnetId: s.world.nics.find((n) => n.id === source)!.subnetId,
        destination: '10.20.1.10',
      },
    });
    expect(route.status).toBe(200);
    expect(route.data.analysis.workspace).toBe(s.workspace);
    expect(canonical(s)).toBe(before);
    expect(result.data.entries).toEqual(s.entries);
    expect(
      (
        await invoke(s, 'policy-analysis', {
          values: {
            sourceNicId: source,
            destinationNicId: destination,
            protocol: 'Tcp',
            sourcePort: '50000',
            destinationPort: '1433',
            invented: 'field',
          },
        })
      ).status,
    ).toBe(400);
  });
  it('rejects changed receipts/world/history order, malformed fields, wrong workspace and historical snapshots without inventing success', async () => {
    const empty = await start();
    const made = (await invoke(empty, 'command', { request: request(group, 0) })).data as Snapshot;
    const wrongWorld = snapshot(structuredClone(made));
    wrongWorld.world.groups[0]!.name = 'forged';
    const wrongReceipt = snapshot(structuredClone(made));
    wrongReceipt.entries[0]!.receipt.code = 'updated';
    for (const bad of [
      wrongWorld,
      wrongReceipt,
      { ...snapshot(made), historical: true },
      { ...snapshot(made), injected: 'field' },
      { ...snapshot(made), entries: [null] },
    ])
      expect(
        (await call({ action: 'state', snapshot: bad, workspace: made.workspace })).status,
      ).toBe(422);
    expect(
      (await call({ action: 'state', snapshot: snapshot(made), workspace: crypto.randomUUID() }))
        .status,
    ).toBe(409);
    expect((await call({ action: 'session', unexpected: 'field' })).status).toBe(400);
    for (const action of ['__proto__', 'constructor', 'toString', 'Unknown'])
      expect((await call({ action })).status).toBe(400);
    expect(
      (await invoke(made, 'command', { request: { ...request(group, 1), extra: 'field' } })).status,
    ).toBe(400);
    for (const through of [-1, 1.5, 2, '0'])
      expect((await invoke(made, 'state', { through })).status).toBe(400);
  });
  it('rejects invalid JSON/media and bounded byte streams; no oversized history becomes a positive result', async () => {
    const body = JSON.stringify({ action: 'session', padding: 'x'.repeat(786432) });
    for (const headers of [{ 'Content-Length': String(body.length) }, {}] as Record<
      string,
      string
    >[]) {
      const r = await POST(
        new Request(url, {
          method: 'POST',
          headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
          body,
        }),
      );
      expect(r.status).toBe(413);
    }
    for (const [type, content, status] of [
      ['text/plain', '{}', 415],
      ['application/json', '{broken', 400],
    ] as const)
      expect(
        (
          await POST(
            new Request(url, {
              method: 'POST',
              headers: { Origin: origin, 'Content-Type': type },
              body: content,
            }),
          )
        ).status,
      ).toBe(status);
    const empty = await start();
    empty.entries = new Array(513).fill(null);
    expect((await invoke(empty, 'state')).status).toBe(422);
  });
});

it('refuses an oversized next history before advancing memory, leaving the current snapshot readable and room for explicit reset', async () => {
  let s = await start();
  const command = Object.fromEntries([
    ['type', 'NotSupported'],
    ...Array.from({ length: 11 }, (_, i) => ['unknown-' + i, 'x'.repeat(120)]),
  ]) as unknown as Command;
  let blocked!: ReturnType<typeof request>;
  for (;;) {
    const req = request(command, 0, 'budget-' + s.entries.length);
    const result = execute(s.world, req, s.entries.length + 1);
    const next: Snapshot = {
      ...snapshot(s),
      world: result.world,
      entries: [
        ...s.entries,
        {
          model: 'laboratory@3.7.0',
          attempt: s.world.attempt,
          request: req,
          receipt: result.receipt,
        } as (typeof s.entries)[number],
      ],
    };
    if (Buffer.byteLength(JSON.stringify(next)) > 786432 - 8192) {
      blocked = req;
      break;
    }
    s = next;
    if (s.entries.length > 510) throw Error('budget fixture exceeds event capacity');
  }
  // All records were produced by the real executor, not fabricated receipts.
  expect((await invoke(s, 'state')).status).toBe(200);
  const denied = await invoke(s, 'command', { request: blocked });
  expect(denied.status).toBe(409);
  expect(denied.data.error).toBe('history-limit');
  expect((await invoke(s, 'state')).data).toEqual(snapshot(s));
  const reset = await invoke(s, 'command', {
    request: request({ type: 'ResetWorkspace' }, 0, 'reserved-reset'),
  });
  expect(reset.status).toBe(200);
  expect(reset.data.world.attempt).toBe(2);
});
