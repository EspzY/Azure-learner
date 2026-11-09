import type { DeliveryState, DeliveryContext, WebAppView, Origin, WafRule } from './contract';
import { validDeliveryPath } from './domain';

export interface DeliveryAnalysisContext extends DeliveryContext {
  workspace: string;
  model: string;
  revision: number;
}
export type DeliveryAnalysisStatus =
  | 'configuration-consistent'
  | 'blocked-by-waf'
  | 'no-matching-route'
  | 'disabled-endpoint'
  | 'undetermined'
  | 'unsupported-input';
export interface DeliveryAnalysis {
  binding: { workspace: string; model: string; revision: number };
  service: 'FrontDoor' | 'ApplicationGateway';
  resourceId: string;
  status: DeliveryAnalysisStatus;
  routeId: string | null;
  eligibleOriginIds: string[];
  backendIds: string[];
  waf: {
    policyId: string;
    ruleId: string | null;
    action: 'Allow' | 'Block' | 'NoMatch';
    mode: 'Detection' | 'Prevention';
  } | null;
  probes: ProbeDecision[];
  steps: { type: string; resourceId: string; reason: string }[];
  networkPolicy: 'not-evaluated';
  connectivity: 'not-verified';
}
export interface ProbeDecision {
  originId: string;
  webAppId: string;
  basis: 'synthetic-configuration';
  path: string;
  result: 'modeled-200' | 'modeled-non-200' | 'unavailable-configuration';
  reason: string;
}
const initial = (
  service: DeliveryAnalysis['service'],
  resourceId: string,
  ctx: DeliveryAnalysisContext,
): DeliveryAnalysis => ({
  binding: { workspace: ctx.workspace, model: ctx.model, revision: ctx.revision },
  service,
  resourceId,
  status: 'undetermined',
  routeId: null,
  eligibleOriginIds: [],
  backendIds: [],
  waf: null,
  probes: [],
  steps: [],
  networkPolicy: 'not-evaluated',
  connectivity: 'not-verified',
});
/** A hypothetical probe is evaluated against a declared synthetic application profile.
 * This is neither sampled health telemetry nor a real HTTP probe. */
export function assessSyntheticProbe(
  app: WebAppView | undefined,
  originId: string,
  webAppId: string,
  path: string,
): ProbeDecision {
  const base = { originId, webAppId, basis: 'synthetic-configuration' as const, path };
  if (!app || app.type !== 'Microsoft.Web/sites')
    return {
      ...base,
      result: 'unavailable-configuration',
      reason: 'The referenced Web App is absent from the current World.',
    };
  if (!app.enabled)
    return {
      ...base,
      result: 'unavailable-configuration',
      reason: 'The Web App configuration is disabled.',
    };
  if (app.publicNetworkAccess !== 'Enabled')
    return {
      ...base,
      result: 'unavailable-configuration',
      reason: 'Public backend access is disabled; this profile has no Private Link path.',
    };
  if (app.deployment !== 'synthetic-http')
    return {
      ...base,
      result: 'unavailable-configuration',
      reason: 'No supported synthetic application is configured.',
    };
  if (path !== app.healthPath)
    return {
      ...base,
      result: 'modeled-non-200',
      reason:
        'The synthetic application declares a different health path; no 200 is modeled for this path.',
    };
  return app.responseStatus === 200
    ? {
        ...base,
        result: 'modeled-200',
        reason:
          'The declared synthetic application returns 200 for this health path; no traffic was sent.',
      }
    : {
        ...base,
        result: 'modeled-non-200',
        reason:
          'The declared synthetic application returns 503 for this health path; no traffic was sent.',
      };
}
const exactObject = (v: unknown, keys: string[]): v is Record<string, string> =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.keys(v).sort().join(',') === keys.sort().join(',') &&
  Object.values(v).every(
    (x) => typeof x === 'string' && x.length <= 120 && x.isWellFormed() && !x.includes('\0'),
  );
const requestPath = (v: string) => validDeliveryPath(v);
const patternMatches = (pattern: string, path: string) => {
  const p = pattern.toLowerCase(),
    q = path.toLowerCase();
  return p.endsWith('/*') ? q.startsWith(p.slice(0, -1)) : p === q;
};
const wafMatches = (r: WafRule, path: string) =>
  r.operator === 'Equal' ? path === r.value : path.startsWith(r.value);

