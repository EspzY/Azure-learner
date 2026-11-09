import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../../../docs/reviews/evidence/bifrost-foundation/preservation.json';
import { boundHistoricalBytes } from '../../../tests/bifrost-foundation-preservation';
const base = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
const approved = [
  'src/app/layout.tsx',
  'src/features/landing/landing.tsx',
  'src/features/landing/landing.css',
  'tests/e2e/premium-landing.spec.ts',
  'tests/pr72-preservation.ts',
  'src/pr72-shared-portal-preservation.test.ts',
  '.github/workflows/ci.yml',
  'package.json',
  'scripts/quality-check.mjs',
  'scripts/quality-check.test.mjs',
  'src/pr72-ci-workflow.test.ts',
];
const rows = execFileSync('git', ['ls-tree', '-r', base], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((row) => {
    const [meta, path] = row.split('\t') as [string, string];
    return { path, hash: meta.split(' ')[2]! };
  })
  .filter((row) => row.path !== 'quality/releases/current.json');
const parts = ['assets', 'locked evidence', 'documentation', 'source/config/tests'].map((name) => ({
  name,
  rows: rows.filter(
    ({ path }) =>
      (path.startsWith('public/')
        ? 'assets'
        : path.startsWith('docs/reviews/evidence/')
          ? 'locked evidence'
          : path.startsWith('docs/')
            ? 'documentation'
            : 'source/config/tests') === name,
  ),
}));
const original = (path: string) => execFileSync('git', ['show', `${base}:${path}`]);
const bindings: Record<string, { before: string; after: string }> = proof.files;
const actual = (paths: string[]) =>
  execFileSync('git', ['hash-object', '--no-filters', '--', ...paths], { encoding: 'utf8' })
    .trim()
    .split('\n');
it('pins the exact verified base, finite authorized design deltas and whole inherited partition', () => {
  expect(proof.base).toBe(base);
  expect(Object.keys(bindings).sort()).toEqual([...approved].sort());
  const covered = parts.flatMap((part) => part.rows.map((row) => row.path));
  expect(covered.sort()).toEqual(rows.map((row) => row.path).sort());
  expect(new Set(covered).size).toBe(rows.length);
  for (const [path, row] of Object.entries(bindings))
    expect(row.before, path).toBe(rows.find((r) => r.path === path)?.hash);
});
it.each(parts)(
  'verifies actual raw inherited $name bytes rather than historical adapter output',
  ({ rows }) => {
    const hashes = actual(rows.map((row) => row.path));
    expect(hashes).toHaveLength(rows.length);
    for (const [i, row] of rows.entries())
      expect(hashes[i], row.path).toBe(bindings[row.path]?.after ?? row.hash);
  },
);
it('binds every new design asset implementation and evidence file to actual raw bytes', () => {
  const entries = Object.entries(proof.added),
    hashes = actual(entries.map(([path]) => path));
  expect(entries.length).toBeGreaterThan(8);
  for (const [i, [path, hash]] of entries.entries()) expect(hashes[i], path).toBe(hash);
  const additions = [
    ...new Set([
      ...execFileSync('git', ['diff', '--name-only', base], { encoding: 'utf8' })
        .trim()
        .split('\n'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' })
        .trim()
        .split('\n'),
    ]),
  ]
    .filter(
      (path) =>
        path &&
        !rows.some((row) => row.path === path) &&
        path !== 'quality/releases/current.json' &&
        path !== 'docs/reviews/evidence/bifrost-foundation/preservation.json' &&
        !(path.startsWith('docs/quality/') && path.endsWith('.md')),
    )
    .sort();
  expect(Object.keys(proof.added).sort()).toEqual(additions);
});
it('rejects altered current or original bytes before giving old assertions their verified historical view', () => {
  const bytes = Buffer.from('immutable original'),
    changed = Buffer.from('current approved');
  const hash = (b: Buffer) =>
    createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
  const binding = { before: hash(bytes), after: hash(changed) };
  expect(boundHistoricalBytes(changed, bytes, binding)).toEqual(bytes);
  expect(() => boundHistoricalBytes(Buffer.from('tampered'), bytes, binding)).toThrow();
  expect(() => boundHistoricalBytes(changed, Buffer.from('wrong past'), binding)).toThrow();
});
it('retains every original PR72 preservation assertion; only bounded read imports change', () => {
  expect(readFileSync('tests/pr72-preservation.ts', 'utf8')).toBe(
    original('tests/pr72-preservation.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readBifrostFoundation as readFileSync } from './bifrost-foundation-preservation';",
      ),
  );
  expect(readFileSync('src/pr72-shared-portal-preservation.test.ts', 'utf8')).toBe(
    original('src/pr72-shared-portal-preservation.test.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readBifrostFoundation as readFileSync } from '../tests/bifrost-foundation-preservation';",
      )
      .replace(
        "import { execFileSync } from 'node:child_process';",
        "import { execBifrostFoundation as execFileSync } from '../tests/bifrost-foundation-preservation';",
      ),
  );
});

it('changes only the isolated historical badge fixture scope and retains every original browser assertion', () => {
  const path = 'tests/e2e/premium-landing.spec.ts';
  expect(readFileSync(path, 'utf8')).toBe(
    original(path)
      .toString()
      .replace('class="azurelab-landing"', 'class="azurelab-landing bifrost-learning"'),
  );
});

it('retains every historical serial-CI assertion body through its finite bounded read import', () => {
  const path = 'src/pr72-ci-workflow.test.ts';
  expect(readFileSync(path, 'utf8')).toBe(
    original(path)
      .toString()
      .replace(
        "import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';",
        "import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';\nimport { readBifrostFoundation as readFileSync } from '../tests/bifrost-foundation-preservation';",
      ),
  );
});
