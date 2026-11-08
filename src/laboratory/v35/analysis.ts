/** Configuration-path inspection only. No packets, flow state, events or receipts. */
import { analyseRoutes as frozenRoutes, type RouteAnalysis as OldRoute } from '../v34/analysis';
import { analysePolicy as frozenPolicy } from '../v34/analysis';
import {
  evaluateLayer,
  addressMatch,
  port,
  type Packet,
  type PolicyInput,
  type PolicyAnalysis as OldPolicy,
} from '../v33/policy';
import { endpointProjection } from '../v34/projection';
import { computeProjection } from './projection';
import { firewallVnet, firewallReachable, subscription } from './topology';
import { laboratoryModel, type World } from './contract';
type OldCandidate = OldRoute['selected'];
export type Candidate = Omit<OldCandidate, 'nextHop'> & {
  nextHop: OldCandidate['nextHop'] | 'VirtualAppliance';
  firewallId: string | null;
  nextHopIp: string | null;
};
export type RouteAnalysis = Omit<OldRoute, 'model' | 'candidates' | 'selected'> & {
  model: typeof laboratoryModel;
  candidates: Candidate[];
  selected: Candidate;
};
export function analyseRoutes(world: World, subnetId: string, destination: string) {
  const result = frozenRoutes(computeProjection(world), subnetId, destination);
  if (!result.ok) return result;
  const lift = (row: OldCandidate): Candidate => {
    const r = world.routes.find((r) => r.id === row.id);
    return {
      ...row,
      nextHop: r?.nextHopType === 'VirtualAppliance' ? 'VirtualAppliance' : row.nextHop,
      firewallId: r?.nextHopType === 'VirtualAppliance' ? r.firewallId : null,
      nextHopIp: r?.nextHopType === 'VirtualAppliance' ? r.nextHopIp : null,
    };
  };
  const candidates = result.analysis.candidates.map(lift);
  return {
    ok: true as const,
    analysis: {
      ...result.analysis,
      model: laboratoryModel,
      candidates,
      selected: candidates.find((r) => r.selected)!,
    } satisfies RouteAnalysis,
  };
}
export interface FirewallTrace {
  groupId: string;
  groupPriority: number;
  collectionId: string;
  collectionPriority: number;
  action: 'Allow' | 'Deny';
  ruleId: string;
  matched: boolean;
  checks: { source: boolean; destination: boolean; protocol: boolean; destinationPort: boolean };
}
export interface FirewallDecision {
  policyId: string;
  status: 'allow' | 'deny' | 'undetermined';
  reason: 'first-rule' | 'default-deny' | 'missing-policy';
  matchedRuleId: string | null;
  collectionId: string | null;
  groupId: string | null;
  trace: FirewallTrace[];
}
/** Only the supported literal expressions reach this evaluator. Reuse the same
 * address/port parser as NSG; collection action is the terminating decision. */
