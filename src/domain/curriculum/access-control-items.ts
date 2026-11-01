import type { AccessTopic } from './access-control';
export const accessItems = {
  ab01: {
    family: 'rbac-additive',
    variant: 'inherited-delete-despite-custom-exclusion',
    objectives: ['ACF02'],
    accepted: [[1, 2]],
    repeat: 'roles',
    sources: ['AC05', 'AC06', 'AC07'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab02: {
    family: 'rbac-delegation',
    variant: 'split-rg-read-and-single-vm-access-delegation',
    objectives: ['ACF02'],
    accepted: [[2, 0]],
    repeat: 'roles',
    sources: ['AC08', 'AC18'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab03: {
    family: 'rbac-data-plane',
    variant: 'portal-management-complements-api-data-role',
    objectives: ['ACF02'],
    accepted: [[0, 1]],
    repeat: 'planes',
    sources: ['AC07', 'AC20', 'AC23'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab04: {
    family: 'rbac-directory-boundary',
    variant: 'direct-or-group-reader-under-directory-admin',
    objectives: ['ACF02'],
    accepted: [
      [0, 1],
      [2, 1],
    ],
    repeat: 'roles',
    sources: ['AC06', 'AC08'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab05: {
    family: 'ca-coverage',
    variant: 'mfa-required-with-unmanaged-work-preserved',
    objectives: ['ACF01'],
    accepted: [[1, 0]],
    repeat: 'policies',
    sources: ['AC10', 'AC15'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab06: {
    family: 'ca-versus-rbac',
    variant: 'handover-read-only-with-report-only-device-counterevidence',
    objectives: ['ACF01'],
    accepted: [[0, 2]],
    repeat: 'policies',
    sources: ['AC10', 'AC11', 'AC06'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab09: {
    family: 'ca-policy-combination',
    variant: 'preserve-user-by-app-exception-matrix',
    objectives: ['ACF01'],
    accepted: [[1, 2]],
    repeat: 'policies',
    sources: ['AC10', 'AC13', 'AC14', 'AC17'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  ab10: {
    family: 'rbac-versus-policy',
    variant: 'paired-authorized-create-resource-tag-difference',
    objectives: ['ACF02'],
    accepted: [[0, 0]],
    repeat: 'planes',
    sources: ['AC05', 'AC27'],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
} as const;
export type AccessItemId = keyof typeof accessItems;
export const accessItemIds = Object.keys(accessItems) as AccessItemId[];
export interface AccessAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateAccess(item: AccessItemId, answer: AccessAnswer) {
  const pairs: readonly (readonly [number, number])[] = accessItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`access.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
export const accessRepeats: Record<AccessItemId, AccessTopic> = Object.fromEntries(
  accessItemIds.map((id) => [id, accessItems[id].repeat]),
) as Record<AccessItemId, AccessTopic>;
