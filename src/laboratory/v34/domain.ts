import * as previous from '../v33/domain';
import type * as P from '../v33/contract';
import { limits } from '../v3/contract';
import { endpointProjection } from './projection';
import { proposePrimaryNic } from './network';
import { images, sizes, diskSizes, childNames } from './profiles';
import {
  laboratoryModel,
  computeLimits,
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
  vms: [],
  disks: [],
});
export const resources = (w: World) => [
  ...previous.resources(endpointProjection(w)),
  ...w.vms,
  ...w.disks,
];
const fields = [
  'type',
  'groupId',
  'name',
  'region',
  'image',
  'size',
  'subnetId',
  'privateIpAddress',
  'allocation',
  'nsgId',
  'osDiskSku',
  'osDiskSizeGiB',
];
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command;
  const receipt: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: c.type,
    targetType:
      c.type === 'ResetWorkspace' ? 'local/workspace' : 'Microsoft.Compute/virtualMachines',
    scopeId: 'groupId' in c ? c.groupId : '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-compute@3.4',
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
  if (c.type === 'CreateVirtualMachine' || c.type === 'ResetWorkspace') {
    if (request.expectedRevision !== world.revision) return deny('stale-revision');
  }
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
        outcome: 'accepted',
        code: 'updated',
        ruleId: 'lab-reset@3.4',
        afterRevision: world.revision + 1,
        afterCount: 0,
        removedIds: resources(world).map((x) => x.id),
      },
    };
  }
  if (c.type !== 'CreateVirtualMachine') {
    const projected = endpointProjection(world),
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
          ruleId: 'lab-capacity@3.4',
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
        ruleId: result.receipt.ruleId.replace('@3.3', '@3.4'),
        beforeCount: resources(world).length,
        afterCount: resources(next).length,
      },
    };
  }
  const extra = Object.keys(c).find((k) => !fields.includes(k));
  if (extra) return deny('unsupported-field', extra, 'unsupported');
  if (fields.some((k) => typeof (c as unknown as Record<string, unknown>)[k] !== 'string'))
    return deny('invalid-command');
  const image = images.find((x) => x.id === c.image),
    size = sizes.find((x) => x.id === c.size);
  if (!image || !size) return deny('unsupported-profile', !image ? 'image' : 'size', 'unsupported');
  if (
    c.osDiskSku !== 'StandardSSD_LRS' ||
    !diskSizes.includes(c.osDiskSizeGiB as (typeof diskSizes)[number])
  )
    return deny(
      'unsupported-profile',
      c.osDiskSku !== 'StandardSSD_LRS' ? 'osDiskSku' : 'osDiskSizeGiB',
      'unsupported',
    );
  // Deliberately bounded Azure-compatible subset. Windows names have the shorter OS limit.
  if (
    c.name.length > (image.osType === 'Windows' ? 15 : 64) ||
    !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(c.name)
  )
    return deny('invalid-name', 'name');
  if (
    world.vms.some((x) => x.groupId === c.groupId && x.name.toLowerCase() === c.name.toLowerCase())
  )
    return deny('duplicate-name', 'name');
  if (
    world.disks.some(
      (x) =>
        x.groupId === c.groupId && x.name.toLowerCase() === childNames(c.name).disk.toLowerCase(),
    )
  )
    return deny('duplicate-name', 'osDiskName');
  if (
    world.vms.length >= computeLimits.vms ||
    world.disks.length >= computeLimits.disks ||
    resources(world).length + 3 > limits.entities
  )
    return deny('capacity');
  const proposed = proposePrimaryNic(world, request, c, sequence);
  if (proposed.receipt.outcome !== 'accepted')
    return deny(
      proposed.receipt.code,
      proposed.receipt.field === 'name'
        ? 'nicName'
        : proposed.receipt.field === 'vnetId'
          ? 'subnetId'
          : proposed.receipt.field,
      proposed.receipt.outcome,
    );
  const nicId = `nic-${world.nextId}`,
    vmId = `vm-${world.nextId + 1}`,
    diskId = `disk-${world.nextId + 2}`;
  const next: World = {
    ...world,
    nics: proposed.world.nics,
    revision: world.revision + 1,
    nextId: world.nextId + 3,
    vms: [
      ...world.vms,
      {
        id: vmId,
        name: c.name,
        groupId: c.groupId,
        region: c.region,
        image: image.id,
        size: size.id,
        nicId,
        osDiskId: diskId,
        origin: request.commandId,
      },
    ],
    disks: [
      ...world.disks,
      {
        id: diskId,
        name: childNames(c.name).disk,
        groupId: c.groupId,
        region: c.region,
        sku: 'StandardSSD_LRS',
        sizeGiB: Number(c.osDiskSizeGiB) as 128 | 256,
        osType: image.osType,
        origin: request.commandId,
      },
    ],
  };
  return {
    world: next,
    receipt: {
      ...receipt,
      location: c.region as Receipt['location'],
      outcome: 'accepted',
      code: 'created',
      afterRevision: next.revision,
      afterCount: resources(next).length,
      addedIds: [vmId, nicId, diskId],
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
