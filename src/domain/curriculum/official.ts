// Reviewed local metadata only. Credentials are overlays, never the content hierarchy.
export const officialLearning = {
  schema: 1,
  version: '2026-10-25',
  reviewed: '2026-10-25',
  certification: {
    id: 'azure-fundamentals',
    exam: 'AZ-900',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
  },
  path: {
    id: 'describe-cloud-concepts',
    url: 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/',
  },
  modules: [
    {
      id: 'computing',
      slug: 'describe-cloud-compute',
      local: 'foundations-01',
      status: 'implemented',
      officialUnits: 8,
    },
    {
      id: 'benefits',
      slug: 'describe-benefits-use-cloud-services',
      local: 'cloud-benefits',
      status: 'implemented' as 'implemented' | 'planned',
      officialUnits: 8,
    },
    {
      id: 'services',
      slug: 'describe-cloud-service-types',
      local: 'service-types',
      status: 'implemented',
      officialUnits: 6,
    },
  ],
  // Several local investigations illuminate one official unit; they are not copied units.
  unitMapping: {
    capacity: [1, 2],
    responsibility: [3],
    models: [4],
    placement: [4],
    metering: [5],
    pricing: [5],
  },
} as const;

/** Reviewed Part A metadata; the original cloud-concepts path/order remains unchanged. */
export const officialPhysical = {
  reviewed: '2026-10-27',
  path: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  module: 'describe-core-architectural-components-of-azure',
  officialUnits: 7,
  officialObjectives: 7,
  implementedObjectives: ['2.1.01', '2.1.02', '2.1.03'],
  status: 'partial',
} as const;

export const officialCore = {
  ...officialPhysical,
  implementedObjectives: ['2.1.01', '2.1.02', '2.1.03', '2.1.04', '2.1.05', '2.1.06', '2.1.07'],
  status: 'implemented',
  humanReview: null,
} as const;

export const officialCost = {
  reviewed: '2026-10-27',
  path: 'https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/',
  module: 'describe-cost-management-azure',
  officialUnits: 8,
  officialObjectives: 5,
  implementedObjectives: ['3.1.01', '3.1.02', '3.1.03', '3.1.04'],
  status: 'implemented',
  humanReview: null,
} as const;

export const officialCompute = {
  reviewed: '2026-10-28',
  path: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  module: 'describe-azure-compute-networking-services',
  officialUnits: 9,
  officialObjectives: 5,
  implementedObjectives: ['2.2.01', '2.2.02', '2.2.03', '2.2.04'],
  status: 'implemented',
  humanReview: null,
} as const;
