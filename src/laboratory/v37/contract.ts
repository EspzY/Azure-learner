import type * as P from '../v36/contract';
export const laboratoryModel = 'laboratory@3.7.0';
export type TopologyCommand =
  | {
      type: 'UpdateRoute';
      routeId: string;
      routeTableId: string;
      addressPrefix: string;
      nextHopType: string;
      firewallId?: string;
      nextHopIp?: string;
    }
  | { type: 'DisassociateSubnetNsg'; subnetId: string; nsgId: string }
  | { type: 'SetPeeringVirtualNetworkAccess'; peeringId: string; vnetId: string; value: string };
export type Command = P.Command | TopologyCommand;
export type Request = Omit<P.Request, 'command'> & { command: Command };
export type TopologyChange = {
  id: string;
  name: string;
  parentId: string;
  createOrigin: string;
  before: Record<string, string | number | boolean | null>;
  after: Record<string, string | number | boolean | null>;
};
export type Receipt = P.Receipt & { topologyChange?: TopologyChange };
export type Peering = Omit<P.World['peerings'][number], 'allowVirtualNetworkAccess'> & {
  allowVirtualNetworkAccess: boolean;
  accessOrigin: string | null;
};
export interface World extends Omit<P.World, 'model' | 'peerings'> {
  model: typeof laboratoryModel;
  peerings: Peering[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const topologyFields: Record<TopologyCommand['type'], readonly string[]> = {
  UpdateRoute: ['type', 'routeId', 'routeTableId', 'addressPrefix', 'nextHopType'],
  DisassociateSubnetNsg: ['type', 'subnetId', 'nsgId'],
  SetPeeringVirtualNetworkAccess: ['type', 'peeringId', 'vnetId', 'value'],
};
