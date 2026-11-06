import { readPR62 as readFileSync } from './pr62-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr61/preservation.json';
export const pr61Base = 'd567d19504ac33a27252d30e24385679287d3987';
const originals = new Map<string, Buffer>();
export const hash = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
export function pr61Original(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', `${pr61Base}:${path}`], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
export function assertPR61Delta(path: string) {
  expect(proof.base).toBe(pr61Base);
  const entry = (proof.files as Record<string, { before: string; after: string }>)[path];
  if (!entry) throw Error('Not an authorized PR61 historical projection: ' + path);
  expect(hash(pr61Original(path)), path).toBe(entry.before);
  expect(hash(readFileSync(path)), path).toBe(entry.after);
}
/** Test-only: validate the actual bounded delta before older immutable-byte assertions.
 * New independent preservation tests check every original assertion and runtime boundary.
 * No application code imports this helper; all unlisted reads remain real reads.
 */
export function readPR61(path: string): Buffer;
export function readPR61(path: string, encoding: 'utf8'): string;
export function readPR61(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer;
  if (Object.hasOwn(proof.files, path)) {
    assertPR61Delta(path);
    bytes = pr61Original(path);
  } else bytes = readFileSync(path);
  return encoding ? bytes.toString(encoding) : bytes;
}
