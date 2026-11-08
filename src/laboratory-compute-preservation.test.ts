import golden from '../docs/reviews/evidence/pr66/frozen33-golden.json';
import { replay } from './laboratory/engine';
import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pr66Base, original66, hash66 } from '../tests/pr66-preservation';
import proof from '../docs/reviews/evidence/pr66/preservation.json';
it('preserves all prior engines SQL course rubrics receipts assertions and locked evidence; pins only literal bounded3.4 adapters', () => {
  const allowed = [
    'src/features/course/course-sidebar.tsx',
    'AGENTS.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'playwright.desktop.config.ts',
    'scripts/laboratory-db.mjs',
    'src/content/portal-workspace-nb.ts',
    'src/features/laboratory/endpoints.tsx',
    'src/features/laboratory/laboratory.tsx',
    'src/features/laboratory/networking.tsx',
    'src/features/laboratory/portal-adapter.tsx',
    'src/features/laboratory/routing.tsx',
    'src/laboratory/engine.ts',
    'src/laboratory/v3/server.ts',
    'src/laboratory-endpoints-preservation.test.ts',
    'tests/pr65-preservation.ts',
    'tests/e2e/laboratory-endpoints.spec.ts',
  ];
  expect(proof.base).toBe(pr66Base);
  expect(Object.keys(proof.files).sort()).toEqual(allowed.sort());
  const paths = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr66Base,
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
      const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(hash66(original66(path)), path).toBe(entry.before);
      expect(hash66(bytes), path).toBe(entry.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('keeps every inherited browser assertion and original owner Back Forward test byte, only selecting explicit historical3.3 through UI', () => {
  for (const [path, prefix] of [
    ['tests/pr65-preservation.ts', './'],
    ['src/laboratory-endpoints-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original66(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR66 as readFileSync } from '${prefix}pr66-preservation';`,
        ),
    );
  const fixture =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.3.0');\n";
  expect(readFileSync('tests/e2e/laboratory-endpoints.spec.ts', 'utf8')).toBe(
    original66('tests/e2e/laboratory-endpoints.spec.ts')
      .toString()
      .replace(
        "  await page.getByRole('button', { name: c.start, exact: true }).click();",
        fixture + "  await page.getByRole('button', { name: c.start, exact: true }).click();",
      ),
  );
  expect(readFileSync('tests/e2e/owner-acceptance.spec.ts')).toEqual(
    original66('tests/e2e/owner-acceptance.spec.ts'),
  );
  const extra =
    "  [\n    'laboratory-compute.spec.ts',\n    'compute compact native keyboard Properties networking focus reduced motion Axe and original three-resource receipt remain usable',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(extra, '')).toBe(
    original66('playwright.desktop.config.ts').toString(),
  );
});

it('replays original3.3 NIC and unsupported VM golden entries at every original through boundary', () => {
  expect(replay(golden.entries as never, 'laboratory@3.3.0')).toEqual(golden.world);
  expect(golden.entries.at(-1)!.receipt).toMatchObject({
    code: 'unsupported-capability',
    outcome: 'unsupported',
    addedIds: [],
    beforeRevision: 4,
    afterRevision: 4,
  });
  for (let through = 0; through <= golden.entries.length; through++)
    expect(replay(golden.entries as never, 'laboratory@3.3.0', through)?.revision).toBe(
      through === 0 ? 0 : golden.entries[through - 1]!.receipt.afterRevision,
    );
});

it('limits the diagnosed course flake fix to hydration-bound disclosure IDs and controls, preserving every link event and original assertion', () => {
  let expected = original66('src/features/course/course-sidebar.tsx').toString();
  expected = expected.replace(
    "import { useEffect, useRef, useState } from 'react';",
    "import { useEffect, useRef, useState, useSyncExternalStore } from 'react';",
  );
  expected = expected.replace(
    'export function CourseSidebar({',
    '// Streamed server segments can coexist with the hydrated menu before React swaps them.\n// Attach interactive IDs/controls only to the committed client menu; SSR links remain ordinary links.\nconst subscribeHydration = () => () => {};\nconst clientHydration = () => true;\nconst serverHydration = () => false;\n\nexport function CourseSidebar({',
  );
  expected = expected.replace(
    '  const activePath = coursePathFor(module)?.id;',
    '  const hydrated = useSyncExternalStore(subscribeHydration, clientHydration, serverHydration);\n  const activePath = coursePathFor(module)?.id;',
  );
  expected = expected
    .replace(
      'aria-controls={`course-path-${path.id}`}',
      'aria-controls={hydrated ? `course-path-${path.id}` : undefined}',
    )
    .replace(
      'id={`course-path-${path.id}`}',
      'id={hydrated ? `course-path-${path.id}` : undefined}',
    )
    .replace(
      'aria-controls={`course-activities-${part}`}',
      'aria-controls={hydrated ? `course-activities-${part}` : undefined}',
    )
    .replace(
      'id={`course-activities-${part}`}',
      'id={hydrated ? `course-activities-${part}` : undefined}',
    );
  expect(readFileSync('src/features/course/course-sidebar.tsx', 'utf8')).toBe(expected);
});
