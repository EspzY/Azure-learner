import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'docs/PROJECT_STATUS.md',
  'docs/PRODUCT_VISION.md',
  'docs/ARCHITECTURE.md',
  'docs/DESIGN_SYSTEM.md',
  'docs/LEARNING_DESIGN.md',
  'docs/DECISIONS.md',
  'docs/ROADMAP.md',
  'docs/SECURITY.md',
  'docs/MICROSOFT_LEARN.md',
  'docs/EXPERIENCE_DESIGN.md',
  'docs/PRODUCT_BLUEPRINT.md',
  'docs/LEARNING_JOURNEY.md',
  'docs/EXPERIENCE_PATTERNS.md',
  'docs/SIMULATION_PLATFORM.md',
  'docs/CHAPTER_01_BLUEPRINT.md',
  'docs/EXPERIENCE_BLUEPRINTS.md',
  'docs/SOURCE_REGISTER.md',
  'docs/JOURNEY_EXPERIENCE.md',
  'docs/CHAPTER_01_GUIDED.md',
  'docs/GAME_WORLD_DESIGN.md',
  'docs/GAMEPLAY_ARCHITECTURE.md',
  'docs/NPC_DIALOGUE_DESIGN.md',
  'docs/ASSET_REGISTER.md',
  'docs/CURRICULUM_COVERAGE.md',
  'docs/CONTENT_STANDARDS.md',
  'docs/CONTENT_ARCHITECTURE.md',
  'docs/FOUNDATIONS_01_CONTENT.md',
  'docs/PLAYER_ONBOARDING.md',
  'docs/EXPEDITION_PROGRESSION.md',
  'docs/INSTRUCTIONAL_SEQUENCE_ENGINE.md',
  'docs/PORTAL_PRODUCT_STRATEGY.md',
  'docs/PORTAL_SANDBOX_ARCHITECTURE.md',
  'docs/PORTAL_REFERENCE_FIDELITY.md',
  'docs/PORTAL_LEARNING_EXPERIENCE.md',
  'docs/INTERACTIVE_VISUALIZATIONS.md',
  'docs/COURSE_FIRST_PRODUCT_EXPERIENCE.md',
  'docs/GUIDED_SANDBOX_ENGINE.md',
  'docs/SAVVYSHARK_INTEGRATION.md',
  'docs/COURSE_LAB_ORCHESTRATION.md',
  'docs/BEGINNER_LEARNING_AUDIT.md',
  'docs/FOUNDATIONS_PEDAGOGY_BLUEPRINT.md',
  'docs/VISUAL_LEARNING_SYSTEM.md',
  'docs/FOUNDATIONS_31A_STORYBOARD.md',
  'docs/FOUNDATIONS_31B_HANDOFF.md',
];

function markdownFiles(folder) {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(folder, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}
function headings(source) {
  const counts = new Map();
  return [...source.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => {
    const base = match[1]
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s/g, '-');
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  });
}
export function validateDocumentation(root) {
  const errors = [];
  for (const file of requiredFiles) {
    const path = resolve(root, file);
    if (!existsSync(path) || !readFileSync(path, 'utf8').trim())
      errors.push(`Required document missing or empty: ${file}`);
  }
  const files = [
    resolve(root, 'README.md'),
    resolve(root, 'AGENTS.md'),
    ...markdownFiles(resolve(root, 'docs')),
  ].filter(existsSync);
  for (const file of files) {
    // Lightweight Markdown link validation; ignore code samples, inspect inline and reference links.
    const source = readFileSync(file, 'utf8').replace(/^\s*(```|~~~)[\s\S]*?^\s*\1.*$/gm, '');
    const links = [
      ...source.matchAll(/!?\[[^\]\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g),
      ...source.matchAll(/^\s*\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gm),
    ];
    for (const match of links) {
      const href = match[1] ?? match[2];
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
      let decoded;
      try {
        decoded = decodeURIComponent(href);
      } catch {
        errors.push(`${relative(root, file)}: invalid URL encoding: ${href}`);
        continue;
      }
      const [pathPart, anchor] = decoded.split('#');
      const target = pathPart ? resolve(dirname(file), pathPart.split('?')[0]) : file;
      const local = relative(resolve(root), target);
      if (local.startsWith('..') || isAbsolute(local)) {
        errors.push(`${relative(root, file)}: link leaves repository: ${href}`);
        continue;
      }
      if (!existsSync(target)) errors.push(`${relative(root, file)}: broken local link: ${href}`);
      else if (
        anchor &&
        extname(target) === '.md' &&
        statSync(target).isFile() &&
        !headings(readFileSync(target, 'utf8')).includes(anchor)
      )
        errors.push(`${relative(root, file)}: missing heading: ${href}`);
    }
  }
  return { errors, checked: files.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateDocumentation(process.cwd());
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
  } else
    console.log(
      `Documentation OK: ${result.checked} Markdown files; required files and local links verified.`,
    );
}
