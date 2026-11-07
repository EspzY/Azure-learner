/** Hypothetical new-initiation policy projection. No packets, state table or writes. */
import { ipv4, cidr } from '../v31/ip';
import { defaultRules } from '../v31/default-rules';
import { peeringStatus } from '../v32/peering';
import { routingProjection } from './projection';
import { analyseRoutes, type RouteAnalysis } from './route';
import { laboratoryModel, type World } from './contract';
export type Match = 'match' | 'no-match' | 'unknown';
export type Field = 'protocol' | 'source' | 'destination' | 'sourcePort' | 'destinationPort';
export type Check = {
  field: Field;
  result: Match;
  reason:
    | 'literal-match'
    | 'literal-mismatch'
    | 'known-virtual-network-member'
    | 'virtual-network-tag-incomplete'
    | 'internet-tag-unsupported'
    | 'platform-probe-unsupported'
    | 'expression-unsupported';
};
export type Packet = {
  sourceIp: string;
  destinationIp: string;
  protocol: 'Tcp' | 'Udp';
  sourcePort: number;
  destinationPort: number;
};
export interface PolicyRule {
  id: string;
  name: string;
  priority: number;
  direction: 'Inbound' | 'Outbound';
  protocol: 'Tcp' | 'Udp' | '*';
  source: string;
  destination: string;
  sourcePort: string;
  destinationPort: string;
  access: 'Allow' | 'Deny';
  kind: 'custom' | 'default';
  origin: string | null;
}
export type RuleTrace = PolicyRule & { result: Match | 'not-evaluated'; checks: Check[] };
export type LayerId =
  | 'source-nic-outbound'
  | 'source-subnet-outbound'
  | 'destination-subnet-inbound'
  | 'destination-nic-inbound';
export interface Layer {
  id: LayerId;
  resourceId: string;
  vnetId: string;
  direction: 'Inbound' | 'Outbound';
  nsgId: string | null;
  associationOrigin: string | null;
  status: 'allow' | 'deny' | 'undetermined' | 'not-associated' | 'not-evaluated';
  reason:
    | 'first-rule'
    | 'unknown-rule'
    | 'no-association'
    | 'earlier-layer'
    | 'routing'
    | 'unsupported-path'
    | 'missing-attachment';
  matchedRuleId: string | null;
  uncertainRuleId: string | null;
  rules: RuleTrace[];
}
export type Status =
  | 'allowed-by-modeled-network-policy'
  | 'denied-by-modeled-network-policy'
  | 'dropped-by-modeled-routing'
  | 'undetermined';
export interface PolicyAnalysis {
  model: typeof laboratoryModel;
  revision: number;
  scope: 'hypothetical-new-initiation';
  traffic: 'not-sent';
  connectivity: 'not-verified';
  sourceNicId: string;
  destinationNicId: string;
  sourceSubnetId: string;
  destinationSubnetId: string;
  packet: Packet;
  route: RouteAnalysis | null;
  routeError: string | null;
  layers: Layer[];
  status: Status;
  reason:
    | 'all-layers-allow'
    | 'denied-rule'
    | 'unknown-rule'
    | 'route-none'
    | 'route-undetermined'
    | 'unsupported-path'
    | 'self-endpoint-unsupported';
}
export const port = (value: string): number | null =>
  /^(0|[1-9][0-9]{0,4})$/.test(value) && Number(value) <= 65535 ? Number(value) : null;
