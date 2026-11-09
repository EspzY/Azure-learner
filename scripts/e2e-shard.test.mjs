import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  renameSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  assemblePlan,
  validateResults,
  artifactName,
  evidenceRoot,
  aggregatePath,
  aggregateCommand,
  configFile,
  fileHashes,
  writeJson,
  readJson,
  sha,
  git,
  safeFile,
  executionIdentity,
  root as sourceRoot,
} from './e2e-shard-plan.mjs';
import {
  verifyBundles,
  aggregateShards,
  validateAggregateReceipt,
} from './e2e-shard-aggregate.mjs';
import { runShard } from './e2e-shard-runner.mjs';
import { reviewFixtureRef } from './e2e-preview-build.mjs';

const clone = (value) => structuredClone(value),
  version = '1.64.1';
function report(indices, index = null, executed = false) {
  const cases = indices.map((n) => ({
    title: `case ${n}`,
    file: 'cases.spec.ts',
    ok: true,
    tests: [
      {
        timeout: 30000,
        projectName: n < 3 ? 'desktop-chromium' : 'compact-chromium',
        expectedStatus: 'passed',
        status: executed ? 'expected' : 'skipped',
        results: executed
          ? [{ retry: 0, status: 'passed', duration: 1, errors: [], attachments: [] }]
          : [],
      },
    ],
  }));
  return {
    config: {
      version,
      workers: 1,
      forbidOnly: true,
      fullyParallel: true,
      globalTimeout: 0,
      maxFailures: 0,
      failOnFlakyTests: false,
      shard: index === null ? null : { current: index, total: 4 },
      projects: ['desktop-chromium', 'compact-chromium'].map((name) => ({
        name,
        retries: 2,
        repeatEach: 1,
        timeout: 30000,
      })),
    },
    errors: [],
    suites: [{ title: 'cases.spec.ts', specs: cases }],
    stats: {
      expected: executed ? indices.length : 0,
      flaky: 0,
      unexpected: 0,
      skipped: executed ? 0 : indices.length,
      duration: 1,
    },
  };
}
const makePlan = () =>
  assemblePlan([report([1, 2, 3, 4]), ...[1, 2, 3, 4].map((n) => report([n], n))]);
function fixture() {
  const folder = mkdtempSync(resolve(tmpdir(), 'azurelab-shards-'));
  execFileSync('git', ['init', '-q'], { cwd: folder });
  writeFileSync(resolve(folder, 'tracked.txt'), 'fixed input\n');
  execFileSync('git', ['add', 'tracked.txt'], { cwd: folder });
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '-qm',
      'fixture',
    ],
    { cwd: folder },
  );
  const commit = git(folder, 'rev-parse', 'HEAD'),
    plan = makePlan();
  const record = {
    id: 'technical-fixture',
    baseCommit: commit,
    review: { status: 'complete', fingerprint: 'f'.repeat(64) },
    verification: [
      { command: 'npm run check', result: 'pending', details: 'CI prerequisite pending' },
    ],
  };
  const identity = {
    commit,
    base: commit,
    repository: 'example/repo',
    runId: '123',
    runAttempt: '2',
    headRef: 'candidate',
    workflowRef: 'example/repo/.github/workflows/ci.yml@refs/pull/1/merge',
    workflowSha: commit,
    releaseId: record.id,
    fingerprint: record.review.fingerprint,
    source: { tree: 'a'.repeat(40), digest: 'b'.repeat(64) },
    configuration: 'c'.repeat(64),
    toolchain: { playwright: version, node: process.version, browserRegistry: 'd'.repeat(64) },
  };
  const env = {
    CI: 'true',
    GITHUB_SHA: commit,
    GITHUB_RUN_ID: '123',
    GITHUB_RUN_ATTEMPT: '2',
    GITHUB_REPOSITORY: 'example/repo',
    LAB_CI_BASE: commit,
    CHECK_RESULT: 'success',
    BROWSER_RESULT: 'success',
    CHECKED_REVISION: commit,
    CHECKED_ATTEMPT: '2',
  };
  writeJson(resolve(folder, 'quality/releases/current.json'), record);
  const identify = () => clone(identity),
    collect = () => clone(plan);
  function makeBundle(index) {
    const name = artifactName(identity, index),
      bundle = resolve(folder, evidenceRoot, name),
      result = report([index], index, true);
    mkdirSync(bundle, { recursive: true });
    const original = `/original/checkout/${evidenceRoot}/${name}`;
    result.config.rootDir = '/original/checkout/tests/e2e';
    result.config.argv = [
      '/node',
      '/original/checkout/node_modules/@playwright/test/cli.js',
      'test',
      '--config',
      configFile,
      `--shard=${index}/4`,
      '--reporter=list,json,html',
      '--output',
      `${original}/test-results`,
    ];
    for (const project of result.config.projects) project.outputDir = `${original}/test-results`;
    const fixtureResult = {
      exitCode: 0,
      signal: null,
      provenance: {
        result: 'built',
        candidateRevision: commit,
        historicalReviewFixtureRef: reviewFixtureRef,
        actualHeadRef: identity.headRef,
        gitShaEnvironmentUnchanged: true,
      },
    };
    writeJson(resolve(bundle, 'results.json'), result);
    writeJson(resolve(bundle, 'plan.json'), plan);
    writeJson(resolve(bundle, 'fixture.json'), fixtureResult);
    writeFileSync(resolve(bundle, 'raw.log'), 'actual fixture execution\n');
    mkdirSync(resolve(bundle, 'html'));
    writeFileSync(resolve(bundle, 'html/index.html'), '<html>report</html>');
    const manifest = {
      schema: 1,
      status: 'passed',
      index,
      total: 4,
      bundlePath: original,
      identity,
      planDigest: plan.digest,
      shardDigest: plan.shards[index - 1].digest,
      fixture: fixtureResult.provenance,
      process: { status: 0, signal: null, error: null },
      counts: validateResults(result, plan, index),
      files: fileHashes(bundle),
    };
    writeJson(resolve(bundle, 'manifest.json'), manifest);
    return bundle;
  }
  const bundles = [1, 2, 3, 4].map(makeBundle);
  const options = { folder, env, identify, collect };
  return {
    ...options,
    record,
    identity,
    plan,
    bundles,
    close: () => rmSync(folder, { recursive: true, force: true }),
  };
}
function mutateBundle(f, change) {
  const bundle = f.bundles[0],
    manifest = readJson(resolve(bundle, 'manifest.json')),
    result = readJson(resolve(bundle, 'results.json'));
  change({ bundle, manifest, result });
  writeJson(resolve(bundle, 'results.json'), result);
  manifest.files = fileHashes(bundle, ['manifest.json']);
  writeJson(resolve(bundle, 'manifest.json'), manifest);
}

