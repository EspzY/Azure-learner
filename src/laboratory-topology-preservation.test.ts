import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pr70Base, hash70, original70 } from '../tests/pr70-preservation';
import proof from '../docs/reviews/evidence/pr70/preservation.json';
it('checks actual frozen3.0–3.6 engines SQL001–007 repository course authorities assertions fixtures and locked PR69 evidence; finite declared UI/dispatch deltas only', () => {
  const allowed = [
    'AGENTS.md',
    'scripts/laboratory-db.mjs',
    'src/features/laboratory/capabilities.ts',
    'src/features/laboratory/compute.tsx',
    'src/features/laboratory/endpoints.tsx',
    'src/features/laboratory/firewall.tsx',
    'src/features/laboratory/laboratory.tsx',
    'src/features/laboratory/networking.tsx',
    'src/features/laboratory/portal-adapter.tsx',
    'src/features/laboratory/routing.tsx',
    'src/features/laboratory/rule-lifecycle.tsx',
    'src/features/laboratory/rule-lifecycle.css',
    'src/features/laboratory/studio-model.ts',
    'src/features/laboratory/studio.tsx',
    'src/laboratory-compute.test.ts',
    'src/laboratory-remediation.test.ts',
    'src/laboratory/engine.ts',
    'src/laboratory/v3/server.ts',
    'tests/e2e/laboratory-remediation.spec.ts',
    'tests/pr69-preservation.ts',
    'src/laboratory-remediation-preservation.test.ts',
    'playwright.desktop.config.ts',
    'docs/LABORATORY_REMEDIATION_CAPABILITIES.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/PORTAL_CAPABILITY_MATRIX.md',
    'docs/LABORATORY_V3_SERVER.md',
    'docs/PROJECT_STATUS.md',
  ];
  expect(Object.keys(proof.files).sort()).toEqual(allowed.sort());
  expect(proof.base).toBe(pr70Base);
  const paths = execFileSync('git', ['ls-tree', '-r', pr70Base], { encoding: 'utf8' })
    .trim()
    .split('\n');
  expect(paths.length).toBeGreaterThan(2400);
  for (const line of paths) {
    const [meta, path] = line.split('\t') as [string, string];
    if (path === 'quality/releases/current.json') continue;
    const bytes = readFileSync(path);
    if (Object.hasOwn(proof.files, path)) {
      const row = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(hash70(bytes), path).toBe(row.after);
      expect(hash70(original70(path)), path).toBe(row.before);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});
it('retains448 browser controls and original substantive assertions, explicit historical3.6 seed and honestly named current3.7 new-workspace fixture only', () => {
  const added =
    "  [\n    'laboratory-topology.spec.ts',\n    'topology native short desktop Review keyboard focus reduced motion Axe and pinned disassociation preserve actual resource evidence',\n  ],\n";
  const config = readFileSync('playwright.desktop.config.ts', 'utf8');
  expect(config.includes(added)).toBe(true);
  expect(config.replace(added, '')).toBe(original70('playwright.desktop.config.ts').toString());
  const path = 'tests/e2e/laboratory-remediation.spec.ts';
  let s = readFileSync(path, 'utf8');
  const importLine =
    "import { laboratoryTopologyNb as currentWorkspace } from '../../src/content/laboratory-topology-nb';\n";
  const choice =
    "  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();\n  await page\n    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })\n    .selectOption('laboratory@3.6.0');\n";
  expect(s.includes(importLine)).toBe(true);
  expect(s.includes(choice)).toBe(true);
  s = s
    .replace(importLine, '')
    .replace(choice, '')
    .replace('creating empty3.7', 'creating empty3.6')
    .replaceAll('currentWorkspace.newWorkspace', 't.newWorkspace')
    .replace("toContainText('laboratory@3.7.0')", "toContainText('laboratory@3.6.0')");
  expect(s).toBe(original70(path).toString());
});
it('adapts inherited preservation reads by imports only and extends only the current registry expectation', () => {
  for (const [path, prefix] of [
    ['tests/pr69-preservation.ts', './'],
    ['src/laboratory-remediation-preservation.test.ts', '../tests/'],
  ])
    expect(readFileSync(path!, 'utf8')).toBe(
      original70(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR70 as readFileSync } from '${prefix}pr70-preservation';`,
        ),
    );
  expect(readFileSync('src/laboratory-remediation.test.ts', 'utf8')).toBe(
    original70('src/laboratory-remediation.test.ts')
      .toString()
      .replace(
        'engine.models.filter((m) => m !== laboratoryModel)',
        'engine.models.slice(0, engine.models.indexOf(laboratoryModel))',
      ),
  );
  expect(readFileSync('src/laboratory-compute.test.ts', 'utf8')).toBe(
    original70('src/laboratory-compute.test.ts')
      .toString()
      .replace("      'laboratory@3.6.0',", "      'laboratory@3.6.0',\n      'laboratory@3.7.0',"),
  );
});
