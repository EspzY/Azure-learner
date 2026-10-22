import type { Scope } from '@/domain/simulation';

export interface Point3 {
  x: number;
  y: number;
  z: number;
}
export interface Point2 {
  x: number;
  y: number;
}

// Presentation coordinates only. Height is schematic scope depth, never an Azure region.
const positions: Record<string, Point3> = {
  tenant: { x: -400, y: -310, z: 110 },
  root: { x: -260, y: -150, z: 60 },
  mg: { x: -60, y: -150, z: 40 },
  sub: { x: 140, y: -150, z: 20 },
  'rg-app': { x: 140, y: 70, z: 0 },
  'rg-data': { x: 400, y: -70, z: 0 },
  app: { x: 220, y: 260, z: 0 },
  storage: { x: 580, y: 70, z: 0 },
};
export function scenePosition(scope: Scope): Point3 {
  const known = positions[scope.id];
  if (known) return known;
  const sequence = Number(scope.id.replace('created-group-', ''));
  return { x: -100 + (Number.isFinite(sequence) ? sequence : 1) * 160, y: 400, z: 0 };
}
export function project(point: Point3, yaw = 45): Point2 {
  const angle = (yaw * Math.PI) / 180;
  return {
    x: 520 + point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: 420 + (point.x * Math.sin(angle) + point.y * Math.cos(angle)) * 0.5 - point.z * 0.866,
  };
}
export function footprint(center: Point3, width: number, depth: number, yaw: number, lift = 0) {
  return [
    { x: center.x - width / 2, y: center.y - depth / 2, z: center.z + lift },
    { x: center.x + width / 2, y: center.y - depth / 2, z: center.z + lift },
    { x: center.x + width / 2, y: center.y + depth / 2, z: center.z + lift },
    { x: center.x - width / 2, y: center.y + depth / 2, z: center.z + lift },
  ].map((point) => project(point, yaw));
}
export function points(vertices: Point2[]) {
  return vertices.map((point) => `${point.x},${point.y}`).join(' ');
}

export function relatedScopes(scopes: Scope[], selected: string | null): Set<string> {
  if (!selected) return new Set(scopes.map((scope) => scope.id));
  const result = new Set([selected]);
  let parent = scopes.find((scope) => scope.id === selected)?.parentId;
  while (parent && !result.has(parent)) {
    result.add(parent);
    parent = scopes.find((scope) => scope.id === parent)?.parentId;
  }
  function descend(id: string) {
    for (const child of scopes.filter((scope) => scope.parentId === id)) {
      if (!result.has(child.id)) {
        result.add(child.id);
        descend(child.id);
      }
    }
  }
  descend(selected);
  return result;
}
