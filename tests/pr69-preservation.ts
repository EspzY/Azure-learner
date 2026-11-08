/** Test-only finite compatibility reader: actual changed bytes are hash-checked;
 * inherited assertions then inspect their original PR68 baseline. Never runtime. */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/pr69/preservation.json';
export const pr69Base = '37f6083f09dda8fceae0ba78b80b2ac91874a9fd';
export const hash69 = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const cache = new Map<string, Buffer>();
export function original69(path: string) {
  if (!cache.has(path))
    cache.set(
      path,
      execFileSync('git', ['show', pr69Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return cache.get(path)!;
}
export function readPR69(path: string): Buffer;
export function readPR69(path: string, encoding: 'utf8'): string;
export function readPR69(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  if (Object.hasOwn(proof.files, path)) {
    assert.equal(proof.base, pr69Base);
    const row = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    assert.equal(hash69(bytes), row.after, path);
    assert.equal(hash69(original69(path)), row.before, path);
    bytes = original69(path);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
