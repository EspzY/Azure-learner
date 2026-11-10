/** Closed synthetic requirements/manifests/plans. No filesystem, bytes, Azure or World API. */
export const migrationModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export const movementTools = ['azcopy', 'explorer', 'file-sync', 'migrate', 'databox'] as const;
export type MovementTool = (typeof movementTools)[number];
export interface MethodInput {
  kind: 'method';
  dataset: 'media' | 'documents' | 'application';
  destination: 'blob' | 'files-smb' | 'files-nfs';
  cadence: 'once' | 'scheduled' | 'hybrid';
  interface: 'either' | 'scripted' | 'visual';
  volume: 'small' | 'large';
  host: 'windows' | 'linux';
  tool: MovementTool;
  access: boolean;
  network: boolean;
  supported: boolean;
  sourceStable: boolean;
  fidelity: 'content' | 'required';
  fidelityChecked: boolean;
}
export interface SyncInput {
  kind: 'sync';
  method: 'copy' | 'directional' | 'file-sync';
  direction: 'a-to-cloud' | 'cloud-to-a';
  scenario:
    | 'baseline'
    | 'target-newer'
    | 'same-time-different'
    | 'concurrent'
    | 'cloud-change'
    | 'deleted-source';
  comparison: 'time' | 'manifest';
  deleteDestination: boolean;
  cloudTiering: boolean;
  localContent: boolean;
  connected: boolean;
  access: boolean;
  supported: boolean;
  fidelity: 'content' | 'required';
  fidelityKnown: boolean;
  detected: boolean;
}
export interface PlanningInput {
  kind: 'planning';
  workload: 'files' | 'application';
  strategy: 'online' | 'physical';
  phase: 'discover' | 'assess' | 'plan' | 'transported' | 'cutover' | 'validated';
  sizeGB: 100 | 2000 | 20000;
  mbps: 10 | 100 | 1000;
  windowHours: 8 | 48 | 240;
  physicalHours: 24 | 120 | 360;
  discovered: boolean;
  dependencies: boolean;
  assessmentFresh: boolean;
  compatible: boolean;
  access: boolean;
  connectivity: boolean;
  deviceEligible: boolean;
  logisticsKnown: boolean;
  transferVerified: boolean;
  writersControlled: boolean;
  appValidated: boolean;
  fallbackReady: boolean;
}
export type MigrationInput = MethodInput | SyncInput | PlanningInput;
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const shape = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
const member = (v: unknown, values: readonly unknown[]) => values.includes(v);
const bool = (v: Record<string, unknown>, keys: string[]) =>
  keys.every((k) => typeof v[k] === 'boolean');
