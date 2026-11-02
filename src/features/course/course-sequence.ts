import { courseHref, courseTopic, type CourseModule } from '@/domain/course/model';

/** Recommended navigation only. The catalogue, evidence and resume priorities are separate. */
export const recommendedModules = [
  'computing',
  'benefits',
  'services',
  'architecture',
  'compute',
  'networking',
  'connectivity',
  'storage',
  'storage-resilience',
  'identity',
  'access-control',
  'cost',
  'governance',
  'management-tools',
  'monitoring',
  'security',
  'migration',
] as const satisfies readonly CourseModule[];

/** Introduction dependencies from audit42's graph, never completion requirements or locks. */
export const introducedBefore: Record<CourseModule, readonly CourseModule[]> = {
  computing: [],
  benefits: ['computing'],
  services: ['computing', 'benefits'],
  architecture: ['services'],
  compute: ['architecture', 'services'],
  networking: ['compute', 'architecture'],
  connectivity: ['networking'],
  storage: ['networking', 'services'],
  'storage-resilience': ['storage', 'architecture'],
  identity: ['architecture', 'services'],
  'access-control': ['identity', 'architecture'],
  cost: ['computing', 'services'],
  governance: ['architecture', 'access-control', 'cost'],
  'management-tools': ['architecture', 'access-control', 'governance'],
  monitoring: ['management-tools', 'compute', 'storage-resilience'],
  security: ['identity', 'access-control', 'networking', 'storage', 'governance', 'monitoring'],
  migration: [
    'storage',
    'storage-resilience',
    'connectivity',
    'access-control',
    'management-tools',
  ],
};

export const isClosingApplication = (module: CourseModule) =>
  module === 'security' || module === 'migration';

export function recommendedBoundary(
  module: CourseModule,
  direction: 'previous' | 'next',
): { href: string; module: CourseModule | undefined } | undefined {
  const index = (recommendedModules as readonly CourseModule[]).indexOf(module);
  const neighbor = recommendedModules[index + (direction === 'next' ? 1 : -1)];
  if (!neighbor) return direction === 'next' ? { href: '/learn', module: undefined } : undefined;
  const topic =
    direction === 'next'
      ? courseTopic(neighbor, null)
      : neighbor === 'architecture'
        ? 'core-summary'
        : ['computing', 'benefits', 'services'].includes(neighbor)
          ? 'transfer'
          : 'summary';
  return { href: courseHref(neighbor, topic), module: neighbor };
}
