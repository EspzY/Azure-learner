import * as previous from '../v37/domain';
import type * as P from '../v37/contract';
import { regions, type Region } from '../../domain/simulation';
import { limits } from '../v3/contract';
import { topologyProjection } from './projection';
import {
  laboratoryModel,
  applicationFields,
  applicationLimits,
  type World,
  type Request,
  type Receipt,
  type Entry,
  type ApplicationChange,
} from './contract';
export const canonical = previous.canonical;
export const parseRequest = (value: unknown): Request | null =>
  previous.parseRequest(value) as Request | null;
export const freshWorld = (): World => ({
  ...previous.freshWorld(),
  model: laboratoryModel,
  plans: [],
  webApps: [],
  deployments: [],
  settings: [],
});
export const resources = (w: World) => [
  ...previous.resources(topologyProjection(w)),
  ...w.plans,
  ...w.webApps,
  ...w.deployments,
  ...w.settings,
];
const name = (n: string, min: number, max: number) =>
  n.length >= min && n.length <= max && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(n);
export function execute(
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } {
  const c = request.command,
    type = c.type,
    raw = c as unknown as Record<string, string>;
  const receipt: Receipt = {
    commandId: request.commandId,
    sequence,
    beforeRevision: world.revision,
    afterRevision: world.revision,
    operation: type,
    targetType: type.includes('Plan')
      ? 'Microsoft.Web/serverfarms'
      : type.includes('Setting')
        ? 'Microsoft.Web/sites/config'
        : type === 'DeploySyntheticApplication'
          ? 'local/synthetic-application-deployment'
          : 'Microsoft.Web/sites',
    scopeId: raw.groupId ?? raw.planId ?? raw.webAppId ?? '',
    location: null,
    outcome: 'rejected',
    code: 'invalid-command',
    ruleId: 'lab-application@3.8',
    addedIds: [],
    removedIds: [],
    updatedIds: [],
    beforeCount: resources(world).length,
    afterCount: resources(world).length,
  };
  const deny = (
    code: Receipt['code'],
    field?: string,
    outcome: Receipt['outcome'] = 'rejected',
  ) => ({
    world,
    receipt: { ...receipt, code, outcome, ...(field === undefined ? {} : { field }) },
  });
  if (request.expectedRevision !== world.revision) return deny('stale-revision');
  if (!Object.hasOwn(applicationFields, type)) {
    const result = previous.execute(
      topologyProjection(world),
      { ...request, command: JSON.parse(canonical(c)) as P.Command },
      sequence,
    );
    if (result.receipt.outcome !== 'accepted')
      return {
        world,
        receipt: {
          ...result.receipt,
          beforeCount: resources(world).length,
          afterCount: resources(world).length,
        },
      };
    const resetting = type === 'ResetWorkspace';
    const next: World = {
      ...result.world,
      model: laboratoryModel,
      plans: resetting ? [] : world.plans,
      webApps: resetting ? [] : world.webApps,
      deployments: resetting ? [] : world.deployments,
      settings: resetting ? [] : world.settings,
    };
    if (resources(next).length > limits.entities) return deny('capacity');
    return {
      world: next,
      receipt: {
        ...result.receipt,
        beforeCount: resources(world).length,
        afterCount: resources(next).length,
        ...(resetting ? { removedIds: resources(world).map((r) => r.id) } : {}),
      },
    };
  }
  const fields = ['type', ...applicationFields[type as keyof typeof applicationFields]];
  const extra = Object.keys(c)
    .sort()
    .find((k) => !fields.includes(k));
  if (extra !== undefined) return deny('unsupported-field', extra, 'unsupported');
  if (fields.some((k) => typeof raw[k] !== 'string')) return deny('invalid-command');
  const next = structuredClone(world);
  let change: ApplicationChange | undefined;
  let createdId = '';
  const added = (prefix: string) => {
    createdId = `${prefix}-${world.nextId}`;
    return createdId;
  };
  const config = (o: object) =>
    Object.fromEntries(
      Object.entries(o).filter(([k]) => !['id', 'origin', 'name'].includes(k)),
    ) as ApplicationChange['before'];
  if (c.type === 'CreateAppServicePlan') {
    if (!world.groups.some((g) => g.id === c.groupId)) return deny('invalid-parent', 'groupId');
    if (!name(c.name, 1, 60)) return deny('invalid-name', 'name');
    if (!regions.includes(c.region as Region)) return deny('invalid-region', 'region');
    if (c.os !== 'Linux' || !['B1', 'P1v3'].includes(c.sku))
      return deny('unsupported-profile', c.os !== 'Linux' ? 'os' : 'sku', 'unsupported');
    if (
      world.plans.some(
        (p) => p.groupId === c.groupId && p.name.toLowerCase() === c.name.toLowerCase(),
      )
    )
      return deny('duplicate-name', 'name');
    if (world.plans.length >= applicationLimits.plans) return deny('capacity');
    next.plans.push({
      id: added('app-plan'),
      name: c.name,
      groupId: c.groupId,
      region: c.region,
      os: 'Linux',
      sku: c.sku as 'B1' | 'P1v3',
      origin: request.commandId,
    });
    receipt.location = c.region as Region;
  } else if (c.type === 'UpdateAppServicePlan' || c.type === 'DeleteAppServicePlan') {
    const plan = next.plans.find((p) => p.id === c.planId);
    if (!plan) return deny('invalid-parent', 'planId');
    receipt.location = plan.region as Region;
    const before = config(plan);
    if (c.type === 'DeleteAppServicePlan') {
      if (world.webApps.some((a) => a.planId === plan.id)) return deny('resource-in-use', 'planId');
      next.plans = next.plans.filter((p) => p.id !== plan.id);
      receipt.removedIds = [plan.id];
    } else {
      if (!['B1', 'P1v3'].includes(c.sku)) return deny('unsupported-profile', 'sku', 'unsupported');
      if (plan.sku === c.sku) return deny('no-change');
      plan.sku = c.sku as 'B1' | 'P1v3';
      receipt.updatedIds = [plan.id];
    }
    change = {
      id: plan.id,
      name: plan.name,
      parentId: plan.groupId,
      createOrigin: plan.origin,
      before,
      after: c.type === 'DeleteAppServicePlan' ? null : config(plan),
    };
  } else if (c.type === 'CreateWebApp') {
    const plan = world.plans.find((p) => p.id === c.planId),
      group = world.groups.find((g) => g.id === c.groupId),
      planGroup = world.groups.find((g) => g.id === plan?.groupId);
    if (!plan || !group || !planGroup) return deny('invalid-parent', !plan ? 'planId' : 'groupId');
    if (group.subscriptionId !== planGroup.subscriptionId)
      return deny('incompatible-association', 'planId');
    if (!name(c.name, 2, 60)) return deny('invalid-name', 'name');
    if (world.webApps.some((a) => a.name.toLowerCase() === c.name.toLowerCase()))
      return deny('duplicate-name', 'name');
    if (c.runtime !== 'NODE|24-lts') return deny('unsupported-profile', 'runtime', 'unsupported');
    if (!['true', 'false'].includes(c.httpsOnly))
      return deny('unsupported-profile', 'httpsOnly', 'unsupported');
    if (!['Enabled', 'Disabled'].includes(c.publicNetworkAccess))
      return deny('unsupported-profile', 'publicNetworkAccess', 'unsupported');
    if (world.webApps.length >= applicationLimits.webApps) return deny('capacity');
    next.webApps.push({
      id: added('web-app'),
      name: c.name,
      groupId: group.id,
      region: plan.region,
      planId: plan.id,
      runtime: 'NODE|24-lts',
      httpsOnly: c.httpsOnly === 'true',
      publicNetworkAccess: c.publicNetworkAccess as 'Enabled' | 'Disabled',
      enabled: true,
      origin: request.commandId,
    });
    receipt.location = plan.region as Region;
  } else if (c.type === 'UpdateWebApp' || c.type === 'DeleteWebApp') {
    const app = next.webApps.find((a) => a.id === c.webAppId);
    if (!app) return deny('invalid-parent', 'webAppId');
    receipt.location = app.region as Region;
    const before = config(app);
    if (c.type === 'DeleteWebApp') {
      const children = [...world.deployments, ...world.settings].filter(
        (x) => x.webAppId === app.id,
      );
      next.webApps = next.webApps.filter((a) => a.id !== app.id);
      next.deployments = next.deployments.filter((d) => d.webAppId !== app.id);
      next.settings = next.settings.filter((s) => s.webAppId !== app.id);
      receipt.removedIds = [app.id, ...children.map((x) => x.id)];
    } else {
      if (c.runtime !== 'NODE|24-lts') return deny('unsupported-profile', 'runtime', 'unsupported');
      if (!['true', 'false'].includes(c.httpsOnly))
        return deny('unsupported-profile', 'httpsOnly', 'unsupported');
      if (!['true', 'false'].includes(c.enabled))
        return deny('unsupported-profile', 'enabled', 'unsupported');
      if (!['Enabled', 'Disabled'].includes(c.publicNetworkAccess))
        return deny('unsupported-profile', 'publicNetworkAccess', 'unsupported');
      app.runtime = 'NODE|24-lts';
      app.httpsOnly = c.httpsOnly === 'true';
      app.enabled = c.enabled === 'true';
      app.publicNetworkAccess = c.publicNetworkAccess as 'Enabled' | 'Disabled';
      if (canonical(before) === canonical(config(app))) return deny('no-change');
      receipt.updatedIds = [app.id];
    }
    change = {
      id: app.id,
      name: app.name,
      parentId: app.groupId,
      createOrigin: app.origin,
      before,
      after: c.type === 'DeleteWebApp' ? null : config(app),
    };
  } else if (c.type === 'DeploySyntheticApplication') {
    const app = world.webApps.find((a) => a.id === c.webAppId);
    if (!app) return deny('invalid-parent', 'webAppId');
    if (!['hello-world', 'api'].includes(c.template))
      return deny('unsupported-profile', 'template', 'unsupported');
    if (!['200', '503'].includes(c.responseStatus))
      return deny('unsupported-profile', 'responseStatus', 'unsupported');
    if (!/^\/[A-Za-z0-9/_-]{0,79}$/.test(c.healthPath))
      return deny('unsupported-profile', 'healthPath', 'unsupported');
    if (world.deployments.length >= applicationLimits.deployments) return deny('capacity');
    next.deployments.push({
      id: added('app-deployment'),
      name: c.template,
      webAppId: app.id,
      template: c.template as 'hello-world' | 'api',
      healthPath: c.healthPath,
      responseStatus: Number(c.responseStatus) as 200 | 503,
      origin: request.commandId,
    });
    receipt.scopeId = app.id;
    receipt.location = app.region as Region;
  } else if (c.type === 'SetWebAppSetting') {
    const app = world.webApps.find((a) => a.id === c.webAppId);
    if (!app) return deny('invalid-parent', 'webAppId');
    if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(c.name)) return deny('invalid-name', 'name');
    if (
      /password|secret|token|credential|connectionstring|private.?key/i.test(c.name) ||
      /(?:postgres(?:ql)?:\/\/|Server=|AccountKey=|Bearer\s)/i.test(c.value)
    )
      return deny('unsupported-profile', 'value', 'unsupported');
    const setting = next.settings.find(
      (s) => s.webAppId === app.id && s.name.toLowerCase() === c.name.toLowerCase(),
    );
    if (setting) {
      if (setting.value === c.value) return deny('no-change');
      const before = config(setting);
      setting.value = c.value;
      receipt.updatedIds = [setting.id];
      change = {
        id: setting.id,
        name: setting.name,
        parentId: app.id,
        createOrigin: setting.origin,
        before,
        after: config(setting),
      };
    } else {
      if (world.settings.length >= applicationLimits.settings) return deny('capacity');
      next.settings.push({
        id: added('app-setting'),
        name: c.name,
        webAppId: app.id,
        value: c.value,
        origin: request.commandId,
      });
    }
    receipt.location = app.region as Region;
  } else if (c.type === 'DeleteWebAppSetting') {
    const setting = world.settings.find((s) => s.id === c.settingId && s.webAppId === c.webAppId),
      app = world.webApps.find((a) => a.id === c.webAppId);
    if (!setting || !app) return deny('invalid-parent', 'settingId');
    next.settings = next.settings.filter((s) => s.id !== setting.id);
    receipt.removedIds = [setting.id];
    receipt.location = app.region as Region;
    change = {
      id: setting.id,
      name: setting.name,
      parentId: app.id,
      createOrigin: setting.origin,
      before: config(setting),
      after: null,
    };
  }
  if (createdId) {
    next.nextId++;
    receipt.addedIds = [createdId];
  }
  if (resources(next).length > limits.entities) return deny('capacity');
  next.revision++;
  return {
    world: next,
    receipt: {
      ...receipt,
      outcome: 'accepted',
      code: createdId ? 'created' : receipt.removedIds.length ? 'deleted' : 'updated',
      afterRevision: next.revision,
      afterCount: resources(next).length,
      ...(change ? { applicationChange: change } : {}),
    },
  };
}
export function replay(entries: Entry[], through = entries.length): World | null {
  if (
    !Number.isSafeInteger(through) ||
    through < 0 ||
    through > entries.length ||
    entries.length > limits.events
  )
    return null;
  let world = freshWorld();
  const seen = new Set<string>();
  for (let i = 0; i < through; i++) {
    const e = entries[i]!,
      request = parseRequest(e.request);
    if (
      e.model !== laboratoryModel ||
      !request ||
      seen.has(request.commandId) ||
      e.attempt !== world.attempt
    )
      return null;
    seen.add(request.commandId);
    const result = execute(world, request, i + 1);
    if (canonical(e.receipt) !== canonical(result.receipt)) return null;
    world = result.world;
  }
  return world;
}
