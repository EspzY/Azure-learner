import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  validateQuality,
  validateSnapshot,
  fingerprint,
  implementationPath,
} from './quality-check.mjs';
const read = () =>
  JSON.parse(
    readFileSync(new URL('../quality/fixtures/valid-release.json', import.meta.url), 'utf8'),
  );
test('seven gates bind real source, manuscript, model, assessment and test files', () => {
  assert.deepEqual(validateQuality(read()), []);
  assert.deepEqual(
    validateQuality(
      JSON.parse(
        readFileSync(new URL('../quality/releases/current.json', import.meta.url), 'utf8'),
      ),
    ),
    [],
  );
  assert.equal(implementationPath('src/content/nb.ts'), true);
  assert.equal(implementationPath('docs/QUALITY_CONTRACT.md'), true);
  assert.equal(implementationPath('docs/PROJECT_STATUS.md'), false);
});
test('a missing manuscript layer, hidden missing file or blocked-only source cannot pass', () => {
  const r = read();
  r.scope.kind = 'new-module';
  r.activities[0].theory = [{ path: 'src/missing-content.ts' }];
  r.sources.find((s) => s.id === 'Q-POLICY').availability = 'BLOCKED';
  assert.ok(validateQuality(r).some((e) => e.includes('manuscript')));
  assert.ok(validateQuality(r).some((e) => e.includes('missing/unsafe')));
  assert.ok(validateQuality(r).some((e) => e.includes('no available mapped source')));
});

test('malformed collections fail closed rather than masquerading as structured coverage', () => {
  for (const malformed of [null, { ...read(), sources: 'source list' }])
    assert.ok(validateQuality(malformed).length > 0);
  const r = read();
  r.sources[0].objectives = 'G03';
  assert.ok(validateQuality(r).length > 0);
  r.gates.source.checks = 'evidence';
  assert.ok(validateQuality(r).length > 0);
});
test('stale, wrong-base or unreviewed changed files cannot reuse final approval', () => {
  const r = read(),
    files = { 'src/content/nb.ts': 'original' };
  r.snapshot = { files };
  r.review = { fingerprint: fingerprint(r, files) };
  assert.deepEqual(validateSnapshot(r, files, r.baseCommit), []);
  assert.ok(
    validateSnapshot(r, { ...files, 'src/new-code.ts': 'new' }, r.baseCommit).some((e) =>
      e.includes('stale'),
    ),
  );
  assert.ok(validateSnapshot(r, files, '0'.repeat(40)).some((e) => e.includes('base')));
  r.activities[0].limits = 'changed source/claim contract';
  assert.ok(validateSnapshot(r, files, r.baseCommit).some((e) => e.includes('stale')));
});

test('root configuration and unknown executable-only PRs cannot bypass snapshot/base checks', () => {
  const r = read();
  const previous = { 'src/content/nb.ts': 'reviewed' };
  r.snapshot = { files: previous };
  r.review = { fingerprint: fingerprint(r, previous) };
  for (const path of [
    'postcss.config.mjs',
    '.npmrc',
    'future.config.cjs',
    'docs/quality/executable.js',
  ]) {
    assert.equal(implementationPath(path), true, path);
    const changed = { [path]: 'new unreviewed configuration' };
    assert.ok(validateSnapshot(r, changed, '0'.repeat(40)).some((e) => e.includes('stale')));
    assert.ok(validateSnapshot(r, changed, '0'.repeat(40)).some((e) => e.includes('base')));
  }
});
test('self-review, pre-implementation audit, unresolved blockers and fake human approval fail closed', () => {
  const r = read();
  r.implementationFinished = '2026-10-26T20:00:00Z';
  r.visualEvidence = [];
  r.verification = [];
  r.review = {
    status: 'complete',
    reviewer: { id: r.author, kind: 'agent' },
    started: '2026-10-26T19:00:00Z',
    findings: [
      { id: 'F1', severity: 'blocker', status: 'accepted-limitation', description: 'unfixed' },
    ],
  };
  r.humanReview.sme = true;
  const errors = validateQuality(r, undefined, true);
  for (const text of [
    'Separate',
    'follow finished',
    'blocker remains',
    'human approval',
    'six final review',
    'visual evidence',
    'executed',
  ])
    assert.ok(
      errors.some((e) => e.includes(text)),
      text,
    );
});
