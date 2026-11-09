import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { format, resolveConfig } from 'prettier';
import proof from '../../../docs/reviews/evidence/bifrost-course/preservation.json';
import {
  courseBase,
  courseHistoricalBase,
  courseMetadata,
  courseProofPath,
  boundCourseBytes,
  courseBlobHash,
  courseProjectionSnapshot,
  verifyCourseProjection,
  execBifrostCourse,
} from '../../../tests/bifrost-course-preservation';

const approved = [
  'src/features/course/course.css',
  'src/features/course/course.tsx',
  'src/features/course/guidance-milestones.tsx',
  'src/features/course/guidance-window.tsx',
  'src/features/course/guided-coach.tsx',
  'src/features/course/mission-briefing.tsx',
  'src/features/course/mission-portal.tsx',
  'src/features/learning/compute-vm.tsx',
  'src/features/learning/foundations-v2.tsx',
  'src/features/learning/journal.tsx',
  'src/features/learning/networking-inspection.tsx',
  'tests/e2e/hybrid-experience.spec.ts',
  'tests/bifrost-foundation-preservation.ts',
  'src/features/design/preservation.test.ts',
  'src/features/course/hybrid-foundation.test.ts',
];
const images = ['light', 'dark'].flatMap((mode) =>
  [
    'hub',
    'hub-1024x500',
    'hub-1024x768',
    'hub-800x700',
    'teaching-info',
    'question-selected',
    'question-wrong',
    'question-correct',
    'journal',
    'savvy',
    'warning',
    'foundations-before-submit',
    'refined-before-submit',
    'compute-before-submit',
    'refined-start-dialog',
    'compute-start-dialog',
    'native-create',
    'native-review',
    'resident-savvy',
    'resident-native-create',
    'resident-native-review',
  ].map((name) => `docs/screenshots/bifrost-course/${mode}-${name}.png`),
);
const additions = [
  'src/features/course/bifrost-course.css',
  'src/features/course/bifrost-guidance.css',
  'src/features/course/bifrost-course-preservation.test.ts',
  'tests/bifrost-course-preservation.ts',
  'tests/e2e/bifrost-course.spec.ts',
  'docs/design/bifrost-course.md',
  'docs/screenshots/bifrost-course/before-dark-refined-start-dialog.png',
  'docs/screenshots/bifrost-course/before-appearance-light.png',
  'docs/screenshots/bifrost-course/before-appearance-dark.png',
  'docs/screenshots/bifrost-course/before-appearance-light-320.png',
  'docs/screenshots/bifrost-course/before-appearance-dark-320.png',
  'docs/screenshots/bifrost-course/before-dark-denied-journal.png',
  'docs/reviews/evidence/bifrost-course/before-appearance-result.json',
  'docs/reviews/evidence/bifrost-course/before-denial-result.json',
  'docs/reviews/evidence/bifrost-course/warning-regression-result.json',
  'docs/screenshots/bifrost-course/intermediate-dark-denied-journal-recovery.png',
  'docs/reviews/evidence/bifrost-course/intermediate-warning-failure.json',
  ...['light', 'dark'].flatMap((mode) =>
    ['appearance', 'appearance-320', 'denied-journal'].map(
      (name) => `docs/screenshots/bifrost-course/after-${mode}-${name}.png`,
    ),
  ),
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-storage.txt',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-light-feedback.txt',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-light-boundary.txt',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-dark-feedback.txt',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-dark-boundary.txt',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-five-red.txt',
  'docs/reviews/evidence/bifrost-course/qa/same-bundle-dom-probe.txt',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-storage-light.png',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-light-feedback.png',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-dark-feedback.png',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-dark-boundary-1.png',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-dark-boundary-2.png',
  'docs/reviews/evidence/bifrost-course/qa/initial-warning-evidence.json',
  'docs/reviews/evidence/bifrost-course/qa/combined-warning-deadline.txt',
  'docs/reviews/evidence/bifrost-course/qa/combined-warning-deadline-context.txt',
  'docs/reviews/evidence/bifrost-course/qa/combined-warning-deadline-1.png',
  'docs/reviews/evidence/bifrost-course/qa/combined-warning-deadline-2.png',
  'docs/reviews/evidence/bifrost-course/qa/combined-warning-deadline.json',
  'docs/reviews/evidence/bifrost-course/qa/before-appearance-result.json.raw',
  'docs/reviews/evidence/bifrost-course/qa/final-warning-two-cases.txt',
  'docs/reviews/evidence/bifrost-course/qa/final-case-plan.txt',
  ...images,
];
const bindings = proof.files as Record<string, { before: string; after: string }>;
const rows = execFileSync('git', ['ls-tree', '-r', courseBase], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((line) => {
    const [meta, path] = line.split('\t') as [string, string];
    return { path, hash: meta.split(' ')[2]! };
  })
  .filter(({ path }) => path !== 'quality/releases/current.json');
const parts = ['assets', 'locked evidence', 'documentation', 'source/config/tests'].map((name) => ({
  name,
  rows: rows.filter(
    ({ path }) =>
      (path.startsWith('public/')
        ? 'assets'
        : path.startsWith('docs/reviews/evidence/')
          ? 'locked evidence'
          : path.startsWith('docs/')
            ? 'documentation'
            : 'source/config/tests') === name,
  ),
}));
const original = (path: string) =>
  execFileSync('git', ['show', `${courseBase}:${path}`], { maxBuffer: 16 * 1024 * 1024 });
const rawHashes = (paths: string[]) =>
  execFileSync('git', ['hash-object', '--no-filters', '--', ...paths], { encoding: 'utf8' })
    .trim()
    .split('\n');

it('pins the exact audited B source base and finite presentation, import and evidence scopes', () => {
  expect(courseBase).toBe('7d68b2c40988385c31c1e514e67e5135a1fbe25e');
  expect(proof.base).toBe(courseBase);
  expect(Object.keys(bindings).sort()).toEqual([...approved].sort());
  expect(Object.keys(proof.added).sort()).toEqual([...additions].sort());
  expect(proof.metadata).toEqual([...courseMetadata]);
  const covered = parts.flatMap((part) => part.rows.map((row) => row.path));
  expect(covered.sort()).toEqual(rows.map((row) => row.path).sort());
  expect(new Set(covered).size).toBe(rows.length);
  for (const [path, binding] of Object.entries(bindings))
    expect(binding.before, path).toBe(rows.find((row) => row.path === path)?.hash);
});
it.each(parts)(
  'checks actual raw inherited $name bytes with unaliased native tools',
  ({ rows }) => {
    const hashes = rawHashes(rows.map((row) => row.path));
    expect(hashes).toHaveLength(rows.length);
    for (const [i, row] of rows.entries())
      expect(hashes[i], row.path).toBe(bindings[row.path]?.after ?? row.hash);
  },
);
it('checks every actual new file and the exact changed/untracked set before historical projections', () => {
  const entries = Object.entries(proof.added),
    hashes = rawHashes(entries.map(([path]) => path));
  for (const [i, [path, hash]] of entries.entries()) expect(hashes[i], path).toBe(hash);
  verifyCourseProjection(courseProjectionSnapshot());
});
it('rejects altered current/base bytes and unknown changed or untracked paths before either old enumeration', () => {
  const snapshot = courseProjectionSnapshot();
  verifyCourseProjection(snapshot);
  const path = approved[0]!;
  expect(() =>
    verifyCourseProjection({
      ...snapshot,
      current: { ...snapshot.current, [path]: Buffer.from('tampered') },
    }),
  ).toThrow(/unapproved current/);
  expect(() =>
    verifyCourseProjection({
      ...snapshot,
      original: { ...snapshot.original, [path]: Buffer.from('wrong base') },
    }),
  ).toThrow(/unapproved base/);
  for (const unknown of [
    'src/domain/unapproved-course-change.ts',
    'docs/quality/UNAPPROVED_EXTRA.md',
  ])
    expect(() =>
      verifyCourseProjection({ ...snapshot, paths: [...snapshot.paths, unknown] }),
    ).toThrow(/changed\/new course path set/);
  const before = Buffer.from('original'),
    after = Buffer.from('approved');
  expect(
    boundCourseBytes(after, before, {
      before: courseBlobHash(before),
      after: courseBlobHash(after),
    }),
  ).toEqual(before);
  expect(
    execBifrostCourse('git', ['diff', '--name-only', courseHistoricalBase], { encoding: 'utf8' }),
  ).toBe(
    execFileSync('git', ['diff', '--name-only', courseHistoricalBase, courseBase], {
      encoding: 'utf8',
    }),
  );
  expect(
    execBifrostCourse('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }),
  ).toBe('');
  expect(execBifrostCourse('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' })).toBe(
    execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }),
  );
  expect(execBifrostCourse('git', ['diff', '--name-only', courseBase], { encoding: 'utf8' })).toBe(
    execFileSync('git', ['diff', '--name-only', courseBase], { encoding: 'utf8' }),
  );
});

