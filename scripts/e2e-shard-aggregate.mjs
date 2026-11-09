import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewFixtureRef } from './e2e-preview-build.mjs';
import {
  root,
  totalShards,
  evidenceRoot,
  aggregatePath,
  aggregateCommand,
  artifactName,
  executionIdentity,
  collectPlan,
  validateResults,
  readJson,
  writeJson,
  safeFile,
  safeDirectory,
  reportCases,
  fileHashes,
  sha,
  digest,
  equal,
  git,
  requireValue,
  configFile,
} from './e2e-shard-plan.mjs';

export function validateAttachments(report, manifest, bundle) {
  const original = manifest.bundlePath,
    suffix = `/${evidenceRoot}/${artifactName(manifest.identity, manifest.index)}`;
  requireValue(
    typeof original === 'string' && isAbsolute(original) && original.endsWith(suffix),
    'Invalid original bundle location',
  );
  const worktree = original.slice(0, -suffix.length),
    argv = report.config.argv;
  requireValue(report.config.rootDir === `${worktree}/tests/e2e`, 'Wrong report root directory');
  requireValue(
    Array.isArray(argv) &&
      argv.length === 9 &&
      argv[1] === `${worktree}/node_modules/@playwright/test/cli.js` &&
      equal(argv.slice(2), [
        'test',
        '--config',
        configFile,
        `--shard=${manifest.index}/${totalShards}`,
        '--reporter=list,json,html',
        '--output',
        `${original}/test-results`,
      ]),
    'Unexpected execution selectors/arguments',
  );
  requireValue(
    report.config.projects.every((p) => p.outputDir === `${original}/test-results`),
    'Wrong isolated test output directory',
  );
  for (const { test } of reportCases(report))
    for (const result of test.results) {
      requireValue(Array.isArray(result.attachments), 'Malformed attachment list');
      for (const attachment of result.attachments) {
        requireValue(
          attachment &&
            typeof attachment.name === 'string' &&
            attachment.name &&
            typeof attachment.contentType === 'string' &&
            attachment.contentType,
          'Malformed attachment',
        );
        if (attachment.path !== undefined) {
          requireValue(
            typeof attachment.path === 'string' &&
              attachment.path &&
              !attachment.path.includes('\\'),
            'Malformed attachment path',
          );
          const local = relative(
            original,
            isAbsolute(attachment.path) ? attachment.path : resolve(original, attachment.path),
          );
          requireValue(
            local &&
              !local.startsWith('..') &&
              !isAbsolute(local) &&
              typeof manifest.files[local] === 'string',
            'Missing/outside/unhashed report attachment',
          );
          safeFile(bundle, local);
        } else requireValue(typeof attachment.body === 'string', 'Missing attachment content');
      }
    }
}

