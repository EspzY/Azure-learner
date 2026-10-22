import type { Stop } from '@/domain/expedition';

export interface Point3 {
  x: number;
  y: number;
  z: number;
}
export interface Camera {
  x: number;
  y: number;
  scale: number;
}
export const routeX = (distance: number) => Math.sin(distance / 330) * 120;
export const locations: Record<Stop, Point3> = {
  arrival: { x: 0, y: 0, z: 0 },
  models: { x: routeX(600), y: 600, z: 0 },
  decision: { x: 420, y: 760, z: 0 },
  crossing: { x: routeX(930), y: 930, z: 0 },
  ownership: { x: -370, y: 1120, z: 0 },
  gateway: { x: routeX(1560), y: 1560, z: 0 },
  horizon: { x: routeX(1970), y: 1970, z: 0 },
};
export function cameraAt(stop: Stop, overview = false): Camera {
  const point = locations[stop];
  return overview ? { x: 0, y: -750, scale: 0.7 } : { x: point.x, y: point.y - 490, scale: 1 };
}
export function interpolateCamera(from: Camera, to: Camera, progress: number): Camera {
  const t = Math.max(0, Math.min(1, progress));
  if (t === 0) return from;
  if (t === 1) return to;
  const ease = t * t * (3 - 2 * t);
  const y = from.y + (to.y - from.y) * ease;
  const onMainRoute =
    from.scale === 1 &&
    to.scale === 1 &&
    Math.abs(from.x - routeX(from.y + 490)) < 0.001 &&
    Math.abs(to.x - routeX(to.y + 490)) < 0.001;
  return {
    x: onMainRoute ? routeX(y + 490) : from.x + (to.x - from.x) * ease,
    y,
    scale: from.scale + (to.scale - from.scale) * ease,
  };
}
export function project(point: Point3, camera: Camera, width = 1200) {
  const depth = Math.max(70, point.y - camera.y + 180);
  const scale = (760 / depth) * camera.scale;
  return {
    x: width * (width < 800 ? 0.5 : 0.4) + (point.x - camera.x) * scale,
    y: 220 + (175 - point.z) * scale,
    scale,
    visible: point.y - camera.y > -90,
  };
}
