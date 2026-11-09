import type { World } from '@/domain/chapter01/model';
import { inventory, type InventoryRow } from '@/domain/portal/model';
import { nb } from '@/content/nb';
import type { PortalDestination, PortalResourceLink } from './home';
import { scopeLocations, type PortalSubscription } from './subscriptions';
export function courseResourceLink(
  world: World,
  row: InventoryRow,
  destination: (id: string) => PortalDestination,
): PortalResourceLink {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    type: nb.portal.graph.types[row.kind],
    group: world.groups.find((g) => g.id === row.groupId)?.name ?? '',
    subscription: world.scopes.find((s) => s.id === row.subscriptionId)?.name ?? row.subscriptionId,
    destination: destination(row.id),
  };
}
export function courseSubscriptions(
  world: World,
  destination: (id: string) => PortalDestination,
): PortalSubscription[] {
  const rows = inventory(world);
  return world.scopes
    .filter((s) => s.kind === 'subscription')
    .map((scope) => {
      const groups = rows.filter((r) => r.kind === 'group' && r.subscriptionId === scope.id);
      const resources = rows.filter(
        (r) => r.kind !== 'group' && r.kind !== 'subscription' && r.subscriptionId === scope.id,
      );
      return {
        id: scope.id,
        name: scope.name,
        groups: groups.map((r) => courseResourceLink(world, r, destination)),
        resources: resources.map((r) => courseResourceLink(world, r, destination)),
        resourceLocations: scopeLocations(resources.map((r) => r.location ?? '')),
        metadataLocations: scopeLocations(groups.map((r) => r.location ?? '')),
      };
    });
}
