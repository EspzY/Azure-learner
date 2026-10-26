import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const root = fileURLToPath(new URL('..', import.meta.url));
export const recordPath = 'quality/releases/current.json';
const gates = [
  'source',
  'curriculum',
  'simulation',
  'savvyshark',
  'visual-accessibility',
  'independent-final-audit',
  'delivery',
];
const domains = ['content', 'technical', 'visual', 'assessment', 'guidance', 'regression'];
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const validSha = (value) => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
export const implementationPath = (path) => {
  if (path === 'docs/PROJECT_STATUS.md' || /^docs\/quality\/.*\.md$/.test(path)) return false;
  if (
    /^(src\/|scripts\/|tests\/|public\/|\.github\/|quality\/|AGENTS\.md$|docs\/(?:QUALITY_CONTRACT|CONTENT_QA_STANDARD|SOURCE_COVERAGE_PROTOCOL|SAVVYSHARK_GUIDANCE_STANDARD|RELEASE_ACCEPTANCE)\.md$)/.test(
      path,
    )
  )
    return true;
  // Unknown build/config/assets are implementation, never an allowlist bypass.
  return !path.endsWith('.md');
};
const excluded = (path) =>
  path === recordPath || path === 'docs/PROJECT_STATUS.md' || /^docs\/quality\/.*\.md$/.test(path);
