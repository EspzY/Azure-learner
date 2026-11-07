import type * as Previous from '../v33/contract';
export const laboratoryModel = 'laboratory@3.4.0';
export type ComputeCommand = {
  type: 'CreateVirtualMachine';
  groupId: string;
  name: string;
  region: string;
  image: string;
  size: string;
  subnetId: string;
  privateIpAddress: string;
  allocation: string;
  nsgId: string;
  osDiskSku: string;
  osDiskSizeGiB: string;
};
export type Command = Previous.Command | ComputeCommand;
export type Request = Omit<Previous.Request, 'command'> & { command: Command };
export type Receipt = Previous.Receipt;
export interface VirtualMachine {
  id: string;
  name: string;
  groupId: string;
  region: string;
  image: string;
  size: string;
  nicId: string;
  osDiskId: string;
  origin: string;
}
export interface ManagedDisk {
  id: string;
  name: string;
  groupId: string;
  region: string;
  sku: 'StandardSSD_LRS';
  sizeGiB: 128 | 256;
  osType: 'Linux' | 'Windows';
  origin: string;
}
export interface World extends Omit<Previous.World, 'model'> {
  model: typeof laboratoryModel;
  vms: VirtualMachine[];
  disks: ManagedDisk[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const computeLimits = { vms: 8, disks: 8 } as const;
