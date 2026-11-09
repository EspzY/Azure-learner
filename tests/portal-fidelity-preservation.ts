/** Test-only view of the verified pre-fidelity presentation. Current runtime,
 * browser tests and the independent raw-filesystem guard never use this view. */
import { readFileSync, realpathSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { isAbsolute, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import proof from '../docs/reviews/evidence/portal-resource-fidelity/preservation.json';

type Binding = { before: string; after: string };
export const fidelityBase = 'c4119f3f770d6767881dc5ee455686cbae0150d7';
export const fidelityBlobHash = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const bindings: Record<string, Binding> = proof.files;
const added: Record<string, string> = proof.added;
export const fidelityMutable = new Set([
  'quality/releases/current.json',
  'docs/reviews/evidence/portal-resource-fidelity/preservation.json',
  'docs/quality/PORTAL_RESOURCE_FIDELITY_QA.md',
  'docs/quality/PORTAL_RESOURCE_FIDELITY_FINAL_AUDIT.md',
  'docs/quality/PORTAL_RESOURCE_FIDELITY_RELEASE_REVIEW.md',
]);
const baseRows = new Map(
  execFileSync('git', ['ls-tree', '-r', fidelityBase], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
    .trim()
    .split('\n')
    .map((line) => {
      const [meta, path] = line.split('\t');
      return [path!, meta!.split(' ')[2]!] as const;
    }),
);
const original = (path: string) =>
  execFileSync('git', ['show', fidelityBase + ':' + path], { maxBuffer: 16 * 1024 * 1024 });
const repositoryRoot = realpathSync(fileURLToPath(new URL('..', import.meta.url)));
const temporaryRoot = realpathSync(tmpdir());
const within = (root: string, path: string) => {
  const local = relative(root, path);
  return local !== '..' && !local.startsWith('..' + sep) && !isAbsolute(local);
};
/** Actual temporary publisher outputs are not repository history. Absolute
 * repository paths still use the same finite byte pins and substitutions. */
export function validateFidelityRead(path: string, bytes: Buffer): string | null {
  const actualPath = realpathSync(path);
  if (!within(repositoryRoot, actualPath)) {
    assert(within(temporaryRoot, actualPath), 'unapproved external read: ' + path);
    return null;
  }
  const key = relative(repositoryRoot, actualPath).split(sep).join('/');
  const binding = Object.hasOwn(bindings, key) ? bindings[key] : undefined;
  if (!fidelityMutable.has(key))
    assert.equal(
      fidelityBlobHash(bytes),
      binding?.after ?? added[key] ?? baseRows.get(key),
      'unapproved read: ' + key,
    );
  return key;
}
export function validateFidelityProjection(actual: ReadonlyMap<string, string>) {
  assert.equal(proof.base, fidelityBase, 'wrong fidelity base');
  for (const [path, before] of baseRows) {
    if (fidelityMutable.has(path)) continue;
    const binding = Object.hasOwn(bindings, path) ? bindings[path] : undefined;
    if (binding) assert.equal(binding.before, before, 'wrong original hash: ' + path);
    assert.equal(actual.get(path), binding?.after ?? before, 'unapproved current bytes: ' + path);
  }
  const actualAdded = [...actual.keys()]
    .filter((path) => !baseRows.has(path) && !fidelityMutable.has(path))
    .sort();
  assert.deepEqual(actualAdded, Object.keys(added).sort(), 'unknown or missing added files');
  for (const [path, expected] of Object.entries(added))
    assert.equal(actual.get(path), expected, 'unapproved added bytes: ' + path);
  for (const path of Object.keys(bindings))
    assert(baseRows.has(path), 'unknown modified path: ' + path);
}
let validated = false;
function validateCurrent() {
  if (validated) return;
  const paths = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
  )
    .split('\0')
    .filter(Boolean);
  validateFidelityProjection(
    new Map(
      paths
        .filter((path) => !fidelityMutable.has(path))
        .map((path) => [path, fidelityBlobHash(readFileSync(path))]),
    ),
  );
  validated = true;
}
export function readFidelityHistory(path: string): Buffer;
export function readFidelityHistory(path: string, encoding: 'utf8'): string;
export function readFidelityHistory(path: string, encoding?: 'utf8'): Buffer | string {
  validateCurrent();
  const actual = readFileSync(path),
    key = validateFidelityRead(path, actual),
    binding = key !== null && Object.hasOwn(bindings, key) ? bindings[key] : undefined;
  const bytes = binding && key !== null ? original(key) : actual;
  return encoding ? bytes.toString(encoding) : bytes;
}
export function execFidelityHistory(
  file: string,
  args: readonly string[],
  options: { encoding: 'utf8'; maxBuffer?: number },
): string;
export function execFidelityHistory(file: string, args: readonly string[]): Buffer;
export function execFidelityHistory(
  file: string,
  args: readonly string[],
  options: { maxBuffer?: number; encoding?: undefined },
): Buffer;
export function execFidelityHistory(
  file: string,
  args: readonly string[],
  options?: { encoding?: 'utf8'; maxBuffer?: number },
): string | Buffer {
  validateCurrent();
  if (
    file === 'git' &&
    args.length > 3 &&
    args[0] === 'hash-object' &&
    args[1] === '--no-filters' &&
    args[2] === '--'
  ) {
    const text =
      args
        .slice(3)
        .map((path) => fidelityBlobHash(readFidelityHistory(path)))
        .join('\n') + '\n';
    return options?.encoding ? text : Buffer.from(text);
  }
  const result =
    options?.encoding === 'utf8'
      ? execFileSync(file, args, { encoding: 'utf8', maxBuffer: options.maxBuffer })
      : execFileSync(file, args, { maxBuffer: options?.maxBuffer });
  const oldBase =
    args[4] === '249833f7cb7ea41d3e411444ec3c4f83805d3a5f' ||
    args[4] === '5b2e814b9f4bae1aa3c2fe4e79cd3a4e53029484';
  if (
    file === 'git' &&
    ((args.length === 5 &&
      args.slice(0, 4).join(' ') === 'diff --diff-filter=A --name-only -z' &&
      oldBase) ||
      (args.length === 4 && args.join(' ') === 'ls-files --others --exclude-standard -z'))
  ) {
    const paths = result.toString().split('\0').filter(Boolean);
    for (const path of paths)
      if (!baseRows.has(path) && !fidelityMutable.has(path))
        assert(Object.hasOwn(added, path), 'unapproved added path: ' + path);
    const text =
      paths.filter((path) => !Object.hasOwn(added, path) && !fidelityMutable.has(path)).join('\0') +
      '\0';
    return options?.encoding ? text : Buffer.from(text);
  }
  return result;
}
