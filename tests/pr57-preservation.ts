import { expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/pr57/preservation.json';
const hash = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
export const pr57PresentationChanges = Object.keys(proof.presentation);
let originals: Map<string, Buffer> | undefined;
/** One bounded local Git read, rather than spawning Git for every earlier guard. */
export function pr57OriginalSource(path: string) {
  if (!originals) {
    const paths = [...pr57PresentationChanges, ...Object.keys(proof.authorizedTests)];
    const raw = execFileSync('git', ['cat-file', '--batch'], {
      input: paths.map((p) => `${proof.base}:${p}\n`).join(''),
      maxBuffer: 8 * 1024 * 1024,
    });
    originals = new Map();
    let offset = 0;
    for (const p of paths) {
      const end = raw.indexOf(10, offset),
        header = raw.subarray(offset, end).toString();
      if (!/^[a-f0-9]{40} blob \d+$/.test(header)) throw Error('Invalid base blob: ' + p);
      const size = Number(header.split(' ')[2]),
        start = end + 1;
      originals.set(p, raw.subarray(start, start + size));
      offset = start + size + 1;
    }
    if (offset !== raw.length) throw Error('Unexpected base blob bytes');
  }
  const bytes = originals.get(path);
  if (!bytes) throw Error('Undeclared original source: ' + path);
  return bytes;
}

/** Continue earlier byte guards only through the explicit, independently reviewed display diff. */
export function assertPR57Presentation(path: string, historicalHash?: string) {
  expect(proof.base).toBe('a3f1b575b2eb5b257fd455fec1a73b30a38706f4');
  const entry = (proof.presentation as Record<string, { before: string; after: string }>)[path];
  expect(entry, path).toBeDefined();
  if (!entry) throw Error('Missing PR57 presentation authorization: ' + path);
  const before = pr57OriginalSource(path);
  expect(hash(before), path).toBe(entry.before);
  if (historicalHash) expect(entry.before, path).toBe(historicalHash);
  expect(hash(readFileSync(path)), path).toBe(entry.after);
}
