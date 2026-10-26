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
