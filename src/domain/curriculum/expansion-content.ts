import { nb } from '@/content/nb';
import { trackUnits, type Track } from './expansion';
import { activities } from './expansion-models';
import { competencies } from './manifest';
const learn = 'https://learn.microsoft.com/en-us/';
export const expansionSources: Record<string, { url: string; reviewed: string; version: string }> =
  Object.fromEntries(
    Object.entries({
      B10: 'training/modules/describe-benefits-use-cloud-services/2-high-availability-scalability-cloud',
      B11: 'training/modules/describe-benefits-use-cloud-services/3-reliability-predictability-cloud',
      B12: 'training/modules/describe-benefits-use-cloud-services/4-security-governance-cloud',
      B13: 'training/modules/describe-benefits-use-cloud-services/5-manageability-cloud',
      B14: 'training/modules/describe-benefits-use-cloud-services/5a-describe-sustainability-cloud',
      T10: 'training/modules/describe-cloud-service-types/2-describe-infrastructure-service',
      T11: 'training/modules/describe-cloud-service-types/3-describe-platform-service',
      T12: 'training/modules/describe-cloud-service-types/4-describe-software-service',
      T13: 'azure/virtual-machines/overview',
      T14: 'azure/app-service/overview-hosting-plans',
      T15: 'azure/app-service/overview-patch-os-runtime',
      T16: 'azure/role-based-access-control/overview',
      T17: 'azure/governance/policy/overview',
      T18: 'azure/azure-resource-manager/bicep/overview',
      T19: 'microsoft-365/admin/add-users/assign-admin-roles',
      T20: 'microsoft-365/admin/add-users/add-users',
      T21: 'azure/well-architected/reliability/redundancy',
      T22: 'azure/well-architected/reliability/reliability-test',
      T23: 'azure/well-architected/sustainability/sustainability-performance-efficiency-recommendations',
    }).map(([id, path]) => [
      id,
      { url: learn + path, reviewed: '2026-10-25', version: 'rolling-page@2026-10-25' },
    ]),
  );
export const bindings = {
  availability: { objective: 'CB01', competency: 'F02', sources: ['B10', 'T21'] },
  reliability: { objective: 'CB02', competency: 'F02', sources: ['B11', 'T22'] },
  governance: { objective: 'CB03', competency: 'G03', sources: ['B12', 'T16', 'T17'] },
  management: { objective: 'CB04', competency: 'A01', sources: ['B13', 'T18'] },
  sustainability: { objective: 'CB05', competency: 'F03', sources: ['B14', 'T23'] },
  overview: { objective: 'ST04', competency: 'F01', sources: ['T10', 'T11', 'T12'] },
  iaas: { objective: 'ST01', competency: 'C01', sources: ['T10', 'T13'] },
  paas: { objective: 'ST02', competency: 'C01', sources: ['T11', 'T14', 'T15'] },
  saas: { objective: 'ST03', competency: 'I01', sources: ['T12', 'T19', 'T20'] },
  selection: { objective: 'ST04', competency: 'R01', sources: ['T10', 'T11', 'T12'] },
  practice: { objective: 'ST02', competency: 'G01', sources: ['T14', 'T17'] },
} as const;
export interface Manuscript {
  title: string;
  objective: string;
  prerequisite: string;
  intuition: string;
  mechanism: string;
  azure: string;
  example: string;
  misconception: string;
  limits: string;
  terms: readonly (readonly string[])[];
  goal: string;
  why: string;
  action: string;
  expect: string;
  question: string;
  choices: readonly (readonly string[])[];
}
export const manuscript = (track: Track, unit: string): Manuscript | undefined =>
  (nb.expansion[track].units as Record<string, Manuscript>)[unit];
export const expansionManifest = {
  schema: 1,
  reviewed: '2026-10-25',
  humanSme: null,
  learnerStudy: null,
  sourceReviewed: true,
  benefits: {
    id: 'cloud-benefits',
    version: '1.0.0',
    objectives: ['CB01', 'CB02', 'CB03', 'CB04', 'CB05'],
  },
  services: { id: 'service-types', version: '2.0.0', objectives: ['ST01', 'ST02', 'ST03', 'ST04'] },
} as const;
export const assessmentBindings = {
  benefits: {
    unmet: 'CB01',
    dependency: 'CB02',
    policy: 'CB03',
    template: 'CB04',
    sustainability: 'CB05',
    forecast: 'CB02',
  },
  services: {
    guest: 'ST01',
    patch: 'ST01',
    runtime: 'ST02',
    departure: 'ST03',
    architecture: 'ST04',
    reason: 'ST04',
    hosting: 'ST02',
  },
} as const;
export function validateExpansion() {
  const errors: string[] = [];
  for (const track of ['benefits', 'services'] as const) {
    if (
      Object.keys(nb.expansion[track].units).some(
        (id) => !(trackUnits[track] as readonly string[]).includes(id),
      )
    )
      errors.push(`${track}: orphan manuscript`);
    for (const unit of trackUnits[track]) {
      const c = manuscript(track, unit),
        binding = bindings[unit];
      for (const section of [
        'title',
        'objective',
        'prerequisite',
        'intuition',
        'mechanism',
        'azure',
        'example',
        'misconception',
        'limits',
        'goal',
        'why',
        'action',
        'expect',
        'question',
      ] as const)
        if (!c?.[section]?.trim()) errors.push(`${track}/${unit}: ${section}`);
      if (!c?.terms.length || !c.choices.every((x) => x.length === 3 && x.every(Boolean)))
        errors.push(`${unit}: explanation`);
      if (!(competencies as readonly string[]).includes(binding.competency))
        errors.push(`${unit}: competency`);
      if (binding.sources.some((id) => !expansionSources[id]?.url.startsWith(learn)))
        errors.push(`${unit}: source`);
      if (
        unit !== 'practice' &&
        (!Object.hasOwn(activities, unit) || !activities[unit].required.length)
      )
        errors.push(`${unit}: activity`);
    }
    for (const objective of expansionManifest[track].objectives)
      if (
        !trackUnits[track].some((unit) => bindings[unit].objective === objective) ||
        !(Object.values(assessmentBindings[track]) as readonly string[]).includes(objective)
      )
        errors.push(`${track}: objective ${objective}`);
    if (!nb.expansion[track].assessment.items.every((q) => q.id && q.question && q.explanation))
      errors.push(`${track}: assessment`);
    for (const item of nb.expansion[track].assessment.items)
      if (!Object.hasOwn(assessmentBindings[track], item.id))
        errors.push(`${track}: orphan assessment ${item.id}`);
  }
  return errors;
}
