export const laboratoryModel = 'laboratory@3.0.0';
export type Command =
  | { type: 'CreateGroup'; subscriptionId: string; name: string; metadataRegion: string }
  | {
      type: 'CreateStorageAccount';
      groupId: string;
      name: string;
      region: string;
      kind: string;
      sku: string;
    }
  | { type: 'CreateBlobContainer'; accountId: string; name: string; access: string }
  | { type: 'CreateTextBlob'; containerId: string; name: string; text: string; contentType: string }
  | { type: 'ResetWorkspace' };
export interface Request {
  commandId: string;
  expectedRevision: number;
  command: Command;
}
export type Receipt = import('../../domain/chapter01/model').Receipt;
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export interface Group {
  id: string;
  name: string;
  subscriptionId: string;
  metadataRegion: string;
  origin: string;
}
export interface Account {
  id: string;
  name: string;
  groupId: string;
  region: string;
  kind: 'StorageV2';
  sku: 'Standard_LRS';
  origin: string;
}
export interface Container {
  id: string;
  name: string;
  accountId: string;
  access: 'private';
  origin: string;
}
export interface Blob {
  id: string;
  name: string;
  containerId: string;
  text: string;
  contentType: 'text/plain';
  byteLength: number;
  sha256: string;
  origin: string;
}
export interface World {
  model: typeof laboratoryModel;
  revision: number;
  nextId: number;
  attempt: number;
  groups: Group[];
  accounts: Account[];
  containers: Container[];
  blobs: Blob[];
}
export interface Snapshot {
  workspace: string;
  world: World;
  entries: Entry[];
  historical: boolean;
}
export interface CommandResult extends Snapshot {
  receipt: Receipt;
  redelivered: boolean;
}
export const limits = {
  entities: 96,
  groups: 8,
  accounts: 8,
  containers: 16,
  blobs: 32,
  textUnits: 120,
  textBytes: 480,
  totalBytes: 8192,
  events: 512,
} as const;
