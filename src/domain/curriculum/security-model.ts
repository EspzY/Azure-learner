/** Pure declared design/evidence comparisons. Never AuthN, AuthZ, scanning or attack runtime. */
export const securityModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export const securityLayers = [
  'physical',
  'identity',
  'perimeter',
  'network',
  'compute',
  'application',
  'data',
] as const;
export type SecurityLayer = (typeof securityLayers)[number];
export interface TrustInput {
  kind: 'trust';
  network: 'internal' | 'external';
  identity: 'known' | 'unverified';
  device: 'documented' | 'unknown';
  sensitivity: 'routine' | 'sensitive';
  mfa: boolean;
  contextReview: boolean;
  scope: 'minimal' | 'broad' | 'missing';
  duration: 'task-bound' | 'permanent';
  segmented: boolean;
  dataProtection: boolean;
  observability: boolean;
  recovery: boolean;
}
export const securityControls = {
  physical: { layer: 'physical', purpose: 'physical-access' },
  mfa: { layer: 'identity', purpose: 'password-misuse' },
  least: { layer: 'identity', purpose: 'privilege-impact' },
  ddos: { layer: 'perimeter', purpose: 'volume-availability' },
  segment: { layer: 'network', purpose: 'lateral-reach' },
  patch: { layer: 'compute', purpose: 'known-host-weakness' },
  app: { layer: 'application', purpose: 'request-authorization' },
  vault: { layer: 'application', purpose: 'secret-exposure' },
  encrypt: { layer: 'data', purpose: 'offline-confidentiality' },
  dataScope: { layer: 'data', purpose: 'data-impact' },
  backup: { layer: 'data', purpose: 'recovery' },
} as const;
export type SecurityControl = keyof typeof securityControls;
export const securityRisks = {
  password: {
    direct: 'identity',
    primary: ['mfa'],
    complements: ['segment', 'dataScope'],
    remaining: 'session-and-application-risk',
  },
  host: {
    direct: 'compute',
    primary: ['patch'],
    complements: ['segment', 'dataScope', 'backup'],
    remaining: 'original-host-and-service-risk',
  },
  application: {
    direct: 'application',
    primary: ['app'],
    complements: ['dataScope'],
    remaining: 'within-data-scope-risk',
  },
  copy: {
    direct: 'data',
    primary: ['encrypt'],
    complements: ['least'],
    remaining: 'authorized-use-and-key-risk',
  },
} as const;
export type SecurityRisk = keyof typeof securityRisks;
export interface DepthInput {
  kind: 'depth';
  risk: SecurityRisk;
  inspectedLayer: SecurityLayer;
  primary: SecurityControl;
  complement: SecurityControl;
  failure: 'none' | SecurityLayer;
  primaryConfigured: boolean;
  complementConfigured: boolean;
}
export interface DefenderInput {
  kind: 'defender';
  resource: 'server' | 'container' | 'storage' | 'database' | 'app';
  posturePlan: 'none' | 'foundational' | 'defender';
  workloadPlan: boolean;
  requirementsReady: boolean;
  fresh: boolean;
  recommendation: 'none' | 'foundational' | 'defender' | 'workload';
  alert: 'none' | 'declared' | 'missing';
  feature: 'posture' | 'risk-prioritization' | 'workload';
  followUp:
    | 'configuration-review'
    | 'investigate-evidence'
    | 'confirm-coverage'
    | 'close-as-remediated'
    | 'continue-observing';
  scoreView: 'classic' | 'cloud-risk';
}
export type SecurityInput = TrustInput | DepthInput | DefenderInput;
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(v).sort().join() === keys.slice().sort().join();
const one = (v: unknown, c: readonly unknown[]) => c.includes(v);
const bool = (v: Record<string, unknown>, keys: readonly string[]) =>
  keys.every((k) => typeof v[k] === 'boolean');