test('planner requires exact disjoint identities, expected status, projects and unchanged settings', () => {
  assert.equal(makePlan().cases.length, 4);
  for (const change of [
    (r) => r.pop(),
    (r) => {
      r[2] = clone(r[1]);
      r[2].config.shard.current = 2;
    },
    (r) => {
      r[1].suites[0].specs[0].tests[0].expectedStatus = 'skipped';
    },
    (r) => {
      r[1].config.workers = 2;
    },
    (r) => {
      r[1].config.projects[0].retries = 3;
    },
    (r) => {
      r[1].config.projects[0].timeout = 60000;
    },
    (r) => {
      r[1].config.shard.total = 3;
    },
  ]) {
    const reports = [report([1, 2, 3, 4]), ...[1, 2, 3, 4].map((n) => report([n], n))];
    change(reports);
    assert.throws(() => assemblePlan(reports));
  }
});

test('actual four bundles create an explicit candidate receipt; strict revalidation is read-only and rejects stale/forged receipt fields', () => {
  const f = fixture();
  try {
    const originalPath = resolve(f.folder, 'quality/releases/current.json'),
      original = readJson(originalPath);
    original.verification.push(
      { command: 'npm run check', result: 'passed', scope: 'historical-baseline' },
      { command: aggregateCommand, result: 'passed', scope: 'historical-baseline' },
    );
    writeJson(originalPath, original);
    const { receipt, checkReceipt } = aggregateShards(f),
      before = fileHashes(resolve(f.folder, evidenceRoot));
    assert.deepEqual(checkReceipt, {
      command: 'npm run check',
      result: 'passed',
      scope: 'candidate-ci-check',
      commit: f.identity.commit,
      fingerprint: f.identity.fingerprint,
      repository: f.identity.repository,
      baseCommit: f.identity.base,
      runId: f.identity.runId,
      runAttempt: f.identity.runAttempt,
      evidence: receipt.evidence,
      details: checkReceipt.details,
    });
    assert.match(checkReceipt.details, /literal npm run check and npm audit --audit-level=high/);
    assert.deepEqual(readJson(originalPath).verification, [checkReceipt, receipt]);
    const options = {
      ...f,
      record: readJson(resolve(f.folder, 'quality/releases/current.json')),
      commit: f.identity.commit,
    };
    assert.deepEqual(validateAggregateReceipt(receipt, options), []);
    assert.deepEqual(fileHashes(resolve(f.folder, evidenceRoot)), before);
    assert.equal(receipt.cases, 4);
    for (const mutation of [
      { cases: 3 },
      { commit: '1'.repeat(40) },
      { fingerprint: '2'.repeat(64) },
      { planDigest: '3'.repeat(64) },
      { provenanceDigest: '4'.repeat(64) },
      { scope: 'candidate-shard' },
      { details: '' },
      { evidence: { ...receipt.evidence, sha256: '5'.repeat(64) } },
      { evidence: { ...receipt.evidence, path: '../aggregate.json' } },
    ])
      assert.ok(validateAggregateReceipt({ ...receipt, ...mutation }, options).length);
    const path = resolve(f.folder, aggregatePath),
      value = readJson(path);
    value.counts.cases = 3;
    writeJson(path, value);
    assert.ok(
      validateAggregateReceipt(
        { ...receipt, evidence: { ...receipt.evidence, sha256: sha(readFileSync(path)) } },
        options,
      ).length,
      'rehashing forged counts must not pass',
    );
  } finally {
    f.close();
  }
});

