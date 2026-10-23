export interface Point {
  x: number;
  z: number;
}
export interface Pose extends Point {
  yaw: number;
}
export const spawn: Pose = { x: 0, z: 11, yaw: Math.PI };
export const gatewayReturn: Pose = { x: 0, z: -20, yaw: 0 };
export const places = {
  guide: { x: -3, z: 4, radius: 2.5, approach: { x: -2.4, z: 5.6 } },
  installation: { x: 3, z: -3, radius: 2.7, approach: { x: 1.4, z: -1.5 } },
  engineer: { x: -3, z: -13, radius: 2.5, approach: { x: -2.2, z: -11.5 } },
  portal: { x: 0, z: -24, radius: 3, approach: { x: 0, z: -21.3 } },
} as const;
export type PlaceId = keyof typeof places;
export const zones = [
  { minX: -4.5, maxX: 4.5, minZ: -27, maxZ: 14 },
  { minX: -6.5, maxX: -1, minZ: 0, maxZ: 7 },
  { minX: 0, maxX: 5, minZ: -7, maxZ: 0 },
  { minX: -6.5, maxX: -1, minZ: -17, maxZ: -9 },
] as const;
export const obstacles = [
  { x: -3, z: 4, radius: 0.55 },
  { x: -3, z: -13, radius: 0.55 },
  { x: 3, z: -3, radius: 1.1 },
  { x: -5, z: -15, radius: 0.7 },
  { x: -7, z: 1, radius: 0.6 },
  { x: 7, z: -7, radius: 0.45 },
] as const;
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.z - b.z);
export function walkable(p: Point) {
  return (
    Number.isFinite(p.x) &&
    Number.isFinite(p.z) &&
    zones.some((z) => p.x >= z.minX && p.x <= z.maxX && p.z >= z.minZ && p.z <= z.maxZ) &&
    obstacles.every((o) => distance(p, o) > o.radius + 0.28)
  );
}
export function stepPlayer(p: Pose, input: Point, seconds: number): Pose {
  if (
    !Number.isFinite(seconds) ||
    seconds <= 0 ||
    !Number.isFinite(input.x) ||
    !Number.isFinite(input.z)
  )
    return p;
  const magnitude = Math.hypot(input.x, input.z);
  if (magnitude < 0.01) return p;
  const speed = (2.7 * Math.min(seconds, 0.05)) / Math.max(1, magnitude);
  let next = { ...p, x: p.x + input.x * speed };
  if (!walkable(next)) next = { ...next, x: p.x };
  next = { ...next, z: p.z + input.z * speed };
  if (!walkable(next)) next = { ...next, z: p.z };
  return distance(p, next) > 0.00001 ? { ...next, yaw: Math.atan2(input.x, input.z) } : p;
}
export function nearestPlace(p: Point): PlaceId | null {
  const candidates = (Object.keys(places) as PlaceId[]).filter(
    (id) => distance(p, places[id]) <= places[id].radius,
  );
  return candidates.sort((a, b) => distance(p, places[a]) - distance(p, places[b]))[0] ?? null;
}
export function routeTo(p: Point, id: PlaceId): Point[] {
  if (!walkable(p)) return [];
  const target = places[id].approach;
  const clear = (a: Point, b: Point) => {
    const n = Math.ceil(distance(a, b) * 12);
    for (let i = 0; i <= n; i++)
      if (
        !walkable({
          x: a.x + ((b.x - a.x) * i) / Math.max(n, 1),
          z: a.z + ((b.z - a.z) * i) / Math.max(n, 1),
        })
      )
        return false;
    return true;
  };
  if (clear(p, target)) return [{ ...target }];
  // Small bounded, four-neighbour navigation grid; authored walk zones are the authority.
  const grid: Point[] = [];
  for (let x = -13; x <= 13; x++)
    for (let z = -54; z <= 28; z++) {
      const candidate = { x: x / 2, z: z / 2 };
      if (walkable(candidate)) grid.push(candidate);
    }
  const key = (v: Point) => `${v.x},${v.z}`;
  const available = new Map(grid.map((v) => [key(v), v]));
  const start = grid
    .filter((v) => distance(p, v) < 1 && clear(p, v))
    .sort((a, b) => distance(p, a) - distance(p, b))[0];
  const finish = grid
    .filter((v) => distance(target, v) < 1 && clear(target, v))
    .sort((a, b) => distance(target, a) - distance(target, b))[0];
  if (!start || !finish) return [];
  const queue = [start];
  const parents = new Map<string, string | null>([[key(start), null]]);
  for (let i = 0; i < queue.length && !parents.has(key(finish)); i++) {
    const v = queue[i]!;
    for (const [dx, dz] of [
      [0.5, 0],
      [-0.5, 0],
      [0, 0.5],
      [0, -0.5],
    ]) {
      const next = { x: v.x + dx!, z: v.z + dz! };
      const k = key(next);
      if (!parents.has(k) && available.has(k)) {
        parents.set(k, key(v));
        queue.push(next);
      }
    }
  }
  if (!parents.has(key(finish))) return [];
  const points: Point[] = [{ ...target }];
  let cursor: string | null = key(finish);
  while (cursor) {
    points.unshift(available.get(cursor)!);
    cursor = parents.get(cursor) ?? null;
  }
  const simplified: Point[] = [];
  let current = p;
  let index = 0;
  while (index < points.length) {
    let end = points.length - 1;
    while (end > index && !clear(current, points[end]!)) end--;
    current = points[end]!;
    simplified.push(current);
    index = end + 1;
  }
  return simplified;
}
export function validPose(raw: unknown): raw is Pose {
  if (!raw || typeof raw !== 'object') return false;
  const p = raw as Pose;
  return (
    walkable(p) &&
    typeof p.yaw === 'number' &&
    Number.isFinite(p.yaw) &&
    Math.abs(p.yaw) <= Math.PI * 2
  );
}
