/** Finite read adapter for inherited preservation assertions.
 * All actual PR71 changes are hash-checked before the older tests receive
 * their original PR70 bytes. This never runs in application code.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/pr71/preservation.json';

export const pr71Base = '897bc783a3f49be8d9f561a819ee6816b10ed91d';
export const blobHash71 = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const cache = new Map<string, Buffer>();
export function original71(path: string) {
  if (!cache.has(path))
    cache.set(path, execFileSync('git', ['show', pr71Base + ':' + path], {
      maxBuffer: 16 * 1024 * 1024,
    }));
  return cache.get(path)!;
}
export function readPR71(path: string): Buffer;
export function readPR71(path: string, encoding: 'utf8'): string;
export function readPR71(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes = readFileSync(path);
  const row = (proof.files as Record<string, { before: string; after: string }>)[path];
  if (row) {
    assert.equal(blobHash71(bytes), row.after, path);
    assert.equal(blobHash71(original71(path)), row.before, path);
    bytes = original71(path);
  }
  return encoding ? bytes.toString('utf8') : bytes;
}
