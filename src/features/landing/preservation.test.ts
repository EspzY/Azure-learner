import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../../../docs/reviews/evidence/pr61/preservation.json';
import { assertPR61Delta, pr61Base, pr61Original } from '../../../tests/pr61-preservation';
const courseEntrances = [
  'serverless.spec.ts',
  'architecture-physical.spec.ts',
  'foundations-v2.spec.ts',
  'cloud-transfer.spec.ts',
  'ux-refinement.spec.ts',
  'az900-audit.spec.ts',
  'practical-labs.spec.ts',
  'architecture-management.spec.ts',
  'guided-learning-polish.spec.ts',
  'legacy-retirement.spec.ts',
  'portal-fidelity.spec.ts',
  'quality-system.spec.ts',
  'hybrid-experience.spec.ts',
  'laboratory-server.spec.ts',
  'vm-debrief-actions.ts',
  'practical-missions.spec.ts',
  'cost-management.spec.ts',
  'compute-hosting.spec.ts',
  'networking-connectivity.spec.ts',
  'final-quality-sprint.spec.ts',
  'curriculum-expansion.spec.ts',
  'course.spec.ts',
  'networking-foundations.spec.ts',
].map((p) => 'tests/e2e/' + p);
const readers = ['src/laboratory-v3-preservation.test.ts', 'tests/pr60-preservation.ts'];
const notes = ['AGENTS.md', 'README.md', 'docs/ARCHITECTURE.md', 'docs/DECISIONS.md'];
const runtime = [
  'src/app/page.tsx',
  'src/components/app-shell.tsx',
  'src/content/nb.ts',
  'playwright.desktop.config.ts',
];

it('bounds all original changes and preserves every other source asset domain server database script fixture and locked audit byte', () => {
  expect(Object.keys(proof.files).sort()).toEqual(
    [...courseEntrances, ...readers, ...notes, ...runtime].sort(),
  );
  const tree = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr61Base,
      '--',
      'src',
      'tests',
      'scripts',
      'database',
      'public',
      '.github',
      'package.json',
      'package-lock.json',
      'playwright.config.ts',
      'playwright.desktop.config.ts',
      'docs/reviews',
      'docs/quality',
      'docs/LABORATORY_STAGE1_BLOCKER.md',
      'docs/LABORATORY_V3_ACTIVATION.md',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(tree.length).toBeGreaterThan(890);
  for (const line of tree) {
    const [metadata, path] = line.split('\t') as [string, string];
    if (Object.hasOwn(proof.files, path)) assertPR61Delta(path);
    else {
      const b = readFileSync(path);
      expect(createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'), path).toBe(
        metadata.split(' ')[2],
      );
    }
  }
});

it('retains every old browser test name, assertion, safety control and fixture except explicit equivalent Course Hub entrances', () => {
  let changed = 0,
    realRootLinks = 0;
  for (const path of courseEntrances) {
    const before = pr61Original(path).toString();
    changed += (before.match(/goto\('\/'\)/g) ?? []).length;
    let expected: string;
    if (path.endsWith('/course.spec.ts') || path.endsWith('/legacy-retirement.spec.ts')) {
      realRootLinks += (before.match(/await page.goto\('\/'\);/g) ?? []).length;
      expected =
        "import { landingNb } from '../../src/content/nb';\n" +
        before.replaceAll(
          "await page.goto('/');",
          "await page.goto('/');\n  await page.getByRole('link', { name: landingNb.az900Link, exact: true }).click();",
        );
    } else expected = before.replaceAll("goto('/')", "goto('/learn')");
    expect(readFileSync(path, 'utf8'), path).toBe(expected);
  }
  expect(changed).toBe(53);
  expect(realRootLinks).toBe(3);
});

it('changes exactly one import in two historical readers, retaining all their original assertions and proof artifacts', () => {
  for (const path of readers) {
    const rel = path.startsWith('src/') ? '../tests/' : './';
    expect(readFileSync(path, 'utf8')).toBe(
      pr61Original(path)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR61 as readFileSync } from '${rel}pr61-preservation';`,
        ),
    );
  }
});

it('changes only root bypass in AppShell and appends UI copy after the complete PR60 teaching prefix', () => {
  const path = 'src/components/app-shell.tsx';
  expect(readFileSync(path, 'utf8')).toBe(
    pr61Original(path).toString().replace('  if (\n', "  if (\n    pathname === '/' ||\n"),
  );
  const old = pr61Original('src/content/nb.ts'),
    current = readFileSync('src/content/nb.ts');
  expect(current.subarray(0, old.length).equals(old)).toBe(true);
  expect(current.subarray(old.length).toString()).toMatch(/^\s*export const landingNb/);
});

it('adds exactly one compact witness while preserving every previous selection and execution setting', () => {
  const source = readFileSync('playwright.desktop.config.ts', 'utf8');
  const extra =
    "  [\n    'premium-landing.spec.ts',\n    'landing responsive keyboard short desktop status semantics reduced motion and Axe preserve primary choices',\n  ],\n";
  expect(source.replace(extra, '')).toBe(pr61Original('playwright.desktop.config.ts').toString());
});

it('keeps all prior documentation bodies intact below the scoped new owner entry', () => {
  for (const path of notes) {
    assertPR61Delta(path);
    const before = pr61Original(path).toString(),
      current = readFileSync(path, 'utf8');
    const body = path === 'AGENTS.md' ? before : before.slice(before.indexOf('\n') + 1).trimStart();
    expect(current.endsWith(body), path).toBe(true);
    expect(current.slice(0, current.length - body.length), path).toContain('PR61');
  }
});
