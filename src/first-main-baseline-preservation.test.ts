import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import {
  baselineParents,
  baselineCommon,
  baselineMain,
  baselineTree,
  baselineBlob,
  baselineExpected,
  validateBaseline,
  baselineManifest,
  baselineMetadata,
  baselineEdits,
  baselineAdditions,
} from '../tests/baseline-preservation';
const git = (args: string[]) => execFileSync('git', args, { maxBuffer: 16 << 20 });
const original = (kind: keyof typeof baselineParents, path: string) =>
  git(['show', baselineParents[kind] + ':' + path]);
const paths = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z'])
  .toString()
  .split('\0')
  .filter(Boolean);
const actual = new Map(paths.map((p) => [p, baselineBlob(readFileSync(p))]));
const expected = baselineExpected();
const partition = (p: string) =>
  p.startsWith('public/')
    ? 'assets'
    : p.startsWith('docs/reviews/evidence/')
      ? 'historical evidence'
      : p.startsWith('docs/')
        ? 'documents'
        : 'source and tests';
it('pins the actual old main and both complete verified parent histories', () => {
  expect(baselineMain).toBe('d87fa852ceda7d8a7bff8ddfc72027e8fd9d153c');
  expect(
    git(['merge-base', baselineParents.portal, baselineParents.course]).toString().trim(),
  ).toBe(baselineCommon);
  for (const parent of Object.values(baselineParents))
    expect(() => git(['merge-base', '--is-ancestor', parent, 'HEAD'])).not.toThrow();
});
it('checks the complete actual integrated path union using native filesystem and Git', () => {
  expect(paths.length).toBeGreaterThan(3245);
  expect(new Set(paths).size).toBe(paths.length);
  validateBaseline(actual);
  expect([...baselineMetadata]).toEqual([
    'quality/releases/current.json',
    'docs/quality/FIRST_MAIN_BASELINE_QA.md',
    'docs/quality/FIRST_MAIN_BASELINE_FINAL_AUDIT.md',
  ]);
  expect([...baselineAdditions]).toEqual([
    'tests/baseline-preservation.ts',
    'src/first-main-baseline-preservation.test.ts',
    'docs/FIRST_MAIN_BASELINE.md',
    'docs/BASELINE_ROADMAP.md',
    'docs/reviews/evidence/first-main-baseline/integration-review.json',
  ]);
  expect([...baselineEdits].filter((p) => p.startsWith('src/') && !p.endsWith('.test.ts'))).toEqual(
    [],
  );
  expect(expected.has(baselineManifest)).toBe(false);
});
it.each(['assets', 'historical evidence', 'documents', 'source and tests'])(
  'preserves actual selected-parent bytes in %s',
  (part) => {
    const rows = [...expected].filter(([p]) => partition(p) === part);
    expect(rows.length).toBeGreaterThan(0);
    for (const [path, hash] of rows) expect(actual.get(path), path).toBe(hash);
  },
);
it('keeps every runtime module and migration byte-identical to the normal parent merge', () => {
  const p = baselineTree(baselineParents.portal),
    c = baselineTree(baselineParents.course),
    b = baselineTree(baselineCommon);
  for (const path of new Set([...p.keys(), ...c.keys()])) {
    if (!(path.startsWith('src/') && !path.endsWith('.test.ts')) && !path.startsWith('database/'))
      continue;
    const ph = p.get(path),
      ch = c.get(path),
      bh = b.get(path);
    const expectedHash = ph === ch || !ch || ch === bh ? ph : !ph || ph === bh ? ch : undefined;
    expect(expectedHash, 'unreviewed runtime conflict: ' + path).toBeDefined();
    expect(actual.get(path), path).toBe(expectedHash);
  }
});
const statements = (path: string, bytes: Buffer) => {
  const source = ts.createSourceFile(path, bytes.toString(), ts.ScriptTarget.Latest, true);
  return source.statements.filter((n) => !ts.isImportDeclaration(n)).map((n) => n.getText(source));
};
it.each([
  ['portal', 'tests/portal-fidelity-preservation.ts'],
  ['portal', 'src/portal-fidelity-preservation.test.ts'],
  ['course', 'tests/bifrost-course-preservation.ts'],
  ['course', 'src/features/course/bifrost-course-preservation.test.ts'],
] as const)('retains every original assertion and module body in %s %s', (kind, path) => {
  expect(statements(path, readFileSync(path))).toEqual(statements(path, original(kind, path)));
});
it('resolves the three reader conflicts without losing either original assertion body', () => {
  for (const path of [
    'src/pr72-ci-workflow.test.ts',
    'src/pr72-shared-portal-preservation.test.ts',
    'tests/pr72-preservation.ts',
  ]) {
    const current = readFileSync(path);
    expect(current).toEqual(original('portal', path));
    expect(statements(path, current)).toEqual(statements(path, original('course', path)));
  }
});
it('combines the real native-group selectors and Bifrost isolated fixture without changing other browser assertions', () => {
  const path = 'tests/e2e/premium-landing.spec.ts',
    before = original('portal', path).toString();
  const old = 'class="azurelab-landing"',
    next = 'class="azurelab-landing bifrost-learning"';
  expect(before.split(old)).toHaveLength(2);
  expect(readFileSync(path, 'utf8')).toBe(before.replace(old, next));
});
it.each([
  'changed engine',
  'changed learning domain',
  'missing parent file',
  'unknown runtime',
  'changed inherited evidence',
])('rejects %s without using either historical view', (kind) => {
  const changed = new Map(actual);
  if (kind === 'unknown runtime')
    changed.set('src/laboratory/unapproved-engine.ts', baselineBlob(Buffer.from('extra')));
  else {
    const path =
      kind === 'changed engine'
        ? 'src/laboratory/engine.ts'
        : kind === 'changed learning domain'
          ? [...expected.keys()].find((p) => p.startsWith('src/domain/') && p.endsWith('.ts'))!
          : kind === 'changed inherited evidence'
            ? [...expected.keys()].find((p) => p.startsWith('docs/reviews/evidence/pr57/'))!
            : 'src/features/portal/presentation.tsx';
    if (kind === 'missing parent file') changed.delete(path);
    else changed.set(path, baselineBlob(Buffer.from('changed')));
  }
  expect(() => validateBaseline(changed)).toThrow();
});
