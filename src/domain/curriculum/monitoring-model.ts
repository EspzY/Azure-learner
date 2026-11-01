/** Fixed pedagogical observations only. No World, clock, network, ingestion or runtime. */
export const monitoringModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export const evidenceQuestions = [
  'cost-review',
  'security-review',
  'reliability-review',
  'performance-review',
  'operations-review',
  'broad-check',
  'subscription-issue',
  'resource-check',
  'request-failure',
] as const;
export const evidenceTools = [
  'advisor',
  'status',
  'service-health',
  'resource-health',
  'metrics',
  'log-analytics',
  'application-insights',
] as const;
export const evidenceSignals = [
  'recommendation',
  'global-notice',
  'personal-notice',
  'health-observation',
  'metric',
  'correlated-records',
  'missing',
] as const;
export interface EvidenceInput {
  kind: 'evidence';
  question: (typeof evidenceQuestions)[number];
  tool: (typeof evidenceTools)[number];
  signal: (typeof evidenceSignals)[number];
  dataReady: boolean;
  fresh: boolean;
}
export interface HealthInput {
  kind: 'health';
  subscription: 'app' | 'shared';
  region: 'westeurope' | 'northeurope';
  resourceType: 'web' | 'vm';
  event: 'issue' | 'maintenance' | 'advisory' | 'none';
  publicNotice: boolean;
  inspection: 'during' | 'after';
  health: 'available' | 'unavailable' | 'degraded' | 'unknown';
  supported: boolean;
  appObservation: 'errors' | 'normal-sample' | 'missing';
}
export interface TelemetryInput {
  kind: 'telemetry';
  fixture: 'morning' | 'quiet';
  signal: 'cpu' | 'duration';
  coverage: 'full' | 'gap' | 'none';
  instrumented: boolean;
  logSource: 'activity' | 'resource' | 'application';
  routed: boolean;
  access: boolean;
  filter: 'all' | 'errors' | 'operation-a';
  aggregation: 'average' | 'maximum';
  window: 3 | 5;
  threshold: 50 | 70 | 400;
  rule: 'none' | 'enabled' | 'disabled';
  ruleSignal: 'cpu' | 'duration';
  actionGroup: boolean;
}
export type MonitoringInput = EvidenceInput | HealthInput | TelemetryInput;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: Record<string, unknown>, keys: string[]) =>
  Object.keys(v).sort().join() === keys.sort().join();
const one = (v: unknown, choices: readonly unknown[]) => choices.includes(v);
const bool = (v: Record<string, unknown>, keys: string[]) =>
  keys.every((k) => typeof v[k] === 'boolean');
