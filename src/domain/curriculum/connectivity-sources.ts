/** Public Microsoft bodies actually reviewed 2026-10-29; no protected assessment copied. */
export const connectivitySources = {
  CS01: [
    'AZ-900 Study guide · Skills measured 20 July 2026',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  CS02: [
    'Describe Azure networking services · seven-unit structure',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/',
  ],
  CS03: [
    'Introduction · Networking',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction',
  ],
  CS04: [
    'Describe Azure virtual networking · endpoints and prerequisites',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network',
  ],
  CS05: [
    'Describe Azure virtual private networks',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/3-virtual-private-networks',
  ],
  CS06: [
    'Describe Azure ExpressRoute',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/4-expressroute',
  ],
  CS07: [
    'Describe Azure DNS · prerequisite',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system',
  ],
  CS08: [
    'Networking summary · public framing and further reading',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary',
  ],
  CS09: [
    'About Azure VPN Gateway',
    'https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways',
  ],
  CS10: [
    'VPN Gateway topology and design',
    'https://learn.microsoft.com/en-us/azure/vpn-gateway/design',
  ],
  CS11: [
    'About Point-to-Site VPN',
    'https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-about',
  ],
  CS12: [
    'Azure ExpressRoute overview',
    'https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction',
  ],
  CS13: [
    'About encryption for Azure ExpressRoute',
    'https://learn.microsoft.com/en-us/azure/expressroute/expressroute-about-encryption',
  ],
  CS14: [
    'ExpressRoute circuits and peering',
    'https://learn.microsoft.com/en-us/azure/expressroute/expressroute-circuit-peerings',
  ],
  CS15: [
    'ExpressRoute and S2S VPN coexistence · limits and failover scope',
    'https://learn.microsoft.com/en-us/azure/expressroute/expressroute-howto-coexist-resource-manager',
  ],
  CS16: [
    'What is a private endpoint?',
    'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview',
  ],
  CS17: [
    'Private Endpoint DNS integration scenarios',
    'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns-integration',
  ],
  CS18: [
    'Private Endpoint private DNS zone values · service-specific scope',
    'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns',
  ],
  CS19: [
    'Use private endpoints for Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints',
  ],
  CS20: [
    'Storage public-endpoint firewall and authorization boundaries',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security',
  ],
} as const;
export const connectivityStudySources = {
  introduction: ['CS01', 'CS02', 'CS03', 'CS08'],
  vpn: ['CS05', 'CS09', 'CS10', 'CS11'],
  expressroute: ['CS06', 'CS12', 'CS13', 'CS14', 'CS15'],
  endpoints: ['CS04', 'CS16', 'CS19', 'CS20'],
  'private-dns': ['CS07', 'CS17', 'CS18', 'CS19'],
  hybrid: ['CS09', 'CS10', 'CS12', 'CS13', 'CS15'],
  explorer: ['CS16', 'CS17', 'CS18', 'CS19', 'CS20'],
} as const satisfies Record<string, readonly (keyof typeof connectivitySources)[]>;
export const connectivitySourceReview = {
  checked: '2026-10-29',
  studyGuideVersion: '2026-07-20',
  available: Object.keys(connectivitySources),
  protectedAssessment: 'excluded',
  blocked: [
    {
      url: 'https://learn.microsoft.com/en-us/azure/expressroute/expressroute-designing-for-high-availability-with-expressroute',
      reason:
        'Research tool reported inaccessible. Available CS12 overview redundancy/resiliency sections support bounded claims; no claim depends solely on this optional article.',
    },
  ],
  limits: [
    'Public bodies readable despite generic authorization banners; no sign-in bypass.',
    'Product topology/P2S qualifications override Learn universal internet/preshared-key simplifications.',
    'Current SKU migration is dated context; no live SKU, throughput, pricing or failover guarantee.',
    'Paid deployment/client setup, protected assessment and copied illustrations are excluded.',
  ],
} as const;
