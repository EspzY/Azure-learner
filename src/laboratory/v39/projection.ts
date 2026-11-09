import { laboratoryModel as previousModel } from '../v38/contract';
import type * as P from '../v38/contract';
import { webAppReferences } from '../v38/projection';
import type { DeliveryContext } from '../delivery/contract';
import { deliveryResources, deliveryDependencies } from '../delivery/domain';
import type { DataContext } from '../data/contract';
import { dataReferences } from '../data/domain';
import type { World } from './contract';

/** Private frozen-validator input, never a persisted World or a migration. */
export const applicationProjection = (world: World): P.World => {
  const { delivery, data, ...previous } = world;
  void delivery;
  void data;
  return { ...previous, model: previousModel };
};
export const deliveryContext = (world: World, commandId = 'analysis'): DeliveryContext => ({
  nextId: world.nextId,
  resourceCount: resourceCount(world),
  commandId,
  groups: world.groups,
  webApps: webAppReferences(applicationProjection(world)),
  vnets: world.vnets,
  subnets: world.subnets,
  occupiedSubnetIds: [
    ...world.nics.map((n) => n.subnetId),
    ...world.firewalls.map((f) => f.subnetId),
  ],
});
export const integrationReferences = (world: World) => [
  ...deliveryResources(world.delivery).flatMap((r) =>
    deliveryDependencies(r).map((targetId) => ({ sourceId: r.id, targetId })),
  ),
  ...dataReferences(world.data),
];
export const dataContext = (world: World, origin = 'analysis'): DataContext => ({
  groups: world.groups,
  accounts: world.accounts,
  containers: world.containers,
  blobs: world.blobs,
  applications: webAppReferences(applicationProjection(world)),
  applicationPlans: world.plans,
  externalReferences: deliveryResources(world.delivery).flatMap((r) =>
    deliveryDependencies(r).map((targetId) => ({ sourceId: r.id, targetId })),
  ),
  origin,
  nextId: world.nextId,
  resourceCount: resourceCount(world),
});
/** Count actual records in every family, including nested synthetic configuration. */
export const resourceCount = (world: World): number =>
  Object.values(applicationProjection(world)).reduce<number>(
    (count, value) => count + (Array.isArray(value) ? value.length : 0),
    0,
  ) +
  Object.values(world.delivery).reduce((count, value) => count + value.length, 0) +
  Object.values(world.data).reduce((count, value) => count + value.length, 0);
