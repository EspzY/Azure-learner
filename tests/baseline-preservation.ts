/** Test-only pinned parent views. Runtime never imports this module. Actual
 * integrated bytes and the exact path union are checked before a historical read.
 * The independent baseline test uses native fs/Git, never either parent view. */
import { readFileSync as nativeRead, realpathSync } from 'node:fs';
import { execFileSync as nativeExec } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { dirname, isAbsolute, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import manifest from '../docs/reviews/evidence/first-main-baseline/source-manifest.json';

export const baselineParents = {
  portal: '95d9e5b26e0cad69063153305b7ec3aa024fcfcf',
  course: '50e90f3cf14dce8b81a5bd9b7416d816a147f22a',
} as const;
export const baselineCommon = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
export const baselineMain = 'd87fa852ceda7d8a7bff8ddfc72027e8fd9d153c';
export const baselineManifest = 'docs/reviews/evidence/first-main-baseline/source-manifest.json';
export const baselineMetadata = [
  'quality/releases/current.json',
  'docs/quality/FIRST_MAIN_BASELINE_QA.md',
  'docs/quality/FIRST_MAIN_BASELINE_FINAL_AUDIT.md',
] as const;
export const baselineEdits = [
  'tests/portal-fidelity-preservation.ts',
  'src/portal-fidelity-preservation.test.ts',
  'tests/bifrost-course-preservation.ts',
  'src/features/course/bifrost-course-preservation.test.ts',
  'tests/e2e/premium-landing.spec.ts',
  'AGENTS.md',
  'README.md',
  'docs/PROJECT_STATUS.md',
  'docs/DEVELOPMENT_WORKFLOW.md',
  'docs/DECISIONS.md',
] as const;
export const baselineAdditions = [
  'tests/baseline-preservation.ts',
  'src/first-main-baseline-preservation.test.ts',
  'docs/FIRST_MAIN_BASELINE.md',
  'docs/BASELINE_ROADMAP.md',
  'docs/reviews/evidence/first-main-baseline/integration-review.json',
] as const;
export const baselineBlob = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
export const baselineTree = (commit: string) =>
  new Map(
    nativeExec('git', ['ls-tree', '-r', commit], { encoding: 'utf8', maxBuffer: 16 << 20 })
      .trim()
      .split('\n')
      .map((line) => {
        const [meta, path] = line.split('\t');
        return [path!, meta!.split(' ')[2]!] as const;
      }),
  );
const common = baselineTree(baselineCommon);
const parents = {
  portal: baselineTree(baselineParents.portal),
  course: baselineTree(baselineParents.course),
};
const metadata = new Set<string>(baselineMetadata);
const editPaths = new Set<string>(baselineEdits);
const additionPaths = new Set<string>(baselineAdditions);
export function baselineExpected() {
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.main, baselineMain);
  assert.equal(manifest.common, baselineCommon);
  assert.deepEqual(manifest.parents, baselineParents);
  assert.deepEqual(Object.keys(manifest.edits).sort(), [...editPaths].sort());
  assert.deepEqual(Object.keys(manifest.additions).sort(), [...additionPaths].sort());
  const result = new Map<string, string>();
  for (const path of new Set([...parents.portal.keys(), ...parents.course.keys()])) {
    if (metadata.has(path)) continue;
    const p = parents.portal.get(path),
      c = parents.course.get(path),
      b = common.get(path);
    if (editPaths.has(path)) {
      const row = (
        manifest.edits as Record<
          string,
          { portal: string | null; course: string | null; after: string }
        >
      )[path]!;
      assert.equal(row.portal, p ?? null, 'wrong portal origin: ' + path);
      assert.equal(row.course, c ?? null, 'wrong course origin: ' + path);
      result.set(path, row.after);
    } else if (p === c || !c || c === b) result.set(path, p!);
    else if (!p || p === b) result.set(path, c);
    else {
      // These three conflicts contain identical assertion bodies and differ only
      // in the reader import. Keep the technical chain; the B chain also runs.
      assert(
        [
          'src/pr72-ci-workflow.test.ts',
          'src/pr72-shared-portal-preservation.test.ts',
          'tests/pr72-preservation.ts',
        ].includes(path),
        'unreviewed merge conflict: ' + path,
      );
      result.set(path, p);
    }
  }
  for (const [path, hash] of Object.entries(manifest.additions)) result.set(path, hash);
  return result;
}
const expectedMerged = baselineExpected();
export function validateBaseline(actual: ReadonlyMap<string, string>) {
  const expected = expectedMerged;
  assert.deepEqual(
    [...actual.keys()].filter((p) => !metadata.has(p) && p !== baselineManifest).sort(),
    [...expected.keys()].sort(),
    'unknown/missing integrated paths',
  );
  for (const [path, hash] of expected)
    assert.equal(actual.get(path), hash, 'unapproved integrated bytes: ' + path);
}
const root = realpathSync(dirname(dirname(fileURLToPath(import.meta.url))));
const temp = realpathSync(tmpdir());
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
  validateBaseline(new Map(paths.map((p) => [p, baselineBlob(nativeRead(p))])));
  checked = true;
}
function parentView(kind: keyof typeof baselineParents) {
  const commit = baselineParents[kind],
    tree = parents[kind],
    cache = new Map<string, Buffer>();
  const old = (path: string) => {
    if (!cache.has(path))
      cache.set(path, nativeExec('git', ['show', commit + ':' + path], { maxBuffer: 16 << 20 }));
    return cache.get(path)!;
  };
  const read = ((
    path: Parameters<typeof nativeRead>[0],
    options?: Parameters<typeof nativeRead>[1],
  ) => {
    validateCurrent();
    assert(typeof path !== 'number', 'historical file descriptors are not supported');
    const canonical = realpathSync(path);
    if (!within(root, canonical)) {
      assert(within(temp, canonical), 'unapproved external historical read');
      return nativeRead(path, options as undefined);
    }
    const key = relative(root, canonical).split(sep).join('/');
    assert(tree.has(key), 'not a pinned parent path: ' + key);
    const actual = nativeRead(path);
    if (!metadata.has(key))
      assert.equal(
        baselineBlob(actual),
        expectedMerged.get(key),
        'unapproved current read: ' + key,
      );
    const bytes = baselineBlob(actual) === tree.get(key) ? actual : old(key);
    const encoding = typeof options === 'string' ? options : options?.encoding;
    return encoding ? bytes.toString(encoding) : bytes;
  }) as typeof nativeRead;
  const exec = ((
    file: string,
    args: readonly string[],
    options?: Parameters<typeof nativeExec>[2],
  ) => {
    validateCurrent();
    const encoding = typeof options === 'object' && options !== null ? options.encoding : undefined;
    const result = (bytes: Buffer) =>
      encoding ? bytes.toString(encoding as BufferEncoding) : bytes;
    if (
      file === 'git' &&
      args[0] === 'hash-object' &&
      args[1] === '--no-filters' &&
      args[2] === '--'
    )
      return result(
        Buffer.from(
          args
            .slice(3)
            .map((p) => baselineBlob(read(p)))
            .join('\n') + '\n',
        ),
      );
    if (
      file === 'git' &&
      args[0] === 'ls-files' &&
      args.includes('--others') &&
      args.includes('--exclude-standard')
    ) {
      // Recheck the real path set, even after the first full byte validation.
      const actual = nativeExec(
        'git',
        ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        { encoding: 'utf8', maxBuffer: 16 << 20 },
      )
        .split('\0')
        .filter(Boolean);
      assert.deepEqual(
        actual.filter((p) => !metadata.has(p)).sort(),
        [...expectedMerged.keys(), baselineManifest].sort(),
        'unknown integrated path',
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
      if (refs.length === 1) return nativeExec(file, [...args, commit], options as undefined);
    }
    return nativeExec(file, args, options as undefined);
  }) as typeof nativeExec;
  return { read, exec };
}
const portal = parentView('portal'),
  course = parentView('course');
export const readPortalBaseline = portal.read;
export const execPortalBaseline = portal.exec;
export const readCourseBaseline = course.read;
export const execCourseBaseline = course.exec;
