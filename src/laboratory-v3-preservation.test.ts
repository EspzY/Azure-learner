import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  assertPR60Adapter,
  assertPR60Runtime,
  pr60Adapters,
  pr60DocumentationChanges,
  pr60Base,
  pr60Original,
  pr60RuntimeChanges,
} from '../tests/pr60-preservation';

it('retains every old source, domain, browser, script, asset and locked audit byte except six explicit entry/backend setup deltas and five import-only test delegations', () => {
  const paths = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr60Base,
      '--',
      'src',
      'tests',
      'scripts',
      'public',
      '.github',
      'package.json',
      'package-lock.json',
      'playwright.config.ts',
      'playwright.desktop.config.ts',
      'docs/reviews',
      'docs/quality',
      'docs/LABORATORY_STAGE1_BLOCKER.md',
      'docs/LABORATORY_V3_ACTIVATION.md',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(paths.length).toBe(870);
  for (const entry of paths) {
    const [metadata, path] = entry.split('\t') as [string, string];
    const object = metadata.split(' ')[2];
    if (pr60RuntimeChanges.includes(path)) assertPR60Runtime(path);
    else if (pr60Adapters.includes(path)) assertPR60Adapter(path);
    else {
      // Git's exact blob identity, computed locally in one pass, avoids spawning
      // 870 separate git-show processes within a normal-duration test.
      const bytes = readFileSync(path);
      const identity = createHash('sha1')
        .update(`blob ${bytes.length}\0`)
        .update(bytes)
        .digest('hex');
      expect(identity, path).toBe(object);
    }
  }
});

it('only adds three pinned PostgreSQL/server module dependencies and an explicit local setup script; every prior lock entry remains identical', () => {
  const before = JSON.parse(pr60Original('package.json').toString()),
    after = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(after.dependencies.pg).toBe('8.23.1');
  expect(after.dependencies['server-only']).toBe('0.0.1');
  expect(after.devDependencies['@types/pg']).toBe('8.20.0');
  expect(after.scripts['lab:db:setup']).toBe('node scripts/laboratory-db.mjs');
  delete after.dependencies.pg;
  delete after.dependencies['server-only'];
  delete after.devDependencies['@types/pg'];
  delete after.scripts['lab:db:setup'];
  expect(after).toEqual(before);
  const oldLock = JSON.parse(pr60Original('package-lock.json').toString()),
    lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  for (const [path, entry] of Object.entries(oldLock.packages)) {
    if (path) expect(lock.packages[path], path).toEqual(entry);
  }
  const root = structuredClone(lock.packages['']);
  delete root.dependencies.pg;
  delete root.dependencies['server-only'];
  delete root.devDependencies['@types/pg'];
  expect(root).toEqual(oldLock.packages['']);
  expect(
    Object.keys(lock.packages)
      .filter((p) => !(p in oldLock.packages))
      .sort(),
  ).toEqual(
    [
      '@types/pg',
      'pg',
      'pg-cloudflare',
      'pg-connection-string',
      'pg-int8',
      'pg-pool',
      'pg-protocol',
      'pg-types',
      'pgpass',
      'postgres-array',
      'postgres-bytea',
      'postgres-date',
      'postgres-interval',
      'server-only',
      'split2',
      'xtend',
    ]
      .map((p) => 'node_modules/' + p)
      .sort(),
  );
});

it('adds only a separate Course Hub footer entry, retaining all original Start/Continue/progress/navigation logic', () => {
  const source = readFileSync('src/features/course/course-hub.tsx', 'utf8');
  expect(
    source
      .replace("import { laboratoryV3Nb } from '@/content/nb';\n", '')
      .replace('        <Link href="/labs/laboratory">{laboratoryV3Nb.entry}</Link>\n', ''),
  ).toBe(pr60Original('src/features/course/course-hub.tsx').toString());
});

it('adds only the new server contract after the architecture/decisions title, preserving the complete historical document body', () => {
  for (const path of pr60DocumentationChanges) {
    assertPR60Runtime(path);
    const original = pr60Original(path).toString();
    const current = readFileSync(path, 'utf8');
    const body = original.slice(original.indexOf('\n') + 1).trimStart();
    expect(current.endsWith(body)).toBe(true);
    expect(current.slice(0, current.length - body.length)).toContain('PR60');
  }
});

it('retains the original complete CI command, release, pinned browsers and all prior execution settings', () => {
  const source = readFileSync('.github/workflows/ci.yml', 'utf8');
  expect(source).toContain('node scripts/verify-desktop-ci.mjs');
  expect(source).toContain('npm run quality:release');
  expect(source).toContain('npm run lab:db:setup');
  expect(source).toContain(
    'postgres:17-bookworm@sha256:665dc7b37ac52a17e298511414c21d23ffa4e6a6ef6225b3e5d59c7afb35e994',
  );
  const config = readFileSync('playwright.desktop.config.ts', 'utf8');
  expect(
    config.replace(
      / {2}\[\n {4}'laboratory-server.spec.ts',\n {4}'server Laboratory compact native keyboard short-height reduced motion Axe and actual Blob read remain usable',\n {2}\],\n/,
      '',
    ),
  ).toBe(pr60Original('playwright.desktop.config.ts').toString());
});
