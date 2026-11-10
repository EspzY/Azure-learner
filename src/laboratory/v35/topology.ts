import { peeringStatus } from '../v32/peering';
import { routingProjection } from '../v33/projection';
import { endpointProjection } from '../v34/projection';
import { computeProjection } from './projection';
import type { World, Firewall } from './contract';
export function connected(world: World, local: string, remote: string) {
  const p = world.peerings.find((x) => x.vnetId === local && x.remoteVnetId === remote);
  return (
    !!p &&
    peeringStatus(routingProjection(endpointProjection(computeProjection(world))), p) ===
      'Connected'
  );
}
export function subscription(world: World, groupId: string) {
  return world.groups.find((g) => g.id === groupId)?.subscriptionId;
}
export function firewallVnet(world: World, firewall: Firewall) {
  return world.subnets.find((s) => s.id === firewall.subnetId)?.vnetId;
}
export function firewallReachable(world: World, firewall: Firewall, subnetId: string) {
  const subnet = world.subnets.find((s) => s.id === subnetId),
    vnet = world.vnets.find((v) => v.id === subnet?.vnetId),
    hub = firewallVnet(world, firewall);
  return (
    !!subnet &&
    !!vnet &&
    !!hub &&
    vnet.id !== hub &&
    vnet.region === firewall.region &&
    subscription(world, vnet.groupId) === subscription(world, firewall.groupId) &&
    connected(world, vnet.id, hub)
  );
}
