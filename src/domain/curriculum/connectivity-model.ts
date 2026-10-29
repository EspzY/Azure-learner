/** Bounded teaching fixtures. No World, technical commands, network calls or actual traffic. */
export const connectivityModelVersion = '1.0.0';
export const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
export const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export type Outcome = 0 | 1 | 2;
export type Access = 'allow' | 'deny' | 'unknown';
export interface HybridInput {
  kind: 'choose' | 'diagnose';
  transport: 'vpn' | 'expressroute';
  vpnMode: 's2s' | 'p2s' | 'vnet';
  demand: 'site' | 'user' | 'vnet';
  providerReady: boolean;
  gatewayReady: boolean;
  tunnelReady: boolean;
  routeReady: boolean;
  circuitUp: boolean;
  backupReady: boolean;
  requirePrivate: boolean;
  /** Payload protection between the declared tunnel ends, not client-to-PaaS TLS. */
  requireEncryption: boolean;
  direct: boolean;
  encryption: 'none' | 'ipsec' | 'macsec';
  access: Access;
}
export const initialChoose: HybridInput = {
  kind: 'choose',
  transport: 'vpn',
  vpnMode: 's2s',
  demand: 'site',
  providerReady: true,
  gatewayReady: true,
  tunnelReady: true,
  routeReady: true,
  circuitUp: true,
  backupReady: false,
  requirePrivate: true,
  requireEncryption: true,
  direct: false,
  encryption: 'none',
  access: 'allow',
};
export const initialDiagnose: HybridInput = {
  ...initialChoose,
  kind: 'diagnose',
  transport: 'expressroute',
  requirePrivate: false,
  circuitUp: false,
  encryption: 'ipsec',
};
const hybridFields = [
  'kind',
  'transport',
  'vpnMode',
  'demand',
  'providerReady',
  'gatewayReady',
  'tunnelReady',
  'routeReady',
  'circuitUp',
  'backupReady',
  'requirePrivate',
  'requireEncryption',
  'direct',
  'encryption',
  'access',
] as const;
const hybridBooleans = [
  'providerReady',
  'gatewayReady',
  'tunnelReady',
  'routeReady',
  'circuitUp',
  'backupReady',
  'requirePrivate',
  'requireEncryption',
  'direct',
] as const;
export function validHybrid(v: unknown): v is HybridInput {
  return (
    object(v) &&
    keys(v, hybridFields) &&
    ['choose', 'diagnose'].includes(v.kind as string) &&
    ['vpn', 'expressroute'].includes(v.transport as string) &&
    ['s2s', 'p2s', 'vnet'].includes(v.vpnMode as string) &&
    ['site', 'user', 'vnet'].includes(v.demand as string) &&
    hybridBooleans.every((k) => typeof v[k] === 'boolean') &&
    ['none', 'ipsec', 'macsec'].includes(v.encryption as string) &&
    ['allow', 'deny', 'unknown'].includes(v.access as string)
  );
}
export function runHybrid(raw: unknown) {
  if (!validHybrid(raw)) return null;
  const i = raw;
  const usedBackup =
    i.transport === 'expressroute' && (!i.providerReady || !i.circuitUp) && i.backupReady;
  const viaVpn = i.transport === 'vpn' || usedBackup;
  const modeFits = viaVpn
    ? usedBackup
      ? i.demand === 'site'
      : ({ site: 's2s', user: 'p2s', vnet: 'vnet' } as const)[i.demand] === i.vpnMode
    : i.demand === 'site';
  // VPN fixtures declare an already configured compatible encrypted tunnel. No protocol negotiation.
  const transportReady =
    i.gatewayReady && modeFits && (viaVpn ? i.tunnelReady : i.providerReady && i.circuitUp);
  const privateTransport = !viaVpn || (i.transport === 'vpn' && i.vpnMode === 'vnet');
  const encrypted = (viaVpn || i.encryption === 'ipsec') && i.tunnelReady;
  const linkEncrypted = !viaVpn && i.direct && i.encryption === 'macsec';
  const encryptionConfigured = viaVpn
    ? i.tunnelReady
    : i.encryption === 'ipsec'
      ? i.tunnelReady
      : i.encryption !== 'macsec' || i.direct;
  const knownPath = transportReady && i.routeReady;
  const permitted = knownPath && i.access === 'allow';
  const requirementsMet =
    permitted &&
    encryptionConfigured &&
    (!i.requirePrivate || privateTransport) &&
    (!i.requireEncryption || encrypted);
  const medium = viaVpn
    ? i.transport === 'vpn' && i.vpnMode === 'vnet'
      ? 'microsoft'
      : 'internet'
    : 'provider';
  return {
    input: i,
    usedBackup,
    viaVpn,
    modeFits,
    transportReady,
    privateTransport,
    encrypted,
    linkEncrypted,
    encryptionConfigured,
    knownPath,
    permitted,
    requirementsMet,
    medium,
    outcome: (requirementsMet ? 2 : knownPath ? 1 : 0) as Outcome,
  };
}
export interface EndpointInput {
  kind: 'endpoint' | 'dns';
  endpoint: 'public' | 'private';
  dns: 'public' | 'private' | 'missing' | 'wrong';
  resolver: 'azure' | 'custom';
  linked: boolean;
  forwarding: boolean;
  privateState: 'absent' | 'pending' | 'approved';
  path: boolean;
  publicAccess: 'enabled' | 'disabled' | 'selected';
  /** Declared generic path/policy decision, never Storage's public-only firewall on a private entry. */
  networkRule: Access;
  appAuth: Access;
  response: 'assumed' | 'unknown';
}
export const initialEndpoint: EndpointInput = {
  kind: 'endpoint',
  endpoint: 'private',
  dns: 'private',
  resolver: 'azure',
  linked: true,
  forwarding: false,
  privateState: 'approved',
  path: true,
  publicAccess: 'enabled',
  networkRule: 'allow',
  appAuth: 'allow',
  response: 'unknown',
};
export const initialDns: EndpointInput = {
  ...initialEndpoint,
  kind: 'dns',
  publicAccess: 'disabled',
  linked: false,
  dns: 'public',
};
const endpointFields = [
  'kind',
  'endpoint',
  'dns',
  'resolver',
  'linked',
  'forwarding',
  'privateState',
  'path',
  'publicAccess',
  'networkRule',
  'appAuth',
  'response',
] as const;
export function validEndpoint(v: unknown): v is EndpointInput {
  return (
    object(v) &&
    keys(v, endpointFields) &&
    ['endpoint', 'dns'].includes(v.kind as string) &&
    ['public', 'private'].includes(v.endpoint as string) &&
    ['public', 'private', 'missing', 'wrong'].includes(v.dns as string) &&
    ['azure', 'custom'].includes(v.resolver as string) &&
    ['linked', 'forwarding', 'path'].every((k) => typeof v[k] === 'boolean') &&
    ['absent', 'pending', 'approved'].includes(v.privateState as string) &&
    ['enabled', 'disabled', 'selected'].includes(v.publicAccess as string) &&
    ['allow', 'deny', 'unknown'].includes(v.networkRule as string) &&
    ['allow', 'deny', 'unknown'].includes(v.appAuth as string) &&
    ['assumed', 'unknown'].includes(v.response as string)
  );
}
export function runEndpoint(raw: unknown) {
  if (!validEndpoint(raw)) return null;
  const i = raw;
  const privateVisible = i.resolver === 'azure' ? i.linked : i.forwarding;
  const resolved = i.dns !== 'missing' && (i.dns !== 'private' || privateVisible);
  const actualEndpoint = !resolved || i.dns === 'wrong' ? null : (i.dns as 'public' | 'private');
  const resolvedAddress = !resolved
    ? null
    : i.dns === 'public'
      ? '203.0.113.24'
      : i.dns === 'wrong'
        ? '10.99.8.12'
        : '10.87.4.12';
  const endpointMatch = actualEndpoint === i.endpoint;
  const endpointReady =
    actualEndpoint === 'public' || (actualEndpoint === 'private' && i.privateState === 'approved');
  const knownPath = resolved && actualEndpoint !== null && i.path;
  const publicAllowed = actualEndpoint !== 'public' || i.publicAccess !== 'disabled';
  const endpointControls = endpointReady && publicAllowed && i.networkRule === 'allow';
  const applicationAllowed = i.appAuth === 'allow';
  const networkAllowed = knownPath && endpointControls;
  const authorized = networkAllowed && applicationAllowed;
  const responseAssumed = authorized && i.response === 'assumed';
  const requirementsMet = authorized && endpointMatch;
  return {
    input: i,
    privateVisible,
    resolved,
    resolvedAddress,
    actualEndpoint,
    endpointMatch,
    endpointReady,
    knownPath,
    publicAllowed,
    endpointControls,
    applicationAllowed,
    networkAllowed,
    authorized,
    responseAssumed,
    requirementsMet,
    outcome: (!resolved ? 0 : requirementsMet ? 2 : 1) as Outcome,
  };
}
export type ConnectivityInput = HybridInput | EndpointInput;
export function validConnectivityInput(v: unknown): v is ConnectivityInput {
  return validHybrid(v) || validEndpoint(v);
}
export function runConnectivity(v: unknown) {
  return validHybrid(v) ? runHybrid(v) : validEndpoint(v) ? runEndpoint(v) : null;
}
export function initialConnectivity(mission: ConnectivityInput['kind']): ConnectivityInput {
  return structuredClone(
    {
      choose: initialChoose,
      diagnose: initialDiagnose,
      endpoint: initialEndpoint,
      dns: initialDns,
    }[mission],
  );
}
