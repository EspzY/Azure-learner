/** Version-bound read-only Azure configuration reference; no service-tag resolution or packet evaluation. */
export const defaultRules = [
  ['AllowVnetInBound', 'Inbound', 65000, 'VirtualNetwork', 'VirtualNetwork', 'Allow'],
  ['AllowAzureLoadBalancerInBound', 'Inbound', 65001, 'AzureLoadBalancer', '*', 'Allow'],
  ['DenyAllInBound', 'Inbound', 65500, '*', '*', 'Deny'],
  ['AllowVnetOutBound', 'Outbound', 65000, 'VirtualNetwork', 'VirtualNetwork', 'Allow'],
  ['AllowInternetOutBound', 'Outbound', 65001, '*', 'Internet', 'Allow'],
  ['DenyAllOutBound', 'Outbound', 65500, '*', '*', 'Deny'],
] as const;
