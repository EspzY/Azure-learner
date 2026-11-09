import type { World } from '@/laboratory/engine';
import type { World as Previous } from '@/laboratory/v35/contract';
import type { World as Current } from '@/laboratory/v36/contract';
import { computeProjection } from '@/laboratory/v35/projection';
import { firewallProjection } from '@/laboratory/v36/projection';
import type { World as Topology } from '@/laboratory/v37/contract';
import type { World as Application } from '@/laboratory/v38/contract';
import { topologyProjection } from '@/laboratory/v38/projection';
import { remediationProjection } from '@/laboratory/v37/projection';
import { peeringStatus } from '@/laboratory/v32/peering';
import { routingProjection } from '@/laboratory/v33/projection';
import { endpointProjection } from '@/laboratory/v34/projection';
export const isFirewallWorld = (
  w: World | undefined,
): w is Previous | Current | Topology | Application =>
  w?.model === 'laboratory@3.5.0' ||
  w?.model === 'laboratory@3.6.0' ||
  w?.model === 'laboratory@3.7.0' ||
  w?.model === 'laboratory@3.8.0';
/** Existing pure render projection; no alternate resource authority. */
export const computeView = (w: Previous | Current | Topology | Application) => {
  const source = w.model === 'laboratory@3.8.0' ? topologyProjection(w) : w;
  const v = source.model === 'laboratory@3.7.0' ? remediationProjection(source) : source;
  return computeProjection(v.model === 'laboratory@3.6.0' ? firewallProjection(v) : v);
};
/** Relationship status ignores access flags; those remain separate Properties/analysis. */
export function peeringState(w: Extract<World, { peerings: unknown }>, id: string) {
  const projected = isFirewallWorld(w)
    ? routingProjection(endpointProjection(computeView(w)))
    : w.model === 'laboratory@3.4.0'
      ? routingProjection(endpointProjection(w))
      : w.model === 'laboratory@3.3.0'
        ? routingProjection(w)
        : w;
  return peeringStatus(
    projected,
    projected.peerings.find((p) => p.id === id)!,
  );
}
