/** Read-only presentation metadata. Resource IDs, never names, determine context.
 * The caller's original World remains the only resource authority. */
import { portalResourceContextNb as copy } from '@/content/portal-resource-context-nb';
export type PortalContextResource = {
  readonly id: string;
  readonly name: string;
  readonly view: string;
  readonly groupId: string;
  readonly source: Readonly<object>;
  readonly parentId?: string;
};
export type PortalContextCollection = {
  readonly key: string;
  readonly label: string;
  readonly icon: string;
  readonly views: readonly string[];
  readonly relationship?: 'association';
};
type Family = {
  readonly service: string;
  readonly parent: string | null;
  readonly classification: 'resource' | 'child' | 'configuration' | 'scope' | 'data';
  readonly collections?: readonly PortalContextCollection[];
  readonly properties?: readonly string[];
};
const collection = (
  key: keyof typeof copy.collections,
  icon: string,
  ...views: string[]
): PortalContextCollection => ({ key, label: copy.collections[key], icon, views });
export const portalResourceFamilies: Readonly<Record<string, Family>> = {
  group: {
    service: 'groups',
    parent: 'subscriptionId',
    classification: 'scope',
    properties: ['metadataRegion'],
  },
  account: {
    service: 'accounts',
    parent: 'groupId',
    classification: 'resource',
    collections: [collection('containers', 'container', 'container')],
    properties: ['kind', 'sku'],
  },
  container: {
    service: 'accounts',
    parent: 'accountId',
    classification: 'data',
    collections: [collection('blobs', 'blob', 'blob')],
    properties: ['access'],
  },
  blob: {
    service: 'accounts',
    parent: 'containerId',
    classification: 'data',
    properties: ['contentType', 'sizeBytes', 'text'],
  },
  vnet: {
    service: 'vnets',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('subnets', 'subnet', 'subnet'),
      collection('peering-resources', 'peering', 'peering'),
    ],
    properties: ['addressSpace'],
  },
  subnet: {
    service: 'vnets',
    parent: 'vnetId',
    classification: 'child',
    properties: ['addressPrefix', 'nsgId', 'routeTableId'],
  },
  nsg: {
    service: 'nsgs',
    parent: 'groupId',
    classification: 'resource',
    collections: [collection('security-rules', 'rule', 'rule')],
  },
  rule: {
    service: 'nsgs',
    parent: 'nsgId',
    classification: 'child',
    properties: [
      'direction',
      'priority',
      'access',
      'protocol',
      'source',
      'sourcePort',
      'destination',
      'destinationPort',
    ],
  },
  routeTable: {
    service: 'routeTables',
    parent: 'groupId',
    classification: 'resource',
    collections: [collection('routes', 'route', 'route')],
  },
  route: {
    service: 'routeTables',
    parent: 'routeTableId',
    classification: 'child',
    properties: ['addressPrefix', 'nextHopType', 'nextHopIpAddress'],
  },
  peering: {
    service: 'vnets',
    parent: 'vnetId',
    classification: 'child',
    properties: ['remoteVnetId', 'allowVirtualNetworkAccess', 'allowForwardedTraffic'],
  },
  nic: {
    service: 'nics',
    parent: 'groupId',
    classification: 'resource',
    properties: ['subnetId', 'privateIpAddress', 'allocation', 'nsgId'],
  },
  vm: {
    service: 'vms',
    parent: 'groupId',
    classification: 'resource',
    properties: ['image', 'size', 'osDiskId', 'nicId'],
  },
  disk: {
    service: 'disks',
    parent: 'groupId',
    classification: 'resource',
    properties: ['sku', 'sizeGiB', 'vmId'],
  },
  publicIp: {
    service: 'publicIps',
    parent: 'groupId',
    classification: 'resource',
    properties: ['sku', 'allocation', 'ipAddress', 'firewallId'],
  },
  firewall: {
    service: 'firewalls',
    parent: 'groupId',
    classification: 'resource',
    properties: ['sku', 'subnetId', 'publicIpId', 'policyId', 'privateIp'],
  },
  firewallPolicy: {
    service: 'firewallPolicies',
    parent: 'groupId',
    classification: 'resource',
    collections: [collection('rule-collection-groups', 'firewallGroup', 'firewallGroup')],
    properties: ['sku'],
  },
  firewallGroup: {
    service: 'firewallPolicies',
    parent: 'policyId',
    classification: 'child',
    collections: [collection('rule-collections', 'firewallCollection', 'firewallCollection')],
    properties: ['priority'],
  },
  firewallCollection: {
    service: 'firewallPolicies',
    parent: 'collectionGroupId',
    classification: 'configuration',
    collections: [collection('network-rules', 'firewallRule', 'firewallRule')],
    properties: ['priority', 'action'],
  },
  firewallRule: {
    service: 'firewallPolicies',
    parent: 'collectionId',
    classification: 'configuration',
    properties: ['protocol', 'source', 'destination', 'destinationPort'],
  },
  appPlan: {
    service: 'plans',
    parent: 'groupId',
    classification: 'resource',
    properties: ['os', 'sku'],
  },
  webApp: {
    service: 'apps',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('deployments', 'settings', 'appDeployment'),
      collection('environment', 'settings', 'appSetting'),
      collection('database-bindings', 'settings', 'databaseConnection'),
    ],
    properties: ['planId', 'enabled', 'publicNetworkAccess', 'httpsOnly'],
  },
  appDeployment: {
    service: 'apps',
    parent: 'webAppId',
    classification: 'configuration',
    properties: ['healthPath', 'responseStatus', 'responseText'],
  },
  appSetting: {
    service: 'apps',
    parent: 'webAppId',
    classification: 'configuration',
    properties: ['key', 'value'],
  },
  frontDoor: {
    service: 'frontDoor',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('endpoints', 'frontDoor', 'frontDoorEndpoint'),
      collection('origin-groups', 'frontDoor', 'originGroup'),
      collection('origins', 'frontDoor', 'frontDoorOrigin'),
      collection('front-door-routes', 'frontDoor', 'frontDoorRoute'),
      collection('security-policies', 'waf', 'frontDoorSecurityPolicy'),
    ],
    properties: ['sku'],
  },
  frontDoorEndpoint: {
    service: 'frontDoor',
    parent: 'profileId',
    classification: 'child',
    collections: [collection('front-door-routes', 'frontDoor', 'frontDoorRoute')],
    properties: ['enabled'],
  },
  originGroup: {
    service: 'frontDoor',
    parent: 'profileId',
    classification: 'child',
    collections: [collection('origins', 'frontDoor', 'frontDoorOrigin')],
    properties: ['probePath', 'probeProtocol', 'probeMethod'],
  },
  frontDoorOrigin: {
    service: 'frontDoor',
    parent: 'originGroupId',
    classification: 'child',
    properties: ['webAppId', 'enabled', 'priority'],
  },
  frontDoorRoute: {
    service: 'frontDoor',
    parent: 'endpointId',
    classification: 'child',
    properties: ['originGroupId', 'pattern', 'enabled', 'supportedProtocol', 'forwardingProtocol'],
  },
  frontDoorWafPolicy: {
    service: 'frontDoorWafPolicy',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('custom-rules', 'waf', 'frontDoorWafRule'),
      {
        ...collection('associations', 'frontDoor', 'frontDoorSecurityPolicy'),
        relationship: 'association',
      },
    ],
    properties: ['mode', 'sku'],
  },
  frontDoorWafRule: {
    service: 'frontDoorWafPolicy',
    parent: 'policyId',
    classification: 'configuration',
    properties: ['priority', 'matchVariable', 'operator', 'value', 'action', 'enabled'],
  },
  frontDoorSecurityPolicy: {
    service: 'frontDoor',
    parent: 'profileId',
    classification: 'child',
    properties: ['endpointId', 'wafPolicyId', 'pattern'],
  },
  applicationGateway: {
    service: 'applicationGateway',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('backends', 'applicationGateway', 'gatewayBackendPool'),
      collection('listeners', 'applicationGateway', 'gatewayListener'),
      collection('probes', 'applicationGateway', 'gatewayProbe'),
      collection('backend-settings', 'applicationGateway', 'gatewayBackendSetting'),
      collection('routing-rules', 'applicationGateway', 'gatewayRoutingRule'),
    ],
    properties: ['sku', 'subnetId', 'privateIp', 'networkIsolation'],
  },
  gatewayBackendPool: {
    service: 'applicationGateway',
    parent: 'gatewayId',
    classification: 'child',
    properties: ['webAppId'],
  },
  gatewayListener: {
    service: 'applicationGateway',
    parent: 'gatewayId',
    classification: 'child',
    properties: ['protocol', 'port'],
  },
  gatewayBackendSetting: {
    service: 'applicationGateway',
    parent: 'gatewayId',
    classification: 'child',
    properties: ['protocol', 'port', 'probeId', 'pickHostNameFromBackendAddress'],
  },
  gatewayProbe: {
    service: 'applicationGateway',
    parent: 'gatewayId',
    classification: 'child',
    properties: ['protocol', 'path', 'pickHostNameFromBackendHttpSettings'],
  },
  gatewayRoutingRule: {
    service: 'applicationGateway',
    parent: 'gatewayId',
    classification: 'child',
    properties: ['listenerId', 'poolId', 'settingId', 'priority', 'ruleType'],
  },
  postgresServer: {
    service: 'postgresServer',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('databases', 'postgresServer', 'postgresDatabase'),
      collection('networking', 'settings', 'databaseFirewallRule'),
    ],
    properties: ['version', 'sku', 'storageGiB', 'publicNetworkAccess', 'minimumTls'],
  },
  postgresDatabase: {
    service: 'postgresServer',
    parent: 'serverId',
    classification: 'child',
    properties: ['charset'],
  },
  sqlServer: {
    service: 'sqlServer',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('sql-databases', 'sqlDatabase', 'sqlDatabase'),
      collection('networking', 'settings', 'databaseFirewallRule'),
    ],
    properties: ['version', 'publicNetworkAccess', 'minimumTls'],
  },
  sqlDatabase: {
    service: 'sqlDatabase',
    parent: 'serverId',
    classification: 'resource',
    properties: ['sku', 'maxSizeGiB'],
  },
  databaseFirewallRule: {
    service: 'sqlServer',
    parent: 'server.id',
    classification: 'child',
    properties: ['startIp', 'endIp'],
  },
  functionPlan: {
    service: 'plans',
    parent: 'groupId',
    classification: 'resource',
    properties: ['sku', 'os', 'ownerAppId'],
  },
  functionApp: {
    service: 'functionApp',
    parent: 'groupId',
    classification: 'resource',
    collections: [
      collection('functions', 'functionApp', 'function'),
      collection('database-bindings', 'settings', 'databaseConnection'),
    ],
    properties: [
      'planId',
      'storageAccountId',
      'deploymentContainerId',
      'runtime',
      'functionsVersion',
      'instanceMemoryMB',
      'enabled',
      'publicNetworkAccess',
      'httpsOnly',
    ],
  },
  function: {
    service: 'functionApp',
    parent: 'appId',
    classification: 'child',
    properties: [
      'enabled',
      'trigger.kind',
      'trigger.method',
      'trigger.route',
      'trigger.containerId',
      'behavior',
      'responseText',
    ],
  },
  databaseConnection: {
    service: 'functionApp',
    parent: 'source.id',
    classification: 'configuration',
    properties: ['database.id', 'settingName', 'tls'],
  },
};