test('each execution identity field and prerequisite result/attempt fail closed', () => {
  for (const field of [
    'commit',
    'base',
    'repository',
    'runId',
    'runAttempt',
    'fingerprint',
    'source',
    'configuration',
    'toolchain',
  ]) {
    const f = fixture();
    try {
      mutateBundle(f, ({ manifest }) => {
        manifest.identity[field] = 'foreign';
      });
      assert.throws(() => verifyBundles(f), /identity/);
    } finally {
      f.close();
    }
  }
  for (const [field, value] of [
    ['CHECK_RESULT', 'failure'],
    ['CHECK_RESULT', 'skipped'],
    ['CHECK_RESULT', 'cancelled'],
    ['BROWSER_RESULT', 'failure'],
    ['BROWSER_RESULT', 'skipped'],
    ['BROWSER_RESULT', 'cancelled'],
    ['CHECKED_REVISION', 'f'.repeat(40)],
    ['CHECKED_ATTEMPT', '1'],
  ]) {
    const f = fixture();
    try {
      const before = readFileSync(resolve(f.folder, 'quality/releases/current.json'));
      assert.throws(() => aggregateShards({ ...f, env: { ...f.env, [field]: value } }));
      assert.deepEqual(readFileSync(resolve(f.folder, 'quality/releases/current.json')), before);
    } finally {
      f.close();
    }
  }
});

test('missing, duplicate, extra, failed, signalled, tampered and truncated artifact reports cannot aggregate', () => {
  const mutations = [
    ({ manifest }) => {
      manifest.status = 'failed';
    },
    ({ manifest }) => {
      manifest.index = 2;
    },
    ({ manifest }) => {
      manifest.process.signal = 'SIGTERM';
    },
    ({ manifest }) => {
      manifest.process.status = 1;
    },
    ({ manifest }) => {
      manifest.counts.cases = 99;
    },
    ({ manifest }) => {
      manifest.fixture.candidateRevision = '0'.repeat(40);
    },
    ({ result }) => {
      result.suites[0].specs = [];
      result.stats.expected = 0;
    },
    ({ result }) => {
      result.suites[0].specs.push(clone(result.suites[0].specs[0]));
    },
    ({ result }) => {
      result.suites[0].specs[0].tests[0].status = 'skipped';
    },
    ({ result }) => {
      result.suites[0].specs[0].tests[0].results[0].status = 'interrupted';
    },
    ({ result }) => {
      result.stats.expected = 77;
    },
    ({ result }) => {
      result.errors.push({ message: 'worker error' });
    },
    ({ result }) => {
      result.config.argv.push('--grep=one');
    },
  ];
  for (const change of mutations) {
    const f = fixture();
    try {
      const before = readFileSync(resolve(f.folder, 'quality/releases/current.json'));
      mutateBundle(f, change);
      assert.throws(() => verifyBundles(f));
      assert.throws(() => aggregateShards(f));
      assert.deepEqual(readFileSync(resolve(f.folder, 'quality/releases/current.json')), before);
    } finally {
      f.close();
    }
  }
  for (const action of ['missing', 'extra', 'tampered', 'truncated']) {
    const f = fixture();
    try {
      const before = readFileSync(resolve(f.folder, 'quality/releases/current.json'));
      if (action === 'missing') rmSync(f.bundles[0], { recursive: true });
      if (action === 'extra') mkdirSync(resolve(f.folder, evidenceRoot, 'browser-123-2-5'));
      if (action === 'tampered') writeFileSync(resolve(f.bundles[0], 'raw.log'), 'changed');
      if (action === 'truncated') {
        writeFileSync(resolve(f.bundles[0], 'results.json'), '{');
        const m = readJson(resolve(f.bundles[0], 'manifest.json'));
        m.files = fileHashes(f.bundles[0], ['manifest.json']);
        writeJson(resolve(f.bundles[0], 'manifest.json'), m);
      }
      assert.throws(() => verifyBundles(f));
      assert.throws(() => aggregateShards(f));
      assert.deepEqual(readFileSync(resolve(f.folder, 'quality/releases/current.json')), before);
    } finally {
      f.close();
    }
  }
});

