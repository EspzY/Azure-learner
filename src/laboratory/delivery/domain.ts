import { regions, type Region } from '../../domain/simulation';
import { address, cidr } from '../v31/ip';
import { canonical } from '../v3/domain';
import {
  deliveryTypes as types,
  deliveryLimits as limits,
  type DeliveryState,
  type DeliveryCommand,
  type DeliveryContext,
  type DeliveryMutation,
  type DeliveryResource,
  type MutationCode,
  type ResourceRef,
} from './contract';

export const freshDeliveryState = (): DeliveryState => ({
  frontDoors: [],
  frontDoorEndpoints: [],
  originGroups: [],
  origins: [],
  deliveryRoutes: [],
  wafPolicies: [],
  wafRules: [],
  securityPolicies: [],
  applicationGateways: [],
  backendPools: [],
  gatewayListeners: [],
  backendSettings: [],
  gatewayProbes: [],
  gatewayRules: [],
});
/** No persisted inventory. Every row is the actual record in the authoritative World slice. */
export const deliveryResources = (s: DeliveryState): DeliveryResource[] => Object.values(s).flat();
export function deliveryReferences(r: DeliveryResource): readonly ResourceRef[] {
  const ref = (id: string, type: string): ResourceRef => ({ id, type });
  switch (r.type) {
    case types.frontDoor:
    case types.waf:
      return [ref(r.groupId, 'Microsoft.Resources/resourceGroups')];
    case types.endpoint:
    case types.originGroup:
      return [ref(r.profileId, types.frontDoor)];
    case types.origin:
      return [ref(r.originGroupId, types.originGroup), ref(r.webAppId, 'Microsoft.Web/sites')];
    case types.route:
      return [ref(r.endpointId, types.endpoint), ref(r.originGroupId, types.originGroup)];
    case types.wafRule:
      return [ref(r.policyId, types.waf)];
    case types.securityPolicy:
      return [
        ref(r.profileId, types.frontDoor),
        ref(r.endpointId, types.endpoint),
        ref(r.wafPolicyId, types.waf),
      ];
    case types.gateway:
      return [
        ref(r.groupId, 'Microsoft.Resources/resourceGroups'),
        ref(r.subnetId, 'Microsoft.Network/virtualNetworks/subnets'),
      ];
    case types.pool:
      return [ref(r.gatewayId, types.gateway), ref(r.webAppId, 'Microsoft.Web/sites')];
    case types.listener:
    case types.probe:
      return [ref(r.gatewayId, types.gateway)];
    case types.setting:
      return [ref(r.gatewayId, types.gateway), ref(r.probeId, types.probe)];
    case types.gatewayRule:
      return [
        ref(r.gatewayId, types.gateway),
        ref(r.listenerId, types.listener),
        ref(r.poolId, types.pool),
        ref(r.settingId, types.setting),
      ];
  }
}
export const deliveryDependencies = (r: DeliveryResource): readonly string[] =>
  deliveryReferences(r).map((ref) => ref.id);
/** Consumers must use this when deleting a referenced Web App/subnet/group. */
export const deliveryDependents = (s: DeliveryState, id: string) =>
  deliveryResources(s).filter((r) => deliveryDependencies(r).includes(id));

/** Integrating engine must run this against candidate inherited networking changes,
 * so a later NIC/VM/Firewall/NSG/UDR write cannot violate the gateway's dedicated subnet.
 * This is a read-only invariant check, not an alternate command path. */
export function validateDeliveryTopology(
  state: DeliveryState,
  ctx: DeliveryContext,
): { resourceId: string; field: string; code: MutationCode } | null {
  for (const gateway of state.applicationGateways) {
    const subnet = ctx.subnets.find((s) => s.id === gateway.subnetId),
      vnet = ctx.vnets.find((v) => v.id === subnet?.vnetId),
      group = ctx.groups.find((g) => g.id === gateway.groupId);
    const range = subnet && cidr(subnet.addressPrefix);
    if (!subnet || !vnet || !group || !range)
      return { resourceId: gateway.id, field: 'subnetId', code: 'invalid-parent' };
    if (
      vnet.region !== gateway.region ||
      ctx.groups.find((g) => g.id === vnet.groupId)?.subscriptionId !== group.subscriptionId ||
      ctx.occupiedSubnetIds.includes(subnet.id) ||
      state.applicationGateways.some((g) => g.id !== gateway.id && g.subnetId === subnet.id)
    )
      return { resourceId: gateway.id, field: 'subnetId', code: 'incompatible-association' };
    if (
      range.prefix > 24 ||
      subnet.nsgId ||
      subnet.routeTableId ||
      ['AzureFirewallSubnet', 'GatewaySubnet'].includes(subnet.name)
    )
      return { resourceId: gateway.id, field: 'subnetId', code: 'unsupported-profile' };
    if (gateway.privateIp !== address(range.last - 1))
      return { resourceId: gateway.id, field: 'privateIp', code: 'incompatible-association' };
  }
  return null;
}

