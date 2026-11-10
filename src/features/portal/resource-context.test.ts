import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { execute, freshWorld } from '@/laboratory/v39/domain';
import type { Command } from '@/laboratory/v39/contract';
import { laboratoryInventory } from '@/features/laboratory/portal-adapter';
import { portalWorkspaceNb } from '@/content/portal-workspace-nb';
import { portalServices } from './service-catalog';
import { resolvePortalIcon } from './service-icon';
import {
  PortalResourceEssentials,
  PortalHumanProperties,
  PortalTechnicalEvidence,
  portalOptionLabel,
} from './resource-details';
import {
  portalContextCollections,
  portalContextRows,
  portalContextParents,
  portalFavoriteServices,
  portalGlobalServices,
  portalResourceFamilies,
  portalResourceParent,
  portalResourceService,
  portalResourceScopeLabel,
  portalResourceAncestors,
} from './resource-context';

function fixture() {
  let world = freshWorld(),
    sequence = 0;
  const send = (command: Command) => {
    const result = execute(
      world,
      { commandId: `fidelity-${++sequence}`, expectedRevision: world.revision, command },
      sequence,
    );
    expect(result.receipt.outcome, JSON.stringify(result.receipt)).toBe('accepted');
    world = result.world;
    return result.receipt.addedIds[0]!;
  };
  const group = send({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'same-scope-name',
    metadataRegion: 'norwayeast',
  });
  const otherGroup = send({
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    name: 'same-scope-name',
    metadataRegion: 'northeurope',
  });
  const profile = send({
    type: 'CreateFrontDoor',
    groupId: group,
    name: 'same-profile-name',
    sku: 'Standard_AzureFrontDoor',
  });
  const otherProfile = send({
    type: 'CreateFrontDoor',
    groupId: otherGroup,
    name: 'same-profile-name',
    sku: 'Standard_AzureFrontDoor',
  });
  const endpoint = send({
    type: 'CreateFrontDoorEndpoint',
    profileId: profile,
    name: 'same-endpoint-name',
    enabled: 'true',
  });
  const otherEndpoint = send({
    type: 'CreateFrontDoorEndpoint',
    profileId: otherProfile,
    name: 'other-endpoint-name',
    enabled: 'true',
  });
  const originGroup = send({
    type: 'CreateOriginGroup',
    profileId: profile,
    name: 'origins',
    probePath: '/health',
  });
  send({
    type: 'CreateOriginGroup',
    profileId: otherProfile,
    name: 'origins',
    probePath: '/health',
  });
  const waf = send({
    type: 'CreateFrontDoorWafPolicy',
    groupId: group,
    name: 'IndependentWaf',
    mode: 'Detection',
  });
  const association = send({
    type: 'CreateFrontDoorSecurityPolicy',
    profileId: profile,
    endpointId: endpoint,
    wafPolicyId: waf,
    name: 'real-association',
  });
  const server = send({
    type: 'CreateSqlServer',
    groupId: group,
    name: 'logical-server',
    region: 'norwayeast',
    version: '12.0',
    publicNetworkAccess: 'Enabled',
  });
  const database = send({
    type: 'CreateSqlDatabase',
    serverId: server,
    name: 'applicationdata',
    sku: 'Basic',
    maxSizeGiB: '2',
  });
  return {
    send,
    get world() {
      return world;
    },
    profile,
    otherProfile,
    endpoint,
    otherEndpoint,
    originGroup,
    waf,
    association,
    group,
    server,
    database,
  };
}

