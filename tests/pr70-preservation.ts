/** Finite test-only compatibility adapter. It checks actual reviewed bytes
 * before returning original PR69 bytes to historical assertions. Not runtime. */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/pr70/preservation.json';
export const pr70Base = '41a187a4437eeea76749c61c94219a2577848645';
export const hash70 = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const cache = new Map<string, Buffer>();
export function original70(path: string) {
  if (!cache.has(path))
    cache.set(
      path,
      execFileSync('git', ['show', pr70Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return cache.get(path)!;
}
export function readPR70(path: string): Buffer;
export function readPR70(path: string, encoding: 'utf8'): string;
export function readPR70(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  if (Object.hasOwn(proof.files, path)) {
    assert.equal(proof.base, pr70Base);
    const row = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    assert.equal(hash70(bytes), row.after, path);
    assert.equal(hash70(original70(path)), row.before, path);
    bytes = original70(path);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
