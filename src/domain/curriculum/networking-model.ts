/** Deterministic educational IPv4/topology/DNS model. No Sandbox command or network I/O. */
export const networkingModelVersion = '1.0.0';
export const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
export const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export type Outcome = 0 | 1 | 2;
export function ipv4(text: unknown): number | null {
  if (typeof text !== 'string' || !/^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/.test(text))
    return null;
  const a = text.split('.').map(Number);
  return a.every((n) => n <= 255) ? a.reduce((n, octet) => n * 256 + octet, 0) : null;
}
export function address(n: number) {
  if (!integer(n, 0, 2 ** 32 - 1)) return null;
  return [24, 16, 8, 0].map((shift) => Math.floor(n / 2 ** shift) % 256).join('.');
}
export function cidr(text: unknown) {
  if (typeof text !== 'string' || text.length > 18) return null;
  const parts = text.split('/');
  if (parts.length !== 2 || !/^(0|[1-9]\d?)$/.test(parts[1]!)) return null;
  const first = ipv4(parts[0]),
    prefix = Number(parts[1]);
  if (first === null || prefix > 32) return null;
  const total = 2 ** (32 - prefix);
  if (first % total !== 0) return null;
  return { first, last: first + total - 1, prefix, total };
}
export const contains = (parent: string, child: string) => {
  const a = cidr(parent),
    b = cidr(child);
  return !!a && !!b && a.first <= b.first && a.last >= b.last;
};
export const overlaps = (left: string, right: string) => {
  const a = cidr(left),
    b = cidr(right);
  return !!a && !!b && a.first <= b.last && b.first <= a.last;
};
export const privatePrefix = (text: string) =>
  ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'].some((p) => contains(p, text));
