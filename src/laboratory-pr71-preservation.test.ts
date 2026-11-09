import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { blobHash71, original71, pr71Base } from '../tests/pr71-preservation';
import proof from '../docs/reviews/evidence/pr71/preservation.json';

it('pins every changed PR70 file and every new implementation/test against exact Git blob hashes', () => {
  expect(proof.base).toBe(pr71Base);
  const rawTree = execFileSync('git', ['ls-tree', '-r', pr71Base], { encoding: 'utf8' });
  const entries = rawTree.trim().split('\n').map((line) => {
    const [modeAndHash, path] = line.split('\t') as [string, string];
    return { path, sha: modeAndHash.split(' ')[2] };
  });
  expect(entries.length).toBeGreaterThan(2400);
  const originals = new Set(entries.map((entry) => entry.path));
  const changed = proof.files as Record<string, { before: string; after: string }>;
  const added = proof.added as Record<string, string>;
  for (const entry of entries) {
    if (entry.path === 'quality/releases/current.json') continue;
    const now = blobHash71(readFileSync(entry.path));
    const row = changed[entry.path];
    if (row) {
      expect(row.before, entry.path).toBe(entry.sha);
      expect(now, entry.path).toBe(row.after);
    } else {
      expect(now, entry.path).toBe(entry.sha);
    }
  }
  for (const [path, sha] of Object.entries(added)) {
    expect(originals.has(path), path).toBe(false);
    expect(blobHash71(readFileSync(path)), path).toBe(sha);
  }
  const diff = execFileSync('git', ['diff', '--name-only', pr71Base, 'HEAD'], {
    encoding: 'utf8',
  }).trim().split('\n').filter(Boolean);
  const expected = [...Object.keys(changed), ...Object.keys(added),
    'docs/reviews/evidence/pr71/preservation.json'];
  expect(diff.sort()).toEqual(expected.sort());
});
it('delegates only the read import in each inherited preservation test', () => {
  for (const [path, importPath] of [
    ['tests/pr70-preservation.ts', './pr71-preservation'],
    ['src/laboratory-topology-preservation.test.ts', '../tests/pr71-preservation'],
  ]) {
    expect(readFileSync(path!, 'utf8')).toBe(original71(path!).toString().replace(
      "import { readFileSync } from 'node:fs';",
      `import { readPR71 as readFileSync } from '${importPath}';`,
    ));
  }
});
