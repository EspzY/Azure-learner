import * as old from '../v3/domain';
import * as oldTypes from '../v3/contract';
import { regions, type Region } from '../../domain/simulation';
import { cidr, contains, overlaps, privateSpace, ipv4 } from './ip';
import { defaultRules } from './default-rules';
import {
  laboratoryModel,
  networkLimits,
  type World,
  type Request,
  type Receipt,
  type Entry,
  type SecurityRule,
} from './contract';
export const canonical = old.canonical;
export const parseRequest = (value: unknown): Request | null =>
  old.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({
  ...old.freshWorld(),
  model: laboratoryModel,
  vnets: [],
  subnets: [],
  nsgs: [],
  securityRules: [],
});
export const resources = (w: World) => [
  ...w.groups,
  ...w.accounts,
  ...w.containers,
  ...w.blobs,
  ...w.vnets,
  ...w.subnets,
  ...w.nsgs,
  ...w.securityRules,
];
export const count = (w: World) => resources(w).length;
const fields: Record<string, readonly string[]> = {
  CreateVirtualNetwork: ['type', 'groupId', 'name', 'region', 'addressSpace'],
  CreateSubnet: ['type', 'vnetId', 'name', 'addressPrefix'],
  CreateNetworkSecurityGroup: ['type', 'groupId', 'name', 'region'],
  CreateSecurityRule: [
    'type',
    'nsgId',
    'name',
    'direction',
    'priority',
    'protocol',
    'source',
    'sourcePort',
    'destination',
    'destinationPort',
    'access',
  ],
  AssociateSubnetNsg: ['type', 'subnetId', 'nsgId'],
};
const named = (name: string, min = 1, max = 80) =>
  name.length >= min &&
  name.length <= max &&
  /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9_])?$/.test(name);
