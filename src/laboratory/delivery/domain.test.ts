import { describe, expect, test } from 'vitest';
import { canonical, execute, freshWorld } from '../v37/domain';
import {
  freshDeliveryState,
  applyDelivery,
  deliveryResources,
  deliveryDependents,
  deliveryDependencies,
  deliveryReferences,
  validateDeliveryTopology,
} from './domain';
import { analyseFrontDoor, analyseApplicationGateway } from './analysis';
import type { DeliveryCommand, DeliveryContext, WebAppView } from './contract';

/** Read-only app projection unit fixture. It is not a positive World/receipt or a
 * deployed resource. The integrating engine must derive these views from its World. */
const app: WebAppView = {
  type: 'Microsoft.Web/sites',
  id: 'app-actual-id',
  name: 'app',
  groupId: 'group-1',
  subscriptionId: 'sub-shared',
  region: 'westeurope',
  enabled: true,
  publicNetworkAccess: 'Enabled',
  httpsOnly: true,
  deployment: 'synthetic-http',
  healthPath: '/health',
  responseStatus: 200,
  origin: 'app-create',
};
function harness() {
  let technical = freshWorld();
  for (const command of [
    {
      type: 'CreateGroup',
      name: 'rg-delivery',
      subscriptionId: 'sub-shared',
      metadataRegion: 'westeurope',
    },
    {
      type: 'CreateVirtualNetwork',
      name: 'vnet-delivery',
      groupId: 'group-1',
      region: 'westeurope',
      addressSpace: '10.5.0.0/16',
    },
    { type: 'CreateSubnet', name: 'snet-gateway', vnetId: 'vnet-2', addressPrefix: '10.5.1.0/24' },
  ]) {
    const r = execute(
      technical,
      {
        commandId: `base-${technical.revision}`,
        expectedRevision: technical.revision,
        command,
      } as Parameters<typeof execute>[1],
      technical.revision + 1,
    );
    expect(r.receipt.outcome).toBe('accepted');
    technical = r.world;
  }
  let state = freshDeliveryState(),
    nextId = technical.nextId,
    sequence = 0;
  const ctx = (): DeliveryContext => ({
    nextId,
    commandId: `delivery-${++sequence}`,
    resourceCount: 3 + deliveryResources(state).length,
    groups: technical.groups,
    webApps: [app],
    vnets: technical.vnets,
    subnets: technical.subnets,
    occupiedSubnetIds: [],
  });
  const run = (c: DeliveryCommand | unknown, override: Partial<DeliveryContext> = {}) => {
    const result = applyDelivery(state, c, { ...ctx(), ...override });
    if (result.outcome === 'accepted') {
      state = result.state;
      nextId = result.nextId;
    }
    return result;
  };
  return { run, ctx, state: () => state };
}
function frontDoor(h: ReturnType<typeof harness>) {
  const create = (c: DeliveryCommand) => {
    const r = h.run(c);
    expect(r.outcome).toBe('accepted');
    return r.addedIds[0]!;
  };
  const profileId = create({
    type: 'CreateFrontDoor',
    groupId: 'group-1',
    name: 'afd-main',
    sku: 'Standard_AzureFrontDoor',
  });
  const endpointId = create({
    type: 'CreateFrontDoorEndpoint',
    profileId,
    name: 'endpoint-main',
    enabled: 'true',
  });
  const originGroupId = create({
    type: 'CreateOriginGroup',
    profileId,
    name: 'group-main',
    probePath: '/health',
  });
  const originId = create({
    type: 'CreateFrontDoorOrigin',
    originGroupId,
    name: 'app-origin',
    webAppId: app.id,
    enabled: 'true',
    priority: '1',
  });
  const routeId = create({
    type: 'CreateFrontDoorRoute',
    endpointId,
    name: 'default-route',
    originGroupId,
    pattern: '/*',
    enabled: 'true',
  });
  return { profileId, endpointId, originGroupId, originId, routeId };
}
const analysisCtx = (h: ReturnType<typeof harness>, overrides: Partial<DeliveryContext> = {}) => ({
  ...h.ctx(),
  workspace: 'isolated-workspace',
  model: 'laboratory@3.8.0',
  revision: 14,
  ...overrides,
});

