// Offline, reproducible inclusion/optimization of reviewed CC0 source archives.
// Usage: node scripts/prepare-game-assets.mjs <space-unpacked> <characters-unpacked>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

const [spaceRoot, characterRoot] = process.argv.slice(2).map((p) => resolve(p));
if (!spaceRoot || !characterRoot)
  throw new Error('Supply the two unpacked official Kenney archives.');
const destination = resolve('public/game');
const models = [
  'gate_complex',
  'hangar_roundA',
  'hangar_roundGlass',
  'hangar_smallA',
  'hangar_largeA',
  'satelliteDish_detailed',
  'satelliteDish_large',
  'machine_generatorLarge',
  'machine_wireless',
  'machine_barrel',
  'barrels',
  'rover',
  'craft_cargoA',
  'pipe_straight',
  'pipe_cornerRound',
  'pipe_supportLow',
  'structure_detailed',
  'rock_largeA',
  'rock_largeB',
  'rocks_smallA',
  'rock_crystals',
  'platform_large',
  'stairs_short',
];
const people = ['character-female-a', 'character-female-d', 'character-male-f'];
const palette = {
  metal: [0.6, 0.7, 0.72, 1],
  metalDark: [0.1, 0.18, 0.24, 1],
  metalRed: [0.14, 0.43, 0.49, 1],
  dark: [0.025, 0.05, 0.08, 1],
  rock: [0.12, 0.23, 0.24, 1],
  rockTrack: [0.22, 0.34, 0.32, 1],
};
const keepAnimations = new Set([
  'idle',
  'walk',
  'interact-right',
  'emote-yes',
  'emote-no',
  'pick-up',
]);
const manifest = [];
const pad = (b, fill = 0) => Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4, fill)]);
function optimize(bytes, character) {
  const jsonLength = bytes.readUInt32LE(12);
  const data = JSON.parse(bytes.subarray(20, 20 + jsonLength));
  const binStart = 20 + jsonLength + 8;
  const binary = bytes.subarray(binStart);
  if (character) data.animations = data.animations.filter((a) => keepAnimations.has(a.name));
  else
    for (const mat of data.materials ?? []) {
      const pbr = mat.pbrMetallicRoughness;
      if (palette[mat.name]) pbr.baseColorFactor = palette[mat.name];
      pbr.metallicFactor = mat.name.startsWith('metal') ? 0.25 : 0;
      pbr.roughnessFactor = 0.72;
    }
  // Keep only accessors/buffer views reachable by geometry, skins, retained clips and images.
  const indices = new Set();
  for (const mesh of data.meshes ?? [])
    for (const p of mesh.primitives) {
      Object.values(p.attributes).forEach((id) => indices.add(id));
      if (p.indices !== undefined) indices.add(p.indices);
      for (const target of p.targets ?? []) Object.values(target).forEach((id) => indices.add(id));
    }
  for (const skin of data.skins ?? [])
    if (skin.inverseBindMatrices !== undefined) indices.add(skin.inverseBindMatrices);
  for (const a of data.animations ?? [])
    for (const s of a.samplers) {
      indices.add(s.input);
      indices.add(s.output);
    }
  const accessorIds = [...indices].sort((a, b) => a - b);
  const accessorMap = new Map(accessorIds.map((id, i) => [id, i]));
  const views = new Set(accessorIds.map((id) => data.accessors[id].bufferView));
  for (const image of data.images ?? [])
    if (image.bufferView !== undefined) views.add(image.bufferView);
  const viewIds = [...views].sort((a, b) => a - b);
  const viewMap = new Map(viewIds.map((id, i) => [id, i]));
  let offset = 0;
  const chunks = [];
  const newViews = viewIds.map((id) => {
    const old = data.bufferViews[id];
    const chunk = pad(binary.subarray(old.byteOffset ?? 0, (old.byteOffset ?? 0) + old.byteLength));
    const v = { ...old, buffer: 0, byteOffset: offset };
    chunks.push(chunk);
    offset += chunk.length;
    return v;
  });
  const mapAttributes = (o) =>
    Object.fromEntries(Object.entries(o).map(([key, id]) => [key, accessorMap.get(id)]));
  for (const mesh of data.meshes ?? [])
    for (const p of mesh.primitives) {
      p.attributes = mapAttributes(p.attributes);
      if (p.indices !== undefined) p.indices = accessorMap.get(p.indices);
      if (p.targets) p.targets = p.targets.map(mapAttributes);
    }
  for (const skin of data.skins ?? [])
    if (skin.inverseBindMatrices !== undefined)
      skin.inverseBindMatrices = accessorMap.get(skin.inverseBindMatrices);
  for (const a of data.animations ?? [])
    for (const s of a.samplers) {
      s.input = accessorMap.get(s.input);
      s.output = accessorMap.get(s.output);
    }
  for (const image of data.images ?? [])
    if (image.bufferView !== undefined) image.bufferView = viewMap.get(image.bufferView);
  data.accessors = accessorIds.map((id) => ({
    ...data.accessors[id],
    bufferView: viewMap.get(data.accessors[id].bufferView),
  }));
  data.bufferViews = newViews;
  data.buffers = [{ byteLength: offset }];
  const json = pad(Buffer.from(JSON.stringify(data)), 32);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(20);
  header.write('glTF');
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + json.length + bin.length, 8);
  header.writeUInt32LE(json.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const bh = Buffer.alloc(8);
  bh.writeUInt32LE(bin.length);
  bh.writeUInt32LE(0x004e4942, 4);
  return {
    bytes: Buffer.concat([header, json, bh, bin]),
    animations: data.animations?.map((a) => a.name) ?? [],
    triangles: data.meshes.reduce(
      (n, m) =>
        n +
        m.primitives.reduce(
          (k, p) =>
            k +
            (p.indices !== undefined
              ? data.accessors[p.indices].count
              : data.accessors[p.attributes.POSITION].count) /
              3,
          0,
        ),
      0,
    ),
  };
}
for (const [root, folder, pack, names] of [
  [spaceRoot, 'station', 'Space Kit 2.0', models],
  [characterRoot, 'people', 'Mini Characters 1.0', people],
]) {
  mkdirSync(join(destination, folder), { recursive: true });
  for (const name of names) {
    const file = `${name}.glb`;
    const source = readFileSync(
      join(root, 'Models', folder === 'station' ? 'GLTF format' : 'GLB format', file),
    );
    const result = optimize(source, folder === 'people');
    writeFileSync(join(destination, folder, file), result.bytes);
    manifest.push({
      file: `/game/${folder}/${file}`,
      pack,
      sourceBytes: source.length,
      bytes: result.bytes.length,
      sha256: createHash('sha256').update(result.bytes).digest('hex'),
      triangles: result.triangles,
      animations: result.animations,
    });
  }
  mkdirSync(join(destination, 'licenses'), { recursive: true });
  const license = readFileSync(join(root, 'License.txt'), 'utf8')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
  writeFileSync(join(destination, 'licenses', `${folder}.txt`), license);
}
mkdirSync(join(destination, 'people', 'Textures'), { recursive: true });
copyFileSync(
  join(characterRoot, 'Models', 'GLB format', 'Textures', 'colormap.png'),
  join(destination, 'people', 'Textures', 'colormap.png'),
);
writeFileSync(
  join(destination, 'manifest.json'),
  JSON.stringify({ version: 1, included: '2026-10-23', assets: manifest }, null, 2) + '\n',
);
console.log(
  `Included ${manifest.length} models, ${manifest.reduce((n, a) => n + a.bytes, 0)} bytes (source ${manifest.reduce((n, a) => n + a.sourceBytes, 0)}).`,
);