test('retry recovery remains valid only with all actual trace attachments present and hashed', () => {
  const f = fixture();
  try {
    mutateBundle(f, ({ bundle, manifest, result }) => {
      const item = result.suites[0].specs[0].tests[0];
      mkdirSync(resolve(bundle, 'test-results'));
      writeFileSync(resolve(bundle, 'test-results/trace.zip'), 'trace bytes');
      item.results.unshift({
        retry: 0,
        status: 'failed',
        duration: 1,
        attachments: [
          {
            name: 'trace',
            contentType: 'application/zip',
            path: `${manifest.bundlePath}/test-results/trace.zip`,
          },
        ],
      });
      item.results[1].retry = 1;
      item.status = 'flaky';
      result.stats.expected = 0;
      result.stats.flaky = 1;
      manifest.counts = validateResults(result, f.plan, 1);
    });
    assert.equal(verifyBundles(f).counts.flaky, 1);
    mutateBundle(f, ({ result }) => {
      result.suites[0].specs[0].tests[0].results[0].attachments[0].path += '.missing';
    });
    assert.throws(() => verifyBundles(f), /attachment/);
  } finally {
    f.close();
  }
  for (const change of [
    (r) => {
      r.attachments = {};
    },
    (r) => {
      r.attachments = [
        { name: 'trace', contentType: 'application/zip', path: '/outside/trace.zip' },
      ];
    },
    (r) => {
      r.attachments = [{ name: 'trace', contentType: 'application/zip', path: '' }];
    },
  ]) {
    const x = fixture();
    try {
      mutateBundle(x, ({ result }) => change(result.suites[0].specs[0].tests[0].results[0]));
      assert.throws(() => verifyBundles(x), /attachment/);
    } finally {
      x.close();
    }
  }
});

test('symlink bundle root, evidence ancestor and nested file ancestors are rejected', () => {
  for (const level of ['bundle', 'parent']) {
    const f = fixture();
    try {
      const target = level === 'bundle' ? f.bundles[0] : resolve(f.folder, evidenceRoot),
        saved = resolve(f.folder, `saved-${level}`);
      renameSync(target, saved);
      symlinkSync(saved, target, 'dir');
      assert.throws(() => verifyBundles(f), /Symlink/);
    } finally {
      f.close();
    }
  }
  const f = fixture();
  try {
    const path = resolve(f.folder, 'nested');
    symlinkSync(dirname(f.bundles[0]), path, 'dir');
    assert.throws(
      () => safeFile(f.folder, `nested/${artifactName(f.identity, 1)}/raw.log`),
      /Symlink/,
    );
  } finally {
    f.close();
  }
});

test('production identity requires CI/event/base/run/attempt and detects raw source or untracked edits', () => {
  const f = fixture();
  try {
    for (const [key, value] of [
      ['CI', 'false'],
      ['GITHUB_SHA', '0'.repeat(40)],
      ['LAB_CI_BASE', '0'.repeat(40)],
      ['GITHUB_RUN_ID', ''],
      ['GITHUB_RUN_ATTEMPT', '0'],
      ['GITHUB_REPOSITORY', '../foreign'],
    ])
      assert.throws(() => executionIdentity(f.folder, f.record, { ...f.env, [key]: value }));
    const configPaths = [
      'package.json',
      'package-lock.json',
      'playwright.config.ts',
      configFile,
      'scripts/e2e-plan-check.mjs',
      'scripts/e2e-preview-build.mjs',
      'scripts/next.mjs',
    ];
    for (const path of configPaths) {
      mkdirSync(dirname(resolve(f.folder, path)), { recursive: true });
      writeFileSync(resolve(f.folder, path), '{}\n');
    }
    writeFileSync(resolve(f.folder, '.gitignore'), '.artifacts/\nnode_modules\n');
    symlinkSync(resolve(sourceRoot, 'node_modules'), resolve(f.folder, 'node_modules'), 'dir');
    execFileSync('git', ['add', '.'], { cwd: f.folder });
    execFileSync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.invalid',
        'commit',
        '-qm',
        'reviewed inputs',
      ],
      { cwd: f.folder },
    );
    const commit = git(f.folder, 'rev-parse', 'HEAD'),
      env = { ...f.env, GITHUB_SHA: commit, CHECKED_REVISION: commit };
    assert.equal(executionIdentity(f.folder, f.record, env).commit, commit);
    writeFileSync(resolve(f.folder, 'tracked.txt'), 'changed');
    assert.throws(() => executionIdentity(f.folder, f.record, env), /Uncommitted/);
    writeFileSync(resolve(f.folder, 'tracked.txt'), 'fixed input\n');
    writeFileSync(resolve(f.folder, 'unreviewed.mjs'), 'export const changed = true;');
    assert.throws(() => executionIdentity(f.folder, f.record, env), /Untracked/);
  } finally {
    f.close();
  }
});

