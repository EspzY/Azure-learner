/** Test-only historical reader. Actual reviewed presentation deltas are hash-checked,
 * then frozen earlier tests read their original PR67 bytes. No runtime uses this. */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/pr68/preservation.json';
export const pr68Base = '36f355c0a8262a1ed556d1bb473de54999094998';
export const hash68 = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const cache = new Map<string, Buffer>();
export function original68(path: string) {
  if (!cache.has(path))
    cache.set(
      path,
      execFileSync('git', ['show', pr68Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return cache.get(path)!;
}
export function readPR68(path: string): Buffer;
export function readPR68(path: string, encoding: 'utf8'): string;
export function readPR68(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  if (Object.hasOwn(proof.files, path)) {
    assert.equal(proof.base, pr68Base);
    const row = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    assert.equal(hash68(bytes), row.after, path);
    assert.equal(hash68(original68(path)), row.before, path);
    bytes = original68(path);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