export function verifyBundles({ folder, identity, plan }) {
  const parent = safeDirectory(folder, evidenceRoot),
    expectedNames = Array.from({ length: totalShards }, (_, i) => artifactName(identity, i + 1)),
    names = readdirSync(parent)
      .filter((name) => name !== 'aggregate.json')
      .sort();
  requireValue(
    equal(names, [...expectedNames].sort()),
    'Missing/duplicate/foreign shard artifact directories',
  );
  const artifacts = [],
    counts = { cases: 0, passed: 0, flaky: 0, attempts: 0 };
  for (let index = 1; index <= totalShards; index++) {
    const name = artifactName(identity, index),
      bundle = safeDirectory(parent, name),
      manifestPath = safeFile(bundle, 'manifest.json'),
      manifest = readJson(manifestPath);
    requireValue(
      manifest.schema === 1 &&
        manifest.status === 'passed' &&
        manifest.index === index &&
        manifest.total === totalShards,
      'Unsuccessful/wrong shard manifest',
    );
    requireValue(equal(manifest.identity, identity), 'Stale/foreign shard execution identity');
    requireValue(
      manifest.planDigest === plan.digest && manifest.shardDigest === plan.shards[index - 1].digest,
      'Wrong full/shard plan digest',
    );
    requireValue(
      manifest.process?.status === 0 &&
        manifest.process.signal === null &&
        manifest.process.error === null,
      'Failed/signalled shard process',
    );
    const fixture = manifest.fixture;
    requireValue(
      fixture?.result === 'built' &&
        fixture.candidateRevision === identity.commit &&
        fixture.historicalReviewFixtureRef === reviewFixtureRef &&
        fixture.gitShaEnvironmentUnchanged === true &&
        fixture.actualHeadRef === identity.headRef,
      'Wrong historical fixture provenance',
    );
    requireValue(
      equal(manifest.files, fileHashes(bundle, ['manifest.json'])),
      'Missing/tampered/unexpected artifact bytes',
    );
    for (const path of ['results.json', 'raw.log', 'fixture.json', 'plan.json', 'html/index.html'])
      requireValue(
        typeof manifest.files[path] === 'string',
        `Missing required shard output: ${path}`,
      );
    requireValue(
      equal(readJson(safeFile(bundle, 'plan.json')), plan),
      'Stored shard plan is stale',
    );
    const actualFixture = readJson(safeFile(bundle, 'fixture.json'));
    requireValue(
      actualFixture.exitCode === 0 &&
        actualFixture.signal === null &&
        equal(actualFixture.provenance, fixture),
      'Tampered fixture result',
    );
    const reportPath = safeFile(bundle, 'results.json'),
      report = readJson(reportPath),
      actual = validateResults(report, plan, index);
    validateAttachments(report, manifest, bundle);
    requireValue(
      report.config.version === identity.toolchain.playwright,
      'Wrong report Playwright version',
    );
    requireValue(equal(actual, manifest.counts), 'Forged shard result counts');
    for (const key of Object.keys(counts)) counts[key] += actual[key];
    artifacts.push({
      name,
      index,
      manifestDigest: sha(readFileSync(manifestPath)),
      reportDigest: sha(readFileSync(reportPath)),
    });
  }
  requireValue(counts.cases === plan.cases.length, 'Incomplete aggregate case coverage');
  return { artifacts, counts };
}

function prerequisites(env, identity) {
  const result = {
    checkResult: env.CHECK_RESULT,
    browserResult: env.BROWSER_RESULT,
    checkedRevision: env.CHECKED_REVISION,
    checkedAttempt: env.CHECKED_ATTEMPT,
  };
  requireValue(
    result.checkResult === 'success' && result.browserResult === 'success',
    'Every prerequisite job must succeed',
  );
  requireValue(
    result.checkedRevision === identity.commit && result.checkedAttempt === identity.runAttempt,
    'Prerequisite SHA/attempt mismatch',
  );
  return result;
}

/** Strict release calls this synchronously; production always reads real HEAD,
 * current source bytes, new collections, and every original execution report. */
