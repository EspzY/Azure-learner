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

/** P06 is a facet-level delivery; the composite virtual-networking objective stays partial. */
export const officialNetworking = {
  reviewed: '2026-10-28',
  path: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  module: 'describe-azure-networking-services',
  officialUnits: 7,
  implementedFacets: ['VNet', 'Subnet', 'Peering', 'Azure DNS'],
  deferred: ['Azure VPN Gateway', 'ExpressRoute', 'Public and private endpoints'],
  status: 'partial',
  humanReview: null,
} as const;

/** Parts A/B are authored; movement/migration remain P16. */
export const officialStorage = {
  reviewed: '2026-10-31',
  path: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  module: 'describe-azure-storage-services',
  officialUnits: 8,
  implementedObjectives: ['2.3.01', '2.3.02', '2.3.03', '2.3.04'],
  deferredObjectives: ['2.3.05', '2.3.06'],
  status: 'partial',
  humanReview: null,
} as const;

/** P10 only. Access/security remain later phases of the twelve-unit official module. */
export const officialIdentity = {
  reviewed: '2026-10-31',
  path: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  module: 'describe-azure-identity-access-security',
  officialUnits: 12,
  implementedObjectives: ['2.4.01', '2.4.02', '2.4.03'],
  deferredObjectives: ['2.4.04', '2.4.05', '2.4.06', '2.4.07', '2.4.08'],
  status: 'partial',
  humanReview: null,
} as const;

export const officialAccess = {
  reviewed: '2026-10-31',
  path: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  module: 'describe-azure-identity-access-security',
  officialUnits: 12,
  implementedObjectives: ['2.4.04', '2.4.05'],
  status: 'partial',
  humanReview: null,
} as const;

export const officialGovernance = {
  reviewed: '2026-11-01',
  path: 'https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/',
  module: 'describe-features-tools-azure-for-governance-compliance',
  officialUnits: 7,
  implementedObjectives: ['3.2.01', '3.2.02', '3.2.03'],
  supplement: 'Service Trust Portal; no extra exam row',
  status: 'scoped-content-covered',
  humanReview: null,
} as const;

export const officialManagementTools = {
  reviewed: '2026-11-01',
  path: 'https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/',
  module: 'describe-features-tools-manage-deploy-azure-resources',
  officialUnits: 6,
  implementedObjectives: ['3.3.01', '3.3.02', '3.3.03', '3.3.04', '3.3.05'],
  supplement: 'Azure Copilot; no sixth exam goal',
  status: 'scoped-content-covered',
  humanReview: null,
} as const;

export const officialMonitoring = {
  reviewed: '2026-11-01',
  module: 'describe-monitoring-tools-azure',
  officialUnits: 6,
  publicUnits: 5,
  protectedAssessment: 'not opened',
  implementedObjectives: ['3.4.01', '3.4.02', '3.4.03'],
  status: 'scoped-content-covered',
  humanReview: null,
} as const;

export const officialSecurity = {
  reviewed: '2026-11-01',
  module: 'describe-azure-identity-access-security',
  officialUnits: 12,
  publicScopedUnits: ['1', '7', '8', '9a', '9', '11'],
  protectedAssessment: '10-not-opened',
  implementedObjectives: ['2.4.06', '2.4.07', '2.4.08'],
  supplement: 'encryption-key-management',
  status: 'scoped-content-covered',
  humanReview: null,
} as const;

export const officialMigration = {
  reviewed: '2026-11-01',
  module: 'describe-azure-storage-services',
  officialUnits: 8,
  publicScopedUnits: ['1', '6', '7', '9'],
  protectedAssessment: '8-not-opened',
  implementedObjectives: ['2.3.05', '2.3.06'],
  status: 'scoped-content-covered',
  humanReview: null,
} as const;