function safePath(folder, path) {
  if (typeof path !== 'string' || path.includes('\\')) return false;
  const local = relative(folder, resolve(folder, path));
  return !!local && !local.startsWith('..') && !isAbsolute(local);
}
export function validateQuality(record, folder = root, strict = false) {
  try {
    return validateRecord(record, folder, strict);
  } catch {
    return [
      'Malformed quality record; structured arrays/objects and readable evidence are required',
    ];
  }
}
function validateRecord(record, folder, strict) {
  const errors = [];
  const arrays = (value, keys, tag) => {
    for (const key of keys)
      if (!Array.isArray(value?.[key])) errors.push(`${tag}: ${key} must be an array`);
  };
  arrays(record, ['sources', 'activities', 'modules', 'preservedPaths'], 'release');
  if (record.schema !== 1 || !record.id || !validSha(record.baseCommit) || !record.author)
    errors.push('Invalid release identity/base/author');
  if (!record.scope?.kind || !record.scope?.description || !Array.isArray(record.scope.objectives))
    errors.push('Missing bounded scope');
  if (gates.some((id) => !record.gates?.[id]?.checks?.length || !record.gates[id].limits))
    errors.push('All seven gates need checks and honest limitations');
  const pointer = (ref, tag) => {
    if (!safePath(folder, ref?.path) || !existsSync(resolve(folder, ref.path))) {
      errors.push(`${tag}: missing/unsafe evidence file`);
      return;
    }
    if (ref.marker && !readFileSync(resolve(folder, ref.path), 'utf8').includes(ref.marker))
      errors.push(`${tag}: missing evidence marker ${ref.marker}`);
  };
  for (const [id, gate] of Object.entries(record.gates ?? {}))
    arrays(gate, ['checks'], `gate ${id}`);
  for (const [id, gate] of Object.entries(record.gates ?? {}))
    for (const ref of gate.checks ?? []) pointer(ref, `gate ${id}`);
  const sources = record.sources ?? [];
  if (!sources.length || new Set(sources.map((s) => s.id)).size !== sources.length)
    errors.push('Missing/duplicate source records');
  for (const s of sources) {
    arrays(s, ['objectives', 'claims', 'discovery'], `source ${s.id}`);
    let official = false;
    try {
      const u = new URL(s.url);
      official =
        u.protocol === 'https:' &&
        ['learn.microsoft.com', 'aka.ms', 'go.microsoft.com'].includes(u.hostname);
    } catch {
      /* invalid source is reported below */
    }
    if (
      !official ||
      !s.title ||
      !validDate(s.reviewed) ||
      !s.version ||
      !s.kind ||
      !s.objectives?.length ||
      !s.claims?.length ||
      !s.limits ||
      !['AVAILABLE', 'BLOCKED', 'UNVERIFIED'].includes(s.availability)
    )
      errors.push(`${s.id}: incomplete official source/claim/access record`);
    if (s.availability !== 'AVAILABLE' && !s.alternative)
      errors.push(
        `${s.id}: blocked/unverified source needs an official alternative or unresolved boundary`,
      );
    if (!s.discovery?.length || s.discovery.some((x) => !x.url || !x.disposition || !x.reason))
      errors.push(`${s.id}: missing scoped discovery disposition`);
  }
  for (const activity of record.activities ?? []) {
    arrays(activity, ['objectives', 'claims'], `activity ${activity.id}`);
    if (
      !activity.id ||
      !activity.objectives?.length ||
      !activity.claims?.length ||
      !activity.limits
    )
      errors.push('Incomplete activity binding');
    for (const layer of [
      'theory',
      'mechanism',
      'practice',
      'feedback',
      'visual',
      'accessible',
      'assessment',
      'savvyshark',
    ]) {
      arrays(activity, [layer], `activity ${activity.id}`);
      if (!activity[layer]?.length) errors.push(`${activity.id}: missing ${layer}`);
      for (const ref of activity[layer] ?? []) pointer(ref, `${activity.id}/${layer}`);
    }
    for (const claim of activity.claims ?? []) {
      if (
        !sources.some(
          (s) =>
            s.availability === 'AVAILABLE' &&
            s.claims.includes(claim) &&
            activity.objectives.some((id) => s.objectives.includes(id)),
        )
      )
        errors.push(`${activity.id}: no available mapped source for ${claim}`);
    }
    if (
      !activity.assessmentStatus ||
      !['new-independent', 'unchanged-existing'].includes(activity.assessmentStatus)
    )
      errors.push(`${activity.id}: assessment status missing`);
  }
  if (!record.activities?.length) errors.push('No actual activity/evidence bindings');
  if (record.scope?.kind === 'new-module' && !record.modules?.length)
    errors.push('New module cannot have an empty manuscript/assessment contract');
  for (const module of record.modules ?? []) {
    for (const layer of [
      'prerequisites',
      'terminology',
      'concept',
      'mechanism',
      'azureExample',
      'workedExample',
      'misconception',
      'limits',
      'visual',
      'practice',
      'independentScenario',
      'correctAndWrongRationales',
      'sources',
    ]) {
      arrays(module, [layer], `module ${module.id}`);
      if (!module[layer]?.length) errors.push(`${module.id}: missing ${layer}`);
      for (const ref of module[layer] ?? []) pointer(ref, `${module.id}/${layer}`);
    }
  }
  if (record.humanReview?.sme !== 'unperformed' || record.humanReview?.learning !== 'unperformed') {
    // A real review may be recorded with identity/date/evidence; never accept an automatic boolean.
    for (const kind of ['sme', 'learning']) {
      const value = record.humanReview?.[kind];
      if (value === 'unperformed') continue;
      if (
        !value ||
        typeof value !== 'object' ||
        value.kind !== 'human' ||
        !value.name ||
        !validDate(value.date) ||
        !value.qualification ||
        !value.evidence
      )
        errors.push(`${kind}: unsupported human approval claim`);
      else pointer(value.evidence, `human ${kind}`);
    }
  }
  if (strict) {
    const review = record.review;
    arrays(record, ['visualEvidence', 'verification'], 'release');
    arrays(review, ['findings'], 'review');
    if (
      review?.status !== 'complete' ||
      !review.reviewer?.id ||
      review.reviewer.id === record.author ||
      !['agent', 'human'].includes(review.reviewer.kind)
    )
      errors.push('Separate completed final reviewer required');
    if (
      !validDate(record.implementationFinished) ||
      !validDate(review?.started) ||
      Date.parse(review.started) < Date.parse(record.implementationFinished)
    )
      errors.push('Final audit must follow finished implementation');
    if (
      domains.some((id) => !review?.domains?.[id]?.finding || !review.domains[id].evidence?.length)
    )
      errors.push('All six final review domains need actual findings/evidence');
    for (const [id, domain] of Object.entries(review?.domains ?? {}))
      for (const ref of domain.evidence ?? []) pointer(ref, `review ${id}`);
    for (const finding of review?.findings ?? []) {
      if (!finding.id || !finding.description || !finding.severity || !finding.status)
        errors.push('Incomplete audit finding');
      if (
        !['blocker', 'major', 'minor', 'note'].includes(finding.severity) ||
        !['open', 'fixed', 'accepted-limitation'].includes(finding.status)
      )
        errors.push(`${finding.id}: invalid finding severity/status`);
      if (['blocker', 'major'].includes(finding.severity) && finding.status !== 'fixed')
        errors.push(`${finding.id}: release blocker remains open`);
      if (finding.status === 'fixed' && (!finding.fix || !finding.retests?.length))
        errors.push(`${finding.id}: fixed claim without correction/retest`);
    }
    if (!review?.report) errors.push('Final audit report required');
    else pointer(review.report, 'final audit report');
    if (
      !record.visualEvidence?.length ||
      record.visualEvidence.some((x) => x.inspected !== true || !x.observation || !x.viewport)
    )
      errors.push('Inspected actual visual evidence required');
    for (const image of record.visualEvidence ?? [])
      pointer({ path: image.path }, 'visual evidence');
    for (const command of ['npm run check', 'npm run test:e2e'])
      if (
        !record.verification?.some(
          (v) => v.command === command && v.result === 'passed' && v.details,
        )
      )
        errors.push(`Missing executed ${command}`);
  }
  return errors;
}
export function fingerprint(record, files) {
  const { baseCommit, scope, author, sources, activities, modules, preservedPaths, gates } = record;
  return sha256(
    JSON.stringify({
      baseCommit,
      scope,
      author,
      sources,
      activities,
      modules,
      preservedPaths,
      gates,
      files,
    }),
  );
}
function git(...args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
function changes(base) {
  if (!validSha(base)) throw Error('Full Git base SHA required');
  return [
    ...new Set([
      ...git('diff', '--name-only', '-z', base, '--').split('\0'),
      ...git('ls-files', '--others', '--exclude-standard', '-z').split('\0'),
    ]),
  ]
    .filter(Boolean)
    .sort();
}
function hashes(paths) {
  return Object.fromEntries(
    paths
      .filter((p) => !excluded(p))
      .map((p) => {
        const file = resolve(root, p);
        if (!safePath(root, p)) throw Error('Unsafe fingerprint path');
        if (!existsSync(file)) return [p, null];
        const bytes = readFileSync(file);
        const text = /\.(?:md|json|mjs|ts|tsx|css|yml|yaml|html)$/.test(p);
        return [p, sha256(text ? bytes.toString('utf8').replaceAll('\r\n', '\n') : bytes)];
      }),
  );
}
export function validateSnapshot(record, files, base) {
  const errors = [];
  if (record.baseCommit !== base) errors.push('Release base does not match actual PR base');
  if (
    JSON.stringify(record.snapshot?.files) !== JSON.stringify(files) ||
    record.review?.fingerprint !== fingerprint(record, files)
  )
    errors.push('Final audit is stale or does not cover all changed files');
  if (
    Object.keys(files).some((path) =>
      (record.preservedPaths ?? []).some((prefix) => path.startsWith(prefix)),
    )
  )
    errors.push('A declared preserved technical/evidence contract changed');
  return errors;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const record = JSON.parse(readFileSync(resolve(root, recordPath), 'utf8'));
  const strict = process.argv.includes('--release'),
    stamp = process.argv.includes('--stamp');
  const index = process.argv.indexOf('--base');
  const base = index >= 0 ? process.argv[index + 1] : record.baseCommit;
  const errors = validateQuality(record, root, strict);
  if (strict || stamp) {
    const paths = changes(base);
    if (stamp || paths.some(implementationPath)) {
      const files = hashes(paths);
      if (stamp && !errors.length) {
        record.baseCommit = base;
        record.snapshot = { files };
        record.implementationFinished = new Date().toISOString();
        record.review = {
          status: 'pending',
          fingerprint: fingerprint(record, files),
          reviewer: null,
          started: null,
          domains: {},
          findings: [],
          report: null,
        };
        writeFileSync(
          resolve(root, recordPath),
          await format(JSON.stringify(record), { parser: 'json', printWidth: 100 }),
        );
      } else if (strict) errors.push(...validateSnapshot(record, files, base));
    }
  }
  if (errors.length) {
    process.stderr.write(errors.join('\n') + '\n');
    process.exitCode = 1;
  } else
    process.stdout.write(
      stamp
        ? 'Quality snapshot stamped; independent audit remains PENDING.\n'
        : strict
          ? 'Release traceability and post-implementation audit valid; human quality/learning claims are not inferred.\n'
          : 'Seven-gate quality contracts/source/activity references valid; no final or human approval inferred.\n',
    );
}
