import { describe, expect, it } from 'vitest';
import { initialSimulation } from '@/domain/simulation';
import { footprint, project, relatedScopes, scenePosition } from './scene-layout';

describe('spatial presentation preserves technical meaning', () => {
  it('does not position resources by region', () => {
    const group = initialSimulation.scopes.find((scope) => scope.id === 'rg-app')!;
    expect(scenePosition(group)).toEqual(scenePosition({ ...group, region: 'westeurope' }));
  });
  it('projects real elevation and camera rotation rather than changing simulation data', () => {
    const point = { x: 120, y: 80, z: 0 };
    expect(project({ ...point, z: 60 }).y).toBeLessThan(project(point).y);
    expect(project(point, 30)).not.toEqual(project(point, 60));
    expect(footprint(point, 100, 70, 45)).toHaveLength(4);
  });
  it('highlights the selected branch plus its ancestors, not unrelated sibling resources', () => {
    const result = relatedScopes(initialSimulation.scopes, 'rg-app');
    expect([...result].sort()).toEqual(['app', 'mg', 'rg-app', 'root', 'sub', 'tenant']);
    expect(result.has('storage')).toBe(false);
    expect(relatedScopes(initialSimulation.scopes, null).size).toBe(8);
  });
  it('gives all three newly created groups finite deterministic scene coordinates', () => {
    const coords = [1, 2, 3].map((index) =>
      scenePosition({
        id: `created-group-${index}`,
        label: 'test',
        kind: 'group',
        parentId: 'sub',
      }),
    );
    expect(new Set(coords.map((point) => point.x)).size).toBe(3);
    for (const point of coords) expect(Number.isFinite(project(point).x)).toBe(true);
  });
});
