import * as previous from '../v38/domain';
import type * as P from '../v38/contract';
import { limits } from '../v3/contract';
import type { Region } from '../../domain/simulation';
import {
  applyDelivery,
  deliveryResources,
  freshDeliveryState,
  isDeliveryCommand,
  validateDeliveryTopology,
} from '../delivery/domain';
import { applyDataCommand, dataCommandTypes, dataResources, freshDataState } from '../data/domain';
import type { DataCommand } from '../data/contract';
import {
  applicationProjection,
  dataContext,
  deliveryContext,
  integrationReferences,
} from './projection';
import { laboratoryModel, type Entry, type Receipt, type Request, type World } from './contract';

export const canonical = previous.canonical;
export const parseRequest = (value: unknown): Request | null =>
  previous.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({
  ...previous.freshWorld(),
  model: laboratoryModel,
  delivery: freshDeliveryState(),
  data: freshDataState(),
});
export const resources = (world: World) => [
  ...previous.resources(applicationProjection(world)),
  ...deliveryResources(world.delivery),
  ...dataResources(world.data),
];

/** Cross-family invariants apply to both old and newly integrated command paths. */
function invariant(world: World): { code: Receipt['code']; field?: string } | null {
  if (resources(world).length > limits.entities) return { code: 'capacity' };
  const apps = [...world.webApps, ...world.data.functionApps];
  if (
    apps.some((a, i) =>
      apps.some((b, j) => i !== j && a.name.toLowerCase() === b.name.toLowerCase()),
    )
  )
    return { code: 'duplicate-name', field: 'name' };
  const plans = [...world.plans, ...world.data.functionPlans];
  if (
    plans.some((a, i) =>
      plans.some(
        (b, j) =>
          i !== j && a.groupId === b.groupId && a.name.toLowerCase() === b.name.toLowerCase(),
      ),
    )
  )
    return { code: 'duplicate-name', field: 'name' };
  if (
    world.data.databaseConnections.some((b) =>
      world.settings.some(
        (s) => s.webAppId === b.source.id && s.name.toLowerCase() === b.settingName.toLowerCase(),
      ),
    )
  )
    return { code: 'duplicate-name', field: 'settingName' };
  const topology = validateDeliveryTopology(world.delivery, deliveryContext(world));
  return topology ? { code: topology.code, field: topology.field } : null;
}
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const type = request.command.type;
  const base: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType: 'local/integrated-resource',
    scopeId: '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-integration@3.9',
    addedIds: [],
    updatedIds: [],
    removedIds: [],
    beforeCount: resources(world).length,
    afterCount: resources(world).length,
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({ world, receipt: { ...base, code, outcome, ...(field === undefined ? {} : { field }) } });
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  let next: World, receipt: Receipt;
  if (isDeliveryCommand(type)) {
    const proposal = applyDelivery(
      world.delivery,
      request.command,
      deliveryContext(world, request.commandId),
    );
    const { state, nextId, before, after, region, ...evidence } = proposal;
    if (proposal.outcome !== 'accepted')
      return { world, receipt: { ...base, ...evidence, location: region as Region | null } };
    next = { ...world, delivery: state, nextId, revision: world.revision + 1 };
    receipt = { ...base, ...evidence, location: region as Region | null };
    const created = proposal.addedIds.length
      ? deliveryResources(state).find((r) => r.id === proposal.addedIds[0])
      : undefined;
    const change = (after ?? before ?? created) as {
      id: string;
      name: string;
      type: string;
      origin: string;
    };
    receipt.integrationChange = {
      id: change.id,
      name: change.name,
      type: change.type,
      parentId: evidence.scopeId,
      createOrigin: change.origin,
      before: (before as Record<string, unknown> | undefined) ?? null,
      after: ((after ?? created) as Record<string, unknown> | undefined) ?? null,
    };
  } else if (dataCommandTypes.includes(type)) {
    const proposal = applyDataCommand(
      world.data,
      request.command as DataCommand,
      dataContext(world, request.commandId),
    );
    if (!proposal.ok)
      return deny(
        proposal.code,
        proposal.field,
        proposal.code.startsWith('unsupported-') ? 'unsupported' : 'rejected',
      );
    // JSONB may reorder nested keys. A semantic no-op must produce the same
    // rejected original receipt as fresh replay, before any revision or delta.
    if (
      proposal.before !== null &&
      proposal.after !== null &&
      canonical(proposal.before) === canonical(proposal.after)
    )
      return deny('no-change');
    const { state, nextId, before, after, region, ok, ...evidence } = proposal;
    void ok;
    next = { ...world, data: state, nextId, revision: world.revision + 1 };
    receipt = {
      ...base,
      ...evidence,
      outcome: 'accepted',
      code: proposal.addedIds.length
        ? 'created'
        : proposal.removedIds.length
          ? 'deleted'
          : 'updated',
      location: region as Region,
    };
    const change = (after ?? before) as { id: string; name: string; type: string; origin: string };
    receipt.integrationChange = {
      id: change.id,
      name: change.name,
      type: change.type,
      parentId: evidence.scopeId,
      createOrigin: change.origin,
      before,
      after,
    };
  } else if (['DeleteStorageAccount', 'DeleteBlobContainer'].includes(type)) {
    const raw = request.command as unknown as Record<string, string>;
    const field = type === 'DeleteStorageAccount' ? 'accountId' : 'containerId';
    const extra = Object.keys(raw)
      .sort()
      .find((key) => !['type', field].includes(key));
    if (extra !== undefined) return deny('unsupported-field', extra, 'unsupported');
    if (typeof raw[field] !== 'string') return deny('invalid-command');
    const collection = type === 'DeleteStorageAccount' ? 'accounts' : 'containers';
    const resource = world[collection].find((r) => r.id === raw[field]);
    if (!resource) return deny('invalid-parent', field);
    if (
      (type === 'DeleteStorageAccount' &&
        world.containers.some((r) => r.accountId === resource.id)) ||
      (type === 'DeleteBlobContainer' && world.blobs.some((r) => r.containerId === resource.id))
    )
      return deny('resource-in-use', field);
    if (integrationReferences(world).some((ref) => ref.targetId === resource.id))
      return deny('resource-in-use', field);
    const snapshot = structuredClone(resource) as unknown as Record<string, unknown>;
    const parentId = 'groupId' in resource ? resource.groupId : resource.accountId;
    next = structuredClone(world);
    if (collection === 'accounts')
      next.accounts = next.accounts.filter((r) => r.id !== resource.id);
    else next.containers = next.containers.filter((r) => r.id !== resource.id);
    next.revision++;
    receipt = {
      ...base,
      outcome: 'accepted',
      code: 'deleted',
      scopeId: parentId,
      targetType:
        type === 'DeleteStorageAccount'
          ? 'Microsoft.Storage/storageAccounts'
          : 'local/blob-container',
      removedIds: [resource.id],
      integrationChange: {
        id: resource.id,
        name: resource.name,
        type:
          type === 'DeleteStorageAccount'
            ? 'Microsoft.Storage/storageAccounts'
            : 'local/blob-container',
        parentId,
        createOrigin: resource.origin,
        before: snapshot,
        after: null,
      },
    };
  } else {
    const result = previous.execute(applicationProjection(world), request as P.Request, sequence);
    if (result.receipt.outcome !== 'accepted')
      return {
        world,
        receipt: { ...result.receipt, beforeCount: base.beforeCount, afterCount: base.afterCount },
      };
    const resetting = type === 'ResetWorkspace';
    next = {
      ...result.world,
      model: laboratoryModel,
      delivery: resetting ? freshDeliveryState() : world.delivery,
      data: resetting ? freshDataState() : world.data,
    };
    receipt = {
      ...result.receipt,
      beforeCount: base.beforeCount,
      ...(resetting ? { removedIds: resources(world).map((r) => r.id) } : {}),
    };
  }
  const problem = invariant(next);
  if (problem) return deny(problem.code, problem.field);
  const removed = new Set(receipt.removedIds);
  if (integrationReferences(world).some((r) => removed.has(r.targetId) && !removed.has(r.sourceId)))
    return deny('resource-in-use');
  return {
    world: next,
    receipt: { ...receipt, afterRevision: next.revision, afterCount: resources(next).length },
  };
}
export function replay(entries: Entry[], through = entries.length): World | null {
  if (
    !Number.isSafeInteger(through) ||
    through < 0 ||
    through > entries.length ||
    entries.length > limits.events
  )
    return null;
  let world = freshWorld();
  const seen = new Set<string>();
  for (let i = 0; i < through; i++) {
    const entry = entries[i]!,
      request = parseRequest(entry.request);
    if (
      entry.model !== laboratoryModel ||
      !request ||
      seen.has(request.commandId) ||
      entry.attempt !== world.attempt
    )
      return null;
    seen.add(request.commandId);
    const result = execute(world, request, i + 1);
    if (canonical(entry.receipt) !== canonical(result.receipt)) return null;
    world = result.world;
  }
  return world;
}
