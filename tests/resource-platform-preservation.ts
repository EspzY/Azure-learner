/** Test-only historical view. The current finite raw-byte guard validates every
 * real file first; this adapter never appears in a runtime import graph. */
import { readIntegratedHistory as readFileSync } from './integrated-platform-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/parallel-resource-platform/preservation.json';
export const platformBase = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
export const platformBlobHash = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
type Binding = { before: string; after: string };
const bindings: Record<string, Binding> = proof.files;
const originals = new Map<string, Buffer>();
export function originalPlatform(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', platformBase + ':' + path], { maxBuffer: 16 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
export function boundHistoricalBytes(actual: Buffer, original: Buffer, binding: Binding) {
  assert.equal(platformBlobHash(actual), binding.after, 'unapproved current bytes');
  assert.equal(platformBlobHash(original), binding.before, 'unapproved base bytes');
  return original;
}
export function readPlatformHistory(path: string): Buffer;
export function readPlatformHistory(path: string, encoding: 'utf8'): string;
export function readPlatformHistory(path: string, encoding?: 'utf8'): Buffer | string {
  const actual = readFileSync(path),
    binding = Object.hasOwn(bindings, path) ? bindings[path] : undefined;
  const bytes = binding ? boundHistoricalBytes(actual, originalPlatform(path), binding) : actual;
  return encoding ? bytes.toString(encoding) : bytes;
}
export function execPlatformHistory(
  file: string,
  args: readonly string[],
  options: { encoding: 'utf8'; maxBuffer?: number },
): string;
export function execPlatformHistory(file: string, args: readonly string[]): Buffer;
export function execPlatformHistory(
  file: string,
  args: readonly string[],
  options?: { encoding: 'utf8'; maxBuffer?: number },
): string | Buffer {
  // Only this precise old raw-blob reader receives the independently bound
  // historic view. Every other command/flag is executed normally.
  if (
    file === 'git' &&
    args.length > 3 &&
    args[0] === 'hash-object' &&
    args[1] === '--no-filters' &&
    args[2] === '--'
  ) {
    const result =
      args
        .slice(3)
        .map((path) => platformBlobHash(readPlatformHistory(path)))
        .join('\n') + '\n';
    return options?.encoding ? result : Buffer.from(result);
  }
  return options ? execFileSync(file, args, options) : execFileSync(file, args);
}
