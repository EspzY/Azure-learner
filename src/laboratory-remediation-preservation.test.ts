import { it, expect } from 'vitest';
import { readPR70 as readFileSync } from '../tests/pr70-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pr69Base, hash69, original69 } from '../tests/pr69-preservation';
import proof from '../docs/reviews/evidence/pr69/preservation.json';

it('preserves actual old engines SQL assessments fixtures course authorities and locked PR68 evidence with finite reviewed adapters only', () => {
  const allowed = [
    'AGENTS.md',
    'scripts/laboratory-db.mjs',
    'src/features/laboratory/compute.tsx',
    'src/features/laboratory/endpoints.tsx',
    'src/features/laboratory/firewall.tsx',
    'src/features/laboratory/laboratory.tsx',
    'src/features/laboratory/networking.tsx',
    'src/features/laboratory/portal-adapter.tsx',
    'src/features/laboratory/routing.tsx',
    'src/features/laboratory/studio-model.ts',
    'src/laboratory-compute.test.ts',
    'src/laboratory/engine.ts',
    'src/laboratory/v3/server.ts',
    'tests/e2e/laboratory-firewall.spec.ts',
    'tests/e2e/laboratory-studio.spec.ts',
    'tests/pr68-preservation.ts',
    'src/laboratory-studio-preservation.test.ts',
    'playwright.desktop.config.ts',
    'docs/LABORATORY_REMEDIATION_CAPABILITIES.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'docs/LABORATORY_V3_SERVER.md',
    'docs/PROJECT_STATUS.md',
  ];
  expect(Object.keys(proof.files).sort()).toEqual(allowed.sort());
  expect(proof.base).toBe(pr69Base);
  const paths = execFileSync('git', ['ls-tree', '-r', pr69Base], { encoding: 'utf8' })
    .trim()
    .split('\n');
  expect(paths.length).toBeGreaterThan(2300);
  for (const line of paths) {
    const [meta, path] = line.split('\t') as [string, string];
    if (path === 'quality/releases/current.json') continue;
    const bytes = readFileSync(path);
    if (Object.hasOwn(proof.files, path)) {
      const row = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(hash69(bytes), path).toBe(row.after);
      expect(hash69(original69(path)), path).toBe(row.before);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('retains all441 browser witnesses and substantive assertions with only explicit historical model selection and one new compact witness', () => {
  const added =
    "  [\n    'laboratory-remediation.spec.ts',\n    'remediation compact native Review keyboard focus reduced motion Axe pinned delete and short desktop preserve readable rule evidence',\n  ],\n";
  const config = readFileSync('playwright.desktop.config.ts', 'utf8');
  expect(config.includes(added)).toBe(true);
  expect(config.replace(added, '')).toBe(original69('playwright.desktop.config.ts').toString());
  const choice =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.5.0');\n";
  for (const path of [
    'tests/e2e/laboratory-firewall.spec.ts',
    'tests/e2e/laboratory-studio.spec.ts',
  ]) {
    const now = readFileSync(path, 'utf8');
    expect(now.includes(choice)).toBe(true);
    expect(now.replace(choice, '')).toBe(original69(path).toString());
  }
});
it('changes inherited preservation readers by imports only and extends only the current registry expectation', () => {
  for (const [path, prefix] of [
    ['tests/pr68-preservation.ts', './'],
    ['src/laboratory-studio-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original69(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR69 as readFileSync } from '${prefix}pr69-preservation';`,
        ),
    );
  expect(readFileSync('src/laboratory-compute.test.ts', 'utf8')).toBe(
    original69('src/laboratory-compute.test.ts')
      .toString()
      .replace("      'laboratory@3.5.0',", "      'laboratory@3.5.0',\n      'laboratory@3.6.0',"),
  );
});
