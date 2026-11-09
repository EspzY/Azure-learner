import type * as P from '../v37/contract';
export const laboratoryModel = 'laboratory@3.8.0';
export type ApplicationCommand =
  | {
      type: 'CreateAppServicePlan';
      groupId: string;
      name: string;
      region: string;
      os: string;
      sku: string;
    }
  | { type: 'UpdateAppServicePlan'; planId: string; sku: string }
  | { type: 'DeleteAppServicePlan'; planId: string }
  | {
      type: 'CreateWebApp';
      groupId: string;
      name: string;
      planId: string;
      runtime: string;
      httpsOnly: string;
      publicNetworkAccess: string;
    }
  | {
      type: 'UpdateWebApp';
      webAppId: string;
      runtime: string;
      httpsOnly: string;
      publicNetworkAccess: string;
      enabled: string;
    }
  | { type: 'DeleteWebApp'; webAppId: string }
  | {
      type: 'DeploySyntheticApplication';
      webAppId: string;
      template: string;
      healthPath: string;
      responseStatus: string;
    }
  | { type: 'SetWebAppSetting'; webAppId: string; name: string; value: string }
  | { type: 'DeleteWebAppSetting'; settingId: string; webAppId: string };
export type Command = P.Command | ApplicationCommand;
export type Request = Omit<P.Request, 'command'> & { command: Command };
export type ApplicationChange = {
  id: string;
  name: string;
  parentId: string;
  createOrigin: string;
  before: Record<string, string | number | boolean>;
  after: Record<string, string | number | boolean> | null;
};
export type Receipt = Omit<P.Receipt, 'code'> & {
  code: P.Receipt['code'] | 'resource-in-use';
  applicationChange?: ApplicationChange;
};
export type Plan = {
  id: string;
  name: string;
  groupId: string;
  region: string;
  os: 'Linux';
  sku: 'B1' | 'P1v3';
  origin: string;
};
export type WebApp = {
  id: string;
  name: string;
  groupId: string;
  region: string;
  planId: string;
  runtime: 'NODE|24-lts';
  httpsOnly: boolean;
  publicNetworkAccess: 'Enabled' | 'Disabled';
  enabled: boolean;
  origin: string;
};
export type Deployment = {
  id: string;
  name: string;
  webAppId: string;
  template: 'hello-world' | 'api';
  healthPath: string;
  responseStatus: 200 | 503;
  origin: string;
};
export type Setting = { id: string; name: string; webAppId: string; value: string; origin: string };
export interface World extends Omit<P.World, 'model'> {
  model: typeof laboratoryModel;
  plans: Plan[];
  webApps: WebApp[];
  deployments: Deployment[];
  settings: Setting[];
}
export type Entry = {
  model: typeof laboratoryModel;
  attempt: number;
  request: Request;
  receipt: Receipt;
};
/** Stable read-only interoperability projection. It confers no access or runtime guarantee. */
export type WebAppReference = Readonly<{
  id: string;
  type: 'Microsoft.Web/sites';
  name: string;
  groupId: string;
  subscriptionId: string;
  region: string;
  enabled: boolean;
  publicNetworkAccess: 'Enabled' | 'Disabled';
  httpsOnly: boolean;
  deployment: 'none' | 'synthetic-http';
  healthPath: string;
  responseStatus: 200 | 503;
  settings: readonly Readonly<Setting>[];
  origin: string;
}>;
export const applicationFields: Record<ApplicationCommand['type'], readonly string[]> = {
  CreateAppServicePlan: ['groupId', 'name', 'region', 'os', 'sku'],
  UpdateAppServicePlan: ['planId', 'sku'],
  DeleteAppServicePlan: ['planId'],
  CreateWebApp: ['groupId', 'name', 'planId', 'runtime', 'httpsOnly', 'publicNetworkAccess'],
  UpdateWebApp: ['webAppId', 'runtime', 'httpsOnly', 'publicNetworkAccess', 'enabled'],
  DeleteWebApp: ['webAppId'],
  DeploySyntheticApplication: ['webAppId', 'template', 'healthPath', 'responseStatus'],
  SetWebAppSetting: ['webAppId', 'name', 'value'],
  DeleteWebAppSetting: ['settingId', 'webAppId'],
};
export const applicationLimits = { plans: 8, webApps: 12, deployments: 24, settings: 32 } as const;
