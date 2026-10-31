import { courseHubNb as h } from '@/content/nb';
import type { CourseModule } from '@/domain/course/model';

/** Navigation metadata only. Availability is content, never learner completion. */
export const coursePaths = [
  {
    id: 'cloud',
    number: '01',
    title: h.paths.cloud.title,
    description: h.paths.cloud.description,
    modules: [
      { title: h.moduleLabels.computing, parts: ['computing'] },
      { title: h.moduleLabels.benefits, parts: ['benefits'] },
      { title: h.moduleLabels.services, parts: ['services'] },
    ],
    planned: [],
  },
  {
    id: 'architecture',
    number: '02',
    title: h.paths.architecture.title,
    description: h.paths.architecture.description,
    modules: [
      { title: h.moduleLabels.architecture, parts: ['architecture'] },
      { title: h.moduleLabels.compute, parts: ['compute'] },
      { title: h.networking, parts: ['networking', 'connectivity'] },
      { title: h.moduleLabels.storage, parts: ['storage'] },
    ],
    planned: h.plannedModules.architecture,
  },
  {
    id: 'management',
    number: '03',
    title: h.paths.management.title,
    description: h.paths.management.description,
    modules: [{ title: h.moduleLabels.cost, parts: ['cost'] }],
    planned: h.plannedModules.management,
  },
] as const satisfies readonly {
  id: string;
  number: string;
  title: string;
  description: string;
  modules: readonly { title: string; parts: readonly CourseModule[] }[];
  planned: readonly string[];
}[];

export const coursePathFor = (module?: CourseModule) =>
  coursePaths.find((path) =>
    path.modules.some((group) => (group.parts as readonly string[]).includes(module ?? '')),
  );

export const moduleLabels: Record<CourseModule, string> = h.moduleLabels;
