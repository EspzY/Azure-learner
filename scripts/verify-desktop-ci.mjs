import { spawnSync, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const recordPath = resolve(root, 'quality/releases/current.json');
const command = 'npm run test:e2e:desktop';

/** Own the complete fixed command. A failed child can never produce a receipt. */
export function verifyDesktop({
  run = spawnSync,
  read = () => JSON.parse(readFileSync(recordPath, 'utf8')),
  write = (record) => writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n'),
  revision = () =>
    execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
} = {}) {
  const child = run('npm', ['run', 'test:e2e:desktop'], { cwd: root, stdio: 'inherit' });
  if (child.error || child.signal || child.status !== 0)
    return { exitCode: child.status || 1, signal: child.signal ?? null, receipt: null };
  const record = read(),
    commit = revision(),
    fingerprint = record.review?.fingerprint;
  if (!/^[a-f0-9]{40}$/.test(commit) || !/^[a-f0-9]{64}$/.test(fingerprint ?? ''))
    throw Error('Cannot bind browser evidence to the candidate revision and fingerprint');
  const receipt = {
    command,
    result: 'passed',
    scope: 'candidate-full-profile',
    commit,
    fingerprint,
    details:
      'The fixed complete guarded desktop/compact command exited0 in this process. Counts, retries and skips remain in its actual output. This is browser execution evidence; subsequent strict release and final CI conclusion are separate.',
  };
  write({
    ...record,
    verification: [
      ...(record.verification ?? []).filter((entry) => entry.command !== command),
      receipt,
    ],
  });
  return { exitCode: 0, signal: null, receipt };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 2)
    throw Error('The complete CI browser command accepts no selectors');
  const result = verifyDesktop();
  if (result.receipt)
    process.stdout.write('Candidate browser receipt: ' + JSON.stringify(result.receipt) + '\n');
  if (result.signal) process.kill(process.pid, result.signal);
  else process.exitCode = result.exitCode;
}
