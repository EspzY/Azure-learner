import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verifyDesktop } from './verify-desktop-ci.mjs';
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
  assert.equal(implementationPath('docs/DEVELOPMENT_WORKFLOW.md'), true);
  assert.equal(implementationPath('docs/PUBLIC_ACCESS_REVIEW.md'), true);
  assert.equal(implementationPath('docs/PROJECT_STATUS.md'), false);
});

test('official public Azure calculator sources are allowed by exact HTTPS host, not lookalike hosts', () => {
  const r = read();
  r.sources[0].url = 'https://azure.microsoft.com/pricing/calculator/';
  assert.deepEqual(validateQuality(r), []);
  for (const url of [
    'https://azure.microsoft.com.attacker.invalid/pricing',
    'http://azure.microsoft.com/pricing',
    'https://example.com/pricing',
  ]) {
    r.sources[0].url = url;
    assert.ok(validateQuality(r).some((e) => e.includes('official source')));
  }
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

test('approved full desktop evidence is candidate-bound; plans, selectors, pending and historical results cannot replace execution', () => {
  const record = read();
  record.review = { ...record.review, fingerprint: '1'.repeat(64) };
  const complete = {
    command: 'npm run test:e2e:desktop',
    result: 'passed',
    details: 'Executed full fixed command',
    scope: 'candidate-full-profile',
    commit: '2'.repeat(40),
    fingerprint: record.review.fingerprint,
  };
  const browserErrors = (entry) => {
    record.verification = [
      { command: 'npm run check', result: 'passed', details: 'Executed' },
      entry,
    ];
    return validateQuality(record, undefined, true).filter((error) =>
      error.includes('full browser profile'),
    );
  };
  assert.deepEqual(browserErrors(complete), []);
  assert.deepEqual(
    browserErrors({
      command: 'npm run test:e2e',
      result: 'passed',
      details: 'Executed full legacy profile',
    }),
    [],
  );
  for (const entry of [
    { ...complete, command: 'npm run test:e2e:plan' },
    { ...complete, command: 'npm run test:e2e:desktop -- --list' },
    { ...complete, command: 'npm run test:e2e:desktop -- --grep=one' },
    { ...complete, command: 'playwright test --project=desktop-chromium' },
    { ...complete, result: 'pending' },
    { ...complete, result: 'failed' },
    { ...complete, scope: 'historical-baseline' },
    { ...complete, fingerprint: '3'.repeat(64) },
    { ...complete, fingerprint: undefined },
    { ...complete, commit: 'unknown' },
    { ...complete, details: '' },
  ])
    assert.ok(browserErrors(entry).length, JSON.stringify(entry));
});

test('CI receipt owns the fixed full command, preserves child failure/signal and writes only a newly executed candidate success', () => {
  const writes = [],
    fingerprint = '4'.repeat(64),
    commit = '5'.repeat(40);
  const record = {
    review: { fingerprint },
    verification: [
      { command: 'npm run test:e2e:desktop', result: 'passed', scope: 'historical-baseline' },
    ],
  };
  const run = (result) => (command, args) => {
    assert.equal(command, 'npm');
    assert.deepEqual(args, ['run', 'test:e2e:desktop']);
    return result;
  };
  for (const child of [
    { status: 1 },
    { status: 23 },
    { status: null, signal: 'SIGTERM' },
    { status: null, error: Error('spawn denied') },
  ]) {
    const outcome = verifyDesktop({
      run: run(child),
      read: () => {
        throw Error('must not read/credit old evidence after failure');
      },
      write: (value) => writes.push(value),
    });
    assert.equal(outcome.exitCode, child.status || 1);
    assert.equal(outcome.signal, child.signal ?? null);
    assert.equal(outcome.receipt, null);
    assert.equal(writes.length, 0);
  }
  const outcome = verifyDesktop({
    run: run({ status: 0 }),
    read: () => record,
    write: (value) => writes.push(value),
    revision: () => commit,
  });
  assert.equal(outcome.exitCode, 0);
  assert.equal(writes.length, 1);
  assert.deepEqual(writes[0].verification, [outcome.receipt]);
  assert.equal(outcome.receipt.commit, commit);
  assert.equal(outcome.receipt.fingerprint, fingerprint);
  assert.equal(outcome.receipt.scope, 'candidate-full-profile');
  assert.throws(
    () =>
      verifyDesktop({
        run: run({ status: 0 }),
        read: () => record,
        write: () => assert.fail('unbound receipt'),
        revision: () => 'unknown',
      }),
    /Cannot bind/,
  );
});
