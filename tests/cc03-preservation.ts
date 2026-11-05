import { cc02TestAuthorized, assertCC02TestChange } from './cc02-preservation';
import { expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/cc03/authorized-changes.json';
export const cc03DomainChanges = [
  'src/domain/portal/challenge-v2.ts',
  'src/domain/portal/challenge-v2-store.ts',
  'src/domain/portal/challenge-v2.test.ts',
];
const hash = (b: Buffer) => createHash('sha256').update(b).digest('hex');
export const cc03Authorized = (path: string) => Object.hasOwn(proof.files, path);
export function assertCC03Change(path: string, historicalHash?: string) {
  expect(proof.base).toBe('bb66ff2e5115d26304bb017295a9067c6f6fed5d');
  const entry = (proof.files as Record<string, { before: string | null; after: string }>)[path];
  expect(entry, path).toBeDefined();
  if (!entry) throw Error('Missing CC03 authorization: ' + path);
  if (entry.before) {
    const before = execFileSync('git', ['show', `${proof.base}:${path}`], {
      maxBuffer: 8 * 1024 * 1024,
    });
    expect(hash(before), path).toBe(entry.before);
    if (historicalHash) expect(hash(before), path).toBe(historicalHash);
  } else {
    expect(() =>
      execFileSync('git', ['cat-file', '-e', `${proof.base}:${path}`], { stdio: 'ignore' }),
    ).toThrow();
  }
  if (cc02TestAuthorized(path)) {
    assertCC02TestChange(path, entry.after);
  } else expect(hash(readFileSync(path)), path).toBe(entry.after);
}