/** Only guaranteed positive tag membership is inferred; unknown is never a private/public guess. */
export function addressMatch(
  world: World,
  vnetId: string,
  expression: string,
  ip: string,
): Omit<Check, 'field'> {
  const literal = (matches: boolean) => ({
    result: matches ? ('match' as const) : ('no-match' as const),
    reason: matches ? ('literal-match' as const) : ('literal-mismatch' as const),
  });
  if (expression === '*') return literal(true);
  if (ipv4(expression) !== null) return literal(ip === expression);
  const block = cidr(expression),
    value = ipv4(ip);
  if (block && value !== null) return literal(block.first <= value && value <= block.last);
  if (expression === 'Internet') return { result: 'unknown', reason: 'internet-tag-unsupported' };
  if (expression === 'AzureLoadBalancer')
    return { result: 'unknown', reason: 'platform-probe-unsupported' };
  if (expression === 'VirtualNetwork') {
    const local = world.vnets.find((v) => v.id === vnetId),
      projected = routingProjection(world);
    const ranges = [
      ...(local ? [local.addressSpace] : []),
      ...world.peerings
        .filter((p) => p.vnetId === vnetId && peeringStatus(projected, p) === 'Connected')
        .flatMap((p) =>
          world.vnets.filter((v) => v.id === p.remoteVnetId).map((v) => v.addressSpace),
        ),
    ];
    const known =
      value !== null &&
      ranges.some((prefix) => {
        const range = cidr(prefix)!;
        return range.first <= value && value <= range.last;
      });
    return known
      ? { result: 'match', reason: 'known-virtual-network-member' }
      : { result: 'unknown', reason: 'virtual-network-tag-incomplete' };
  }
  return { result: 'unknown', reason: 'expression-unsupported' };
}
function rulesFor(world: World, nsgId: string, direction: Layer['direction']): PolicyRule[] {
  return [
    ...world.securityRules
      .filter((r) => r.nsgId === nsgId && r.direction === direction)
      .map((r) => ({ ...r, kind: 'custom' as const })),
    ...defaultRules
      .filter((r) => r[1] === direction)
      .map((r) => ({
        id: `default:${nsgId}:${r[0]}`,
        name: r[0],
        direction: r[1],
        priority: r[2],
        protocol: '*' as const,
        source: r[3],
        destination: r[4],
        sourcePort: '*',
        destinationPort: '*',
        access: r[5],
        kind: 'default' as const,
        origin: null,
      })),
  ].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id, 'en'));
}
export function evaluateLayer(world: World, layer: Layer, packet: Packet): Layer {
  if (!layer.nsgId) return { ...layer, status: 'not-associated', reason: 'no-association' };
  if (!world.nsgs.some((x) => x.id === layer.nsgId))
    return { ...layer, status: 'undetermined', reason: 'missing-attachment' };
  const rules = rulesFor(world, layer.nsgId, layer.direction),
    traces: RuleTrace[] = [];
  let status: Layer['status'] = 'undetermined',
    matchedRuleId: string | null = null,
    uncertainRuleId: string | null = null,
    stopped = false;
  const scalar = (field: Field, matches: boolean): Check => ({
    field,
    result: matches ? 'match' : 'no-match',
    reason: matches ? 'literal-match' : 'literal-mismatch',
  });
  for (const rule of rules) {
    if (stopped) {
      traces.push({ ...rule, result: 'not-evaluated', checks: [] });
      continue;
    }
    const checks: Check[] = [
      scalar('protocol', rule.protocol === '*' || rule.protocol === packet.protocol),
      { field: 'source', ...addressMatch(world, layer.vnetId, rule.source, packet.sourceIp) },
      {
        field: 'destination',
        ...addressMatch(world, layer.vnetId, rule.destination, packet.destinationIp),
      },
      scalar('sourcePort', rule.sourcePort === '*' || port(rule.sourcePort) === packet.sourcePort),
      scalar(
        'destinationPort',
        rule.destinationPort === '*' || port(rule.destinationPort) === packet.destinationPort,
      ),
    ];
    const result: Match = checks.some((c) => c.result === 'no-match')
      ? 'no-match'
      : checks.some((c) => c.result === 'unknown')
        ? 'unknown'
        : 'match';
    traces.push({ ...rule, result, checks });
    if (result === 'match') {
      status = rule.access === 'Allow' ? 'allow' : 'deny';
      matchedRuleId = rule.id;
      stopped = true;
    }
    if (result === 'unknown') {
      status = 'undetermined';
      uncertainRuleId = rule.id;
      stopped = true;
    }
  }
  return {
    ...layer,
    status,
    reason: uncertainRuleId ? 'unknown-rule' : 'first-rule',
    matchedRuleId,
    uncertainRuleId,
    rules: traces,
  };
}
export type PolicyInput = {
  sourceNicId: string;
  destinationNicId: string;
  protocol: string;
  sourcePort: string;
  destinationPort: string;
};
export type PolicyResult =
  | { ok: true; analysis: PolicyAnalysis }
  | {
      ok: false;
      code:
        'invalid-source-nic' | 'invalid-destination-nic' | 'unsupported-protocol' | 'invalid-port';
    };