describe('pure Front Door dependent configuration', () => {
  test('creates the actual hierarchy; inspect is a projection, not a new store', () => {
    const h = harness(),
      ids = frontDoor(h),
      state = h.state(),
      before = canonical(state);
    const resources = deliveryResources(state);
    expect(resources).toHaveLength(5);
    expect(resources[0]).toBe(state.frontDoors[0]);
    expect(resources.map((r) => r.id)).toEqual(Object.values(ids));
    expect(deliveryDependencies(state.origins[0]!)).toEqual([ids.originGroupId, app.id]);
    expect(deliveryReferences(state.origins[0]!)).toEqual([
      { id: ids.originGroupId, type: 'Microsoft.Cdn/profiles/originGroups' },
      { id: app.id, type: 'Microsoft.Web/sites' },
    ]);
    expect(deliveryDependents(state, app.id).map((r) => r.id)).toEqual([ids.originId]);
    expect(state.frontDoors[0]?.region).toBe('global');
    expect(state.deliveryRoutes[0]?.type).toBe('Microsoft.Cdn/profiles/afdEndpoints/routes');
    const r = analyseFrontDoor(
      state,
      { endpointId: ids.endpointId, protocol: 'Https', path: '/api' },
      analysisCtx(h),
    );
    expect(r.status).toBe('configuration-consistent');
    expect(r.routeId).toBe(ids.routeId);
    expect(r.backendIds).toEqual([app.id]);
    expect(r.binding).toEqual({
      workspace: 'isolated-workspace',
      model: 'laboratory@3.8.0',
      revision: 14,
    });
    expect(r.connectivity).toBe('not-verified');
    expect(r.networkPolicy).toBe('not-evaluated');
    expect(canonical(state)).toBe(before);
  });
  test('exact path precedes wildcard, longer wildcard wins and patterns are case insensitive', () => {
    const h = harness(),
      ids = frontDoor(h);
    const api = h.run({
      type: 'CreateFrontDoorRoute',
      endpointId: ids.endpointId,
      name: 'api-route',
      originGroupId: ids.originGroupId,
      pattern: '/api/*',
      enabled: 'true',
    }).addedIds[0];
    const exact = h.run({
      type: 'CreateFrontDoorRoute',
      endpointId: ids.endpointId,
      name: 'exact-route',
      originGroupId: ids.originGroupId,
      pattern: '/API/Exact',
      enabled: 'true',
    }).addedIds[0];
    const read = (path: string) =>
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path },
        analysisCtx(h),
      );
    expect(read('/api/exact').routeId).toBe(exact);
    expect(read('/api/child').routeId).toBe(api);
    expect(read('/api').routeId).toBe(ids.routeId);
    expect(
      h.run({
        type: 'CreateFrontDoorRoute',
        endpointId: ids.endpointId,
        name: 'duplicate-pattern',
        originGroupId: ids.originGroupId,
        pattern: '/api/EXACT',
        enabled: 'true',
      }).code,
    ).toBe('duplicate-name');
  });
  test('an origin update changes backend identity while preserving create identity and old state', () => {
    const h = harness(),
      ids = frontDoor(h),
      old = h.state(),
      oldOrigin = old.origins[0]!;
    const second = { ...app, id: 'app-second', name: 'second' };
    const changed = h.run(
      {
        type: 'UpdateFrontDoorOrigin',
        originId: ids.originId,
        originGroupId: ids.originGroupId,
        webAppId: second.id,
        enabled: 'true',
        priority: '2',
      },
      { webApps: [app, second] },
    );
    expect(changed.outcome).toBe('accepted');
    expect(changed.addedIds).toEqual([]);
    expect(changed.updatedIds).toEqual([ids.originId]);
    expect(changed.before).toEqual(oldOrigin);
    expect(changed.after).toMatchObject({
      id: oldOrigin.id,
      origin: oldOrigin.origin,
      webAppId: second.id,
    });
    expect(old.origins[0]?.webAppId).toBe(app.id);
    const result = analyseFrontDoor(
      h.state(),
      { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
      analysisCtx(h, { webApps: [app, second] }),
    );
    expect(result.backendIds).toEqual([second.id]);
  });
  test.each([
    ['disabled', { enabled: false }, 'unavailable-configuration'],
    ['private', { publicNetworkAccess: 'Disabled' }, 'unavailable-configuration'],
    ['not deployed', { deployment: 'none' }, 'unavailable-configuration'],
    ['503', { responseStatus: 503 }, 'modeled-non-200'],
    ['path mismatch', { healthPath: '/different' }, 'modeled-non-200'],
  ] as const)('does not invent health for %s backend', (_name, patch, result) => {
    const h = harness(),
      ids = frontDoor(h);
    const r = analyseFrontDoor(
      h.state(),
      { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
      analysisCtx(h, { webApps: [{ ...app, ...patch }] }),
    );
    expect(r.status).toBe('undetermined');
    expect(r.probes[0]?.result).toBe(result);
    expect(r.steps.some((s) => s.type === 'all-probes-failed')).toBe(true);
    expect(r.steps.at(-1)?.reason).toContain('fall back');
  });
  test('missing current app never becomes false healthy and disabled origins are excluded', () => {
    const h = harness(),
      ids = frontDoor(h);
    const missing = analyseFrontDoor(
      h.state(),
      { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
      analysisCtx(h, { webApps: [] }),
    );
    expect(missing.status).toBe('undetermined');
    expect(missing.probes[0]?.reason).toContain('absent');
    expect(
      h.run({
        type: 'UpdateFrontDoorOrigin',
        originId: ids.originId,
        originGroupId: ids.originGroupId,
        webAppId: app.id,
        priority: '1',
        enabled: 'false',
      }).code,
    ).toBe('updated');
    const off = analyseFrontDoor(
      h.state(),
      { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
      analysisCtx(h),
    );
    expect(off.probes).toEqual([]);
    expect(off.status).toBe('undetermined');
  });
  test('reports equal-priority eligible origins instead of pretending to measure latency or randomness', () => {
    const h = harness(),
      ids = frontDoor(h),
      second = { ...app, id: 'second' };
    const secondId = h.run(
      {
        type: 'CreateFrontDoorOrigin',
        originGroupId: ids.originGroupId,
        name: 'second',
        webAppId: second.id,
        enabled: 'true',
        priority: '1',
      },
      { webApps: [app, second] },
    ).addedIds[0];
    const r = analyseFrontDoor(
      h.state(),
      { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
      analysisCtx(h, { webApps: [app, second] }),
    );
    expect(r.eligibleOriginIds).toEqual([ids.originId, secondId]);
    expect(r.backendIds).toEqual([app.id, second.id]);
  });
  test('probe and endpoint updates invalidate former positive configuration without modifying the old slice', () => {
    const h = harness(),
      ids = frontDoor(h),
      old = h.state();
    const change = h.run({
      type: 'UpdateOriginGroup',
      originGroupId: ids.originGroupId,
      profileId: ids.profileId,
      probePath: '/other',
    });
    expect(change.outcome).toBe('accepted');
    expect(change.updatedIds).toEqual([ids.originGroupId]);
    expect(old.originGroups[0]?.probePath).toBe('/health');
    expect(
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
        analysisCtx(h),
      ).status,
    ).toBe('undetermined');
    expect(
      h.run({
        type: 'UpdateFrontDoorEndpoint',
        endpointId: ids.endpointId,
        profileId: ids.profileId,
        enabled: 'false',
      }).code,
    ).toBe('updated');
    expect(
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
        analysisCtx(h),
      ).status,
    ).toBe('disabled-endpoint');
  });
  test('custom WAF priorities have bounded unique values and no invented per-route actions', () => {
    const h = harness();
    frontDoor(h);
    const policyId = h.run({
      type: 'CreateFrontDoorWafPolicy',
      groupId: 'group-1',
      name: 'WafPolicy',
      mode: 'Prevention',
    }).addedIds[0]!;
    const c = {
      type: 'CreateFrontDoorWafRule',
      policyId,
      name: 'custom',
      priority: '1',
      operator: 'Equal',
      value: '/blocked',
      action: 'Block',
      enabled: 'true',
    };
    expect(h.run(c).code).toBe('created');
    expect(h.run({ ...c, name: 'other' })).toMatchObject({
      code: 'duplicate-name',
      field: 'priority',
    });
    for (const priority of ['0', '1001', '01', '-1', '1.5'])
      expect(h.run({ ...c, name: 'invalid', priority }).code).toBe('unsupported-profile');
    expect(h.run({ ...c, name: 'rate-limit', priority: '2', ruleType: 'RateLimitRule' }).code).toBe(
      'unsupported-field',
    );
  });
  test('WAF association is a real security policy and lower-numbered first terminating rule wins', () => {
    const h = harness(),
      ids = frontDoor(h);
    const policyId = h.run({
      type: 'CreateFrontDoorWafPolicy',
      groupId: 'group-1',
      name: 'WafPolicy',
      mode: 'Prevention',
    }).addedIds[0]!;
    const block = h.run({
      type: 'CreateFrontDoorWafRule',
      policyId,
      name: 'block-admin',
      priority: '20',
      operator: 'BeginsWith',
      value: '/admin',
      action: 'Block',
      enabled: 'true',
    }).addedIds[0]!;
    const allow = h.run({
      type: 'CreateFrontDoorWafRule',
      policyId,
      name: 'allow-health',
      priority: '10',
      operator: 'Equal',
      value: '/admin/health',
      action: 'Allow',
      enabled: 'true',
    }).addedIds[0]!;
    const security = h.run({
      type: 'CreateFrontDoorSecurityPolicy',
      profileId: ids.profileId,
      endpointId: ids.endpointId,
      wafPolicyId: policyId,
      name: 'security',
    });
    expect(security.outcome).toBe('accepted');
    expect(h.state().securityPolicies[0]?.type).toBe('Microsoft.Cdn/profiles/securityPolicies');
    const read = (path: string) =>
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path },
        analysisCtx(h),
      );
    expect(read('/admin/root')).toMatchObject({
      status: 'blocked-by-waf',
      waf: { ruleId: block, action: 'Block' },
    });
    expect(read('/admin/health')).toMatchObject({
      status: 'configuration-consistent',
      waf: { ruleId: allow, action: 'Allow' },
    });
    expect(read('/public').waf?.action).toBe('NoMatch');
    expect(
      h.run({ type: 'UpdateFrontDoorWafPolicy', policyId, groupId: 'group-1', mode: 'Detection' })
        .outcome,
    ).toBe('accepted');
    expect(read('/admin/root')).toMatchObject({
      status: 'configuration-consistent',
      waf: { mode: 'Detection', action: 'Block' },
    });
  });
  test('WAF update/delete changes concrete matches, keeps original origin, never deletes policy', () => {
    const h = harness(),
      ids = frontDoor(h);
    const policyId = h.run({
      type: 'CreateFrontDoorWafPolicy',
      groupId: 'group-1',
      name: 'WafPolicy',
      mode: 'Prevention',
    }).addedIds[0]!;
    const ruleId = h.run({
      type: 'CreateFrontDoorWafRule',
      policyId,
      name: 'block',
      priority: '10',
      operator: 'BeginsWith',
      value: '/',
      action: 'Block',
      enabled: 'true',
    }).addedIds[0]!;
    h.run({
      type: 'CreateFrontDoorSecurityPolicy',
      profileId: ids.profileId,
      endpointId: ids.endpointId,
      wafPolicyId: policyId,
      name: 'security',
    });
    const origin = h.state().wafRules[0]?.origin;
    expect(
      h.run({
        type: 'UpdateFrontDoorWafRule',
        ruleId,
        policyId,
        priority: '10',
        operator: 'Equal',
        value: '/blocked',
        action: 'Block',
        enabled: 'true',
      }).code,
    ).toBe('updated');
    expect(h.state().wafRules[0]?.origin).toBe(origin);
    expect(
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path: '/public' },
        analysisCtx(h),
      ).status,
    ).toBe('configuration-consistent');
    expect(h.run({ type: 'DeleteFrontDoorWafPolicy', policyId }).code).toBe(
      'cascade-delete-unsupported',
    );
    expect(h.run({ type: 'DeleteFrontDoorWafRule', ruleId }).removedIds).toEqual([ruleId]);
    expect(h.state().wafPolicies).toHaveLength(1);
  });
  test('deletion checks actual reverse references, no cascade; deleting leaf reveals no matching route', () => {
    const h = harness(),
      ids = frontDoor(h);
    for (const c of [
      { type: 'DeleteFrontDoor', profileId: ids.profileId },
      { type: 'DeleteOriginGroup', originGroupId: ids.originGroupId },
      { type: 'DeleteFrontDoorEndpoint', endpointId: ids.endpointId },
    ])
      expect(h.run(c).code).toBe('cascade-delete-unsupported');
    const original = h.state(),
      r = h.run({ type: 'DeleteFrontDoorRoute', routeId: ids.routeId });
    expect(r.code).toBe('deleted');
    expect(r.before).toMatchObject({ id: ids.routeId });
    expect(r.after).toBeNull();
    expect(original.deliveryRoutes).toHaveLength(1);
    expect(h.state().origins).toHaveLength(1);
    expect(
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path: '/' },
        analysisCtx(h),
      ).status,
    ).toBe('no-matching-route');
    const create = h.run({
      type: 'CreateFrontDoorRoute',
      endpointId: ids.endpointId,
      name: 'default-route',
      originGroupId: ids.originGroupId,
      pattern: '/*',
      enabled: 'true',
    });
    expect(create.addedIds[0]).not.toBe(ids.routeId);
  });
});

