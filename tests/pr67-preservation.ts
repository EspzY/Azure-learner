import { readPR68 as readFileSync } from './pr68-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr67/preservation.json';
export const pr67Base = '9252739eb1bdf7bf6aabc2696ae57000aa02a49f';
export const hash67 = (value: Buffer | string) => createHash('sha256').update(value).digest('hex');
const originals = new Map<string, Buffer>();
export function original67(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', pr67Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
/** Test-only historical read adapter. Pins actual changed bytes before returning their original version. */
export function readPR67(path: string): Buffer;
export function readPR67(path: string, encoding: 'utf8'): string;
export function readPR67(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  if (Object.hasOwn(proof.files, path)) {
    expect(proof.base).toBe(pr67Base);
    const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    expect(hash67(original67(path)), path).toBe(entry.before);
    expect(hash67(bytes), path).toBe(entry.after);
    bytes = original67(path);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
