import type { NetworkingTopic } from './networking';
const definition = (
  family: string,
  variant: string,
  objectives: ('NW01' | 'NW02' | 'NW03' | 'NW04')[],
  accepted: readonly (readonly [number, number])[],
  repeat: NetworkingTopic,
  sources: string[],
) => ({
  family,
  variant,
  objectives,
  accepted,
  repeat,
  sources,
  itemVersion: '1.0.0',
  rubricVersion: '1.0.0',
});
/** Original constrained decision/reason cases, not copied assessment-bank material. */
export const networkingItems = {
  nw01: definition('network-structure', 'scope', ['NW01'], [[1, 2]], 'vnet', ['NS06', 'NS07']),
  nw02: definition('network-structure', 'zones', ['NW01'], [[2, 0]], 'vnet', [
    'NS06',
    'NS07',
    'NS08',
  ]),
  nw03: definition('network-address', 'boundary', ['NW02'], [[0, 1]], 'addressing', ['NS08']),
  nw04: definition('network-address', 'capacity', ['NW02'], [[2, 2]], 'addressing', ['NS08']),
  nw05: definition('network-address', 'canonical', ['NW02'], [[1, 0]], 'addressing', ['NS08']),
  nw06: definition('network-peering', 'one-side', ['NW03'], [[0, 2]], 'peering', ['NS09', 'NS10']),
  nw07: definition(
    'network-peering',
    'migration',
    ['NW03'],
    [
      [0, 0],
      [2, 1],
    ],
    'peering',
    ['NS09', 'NS10', 'NS11'],
  ),
  nw08: definition('network-peering', 'restricted-subnet', ['NW03'], [[1, 0]], 'peering', ['NS11']),
  nw09: definition('network-dns', 'delegation', ['NW04'], [[2, 1]], 'dns', ['NS12', 'NS16']),
  nw10: definition('network-dns', 'alias', ['NW04'], [[0, 2]], 'dns', ['NS16']),
  nw11: definition('network-dns', 'custom-resolver', ['NW04'], [[1, 0]], 'dns', [
    'NS13',
    'NS14',
    'NS15',
    'NS17',
  ]),
  nw12: definition('network-dns', 'authorization', ['NW04'], [[0, 1]], 'explorer', [
    'NS06',
    'NS13',
    'NS14',
  ]),
} as const;
export type NetworkingItemId = keyof typeof networkingItems;
export const networkingItemIds = Object.keys(networkingItems) as NetworkingItemId[];
export interface NetworkingAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateNetworking(item: NetworkingItemId, answer: NetworkingAnswer) {
  const pairs: readonly (readonly [number, number])[] = networkingItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`networking.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
