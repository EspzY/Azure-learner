import type { SecurityTopic } from './security';
export const securityItems = {
  sp01: {
    family: 'zt-export-context-versus-internal-session',
    variant: 'zt-export-context-versus-internal-session-constraints-v1',
    objectives: ['SEC01'],
    repeat: 'zero-trust',
    sources: ['SE03', 'SE07', 'SE08'],
    accepted: [[2, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp02: {
    family: 'zt-timebound-read-only-support-architectures',
    variant: 'zt-timebound-read-only-support-architectures-constraints-v1',
    objectives: ['SEC01'],
    repeat: 'zero-trust',
    sources: ['SE07', 'SE08'],
    accepted: [
      [0, 2],
      [1, 2],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp03: {
    family: 'zt-preserve-batch-workflow-limit-potential-blast',
    variant: 'zt-preserve-batch-workflow-limit-potential-blast-constraints-v1',
    objectives: ['SEC01'],
    repeat: 'zero-trust',
    sources: ['SE07', 'SE08'],
    accepted: [
      [1, 1],
      [2, 1],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp04: {
    family: 'depth-confidential-offline-export-boundary',
    variant: 'depth-confidential-offline-export-boundary-constraints-v1',
    objectives: ['SEC02'],
    repeat: 'encryption',
    sources: ['SE04', 'SE05', 'SE14', 'SE24', 'SE25'],
    accepted: [[1, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp05: {
    family: 'depth-asynchronous-result-release-boundary',
    variant: 'depth-asynchronous-result-release-boundary-constraints-v1',
    objectives: ['SEC02'],
    repeat: 'depth',
    sources: ['SE04', 'SE07', 'SE14', 'SE24'],
    accepted: [
      [2, 1],
      [1, 1],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp06: {
    family: 'defender-arc-connected-server-plan-evidence-gap',
    variant: 'defender-arc-connected-server-plan-evidence-gap-constraints-v1',
    objectives: ['SEC03'],
    repeat: 'protection',
    sources: ['SE09', 'SE10', 'SE17', 'SE18', 'SE23'],
    accepted: [[0, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp07: {
    family: 'defender-supported-subset-improvement-versus-estate-trend',
    variant: 'defender-supported-subset-improvement-versus-estate-trend-constraints-v1',
    objectives: ['SEC03'],
    repeat: 'score',
    sources: ['SE09', 'SE10', 'SE12', 'SE28'],
    accepted: [[2, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  sp08: {
    family: 'defender-parallel-posture-alert-triage-context',
    variant: 'defender-parallel-posture-alert-triage-context-constraints-v1',
    objectives: ['SEC03'],
    repeat: 'protection',
    sources: ['SE11', 'SE13', 'SE17'],
    accepted: [
      [1, 2],
      [2, 2],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
} as const;
export type SecurityItemId = keyof typeof securityItems;
export const securityItemIds = Object.keys(securityItems) as SecurityItemId[];
export interface SecurityAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateSecurity(item: SecurityItemId, answer: SecurityAnswer) {
  const pairs: readonly (readonly [number, number])[] = securityItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`security.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
export const securityRepeats: Record<SecurityItemId, SecurityTopic> = Object.fromEntries(
  securityItemIds.map((id) => [id, securityItems[id].repeat]),
) as Record<SecurityItemId, SecurityTopic>;