export function portalSourceValue(source: Readonly<object>, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (value, key) =>
        value !== null && typeof value === 'object' && Object.hasOwn(value, key)
          ? (value as Record<string, unknown>)[key]
          : undefined,
      source,
    );
}
export function portalResourceParent(resource: PortalContextResource): string | undefined {
  const field = portalResourceFamilies[resource.view]?.parent;
  const value = field ? portalSourceValue(resource.source, field) : undefined;
  return typeof value === 'string'
    ? value
    : field === 'groupId'
      ? resource.groupId || undefined
      : resource.parentId;
}
export function portalResourceService(
  resource: PortalContextResource,
  resources: readonly PortalContextResource[],
): string {
  const parent = resources.find((item) => item.id === portalResourceParent(resource));
  if (resource.view === 'databaseFirewallRule')
    return parent?.view === 'postgresServer'
      ? 'postgresServer'
      : parent?.view === 'sqlServer'
        ? 'sqlServer'
        : resource.view;
  if (resource.view === 'databaseConnection')
    return parent?.view === 'webApp'
      ? 'apps'
      : parent?.view === 'functionApp'
        ? 'functionApp'
        : resource.view;
  return portalResourceFamilies[resource.view]?.service ?? resource.view;
}
export function portalResourceAncestors<R extends PortalContextResource>(
  resource: PortalContextResource,
  resources: readonly R[],
): R[] {
  const byId = new Map(resources.map((item) => [item.id, item]));
  const visited = new Set([resource.id]);
  const ancestors: R[] = [];
  let parentId = portalResourceParent(resource);
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    ancestors.unshift(parent);
    parentId = portalResourceParent(parent);
  }
  return ancestors;
}
export function portalResourceScopeLabel(
  resource: PortalContextResource,
  resources: readonly PortalContextResource[],
  includeSelf = true,
): string {
  const ancestors = portalResourceAncestors(resource, resources);
  const group =
    resource.view === 'group' ? resource : resources.find((item) => item.id === resource.groupId);
  const subscription = group ? portalSourceValue(group.source, 'subscriptionId') : undefined;
  const subscriptionName =
    subscription === 'sub-app'
      ? 'App Sandbox'
      : subscription === 'sub-shared'
        ? 'Shared Sandbox'
        : undefined;
  return [
    subscriptionName,
    ...ancestors.map((item) => item.name),
    ...(includeSelf ? [resource.name] : []),
  ]
    .filter(Boolean)
    .join(' / ');
}
export function portalContextCollections(view: string): readonly PortalContextCollection[] {
  return portalResourceFamilies[view]?.collections ?? [];
}
export function portalContextRows<R extends PortalContextResource>(
  resources: readonly R[],
  context: PortalContextResource,
  collection: PortalContextCollection,
): R[] {
  const byId = new Map(resources.map((resource) => [resource.id, resource]));
  return resources.filter((resource) => {
    if (!collection.views.includes(resource.view) || resource.id === context.id) return false;
    if (collection.relationship === 'association')
      return (
        context.view === 'frontDoorWafPolicy' &&
        portalSourceValue(resource.source, 'wafPolicyId') === context.id
      );
    const visited = new Set<string>();
    let parentId = portalResourceParent(resource);
    while (parentId && !visited.has(parentId)) {
      if (parentId === context.id) return true;
      visited.add(parentId);
      const parent = byId.get(parentId);
      parentId = parent ? portalResourceParent(parent) : undefined;
    }
    return false;
  });
}

