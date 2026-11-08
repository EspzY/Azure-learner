import * as previous from '../v36/domain';
import type * as P from '../v36/contract';
import { limits } from '../v3/contract';
import { remediationProjection } from './projection';
import {
  laboratoryModel,
  topologyFields,
  type World,
  type Request,
  type Receipt,
  type Entry,
  type TopologyChange,
} from './contract';
export const canonical = previous.canonical;
export const parseRequest = (value: unknown): Request | null =>
  previous.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({
  ...previous.freshWorld(),
  model: laboratoryModel,
  peerings: [],
});
/** Return actual records, not the validator-only projection's enabled flags. */
export const resources = (w: World) =>
  previous
    .resources(remediationProjection(w))
    .map((r) => w.peerings.find((p) => p.id === r.id) ?? r);
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command,
    type = c.type,
    raw = c as unknown as Record<string, string>;
  const r: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType:
      type === 'UpdateRoute'
        ? 'Microsoft.Network/routeTables/routes'
        : type === 'DisassociateSubnetNsg'
          ? 'Microsoft.Network/virtualNetworks/subnets'
          : type === 'SetPeeringVirtualNetworkAccess'
            ? 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings'
            : 'local/workspace',
    scopeId: raw.routeTableId ?? raw.subnetId ?? raw.vnetId ?? '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-topology-lifecycle@3.7',
    addedIds: [],
    removedIds: [],
    updatedIds: [],
    beforeCount: resources(world).length,
    afterCount: resources(world).length,
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({
    world,
    receipt: { ...r, code, outcome, ...(field !== undefined ? { field } : {}) },
  });
  if (request.expectedRevision !== world.revision) {
    if (Object.hasOwn(topologyFields, type) || Object.hasOwn(c, '')) return deny('stale-revision');
  }
  // Empty unknown keys fooled older truthiness checks. New epoch rejects them
  // deterministically before any inherited handler; old files/data stay frozen.
  if (Object.hasOwn(c, '')) return deny('unsupported-field', '', 'unsupported');
  if (!Object.hasOwn(topologyFields, type)) {
    const result = previous.execute(remediationProjection(world), request as P.Request, sequence);
    return {
      world:
        result.receipt.outcome !== 'accepted'
          ? world
          : {
              ...result.world,
              model: laboratoryModel,
              peerings: result.world.peerings.map((p) => {
                const old = world.peerings.find((x) => x.id === p.id);
                return {
                  ...p,
                  allowVirtualNetworkAccess: old?.allowVirtualNetworkAccess ?? true,
                  accessOrigin: old?.accessOrigin ?? null,
                };
              }),
            },
      receipt: result.receipt,
    };
  }
  const allowed = [
    ...topologyFields[type as keyof typeof topologyFields],
    ...(type === 'UpdateRoute' && raw.nextHopType === 'VirtualAppliance'
      ? ['firewallId', 'nextHopIp']
      : []),
  ];
  const extra = Object.keys(c)
    .sort()
    .find((k) => !allowed.includes(k));
  if (extra !== undefined) return deny('unsupported-field', extra, 'unsupported');
  if (allowed.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  const next = structuredClone(world);
  let change: TopologyChange;
  if (c.type === 'UpdateRoute') {
    const route = world.routes.find((x) => x.id === c.routeId),
      table = world.routeTables.find((x) => x.id === c.routeTableId);
    if (!route || !table) return deny('invalid-parent', !route ? 'routeId' : 'routeTableId');
    if (route.routeTableId !== table.id) return deny('incompatible-association', 'routeTableId');
    const group = world.groups.find((g) => g.id === table.groupId);
    if (!group) return deny('invalid-parent', 'routeTableId');
    r.location = table.region as Receipt['location'];
    const projected = remediationProjection(world);
    projected.routes = projected.routes.filter((x) => x.id !== route.id);
    const command: P.Command =
      c.nextHopType === 'VirtualAppliance'
        ? {
            type: 'CreateFirewallRoute',
            routeTableId: table.id,
            name: route.name,
            addressPrefix: c.addressPrefix,
            firewallId: c.firewallId!,
            nextHopIp: c.nextHopIp!,
          }
        : {
            type: 'CreateRoute',
            routeTableId: table.id,
            name: route.name,
            addressPrefix: c.addressPrefix,
            nextHopType: c.nextHopType,
          };
    const proposal = previous.execute(projected, { ...request, command }, sequence);
    if (proposal.receipt.outcome !== 'accepted')
      return deny(proposal.receipt.code, proposal.receipt.field, proposal.receipt.outcome);
    for (const s of world.subnets.filter((s) => s.routeTableId === table.id)) {
      const vnet = world.vnets.find((v) => v.id === s.vnetId),
        vg = world.groups.find((g) => g.id === vnet?.groupId);
      if (
        !vnet ||
        !vg ||
        table.region !== vnet.region ||
        group.subscriptionId !== vg.subscriptionId
      )
        return deny('incompatible-association', 'routeTableId');
      const association = previous.execute(
        proposal.world,
        {
          commandId: request.commandId,
          expectedRevision: proposal.world.revision,
          command: { type: 'AssociateSubnetRouteTable', subnetId: s.id, routeTableId: table.id },
        },
        sequence,
      );
      if (association.receipt.outcome !== 'accepted')
        return deny(
          association.receipt.code,
          association.receipt.field,
          association.receipt.outcome,
        );
    }
    const candidate = proposal.world.routes.find((x) => proposal.receipt.addedIds.includes(x.id))!;
    const config = (x: typeof route): TopologyChange['before'] => ({
      addressPrefix: x.addressPrefix,
      nextHopType: x.nextHopType,
      ...(x.nextHopType === 'VirtualAppliance'
        ? { firewallId: x.firewallId, nextHopIp: x.nextHopIp }
        : {}),
    });
    const before = config(route),
      after = config(candidate);
    if (canonical(before) === canonical(after)) return deny('no-change');
    next.routes = next.routes.map((x) =>
      x.id === route.id ? { ...candidate, id: route.id, origin: route.origin } : x,
    );
    change = {
      id: route.id,
      name: route.name,
      parentId: table.id,
      createOrigin: route.origin,
      before,
      after,
    };
  } else if (c.type === 'DisassociateSubnetNsg') {
    const s = next.subnets.find((x) => x.id === c.subnetId),
      nsg = next.nsgs.find((x) => x.id === c.nsgId);
    if (!s || !nsg) return deny('invalid-parent', !s ? 'subnetId' : 'nsgId');
    if (!s.nsgId) return deny('not-associated', 'subnetId');
    if (s.nsgId !== nsg.id) return deny('incompatible-association', 'nsgId');
    const vnet = world.vnets.find((v) => v.id === s.vnetId);
    if (!vnet) return deny('invalid-parent', 'subnetId');
    r.location = vnet.region as Receipt['location'];
    change = {
      id: s.id,
      name: s.name,
      parentId: s.vnetId,
      createOrigin: s.origin,
      before: { nsgId: s.nsgId, associationOrigin: s.associationOrigin },
      after: { nsgId: null, associationOrigin: request.commandId },
    };
    s.nsgId = null;
    s.associationOrigin = request.commandId;
  } else if (c.type === 'SetPeeringVirtualNetworkAccess') {
    const p = next.peerings.find((x) => x.id === c.peeringId),
      vnet = world.vnets.find((v) => v.id === c.vnetId);
    if (!p || !vnet) return deny('invalid-parent', !p ? 'peeringId' : 'vnetId');
    if (p.vnetId !== vnet.id) return deny('incompatible-association', 'vnetId');
    if (!world.vnets.some((v) => v.id === p.remoteVnetId))
      return deny('invalid-parent', 'remoteVnetId');
    if (!['true', 'false'].includes(c.value))
      return deny('unsupported-profile', 'value', 'unsupported');
    if (p.allowVirtualNetworkAccess === (c.value === 'true')) return deny('no-change');
    r.location = vnet.region as Receipt['location'];
    change = {
      id: p.id,
      name: p.name,
      parentId: p.vnetId,
      createOrigin: p.origin,
      before: {
        allowVirtualNetworkAccess: p.allowVirtualNetworkAccess,
        accessOrigin: p.accessOrigin,
      },
      after: { allowVirtualNetworkAccess: c.value === 'true', accessOrigin: request.commandId },
    };
    p.allowVirtualNetworkAccess = c.value === 'true';
    p.accessOrigin = request.commandId;
  } else return deny('unsupported-capability', undefined, 'unsupported');
  next.revision++;
  return {
    world: next,
    receipt: {
      ...r,
      outcome: 'accepted',
      code: 'updated',
      afterRevision: next.revision,
      updatedIds: [change.id],
      topologyChange: change,
    },
  };
}
export function replay(entries: Entry[], through = entries.length): World | null {
  if (
    !Number.isInteger(through) ||
    through < 0 ||
    through > entries.length ||
    entries.length > limits.events
  )
    return null;
  let world = freshWorld();
  const seen = new Set<string>();
  for (let i = 0; i < through; i++) {
    const e = entries[i]!,
      request = parseRequest(e.request);
    if (
      e.model !== laboratoryModel ||
      !request ||
      seen.has(request.commandId) ||
      e.attempt !== world.attempt
    )
      return null;
    seen.add(request.commandId);
    const result = execute(world, request, i + 1);
    if (canonical(e.receipt) !== canonical(result.receipt)) return null;
    world = result.world;
  }
  return world;
}