export function validMigrationInput(v: unknown): v is MigrationInput {
  if (!obj(v)) return false;
  if (v.kind === 'method')
    return (
      shape(v, [
        'kind',
        'dataset',
        'destination',
        'cadence',
        'interface',
        'volume',
        'host',
        'tool',
        'access',
        'network',
        'supported',
        'sourceStable',
        'fidelity',
        'fidelityChecked',
      ]) &&
      member(v.dataset, ['media', 'documents', 'application']) &&
      member(v.destination, ['blob', 'files-smb', 'files-nfs']) &&
      member(v.cadence, ['once', 'scheduled', 'hybrid']) &&
      member(v.interface, ['either', 'scripted', 'visual']) &&
      member(v.volume, ['small', 'large']) &&
      member(v.host, ['windows', 'linux']) &&
      member(v.tool, movementTools) &&
      member(v.fidelity, ['content', 'required']) &&
      bool(v, ['access', 'network', 'supported', 'sourceStable', 'fidelityChecked'])
    );
  if (v.kind === 'sync')
    return (
      shape(v, [
        'kind',
        'method',
        'direction',
        'scenario',
        'comparison',
        'deleteDestination',
        'cloudTiering',
        'localContent',
        'connected',
        'access',
        'supported',
        'fidelity',
        'fidelityKnown',
        'detected',
      ]) &&
      member(v.method, ['copy', 'directional', 'file-sync']) &&
      member(v.direction, ['a-to-cloud', 'cloud-to-a']) &&
      member(v.scenario, [
        'baseline',
        'target-newer',
        'same-time-different',
        'concurrent',
        'cloud-change',
        'deleted-source',
      ]) &&
      member(v.comparison, ['time', 'manifest']) &&
      member(v.fidelity, ['content', 'required']) &&
      bool(v, [
        'deleteDestination',
        'cloudTiering',
        'localContent',
        'connected',
        'access',
        'supported',
        'fidelityKnown',
        'detected',
      ])
    );
  if (v.kind === 'planning')
    return (
      shape(v, [
        'kind',
        'workload',
        'strategy',
        'phase',
        'sizeGB',
        'mbps',
        'windowHours',
        'physicalHours',
        'discovered',
        'dependencies',
        'assessmentFresh',
        'compatible',
        'access',
        'connectivity',
        'deviceEligible',
        'logisticsKnown',
        'transferVerified',
        'writersControlled',
        'appValidated',
        'fallbackReady',
      ]) &&
      member(v.workload, ['files', 'application']) &&
      member(v.strategy, ['online', 'physical']) &&
      member(v.phase, ['discover', 'assess', 'plan', 'transported', 'cutover', 'validated']) &&
      member(v.sizeGB, [100, 2000, 20000]) &&
      member(v.mbps, [10, 100, 1000]) &&
      member(v.windowHours, [8, 48, 240]) &&
      member(v.physicalHours, [24, 120, 360]) &&
      bool(v, [
        'discovered',
        'dependencies',
        'assessmentFresh',
        'compatible',
        'access',
        'connectivity',
        'deviceEligible',
        'logisticsKnown',
        'transferVerified',
        'writersControlled',
        'appValidated',
        'fallbackReady',
      ])
    );
  return false;
}
const boundary = {
  synthetic: true,
  actualFileTransfer: false,
  actualSynchronization: false,
  actualMigration: false,
  actualIntegrityCheck: false,
  actualApplicationValidation: false,
  actualAzureReceipt: false,
  actualWorldMutation: false,
} as const;
function fits(input: MethodInput, tool: MovementTool) {
  if (input.cadence === 'hybrid')
    return (
      tool === 'file-sync' &&
      input.dataset === 'documents' &&
      input.destination === 'files-smb' &&
      input.host === 'windows'
    );
  if (input.dataset === 'application') return tool === 'migrate';
  if (tool === 'azcopy')
    return (
      input.interface !== 'visual' &&
      !(input.host === 'windows' && input.destination === 'files-nfs')
    );
  if (tool === 'explorer') return input.cadence === 'once' && input.interface !== 'scripted';
  if (tool === 'databox')
    return input.cadence === 'once' && input.volume === 'large' && input.interface !== 'scripted';
  return false;
}
export function runMethod(input: MethodInput) {
  if (!validMigrationInput(input) || input.kind !== 'method') return null;
  const candidates = movementTools.filter((t) => fits(input, t)),
    methodFits = candidates.includes(input.tool),
    prerequisitesMet = input.access && input.network && input.supported && input.sourceStable,
    fidelityMet = input.fidelity === 'content' || input.fidelityChecked;
  return {
    kind: 'method' as const,
    input,
    candidates,
    methodFits,
    prerequisitesMet,
    fidelityMet,
    needsFidelityReview: !fidelityMet,
    multipleCandidates: candidates.length > 1,
    role:
      input.tool === 'migrate'
        ? 'workload-process'
        : input.tool === 'databox'
          ? 'physical-data'
          : input.tool === 'file-sync'
            ? 'hybrid-relationship'
            : 'data-copy',
    largeTransferReview: input.volume === 'large',
    outcome: (!methodFits ? 0 : prerequisitesMet && fidelityMet ? 2 : 1) as Outcome,
    ...boundary,
  };
}
export interface ManifestVersion {
  version: string;
  modified: number;
}
export interface ManifestEntry {
  name: string;
  a: ManifestVersion | null;
  cloud: ManifestVersion | null;
  b: ManifestVersion | null;
}
const version = (v: string, modified: number): ManifestVersion => ({ version: v, modified });
export function migrationManifest(s: SyncInput['scenario']): ManifestEntry[] {
  const rows: ManifestEntry[] = [
    { name: 'produkt.png', a: version('p2', 20), cloud: version('p1', 10), b: version('p1', 10) },
    {
      name: 'veiledning.pdf',
      a: version('g1', 10),
      cloud: version('g1', 10),
      b: version('g1', 10),
    },
    { name: 'ny.csv', a: version('n1', 10), cloud: null, b: null },
    { name: 'arkiv.txt', a: null, cloud: version('a1', 10), b: version('a1', 10) },
  ];
  if (s === 'target-newer') rows[0]!.cloud = version('p3', 30);
  if (s === 'same-time-different') rows[0]!.cloud = version('p1', 20);
  if (s === 'concurrent') {
    rows[0]!.cloud = version('p3', 30);
    rows[0]!.b = version('p4', 40);
  }
  if (s === 'cloud-change') {
    rows[0]!.a = version('p1', 10);
    rows[0]!.cloud = version('p2', 20);
  }
  if (s === 'deleted-source') rows[0]!.a = null;
  return rows;
}
export type ManifestAction =
  | 'unchanged'
  | 'copy'
  | 'update'
  | 'keep-target'
  | 'delete-target'
  | 'pending-detection'
  | 'conflict-review'
  | 'declared-propagation'
  | 'blocked';