export const usable = (text: string) => {
  const p = cidr(text);
  return p && p.prefix <= 29 ? p.total - 5 : null;
};
export interface AddressInput {
  kind: 'address';
  vnet: string;
  app: string;
  data: string;
  required: number;
}
export const initialAddress: AddressInput = {
  kind: 'address',
  vnet: '10.84.0.0/16',
  app: '10.84.1.0/24',
  data: '10.84.1.128/25',
  required: 40,
};
export function validAddress(v: unknown): v is AddressInput {
  return (
    object(v) &&
    keys(v, ['kind', 'vnet', 'app', 'data', 'required']) &&
    v.kind === 'address' &&
    [v.vnet, v.app, v.data].every((p) => typeof p === 'string' && p.length <= 18) &&
    integer(v.required, 1, 500)
  );
}
export function runAddress(raw: unknown) {
  if (!validAddress(raw)) return null;
  const i = raw,
    prefixes = [i.vnet, i.app, i.data],
    syntax = prefixes.every((p) => !!cidr(p)),
    privateRanges = prefixes.every(privatePrefix),
    contained = contains(i.vnet, i.app) && contains(i.vnet, i.data),
    overlap = overlaps(i.app, i.data),
    appUsable = usable(i.app),
    dataUsable = usable(i.data),
    subnetSize = appUsable !== null && dataUsable !== null,
    capacity = subnetSize && appUsable >= i.required && dataUsable >= i.required,
    valid = syntax && privateRanges && contained && !overlap && subnetSize && capacity;
  return {
    input: i,
    syntax,
    privateRanges,
    contained,
    overlap,
    subnetSize,
    capacity,
    appUsable,
    dataUsable,
    outcome: (valid ? 2 : 0) as Outcome,
  };
}
export const peers = ['ab', 'ba', 'bc', 'cb', 'ac', 'ca'] as const;
export type Peer = (typeof peers)[number];
export interface PeeringInput {
  kind: 'peering';
  overlap: boolean;
  configured: Peer[];
  destination: 'b' | 'c';
  scope: 'whole' | 'selected';
  participating: boolean;
  route: 'declared' | 'unknown';
  access: 'allow' | 'deny' | 'unknown';
}
export const initialPeering: PeeringInput = {
  kind: 'peering',
  overlap: false,
  configured: ['ab', 'ba', 'bc', 'cb'],
  destination: 'c',
  scope: 'whole',
  participating: true,
  route: 'declared',
  access: 'allow',
};
export function validPeering(v: unknown): v is PeeringInput {
  return (
    object(v) &&
    keys(v, [
      'kind',
      'overlap',
      'configured',
      'destination',
      'scope',
      'participating',
      'route',
      'access',
    ]) &&
    v.kind === 'peering' &&
    typeof v.overlap === 'boolean' &&
    Array.isArray(v.configured) &&
    v.configured.length <= 6 &&
    new Set(v.configured).size === v.configured.length &&
    v.configured.every((p) => peers.includes(p as Peer)) &&
    ['b', 'c'].includes(v.destination as string) &&
    ['whole', 'selected'].includes(v.scope as string) &&
    typeof v.participating === 'boolean' &&
    ['declared', 'unknown'].includes(v.route as string) &&
    ['allow', 'deny', 'unknown'].includes(v.access as string)
  );
}
export function runPeering(raw: unknown) {
  if (!validPeering(raw)) return null;
  const i = raw;
  const networks = {
    a: '10.84.0.0/16',
    b: i.overlap ? '10.84.0.0/17' : '10.85.0.0/16',
    c: '10.86.0.0/16',
  };
  const links = (['ab', 'bc', 'ac'] as const).map((pair) => {
    const reverse = `${pair[1]}${pair[0]}` as Peer,
      conflict = overlaps(networks[pair[0] as 'a' | 'b'], networks[pair[1] as 'b' | 'c']),
      forward = i.configured.includes(pair),
      back = i.configured.includes(reverse);
    return {
      pair,
      forward,
      back,
      conflict,
      status: conflict
        ? 'overlap'
        : forward && back
          ? 'connected'
          : forward || back
            ? 'initiated'
            : 'missing',
    };
  });
  const direct = links.find((l) => l.pair === `a${i.destination}`)!.status === 'connected',
    subnet = i.scope === 'whole' || i.participating,
    knownPath = direct && subnet && i.route === 'declared',
    permitted = knownPath && i.access === 'allow';
  // Deliberately no graph transitive closure: AB + BC alone never supplies AC.
  return {
    input: i,
    networks,
    links,
    direct,
    subnet,
    knownPath,
    permitted,
    outcome: (permitted ? 2 : direct && subnet ? 1 : 0) as Outcome,
  };
}
export interface DnsInput {
  kind: 'dns';
  zone: 'private' | 'public' | 'provided';
  record: 'a' | 'cname' | 'missing' | 'wrong' | 'loop';
  linked: boolean;
  resolver: 'azure' | 'custom';
  forwarding: boolean;
  sameVnet: boolean;
  peered: boolean;
  route: 'declared' | 'unknown';
  access: 'allow' | 'deny' | 'unknown';
}
export const initialDns: DnsInput = {
  kind: 'dns',
  zone: 'private',
  record: 'a',
  linked: false,
  resolver: 'azure',
  forwarding: false,
  sameVnet: false,
  peered: true,
  route: 'declared',
  access: 'allow',
};
export function validDns(v: unknown): v is DnsInput {
  return (
    object(v) &&
    keys(v, [
      'kind',
      'zone',
      'record',
      'linked',
      'resolver',
      'forwarding',
      'sameVnet',
      'peered',
      'route',
      'access',
    ]) &&
    v.kind === 'dns' &&
    ['private', 'public', 'provided'].includes(v.zone as string) &&
    ['a', 'cname', 'missing', 'wrong', 'loop'].includes(v.record as string) &&
    (v.zone !== 'provided' || ['a', 'missing'].includes(v.record as string)) &&
    ['linked', 'forwarding', 'sameVnet', 'peered'].every((p) => typeof v[p] === 'boolean') &&
    ['azure', 'custom'].includes(v.resolver as string) &&
    ['declared', 'unknown'].includes(v.route as string) &&
    ['allow', 'deny', 'unknown'].includes(v.access as string)
  );
}
export function runDns(raw: unknown) {
  if (!validDns(raw)) return null;
  const i = raw,
    visible =
      i.zone === 'public' ||
      (i.zone === 'provided'
        ? i.sameVnet && i.resolver === 'azure'
        : i.resolver === 'azure'
          ? i.linked
          : i.forwarding),
    resolved = visible && !['missing', 'loop'].includes(i.record),
    resolvedAddress = resolved
      ? i.record === 'wrong'
        ? '10.99.1.20'
        : i.zone === 'public'
          ? '203.0.113.20'
          : '10.85.1.20'
      : null,
    correctDestination = resolved && i.record !== 'wrong',
    topology = i.zone === 'public' || i.sameVnet || i.peered,
    knownPath = correctDestination && topology && i.route === 'declared',
    permitted = knownPath && i.access === 'allow';
  return {
    input: i,
    visible,
    resolved,
    resolvedAddress,
    correctDestination,
    topology,
    knownPath,
    permitted,
    cnameChain: i.record === 'cname' ? ['alias.training.example', 'archive.training.example'] : [],
    outcome: (!resolved ? 0 : permitted ? 2 : 1) as Outcome,
  };
}
export type NetworkInput = AddressInput | PeeringInput | DnsInput;
export function validNetworkInput(v: unknown): v is NetworkInput {
  return validAddress(v) || validPeering(v) || validDns(v);
}
export function runNetwork(v: unknown) {
  if (validAddress(v)) return runAddress(v);
  if (validPeering(v)) return runPeering(v);
  if (validDns(v)) return runDns(v);
  return null;
}
