import type { World } from '@/laboratory/engine';
import type { LaboratoryResource } from './portal-adapter';
import type { PortalResourceLink, PortalDestination } from '@/features/portal/home';
import { scopeLocations, type PortalSubscription } from '@/features/portal/subscriptions';
/** These two fixed simulator scopes are the exact allowlist validated by every frozen v3 CreateGroup.
 * They are display metadata, never new subscription resources or a second inventory. */
export const laboratoryScopes = [
  { id: 'sub-shared', name: 'Shared Sandbox' },
  { id: 'sub-app', name: 'App Sandbox' },
] as const;
export function laboratoryResourceLink(
  row: LaboratoryResource,
  destination: (view: string, id: string) => PortalDestination,
): PortalResourceLink {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    type: row.typeName,
    group: row.category === 'scope' ? '' : row.groupName,
    subscription: row.subscriptionName,
    destination: destination(row.view, row.id),
  };
}
export function laboratorySubscriptions(
  world: World,
  rows: readonly LaboratoryResource[],
  destination: (view: string, id: string) => PortalDestination,
): PortalSubscription[] {
  return laboratoryScopes.map((scope) => {
    const groups = rows.filter((r) => r.view === 'group' && r.subscriptionId === scope.id);
    const resources = rows.filter(
      (r) => r.category === 'resource' && r.subscriptionId === scope.id,
    );
    return {
      ...scope,
      groups: groups.map((r) => laboratoryResourceLink(r, destination)),
      resources: resources.map((r) => laboratoryResourceLink(r, destination)),
      resourceLocations: scopeLocations(resources.map((r) => r.location)),
      metadataLocations: scopeLocations(
        world.groups.filter((g) => g.subscriptionId === scope.id).map((g) => g.metadataRegion),
      ),
    };
  });
}