export function validMonitoringInput(v: unknown): v is MonitoringInput {
  if (!object(v)) return false;
  if (v.kind === 'evidence')
    return (
      exact(v, ['kind', 'question', 'tool', 'signal', 'dataReady', 'fresh']) &&
      one(v.question, evidenceQuestions) &&
      one(v.tool, evidenceTools) &&
      one(v.signal, evidenceSignals) &&
      bool(v, ['dataReady', 'fresh'])
    );
  if (v.kind === 'health')
    return (
      exact(v, [
        'kind',
        'subscription',
        'region',
        'resourceType',
        'event',
        'publicNotice',
        'inspection',
        'health',
        'supported',
        'appObservation',
      ]) &&
      one(v.subscription, ['app', 'shared']) &&
      one(v.region, ['westeurope', 'northeurope']) &&
      one(v.resourceType, ['web', 'vm']) &&
      one(v.event, ['issue', 'maintenance', 'advisory', 'none']) &&
      one(v.inspection, ['during', 'after']) &&
      one(v.health, ['available', 'unavailable', 'degraded', 'unknown']) &&
      one(v.appObservation, ['errors', 'normal-sample', 'missing']) &&
      bool(v, ['publicNotice', 'supported'])
    );
  if (v.kind === 'telemetry')
    return (
      exact(v, [
        'kind',
        'fixture',
        'signal',
        'coverage',
        'instrumented',
        'logSource',
        'routed',
        'access',
        'filter',
        'aggregation',
        'window',
        'threshold',
        'rule',
        'ruleSignal',
        'actionGroup',
      ]) &&
      one(v.fixture, ['morning', 'quiet']) &&
      one(v.signal, ['cpu', 'duration']) &&
      one(v.coverage, ['full', 'gap', 'none']) &&
      one(v.logSource, ['activity', 'resource', 'application']) &&
      one(v.filter, ['all', 'errors', 'operation-a']) &&
      one(v.aggregation, ['average', 'maximum']) &&
      one(v.window, [3, 5]) &&
      one(v.threshold, [50, 70, 400]) &&
      one(v.rule, ['none', 'enabled', 'disabled']) &&
      one(v.ruleSignal, ['cpu', 'duration']) &&
      bool(v, ['instrumented', 'routed', 'access', 'actionGroup'])
    );
  return false;
}
const conceptual = {
  synthetic: true,
  actualTelemetry: false,
  actualNotification: false,
  actualRemediation: false,
  actualAzureIncident: false,
  actualQuery: false,
  actualWorldMutation: false,
} as const;
export function runEvidence(input: EvidenceInput) {
  if (!validMonitoringInput(input) || input.kind !== 'evidence') return null;
  const recommendation = input.question.endsWith('-review');
  const target = recommendation
    ? 'recommendation'
    : input.question === 'broad-check'
      ? 'global-notice'
      : input.question === 'subscription-issue'
        ? 'personal-notice'
        : input.question === 'resource-check'
          ? 'health-observation'
          : 'correlated-records';
  const suitable = recommendation
    ? input.tool === 'advisor'
    : input.question === 'broad-check'
      ? input.tool === 'status'
      : input.question === 'subscription-issue'
        ? input.tool === 'service-health'
        : input.question === 'resource-check'
          ? input.tool === 'resource-health'
          : ['application-insights', 'log-analytics'].includes(input.tool);
  const signalFits = input.signal === target;
  const supported = suitable && signalFits && input.dataReady && input.fresh;
  const category = recommendation ? input.question.slice(0, -7) : null;
  return {
    kind: 'evidence' as const,
    input,
    suitable,
    signalFits,
    supported,
    target,
    category,
    confirmedOutage: false,
    applicationHealthyProven: false,
    outcome: (!suitable || !signalFits ? 0 : supported ? 2 : 1) as Outcome,
    ...conceptual,
  };
}
export function runHealth(input: HealthInput) {
  if (!validMonitoringInput(input) || input.kind !== 'health') return null;
  const eventPresent = input.event !== 'none',
    subscriptionMatches = input.subscription === 'app',
    regionMatches = input.region === 'westeurope',
    serviceMatches = input.resourceType === 'web';
  const relevant = eventPresent && subscriptionMatches && regionMatches && serviceMatches;
  const current = input.inspection === 'during';
  const globalVisible = eventPresent && input.publicNotice;
  const currentHealth = input.supported && current ? input.health : 'unknown';
  return {
    kind: 'health' as const,
    input,
    eventPresent,
    subscriptionMatches,
    regionMatches,
    serviceMatches,
    relevant,
    current,
    eventActive: relevant && current,
    globalVisible,
    currentHealth,
    healthAvailable: currentHealth === 'available',
    healthUnavailable: currentHealth === 'unavailable',
    appFailureObserved: current && input.appObservation === 'errors',
    appSignalMissing: !current || input.appObservation === 'missing',
    platformCauseConfirmed: false,
    applicationHealthyProven: false,
    maintenanceDowntimeProven: false,
    eventStart: '2026-09-18T08:00:00Z',
    eventEnd: '2026-09-18T08:10:00Z',
    observedAt: '2026-09-18T08:04:00Z',
    inspectedAt: current ? '2026-09-18T08:05:00Z' : '2026-09-18T10:00:00Z',
    eventScope: { subscription: 'app', region: 'westeurope', resourceType: 'web' },
    outcome: (!input.supported ||
    !current ||
    currentHealth === 'unknown' ||
    input.appObservation === 'missing'
      ? 1
      : 2) as Outcome,
    ...conceptual,
  };
}
export const telemetryFixtureVersion = 'fjordverk-observations@1.0.0';
export const telemetryMinutes = ['08:00', '08:01', '08:02', '08:03', '08:04', '08:05'] as const;
const numeric = {
  morning: { cpu: [30, 40, 70, 90, 80, 50], duration: [100, 110, 280, 500, 650, 320] },
  quiet: { cpu: [20, 24, 22, 26, 21, 23], duration: [90, 100, 95, 105, 98, 102] },
} as const;
export interface ObservationRow {
  minute: string;
  source: 'activity' | 'resource' | 'application';
  operation: string;
  result: 'success' | 'error';
  code: string;
  operationId: string;
  detail: string;
}
/** These rows are invented independently of the authoritative local Portal ledger. */
export const syntheticRows: readonly ObservationRow[] = [
  {
    minute: '08:01',
    source: 'activity',
    operation: 'Update configuration',
    result: 'success',
    code: 'Succeeded',
    operationId: 'change-1',
    detail: 'Fiktiv management-endring',
  },
  {
    minute: '08:03',
    source: 'activity',
    operation: 'Update configuration',
    result: 'error',
    code: 'Failed',
    operationId: 'change-2',
    detail: 'Fiktiv management-feil',
  },
  {
    minute: '08:03',
    source: 'resource',
    operation: 'HTTP request',
    result: 'error',
    code: '500',
    operationId: 'operation-a',
    detail: 'Fiktiv tjenesteloggrad',
  },
  {
    minute: '08:04',
    source: 'resource',
    operation: 'HTTP request',
    result: 'success',
    code: '200',
    operationId: 'operation-b',
    detail: 'Fiktiv tjenesteloggrad',
  },
  {
    minute: '08:03',
    source: 'application',
    operation: 'Request',
    result: 'error',
    code: '500',
    operationId: 'operation-a',
    detail: 'Fiktiv innkommende bestilling',
  },
  {
    minute: '08:03',
    source: 'application',
    operation: 'Dependency',
    result: 'error',
    code: 'timeout',
    operationId: 'operation-a',
    detail: 'Fiktivt databasekall',
  },
  {
    minute: '08:03',
    source: 'application',
    operation: 'Exception',
    result: 'error',
    code: 'TimeoutException',
    operationId: 'operation-a',
    detail: 'Fiktiv exception i samme arbeid',
  },
  {
    minute: '08:04',
    source: 'application',
    operation: 'Request',
    result: 'success',
    code: '200',
    operationId: 'operation-b',
    detail: 'Fiktiv innkommende bestilling',
  },
];
export function runTelemetry(input: TelemetryInput) {
  if (!validMonitoringInput(input) || input.kind !== 'telemetry') return null;
  const metricAvailable = input.signal === 'cpu' || input.instrumented;
  const points = telemetryMinutes.map((minute, index) => ({
    minute,
    value:
      !metricAvailable || input.coverage === 'none' || (input.coverage === 'gap' && index === 4)
        ? null
        : (numeric[input.fixture][input.signal][index] ?? null),
    inWindow: index >= 6 - input.window,
  }));
  const selected = points.filter((x) => x.inWindow),
    values = selected.flatMap((x) => (x.value === null ? [] : [x.value]));
  const observedAggregate = values.length
    ? input.aggregation === 'average'
      ? values.reduce((a, b) => a + b, 0) / values.length
      : Math.max(...values)
    : null;
  // Explicit pedagogical confidence gate, stricter than Azure's source-specific NULL behavior.
  const completeWindow = values.length === input.window;
  const conditionMet =
    completeWindow && observedAggregate !== null ? observedAggregate > input.threshold : null;
  const ruleMatches = input.ruleSignal === input.signal;
  const assessment:
    | 'not-configured'
    | 'disabled'
    | 'different-signal'
    | 'insufficient-data'
    | 'fired'
    | 'condition-not-met' =
    input.rule === 'none'
      ? 'not-configured'
      : input.rule === 'disabled'
        ? 'disabled'
        : !ruleMatches
          ? 'different-signal'
          : conditionMet === null
            ? 'insufficient-data'
            : conditionMet
              ? 'fired'
              : 'condition-not-met';
  const fired = assessment === 'fired',
    notificationPath = fired && input.actionGroup;
  const logsAvailable =
    input.access && (input.logSource === 'application' ? input.instrumented : input.routed);
  const records = logsAvailable
    ? syntheticRows.filter(
        (row) =>
          row.source === input.logSource &&
          telemetryMinutes.indexOf(row.minute as (typeof telemetryMinutes)[number]) >=
            6 - input.window &&
          (input.fixture === 'morning' || row.result === 'success') &&
          (input.filter === 'all' ||
            (input.filter === 'errors' && row.result === 'error') ||
            (input.filter === 'operation-a' && row.operationId === 'operation-a')),
      )
    : [];
  const tracesAvailable = input.instrumented && input.access;
  const traceRows = tracesAvailable
    ? syntheticRows.filter(
        (r) =>
          r.source === 'application' &&
          r.operationId === 'operation-a' &&
          input.fixture === 'morning',
      )
    : [];
  return {
    kind: 'telemetry' as const,
    input,
    fixtureVersion: telemetryFixtureVersion,
    points,
    unit: input.signal === 'cpu' ? '%' : 'ms',
    metricAvailable,
    selected,
    validCount: values.length,
    expectedCount: input.window,
    observedAggregate,
    completeWindow,
    conditionMet,
    ruleMatches,
    assessment,
    fired,
    notificationPath,
    logsAvailable,
    records,
    tracesAvailable,
    traceRows,
    traceCauseConfirmed: false,
    queryCreatesRule: false,
    actualAzureAlert: false,
    userResponse: 'not-modeled' as const,
    outcome: (conditionMet === null || !logsAvailable ? 1 : 2) as Outcome,
    ...conceptual,
  };
}
export const initialMonitoring = (kind: MonitoringInput['kind']): MonitoringInput =>
  kind === 'evidence'
    ? {
        kind,
        question: 'request-failure',
        tool: 'advisor',
        signal: 'recommendation',
        dataReady: true,
        fresh: true,
      }
    : kind === 'health'
      ? {
          kind,
          subscription: 'app',
          region: 'westeurope',
          resourceType: 'web',
          event: 'issue',
          publicNotice: false,
          inspection: 'during',
          health: 'available',
          supported: true,
          appObservation: 'errors',
        }
      : {
          kind,
          fixture: 'morning',
          signal: 'cpu',
          coverage: 'full',
          instrumented: false,
          logSource: 'resource',
          routed: false,
          access: true,
          filter: 'all',
          aggregation: 'maximum',
          window: 5,
          threshold: 70,
          rule: 'none',
          ruleSignal: 'cpu',
          actionGroup: false,
        };
export function runMonitoring(v: unknown) {
  if (!validMonitoringInput(v)) return null;
  return v.kind === 'evidence'
    ? runEvidence(v)
    : v.kind === 'health'
      ? runHealth(v)
      : runTelemetry(v);
}
