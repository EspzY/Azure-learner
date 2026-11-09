import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pr72Base, blobHash72, original72 } from '../tests/pr72-preservation';
import proof from '../docs/reviews/evidence/pr72/preservation.json';
const approved = [
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
it('compares every actual PR71 blob and every locked old proof, with only finite approved presentation/docs/import bindings', () => {
  expect(proof.base).toBe(pr72Base);
  expect(Object.keys(proof.files).sort()).toEqual(approved.sort());
  const entries = execFileSync('git', ['ls-tree', '-r', pr72Base], { encoding: 'utf8' })
    .trim()
    .split('\n');
  for (const line of entries) {
    const [meta, path] = line.split('\t') as [string, string];
    if (path === 'quality/releases/current.json') continue;
    const actual = blobHash72(readFileSync(path)),
      row = (proof.files as Record<string, { before: string; after: string }>)[path];
    if (row) {
      expect(row.before, path).toBe(meta.split(' ')[2]);
      expect(actual, path).toBe(row.after);
    } else expect(actual, path).toBe(meta.split(' ')[2]);
  }
  for (const [path, sha] of Object.entries(proof.added))
    expect(blobHash72(readFileSync(path)), path).toBe(sha);
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
