/** Test-only, finite historical B view. No application module imports this file.
 * The new C guard hashes the entire actual B tree with unaliased native tools. */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import proof from '../docs/reviews/evidence/bifrost-course/preservation.json';

export const courseBase = '7d68b2c40988385c31c1e514e67e5135a1fbe25e';
export const courseHistoricalBase = '249833f7cb7ea41d3e411444ec3c4f83805d3a5f';
export const courseProofPath = 'docs/reviews/evidence/bifrost-course/preservation.json';
export const courseMetadata = [
  'quality/releases/current.json',
  'docs/quality/BIFROST_COURSE_QA_REVIEW.md',
  'docs/quality/BIFROST_COURSE_FINAL_AUDIT.md',
] as const;
type Binding = { before: string; after: string };
const bindings = proof.files as Record<string, Binding>;
const added = proof.added as Record<string, string>;
export const courseBlobHash = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const originals = new Map<string, Buffer>();
export function courseOriginal(path: string) {
  if (!originals.has(path))
    originals.set(
      path,
      execFileSync('git', ['show', courseBase + ':' + path], { maxBuffer: 16 * 1024 * 1024 }),
    );
  return originals.get(path)!;
}
export function boundCourseBytes(actual: Buffer, original: Buffer, binding: Binding) {
  assert.equal(courseBlobHash(actual), binding.after, 'unapproved current course bytes');
  assert.equal(courseBlobHash(original), binding.before, 'unapproved base course bytes');
  return original;
}
const lines = (s: string) => s.trim().split('\n').filter(Boolean);
type ProjectionSnapshot = {
  paths: string[];
  current: Record<string, Buffer>;
  original: Record<string, Buffer>;
};
/** Real native reads, including the exact changed/new set, precede either
 * old B enumeration projection. Unknown changes and untracked files fail. */
export function courseProjectionSnapshot(): ProjectionSnapshot {
  return {
    paths: [
      ...new Set([
        ...lines(execFileSync('git', ['diff', '--name-only', courseBase], { encoding: 'utf8' })),
        ...lines(
          execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }),
        ),
      ]),
    ],
    current: Object.fromEntries(
      [...Object.keys(bindings), ...Object.keys(added)].map((path) => [path, readFileSync(path)]),
    ),
    original: Object.fromEntries(Object.keys(bindings).map((path) => [path, courseOriginal(path)])),
  };
}
export function verifyCourseProjection(snapshot: ProjectionSnapshot) {
  assert.equal(proof.base, courseBase, 'wrong course base');
  assert.deepEqual(proof.metadata, [...courseMetadata], 'unapproved metadata scope');
  const normalized = (paths: string[]) =>
    [...new Set(paths)]
      .filter((path) => !(courseMetadata as readonly string[]).includes(path))
      .sort();
  assert.deepEqual(
    normalized(snapshot.paths),
    normalized([...Object.keys(bindings), ...Object.keys(added), courseProofPath]),
    'unapproved actual changed/new course path set',
  );
  for (const [path, binding] of Object.entries(bindings))
    boundCourseBytes(snapshot.current[path]!, snapshot.original[path]!, binding);
  for (const [path, hash] of Object.entries(added))
    assert.equal(
      courseBlobHash(snapshot.current[path]!),
      hash,
      'unapproved added course bytes: ' + path,
    );
}
export function readBifrostCourse(path: string): Buffer;
export function readBifrostCourse(path: string, encoding: 'utf8'): string;
export function readBifrostCourse(path: string, encoding?: 'utf8'): Buffer | string {
  const actual = readFileSync(path),
    binding = Object.hasOwn(bindings, path) ? bindings[path] : undefined;
  const bytes = binding ? boundCourseBytes(actual, courseOriginal(path), binding) : actual;
  return encoding ? bytes.toString(encoding) : bytes;
}
export function execBifrostCourse(
  file: string,
  args: readonly string[],
  options: { encoding: 'utf8'; maxBuffer?: number },
): string;
export function execBifrostCourse(file: string, args: readonly string[]): Buffer;
export function execBifrostCourse(
  file: string,
  args: readonly string[],
  options?: { encoding: 'utf8'; maxBuffer?: number },
): string | Buffer {
  if (
    file === 'git' &&
    args.length > 3 &&
    args[0] === 'hash-object' &&
    args[1] === '--no-filters' &&
    args[2] === '--'
  ) {
    const result =
      args
        .slice(3)
        .map((path) => courseBlobHash(readBifrostCourse(path)))
        .join('\n') + '\n';
    return options?.encoding ? result : Buffer.from(result);
  }
  if (
    file === 'git' &&
    args.length === 3 &&
    args[0] === 'diff' &&
    args[1] === '--name-only' &&
    args[2] === courseHistoricalBase
  ) {
    verifyCourseProjection(courseProjectionSnapshot());
    const result = execFileSync('git', ['diff', '--name-only', courseHistoricalBase, courseBase]);
    return options?.encoding ? result.toString(options.encoding) : result;
  }
  if (
    file === 'git' &&
    args.length === 3 &&
    args[0] === 'ls-files' &&
    args[1] === '--others' &&
    args[2] === '--exclude-standard'
  ) {
    verifyCourseProjection(courseProjectionSnapshot());
    // Every actual untracked path has already been verified as a finite C
    // addition, its self-referential manifest, or one of the three metadata paths.
    const result = Buffer.from('');
    return options?.encoding ? result.toString(options.encoding) : result;
  }
  return options ? execFileSync(file, args, options) : execFileSync(file, args);
}
