/** Versioned teaching fixtures. No World, command, clock, cloud client or price API. */
export const resilienceModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const one = <T extends string>(v: unknown, values: readonly T[]): v is T =>
  typeof v === 'string' && values.includes(v as T);
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export const tiers = ['hot', 'cool', 'cold', 'archive'] as const;
export type Tier = (typeof tiers)[number];
export const redundancies = ['LRS', 'ZRS', 'GRS', 'RA-GRS', 'GZRS', 'RA-GZRS'] as const;
export type Redundancy = (typeof redundancies)[number];
export const tierServices = ['block', 'append', 'files', 'queue', 'table', 'disk'] as const;
export const targets = [
  'blob',
  'queue',
  'table',
  'premiumBlob',
  'filesHdd',
  'filesSsd',
  'diskSsd',
] as const;
export type Target = (typeof targets)[number];
export const failures = ['rack', 'datacenter', 'zone', 'region', 'deletion'] as const;
export interface TierInput {
  kind: 'tiers';
  service: (typeof tierServices)[number];
  account: 'standard' | 'premium';
  amount: number;
  usage: 'frequent' | 'occasional' | 'rare';
  days: number;
  retrieval: 'immediate' | 'flexible';
  change: 'keep' | 'delete' | 'overwrite' | 'tier';
  tier: Tier;
  defaultTier: Exclude<Tier, 'archive'>;
  assignment: 'explicit' | 'inherit';
  phase: 'stored' | 'pending' | 'complete';
  rule: 'none' | 'unguarded' | 'guarded';
  redundancy: Redundancy;
}
export interface ReplicationInput {
  kind: 'replication';
  target: Target;
  redundancy: Redundancy;
  failure: (typeof failures)[number];
  lag: 'older' | 'current';
  tier: 'online' | 'archive';
  region: boolean;
}
export type ResilienceInput = TierInput | ReplicationInput;
export const initialTiers: TierInput = {
  kind: 'tiers',
  service: 'block',
  account: 'standard',
  amount: 10,
  usage: 'rare',
  days: 120,
  retrieval: 'immediate',
  change: 'keep',
  tier: 'cold',
  defaultTier: 'hot',
  assignment: 'explicit',
  phase: 'stored',
  rule: 'none',
  redundancy: 'LRS',
};
export const initialReplication: ReplicationInput = {
  kind: 'replication',
  target: 'blob',
  redundancy: 'LRS',
  failure: 'rack',
  lag: 'older',
  tier: 'online',
  region: true,
};
export const minimumDays: Record<Tier, number> = { hot: 0, cool: 30, cold: 90, archive: 180 };
/** Deliberately fictional integer weights, per GiB/30 days. Never currency. */
export const costWeights = {
  capacity: { hot: 40, cool: 20, cold: 10, archive: 3 },
  access: { hot: 1, cool: 4, cold: 10, archive: 25 },
  usage: { frequent: 40, occasional: 2, rare: 0 },
  rehydrate: 25,
} as const;
export const zonal = (r: Redundancy) => ['ZRS', 'GZRS', 'RA-GZRS'].includes(r);
export const geo = (r: Redundancy) => !['LRS', 'ZRS'].includes(r);
export const ra = (r: Redundancy) => r.startsWith('RA-');
export const archiveSupported = (r: Redundancy) => !zonal(r);
export function validTiers(v: unknown): v is TierInput {
  return (
    object(v) &&
    exact(v, [
      'kind',
      'service',
      'account',
      'amount',
      'usage',
      'days',
      'retrieval',
      'change',
      'tier',
      'defaultTier',
      'assignment',
      'phase',
      'rule',
      'redundancy',
    ]) &&
    v.kind === 'tiers' &&
    one(v.service, tierServices) &&
    one(v.account, ['standard', 'premium']) &&
    integer(v.amount, 1, 10000) &&
    integer(v.days, 1, 730) &&
    one(v.usage, ['frequent', 'occasional', 'rare']) &&
    one(v.retrieval, ['immediate', 'flexible']) &&
    one(v.change, ['keep', 'delete', 'overwrite', 'tier']) &&
    one(v.tier, tiers) &&
    one(v.defaultTier, ['hot', 'cool', 'cold']) &&
    one(v.assignment, ['explicit', 'inherit']) &&
    one(v.phase, ['stored', 'pending', 'complete']) &&
    one(v.rule, ['none', 'unguarded', 'guarded']) &&
    one(v.redundancy, redundancies)
  );
}
export function validReplication(v: unknown): v is ReplicationInput {
  return (
    object(v) &&
    exact(v, ['kind', 'target', 'redundancy', 'failure', 'lag', 'tier', 'region']) &&
    v.kind === 'replication' &&
    one(v.target, targets) &&
    one(v.redundancy, redundancies) &&
    one(v.failure, failures) &&
    one(v.lag, ['older', 'current']) &&
    one(v.tier, ['online', 'archive']) &&
    typeof v.region === 'boolean'
  );
}
export const validResilienceInput = (v: unknown): v is ResilienceInput =>
  validTiers(v) || validReplication(v);