const fields = {
  CreateFrontDoor: ['groupId', 'name', 'sku'],
  CreateFrontDoorEndpoint: ['profileId', 'name', 'enabled'],
  UpdateFrontDoorEndpoint: ['endpointId', 'profileId', 'enabled'],
  CreateOriginGroup: ['profileId', 'name', 'probePath'],
  UpdateOriginGroup: ['originGroupId', 'profileId', 'probePath'],
  CreateFrontDoorOrigin: ['originGroupId', 'name', 'webAppId', 'enabled', 'priority'],
  UpdateFrontDoorOrigin: ['originId', 'originGroupId', 'webAppId', 'enabled', 'priority'],
  CreateFrontDoorRoute: ['endpointId', 'name', 'originGroupId', 'pattern', 'enabled'],
  UpdateFrontDoorRoute: ['routeId', 'endpointId', 'originGroupId', 'pattern', 'enabled'],
  CreateFrontDoorWafPolicy: ['groupId', 'name', 'mode'],
  UpdateFrontDoorWafPolicy: ['policyId', 'groupId', 'mode'],
  CreateFrontDoorWafRule: [
    'policyId',
    'name',
    'priority',
    'operator',
    'value',
    'action',
    'enabled',
  ],
  UpdateFrontDoorWafRule: [
    'ruleId',
    'policyId',
    'priority',
    'operator',
    'value',
    'action',
    'enabled',
  ],
  CreateFrontDoorSecurityPolicy: ['profileId', 'endpointId', 'wafPolicyId', 'name'],
  UpdateFrontDoorSecurityPolicy: ['securityPolicyId', 'profileId', 'endpointId', 'wafPolicyId'],
  CreateApplicationGateway: ['groupId', 'name', 'region', 'subnetId', 'sku'],
  CreateGatewayBackendPool: ['gatewayId', 'name', 'webAppId'],
  UpdateGatewayBackendPool: ['poolId', 'gatewayId', 'webAppId'],
  CreateGatewayListener: ['gatewayId', 'name', 'port'],
  UpdateGatewayListener: ['listenerId', 'gatewayId', 'port'],
  CreateGatewayBackendSetting: ['gatewayId', 'name', 'probeId'],
  UpdateGatewayBackendSetting: ['settingId', 'gatewayId', 'probeId'],
  CreateGatewayProbe: ['gatewayId', 'name', 'path'],
  UpdateGatewayProbe: ['probeId', 'gatewayId', 'path'],
  CreateGatewayRoutingRule: ['gatewayId', 'name', 'listenerId', 'poolId', 'settingId', 'priority'],
  UpdateGatewayRoutingRule: [
    'ruleId',
    'gatewayId',
    'listenerId',
    'poolId',
    'settingId',
    'priority',
  ],
  DeleteFrontDoor: ['profileId'],
  DeleteFrontDoorEndpoint: ['endpointId'],
  DeleteOriginGroup: ['originGroupId'],
  DeleteFrontDoorOrigin: ['originId'],
  DeleteFrontDoorRoute: ['routeId'],
  DeleteFrontDoorWafPolicy: ['policyId'],
  DeleteFrontDoorWafRule: ['ruleId'],
  DeleteFrontDoorSecurityPolicy: ['securityPolicyId'],
  DeleteApplicationGateway: ['gatewayId'],
  DeleteGatewayBackendPool: ['poolId'],
  DeleteGatewayListener: ['listenerId'],
  DeleteGatewayBackendSetting: ['settingId'],
  DeleteGatewayProbe: ['probeId'],
  DeleteGatewayRoutingRule: ['ruleId'],
} as const;
export const deliveryCommandTypes = Object.keys(fields) as DeliveryCommand['type'][];
export const isDeliveryCommand = (type: string) => Object.hasOwn(fields, type);
export const validDeliveryPath = (v: string) =>
  v.length <= 120 &&
  /^\/[A-Za-z0-9._~/-]*$/.test(v) &&
  !v.includes('//') &&
  !v.split('/').some((p) => p === '.' || p === '..');