export function evaluateFirewallPolicy(
  world: World,
  policyId: string,
  packet: Packet,
): FirewallDecision {
  const decision: FirewallDecision = {
    policyId,
    status: 'undetermined',
    reason: 'missing-policy',
    matchedRuleId: null,
    collectionId: null,
    groupId: null,
    trace: [],
  };
  if (!world.firewallPolicies.some((p) => p.id === policyId)) return decision;
  const projected = endpointProjection(computeProjection(world));
  decision.status = 'deny';
  decision.reason = 'default-deny';
  for (const group of world.firewallGroups
    .filter((g) => g.policyId === policyId)
    .toSorted((a, b) => a.priority - b.priority))
    for (const collection of world.firewallCollections
      .filter((c) => c.collectionGroupId === group.id)
      .toSorted((a, b) => a.priority - b.priority))
      for (const rule of world.firewallRules.filter((r) => r.collectionId === collection.id)) {
        const checks = {
          source: addressMatch(projected, '', rule.source, packet.sourceIp).result === 'match',
          destination:
            addressMatch(projected, '', rule.destination, packet.destinationIp).result === 'match',
          protocol: rule.protocol === packet.protocol,
          destinationPort:
            rule.destinationPort === '*' || port(rule.destinationPort) === packet.destinationPort,
        };
        const matched = Object.values(checks).every(Boolean);
        decision.trace.push({
          groupId: group.id,
          groupPriority: group.priority,
          collectionId: collection.id,
          collectionPriority: collection.priority,
          action: collection.action,
          ruleId: rule.id,
          matched,
          checks,
        });
        if (matched)
          return {
            ...decision,
            status: collection.action === 'Allow' ? 'allow' : 'deny',
            reason: 'first-rule',
            matchedRuleId: rule.id,
            collectionId: collection.id,
            groupId: group.id,
          };
      }
  return decision;
}
export interface FirewallPath {
  disposition:
    | 'allowed-via-firewall'
    | 'denied-by-firewall'
    | 'denied-by-nsg'
    | 'routing-drop'
    | 'bypasses-firewall'
    | 'incomplete';
  configurationPathAssessed: boolean;
  firewallId: string | null;
  policyId: string | null;
  forwardRoute: RouteAnalysis | null;
  nextHopRoute: RouteAnalysis | null;
  nextHopError: string | null;
  returnNextHopRoute: RouteAnalysis | null;
  returnNextHopError: string | null;
  onwardRoute: RouteAnalysis | null;
  returnRoute: RouteAnalysis | null;
  hubReturnRoute: RouteAnalysis | null;
  receivingPeerings: {
    id: string;
    direction: 'forward' | 'return';
    allowForwardedTraffic: boolean;
  }[];
  decision: FirewallDecision | null;
}
export type PolicyAnalysis = Omit<OldPolicy, 'model' | 'route' | 'reason'> & {
  model: typeof laboratoryModel;
  route: RouteAnalysis | null;
  reason: string;
  firewallPath: FirewallPath;
};
export function analysePolicy(world: World, input: PolicyInput) {
  const validation = frozenPolicy(computeProjection(world), input);
  if (!validation.ok) return validation;
  const old = validation.analysis,
    source = world.nics.find((n) => n.id === input.sourceNicId)!,
    destination = world.nics.find((n) => n.id === input.destinationNicId)!;
  const route = analyseRoutes(world, source.subnetId, destination.privateIpAddress);
  const path: FirewallPath = {
    disposition: 'incomplete',
    configurationPathAssessed: false,
    firewallId: null,
    policyId: null,
    forwardRoute: route.ok ? route.analysis : null,
    nextHopRoute: null,
    nextHopError: null,
    returnNextHopRoute: null,
    returnNextHopError: null,
    onwardRoute: null,
    returnRoute: null,
    hubReturnRoute: null,
    receivingPeerings: [],
    decision: null,
  };
  const a: PolicyAnalysis = {
    ...old,
    model: laboratoryModel,
    route: route.ok ? route.analysis : null,
    layers: old.layers.map((l) => ({
      ...l,
      status: 'not-evaluated',
      reason: 'routing',
      matchedRuleId: null,
      uncertainRuleId: null,
      rules: [],
    })),
    status: 'undetermined',
    reason: 'route-undetermined',
    firewallPath: path,
  };
  const finish = (reason: string) => {
    a.reason = reason;
    return { ok: true as const, analysis: a };
  };
  if (source.id === destination.id) return finish('self-endpoint-unsupported');
  if (!route.ok) return finish(route.code);
  if (route.analysis.selected.nextHop === 'None') {
    a.status = 'dropped-by-modeled-routing';
    path.disposition = 'routing-drop';
    return finish('source-route-none');
  }
  if (route.analysis.selected.nextHop !== 'VirtualAppliance') {
    a.layers = old.layers;
    a.status = old.status;
    path.disposition = 'bypasses-firewall';
    return finish('route-bypasses-firewall');
  }
  const selected = route.analysis.selected,
    fw = world.firewalls.find((f) => f.id === selected.firewallId);
  if (!fw || selected.nextHopIp !== fw.privateIpAddress)
    return finish('firewall-next-hop-unverifiable');
  path.firewallId = fw.id;
  path.policyId = fw.policyId;
  const s = world.subnets.find((s) => s.id === source.subnetId)!,
    d = world.subnets.find((s) => s.id === destination.subnetId)!,
    hub = firewallVnet(world, fw);
  if (!hub || s.vnetId === d.vnetId || d.vnetId === hub || !firewallReachable(world, fw, s.id))
    return finish('unsupported-firewall-topology');
  const dv = world.vnets.find((v) => v.id === d.vnetId)!;
  if (
    dv.region !== fw.region ||
    subscription(world, dv.groupId) !== subscription(world, fw.groupId)
  )
    return finish('unsupported-firewall-scope');
  // A stored inventory ID cannot disambiguate an IP-based next hop. This profile
  // requires an unambiguous selected direct peering to that exact hub. It does
  // not implement Azure's complete next-hop resolution/recursive routing.
  const nextHop = analyseRoutes(world, s.id, fw.privateIpAddress);
  path.nextHopRoute = nextHop.ok ? nextHop.analysis : null;
  path.nextHopError = nextHop.ok ? null : nextHop.code;
  if (
    !nextHop.ok ||
    nextHop.analysis.selected.nextHop !== 'VnetPeering' ||
    nextHop.analysis.selected.resourceId !== hub
  )
    return finish('firewall-next-hop-not-direct');
  const projected = endpointProjection(computeProjection(world));
  const layers = (from: number, to: number): boolean => {
    for (let i = from; i < to; i++) {
      const layer = evaluateLayer(projected, a.layers[i]!, a.packet);
      a.layers[i] = layer;
      if (layer.status === 'deny' || layer.status === 'undetermined') {
        a.layers = a.layers.map((later, index) =>
          index > i ? { ...later, reason: 'earlier-layer' } : later,
        );
      }
      if (layer.status === 'deny') {
        a.status = 'denied-by-modeled-network-policy';
        path.disposition = 'denied-by-nsg';
        a.reason = 'nsg-denied';
        return false;
      }
      if (layer.status === 'undetermined') {
        a.reason = 'nsg-undetermined';
        return false;
      }
    }
    return true;
  };
  if (!layers(0, 2)) return { ok: true as const, analysis: a };
  const decision = evaluateFirewallPolicy(world, fw.policyId, a.packet);
  path.decision = decision;
  if (decision.status === 'undetermined') return finish('firewall-policy-unverifiable');
  if (decision.status === 'deny') {
    a.layers = a.layers.map((l, index) => (index > 1 ? { ...l, reason: 'earlier-layer' } : l));
    a.status = 'denied-by-modeled-network-policy';
    path.disposition = 'denied-by-firewall';
    return finish(decision.reason === 'default-deny' ? 'firewall-default-deny' : 'firewall-denied');
  }
  const onward = analyseRoutes(world, fw.subnetId, destination.privateIpAddress);
  path.onwardRoute = onward.ok ? onward.analysis : null;
  if (!onward.ok) return finish('onward-route-undetermined');
  if (onward.analysis.selected.nextHop === 'None') {
    a.status = 'dropped-by-modeled-routing';
    path.disposition = 'routing-drop';
    return finish('onward-route-none');
  }
  if (
    onward.analysis.selected.nextHop !== 'VnetPeering' ||
    onward.analysis.selected.resourceId !== d.vnetId
  )
    return finish('onward-endpoint-mismatch');
  const receiving = world.peerings.find((p) => p.vnetId === d.vnetId && p.remoteVnetId === hub);
  if (!receiving) return finish('destination-peering-missing');
  path.receivingPeerings.push({
    id: receiving.id,
    direction: 'forward',
    allowForwardedTraffic: receiving.allowForwardedTraffic,
  });
  if (!receiving.allowForwardedTraffic) return finish('destination-forwarding-disabled');
  if (!layers(2, 4)) return { ok: true as const, analysis: a };
  const back = analyseRoutes(world, d.id, source.privateIpAddress);
  path.returnRoute = back.ok ? back.analysis : null;
  if (!back.ok) return finish('return-route-undetermined');
  if (
    back.analysis.selected.nextHop !== 'VirtualAppliance' ||
    back.analysis.selected.firewallId !== fw.id ||
    back.analysis.selected.nextHopIp !== fw.privateIpAddress
  )
    return finish('return-route-not-same-firewall');
  if (!firewallReachable(world, fw, d.id)) return finish('return-firewall-unreachable');
  const returnNextHop = analyseRoutes(world, d.id, fw.privateIpAddress);
  path.returnNextHopRoute = returnNextHop.ok ? returnNextHop.analysis : null;
  path.returnNextHopError = returnNextHop.ok ? null : returnNextHop.code;
  if (
    !returnNextHop.ok ||
    returnNextHop.analysis.selected.nextHop !== 'VnetPeering' ||
    returnNextHop.analysis.selected.resourceId !== hub
  )
    return finish('return-firewall-next-hop-not-direct');
  const hubBack = analyseRoutes(world, fw.subnetId, source.privateIpAddress);
  path.hubReturnRoute = hubBack.ok ? hubBack.analysis : null;
  if (!hubBack.ok) return finish('hub-return-undetermined');
  if (
    hubBack.analysis.selected.nextHop !== 'VnetPeering' ||
    hubBack.analysis.selected.resourceId !== s.vnetId
  )
    return finish('hub-return-endpoint-mismatch');
  const sourceReceiver = world.peerings.find(
    (p) => p.vnetId === s.vnetId && p.remoteVnetId === hub,
  );
  if (!sourceReceiver) return finish('source-peering-missing');
  path.receivingPeerings.push({
    id: sourceReceiver.id,
    direction: 'return',
    allowForwardedTraffic: sourceReceiver.allowForwardedTraffic,
  });
  if (!sourceReceiver.allowForwardedTraffic) return finish('source-forwarding-disabled');
  a.status = 'allowed-by-modeled-network-policy';
  path.disposition = 'allowed-via-firewall';
  path.configurationPathAssessed = true;
  return finish('modeled-configuration-path-assessed');
}
