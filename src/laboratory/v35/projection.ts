import * as P from '../v34/contract';
import type { World } from './contract';
/** Private selection/validator input only. VirtualAppliance uses a placeholder,
 * never a persisted None route. Callers restore actual route identity after LPM. */
export function computeProjection(world: World): P.World {
  return {
    model: P.laboratoryModel,
    revision: world.revision,
    nextId: world.nextId,
    attempt: world.attempt,
    groups: world.groups,
    accounts: world.accounts,
    containers: world.containers,
    blobs: world.blobs,
    vnets: world.vnets,
    subnets: world.subnets,
    nsgs: world.nsgs,
    securityRules: world.securityRules,
    routeTables: world.routeTables,
    nics: world.nics,
    vms: world.vms,
    disks: world.disks,
    routes: world.routes.map((r) =>
      r.nextHopType === 'VirtualAppliance'
        ? {
            id: r.id,
            name: r.name,
            routeTableId: r.routeTableId,
            addressPrefix: r.addressPrefix,
            nextHopType: 'None',
            origin: r.origin,
          }
        : r,
    ),
    peerings: world.peerings.map(
      ({ id, name, vnetId, remoteVnetId, allowVirtualNetworkAccess, origin }) => ({
        id,
        name,
        vnetId,
        remoteVnetId,
        allowVirtualNetworkAccess,
        origin,
      }),
    ),
  };
}