export function portalResourceSections(
  view: string,
): readonly { key: string; label: string; fields?: readonly string[] }[] {
  return ['postgresServer', 'sqlServer', 'functionApp'].includes(view)
    ? [
        { key: 'configuration', label: copy.configuration },
        ...(view === 'functionApp'
          ? [
              {
                key: 'networking',
                label: copy.collections.networking,
                fields: ['publicNetworkAccess', 'httpsOnly'],
              },
            ]
          : []),
      ]
    : [];
}

const parentViews: Readonly<Record<string, readonly string[]>> = {
  profileId: ['frontDoor'],
  endpointId: ['frontDoorEndpoint'],
  originGroupId: ['originGroup'],
  policyId: ['frontDoorWafPolicy'],
  gatewayId: ['applicationGateway'],
  serverId: ['postgresServer', 'sqlServer'],
  appId: ['functionApp', 'webApp'],
  groupId: ['group'],
};
export function portalContextParentField(view: string): string | undefined {
  const field = portalResourceFamilies[view]?.parent;
  return field === 'server.id'
    ? 'serverId'
    : field === 'source.id'
      ? 'appId'
      : (field ?? undefined);
}
export function portalContextParents<R extends PortalContextResource>(
  resources: readonly R[],
  context: PortalContextResource,
  view: string,
): R[] {
  const field = portalContextParentField(view),
    views = field ? (parentViews[field] ?? []) : [];
  const direct = resources.find(
    (resource) => resource.id === context.id && views.includes(resource.view),
  );
  return direct
    ? [direct]
    : portalContextRows(resources, context, { key: 'parents', label: '', icon: '', views });
}

/** All services contains service families; historical child hrefs remain valid. */
export const portalToolServices = new Set([
  'architecture',
  'studio',
  'routeAnalysis',
  'policyAnalysis',
]);
const favorites = [
  'subscriptions',
  'groups',
  'resources',
  'apps',
  'plans',
  'vms',
  'accounts',
  'vnets',
  'functionApp',
  'frontDoor',
  'applicationGateway',
  'sqlDatabase',
  'postgresServer',
  'activity',
];
export function portalGlobalServices<T extends { id: string }>(services: readonly T[]): T[] {
  return services.filter((service) => {
    const family = portalResourceFamilies[service.id];
    return (
      !portalToolServices.has(service.id) &&
      (!family || (family.classification === 'resource' && family.service === service.id))
    );
  });
}
export function portalFavoriteServices<T extends { id: string }>(services: readonly T[]): T[] {
  // Preserve the bounded historical top-level lists in existing workspaces.
  if (!services.some((service) => service.id === 'frontDoor'))
    return portalGlobalServices(services);
  return favorites.flatMap((id) => services.filter((service) => service.id === id)).slice(0, 12);
}