/** Select the configured endpoint, not a fabricated public hostname/DNS result.
 * Front Door's domain mapping, TLS, cache and latency are outside this profile. */
export function analyseFrontDoor(
  state: DeliveryState,
  input: unknown,
  ctx: DeliveryAnalysisContext,
): DeliveryAnalysis {
  const endpointId =
    input &&
    typeof input === 'object' &&
    'endpointId' in input &&
    typeof input.endpointId === 'string'
      ? input.endpointId
      : '';
  const r = initial('FrontDoor', endpointId, ctx);
  if (
    !exactObject(input, ['endpointId', 'protocol', 'path']) ||
    input.protocol !== 'Https' ||
    !requestPath(input.path!)
  )
    return { ...r, status: 'unsupported-input' };
  const endpoint = state.frontDoorEndpoints.find((e) => e.id === input.endpointId),
    profile = state.frontDoors.find((p) => p.id === endpoint?.profileId);
  if (!endpoint || !profile) {
    r.steps.push({
      type: 'missing-resource',
      resourceId: endpointId,
      reason: 'The actual endpoint/profile does not exist.',
    });
    return r;
  }
  r.steps.push({
    type: 'endpoint',
    resourceId: endpoint.id,
    reason: 'Global Front Door Standard configuration; no DNS, TLS or edge request was executed.',
  });
  if (!endpoint.enabled) return { ...r, status: 'disabled-endpoint' };
  const security = state.securityPolicies.find((p) => p.endpointId === endpoint.id);
  if (security) {
    const policy = state.wafPolicies.find((p) => p.id === security.wafPolicyId);
    if (!policy || security.profileId !== profile.id) {
      r.steps.push({
        type: 'invalid-security-policy',
        resourceId: security.id,
        reason: 'The security policy does not resolve to this profile and a current WAF policy.',
      });
      return r;
    }
    const rules = state.wafRules
      .filter((w) => w.policyId === policy.id && w.enabled)
      .sort((a, b) => a.priority - b.priority);
    const matched = rules.find((w) => wafMatches(w, input.path!));
    r.waf = {
      policyId: policy.id,
      ruleId: matched?.id ?? null,
      action: matched?.action ?? 'NoMatch',
      mode: policy.mode,
    };
    r.steps.push({
      type: 'waf',
      resourceId: matched?.id ?? policy.id,
      reason: matched
        ? `First matching custom rule at priority ${matched.priority}: ${matched.action}; policy mode ${policy.mode}.`
        : 'No supported custom rule matched. There are no modeled managed rules; absence of a match is not a security guarantee.',
    });
    if (matched?.action === 'Block' && policy.mode === 'Prevention')
      return { ...r, status: 'blocked-by-waf' };
  }
  const candidates = state.deliveryRoutes.filter(
    (x) => x.endpointId === endpoint.id && x.enabled && patternMatches(x.pattern, input.path!),
  );
  candidates.sort(
    (a, b) =>
      Number(a.pattern.endsWith('/*')) - Number(b.pattern.endsWith('/*')) ||
      b.pattern.length - a.pattern.length ||
      a.id.localeCompare(b.id),
  );
  const route = candidates[0];
  if (!route) return { ...r, status: 'no-matching-route' };
  r.routeId = route.id;
  r.steps.push({
    type: 'route',
    resourceId: route.id,
    reason: `Pattern ${route.pattern} selected: exact path before wildcard, then the most specific wildcard. Patterns are case insensitive.`,
  });
  const group = state.originGroups.find(
    (g) => g.id === route.originGroupId && g.profileId === profile.id,
  );
  if (!group) {
    r.steps.push({
      type: 'missing-origin-group',
      resourceId: route.originGroupId,
      reason: 'The route group is absent or outside its profile.',
    });
    return r;
  }
  const origins = state.origins.filter((o) => o.originGroupId === group.id && o.enabled);
  if (!origins.length) {
    r.steps.push({
      type: 'no-enabled-origin',
      resourceId: group.id,
      reason: 'The group has no enabled origin.',
    });
    return r;
  }
  r.probes = origins.map((o) =>
    assessSyntheticProbe(
      ctx.webApps.find((a) => a.id === o.webAppId),
      o.id,
      o.webAppId,
      group.probePath,
    ),
  );
  const healthy = origins.filter(
    (o) => r.probes.find((p) => p.originId === o.id)?.result === 'modeled-200',
  );
  if (!healthy.length) {
    r.steps.push({
      type: 'all-probes-failed',
      resourceId: group.id,
      reason:
        'Azure Front Door can fall back across all origins when every probe fails. This simulator does not invent sampled health or a successful backend response; the result is undetermined.',
    });
    r.eligibleOriginIds = origins.map((o) => o.id);
    r.backendIds = origins.map((o) => o.webAppId);
    return r;
  }
  const priority = Math.min(...healthy.map((o) => o.priority));
  const eligible: Origin[] = healthy.filter((o) => o.priority === priority);
  r.eligibleOriginIds = eligible.map((o) => o.id);
  r.backendIds = eligible.map((o) => o.webAppId);
  r.steps.push({
    type: 'origin-candidates',
    resourceId: group.id,
    reason: `${eligible.length} origin(s) have a modeled 200 response at the best configured priority ${priority}. Actual latency, weights, samples, egress policy and runtime availability are not evaluated.`,
  });
  return { ...r, status: 'configuration-consistent' };
}

