import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pr72Base, original72 } from '../tests/pr72-preservation';
import proof from '../docs/reviews/evidence/pr72/preservation.json';
const approved = [
  '.github/workflows/ci.yml',
  'docs/DEVELOPMENT_WORKFLOW.md',
  'AGENTS.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
  'docs/PORTAL_CAPABILITY_MATRIX.md',
  'docs/PROJECT_STATUS.md',
  'playwright.desktop.config.ts',
  'src/features/portal/portal.tsx',
  'src/features/portal/presentation.css',
  'src/features/laboratory/laboratory.tsx',
  'tests/pr71-preservation.ts',
  'src/laboratory-pr71-preservation.test.ts',
];
const rows = execFileSync('git', ['ls-tree', '-r', pr72Base], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((line) => {
    const [meta, path] = line.split('\t') as [string, string];
    return { path, before: meta.split(' ')[2]! };
  })
  .filter((r) => r.path !== 'quality/releases/current.json');
const partitions = [
  {
    name: 'technical, course, tests and build authorities',
    rows: rows.filter((r) => !r.path.startsWith('docs/') && !r.path.startsWith('public/')),
  },
  {
    name: 'public assets and source/quality documentation',
    rows: rows.filter(
      (r) =>
        r.path.startsWith('public/') ||
        (r.path.startsWith('docs/') &&
          !r.path.startsWith('docs/screenshots/') &&
          !r.path.startsWith('docs/reviews/evidence/')),
    ),
  },
  {
    name: 'original desktop screenshots',
    rows: rows.filter((r) => r.path.startsWith('docs/screenshots/')),
  },
  {
    name: 'locked historical review evidence',
    rows: rows.filter((r) => r.path.startsWith('docs/reviews/evidence/')),
  },
];
function actualBlobs(paths: string[]) {
  // Read-only native raw hashing: no object writes, index/stat shortcut or filters.
  const hashes = execFileSync('git', ['hash-object', '--no-filters', '--', ...paths], {
    encoding: 'utf8',
  })
    .trim()
    .split('\n');
  expect(hashes).toHaveLength(paths.length);
  return hashes;
}
it('pins the finite exceptions and proves every actual PR71 path is covered exactly once', () => {
  expect(proof.base).toBe(pr72Base);
  expect(Object.keys(proof.files).sort()).toEqual(approved.sort());
  const covered = partitions.flatMap((p) => p.rows.map((r) => r.path));
  expect(covered.sort()).toEqual(rows.map((r) => r.path).sort());
  expect(new Set(covered).size).toBe(rows.length);
  for (const [path, row] of Object.entries(proof.files))
    expect(row.before, path).toBe(rows.find((r) => r.path === path)?.before);
});
it.each(partitions)('preserves every raw PR71 blob in $name', ({ rows: group }) => {
  expect(group.length).toBeGreaterThan(0);
  const hashes = actualBlobs(group.map((r) => r.path));
  for (const [i, row] of group.entries()) {
    const binding = (proof.files as Record<string, { before: string; after: string }>)[row.path];
    expect(hashes[i], row.path).toBe(binding?.after ?? row.before);
  }
});
it('verifies every declared new presentation, contract and evidence file against its actual raw bytes', () => {
  const entries = Object.entries(proof.added),
    hashes = actualBlobs(entries.map(([path]) => path));
  for (const [i, [path, sha]] of entries.entries()) expect(hashes[i], path).toBe(sha);
});
it('preserves every inherited assertion body; only import aliases and one explicit compact witness are added', () => {
  expect(readFileSync('tests/pr71-preservation.ts', 'utf8')).toBe(
    original72('tests/pr71-preservation.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readPR72 as readFileSync } from './pr72-preservation';",
      ),
  );
  expect(readFileSync('src/laboratory-pr71-preservation.test.ts', 'utf8')).toBe(
    original72('src/laboratory-pr71-preservation.test.ts')
      .toString()
      .replace(
        "import { readFileSync, existsSync } from 'node:fs';",
        "import { existsSync } from 'node:fs';\nimport { readPR72 as readFileSync } from '../tests/pr72-preservation';",
      ),
  );
  const tuple =
    "  [\n    'portal-consolidation.spec.ts',\n    'shared Home subscriptions compact keyboard focus reduced motion Axe and short desktop stay readable in both modes',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(tuple, '')).toBe(
    original72('playwright.desktop.config.ts').toString(),
  );
});
const between = (source: string, start: string, end: string) =>
  source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
it('keeps the actual course navigation/teaching authorization and Laboratory transport/transaction controllers, with only explicit default/scope presentation selection', () => {
  const path = 'src/features/portal/portal.tsx';
  expect(between(readFileSync(path, 'utf8'), '  const navigate: Navigate', '  const edit =')).toBe(
    between(original72(path).toString(), '  const navigate: Navigate', '  const edit ='),
  );
  const lab = 'src/features/laboratory/laboratory.tsx';
  const actual = between(readFileSync(lab, 'utf8'), 'async function api(', '  const resource =')
    .replace("view = query.get('view') ?? 'home'", "view = query.get('view') ?? 'groups'")
    .replace("subscriptionId: subscription?.id ?? 'sub-shared'", "subscriptionId: 'sub-shared'");
  expect(actual).toBe(
    between(original72(lab).toString(), 'async function api(', '  const resource ='),
  );
});
