import { expect, it } from 'vitest';
import { POST } from './app/api/laboratory/ephemeral/route';
import { replay, type Snapshot, type Request as LabRequest } from './laboratory/engine';
import { laboratoryModel, type Command, type World } from './laboratory/v39/contract';
async function call(body: unknown) {
  const result = await POST(
    new Request('https://azurelab.example/api/laboratory/ephemeral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://azurelab.example' },
      body: JSON.stringify(body),
    }),
  );
  return { status: result.status, headers: result.headers, data: await result.json() };
}
const clean = (snapshot: Snapshot): Snapshot => ({
  workspace: snapshot.workspace,
  world: snapshot.world,
  entries: snapshot.entries,
  historical: snapshot.historical,
});
const active = (snapshot: Snapshot) => snapshot.world as unknown as World;
async function start() {
  const result = await call({ action: 'session', model: laboratoryModel });
  expect(result.status).toBe(201);
  return result.data as Snapshot;
}
it('temporary3.9 uses the actual registered single command pipeline for app/database/binding/FrontDoor with original review and redelivery', async () => {
  let s = await start();
  const run = async (command: Command) => {
    const request = {
      commandId: `api-integrated-${s.entries.length}`,
      expectedRevision: s.world.revision,
      command: command as LabRequest['command'],
    };
    const reviewed = await call({
      action: 'review',
      snapshot: clean(s),
      workspace: s.workspace,
      request,
    });
    expect(reviewed.data.preview.outcome).toBe('accepted');
    const made = await call({
      action: 'command',
      snapshot: clean(s),
      workspace: s.workspace,
      request,
    });
    expect(made.status).toBe(200);
    expect(made.data.receipt).toEqual(reviewed.data.preview);
    expect(made.headers.get('set-cookie')).toBeNull();
    s = made.data;
    const again = await call({
      action: 'command',
      snapshot: clean(s),
      workspace: s.workspace,
      request,
    });
    expect(again.data.redelivered).toBe(true);
    expect(again.data.entries).toEqual(s.entries);
    return made.data;
  };
  await run({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-integrated-api',
    metadataRegion: 'norwayeast',
  });
  const groupId = s.world.groups[0]!.id;
  await run({
    type: 'CreateAppServicePlan',
    groupId,
    name: 'api-plan',
    region: 'norwayeast',
    os: 'Linux',
    sku: 'B1',
  });
  await run({
    type: 'CreateWebApp',
    groupId,
    name: 'api-app',
    planId: active(s).plans[0]!.id,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  });
  const appId = active(s).webApps[0]!.id;
  await run({
    type: 'DeploySyntheticApplication',
    webAppId: appId,
    template: 'api',
    healthPath: '/health',
    responseStatus: '200',
  });
  await run({
    type: 'CreatePostgresServer',
    groupId,
    name: 'api-postgres',
    region: 'norwayeast',
    version: '16',
    sku: 'Standard_B1ms',
    storageGiB: '32',
    publicNetworkAccess: 'Enabled',
  });
  await run({
    type: 'CreatePostgresDatabase',
    serverId: active(s).data.postgresServers[0]!.id,
    name: 'appdata',
    charset: 'UTF8',
  });
  const database = active(s).data.postgresDatabases[0]!;
  await run({
    type: 'CreateDatabaseConnection',
    appId,
    databaseId: database.id,
    databaseType: database.type,
    settingName: 'APP_DATABASE',
    tls: '1.2',
  });
  await run({ type: 'CreateFrontDoor', groupId, name: 'api-edge', sku: 'Standard_AzureFrontDoor' });
  const profileId = active(s).delivery.frontDoors[0]!.id;
  await run({ type: 'CreateFrontDoorEndpoint', profileId, name: 'api-endpoint', enabled: 'true' });
  await run({ type: 'CreateOriginGroup', profileId, name: 'api-origins', probePath: '/health' });
  await run({
    type: 'CreateFrontDoorOrigin',
    originGroupId: active(s).delivery.originGroups[0]!.id,
    name: 'api-origin',
    webAppId: appId,
    enabled: 'true',
    priority: '1',
  });
  await run({
    type: 'CreateFrontDoorRoute',
    endpointId: active(s).delivery.frontDoorEndpoints[0]!.id,
    name: 'api-route',
    originGroupId: active(s).delivery.originGroups[0]!.id,
    pattern: '/*',
    enabled: 'true',
  });
  expect(replay(s.entries, laboratoryModel as Snapshot['world']['model'])).toEqual(s.world);
  const request = {
    commandId: 'delete-dependent',
    expectedRevision: s.world.revision,
    command: { type: 'DeleteWebApp', webAppId: appId },
  };
  const denied = await call({
    action: 'command',
    snapshot: clean(s),
    workspace: s.workspace,
    request,
  });
  expect(denied.status).toBe(422);
  expect(denied.data.receipt.code).toBe('resource-in-use');
  expect(denied.data.world).toEqual(s.world);
  const through = await call({
    action: 'state',
    snapshot: clean(s),
    workspace: s.workspace,
    through: 4,
  });
  expect(active(through.data).delivery.frontDoors).toEqual([]);
  const forged = clean(structuredClone(s));
  active(forged).data.postgresServers[0]!.storageGiB = 64;
  expect((await call({ action: 'state', snapshot: forged, workspace: s.workspace })).status).toBe(
    422,
  );
});
it('temporary3.9 fails stale reviews, command ID collisions, foreign workspace and unknown request fields without altering active resources', async () => {
  const s = await start(),
    command = {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'first',
      metadataRegion: 'norwayeast',
    };
  const request = { commandId: 'first', expectedRevision: 0, command };
  const reviewed = await call({ action: 'review', snapshot: s, workspace: s.workspace, request });
  expect(reviewed.data.preview.outcome).toBe('accepted');
  const made = (await call({ action: 'command', snapshot: s, workspace: s.workspace, request }))
    .data;
  const stale = await call({
    action: 'command',
    snapshot: clean(made),
    workspace: s.workspace,
    request: { ...request, commandId: 'stale' },
  });
  expect(stale.data.receipt.code).toBe('stale-revision');
  expect(stale.data.world).toEqual(made.world);
  expect(
    (
      await call({
        action: 'command',
        snapshot: clean(made),
        workspace: s.workspace,
        request: { ...request, command: { ...command, name: 'collision' } },
      })
    ).data.error,
  ).toBe('command-id-conflict');
  expect(
    (
      await call({
        action: 'review',
        snapshot: clean(made),
        workspace: '00000000-0000-4000-8000-000000000000',
        request,
      })
    ).status,
  ).toBe(409);
  const invalid = await call({
    action: 'command',
    snapshot: clean(made),
    workspace: s.workspace,
    request: {
      commandId: 'unknown-field',
      expectedRevision: made.world.revision,
      command: {
        type: 'CreatePostgresServer',
        groupId: made.world.groups[0].id,
        name: 'invalid-server',
        region: 'norwayeast',
        version: '16',
        sku: 'Standard_B1ms',
        storageGiB: '32',
        publicNetworkAccess: 'Enabled',
        z: 'unsupported',
        a: 'unsupported',
      },
    },
  });
  expect(invalid.data.receipt).toMatchObject({
    code: 'unsupported-field',
    field: 'a',
    outcome: 'unsupported',
  });
  expect(invalid.data.world).toEqual(made.world);
});
it('temporary3.9 verified snapshots with JSONB-like HTTP trigger key order reject a semantic no-op and remain replayable', async () => {
  let s = await start();
  const run = async (command: Command) => {
    const made = await call({
      action: 'command',
      snapshot: clean(s),
      workspace: s.workspace,
      request: {
        commandId: `noop-api-${s.entries.length}`,
        expectedRevision: s.world.revision,
        command,
      },
    });
    expect(made.data.receipt.outcome).toBe('accepted');
    s = made.data;
  };
  await run({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-noop-api',
    metadataRegion: 'norwayeast',
  });
  const groupId = s.world.groups[0]!.id;
  await run({
    type: 'CreateStorageAccount',
    groupId,
    name: 'noopapistorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  await run({
    type: 'CreateBlobContainer',
    accountId: active(s).accounts[0]!.id,
    name: 'deployment',
    access: 'private',
  });
  await run({
    type: 'CreateFunctionApp',
    groupId,
    name: 'noop-api-functions',
    region: 'norwayeast',
    planName: 'noop-api-hosting',
    storageAccountId: active(s).accounts[0]!.id,
    deploymentContainerId: active(s).containers[0]!.id,
    runtime: 'node22',
    publicNetworkAccess: 'Enabled',
  });
  await run({
    type: 'CreateFunction',
    appId: active(s).data.functionApps[0]!.id,
    name: 'http-noop',
    trigger: 'http',
    method: 'GET',
    route: '/hello',
    containerId: '',
    behavior: 'static-text',
    responseText: 'Synthetic output',
  });
  const original = structuredClone(s),
    f = active(s).data.functions[0]!;
  active(s).data.functions[0]!.trigger = {
    kind: 'http',
    route: '/hello',
    method: 'GET',
    authLevel: 'anonymous',
  };
  const request = {
    commandId: 'same-http-function',
    expectedRevision: s.world.revision,
    command: {
      type: 'UpdateFunction',
      functionId: f.id,
      enabled: 'true',
      method: 'GET',
      route: '/hello',
      containerId: '',
      behavior: f.behavior,
      responseText: f.responseText,
    },
  };
  const reviewed = await call({
    action: 'review',
    snapshot: clean(s),
    workspace: s.workspace,
    request,
  });
  expect(reviewed.data.preview.code).toBe('no-change');
  const made = await call({
    action: 'command',
    snapshot: clean(s),
    workspace: s.workspace,
    request,
  });
  expect(made.status).toBe(422);
  expect(made.data.receipt).toEqual(reviewed.data.preview);
  expect(made.data.world).toEqual(original.world);
  expect(active(made.data).nextId).toBe(active(original).nextId);
  expect(
    (await call({ action: 'state', snapshot: clean(made.data), workspace: s.workspace })).status,
  ).toBe(200);
  expect(replay(made.data.entries, laboratoryModel as Snapshot['world']['model'])).toEqual(
    original.world,
  );
});
