import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));
const run = promisify(execFile);
async function collect(config) {
  const { stdout } = await run(
    process.execPath,
    [
      'node_modules/@playwright/test/cli.js',
      'test',
      '--config',
      config,
      '--list',
      '--reporter=json',
    ],
    { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 30000 },
  );
  const report = JSON.parse(stdout);
  if (report.errors?.length) throw Error('Playwright collection failed');
  const cases = [];
  function visit(suites, parents = []) {
    for (const suite of suites) {
      for (const spec of suite.specs ?? [])
        for (const test of spec.tests)
          cases.push({
            project: test.projectName,
            id: JSON.stringify([spec.file, ...parents, suite.title, spec.title]),
            file: spec.file,
            title: spec.title,
            expectedStatus: test.expectedStatus,
          });
      visit(suite.suites ?? [], [...parents, suite.title]);
    }
  }
  visit(report.suites);
  return { report, cases };
}
const [legacy, candidate] = await Promise.all([
  collect('playwright.config.ts'),
  collect('playwright.desktop.config.ts'),
]);
const ids = (list) => list.map((x) => x.id).sort();
const desktop = (list) => list.filter((x) => x.project === 'desktop-chromium');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (!equal(ids(desktop(legacy.cases)), ids(desktop(candidate.cases))))
  throw Error('Candidate lost or changed desktop cases');
const declared = candidate.report.config.metadata?.compactCases;
if (!Array.isArray(declared) || !declared.length) throw Error('Missing compact witness manifest');
const expected = desktop(legacy.cases).filter((x) =>
  declared.some(([file, title]) => x.file === file && x.title === title),
);
const compact = candidate.cases.filter((x) => x.project === 'compact-chromium');
if (compact.some((x) => x.expectedStatus !== 'passed'))
  throw Error('Compact witnesses must not be statically skipped, fixed or expected to fail');
if (expected.length !== declared.length || !equal(ids(expected), ids(compact)))
  throw Error(
    `Compact selection differs: ${declared.length} declared, ${expected.length} found, ${compact.length} selected`,
  );
for (const file of [
  'course',
  'portal',
  'architecture-physical',
  'cloud-transfer',
  'compute-hosting',
  'networking-foundations',
  'networking-connectivity',
  'serverless',
  'cost-management',
]) {
  if (!compact.some((x) => x.file.endsWith(`${file}.spec.ts`)))
    throw Error(`Missing justified compact surface: ${file}`);
}
if (legacy.report.config.workers !== 1 || candidate.report.config.workers !== 1)
  throw Error('Parallel worker expansion has not been approved');
if (legacy.report.config.projects.map((x) => x.name).join() !== 'desktop-chromium,mobile-chromium')
  throw Error('The existing authoritative CI distribution changed before approval');
console.log(
  JSON.stringify(
    {
      legacyCases: legacy.cases.length,
      desktopCasesUnchanged: desktop(candidate.cases).length,
      compactCases: compact.length,
      candidateCases: candidate.cases.length,
      workers: 1,
      status: 'candidate validated; default CI unchanged; owner approval required for activation',
    },
    null,
    2,
  ),
);
