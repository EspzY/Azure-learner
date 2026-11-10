/** Read-only route selection in the supported profile, not a packet/connection test. */
import { cidr, ipv4 } from '../v31/ip';
import { peeringStatus } from './peering';
import type { World } from './contract';

export type NextHop = 'VnetLocal' | 'VnetPeering' | 'Internet' | 'None';
export interface Candidate {
  id: string;
  addressPrefix: string;
  source: 'System' | 'User';
  nextHop: NextHop;
  resourceId: string | null;
  origin: string | null;
  matched: boolean;
  selected: boolean;
  reason: 'selected' | 'no-match' | 'shorter-prefix' | 'system-tie';
}
export interface Analysis {
  model: World['model'];
  revision: number;
  subnetId: string;
  destination: string;
  candidates: Candidate[];
  selected: Candidate;
  inactivePeerings: string[];
  traffic: 'not-evaluated';
}
export type AnalysisResult =
  | { ok: true; analysis: Analysis }
  | {
      ok: false;
      code:
        'invalid-source' | 'invalid-destination' | 'unsupported-destination' | 'ambiguous-routes';
    };
/** Microsoft's documented default routes, with no BGP or service-endpoint routes. */
export const defaults = [
  ['0.0.0.0/0', 'Internet'],
  ['10.0.0.0/8', 'None'],
  ['172.16.0.0/12', 'None'],
  ['192.168.0.0/16', 'None'],
  ['100.64.0.0/10', 'None'],
  ['157.59.0.0/16', 'None'],
  ['127.0.0.0/8', 'None'],
  ['104.147.0.0/16', 'None'],
  ['104.146.0.0/17', 'None'],
] as const;
const unmodelled = ['0.0.0.0/8', '127.0.0.0/8', '169.254.0.0/16', '224.0.0.0/4', '240.0.0.0/4'];
const includes = (prefix: string, ip: number) => {
  const block = cidr(prefix)!;
  return block.first <= ip && ip <= block.last;
};
export function analyseRoutes(world: World, subnetId: string, destination: string): AnalysisResult {
  const subnet = world.subnets.find((x) => x.id === subnetId);
  if (!subnet) return { ok: false, code: 'invalid-source' };
  const ip = ipv4(destination);
  if (ip === null) return { ok: false, code: 'invalid-destination' };
  // Azure's platform virtual IP bypasses UDR. Do not report a fabricated Internet route.
  if (destination === '168.63.129.16' || unmodelled.some((p) => includes(p, ip)))
    return { ok: false, code: 'unsupported-destination' };
  const vnet = world.vnets.find((x) => x.id === subnet.vnetId)!;
  const rows: Omit<Candidate, 'matched' | 'selected' | 'reason'>[] = defaults
    .filter(([p]) => p !== vnet.addressSpace)
    .map(([addressPrefix, nextHop]) => ({
      id: `default:${addressPrefix}`,
      addressPrefix,
      nextHop,
      source: 'System',
      resourceId: null,
      origin: null,
    }));
  rows.push({
    id: `local:${vnet.id}`,
    addressPrefix: vnet.addressSpace,
    nextHop: 'VnetLocal',
    source: 'System',
    resourceId: vnet.id,
    origin: vnet.origin,
  });
  const peerings = world.peerings.filter((p) => p.vnetId === vnet.id);
  for (const p of peerings.filter((p) => peeringStatus(world, p) === 'Connected')) {
    const remote = world.vnets.find((x) => x.id === p.remoteVnetId)!;
    rows.push({
      id: p.id,
      addressPrefix: remote.addressSpace,
      nextHop: 'VnetPeering',
      source: 'System',
      resourceId: remote.id,
      origin: p.origin,
    });
  }
  for (const route of world.routes.filter((x) => x.routeTableId === subnet.routeTableId))
    rows.push({
      id: route.id,
      addressPrefix: route.addressPrefix,
      nextHop: route.nextHopType,
      source: 'User',
      resourceId: route.routeTableId,
      origin: route.origin,
    });
  const candidatesInScope = rows.filter(
    (row) =>
      !row.id.startsWith('default:') ||
      !rows.some(
        (other) =>
          other.source === 'System' &&
          !other.id.startsWith('default:') &&
          other.addressPrefix === row.addressPrefix,
      ),
  );
  const matching = candidatesInScope.filter((x) => includes(x.addressPrefix, ip));
  // LPM precedes source priority. No BGP/endpoint exception is claimed by this model.
  matching.sort(
    (a, b) =>
      cidr(b.addressPrefix)!.prefix - cidr(a.addressPrefix)!.prefix ||
      Number(b.source === 'User') - Number(a.source === 'User') ||
      a.id.localeCompare(b.id, 'en'),
  );
  const winner = matching[0]!;
  if (
    matching.some(
      (row) =>
        row.id !== winner.id &&
        row.source === winner.source &&
        row.addressPrefix === winner.addressPrefix,
    )
  )
    return { ok: false, code: 'ambiguous-routes' };
  const candidates: Candidate[] = candidatesInScope.map((row) => ({
    ...row,
    matched: includes(row.addressPrefix, ip),
    selected: row.id === winner.id,
    reason:
      row.id === winner.id
        ? 'selected'
        : !includes(row.addressPrefix, ip)
          ? 'no-match'
          : cidr(row.addressPrefix)!.prefix < cidr(winner.addressPrefix)!.prefix
            ? 'shorter-prefix'
            : 'system-tie',
  }));
  return {
    ok: true,
    analysis: {
      model: world.model,
      revision: world.revision,
      subnetId,
      destination,
      candidates,
      selected: candidates.find((x) => x.selected)!,
      inactivePeerings: peerings
        .filter((p) => peeringStatus(world, p) !== 'Connected')
        .map((p) => p.id),
      traffic: 'not-evaluated',
    },
  };
}
