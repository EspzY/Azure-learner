import { it, expect } from 'vitest';
import { POST } from './app/api/laboratory/ephemeral/route';
import { canonical, execute, replay, type Snapshot, type Command } from './laboratory/engine';
import * as old from './laboratory/v37/domain';
import { laboratoryModel } from './laboratory/v38/contract';
async function call(body: unknown) {
  const r = await POST(
    new Request('https://azurelab.example/api/laboratory/ephemeral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://azurelab.example' },
      body: JSON.stringify(body),
    }),
  );
  return { status: r.status, headers: r.headers, data: await r.json() };
}
const snapshot = (s: Snapshot): Snapshot => ({
  workspace: s.workspace,
  world: s.world,
  entries: s.entries,
  historical: s.historical,
});
it('explicit ephemeral3.8 performs real registered commands and exact server replay without database/cookie/durable claim', async () => {
  const a = await call({ action: 'session', model: laboratoryModel });
  expect(a.status).toBe(201);
  expect(a.headers.get('set-cookie')).toBeNull();
  expect(a.data.world.model).toBe(laboratoryModel);
  let s = a.data as Snapshot;
  for (const [i, command] of (
    [
      {
        type: 'CreateGroup',
        subscriptionId: 'sub-shared',
        name: 'rg-app',
        metadataRegion: 'norwayeast',
      },
      {
        type: 'CreateAppServicePlan',
        groupId: 'group-1',
        name: 'plan-app',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'B1',
      },
      {
        type: 'CreateWebApp',
        groupId: 'group-1',
        name: 'app-http',
        planId: 'app-plan-2',
        runtime: 'NODE|24-lts',
        httpsOnly: 'true',
        publicNetworkAccess: 'Enabled',
      },
    ] as Command[]
  ).entries()) {
    const request = { commandId: 'api-app-' + i, expectedRevision: s.world.revision, command };
    const review = await call({
      action: 'review',
      snapshot: snapshot(s),
      workspace: s.workspace,
      request,
    });
    expect(review.data.preview.outcome).toBe('accepted');
    const r = await call({
      action: 'command',
      snapshot: snapshot(s),
      workspace: s.workspace,
      request,
    });
    expect(r.status).toBe(200);
    expect(r.data.receipt).toEqual(execute(s.world, request, s.entries.length + 1).receipt);
    s = r.data;
    const again = await call({
      action: 'command',
      snapshot: snapshot(s),
      workspace: s.workspace,
      request,
    });
    expect(again.data.redelivered).toBe(true);
    expect(again.data.entries).toEqual(s.entries);
  }
  expect(replay(s.entries, laboratoryModel)).toEqual(s.world);
  const read = await call({
    action: 'state',
    snapshot: snapshot(s),
    workspace: s.workspace,
    through: 2,
  });
  expect(read.data.world.webApps).toEqual([]);
  expect(read.data.world.plans).toHaveLength(1);
  const forged = structuredClone(s);
  if (forged.world.model === laboratoryModel) forged.world.webApps[0]!.enabled = false;
  expect(
    (
      await call({
        action: 'state',
        snapshot: snapshot(forged),
        workspace: s.workspace,
        through: 3,
      })
    ).status,
  ).toBe(422);
});
it('keeps default ephemeral3.7 and original unsupported application receipt frozen under old model dispatch', async () => {
  expect((await call({ action: 'session' })).data.world.model).toBe('laboratory@3.7.0');
  const world = old.freshWorld(),
    request = {
      commandId: 'historical-app-unsupported',
      expectedRevision: 0,
      command: {
        type: 'CreateAppServicePlan',
        name: 'plan',
        groupId: 'none',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'B1',
      },
    } as unknown as Parameters<typeof old.execute>[1];
  const original = old.execute(world, request, 1);
  expect(original.receipt.code).toBe('unsupported-capability');
  const entries = [
    { model: world.model, attempt: world.attempt, request, receipt: original.receipt },
  ];
  expect(replay(entries, world.model)).toEqual(world);
  expect(canonical(execute(world, request, 1).receipt)).toBe(canonical(original.receipt));
});
it('3.8 ephemeral review/commit requires exactworkspace and stale proposals cannot override new revision', async () => {
  const s = (await call({ action: 'session', model: laboratoryModel })).data as Snapshot;
  const request = {
    commandId: 'first',
    expectedRevision: 0,
    command: {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-app',
      metadataRegion: 'norwayeast',
    },
  };
  expect(
    (
      await call({
        action: 'review',
        snapshot: s,
        workspace: '00000000-0000-4000-8000-000000000000',
        request,
      })
    ).status,
  ).toBe(409);
  const made = (await call({ action: 'command', snapshot: s, workspace: s.workspace, request }))
    .data;
  const stale = await call({
    action: 'command',
    snapshot: snapshot(made),
    workspace: s.workspace,
    request: { ...request, commandId: 'second' },
  });
  expect(stale.data.receipt.code).toBe('stale-revision');
  expect(stale.data.world).toEqual(made.world);
  const conflict = await call({
    action: 'command',
    snapshot: snapshot(made),
    workspace: s.workspace,
    request: { ...request, command: { ...request.command, name: 'different' } },
  });
  expect(conflict.data.error).toBe('command-id-conflict');
});

it.each([null, ['laboratory@3.8.0'], { model: 'laboratory@3.8.0' }, 'laboratory@future'])(
  'rejects non-string or unknown explicit model without downgrade: %j',
  async (model) => {
    expect((await call({ action: 'session', model })).status).toBe(422);
  },
);
