import { assertCC02Change, cc02DomainChanges } from '../../../tests/cc02-preservation';
import { assertCC03Change, cc03DomainChanges } from '../../../tests/cc03-preservation';
import {
  assertCC01Change,
  assertCC01LocaleAppend,
  cc01DomainChanges,
  cc01Authorized,
} from '../../../tests/cc01-preservation';
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import {
  cloudChapters,
  cloudChapterFor,
  cloudNavigationTopic,
  cloudRecommendedTopics,
  cloudOriginalTopics,
} from './cloud-computing-chapters';
import { v2Topics } from '@/domain/curriculum/foundations-v2';
import { courseHref, courseTopic, restoreCourse } from '@/domain/course/model';
const base = 'eefbcd3bc7f140b690829bad6542d800c57b7f74';
describe('Cloud Computing pedagogical projection over historical topics', () => {
  it('covers all original teaching topics once, keeps nonchapter application and finite reciprocal navigation', () => {
    expect(cloudOriginalTopics).toHaveLength(19);
    expect(cloudRecommendedTopics).toHaveLength(14);
    expect(new Set(cloudRecommendedTopics).size).toBe(14);
    expect(cloudChapters.flatMap((c) => [...c.members])).toEqual(v2Topics.slice(0, -1));
    expect(cloudRecommendedTopics.slice(-8)).toEqual(cloudOriginalTopics.slice(-8));
    for (const topic of cloudOriginalTopics) {
      const canonical = cloudNavigationTopic(topic);
      expect(cloudRecommendedTopics).toContain(canonical);
      expect(courseTopic('computing', topic)).toBe(topic);
      expect(courseHref('computing', topic)).toBe(`/learn/computing?topic=${topic}`);
      const n = cloudRecommendedTopics.indexOf(canonical);
      if (n + 1 < cloudRecommendedTopics.length)
        expect(cloudRecommendedTopics.indexOf(cloudRecommendedTopics[n + 1]!) - 1).toBe(n);
    }
    expect(cloudChapterFor('provisioning')?.topic).toBe('virtualization');
    expect(cloudChapterFor('v2-capacity')?.topic).toBe('capacity-basics');
    expect(cloudNavigationTopic('v2-assessment')).toBe('v2-assessment');
  });
  it('reads every old resume without rewriting it or introducing a persistent chapter/completion field', () => {
    for (const topic of [...cloudOriginalTopics, 'v2-assessment', 'v2-summary', 'capacity']) {
      const save = { schema: 1, resume: { module: 'computing', topic }, lab: null };
      expect(restoreCourse(JSON.stringify(save))).toEqual({ save, issue: null });
    }
    const metadata = readFileSync('src/features/course/cloud-computing-chapters.ts', 'utf8');
    expect(metadata).not.toMatch(/localStorage|\.event\(|useEffect|completion:/);
  });
  it('preserves every authoritative domain/store/rubric and the entire old manuscript byte for byte', () => {
    const changed = execFileSync('git', ['diff', base, '--name-only', '--', 'src/domain/'], {
      encoding: 'utf8',
    }).trim();
    expect(
      changed
        .split('\n')
        .filter(Boolean)
        .filter(
          (path) =>
            !cc01DomainChanges.includes(path) &&
            !cc03DomainChanges.includes(path) &&
            !cc02DomainChanges.includes(path),
        ),
    ).toEqual([]);
    for (const path of cc01DomainChanges) assertCC01Change(path);
    for (const path of cc03DomainChanges) assertCC03Change(path);
    for (const path of cc02DomainChanges) assertCC02Change(path);
    for (const path of [
      'src/content/nb.ts',
      'src/features/learning/serverless.tsx',
      'src/features/course/assessment-navigation-exit.tsx',
      'src/features/learning/management-access.tsx',
    ]) {
      if (path === 'src/content/nb.ts') {
        assertCC01LocaleAppend();
        const before = execFileSync('git', ['show', `${base}:${path}`], {
          maxBuffer: 8 * 1024 * 1024,
        });
        expect(readFileSync(path).subarray(0, before.length).equals(before)).toBe(true);
        continue;
      }
      if (cc01Authorized(path)) {
        assertCC01Change(path);
        continue;
      }
      expect(readFileSync(path, 'utf8')).toBe(
        execFileSync('git', ['show', `${base}:${path}`], {
          encoding: 'utf8',
          maxBuffer: 8 * 1024 * 1024,
        }),
      );
    }
  });
  it('keeps all original server figure geometry and labels when SVG identifiers become instance-scoped', () => {
    const path = 'src/features/learning/foundations-visuals.tsx';
    const before = execFileSync('git', ['show', `${base}:${path}`], { encoding: 'utf8' });
    const after = readFileSync(path, 'utf8');
    const geometry = (source: string) =>
      [
        ...source.matchAll(
          /\b(?:viewBox|d|x|y|cx|cy|r|rx|width|height|points|transform|strokeWidth)=(?:"[^"]*"|\{[^}]*\})/g,
        ),
      ].map((match) => match[0]);
    expect(geometry(after)).toEqual(geometry(before));
    expect([...after.matchAll(/\{t\.[\w.[\]]+\}/g)].map((match) => match[0])).toEqual(
      [...before.matchAll(/\{t\.[\w.[\]]+\}/g)].map((match) => match[0]),
    );
  });
});
