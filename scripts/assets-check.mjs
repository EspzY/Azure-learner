import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, sep } from 'node:path';

const root = resolve('public/game');
const manifest = JSON.parse(readFileSync(resolve(root, 'manifest.json'), 'utf8'));
const clips = ['idle', 'walk', 'interact-right', 'emote-yes', 'emote-no', 'pick-up'];
let bytes = 0;
function requireValid(condition, message) {
  if (!condition) throw new Error(message);
}
function localPath(file) {
  const path = resolve(root, file);
  requireValid(path.startsWith(root + sep), `Asset leaves reviewed folder: ${file}`);
  return path;
}
requireValid(manifest.version === 1 && manifest.assets.length === 26, 'Unexpected asset manifest');
const registered = new Set(manifest.assets.map((entry) => entry.file));
for (const folder of ['station', 'people'])
  for (const file of readdirSync(resolve(root, folder)))
    if (file.endsWith('.glb'))
      requireValid(registered.has(`/game/${folder}/${file}`), `Unregistered model: ${file}`);
for (const entry of manifest.assets) {
  requireValid(/^\/game\/(station|people)\/[\w-]+\.glb$/.test(entry.file), 'Unreviewed model path');
  const path = localPath(entry.file.slice('/game/'.length));
  const buffer = readFileSync(path);
  requireValid(
    buffer.length === entry.bytes &&
      createHash('sha256').update(buffer).digest('hex') === entry.sha256,
    `Hash/size mismatch: ${entry.file}`,
  );
  requireValid(
    buffer.readUInt32LE(0) === 0x46546c67 &&
      buffer.readUInt32LE(4) === 2 &&
      buffer.readUInt32LE(8) === buffer.length,
    'Invalid GLB envelope',
  );
  const length = buffer.readUInt32LE(12);
  requireValid(
    buffer.readUInt32LE(16) === 0x4e4f534a && length + 28 <= buffer.length,
    'Invalid JSON chunk',
  );
  const model = JSON.parse(buffer.subarray(20, 20 + length).toString('utf8'));
  const binLength = buffer.readUInt32LE(20 + length);
  requireValid(
    model.asset.version === '2.0' && !model.extensionsRequired?.length,
    'Unexpected decoder requirement',
  );
  requireValid(
    model.buffers.length === 1 && !model.buffers[0].uri && model.buffers[0].byteLength <= binLength,
    'Nonlocal model buffer',
  );
  for (const view of model.bufferViews ?? [])
    requireValid(
      view.buffer === 0 && (view.byteOffset ?? 0) + view.byteLength <= binLength,
      'Invalid buffer view',
    );
  for (const accessor of model.accessors ?? [])
    requireValid(
      Number.isInteger(accessor.bufferView) && !!model.bufferViews[accessor.bufferView],
      'Invalid accessor reference',
    );
  for (const mesh of model.meshes ?? [])
    for (const primitive of mesh.primitives) {
      for (const accessor of [
        ...Object.values(primitive.attributes),
        ...(primitive.indices === undefined ? [] : [primitive.indices]),
      ])
        requireValid(!!model.accessors[accessor], 'Invalid mesh accessor');
    }
  for (const image of model.images ?? []) {
    requireValid(image.uri === 'Textures/colormap.png', 'Unreviewed image URI');
    requireValid(
      statSync(resolve(dirname(path), image.uri)).size === 8706,
      'Missing reviewed character texture',
    );
  }
  if (entry.pack.startsWith('Mini')) {
    requireValid(model.skins?.length > 0, 'Character must be rigged');
    requireValid(
      clips.every((name) => model.animations?.some((a) => a.name === name)),
      'Missing required locomotion/gesture clip',
    );
    for (const animation of model.animations)
      for (const sampler of animation.samplers)
        requireValid(
          !!model.accessors[sampler.input] && !!model.accessors[sampler.output],
          'Invalid animation accessor',
        );
  }
  bytes += buffer.length;
}
for (const file of ['licenses/station.txt', 'licenses/people.txt'])
  requireValid(readFileSync(localPath(file), 'utf8').includes('CC0'), 'Missing asset license');
requireValid(bytes < 2_000_000, 'Reviewed GLB transfer budget exceeded');
const audio = JSON.parse(readFileSync(localPath('audio/manifest.json'), 'utf8'));
const wave = readFileSync(localPath('audio/lysningen.wav'));
requireValid(
  audio.schema === 1 &&
    audio.file === '/game/audio/lysningen.wav' &&
    audio.license === 'CC0-1.0' &&
    audio.creator === 'AzureLab',
  'Unreviewed audio provenance',
);
requireValid(
  wave.length === audio.bytes &&
    wave.length < 1_500_000 &&
    createHash('sha256').update(wave).digest('hex') === audio.sha256,
  'Audio hash/budget mismatch',
);
requireValid(
  wave.toString('ascii', 0, 4) === 'RIFF' &&
    wave.toString('ascii', 8, 12) === 'WAVE' &&
    wave.readUInt16LE(20) === 1 &&
    wave.readUInt32LE(24) === 22050 &&
    wave.readUInt32LE(40) === wave.length - 44,
  'Unexpected local audio format',
);
requireValid(
  readFileSync(localPath('audio/license.txt'), 'utf8').includes('CC0'),
  'Missing original audio license',
);
for (const file of readdirSync(localPath('audio')))
  requireValid(
    ['lysningen.wav', 'manifest.json', 'license.txt'].includes(file),
    'Unregistered audio file',
  );
console.log(`Audio: original CC0 PCM loop, ${wave.length} bytes; local hash/provenance valid.`);
console.log(
  `Assets: ${manifest.assets.length} reviewed GLBs, ${bytes} bytes; hashes, local references, buffers, rigs, clips and licenses valid.`,
);
