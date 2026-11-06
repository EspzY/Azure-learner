import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pr62Base, pr62Original } from '../tests/pr62-preservation';
import proof from '../docs/reviews/evidence/pr62/preservation.json';
const changes = [
  'docs/PORTAL_CAPABILITY_MATRIX.md',
  'playwright.desktop.config.ts',
  'scripts/laboratory-db.mjs',
  'src/features/laboratory/laboratory.css',
  'src/features/laboratory/laboratory.tsx',
  'src/laboratory/v3/repository.ts',
  'src/laboratory/v3/server.ts',
  'src/features/landing/preservation.test.ts',
  'tests/pr61-preservation.ts',
];
it('bounds the new version adapter and preserves every other original runtime teaching assessment asset database and locked review byte', () => {
  expect(Object.keys(proof.files).sort()).toEqual(changes.sort());
  const rows = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr62Base,
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
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(rows.length).toBeGreaterThan(900);
  for (const line of rows) {
    const [meta, path] = line.split('\t') as [string, string],
      bytes = readFileSync(path);
    if (changes.includes(path)) {
      const e = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(createHash('sha256').update(pr62Original(path)).digest('hex')).toBe(e.before);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(e.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('retains every previous preservation assertion through exactly two import-only delegations', () => {
  for (const [path, prefix] of [
    ['tests/pr61-preservation.ts', './'],
    ['src/features/landing/preservation.test.ts', '../../../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      pr62Original(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR62 as readFileSync } from '${prefix}pr62-preservation';`,
        ),
    );
});
it('only adds one compact witness and appends the explicit002 migration to original local-only setup', () => {
  const extra =
    "  [\n    'laboratory-networking.spec.ts',\n    'network Laboratory short desktop keyboard focus reduced motion Axe resource forms and reset keep historical receipts accessible',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(extra, '')).toBe(
    pr62Original('playwright.desktop.config.ts').toString(),
  );
  expect(readFileSync('scripts/laboratory-db.mjs', 'utf8')).toBe(
    pr62Original('scripts/laboratory-db.mjs')
      .toString()
      .replace(
        "await client.query(readFileSync('database/laboratory-v3/001.sql', 'utf8'));",
        "for (const migration of ['001.sql', '002-networking.sql'])\n        await client.query(readFileSync('database/laboratory-v3/' + migration, 'utf8'));",
      ),
  );
});

it('keeps the complete historical Portal capability matrix below the scoped free-Laboratory addition', () => {
  const before = pr62Original('docs/PORTAL_CAPABILITY_MATRIX.md').toString();
  const body = before.slice(before.indexOf('\n') + 1).trimStart();
  const current = readFileSync('docs/PORTAL_CAPABILITY_MATRIX.md', 'utf8');
  expect(current.endsWith(body)).toBe(true);
  expect(current.slice(0, current.length - body.length)).toContain('PR62');
});
