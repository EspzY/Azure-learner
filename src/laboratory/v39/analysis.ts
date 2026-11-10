import * as previous from '../v38/analysis';
import type { PolicyInput } from '../v33/policy';
import { applicationProjection } from './projection';
import { laboratoryModel, type World } from './contract';

export type RouteAnalysis = Omit<previous.RouteAnalysis, 'model'> & {
  model: typeof laboratoryModel;
};
type RouteKey =
  | 'forwardRoute'
  | 'nextHopRoute'
  | 'returnNextHopRoute'
  | 'onwardRoute'
  | 'returnRoute'
  | 'hubReturnRoute';
export type PolicyAnalysis = Omit<previous.PolicyAnalysis, 'model' | 'route' | 'firewallPath'> & {
  model: typeof laboratoryModel;
  route: RouteAnalysis | null;
  firewallPath: Omit<previous.PolicyAnalysis['firewallPath'], RouteKey> &
    Record<RouteKey, RouteAnalysis | null>;
};
const liftRoute = (route: previous.RouteAnalysis | null): RouteAnalysis | null =>
  route ? { ...route, model: laboratoryModel } : null;
export function analyseRoutes(world: World, subnetId: string, destination: string) {
  const result = previous.analyseRoutes(applicationProjection(world), subnetId, destination);
  return result.ok
    ? {
        ok: true as const,
        analysis: { ...result.analysis, model: laboratoryModel } as RouteAnalysis,
      }
    : result;
}
export function analysePolicy(world: World, packet: PolicyInput) {
  const result = previous.analysePolicy(applicationProjection(world), packet);
  if (!result.ok) return result;
  const a = result.analysis;
  const analysis: PolicyAnalysis = {
    ...a,
    model: laboratoryModel,
    route: liftRoute(a.route),
    firewallPath: {
      ...a.firewallPath,
      forwardRoute: liftRoute(a.firewallPath.forwardRoute),
      nextHopRoute: liftRoute(a.firewallPath.nextHopRoute),
      returnNextHopRoute: liftRoute(a.firewallPath.returnNextHopRoute),
      onwardRoute: liftRoute(a.firewallPath.onwardRoute),
      returnRoute: liftRoute(a.firewallPath.returnRoute),
      hubReturnRoute: liftRoute(a.firewallPath.hubReturnRoute),
    },
  };
  return { ok: true as const, analysis };
}
export function analyseWebApp(world: World, id: string) {
  const analysis = previous.analyseWebApp(applicationProjection(world), id);
  return analysis ? { ...analysis, model: laboratoryModel } : null;
}
