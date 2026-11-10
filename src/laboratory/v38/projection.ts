import type * as P from '../v37/contract';
import { laboratoryModel as previousModel } from '../v37/contract';
import type { World, WebAppReference } from './contract';
/** Frozen validator input only: the public/persisted World remains3.8. */
export const topologyProjection = (world: World): P.World => {
  const { plans, webApps, deployments, settings, ...previous } = world;
  void plans;
  void webApps;
  void deployments;
  void settings;
  return { ...previous, model: previousModel };
};
export const webAppReferences = (world: World): WebAppReference[] =>
  world.webApps.map((app) => {
    const deployment = world.deployments.findLast((d) => d.webAppId === app.id);
    return {
      ...app,
      type: 'Microsoft.Web/sites',
      subscriptionId: world.groups.find((g) => g.id === app.groupId)?.subscriptionId ?? '',
      deployment: deployment ? 'synthetic-http' : 'none',
      healthPath: deployment?.healthPath ?? '',
      responseStatus: deployment?.responseStatus ?? 503,
      settings: world.settings.filter((s) => s.webAppId === app.id).map((s) => ({ ...s })),
    };
  });
