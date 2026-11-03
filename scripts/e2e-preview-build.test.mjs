import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReviewFixture, reviewFixtureRef } from './e2e-preview-build.mjs';
const sha = '8d490d6c84a09b538bbc2410e8ff824176adffa7';
test('historical fixture clones parent metadata and preserves real Git SHA while selecting only the frozen review label', () => {
  const env = Object.freeze({
    GITHUB_HEAD_REF: 'codex/az900-cloud-computing-consolidation',
    GITHUB_SHA: sha,
    CI: 'true',
  });
  let options;
  const result = buildReviewFixture({
    env,
    revision: () => sha,
    run: (exe, args, opts) => {
      assert.equal(exe, process.execPath);
      assert.deepEqual(args, ['scripts/next.mjs', 'build']);
      options = opts;
      return { status: 0 };
    },
  });
  assert.equal(env.GITHUB_HEAD_REF, 'codex/az900-cloud-computing-consolidation');
  assert.notEqual(options.env, env);
  assert.deepEqual(options.env, { ...env, GITHUB_HEAD_REF: reviewFixtureRef });
  assert.equal(result.exitCode, 0);
  assert.equal(result.provenance.candidateRevision, sha);
  assert.equal(result.provenance.gitShaEnvironmentUnchanged, true);
});
test('every hosted Vercel marker including empty values is rejected before a child or Git lookup', () => {
  for (const marker of [
    'VERCEL',
    'VERCEL_ENV',
    'VERCEL_GIT_COMMIT_SHA',
    'VERCEL_GIT_COMMIT_REF',
    'VERCEL_PROJECT_ID',
  ])
    for (const value of ['', 'preview', 'production'])
      assert.throws(
        () =>
          buildReviewFixture({
            env: { [marker]: value },
            revision: () => {
              assert.fail('must reject before reading Git');
            },
            run: () => {
              assert.fail('must not spawn hosted build');
            },
          }),
        /cannot build/,
      );
});
test('child failure signal and spawn failure cannot produce successful fixture provenance', () => {
  for (const child of [
    { status: 2 },
    { status: null, signal: 'SIGTERM' },
    { status: null, error: Error('no executable') },
  ]) {
    const result = buildReviewFixture({ env: {}, revision: () => sha, run: () => child });
    assert.notEqual(result.exitCode, 0);
    assert.equal(result.provenance.result, 'failed');
  }
});
test('unverifiable candidate revision cannot start a fixture build', () => {
  assert.throws(
    () =>
      buildReviewFixture({
        env: {},
        revision: () => '',
        run: () => assert.fail('must not spawn unbound build'),
      }),
    /candidate Git revision/,
  );
});
