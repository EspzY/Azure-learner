/** Test-only c2 parent view. Actual source admission is native and finite; no runtime import. */
import { readFileSync as nativeRead, realpathSync } from 'node:fs';
import { execFileSync as nativeExec } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { dirname, isAbsolute, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import manifest from '../docs/reviews/evidence/course-workspace/source-manifest.json';
export const courseBase = 'c2bce3efa2ed4a56c96b594a6731662663e597d1';
export const courseManifest = 'docs/reviews/evidence/course-workspace/source-manifest.json';
export const courseMetadata = [
  'quality/releases/current.json',
  'docs/quality/COURSE_WORKSPACE_QA.md',
  'docs/quality/COURSE_WORKSPACE_FINAL_AUDIT.md',
] as const;
export const blob = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
export const tree = new Map(
  nativeExec('git', ['ls-tree', '-r', courseBase], { encoding: 'utf8', maxBuffer: 16 << 20 })
    .trim()
    .split('\n')
    .map((line) => {
      const [meta, path] = line.split('\t');
      return [path!, meta!.split(' ')[2]!] as const;
    }),
);
const metadata = new Set<string>(courseMetadata);
export function validateCourseSource(actual: ReadonlyMap<string, string>) {
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.base, courseBase);
  const edits = manifest.edits as Record<string, { before: string; after: string }>,
    additions = manifest.additions as Record<string, string>;
  for (const [path, row] of Object.entries(edits)) {
    assert.equal(tree.get(path), row.before, 'wrong original: ' + path);
    assert(!metadata.has(path), 'metadata edit');
  }
  for (const path of Object.keys(additions)) assert(!tree.has(path), 'not an addition: ' + path);
  const expected = new Map([...tree].filter(([p]) => !metadata.has(p)));
  for (const [p, row] of Object.entries(edits)) expected.set(p, row.after);
  for (const [p, hash] of Object.entries(additions)) expected.set(p, hash);
  assert.deepEqual(
    [...actual.keys()].filter((p) => !metadata.has(p) && p !== courseManifest).sort(),
    [...expected.keys()].sort(),
    'unknown/missing course adapter path',
  );
  for (const [p, hash] of expected)
    assert.equal(actual.get(p), hash, 'unapproved course adapter bytes: ' + p);
}
const root = realpathSync(dirname(dirname(fileURLToPath(import.meta.url)))),
  temp = realpathSync(tmpdir());
const within = (parent: string, child: string) => {
  const p = relative(parent, child);
  return p !== '..' && !p.startsWith('..' + sep) && !isAbsolute(p);
};
let checked = false;
function validateCurrent() {
  if (checked) return;
  const paths = nativeExec(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { encoding: 'utf8', maxBuffer: 16 << 20 },
  )
    .split('\0')
    .filter(Boolean);
  // The existing baseline precondition checks the whole c2 tree using this
  // finite projection. Do not scan/hash that same unchanged tree a second time.
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.base, courseBase);
  assert.deepEqual(
    paths.filter((p) => !metadata.has(p) && p !== courseManifest).sort(),
    [...new Set([...tree.keys(), ...Object.keys(manifest.additions)])]
      .filter((p) => !metadata.has(p))
      .sort(),
    'unknown/missing course adapter path',
  );
  for (const [p, row] of Object.entries(manifest.edits)) {
    assert.equal(tree.get(p), row.before, 'wrong original: ' + p);
    assert.equal(blob(nativeRead(p)), row.after, 'unapproved course edit: ' + p);
  }
  for (const [p, hash] of Object.entries(manifest.additions)) {
    assert(!tree.has(p), 'not an addition: ' + p);
    assert.equal(blob(nativeRead(p)), hash, 'unapproved course addition: ' + p);
  }
  checked = true;
}
const cache = new Map<string, Buffer>();
export const readCourseParent = ((
  path: Parameters<typeof nativeRead>[0],
  options?: Parameters<typeof nativeRead>[1],
) => {
  validateCurrent();
  assert(typeof path !== 'number', 'no historical file descriptors');
  const real = realpathSync(path);
  if (!within(root, real)) {
    assert(within(temp, real), 'external historical read');
    return nativeRead(path, options as undefined);
  }
  const key = relative(root, real).split(sep).join('/');
  assert(tree.has(key), 'not a pinned parent path: ' + key);
  const actual = nativeRead(path),
    row = (manifest.edits as Record<string, { after: string }>)[key];
  const encoding = typeof options === 'string' ? options : options?.encoding;
  // Unchanged native bytes pass to the existing whole-baseline admission and
  // original assertions. The independent new guard also hashes every actual
  // source path without this projection. No base mutation is normalized away.
  if (!row && !metadata.has(key)) return encoding ? actual.toString(encoding) : actual;
  if (row) assert.equal(blob(actual), row.after, 'unapproved current read: ' + key);
  if (!cache.has(key))
    cache.set(key, nativeExec('git', ['show', courseBase + ':' + key], { maxBuffer: 16 << 20 }));
  const bytes = cache.get(key)!;
  return encoding ? bytes.toString(encoding) : Buffer.from(bytes);
}) as typeof nativeRead;
export const execCourseParent = ((
  file: string,
  args: readonly string[],
  options?: Parameters<typeof nativeExec>[2],
) => {
  validateCurrent();
  const encoding = typeof options === 'object' && options !== null ? options.encoding : undefined;
  const result = (bytes: Buffer) => (encoding ? bytes.toString(encoding as BufferEncoding) : bytes);
  if (file === 'git' && args[0] === 'hash-object' && args[1] === '--no-filters' && args[2] === '--')
    return result(
      Buffer.from(
        args
          .slice(3)
          .map((p) => blob(readCourseParent(p)))
          .join('\n') + '\n',
      ),
    );
  if (
    file === 'git' &&
    args[0] === 'ls-files' &&
    args.includes('--others') &&
    args.includes('--exclude-standard')
  ) {
    const paths = nativeExec(
      'git',
      ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
      { encoding: 'utf8', maxBuffer: 16 << 20 },
    )
      .split('\0')
      .filter(Boolean);
    assert.deepEqual(
      paths.filter((p) => !metadata.has(p) && p !== courseManifest).sort(),
      [...new Set([...tree.keys(), ...Object.keys(manifest.additions)])]
        .filter((p) => !metadata.has(p))
        .sort(),
      'unknown current path',
    );
    return result(
      Buffer.from(
        args.includes('--cached')
          ? [...tree.keys()].join(args.includes('-z') ? '\0' : '\n') +
              (args.includes('-z') ? '\0' : '\n')
          : '',
      ),
    );
  }
  if (file === 'git' && args[0] === 'diff' && args.includes('--name-only')) {
    const refs = args.filter((a) => /^[a-f0-9]{40}$/.test(a));
    if (refs.length === 1) return nativeExec(file, [...args, courseBase], options as undefined);
  }
  return nativeExec(file, args, options as undefined);
}) as typeof nativeExec;

// Finite adapter admission precedes baseline's whole-source precondition.
// Failures abort the suite; the independent raw guard never uses this view.
// No application/runtime code imports this helper.
validateCurrent();