describe('regional Application Gateway bounded configuration', () => {
  function setup() {
    const h = harness();
    const create = (c: DeliveryCommand) => {
      const r = h.run(c);
      expect(r.outcome).toBe('accepted');
      return r.addedIds[0]!;
    };
    const gatewayId = create({
      type: 'CreateApplicationGateway',
      groupId: 'group-1',
      name: 'agw-main',
      region: 'westeurope',
      subnetId: 'subnet-3',
      sku: 'Standard_v2',
    });
    const poolId = create({
      type: 'CreateGatewayBackendPool',
      gatewayId,
      name: 'app-pool',
      webAppId: app.id,
    });
    const listenerId = create({
      type: 'CreateGatewayListener',
      gatewayId,
      name: 'http-listener',
      port: '80',
    });
    const probeId = create({
      type: 'CreateGatewayProbe',
      gatewayId,
      name: 'https-probe',
      path: '/health',
    });
    const settingId = create({
      type: 'CreateGatewayBackendSetting',
      gatewayId,
      name: 'https-app-setting',
      probeId,
    });
    const ruleId = create({
      type: 'CreateGatewayRoutingRule',
      gatewayId,
      name: 'basic-rule',
      listenerId,
      poolId,
      settingId,
      priority: '100',
    });
    return { h, gatewayId, poolId, listenerId, settingId, ruleId, probeId };
  }
  test('creates private-only regional hierarchy and reads actual pool/listener/setting, without runtime health', () => {
    const { h, gatewayId, poolId, ruleId } = setup();
    expect(h.state().applicationGateways[0]).toMatchObject({
      privateIp: '10.5.1.254',
      networkIsolation: true,
      sku: 'Standard_v2',
    });
    const before = canonical(h.state());
    const result = analyseApplicationGateway(
      h.state(),
      { gatewayId, protocol: 'Http', port: '80', path: '/' },
      analysisCtx(h),
    );
    expect(result).toMatchObject({
      status: 'configuration-consistent',
      routeId: ruleId,
      backendIds: [app.id],
      networkPolicy: 'not-evaluated',
      connectivity: 'not-verified',
    });
    expect(deliveryDependents(h.state(), app.id).map((x) => x.id)).toEqual([poolId]);
    expect(canonical(h.state())).toBe(before);
  });
  test('changing listener, backend and probe changes the derived result', () => {
    const { h, gatewayId, poolId, listenerId, probeId } = setup(),
      second = { ...app, id: 'other', responseStatus: 503 as const };
    expect(
      h.run(
        { type: 'UpdateGatewayBackendPool', poolId, gatewayId, webAppId: second.id },
        { webApps: [app, second] },
      ).code,
    ).toBe('updated');
    expect(h.run({ type: 'UpdateGatewayListener', listenerId, gatewayId, port: '8080' }).code).toBe(
      'updated',
    );
    const read = (port: string) =>
      analyseApplicationGateway(
        h.state(),
        { gatewayId, protocol: 'Http', port, path: '/' },
        analysisCtx(h, { webApps: [app, second] }),
      );
    expect(read('80').status).toBe('no-matching-route');
    expect(read('8080')).toMatchObject({ status: 'undetermined', backendIds: [second.id] });
    expect(
      h.run({ type: 'UpdateGatewayBackendPool', poolId, gatewayId, webAppId: app.id }).code,
    ).toBe('updated');
    expect(h.run({ type: 'UpdateGatewayProbe', probeId, gatewayId, path: '/missing' }).code).toBe(
      'updated',
    );
    expect(read('8080').probes[0]?.result).toBe('modeled-non-200');
  });
  test('prevents priority/port conflicts and deletion of referenced children', () => {
    const { h, gatewayId, poolId, listenerId, settingId, probeId } = setup();
    expect(
      h.run({ type: 'CreateGatewayListener', gatewayId, name: 'duplicate', port: '80' }).field,
    ).toBe('port');
    expect(
      h.run({
        type: 'CreateGatewayRoutingRule',
        gatewayId,
        name: 'other',
        poolId,
        listenerId,
        settingId,
        priority: '100',
      }).code,
    ).toBe('duplicate-name');
    for (const c of [
      { type: 'DeleteApplicationGateway', gatewayId },
      { type: 'DeleteGatewayBackendPool', poolId },
      { type: 'DeleteGatewayListener', listenerId },
      { type: 'DeleteGatewayBackendSetting', settingId },
      { type: 'DeleteGatewayProbe', probeId },
    ])
      expect(h.run(c).code).toBe('cascade-delete-unsupported');
  });
  test.each([
    ['wrong region', { region: 'northeurope' }, 'incompatible-association'],
    ['unsupported SKU', { sku: 'WAF_v2' }, 'unsupported-profile'],
    ['missing subnet', { subnetId: 'missing' }, 'invalid-parent'],
  ])('rejects %s atomically', (_label, patch, code) => {
    const h = harness(),
      before = h.state(),
      r = h.run({
        type: 'CreateApplicationGateway',
        groupId: 'group-1',
        name: 'agw-main',
        region: 'westeurope',
        subnetId: 'subnet-3',
        sku: 'Standard_v2',
        ...patch,
      });
    expect(r.code).toBe(code);
    expect(r.state).toBe(before);
    expect(r.addedIds).toEqual([]);
  });
  test('enforces dedicated subnet, conservative size and no unsupported subnet NSG/UDR profile', () => {
    for (const patch of [
      { addressPrefix: '10.5.1.0/25' },
      { nsgId: 'nsg' },
      { routeTableId: 'rt' },
      { name: 'AzureFirewallSubnet' },
    ]) {
      const h = harness(),
        ctx = h.ctx();
      expect(
        h.run(
          {
            type: 'CreateApplicationGateway',
            groupId: 'group-1',
            name: 'agw',
            region: 'westeurope',
            subnetId: 'subnet-3',
            sku: 'Standard_v2',
          },
          { subnets: ctx.subnets.map((s) => ({ ...s, ...patch })) },
        ).code,
      ).toBe('unsupported-profile');
    }
    const h = harness();
    expect(
      h.run(
        {
          type: 'CreateApplicationGateway',
          groupId: 'group-1',
          name: 'agw',
          region: 'westeurope',
          subnetId: 'subnet-3',
          sku: 'Standard_v2',
        },
        { occupiedSubnetIds: ['subnet-3'] },
      ).code,
    ).toBe('incompatible-association');
  });
  test('candidate inherited network changes cannot silently violate a gateway subnet invariant', () => {
    const { h, gatewayId } = setup(),
      ctx = h.ctx();
    expect(validateDeliveryTopology(h.state(), ctx)).toBeNull();
    expect(
      validateDeliveryTopology(h.state(), { ...ctx, occupiedSubnetIds: ['subnet-3'] }),
    ).toEqual({ resourceId: gatewayId, field: 'subnetId', code: 'incompatible-association' });
    expect(
      validateDeliveryTopology(h.state(), {
        ...ctx,
        subnets: ctx.subnets.map((s) => ({ ...s, nsgId: 'new-nsg' })),
      })?.code,
    ).toBe('unsupported-profile');
    expect(validateDeliveryTopology(h.state(), { ...ctx, subnets: [] })?.code).toBe(
      'invalid-parent',
    );
  });
  test('Gateway delete is explicit leaf-first, preserves former slice, and does not remove apps or shared scopes', () => {
    const { h, gatewayId, poolId, listenerId, settingId, probeId, ruleId } = setup(),
      old = h.state(),
      appBefore = structuredClone(app);
    expect(h.run({ type: 'DeleteGatewayRoutingRule', ruleId }).code).toBe('deleted');
    expect(
      analyseApplicationGateway(
        h.state(),
        { gatewayId, protocol: 'Http', port: '80', path: '/' },
        analysisCtx(h),
      ).status,
    ).toBe('no-matching-route');
    for (const command of [
      { type: 'DeleteGatewayBackendSetting', settingId },
      { type: 'DeleteGatewayProbe', probeId },
      { type: 'DeleteGatewayListener', listenerId },
      { type: 'DeleteGatewayBackendPool', poolId },
      { type: 'DeleteApplicationGateway', gatewayId },
    ])
      expect(h.run(command).code).toBe('deleted');
    expect(deliveryResources(h.state())).toEqual([]);
    expect(old.applicationGateways).toHaveLength(1);
    expect(app).toEqual(appBefore);
  });
});

