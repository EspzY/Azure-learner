import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr63/preservation.json';

export const pr63Base = '26408f5bcb77fdc2aa5bde5027c1959f14d6c928';
const originals = new Map<string, Buffer>();
export const pr63Hash = (bytes: Buffer | string) =>
  createHash('sha256').update(bytes).digest('hex');
export function pr63Original(path: string): Buffer {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', pr63Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}

/** Historical test-only projection. Actual scoped code is pinned and independently exercised.
 * Unlisted paths always read physical bytes. No production code imports this helper.
 */
export function readPR63(path: string): Buffer;
export function readPR63(path: string, encoding: 'utf8'): string;
export function readPR63(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer;
  if (Object.hasOwn(proof.files, path)) {
    expect(proof.base).toBe(pr63Base);
    const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    expect(pr63Hash(pr63Original(path)), path).toBe(entry.before);
    expect(pr63Hash(readFileSync(path)), path).toBe(entry.after);
    bytes = pr63Original(path);
  } else bytes = readFileSync(path);
  return encoding ? bytes.toString(encoding) : bytes;
}
