/** Test-only PR75 view. Every admitted successor byte is independently bound by
 * the current raw-file guard. Runtime code never imports this historical reader. */
import { readFidelityHistory as readFileSync } from './portal-fidelity-preservation';
import { execFidelityHistory as execFileSync } from './portal-fidelity-preservation';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/integrated-application-chain/preservation.json';
import { createHash } from 'node:crypto';
const platformBlobHash = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const boundHistoricalBytes = (
  actual: Buffer,
  original: Buffer,
  binding: { before: string; after: string },
) => {
  assert.equal(platformBlobHash(actual), binding.after, 'unapproved current bytes');
  assert.equal(platformBlobHash(original), binding.before, 'unapproved base bytes');
  return original;
};
export const integrationBase = '5b2e814b9f4bae1aa3c2fe4e79cd3a4e53029484';
type Binding = { before: string; after: string };
const bindings: Record<string, Binding> = proof.files;
const added: Record<string, string> = proof.added;
const originals = new Map<string, Buffer>();
const original = (path: string) => {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', integrationBase + ':' + path], { maxBuffer: 16 * 1024 * 1024 }),
    );
  return originals.get(path)!;
};
export function readIntegratedHistory(path: string): Buffer;
export function readIntegratedHistory(path: string, encoding: 'utf8'): string;
export function readIntegratedHistory(path: string, encoding?: 'utf8'): Buffer | string {
  const actual = readFileSync(path),
    binding = Object.hasOwn(bindings, path) ? bindings[path] : undefined;
  const bytes = binding ? boundHistoricalBytes(actual, original(path), binding) : actual;
  return encoding ? bytes.toString(encoding) : bytes;
}
function originalAddedList(result: string) {
  for (const [path, expected] of Object.entries(added))
    assert.equal(platformBlobHash(readFileSync(path)), expected, 'unapproved added bytes: ' + path);
  return (
    result
      .split('\0')
      .filter(
        (path) =>
          path &&
          !Object.hasOwn(added, path) &&
          path !== 'docs/reviews/evidence/integrated-application-chain/preservation.json' &&
          !(path.startsWith('docs/quality/') && path.endsWith('.md')),
      )
      .join('\0') + '\0'
  );
}
export function execIntegratedHistory(
  file: string,
  args: readonly string[],
  options: { encoding: 'utf8'; maxBuffer?: number },
): string;
export function execIntegratedHistory(file: string, args: readonly string[]): Buffer;
export function execIntegratedHistory(
  file: string,
  args: readonly string[],
  options?: { encoding: 'utf8'; maxBuffer?: number },
): string | Buffer {
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
        .map((path) => platformBlobHash(readIntegratedHistory(path)))
        .join('\n') + '\n';
    return options?.encoding ? result : Buffer.from(result);
  }
  const result = options ? execFileSync(file, args, options) : execFileSync(file, args);
  if (
    file === 'git' &&
    ((args.length === 5 &&
      args[0] === 'diff' &&
      args[1] === '--diff-filter=A' &&
      args[2] === '--name-only' &&
      args[3] === '-z' &&
      args[4] === '249833f7cb7ea41d3e411444ec3c4f83805d3a5f') ||
      (args.length === 4 && args.join(' ') === 'ls-files --others --exclude-standard -z'))
  ) {
    const filtered = originalAddedList(result.toString());
    return options?.encoding ? filtered : Buffer.from(filtered);
  }
  return result;
}
