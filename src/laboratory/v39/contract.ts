import type * as P from '../v38/contract';
import type { DeliveryCommand, DeliveryState } from '../delivery/contract';
import type { DataCommand, DataState } from '../data/contract';

/** Explicit opt-in successor. Existing workspaces retain their original evaluator. */
export const laboratoryModel = 'laboratory@3.9.0';
export type StorageLifecycleCommand =
  | { type: 'DeleteStorageAccount'; accountId: string }
  | { type: 'DeleteBlobContainer'; containerId: string };
export type Command = P.Command | DeliveryCommand | DataCommand | StorageLifecycleCommand;
export type Request = Omit<P.Request, 'command'> & { command: Command };
export type IntegrationChange = {
  id: string;
  name: string;
  type: string;
  parentId: string;
  createOrigin: string;
  before: Readonly<Record<string, unknown>> | null;
  after: Readonly<Record<string, unknown>> | null;
};
export type Receipt = P.Receipt & { integrationChange?: IntegrationChange };
export interface World extends Omit<P.World, 'model'> {
  model: typeof laboratoryModel;
  delivery: DeliveryState;
  data: DataState;
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