export function validateAggregateReceipt(
  receipt,
  {
    record,
    folder = root,
    commit,
    env = process.env,
    identify = executionIdentity,
    collect = collectPlan,
  } = {},
) {
  try {
    requireValue(
      receipt?.command === aggregateCommand &&
        receipt.result === 'passed' &&
        receipt.scope === 'candidate-full-profile',
      'Wrong aggregate receipt kind',
    );
    requireValue(
      typeof receipt.details === 'string' && receipt.details.trim(),
      'Missing execution details',
    );
    const actual = git(folder, 'rev-parse', 'HEAD');
    requireValue(
      (commit === undefined || commit === actual) && receipt.commit === actual,
      'Aggregate receipt is not actual HEAD',
    );
    requireValue(
      receipt.fingerprint === record?.review?.fingerprint &&
        /^[a-f0-9]{64}$/.test(receipt.fingerprint ?? ''),
      'Wrong aggregate review fingerprint',
    );
    requireValue(receipt.evidence?.path === aggregatePath, 'Wrong aggregate evidence path');
    const file = safeFile(folder, aggregatePath);
    requireValue(
      sha(readFileSync(file)) === receipt.evidence.sha256,
      'Aggregate evidence digest mismatch',
    );
    const identity = identify(folder, record, {
        ...env,
        LAB_CI_BASE: env.LAB_CI_BASE ?? record.baseCommit,
      }),
      plan = collect(folder, env),
      evidence = readJson(file);
    requireValue(
      evidence.schema === 1 &&
        evidence.status === 'passed' &&
        equal(evidence.identity, identity) &&
        equal(evidence.plan, plan),
      'Stale aggregate identity/plan',
    );
    const admission = evidence.prerequisites;
    requireValue(
      admission?.checkResult === 'success' &&
        admission.browserResult === 'success' &&
        admission.checkedRevision === actual &&
        admission.checkedAttempt === identity.runAttempt,
      'Aggregate prerequisite evidence invalid',
    );
    const verified = verifyBundles({ folder, identity, plan });
    requireValue(
      equal(verified.artifacts, evidence.artifacts) && equal(verified.counts, evidence.counts),
      'Forged aggregate artifacts/counts',
    );
    requireValue(
      receipt.planDigest === plan.digest &&
        receipt.totalShards === totalShards &&
        receipt.cases === verified.counts.cases &&
        receipt.provenanceDigest === digest(identity),
      'Forged aggregate receipt totals/provenance',
    );
    return [];
  } catch (error) {
    return [`Invalid aggregate browser evidence: ${error.message}`];
  }
}

export function aggregateShards({
  folder = root,
  env = process.env,
  identify = executionIdentity,
  collect = collectPlan,
} = {}) {
  const recordPath = resolve(folder, 'quality/releases/current.json'),
    record = readJson(recordPath),
    identity = identify(folder, record, env),
    admission = prerequisites(env, identity),
    plan = collect(folder, env),
    verified = verifyBundles({ folder, identity, plan }),
    target = resolve(folder, aggregatePath);
  requireValue(!existsSync(target), 'Refusing to reuse aggregate evidence');
  const evidence = {
    schema: 1,
    status: 'passed',
    identity,
    plan,
    prerequisites: admission,
    ...verified,
  };
  writeJson(target, evidence);
  const receipt = {
    command: aggregateCommand,
    result: 'passed',
    scope: 'candidate-full-profile',
    commit: identity.commit,
    fingerprint: identity.fingerprint,
    evidence: { path: aggregatePath, sha256: sha(readFileSync(target)) },
    planDigest: plan.digest,
    provenanceDigest: digest(identity),
    totalShards,
    cases: verified.counts.cases,
    details: `All ${totalShards} same-run/same-attempt shard processes passed, with an exact disjoint union of ${verified.counts.cases} required cases. ${verified.counts.flaky} cases recovered under the unchanged retry policy. Strict release and final CI conclusion remain separate.`,
  };
  const checkReceipt = {
    command: 'npm run check',
    result: 'passed',
    scope: 'candidate-ci-check',
    commit: identity.commit,
    fingerprint: identity.fingerprint,
    repository: identity.repository,
    baseCommit: identity.base,
    runId: identity.runId,
    runAttempt: identity.runAttempt,
    evidence: receipt.evidence,
    details:
      'The mandatory GitHub check job successfully executed the literal npm run check and npm audit --audit-level=high on this actual SHA and current run attempt. Its successful same-SHA/current-attempt prerequisite and the complete browser shard union were validated before this CI execution receipt was written; no local check pass is inferred.',
  };
  writeJson(recordPath, {
    ...record,
    verification: [
      ...(record.verification ?? []).filter(
        (entry) => ![aggregateCommand, 'npm run check'].includes(entry.command),
      ),
      checkReceipt,
      receipt,
    ],
  });
  return { receipt, checkReceipt, evidence };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    requireValue(process.argv.length === 2, 'Aggregate accepts no command-line overrides');
    const { receipt, checkReceipt } = aggregateShards();
    process.stdout.write('Candidate CI check receipt: ' + JSON.stringify(checkReceipt) + '\n');
    process.stdout.write('Aggregate candidate browser receipt: ' + JSON.stringify(receipt) + '\n');
  } catch (error) {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  }
}
