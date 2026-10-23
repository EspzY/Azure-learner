import type { Scope } from '@/domain/simulation';
import { relations, types, type World } from '@/domain/chapter01/model';
import type { Point3 } from '@/features/organization/scene-layout';

export function projectWorld(world: World) {
  const scopes: Scope[] = [
    { id: world.identity.id, kind: 'tenant', label: world.identity.name },
    ...world.scopes.map((scope): Scope => ({
      id: scope.id,
      kind: scope.kind,
      label: scope.name,
      parentId: scope.kind === 'root' ? scope.tenantId : scope.parentId,
    })),
    ...world.groups.map((group): Scope => ({
      id: group.id,
      kind: 'group',
      label: group.name,
      parentId: group.subscriptionId,
      region: group.metadataLocation,
    })),
    ...world.resources.map((resource): Scope => ({
      id: resource.id,
      kind: 'resource',
      label: resource.name,
      parentId: resource.groupId,
      region: resource.location,
    })),
  ];
  const positions: Record<string, Point3> = {
    'tenant-lab': { x: -430, y: -320, z: 110 },
    'root-lab': { x: -260, y: -180, z: 65 },
    'mg-lab': { x: -40, y: -170, z: 40 },
    'sub-app': { x: 160, y: -170, z: 20 },
    'sub-shared': { x: 480, y: -170, z: 20 },
  };
  const layout: Record<string, { x: number; y: number }> = {
    'tenant-lab': { x: 220, y: 0 },
    'root-lab': { x: 220, y: 110 },
    'mg-lab': { x: 220, y: 220 },
    'sub-app': { x: 30, y: 330 },
    'sub-shared': { x: 440, y: 330 },
  };
  world.groups.forEach((group, index) => {
    positions[group.id] = {
      x: group.subscriptionId === 'sub-app' ? 50 + index * 210 : 480 + index * 190,
      y: 70,
      z: 0,
    };
    layout[group.id] = { x: index * 290, y: 460 };
    world.resources
      .filter((resource) => resource.groupId === group.id)
      .forEach((resource, i) => {
        const base = positions[group.id]!;
        positions[resource.id] = { x: base.x + i * 340 - 120, y: base.y + 230, z: 0 };
        layout[resource.id] = {
          x: index * 290 + i * 170,
          y: resource.type === types.plan ? 600 : 760,
        };
      });
  });
  const models = Object.fromEntries(
    world.resources.map((resource) => [
      resource.id,
      resource.type === types.plan ? ('plan' as const) : ('webapp' as const),
    ]),
  );
  const edges = relations(world);
  return {
    scopes,
    positions,
    layout,
    models,
    relations: edges,
    dependencies: edges
      .filter((edge) => edge.kind === 'depends-on')
      .map(({ from, to }) => ({ from, to })),
  };
}
