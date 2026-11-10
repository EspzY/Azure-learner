import type * as Previous from '../v32/contract';
export const laboratoryModel = 'laboratory@3.3.0';
export type EndpointCommand =
  | {
      type: 'CreateNetworkInterface';
      groupId: string;
      name: string;
      region: string;
      vnetId: string;
      subnetId: string;
      privateIpAddress: string;
      allocation: string;
    }
  | { type: 'AssociateNicNsg'; nicId: string; nsgId: string }
  | { type: 'DisassociateNicNsg'; nicId: string };
export type Command = Previous.Command | EndpointCommand;
export type Request = Omit<Previous.Request, 'command'> & { command: Command };
export type Receipt = Omit<Previous.Receipt, 'code'> & {
  code:
    | Previous.Receipt['code']
    | 'invalid-private-ip'
    | 'outside-subnet'
    | 'reserved-private-ip'
    | 'duplicate-private-ip';
};
export interface NetworkInterface {
  id: string;
  name: string;
  groupId: string;
  region: string;
  subnetId: string;
  privateIpAddress: string;
  allocation: 'Static';
  ipVersion: 'IPv4';
  primary: true;
  nsgId: string | null;
  associationOrigin: string | null;
  origin: string;
}
export interface World extends Omit<Previous.World, 'model'> {
  model: typeof laboratoryModel;
  nics: NetworkInterface[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const endpointLimits = { nics: 16 } as const;
