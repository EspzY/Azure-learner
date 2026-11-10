import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve('.');
const files = (folder) =>
  readdirSync(folder, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(`${folder}/${e.name}`) : [`${folder}/${e.name}`],
  );
const source = files('src').filter((p) => /\.(tsx?|css)$/.test(p));
const forbidden =
  /(?:@react-three\/|from\s*['"]three(?:\/|['"])|import\(['"]three|features\/(?:rpg|journey|organization|design-proof)\/|@\/domain\/(?:rpg|instruction)\/|\/game\/|features\/rpg\/game\.css)/;
const failures = source.filter((p) => forbidden.test(readFileSync(resolve(root, p), 'utf8')));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const name of ['three', '@react-three/fiber', '@types/three'])
  if (pkg.dependencies?.[name] || pkg.devDependencies?.[name])
    failures.push(`retired dependency: ${name}`);
for (const path of files('public'))
  if (/\.(glb|wav)$/.test(path) || path.startsWith('public/game/'))
    failures.push(`retired asset: ${path}`);
if (failures.length) throw Error(`Retired runtime boundary violated:\n${failures.join('\n')}`);
console.log(
  `Legacy boundary: ${source.length} current source/style files; no retired imports, renderer dependencies or game assets.`,
);
