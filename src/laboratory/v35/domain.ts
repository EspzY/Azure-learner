import * as previous from '../v34/domain';
import { firewallFields } from './contract';
import type * as P from '../v34/contract';
import { limits } from '../v3/contract';
import { regions, type Region } from '../../domain/simulation';
import { cidr, ipv4, address } from '../v31/ip';
import { port } from '../v33/policy';
import { computeProjection } from './projection';
import { firewallReachable, subscription } from './topology';
import {
  laboratoryModel,
  firewallLimits,
  type World,
  type Request,
  type Receipt,
  type Entry,
} from './contract';
export const canonical = previous.canonical;
export const parseRequest = (value: unknown): Request | null =>
  previous.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({
  ...previous.freshWorld(),
  model: laboratoryModel,
  peerings: [],
  firewalls: [],
  publicIps: [],
  firewallPolicies: [],
  firewallGroups: [],
  firewallCollections: [],
  firewallRules: [],
});
export const resources = (w: World) => [
  ...previous.resources(computeProjection(w)),
  ...w.firewalls,
  ...w.publicIps,
  ...w.firewallPolicies,
  ...w.firewallGroups,
  ...w.firewallCollections,
  ...w.firewallRules,
];
const named = (s: string, max = 80) =>
  s.length <= max && /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9_])?$/.test(s);
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const priority = (s: string) =>
  /^[1-9][0-9]{2,4}$/.test(s) && Number(s) >= 100 && Number(s) <= 65000;
