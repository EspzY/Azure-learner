import type { ConnectivityTopic } from './connectivity';
const definition = (
  family: string,
  variant: string,
  objectives: ('CN01' | 'CN02' | 'CN03' | 'CN04')[],
  accepted: readonly (readonly [number, number])[],
  repeat: ConnectivityTopic,
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
/** Fixed original v1 relations. Later revised items must use a new version, never reinterpret firsts. */
export const connectivityItems = {
  nc01: definition('connectivity-vpn', 'roaming-client', ['CN01'], [[2, 1]], 'vpn', [
    'CS09',
    'CS11',
  ]),
  nc02: definition('connectivity-vpn', 'branch-network', ['CN01'], [[0, 2]], 'vpn', [
    'CS09',
    'CS10',
  ]),
  nc03: definition('connectivity-vpn', 'vnet-encryption', ['CN01'], [[1, 0]], 'vpn', [
    'CS09',
    'CS10',
  ]),
  nc04: definition(
    'connectivity-expressroute',
    'private-vs-microsoft-peering',
    ['CN02'],
    [[2, 0]],
    'expressroute',
    ['CS12', 'CS14'],
  ),
  nc05: definition(
    'connectivity-expressroute',
    'encryption-scope',
    ['CN02'],
    [[0, 1]],
    'expressroute',
    ['CS13'],
  ),
  nc06: definition('connectivity-expressroute', 'backup-scope', ['CN02'], [[1, 2]], 'hybrid', [
    'CS14',
    'CS15',
  ]),
  nc07: definition('connectivity-endpoint', 'public-source-gate', ['CN03'], [[1, 0]], 'endpoints', [
    'CS19',
    'CS20',
  ]),
  nc08: definition(
    'connectivity-endpoint',
    'parallel-partner-entry',
    ['CN03'],
    [[2, 2]],
    'endpoints',
    ['CS16', 'CS19', 'CS20'],
  ),
  nc09: definition('connectivity-endpoint', 'pending-approval', ['CN03'], [[0, 1]], 'endpoints', [
    'CS16',
  ]),
  nc10: definition(
    'connectivity-dns',
    'on-premises-resolution',
    ['CN04'],
    [[2, 1]],
    'private-dns',
    ['CS17', 'CS18'],
  ),
  nc11: definition('connectivity-dns', 'service-hostname', ['CN04'], [[1, 2]], 'private-dns', [
    'CS17',
    'CS19',
  ]),
  nc12: definition('connectivity-endpoint', 'target-subresource', ['CN03'], [[0, 0]], 'endpoints', [
    'CS16',
    'CS18',
    'CS19',
  ]),
} as const;
export type ConnectivityItemId = keyof typeof connectivityItems;
export const connectivityItemIds = Object.keys(connectivityItems) as ConnectivityItemId[];
export interface ConnectivityAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateConnectivity(item: ConnectivityItemId, answer: ConnectivityAnswer) {
  const pairs: readonly (readonly [number, number])[] = connectivityItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`connectivity.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
