/** Pure Data/Serverless resource slice. The Laboratory engine owns identity allocation,
 * revisions, requests, receipts, persistence and replay. No independent engine lives here. */
export const dataTypes = {
  postgresServer: 'Microsoft.DBforPostgreSQL/flexibleServers',
  postgresDatabase: 'Microsoft.DBforPostgreSQL/flexibleServers/databases',
  sqlServer: 'Microsoft.Sql/servers',
  sqlDatabase: 'Microsoft.Sql/servers/databases',
  postgresFirewallRule: 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules',
  sqlFirewallRule: 'Microsoft.Sql/servers/firewallRules',
  functionPlan: 'Microsoft.Web/serverfarms',
  functionApp: 'Microsoft.Web/sites',
  function: 'Microsoft.Web/sites/functions',
  connection: 'local/application-database-bindings',
} as const;
export type DatabaseType = typeof dataTypes.postgresDatabase | typeof dataTypes.sqlDatabase;
export type ResourceRef<T extends string = string> = Readonly<{ id: string; type: T }>;
export type PublicAccess = 'Enabled' | 'Disabled';
export type Resource = {
  id: string;
  name: string;
  groupId: string;
  region: string;
  origin: string;
};
export type PostgresServer = Resource & {
  type: typeof dataTypes.postgresServer;
  version: '16';
  sku: 'Standard_B1ms';
  storageGiB: 32 | 64;
  publicNetworkAccess: PublicAccess;
  minimumTls: '1.2';
};
export type PostgresDatabase = Resource & {
  type: typeof dataTypes.postgresDatabase;
  serverId: string;
  charset: 'UTF8';
};
export type SqlServer = Resource & {
  type: typeof dataTypes.sqlServer;
  version: '12.0';
  publicNetworkAccess: PublicAccess;
  minimumTls: '1.2';
};
export type SqlDatabase = Resource & {
  type: typeof dataTypes.sqlDatabase;
  serverId: string;
  sku: 'Basic';
  maxSizeGiB: 2;
};
export type DatabaseFirewallRule = Resource & {
  type: typeof dataTypes.postgresFirewallRule | typeof dataTypes.sqlFirewallRule;
  server: ResourceRef<typeof dataTypes.postgresServer | typeof dataTypes.sqlServer>;
  startIp: string;
  endIp: string;
};
export type FunctionPlan = Resource & {
  type: typeof dataTypes.functionPlan;
  sku: 'FC1';
  os: 'Linux';
  ownerAppId: string;
};
export type FunctionApp = Resource & {
  type: typeof dataTypes.functionApp;
  kind: 'functionapp';
  planId: string;
  storageAccountId: string;
  deploymentContainerId: string;
  runtime: 'node22';
  functionsVersion: '~4';
  instanceMemoryMB: 2048;
  enabled: boolean;
  publicNetworkAccess: PublicAccess;
  httpsOnly: true;
};
export type FunctionDefinition = Resource & {
  type: typeof dataTypes.function;
  appId: string;
  enabled: boolean;
  trigger:
    | { kind: 'http'; method: 'GET' | 'POST'; route: string; authLevel: 'anonymous' }
    | { kind: 'blob-event'; containerId: string };
  behavior: 'static-text' | 'echo-text';
  responseText: string;
};
/** Secret-free local configuration: a stable typed target, not an Azure connection
 * string, credential, authentication grant or separately deployable ARM resource. */
