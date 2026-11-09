/** Test-only bounded view of PR71 bytes. Actual modified bytes must first match
 * the independently checked finite PR72 manifest. Never imported by runtime. */
import { readBifrostFoundation as readFileSync } from './bifrost-foundation-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/pr72/preservation.json';
export const pr72Base = '0538b40cc51af634e71182014e65bdb932936c70';
export const blobHash72 = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const cache = new Map<string, Buffer>();
export function original72(path: string) {
  if (!cache.has(path))
    cache.set(
      path,
      execFileSync('git', ['show', pr72Base + ':' + path], { maxBuffer: 16 * 1024 * 1024 }),
    );
  return cache.get(path)!;
}
export function readPR72(path: string): Buffer;
export function readPR72(path: string, encoding: 'utf8'): string;
export function readPR72(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  const row = (proof.files as Record<string, { before: string; after: string }>)[path];
  if (row) {
    assert.equal(blobHash72(bytes), row.after, path);
    assert.equal(blobHash72(original72(path)), row.before, path);
    bytes = original72(path);
  }
  return encoding ? bytes.toString('utf8') : bytes;
}
