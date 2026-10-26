import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const mascot = JSON.parse(readFileSync(resolve('public/mascot/manifest.json'), 'utf8'));
const mascotBytes = readFileSync(resolve('public/mascot/savvy-shark-default.png'));
if (
  mascot.schema !== 1 ||
  mascot.file !== 'savvy-shark-default.png' ||
  mascot.bytes !== mascotBytes.length ||
  mascotBytes.readUInt32BE(0) !== 0x89504e47 ||
  createHash('sha256').update(mascotBytes).digest('hex') !== mascot.sha256 ||
  !mascot.authorization
)
  throw Error('Unreviewed SavvyShark asset');

const allowed = new Set(['manifest.json', mascot.file]);
for (const file of readdirSync(resolve('public/mascot')))
  if (!allowed.has(file)) throw Error(`Unregistered mascot asset: ${file}`);
console.log(
  `Assets: owner-authorized local SavvyShark PNG, ${mascotBytes.length} bytes; signature, hash, size and registration valid. Retired game assets are not shipped.`,
);

const registry = JSON.parse(readFileSync(resolve('public/icons/manifest.json'), 'utf8'));
if (registry.schema !== 1 || !registry.azure.scope || registry.fluent.license !== 'MIT')
  throw Error('Unreviewed Portal icon registry');
const iconFiles = new Set();
let bytes = 0;
for (const [id, asset] of Object.entries(registry.assets)) {
  if (!/^(azure|fluent)\/[a-zA-Z0-9_-]+\.svg$/.test(asset.file))
    throw Error(`Unsafe icon path: ${id}`);
  const buffer = readFileSync(resolve('public/icons', asset.file));
  const svg = buffer.toString('utf8');
  if (
    buffer.length !== asset.bytes ||
    createHash('sha256').update(buffer).digest('hex') !== asset.sha256 ||
    !svg.includes('<svg') ||
    !svg.includes('viewBox=') ||
    /<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i.test(
      svg,
    ) ||
    !asset.source ||
    !asset.reference ||
    !['MATCH', 'PARTIAL', 'UNVERIFIED', 'BLOCKED'].includes(asset.result)
  )
    throw Error(`Altered, unsafe or undocumented icon: ${id}`);
  if (!iconFiles.has(asset.file)) bytes += buffer.length;
  iconFiles.add(asset.file);
}
for (const family of ['azure', 'fluent'])
  for (const file of readdirSync(resolve('public/icons', family)))
    if (!iconFiles.has(`${family}/${file}`)) throw Error(`Unregistered icon: ${family}/${file}`);
for (const [alias, canonical] of Object.entries(registry.aliases))
  if (registry.assets[alias] || !registry.assets[canonical])
    throw Error(`Invalid icon alias: ${alias}`);
for (const kind of [
  'group',
  'subscription',
  'root',
  'management',
  'tenant',
  'plan',
  'app',
  'vm',
  'disk',
  'nic',
  'vnet',
  'subnet',
  'activity',
  'policy',
  'resources',
  'home',
  'services',
  'search',
  'notifications',
  'settings',
  'help',
  'create',
  'learn',
  'responsibility',
  'architecture',
  'hierarchy',
  'challenge',
])
  if (!registry.assets[registry.aliases[kind] ?? kind])
    throw Error(`Missing Portal mapping: ${kind}`);
if (
  !readFileSync(resolve('public/icons/licenses/Fluent-MIT.txt'), 'utf8').includes('MIT License') ||
  !readFileSync(resolve('public/icons/licenses/Microsoft_Terms_of_Use.pdf')).includes(
    Buffer.from('%PDF'),
  )
)
  throw Error('Missing original icon terms');
for (const [file, license] of Object.entries(registry.licenses)) {
  const original = readFileSync(resolve('public/icons', file));
  if (
    original.length !== license.bytes ||
    createHash('sha256').update(original).digest('hex') !== license.sha256 ||
    !license.source
  )
    throw Error(`Altered license notice: ${file}`);
}
console.log(
  `Portal icons: ${Object.keys(registry.assets).length} explicit identities, ${iconFiles.size} source SVGs / ${bytes} bytes, original hashes, local paths, safe SVG and provenance validated. No generic fallback.`,
);
