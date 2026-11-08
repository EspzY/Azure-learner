import * as previous from '../v35/domain';
import * as P from '../v35/contract';
import { firewallProjection } from './projection';
import { limits } from '../v3/contract';
import {
  laboratoryModel,
  lifecycleFields,
  nsgEditable,
  firewallEditable,
  type World,
  type Request,
  type Receipt,
  type Entry,
  type RuleChange,
} from './contract';
export const canonical = previous.canonical;
export const parseRequest = (value: unknown): Request | null =>
  previous.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({ ...previous.freshWorld(), model: laboratoryModel });
export const resources = (world: World) => previous.resources(firewallProjection(world));
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command,
    type = c.type;
  if (!Object.hasOwn(lifecycleFields, type)) {
    // JSONB does not preserve object insertion order. Only the new epoch uses
    // this private canonical evaluation copy; the original request stays intact.
    const ordered = { ...request, command: JSON.parse(canonical(c)) as P.Command };
    const result = previous.execute(firewallProjection(world), ordered, sequence);
    return {
      world:
        result.receipt.outcome === 'accepted' ? { ...result.world, model: laboratoryModel } : world,
      receipt: result.receipt,
    };
  }
  const raw = c as unknown as Record<string, string>,
    nsg = type.endsWith('SecurityRule'),
    deleting = type.startsWith('Delete');
  const receipt: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType: nsg
      ? 'Microsoft.Network/networkSecurityGroups/securityRules'
      : 'local/firewallNetworkRule',
    scopeId: (nsg ? raw.nsgId : raw.collectionId) ?? '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-security-lifecycle@3.6',
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
    receipt: { ...receipt, code, outcome, ...(field !== undefined ? { field } : {}) },
  });
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  const fields = lifecycleFields[type as keyof typeof lifecycleFields];
  const extra = Object.keys(c)
    .sort()
    .find((k) => !fields.includes(k));
  if (extra !== undefined) return deny('unsupported-field', extra, 'unsupported');
  if (fields.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  if (nsg && raw.ruleId!.startsWith('default:'))
    return deny('read-only-rule', 'ruleId', 'unsupported');
  const original = nsg
    ? world.securityRules.find((r) => r.id === raw.ruleId)
    : world.firewallRules.find((r) => r.id === raw.ruleId);
  if (!original) return deny('invalid-parent', 'ruleId');
  const parentId = 'nsgId' in original ? original.nsgId : original.collectionId;
  if (parentId !== (nsg ? raw.nsgId : raw.collectionId))
    return deny('incompatible-association', nsg ? 'nsgId' : 'collectionId');
  if (nsg) {
    const parent = world.nsgs.find((r) => r.id === parentId);
    if (!parent) return deny('invalid-parent', 'nsgId');
    receipt.location = parent.region as Receipt['location'];
  } else {
    const collection = world.firewallCollections.find((r) => r.id === parentId),
      group = world.firewallGroups.find((r) => r.id === collection?.collectionGroupId),
      policy = world.firewallPolicies.find((r) => r.id === group?.policyId);
    if (!collection || !group || !policy) return deny('invalid-parent', 'collectionId');
    receipt.location = policy.region as Receipt['location'];
  }
  const editable = nsg ? nsgEditable : firewallEditable;
  const config = (r: object) =>
    Object.fromEntries(
      editable.map((k) => [k, (r as Record<string, string | number>)[k]!]),
    ) as RuleChange['before'];
  let next = structuredClone(world),
    after: RuleChange['after'] = null;
  if (deleting) {
    if (nsg) next.securityRules = next.securityRules.filter((r) => r.id !== original.id);
    else next.firewallRules = next.firewallRules.filter((r) => r.id !== original.id);
  } else {
    // Remove only the target from a private proposal. This reuses the full frozen
    // Create validator, including name/default protection, parent, conflict and budgets.
    // Its allocated ID/World/receipt are discarded, not written as a technical operation.
    const proposal = firewallProjection(world);
    let command: P.Command;
    if (nsg && 'nsgId' in original) {
      proposal.securityRules = proposal.securityRules.filter((r) => r.id !== original.id);
      command = {
        type: 'CreateSecurityRule',
        nsgId: parentId,
        name: original.name,
        ...Object.fromEntries(nsgEditable.map((k) => [k, raw[k]])),
      } as P.Command;
    } else {
      proposal.firewallRules = proposal.firewallRules.filter((r) => r.id !== original.id);
      command = {
        type: 'CreateFirewallNetworkRule',
        collectionId: parentId,
        name: original.name,
        ...Object.fromEntries(firewallEditable.map((k) => [k, raw[k]])),
      } as P.Command;
    }
    const validation = previous.execute(proposal, { ...request, command }, sequence);
    if (validation.receipt.outcome !== 'accepted')
      return deny(validation.receipt.code, validation.receipt.field, validation.receipt.outcome);
    const candidate = nsg
      ? validation.world.securityRules.find((r) => r.id === validation.receipt.addedIds[0])!
      : validation.world.firewallRules.find((r) => r.id === validation.receipt.addedIds[0])!;
    after = config(candidate);
    if (canonical(after) === canonical(config(original))) return deny('no-change');
    if (nsg && 'nsgId' in candidate)
      next.securityRules = next.securityRules.map((r) =>
        r.id === original.id ? { ...candidate, id: original.id, origin: original.origin } : r,
      );
    else if ('collectionId' in candidate)
      next.firewallRules = next.firewallRules.map((r) =>
        r.id === original.id ? { ...candidate, id: original.id, origin: original.origin } : r,
      );
  }
  next = { ...next, revision: world.revision + 1 };
  return {
    world: next,
    receipt: {
      ...receipt,
      outcome: 'accepted',
      code: 'updated',
      afterRevision: next.revision,
      afterCount: resources(next).length,
      removedIds: deleting ? [original.id] : [],
      updatedIds: deleting ? [] : [original.id],
      change: {
        id: original.id,
        name: original.name,
        parentId,
        createOrigin: original.origin,
        before: config(original),
        after,
      },
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
