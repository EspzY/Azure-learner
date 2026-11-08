/** Reuses the original LPM/NSG/Firewall engines. Access changes are separately
 * exposed as conservative path preconditions, never invented effective routes. */
import * as previous from '../v36/analysis';
import type { PolicyInput } from '../v33/policy';
import { cidr, ipv4 } from '../v31/ip';
import { remediationProjection } from './projection';
import { laboratoryModel, type World } from './contract';
export type AccessCheck = {
  peeringId: string;
  localVnetId: string;
  remoteVnetId: string;
  allowVirtualNetworkAccess: boolean;
  allowForwardedTraffic: boolean;
  accessOrigin: string | null;
};
const checks = (world: World, ids: string[]): AccessCheck[] => {
  const selected = world.peerings.filter((p) => ids.includes(p.id));
  return world.peerings
    .filter((p) =>
      selected.some(
        (s) => s.id === p.id || (s.vnetId === p.remoteVnetId && s.remoteVnetId === p.vnetId),
      ),
    )
    .map((p) => ({
      peeringId: p.id,
      localVnetId: p.vnetId,
      remoteVnetId: p.remoteVnetId,
      allowVirtualNetworkAccess: p.allowVirtualNetworkAccess,
      allowForwardedTraffic: p.allowForwardedTraffic,
      accessOrigin: p.accessOrigin,
    }));
};
export type RouteAnalysis = Omit<previous.RouteAnalysis, 'model'> & {
  model: typeof laboratoryModel;
  accessChecks: AccessCheck[];
  accessEvaluation: 'enabled' | 'undetermined' | 'not-required';
};
const lift = (world: World, r: previous.RouteAnalysis | null): RouteAnalysis | null => {
  if (!r) return null;
  const access = checks(world, r.selected.nextHop === 'VnetPeering' ? [r.selected.id] : []);
  return {
    ...r,
    model: laboratoryModel,
    accessChecks: access,
    accessEvaluation: access.some((p) => !p.allowVirtualNetworkAccess)
      ? 'undetermined'
      : access.length
        ? 'enabled'
        : 'not-required',
  };
};
export function analyseRoutes(world: World, subnetId: string, destination: string) {
  const r = previous.analyseRoutes(remediationProjection(world), subnetId, destination);
  return r.ok ? { ok: true as const, analysis: lift(world, r.analysis)! } : r;
}
type RouteKey =
  | 'forwardRoute'
  | 'nextHopRoute'
  | 'returnNextHopRoute'
  | 'onwardRoute'
  | 'returnRoute'
  | 'hubReturnRoute';
export type FirewallPath = Omit<previous.FirewallPath, RouteKey> &
  Record<RouteKey, RouteAnalysis | null>;
export type PolicyAnalysis = Omit<previous.PolicyAnalysis, 'model' | 'route' | 'firewallPath'> & {
  model: typeof laboratoryModel;
  route: RouteAnalysis | null;
  firewallPath: FirewallPath;
  accessChecks: AccessCheck[];
  accessEvaluation: 'enabled' | 'undetermined' | 'not-required';
  virtualNetworkTagScope: 'original-enabled-profile' | 'undetermined-disabled-peering';
};
export function analysePolicy(world: World, input: PolicyInput) {
  const r = previous.analysePolicy(remediationProjection(world), input);
  if (!r.ok) return r;
  const old = r.analysis,
    p = old.firewallPath;
  const routes = [
    old.route,
    p.forwardRoute,
    p.nextHopRoute,
    p.returnNextHopRoute,
    p.onwardRoute,
    p.returnRoute,
    p.hubReturnRoute,
  ];
  // A peering need not be the selected route to contribute positive membership
  // to a default VirtualNetwork rule. Treat only actually evaluated tag fields
  // whose address falls in a disabled remote range as uncertain; literal custom
  // matches do not acquire a dependency on unrelated peerings.
  const tagPeerings = world.peerings.filter((peer) => {
    const remote = world.vnets.find((v) => v.id === peer.remoteVnetId),
      block = remote && cidr(remote.addressSpace);
    const reverse = world.peerings.find(
      (q) => q.vnetId === peer.remoteVnetId && q.remoteVnetId === peer.vnetId,
    );
    if (!block || (peer.allowVirtualNetworkAccess && reverse?.allowVirtualNetworkAccess !== false))
      return false;
    return old.layers.some(
      (layer) =>
        layer.vnetId === peer.vnetId &&
        layer.rules.some(
          (rule) =>
            (rule.result === 'match' || rule.result === 'unknown') &&
            (['source', 'destination'] as const).some((field) => {
              if (rule[field] !== 'VirtualNetwork') return false;
              const ip = ipv4(field === 'source' ? old.packet.sourceIp : old.packet.destinationIp);
              return ip !== null && block.first <= ip && ip <= block.last;
            }),
        ),
    );
  });
  const access = checks(world, [
    ...routes.flatMap((x) => (x?.selected.nextHop === 'VnetPeering' ? [x.selected.id] : [])),
    ...tagPeerings.map((p) => p.id),
  ]);
  const blocked = access.some((p) => !p.allowVirtualNetworkAccess);
  const a: PolicyAnalysis = {
    ...old,
    model: laboratoryModel,
    route: lift(world, old.route),
    accessChecks: access,
    accessEvaluation: blocked ? 'undetermined' : access.length ? 'enabled' : 'not-required',
    virtualNetworkTagScope: blocked ? 'undetermined-disabled-peering' : 'original-enabled-profile',
    firewallPath: {
      ...p,
      forwardRoute: lift(world, p.forwardRoute),
      nextHopRoute: lift(world, p.nextHopRoute),
      returnNextHopRoute: lift(world, p.returnNextHopRoute),
      onwardRoute: lift(world, p.onwardRoute),
      returnRoute: lift(world, p.returnRoute),
      hubReturnRoute: lift(world, p.hubReturnRoute),
    },
  };
  if (blocked) {
    a.status = 'undetermined';
    a.reason = 'peering-access-disabled-or-return-unresolved';
    a.firewallPath.disposition = 'incomplete';
    a.firewallPath.configurationPathAssessed = false;
    a.firewallPath.decision = null;
    a.layers = a.layers.map((l) => ({
      ...l,
      status: 'not-evaluated',
      reason: 'unsupported-path',
      matchedRuleId: null,
      uncertainRuleId: null,
      rules: [],
    }));
  }
  return { ok: true as const, analysis: a };
}
