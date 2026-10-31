import type { Engine } from '../chapter01/model';
import { infrastructure, types } from '../sandbox/model';
import { replayEngine } from '../sandbox/replay';

/** Conceptual observations are not Engine receipts and have their own source contract. */
export const conceptMilestones = {
  'storage-accounts': {
    version: '1.0.0',
    objectives: ['SG03'],
    sources: ['SS08', 'SS20', 'SS21'],
    trigger: 'saved-unsupported-premium-queue-and-supported-gpv2-contrast',
    auto: 'first-new-guided-model-result',
  },
  'storage-delivery': {
    version: '1.0.0',
    objectives: ['SG02'],
    sources: ['SS13', 'SS14', 'SS15'],
    trigger: 'saved-redelivery-with-two-versus-one-application-effects',
    auto: 'first-new-guided-model-result',
  },
  'connectivity-diagnose': {
    version: '1.0.0',
    objectives: ['CN01', 'CN02'],
    sources: ['CS09', 'CS12', 'CS13', 'CS15'],
    trigger: 'saved-hybrid-failure-and-declared-independent-backup-contrast',
    auto: 'first-new-guided-model-result',
  },
  'connectivity-dns': {
    version: '1.0.0',
    objectives: ['CN03', 'CN04'],
    sources: ['CS16', 'CS17', 'CS19', 'CS20'],
    trigger: 'saved-private-address-resolution-without-declared-network-path',
    auto: 'first-new-guided-model-result',
  },
  'networking-inspect': {
    version: '1.0.0',
    objectives: ['NW01'],
    sources: ['NS07', 'NS08'],
    trigger: 'seven-current-actual-references-inspected-in-pinned-technical-attempt',
    auto: 'first-new-guided-inspection',
  },
  'networking-peering': {
    version: '1.0.0',
    objectives: ['NW03'],
    sources: ['NS09', 'NS10', 'NS11'],
    trigger: 'saved-standard-peering-address-overlap-rejection',
    auto: 'first-new-guided-model-result',
  },
  'networking-dns': {
    version: '1.0.0',
    objectives: ['NW04'],
    sources: ['NS13', 'NS14'],
    trigger: 'saved-correct-name-resolution-without-documented-network-path',
    auto: 'first-new-guided-model-result',
  },
  'compute-container': {
    version: '1.0.0',
    objectives: ['CP01'],
    sources: ['PS24', 'PS26', 'PS31'],
    trigger: 'saved-recreate-ephemeral-versus-persistent-valid-runtime-contrast',
    auto: 'first-new-guided-model-result',
  },
  'compute-capacity': {
    version: '1.0.0',
    objectives: ['CP02'],
    sources: ['PS12', 'PS13', 'PS15', 'PS16'],
    trigger: 'saved-zone-boundary-and-explicit-capacity-rule-contrast',
    auto: 'first-new-guided-model-result',
  },
  'cost-time': {
    version: '1.0.0',
    objectives: ['CM01', 'CM02'],
    sources: ['CS03', 'CS10'],
    trigger: 'two-saved-estimates-lower-compute-time-retained-storage-and-egress',
    auto: 'first-new-guided-model-result',
  },
  'cost-budget': {
    version: '1.0.0',
    objectives: ['CM03'],
    sources: ['CS13', 'CS14'],
    trigger: 'saved-actual-and-forecast-same-scope-budget-contrast',
    auto: 'first-new-guided-model-result',
  },
  'mission-diagnosis': {
    version: '1.0.0',
    objectives: ['CB02'],
    sources: ['PM09', 'PM10'],
    trigger: 'validated-dependency-topology-model-contrast',
    auto: 'first-new-guided-validated-observation',
  },
  'mission-settings': {
    version: '1.0.0',
    objectives: ['ST02', 'ST04'],
    sources: ['PM17', 'PM18'],
    trigger: 'two-ordered-accepted-settings-receipts-and-inspection',
    auto: 'first-new-guided-validated-observation',
  },
  'management-relations': {
    version: '1.0.0',
    objectives: ['CA04', 'CA07'],
    sources: ['AM03'],
    trigger: 'live-hosting-and-membership-causal-explanation',
    auto: 'first-new-guided-validated-observation',
  },
  'management-policy': {
    version: '1.0.0',
    objectives: ['CA06', 'CA07'],
    sources: ['AM06', 'AM10'],
    trigger: 'replayed-subscription-policy-denial-inspection',
    auto: 'first-new-guided-validated-observation',
  },
  'physical-loss': {
    version: '1.0.0',
    objectives: ['CA03', 'CA02'],
    sources: ['AR06', 'AR09'],
    trigger: 'validated-single-placement-loss',
    auto: 'first-new-guided-model-result',
  },
  'physical-resilience': {
    version: '1.0.0',
    objectives: ['CA02', 'CA01'],
    sources: ['AR05', 'AR07'],
    trigger: 'validated-affected-components-and-surviving-usable-path',
    auto: 'first-new-guided-model-result',
  },
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
