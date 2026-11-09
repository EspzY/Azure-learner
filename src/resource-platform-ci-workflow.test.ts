/** Actual current CI, independent of the bounded historical PR72 reader. */
import { expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const base = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
const original = execFileSync('git', ['show', `${base}:.github/workflows/ci.yml`], {
  encoding: 'utf8',
});
const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
const jobBlocks = (source: string): Record<string, string> =>
  Object.fromEntries(
    [
      ...source
        .slice(source.indexOf('jobs:\n') + 6)
        .matchAll(/^ {2}([\w-]+):\n([\s\S]*?)(?=^ {2}[\w-]+:|$(?![\s\S]))/gm),
    ].map((m) => [m[1]!, m[2]!]),
  );
const steps = (job: string) =>
  job
    .slice(job.indexOf('    steps:\n') + 11)
    .split(/(?=^ {6}- )/m)
    .filter((b) => b.trim());
function runBlocks(job: string) {
  const lines = job.split('\n'),
    result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^(?: {6}- | {8})run: (.*)$/.exec(lines[i]!);
    if (!m) continue;
    if (m[1] !== '|') {
      result.push(m[1]!.replace(/ #.*$/, ''));
      continue;
    }
    const block: string[] = [];
    while (i + 1 < lines.length) {
      const line = lines[i + 1]!;
      if (line.trim() && !line.startsWith('          ')) break;
      block.push(line.startsWith('          ') ? line.slice(10) : '');
      i++;
    }
    result.push(block.join('\n').trimEnd());
  }
  return result;
}
const oldJobs = jobBlocks(original),
  oldCheckSteps = steps(oldJobs.check!);
const workerEnvironment = oldJobs.check!.slice(
  oldJobs.check!.indexOf('    runs-on:'),
  oldJobs.check!.indexOf('    steps:\n'),
);
const browserEnvironment = workerEnvironment.replace(
  'timeout-minutes: 35 # Complete course, Portal and persistence verification',
  'timeout-minutes: 35',
);
const checkout = oldCheckSteps[0]!,
  setup = oldCheckSteps[2]!,
  npmCi = oldCheckSteps[3]!,
  database = oldCheckSteps[4]!;
const publish =
  runBlocks(oldJobs.check!)[0]!.replace(
    '\nprintf',
    '\n[[ "$GITHUB_RUN_ATTEMPT" =~ ^[1-9][0-9]*$ ]] || exit 1\nprintf',
  ) + '\nprintf \'attempt=%s\\n\' "$GITHUB_RUN_ATTEMPT" >> "$GITHUB_OUTPUT"';
const checked =
  runBlocks(oldJobs.verify!)[0]! +
  '\n[[ "$GITHUB_RUN_ATTEMPT" =~ ^[1-9][0-9]*$ ]] &&\ntest "$CHECKED_ATTEMPT" = "$GITHUB_RUN_ATTEMPT"';
// Append the attempt test to the original && chain, never to a new success-masking command.
const requireCheck = checked.replace(
  'test "$CHECKED_REVISION" = "$EXPECTED_REVISION"\n[[',
  'test "$CHECKED_REVISION" = "$EXPECTED_REVISION" &&\n[[',
);
const requireAll = requireCheck.replace(
  'test "$CHECK_RESULT" = success &&\n',
  'test "$CHECK_RESULT" = success &&\ntest "$BROWSER_RESULT" = success &&\n',
);
const sameCheckout = runBlocks(oldJobs.verify!)[1]!;
const scriptStep = (header: string, body: string) =>
  header +
  '        run: |\n' +
  body
    .split('\n')
    .map((line) => '          ' + line)
    .join('\n') +
  '\n';
const publishStep = scriptStep(
  `      - name: Bind checked revision
        id: revision
        env:
          EXPECTED_REVISION: \${{ github.sha }}
        shell: bash
`,
  publish,
);
const checkedStep = scriptStep(
  `      - name: Require successful checked revision
        env:
          CHECK_RESULT: \${{ needs.check.result }}
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          EXPECTED_REVISION: \${{ github.sha }}
          CHECKED_ATTEMPT: \${{ needs.check.outputs.attempt }}
        shell: bash
`,
  requireCheck,
);
const checkoutStep = (attempt: boolean) =>
  scriptStep(
    `      - name: Verify same checkout
        env:
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          EXPECTED_REVISION: \${{ github.sha }}
${attempt ? '          CHECKED_ATTEMPT: ${{ needs.check.outputs.attempt }}\n' : ''}        shell: bash
`,
    sameCheckout,
  );
const aggregatePrerequisite = scriptStep(
  `      - name: Require complete successful prerequisites
        env:
          CHECK_RESULT: \${{ needs.check.result }}
          BROWSER_RESULT: \${{ needs.browser.result }}
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          CHECKED_ATTEMPT: \${{ needs.check.outputs.attempt }}
          EXPECTED_REVISION: \${{ github.sha }}
        shell: bash
`,
  requireAll,
);
const runner = 'node scripts/e2e-shard-runner.mjs',
  aggregate = 'node scripts/e2e-shard-aggregate.mjs';
const strict =
  'npm run quality:release -- --base "${{ github.event.pull_request.base.sha || github.event.before }}"';
const runnerStep = `      - name: Execute one isolated guarded shard
        env:
          LAB_CI_SHARD: \${{ matrix.shard }}
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          CHECKED_ATTEMPT: \${{ needs.check.outputs.attempt }}
          LAB_CI_BASE: \${{ github.event.pull_request.base.sha || github.event.before }}
        run: ${runner}
`;
const shardArtifact = `      - uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
        if: \${{ always() }}
        with:
          name: browser-\${{ github.run_id }}-\${{ github.run_attempt }}-\${{ matrix.shard }}
          path: .artifacts/ci-shards/browser-\${{ github.run_id }}-\${{ github.run_attempt }}-\${{ matrix.shard }}/
          include-hidden-files: true
          if-no-files-found: error
          retention-days: 7
`;
const download = `      - uses: actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333 # v8.0.2
        with:
          pattern: browser-\${{ github.run_id }}-\${{ github.run_attempt }}-*
          path: .artifacts/ci-shards/
`;
const aggregateStep = `      - name: Verify exact complete union and bind aggregate receipt
        env:
          CHECK_RESULT: \${{ needs.check.result }}
          BROWSER_RESULT: \${{ needs.browser.result }}
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          CHECKED_ATTEMPT: \${{ needs.check.outputs.attempt }}
          LAB_CI_BASE: \${{ github.event.pull_request.base.sha || github.event.before }}
        run: ${aggregate}
`;
const aggregateArtifact = `      - uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2
        if: \${{ always() }}
        with:
          name: browser-aggregate-\${{ github.run_id }}-\${{ github.run_attempt }}
          path: .artifacts/ci-shards/aggregate.json
          if-no-files-found: error
          include-hidden-files: true
          retention-days: 7
`;
/** Complete finite contract: original environment/check blocks + reviewed shard/union additions.
 * An unknown job key/step, shell/default/env, selected command or YAML escape is not accepted. */
function expectedWorkflow() {
  return (
    original.slice(0, original.indexOf('jobs:\n')) +
    `jobs:
  check:
    outputs:
      sha: \${{ steps.revision.outputs.sha }}
      attempt: \${{ steps.revision.outputs.attempt }}
` +
    workerEnvironment +
    '    steps:\n' +
    [checkout, publishStep, ...oldCheckSteps.slice(2)].join('') +
    `  browser:
    needs: check
    if: \${{ always() }}
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
` +
    browserEnvironment +
    '    steps:\n' +
    [
      checkedStep,
      checkout,
      checkoutStep(true),
      setup,
      npmCi,
      database,
      '      - run: npx playwright install --with-deps chromium\n',
      runnerStep,
      shardArtifact,
    ].join('') +
    `  verify:
    needs: [check, browser]
    if: \${{ always() }}
    runs-on: ubuntu-latest
    timeout-minutes: 35
    steps:
` +
    [
      aggregatePrerequisite,
      checkout.replace(
        'fetch-depth: 0 # Compare the actual PR base and reviewed implementation payload.',
        'fetch-depth: 0',
      ),
      checkoutStep(false),
      setup,
      npmCi,
      download,
      aggregateStep,
      `      - run: ${strict}\n`,
      aggregateArtifact,
    ].join('')
  );
}
const valid = (source: string) => source === expectedWorkflow();
function mutateJob(job: string, from: string, to: string) {
  const block = jobBlocks(workflow)[job]!;
  expect(block).toContain(from);
  return workflow.replace(`  ${job}:\n${block}`, `  ${job}:\n${block.replace(from, to)}`);
}
function reject(mutants: string[]) {
  for (const text of mutants) {
    expect(text).not.toBe(workflow);
    expect(valid(text)).toBe(false);
  }
}
function bash(script: string, values: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'azurelab-shard-workflow-'));
  try {
    const bin = join(dir, 'bin'),
      output = join(dir, 'output');
    mkdirSync(bin);
    writeFileSync(join(bin, 'git'), '#!/bin/sh\nprintf "%s\\n" "$ACTUAL_REVISION"\n', {
      mode: 0o700,
    });
    const result = spawnSync(
      'bash',
      ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', script],
      {
        env: {
          NODE_ENV: 'test',
          PATH: bin + ':' + process.env.PATH,
          GITHUB_OUTPUT: output,
          ...values,
        },
        encoding: 'utf8',
      },
    );
    return {
      status: result.status,
      output: existsSync(output) ? readFileSync(output, 'utf8') : '',
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
const successful = {
  CHECK_RESULT: 'success',
  BROWSER_RESULT: 'success',
  CHECKED_REVISION: 'a'.repeat(40),
  EXPECTED_REVISION: 'a'.repeat(40),
  ACTUAL_REVISION: 'a'.repeat(40),
  CHECKED_ATTEMPT: '2',
  GITHUB_RUN_ATTEMPT: '2',
};
it('actual complete sharded workflow preserves original gates/environment and admits only the bounded four-way union before immediate strict release', () => {
  expect(workflow).toBe(expectedWorkflow());
  expect(Object.keys(jobBlocks(workflow))).toEqual(['check', 'browser', 'verify']);
  expect(runBlocks(jobBlocks(workflow).check!)).toEqual([
    publish,
    'npm ci',
    'npm run lab:db:setup',
    'npm run check',
    'npm audit --audit-level=high',
  ]);
  expect(runBlocks(jobBlocks(workflow).browser!)).toEqual([
    requireCheck,
    sameCheckout,
    'npm ci',
    'npm run lab:db:setup',
    'npx playwright install --with-deps chromium',
    runner,
  ]);
  expect(runBlocks(jobBlocks(workflow).verify!)).toEqual([
    requireAll,
    sameCheckout,
    'npm ci',
    aggregate,
    strict,
  ]);
  for (const file of ['playwright.config.ts', 'scripts/verify-desktop-ci.mjs'])
    expect(readFileSync(file, 'utf8')).toBe(
      execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8' }),
    );
});
it('rejects missing shards/dependencies, short-circuit matrix, weakened environments and unpinned or alternate checkouts', () => {
  reject([
    mutateJob('browser', 'shard: [1, 2, 3, 4]', 'shard: [1, 2, 3]'),
    mutateJob('browser', 'shard: [1, 2, 3, 4]', 'shard: [1, 2, 2, 4]'),
    mutateJob('browser', 'fail-fast: false', 'fail-fast: true'),
    mutateJob('browser', '    needs: check\n', ''),
    mutateJob('verify', '    needs: [check, browser]\n', '    needs: check\n'),
    mutateJob('verify', '    if: ${{ always() }}\n', ''),
    mutateJob('verify', '    if: ${{ always() }}', '    if: ${{ success() }}'),
    mutateJob('browser', 'timeout-minutes: 35', 'timeout-minutes: 45'),
    mutateJob('check', 'timeout-minutes: 35', 'timeout-minutes: 45'),
    mutateJob('verify', 'timeout-minutes: 35', 'timeout-minutes: 45'),
    mutateJob('browser', 'image: postgres:17-bookworm@sha256:', 'image: postgres:latest #'),
    mutateJob(
      'browser',
      '127.0.0.1:5432/azurelab_lab_test_ci',
      'shared-db.invalid:5432/other_project',
    ),
    mutateJob('browser', '          ref: ${{ github.sha }}', '          ref: main'),
    mutateJob(
      'verify',
      '          ref: ${{ github.sha }}',
      '          repository: other/project\n          ref: ${{ github.sha }}',
    ),
    workflow.replace(
      'actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1',
      'actions/setup-node@latest',
    ),
    workflow.replace(
      'actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333',
      'actions/download-artifact@main',
    ),
    mutateJob(
      'check',
      '      - run: npm run check # Includes required documentation/local-link validation\n',
      '',
    ),
    mutateJob('check', '      - run: npm audit --audit-level=high\n', ''),
  ]);
});
it('rejects selectors, omitted or reordered coverage/release, failure masks, custom shells/defaults and unreviewed environments', () => {
  reject([
    mutateJob('browser', runner, runner + ' --grep selected'),
    mutateJob('browser', runner, runner + ' --project desktop-chromium'),
    mutateJob('browser', runner, runner + ' || true'),
    mutateJob('browser', runner, runner + '\n\n          exit 0'),
    mutateJob(
      'browser',
      runnerStep,
      '      - continue-on-error: true\n        run: ' + runner + '\n',
    ),
    mutateJob(
      'browser',
      '    runs-on: ubuntu-latest',
      '    continue-on-error: true\n    runs-on: ubuntu-latest',
    ),
    mutateJob(
      'browser',
      '    runs-on: ubuntu-latest',
      "    defaults:\n      run:\n        shell: bash --noprofile --norc -c 'bash {0}; exit 0'\n    runs-on: ubuntu-latest",
    ),
    mutateJob(
      'browser',
      `        run: ${runner}`,
      `        shell: bash --noprofile --norc -c 'bash {0}; exit 0'\n        run: ${runner}`,
    ),
    mutateJob(
      'browser',
      `        run: ${runner}`,
      `        working-directory: other\n        run: ${runner}`,
    ),
    mutateJob(
      'browser',
      '          LAB_CI_SHARD: ${{ matrix.shard }}',
      '          LAB_CI_SHARD: 1',
    ),
    mutateJob(
      'browser',
      '          LAB_CI_SHARD: ${{ matrix.shard }}',
      '          LAB_CI_SHARD: ${{ matrix.shard }}\n          NODE_OPTIONS: --require ./mask.cjs',
    ),
    mutateJob(
      'verify',
      `        run: ${aggregate}`,
      `        continue-on-error: true\n        run: ${aggregate}`,
    ),
    mutateJob(
      'verify',
      '    runs-on: ubuntu-latest',
      '    container: node:24\n    runs-on: ubuntu-latest',
    ),
  ]);
});
it('rejects foreign-attempt or incomplete artifacts and strict-release order/masking even when individual jobs look successful', () => {
  reject([
    mutateJob('browser', '        if: ${{ always() }}', '        if: ${{ success() }}'),
    mutateJob('browser', '          include-hidden-files: true\n', ''),
    mutateJob('browser', '          if-no-files-found: error', '          if-no-files-found: warn'),
    mutateJob(
      'browser',
      '          path: .artifacts/ci-shards/browser-${{ github.run_id }}-${{ github.run_attempt }}-${{ matrix.shard }}/',
      '          path: playwright-report/',
    ),
    mutateJob(
      'browser',
      '          name: browser-${{ github.run_id }}-${{ github.run_attempt }}-${{ matrix.shard }}',
      '          name: browser-${{ github.run_id }}-${{ matrix.shard }}',
    ),
    mutateJob(
      'browser',
      '          CHECKED_ATTEMPT: ${{ needs.check.outputs.attempt }}',
      '          CHECKED_ATTEMPT: ${{ github.run_attempt }}',
    ),
    mutateJob(
      'verify',
      '          pattern: browser-${{ github.run_id }}-${{ github.run_attempt }}-*',
      '          pattern: browser-*-*',
    ),
    mutateJob(
      'verify',
      '          path: .artifacts/ci-shards/',
      '          path: .artifacts/other/',
    ),
    mutateJob(
      'verify',
      download,
      download.replace(
        '          path: .artifacts/ci-shards/',
        '          merge-multiple: true\n          path: .artifacts/ci-shards/',
      ),
    ),
    mutateJob('verify', aggregateStep, ''),
    mutateJob('verify', aggregate, aggregate + ' --allow-missing'),
    mutateJob('verify', aggregate, aggregate + ' || true'),
    mutateJob(
      'verify',
      '          test "$CHECKED_ATTEMPT" = "$GITHUB_RUN_ATTEMPT"',
      '          test "$CHECKED_ATTEMPT" = "$GITHUB_RUN_ATTEMPT"\n\n          exit 0',
    ),
    mutateJob(
      'verify',
      `${aggregateStep}      - run: ${strict}\n`,
      `      - run: ${strict}\n${aggregateStep}`,
    ),
    mutateJob('verify', `      - run: ${strict}\n`, ''),
    mutateJob('verify', strict, strict + ' || true'),
    mutateJob(
      'verify',
      '          path: .artifacts/ci-shards/aggregate.json',
      '          path: .artifacts/ci-shards/partial.json',
    ),
    mutateJob(
      'verify',
      '          CHECKED_REVISION: ${{ needs.check.outputs.sha }}',
      '          CHECKED_REVISION: ${{ github.sha }}',
    ),
  ]);
});
it('executes actual publisher Bash and rejects invalid SHA/attempt before admitting same-run outputs', () => {
  const script = runBlocks(jobBlocks(workflow).check!)[0]!;
  expect(bash(script, successful)).toEqual({
    status: 0,
    output: 'sha=' + successful.EXPECTED_REVISION + '\nattempt=2\n',
  });
  for (const actual of ['', 'main', 'b'.repeat(40), 'A'.repeat(40)]) {
    const result = bash(script, { ...successful, ACTUAL_REVISION: actual });
    expect(result.status).not.toBe(0);
    expect(result.output).toBe('');
  }
  for (const attempt of ['', '0', '-1', 'two', '02']) {
    const result = bash(script, { ...successful, GITHUB_RUN_ATTEMPT: attempt });
    expect(result.status).not.toBe(0);
    expect(result.output).toBe('');
  }
});
it('executes actual shard prerequisite Bash and fails closed on failed/skipped/cancelled check, foreign SHA and empty or foreign attempt', () => {
  const script = runBlocks(jobBlocks(workflow).browser!)[0]!;
  expect(bash(script, successful).status).toBe(0);
  for (const status of ['failure', 'cancelled', 'skipped', 'timed_out', ''])
    expect(bash(script, { ...successful, CHECK_RESULT: status }).status).not.toBe(0);
  for (const checked of ['', 'b'.repeat(40), 'main'])
    expect(bash(script, { ...successful, CHECKED_REVISION: checked }).status).not.toBe(0);
  for (const attempt of ['', '1', 'foreign'])
    expect(bash(script, { ...successful, CHECKED_ATTEMPT: attempt }).status).not.toBe(0);
  expect(
    bash(script, { ...successful, CHECKED_ATTEMPT: '', GITHUB_RUN_ATTEMPT: '' }).status,
  ).not.toBe(0);
});
it('executes actual aggregate Bash and rejects any non-success prerequisite or wrong attempt without trusting the matrix summary', () => {
  const script = runBlocks(jobBlocks(workflow).verify!)[0]!;
  expect(bash(script, successful).status).toBe(0);
  expect(bash(script + '\n\nexit 0', { ...successful, BROWSER_RESULT: 'failure' }).status).toBe(0);
  for (const key of ['CHECK_RESULT', 'BROWSER_RESULT'])
    for (const value of ['failure', 'cancelled', 'skipped', 'timed_out', ''])
      expect(bash(script, { ...successful, [key]: value }).status).not.toBe(0);
  for (const values of [
    { CHECKED_REVISION: '' },
    { CHECKED_REVISION: 'b'.repeat(40) },
    { EXPECTED_REVISION: 'main' },
    { CHECKED_ATTEMPT: '' },
    { CHECKED_ATTEMPT: '1' },
    { CHECKED_ATTEMPT: '', GITHUB_RUN_ATTEMPT: '' },
    { CHECKED_ATTEMPT: '0', GITHUB_RUN_ATTEMPT: '0' },
  ])
    expect(bash(script, { ...successful, ...values }).status).not.toBe(0);
});
it('executes both actual checkout guards and rejects a substituted or malformed tested commit', () => {
  for (const job of ['browser', 'verify']) {
    const script = runBlocks(jobBlocks(workflow)[job]!)[1]!;
    expect(bash(script, successful).status).toBe(0);
    for (const values of [
      { ACTUAL_REVISION: 'b'.repeat(40) },
      { ACTUAL_REVISION: '' },
      { CHECKED_REVISION: '' },
      { EXPECTED_REVISION: 'b'.repeat(40) },
      { ACTUAL_REVISION: 'main', CHECKED_REVISION: 'main', EXPECTED_REVISION: 'main' },
    ])
      expect(bash(script, { ...successful, ...values }).status).not.toBe(0);
  }
});
