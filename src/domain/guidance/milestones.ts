import type { Engine } from '../chapter01/model';
import { infrastructure, types } from '../sandbox/model';
import { replayEngine } from '../sandbox/replay';

/** Conceptual observations are not Engine receipts and have their own source contract. */
export const conceptMilestones = {
  'serverless-execution': {
    version: '1.0.0',
    objectives: ['FC08'],
    sources: ['SL03', 'SL04', 'SL10'],
    trigger: 'validated-execution-trace-with-started-work',
    auto: 'first-new-guided-model-result',
  },
} as const;

/** Read-only presentation contracts; never emits commands, answers, awards or learning events. */
export const milestoneDefinitions = {
  'policy-denial': {
    version: '1.0.0',
    objectives: ['G03', 'CB03'],
    sources: ['S38'],
    trigger: 'replayed-denial-in-guided-scope',
    auto: 'first-new-receipt-policy-inspection',
  },
  'vm-dependencies': {
    version: '1.0.0',
    objectives: ['C02', 'ST01', 'N01'],
    sources: ['S321-VM', 'S321-DISK', 'S321-NIC'],
    trigger: 'replayed-vm-bundle-with-existing-dependencies',
    auto: 'first-new-bundle-explicit-vm-inspection',
  },
} as const;
export type MilestoneId = keyof typeof milestoneDefinitions;
export interface GuidedMilestoneContext {
  scope: string;
  attempt: number;
  boundary: string | null;
  kind: 'vm' | 'paas';
  groupId?: string;
  inspected: readonly string[];
}
export interface MilestoneObservation {
  id: MilestoneId;
  key: string;
  receiptId: string;
  scopeId: string;
  requestedLocation: string | null;
  allowedLocations: readonly string[];
  beforeCount: number;
  afterCount: number;
  resources: { id: string; name: string; role: 'vm' | 'osDisk' | 'nic' | 'subnet' | 'vnet' }[];
}
export function milestoneObservations(
  engine: Engine,
  attempt: number,
  context: GuidedMilestoneContext | null,
  independent: boolean,
): MilestoneObservation[] {
  if (independent || !context || context.attempt !== attempt) return [];
  const replay = replayEngine(engine);
  if (!replay) return [];
  const boundary =
    context.boundary === null
      ? -1
      : engine.ledger.findIndex((e) => e.request.commandId === context.boundary);
  if (context.boundary !== null && boundary < 0) return [];
  const entries = engine.ledger.slice(boundary + 1);
  const key = (id: MilestoneId) =>
    `${id}@${milestoneDefinitions[id].version}:${attempt}:${context.scope}`;
  const result: MilestoneObservation[] = [];
  if (context.kind === 'paas') {
    const r = entries.findLast(
      ({ receipt: r }) =>
        r.code === 'policy-location-denied' &&
        r.outcome === 'rejected' &&
        r.targetType === types.plan &&
        r.policy &&
        context.groupId === r.scopeId &&
        r.beforeRevision === r.afterRevision &&
        r.addedIds.length === 0 &&
        replay.world.groups.some((g) => g.id === r.scopeId),
    )?.receipt;
    if (r?.policy)
      result.push({
        id: 'policy-denial',
        key: key('policy-denial'),
        receiptId: r.commandId,
        scopeId: r.scopeId,
        requestedLocation: r.location,
        allowedLocations: r.policy.allowedLocations,
        beforeCount: r.beforeCount,
        afterCount: r.afterCount,
        resources: [],
      });
  }
  if (context.kind === 'vm') {
    const resources = infrastructure(replay.world);
    const entry = entries.findLast(
      ({ receipt: r }) =>
        r.operation === 'CreateVmBundle' &&
        r.outcome === 'accepted' &&
        resources.some((x) => x.kind === 'vm' && r.addedIds.includes(x.id)),
    );
    const vm =
      entry && resources.find((r) => r.kind === 'vm' && entry.receipt.addedIds.includes(r.id));
    if (vm?.kind === 'vm' && entry) {
      const disk = resources.find(
        (r) => r.id === vm.osDiskId && r.kind === 'disk' && r.role === 'os',
      );
      const nic = resources.find((r) => r.id === vm.nicId && r.kind === 'nic');
      const subnet =
        nic?.kind === 'nic' && resources.find((r) => r.id === nic.subnetId && r.kind === 'subnet');
      const vnet =
        subnet &&
        subnet.kind === 'subnet' &&
        resources.find((r) => r.id === subnet.vnetId && r.kind === 'vnet');
      if (disk && nic && subnet && vnet)
        result.push({
          id: 'vm-dependencies',
          key: key('vm-dependencies'),
          receiptId: entry.receipt.commandId,
          scopeId: vm.groupId,
          requestedLocation: vm.location,
          allowedLocations: [],
          beforeCount: entry.receipt.beforeCount,
          afterCount: entry.receipt.afterCount,
          resources: [
            { id: vm.id, name: vm.name, role: 'vm' },
            { id: disk.id, name: disk.name, role: 'osDisk' },
            { id: nic.id, name: nic.name, role: 'nic' },
            { id: subnet.id, name: subnet.name, role: 'subnet' },
            { id: vnet.id, name: vnet.name, role: 'vnet' },
          ],
        });
    }
  }
  return result;
}
export function milestoneAutoContext(
  observation: MilestoneObservation,
  context: GuidedMilestoneContext,
  area: string,
  resourceId: string,
) {
  return observation.id === 'policy-denial'
    ? area === 'policy'
    : area === 'resource' &&
        observation.resources.some(
          (r) => r.role === 'vm' && r.id === resourceId && context.inspected.includes(r.id),
        );
}