describe('one Portal global and resource context projections', () => {
  it('disambiguates same-group deep ancestry in actual origin options, Review labels and Essentials without showing opaque IDs', () => {
    const f = fixture();
    const plan = f.send({
      type: 'CreateAppServicePlan',
      groupId: f.group,
      name: 'scope-plan',
      region: 'norwayeast',
      os: 'Linux',
      sku: 'B1',
    });
    const app = f.send({
      type: 'CreateWebApp',
      groupId: f.group,
      name: 'scope-backend',
      planId: plan,
      runtime: 'NODE|24-lts',
      httpsOnly: 'true',
      publicNetworkAccess: 'Enabled',
    });
    f.send({
      type: 'DeploySyntheticApplication',
      webAppId: app,
      template: 'hello-world',
      healthPath: '/health',
      responseStatus: '200',
    });
    const profile = f.send({
      type: 'CreateFrontDoor',
      groupId: f.group,
      name: 'alternate-profile',
      sku: 'Standard_AzureFrontDoor',
    });
    const group = f.send({
      type: 'CreateOriginGroup',
      profileId: profile,
      name: 'origins',
      probePath: '/health',
    });
    const first = f.send({
      type: 'CreateFrontDoorOrigin',
      originGroupId: f.originGroup,
      name: 'reused-origin',
      webAppId: app,
      enabled: 'true',
      priority: '1',
    });
    const second = f.send({
      type: 'CreateFrontDoorOrigin',
      originGroupId: group,
      name: 'reused-origin',
      webAppId: app,
      enabled: 'true',
      priority: '1',
    });
    const before = JSON.stringify(f.world),
      resources = laboratoryInventory(f.world),
      one = resources.find((row) => row.id === first)!,
      two = resources.find((row) => row.id === second)!;
    expect(portalOptionLabel(first, one.name, resources)).toContain('same-profile-name');
    expect(portalOptionLabel(second, two.name, resources)).toContain('alternate-profile');
    expect(portalResourceScopeLabel(one, resources)).not.toBe(
      portalResourceScopeLabel(two, resources),
    );
    expect(portalOptionLabel(first, one.name, resources)).not.toContain(first);
    const primary = renderToStaticMarkup(
      createElement(PortalResourceEssentials, {
        resource: two,
        resources,
        href: (view, id) => `?view=${view}&id=${id ?? ''}`,
      }),
    );
    expect(primary).toContain('alternate-profile');
    expect(
      portalResourceAncestors({ ...one, source: { originGroupId: one.id } }, resources),
    ).toEqual([]);
    expect(JSON.stringify(f.world)).toBe(before);
  });
  it('resolves PostgreSQL versus SQL firewall context from actual server IDs without relying on shared child labels', () => {
    const f = fixture();
    const postgres = f.send({
      type: 'CreatePostgresServer',
      groupId: f.group,
      name: 'postgres-fidelity',
      region: 'norwayeast',
      version: '16',
      sku: 'Standard_B1ms',
      storageGiB: '32',
      publicNetworkAccess: 'Enabled',
    });
    const pgRule = f.send({
      type: 'CreateDatabaseFirewallRule',
      serverId: postgres,
      name: 'pg-allowed-input',
      startIp: '203.0.113.10',
      endIp: '203.0.113.10',
    });
    const sqlRule = f.send({
      type: 'CreateDatabaseFirewallRule',
      serverId: f.server,
      name: 'sql-allowed-input',
      startIp: '203.0.113.10',
      endIp: '203.0.113.10',
    });
    const before = JSON.stringify(f.world),
      resources = laboratoryInventory(f.world);
    expect(
      portalResourceService(
        resources.find((resource) => resource.id === pgRule)!,
        resources,
      ),
    ).toBe('postgresServer');
    expect(
      portalResourceService(
        resources.find((resource) => resource.id === sqlRule)!,
        resources,
      ),
    ).toBe('sqlServer');
    const pgCollection = portalContextCollections('postgresServer').find(
      (item) => item.key === 'networking',
    )!;
    expect(
      portalContextRows(
        resources,
        resources.find((resource) => resource.id === postgres)!,
        pgCollection,
      ).map((resource) => resource.id),
    ).toEqual([pgRule]);
    expect(JSON.stringify(f.world)).toBe(before);
  });
  it('maps every current family and preserves the original version-gated catalog while separating global service families and bounded favorites', () => {
    expect(Object.keys(portalResourceFamilies).sort()).toEqual(
      Object.keys(portalWorkspaceNb.resourceKinds).sort(),
    );
    const all = portalServices('laboratory', 'laboratory@3.9.0'),
      globals = portalGlobalServices(all),
      favorites = portalFavoriteServices(all);
    expect(globals.map((service) => service.id)).toEqual(
      expect.arrayContaining([
        'frontDoor',
        'frontDoorWafPolicy',
        'applicationGateway',
        'postgresServer',
        'sqlServer',
        'sqlDatabase',
        'functionApp',
        'vms',
        'nics',
        'disks',
      ]),
    );
    for (const id of [
      'frontDoorEndpoint',
      'gatewayProbe',
      'postgresDatabase',
      'databaseConnection',
      'function',
      'frontDoorWafRule',
    ])
      expect(
        globals.some((service) => service.id === id),
        id,
      ).toBe(false);
    for (const service of all) {
      const family = portalResourceFamilies[service.id];
      if (family)
        expect(
          globals.some((global) => global.id === service.id),
          service.id,
        ).toBe(family.classification === 'resource' && family.service === service.id);
    }
    expect(favorites.length).toBeLessThanOrEqual(12);
    expect(favorites.every((service) => globals.some((global) => global.id === service.id))).toBe(
      true,
    );
    expect(
      portalGlobalServices(portalServices('laboratory', 'laboratory@3.7.0')).some(
        (service) => service.id === 'functionApp',
      ),
    ).toBe(false);
    for (const service of all) expect(resolvePortalIcon(service.icon), service.id).toBeDefined();
  });
  it('scopes actual same-named profiles and their endpoint resources by exact IDs without touching World, revisions or origin receipts', () => {
    const f = fixture(),
      before = JSON.stringify(f.world),
      records = laboratoryInventory(f.world),
      profile = records.find((row) => row.id === f.profile)!;
    const endpoints = portalContextCollections('frontDoor').find(
      (item) => item.key === 'endpoints',
    )!;
    expect(portalContextRows(records, profile, endpoints).map((row) => row.id)).toEqual([
      f.endpoint,
    ]);
    expect(
      portalContextRows(
        records,
        records.find((row) => row.id === f.otherProfile)!,
        endpoints,
      ).map((row) => row.id),
    ).toEqual([f.otherEndpoint]);
    expect(portalContextParents(records, profile, 'frontDoorOrigin').map((row) => row.id)).toEqual([
      f.originGroup,
    ]);
    expect(
      portalContextParents(records, profile, 'frontDoorEndpoint').map((row) => row.id),
    ).toEqual([f.profile]);
    expect(JSON.stringify(f.world)).toBe(before);
  });
  it('keeps WAF independent and expresses only the actual security-policy association; SQL databases retain a real server parent and global resource identity', () => {
    const f = fixture(),
      before = JSON.stringify(f.world),
      records = laboratoryInventory(f.world),
      waf = records.find((row) => row.id === f.waf)!;
    expect(portalResourceParent(waf)).toBe(f.group);
    const associations = portalContextCollections('frontDoorWafPolicy').find(
      (item) => item.relationship === 'association',
    )!;
    expect(portalContextRows(records, waf, associations).map((row) => row.id)).toEqual([
      f.association,
    ]);
    expect(portalResourceParent(records.find((row) => row.id === f.association)!)).toBe(f.profile);
    expect(portalResourceParent(records.find((row) => row.id === f.database)!)).toBe(f.server);
    expect(records.find((row) => row.id === f.database)?.category).toBe('resource');
    expect(records.find((row) => row.id === f.endpoint)?.category).toBe('subresource');
    expect(
      portalContextCollections('applicationGateway').some((item) =>
        /waf|security policies/i.test(item.label),
      ),
    ).toBe(false);
    expect(JSON.stringify(f.world)).toBe(before);
  });
  it('renders named readable essentials and properties while keeping original JSON and IDs inside a closed technical disclosure', () => {
    const f = fixture(),
      records = laboratoryInventory(f.world),
      resource = records.find((row) => row.id === f.endpoint)!;
    const href = (view: string, id?: string) => `?view=${view}&id=${id ?? ''}`;
    const primary = renderToStaticMarkup(
      createElement(
        'div',
        null,
        createElement(PortalResourceEssentials, { resource, resources: records, href }),
        createElement(PortalHumanProperties, { resource, resources: records, href }),
      ),
    );
    expect(primary).toContain('same-profile-name');
    expect(primary).toContain('Shared Sandbox');
    expect(primary).toContain('Configured in AzureLab');
    expect(primary).not.toContain('<pre>');
    expect(primary).not.toContain('Microsoft.Cdn');
    const technical = renderToStaticMarkup(createElement(PortalTechnicalEvidence, { resource }));
    expect(technical).toContain('<details');
    expect(technical).not.toMatch(/<details[^>]*\sopen/);
    expect(technical).toContain('Technical evidence');
    expect(technical).toContain(f.endpoint);
    expect(technical).toContain('<pre>');
  });
});
