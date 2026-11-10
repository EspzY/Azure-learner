import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import manifest from '../docs/reviews/evidence/course-workspace/source-manifest.json';
import {
  courseBase,
  courseManifest,
  courseMetadata,
  tree,
  blob,
  validateCourseSource,
  readCourseParent,
} from '../tests/course-workspace-preservation';
const git = (...args: string[]) => execFileSync('git', args, { maxBuffer: 16 << 20 });
const original = (p: string) => git('show', courseBase + ':' + p);
const paths = git('ls-files', '--cached', '--others', '--exclude-standard', '-z')
  .toString()
  .split('\0')
  .filter(Boolean);
const actual = new Map(paths.map((p) => [p, blob(readFileSync(p))]));
const edits = [
  'AGENTS.md',
  'README.md',
  'docs/PROJECT_STATUS.md',
  'docs/DECISIONS.md',
  'docs/DEVELOPMENT_WORKFLOW.md',
  'playwright.desktop.config.ts',
  'scripts/laboratory-db.mjs',
  'src/features/course/course-hub.tsx',
  'src/features/laboratory/compute.tsx',
  'src/features/laboratory/endpoints.tsx',
  'src/features/laboratory/firewall.tsx',
  'src/features/laboratory/laboratory.tsx',
  'src/features/laboratory/networking.tsx',
  'src/features/laboratory/routing.tsx',
  'src/features/laboratory/studio-location.ts',
  'src/features/laboratory/studio.tsx',
  'src/features/laboratory/topology-access.tsx',
  'src/first-main-baseline-preservation.test.ts',
  'src/laboratory/v3/repository.ts',
  'src/laboratory/v3/server.ts',
  'tests/baseline-preservation.ts',
  'tests/portal-fidelity-preservation.ts',
];
const additions = [
  'database/laboratory-v3/011-course-workspaces.sql',
  'docs/reviews/evidence/course-workspace/capture-provenance.json',
  'docs/BASELINE_OWNER_ACCEPTANCE.md',
  'docs/COURSE_LABORATORY_ADAPTER_V1.md',
  'src/app/api/course-laboratory/[action]/route.ts',
  'src/app/labs/course-workspace/page.tsx',
  'src/features/laboratory/course-client.ts',
  'src/features/laboratory/course-evidence.tsx',
  'src/features/laboratory/workspace-context.tsx',
  'src/laboratory/course/contract.ts',
  'src/laboratory-course-client.test.ts',
  'src/laboratory-course-contract.test.ts',
  'src/laboratory-course.integration.test.ts',
  'src/course-workspace-preservation.test.ts',
  'tests/course-workspace-preservation.ts',
  'tests/e2e/course-workspace.spec.ts',
  'docs/screenshots/course-workspace/persistent-course-blob-evidence.png',
  'docs/screenshots/course-workspace/course-shared-studio.png',
  'docs/screenshots/course-workspace/course-review-1440-900.png',
  'docs/screenshots/course-workspace/course-review-1024-768.png',
  'docs/screenshots/course-workspace/course-review-1024-500.png',
];
it('admits only the exact bounded adapter changes against the verified c2 source, using native fs and Git', () => {
  expect(courseBase).toBe('c2bce3efa2ed4a56c96b594a6731662663e597d1');
  expect(() => git('merge-base', '--is-ancestor', courseBase, 'HEAD')).not.toThrow();
  expect(Object.keys(manifest.edits).sort()).toEqual(edits.sort());
  expect(Object.keys(manifest.additions).sort()).toEqual(additions.sort());
  expect(courseMetadata).toEqual([
    'quality/releases/current.json',
    'docs/quality/COURSE_WORKSPACE_QA.md',
    'docs/quality/COURSE_WORKSPACE_FINAL_AUDIT.md',
  ]);
  expect(paths).toContain(courseManifest);
  validateCourseSource(actual);
});
it('keeps every historical engine, SQL001–010, learning store, rubric, receipt fixture, prior browser and quality workflow byte-identical', () => {
  const protectedPaths = [...tree.keys()].filter(
    (p) => !edits.includes(p) && p !== 'quality/releases/current.json',
  );
  expect(protectedPaths.length).toBeGreaterThan(3200);
  for (const p of protectedPaths) expect(actual.get(p), p).toBe(tree.get(p));
  expect(
    edits.filter(
      (p) =>
        p.startsWith('src/domain/') ||
        p.startsWith('src/features/learning/') ||
        p.startsWith('tests/e2e/') ||
        p.startsWith('.github/') ||
        p.startsWith('database/'),
    ),
  ).toEqual([]);
});
it.each(['changed old engine', 'changed old assertion', 'unapproved addition', 'missing source'])(
  'rejects raw source mutation: %s',
  (kind) => {
    const mutated = new Map(actual);
    if (kind === 'unapproved addition') mutated.set('src/unreviewed.ts', '0'.repeat(40));
    else if (kind === 'missing source') mutated.delete('src/laboratory/engine.ts');
    else
      mutated.set(
        kind === 'changed old engine'
          ? 'src/laboratory/v39/domain.ts'
          : 'tests/e2e/owner-acceptance.spec.ts',
        '0'.repeat(40),
      );
    expect(() => validateCourseSource(mutated)).toThrow();
  },
);
it.each([
  'tests/baseline-preservation.ts',
  'tests/portal-fidelity-preservation.ts',
  'src/first-main-baseline-preservation.test.ts',
])('retains every non-import original assertion/helper body in %s', (p) => {
  const body = (bytes: Buffer, current = false) => {
    const f = ts.createSourceFile(p, bytes.toString(), ts.ScriptTarget.Latest, true);
    const statements = f.statements.filter((x) => !ts.isImportDeclaration(x));
    const initializer =
      p === 'tests/baseline-preservation.ts'
        ? "readPortalBaseline('AGENTS.md');"
        : p === 'tests/portal-fidelity-preservation.ts'
          ? "readFidelityHistory('AGENTS.md');"
          : null;
    if (current && initializer) {
      expect(statements.at(-1)?.getText(f)).toBe(initializer);
      statements.pop();
    }
    return ts
      .createPrinter()
      .printList(ts.ListFormat.MultiLine, ts.factory.createNodeArray(statements), f);
  };
  expect(body(readFileSync(p), true)).toBe(body(original(p)));
});
it('only prepends current owner decisions and adds the explicit neutral technical course entry', () => {
  for (const p of edits.filter((p) => p.endsWith('.md')))
    expect(readFileSync(p, 'utf8').endsWith(original(p).toString())).toBe(true);
  const p = 'src/features/course/course-hub.tsx',
    before = original(p).toString();
  expect(readFileSync(p, 'utf8')).toBe(
    before.replace(
      '<Link href="/labs/laboratory">{laboratoryV3Nb.entry}</Link>',
      '<Link href="/labs/laboratory">{laboratoryV3Nb.entry}</Link>\n        <Link href="/labs/course-workspace">Serverlagret kursarbeidsområde · teknisk</Link>',
    ),
  );
});

it('keeps historical parent buffers defensive and refuses new paths even after native admission', () => {
  const path = 'src/laboratory/v39/domain.ts',
    first = readCourseParent(path);
  expect(first).toEqual(original(path));
  first.fill(0);
  expect(readCourseParent(path)).toEqual(original(path));
  expect(() => readCourseParent('src/laboratory/course/contract.ts')).toThrow(
    'not a pinned parent path',
  );
});
