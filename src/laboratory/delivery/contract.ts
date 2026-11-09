/** Pure application-delivery component. State is a slice of the one Laboratory World.
 * The versioned engine owns revision, identity allocation, receipts, replay and persistence. */
export const deliveryTypes = {
  frontDoor: 'Microsoft.Cdn/profiles',
  endpoint: 'Microsoft.Cdn/profiles/afdEndpoints',
  originGroup: 'Microsoft.Cdn/profiles/originGroups',
  origin: 'Microsoft.Cdn/profiles/originGroups/origins',
  route: 'Microsoft.Cdn/profiles/afdEndpoints/routes',
  waf: 'Microsoft.Network/frontDoorWebApplicationFirewallPolicies',
  wafRule: 'local/front-door-waf-rule',
  securityPolicy: 'Microsoft.Cdn/profiles/securityPolicies',
  gateway: 'Microsoft.Network/applicationGateways',
  pool: 'Microsoft.Network/applicationGateways/backendAddressPools',
  listener: 'Microsoft.Network/applicationGateways/httpListeners',
  setting: 'Microsoft.Network/applicationGateways/backendHttpSettingsCollection',
  probe: 'Microsoft.Network/applicationGateways/probes',
  gatewayRule: 'Microsoft.Network/applicationGateways/requestRoutingRules',
} as const;
export type DeliveryType = (typeof deliveryTypes)[keyof typeof deliveryTypes];
export type ResourceRef<T extends string = string> = Readonly<{ id: string; type: T }>;
export interface Base {
  id: string;
  name: string;
  type: DeliveryType;
  origin: string;
}
export interface FrontDoor extends Base {
  type: typeof deliveryTypes.frontDoor;
  groupId: string;
  region: 'global';
  sku: 'Standard_AzureFrontDoor';
}
export interface Endpoint extends Base {
  type: typeof deliveryTypes.endpoint;
  profileId: string;
  enabled: boolean;
}
export interface OriginGroup extends Base {
  type: typeof deliveryTypes.originGroup;
  profileId: string;
  probePath: string;
  probeProtocol: 'Https';
  probeMethod: 'HEAD';
}
export interface Origin extends Base {
  type: typeof deliveryTypes.origin;
  originGroupId: string;
  webAppId: string;
  enabled: boolean;
  priority: number;
}
export interface DeliveryRoute extends Base {
  type: typeof deliveryTypes.route;
  endpointId: string;
  originGroupId: string;
  pattern: string;
  enabled: boolean;
  supportedProtocol: 'Https';
  forwardingProtocol: 'HttpsOnly';
}
/** Nested custom MatchRules, not independent top-level ARM resources. */
export interface WafRule extends Base {
  type: typeof deliveryTypes.wafRule;
  policyId: string;
  priority: number;
  matchVariable: 'RequestUri';
  operator: 'Equal' | 'BeginsWith';
  value: string;
  action: 'Allow' | 'Block';
  enabled: boolean;
}
export interface WafPolicy extends Base {
  type: typeof deliveryTypes.waf;
  groupId: string;
  region: 'global';
  sku: 'Standard_AzureFrontDoor';
  mode: 'Prevention' | 'Detection';
}
export interface SecurityPolicy extends Base {
  type: typeof deliveryTypes.securityPolicy;
  profileId: string;
  endpointId: string;
  wafPolicyId: string;
  pattern: '/*';
}
export interface ApplicationGateway extends Base {
  type: typeof deliveryTypes.gateway;
  groupId: string;
  region: string;
  subnetId: string;
  sku: 'Standard_v2';
  networkIsolation: true;
  privateIp: string;
}
export interface BackendPool extends Base {
  type: typeof deliveryTypes.pool;
  gatewayId: string;
  webAppId: string;
}
export interface GatewayListener extends Base {
  type: typeof deliveryTypes.listener;
  gatewayId: string;
  protocol: 'Http';
  port: 80 | 8080;
}
export interface BackendSetting extends Base {
  type: typeof deliveryTypes.setting;
  gatewayId: string;
  protocol: 'Https';
  port: 443;
  pickHostNameFromBackendAddress: true;
  probeId: string;
}
export interface GatewayProbe extends Base {
  type: typeof deliveryTypes.probe;
  gatewayId: string;
  protocol: 'Https';
  path: string;
  pickHostNameFromBackendHttpSettings: true;
}
export interface GatewayRule extends Base {
  type: typeof deliveryTypes.gatewayRule;
  gatewayId: string;
  listenerId: string;
  poolId: string;
  settingId: string;
  priority: number;
  ruleType: 'Basic';
}
export interface DeliveryState {
  frontDoors: FrontDoor[];
  frontDoorEndpoints: Endpoint[];
  originGroups: OriginGroup[];
  origins: Origin[];
  deliveryRoutes: DeliveryRoute[];
  wafPolicies: WafPolicy[];
  wafRules: WafRule[];
  securityPolicies: SecurityPolicy[];
  applicationGateways: ApplicationGateway[];
  backendPools: BackendPool[];
  gatewayListeners: GatewayListener[];
  backendSettings: BackendSetting[];
  gatewayProbes: GatewayProbe[];
  gatewayRules: GatewayRule[];
}
export interface WebAppView {
  type: 'Microsoft.Web/sites';
  id: string;
  name: string;
  groupId: string;
  subscriptionId: string;
  region: string;
  enabled: boolean;
  publicNetworkAccess: 'Enabled' | 'Disabled';
  httpsOnly: boolean;
  deployment: 'none' | 'synthetic-http';
  healthPath: string;
  responseStatus: 200 | 503;
  origin: string;
}
export interface DeliveryContext {
  nextId: number;
  /** Actual count of every active World resource, including this slice. */
  resourceCount: number;
  commandId: string;
  groups: readonly { id: string; subscriptionId: string }[];
  webApps: readonly WebAppView[];
  vnets: readonly { id: string; groupId: string; region: string }[];
  subnets: readonly {
    id: string;
    name: string;
    vnetId: string;
    addressPrefix: string;
    nsgId: string | null;
    routeTableId: string | null;
  }[];
  occupiedSubnetIds: readonly string[];
}
type Delete<T extends string, K extends string> = { type: T } & Record<K, string>;
export type DeliveryCommand =
  | { type: 'CreateFrontDoor'; groupId: string; name: string; sku: string }
  | { type: 'CreateFrontDoorEndpoint'; profileId: string; name: string; enabled: string }
  | { type: 'UpdateFrontDoorEndpoint'; endpointId: string; profileId: string; enabled: string }
  | { type: 'CreateOriginGroup'; profileId: string; name: string; probePath: string }
  | { type: 'UpdateOriginGroup'; originGroupId: string; profileId: string; probePath: string }
  | {
      type: 'CreateFrontDoorOrigin';
      originGroupId: string;
      name: string;
      webAppId: string;
      enabled: string;
      priority: string;
    }
  | {
      type: 'UpdateFrontDoorOrigin';
      originId: string;
      originGroupId: string;
      webAppId: string;
      enabled: string;
      priority: string;
    }
  | {
      type: 'CreateFrontDoorRoute';
      endpointId: string;
      name: string;
      originGroupId: string;
      pattern: string;
      enabled: string;
    }
  | {
      type: 'UpdateFrontDoorRoute';
      routeId: string;
      endpointId: string;
      originGroupId: string;
      pattern: string;
      enabled: string;
    }
  | { type: 'CreateFrontDoorWafPolicy'; groupId: string; name: string; mode: string }
  | { type: 'UpdateFrontDoorWafPolicy'; policyId: string; groupId: string; mode: string }
  | {
      type: 'CreateFrontDoorWafRule';
      policyId: string;
      name: string;
      priority: string;
      operator: string;
      value: string;
      action: string;
      enabled: string;
    }
  | {
      type: 'UpdateFrontDoorWafRule';
      ruleId: string;
      policyId: string;
      priority: string;
      operator: string;
      value: string;
      action: string;
      enabled: string;
    }
  | {
      type: 'CreateFrontDoorSecurityPolicy';
      profileId: string;
      endpointId: string;
      wafPolicyId: string;
      name: string;
    }
  | {
      type: 'UpdateFrontDoorSecurityPolicy';
      securityPolicyId: string;
      profileId: string;
      endpointId: string;
      wafPolicyId: string;
    }
  | {
      type: 'CreateApplicationGateway';
      groupId: string;
      name: string;
      region: string;
      subnetId: string;
      sku: string;
    }
  | { type: 'CreateGatewayBackendPool'; gatewayId: string; name: string; webAppId: string }
  | { type: 'UpdateGatewayBackendPool'; poolId: string; gatewayId: string; webAppId: string }
  | { type: 'CreateGatewayListener'; gatewayId: string; name: string; port: string }
  | { type: 'UpdateGatewayListener'; listenerId: string; gatewayId: string; port: string }
  | { type: 'CreateGatewayBackendSetting'; gatewayId: string; name: string; probeId: string }
  | { type: 'UpdateGatewayBackendSetting'; settingId: string; gatewayId: string; probeId: string }
  | { type: 'CreateGatewayProbe'; gatewayId: string; name: string; path: string }
  | { type: 'UpdateGatewayProbe'; probeId: string; gatewayId: string; path: string }
  | {
      type: 'CreateGatewayRoutingRule';
      gatewayId: string;
      name: string;
      listenerId: string;
      poolId: string;
      settingId: string;
      priority: string;
    }
  | {
      type: 'UpdateGatewayRoutingRule';
      ruleId: string;
      gatewayId: string;
      listenerId: string;
      poolId: string;
      settingId: string;
      priority: string;
    }
  | Delete<'DeleteFrontDoor', 'profileId'>
  | Delete<'DeleteFrontDoorEndpoint', 'endpointId'>
  | Delete<'DeleteOriginGroup', 'originGroupId'>
  | Delete<'DeleteFrontDoorOrigin', 'originId'>
  | Delete<'DeleteFrontDoorRoute', 'routeId'>
  | Delete<'DeleteFrontDoorWafPolicy', 'policyId'>
  | Delete<'DeleteFrontDoorWafRule', 'ruleId'>
  | Delete<'DeleteFrontDoorSecurityPolicy', 'securityPolicyId'>
  | Delete<'DeleteApplicationGateway', 'gatewayId'>
  | Delete<'DeleteGatewayBackendPool', 'poolId'>
  | Delete<'DeleteGatewayListener', 'listenerId'>
  | Delete<'DeleteGatewayBackendSetting', 'settingId'>
  | Delete<'DeleteGatewayProbe', 'probeId'>
  | Delete<'DeleteGatewayRoutingRule', 'ruleId'>;
export type DeliveryResource =
  | FrontDoor
  | Endpoint
  | OriginGroup
  | Origin
  | DeliveryRoute
  | WafPolicy
  | WafRule
  | SecurityPolicy
  | ApplicationGateway
  | BackendPool
  | GatewayListener
  | BackendSetting
  | GatewayProbe
  | GatewayRule;
export type MutationCode = import('../v37/contract').Receipt['code'];
export interface DeliveryMutation {
  state: DeliveryState;
  nextId: number;
  outcome: 'accepted' | 'rejected' | 'unsupported';
  code: MutationCode;
  field?: string;
  targetType: string;
  scopeId: string;
  region: string | null;
  addedIds: string[];
  updatedIds: string[];
  removedIds: string[];
  before?: object;
  after?: object | null;
}
export const deliveryLimits = {
  entities: 96,
  profiles: 4,
  gateways: 4,
  children: 16,
  wafRules: 16,
} as const;
