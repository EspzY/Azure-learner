import { readPR65 as readFileSync } from './pr65-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr64/preservation.json';
export const pr64Base = '33065cb3cf69f6c9ba5e3d04496e386a2f7f92be';
const originals = new Map<string, Buffer>();
export const pr64Hash = (bytes: Buffer | string) =>
  createHash('sha256').update(bytes).digest('hex');
export function pr64Original(path: string): Buffer {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', pr64Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
/** Only historical test readers use this projection. Actual scoped bytes are pinned;
 * all unlisted authorities, old tests and locked evidence must remain physical originals.
 */
export function readPR64(path: string): Buffer;
export function readPR64(path: string, encoding: 'utf8'): string;
export function readPR64(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer;
  if (Object.hasOwn(proof.files, path)) {
    expect(proof.base).toBe(pr64Base);
    const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    expect(pr64Hash(pr64Original(path)), path).toBe(entry.before);
    expect(pr64Hash(readFileSync(path)), path).toBe(entry.after);
    bytes = pr64Original(path);
  } else bytes = readFileSync(path);
  return encoding ? bytes.toString(encoding) : bytes;
}
