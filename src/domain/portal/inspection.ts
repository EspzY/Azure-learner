import { inventory, portalHref, parseLocation } from './model';
import type { Engine } from '../sandbox/model';

export type InspectionContext = 'vm' | 'policy' | 'app';
export type LedgerEntry = Engine['ledger'][number];
/** Read-only projection of the original ledger; references never mean modification. */
export function resourceOperations(engine: Engine, id: string) {
  if (!id) return [];
  // Scope ancestry is read from the original hierarchy, including a group that
  // was later removed. This is a transient projection, never a second inventory.
  const parents = new Map<string, string | null>(
    engine.world.scopes.map((s) => [s.id, s.parentId ?? null]),
  );
  for (const e of engine.ledger) {
    if (
      e.receipt.operation === 'CreateGroup' &&
      e.receipt.outcome === 'accepted' &&
      typeof e.request.command.subscriptionId === 'string'
    )
      for (const group of e.receipt.addedIds) parents.set(group, e.request.command.subscriptionId);
  }
  for (const group of engine.world.groups) parents.set(group.id, group.subscriptionId);
  const inScope = (scope: string) => {
    const seen = new Set<string>();
    let current: string | null = scope;
    while (current && !seen.has(current)) {
      if (current === id) return true;
      seen.add(current);
      current = parents.get(current) ?? null;
    }
    return false;
  };
  return engine.ledger.flatMap((entry) => {
    const c = entry.request.command,
      r = entry.receipt;
    const target =
      c.appId === id || c.vmId === id || (c.type === 'DeleteEmptyGroup' && c.groupId === id);
    const basis =
      r.addedIds.includes(id) || r.removedIds.includes(id) || target
        ? ('resource' as const)
        : c.planId === id || c.subnetId === id
          ? ('reference' as const)
          : inScope(r.scopeId)
            ? ('scope' as const)
            : null;
    return basis ? [{ entry, basis }] : [];
  });
}
export function receiptReferences(engine: Engine, entry: LedgerEntry) {
  const c = entry.request.command,
    r = entry.receipt;
  const ids = [
    ...new Set(
      [
        ...r.addedIds,
        ...r.removedIds,
        c.appId,
        c.vmId,
        c.groupId,
        c.planId,
        c.subnetId,
        r.scopeId,
      ].filter((id): id is string => typeof id === 'string' && !!id),
    ),
  ];
  const rows = inventory(engine.world);
  return ids.map((id) => ({
    id,
    row: rows.find((r) => r.id === id),
    added: r.addedIds.includes(id),
    removed: r.removedIds.includes(id),
  }));
}
export function inspectionChoices(engine: Engine, context: InspectionContext) {
  return context === 'policy'
    ? engine.ledger
        .filter((e) => e.receipt.code === 'policy-location-denied')
        .map((e) => ({
          id: e.receipt.commandId,
          name: String(e.request.command.name ?? e.receipt.commandId),
        }))
    : inventory(engine.world)
        .filter((r) => r.kind === context)
        .map((r) => ({ id: r.id, name: r.name }));
}
/** The three existing native course origins, not another return/resume register. */
export function inspectionHref(context: InspectionContext, id: string) {
  const origin =
    context === 'vm' ? 'compute=vm' : context === 'policy' ? 'governance=policy' : 'tools=intent';
  return portalHref(
    parseLocation(new URLSearchParams(origin)),
    context === 'policy' ? 'activity' : 'resource',
    { id },
  );
}

/** Presentation allowlist, not command validation. Unknown fields remain in the
 * original ledger/export but are never rendered as supported configuration. */
export const requestDisplayKeys = [
  'subscriptionId',
  'groupId',
  'name',
  'metadataRegion',
  'region',
  'profile',
  'planId',
  'image',
  'dataDiskGiB',
  'subnetId',
  'vmId',
  'appId',
  'environment',
  'catalogMode',
] as const;
export function requestConfiguration(entry: LedgerEntry) {
  return Object.entries(entry.request.command).filter(
    (pair): pair is [(typeof requestDisplayKeys)[number], string] =>
      requestDisplayKeys.includes(pair[0] as (typeof requestDisplayKeys)[number]) &&
      typeof pair[1] === 'string',
  );
}
