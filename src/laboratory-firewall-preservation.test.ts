import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/pr67/preservation.json';
import golden from '../docs/reviews/evidence/pr67/frozen34-golden.json';
import { pr67Base, original67, hash67 } from '../tests/pr67-preservation';
import { replay } from './laboratory/engine';
it('preserves all original course authority, models3.0–3.4 SQL and locked evidence; pins finite reviewed3.5 adapters', () => {
  const allowed = [
    'AGENTS.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'docs/PROJECT_STATUS.md',
    'playwright.desktop.config.ts',
    'public/icons/manifest.json',
    'scripts/laboratory-db.mjs',
    'src/content/portal-workspace-nb.ts',
    'src/features/laboratory/compute.tsx',
    'src/features/laboratory/endpoints.tsx',
    'src/features/laboratory/laboratory.tsx',
    'src/features/laboratory/networking.tsx',
    'src/features/laboratory/portal-adapter.tsx',
    'src/features/laboratory/routing.tsx',
    'src/laboratory-compute-preservation.test.ts',
    'src/laboratory-compute.test.ts',
    'src/laboratory/engine.ts',
    'src/laboratory/v3/server.ts',
    'tests/e2e/architecture-management.spec.ts',
    'tests/e2e/laboratory-compute.spec.ts',
    'tests/pr66-preservation.ts',
  ];
  expect(Object.keys(proof.files).sort()).toEqual(allowed.sort());
  expect(proof.base).toBe(pr67Base);
  const paths = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr67Base,
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
      'AGENTS.md',
      'docs/reviews',
      'docs/quality',
      'docs/ARCHITECTURE.md',
      'docs/DECISIONS.md',
      'docs/PROJECT_STATUS.md',
      'docs/PORTAL_CAPABILITY_MATRIX.md',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(paths.length).toBeGreaterThan(1000);
  for (const line of paths) {
    const [meta, path] = line.split('\t') as [string, string];
    const bytes = readFileSync(path);
    if (Object.hasOwn(proof.files, path)) {
      const p = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(hash67(original67(path)), path).toBe(p.before);
      expect(hash67(bytes), path).toBe(p.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('retains exact inherited browser bodies and settings with only traced readiness and explicit historical fixture choice', () => {
  for (const [path, prefix] of [
    ['tests/pr66-preservation.ts', './'],
    ['src/laboratory-compute-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original67(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR67 as readFileSync } from '${prefix}pr67-preservation';`,
        ),
    );
  const fixture =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.4.0');\n";
  expect(readFileSync('tests/e2e/laboratory-compute.spec.ts', 'utf8')).toBe(
    original67('tests/e2e/laboratory-compute.spec.ts')
      .toString()
      .replace(
        "  await page.getByRole('button', { name: c.start, exact: true }).click();",
        fixture + "  await page.getByRole('button', { name: c.start, exact: true }).click();",
      ),
  );
  const extra =
    "  [\n    'laboratory-firewall.spec.ts',\n    'firewall compact native Policy Properties Review keyboard focus reduced motion Axe and short desktop keep real controls and evidence readable',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(extra, '')).toBe(
    original67('playwright.desktop.config.ts').toString(),
  );
  const originalGo =
    "async function go(page: Page, topic: ManagementTopic) {\n  const nav = page.locator('.course-architecture-nav');\n  const link = nav.getByRole('link', { name: b.topics[topic], exact: true });\n  if (!(await link.isVisible()))\n    await page.getByRole('button', { name: c.learning, exact: true }).click();\n  await link.click();\n  await expect(page.locator('.management-lesson > header h2')).toHaveText(b.topics[topic]);\n}\n";
  const correctedGo =
    "async function go(page: Page, topic: ManagementTopic) {\n  // A streamed, hidden server segment is not a closed compact menu.\n  await expect(page.locator('.course-layout:visible')).toBeVisible();\n  const nav = page.locator('.course-architecture-nav');\n  const link = nav.getByRole('link', { name: b.topics[topic], exact: true });\n  const toggle = page.getByRole('button', { name: c.learning, exact: true });\n  if ((await toggle.isVisible()) && !(await link.isVisible())) await toggle.click();\n  await link.click();\n  await expect(page.locator('.management-lesson > header h2')).toHaveText(b.topics[topic]);\n}\n";
  expect(readFileSync('tests/e2e/architecture-management.spec.ts', 'utf8')).toBe(
    original67('tests/e2e/architecture-management.spec.ts')
      .toString()
      .replace(originalGo, correctedGo),
  );
});
it('replays exact frozen3.4 unsupported Firewall receipt and VM bundle at every through boundary', () => {
  expect(replay(golden.entries as never, 'laboratory@3.4.0')).toEqual(golden.world);
  expect(golden.entries.at(-1)!.receipt).toMatchObject({
    outcome: 'unsupported',
    code: 'unsupported-capability',
    addedIds: [],
    beforeRevision: 4,
    afterRevision: 4,
  });
  for (let through = 0; through <= golden.entries.length; through++)
    expect(replay(golden.entries as never, 'laboratory@3.4.0', through)?.revision).toBe(
      through === 0 ? 0 : golden.entries[through - 1]!.receipt.afterRevision,
    );
  const bad = structuredClone(golden.entries);
  bad.at(-1)!.receipt.code = 'created' as never;
  expect(replay(bad as never, 'laboratory@3.4.0')).toBeNull();
});

it('extends only the exact model registry expectation while retaining all historical Compute assertions', () => {
  expect(readFileSync('src/laboratory-compute.test.ts', 'utf8')).toBe(
    original67('src/laboratory-compute.test.ts')
      .toString()
      .replace(
        "      'laboratory@3.4.0',\n    ]);",
        "      'laboratory@3.4.0',\n      'laboratory@3.5.0',\n    ]);",
      ),
  );
});
