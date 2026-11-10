import type { MonitoringTopic } from './monitoring';
export const monitoringItems = {
  md01: {
    family: 'advisor-filter-scope-versus-recorded-spend',
    variant: 'advisor-filter-scope-versus-recorded-spend-constraints-v1',
    objectives: ['MON01'],
    repeat: 'advisor',
    sources: ['MO03', 'MO15', 'MO32'],
    accepted: [[2, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md02: {
    family: 'advisor-category-and-incident-boundary',
    variant: 'advisor-category-and-incident-boundary-constraints-v1',
    objectives: ['MON01'],
    repeat: 'advisor',
    sources: ['MO03', 'MO15', 'MO33'],
    accepted: [[2, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md03: {
    family: 'health-targeted-history-versus-public-page',
    variant: 'health-targeted-history-versus-public-page-constraints-v1',
    objectives: ['MON02'],
    repeat: 'health',
    sources: ['MO04', 'MO05', 'MO16', 'MO30'],
    accepted: [[1, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md04: {
    family: 'health-unavailable-nonplatform-customer-stop',
    variant: 'health-unavailable-nonplatform-customer-stop-constraints-v1',
    objectives: ['MON02'],
    repeat: 'health',
    sources: ['MO06', 'MO16', 'MO30', 'MO31'],
    accepted: [[0, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md05: {
    family: 'monitor-management-audit-and-missing-resource-logs',
    variant: 'monitor-management-audit-and-missing-resource-logs-constraints-v1',
    objectives: ['MON03'],
    repeat: 'logs',
    sources: ['MO09', 'MO20', 'MO21', 'MO29', 'MO35'],
    accepted: [[1, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md06: {
    family: 'monitor-two-valid-correlated-investigation-views',
    variant: 'monitor-two-valid-correlated-investigation-views-constraints-v1',
    objectives: ['MON03'],
    repeat: 'insights',
    sources: ['MO10', 'MO13', 'MO25', 'MO28', 'MO36'],
    accepted: [
      [1, 0],
      [2, 0],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md07: {
    family: 'monitor-stateful-condition-versus-user-response',
    variant: 'monitor-stateful-condition-versus-user-response-constraints-v1',
    objectives: ['MON03'],
    repeat: 'alerts',
    sources: ['MO12', 'MO22', 'MO23', 'MO24'],
    accepted: [[1, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  md08: {
    family: 'monitor-query-is-not-a-rule-or-collection-proof',
    variant: 'monitor-query-is-not-a-rule-or-collection-proof-constraints-v1',
    objectives: ['MON03'],
    repeat: 'logs',
    sources: ['MO10', 'MO11', 'MO12', 'MO13', 'MO20', 'MO24'],
    accepted: [[1, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
} as const;
export type MonitoringItemId = keyof typeof monitoringItems;
export const monitoringItemIds = Object.keys(monitoringItems) as MonitoringItemId[];
export interface MonitoringAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateMonitoring(item: MonitoringItemId, answer: MonitoringAnswer) {
  const pairs: readonly (readonly [number, number])[] = monitoringItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`monitoring.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
export const monitoringRepeats: Record<MonitoringItemId, MonitoringTopic> = Object.fromEntries(
  monitoringItemIds.map((id) => [id, monitoringItems[id].repeat]),
) as Record<MonitoringItemId, MonitoringTopic>;