/** Basic HTTP listener -> HTTPS App Service backend configuration only.
 * The source/client path, NSG, UDR, DNS and gateway deployment are not verified. */
export function analyseApplicationGateway(
  state: DeliveryState,
  input: unknown,
  ctx: DeliveryAnalysisContext,
): DeliveryAnalysis {
  const gatewayId =
    input &&
    typeof input === 'object' &&
    'gatewayId' in input &&
    typeof input.gatewayId === 'string'
      ? input.gatewayId
      : '';
  const r = initial('ApplicationGateway', gatewayId, ctx);
  if (
    !exactObject(input, ['gatewayId', 'protocol', 'port', 'path']) ||
    input.protocol !== 'Http' ||
    !['80', '8080'].includes(input.port!) ||
    !requestPath(input.path!)
  )
    return { ...r, status: 'unsupported-input' };
  const gateway = state.applicationGateways.find((g) => g.id === gatewayId);
  if (!gateway) return r;
  r.steps.push({
    type: 'gateway',
    resourceId: gateway.id,
    reason:
      'Regional private-only Standard_v2 configuration with the network-isolation profile. No client reachability or live gateway is asserted.',
  });
  const listeners = state.gatewayListeners.filter(
    (l) => l.gatewayId === gateway.id && l.port === Number(input.port),
  );
  const rules = state.gatewayRules
    .filter(
      (rule) => rule.gatewayId === gateway.id && listeners.some((l) => l.id === rule.listenerId),
    )
    .sort((a, b) => a.priority - b.priority);
  const rule = rules[0];
  if (!rule) return { ...r, status: 'no-matching-route' };
  r.routeId = rule.id;
  const pool = state.backendPools.find((p) => p.id === rule.poolId && p.gatewayId === gateway.id),
    setting = state.backendSettings.find(
      (s) => s.id === rule.settingId && s.gatewayId === gateway.id,
    );
  if (!pool || !setting) return r;
  const configuredProbe = state.gatewayProbes.find(
    (p) => p.id === setting.probeId && p.gatewayId === gateway.id,
  );
  if (!configuredProbe) return r;
  r.steps.push({
    type: 'basic-rule',
    resourceId: rule.id,
    reason: `Basic routing rule priority ${rule.priority} binds the actual listener, pool and HTTPS backend setting. Backend host is selected from the referenced Web App.`,
  });
  r.backendIds = [pool.webAppId];
  const probe = assessSyntheticProbe(
    ctx.webApps.find((a) => a.id === pool.webAppId),
    pool.id,
    pool.webAppId,
    configuredProbe.path,
  );
  r.probes = [probe];
  r.steps.push({
    type: 'backend-setting',
    resourceId: setting.id,
    reason:
      'The declared custom probe path and HTTPS backend configuration are inspected; a synthetic 200 is not measured gateway health.',
  });
  return probe.result === 'modeled-200' ? { ...r, status: 'configuration-consistent' } : r;
}
