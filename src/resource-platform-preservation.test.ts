import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/parallel-resource-platform/preservation.json';
import { boundHistoricalBytes } from '../tests/resource-platform-preservation';
const base = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
// Finite, independently reviewed owner-authorized integration exceptions.
const approved: string[] = [
  '.github/workflows/ci.yml',
  'AGENTS.md',
  'docs/DEVELOPMENT_WORKFLOW.md',
  'docs/RELEASE_ACCEPTANCE.md',
  'package.json',
  'scripts/quality-check.mjs',
  'scripts/quality-check.test.mjs',
  'src/pr72-ci-workflow.test.ts',
  'scripts/laboratory-db.mjs',
  'src/app/api/laboratory/ephemeral/route.ts',
  'src/content/portal-workspace-nb.ts',
  'src/features/laboratory/capabilities.ts',
  'src/features/laboratory/compute.tsx',
  'src/features/laboratory/endpoints.tsx',
  'src/features/laboratory/ephemeral-client.ts',
  'src/features/laboratory/firewall.tsx',
  'src/features/laboratory/laboratory.tsx',
  'src/features/laboratory/networking.tsx',
  'src/features/laboratory/portal-adapter.tsx',
  'src/features/laboratory/routing.tsx',
  'src/features/laboratory/rule-lifecycle.tsx',
  'src/features/laboratory/topology-target.ts',
  'src/features/laboratory/studio-model.ts',
  'src/features/laboratory/studio.tsx',
  'src/features/portal/service-catalog.ts',
  'src/features/portal/shared-shell.test.ts',
  'src/laboratory/engine.ts',
  'src/laboratory/v3/server.ts',
  'src/laboratory-compute.test.ts',
  'tests/e2e/ephemeral-actions.ts',
  'tests/e2e/laboratory-topology.spec.ts',
  'playwright.desktop.config.ts',
  'tests/pr72-preservation.ts',
  'src/pr72-shared-portal-preservation.test.ts',
];
const original = (path: string) => execFileSync('git', ['show', `${base}:${path}`]);
const rows = execFileSync('git', ['ls-tree', '-r', base], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((line) => {
    const [meta, path] = line.split('\t') as [string, string];
    return { path, hash: meta.split(' ')[2]! };
  })
  .filter((r) => r.path !== 'quality/releases/current.json');
const partition = (path: string) =>
  path.startsWith('public/')
    ? 'assets'
    : path.startsWith('docs/reviews/evidence/')
      ? 'locked evidence'
      : path.startsWith('docs/')
        ? 'documentation'
        : 'source and tests';
const partitions = ['assets', 'locked evidence', 'documentation', 'source and tests'].map(
  (name) => ({ name, rows: rows.filter((r) => partition(r.path) === name) }),
);
const hash = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
it('pins the exact verified base, finite authorized integration files and complete partition union', () => {
  expect(proof.base).toBe(base);
  expect(Object.keys(proof.files).sort()).toEqual([...approved].sort());
  const covered = partitions.flatMap((p) => p.rows.map((r) => r.path));
  expect(covered.sort()).toEqual(rows.map((r) => r.path).sort());
  expect(new Set(covered).size).toBe(rows.length);
  for (const [path, binding] of Object.entries(proof.files) as [
    string,
    { before: string; after: string },
  ][]) {
    expect(binding.before, path).toBe(rows.find((r) => r.path === path)?.hash);
    expect(/^[a-f0-9]{40}$/.test(binding.after), path).toBe(true);
  }
});
it.each(partitions)(
  'checks actual raw current bytes for every inherited $name path',
  ({ rows }) => {
    const hashes = execFileSync(
      'git',
      ['hash-object', '--no-filters', '--', ...rows.map((r) => r.path)],
      { encoding: 'utf8' },
    )
      .trim()
      .split('\n');
    expect(hashes).toHaveLength(rows.length);
    for (const [i, row] of rows.entries()) {
      const binding = (proof.files as Record<string, { before: string; after: string }>)[row.path];
      expect(hashes[i], row.path).toBe(binding?.after ?? row.hash);
    }
  },
);
it('binds every added executable, contract, fixture and screenshot to its actual raw bytes', () => {
  for (const [path, expected] of Object.entries(proof.added))
    expect(hash(readFileSync(path)), path).toBe(expected);
});
it('preserves every PR72 historical assertion with exact test-only import changes', () => {
  expect(readFileSync('tests/pr72-preservation.ts', 'utf8')).toBe(
    original('tests/pr72-preservation.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readPlatformHistory as readFileSync } from './resource-platform-preservation';",
      ),
  );
  expect(readFileSync('src/pr72-shared-portal-preservation.test.ts', 'utf8')).toBe(
    original('src/pr72-shared-portal-preservation.test.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readPlatformHistory as readFileSync } from '../tests/resource-platform-preservation';",
      )
      .replace(
        "import { execFileSync } from 'node:child_process';",
        "import { execPlatformHistory as execFileSync } from '../tests/resource-platform-preservation';",
      ),
  );
});
it('rejects changed current bytes and wrong preimages rather than laundering a historical fixture', () => {
  const a = Buffer.from('actual-current'),
    b = Buffer.from('actual-base');
  const binding = { before: hash(b), after: hash(a) };
  expect(boundHistoricalBytes(a, b, binding)).toBe(b);
  expect(() => boundHistoricalBytes(Buffer.from('tampered'), b, binding)).toThrow(
    'unapproved current bytes',
  );
  expect(() => boundHistoricalBytes(a, Buffer.from('wrong-base'), binding)).toThrow(
    'unapproved base bytes',
  );
});

it('covers all actual added files outside the mutable report and its own binding manifest', () => {
  const actual = new Set(
    [
      ...execFileSync('git', ['diff', '--diff-filter=A', '--name-only', '-z', base], {
        encoding: 'utf8',
      }).split('\0'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {
        encoding: 'utf8',
      }).split('\0'),
    ].filter(Boolean),
  );
  const covered = [...actual]
    .filter(
      (p) =>
        p !== 'docs/reviews/evidence/parallel-resource-platform/preservation.json' &&
        !(p.startsWith('docs/quality/') && p.endsWith('.md')),
    )
    .sort();
  expect(Object.keys(proof.added).sort()).toEqual(covered);
  expect(covered.length).toBeGreaterThan(10);
});

it('retains exact historical workspace and model assertions while explicitly choosing their original evaluator', () => {
  const tuple =
    "  [\n    'application-platform.spec.ts',\n    'application compact native keyboard focus reduced motion Axe and short desktop keep Review and Properties readable',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(tuple, '')).toBe(
    original('playwright.desktop.config.ts').toString(),
  );
  expect(readFileSync('src/laboratory-compute.test.ts', 'utf8')).toBe(
    original('src/laboratory-compute.test.ts')
      .toString()
      .replace(
        "      'laboratory@3.7.0',\n",
        "      'laboratory@3.7.0',\n      'laboratory@3.8.0',\n",
      ),
  );
  const choice =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.7.0');\n";
  expect(
    readFileSync('tests/e2e/ephemeral-actions.ts', 'utf8').replace(
      '  // These inherited journeys intentionally replay the original3.7 workspace.\n' + choice,
      '',
    ),
  ).toBe(original('tests/e2e/ephemeral-actions.ts').toString());
  expect(
    readFileSync('tests/e2e/laboratory-topology.spec.ts', 'utf8').replace(
      '  // This inherited fixture remains explicitly bound to its original3.7 evaluator.\n' +
        choice,
      '',
    ),
  ).toBe(original('tests/e2e/laboratory-topology.spec.ts').toString());
});

it('retains the complete historical serial workflow assertions with only a bounded read adapter', () => {
  expect(readFileSync('src/pr72-ci-workflow.test.ts', 'utf8')).toBe(
    original('src/pr72-ci-workflow.test.ts')
      .toString()
      .replace(
        "import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';",
        "import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';\nimport { readPlatformHistory as readFileSync } from '../tests/resource-platform-preservation';",
      ),
  );
  for (const path of ['AGENTS.md', 'docs/DEVELOPMENT_WORKFLOW.md', 'docs/RELEASE_ACCEPTANCE.md'])
    expect(readFileSync(path, 'utf8').endsWith(original(path).toString()), path).toBe(true);
  expect(readFileSync('playwright.config.ts', 'utf8')).toBe(
    original('playwright.config.ts').toString(),
  );
  expect(readFileSync('scripts/verify-desktop-ci.mjs', 'utf8')).toBe(
    original('scripts/verify-desktop-ci.mjs').toString(),
  );
});