export const validDeliveryPattern = (v: string) =>
  v.endsWith('/*') ? validDeliveryPath(v.slice(0, -1)) : validDeliveryPath(v);
const name = (v: string) =>
  /^[A-Za-z0-9][A-Za-z0-9-]{0,78}[A-Za-z0-9]$/.test(v) || /^[A-Za-z0-9]$/.test(v);
const integer = (s: string, min: number, max: number) =>
  /^(0|[1-9][0-9]*)$/.test(s) && Number(s) >= min && Number(s) <= max;
const boolean = (s: string) => s === 'true' || s === 'false';
type Collection = keyof DeliveryState;
const spec: Record<
  string,
  { collection: Collection; type: DeliveryResource['type']; family: string }
> = {
  FrontDoor: { collection: 'frontDoors', type: types.frontDoor, family: 'frontdoor' },
  FrontDoorEndpoint: {
    collection: 'frontDoorEndpoints',
    type: types.endpoint,
    family: 'afd-endpoint',
  },
  OriginGroup: { collection: 'originGroups', type: types.originGroup, family: 'origin-group' },
  FrontDoorOrigin: { collection: 'origins', type: types.origin, family: 'afd-origin' },
  FrontDoorRoute: { collection: 'deliveryRoutes', type: types.route, family: 'afd-route' },
  FrontDoorWafPolicy: { collection: 'wafPolicies', type: types.waf, family: 'afd-waf' },
  FrontDoorWafRule: { collection: 'wafRules', type: types.wafRule, family: 'afd-waf-rule' },
  FrontDoorSecurityPolicy: {
    collection: 'securityPolicies',
    type: types.securityPolicy,
    family: 'afd-security',
  },
  ApplicationGateway: {
    collection: 'applicationGateways',
    type: types.gateway,
    family: 'application-gateway',
  },
  GatewayBackendPool: { collection: 'backendPools', type: types.pool, family: 'gateway-pool' },
  GatewayProbe: { collection: 'gatewayProbes', type: types.probe, family: 'gateway-probe' },
  GatewayListener: {
    collection: 'gatewayListeners',
    type: types.listener,
    family: 'gateway-listener',
  },
  GatewayBackendSetting: {
    collection: 'backendSettings',
    type: types.setting,
    family: 'gateway-setting',
  },
  GatewayRoutingRule: {
    collection: 'gatewayRules',
    type: types.gatewayRule,
    family: 'gateway-rule',
  },
};
/** No event, request ID or revision ownership here. The versioned engine wraps this
 * single pure decision in its existing transaction/receipt/replay process. */
