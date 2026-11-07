import * as previous from '../v32/domain';
import type * as P from '../v32/contract';
import { limits } from '../v3/contract';
import { regions, type Region } from '../../domain/simulation';
import { ipv4, cidr } from '../v31/ip';
import { routingProjection } from './projection';
import {
  laboratoryModel,
  endpointLimits,
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
  nics: [],
});
export const resources = (w: World) => [...previous.resources(routingProjection(w)), ...w.nics];
const fields: Record<string, readonly string[]> = {
  CreateNetworkInterface: [
    'type',
    'groupId',
    'name',
    'region',
    'vnetId',
    'subnetId',
    'privateIpAddress',
    'allocation',
  ],
  AssociateNicNsg: ['type', 'nicId', 'nsgId'],
  DisassociateNicNsg: ['type', 'nicId'],
};
const named = (name: string) =>
  name.length >= 1 &&
  name.length <= 80 &&
  /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9_])?$/.test(name);
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command,
    type = c.type as string,
    raw = c as unknown as Record<string, string>;
  const receipt: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType:
      type === 'ResetWorkspace' ? 'local/workspace' : 'Microsoft.Network/networkInterfaces',
    scopeId: raw.nicId ?? raw.groupId ?? '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-endpoint@3.3',
    addedIds: [],
    removedIds: [],
    beforeCount: resources(world).length,
    afterCount: resources(world).length,
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({ world, receipt: { ...receipt, code, ...(field ? { field } : {}), outcome } });
  // Frozen commands keep their own original stale-validation metadata via delegation.
  if (
    request.expectedRevision !== world.revision &&
    (type === 'ResetWorkspace' || Object.hasOwn(fields, type))
  )
    return deny('stale-revision');
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
        ...receipt,
        targetType: 'local/workspace',
        outcome: 'accepted',
        code: 'updated',
        ruleId: 'lab-reset@3.3',
        afterRevision: world.revision + 1,
        afterCount: 0,
        removedIds: resources(world).map((x) => x.id),
      },
    };
  }
  if (!Object.hasOwn(fields, type)) {
    const projected = routingProjection(world),
      result = previous.execute(projected, request as P.Request, sequence);
    if (
      result.receipt.outcome === 'accepted' &&
      resources(world).length + result.receipt.addedIds.length > limits.entities
    )
      return {
        world,
        receipt: {
          ...result.receipt,
          outcome: 'rejected',
          code: 'capacity',
          ruleId: 'lab-capacity@3.3',
          beforeCount: resources(world).length,
          afterCount: resources(world).length,
          afterRevision: world.revision,
          addedIds: [],
          removedIds: [],
        },
      };
    const next: World =
      result.world === projected ? world : { ...world, ...result.world, model: laboratoryModel };
    return {
      world: next,
      receipt: {
        ...result.receipt,
        ruleId: result.receipt.ruleId.replace('@3.2', '@3.3'),
        beforeCount: resources(world).length,
        afterCount: resources(next).length,
      },
    };
  }
  const allowed = fields[type]!,
    extra = Object.keys(c).find((k) => !allowed.includes(k));
  if (extra) return deny('unsupported-field', extra, 'unsupported');
  if (allowed.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  const next = structuredClone(world);
  let id = '';
  if (c.type === 'CreateNetworkInterface') {
    const group = world.groups.find((x) => x.id === c.groupId),
      vnet = world.vnets.find((x) => x.id === c.vnetId),
      subnet = world.subnets.find((x) => x.id === c.subnetId);
    if (!group || !vnet || !subnet)
      return deny('invalid-parent', !group ? 'groupId' : !vnet ? 'vnetId' : 'subnetId');
    if (subnet.vnetId !== vnet.id) return deny('invalid-parent', 'subnetId');
    if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
    if (
      vnet.region !== c.region ||
      world.groups.find((g) => g.id === vnet.groupId)!.subscriptionId !== group.subscriptionId
    )
      return deny('incompatible-association', 'vnetId');
    if (!named(c.name)) return deny('invalid-name', 'name');
    if (
      world.nics.some(
        (x) => x.groupId === c.groupId && x.name.toLowerCase() === c.name.toLowerCase(),
      )
    )
      return deny('duplicate-name', 'name');
    if (c.allocation !== 'Static') return deny('unsupported-profile', 'allocation', 'unsupported');
    const ip = ipv4(c.privateIpAddress),
      block = cidr(subnet.addressPrefix)!;
    if (ip === null) return deny('invalid-private-ip', 'privateIpAddress');
    if (ip < block.first || ip > block.last) return deny('outside-subnet', 'privateIpAddress');
    if (ip < block.first + 4 || ip === block.last)
      return deny('reserved-private-ip', 'privateIpAddress');
    if (
      world.nics.some((x) => x.subnetId === subnet.id && x.privateIpAddress === c.privateIpAddress)
    )
      return deny('duplicate-private-ip', 'privateIpAddress');
    if (world.nics.length >= endpointLimits.nics || resources(world).length >= limits.entities)
      return deny('capacity');
    id = `nic-${world.nextId}`;
    receipt.location = c.region as Region;
    next.nics.push({
      id,
      name: c.name,
      groupId: group.id,
      region: c.region,
      subnetId: subnet.id,
      privateIpAddress: c.privateIpAddress,
      allocation: 'Static',
      ipVersion: 'IPv4',
      primary: true,
      nsgId: null,
      associationOrigin: null,
      origin: request.commandId,
    });
  } else if (c.type === 'AssociateNicNsg' || c.type === 'DisassociateNicNsg') {
    const nic = world.nics.find((x) => x.id === c.nicId);
    if (!nic) return deny('invalid-parent', 'nicId');
    const target = next.nics.find((x) => x.id === nic.id)!;
    receipt.location = nic.region as Region;
    if (c.type === 'DisassociateNicNsg') {
      if (!nic.nsgId) return deny('not-associated', 'nicId');
      target.nsgId = null;
    } else {
      const nsg = world.nsgs.find((x) => x.id === c.nsgId);
      if (!nsg) return deny('invalid-parent', 'nsgId');
      if (
        nic.region !== nsg.region ||
        world.groups.find((g) => g.id === nic.groupId)!.subscriptionId !==
          world.groups.find((g) => g.id === nsg.groupId)!.subscriptionId
      )
        return deny('incompatible-association', 'nsgId');
      target.nsgId = nsg.id;
    }
    target.associationOrigin = request.commandId;
  }
  next.revision++;
  if (id) next.nextId++;
  return {
    world: next,
    receipt: {
      ...receipt,
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