export function validSecurityInput(v: unknown): v is SecurityInput {
  if (!obj(v)) return false;
  if (v.kind === 'trust')
    return (
      exact(v, [
        'kind',
        'network',
        'identity',
        'device',
        'sensitivity',
        'mfa',
        'contextReview',
        'scope',
        'duration',
        'segmented',
        'dataProtection',
        'observability',
        'recovery',
      ]) &&
      one(v.network, ['internal', 'external']) &&
      one(v.identity, ['known', 'unverified']) &&
      one(v.device, ['documented', 'unknown']) &&
      one(v.sensitivity, ['routine', 'sensitive']) &&
      one(v.scope, ['minimal', 'broad', 'missing']) &&
      one(v.duration, ['task-bound', 'permanent']) &&
      bool(v, ['mfa', 'contextReview', 'segmented', 'dataProtection', 'observability', 'recovery'])
    );
  if (v.kind === 'depth')
    return (
      exact(v, [
        'kind',
        'risk',
        'inspectedLayer',
        'primary',
        'complement',
        'failure',
        'primaryConfigured',
        'complementConfigured',
      ]) &&
      one(v.risk, Object.keys(securityRisks)) &&
      one(v.inspectedLayer, securityLayers) &&
      one(v.primary, Object.keys(securityControls)) &&
      one(v.complement, Object.keys(securityControls)) &&
      one(v.failure, ['none', ...securityLayers]) &&
      bool(v, ['primaryConfigured', 'complementConfigured'])
    );
  if (v.kind === 'defender')
    return (
      exact(v, [
        'kind',
        'resource',
        'posturePlan',
        'workloadPlan',
        'requirementsReady',
        'fresh',
        'recommendation',
        'alert',
        'feature',
        'followUp',
        'scoreView',
      ]) &&
      one(v.resource, ['server', 'container', 'storage', 'database', 'app']) &&
      one(v.posturePlan, ['none', 'foundational', 'defender']) &&
      one(v.recommendation, ['none', 'foundational', 'defender', 'workload']) &&
      one(v.alert, ['none', 'declared', 'missing']) &&
      one(v.feature, ['posture', 'risk-prioritization', 'workload']) &&
      one(v.followUp, [
        'configuration-review',
        'investigate-evidence',
        'confirm-coverage',
        'close-as-remediated',
        'continue-observing',
      ]) &&
      one(v.scoreView, ['classic', 'cloud-risk']) &&
      bool(v, ['workloadPlan', 'requirementsReady', 'fresh'])
    );
  return false;
}
const boundary = {
  synthetic: true,
  actualAccessDecision: false,
  actualCompromise: false,
  actualSecurityAssessment: false,
  actualAlert: false,
  actualRemediation: false,
  actualWorldMutation: false,
  securityGuaranteed: false,
} as const;
export function runTrust(input: TrustInput) {
  if (!validSecurityInput(input) || input.kind !== 'trust') return null;
  // A closed design-review checklist, not a CA policy or RBAC role evaluation.
  const verify = {
    identity: input.identity === 'known',
    device: input.sensitivity === 'routine' || input.device === 'documented',
    context: input.contextReview,
  };
  const privilege = { scope: input.scope === 'minimal', duration: input.duration === 'task-bound' };
  const preparation = {
    segmentation: input.segmented,
    data: input.dataProtection,
    detection: input.observability,
    recovery: input.recovery,
  };
  const verificationDescribed = Object.values(verify).every(Boolean),
    privilegeBounded = Object.values(privilege).every(Boolean),
    breachPrepared = Object.values(preparation).every(Boolean);
  return {
    kind: 'trust' as const,
    input,
    verify,
    privilege,
    preparation,
    verificationDescribed,
    privilegeBounded,
    breachPrepared,
    mfaContribution: input.mfa ? 'authentication-evidence' : 'not-declared',
    networkTrustGranted: false,
    incidentConfirmed: false,
    permissionsGranted: false,
    residual: 'application-implementation-and-unobserved-controls',
    outcome: (verificationDescribed && privilegeBounded && breachPrepared
      ? 2
      : input.identity === 'unverified' || input.scope === 'missing'
        ? 0
        : 1) as Outcome,
    ...boundary,
  };
}
export function runDepth(input: DepthInput) {
  if (!validSecurityInput(input) || input.kind !== 'depth') return null;
  const risk = securityRisks[input.risk],
    primary = securityControls[input.primary],
    complement = securityControls[input.complement];
  const primaryFits = (risk.primary as readonly string[]).includes(input.primary),
    complementFits = (risk.complements as readonly string[]).includes(input.complement);
  const primaryAvailable = input.primaryConfigured && input.failure !== primary.layer,
    complementAvailable = input.complementConfigured && input.failure !== complement.layer;
  const independentBoundary = primary.layer !== complement.layer;
  const primaryContribution = primaryFits && primaryAvailable,
    complementContribution = complementFits && complementAvailable && independentBoundary;
  return {
    kind: 'depth' as const,
    input,
    directLayer: risk.direct,
    inspectedRelevant: input.inspectedLayer === risk.direct,
    primaryLayer: primary.layer,
    complementLayer: complement.layer,
    primaryFits,
    complementFits,
    primaryAvailable,
    complementAvailable,
    independentBoundary,
    primaryContribution,
    complementContribution,
    contribution: complementContribution
      ? input.complement === 'backup'
        ? ('recovery' as const)
        : ('limits-consequence' as const)
      : ('no-matching-complement' as const),
    remaining: risk.remaining,
    originalWeaknessStillPresent: !primaryContribution,
    attackSimulated: false,
    independenceIsAssumption: true,
    outcome: (!primaryFits || !complementFits || !independentBoundary
      ? 0
      : primaryContribution || complementContribution
        ? 2
        : 1) as Outcome,
    ...boundary,
  };
}
export function runDefender(input: DefenderInput) {
  if (!validSecurityInput(input) || input.kind !== 'defender') return null;
  const contextReady = input.requirementsReady && input.fresh;
  const postureAvailable =
    contextReady &&
    (input.posturePlan !== 'none' || (input.recommendation === 'workload' && input.workloadPlan));
  const advancedAvailable = contextReady && input.posturePlan === 'defender';
  const workloadAvailable = contextReady && input.workloadPlan;
  const recommendationPlanMet =
    input.recommendation === 'foundational'
      ? input.posturePlan !== 'none'
      : input.recommendation === 'defender'
        ? input.posturePlan === 'defender'
        : input.recommendation === 'workload'
          ? input.workloadPlan
          : false;
  const recommendationVisible =
    input.recommendation !== 'none' && contextReady && recommendationPlanMet;
  const alertVisible = input.alert === 'declared' && workloadAvailable;
  const selectedFeatureAvailable =
    input.feature === 'posture'
      ? postureAvailable
      : input.feature === 'risk-prioritization'
        ? advancedAvailable
        : workloadAvailable;
  const selectedEvidenceAvailable =
    input.feature === 'workload' ? alertVisible : recommendationVisible;
  const noRecord =
    selectedFeatureAvailable &&
    (input.feature === 'workload' ? input.alert === 'none' : input.recommendation === 'none');
  const unavailableRecord =
    input.feature === 'workload'
      ? input.alert === 'missing' || (input.alert === 'declared' && !alertVisible)
      : input.recommendation !== 'none' && !recommendationVisible;
  const needsCoverage = !selectedFeatureAvailable || unavailableRecord;
  const followUpFits =
    input.followUp === 'continue-observing'
      ? noRecord
      : input.followUp === 'confirm-coverage'
        ? needsCoverage
        : input.followUp === 'investigate-evidence'
          ? input.feature === 'workload' && alertVisible
          : input.followUp === 'configuration-review'
            ? input.feature !== 'workload' && recommendationVisible && selectedFeatureAvailable
            : false;
  return {
    kind: 'defender' as const,
    input,
    contextReady,
    postureAvailable,
    advancedAvailable,
    workloadAvailable,
    recommendationPlanMet,
    recommendationVisible,
    alertVisible,
    selectedFeatureAvailable,
    selectedEvidenceAvailable,
    needsCoverage,
    noRecord,
    unavailableRecord,
    followUpFits,
    recordClassification:
      input.feature === 'workload' ? 'threat-detection-evidence' : 'posture-evidence',
    scoreModel:
      input.scoreView === 'classic'
        ? ('classic-control-based' as const)
        : ('cloud-risk-based' as const),
    scoreValue: null,
    scoreModelsIdentical: false,
    scoreIsSafetyProof: false,
    incidentConfirmed: false,
    planIsScanProof: false,
    resourceIsCoverageProof: false,
    noAlertsIsSafe: false,
    outcome: (!followUpFits ? 0 : needsCoverage ? 1 : 2) as Outcome,
    ...boundary,
  };
}
export const initialSecurity = (kind: SecurityInput['kind']): SecurityInput =>
  kind === 'trust'
    ? {
        kind,
        network: 'internal',
        identity: 'known',
        device: 'unknown',
        sensitivity: 'sensitive',
        mfa: true,
        contextReview: false,
        scope: 'broad',
        duration: 'permanent',
        segmented: false,
        dataProtection: false,
        observability: false,
        recovery: false,
      }
    : kind === 'depth'
      ? {
          kind,
          risk: 'password',
          inspectedLayer: 'identity',
          primary: 'mfa',
          complement: 'segment',
          failure: 'none',
          primaryConfigured: true,
          complementConfigured: false,
        }
      : {
          kind,
          resource: 'server',
          posturePlan: 'foundational',
          workloadPlan: false,
          requirementsReady: true,
          fresh: true,
          recommendation: 'foundational',
          alert: 'declared',
          feature: 'posture',
          followUp: 'configuration-review',
          scoreView: 'classic',
        };
export function runSecurity(v: unknown) {
  if (!validSecurityInput(v)) return null;
  return v.kind === 'trust' ? runTrust(v) : v.kind === 'depth' ? runDepth(v) : runDefender(v);
}