export type DatabaseConnection = Resource & {
  type: typeof dataTypes.connection;
  source: ResourceRef<typeof dataTypes.functionApp>;
  database: ResourceRef<DatabaseType>;
  settingName: string;
  tls: '1.2';
};
export interface DataState {
  postgresServers: PostgresServer[];
  postgresDatabases: PostgresDatabase[];
  sqlServers: SqlServer[];
  sqlDatabases: SqlDatabase[];
  databaseFirewallRules: DatabaseFirewallRule[];
  functionPlans: FunctionPlan[];
  functionApps: FunctionApp[];
  functions: FunctionDefinition[];
  databaseConnections: DatabaseConnection[];
}
export type ApplicationView = Readonly<{
  id: string;
  type: 'Microsoft.Web/sites';
  name: string;
  groupId: string;
  subscriptionId: string;
  region: string;
  enabled: boolean;
  publicNetworkAccess: PublicAccess;
  httpsOnly: boolean;
  origin: string;
}>;
export type DataContext = Readonly<{
  groups: readonly Readonly<{ id: string; subscriptionId: string }>[];
  accounts: readonly Readonly<{
    id: string;
    groupId: string;
    region: string;
    kind: string;
    sku: string;
  }>[];
  containers: readonly Readonly<{ id: string; accountId: string; access: string }>[];
  blobs: readonly Readonly<{ id: string; containerId: string; text: string }>[];
  applications: readonly ApplicationView[];
  /** Existing App Service plans share Microsoft.Web/serverfarms namespace. */
  applicationPlans?: readonly Readonly<{ id: string; name: string; groupId: string }>[];
  /** Other modules must expose real references when checking a deletion. */
  externalReferences?: readonly Readonly<{ sourceId: string; targetId: string }>[];
  origin: string;
  nextId: number;
  /** Count of all resources in the authoritative World, including this slice. */
  resourceCount: number;
}>;
export type DataCommand =
  | {
      type: 'CreatePostgresServer';
      groupId: string;
      name: string;
      region: string;
      version: string;
      sku: string;
      storageGiB: string;
      publicNetworkAccess: string;
    }
  | {
      type: 'UpdatePostgresServer';
      serverId: string;
      storageGiB: string;
      publicNetworkAccess: string;
    }
  | { type: 'DeletePostgresServer'; serverId: string }
  | { type: 'CreatePostgresDatabase'; serverId: string; name: string; charset: string }
  | { type: 'DeletePostgresDatabase'; databaseId: string }
  | {
      type: 'CreateSqlServer';
      groupId: string;
      name: string;
      region: string;
      version: string;
      publicNetworkAccess: string;
    }
  | { type: 'UpdateSqlServer'; serverId: string; publicNetworkAccess: string }
  | { type: 'DeleteSqlServer'; serverId: string }
  | { type: 'CreateSqlDatabase'; serverId: string; name: string; sku: string; maxSizeGiB: string }
  | { type: 'DeleteSqlDatabase'; databaseId: string }
  | {
      type: 'CreateDatabaseFirewallRule';
      serverId: string;
      name: string;
      startIp: string;
      endIp: string;
    }
  | { type: 'UpdateDatabaseFirewallRule'; ruleId: string; startIp: string; endIp: string }
  | { type: 'DeleteDatabaseFirewallRule'; ruleId: string }
  | {
      type: 'CreateFunctionApp';
      groupId: string;
      name: string;
      region: string;
      planName: string;
      storageAccountId: string;
      deploymentContainerId: string;
      runtime: string;
      publicNetworkAccess: string;
    }
  | { type: 'UpdateFunctionApp'; appId: string; enabled: string; publicNetworkAccess: string }
  | { type: 'DeleteFunctionApp'; appId: string }
  | {
      type: 'CreateFunction';
      appId: string;
      name: string;
      trigger: string;
      method: string;
      route: string;
      containerId: string;
      behavior: string;
      responseText: string;
    }
  | {
      type: 'UpdateFunction';
      functionId: string;
      enabled: string;
      method: string;
      route: string;
      containerId: string;
      behavior: string;
      responseText: string;
    }
  | { type: 'DeleteFunction'; functionId: string }
  | {
      type: 'CreateDatabaseConnection';
      appId: string;
      databaseId: string;
      databaseType: string;
      settingName: string;
      tls: string;
    }
  | {
      type: 'UpdateDatabaseConnection';
      connectionId: string;
      databaseId: string;
      databaseType: string;
      tls: string;
    }
  | { type: 'DeleteDatabaseConnection'; connectionId: string };
export type DataFailureCode =
  | 'invalid-command'
  | 'unsupported-capability'
  | 'unsupported-field'
  | 'unsupported-profile'
  | 'invalid-name'
  | 'invalid-region'
  | 'invalid-parent'
  | 'duplicate-name'
  | 'capacity'
  | 'incompatible-association'
  | 'cascade-delete-unsupported'
  | 'no-change';
export type DataResult =
  | { ok: false; code: DataFailureCode; field?: string }
  | {
      ok: true;
      state: DataState;
      nextId: number;
      addedIds: string[];
      updatedIds: string[];
      removedIds: string[];
      targetType: string;
      scopeId: string;
      region: string;
      before: Readonly<Record<string, unknown>> | null;
      after: Readonly<Record<string, unknown>> | null;
    };
export const dataLimits = {
  entities: 96,
  postgresServers: 4,
  postgresDatabases: 8,
  sqlServers: 4,
  sqlDatabases: 8,
  databaseFirewallRules: 16,
  functionApps: 4,
  functions: 16,
  databaseConnections: 16,
} as const;
