import { spawnSync, execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
export const reviewFixtureRef = 'codex/azurelab-hybrid-production-foundation';
/** Explicit nonhosted browser-test build of the same revision. The original
 * runtime allowlist is unchanged; ordinary Vercel builds never use this fixture. */
export function buildReviewFixture({
  env = process.env,
  run = spawnSync,
  revision = () =>
    execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
} = {}) {
  if (Object.keys(env).some((key) => key === 'VERCEL' || key.startsWith('VERCEL_')))
    throw Error('Historical review fixture cannot build in a hosted Vercel environment');
  const commit = revision();
  if (!/^[a-f0-9]{40}$/.test(commit)) throw Error('Actual candidate Git revision required');
  const childEnv = { ...env, GITHUB_HEAD_REF: reviewFixtureRef };
  const child = run(process.execPath, ['scripts/next.mjs', 'build'], {
    cwd: root,
    env: childEnv,
    stdio: 'inherit',
  });
  const exitCode = child.error || child.signal || child.status !== 0 ? child.status || 1 : 0;
  return {
    exitCode,
    signal: child.signal ?? null,
    provenance: {
      candidateRevision: commit,
      actualHeadRef: env.GITHUB_HEAD_REF ?? null,
      historicalReviewFixtureRef: reviewFixtureRef,
      gitShaEnvironmentUnchanged: childEnv.GITHUB_SHA === env.GITHUB_SHA,
      result: exitCode === 0 ? 'built' : 'failed',
      limits:
        'Local/CI historical-review browser fixture only. Normal fullcheck and public branch/Vercel guard are separate. No actual Git ref, revision, learner data or runtime allowlist is changed.',
    },
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 2)
    throw Error('The historical review fixture accepts no override arguments');
  const result = buildReviewFixture();
  process.stdout.write(
    'Historical review fixture build: ' + JSON.stringify(result.provenance) + '\n',
  );
  if (result.signal) process.kill(process.pid, result.signal);
  else process.exitCode = result.exitCode;
}
