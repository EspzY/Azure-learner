import type * as A from '../v31/contract';
export const laboratoryModel = 'laboratory@3.2.0';
export type RoutingCommand =
  | { type: 'CreateVnetPeering'; vnetId: string; remoteVnetId: string; name: string }
  | { type: 'CreateRouteTable'; groupId: string; region: string; name: string }
  | {
      type: 'CreateRoute';
      routeTableId: string;
      name: string;
      addressPrefix: string;
      nextHopType: string;
    }
  | { type: 'AssociateSubnetRouteTable'; subnetId: string; routeTableId: string }
  | { type: 'DisassociateSubnetRouteTable'; subnetId: string };
export type Command = A.Command | RoutingCommand;
export type Request = Omit<A.Request, 'command'> & { command: Command };
export type Receipt = Omit<A.Receipt, 'code'> & {
  code:
    | A.Receipt['code']
    | 'invalid-peering'
    | 'overlapping-vnets'
    | 'duplicate-peering'
    | 'duplicate-prefix'
    | 'unsupported-next-hop'
    | 'unsupported-route-profile'
    | 'not-associated';
};
export interface Peering {
  id: string;
  name: string;
  vnetId: string;
  remoteVnetId: string;
  allowVirtualNetworkAccess: true;
  origin: string;
}
export interface RouteTable {
  id: string;
  name: string;
  groupId: string;
  region: string;
  origin: string;
}
export type UserNextHop = 'VnetLocal' | 'Internet' | 'None';
export interface Route {
  id: string;
  name: string;
  routeTableId: string;
  addressPrefix: string;
  nextHopType: UserNextHop;
  origin: string;
}
export interface Subnet extends A.Subnet {
  routeTableId: string | null;
  routeAssociationOrigin: string | null;
}
export interface World extends Omit<A.World, 'model' | 'subnets'> {
  model: typeof laboratoryModel;
  subnets: Subnet[];
  peerings: Peering[];
  routeTables: RouteTable[];
  routes: Route[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const routingLimits = {
  peerings: 16,
  routeTables: 8,
  routes: 32,
  routesPerTable: 16,
} as const;
