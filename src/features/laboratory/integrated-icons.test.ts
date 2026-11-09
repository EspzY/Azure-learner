import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import registry from '../../../public/icons/manifest.json';
import { portalServices } from '../portal/service-catalog';
import { resolvePortalIcon } from '../portal/service-icon';
import { laboratoryInventory } from './portal-adapter';
import { integratedResourceIcon } from './integrated-icons';
import { freshWorld, execute, canonical } from '@/laboratory/v39/domain';
import { applicationProjection } from '@/laboratory/v39/projection';
import type { Command } from '@/laboratory/v39/contract';
import { dataTypes } from '@/laboratory/data/contract';

const intended: Record<string, string> = {
  frontDoor: 'frontDoor',
  frontDoorEndpoint: 'frontDoor',
  originGroup: 'frontDoor',
  frontDoorOrigin: 'frontDoor',
  frontDoorRoute: 'frontDoor',
  frontDoorWafPolicy: 'waf',
  frontDoorWafRule: 'waf',
  frontDoorSecurityPolicy: 'frontDoor',
  applicationGateway: 'applicationGateway',
  gatewayBackendPool: 'applicationGateway',
  gatewayListener: 'applicationGateway',
  gatewayBackendSetting: 'applicationGateway',
  gatewayProbe: 'applicationGateway',
  gatewayRoutingRule: 'applicationGateway',
  postgresServer: 'postgresServer',
  postgresDatabase: 'postgresServer',
  sqlServer: 'sqlServer',
  sqlDatabase: 'sqlDatabase',
  databaseFirewallRule: 'settings',
  functionPlan: 'plan',
  functionApp: 'functionApp',
  function: 'functionApp',
  databaseConnection: 'settings',
};
const expectedFiles: Record<string, string> = {
  frontDoor: 'azure/10073-icon-service-Front-Door-and-CDN-Profiles.svg',
  waf: 'azure/10362-icon-service-Web-Application-Firewall-Policies-WAF.svg',
  applicationGateway: 'azure/10076-icon-service-Application-Gateways.svg',
  postgresServer: 'azure/10131-icon-service-Azure-Database-PostgreSQL-Server.svg',
  sqlServer: 'azure/10132-icon-service-SQL-Server.svg',
  sqlDatabase: 'azure/10130-icon-service-SQL-Database.svg',
  functionApp: 'azure/10029-icon-service-Function-Apps.svg',
  plan: 'azure/00046-icon-service-App-Service-Plans.svg',
  settings: 'fluent/settings_16_regular.svg',
};
function configured() {
  let world = freshWorld(),
    sequence = 0;
  const run = (command: Command) => {
    const result = execute(
      world,
      { commandId: `icon-${++sequence}`, expectedRevision: world.revision, command },
      sequence,
    );
    expect(result.receipt.outcome, JSON.stringify(result.receipt)).toBe('accepted');
    world = result.world;
    return result.receipt.addedIds[0]!;
  };
  const groupId = run({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-icons',
    metadataRegion: 'norwayeast',
  });
  const accountId = run({
    type: 'CreateStorageAccount',
    groupId,
    name: 'iconsstorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const containerId = run({
    type: 'CreateBlobContainer',
    accountId,
    name: 'deployment',
    access: 'private',
  });
  const planId = run({
    type: 'CreateAppServicePlan',
    groupId,
    name: 'icons-hosting',
    region: 'norwayeast',
    os: 'Linux',
    sku: 'B1',
  });
  const appId = run({
    type: 'CreateWebApp',
    groupId,
    name: 'icons-web-app',
    planId,
    runtime: 'NODE|24-lts',
    httpsOnly: 'true',
    publicNetworkAccess: 'Enabled',
  });
  run({
    type: 'DeploySyntheticApplication',
    webAppId: appId,
    template: 'api',
    healthPath: '/health',
    responseStatus: '200',
  });
  run({
    type: 'SetWebAppSetting',
    webAppId: appId,
    name: 'APP_GREETING',
    value: 'Synthetic icon fixture',
  });
  const vnetId = run({
    type: 'CreateVirtualNetwork',
    groupId,
    name: 'icons-network',
    region: 'norwayeast',
    addressSpace: '10.44.0.0/16',
  });
  const subnetId = run({
    type: 'CreateSubnet',
    vnetId,
    name: 'dedicated-gateway',
    addressPrefix: '10.44.1.0/24',
  });
  const vmSubnetId = run({
    type: 'CreateSubnet',
    vnetId,
    name: 'compute',
    addressPrefix: '10.44.2.0/24',
  });
  run({
    type: 'CreateVirtualMachine',
    groupId,
    name: 'icons-vm',
    region: 'norwayeast',
    image: 'ubuntu-22.04-gen2',
    size: 'Standard_D2s_v4',
    subnetId: vmSubnetId,
    privateIpAddress: '10.44.2.10',
    allocation: 'Static',
    nsgId: 'none',
    osDiskSku: 'StandardSSD_LRS',
    osDiskSizeGiB: '128',
  });
  const profileId = run({
    type: 'CreateFrontDoor',
    groupId,
    name: 'icons-front-door',
    sku: 'Standard_AzureFrontDoor',
  });
  const endpointId = run({
    type: 'CreateFrontDoorEndpoint',
    profileId,
    name: 'icons-endpoint',
    enabled: 'true',
  });
  const originGroupId = run({
    type: 'CreateOriginGroup',
    profileId,
    name: 'icons-origins',
    probePath: '/health',
  });
  run({
    type: 'CreateFrontDoorOrigin',
    originGroupId,
    name: 'icons-origin',
    webAppId: appId,
    enabled: 'true',
    priority: '1',
  });
  run({
    type: 'CreateFrontDoorRoute',
    endpointId,
    name: 'icons-route',
    originGroupId,
    pattern: '/*',
    enabled: 'true',
  });
  const wafPolicyId = run({
    type: 'CreateFrontDoorWafPolicy',
    groupId,
    name: 'IconsWaf',
    mode: 'Prevention',
  });
  run({
    type: 'CreateFrontDoorWafRule',
    policyId: wafPolicyId,
    name: 'block-path',
    priority: '100',
    operator: 'BeginsWith',
    value: '/blocked',
    action: 'Block',
    enabled: 'true',
  });
  run({
    type: 'CreateFrontDoorSecurityPolicy',
    profileId,
    endpointId,
    wafPolicyId,
    name: 'icons-security',
  });
  const gatewayId = run({
    type: 'CreateApplicationGateway',
    groupId,
    name: 'icons-gateway',
    region: 'norwayeast',
    subnetId,
    sku: 'Standard_v2',
  });
  const poolId = run({
    type: 'CreateGatewayBackendPool',
    gatewayId,
    name: 'icons-pool',
    webAppId: appId,
  });
  const listenerId = run({
    type: 'CreateGatewayListener',
    gatewayId,
    name: 'icons-listener',
    port: '80',
  });
  const probeId = run({
    type: 'CreateGatewayProbe',
    gatewayId,
    name: 'icons-probe',
    path: '/health',
  });
  const settingId = run({
    type: 'CreateGatewayBackendSetting',
    gatewayId,
    name: 'icons-settings',
    probeId,
  });
  run({
    type: 'CreateGatewayRoutingRule',
    gatewayId,
    name: 'icons-rule',
    listenerId,
    poolId,
    settingId,
    priority: '100',
  });
  const pgId = run({
    type: 'CreatePostgresServer',
    groupId,
    name: 'icons-postgres',
    region: 'norwayeast',
    version: '16',
    sku: 'Standard_B1ms',
    storageGiB: '32',
    publicNetworkAccess: 'Enabled',
  });
  run({ type: 'CreatePostgresDatabase', serverId: pgId, name: 'appdata', charset: 'UTF8' });
  const sqlId = run({
    type: 'CreateSqlServer',
    groupId,
    name: 'icons-sql',
    region: 'norwayeast',
    version: '12.0',
    publicNetworkAccess: 'Enabled',
  });
  const databaseId = run({
    type: 'CreateSqlDatabase',
    serverId: sqlId,
    name: 'appdata',
    sku: 'Basic',
    maxSizeGiB: '2',
  });
  for (const serverId of [pgId, sqlId])
    run({
      type: 'CreateDatabaseFirewallRule',
      serverId,
      name: 'explicit-input',
      startIp: '203.0.113.10',
      endIp: '203.0.113.10',
    });
  run({
    type: 'CreateFunctionApp',
    groupId,
    name: 'icons-functions',
    region: 'norwayeast',
    planName: 'icons-functions-hosting',
    storageAccountId: accountId,
    deploymentContainerId: containerId,
    runtime: 'node22',
    publicNetworkAccess: 'Enabled',
  });
  run({
    type: 'CreateFunction',
    appId: world.data.functionApps[0]!.id,
    name: 'http-icons',
    trigger: 'http',
    method: 'GET',
    route: '/hello',
    containerId: '',
    behavior: 'static-text',
    responseText: 'Synthetic icon fixture',
  });
  run({
    type: 'CreateDatabaseConnection',
    appId,
    databaseId,
    databaseType: dataTypes.sqlDatabase,
    settingName: 'ICONS_DATABASE',
    tls: '1.2',
  });
  return world;
}
describe('integrated Portal family identity, not All Resources substitution', () => {
  it('maps all23 actual catalogue/title kinds to the intended registered original service or honest configuration glyph', () => {
    const rows = portalServices('laboratory', 'laboratory@3.9.0').filter((row) =>
      Object.hasOwn(intended, row.view),
    );
    expect(rows).toHaveLength(23);
    for (const row of rows) {
      expect(row.icon, row.view).toBe(intended[row.view]);
      expect(resolvePortalIcon(row.icon), row.view).toBeDefined();
      expect(resolvePortalIcon(row.icon)?.family, row.view).toBe(
        row.icon === 'settings' ? 'fluent' : 'azure',
      );
      expect(resolvePortalIcon(row.icon)?.file, row.view).toBe(expectedFiles[intended[row.view]!]);
      expect(resolvePortalIcon(row.icon)?.file, row.view).not.toBe(
        resolvePortalIcon('resources')?.file,
      );
    }
    for (const model of [
      'laboratory@3.0.0',
      'laboratory@3.1.0',
      'laboratory@3.2.0',
      'laboratory@3.3.0',
      'laboratory@3.4.0',
      'laboratory@3.5.0',
      'laboratory@3.6.0',
      'laboratory@3.7.0',
      'laboratory@3.8.0',
    ] as const)
      expect(
        portalServices('laboratory', model).some((row) => Object.hasOwn(intended, row.view)),
      ).toBe(false);
  });
  it('uses every actual typed delivery/data row parent identity and preserves inherited3.8 identities without changing World', () => {
    const world = configured(),
      before = canonical(world),
      rows = laboratoryInventory(world);
    const added = rows.filter((row) => Object.hasOwn(intended, row.view));
    expect(new Set(added.map((row) => row.view)).size).toBe(23);
    for (const row of added) {
      const expected =
        row.view === 'databaseFirewallRule'
          ? row.source && 'type' in row.source && row.source.type === dataTypes.postgresFirewallRule
            ? 'postgresServer'
            : 'sqlServer'
          : intended[row.view]!;
      expect(row.kind, row.id).toBe(expected);
      expect(resolvePortalIcon(row.kind), row.id).toBeDefined();
      expect(resolvePortalIcon(row.kind)?.family, row.id).toBe(
        expected === 'settings' ? 'fluent' : 'azure',
      );
      expect(resolvePortalIcon(row.kind)?.file, row.id).toBe(expectedFiles[expected]);
      expect(row.kind, row.id).not.toBe('resources');
    }
    expect(rows.find((row) => row.view === 'webApp')?.kind).toBe('apps');
    expect(rows.find((row) => row.view === 'functionApp')?.kind).toBe('functionApp');
    expect(rows.find((row) => row.view === 'functionPlan')?.kind).toBe('plan');
    const inherited = laboratoryInventory(applicationProjection(world));
    expect(inherited.some((row) => row.view === 'vm')).toBe(true);
    expect(inherited.some((row) => row.view === 'account')).toBe(true);
    for (const old of inherited) {
      const actual = rows.find((row) => row.id === old.id)!;
      expect(actual.kind, old.id).toBe(old.kind);
      expect(resolvePortalIcon(actual.kind)?.file, old.id).toBe(resolvePortalIcon(old.kind)?.file);
    }
    expect(canonical(world)).toBe(before);
  });
  it('preserves every existing asset/alias/terms and keeps missing or untyped identities explicit', () => {
    const original = JSON.parse(
      execFileSync(
        'git',
        ['show', '5b2e814b9f4bae1aa3c2fe4e79cd3a4e53029484:public/icons/manifest.json'],
        { encoding: 'utf8' },
      ),
    );
    for (const [key, asset] of Object.entries(original.assets))
      expect((registry.assets as Record<string, unknown>)[key]).toEqual(asset);
    for (const [key, alias] of Object.entries(original.aliases))
      expect((registry.aliases as Record<string, unknown>)[key]).toBe(alias);
    expect(registry.azure).toEqual(original.azure);
    expect(registry.fluent).toEqual(original.fluent);
    expect(registry.licenses).toEqual(original.licenses);
    expect(integratedResourceIcon('unknown-service')).toBeUndefined();
    expect(integratedResourceIcon('__proto__')).toBeUndefined();
    expect(integratedResourceIcon('databaseFirewallRule', 'unsupported-parent')).toBeUndefined();
    for (const file of [
      'public/icons/licenses/Microsoft_Terms_of_Use.pdf',
      'public/icons/licenses/Fluent-MIT.txt',
    ])
      expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(
        original.licenses[file.slice('public/icons/'.length)].sha256,
      );
  });
});
