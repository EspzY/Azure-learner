export const unitIds = [
  'capacity',
  'responsibility',
  'models',
  'placement',
  'metering',
  'pricing',
] as const;
export type UnitId = (typeof unitIds)[number];
export const objectiveIds = ['FC01', 'FC02', 'FC03', 'FC04', 'FC05', 'FC06', 'FC07'] as const;
export type ObjectiveId = (typeof objectiveIds)[number];
export const competencies = [
  'F01',
  'F02',
  'F03',
  'G01',
  'G02',
  'G03',
  'G04',
  'N01',
  'N02',
  'N03',
  'N04',
  'C01',
  'C02',
  'C03',
  'C04',
  'D01',
  'D02',
  'D03',
  'I01',
  'I02',
  'I03',
  'O01',
  'O02',
  'O03',
  'A01',
  'A02',
  'A03',
  'R01',
  'R02',
  'R03',
] as const;
const learn = 'https://learn.microsoft.com/en-us/';
export const sources = {
  L01: 'training/modules/describe-cloud-compute/',
  L02: 'training/modules/describe-cloud-compute/3-what-cloud-compute',
  L03: 'azure/security/fundamentals/shared-responsibility',
  L04: 'training/modules/describe-cloud-compute/5-define-cloud-models',
  L05: 'training/modules/describe-cloud-compute/6-describe-consumption-based-model',
  L06: 'training/modules/describe-cost-management-azure/7a-describe-cost-optimization-options',
  L07: 'azure/cost-management-billing/reservations/save-compute-costs-reservations',
  L08: 'azure/cost-management-billing/savings-plan/savings-plan-overview',
} as const;
export const sourceUrl = (id: keyof typeof sources) => learn + sources[id];
export const sourceRecords = Object.fromEntries(
  Object.keys(sources).map((id) => [
    id,
    {
      url: sourceUrl(id as keyof typeof sources),
      publisher: 'Microsoft',
      reviewed: '2026-10-23',
      observedVersion: 'live-page-index-and-technical-scope',
      usage: 'reference-only',
      humanSme: null,
    },
  ]),
);
export interface UnitDefinition {
  id: UnitId;
  objectives: readonly ObjectiveId[];
  prerequisites: readonly UnitId[];
  sources: readonly (keyof typeof sources)[];
  activities: readonly string[];
}
export const units: readonly UnitDefinition[] = [
  {
    id: 'capacity',
    objectives: ['FC01', 'FC02'],
    prerequisites: [],
    sources: ['L01', 'L02'],
    activities: ['teach-capacity', 'probe-capacity', 'apply-capacity'],
  },
  {
    id: 'responsibility',
    objectives: ['FC03'],
    prerequisites: ['capacity'],
    sources: ['L03'],
    activities: ['teach-responsibility', 'probe-responsibility', 'apply-responsibility'],
  },
  {
    id: 'models',
    objectives: ['FC04'],
    prerequisites: ['capacity'],
    sources: ['L04'],
    activities: ['teach-models', 'probe-models', 'apply-models'],
  },
  {
    id: 'placement',
    objectives: ['FC05'],
    prerequisites: ['models'],
    sources: ['L04'],
    activities: ['teach-placement', 'probe-placement', 'apply-placement'],
  },
  {
    id: 'metering',
    objectives: ['FC06'],
    prerequisites: ['capacity'],
    sources: ['L05'],
    activities: ['teach-metering', 'probe-metering', 'apply-metering'],
  },
  {
    id: 'pricing',
    objectives: ['FC07'],
    prerequisites: ['metering'],
    sources: ['L06', 'L07', 'L08'],
    activities: ['teach-pricing', 'probe-pricing', 'apply-pricing'],
  },
];
export const curriculum = {
  schema: 1,
  version: '1.0.0',
  track: 'cloud-foundations',
  region: 'lysningen',
  chapter: 'cloud-decisions',
  module: 'foundations-01',
  competencies: ['F01', 'F03'],
  units,
  requiredObjectives: objectiveIds,
  certificationOverlay: {
    id: 'AZ-900',
    effective: '2026-07-20',
    reviewed: '2026-10-23',
    source: learn + 'credentials/certifications/resources/study-guides/az-900',
    excluded: ['serverless'],
  },
  review: { sourceChecked: '2026-10-23', humanSme: null, learnerStudy: null },
} as const;
// Finite registry: these bindings are implemented by FoundationsSession and pure evaluators.
export const activities: Record<
  string,
  { unit: UnitId; kind: 'teaching' | 'practice' | 'guided-assessment'; implemented: boolean }
> = {
  'teach-capacity': { unit: 'capacity', kind: 'teaching', implemented: true },
  'probe-capacity': { unit: 'capacity', kind: 'practice', implemented: true },
  'apply-capacity': { unit: 'capacity', kind: 'guided-assessment', implemented: true },
  'teach-responsibility': { unit: 'responsibility', kind: 'teaching', implemented: true },
  'probe-responsibility': { unit: 'responsibility', kind: 'practice', implemented: true },
  'apply-responsibility': { unit: 'responsibility', kind: 'guided-assessment', implemented: true },
  'teach-models': { unit: 'models', kind: 'teaching', implemented: true },
  'probe-models': { unit: 'models', kind: 'practice', implemented: true },
  'apply-models': { unit: 'models', kind: 'guided-assessment', implemented: true },
  'teach-placement': { unit: 'placement', kind: 'teaching', implemented: true },
  'probe-placement': { unit: 'placement', kind: 'practice', implemented: true },
  'apply-placement': { unit: 'placement', kind: 'guided-assessment', implemented: true },
  'teach-metering': { unit: 'metering', kind: 'teaching', implemented: true },
  'probe-metering': { unit: 'metering', kind: 'practice', implemented: true },
  'apply-metering': { unit: 'metering', kind: 'guided-assessment', implemented: true },
  'teach-pricing': { unit: 'pricing', kind: 'teaching', implemented: true },
  'probe-pricing': { unit: 'pricing', kind: 'practice', implemented: true },
  'apply-pricing': { unit: 'pricing', kind: 'guided-assessment', implemented: true },
};
export const transferCriteria = [
  { id: 'service', objective: 'FC01', answer: 'provisioning' },
  { id: 'shortfall', objective: 'FC02', answer: '5', input: 'number' },
  { id: 'duties', objective: 'FC03', answer: 'customer' },
  { id: 'exclusive', objective: 'FC04', answer: 'private' },
  { id: 'integration', objective: 'FC05', answer: 'hybrid' },
  { id: 'idle', objective: 'FC06', answer: 'allocated' },
  { id: 'uncertain', objective: 'FC07', answer: 'usage' },
  { id: 'commitment', objective: 'FC07', answer: 'paid' },
] as const;

/** Separate FC08 version; the above original v1 objective/rubric set is frozen. */
export { serverlessManifest } from './serverless';

/** Independently versioned Part A; no old rubric/evidence upgrade. */
export { physicalManifest } from './architecture-physical';

export { managementManifest } from './architecture-management';

export { transferManifest } from './transfer';
export { costManifest } from './cost';
export { computeManifest } from './compute';
export { networkingManifest } from './networking';
export { connectivityManifest } from './connectivity';
