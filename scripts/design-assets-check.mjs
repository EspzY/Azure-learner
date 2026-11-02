import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const hash = (b) => createHash('sha256').update(b).digest('hex');
export async function checkDesignAssets(root = process.cwd()) {
  const read = (p) => readFileSync(resolve(root, p));
  const base = 'public/design-review/characters/v1/';
  const m = JSON.parse(read(base + 'manifest.json'));
  const original = read('public/mascot/savvy-shark-default.png');
  if (
    m.schema !== 1 ||
    m.libraryStatus !== 'production-blocked' ||
    m.canonical.modified !== false ||
    m.canonical.file !== '/mascot/savvy-shark-default.png' ||
    m.canonical.sha256 !== hash(original)
  )
    throw Error('Invalid locked character reference');
  const registered = new Set(['manifest.json']),
    ids = new Set();
  for (const pose of m.poses) {
    if (
      ids.has(pose.id) ||
      pose.status !== 'review-only-rejected' ||
      pose.productionAllowed !== false ||
      pose.fallback !== m.canonical.file ||
      !pose.provenance?.authorization ||
      pose.provenance.canonicalSHA256 !== m.canonical.sha256
    )
      throw Error('Unapproved character policy');
    ids.add(pose.id);
    for (const a of [pose, ...pose.variants]) {
      if (!/^[a-z0-9-]+\.(png|webp)$/.test(a.file)) throw Error('Unsafe character path');
      const bytes = read(base + a.file),
        info = await sharp(bytes).metadata();
      if (
        hash(bytes) !== a.sha256 ||
        bytes.length !== a.bytes ||
        info.width !== a.width ||
        info.height !== a.height ||
        info.format !== a.format ||
        !info.hasAlpha
      )
        throw Error('Altered character asset');
      registered.add(a.file);
    }
  }
  for (const p of m.planned) {
    if (ids.has(p.id) || p.file !== null)
      throw Error('Planned poses must not masquerade as produced assets');
    ids.add(p.id);
  }
  if (readdirSync(resolve(root, base)).some((f) => !registered.has(f)))
    throw Error('Unregistered character export');
  const fontBase = 'public/design-review/fonts/',
    fonts = JSON.parse(read(fontBase + 'manifest.json'));
  const fontFiles = new Set(['manifest.json']);
  for (const f of fonts.fonts) {
    if (!/^[a-z0-9-]+\.woff2$/.test(f.file) || !/^[a-z0-9-]+-OFL\.txt$/.test(f.license))
      throw Error('Unsafe font path');
    const bytes = read(fontBase + f.file),
      license = read(fontBase + f.license);
    if (
      bytes.toString('ascii', 0, 4) !== 'wOF2' ||
      hash(bytes) !== f.sha256 ||
      bytes.length !== f.bytes ||
      hash(license) !== f.licenseSHA256 ||
      !license.toString().includes('SIL OPEN FONT LICENSE') ||
      !f.source.startsWith('https://fonts.gstatic.com/')
    )
      throw Error('Unverified local font');
    fontFiles.add(f.file);
    fontFiles.add(f.license);
  }
  if (readdirSync(resolve(root, fontBase)).some((f) => !fontFiles.has(f)))
    throw Error('Unregistered font');
  return {
    produced: m.poses.length,
    approved: 0,
    planned: m.planned.length,
    fontBytes: fonts.fonts.reduce((n, f) => n + f.bytes, 0),
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  console.log(JSON.stringify(await checkDesignAssets()));
