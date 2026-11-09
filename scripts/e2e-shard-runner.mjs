import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, existsSync, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewFixture, reviewFixtureRef } from './e2e-preview-build.mjs';
import { validateAttachments } from './e2e-shard-aggregate.mjs';
import {
  root,
  totalShards,
  configFile,
  evidenceRoot,
  artifactName,
  executionIdentity,
  collectPlan,
  validateResults,
  readJson,
  writeJson,
  fileHashes,
  equal,
  requireValue,
} from './e2e-shard-plan.mjs';

/** Tee actual output immediately, including failures preceding a job timeout. */
export function captureProcess(command, args, { cwd, env, logPath }) {
  return new Promise((resolveResult) => {
    const log = createWriteStream(logPath, { flags: 'a' }),
      child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let interrupted = null,
      error = null;
    const handlers = Object.fromEntries(
      ['SIGINT', 'SIGTERM'].map((signal) => [
        signal,
        () => {
          interrupted ??= signal;
          child.kill(signal);
        },
      ]),
    );
    for (const [signal, handler] of Object.entries(handlers)) process.on(signal, handler);
    child.stdout.on('data', (bytes) => {
      log.write(bytes);
      process.stdout.write(bytes);
    });
    child.stderr.on('data', (bytes) => {
      log.write(bytes);
      process.stderr.write(bytes);
    });
    child.on('error', (failure) => {
      error = failure.message;
      log.write(`Spawn failure: ${error}\n`);
    });
    child.on('close', (status, signal) => {
      for (const [name, handler] of Object.entries(handlers)) process.off(name, handler);
      log.end(() => resolveResult({ status, signal: interrupted ?? signal, error }));
    });
  });
}

export async function runShard({
  folder = root,
  env = process.env,
  identify = executionIdentity,
  collect = collectPlan,
  build = buildReviewFixture,
  run = captureProcess,
} = {}) {
  requireValue(/^[1-4]$/.test(env.LAB_CI_SHARD ?? ''), 'LAB_CI_SHARD must be exactly1..4');
  const index = Number(env.LAB_CI_SHARD),
    record = readJson(resolve(folder, 'quality/releases/current.json')),
    identity = identify(folder, record, env),
    bundle = resolve(folder, evidenceRoot, artifactName(identity, index));
  requireValue(!existsSync(bundle), 'Refusing to reuse old shard evidence');
  mkdirSync(bundle, { recursive: true });
  const rawLog = resolve(bundle, 'raw.log');
  appendFileSync(
    rawLog,
    `Candidate ${identity.commit}; run ${identity.runId}/${identity.runAttempt}; shard ${index}/${totalShards}\n`,
  );
  let plan, fixture, child;
  try {
    plan = collect(folder, env);
    writeJson(resolve(bundle, 'plan.json'), plan);
    fixture = build({
      env,
      revision: () => identity.commit,
      run: (command, args, options) => {
        const result = spawnSync(command, args, {
          ...options,
          cwd: folder,
          stdio: 'pipe',
          maxBuffer: 32 * 1024 * 1024,
        });
        for (const bytes of [result.stdout, result.stderr])
          if (bytes) {
            appendFileSync(rawLog, bytes);
            process.stdout.write(bytes);
          }
        return result;
      },
    });
    writeJson(resolve(bundle, 'fixture.json'), fixture);
    requireValue(fixture.exitCode === 0 && !fixture.signal, 'Historical fixture build failed');
    requireValue(
      fixture.provenance?.result === 'built' &&
        fixture.provenance.candidateRevision === identity.commit &&
        fixture.provenance.historicalReviewFixtureRef === reviewFixtureRef &&
        fixture.provenance.gitShaEnvironmentUnchanged === true &&
        fixture.provenance.actualHeadRef === identity.headRef,
      'Wrong historical fixture provenance',
    );
    const childEnv = {
      ...env,
      PLAYWRIGHT_JSON_OUTPUT_FILE: resolve(bundle, 'results.json'),
      PLAYWRIGHT_HTML_OUTPUT_DIR: resolve(bundle, 'html'),
      PLAYWRIGHT_HTML_OPEN: 'never',
    };
    child = await run(
      process.execPath,
      [
        'node_modules/@playwright/test/cli.js',
        'test',
        '--config',
        configFile,
        `--shard=${index}/${totalShards}`,
        '--reporter=list,json,html',
        '--output',
        resolve(bundle, 'test-results'),
      ],
      { cwd: folder, env: childEnv, logPath: rawLog },
    );
    requireValue(
      child.status === 0 && !child.signal && !child.error,
      'Shard child failed or was interrupted',
    );
    const report = readJson(resolve(bundle, 'results.json')),
      counts = validateResults(report, plan, index);
    requireValue(
      equal(
        identify(folder, readJson(resolve(folder, 'quality/releases/current.json')), env),
        identity,
      ),
      'Candidate changed during execution',
    );
    const manifest = {
      schema: 1,
      status: 'passed',
      index,
      total: totalShards,
      bundlePath: bundle,
      identity,
      planDigest: plan.digest,
      shardDigest: plan.shards[index - 1].digest,
      fixture: fixture.provenance,
      process: child,
      counts,
      files: fileHashes(bundle, ['manifest.json']),
    };
    for (const path of ['results.json', 'raw.log', 'fixture.json', 'plan.json', 'html/index.html'])
      requireValue(
        typeof manifest.files[path] === 'string',
        `Missing required shard output: ${path}`,
      );
    validateAttachments(report, manifest, bundle);
    writeJson(resolve(bundle, 'manifest.json'), manifest);
    return { exitCode: 0, manifest, bundle };
  } catch (error) {
    appendFileSync(rawLog, `Shard failed: ${error.message}\n`);
    const manifest = {
      schema: 1,
      status: 'failed',
      index,
      total: totalShards,
      bundlePath: bundle,
      identity,
      planDigest: plan?.digest ?? null,
      fixture: fixture?.provenance ?? null,
      process: child ?? null,
      error: error.message,
      files: fileHashes(bundle, ['manifest.json']),
    };
    writeJson(resolve(bundle, 'manifest.json'), manifest);
    return { exitCode: child?.status || 1, manifest, bundle };
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    requireValue(process.argv.length === 2, 'Shard runner accepts no command-line selectors');
    const result = await runShard();
    process.stdout.write(`Shard evidence: ${result.bundle}; ${result.manifest.status}\n`);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  }
}
