import type { GovernanceTopic } from './governance';
export const governanceItems = {
  gc01: {
    family: 'data-business-meaning',
    variant: 'two-retained-source-definitions',
    objectives: ['GOV01'],
    accepted: [[2, 1]],
    repeat: 'purview',
    sources: ['GV04', 'GV06', 'GV24', 'GV33'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc02: {
    family: 'data-change-impact',
    variant: 'registered-multistep-lineage-before-change',
    objectives: ['GOV01'],
    accepted: [[0, 2]],
    repeat: 'catalog',
    sources: ['GV21', 'GV23', 'GV34'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc03: {
    family: 'data-source-access',
    variant: 'direct-client-after-classification',
    objectives: ['GOV01'],
    accepted: [[2, 0]],
    repeat: 'catalog',
    sources: ['GV06', 'GV22', 'GV33'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc04: {
    family: 'policy-layering',
    variant: 'permanent-pilot-with-production-deny-preserved',
    objectives: ['GOV02'],
    accepted: [[1, 2]],
    repeat: 'assignments',
    sources: ['GV07', 'GV08', 'GV09', 'GV26', 'GV27', 'GV30'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc05: {
    family: 'policy-remediation',
    variant: 'mixed-new-request-and-partial-remediation-scope',
    objectives: ['GOV02'],
    accepted: [[0, 1]],
    repeat: 'compliance',
    sources: ['GV25', 'GV28', 'GV31'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc06: {
    family: 'policy-exemption',
    variant: 'single-initiative-requirement-mitigated-until-expiry',
    objectives: ['GOV02'],
    accepted: [[1, 0]],
    repeat: 'assignments',
    sources: ['GV08', 'GV11'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc07: {
    family: 'lock-scope-redesign',
    variant: 'release-one-workload-preserve-two-readonly-groups',
    objectives: ['GOV03'],
    accepted: [[2, 1]],
    repeat: 'locks',
    sources: ['GV12', 'GV18'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc08: {
    family: 'lock-service-route',
    variant: 'file-share-data-delete-under-account-readonly',
    objectives: ['GOV03'],
    accepted: [[1, 2]],
    repeat: 'planes',
    sources: ['GV12', 'GV13'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  gc09: {
    family: 'lock-and-recovery',
    variant: 'daily-management-changes-plus-logical-restore',
    objectives: ['GOV03'],
    accepted: [[0, 0]],
    repeat: 'planes',
    sources: ['GV12', 'GV13', 'GV35', 'GV36'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
} as const;
export type GovernanceItemId = keyof typeof governanceItems;
export const governanceItemIds = Object.keys(governanceItems) as GovernanceItemId[];
export interface GovernanceAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateGovernance(item: GovernanceItemId, answer: GovernanceAnswer) {
  const pairs: readonly (readonly [number, number])[] = governanceItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`governance.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
export const governanceRepeats: Record<GovernanceItemId, GovernanceTopic> = Object.fromEntries(
  governanceItemIds.map((id) => [id, governanceItems[id].repeat]),
) as Record<GovernanceItemId, GovernanceTopic>;
