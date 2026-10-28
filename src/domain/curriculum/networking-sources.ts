/** Public bodies checked 2026-10-28. Assessment bank excluded; original authoring. */
export const networkingSources = {
  NS01: [
    'AZ-900 Study guide · Skills measured20 July2026',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  NS02: [
    'Describe Azure networking services · seven units',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/',
  ],
  NS03: [
    'Introduction · networking',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction',
  ],
  NS04: [
    'Describe Azure virtual networking',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network',
  ],
  NS05: [
    'Describe Azure DNS',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system',
  ],
  NS06: [
    'What is Azure Virtual Network?',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview',
  ],
  NS07: [
    'Virtual networks and virtual machines',
    'https://learn.microsoft.com/en-us/azure/virtual-network/network-overview',
  ],
  NS08: [
    'Virtual Network frequently asked questions',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq',
  ],
  NS09: [
    'Virtual network peering overview',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview',
  ],
  NS10: [
    'Create, change or delete virtual network peering',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering',
  ],
  NS11: [
    'Configure subnet peering · requirements and current limitations',
    'https://learn.microsoft.com/en-us/azure/virtual-network/how-to-configure-subnet-peering',
  ],
  NS12: ['Azure DNS overview', 'https://learn.microsoft.com/en-us/azure/dns/dns-overview'],
  NS13: [
    'Azure Private DNS overview',
    'https://learn.microsoft.com/en-us/azure/dns/private-dns-overview',
  ],
  NS14: [
    'Name resolution for resources in Azure virtual networks',
    'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances',
  ],
  NS15: [
    'Azure DNS Private Resolver overview',
    'https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview',
  ],
  NS16: [
    'Azure DNS zones and records',
    'https://learn.microsoft.com/en-us/azure/dns/dns-zones-records',
  ],
  NS17: [
    'Private DNS virtual network links',
    'https://learn.microsoft.com/en-us/azure/dns/private-dns-virtual-network-links',
  ],
  NS18: [
    'Scenarios for Azure Private DNS zones',
    'https://learn.microsoft.com/en-us/azure/dns/private-dns-scenarios',
  ],
  NS19: [
    'Summary · networking and further reading',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary',
  ],
} as const;
type Source = keyof typeof networkingSources;
export const networkingStudySources = {
  introduction: ['NS01', 'NS02', 'NS03'],
  fundamentals: ['NS04', 'NS06', 'NS08'],
  vnet: ['NS04', 'NS06', 'NS07'],
  addressing: ['NS08'],
  dependencies: ['NS07', 'NS08'],
  peering: ['NS09', 'NS10', 'NS11'],
  dns: ['NS05', 'NS12', 'NS13', 'NS14', 'NS15', 'NS16', 'NS17', 'NS18'],
  explorer: ['NS08', 'NS09', 'NS10', 'NS13', 'NS14'],
} as const satisfies Record<string, readonly Source[]>;
