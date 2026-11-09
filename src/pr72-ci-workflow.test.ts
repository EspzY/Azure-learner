import { expect, it } from 'vitest';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const base = '0538b40cc51af634e71182014e65bdb932936c70';
const original = execFileSync('git', ['show', `${base}:.github/workflows/ci.yml`], {
  encoding: 'utf8',
});
const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');
const jobs = (text: string) =>
  Object.fromEntries(
    [
      ...text
        .slice(text.indexOf('jobs:\n') + 6)
        .matchAll(/^ {2}([\w-]+):\n([\s\S]*?)(?=^ {2}[\w-]+:|$(?![\s\S]))/gm),
    ].map((m) => [m[1]!, m[2]!]),
  );
function commands(job: string) {
  const lines = job.split('\n'),
    result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^(?: {6}- | {8})run: (.*)$/.exec(lines[i]!);
    if (!m) continue;
    if (m[1] === '|') {
      const block: string[] = [];
      while (i + 1 < lines.length) {
        const line = lines[i + 1]!;
        if (line.trim() && !line.startsWith('          ')) break;
        block.push(line.startsWith('          ') ? line.slice(10) : '');
        i++;
      }
      result.push(block.join('\n').trimEnd());
    } else result.push(m[1]!.replace(/ #.*$/, ''));
  }
  return result;
}
const publish = `candidate_sha="$(git rev-parse HEAD)"
[[ "$candidate_sha" =~ ^[0-9a-f]{40}$ ]] || exit 1
test "$candidate_sha" = "$EXPECTED_REVISION" || exit 1
printf 'sha=%s\\n' "$candidate_sha" >> "$GITHUB_OUTPUT"`;
const requireCheck = `test "$CHECK_RESULT" = success &&
[[ "$EXPECTED_REVISION" =~ ^[0-9a-f]{40}$ ]] &&
test -n "$CHECKED_REVISION" &&
test "$CHECKED_REVISION" = "$EXPECTED_REVISION"`;
const checkout = `candidate_sha="$(git rev-parse HEAD)"
[[ "$candidate_sha" =~ ^[0-9a-f]{40}$ ]] &&
test "$candidate_sha" = "$EXPECTED_REVISION" &&
test "$candidate_sha" = "$CHECKED_REVISION"`;
const full = 'node scripts/verify-desktop-ci.mjs';
const strict =
  'npm run quality:release -- --base "${{ github.event.pull_request.base.sha || github.event.before }}"';
const baseSettings = jobs(original).verify!;
// This is the finite workflow contract, not a permissive YAML interpreter.
// Retain complete original step blocks; only the reviewed serial guards are new.
const stepBlocks = (job: string) =>
  job
    .slice(job.indexOf('    steps:\n') + 11)
    .split(/(?=^ {6}- )/m)
    .filter((b) => b.trim());
const guardedStep = (header: string, script: string) =>
  header +
  '        run: |\n' +
  script
    .split('\n')
    .map((line) => `          ${line}`)
    .join('\n') +
  '\n';
const publisherStep = guardedStep(
  `      - name: Bind checked revision
        id: revision
        env:
          EXPECTED_REVISION: \${{ github.sha }}
        shell: bash
`,
  publish,
);
const prerequisiteStep = guardedStep(
  `      - name: Require successful checked revision
        env:
          CHECK_RESULT: \${{ needs.check.result }}
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          EXPECTED_REVISION: \${{ github.sha }}
        shell: bash
`,
  requireCheck,
);
const checkoutStep = guardedStep(
  `      - name: Verify same checkout
        env:
          CHECKED_REVISION: \${{ needs.check.outputs.sha }}
          EXPECTED_REVISION: \${{ github.sha }}
        shell: bash
`,
  checkout,
);
function valid(text: string) {
  const settings = baseSettings.slice(0, baseSettings.indexOf('    steps:\n'));
  const old = stepBlocks(baseSettings);
  const pinnedCheckout = old[0]!.replace(
    '        with:\n',
    '        with:\n          ref: ${{ github.sha }}\n',
  );
  const check = [pinnedCheckout, publisherStep, ...old.slice(1, 6)].join('');
  const verify = [
    prerequisiteStep,
    pinnedCheckout,
    checkoutStep,
    ...old.slice(1, 4),
    ...old.slice(6),
  ].join('');
  const expected =
    original.slice(0, original.indexOf('jobs:\n')) +
    `jobs:
  check:
    outputs:
      sha: \${{ steps.revision.outputs.sha }}
` +
    settings +
    '    steps:\n' +
    check +
    `  verify:
    needs: check
    # A failed/cancelled/skipped prerequisite must fail this required check,
    # rather than leaving a skipped verify that could look successful.
    if: \${{ always() }}
` +
    settings +
    '    steps:\n' +
    verify;
  return text === expected;
}
function execute(script: string, values: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'azurelab-ci-guard-'));
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
          PATH: `${bin}:${process.env.PATH}`,
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
it('actual serial workflow retains every original gate, pinned environment, whole profile and immediate strict release', () => {
  expect(valid(workflow)).toBe(true);
  const settings = readFileSync('playwright.config.ts', 'utf8');
  expect(settings).toBe(
    execFileSync('git', ['show', `${base}:playwright.config.ts`], { encoding: 'utf8' }),
  );
  expect(readFileSync('scripts/verify-desktop-ci.mjs', 'utf8')).toBe(
    execFileSync('git', ['show', `${base}:scripts/verify-desktop-ci.mjs`], { encoding: 'utf8' }),
  );
});
it('rejects omitted dependencies, skipped required verify, masked failures, changed caps and omitted or selected commands', () => {
  const withAppendix = (script: string) =>
    workflow.replace(
      script
        .split('\n')
        .map((line) => `          ${line}`)
        .join('\n'),
      script
        .split('\n')
        .map((line) => `          ${line}`)
        .join('\n') + '\n\n          exit 0',
    );
  const maskedPrerequisite = withAppendix(requireCheck),
    maskedCheckout = withAppendix(checkout);
  const mutants = [
    maskedPrerequisite,
    maskedCheckout,
    workflow.replace(
      '          CHECK_RESULT: ${{ needs.check.result }}\n',
      '          CHECK_RESULT: ${{ needs.check.result }}\n\n          BASH_ENV: ./mask.sh\n',
    ),
    workflow.replace('    if: ${{ always() }}\n', '    if: ${{ always() }}\n      && false\n'),
    workflow.replace(
      `      - run: ${full}`,
      `      - shell: bash --noprofile --norc -c 'bash {0}; exit 0'\n        run: ${full}`,
    ),
    workflow.replace(
      '  verify:\n',
      `  verify:\n    defaults:\n      run:\n        shell: bash --noprofile --norc -c 'bash {0}; exit 0'\n`,
    ),
    workflow.replace('  verify:\n', '  verify:\n    container: node:24\n'),
    workflow.replace(
      `      - run: ${full}`,
      `      - working-directory: other\n        run: ${full}`,
    ),
    workflow.replace(
      `      - run: ${full}`,
      `      - env:\n          NODE_OPTIONS: --require ./mask.cjs\n        run: ${full}`,
    ),
    workflow.replace(
      '          ref: ${{ github.sha }}',
      '          repository: other/project\n          ref: ${{ github.sha }}',
    ),
    workflow.replace('    needs: check\n', ''),
    workflow.replace('    if: ${{ always() }}\n', ''),
    workflow.replace('    needs: check\n', '    needs: unrelated\n'),
    workflow.replace('timeout-minutes: 35', 'timeout-minutes: 40'),
    workflow.replace(
      '      - run: npm run check # Includes required documentation/local-link validation\n',
      '',
    ),
    workflow.replace('      - run: npm audit --audit-level=high\n', ''),
    workflow.replace(full, `${full} --grep selected`),
    workflow.replace(full, `${full} || true`),
    workflow.replace(
      `      - run: ${full}`,
      `      - continue-on-error: true\n        run: ${full}`,
    ),
    workflow.replace(
      `      - run: ${full} # Runs the fixed guarded profile; records candidate evidence only after exit0\n      - run: ${strict}`,
      `      - run: ${strict}\n      - run: ${full}`,
    ),
    workflow.replace('          ref: ${{ github.sha }}', '          ref: main'),
    workflow.replace(
      '          CHECKED_REVISION: ${{ needs.check.outputs.sha }}',
      '          CHECKED_REVISION: ${{ github.sha }}',
    ),
    workflow.replace('        if: failure()', '        if: success()'),
  ];
  const completeMask = commands(jobs(maskedPrerequisite).verify!)[0]!;
  expect(completeMask).toContain('\n\nexit 0');
  expect(
    execute(completeMask, {
      CHECK_RESULT: 'failure',
      CHECKED_REVISION: 'a'.repeat(40),
      EXPECTED_REVISION: 'a'.repeat(40),
    }).status,
  ).toBe(0);
  for (const text of mutants) {
    expect(text).not.toBe(workflow);
    expect(valid(text)).toBe(false);
  }
});
it('executes the actual prerequisite guard: only successful same-SHA checks can admit browser verification', () => {
  const guard = commands(jobs(workflow).verify!)[0]!;
  for (const status of ['failure', 'cancelled', 'skipped', '', 'timed_out'])
    expect(
      execute(guard, {
        CHECK_RESULT: status,
        CHECKED_REVISION: 'a'.repeat(40),
        EXPECTED_REVISION: 'a'.repeat(40),
      }).status,
    ).not.toBe(0);
  for (const checked of ['', 'b'.repeat(40), 'main'])
    expect(
      execute(guard, {
        CHECK_RESULT: 'success',
        CHECKED_REVISION: checked,
        EXPECTED_REVISION: 'a'.repeat(40),
      }).status,
    ).not.toBe(0);
  expect(
    execute(guard, {
      CHECK_RESULT: 'success',
      CHECKED_REVISION: 'a'.repeat(40),
      EXPECTED_REVISION: 'a'.repeat(40),
    }).status,
  ).toBe(0);
});
it('executes actual publisher and checkout guards; missing or mismatched revisions never attest a successful candidate', () => {
  const j = jobs(workflow),
    publisher = commands(j.check!)[0]!,
    verify = commands(j.verify!)[1]!;
  for (const actual of ['', 'b'.repeat(40), 'main']) {
    const result = execute(publisher, {
      ACTUAL_REVISION: actual,
      EXPECTED_REVISION: 'a'.repeat(40),
    });
    expect(result.status).not.toBe(0);
    expect(result.output).toBe('');
  }
  expect(
    execute(publisher, { ACTUAL_REVISION: 'a'.repeat(40), EXPECTED_REVISION: 'a'.repeat(40) }),
  ).toEqual({ status: 0, output: `sha=${'a'.repeat(40)}\n` });
  for (const values of [
    {
      ACTUAL_REVISION: 'b'.repeat(40),
      EXPECTED_REVISION: 'a'.repeat(40),
      CHECKED_REVISION: 'a'.repeat(40),
    },
    { ACTUAL_REVISION: 'a'.repeat(40), EXPECTED_REVISION: 'a'.repeat(40), CHECKED_REVISION: '' },
    {
      ACTUAL_REVISION: 'a'.repeat(40),
      EXPECTED_REVISION: 'a'.repeat(40),
      CHECKED_REVISION: 'b'.repeat(40),
    },
  ])
    expect(execute(verify, values).status).not.toBe(0);
  expect(
    execute(verify, {
      ACTUAL_REVISION: 'a'.repeat(40),
      EXPECTED_REVISION: 'a'.repeat(40),
      CHECKED_REVISION: 'a'.repeat(40),
    }).status,
  ).toBe(0);
});
