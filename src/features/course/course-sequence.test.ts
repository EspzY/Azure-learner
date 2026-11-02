import { describe, expect, it } from 'vitest';
import { moduleIds, courseTopic } from '@/domain/course/model';
import { coursePaths } from './course-outline';
import { introducedBefore, recommendedBoundary, recommendedModules } from './course-sequence';

describe('recommended journey is navigation over the existing canonical catalogue', () => {
  it('includes every available module exactly once, without changing its subject group', () => {
    const catalogue = coursePaths.flatMap((p) => p.modules.flatMap((g) => [...g.parts]));
    expect(recommendedModules).toHaveLength(17);
    expect(new Set(recommendedModules).size).toBe(moduleIds.length);
    expect([...recommendedModules].sort()).toEqual([...moduleIds].sort());
    expect([...catalogue].sort()).toEqual([...moduleIds].sort());
    expect(coursePaths).toHaveLength(3);
    const architecture = coursePaths[1].modules;
    expect(architecture.find((g) => g.parts.some((part) => part === 'migration'))?.parts).toEqual([
      'storage',
      'storage-resilience',
      'migration',
    ]);
    expect(architecture.find((g) => g.parts.some((part) => part === 'security'))?.parts).toEqual([
      'identity',
      'access-control',
      'security',
    ]);
  });

  it('introduces every dependency in the complete audit graph before its use', () => {
    const position = (id: (typeof moduleIds)[number]) => recommendedModules.indexOf(id);
    for (const [module, prerequisites] of Object.entries(introducedBefore))
      for (const prerequisite of prerequisites)
        expect(position(prerequisite), `${prerequisite} before ${module}`).toBeLessThan(
          position(module as (typeof moduleIds)[number]),
        );
    expect(introducedBefore.security).toEqual(expect.arrayContaining(['governance', 'monitoring']));
    expect(introducedBefore.migration).toEqual(
      expect.arrayContaining([
        'storage',
        'storage-resilience',
        'access-control',
        'management-tools',
      ]),
    );
  });

  it('has a finite connected Next chain, reciprocal Previous modules and an honest Hub ending', () => {
    let module: (typeof moduleIds)[number] | undefined = 'computing';
    const visited = new Set<string>();
    expect(recommendedBoundary(module, 'previous')).toBeUndefined();
    while (module) {
      expect(visited.has(module)).toBe(false);
      visited.add(module);
      const next: NonNullable<ReturnType<typeof recommendedBoundary>> = recommendedBoundary(
        module,
        'next',
      )!;
      if (next.module) {
        expect(recommendedBoundary(next.module, 'previous')?.module).toBe(module);
        const url = new URL(next.href, 'https://azurelab.invalid');
        expect(url.pathname).toBe('/learn/' + next.module);
        expect(courseTopic(next.module, url.searchParams.get('topic'))).toBe(
          url.searchParams.get('topic'),
        );
        const previous = new URL(recommendedBoundary(next.module, 'previous')!.href, url);
        expect(courseTopic(module, previous.searchParams.get('topic'))).toBe(
          previous.searchParams.get('topic'),
        );
      } else {
        expect(module).toBe('migration');
        expect(next.href).toBe('/learn');
      }
      module = next.module;
    }
    expect(visited.size).toBe(moduleIds.length);
  });

  it('puts the two cross-subject applications after their required foundations', () => {
    expect(recommendedBoundary('storage-resilience', 'next')?.module).toBe('identity');
    expect(recommendedBoundary('access-control', 'next')?.module).toBe('cost');
    expect(recommendedBoundary('monitoring', 'next')?.module).toBe('security');
    expect(recommendedBoundary('security', 'next')?.module).toBe('migration');
    expect(recommendedBoundary('migration', 'next')?.href).toBe('/learn');
  });
});
