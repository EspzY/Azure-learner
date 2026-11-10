import { createHash } from 'node:crypto';
import { regions, validResourceGroupName, type Region } from '../../domain/simulation';
import {
  laboratoryModel,
  limits,
  type World,
  type Request,
  type Receipt,
  type Entry,
} from './contract';
export const freshWorld = (): World => ({
  model: laboratoryModel,
  revision: 0,
  nextId: 1,
  attempt: 1,
  groups: [],
  accounts: [],
  containers: [],
  blobs: [],
});
export const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object')
    return (
      '{' +
      Object.keys(value)
        .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
        .sort()
        .map((k) => JSON.stringify(k) + ':' + canonical((value as Record<string, unknown>)[k]))
        .join(',') +
      '}'
    );
  return JSON.stringify(value) ?? 'null';
};
const fields: Record<string, readonly string[]> = {
  CreateGroup: ['type', 'subscriptionId', 'name', 'metadataRegion'],
  CreateStorageAccount: ['type', 'groupId', 'name', 'region', 'kind', 'sku'],
  CreateBlobContainer: ['type', 'accountId', 'name', 'access'],
  CreateTextBlob: ['type', 'containerId', 'name', 'text', 'contentType'],
  ResetWorkspace: ['type'],
};
export function parseRequest(value: unknown): Request | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const r = value as Record<string, unknown>;
  if (
    Object.keys(r).sort().join(',') !== 'command,commandId,expectedRevision' ||
    typeof r.commandId !== 'string' ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(r.commandId) ||
    !Number.isSafeInteger(r.expectedRevision) ||
    (r.expectedRevision as number) < 0 ||
    !r.command ||
    typeof r.command !== 'object' ||
    Array.isArray(r.command)
  )
    return null;
  const c = r.command as Record<string, unknown>;
  if (
    Object.keys(c).length > 12 ||
    typeof c.type !== 'string' ||
    c.type.length > 64 ||
    Object.keys(c).some((k) => k.length > 40) ||
    Object.values(c).some(
      (v) => typeof v !== 'string' || v.length > 120 || !v.isWellFormed() || v.includes('\0'),
    )
  )
    return null;
  return structuredClone(value) as Request;
}
export const count = (w: World) =>
  w.groups.length + w.accounts.length + w.containers.length + w.blobs.length;
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
      type === 'CreateGroup'
        ? 'Microsoft.Resources/resourceGroups'
        : type === 'CreateStorageAccount'
          ? 'Microsoft.Storage/storageAccounts'
          : type === 'CreateBlobContainer'
            ? 'local/blob-container'
            : type === 'CreateTextBlob'
              ? 'local/text-blob'
              : 'local/workspace',
    scopeId: raw.groupId ?? raw.accountId ?? raw.containerId ?? raw.subscriptionId ?? '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-input@3',
    addedIds: [],
    removedIds: [],
    beforeCount: count(world),
    afterCount: count(world),
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({ world, receipt: { ...receipt, code, field, outcome } });
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  const supported = Object.hasOwn(fields, type) ? fields[type] : undefined;
  if (!supported) return deny('unsupported-capability', 'type', 'unsupported');
  if (Object.keys(c).some((k) => !supported.includes(k)))
    return deny(
      'unsupported-field',
      Object.keys(c).find((k) => !supported.includes(k)),
      'unsupported',
    );
  if (supported.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  let next = structuredClone(world),
    id = '';
  if (c.type === 'ResetWorkspace') {
    next = {
      ...freshWorld(),
      revision: world.revision + 1,
      nextId: world.nextId,
      attempt: world.attempt + 1,
    };
    return {
      world: next,
      receipt: {
        ...receipt,
        outcome: 'accepted',
        code: 'updated',
        ruleId: 'lab-reset@3',
        afterRevision: next.revision,
        afterCount: 0,
        removedIds: [...world.groups, ...world.accounts, ...world.containers, ...world.blobs].map(
          (r) => r.id,
        ),
      },
    };
  }
  if (count(world) >= limits.entities) return deny('capacity');
  if (c.type === 'CreateGroup') {
    if (!validResourceGroupName(c.name) || c.name !== c.name.trim())
      return deny('invalid-name', 'name');
    if (!['sub-shared', 'sub-app'].includes(c.subscriptionId))
      return deny('invalid-parent', 'subscriptionId');
    if (!regions.includes(c.metadataRegion as Region))
      return deny('invalid-region', 'metadataRegion');
    if (
      world.groups.some(
        (g) =>
          g.subscriptionId === c.subscriptionId && g.name.toLowerCase() === c.name.toLowerCase(),
      )
    )
      return deny('duplicate-name', 'name');
    if (world.groups.length >= limits.groups) return deny('capacity');
    id = `group-${world.nextId}`;
    next.groups.push({
      id,
      name: c.name,
      subscriptionId: c.subscriptionId,
      metadataRegion: c.metadataRegion,
      origin: request.commandId,
    });
    receipt.location = c.metadataRegion as Region;
  } else if (c.type === 'CreateStorageAccount') {
    if (!world.groups.some((g) => g.id === c.groupId)) return deny('invalid-parent', 'groupId');
    if (!/^[a-z0-9]{3,24}$/.test(c.name)) return deny('invalid-name', 'name');
    if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
    if (c.kind !== 'StorageV2' || c.sku !== 'Standard_LRS')
      return deny('unsupported-profile', 'kind', 'unsupported');
    if (world.accounts.some((a) => a.name === c.name)) return deny('duplicate-name', 'name');
    if (world.accounts.length >= limits.accounts) return deny('capacity');
    id = `storage-${world.nextId}`;
    next.accounts.push({
      id,
      name: c.name,
      groupId: c.groupId,
      region: c.region,
      kind: 'StorageV2',
      sku: 'Standard_LRS',
      origin: request.commandId,
    });
    receipt.location = c.region as Region;
  } else if (c.type === 'CreateBlobContainer') {
    if (!world.accounts.some((a) => a.id === c.accountId))
      return deny('invalid-parent', 'accountId');
    if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(c.name) || c.name.includes('--'))
      return deny('invalid-name', 'name');
    if (c.access !== 'private') return deny('unsupported-profile', 'access', 'unsupported');
    if (world.containers.some((x) => x.accountId === c.accountId && x.name === c.name))
      return deny('duplicate-name', 'name');
    if (world.containers.length >= limits.containers) return deny('capacity');
    id = `container-${world.nextId}`;
    next.containers.push({
      id,
      name: c.name,
      accountId: c.accountId,
      access: 'private',
      origin: request.commandId,
    });
  } else if (c.type === 'CreateTextBlob') {
    if (!world.containers.some((x) => x.id === c.containerId))
      return deny('invalid-parent', 'containerId');
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(c.name)) return deny('invalid-name', 'name');
    if (c.contentType !== 'text/plain')
      return deny('unsupported-profile', 'contentType', 'unsupported');
    const bytes = Buffer.byteLength(c.text, 'utf8');
    if (c.text.length > limits.textUnits || bytes > limits.textBytes)
      return deny('capacity', 'text');
    if (world.blobs.some((b) => b.containerId === c.containerId && b.name === c.name))
      return deny('duplicate-name', 'name');
    if (
      world.blobs.length >= limits.blobs ||
      world.blobs.reduce((sum, b) => sum + b.byteLength, 0) + bytes > limits.totalBytes
    )
      return deny('capacity', 'text');
    id = `blob-${world.nextId}`;
    next.blobs.push({
      id,
      name: c.name,
      containerId: c.containerId,
      text: c.text,
      contentType: 'text/plain',
      byteLength: bytes,
      sha256: createHash('sha256').update(c.text, 'utf8').digest('hex'),
      origin: request.commandId,
    });
  }
  next = { ...next, revision: world.revision + 1, nextId: world.nextId + 1 };
  return {
    world: next,
    receipt: {
      ...receipt,
      outcome: 'accepted',
      code: 'created',
      ruleId: 'lab-storage@3',
      afterRevision: next.revision,
      afterCount: count(next),
      addedIds: [id],
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
    const e = entries[i]!;
    const request = parseRequest(e.request);
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
