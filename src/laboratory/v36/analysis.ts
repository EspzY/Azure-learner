/** Same frozen route/NSG/Firewall evaluators, applied to actual updated configuration.
 * Only read-only result provenance is lifted to the new workspace model. */
import * as previous from '../v35/analysis';
import type { PolicyInput } from '../v33/policy';
import { firewallProjection } from './projection';
import { laboratoryModel, type World } from './contract';
export type RouteAnalysis = Omit<previous.RouteAnalysis, 'model'> & {
  model: typeof laboratoryModel;
};
const lift = (r: previous.RouteAnalysis | null): RouteAnalysis | null =>
  r ? { ...r, model: laboratoryModel } : null;
export type FirewallPath = Omit<
  previous.FirewallPath,
  | 'forwardRoute'
  | 'nextHopRoute'
  | 'returnNextHopRoute'
  | 'onwardRoute'
  | 'returnRoute'
  | 'hubReturnRoute'
> & {
  forwardRoute: RouteAnalysis | null;
  nextHopRoute: RouteAnalysis | null;
  returnNextHopRoute: RouteAnalysis | null;
  onwardRoute: RouteAnalysis | null;
  returnRoute: RouteAnalysis | null;
  hubReturnRoute: RouteAnalysis | null;
};
export type PolicyAnalysis = Omit<previous.PolicyAnalysis, 'model' | 'route' | 'firewallPath'> & {
  model: typeof laboratoryModel;
  route: RouteAnalysis | null;
  firewallPath: FirewallPath;
};
export function analyseRoutes(world: World, subnetId: string, destination: string) {
  const r = previous.analyseRoutes(firewallProjection(world), subnetId, destination);
  return r.ok
    ? {
        ok: true as const,
        analysis: { ...r.analysis, model: laboratoryModel } satisfies RouteAnalysis,
      }
    : r;
}
export function analysePolicy(world: World, input: PolicyInput) {
  const r = previous.analysePolicy(firewallProjection(world), input);
  if (!r.ok) return r;
  const p = r.analysis.firewallPath;
  return {
    ok: true as const,
    analysis: {
      ...r.analysis,
      model: laboratoryModel,
      route: lift(r.analysis.route),
      firewallPath: {
        ...p,
        forwardRoute: lift(p.forwardRoute),
        nextHopRoute: lift(p.nextHopRoute),
        returnNextHopRoute: lift(p.returnNextHopRoute),
        onwardRoute: lift(p.onwardRoute),
        returnRoute: lift(p.returnRoute),
        hubReturnRoute: lift(p.hubReturnRoute),
      },
    } satisfies PolicyAnalysis,
  };
}