export function analysePolicy(world: World, input: PolicyInput): PolicyResult {
  const source = world.nics.find((n) => n.id === input.sourceNicId),
    destination = world.nics.find((n) => n.id === input.destinationNicId);
  if (!source) return { ok: false, code: 'invalid-source-nic' };
  if (!destination) return { ok: false, code: 'invalid-destination-nic' };
  if (!['Tcp', 'Udp'].includes(input.protocol)) return { ok: false, code: 'unsupported-protocol' };
  const sourcePort = port(input.sourcePort),
    destinationPort = port(input.destinationPort);
  if (sourcePort === null || destinationPort === null) return { ok: false, code: 'invalid-port' };
  const sourceSubnet = world.subnets.find((x) => x.id === source.subnetId)!,
    destinationSubnet = world.subnets.find((x) => x.id === destination.subnetId)!;
  const route = analyseRoutes(world, sourceSubnet.id, destination.privateIpAddress);
  const analysis: PolicyAnalysis = {
    model: laboratoryModel,
    revision: world.revision,
    scope: 'hypothetical-new-initiation',
    traffic: 'not-sent',
    connectivity: 'not-verified',
    sourceNicId: source.id,
    destinationNicId: destination.id,
    sourceSubnetId: sourceSubnet.id,
    destinationSubnetId: destinationSubnet.id,
    packet: {
      sourceIp: source.privateIpAddress,
      destinationIp: destination.privateIpAddress,
      protocol: input.protocol as Packet['protocol'],
      sourcePort,
      destinationPort,
    },
    route: route.ok ? route.analysis : null,
    routeError: route.ok ? null : route.code,
    layers: [],
    status: 'undetermined',
    reason: 'route-undetermined',
  };
  const layer = (
    id: LayerId,
    resourceId: string,
    vnetId: string,
    direction: Layer['direction'],
    nsgId: string | null,
    associationOrigin: string | null,
  ): Layer => ({
    id,
    resourceId,
    vnetId,
    direction,
    nsgId,
    associationOrigin,
    status: 'not-evaluated',
    reason: 'routing',
    matchedRuleId: null,
    uncertainRuleId: null,
    rules: [],
  });
  analysis.layers = [
    layer(
      'source-nic-outbound',
      source.id,
      sourceSubnet.vnetId,
      'Outbound',
      source.nsgId,
      source.associationOrigin,
    ),
    layer(
      'source-subnet-outbound',
      sourceSubnet.id,
      sourceSubnet.vnetId,
      'Outbound',
      sourceSubnet.nsgId,
      sourceSubnet.associationOrigin,
    ),
    layer(
      'destination-subnet-inbound',
      destinationSubnet.id,
      destinationSubnet.vnetId,
      'Inbound',
      destinationSubnet.nsgId,
      destinationSubnet.associationOrigin,
    ),
    layer(
      'destination-nic-inbound',
      destination.id,
      destinationSubnet.vnetId,
      'Inbound',
      destination.nsgId,
      destination.associationOrigin,
    ),
  ];
  if (source.id === destination.id) {
    analysis.reason = 'self-endpoint-unsupported';
    return { ok: true, analysis };
  }
  if (!route.ok) return { ok: true, analysis };
  if (route.analysis.selected.nextHop === 'None') {
    analysis.status = 'dropped-by-modeled-routing';
    analysis.reason = 'route-none';
    return { ok: true, analysis };
  }
  const supported =
    (route.analysis.selected.nextHop === 'VnetLocal' &&
      sourceSubnet.vnetId === destinationSubnet.vnetId) ||
    (route.analysis.selected.nextHop === 'VnetPeering' &&
      route.analysis.selected.resourceId === destinationSubnet.vnetId);
  if (!supported) {
    analysis.reason = 'unsupported-path';
    analysis.layers = analysis.layers.map((l) => ({ ...l, reason: 'unsupported-path' }));
    return { ok: true, analysis };
  }
  let stopped = false;
  analysis.layers = analysis.layers.map((l) => {
    if (stopped) return { ...l, reason: 'earlier-layer' };
    const evaluated = evaluateLayer(world, l, analysis.packet);
    if (evaluated.status === 'deny') {
      analysis.status = 'denied-by-modeled-network-policy';
      analysis.reason = 'denied-rule';
      stopped = true;
    }
    if (evaluated.status === 'undetermined') {
      analysis.status = 'undetermined';
      analysis.reason = 'unknown-rule';
      stopped = true;
    }
    return evaluated;
  });
  if (!stopped) {
    analysis.status = 'allowed-by-modeled-network-policy';
    analysis.reason = 'all-layers-allow';
  }
  return { ok: true, analysis };
}
