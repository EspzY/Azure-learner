import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, lstatSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('..', import.meta.url));
export const totalShards = 4;
export const configFile = 'playwright.desktop.config.ts';
export const evidenceRoot = '.artifacts/ci-shards';
export const aggregatePath = `${evidenceRoot}/aggregate.json`;
export const aggregateCommand = 'node scripts/e2e-shard-aggregate.mjs';
export const sha = (value) => createHash('sha256').update(value).digest('hex');
export const canonical = (value) =>
  JSON.stringify(value, (_key, item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(
          Object.keys(item)
            .sort()
            .map((key) => [key, item[key]]),
        )
      : item,
  );
export const digest = (value) => sha(canonical(value));
export const equal = (a, b) => canonical(a) === canonical(b);
export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}
export function requireValue(condition, message) {
  if (!condition) throw Error(message);
}
export const git = (folder, ...args) =>
  execFileSync('git', args, {
    cwd: folder,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 30_000,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
export function safeDirectory(folder, path = '') {
  const local = relative(folder, resolve(folder, path));
  requireValue(!local.startsWith('..') && !isAbsolute(local), 'Unsafe evidence directory');
  let current = resolve(folder);
  for (const part of ['', ...local.split('/').filter(Boolean)]) {
    if (part) current = resolve(current, part);
    const entry = lstatSync(current);
    requireValue(
      entry.isDirectory() && !entry.isSymbolicLink(),
      'Symlink/nonregular evidence directory',
    );
  }
  return current;
}
export function safeFile(folder, path) {
  requireValue(typeof path === 'string' && path && !path.includes('\\'), 'Unsafe evidence path');
  const file = resolve(folder, path),
    local = relative(folder, file);
  requireValue(local && !local.startsWith('..') && !isAbsolute(local), 'Unsafe evidence path');
  safeDirectory(folder, dirname(local));
  requireValue(
    lstatSync(file).isFile() && !lstatSync(file).isSymbolicLink(),
    'Nonregular evidence',
  );
  return file;
}
export function fileHashes(folder, excluded = []) {
  safeDirectory(folder);
  const result = {};
  function visit(path = '') {
    for (const entry of readdirSync(resolve(folder, path), { withFileTypes: true })) {
      const local = path ? `${path}/${entry.name}` : entry.name;
      requireValue(!entry.isSymbolicLink(), 'Symlink evidence is forbidden');
      if (entry.isDirectory()) visit(local);
      else {
        requireValue(entry.isFile(), 'Nonregular evidence is forbidden');
        if (!excluded.includes(local)) result[local] = sha(readFileSync(safeFile(folder, local)));
      }
    }
  }
  visit();
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}
export const artifactName = (identity, index) =>
  `browser-${identity.runId}-${identity.runAttempt}-${index}`;

/** Compare raw working bytes with the committed tree, not Git's filtered/stat view.
 * Only the runner-owned mutable release receipt is excluded. */
export function sourceIdentity(folder) {
  const tree = git(folder, 'rev-parse', 'HEAD^{tree}'),
    rows = git(folder, 'ls-tree', '-rz', 'HEAD').split('\0').filter(Boolean),
    files = {};
  for (const row of rows) {
    const [metadata, path] = row.split('\t');
    if (path === 'quality/releases/current.json') continue;
    const bytes = readFileSync(safeFile(folder, path)),
      blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    requireValue(blob === metadata.split(' ')[2], `Uncommitted implementation bytes: ${path}`);
    files[path] = blob;
  }
  const unknown = git(folder, 'ls-files', '--others', '--exclude-standard', '-z');
  requireValue(!unknown, 'Untracked implementation files cannot attest CI');
  return { tree, digest: digest(files) };
}
export function executionIdentity(folder, record, env = process.env) {
  const commit = git(folder, 'rev-parse', 'HEAD'),
    base = env.LAB_CI_BASE;
  requireValue(env.CI === 'true', 'Sharded CI requires CI=true');
  requireValue(
    /^[a-f0-9]{40}$/.test(commit) && env.GITHUB_SHA === commit,
    'Actual/event SHA mismatch',
  );
  requireValue(
    /^[a-f0-9]{40}$/.test(base ?? '') && record.baseCommit === base,
    'Invalid actual base',
  );
  git(folder, 'cat-file', '-e', `${base}^{commit}`);
  requireValue(/^[1-9]\d*$/.test(env.GITHUB_RUN_ID ?? ''), 'Invalid run ID');
  requireValue(/^[1-9]\d*$/.test(env.GITHUB_RUN_ATTEMPT ?? ''), 'Invalid run attempt');
  requireValue(
    /^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]+$/.test(env.GITHUB_REPOSITORY ?? '') &&
      !['.', '..'].includes(env.GITHUB_REPOSITORY.split('/')[1]),
    'Invalid repository',
  );
  requireValue(
    /^[a-f0-9]{64}$/.test(record.review?.fingerprint ?? ''),
    'Missing reviewed fingerprint',
  );
  requireValue(record.review?.status === 'complete', 'Completed independent review required');
  for (const [key, value] of [
    ['CHECKED_REVISION', commit],
    ['CHECKED_ATTEMPT', env.GITHUB_RUN_ATTEMPT],
  ])
    if (env[key] !== undefined) requireValue(env[key] === value, `${key} mismatch`);
  const configurations = [
    'package.json',
    'package-lock.json',
    'playwright.config.ts',
    configFile,
    'scripts/e2e-plan-check.mjs',
    'scripts/e2e-preview-build.mjs',
    'scripts/next.mjs',
  ];
  const toolchain = {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    playwright: readJson(resolve(folder, 'node_modules/playwright-core/package.json')).version,
    browserRegistry: sha(
      readFileSync(resolve(folder, 'node_modules/playwright-core/browsers.json')),
    ),
  };
  return {
    commit,
    base,
    repository: env.GITHUB_REPOSITORY,
    runId: env.GITHUB_RUN_ID,
    runAttempt: env.GITHUB_RUN_ATTEMPT,
    headRef: env.GITHUB_HEAD_REF ?? null,
    workflowRef: env.GITHUB_WORKFLOW_REF ?? null,
    workflowSha: env.GITHUB_WORKFLOW_SHA ?? null,
    releaseId: record.id,
    fingerprint: record.review.fingerprint,
    source: sourceIdentity(folder),
    configuration: digest(
      Object.fromEntries(configurations.map((p) => [p, sha(readFileSync(resolve(folder, p)))])),
    ),
    toolchain,
  };
}

export function reportCases(report) {
  requireValue(Array.isArray(report.suites), 'Malformed report suites');
  const rows = [];
  function visit(suites, parents = []) {
    for (const suite of suites) {
      for (const spec of suite.specs ?? []) {
        requireValue(
          typeof spec.file === 'string' &&
            !isAbsolute(spec.file) &&
            !spec.file.split('/').includes('..'),
          'Invalid case file',
        );
        requireValue(typeof spec.title === 'string' && Array.isArray(spec.tests), 'Malformed case');
        for (const test of spec.tests) {
          const title = [...parents, suite.title, spec.title];
          rows.push({
            descriptor: {
              id: JSON.stringify([test.projectName, spec.file, title, 0]),
              project: test.projectName,
              file: spec.file,
              title,
              timeout: test.timeout,
              expectedStatus: test.expectedStatus,
            },
            test,
            ok: spec.ok,
          });
        }
      }
      visit(suite.suites ?? [], [...parents, suite.title]);
    }
  }
  visit(report.suites);
  requireValue(
    new Set(rows.map((r) => r.descriptor.id)).size === rows.length,
    'Duplicate case identity',
  );
  return rows.sort((a, b) => a.descriptor.id.localeCompare(b.descriptor.id));
}
export function reportSettings(report, index = null) {
  const c = report.config;
  requireValue(c && c.workers === 1 && c.forbidOnly === true, 'Changed worker/forbidOnly settings');
  requireValue(
    c.fullyParallel === true &&
      c.globalTimeout === 0 &&
      c.maxFailures === 0 &&
      c.failOnFlakyTests === false,
    'Changed complete-profile settings',
  );
  requireValue(
    equal(c.shard ?? null, index === null ? null : { current: index, total: totalShards }),
    'Wrong native shard',
  );
  const projects = c.projects?.map((p) => ({
    name: p.name,
    retries: p.retries,
    repeatEach: p.repeatEach,
    timeout: p.timeout,
  }));
  requireValue(
    equal(
      projects?.map((p) => p.name),
      ['desktop-chromium', 'compact-chromium'],
    ),
    'Wrong project set',
  );
  requireValue(
    projects.every((p) => p.retries === 2 && p.repeatEach === 1 && p.timeout === 30_000),
    'Changed retry/repeat/default timeout',
  );
  return {
    workers: c.workers,
    forbidOnly: c.forbidOnly,
    fullyParallel: c.fullyParallel,
    globalTimeout: c.globalTimeout,
    maxFailures: c.maxFailures,
    failOnFlakyTests: c.failOnFlakyTests,
    projects,
  };
}
export function assemblePlan(reports) {
  requireValue(reports.length === totalShards + 1, 'Missing full/shard collections');
  const settings = reportSettings(reports[0]),
    cases = reportCases(reports[0]).map((r) => r.descriptor);
  requireValue(
    cases.length > 0 && cases.every((c) => c.expectedStatus === 'passed'),
    'Empty/skipped/unexpected full plan',
  );
  const shards = reports.slice(1).map((report, i) => {
    requireValue(equal(reportSettings(report, i + 1), settings), 'Shard settings differ');
    const selected = reportCases(report).map((r) => r.descriptor);
    requireValue(
      selected.length > 0 && selected.every((c) => c.expectedStatus === 'passed'),
      'Empty/skipped shard plan',
    );
    return { index: i + 1, cases: selected, digest: digest(selected) };
  });
  const union = shards.flatMap((s) => s.cases).sort((a, b) => a.id.localeCompare(b.id));
  requireValue(
    new Set(union.map((c) => c.id)).size === union.length && equal(union, cases),
    'Shard collections are not an exact disjoint full union',
  );
  return {
    schema: 1,
    config: configFile,
    total: totalShards,
    cases,
    settings,
    digest: digest({ cases, settings }),
    shards,
  };
}
export function collectPlan(folder = root, env = process.env, execute = execFileSync) {
  // Retain the original desktop/legacy/compact-selection gate before collection.
  execute(process.execPath, ['scripts/e2e-plan-check.mjs'], {
    cwd: folder,
    env,
    stdio: 'pipe',
    timeout: 90_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  const reports = [];
  for (let index = 0; index <= totalShards; index++) {
    const args = [
      'node_modules/@playwright/test/cli.js',
      'test',
      '--config',
      configFile,
      '--list',
      '--reporter=json',
    ];
    if (index) args.push(`--shard=${index}/${totalShards}`);
    const report = JSON.parse(
      execute(process.execPath, args, {
        cwd: folder,
        env,
        encoding: 'utf8',
        timeout: 30_000,
        maxBuffer: 32 * 1024 * 1024,
      }),
    );
    requireValue(
      Array.isArray(report.errors) && !report.errors.length,
      'Collection reported errors',
    );
    reports.push(report);
  }
  return assemblePlan(reports);
}
export function validateResults(report, plan, index) {
  requireValue(
    Array.isArray(report.errors) && report.errors.length === 0,
    'Execution reported global errors',
  );
  requireValue(equal(reportSettings(report, index), plan.settings), 'Execution settings changed');
  const rows = reportCases(report),
    expected = plan.shards[index - 1].cases;
  requireValue(
    equal(
      rows.map((r) => r.descriptor),
      expected,
    ),
    'Executed identities differ from expected shard',
  );
  const counts = { cases: rows.length, passed: 0, flaky: 0, attempts: 0 };
  for (const { test, ok } of rows) {
    requireValue(
      ok === true &&
        test.expectedStatus === 'passed' &&
        ['expected', 'flaky'].includes(test.status),
      'Skipped/failed/unexpected test outcome',
    );
    const results = test.results;
    requireValue(
      Array.isArray(results) && results.length > 0 && results.length <= 3,
      'Missing/excessive result attempts',
    );
    for (const [retry, result] of results.entries()) {
      requireValue(
        result.retry === retry && Number.isFinite(result.duration) && result.duration >= 0,
        'Malformed retry result',
      );
      requireValue(
        ['passed', 'failed', 'timedOut'].includes(result.status),
        'Interrupted/skipped/unknown attempt',
      );
      if (retry < results.length - 1)
        requireValue(result.status !== 'passed', 'Retries after a successful attempt');
    }
    const last = results.at(-1);
    requireValue(
      last.status === 'passed' && !last.error && (!last.errors || last.errors.length === 0),
      'Final attempt did not pass',
    );
    requireValue(
      test.status === (results.length === 1 ? 'expected' : 'flaky'),
      'Inconsistent flaky classification',
    );
    counts[results.length === 1 ? 'passed' : 'flaky']++;
    counts.attempts += results.length;
  }
  const stats = report.stats;
  requireValue(
    stats &&
      stats.expected === counts.passed &&
      stats.flaky === counts.flaky &&
      stats.unexpected === 0 &&
      stats.skipped === 0 &&
      Number.isFinite(stats.duration) &&
      stats.duration >= 0,
    'Truncated/inconsistent execution statistics',
  );
  return counts;
}
