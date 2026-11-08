import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr66/preservation.json';
export const pr66Base = 'c9cf4f375e5b332b1f17a5ba31d021d093b1cb47';
export const hash66 = (value: Buffer | string) => createHash('sha256').update(value).digest('hex');
const originals = new Map<string, Buffer>();
export function original66(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', pr66Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
/** Test-only historical read adapter. Pins actual changed bytes before returning their original version. */
export function readPR66(path: string): Buffer;
export function readPR66(path: string, encoding: 'utf8'): string;
export function readPR66(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  if (Object.hasOwn(proof.files, path)) {
    expect(proof.base).toBe(pr66Base);
    const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    expect(hash66(original66(path)), path).toBe(entry.before);
    expect(hash66(bytes), path).toBe(entry.after);
    bytes = original66(path);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
