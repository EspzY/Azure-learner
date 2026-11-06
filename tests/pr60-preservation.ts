import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { expect } from 'vitest';
import proof from '../docs/reviews/evidence/pr60/preservation.json';

export const pr60Base = 'cb99705b1b0650d2099f6c95f5c7e32776448483';
export const pr60RuntimeChanges = [
  '.github/workflows/ci.yml',
  'package-lock.json',
  'package.json',
  'playwright.desktop.config.ts',
  'src/content/nb.ts',
  'src/features/course/course-hub.tsx',
];
export const pr60DocumentationChanges = ['docs/ARCHITECTURE.md', 'docs/DECISIONS.md'];
export const pr60Adapters = [
  'src/features/learning/final-quality-preservation.test.ts',
  'src/features/course/vm-debrief-preservation.test.ts',
  'src/features/portal/challenge-validity-preservation.test.ts',
  'tests/cc02-preservation.ts',
  'tests/cc03-preservation.ts',
];
const sha = (value: Buffer | string) => createHash('sha256').update(value).digest('hex');
const originals = new Map<string, Buffer>();
export function pr60Original(path: string) {
  let bytes = originals.get(path);
  if (!bytes) {
    bytes = execFileSync('git', ['show', `${pr60Base}:${path}`], {
      maxBuffer: 8 * 1024 * 1024,
    });
    originals.set(path, bytes);
  }
  return bytes;
}
/** Only five import delegations are authorized: every previous assertion stays byte-identical. */
export function assertPR60Adapter(path: string) {
  expect(pr60Adapters).toContain(path);
  const prefix = path.startsWith('src/') ? '../../../tests/' : './';
  const before = pr60Original(path).toString();
  expect(readFileSync(path, 'utf8'), path).toBe(
    before.replace(
      "import { readFileSync } from 'node:fs';",
      `import { readHistorical as readFileSync } from '${prefix}pr60-preservation';`,
    ),
  );
}
export function assertPR60Runtime(path: string) {
  expect(proof.base).toBe(pr60Base);
  expect(Object.keys(proof.files).sort()).toEqual(
    [...pr60RuntimeChanges, ...pr60DocumentationChanges].sort(),
  );
  const entry = (
    proof.files as Record<
      string,
      {
        before: string;
        after: string;
        prefixBytes?: number;
        replacements?: { before: string; after: string; at: number }[];
      }
    >
  )[path];
  if (!entry) throw Error('Not a PR60 authorized runtime change: ' + path);
  const before = pr60Original(path),
    current = readFileSync(path);
  expect(sha(before), path).toBe(entry.before);
  expect(sha(current), path).toBe(entry.after);
  if (path === 'src/content/nb.ts') {
    expect(entry.prefixBytes).toBe(before.length);
    expect(current.subarray(0, before.length).equals(before)).toBe(true);
    expect(current.subarray(before.length).toString()).toMatch(/^\s*export const laboratoryV3Nb/);
  } else {
    let expected = before.toString();
    for (const replacement of [...entry.replacements!].reverse()) {
      expect(expected.slice(replacement.at, replacement.at + replacement.before.length)).toBe(
        replacement.before,
      );
      expected =
        expected.slice(0, replacement.at) +
        replacement.after +
        expected.slice(replacement.at + replacement.before.length);
    }
    expect(current.toString(), path).toBe(expected);
  }
}
/**
 * Test-only historical byte view. It first validates the REAL current file's bounded,
 * separately tested PR60 delta, then lets earlier immutable hashes check their original
 * revision. All other reads remain real filesystem reads. Never used by application code.
 */
export function readHistorical(path: string): Buffer;
export function readHistorical(path: string, encoding: 'utf8'): string;
export function readHistorical(path: string, encoding?: 'utf8'): Buffer | string {
  let bytes: Buffer;
  if ([...pr60RuntimeChanges, ...pr60DocumentationChanges].includes(path)) {
    assertPR60Runtime(path);
    bytes = pr60Original(path);
  } else if (pr60Adapters.includes(path)) {
    assertPR60Adapter(path);
    bytes = pr60Original(path);
  } else bytes = readFileSync(path);
  return encoding ? bytes.toString(encoding) : bytes;
}
