import { nb, laboratoryV3Nb as storage } from '@/content/nb';
import { laboratoryNetworkNb as network } from '@/content/laboratory-networking-nb';
import { laboratoryRoutingNb as routing } from '@/content/laboratory-routing-nb';
import { laboratoryEndpointsNb as endpoints } from '@/content/laboratory-endpoints-nb';
import { laboratoryComputeNb as compute } from '@/content/laboratory-compute-nb';
import { laboratoryFirewallNb as firewall } from '@/content/laboratory-firewall-nb';
import { architectureStudioNb as studio } from '@/content/architecture-studio-nb';
import type { Area } from '@/domain/portal/model';
import type { Model } from '@/laboratory/engine';

export type PortalService = { id: string; title: string; icon: string; view: string };
type Definition = {
  id: string;
  title: string;
  icon: string;
  course?: Area;
  laboratory?: string;
  since?: number;
};
/** Single presentation catalogue. Availability never registers a command or grants a capability. */
export const portalServiceDefinitions: readonly Definition[] = [
  {
    id: 'frontDoor',
    title: 'Front Door profiles',
    icon: 'frontDoor',
    laboratory: 'frontDoor',
    since: 9,
  },
  {
    id: 'frontDoorEndpoint',
    title: 'Front Door endpoints',
    icon: 'frontDoor',
    laboratory: 'frontDoorEndpoint',
    since: 9,
  },
  {
    id: 'originGroup',
    title: 'Origin groups and synthetic probes',
    icon: 'frontDoor',
    laboratory: 'originGroup',
    since: 9,
  },
  {
    id: 'frontDoorOrigin',
    title: 'Front Door origins',
    icon: 'frontDoor',
    laboratory: 'frontDoorOrigin',
    since: 9,
  },
  {
    id: 'frontDoorRoute',
    title: 'Front Door routes',
    icon: 'frontDoor',
    laboratory: 'frontDoorRoute',
    since: 9,
  },
  {
    id: 'frontDoorWafPolicy',
    title: 'Front Door WAF policies',
    icon: 'waf',
    laboratory: 'frontDoorWafPolicy',
    since: 9,
  },
  {
    id: 'frontDoorWafRule',
    title: 'WAF custom rules',
    icon: 'waf',
    laboratory: 'frontDoorWafRule',
    since: 9,
  },
  {
    id: 'frontDoorSecurityPolicy',
    title: 'Front Door security policies',
    icon: 'frontDoor',
    laboratory: 'frontDoorSecurityPolicy',
    since: 9,
  },
  {
    id: 'applicationGateway',
    title: 'Application Gateways',
    icon: 'applicationGateway',
    laboratory: 'applicationGateway',
    since: 9,
  },
  {
    id: 'gatewayBackendPool',
    title: 'Gateway backend pools',
    icon: 'applicationGateway',
    laboratory: 'gatewayBackendPool',
    since: 9,
  },
  {
    id: 'gatewayListener',
    title: 'Gateway HTTP listeners',
    icon: 'applicationGateway',
    laboratory: 'gatewayListener',
    since: 9,
  },
  {
    id: 'gatewayBackendSetting',
    title: 'Gateway HTTPS backend settings',
    icon: 'applicationGateway',
    laboratory: 'gatewayBackendSetting',
    since: 9,
  },
  {
    id: 'gatewayProbe',
    title: 'Gateway synthetic probes',
    icon: 'applicationGateway',
    laboratory: 'gatewayProbe',
    since: 9,
  },
  {
    id: 'gatewayRoutingRule',
    title: 'Gateway routing rules',
    icon: 'applicationGateway',
    laboratory: 'gatewayRoutingRule',
    since: 9,
  },
  {
    id: 'postgresServer',
    title: 'Azure Database for PostgreSQL flexible server',
    icon: 'postgresServer',
    laboratory: 'postgresServer',
    since: 9,
  },
  {
    id: 'postgresDatabase',
    title: 'PostgreSQL database',
    icon: 'postgresServer',
    laboratory: 'postgresDatabase',
    since: 9,
  },
  {
    id: 'sqlServer',
    title: 'SQL logical server',
    icon: 'sqlServer',
    laboratory: 'sqlServer',
    since: 9,
  },
  {
    id: 'sqlDatabase',
    title: 'SQL database',
    icon: 'sqlDatabase',
    laboratory: 'sqlDatabase',
    since: 9,
  },
  {
    id: 'databaseFirewallRule',
    title: 'Database server firewall rule',
    icon: 'settings',
    laboratory: 'databaseFirewallRule',
    since: 9,
  },
  {
    id: 'functionPlan',
    title: 'Functions Flex Consumption plan',
    icon: 'plan',
    laboratory: 'functionPlan',
    since: 9,
  },
  {
    id: 'functionApp',
    title: 'Function App',
    icon: 'functionApp',
    laboratory: 'functionApp',
    since: 9,
  },
  {
    id: 'function',
    title: 'Synthetic function',
    icon: 'functionApp',
    laboratory: 'function',
    since: 9,
  },
  {
    id: 'databaseConnection',
    title: 'Application database binding',
    icon: 'settings',
    laboratory: 'databaseConnection',
    since: 9,
  },
  {
    id: 'subscriptions',
    title: nb.portal.areas.subscriptions,
    icon: 'subscriptions',
    course: 'subscriptions',
    laboratory: 'subscriptions',
  },
  {
    id: 'groups',
    title: nb.portal.areas.groups,
    icon: 'groups',
    course: 'groups',
    laboratory: 'groups',
  },
  {
    id: 'resources',
    title: nb.portal.areas.resources,
    icon: 'resources',
    course: 'resources',
    laboratory: 'resources',
  },
  {
    id: 'apps',
    title: nb.portal.areas.apps,
    icon: 'apps',
    course: 'apps',
    laboratory: 'apps',
    since: 8,
  },
  {
    id: 'plans',
    title: nb.portal.areas.plans,
    icon: 'plans',
    course: 'plans',
    laboratory: 'plans',
    since: 8,
  },
  {
    id: 'vms',
    title: nb.portal.areas.vms,
    icon: 'vms',
    course: 'vms',
    laboratory: 'vms',
    since: 4,
  },
  { id: 'disks', title: compute.disks, icon: 'disk', laboratory: 'disks', since: 4 },
  { id: 'nics', title: endpoints.nics, icon: 'nic', laboratory: 'nics', since: 3 },
  { id: 'accounts', title: storage.accounts, icon: 'account', laboratory: 'accounts', since: 0 },
  { id: 'vnets', title: network.vnets, icon: 'vnet', laboratory: 'vnets', since: 1 },
  { id: 'nsgs', title: network.nsgs, icon: 'nsg', laboratory: 'nsgs', since: 1 },
  {
    id: 'routeTables',
    title: routing.tables,
    icon: 'routeTable',
    laboratory: 'routeTables',
    since: 2,
  },
  {
    id: 'firewalls',
    title: firewall.firewalls,
    icon: 'firewall',
    laboratory: 'firewalls',
    since: 5,
  },
  {
    id: 'firewallPolicies',
    title: firewall.policies,
    icon: 'firewallPolicy',
    laboratory: 'firewallPolicies',
    since: 5,
  },
  {
    id: 'publicIps',
    title: firewall.publicIps,
    icon: 'publicIp',
    laboratory: 'publicIps',
    since: 5,
  },
  {
    id: 'activity',
    title: nb.portal.areas.activity,
    icon: 'activity',
    course: 'activity',
    laboratory: 'history',
  },
  { id: 'azurePolicy', title: nb.portal.areas.policy, icon: 'policy', course: 'policy' },
  {
    id: 'architecture',
    title: nb.portal.areas.architecture,
    icon: 'architecture',
    course: 'architecture',
  },
  { id: 'studio', title: studio.title, icon: 'architecture', laboratory: 'studio' },
  {
    id: 'routeAnalysis',
    title: routing.analysis,
    icon: 'properties',
    laboratory: 'analysis',
    since: 2,
  },
  {
    id: 'policyAnalysis',
    title: endpoints.analysis,
    icon: 'properties',
    laboratory: 'policy',
    since: 3,
  },
];
const modelLevels: Record<Model, number> = {
  'laboratory@3.0.0': 0,
  'laboratory@3.1.0': 1,
  'laboratory@3.2.0': 2,
  'laboratory@3.3.0': 3,
  'laboratory@3.4.0': 4,
  'laboratory@3.5.0': 5,
  'laboratory@3.6.0': 6,
  'laboratory@3.7.0': 7,
  'laboratory@3.8.0': 8,
  'laboratory@3.9.0': 9,
};
export function portalServices(mode: 'course' | 'laboratory', model?: Model): PortalService[] {
  return portalServiceDefinitions.flatMap((s) => {
    const view = s[mode];
    if (
      !view ||
      (mode === 'laboratory' &&
        (model === undefined ||
          !Object.hasOwn(modelLevels, model) ||
          (s.since ?? 0) > modelLevels[model]))
    )
      return [];
    // Policy diagnostics changed with Firewall A; retain the original actual diagnostic label.
    const title =
      s.id === 'activity' && mode === 'laboratory'
        ? storage.history
        : mode === 'laboratory' && s.id === 'policyAnalysis' && modelLevels[model!] >= 5
          ? firewall.analysis
          : s.title;
    return [{ id: s.id, title, icon: s.icon, view }];
  });
}
export const portalEntryServices: readonly PortalService[] = [
  { id: 'home', title: nb.portal.areas.home, icon: 'home', view: 'home' },
  { id: 'services', title: nb.portal.areas.services, icon: 'services', view: 'services' },
];
