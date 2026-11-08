import type * as P from '../v34/contract';
export const laboratoryModel = 'laboratory@3.5.0';
export type FirewallCommand =
  | {
      type: 'CreateFirewallPolicy';
      groupId: string;
      name: string;
      region: string;
      tier: string;
      threatIntelMode: string;
    }
  | { type: 'CreateFirewallRuleCollectionGroup'; policyId: string; name: string; priority: string }
  | {
      type: 'CreateFirewallNetworkCollection';
      collectionGroupId: string;
      name: string;
      priority: string;
      action: string;
    }
  | {
      type: 'CreateFirewallNetworkRule';
      collectionId: string;
      name: string;
      source: string;
      destination: string;
      protocol: string;
      destinationPort: string;
    }
  | {
      type: 'CreateAzureFirewall';
      groupId: string;
      name: string;
      region: string;
      subnetId: string;
      policyId: string;
      skuName: string;
      skuTier: string;
    }
  | {
      type: 'CreateFirewallRoute';
      routeTableId: string;
      name: string;
      addressPrefix: string;
      firewallId: string;
      nextHopIp: string;
    }
  | { type: 'SetPeeringForwardedTraffic'; peeringId: string; value: string }
  | { type: 'DeleteRoute'; routeId: string };
export type Command = P.Command | FirewallCommand;
export type Request = Omit<P.Request, 'command'> & { command: Command };
export type Receipt = Omit<P.Receipt, 'code'> & {
  code:
    | P.Receipt['code']
    | 'invalid-firewall-subnet'
    | 'dedicated-subnet'
    | 'invalid-next-hop'
    | 'invalid-firewall-rule';
};
export interface FirewallPolicy {
  id: string;
  name: string;
  groupId: string;
  region: string;
  tier: 'Standard';
  threatIntelMode: 'Off';
  origin: string;
}
export interface CollectionGroup {
  id: string;
  name: string;
  policyId: string;
  priority: number;
  origin: string;
}
export interface NetworkCollection {
  id: string;
  name: string;
  collectionGroupId: string;
  priority: number;
  action: 'Allow' | 'Deny';
  origin: string;
}
export interface NetworkRule {
  id: string;
  name: string;
  collectionId: string;
  source: string;
  destination: string;
  protocol: 'Tcp' | 'Udp';
  destinationPort: string;
  origin: string;
}
export interface Firewall {
  id: string;
  name: string;
  groupId: string;
  region: string;
  subnetId: string;
  policyId: string;
  publicIpId: string;
  privateIpAddress: string;
  skuName: 'AZFW_VNet';
  skuTier: 'Standard';
  origin: string;
}
export interface PublicIp {
  id: string;
  name: string;
  groupId: string;
  region: string;
  sku: 'Standard';
  tier: 'Regional';
  allocation: 'Static';
  ipVersion: 'IPv4';
  address: null;
  origin: string;
}
export type Peering = P.World['peerings'][number] & {
  allowForwardedTraffic: boolean;
  forwardingOrigin: string | null;
};
export type FirewallRoute = {
  id: string;
  name: string;
  routeTableId: string;
  addressPrefix: string;
  nextHopType: 'VirtualAppliance';
  firewallId: string;
  nextHopIp: string;
  origin: string;
};
export type Route = P.World['routes'][number] | FirewallRoute;
export interface World extends Omit<P.World, 'model' | 'routes' | 'peerings'> {
  model: typeof laboratoryModel;
  routes: Route[];
  peerings: Peering[];
  firewalls: Firewall[];
  publicIps: PublicIp[];
  firewallPolicies: FirewallPolicy[];
  firewallGroups: CollectionGroup[];
  firewallCollections: NetworkCollection[];
  firewallRules: NetworkRule[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const firewallLimits = {
  firewalls: 4,
  policies: 8,
  groups: 16,
  collections: 24,
  rules: 48,
} as const;

export const firewallFields: Record<string, readonly string[]> = {
  CreateFirewallPolicy: ['type', 'groupId', 'name', 'region', 'tier', 'threatIntelMode'],
  CreateFirewallRuleCollectionGroup: ['type', 'policyId', 'name', 'priority'],
  CreateFirewallNetworkCollection: ['type', 'collectionGroupId', 'name', 'priority', 'action'],
  CreateFirewallNetworkRule: [
    'type',
    'collectionId',
    'name',
    'source',
    'destination',
    'protocol',
    'destinationPort',
  ],
  CreateAzureFirewall: [
    'type',
    'groupId',
    'name',
    'region',
    'subnetId',
    'policyId',
    'skuName',
    'skuTier',
  ],
  CreateFirewallRoute: ['type', 'routeTableId', 'name', 'addressPrefix', 'firewallId', 'nextHopIp'],
  SetPeeringForwardedTraffic: ['type', 'peeringId', 'value'],
  DeleteRoute: ['type', 'routeId'],
  ResetWorkspace: ['type'],
};
