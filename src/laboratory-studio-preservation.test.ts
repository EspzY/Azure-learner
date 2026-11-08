import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pr68Base, hash68, original68 } from '../tests/pr68-preservation';
import proof from '../docs/reviews/evidence/pr68/preservation.json';
it('preserves actual course authorities all six engines SQL original receipts fixtures and locked PR67 evidence; pins only finite presentation adapters', () => {
  const allowed = [
    'AGENTS.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'docs/PROJECT_STATUS.md',
    'playwright.desktop.config.ts',
    'src/features/portal/architecture.tsx',
    'src/features/laboratory/laboratory.tsx',
    'src/features/laboratory/endpoints.tsx',
    'src/laboratory-firewall-preservation.test.ts',
    'tests/pr67-preservation.ts',
  ];
  expect(Object.keys(proof.files).sort()).toEqual(allowed.sort());
  expect(proof.base).toBe(pr68Base);
  const lines = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr68Base,
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
      'docs/PROJECT_STATUS.md',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(lines.length).toBeGreaterThan(1000);
  for (const line of lines) {
    const [meta, path] = line.split('\t') as [string, string];
    const bytes = readFileSync(path);
    if (Object.hasOwn(proof.files, path)) {
      const p = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(hash68(original68(path)), path).toBe(p.before);
      expect(hash68(bytes), path).toBe(p.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('keeps old frozen preservation test bodies byte-identical with two explicit import-only read delegations', () => {
  for (const [path, prefix] of [
    ['tests/pr67-preservation.ts', './'],
    ['src/laboratory-firewall-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original68(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR68 as readFileSync } from '${prefix}pr68-preservation';`,
        ),
    );
});
it('extracts only rendering from the old course ArchitectureExplorer and leaves its original controller teaching guard guidance and event callbacks intact', () => {
  const before = original68('src/features/portal/architecture.tsx').toString(),
    now = readFileSync('src/features/portal/architecture.tsx', 'utf8');
  const body = (s: string) => s.slice(s.indexOf('export function ArchitectureExplorer'));
  expect(body(now).replace(/<PortalArchitectureGraph[\s\S]*?\/>/, 'GRAPH')).toBe(
    body(before).replace(/<ReactFlow[\s\S]*?<\/ReactFlow>/, 'GRAPH'),
  );
  const graph = readFileSync('src/features/portal/architecture-graph.tsx', 'utf8');
  expect(graph).not.toMatch(
    /usePractical|usePortalLearning|useSandbox|fetch\(|localStorage|sessionStorage/,
  );
});
it('retains all435 inherited browser selections settings and original assertions while adding one justified compact Studio witness', () => {
  const path = 'playwright.desktop.config.ts',
    now = readFileSync(path, 'utf8');
  const added =
    "  [\n    'laboratory-studio.spec.ts',\n    'Studio near-capacity graph semantic list keyboard focus reduced motion Axe and short desktop remain usable without moving resource nodes',\n  ],\n";
  expect(now.includes(added)).toBe(true);
  expect(now.replace(added, '')).toBe(original68(path).toString());
});
