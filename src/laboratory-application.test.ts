import { describe, it, expect } from 'vitest';
import {
  freshWorld,
  execute,
  replay,
  canonical,
  parseRequest,
  resources,
} from './laboratory/v38/domain';
import { laboratoryModel, type Command, type Entry } from './laboratory/v38/contract';
import { topologyWorld } from '../tests/fixtures/topology-world';
import { analysePolicy, analyseWebApp } from './laboratory/v38/analysis';
import { webAppReferences } from './laboratory/v38/projection';
import { limits } from './laboratory/v3/contract';
import { laboratoryInventory } from './features/laboratory/portal-adapter';
import { projectTopology, relationLabel } from './features/laboratory/studio-model';
function fixture() {
  let w = freshWorld();
  const entries: Entry[] = [];
  const run = (command: Command, revision = w.revision) => {
    const request = {
      commandId: `application-${entries.length}`,
      expectedRevision: revision,
      command,
    };
    const result = execute(w, request, entries.length + 1);
    entries.push({ model: laboratoryModel, attempt: w.attempt, request, receipt: result.receipt });
    w = result.world;
    return result.receipt;
  };
  run({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-app',
    metadataRegion: 'norwayeast',
  });
  return {
    get world() {
      return w;
    },
    entries,
    run,
  };
}
const plan = (groupId: string): Command => ({
  type: 'CreateAppServicePlan',
  groupId,
  name: 'plan-app',
  region: 'norwayeast',
  os: 'Linux',
  sku: 'B1',
});
function appFixture() {
  const f = fixture();
  f.run(plan(f.world.groups[0]!.id));
  f.run({
    type: 'CreateWebApp',
    groupId: f.world.groups[0]!.id,
    name: 'web-app',
    planId: f.world.plans[0]!.id,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  });
  return f;
}
describe('Application Platform3.8', () => {
  it('creates one integrated plan/app/deployment/settings chain and derives actual refs and analysis', () => {
    const f = appFixture(),
      app = f.world.webApps[0]!;
    expect(analyseWebApp(f.world, app.id)?.issues).toEqual(['no-deployment']);
    f.run({
      type: 'DeploySyntheticApplication',
      webAppId: app.id,
      template: 'hello-world',
      healthPath: '/health',
      responseStatus: '200',
    });
    f.run({
      type: 'SetWebAppSetting',
      webAppId: app.id,
      name: 'APP_GREETING',
      value: 'Hello <script>alert(1)</script>',
    });
    expect(analyseWebApp(f.world, app.id)).toMatchObject({
      revision: 5,
      status: 'synthetic-configuration-consistent',
      application: { healthPath: '/health', responseStatus: 200 },
    });
    expect(webAppReferences(f.world)[0]).toMatchObject({
      id: app.id,
      type: 'Microsoft.Web/sites',
      subscriptionId: 'sub-shared',
      deployment: 'synthetic-http',
      settings: [{ name: 'APP_GREETING' }],
    });
    expect(replay(f.entries)).toEqual(f.world);
    expect(replay(JSON.parse(canonical(f.entries)))).toEqual(f.world);
  });
  it('changes stable identities with before/after and preserves original origin and through history', () => {
    const f = appFixture(),
      app = f.world.webApps[0]!,
      original = structuredClone(app),
      through = f.entries.length;
    const receipt = f.run({
      type: 'UpdateWebApp',
      webAppId: app.id,
      runtime: app.runtime,
      httpsOnly: 'true',
      publicNetworkAccess: 'Disabled',
      enabled: 'false',
    });
    expect(f.world.webApps[0]).toMatchObject({
      id: original.id,
      origin: original.origin,
      enabled: false,
      publicNetworkAccess: 'Disabled',
    });
    expect(receipt.applicationChange).toMatchObject({
      id: original.id,
      createOrigin: original.origin,
      before: { enabled: true },
      after: { enabled: false },
    });
    expect(replay(f.entries, through)?.webApps[0]).toEqual(original);
    expect(analyseWebApp(f.world, app.id)?.issues).toContain('disabled');
  });
  it('rejects referenced plan deletion atomically; delete app removes only owned configuration and preserves history', () => {
    const f = appFixture(),
      app = f.world.webApps[0]!,
      before = structuredClone(f.world);
    expect(f.run({ type: 'DeleteAppServicePlan', planId: app.planId }).code).toBe(
      'resource-in-use',
    );
    expect(f.world).toEqual(before);
    f.run({
      type: 'DeploySyntheticApplication',
      webAppId: app.id,
      template: 'api',
      healthPath: '/health',
      responseStatus: '503',
    });
    const through = f.entries.length,
      receipt = f.run({ type: 'DeleteWebApp', webAppId: app.id });
    expect(receipt.removedIds).toHaveLength(2);
    expect(f.world.webApps).toEqual([]);
    expect(f.world.plans).toHaveLength(1);
    expect(replay(f.entries, through)?.webApps).toHaveLength(1);
    expect(f.run({ type: 'DeleteAppServicePlan', planId: app.planId }).outcome).toBe('accepted');
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('retains setting identity and create origin on update and supports explicit delete', () => {
    const f = appFixture(),
      id = f.world.webApps[0]!.id;
    f.run({ type: 'SetWebAppSetting', webAppId: id, name: 'APP_GREETING', value: 'old' });
    const original = f.world.settings[0]!;
    f.run({ type: 'SetWebAppSetting', webAppId: id, name: 'APP_GREETING', value: 'new' });
    expect(f.world.settings[0]).toMatchObject({
      id: original.id,
      origin: original.origin,
      value: 'new',
    });
    expect(
      f.run({ type: 'SetWebAppSetting', webAppId: id, name: 'APP_GREETING', value: 'new' }).code,
    ).toBe('no-change');
    f.run({ type: 'DeleteWebAppSetting', webAppId: id, settingId: original.id });
    expect(f.world.settings).toEqual([]);
    expect(replay(f.entries)).toEqual(f.world);
  });
  it.each([
    [
      {
        type: 'CreateAppServicePlan',
        groupId: 'missing',
        name: 'plan',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'B1',
      },
      'invalid-parent',
    ],
    [
      {
        type: 'CreateAppServicePlan',
        groupId: 'group-1',
        name: 'bad_',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'B1',
      },
      'invalid-name',
    ],
    [
      {
        type: 'CreateAppServicePlan',
        groupId: 'group-1',
        name: 'plan',
        region: 'moon',
        os: 'Linux',
        sku: 'B1',
      },
      'invalid-region',
    ],
    [
      {
        type: 'CreateAppServicePlan',
        groupId: 'group-1',
        name: 'plan',
        region: 'norwayeast',
        os: 'Windows',
        sku: 'B1',
      },
      'unsupported-profile',
    ],
    [
      {
        type: 'CreateAppServicePlan',
        groupId: 'group-1',
        name: 'plan',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'Free',
      },
      'unsupported-profile',
    ],
  ] as const)('denies unsupported input without mutation: %j', (c, code) => {
    const f = fixture(),
      before = structuredClone(f.world);
    expect(f.run(c as Command).code).toBe(code);
    expect(f.world).toEqual(before);
    expect(replay(f.entries)).toEqual(before);
  });
  it('validates namespace/subscription and exact complete configs', () => {
    const f = appFixture(),
      a = f.world.webApps[0]!;
    expect(f.run(plan(f.world.groups[0]!.id)).code).toBe('duplicate-name');
    f.run({
      type: 'CreateGroup',
      subscriptionId: 'sub-app',
      name: 'rg-other',
      metadataRegion: 'norwayeast',
    });
    expect(
      f.run({
        type: 'CreateWebApp',
        groupId: f.world.groups[1]!.id,
        name: 'cross-app',
        planId: a.planId,
        runtime: a.runtime,
        httpsOnly: 'true',
        publicNetworkAccess: 'Enabled',
      }).code,
    ).toBe('incompatible-association');
    expect(
      f.run({
        type: 'UpdateWebApp',
        webAppId: a.id,
        runtime: 'PHP|8.4',
        httpsOnly: 'true',
        publicNetworkAccess: 'Enabled',
        enabled: 'true',
      }).code,
    ).toBe('unsupported-profile');
    expect(
      f.run({
        type: 'DeploySyntheticApplication',
        webAppId: a.id,
        template: 'remote-code',
        healthPath: '/health',
        responseStatus: '200',
      }).code,
    ).toBe('unsupported-profile');
    expect(
      f.run({ type: 'SetWebAppSetting', webAppId: a.id, name: 'PASSWORD', value: 'secret' }).code,
    ).toBe('unsupported-profile');
    expect(
      f.run({
        type: 'CreateAppServicePlan',
        groupId: f.world.groups[0]!.id,
        name: 'new-plan',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'B1',
        unknown: 'x',
      } as Command).code,
    ).toBe('unsupported-field');
  });
  it('rejects stale writes, noops and canonicalizes unknown input order without corrupting replay', () => {
    const f = appFixture(),
      p = f.world.plans[0]!,
      before = structuredClone(f.world);
    expect(f.run({ type: 'UpdateAppServicePlan', planId: p.id, sku: 'P1v3' }, 0).code).toBe(
      'stale-revision',
    );
    expect(f.run({ type: 'UpdateAppServicePlan', planId: p.id, sku: p.sku }).code).toBe(
      'no-change',
    );
    for (const command of [
      { type: 'MadeUp', z: 'last', a: 'first' },
      {
        type: 'CreateAppServicePlan',
        groupId: 'group-1',
        name: 'plan',
        region: 'norwayeast',
        os: 'Linux',
        sku: 'B1',
        '': 'empty',
        z: 'last',
      },
    ])
      f.run(command as Command);
    expect(f.world).toEqual(before);
    expect(replay(JSON.parse(canonical(f.entries)))).toEqual(before);
    expect(
      parseRequest({
        commandId: 'bad',
        expectedRevision: 0,
        command: { type: 'CreateWebApp', blob: {} },
      }),
    ).toBeNull();
  });
  it('enforces total shared budget including inherited operations and resets all families without reusing IDs', () => {
    const f = appFixture(),
      full = structuredClone(f.world);
    while (resources(full).length < limits.entities)
      full.settings.push({
        id: 'fill-' + full.settings.length,
        name: 'FILL_' + full.settings.length,
        webAppId: full.webApps[0]!.id,
        value: 'x',
        origin: 'fixture',
      });
    const command = {
      type: 'CreateStorageAccount',
      groupId: full.groups[0]!.id,
      name: 'capacityaccount',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    } as Command;
    const result = execute(
      full,
      { commandId: 'full', expectedRevision: full.revision, command },
      1,
    );
    expect(result.receipt.code).toBe('capacity');
    expect(result.world).toBe(full);
    const oldId = f.world.nextId,
      reset = f.run({ type: 'ResetWorkspace' });
    expect(reset.removedIds).toHaveLength(3);
    expect(resources(f.world)).toEqual([]);
    expect(f.world.nextId).toBe(oldId);
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('rejects tampered receipts/through/duplicate command ID rather than inventing success', () => {
    const f = appFixture(),
      bad = structuredClone(f.entries);
    bad[0]!.receipt.afterRevision = 999;
    expect(replay(bad)).toBeNull();
    expect(replay(f.entries, -1)).toBeNull();
    expect(replay(f.entries, f.entries.length + 1)).toBeNull();
    const dup = structuredClone(f.entries);
    dup[1]!.request.commandId = dup[0]!.request.commandId;
    expect(replay(dup)).toBeNull();
  });
  it('keeps pure analyses and resource projections read-only', () => {
    const f = appFixture();
    f.run({
      type: 'SetWebAppSetting',
      webAppId: f.world.webApps[0]!.id,
      name: 'APP_GREETING',
      value: 'Original synthetic greeting',
    });
    const before = canonical(f.world);
    analyseWebApp(f.world, f.world.webApps[0]!.id);
    const references = webAppReferences(f.world);
    expect(references[0]!.settings[0]).not.toBe(f.world.settings[0]);
    // Simulate a JavaScript consumer ignoring the readonly TypeScript interface.
    Reflect.set(references[0]!.settings[0]!, 'value', 'Mutated projection');
    Reflect.set(references[0]!, 'name', 'Mutated projection name');
    resources(f.world);
    expect(canonical(f.world)).toBe(before);
    expect(webAppReferences(f.world)[0]!.settings[0]!.value).toBe('Original synthetic greeting');
  });
});

it('keeps inherited routing NSG Firewall algorithms but binds every nested analysis to actual3.8 revision', () => {
  const fixture = topologyWorld();
  let world = freshWorld();
  for (const [i, e] of fixture.s.entries.entries()) {
    const result = execute(world, { ...e.request, expectedRevision: world.revision }, i + 1);
    expect(result.receipt.outcome).toBe('accepted');
    world = result.world;
  }
  const before = canonical(world),
    result = analysePolicy(world, fixture.input);
  expect(result.ok).toBe(true);
  if (!result.ok) throw Error('analysis');
  expect(result.analysis.model).toBe(laboratoryModel);
  expect(result.analysis.revision).toBe(world.revision);
  for (const route of [
    result.analysis.route,
    result.analysis.firewallPath.forwardRoute,
    result.analysis.firewallPath.nextHopRoute,
    result.analysis.firewallPath.onwardRoute,
    result.analysis.firewallPath.returnRoute,
    result.analysis.firewallPath.hubReturnRoute,
    result.analysis.firewallPath.returnNextHopRoute,
  ])
    if (route) {
      expect(route.model).toBe(laboratoryModel);
      expect(route.revision).toBe(world.revision);
    }
  expect(canonical(world)).toBe(before);
});

it('fills shared96-entity budget through actual app and Storage commands and rejects the next operation atomically', () => {
  const f = fixture(),
    groupId = f.world.groups[0]!.id;
  for (let i = 0; i < 8; i++)
    expect(f.run({ ...plan(groupId), name: `plan-${i}` } as Command).outcome).toBe('accepted');
  for (let i = 0; i < 12; i++)
    expect(
      f.run({
        type: 'CreateWebApp',
        groupId,
        name: `capacity-app-${i}`,
        planId: f.world.plans[0]!.id,
        runtime: 'NODE|24-lts',
        httpsOnly: 'true',
        publicNetworkAccess: 'Enabled',
      }).outcome,
    ).toBe('accepted');
  const app = f.world.webApps[0]!;
  for (let i = 0; i < 24; i++)
    expect(
      f.run({
        type: 'DeploySyntheticApplication',
        webAppId: app.id,
        template: 'hello-world',
        healthPath: '/health',
        responseStatus: '200',
      }).outcome,
    ).toBe('accepted');
  for (let i = 0; i < 32; i++)
    expect(
      f.run({ type: 'SetWebAppSetting', webAppId: app.id, name: `SYNTHETIC_${i}`, value: 'x' })
        .outcome,
    ).toBe('accepted');
  for (let i = 0; i < 8; i++)
    expect(
      f.run({
        type: 'CreateStorageAccount',
        groupId,
        name: `capacityaccount${i}`,
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      }).outcome,
    ).toBe('accepted');
  for (let i = 0; i < 11; i++)
    expect(
      f.run({
        type: 'CreateBlobContainer',
        accountId: f.world.accounts[0]!.id,
        name: `container-${i}`,
        access: 'private',
      }).outcome,
    ).toBe('accepted');
  expect(resources(f.world)).toHaveLength(96);
  const before = canonical(f.world);
  expect(
    f.run({
      type: 'CreateBlobContainer',
      accountId: f.world.accounts[0]!.id,
      name: 'one-more',
      access: 'private',
    }).code,
  ).toBe('capacity');
  expect(canonical(f.world)).toBe(before);
  expect(replay(f.entries)).toEqual(f.world);
  const reset = f.run({ type: 'ResetWorkspace' });
  expect(reset.removedIds).toHaveLength(96);
  expect(resources(f.world)).toEqual([]);
  expect(replay(f.entries)).toEqual(f.world);
});

it.each([
  ['httpsOnly', 'invalid'],
  ['publicNetworkAccess', 'invalid'],
  ['enabled', 'invalid'],
] as const)('reports exact invalid configuration field%s without mutation', (field, value) => {
  const f = appFixture(),
    a = f.world.webApps[0]!,
    before = canonical(f.world);
  const command = {
    type: 'UpdateWebApp',
    webAppId: a.id,
    runtime: a.runtime,
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
    enabled: 'true',
    [field]: value,
  } as Command;
  expect(f.run(command)).toMatchObject({
    outcome: 'unsupported',
    code: 'unsupported-profile',
    field,
  });
  expect(canonical(f.world)).toBe(before);
  expect(replay(f.entries)).toEqual(f.world);
});

it('distinguishes actual cross-RG Web App scope from its App Service Plan hosting dependency', () => {
  const f = fixture(),
    planGroup = f.world.groups[0]!.id;
  f.run({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-webapp',
    metadataRegion: 'westeurope',
  });
  const appGroup = f.world.groups[1]!.id;
  f.run(plan(planGroup));
  const appPlan = f.world.plans[0]!;
  expect(
    f.run({
      type: 'CreateWebApp',
      groupId: appGroup,
      name: 'cross-group-webapp',
      planId: appPlan.id,
      runtime: 'NODE|24-lts',
      httpsOnly: 'true',
      publicNetworkAccess: 'Enabled',
    }).outcome,
  ).toBe('accepted');
  const app = f.world.webApps[0]!,
    before = canonical(f.world),
    rows = laboratoryInventory(f.world);
  const snapshot = {
    workspace: 'application-topology',
    world: f.world,
    entries: f.entries,
    historical: false,
  };
  const graph = projectTopology(snapshot, rows);
  expect(rows.find((r) => r.id === app.id)).toMatchObject({
    parentId: appGroup,
    groupId: appGroup,
    subscriptionId: 'sub-shared',
  });
  expect(graph.edges).toContainEqual({
    id: `membership:${appGroup}:${app.id}`,
    from: appGroup,
    to: app.id,
    kind: 'membership',
  });
  expect(graph.edges).toContainEqual({
    id: `membership:${planGroup}:${appPlan.id}`,
    from: planGroup,
    to: appPlan.id,
    kind: 'membership',
  });
  expect(graph.edges).toContainEqual({
    id: `app-plan-hosting:${app.id}:${appPlan.id}`,
    from: app.id,
    to: appPlan.id,
    kind: 'app-plan-hosting',
  });
  expect(
    graph.edges.some(
      (e) =>
        e.kind === 'parent' &&
        ((e.from === appPlan.id && e.to === app.id) || (e.from === app.id && e.to === appPlan.id)),
    ),
  ).toBe(false);
  expect(relationLabel('app-plan-hosting')).toBe('App Service Plan hosting');
  expect(relationLabel('parent')).toBe('Parent / child');
  expect(projectTopology(snapshot, rows)).toEqual(graph);
  expect(canonical(f.world)).toBe(before);
  expect(replay(f.entries)).toEqual(f.world);
  const originalWorld = structuredClone(f.world),
    beforeUpdateThrough = f.entries.length;
  const update = f.run({
    type: 'UpdateWebApp',
    webAppId: app.id,
    runtime: app.runtime,
    httpsOnly: 'true',
    publicNetworkAccess: 'Disabled',
    enabled: 'false',
  });
  expect(update.applicationChange).toMatchObject({
    id: app.id,
    parentId: appGroup,
    createOrigin: app.origin,
    before: { groupId: appGroup, planId: appPlan.id, enabled: true },
    after: { groupId: appGroup, planId: appPlan.id, enabled: false },
  });
  expect(update.applicationChange!.parentId).not.toBe(appPlan.id);
  const updatedWorld = structuredClone(f.world),
    beforeDeleteThrough = f.entries.length;
  const deletion = f.run({ type: 'DeleteWebApp', webAppId: app.id });
  expect(deletion.applicationChange).toMatchObject({
    id: app.id,
    parentId: appGroup,
    createOrigin: app.origin,
    before: { groupId: appGroup, planId: appPlan.id, enabled: false },
    after: null,
  });
  expect(deletion.applicationChange!.parentId).not.toBe(appPlan.id);
  expect(f.world.webApps).toEqual([]);
  expect(f.world.plans).toContainEqual(appPlan);
  expect(
    f.entries.find((entry) => entry.request.commandId === app.origin)!.request.command,
  ).toMatchObject({ type: 'CreateWebApp', groupId: appGroup, planId: appPlan.id });
  expect(replay(f.entries, beforeUpdateThrough)).toEqual(originalWorld);
  expect(replay(f.entries, beforeDeleteThrough)).toEqual(updatedWorld);
  expect(replay(f.entries)).toEqual(f.world);
});
