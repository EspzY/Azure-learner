import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { hash65, original65, pr65Base } from '../tests/pr65-preservation';
import proof from '../docs/reviews/evidence/pr65/preservation.json';
import golden from '../docs/reviews/evidence/pr65/frozen32-golden.json';
import { replay } from './laboratory/engine';
it('pins bounded3.3 adapters while every other prior course model SQL assertion receipt and locked review remains byte identical to verified PR64', () => {
  expect(proof.base).toBe(pr65Base);
  expect(Object.keys(proof.files).sort()).toEqual(
    [
      'AGENTS.md',
      'docs/ARCHITECTURE.md',
      'docs/DECISIONS.md',
      'docs/PORTAL_CAPABILITY_MATRIX.md',
      'playwright.desktop.config.ts',
      'scripts/laboratory-db.mjs',
      'src/content/portal-workspace-nb.ts',
      'src/features/laboratory/laboratory.css',
      'src/features/laboratory/laboratory.tsx',
      'src/features/laboratory/networking.tsx',
      'src/features/laboratory/portal-adapter.tsx',
      'src/features/laboratory/routing.tsx',
      'src/laboratory-routing-preservation.test.ts',
      'src/laboratory/engine.ts',
      'src/laboratory/v3/server.ts',
      'tests/e2e/laboratory-routing.spec.ts',
      'tests/pr64-preservation.ts',
    ].sort(),
  );
  const paths = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr65Base,
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
  expect(paths.length).toBeGreaterThan(950);
  for (const line of paths) {
    const [meta, path] = line.split('\t') as [string, string],
      bytes = readFileSync(path);
    if (Object.hasOwn(proof.files, path)) {
      const p = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(hash65(original65(path)), path).toBe(p.before);
      expect(hash65(bytes), path).toBe(p.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('all inherited assertions settings and test bodies survive: only historical3.2 fixture and test-only read delegates change', () => {
  for (const [path, prefix] of [
    ['tests/pr64-preservation.ts', './'],
    ['src/laboratory-routing-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original65(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR65 as readFileSync } from '${prefix}pr65-preservation';`,
        ),
    );
  const expected = original65('tests/e2e/laboratory-routing.spec.ts')
    .toString()
    .replace(
      "  await page.getByRole('button', { name: c.start, exact: true }).click();",
      "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.2.0');\n  await page.getByRole('button', { name: c.start, exact: true }).click();",
    );
  expect(readFileSync('tests/e2e/laboratory-routing.spec.ts', 'utf8')).toBe(expected);
  const extra =
    "  [\n    'laboratory-endpoints.spec.ts',\n    'endpoint Laboratory compact native keyboard Properties policy focus reduced motion Axe original receipts and short-height controls remain usable',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(extra, '')).toBe(
    original65('playwright.desktop.config.ts').toString(),
  );
});
it('replays original3.2 unsupported NIC receipt and every historical through without registering new semantics', () => {
  expect(replay(golden.entries as never, 'laboratory@3.2.0')).toEqual(golden.world);
  const unsupported = golden.entries.find(
    (x) => x.request.command.type === 'CreateNetworkInterface',
  )!;
  expect(unsupported.receipt.code).toBe('unsupported-capability');
  for (let i = 0; i <= golden.entries.length; i++) {
    const world = replay(golden.entries as never, 'laboratory@3.2.0', i);
    expect(world).not.toBeNull();
    expect(world?.revision).toBe(i === 0 ? 0 : golden.entries[i - 1]!.receipt.afterRevision);
  }
  expect(replay(golden.entries as never, 'laboratory@3.3.0')).toBeNull();
});