const duplicate = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const endpoint = (s: string) => s === '*' || ipv4(s) !== null || cidr(s) !== null;
const port = (s: string) => s === '*' || (/^(0|[1-9][0-9]{0,4})$/.test(s) && Number(s) <= 65535);
const standardNames = defaultRules.map((rule) => rule[0]);
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
          CreateGroup: 'Microsoft.Resources/resourceGroups',
          CreateStorageAccount: 'Microsoft.Storage/storageAccounts',
          CreateBlobContainer: 'local/blob-container',
          CreateTextBlob: 'local/text-blob',
          CreateVirtualNetwork: 'Microsoft.Network/virtualNetworks',
          CreateSubnet: 'Microsoft.Network/virtualNetworks/subnets',
          AssociateSubnetNsg: 'Microsoft.Network/virtualNetworks/subnets',
          CreateSecurityRule: 'Microsoft.Network/networkSecurityGroups/securityRules',
          CreateNetworkSecurityGroup: 'Microsoft.Network/networkSecurityGroups',
        } as Record<string, string>
      )[type] ?? 'local/workspace',
    scopeId:
      raw.subnetId ??
      raw.groupId ??
      raw.vnetId ??
      raw.nsgId ??
      raw.accountId ??
      raw.containerId ??
      raw.subscriptionId ??
      '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-network@3.1',
    addedIds: [],
    removedIds: [],
    beforeCount: count(world),
    afterCount: count(world),
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({ world, receipt: { ...r, code, field, outcome } });
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  if (c.type === 'ResetWorkspace' && Object.keys(c).length !== 1)
    return deny(
      'unsupported-field',
      Object.keys(c).find((k) => k !== 'type'),
      'unsupported',
    );
  if (c.type === 'ResetWorkspace')
    return {
      world: {
        ...freshWorld(),
        revision: world.revision + 1,
        nextId: world.nextId,
        attempt: world.attempt + 1,
      },
      receipt: {
        ...r,
        targetType: 'local/workspace',
        outcome: 'accepted',
        code: 'updated',
        ruleId: 'lab-reset@3.1',
        afterRevision: world.revision + 1,
        afterCount: 0,
        removedIds: resources(world).map((x) => x.id),
      },
    };
  if (!Object.hasOwn(fields, type)) {
    // Explicit version adapter over the frozen rules. Never used for historical3.0 replay.
    const projected: oldTypes.World = {
      model: oldTypes.laboratoryModel,
      revision: world.revision,
      nextId: world.nextId,
      attempt: world.attempt,
      groups: world.groups,
      accounts: world.accounts,
      containers: world.containers,
      blobs: world.blobs,
    };
    const result = old.execute(projected, request as oldTypes.Request, sequence);
    if (result.receipt.outcome === 'accepted' && count(world) >= oldTypes.limits.entities)
      return deny('capacity');
    const next: World =
      result.world === projected ? world : { ...world, ...result.world, model: laboratoryModel };
    return {
      world: next,
      receipt: {
        ...result.receipt,
        ruleId: result.receipt.ruleId.replace('@3', '@3.1'),
        beforeCount: count(world),
        afterCount: count(next),
      },
    };
  }
  const allowed = fields[type]!;
  if (Object.keys(c).some((k) => !allowed.includes(k)))
    return deny(
      'unsupported-field',
      Object.keys(c).find((k) => !allowed.includes(k)),
      'unsupported',
    );
  if (allowed.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  const next = structuredClone(world);
  let id = '',
    updated = false;
  if (c.type === 'AssociateSubnetNsg') {
    const subnet = world.subnets.find((x) => x.id === c.subnetId),
      nsg = world.nsgs.find((x) => x.id === c.nsgId);
    if (!subnet || !nsg) return deny('invalid-parent', !subnet ? 'subnetId' : 'nsgId');
    const vnet = world.vnets.find((x) => x.id === subnet.vnetId)!;
    const vg = world.groups.find((x) => x.id === vnet.groupId)!,
      ng = world.groups.find((x) => x.id === nsg.groupId)!;
    if (vnet.region !== nsg.region || vg.subscriptionId !== ng.subscriptionId)
      return deny('incompatible-association', 'nsgId');
    const target = next.subnets.find((x) => x.id === subnet.id)!;
    target.nsgId = nsg.id;
    target.associationOrigin = request.commandId;
    r.scopeId = subnet.id;
    r.location = vnet.region as Region;
    updated = true;
  } else {
    if (count(world) >= oldTypes.limits.entities) return deny('capacity');
    if (c.type === 'CreateVirtualNetwork' || c.type === 'CreateNetworkSecurityGroup') {
      if (!world.groups.some((x) => x.id === c.groupId)) return deny('invalid-parent', 'groupId');
      if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
      if (
        !named(
          c.name,
          c.type === 'CreateVirtualNetwork' ? 2 : 1,
          c.type === 'CreateVirtualNetwork' ? 64 : 80,
        )
      )
        return deny('invalid-name', 'name');
      r.location = c.region as Region;
      if (c.type === 'CreateVirtualNetwork') {
        if (!privateSpace(c.addressSpace)) return deny('invalid-cidr', 'addressSpace');
        if (world.vnets.some((x) => x.groupId === c.groupId && duplicate(x.name, c.name)))
          return deny('duplicate-name', 'name');
        if (world.vnets.length >= networkLimits.vnets) return deny('capacity');
        id = `vnet-${world.nextId}`;
        next.vnets.push({
          id,
          name: c.name,
          groupId: c.groupId,
          region: c.region,
          addressSpace: c.addressSpace,
          origin: request.commandId,
        });
      } else {
        if (world.nsgs.some((x) => x.groupId === c.groupId && duplicate(x.name, c.name)))
          return deny('duplicate-name', 'name');
        if (world.nsgs.length >= networkLimits.nsgs) return deny('capacity');
        id = `nsg-${world.nextId}`;
        next.nsgs.push({
          id,
          name: c.name,
          groupId: c.groupId,
          region: c.region,
          origin: request.commandId,
        });
      }
    } else if (c.type === 'CreateSubnet') {
      const vnet = world.vnets.find((x) => x.id === c.vnetId);
      if (!vnet) return deny('invalid-parent', 'vnetId');
      if (!named(c.name)) return deny('invalid-name', 'name');
      if (
        [
          'GatewaySubnet',
          'AzureBastionSubnet',
          'AzureFirewallSubnet',
          'AzureFirewallManagementSubnet',
          'RouteServerSubnet',
        ].some((n) => duplicate(n, c.name))
      )
        return deny('unsupported-profile', 'name', 'unsupported');
      const block = cidr(c.addressPrefix);
      if (!block || block.prefix < 8 || block.prefix > 29)
        return deny('invalid-cidr', 'addressPrefix');
      if (!contains(cidr(vnet.addressSpace)!, block))
        return deny('outside-address-space', 'addressPrefix');
      if (world.subnets.some((x) => x.vnetId === vnet.id && duplicate(x.name, c.name)))
        return deny('duplicate-name', 'name');
      if (
        world.subnets.some((x) => x.vnetId === vnet.id && overlaps(cidr(x.addressPrefix)!, block))
      )
        return deny('overlapping-subnet', 'addressPrefix');
      if (world.subnets.length >= networkLimits.subnets) return deny('capacity');
      r.location = vnet.region as Region;
      id = `subnet-${world.nextId}`;
      next.subnets.push({
        id,
        name: c.name,
        vnetId: vnet.id,
        addressPrefix: c.addressPrefix,
        nsgId: null,
        associationOrigin: null,
        origin: request.commandId,
      });
    } else if (c.type === 'CreateSecurityRule') {
      const nsg = world.nsgs.find((x) => x.id === c.nsgId);
      if (!nsg) return deny('invalid-parent', 'nsgId');
      if (!named(c.name)) return deny('invalid-name', 'name');
      if (standardNames.some((n) => duplicate(n, c.name)))
        return deny('unsupported-profile', 'name', 'unsupported');
      if (!['Inbound', 'Outbound'].includes(c.direction)) return deny('invalid-rule', 'direction');
      if (!['Tcp', 'Udp', '*'].includes(c.protocol)) return deny('invalid-rule', 'protocol');
      if (!['Allow', 'Deny'].includes(c.access)) return deny('invalid-rule', 'access');
      if (
        !/^[1-9][0-9]{2,3}$/.test(c.priority) ||
        Number(c.priority) < 100 ||
        Number(c.priority) > 4096
      )
        return deny('invalid-priority', 'priority');
      for (const k of ['source', 'destination'] as const)
        if (!endpoint(c[k])) return deny('invalid-rule', k);
      for (const k of ['sourcePort', 'destinationPort'] as const)
        if (!port(c[k])) return deny('invalid-rule', k);
      if (world.securityRules.some((x) => x.nsgId === nsg.id && duplicate(x.name, c.name)))
        return deny('duplicate-name', 'name');
      if (
        world.securityRules.some(
          (x) =>
            x.nsgId === nsg.id && x.direction === c.direction && x.priority === Number(c.priority),
        )
      )
        return deny('priority-conflict', 'priority');
      if (
        world.securityRules.length >= networkLimits.rules ||
        world.securityRules.filter((x) => x.nsgId === nsg.id).length >= networkLimits.rulesPerNsg
      )
        return deny('capacity');
      r.location = nsg.region as Region;
      id = `rule-${world.nextId}`;
      next.securityRules.push({
        id,
        nsgId: c.nsgId,
        name: c.name,
        direction: c.direction as SecurityRule['direction'],
        protocol: c.protocol as SecurityRule['protocol'],
        source: c.source,
        sourcePort: c.sourcePort,
        destination: c.destination,
        destinationPort: c.destinationPort,
        access: c.access as SecurityRule['access'],
        priority: Number(c.priority),
        origin: request.commandId,
      });
    }
  }
  next.revision++;
  if (!updated) next.nextId++;
  return {
    world: next,
    receipt: {
      ...r,
      outcome: 'accepted',
      code: updated ? 'updated' : 'created',
      afterRevision: next.revision,
      afterCount: count(next),
      addedIds: id ? [id] : [],
    },
  };
}
export function replay(entries: Entry[], through = entries.length): World | null {
  if (
    !Number.isInteger(through) ||
    through < 0 ||
    through > entries.length ||
    entries.length > oldTypes.limits.events
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
