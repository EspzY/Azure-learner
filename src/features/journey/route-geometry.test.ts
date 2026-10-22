import { expect, it } from 'vitest';
import { cameraAt, interpolateCamera, locations, project, routeX } from './route-geometry';

it('moves sideways into distinct detours and restores the exact authored return position', () => {
  const midway = interpolateCamera(cameraAt('arrival'), cameraAt('models'), 0.5);
  expect(midway.x).toBe(routeX(300));
  const main = cameraAt('models');
  const detour = cameraAt('decision');
  expect(Math.abs(main.x - detour.x)).toBeGreaterThan(250);
  expect(cameraAt('crossing')).toEqual(cameraAt('crossing'));
  expect(interpolateCamera(main, detour, 0)).toEqual(main);
  expect(interpolateCamera(main, detour, 1)).toEqual(detour);
  expect(interpolateCamera(main, detour, 4)).toEqual(detour);
  const interrupted = interpolateCamera(main, detour, 0.4);
  expect(interpolateCamera(interrupted, cameraAt('gateway'), 0)).toEqual(interrupted);
  expect(interpolateCamera(interrupted, cameraAt('gateway'), 1)).toEqual(cameraAt('gateway'));
});
it('projects elevation and distance with finite perspective on mobile and desktop', () => {
  for (const width of [500, 1200]) {
    const ground = project(locations.gateway, cameraAt('gateway'), width);
    const elevated = project({ ...locations.gateway, z: 100 }, cameraAt('gateway'), width);
    expect(elevated.y).toBeLessThan(ground.y);
    expect(Number.isFinite(ground.x)).toBe(true);
    expect(project({ x: 0, y: -9999, z: 0 }, cameraAt('arrival')).visible).toBe(false);
    expect(cameraAt('gateway', true).scale).toBeLessThan(cameraAt('gateway').scale);
  }
});
