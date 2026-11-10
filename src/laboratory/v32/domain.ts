import * as previous from '../v31/domain';
import * as A from '../v31/contract';
import { limits } from '../v3/contract';
import { regions, type Region } from '../../domain/simulation';
import { cidr, contains, overlaps } from '../v31/ip';
import {
  laboratoryModel,
  routingLimits,
  type World,
  type Request,
  type Receipt,
  type Entry,
  type UserNextHop,
} from './contract';

export const canonical = previous.canonical;
export const parseRequest = (value: unknown): Request | null =>
  previous.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({
  ...previous.freshWorld(),
  model: laboratoryModel,
  subnets: [],
  peerings: [],
  routeTables: [],
  routes: [],
});
export const resources = (w: World) => [
  ...previous.resources(w as unknown as A.World),
  ...w.peerings,
  ...w.routeTables,
  ...w.routes,
];
const fields: Record<string, readonly string[]> = {
  CreateVnetPeering: ['type', 'vnetId', 'remoteVnetId', 'name'],
  CreateRouteTable: ['type', 'groupId', 'region', 'name'],
  CreateRoute: ['type', 'routeTableId', 'name', 'addressPrefix', 'nextHopType'],
  AssociateSubnetRouteTable: ['type', 'subnetId', 'routeTableId'],
  DisassociateSubnetRouteTable: ['type', 'subnetId'],
};
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const named = (s: string) =>
  s.length >= 1 && s.length <= 80 && /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9_])?$/.test(s);
