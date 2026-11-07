import { laboratoryModel, type World as RoutingWorld } from '../v32/contract';
import type { World } from './contract';
/** Read-only adaptation to the frozen routing/resource rules; never an authority or persisted conversion. */
export const routingProjection = (w: World): RoutingWorld => ({
  model: laboratoryModel,
  revision: w.revision,
  nextId: w.nextId,
  attempt: w.attempt,
  groups: w.groups,
  accounts: w.accounts,
  containers: w.containers,
  blobs: w.blobs,
  vnets: w.vnets,
  subnets: w.subnets,
  nsgs: w.nsgs,
  securityRules: w.securityRules,
  peerings: w.peerings,
  routeTables: w.routeTables,
  routes: w.routes,
});
