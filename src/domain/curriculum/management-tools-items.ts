import type { ToolsTopic } from './management-tools';
export const toolsItems = {
  mt01: {
    family: 'portal-identity-across-scopes',
    variant: 'portal-identity-across-scopes-constraints-v1',
    objectives: ['MGT01', 'MGT05'],
    repeat: 'portal',
    sources: ['MT03', 'MT08', 'MT22', 'MT33'],
    accepted: [[0, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt02: {
    family: 'portal-management-status-versus-runtime',
    variant: 'portal-management-status-versus-runtime-constraints-v1',
    objectives: ['MGT01'],
    repeat: 'portal',
    sources: ['MT03', 'MT08', 'MT34'],
    accepted: [[2, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt03: {
    family: 'hosted-powershell-without-local-install',
    variant: 'hosted-powershell-without-local-install-constraints-v1',
    objectives: ['MGT02'],
    repeat: 'shell',
    sources: ['MT04', 'MT06', 'MT18', 'MT19', 'MT21'],
    accepted: [[1, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt04: {
    family: 'scheduled-cli-existing-runner',
    variant: 'scheduled-cli-existing-runner-constraints-v1',
    objectives: ['MGT02', 'MGT05'],
    repeat: 'cli',
    sources: ['MT05', 'MT08', 'MT19'],
    accepted: [[2, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt05: {
    family: 'arc-generic-server-hardware-boundary',
    variant: 'registered-server-versus-underlying-capacity-v1',
    objectives: ['MGT03'],
    repeat: 'arc',
    sources: ['MT07', 'MT29', 'MT38'],
    accepted: [[0, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt06: {
    family: 'arc-cluster-disconnected-gitops',
    variant: 'arc-cluster-disconnected-gitops-constraints-v1',
    objectives: ['MGT03'],
    repeat: 'arc',
    sources: ['MT07', 'MT30'],
    accepted: [[2, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt07: {
    family: 'iac-two-reviewed-authoring-approaches',
    variant: 'iac-two-reviewed-authoring-approaches-constraints-v1',
    objectives: ['MGT04', 'MGT05'],
    repeat: 'iac',
    sources: ['MT09', 'MT10', 'MT15'],
    accepted: [
      [2, 1],
      [0, 1],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt08: {
    family: 'iac-effective-input-review',
    variant: 'unchanged-definition-changed-parameter-artifact-v1',
    objectives: ['MGT04'],
    repeat: 'iac',
    sources: ['MT09', 'MT10', 'MT24'],
    accepted: [[1, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt09: {
    family: 'whatif-permission-boundary',
    variant: 'whatif-permission-boundary-constraints-v1',
    objectives: ['MGT05'],
    repeat: 'changes',
    sources: ['MT08', 'MT11'],
    accepted: [[0, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  mt10: {
    family: 'existing-plan-reference-not-new-order',
    variant: 'existing-plan-reference-not-new-order-constraints-v1',
    objectives: ['MGT05'],
    repeat: 'bicep',
    sources: ['MT24', 'MT25', 'MT26', 'MT33', 'MT36', 'MT37'],
    accepted: [[1, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
} as const;
export type ToolsItemId = keyof typeof toolsItems;
export const toolsItemIds = Object.keys(toolsItems) as ToolsItemId[];
export interface ToolsAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateTools(item: ToolsItemId, answer: ToolsAnswer) {
  const pairs: readonly (readonly [number, number])[] = toolsItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`tools.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
export const toolsRepeats: Record<ToolsItemId, ToolsTopic> = Object.fromEntries(
  toolsItemIds.map((id) => [id, toolsItems[id].repeat]),
) as Record<ToolsItemId, ToolsTopic>;