async function unchangedExcept(path: string, transform: (source: string) => string) {
  const expected = transform(original(path).toString());
  expect(readFileSync(path, 'utf8'), path).toBe(
    await format(expected, { ...(await resolveConfig(path)), filepath: path }),
  );
}
it('preserves whole original resident controller bodies after only exact class and CSS-import replacements', async () => {
  for (const path of [
    'src/features/learning/compute-vm.tsx',
    'src/features/learning/networking-inspection.tsx',
    'src/features/course/guided-coach.tsx',
    'src/features/course/mission-portal.tsx',
  ])
    await unchangedExcept(path, (source) =>
      source
        .replace(
          "'use client';\n",
          "'use client';\n" +
            (path.includes('/learning/')
              ? "import '@/features/course/bifrost-guidance.css';\n"
              : "import './bifrost-guidance.css';\n"),
        )
        .replaceAll(
          'className="compute-portal-guide"',
          'className="compute-portal-guide bifrost-learning bifrost-guide-island"',
        )
        .replaceAll(
          'className={`compute-portal-guide ',
          'className={`compute-portal-guide bifrost-learning bifrost-guide-island ',
        )
        .replaceAll(
          'className="guided-coach mission-coach"',
          'className="guided-coach mission-coach bifrost-learning bifrost-guide-island"',
        )
        .replaceAll(
          'className={`guided-coach ',
          'className={`guided-coach bifrost-learning bifrost-guide-island ',
        ),
    );
});
it('preserves all original course handlers, authorization and Journal selection after the finite shell wrappers', async () => {
  await unchangedExcept('src/features/course/course.tsx', (source) =>
    source
      .replace(
        "import { SavvyShark } from './savvy-shark';\n",
        "import { SavvyShark } from './savvy-shark';\nimport { ThemeToggle } from '@/features/design/theme';\nimport { BifrostBrandMark } from '@/features/design/brand-mark';\n",
      )
      .replace(
        'className={`portal course-shell course-hybrid ${',
        'className={`portal course-shell course-hybrid bifrost-learning ${',
      )
      .replace(
        '<svg className="course-brand-mark" viewBox="0 0 32 32" aria-hidden="true">\n            <path d="M5 25L16 5l11 20M9 19h14M5 28h22" />\n          </svg>',
        '<BifrostBrandMark className="course-brand-mark" />',
      )
      .replace(
        '<AzureLabHomeLink className="course-home-link" />',
        '<AzureLabHomeLink className="course-home-link" />\n        <ThemeToggle />',
      )
      .replace(
        '<PortalDialog title={c.journal} onClose={() => setJournal(false)}>\n',
        '<PortalDialog title={c.journal} onClose={() => setJournal(false)}>\n          <div className="bifrost-course-journal">\n',
      )
      .replace(
        '          </ManagementTeachingBoundary>\n        </PortalDialog>',
        '          </ManagementTeachingBoundary>\n          </div>\n        </PortalDialog>',
      ),
  );
  expect(readFileSync('src/features/course/course.css', 'utf8')).toBe(
    "@import './bifrost-course.css';\n\n" + original('src/features/course/course.css').toString(),
  );
});
it('keeps the original permitted submitted-check branch, comparison, strings and event handler exactly', async () => {
  await unchangedExcept('src/features/learning/foundations-v2.tsx', (source) =>
    source
      .replace(
        "import Link from 'next/link';\n",
        "import Link from 'next/link';\nimport { CircleCheck, CircleX } from 'lucide-react';\n",
      )
      .replace(
        '<p role="status" className="proof-causal">\n          {last.answer === checks[topic][0] ? item.correct : item.wrong}',
        `<p role="status" className="proof-causal" data-bf-result={last.answer === checks[topic][0] ? 'correct' : 'incorrect'}>
          {last.answer === checks[topic][0] ? <CircleCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}
          {last.answer === checks[topic][0] ? item.correct : item.wrong}`,
      ),
  );
});
it('keeps all original briefing milestone and global Journal bodies after exact presentation changes', async () => {
  for (const [path, oldClass, newClass, importAfter] of [
    [
      'src/features/course/guidance-window.tsx',
      'mission-briefing sl-guidance',
      'mission-briefing sl-guidance bifrost-learning',
      './mission-briefing.css',
    ],
    [
      'src/features/course/mission-briefing.tsx',
      'mission-briefing',
      'mission-briefing bifrost-learning',
      './mission-briefing.css',
    ],
    [
      'src/features/course/guidance-milestones.tsx',
      'mission-briefing milestone-dialog',
      'mission-briefing milestone-dialog bifrost-learning',
      './guidance-milestones.css',
    ],
  ])
    await unchangedExcept(path!, (source) =>
      source
        .replace(
          `import '${importAfter}';\n`,
          `import '${importAfter}';\nimport './bifrost-guidance.css';\n`,
        )
        .replace(`className="${oldClass}"`, `className="${newClass}"`),
    );
  await unchangedExcept('src/features/learning/journal.tsx', (source) =>
    source
      .replace(
        "import './learning.css';\n",
        "import './learning.css';\nimport '@/features/course/bifrost-guidance.css';\n",
      )
      .replace('className="knowledge-journal"', 'className="knowledge-journal bifrost-learning"'),
  );
});
it('retains every inherited preservation assertion with only finite reader import aliases', async () => {
  for (const [path, prefix, childProcess] of [
    ['tests/bifrost-foundation-preservation.ts', './', false],
    ['src/features/design/preservation.test.ts', '../../../tests/', true],
    ['src/features/course/hybrid-foundation.test.ts', '../../../tests/', false],
  ] as const)
    await unchangedExcept(path, (source) => {
      let expected = source.replace(
        "import { readFileSync } from 'node:fs';",
        `import { readBifrostCourse as readFileSync } from '${prefix}bifrost-course-preservation';`,
      );
      if (childProcess)
        expected = expected.replace(
          "import { execFileSync } from 'node:child_process';",
          `import { execBifrostCourse as execFileSync } from '${prefix}bifrost-course-preservation';`,
        );
      return expected;
    });
});
it('retains every inherited browser assertion and interaction except the exact approved hover expectation', async () => {
  await unchangedExcept('tests/e2e/hybrid-experience.spec.ts', (source) =>
    source.replace(
      "    'rgb(41, 73, 94)',",
      `    // Owner-authorized presentation replacement: the strict hover equality now
    // uses the exact Bifrost neutral token, pinned by the foundation token tests.
    await pathControl.evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.backgroundColor = 'var(--bfc-neutral-fade)';
      el.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    }),`,
    ),
  );
});
it('never imports the historical adapter from runtime modules or expands mutable report scope', () => {
  expect(courseMetadata).toEqual([
    'quality/releases/current.json',
    'docs/quality/BIFROST_COURSE_QA_REVIEW.md',
    'docs/quality/BIFROST_COURSE_FINAL_AUDIT.md',
  ]);
  expect(courseProofPath).toBe('docs/reviews/evidence/bifrost-course/preservation.json');
  for (const { path } of rows.filter(
    ({ path }) => /^src\/.*\.(ts|tsx)$/.test(path) && !path.endsWith('.test.ts'),
  ))
    expect(readFileSync(path, 'utf8'), path).not.toMatch(
      /from ['"][^'"]*bifrost-course-preservation/,
    );
});
