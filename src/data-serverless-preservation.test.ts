import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/data-serverless/preservation.json';
const base = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
const rows = execFileSync('git', ['ls-tree', '-r', base], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((line) => {
    const [meta, path] = line.split('\t') as [string, string];
    return { path, hash: meta.split(' ')[2]! };
  })
  .filter((r) => r.path !== 'quality/releases/current.json');
const category = (p: string) =>
  p.startsWith('public/')
    ? 'assets'
    : p.startsWith('docs/reviews/evidence/')
      ? 'locked evidence'
      : p.startsWith('docs/')
        ? 'documentation'
        : 'source and tests';
const partitions = ['assets', 'locked evidence', 'documentation', 'source and tests'].map(
  (name) => ({ name, rows: rows.filter((r) => category(r.path) === name) }),
);
it('pins the verified PR72 base and covers every inherited file exactly once', () => {
  expect(proof.base).toBe(base);
  const covered = partitions.flatMap((p) => p.rows.map((r) => r.path));
  expect(covered.sort()).toEqual(rows.map((r) => r.path).sort());
  expect(new Set(covered).size).toBe(rows.length);
});
it.each(partitions)('preserves all actual inherited $name bytes without exceptions', ({ rows }) => {
  const hashes = execFileSync(
    'git',
    ['hash-object', '--no-filters', '--', ...rows.map((r) => r.path)],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(hashes).toHaveLength(rows.length);
  for (const [i, r] of rows.entries()) expect(hashes[i], r.path).toBe(r.hash);
});
it('binds each new module test contract and evidence file to its actual bytes', () => {
  for (const [path, expected] of Object.entries(proof.added)) {
    const bytes = readFileSync(path);
    expect(
      createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
      path,
    ).toBe(expected);
  }
});

it('covers all actual added files and permits no unregistered runtime or controller path', () => {
  const added = new Set(
    [
      ...execFileSync('git', ['diff', '--diff-filter=A', '--name-only', '-z', base], {
        encoding: 'utf8',
      }).split('\0'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {
        encoding: 'utf8',
      }).split('\0'),
    ].filter(Boolean),
  );
  const covered = [...added]
    .filter(
      (p) =>
        p !== 'docs/reviews/evidence/data-serverless/preservation.json' &&
        !(p.startsWith('docs/quality/') && p.endsWith('.md')),
    )
    .sort();
  expect(Object.keys(proof.added).sort()).toEqual(covered);
  expect(covered.length).toBeGreaterThan(4);
  for (const path of covered)
    expect(
      path.startsWith('src/laboratory/data/') ||
        path === 'src/data-serverless-preservation.test.ts' ||
        path.startsWith('docs/'),
      path,
    ).toBe(true);
});