export function runTiers(raw: unknown) {
  if (!validTiers(raw)) return null;
  const selected = raw.assignment === 'inherit' ? raw.defaultTier : raw.tier;
  const typeSupported = raw.service === 'block' && raw.account === 'standard';
  const compatible = selected !== 'archive' || archiveSupported(raw.redundancy);
  const supported = typeSupported && compatible;
  const rehydrated = selected === 'archive' && raw.phase === 'complete';
  const online = supported && (selected !== 'archive' || rehydrated);
  const state = !supported
    ? 'unsupported'
    : selected !== 'archive'
      ? 'online'
      : rehydrated
        ? 'rehydrated'
        : raw.phase === 'pending'
          ? 'pending'
          : 'offline';
  const overwriteBlocked = supported && !online && raw.change === 'overwrite';
  const exiting = rehydrated || (raw.change !== 'keep' && !overwriteBlocked);
  const remaining = supported && exiting ? Math.max(0, minimumDays[selected] - raw.days) : 0;
  const capacity = Math.ceil((costWeights.capacity[selected] * raw.amount * raw.days) / 30);
  const access = Math.ceil(
    (costWeights.access[selected] * costWeights.usage[raw.usage] * raw.amount * raw.days) / 30,
  );
  const early = Math.ceil((costWeights.capacity[selected] * raw.amount * remaining) / 30);
  const rehydrate =
    rehydrated || (selected === 'archive' && raw.phase === 'pending')
      ? costWeights.rehydrate * raw.amount
      : 0;
  const costs = supported
    ? { capacity, access, early, rehydrate, total: capacity + access + early + rehydrate }
    : null;
  return {
    input: raw,
    selected,
    current: rehydrated ? 'hot' : selected,
    typeSupported,
    compatible,
    supported,
    state,
    online,
    overwriteBlocked,
    minimum: minimumDays[selected],
    remaining,
    costs,
    lifecycleRisk: rehydrated && raw.rule === 'unguarded',
    outcome: (!supported
      ? 0
      : overwriteBlocked || (raw.retrieval === 'immediate' && !online)
        ? 1
        : 2) as Outcome,
  };
}
/** Supported examples, not an account provisioning catalogue. Files RA account names retain non-RA share behavior. */
export function replicationSupport(target: Target, r: Redundancy) {
  return ['blob', 'queue', 'table', 'filesHdd'].includes(target) || ['LRS', 'ZRS'].includes(r);
}
export function runReplication(raw: unknown) {
  if (!validReplication(raw)) return null;
  const typeSupported = replicationSupport(raw.target, raw.redundancy);
  const tierSupported =
    raw.tier !== 'archive' || (raw.target === 'blob' && archiveSupported(raw.redundancy));
  const supported = typeSupported && tierSupported,
    qualified = supported && raw.region;
  const hasGeo = geo(raw.redundancy),
    hasZones = zonal(raw.redundancy);
  const readAccess = hasGeo && ra(raw.redundancy) && raw.target !== 'filesHdd';
  const deleted = raw.failure === 'deletion';
  const primaryDown =
    raw.failure === 'region' || (!hasZones && ['zone', 'datacenter'].includes(raw.failure));
  const replicas: {
    region: 'primary' | 'secondary';
    site: string;
    copy: number;
    version: number | null;
    state: 'deleted' | 'unavailable' | 'exists';
  }[] = [0, 1, 2].map((i) => ({
    region: 'primary' as const,
    site: hasZones ? `Z${i + 1}` : 'L1',
    copy: i + 1,
    version: deleted ? null : 2,
    state: deleted
      ? ('deleted' as const)
      : primaryDown || (i === 0 && raw.failure !== 'deletion')
        ? ('unavailable' as const)
        : ('exists' as const),
  }));
  if (hasGeo)
    for (let i = 0; i < 3; i++)
      replicas.push({
        region: 'secondary',
        site: 'L2',
        copy: i + 1,
        version: deleted ? null : raw.lag === 'older' ? 1 : 2,
        state: deleted ? 'deleted' : 'exists',
      });
  const primaryAvailable = qualified && !deleted && !primaryDown;
  const online = raw.tier !== 'archive';
  const primaryRead = primaryAvailable && online;
  const secondaryRead = qualified && !deleted && readAccess && online;
  const protectedCopy = qualified && !deleted && (!primaryDown || hasGeo);
  const pendingWrite = qualified && hasGeo && raw.lag === 'older' && !deleted;
  return {
    input: raw,
    typeSupported,
    tierSupported,
    supported,
    qualified,
    hasGeo,
    hasZones,
    readAccess,
    replicas: qualified ? replicas : [],
    primaryAvailable,
    primaryRead,
    secondaryRead,
    secondaryWrite: false,
    protectedCopy,
    pendingWrite,
    zeroLossGuarantee: false,
    appRecovered: null,
    failoverRequired: qualified && !deleted && primaryDown && hasGeo,
    outcome: (!supported ? 0 : !raw.region || (!primaryRead && !secondaryRead) ? 1 : 2) as Outcome,
  };
}
export function runResilience(raw: unknown) {
  return validTiers(raw) ? runTiers(raw) : runReplication(raw);
}
export function initialResilience(kind: ResilienceInput['kind']): ResilienceInput {
  return structuredClone(kind === 'tiers' ? initialTiers : initialReplication);
}