export { peeringStatus } from './peering';
const project = (w: World): A.World => ({
  model: A.laboratoryModel,
  revision: w.revision,
  nextId: w.nextId,
  attempt: w.attempt,
  groups: w.groups,
  accounts: w.accounts,
  containers: w.containers,
  blobs: w.blobs,
  vnets: w.vnets,
  nsgs: w.nsgs,
  securityRules: w.securityRules,
  subnets: w.subnets.map((s) => ({
    id: s.id,
    name: s.name,
    vnetId: s.vnetId,
    addressPrefix: s.addressPrefix,
    nsgId: s.nsgId,
    associationOrigin: s.associationOrigin,
    origin: s.origin,
  })),
});
const localRouteFits = (w: World, tableId: string, vnetId: string, candidate?: string) => {
  const vnet = w.vnets.find((x) => x.id === vnetId);
  if (!vnet) return false;
  const prefixes = candidate
    ? [candidate]
    : w.routes
        .filter((x) => x.routeTableId === tableId && x.nextHopType === 'VnetLocal')
        .map((x) => x.addressPrefix);
  return prefixes.every((prefix) => contains(cidr(vnet.addressSpace)!, cidr(prefix)!));
};
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command,
    type = c.type as string,
    raw = c as unknown as Record<string, string>;
  const r: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType:
      (
        {
          CreateVnetPeering: 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings',
          CreateRouteTable: 'Microsoft.Network/routeTables',
          CreateRoute: 'Microsoft.Network/routeTables/routes',
          AssociateSubnetRouteTable: 'Microsoft.Network/virtualNetworks/subnets',
          DisassociateSubnetRouteTable: 'Microsoft.Network/virtualNetworks/subnets',
        } as Record<string, string>
      )[type] ?? 'local/workspace',
    scopeId: raw.subnetId ?? raw.routeTableId ?? raw.vnetId ?? raw.groupId ?? '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-routing@3.2',
    addedIds: [],
    removedIds: [],
    beforeCount: resources(world).length,
    afterCount: resources(world).length,
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({ world, receipt: { ...r, code, ...(field ? { field } : {}), outcome } });
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  if (c.type === 'ResetWorkspace') {
    if (Object.keys(c).length !== 1)
      return deny(
        'unsupported-field',
        Object.keys(c).find((k) => k !== 'type'),
        'unsupported',
      );
    return {
      world: {
        ...freshWorld(),
        revision: world.revision + 1,
        nextId: world.nextId,
        attempt: world.attempt + 1,
      },
      receipt: {
        ...r,
        outcome: 'accepted',
        code: 'updated',
        ruleId: 'lab-reset@3.2',
        afterRevision: world.revision + 1,
        afterCount: 0,
        removedIds: resources(world).map((x) => x.id),
      },
    };
  }
  if (!Object.hasOwn(fields, type)) {
    const projected = project(world),
      result = previous.execute(projected, request as A.Request, sequence);
    if (
      result.receipt.outcome === 'accepted' &&
      result.receipt.addedIds.length &&
      resources(world).length + result.receipt.addedIds.length > limits.entities
    )
      return deny('capacity');
    const next: World =
      result.world === projected
        ? world
        : {
            ...world,
            ...result.world,
            model: laboratoryModel,
            subnets: result.world.subnets.map((s) => ({
              ...s,
              routeTableId: world.subnets.find((x) => x.id === s.id)?.routeTableId ?? null,
              routeAssociationOrigin:
                world.subnets.find((x) => x.id === s.id)?.routeAssociationOrigin ?? null,
            })),
          };
    return {
      world: next,
      receipt: {
        ...result.receipt,
        ruleId: result.receipt.ruleId.replace('@3.1', '@3.2'),
        beforeCount: resources(world).length,
        afterCount: resources(next).length,
      },
    };
  }
  const allowed = fields[type]!;
  const extra = Object.keys(c).find((k) => !allowed.includes(k));
  if (extra) return deny('unsupported-field', extra, 'unsupported');
  if (allowed.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  const next = structuredClone(world);
  let id = '';
  if (c.type === 'AssociateSubnetRouteTable' || c.type === 'DisassociateSubnetRouteTable') {
    const subnet = world.subnets.find((x) => x.id === c.subnetId);
    if (!subnet) return deny('invalid-parent', 'subnetId');
    const vnet = world.vnets.find((x) => x.id === subnet.vnetId)!;
    r.location = vnet.region as Region;
    const target = next.subnets.find((x) => x.id === subnet.id)!;
    if (c.type === 'DisassociateSubnetRouteTable') {
      if (!subnet.routeTableId) return deny('not-associated', 'subnetId');
      target.routeTableId = null;
    } else {
      const table = world.routeTables.find((x) => x.id === c.routeTableId);
      if (!table) return deny('invalid-parent', 'routeTableId');
      const vg = world.groups.find((x) => x.id === vnet.groupId)!,
        tg = world.groups.find((x) => x.id === table.groupId)!;
      if (vnet.region !== table.region || vg.subscriptionId !== tg.subscriptionId)
        return deny('incompatible-association', 'routeTableId');
      if (!localRouteFits(world, table.id, vnet.id))
        return deny('unsupported-route-profile', 'routeTableId', 'unsupported');
      target.routeTableId = table.id;
    }
    target.routeAssociationOrigin = request.commandId;
  } else {
    if (resources(world).length >= limits.entities) return deny('capacity');
    if (!named(raw.name!)) return deny('invalid-name', 'name');
    if (c.type === 'CreateVnetPeering') {
      const local = world.vnets.find((x) => x.id === c.vnetId),
        remote = world.vnets.find((x) => x.id === c.remoteVnetId);
      if (!local || !remote) return deny('invalid-parent', !local ? 'vnetId' : 'remoteVnetId');
      if (local.id === remote.id) return deny('invalid-peering', 'remoteVnetId');
      // Both parents must belong to this verified workspace and a registered subscription.
      if (![local, remote].every((v) => world.groups.some((g) => g.id === v.groupId)))
        return deny('invalid-parent');
      if (overlaps(cidr(local.addressSpace)!, cidr(remote.addressSpace)!))
        return deny('overlapping-vnets', 'remoteVnetId');
      if (world.peerings.some((x) => x.vnetId === local.id && x.remoteVnetId === remote.id))
        return deny('duplicate-peering', 'remoteVnetId');
      if (world.peerings.some((x) => x.vnetId === local.id && same(x.name, c.name)))
        return deny('duplicate-name', 'name');
      if (world.peerings.length >= routingLimits.peerings) return deny('capacity');
      r.location = local.region as Region;
      id = `peering-${world.nextId}`;
      next.peerings.push({
        id,
        name: c.name,
        vnetId: local.id,
        remoteVnetId: remote.id,
        allowVirtualNetworkAccess: true,
        origin: request.commandId,
      });
    } else if (c.type === 'CreateRouteTable') {
      if (!world.groups.some((x) => x.id === c.groupId)) return deny('invalid-parent', 'groupId');
      if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
      if (world.routeTables.some((x) => x.groupId === c.groupId && same(x.name, c.name)))
        return deny('duplicate-name', 'name');
      if (world.routeTables.length >= routingLimits.routeTables) return deny('capacity');
      r.location = c.region as Region;
      id = `route-table-${world.nextId}`;
      next.routeTables.push({
        id,
        name: c.name,
        groupId: c.groupId,
        region: c.region,
        origin: request.commandId,
      });
    } else if (c.type === 'CreateRoute') {
      const table = world.routeTables.find((x) => x.id === c.routeTableId);
      if (!table) return deny('invalid-parent', 'routeTableId');
      if (!cidr(c.addressPrefix)) return deny('invalid-cidr', 'addressPrefix');
      if (!['VnetLocal', 'Internet', 'None'].includes(c.nextHopType))
        return deny('unsupported-next-hop', 'nextHopType', 'unsupported');
      if (world.routes.some((x) => x.routeTableId === table.id && same(x.name, c.name)))
        return deny('duplicate-name', 'name');
      if (
        world.routes.some((x) => x.routeTableId === table.id && x.addressPrefix === c.addressPrefix)
      )
        return deny('duplicate-prefix', 'addressPrefix');
      if (
        c.nextHopType === 'VnetLocal' &&
        world.subnets
          .filter((x) => x.routeTableId === table.id)
          .some((s) => !localRouteFits(world, table.id, s.vnetId, c.addressPrefix))
      )
        return deny('unsupported-route-profile', 'addressPrefix', 'unsupported');
      if (
        world.routes.length >= routingLimits.routes ||
        world.routes.filter((x) => x.routeTableId === table.id).length >=
          routingLimits.routesPerTable
      )
        return deny('capacity');
      r.location = table.region as Region;
      id = `route-${world.nextId}`;
      next.routes.push({
        id,
        name: c.name,
        routeTableId: table.id,
        addressPrefix: c.addressPrefix,
        nextHopType: c.nextHopType as UserNextHop,
        origin: request.commandId,
      });
    }
  }
  next.revision++;
  if (id) next.nextId++;
  return {
    world: next,
    receipt: {
      ...r,
      outcome: 'accepted',
      code: id ? 'created' : 'updated',
      afterRevision: next.revision,
      afterCount: resources(next).length,
      addedIds: id ? [id] : [],
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
