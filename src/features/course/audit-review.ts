// Review-only navigation. This never participates in curriculum or learner evidence.
export function auditReviewHref(environment?: string, branch?: string, sha?: string) {
  if (
    environment !== 'preview' ||
    branch !== 'codex/az900-curriculum-audit' ||
    !sha ||
    !/^[a-f0-9]{40}$/.test(sha)
  )
    return null;
  return `https://github.com/EspzY/Azure-learner/blob/${sha}/docs/AZ900_COVERAGE_MATRIX.md`;
}
