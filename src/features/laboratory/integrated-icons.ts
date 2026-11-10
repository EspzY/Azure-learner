import { dataTypes } from '@/laboratory/data/contract';

/** Explicit service identities only; configuration children reuse their actual
 * parent family. This metadata never creates a resource or grants a capability. */
export const integratedIcons = {
  frontDoor: 'frontDoor',
  frontDoorEndpoint: 'frontDoor',
  originGroup: 'frontDoor',
  frontDoorOrigin: 'frontDoor',
  frontDoorRoute: 'frontDoor',
  frontDoorWafPolicy: 'waf',
  frontDoorWafRule: 'waf',
  frontDoorSecurityPolicy: 'frontDoor',
  applicationGateway: 'applicationGateway',
  gatewayBackendPool: 'applicationGateway',
  gatewayListener: 'applicationGateway',
  gatewayBackendSetting: 'applicationGateway',
  gatewayProbe: 'applicationGateway',
  gatewayRoutingRule: 'applicationGateway',
  postgresServer: 'postgresServer',
  postgresDatabase: 'postgresServer',
  sqlServer: 'sqlServer',
  sqlDatabase: 'sqlDatabase',
  databaseFirewallRule: 'settings',
  functionPlan: 'plan',
  functionApp: 'functionApp',
  function: 'functionApp',
  databaseConnection: 'settings',
} as const;

export function integratedResourceIcon(view: string, type?: string): string | undefined {
  if (view === 'databaseFirewallRule' && type !== undefined) {
    return type === dataTypes.postgresFirewallRule
      ? 'postgresServer'
      : type === dataTypes.sqlFirewallRule
        ? 'sqlServer'
        : undefined;
  }
  return Object.hasOwn(integratedIcons, view)
    ? integratedIcons[view as keyof typeof integratedIcons]
    : undefined;
}
