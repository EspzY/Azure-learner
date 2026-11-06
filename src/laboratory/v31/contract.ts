import type * as Old from '../v3/contract';
export const laboratoryModel = 'laboratory@3.1.0';
export type NetworkCommand =
  | {
      type: 'CreateVirtualNetwork';
      groupId: string;
      name: string;
      region: string;
      addressSpace: string;
    }
  | { type: 'CreateSubnet'; vnetId: string; name: string; addressPrefix: string }
  | { type: 'CreateNetworkSecurityGroup'; groupId: string; name: string; region: string }
  | {
      type: 'CreateSecurityRule';
      nsgId: string;
      name: string;
      direction: string;
      priority: string;
      protocol: string;
      source: string;
      sourcePort: string;
      destination: string;
      destinationPort: string;
      access: string;
    }
  | { type: 'AssociateSubnetNsg'; subnetId: string; nsgId: string };
export type Command = Old.Command | NetworkCommand;
export type Request = Omit<Old.Request, 'command'> & { command: Command };
export type Receipt = Omit<Old.Receipt, 'code'> & {
  code:
    | Old.Receipt['code']
    | 'invalid-cidr'
    | 'outside-address-space'
    | 'overlapping-subnet'
    | 'priority-conflict'
    | 'invalid-priority'
    | 'invalid-rule'
    | 'incompatible-association';
};
export interface VirtualNetwork {
  id: string;
  name: string;
  groupId: string;
  region: string;
  addressSpace: string;
  origin: string;
}
export interface Subnet {
  id: string;
  name: string;
  vnetId: string;
  addressPrefix: string;
  nsgId: string | null;
  associationOrigin: string | null;
  origin: string;
}
export interface NetworkSecurityGroup {
  id: string;
  name: string;
  groupId: string;
  region: string;
  origin: string;
}
export interface SecurityRule {
  id: string;
  nsgId: string;
  name: string;
  direction: 'Inbound' | 'Outbound';
  priority: number;
  protocol: 'Tcp' | 'Udp' | '*';
  source: string;
  sourcePort: string;
  destination: string;
  destinationPort: string;
  access: 'Allow' | 'Deny';
  origin: string;
}
export interface World extends Omit<Old.World, 'model'> {
  model: typeof laboratoryModel;
  vnets: VirtualNetwork[];
  subnets: Subnet[];
  nsgs: NetworkSecurityGroup[];
  securityRules: SecurityRule[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const networkLimits = {
  vnets: 8,
  subnets: 24,
  nsgs: 8,
  rules: 32,
  rulesPerNsg: 16,
} as const;
