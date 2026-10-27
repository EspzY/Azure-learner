/** Reviewed public source metadata; local teaching never fetches these at runtime. */
export const costSourceDate = '2026-10-27';
const learn = 'https://learn.microsoft.com/en-us/';
export const costSources = {
  CS01: [
    'Study guide for Exam AZ-900',
    `${learn}credentials/certifications/resources/study-guides/az-900`,
  ],
  CS02: [
    'Describe cost management in Azure',
    `${learn}training/modules/describe-cost-management-azure/`,
  ],
  CS03: [
    'Describe factors that can affect costs in Azure',
    `${learn}training/modules/describe-cost-management-azure/2-describe-factors-affect-costs-azure`,
  ],
  CS04: [
    'Explore the pricing calculator',
    `${learn}training/modules/describe-cost-management-azure/3-compare-pricing-total-cost-of-ownership-calculators`,
  ],
  CS05: [
    'Describe the Microsoft Cost Management tool',
    `${learn}training/modules/describe-cost-management-azure/6-describe-azure-tool`,
  ],
  CS06: [
    'Describe the purpose of tags',
    `${learn}training/modules/describe-cost-management-azure/7-describe-purpose-of-tags`,
  ],
  CS07: [
    'Describe cost optimization options in Azure',
    `${learn}training/modules/describe-cost-management-azure/7a-describe-cost-optimization-options`,
  ],
  CS08: [
    'Introduction and prerequisites',
    `${learn}training/modules/describe-cost-management-azure/1-introduction`,
  ],
  CS09: [
    'Summary and additional resources',
    `${learn}training/modules/describe-cost-management-azure/9-summary`,
  ],
  CS10: [
    'Estimate costs with the Azure pricing calculator',
    `${learn}azure/cost-management-billing/costs/pricing-calculator`,
  ],
  CS11: [
    'What is Microsoft Cost Management',
    `${learn}azure/cost-management-billing/costs/overview-cost-management`,
  ],
  CS12: [
    'Start using Cost Analysis',
    `${learn}azure/cost-management-billing/costs/quick-acm-cost-analysis`,
  ],
  CS13: [
    'Create and manage budgets',
    `${learn}azure/cost-management-billing/costs/tutorial-acm-create-budgets`,
  ],
  CS14: [
    'Understand Cost Management data',
    `${learn}azure/cost-management-billing/costs/understand-cost-mgt-data`,
  ],
  CS15: [
    'Use tags to organize resources',
    `${learn}azure/azure-resource-manager/management/tag-resources`,
  ],
  CS16: [
    'Tag support for Azure resources',
    `${learn}azure/azure-resource-manager/management/tag-support`,
  ],
  CS17: [
    'Group and allocate costs using tag inheritance',
    `${learn}azure/cost-management-billing/costs/enable-tag-inheritance`,
  ],
  CS18: [
    'What are Azure Reservations?',
    `${learn}azure/cost-management-billing/reservations/save-compute-costs-reservations`,
  ],
  CS19: [
    'What are savings plans?',
    `${learn}azure/cost-management-billing/savings-plan/savings-plan-overview`,
  ],
  CS20: ['Azure Spot Virtual Machines', `${learn}azure/virtual-machines/spot-vms`],
  CS21: [
    'Savings-plan discount application',
    `${learn}azure/cost-management-billing/savings-plan/discount-application`,
  ],
  CS22: [
    'Azure Advisor: resizing or shutting down underutilized instances',
    `${learn}azure/advisor/advisor-cost-recommendations`,
  ],
  CS23: [
    'Policy definitions for tag compliance',
    `${learn}azure/azure-resource-manager/management/tag-policies`,
  ],
  CS24: [
    'Group and filter options in Cost Analysis and Budgets',
    `${learn}azure/cost-management-billing/costs/group-filter`,
  ],
  CS25: [
    'Decide between a savings plan and a reservation',
    `${learn}azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation`,
  ],
  CS26: [
    'Control Azure spending: supplementary path',
    `${learn}training/paths/control-spending-manage-bills/`,
  ],
  CS27: [
    'Bandwidth pricing: transfer paths and billing zones',
    'https://azure.microsoft.com/en-us/pricing/details/bandwidth/',
  ],
  CS28: ['Public Pricing Calculator', 'https://azure.microsoft.com/pricing/calculator/'],
  CS29: [
    'Management and governance learning path',
    `${learn}training/paths/describe-azure-management-governance/`,
  ],
} as const;
export const costStudySources = {
  introduction: ['CS01', 'CS02', 'CS08'],
  drivers: ['CS03', 'CS14', 'CS27'],
  estimate: ['CS04', 'CS10', 'CS28'],
  analysis: ['CS05', 'CS11', 'CS12', 'CS14', 'CS24'],
  budgets: ['CS13', 'CS14'],
  tags: ['CS06', 'CS15', 'CS16', 'CS17', 'CS23'],
  optimization: ['CS07', 'CS18', 'CS19', 'CS20', 'CS21', 'CS22', 'CS25'],
} as const;
