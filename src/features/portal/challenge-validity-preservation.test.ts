import { assertCC02Change, cc02PresentationChanges } from '../../../tests/cc02-preservation';
import { it, expect } from 'vitest';
import { readHistorical as readFileSync } from '../../../tests/pr60-preservation';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { challenge2Nb } from '@/content/nb';
import proof from '../../../docs/reviews/evidence/cc03/preservation.json';
import student from '../../../docs/reviews/evidence/cc03/blind/student-final.json';
import { assertCC03Change } from '../../../tests/cc03-preservation';
import amendment from '../../../docs/reviews/evidence/cc03/authorized-changes.json';
const hash = (b: Buffer) => createHash('sha256').update(b).digest('hex');
it('preserves every declared historical file, full PR54 locale prefix, technical adapter tail and CC01 authorities', () => {
  expect(proof.base).toBe('bb66ff2e5115d26304bb017295a9067c6f6fed5d');
  for (const [path, expected] of Object.entries(proof.wholeFiles)) {
    if (cc02PresentationChanges.includes(path)) {
      assertCC02Change(path, expected);
      continue;
    }
    if (path === 'src/domain/sandbox/missions.ts') {
      assertCC02Change(path, expected);
      continue;
    }
    expect(hash(readFileSync(path)), path).toBe(expected);
  }
  const old = execFileSync('git', ['show', `${proof.base}:src/content/nb.ts`], {
    maxBuffer: 8 * 1024 * 1024,
  });
  expect(old.length).toBe(proof.localePrefix.bytes);
  expect(hash(old)).toBe(proof.localePrefix.sha256);
  expect(readFileSync('src/content/nb.ts').subarray(0, old.length).equals(old)).toBe(true);
  const path = 'src/domain/portal/model.ts',
    marker = 'export function inventory(';
  const before = execFileSync('git', ['show', `${proof.base}:${path}`], { encoding: 'utf8' }),
    after = readFileSync(path, 'utf8');
  expect(after.slice(after.indexOf(marker))).toBe(before.slice(before.indexOf(marker)));
  for (const path of Object.keys(amendment.files)) assertCC03Change(path);
});
it('renders the final authored student material and static option order pinned before final review without visible answer IDs', () => {
  for (const key of ['title', 'instructions', 'items', 'webBrief', 'webChoices'] as const)
    expect(challenge2Nb[key]).toEqual(student[key]);
  expect(challenge2Nb.items.map((x) => x.id)).toEqual(['wv2-01', 'wv2-02']);
  expect(challenge2Nb.items.every((x) => !x.reasons.some(([id]) => String(id) === x.id))).toBe(
    true,
  );
  expect(readFileSync('src/features/portal/challenge-v2.tsx', 'utf8')).not.toMatch(/>\{item.id\}</);
});
