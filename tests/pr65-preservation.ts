import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr65/preservation.json';
export const pr65Base = '42ab1ba33c1972fc685f09097eb7e4de48a3e7fd';
export const hash65 = (value: Buffer | string) => createHash('sha256').update(value).digest('hex');
const originals = new Map<string, Buffer>();
export function original65(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', pr65Base + ':' + path], { maxBuffer: 8 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
/** Historical test read projection only: pin actual scoped bytes first. Runtime never imports this. */
export function readPR65(path: string): Buffer;
export function readPR65(path: string, encoding: 'utf8'): string;
export function readPR65(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer = readFileSync(path);
  if (Object.hasOwn(proof.files, path)) {
    expect(proof.base).toBe(pr65Base);
    const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
    expect(hash65(original65(path)), path).toBe(entry.before);
    expect(hash65(bytes), path).toBe(entry.after);
    bytes = original65(path);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