export function applyDelivery(
  state: DeliveryState,
  command: unknown,
  ctx: DeliveryContext,
): DeliveryMutation {
  const result: DeliveryMutation = {
    state,
    nextId: ctx.nextId,
    outcome: 'rejected',
    code: 'invalid-command',
    targetType: 'local/application-delivery',
    scopeId: '',
    region: null,
    addedIds: [],
    updatedIds: [],
    removedIds: [],
  };
  const deny = (code: MutationCode, field?: string, unsupported = false): DeliveryMutation => ({
    ...result,
    code,
    ...(field === undefined ? {} : { field }),
    outcome: unsupported ? 'unsupported' : 'rejected',
  });
  if (!command || typeof command !== 'object' || Array.isArray(command))
    return deny('invalid-command');
  const c = command as Record<string, string>;
  if (typeof c.type !== 'string' || !Object.hasOwn(fields, c.type))
    return deny('unsupported-capability', 'type', true);
  const expected = ['type', ...fields[c.type as keyof typeof fields]];
  const extra = Object.keys(c)
    .sort()
    .find((k) => !expected.includes(k));
  if (extra !== undefined) return deny('unsupported-field', extra, true);
  if (
    expected.some(
      (k) =>
        typeof c[k] !== 'string' ||
        c[k]!.length > 120 ||
        !c[k]!.isWellFormed() ||
        c[k]!.includes('\0'),
    )
  )
    return deny('invalid-command');
  if (
    !Number.isSafeInteger(ctx.nextId) ||
    ctx.nextId < 1 ||
    !Number.isSafeInteger(ctx.resourceCount) ||
    ctx.resourceCount < 0
  )
    return deny('invalid-command');
  const operation = c.type.startsWith('Create')
    ? 'create'
    : c.type.startsWith('Update')
      ? 'update'
      : 'delete';
  const descriptor = spec[c.type.replace(/^(Create|Update|Delete)/, '')]!;
  result.targetType = descriptor.type;
  const rows = state[descriptor.collection] as DeliveryResource[];
  const identityKey: Record<Collection, string> = {
    frontDoors: 'profileId',
    frontDoorEndpoints: 'endpointId',
    originGroups: 'originGroupId',
    origins: 'originId',
    deliveryRoutes: 'routeId',
    wafPolicies: 'policyId',
    wafRules: 'ruleId',
    securityPolicies: 'securityPolicyId',
    applicationGateways: 'gatewayId',
    backendPools: 'poolId',
    gatewayListeners: 'listenerId',
    backendSettings: 'settingId',
    gatewayProbes: 'probeId',
    gatewayRules: 'ruleId',
  };
  const old =
    operation !== 'create'
      ? rows.find((r) => r.id === c[identityKey[descriptor.collection]])
      : undefined;
  if (operation !== 'create' && !old)
    return deny('invalid-parent', identityKey[descriptor.collection]);
  if (old) {
    result.scopeId = deliveryDependencies(old)[0] ?? '';
    if ('region' in old) result.region = old.region === 'global' ? null : old.region;
  }
  if (operation === 'delete') {
    if (deliveryDependents(state, old!.id).length) return deny('cascade-delete-unsupported');
    const next = structuredClone(state);
    (next[descriptor.collection] as DeliveryResource[]) = rows
      .filter((r) => r.id !== old!.id)
      .map((r) => structuredClone(r));
    return {
      ...result,
      state: next,
      outcome: 'accepted',
      code: 'deleted',
      removedIds: [old!.id],
      before: structuredClone(old!),
      after: null,
    };
  }
  if (
    operation === 'create' &&
    (ctx.resourceCount >= limits.entities ||
      rows.length >=
        (descriptor.collection === 'frontDoors'
          ? limits.profiles
          : descriptor.collection === 'applicationGateways'
            ? limits.gateways
            : limits.children))
  )
    return deny('capacity');
  if (operation === 'create' && !name(c.name!)) return deny('invalid-name', 'name');
  if (
    operation === 'create' &&
    [
      'frontDoorEndpoints',
      'originGroups',
      'origins',
      'deliveryRoutes',
      'securityPolicies',
    ].includes(descriptor.collection) &&
    c.name!.length > 50
  )
    return deny('invalid-name', 'name');
  if (
    operation === 'create' &&
    descriptor.collection === 'frontDoorEndpoints' &&
    state.frontDoorEndpoints.some((e) => e.name.toLowerCase() === c.name!.toLowerCase())
  )
    return deny('duplicate-name', 'name');
  const id = old?.id ?? `${descriptor.family}-${ctx.nextId}`;
  const base = {
    id,
    name: old?.name ?? c.name!,
    type: descriptor.type,
    origin: old?.origin ?? ctx.commandId,
  };
  let candidate: DeliveryResource;
  let namespace = '';
  if (descriptor.collection === 'frontDoors' || descriptor.collection === 'wafPolicies') {
    if (!ctx.groups.some((g) => g.id === c.groupId)) return deny('invalid-parent', 'groupId');
    if (old && 'groupId' in old && old.groupId !== c.groupId)
      return deny('incompatible-association', 'groupId');
    namespace = c.groupId!;
    result.scopeId = namespace;
    if (descriptor.collection === 'frontDoors') {
      if (c.sku !== 'Standard_AzureFrontDoor') return deny('unsupported-profile', 'sku', true);
      candidate = {
        ...base,
        type: types.frontDoor,
        groupId: namespace,
        region: 'global',
        sku: 'Standard_AzureFrontDoor',
      };
    } else {
      if (!['Detection', 'Prevention'].includes(c.mode!))
        return deny('unsupported-profile', 'mode', true);
      if (!/^[A-Za-z][A-Za-z0-9]{0,127}$/.test(base.name)) return deny('invalid-name', 'name');
      candidate = {
        ...base,
        type: types.waf,
        groupId: namespace,
        region: 'global',
        sku: 'Standard_AzureFrontDoor',
        mode: c.mode as 'Prevention' | 'Detection',
      };
    }
  } else if (
    descriptor.collection === 'frontDoorEndpoints' ||
    descriptor.collection === 'originGroups'
  ) {
    if (!state.frontDoors.some((p) => p.id === c.profileId))
      return deny('invalid-parent', 'profileId');
    if (old && 'profileId' in old && old.profileId !== c.profileId)
      return deny('incompatible-association', 'profileId');
    namespace = c.profileId!;
    result.scopeId = namespace;
    if (descriptor.collection === 'frontDoorEndpoints') {
      if (!boolean(c.enabled!)) return deny('unsupported-profile', 'enabled', true);
      candidate = {
        ...base,
        type: types.endpoint,
        profileId: namespace,
        enabled: c.enabled === 'true',
      };
    } else {
      if (!validDeliveryPath(c.probePath!)) return deny('unsupported-profile', 'probePath', true);
      candidate = {
        ...base,
        type: types.originGroup,
        profileId: namespace,
        probePath: c.probePath!,
        probeProtocol: 'Https',
        probeMethod: 'HEAD',
      };
    }
  } else if (descriptor.collection === 'origins') {
    const group = state.originGroups.find((g) => g.id === c.originGroupId);
    if (!group) return deny('invalid-parent', 'originGroupId');
    if (old && 'originGroupId' in old && old.originGroupId !== group.id)
      return deny('incompatible-association', 'originGroupId');
    const app = ctx.webApps.find((a) => a.id === c.webAppId && a.type === 'Microsoft.Web/sites');
    if (!app) return deny('invalid-parent', 'webAppId');
    const profile = state.frontDoors.find((p) => p.id === group.profileId)!;
    const subscription = ctx.groups.find((g) => g.id === profile.groupId)?.subscriptionId;
    if (!subscription || app.subscriptionId !== subscription)
      return deny('incompatible-association', 'webAppId');
    if (!boolean(c.enabled!) || !integer(c.priority!, 1, 5))
      return deny('unsupported-profile', !boolean(c.enabled!) ? 'enabled' : 'priority', true);
    namespace = group.id;
    result.scopeId = namespace;
    candidate = {
      ...base,
      type: types.origin,
      originGroupId: namespace,
      webAppId: app.id,
      enabled: c.enabled === 'true',
      priority: Number(c.priority),
    };
  } else if (descriptor.collection === 'deliveryRoutes') {
    const endpoint = state.frontDoorEndpoints.find((e) => e.id === c.endpointId),
      group = state.originGroups.find((g) => g.id === c.originGroupId);
    if (!endpoint || !group)
      return deny('invalid-parent', !endpoint ? 'endpointId' : 'originGroupId');
    if (
      group.profileId !== endpoint.profileId ||
      (old && 'endpointId' in old && old.endpointId !== endpoint.id)
    )
      return deny('incompatible-association', 'originGroupId');
    if (!boolean(c.enabled!) || !validDeliveryPattern(c.pattern!))
      return deny('unsupported-profile', !boolean(c.enabled!) ? 'enabled' : 'pattern', true);
    if (
      state.deliveryRoutes.some(
        (r) =>
          r.id !== id &&
          r.endpointId === endpoint.id &&
          r.pattern.toLowerCase() === c.pattern!.toLowerCase(),
      )
    )
      return deny('duplicate-name', 'pattern');
    namespace = endpoint.id;
    result.scopeId = namespace;
    candidate = {
      ...base,
      type: types.route,
      endpointId: namespace,
      originGroupId: group.id,
      pattern: c.pattern!,
      enabled: c.enabled === 'true',
      supportedProtocol: 'Https',
      forwardingProtocol: 'HttpsOnly',
    };
  } else if (descriptor.collection === 'wafRules') {
    if (!state.wafPolicies.some((p) => p.id === c.policyId))
      return deny('invalid-parent', 'policyId');
    if (old && 'policyId' in old && old.policyId !== c.policyId)
      return deny('incompatible-association', 'policyId');
    if (!integer(c.priority!, 1, 1000)) return deny('unsupported-profile', 'priority', true);
    if (
      state.wafRules.some(
        (r) => r.id !== id && r.policyId === c.policyId && r.priority === Number(c.priority),
      )
    )
      return deny('duplicate-name', 'priority');
    if (
      !['Equal', 'BeginsWith'].includes(c.operator!) ||
      !['Allow', 'Block'].includes(c.action!) ||
      !boolean(c.enabled!) ||
      !validDeliveryPath(c.value!)
    )
      return deny(
        'unsupported-profile',
        !['Equal', 'BeginsWith'].includes(c.operator!)
          ? 'operator'
          : !['Allow', 'Block'].includes(c.action!)
            ? 'action'
            : !boolean(c.enabled!)
              ? 'enabled'
              : 'value',
        true,
      );
    namespace = c.policyId!;
    result.scopeId = namespace;
    candidate = {
      ...base,
      type: types.wafRule,
      policyId: namespace,
      priority: Number(c.priority),
      matchVariable: 'RequestUri',
      operator: c.operator as 'Equal' | 'BeginsWith',
      value: c.value!,
      action: c.action as 'Allow' | 'Block',
      enabled: c.enabled === 'true',
    };
  } else if (descriptor.collection === 'securityPolicies') {
    const profile = state.frontDoors.find((p) => p.id === c.profileId),
      endpoint = state.frontDoorEndpoints.find((e) => e.id === c.endpointId),
      policy = state.wafPolicies.find((p) => p.id === c.wafPolicyId);
    if (!profile || !endpoint || !policy)
      return deny(
        'invalid-parent',
        !profile ? 'profileId' : !endpoint ? 'endpointId' : 'wafPolicyId',
      );
    if (
      endpoint.profileId !== profile.id ||
      (old && 'profileId' in old && old.profileId !== profile.id)
    )
      return deny('incompatible-association', 'endpointId');
    if (
      ctx.groups.find((g) => g.id === profile.groupId)?.subscriptionId !==
      ctx.groups.find((g) => g.id === policy.groupId)?.subscriptionId
    )
      return deny('incompatible-association', 'wafPolicyId');
    if (state.securityPolicies.some((p) => p.id !== id && p.endpointId === endpoint.id))
      return deny('duplicate-name', 'endpointId');
    namespace = profile.id;
    result.scopeId = namespace;
    candidate = {
      ...base,
      type: types.securityPolicy,
      profileId: profile.id,
      endpointId: endpoint.id,
      wafPolicyId: policy.id,
      pattern: '/*',
    };
  } else if (descriptor.collection === 'applicationGateways') {
    const group = ctx.groups.find((g) => g.id === c.groupId),
      subnet = ctx.subnets.find((s) => s.id === c.subnetId),
      vnet = ctx.vnets.find((v) => v.id === subnet?.vnetId);
    if (!group || !subnet || !vnet) return deny('invalid-parent', !group ? 'groupId' : 'subnetId');
    if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
    if (
      vnet.region !== c.region ||
      group.subscriptionId !== ctx.groups.find((g) => g.id === vnet.groupId)?.subscriptionId
    )
      return deny('incompatible-association', 'subnetId');
    if (c.sku !== 'Standard_v2') return deny('unsupported-profile', 'sku', true);
    const range = cidr(subnet.addressPrefix);
    if (
      !range ||
      range.prefix > 24 ||
      ['AzureFirewallSubnet', 'GatewaySubnet'].includes(subnet.name) ||
      subnet.nsgId ||
      subnet.routeTableId
    )
      return deny('unsupported-profile', 'subnetId', true);
    if (
      ctx.occupiedSubnetIds.includes(subnet.id) ||
      state.applicationGateways.some((g) => g.subnetId === subnet.id)
    )
      return deny('incompatible-association', 'subnetId');
    namespace = group.id;
    result.scopeId = namespace;
    result.region = c.region!;
    candidate = {
      ...base,
      type: types.gateway,
      groupId: group.id,
      region: c.region!,
      subnetId: subnet.id,
      sku: 'Standard_v2',
      networkIsolation: true,
      privateIp: address(range.last - 1),
    };
  } else {
    const gateway = state.applicationGateways.find((g) => g.id === c.gatewayId);
    if (!gateway) return deny('invalid-parent', 'gatewayId');
    if (old && 'gatewayId' in old && old.gatewayId !== gateway.id)
      return deny('incompatible-association', 'gatewayId');
    namespace = gateway.id;
    result.scopeId = namespace;
    result.region = gateway.region;
    if (descriptor.collection === 'backendPools') {
      const app = ctx.webApps.find((a) => a.id === c.webAppId && a.type === 'Microsoft.Web/sites'),
        group = ctx.groups.find((g) => g.id === gateway.groupId);
      if (!app) return deny('invalid-parent', 'webAppId');
      if (app.subscriptionId !== group?.subscriptionId)
        return deny('incompatible-association', 'webAppId');
      candidate = { ...base, type: types.pool, gatewayId: gateway.id, webAppId: app.id };
    } else if (descriptor.collection === 'gatewayListeners') {
      if (!['80', '8080'].includes(c.port!)) return deny('unsupported-profile', 'port', true);
      if (
        state.gatewayListeners.some(
          (l) => l.id !== id && l.gatewayId === gateway.id && l.port === Number(c.port),
        )
      )
        return deny('duplicate-name', 'port');
      candidate = {
        ...base,
        type: types.listener,
        gatewayId: gateway.id,
        protocol: 'Http',
        port: Number(c.port) as 80 | 8080,
      };
    } else if (descriptor.collection === 'backendSettings') {
      const probe = state.gatewayProbes.find((p) => p.id === c.probeId);
      if (!probe) return deny('invalid-parent', 'probeId');
      if (probe.gatewayId !== gateway.id) return deny('incompatible-association', 'probeId');
      candidate = {
        ...base,
        type: types.setting,
        gatewayId: gateway.id,
        protocol: 'Https',
        port: 443,
        pickHostNameFromBackendAddress: true,
        probeId: probe.id,
      };
    } else if (descriptor.collection === 'gatewayProbes') {
      if (!validDeliveryPath(c.path!)) return deny('unsupported-profile', 'path', true);
      candidate = {
        ...base,
        type: types.probe,
        gatewayId: gateway.id,
        protocol: 'Https',
        path: c.path!,
        pickHostNameFromBackendHttpSettings: true,
      };
    } else {
      const listener = state.gatewayListeners.find((l) => l.id === c.listenerId),
        pool = state.backendPools.find((p) => p.id === c.poolId),
        setting = state.backendSettings.find((s) => s.id === c.settingId);
      if (!listener || !pool || !setting)
        return deny('invalid-parent', !listener ? 'listenerId' : !pool ? 'poolId' : 'settingId');
      if ([listener.gatewayId, pool.gatewayId, setting.gatewayId].some((g) => g !== gateway.id))
        return deny('incompatible-association', 'gatewayId');
      if (!integer(c.priority!, 1, 20000)) return deny('unsupported-profile', 'priority', true);
      if (
        state.gatewayRules.some(
          (r) =>
            r.id !== id &&
            r.gatewayId === gateway.id &&
            (r.priority === Number(c.priority) || r.listenerId === listener.id),
        )
      )
        return deny('duplicate-name', 'priority');
      candidate = {
        ...base,
        type: types.gatewayRule,
        gatewayId: gateway.id,
        listenerId: listener.id,
        poolId: pool.id,
        settingId: setting.id,
        priority: Number(c.priority),
        ruleType: 'Basic',
      };
    }
  }
  const parent = (r: DeliveryResource) => deliveryDependencies(r)[0] ?? '';
  if (
    rows.some(
      (r) =>
        r.id !== id && parent(r) === namespace && r.name.toLowerCase() === base.name.toLowerCase(),
    )
  )
    return deny('duplicate-name', 'name');
  if (old && canonical(old) === canonical(candidate)) return deny('no-change');
  const next = structuredClone(state),
    list = next[descriptor.collection] as DeliveryResource[];
  if (old) list[list.findIndex((r) => r.id === id)] = candidate;
  else list.push(candidate);
  return {
    ...result,
    state: next,
    nextId: ctx.nextId + (old ? 0 : 1),
    outcome: 'accepted',
    code: old ? 'updated' : 'created',
    addedIds: old ? [] : [id],
    updatedIds: old ? [id] : [],
    ...(old ? { before: structuredClone(old), after: structuredClone(candidate) } : {}),
  };
}
