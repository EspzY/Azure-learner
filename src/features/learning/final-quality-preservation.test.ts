import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { format } from 'prettier';
import proof from '../../../docs/reviews/evidence/pr57/preservation.json';
import { assertPR57Presentation, pr57OriginalSource } from '../../../tests/pr57-preservation';
import { computeNb, monitoringNb, securityNb, storageNb } from '@/content/nb';
import {
  computePresentation,
  monitoringPresentation,
  securityPresentation,
  storagePresentation,
} from './final-quality-copy';
const hash = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');

it('preserves every other original source/asset/config file and the entire base locale prefix', () => {
  for (const [path, sha] of Object.entries(proof.wholeFiles))
    expect(hash(readFileSync(path)), path).toBe(sha);
  const raw = readFileSync('src/content/nb.ts');
  expect(hash(raw.subarray(0, proof.localePrefix.bytes))).toBe(proof.localePrefix.sha256);
  expect(raw.subarray(proof.localePrefix.bytes).toString()).toContain(
    'export const finalQualityNb',
  );
});

it('limits old runtime changes to the reviewed display replacements', () => {
  expect(Object.keys(proof.presentation).sort()).toEqual([
    'src/app/learn/layout.tsx',
    'src/features/learning/compute-workbench.tsx',
    'src/features/learning/compute.tsx',
    'src/features/learning/cost.tsx',
    'src/features/learning/monitoring-controls.tsx',
    'src/features/learning/monitoring-workbench.tsx',
    'src/features/learning/monitoring.css',
    'src/features/learning/monitoring.tsx',
    'src/features/learning/networking-visuals.tsx',
    'src/features/learning/security.tsx',
    'src/features/learning/storage.tsx',
  ]);
  for (const [path, entry] of Object.entries(proof.presentation)) {
    assertPR57Presentation(path);
    let expected = pr57OriginalSource(path).toString();
    for (const replacement of entry.replacements) {
      const at = expected.indexOf(replacement.before);
      expect(at, path).toBeGreaterThanOrEqual(0);
      expected =
        expected.slice(0, at) + replacement.after + expected.slice(at + replacement.before.length);
    }
    expect(readFileSync(path, 'utf8'), path).toBe(expected);
  }
});

it('retains all earlier preservation assertions through two exact test delegations', async () => {
  expect(Object.keys(proof.authorizedTests).sort()).toEqual([
    'src/features/course/vm-debrief-preservation.test.ts',
    'tests/cc02-preservation.ts',
  ]);
  for (const [path, entry] of Object.entries(proof.authorizedTests)) {
    const before = pr57OriginalSource(path).toString();
    expect(hash(before)).toBe(entry.before);
    let after = readFileSync(path, 'utf8');
    expect(hash(after)).toBe(entry.after);
    after = after.replace(
      /import\s+\{[^}]*\}\s+from '(?:\.\.\/\.\.\/\.\.\/tests\/|\.\/)pr57-preservation';\n/,
      '',
    );
    if (path === 'tests/cc02-preservation.ts') {
      after = after
        .replace('  ...pr57PresentationChanges,\n', '')
        .replace(
          / {2}if \(pr57PresentationChanges.includes\(path\)\) \{\s*assertPR57Presentation\(path, historicalHash\);\s*return;\s*\}\n/,
          '',
        );
    } else {
      after = after
        .replace(
          /\s*if \(pr57PresentationChanges.includes\(path\)\) \{\s*assertPR57Presentation\(path, sha\);\s*continue;\s*\}/,
          '',
        )
        .replace(
          /for \(const \[path, sha\] of Object.entries\(proof.wholeFiles\)\) \{\s*(expect\(hash\(readFileSync\(path\)\), path\).toBe\(sha\);)\s*\}/,
          'for (const [path, sha] of Object.entries(proof.wholeFiles)) $1',
        );
    }
    const options = { parser: 'typescript', singleQuote: true, printWidth: 92 };
    expect(await format(after, options)).toBe(await format(before, options));
  }
});

it('changes only the explicit current-teaching copy leaves and keeps assessment objects shared', () => {
  const differences = (a: unknown, b: unknown, prefix = ''): string[] => {
    if (a === b) return [];
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      expect(Object.keys(b)).toEqual(Object.keys(a));
      return Object.keys(a).flatMap((key) =>
        differences(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
          prefix ? prefix + '.' + key : key,
        ),
      );
    }
    expect(typeof a).toBe('string');
    expect(typeof b).toBe('string');
    return [prefix];
  };
  expect(differences(storageNb, storagePresentation)).toEqual(['available']);
  expect(differences(computeNb, computePresentation)).toEqual(['available']);
  expect(differences(securityNb, securityPresentation)).toEqual([
    'sections.introduction.limit',
    'sections.zero-trust.paragraphs.1',
    'sections.posture.paragraphs.4',
  ]);
  expect(differences(monitoringNb, monitoringPresentation)).toEqual([
    'available',
    'sections.health.example',
    'sections.signals.example',
    'sections.logs.paragraphs.2',
    'sections.alerts.paragraphs.0',
    'sections.alerts.example',
    'sections.insights.example',
    'missions.telemetry.where',
    'missions.telemetry.steps.2',
  ]);
  for (const [original, presentation] of [
    [storageNb, storagePresentation],
    [computeNb, computePresentation],
    [securityNb, securityPresentation],
    [monitoringNb, monitoringPresentation],
  ] as const)
    expect(presentation.assessment).toBe(original.assessment);
});
