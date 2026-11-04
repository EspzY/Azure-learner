import { expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import amendment from '../docs/reviews/evidence/cc01/authorized-changes.json';
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
export const cc01DomainChanges = [
  'src/domain/portal/model.ts',
  'src/domain/portal/store.ts',
  'src/domain/portal/portal.test.ts',
  'src/domain/portal/challenge-origin.ts',
  'src/domain/portal/challenge-origin.test.ts',
];
export function assertCC01Change(path: string, historicalHash?: string) {
  expect(amendment.base).toBe('0e96c991d5e735e6b217bed15f20a3d5ef765c98');
  expect(Object.keys(amendment.files).sort()).toEqual(
    [
      ...cc01DomainChanges,
      'src/features/learning/management-access.tsx',
      'src/features/course/mission-context.ts',
    ].sort(),
  );
  const change = (amendment.files as Record<string, { before: string | null; after: string }>)[
    path
  ];
  expect(change, path).toBeDefined();
  if (!change) throw Error(`Missing explicit CC01 authorization: ${path}`);
  if (change.before) {
    const before = execFileSync('git', ['show', `${amendment.base}:${path}`]);
    expect(hash(before), path).toBe(change.before);
    if (historicalHash) expect(hash(before), path).toBe(historicalHash);
  }
  expect(hash(readFileSync(path)), path).toBe(change.after);
}
export function cc01Authorized(path: string) {
  return Object.hasOwn(amendment.files, path);
}

export function assertCC01LocaleAppend() {
  const before = execFileSync('git', ['show', `${amendment.base}:src/content/nb.ts`], {
    maxBuffer: 8 * 1024 * 1024,
  });
  expect(before.length).toBe(amendment.localePrefix.bytes);
  expect(hash(before)).toBe(amendment.localePrefix.sha256);
  const after = readFileSync('src/content/nb.ts');
  expect(after.subarray(0, before.length).equals(before)).toBe(true);
  expect(after.subarray(before.length).toString()).toMatch(/^\nexport const challengeReturnNb = /);
}
