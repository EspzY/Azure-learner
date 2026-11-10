import { nb } from '@/content/nb';
import { serviceModule } from './learning';
export const serviceSources: Record<string, { url: string; reviewed: string }> = Object.fromEntries(
  [
    ['S01', 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility'],
    ['S12', 'https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans'],
    ['S39', 'https://learn.microsoft.com/en-us/azure/app-service/overview-patch-os-runtime'],
    [
      'P03',
      'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal',
    ],
    ['P04', 'https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage'],
    [
      'P08',
      'https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service',
    ],
    [
      'P09',
      'https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service',
    ],
    [
      'P10',
      'https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service',
    ],
  ].map(([id, url]) => [id!, { url: url!, reviewed: '2026-10-24' }]),
);
export const serviceObjectives = [
  {
    id: 'ST01',
    sections: ['overview', 'iaas'],
    practice: 'legacy',
    criteria: ['os'],
    sources: ['S01', 'P08'],
  },
  {
    id: 'ST02',
    sections: ['overview', 'paas', 'practice'],
    practice: 'custom',
    criteria: ['service', 'hosting', 'cause'],
    sources: ['S01', 'S12', 'S39', 'P09'],
  },
  {
    id: 'ST03',
    sections: ['overview', 'saas'],
    practice: 'ready',
    criteria: ['ready'],
    sources: ['S01', 'P10'],
  },
  {
    id: 'ST04',
    sections: ['selection', 'practice'],
    practice: 'custom',
    criteria: ['service', 'os', 'ready', 'scope'],
    sources: ['P03', 'P04', 'P08', 'P09', 'P10'],
  },
] as const;
/** Validates authoring bindings; browser tests verify that their UI actually works. */
export function validateServiceContent(
  definitions: readonly {
    id: string;
    sections: readonly string[];
    practice: string;
    criteria: readonly string[];
    sources: readonly string[];
  }[] = serviceObjectives,
  content: Record<string, Record<string, string>> = nb.portal.lesson.sections,
  sources = serviceSources,
) {
  const errors: string[] = [],
    used = new Set<string>();
  if (new Set(definitions.map((d) => d.id)).size !== definitions.length)
    errors.push('Duplicate objective');
  for (const id of serviceModule.objectives)
    if (!definitions.some((d) => d.id === id)) errors.push(`Missing objective ${id}`);
  for (const d of definitions) {
    if (!(serviceModule.objectives as readonly string[]).includes(d.id))
      errors.push(`Unknown objective ${d.id}`);
    if (!d.sections.length) errors.push(`${d.id}: no teaching`);
    for (const section of d.sections) {
      used.add(section);
      for (const key of ['title', 'intro', 'mechanism', 'example', 'misconception', 'limits'])
        if (!content[section]?.[key]?.trim()) errors.push(`${section}: missing ${key}`);
    }
    if (
      !Object.hasOwn(nb.portal.lesson.cases, d.practice) ||
      !Object.hasOwn(nb.portal.lesson.feedback, d.practice)
    )
      errors.push(`${d.id}: practice/feedback`);
    if (
      !d.criteria.length ||
      d.criteria.some((c) => !Object.hasOwn(nb.portal.challenge.criteria, c))
    )
      errors.push(`${d.id}: assessment`);
    if (
      !d.sources.length ||
      d.sources.some(
        (id) =>
          !sources[id]?.url.startsWith('https://learn.microsoft.com/') ||
          !/^\d{4}-\d{2}-\d{2}$/.test(sources[id]?.reviewed ?? ''),
      )
    )
      errors.push(`${d.id}: source`);
  }
  for (const id of Object.keys(content)) if (!used.has(id)) errors.push(`Orphan section ${id}`);
  return errors;
}
