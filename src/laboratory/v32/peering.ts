import type { World, Peering } from './contract';
/** Derived from original directional records; never a separately persisted status. */
export const peeringStatus = (world: World, peering: Peering): 'Initiated' | 'Connected' =>
  world.peerings.some((p) => p.vnetId === peering.remoteVnetId && p.remoteVnetId === peering.vnetId)
    ? 'Connected'
    : 'Initiated';
