import { expect, it } from 'vitest';
import { readPR65 as readFileSync } from '../tests/pr65-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/pr64/preservation.json';
import { pr64Base, pr64Hash, pr64Original } from '../tests/pr64-preservation';
it('pins the explicit3.2 dispatcher API free-presentation and test-fixture boundary while freezing every other prior course, model, database and locked review byte', () => {
  const changed = Object.keys(proof.files);
  const expected = [
    'AGENTS.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'playwright.desktop.config.ts',
    'public/icons/manifest.json',
    'scripts/laboratory-db.mjs',
    'src/content/portal-workspace-nb.ts',
    'src/features/laboratory/laboratory.css',
    'src/features/laboratory/laboratory.tsx',
    'src/features/laboratory/networking.tsx',
    'src/features/laboratory/portal-adapter.tsx',
    'src/laboratory/engine.ts',
    'src/laboratory/v3/server.ts',
    'src/shared-portal-preservation.test.ts',
    'tests/e2e/laboratory-networking.spec.ts',
    'tests/pr63-preservation.ts',
  ];
  expect(changed.sort()).toEqual(expected.sort());
  const rows = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr64Base,
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
      'docs/PORTAL_CAPABILITY_MATRIX.md',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(rows.length).toBeGreaterThan(950);
  for (const row of rows) {
    const [metadata, path] = row.split('\t') as [string, string];
    const bytes = readFileSync(path);
    if (changed.includes(path)) {
      const p = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(pr64Hash(pr64Original(path)), path).toBe(p.before);
      expect(pr64Hash(bytes), path).toBe(p.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(metadata.split(' ')[2]);
  }
});
it('preserves every old assertion and setting; only selects the actual historical3.1 workspace fixture and delegates two historical readers', () => {
  for (const [path, prefix] of [
    ['tests/pr63-preservation.ts', './'],
    ['src/shared-portal-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      pr64Original(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR64 as readFileSync } from '${prefix}pr64-preservation';`,
        ),
    );
  const extra =
    "  [\n    'laboratory-routing.spec.ts',\n    'routing Laboratory compact native analysis keyboard reduced motion Axe properties review and original receipts stay accessible',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(extra, '')).toBe(
    pr64Original('playwright.desktop.config.ts').toString(),
  );
  const fixture =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption(model);\n";
  expect(readFileSync('tests/e2e/laboratory-networking.spec.ts', 'utf8').replace(fixture, '')).toBe(
    pr64Original('tests/e2e/laboratory-networking.spec.ts').toString(),
  );
});
it('adds migration003 without changing local setup safety, or any original registry entry, alias or source artwork', () => {
  const setup = 'scripts/laboratory-db.mjs';
  expect(readFileSync(setup, 'utf8')).toBe(
    pr64Original(setup)
      .toString()
      .replace(
        "['001.sql', '002-networking.sql']",
        "['001.sql', '002-networking.sql', '003-routing.sql']",
      ),
  );
  const path = 'public/icons/manifest.json',
    before = JSON.parse(pr64Original(path).toString()),
    after = JSON.parse(readFileSync(path, 'utf8'));
  for (const [key, value] of Object.entries(before.assets))
    expect(after.assets[key]).toEqual(value);
  expect(after.aliases).toEqual(before.aliases);
  expect(after.azure).toEqual(before.azure);
  expect(after.licenses).toEqual(before.licenses);
  expect(
    Object.keys(after.assets)
      .filter((k) => !before.assets[k])
      .sort(),
  ).toEqual(['peering', 'routeTable']);
  for (const key of ['peering', 'routeTable']) {
    const a = after.assets[key];
    expect(a.family).toBe('azure');
    expect(a.result).toBe('UNVERIFIED');
    expect(pr64Hash(readFileSync('public/icons/' + a.file))).toBe(a.sha256);
  }
});
