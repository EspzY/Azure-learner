import { it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { readPR72 as readFileSync } from '../tests/pr72-preservation';
import { execFileSync } from 'node:child_process';
import { blobHash71, original71, pr71Base } from '../tests/pr71-preservation';
import proof from '../docs/reviews/evidence/pr71/preservation.json';
const approved = [
  '.gitattributes',
  'AGENTS.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
  'docs/LABORATORY_V3_SERVER.md',
  'docs/PORTAL_CAPABILITY_MATRIX.md',
  'docs/PROJECT_STATUS.md',
  'playwright.desktop.config.ts',
  'src/features/course/course.css',
  'src/features/course/course.tsx',
  'src/features/laboratory/endpoints.tsx',
  'src/features/laboratory/laboratory.css',
  'src/features/laboratory/laboratory.tsx',
  'src/features/laboratory/routing.tsx',
  'src/features/landing/landing.css',
  'src/features/landing/landing.tsx',
  'src/features/portal/portal.tsx',
  'src/features/portal/presentation.css',
  'src/laboratory-topology-preservation.test.ts',
  'tests/pr70-preservation.ts',
];
it('checks every actual PR70 file against its original Git blob, with only finite approved presentation/transport bindings', () => {
  expect(proof.base).toBe(pr71Base);
  expect(Object.keys(proof.files).sort()).toEqual(approved.sort());
  const entries = execFileSync('git', ['ls-tree', '-r', pr71Base], { encoding: 'utf8' })
    .trim()
    .split('\n');
  expect(entries.length).toBeGreaterThan(2500);
  for (const line of entries) {
    const [meta, path] = line.split('\t') as [string, string];
    if (path === 'quality/releases/current.json') continue;
    const actual = blobHash71(readFileSync(path));
    const row = (proof.files as Record<string, { before: string; after: string }>)[path];
    if (row) {
      expect(row.before, path).toBe(meta.split(' ')[2]);
      expect(actual, path).toBe(row.after);
    } else expect(actual, path).toBe(meta.split(' ')[2]);
  }
  expect(existsSync('.github/workflows/pr71-format-preview.yml')).toBe(false);
  for (const [path, sha] of Object.entries(proof.added))
    expect(blobHash71(readFileSync(path)), path).toBe(sha);
});
it('keeps all inherited preservation assertion bodies and approved455 browser settings; extends only one compact witness', () => {
  for (const [path, importPath] of [
    ['tests/pr70-preservation.ts', './pr71-preservation'],
    ['src/laboratory-topology-preservation.test.ts', '../tests/pr71-preservation'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original71(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR71 as readFileSync } from '${importPath}';`,
        ),
    );
  const tuple =
    "  [\n    'ephemeral-landing.spec.ts',\n    'compact landing is readable with keyboard access and reduced motion',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(tuple, '')).toBe(
    original71('playwright.desktop.config.ts').toString(),
  );
});
it('home links are a pure addition to both course controllers, with the entire original course navigation/event body retained', () => {
  for (const [path, cls] of [
    ['src/features/course/course.tsx', 'course-home-link'],
    ['src/features/portal/portal.tsx', 'portal-workspace-link portal-landing-link'],
  ]) {
    let text = readFileSync(path!, 'utf8');
    text = text
      .replace("import { AzureLabHomeLink } from '@/features/portal/azurelab-home-link';\n", '')
      .replace(new RegExp(`^ +<AzureLabHomeLink className="${cls}" />\\n`, 'm'), '');
    expect(text, path!).toBe(original71(path!).toString());
  }
});