export function runSync(input: SyncInput) {
  if (!validMigrationInput(input) || input.kind !== 'sync') return null;
  const before = migrationManifest(input.scenario).filter(
      (_, i) => input.method !== 'file-sync' || i < 2,
    ),
    prerequisitesMet = input.connected && input.access && input.supported,
    fidelityMet = input.fidelity === 'content' || input.fidelityKnown;
  const source = input.direction === 'a-to-cloud' ? 'a' : 'cloud',
    target = input.direction === 'a-to-cloud' ? 'cloud' : 'a';
  const conflict =
    input.method === 'file-sync' &&
    (['concurrent', 'same-time-different', 'target-newer'] as SyncInput['scenario'][]).includes(
      input.scenario,
    );
  const pending =
    input.method === 'file-sync' && input.scenario === 'cloud-change' && !input.detected;
  const rows = before.map((entry, i) => {
    const after: ManifestEntry = {
      name: entry.name,
      a: entry.a ? { ...entry.a } : null,
      cloud: entry.cloud ? { ...entry.cloud } : null,
      b: entry.b ? { ...entry.b } : null,
    };
    let action: ManifestAction = 'unchanged';
    if (!prerequisitesMet) action = 'blocked';
    else if (input.method === 'file-sync') {
      // Closed declared fixtures: established topology; known single origin only.
      // Ambiguous/concurrent product edits never select a universal conflict winner.
      if (i === 0 && conflict) action = 'conflict-review';
      else if (i === 0 && pending) action = 'pending-detection';
      else if (i === 0) {
        const chosen = input.scenario === 'cloud-change' ? entry.cloud : entry.a;
        after.a = chosen ? { ...chosen } : null;
        after.cloud = chosen ? { ...chosen } : null;
        after.b = chosen ? { ...chosen } : null;
        action = 'declared-propagation';
      }
    } else {
      const a = entry[source],
        b = entry[target];
      if (a) {
        if (!b) {
          after[target] = { ...a };
          action = 'copy';
        } else if (
          input.method === 'directional' && input.comparison === 'manifest'
            ? a.version !== b.version
            : a.modified > b.modified
        ) {
          after[target] = { ...a };
          action = 'update';
        } else if (a.version !== b.version) action = 'keep-target';
      } else if (b && input.method === 'directional' && input.deleteDestination) {
        after[target] = null;
        action = 'delete-target';
      }
    }
    return { before: entry, after, action };
  });
  const contentState:
    'version-unresolved' | 'recall-required' | 'offline-unavailable' | 'declared-local-content' =
    conflict
      ? 'version-unresolved'
      : input.method === 'file-sync' && !input.localContent
        ? prerequisitesMet
          ? 'recall-required'
          : 'offline-unavailable'
        : 'declared-local-content';
  return {
    kind: 'sync' as const,
    input,
    rows,
    source,
    target,
    prerequisitesMet,
    fidelityMet,
    conflict,
    pending,
    contentState,
    oneWay: input.method !== 'file-sync',
    bTouched:
      input.method === 'file-sync' &&
      rows.some((r) => JSON.stringify(r.before.b) !== JSON.stringify(r.after.b)),
    deletionSelected: input.method === 'directional' && input.deleteDestination,
    namespaceIsContent: false,
    syncIsBackup: false,
    globalConsistencyProven: false,
    versionTokensAreHashes: false,
    outcome: (!prerequisitesMet ? 0 : !fidelityMet || conflict || pending ? 1 : 2) as Outcome,
    ...boundary,
  };
}
export function runPlanning(input: PlanningInput) {
  if (!validMigrationInput(input) || input.kind !== 'planning') return null;
  const networkLowerBoundHours = (input.sizeGB * 8e9) / (input.mbps * 1e6 * 3600),
    networkRuledOut = networkLowerBoundHours > input.windowHours;
  const physicalKnown = input.deviceEligible && input.logisticsKnown,
    physicalRuledOut = physicalKnown && input.physicalHours > input.windowHours;
  const transport: 'ruled-out' | 'candidate' | 'unknown' =
    input.strategy === 'online'
      ? networkRuledOut
        ? 'ruled-out'
        : input.connectivity
          ? 'candidate'
          : 'unknown'
      : !physicalKnown
        ? 'unknown'
        : physicalRuledOut
          ? 'ruled-out'
          : 'candidate';
  const assessmentReady =
    input.discovered && input.dependencies && input.assessmentFresh && input.compatible;
  const planReady =
    assessmentReady &&
    input.access &&
    input.connectivity &&
    input.fallbackReady &&
    transport === 'candidate';
  const phases = ['discover', 'assess', 'plan', 'transported', 'cutover', 'validated'] as const,
    phase = phases.indexOf(input.phase);
  const dataCheckDeclared = phase >= 3 && input.transferVerified,
    cutoverReviewed = phase >= 4 && planReady && dataCheckDeclared && input.writersControlled,
    validationDeclared =
      phase === 5 && cutoverReviewed && (input.workload === 'files' || input.appValidated);
  return {
    kind: 'planning' as const,
    input,
    networkLowerBoundHours,
    networkRuledOut,
    physicalKnown,
    physicalRuledOut,
    transport,
    assessmentReady,
    planReady,
    dataCheckDeclared,
    cutoverReviewed,
    validationDeclared,
    migrateRelevant: input.workload === 'application',
    databoxRelevant: input.strategy === 'physical',
    costEstimated: false,
    timeGuaranteed: false,
    transportIsApplicationMigration: false,
    outcome: (!input.discovered || !input.compatible || transport === 'ruled-out'
      ? 0
      : validationDeclared
        ? 2
        : 1) as Outcome,
    ...boundary,
  };
}
export function runMigration(v: unknown) {
  if (!validMigrationInput(v)) return null;
  return v.kind === 'method' ? runMethod(v) : v.kind === 'sync' ? runSync(v) : runPlanning(v);
}
export function initialMigration(kind: 'method'): MethodInput;
export function initialMigration(kind: 'sync'): SyncInput;
export function initialMigration(kind: 'planning'): PlanningInput;
export function initialMigration(kind: 'method' | 'sync' | 'planning'): MigrationInput;
export function initialMigration(kind: 'method' | 'sync' | 'planning'): MigrationInput {
  if (kind === 'method')
    return {
      kind,
      dataset: 'media',
      destination: 'blob',
      cadence: 'once',
      interface: 'either',
      volume: 'small',
      host: 'windows',
      tool: 'azcopy',
      access: true,
      network: true,
      supported: true,
      sourceStable: true,
      fidelity: 'content',
      fidelityChecked: false,
    };
  if (kind === 'sync')
    return {
      kind,
      method: 'copy',
      direction: 'a-to-cloud',
      scenario: 'baseline',
      comparison: 'time',
      deleteDestination: false,
      cloudTiering: false,
      localContent: true,
      connected: true,
      access: true,
      supported: true,
      fidelity: 'content',
      fidelityKnown: false,
      detected: true,
    };
  return {
    kind,
    workload: 'application',
    strategy: 'online',
    phase: 'plan',
    sizeGB: 20000,
    mbps: 100,
    windowHours: 240,
    physicalHours: 120,
    discovered: true,
    dependencies: false,
    assessmentFresh: true,
    compatible: true,
    access: true,
    connectivity: true,
    deviceEligible: true,
    logisticsKnown: true,
    transferVerified: false,
    writersControlled: false,
    appValidated: false,
    fallbackReady: true,
  };
}
