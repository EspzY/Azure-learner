import { readPR63 as readFileSync } from './pr63-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr62/preservation.json';
export const pr62Base = '3e7de9622be78a641b1d890950e46918be9f8a76';
const originals = new Map<string, Buffer>();
export function pr62Original(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', pr62Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
const hash = (b: Buffer) => createHash('sha256').update(b).digest('hex');
/** Test-only historical byte projection; actual modified files are pinned and separately reviewed.
 * All unlisted reads remain real. No production module imports this helper.
 */
export function readPR62(path: string): Buffer;
export function readPR62(path: string, encoding: 'utf8'): string;
export function readPR62(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer;
  if (Object.hasOwn(proof.files, path)) {
    expect(proof.base).toBe(pr62Base);
    const entry = (proof.files as Record<string, { before: string; after: string }>)[path];
    expect(hash(pr62Original(path)), path).toBe(entry!.before);
    expect(hash(readFileSync(path)), path).toBe(entry!.after);
    bytes = pr62Original(path);
  } else bytes = readFileSync(path);
  return encoding ? bytes.toString(encoding) : bytes;
}