const expression = (s: string) => s === '*' || ipv4(s) !== null || cidr(s) !== null;
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command,
    raw = c as unknown as Record<string, string>,
    type = c.type;
  const r: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType:
      (
        {
          CreateAzureFirewall: 'Microsoft.Network/azureFirewalls',
          CreateFirewallPolicy: 'Microsoft.Network/firewallPolicies',
          CreateFirewallRuleCollectionGroup:
            'Microsoft.Network/firewallPolicies/ruleCollectionGroups',
          CreateFirewallNetworkCollection: 'local/firewallNetworkCollection',
          CreateFirewallNetworkRule: 'local/firewallNetworkRule',
          CreateFirewallRoute: 'Microsoft.Network/routeTables/routes',
          DeleteRoute: 'Microsoft.Network/routeTables/routes',
          SetPeeringForwardedTraffic: 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings',
        } as Record<string, string>
      )[type] ?? 'local/workspace',
    scopeId:
      raw.groupId ??
      raw.policyId ??
      raw.collectionGroupId ??
      raw.collectionId ??
      raw.routeTableId ??
      raw.routeId ??
      raw.peeringId ??
      '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-firewall@3.5',
    addedIds: [],
    removedIds: [],
    beforeCount: resources(world).length,
    afterCount: resources(world).length,
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => {
    const metadata = Object.hasOwn(firewallFields, type)
      ? r
      : previous.execute(
          computeProjection(world),
          { ...request, expectedRevision: world.revision + 1 } as P.Request,
          sequence,
        ).receipt;
    return {
      world,
      receipt: {
        ...metadata,
        ruleId: r.ruleId,
        beforeCount: r.beforeCount,
        afterCount: r.afterCount,
        code,
        ...(field ? { field } : {}),
        outcome,
      },
    };
  };
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  if (!Object.hasOwn(firewallFields, type)) {
    // Dedicated service subnet; ordinary endpoints/NSGs/UDRs are not supported there.
    if (
      [
        'CreateNetworkInterface',
        'CreateVirtualMachine',
        'AssociateSubnetNsg',
        'AssociateSubnetRouteTable',
      ].includes(type) &&
      world.subnets.some((s) => s.id === raw.subnetId && s.name === 'AzureFirewallSubnet')
    )
      return deny('dedicated-subnet', 'subnetId');
    if (type === 'AssociateSubnetRouteTable') {
      for (const route of world.routes.filter(
        (x) => x.routeTableId === raw.routeTableId && x.nextHopType === 'VirtualAppliance',
      ))
        if (route.nextHopType === 'VirtualAppliance') {
          const f = world.firewalls.find((x) => x.id === route.firewallId);
          if (!f || !firewallReachable(world, f, raw.subnetId ?? ''))
            return deny('incompatible-association', 'routeTableId');
        }
    }
    const projected = computeProjection(world);
    let proposal = request as P.Request;
    if (
      c.type === 'CreateSubnet' &&
      typeof c.name === 'string' &&
      c.name.toLowerCase() === 'azurefirewallsubnet'
    ) {
      if (c.name !== 'AzureFirewallSubnet') return deny('invalid-name', 'name');
      const block = cidr(c.addressPrefix);
      if (!block || block.prefix < 8 || block.prefix > 26)
        return deny('invalid-firewall-subnet', 'addressPrefix');
      if (world.subnets.some((s) => s.vnetId === c.vnetId && same(s.name, c.name)))
        return deny('duplicate-name', 'name');
      // Frozen3.1 deliberately rejects service subnet names. Reuse all its other
      // validators through an unpersisted unique-name proposal, restoring the
      // exact newly supported service name only after successful validation.
      let name = 'service-subnet-' + world.nextId;
      while (world.subnets.some((s) => s.vnetId === c.vnetId && same(s.name, name))) name += 'x';
      proposal = { ...request, command: { ...c, name } } as P.Request;
    }
    const result = previous.execute(projected, proposal, sequence);
    if (
      result.receipt.outcome === 'accepted' &&
      c.type === 'CreateSubnet' &&
      c.name === 'AzureFirewallSubnet'
    ) {
      result.world = {
        ...result.world,
        subnets: result.world.subnets.map((s) =>
          result.receipt.addedIds.includes(s.id) ? { ...s, name: c.name } : s,
        ),
      };
      result.receipt = { ...result.receipt, ruleId: 'lab-firewall-subnet@3.5' };
    }
    if (result.receipt.outcome !== 'accepted')
      return {
        world,
        receipt: {
          ...result.receipt,
          beforeCount: resources(world).length,
          afterCount: resources(world).length,
        },
      };
    if (resources(world).length + result.receipt.addedIds.length > limits.entities)
      return deny('capacity');
    const next: World = {
      ...world,
      ...result.world,
      model: laboratoryModel,
      routes: result.world.routes.map((x) => world.routes.find((old) => old.id === x.id) ?? x),
      peerings: result.world.peerings.map((x) => ({
        ...x,
        allowForwardedTraffic:
          world.peerings.find((p) => p.id === x.id)?.allowForwardedTraffic ?? false,
        forwardingOrigin: world.peerings.find((p) => p.id === x.id)?.forwardingOrigin ?? null,
      })),
    };
    return {
      world: next,
      receipt: {
        ...result.receipt,
        beforeCount: resources(world).length,
        afterCount: resources(next).length,
      },
    };
  }
  const allowed = firewallFields[type]!,
    extra = Object.keys(c).find((k) => !allowed.includes(k));
  if (extra) return deny('unsupported-field', extra, 'unsupported');
  if (allowed.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  if (type === 'ResetWorkspace')
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
        afterRevision: world.revision + 1,
        afterCount: 0,
        removedIds: resources(world).map((x) => x.id),
      },
    };
  const next = structuredClone(world);
  const added: string[] = [],
    removed: string[] = [];
  const allocate = (kind: string) => {
    const id = kind + '-' + next.nextId++;
    added.push(id);
    return id;
  };
  if (type === 'SetPeeringForwardedTraffic') {
    const p = next.peerings.find((x) => x.id === c.peeringId);
    if (!p) return deny('invalid-parent', 'peeringId');
    if (!['true', 'false'].includes(c.value))
      return deny('unsupported-profile', 'value', 'unsupported');
    p.allowForwardedTraffic = c.value === 'true';
    p.forwardingOrigin = request.commandId;
  } else if (type === 'DeleteRoute') {
    const route = world.routes.find((x) => x.id === c.routeId);
    if (!route) return deny('invalid-parent', 'routeId');
    next.routes = next.routes.filter((x) => x.id !== c.routeId);
    removed.push(c.routeId);
  } else {
    if (!named(raw.name!, type === 'CreateAzureFirewall' ? 50 : 80))
      return deny('invalid-name', 'name');
    if (type === 'CreateFirewallPolicy' || type === 'CreateAzureFirewall') {
      if (!world.groups.some((g) => g.id === c.groupId)) return deny('invalid-parent', 'groupId');
      if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
      r.location = c.region as Region;
    }
    if (type === 'CreateFirewallPolicy') {
      if (c.tier !== 'Standard' || c.threatIntelMode !== 'Off')
        return deny('unsupported-profile', 'tier', 'unsupported');
      if (world.firewallPolicies.some((p) => p.groupId === c.groupId && same(p.name, c.name)))
        return deny('duplicate-name', 'name');
      if (world.firewallPolicies.length >= firewallLimits.policies) return deny('capacity');
      next.firewallPolicies.push({
        id: allocate('firewall-policy'),
        name: c.name,
        groupId: c.groupId,
        region: c.region,
        tier: 'Standard',
        threatIntelMode: 'Off',
        origin: request.commandId,
      });
    } else if (type === 'CreateFirewallRuleCollectionGroup') {
      if (!world.firewallPolicies.some((p) => p.id === c.policyId))
        return deny('invalid-parent', 'policyId');
      if (!priority(c.priority)) return deny('invalid-priority', 'priority');
      if (world.firewallGroups.some((p) => p.policyId === c.policyId && same(p.name, c.name)))
        return deny('duplicate-name', 'name');
      if (
        world.firewallGroups.some(
          (p) => p.policyId === c.policyId && p.priority === Number(c.priority),
        )
      )
        return deny('priority-conflict', 'priority');
      if (world.firewallGroups.length >= firewallLimits.groups) return deny('capacity');
      next.firewallGroups.push({
        id: allocate('firewall-group'),
        name: c.name,
        policyId: c.policyId,
        priority: Number(c.priority),
        origin: request.commandId,
      });
    } else if (type === 'CreateFirewallNetworkCollection') {
      if (!world.firewallGroups.some((p) => p.id === c.collectionGroupId))
        return deny('invalid-parent', 'collectionGroupId');
      if (!priority(c.priority)) return deny('invalid-priority', 'priority');
      if (!['Allow', 'Deny'].includes(c.action))
        return deny('unsupported-profile', 'action', 'unsupported');
      if (
        world.firewallCollections.some(
          (p) => p.collectionGroupId === c.collectionGroupId && same(p.name, c.name),
        )
      )
        return deny('duplicate-name', 'name');
      if (
        world.firewallCollections.some(
          (p) => p.collectionGroupId === c.collectionGroupId && p.priority === Number(c.priority),
        )
      )
        return deny('priority-conflict', 'priority');
      if (world.firewallCollections.length >= firewallLimits.collections) return deny('capacity');
      next.firewallCollections.push({
        id: allocate('firewall-collection'),
        name: c.name,
        collectionGroupId: c.collectionGroupId,
        priority: Number(c.priority),
        action: c.action as 'Allow' | 'Deny',
        origin: request.commandId,
      });
    } else if (type === 'CreateFirewallNetworkRule') {
      if (!world.firewallCollections.some((p) => p.id === c.collectionId))
        return deny('invalid-parent', 'collectionId');
      if (!expression(c.source)) return deny('invalid-firewall-rule', 'source');
      if (!expression(c.destination)) return deny('invalid-firewall-rule', 'destination');
      if (!['Tcp', 'Udp'].includes(c.protocol)) return deny('invalid-firewall-rule', 'protocol');
      if (
        c.destinationPort !== '*' &&
        (port(c.destinationPort) === null || port(c.destinationPort) === 0)
      )
        return deny('invalid-firewall-rule', 'destinationPort');
      if (
        world.firewallRules.some((p) => p.collectionId === c.collectionId && same(p.name, c.name))
      )
        return deny('duplicate-name', 'name');
      if (world.firewallRules.length >= firewallLimits.rules) return deny('capacity');
      next.firewallRules.push({
        id: allocate('firewall-rule'),
        name: c.name,
        collectionId: c.collectionId,
        source: c.source,
        destination: c.destination,
        protocol: c.protocol as 'Tcp' | 'Udp',
        destinationPort: c.destinationPort,
        origin: request.commandId,
      });
    } else if (type === 'CreateAzureFirewall') {
      if (c.skuName !== 'AZFW_VNet' || c.skuTier !== 'Standard')
        return deny('unsupported-profile', 'skuTier', 'unsupported');
      const s = world.subnets.find((s) => s.id === c.subnetId),
        v = world.vnets.find((v) => v.id === s?.vnetId),
        policy = world.firewallPolicies.find((p) => p.id === c.policyId),
        block = s && cidr(s.addressPrefix);
      if (!s || !v || !policy) return deny('invalid-parent', !policy ? 'policyId' : 'subnetId');
      if (
        s.name !== 'AzureFirewallSubnet' ||
        !block ||
        block.prefix > 26 ||
        s.nsgId ||
        s.routeTableId ||
        world.nics.some((n) => n.subnetId === s.id)
      )
        return deny('invalid-firewall-subnet', 'subnetId');
      if (
        v.groupId !== c.groupId ||
        v.region !== c.region ||
        policy.region !== c.region ||
        subscription(world, policy.groupId) !== subscription(world, c.groupId)
      )
        return deny('incompatible-association', 'policyId');
      if (
        world.firewalls.some((f) => f.groupId === c.groupId && same(f.name, c.name)) ||
        world.publicIps.some((p) => p.groupId === c.groupId && same(p.name, c.name + '-pip')) ||
        world.firewalls.some((f) => world.subnets.find((s) => s.id === f.subnetId)?.vnetId === v.id)
      )
        return deny('duplicate-name', 'name');
      if (world.firewalls.length >= firewallLimits.firewalls) return deny('capacity');
      const occupied = new Set([
        ...world.nics.filter((n) => n.subnetId === s.id).map((n) => n.privateIpAddress),
        ...world.firewalls.filter((f) => f.subnetId === s.id).map((f) => f.privateIpAddress),
      ]);
      let ip = block.first + 4;
      while (ip < block.last && occupied.has(address(ip))) ip++;
      if (ip >= block.last) return deny('capacity', 'subnetId');
      const fwId = allocate('firewall'),
        pipId = allocate('public-ip');
      next.firewalls.push({
        id: fwId,
        name: c.name,
        groupId: c.groupId,
        region: c.region,
        subnetId: s.id,
        policyId: policy.id,
        publicIpId: pipId,
        privateIpAddress: address(ip),
        skuName: 'AZFW_VNet',
        skuTier: 'Standard',
        origin: request.commandId,
      });
      next.publicIps.push({
        id: pipId,
        name: c.name + '-pip',
        groupId: c.groupId,
        region: c.region,
        sku: 'Standard',
        tier: 'Regional',
        allocation: 'Static',
        ipVersion: 'IPv4',
        address: null,
        origin: request.commandId,
      });
    } else if (type === 'CreateFirewallRoute') {
      const table = world.routeTables.find((t) => t.id === c.routeTableId),
        fw = world.firewalls.find((f) => f.id === c.firewallId);
      if (!table || !fw) return deny('invalid-parent', !fw ? 'firewallId' : 'routeTableId');
      if (!cidr(c.addressPrefix)) return deny('invalid-cidr', 'addressPrefix');
      if (c.nextHopIp !== fw.privateIpAddress) return deny('invalid-next-hop', 'nextHopIp');
      if (
        table.region !== fw.region ||
        subscription(world, table.groupId) !== subscription(world, fw.groupId) ||
        world.subnets
          .filter((s) => s.routeTableId === table.id)
          .some((s) => !firewallReachable(world, fw, s.id))
      )
        return deny('incompatible-association', 'routeTableId');
      if (world.routes.some((r) => r.routeTableId === table.id && same(r.name, c.name)))
        return deny('duplicate-name', 'name');
      if (
        world.routes.some((r) => r.routeTableId === table.id && r.addressPrefix === c.addressPrefix)
      )
        return deny('duplicate-prefix', 'addressPrefix');
      if (
        world.routes.length >= 32 ||
        world.routes.filter((r) => r.routeTableId === table.id).length >= 16
      )
        return deny('capacity');
      next.routes.push({
        id: allocate('route'),
        name: c.name,
        routeTableId: table.id,
        addressPrefix: c.addressPrefix,
        nextHopType: 'VirtualAppliance',
        firewallId: fw.id,
        nextHopIp: fw.privateIpAddress,
        origin: request.commandId,
      });
      r.location = table.region as Region;
    }
  }
  if (resources(next).length > limits.entities) return deny('capacity');
  next.revision++;
  return {
    world: next,
    receipt: {
      ...r,
      outcome: 'accepted',
      code: added.length ? 'created' : 'updated',
      afterRevision: next.revision,
      afterCount: resources(next).length,
      addedIds: added,
      removedIds: removed,
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
