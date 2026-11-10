import type * as P from '../v35/contract';
export const laboratoryModel = 'laboratory@3.6.0';
export const nsgEditable = [
  'direction',
  'priority',
  'protocol',
  'source',
  'sourcePort',
  'destination',
  'destinationPort',
  'access',
] as const;
export const firewallEditable = ['source', 'destination', 'protocol', 'destinationPort'] as const;
export type LifecycleCommand =
  | {
      type: 'UpdateSecurityRule';
      ruleId: string;
      nsgId: string;
      direction: string;
      priority: string;
      protocol: string;
      source: string;
      sourcePort: string;
      destination: string;
      destinationPort: string;
      access: string;
    }
  | { type: 'DeleteSecurityRule'; ruleId: string; nsgId: string }
  | {
      type: 'UpdateFirewallNetworkRule';
      ruleId: string;
      collectionId: string;
      source: string;
      destination: string;
      protocol: string;
      destinationPort: string;
    }
  | { type: 'DeleteFirewallNetworkRule'; ruleId: string; collectionId: string };
export type Command = P.Command | LifecycleCommand;
export type Request = Omit<P.Request, 'command'> & { command: Command };
/** Only new lifecycle receipts contain this versioned immutable before/after evidence.
 * Create origin stays on the original resource; no mutable last-result store. */
export type RuleChange = {
  id: string;
  name: string;
  parentId: string;
  createOrigin: string;
  before: Record<string, string | number>;
  after: Record<string, string | number> | null;
};
export type Receipt = Omit<P.Receipt, 'code'> & {
  code: P.Receipt['code'] | 'read-only-rule' | 'no-change';
  updatedIds?: string[];
  change?: RuleChange;
};
export interface World extends Omit<P.World, 'model'> {
  model: typeof laboratoryModel;
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
export const lifecycleFields: Record<LifecycleCommand['type'], readonly string[]> = {
  UpdateSecurityRule: ['type', 'ruleId', 'nsgId', ...nsgEditable],
  DeleteSecurityRule: ['type', 'ruleId', 'nsgId'],
  UpdateFirewallNetworkRule: ['type', 'ruleId', 'collectionId', ...firewallEditable],
  DeleteFirewallNetworkRule: ['type', 'ruleId', 'collectionId'],
};
