import { assertCC03Change, cc03Authorized } from '../../../tests/cc03-preservation';
import { assertCC01Change, cc01Authorized } from '../../../tests/cc01-preservation';
import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import pd01 from '../../../docs/reviews/evidence/pr52-preservation.json';
import owner from '../../../docs/reviews/evidence/pr51-owner-preservation.json';
import proof from '../../../docs/reviews/evidence/hybrid51-preservation.json';
import { visualReviewAllowed } from '../design-review/model';
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
it('preserves the original learning domains, stores, rubrics, teaching and technical authorities', () => {
  expect(owner.authorizedChanges.sort()).toEqual(
    [
      'src/domain/curriculum/foundations-v2.test.ts',
      'src/domain/curriculum/foundations-v2.ts',
      'src/domain/curriculum/v2-store.ts',
      'src/features/learning/expanded-module.tsx',
      'src/features/learning/foundations-v2.tsx',
      'src/features/learning/foundations-v2.css',
      'src/features/learning/source-disclosure.test.ts',
      'src/features/learning/management-access.tsx',
    ].sort(),
  );
  expect(Object.keys(pd01.authorizedPresentationChanges).sort()).toEqual(
    [
      'src/features/course/course-sidebar.tsx',
      'src/features/learning/foundations-visuals.tsx',
      'src/features/learning/responsibility-recap.tsx',
    ].sort(),
  );
  for (const [path, expected] of Object.entries(proof.files)) {
    if (owner.authorizedChanges.includes(path)) continue;
    if (cc03Authorized(path) && !cc01Authorized(path)) {
      assertCC03Change(path, expected);
      continue;
    }
    if (cc01Authorized(path)) {
      assertCC01Change(path, expected);
      continue;
    }
    if (path === 'src/features/learning/responsibility-recap.tsx') {
      const original = execFileSync('git', ['show', `${pd01.base}:${path}`], {
        encoding: 'utf8',
      });
      expect(hash(Buffer.from(original)), path).toBe(expected);
      expect(readFileSync(path, 'utf8'), path).toBe(
        original
          .replace("import Link from 'next/link';\n", '')
          .replace('      <Link href="/learn/services?topic=overview">{c.recapDeep}</Link>\n', ''),
      );
      continue;
    }
    if (Object.hasOwn(pd01.authorizedPresentationChanges, path)) continue;
    expect(hash(readFileSync(path)), path).toBe(expected);
  }
  expect(hash(readFileSync('src/content/nb.ts').subarray(0, proof.localeBytes))).toBe(
    proof.localeSHA256,
  );
  const tail = proof.unchangedHistoryTail;
  const history = readFileSync(tail.path);
  expect(hash(history.subarray(history.lastIndexOf(tail.marker)))).toBe(tail.sha256);
});
it('retains the historical comparison only on the two explicitly trusted preview branches', () => {
  const branch = 'codex/azurelab-hybrid-production-foundation';
  expect(visualReviewAllowed('preview', branch)).toBe(true);
  expect(visualReviewAllowed(undefined, undefined, branch)).toBe(true);
  expect(visualReviewAllowed('production', branch)).toBe(false);
  expect(visualReviewAllowed('preview', 'codex/untrusted', branch)).toBe(false);
});
