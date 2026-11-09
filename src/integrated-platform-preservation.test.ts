import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/integrated-application-chain/preservation.json';
import provenance from '../docs/reviews/evidence/integrated-application-chain/module-provenance.json';
import { integrationBase } from '../tests/integrated-platform-preservation';
import { boundHistoricalBytes, platformBlobHash } from '../tests/resource-platform-preservation';
const approved = [
  'docs/PORTAL_CAPABILITY_MATRIX.md',
  'docs/LABORATORY_REMEDIATION_CAPABILITIES.md',
  'docs/ASSET_REGISTER.md',
  'public/icons/manifest.json',
  'src/features/portal/shared-shell.test.ts',
  'scripts/laboratory-db.mjs',
  'src/app/api/laboratory/ephemeral/route.ts',
  'src/content/portal-workspace-nb.ts',
  'src/features/laboratory/application.tsx',
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
  'src/features/portal/service-catalog.ts',
  'src/laboratory/engine.ts',
  'src/laboratory/v3/server.ts',
  'src/laboratory-compute.test.ts',
  'src/resource-platform-preservation.test.ts',
  'tests/resource-platform-preservation.ts',
  'tests/e2e/application-platform.spec.ts',
  'playwright.desktop.config.ts',
];
const original = (path: string) => execFileSync('git', ['show', integrationBase + ':' + path]);
const rows = execFileSync('git', ['ls-tree', '-r', integrationBase], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((line) => {
    const [meta, path] = line.split('\t') as [string, string];
    return { path, hash: meta.split(' ')[2]! };
  })
  .filter((row) => row.path !== 'quality/releases/current.json');
const partition = (path: string) =>
  path.startsWith('public/')
    ? 'assets'
    : path.startsWith('docs/reviews/evidence/')
      ? 'locked evidence'
      : path.startsWith('docs/')
        ? 'documentation'
        : 'source and tests';
const partitions = ['assets', 'locked evidence', 'documentation', 'source and tests'].map(
  (name) => ({ name, rows: rows.filter((row) => partition(row.path) === name) }),
);
it('pins the full PR75 source base and finite owner-authorized successor boundary', () => {
  expect(proof.base).toBe(integrationBase);
  expect(Object.keys(proof.files).sort()).toEqual([...approved].sort());
  expect(partitions.flatMap((part) => part.rows.map((row) => row.path)).sort()).toEqual(
    rows.map((row) => row.path).sort(),
  );
  for (const [path, binding] of Object.entries(proof.files) as [
    string,
    { before: string; after: string },
  ][])
    expect(binding.before, path).toBe(rows.find((row) => row.path === path)?.hash);
});
it.each(partitions)('checks actual raw current bytes for every PR75 $name path', ({ rows }) => {
  const hashes = execFileSync(
    'git',
    ['hash-object', '--no-filters', '--', ...rows.map((row) => row.path)],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(hashes).toHaveLength(rows.length);
  for (const [index, row] of rows.entries())
    expect(hashes[index], row.path).toBe(
      (proof.files as Record<string, { after: string }>)[row.path]?.after ?? row.hash,
    );
});
it('binds every actual added file and exact reused module byte without admitting the mutable report', () => {
  const actual = new Set(
    [
      ...execFileSync('git', ['diff', '--diff-filter=A', '--name-only', '-z', integrationBase], {
        encoding: 'utf8',
      }).split('\0'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {
        encoding: 'utf8',
      }).split('\0'),
    ].filter(Boolean),
  );
  const covered = [...actual]
    .filter(
      (path) =>
        path !== 'docs/reviews/evidence/integrated-application-chain/preservation.json' &&
        !(path.startsWith('docs/quality/') && path.endsWith('.md')),
    )
    .sort();
  expect(Object.keys(proof.added).sort()).toEqual(covered);
  for (const [path, expected] of Object.entries(proof.added))
    expect(platformBlobHash(readFileSync(path)), path).toBe(expected);
  for (const file of provenance.files) {
    const bytes = readFileSync(file.path);
    expect(createHash('sha256').update(bytes).digest('hex'), file.path).toBe(file.sha256);
    expect(bytes, file.path).toEqual(
      execFileSync('git', ['show', file.sourceCommit + ':' + file.path]),
    );
  }
});
it('preserves the original PR75 guard bodies through import-only bounded historical readers', () => {
  const currentPointer =
    '## Current integrated Laboratory3.9 —9 November2026\n\nSee the current [operation-by-operation Laboratory3.9 matrix](LABORATORY_INTEGRATED_CAPABILITIES.md) for the explicit integrated successor. The complete historical body below keeps its original model scope and is not an assertion that newer models are create-only.\n\n';
  for (const path of [
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'docs/LABORATORY_REMEDIATION_CAPABILITIES.md',
  ])
    expect(readFileSync(path)).toEqual(
      Buffer.concat([Buffer.from(currentPointer), original(path)]),
    );
  const assetPointer =
    '## Laboratory3.9 official service-family continuation —9 November2026\n\nSeven additional unmodified Microsoft V24 service-family SVGs now identify the integrated Front Door, WAF, Application Gateway, PostgreSQL, SQL and Functions resources through the existing central registry. The same pinned archive and original terms are reused; child families, FC1 and local configuration glyphs are explicitly mapped. See [exact source/license/hash provenance and limits](LABORATORY_INTEGRATED_ICONS.md). The complete historical register below remains unchanged.\n\n';
  expect(readFileSync('docs/ASSET_REGISTER.md')).toEqual(
    Buffer.concat([Buffer.from(assetPointer), original('docs/ASSET_REGISTER.md')]),
  );
  expect(readFileSync('src/features/portal/shared-shell.test.ts', 'utf8')).toBe(
    original('src/features/portal/shared-shell.test.ts')
      .toString()
      .replace(
        "if (model === 'laboratory@3.8.0')",
        "if (model === 'laboratory@3.8.0' || model === 'laboratory@3.9.0')",
      ),
  );
  expect(readFileSync('src/resource-platform-preservation.test.ts', 'utf8')).toBe(
    original('src/resource-platform-preservation.test.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readIntegratedHistory as readFileSync } from '../tests/integrated-platform-preservation';",
      )
      .replace(
        "import { execFileSync } from 'node:child_process';",
        "import { execIntegratedHistory as execFileSync } from '../tests/integrated-platform-preservation';",
      ),
  );
  expect(readFileSync('tests/resource-platform-preservation.ts', 'utf8')).toBe(
    original('tests/resource-platform-preservation.ts')
      .toString()
      .replace(
        "import { readFileSync } from 'node:fs';",
        "import { readIntegratedHistory as readFileSync } from './integrated-platform-preservation';",
      ),
  );
  expect(readFileSync('src/laboratory-compute.test.ts', 'utf8')).toBe(
    original('src/laboratory-compute.test.ts')
      .toString()
      .replace(
        "      'laboratory@3.8.0',\n",
        "      'laboratory@3.8.0',\n      'laboratory@3.9.0',\n",
      ),
  );
  const choice =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.8.0');\n";
  const current = readFileSync('tests/e2e/application-platform.spec.ts', 'utf8');
  expect(current.split(choice)).toHaveLength(3);
  expect(current.replaceAll(choice, '')).toBe(
    original('tests/e2e/application-platform.spec.ts').toString(),
  );
  expect(readFileSync('playwright.config.ts')).toEqual(original('playwright.config.ts'));
  const tuple =
    "  [\n    'integrated-chain.spec.ts',\n    'integrated3.9 compact native Review keyboard focus reduced motion Axe and short desktop keep typed configuration readable',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(tuple, '')).toBe(
    original('playwright.desktop.config.ts').toString(),
  );
});
it('rejects unbound current or historical bytes instead of accepting a plausible historical view', () => {
  const actual = Buffer.from('current'),
    previous = Buffer.from('previous'),
    binding = { before: platformBlobHash(previous), after: platformBlobHash(actual) };
  expect(boundHistoricalBytes(actual, previous, binding)).toEqual(previous);
  expect(() => boundHistoricalBytes(Buffer.from('tampered'), previous, binding)).toThrow(
    'unapproved current bytes',
  );
  expect(() => boundHistoricalBytes(actual, Buffer.from('wrong'), binding)).toThrow(
    'unapproved base bytes',
  );
});