describe('input, identity, namespace and deterministic failures', () => {
  test.each([
    { type: 'CreateFrontDoor', groupId: 'missing', name: 'afd', sku: 'Standard_AzureFrontDoor' },
    {
      type: 'CreateFrontDoor',
      groupId: 'group-1',
      name: 'invalid name',
      sku: 'Standard_AzureFrontDoor',
    },
    { type: 'CreateFrontDoor', groupId: 'group-1', name: 'afd', sku: 'Premium_AzureFrontDoor' },
    { type: 'CreateFrontDoorEndpoint', profileId: 'missing', name: 'endpoint', enabled: 'true' },
    {
      type: 'CreateFrontDoorWafPolicy',
      groupId: 'group-1',
      name: 'bad-hyphen',
      mode: 'Prevention',
    },
    { type: 'DeleteFrontDoorRoute', routeId: 'expired' },
  ])('denies unsupported/invalid complete input without partial records: $type', (command) => {
    const h = harness(),
      old = h.state(),
      r = h.run(command);
    expect(r.outcome).not.toBe('accepted');
    expect(r.state).toBe(old);
    expect(r.addedIds).toEqual([]);
  });
  test('unknown fields including empty/prototype keys choose the same denial independent of JSONB key ordering', () => {
    const h = harness(),
      base = {
        type: 'CreateFrontDoor',
        groupId: 'group-1',
        name: 'afd',
        sku: 'Standard_AzureFrontDoor',
      };
    for (const extra of [{ '': 'x' }, JSON.parse('{"__proto__":"x"}'), { z: 'x', a: 'x' }]) {
      const forward = { ...base, ...extra },
        reverse = Object.fromEntries(Object.entries(forward).reverse());
      const a = h.run(forward),
        b = h.run(JSON.parse(JSON.stringify(reverse)));
      expect(a.code).toBe('unsupported-field');
      expect(canonical(a)).toBe(canonical(b));
      expect(a.state).toBe(h.state());
    }
  });
  test('rejects wrong scalar types, malformed Unicode, oversized fields and unknown operation', () => {
    const h = harness(),
      base = {
        type: 'CreateFrontDoor',
        groupId: 'group-1',
        name: 'afd',
        sku: 'Standard_AzureFrontDoor',
      };
    for (const command of [
      null,
      [],
      { ...base, name: 1 },
      { ...base, name: '\ud800' },
      { ...base, name: 'a'.repeat(121) },
      { ...base, name: 'a\0b' },
    ])
      expect(h.run(command).code).toBe('invalid-command');
    expect(h.run({ type: 'CreateOtherAppliance' }).code).toBe('unsupported-capability');
  });
  test('scope/name collisions, no-op and capacity denial preserve stable IDs/origins', () => {
    const h = harness(),
      ids = frontDoor(h),
      old = h.state();
    expect(
      h.run({
        type: 'CreateFrontDoor',
        groupId: 'group-1',
        name: 'AFD-MAIN',
        sku: 'Standard_AzureFrontDoor',
      }).code,
    ).toBe('duplicate-name');
    expect(
      h.run({
        type: 'UpdateFrontDoorEndpoint',
        profileId: ids.profileId,
        endpointId: ids.endpointId,
        enabled: 'true',
      }).code,
    ).toBe('no-change');
    expect(
      h.run(
        {
          type: 'CreateFrontDoorEndpoint',
          profileId: ids.profileId,
          name: 'capacity',
          enabled: 'true',
        },
        { resourceCount: 96 },
      ).code,
    ).toBe('capacity');
    expect(h.state()).toBe(old);
  });
  test('cross-profile references and cross-subscription backends are denied; region difference is valid for global Front Door', () => {
    const h = harness(),
      ids = frontDoor(h),
      profile = h.run({
        type: 'CreateFrontDoor',
        groupId: 'group-1',
        name: 'other',
        sku: 'Standard_AzureFrontDoor',
      }).addedIds[0]!;
    const other = h.run({
      type: 'CreateOriginGroup',
      profileId: profile,
      name: 'other',
      probePath: '/health',
    }).addedIds[0]!;
    expect(
      h.run({
        type: 'UpdateFrontDoorRoute',
        routeId: ids.routeId,
        endpointId: ids.endpointId,
        originGroupId: other,
        pattern: '/*',
        enabled: 'true',
      }).code,
    ).toBe('incompatible-association');
    expect(
      h.run(
        {
          type: 'CreateFrontDoorOrigin',
          originGroupId: ids.originGroupId,
          name: 'other-region',
          webAppId: app.id,
          enabled: 'true',
          priority: '2',
        },
        { webApps: [{ ...app, region: 'northeurope' }] },
      ).outcome,
    ).toBe('accepted');
    expect(
      h.run(
        {
          type: 'CreateFrontDoorOrigin',
          originGroupId: ids.originGroupId,
          name: 'other-sub',
          webAppId: app.id,
          enabled: 'true',
          priority: '2',
        },
        { webApps: [{ ...app, subscriptionId: 'sub-app' }] },
      ).code,
    ).toBe('incompatible-association');
  });
  test.each(['/a*', '/a/*/b', '/a?x=1', '/a%2fb', '/a/../b', '//evil'])(
    'rejects unsupported or ambiguous pattern %s',
    (pattern) => {
      const h = harness(),
        ids = frontDoor(h);
      expect(
        h.run({
          type: 'CreateFrontDoorRoute',
          endpointId: ids.endpointId,
          name: 'invalid',
          originGroupId: ids.originGroupId,
          pattern,
          enabled: 'true',
        }).code,
      ).toBe('unsupported-profile');
    },
  );
  test('analysis rejects unsupported protocol/query fields and never produces a positive result for missing resources', () => {
    const h = harness(),
      ids = frontDoor(h),
      ctx = analysisCtx(h);
    expect(
      analyseFrontDoor(h.state(), { endpointId: ids.endpointId, protocol: 'Http', path: '/' }, ctx)
        .status,
    ).toBe('unsupported-input');
    expect(
      analyseFrontDoor(
        h.state(),
        { endpointId: ids.endpointId, protocol: 'Https', path: '/', extra: 'x' },
        ctx,
      ).status,
    ).toBe('unsupported-input');
    expect(
      analyseFrontDoor(h.state(), { endpointId: 'missing', protocol: 'Https', path: '/' }, ctx)
        .status,
    ).toBe('undetermined');
  });
});