test('a successful runner validates reports and diagnostics while leaving release verification untouched', async () => {
  const f = fixture();
  try {
    rmSync(resolve(f.folder, evidenceRoot), { recursive: true });
    const before = readFileSync(resolve(f.folder, 'quality/releases/current.json'));
    const outcome = await runShard({
      ...f,
      env: { ...f.env, LAB_CI_SHARD: '1' },
      build: () => ({
        exitCode: 0,
        signal: null,
        provenance: {
          result: 'built',
          candidateRevision: f.identity.commit,
          historicalReviewFixtureRef: reviewFixtureRef,
          actualHeadRef: f.identity.headRef,
          gitShaEnvironmentUnchanged: true,
        },
      }),
      run: async (command, args, options) => {
        const output = options.env.PLAYWRIGHT_JSON_OUTPUT_FILE,
          result = report([1], 1, true);
        result.config.rootDir = `${options.cwd}/tests/e2e`;
        result.config.argv = [command, resolve(options.cwd, args[0]), ...args.slice(1)];
        for (const project of result.config.projects) project.outputDir = args.at(-1);
        writeJson(output, result);
        mkdirSync(options.env.PLAYWRIGHT_HTML_OUTPUT_DIR);
        writeFileSync(
          resolve(options.env.PLAYWRIGHT_HTML_OUTPUT_DIR, 'index.html'),
          '<html>report</html>',
        );
        return { status: 0, signal: null, error: null };
      },
    });
    assert.equal(outcome.exitCode, 0);
    assert.equal(outcome.manifest.status, 'passed');
    assert.equal(outcome.manifest.counts.cases, 1);
    assert.deepEqual(readFileSync(resolve(f.folder, 'quality/releases/current.json')), before);
  } finally {
    f.close();
  }
});

test('production CLIs reject selectors before any CI execution', () => {
  for (const name of ['runner', 'aggregate']) {
    const outcome = spawnSync(
      process.execPath,
      [resolve(sourceRoot, `scripts/e2e-shard-${name}.mjs`), '--grep=one'],
      { encoding: 'utf8', timeout: 30000 },
    );
    assert.notEqual(outcome.status, 0);
    assert.match(outcome.stderr, /no command-line/);
  }
});

test('runner owns fixed selectors and writes diagnostic failure only; it cannot mint any full-profile receipt', async () => {
  for (const child of [
    { status: 1, signal: null, error: null },
    { status: null, signal: 'SIGTERM', error: null },
    { status: null, signal: null, error: 'spawn failed' },
  ]) {
    const f = fixture();
    try {
      rmSync(resolve(f.folder, evidenceRoot), { recursive: true });
      const before = readFileSync(resolve(f.folder, 'quality/releases/current.json'));
      const outcome = await runShard({
        ...f,
        env: { ...f.env, LAB_CI_SHARD: '1' },
        build: () => ({
          exitCode: 0,
          signal: null,
          provenance: {
            result: 'built',
            candidateRevision: f.identity.commit,
            historicalReviewFixtureRef: reviewFixtureRef,
            actualHeadRef: f.identity.headRef,
            gitShaEnvironmentUnchanged: true,
          },
        }),
        run: async (_command, args, options) => {
          assert.deepEqual(args.slice(1, 7), [
            'test',
            '--config',
            configFile,
            '--shard=1/4',
            '--reporter=list,json,html',
            '--output',
          ]);
          assert.ok(options.env.PLAYWRIGHT_JSON_OUTPUT_FILE.startsWith(options.cwd));
          return child;
        },
      });
      assert.notEqual(outcome.exitCode, 0);
      assert.equal(outcome.manifest.status, 'failed');
      assert.deepEqual(readFileSync(resolve(f.folder, 'quality/releases/current.json')), before);
    } finally {
      f.close();
    }
  }
});
