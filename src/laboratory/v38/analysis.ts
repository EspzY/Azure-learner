import * as previous from '../v37/analysis';
import type { PolicyInput } from '../v33/policy';
import { topologyProjection, webAppReferences } from './projection';
import type { World } from './contract';
import { laboratoryModel } from './contract';
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
const liftRoute = (r: previous.RouteAnalysis | null): RouteAnalysis | null =>
  r ? { ...r, model: laboratoryModel } : null;
export function analyseRoutes(w: World, subnetId: string, destination: string) {
  const r = previous.analyseRoutes(topologyProjection(w), subnetId, destination);
  return r.ok
    ? { ok: true as const, analysis: { ...r.analysis, model: laboratoryModel } as RouteAnalysis }
    : r;
}
export function analysePolicy(w: World, packet: PolicyInput) {
  const r = previous.analysePolicy(topologyProjection(w), packet);
  if (!r.ok) return r;
  const a = r.analysis;
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
/** Configuration consistency only. There is no actual web server, probe or network request. */
export function analyseWebApp(w: World, id: string) {
  const app = webAppReferences(w).find((a) => a.id === id);
  if (!app) return null;
  const issues = [
    ...(!w.plans.some((p) => p.id === w.webApps.find((a) => a.id === id)?.planId)
      ? ['missing-plan']
      : []),
    ...(!app.enabled ? ['disabled'] : []),
    ...(app.publicNetworkAccess === 'Disabled' ? ['public-access-disabled'] : []),
    ...(app.deployment === 'none' ? ['no-deployment'] : []),
    ...(app.deployment === 'synthetic-http' && app.responseStatus !== 200
      ? ['synthetic-response-unavailable']
      : []),
  ];
  return {
    model: laboratoryModel,
    revision: w.revision,
    webAppId: app.id,
    planId: w.webApps.find((a) => a.id === id)!.planId,
    status: issues.length ? 'configuration-incomplete' : 'synthetic-configuration-consistent',
    issues,
    syntheticResponse:
      app.deployment === 'none'
        ? null
        : {
            contentType: 'text/plain',
            text:
              app.settings.find((s) => s.name.toUpperCase() === 'APP_GREETING')?.value ??
              'Hello from the AzureLab synthetic application',
          },
    application:
      app.deployment === 'none'
        ? null
        : { healthPath: app.healthPath, responseStatus: app.responseStatus },
    boundary:
      'Configuration analysis only; no runtime, live request, DNS, authentication or verified availability.',
  };
}
