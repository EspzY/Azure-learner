import type * as P from '../v36/contract';
import { laboratoryModel as previousModel } from '../v36/contract';
import type { World } from './contract';
/** Private legacy-validator input only; never persisted or used as authorization.
 * Access effects are evaluated separately in3.7, not erased in stored World. */
export const remediationProjection = (world: World): P.World => ({
  ...world,
  model: previousModel,
  peerings: world.peerings.map((p) => ({
    id: p.id,
    name: p.name,
    vnetId: p.vnetId,
    remoteVnetId: p.remoteVnetId,
    origin: p.origin,
    allowForwardedTraffic: p.allowForwardedTraffic,
    forwardingOrigin: p.forwardingOrigin,
    allowVirtualNetworkAccess: true,
  })),
});
