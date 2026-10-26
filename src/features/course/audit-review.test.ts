import { expect, test } from 'vitest';
import { auditReviewHref } from './audit-review';
const branch = 'codex/az900-curriculum-audit';
const sha = '184b818a041919b9a6461310c3ba39074e020641';
test('audit review points to exact deployed source only in its authorized preview branch', () => {
  expect(auditReviewHref('preview', branch, sha)).toBe(
    `https://github.com/EspzY/Azure-learner/blob/${sha}/docs/AZ900_COVERAGE_MATRIX.md`,
  );
});
test('production, local, other branches and invalid/missing commit never expose the review entry', () => {
  expect(auditReviewHref('production', branch, sha)).toBeNull();
  expect(auditReviewHref(undefined, branch, sha)).toBeNull();
  expect(auditReviewHref('preview', 'main', sha)).toBeNull();
  expect(auditReviewHref('preview', branch, '../wrong')).toBeNull();
  expect(auditReviewHref('preview', branch)).toBeNull();
});
