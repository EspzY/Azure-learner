/** Public technical references checked 2026-10-27. Original authored items, no assessment copying. */
export const transferSourceDate = '2026-10-27';
const learn = 'https://learn.microsoft.com/en-us/';
export const transferSources = {
  T01: {
    title: 'AZ-900 Study Guide · Skills measured 2026-07-20',
    url: learn + 'credentials/certifications/resources/study-guides/az-900',
  },
  T02: {
    title: 'Define cloud models',
    url: learn + 'training/modules/describe-cloud-compute/5-define-cloud-models',
  },
  T03: {
    title: 'Describe the consumption-based model',
    url: learn + 'training/modules/describe-cloud-compute/6-describe-consumption-based-model',
  },
  T04: {
    title: 'High availability and scalability',
    url:
      learn +
      'training/modules/describe-benefits-use-cloud-services/2-high-availability-scalability-cloud',
  },
  T05: {
    title: 'Reliability and predictability',
    url:
      learn +
      'training/modules/describe-benefits-use-cloud-services/3-reliability-predictability-cloud',
  },
  T06: {
    title: 'Security and governance',
    url:
      learn + 'training/modules/describe-benefits-use-cloud-services/4-security-governance-cloud',
  },
  T07: {
    title: 'Manageability',
    url: learn + 'training/modules/describe-benefits-use-cloud-services/5-manageability-cloud',
  },
  T08: {
    title: 'IaaS responsibility and scenarios',
    url: learn + 'training/modules/describe-cloud-service-types/2-describe-infrastructure-service',
  },
  T09: {
    title: 'PaaS responsibility and scenarios',
    url: learn + 'training/modules/describe-cloud-service-types/3-describe-platform-service',
  },
  T10: {
    title: 'Azure Reservations',
    url: learn + 'azure/cost-management-billing/reservations/save-compute-costs-reservations',
  },
  T11: { title: 'Azure Spot Virtual Machines', url: learn + 'azure/virtual-machines/spot-vms' },
  T12: {
    title: 'Savings plans overview',
    url: learn + 'azure/cost-management-billing/savings-plan/savings-plan-overview',
  },
  T13: {
    title: 'Failure mode analysis',
    url: learn + 'azure/well-architected/reliability/failure-mode-analysis',
  },
  T14: { title: 'Azure Policy overview', url: learn + 'azure/governance/policy/overview' },
  T15: { title: 'Azure RBAC overview', url: learn + 'azure/role-based-access-control/overview' },
  T16: {
    title: 'Identity and access management concepts',
    url: learn + 'entra/fundamentals/identity-fundamental-concepts',
  },
  T17: {
    title: 'ARM template overview',
    url: learn + 'azure/azure-resource-manager/templates/overview',
  },
  T18: {
    title: 'SaaS responsibility and scenarios',
    url: learn + 'training/modules/describe-cloud-service-types/4-describe-software-service',
  },
} as const;
