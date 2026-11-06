import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import proof from '../docs/reviews/evidence/pr63/preservation.json';
import { pr63Base, pr63Hash, pr63Original } from '../tests/pr63-preservation';

const changes = [
  'AGENTS.md',
  'public/icons/manifest.json',
  'src/features/laboratory/laboratory.css',
  'src/features/laboratory/laboratory.tsx',
  'src/features/laboratory/networking.tsx',
  'src/features/portal/create-resource.tsx',
  'src/features/portal/inventory.tsx',
  'src/features/portal/portal.tsx',
  'src/features/portal/receipt-panel.tsx',
  'src/laboratory-networking-preservation.test.ts',
  'tests/e2e/laboratory-networking.spec.ts',
  'tests/e2e/laboratory-server.spec.ts',
  'tests/pr62-preservation.ts',
  'playwright.desktop.config.ts',
];

it('pins only the explicit shared presentation scope and preserves every other original authority history assessment provider asset and locked review byte', () => {
  expect(Object.keys(proof.files).sort()).toEqual([...changes].sort());
  const lines = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      pr63Base,
      '--',
      'src',
      'tests',
      'scripts',
      'database',
      'public',
      '.github',
      'package.json',
      'package-lock.json',
      'playwright.config.ts',
      'playwright.desktop.config.ts',
      'AGENTS.md',
      'docs/reviews',
      'docs/quality',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n');
  expect(lines.length).toBeGreaterThan(930);
  for (const line of lines) {
    const [meta, path] = line.split('\t') as [string, string];
    const bytes = readFileSync(path);
    if (changes.includes(path)) {
      const entry = (proof.files as Record<string, { before: string; after: string }>)[path]!;
      expect(pr63Hash(pr63Original(path)), path).toBe(entry.before);
      expect(pr63Hash(bytes), path).toBe(entry.after);
    } else
      expect(
        createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),
        path,
      ).toBe(meta.split(' ')[2]);
  }
});

it('keeps all prior historical assertions through two import-only read delegations', () => {
  for (const [path, prefix] of [
    ['tests/pr62-preservation.ts', './'],
    ['src/laboratory-networking-preservation.test.ts', '../tests/'],
  ]) {
    expect(readFileSync(path!, 'utf8')).toBe(
      pr63Original(path!)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readPR63 as readFileSync } from '${prefix}pr63-preservation';`,
        ),
    );
  }
});

it('preserves the complete course Portal controller and free session request review run load and pending recovery code', () => {
  const portal = 'src/features/portal/portal.tsx',
    lab = 'src/features/laboratory/laboratory.tsx';
  const slice = (source: string, start: string, end: string) =>
    source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
  expect(
    slice(readFileSync(portal, 'utf8'), 'function PortalWorkspace(', '  const commands = ('),
  ).toBe(
    slice(pr63Original(portal).toString(), 'function PortalWorkspace(', '  const commands = ('),
  );
  expect(slice(readFileSync(lab, 'utf8'), 'async function api(', '  const receiptLink =')).toBe(
    slice(pr63Original(lab).toString(), 'async function api(', '  const receiptLink ='),
  );
  const variable = (source: string, name: string) => {
    const file = ts.createSourceFile(
      'source.tsx',
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    let text = '';
    const visit = (node: ts.Node) => {
      if (ts.isVariableDeclaration(node) && node.name.getText(file) === name)
        text = node.initializer?.getText(file) ?? '';
      ts.forEachChild(node, visit);
    };
    visit(file);
    return text;
  };
  expect(variable(readFileSync(lab, 'utf8'), 'review')).toBe(
    variable(pr63Original(lab).toString(), 'review'),
  );
  const create = 'src/features/portal/create-resource.tsx';
  expect(slice(readFileSync(create, 'utf8'), 'export function CreateResource(', '  return (')).toBe(
    slice(pr63Original(create).toString(), 'export function CreateResource(', '  return ('),
  );
});

it('retains every old browser assertion with only the exact default-rule selector scoping correction', () => {
  const assertions = (source: string) => {
    const file = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
    const out: string[] = [];
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'expect'
      )
        out.push(node.getText(file).replace(/\s+/g, ' '));
      ts.forEachChild(node, visit);
    };
    visit(file);
    return out;
  };
  for (const path of [
    'tests/e2e/laboratory-networking.spec.ts',
    'tests/e2e/laboratory-server.spec.ts',
  ]) {
    const current = readFileSync(path, 'utf8').replace(
      "page.locator('.lab-default-rules').locator('button,input,select')",
      "page.locator('.lab-default-rules button,input,select')",
    );
    expect(assertions(current), path).toEqual(assertions(pr63Original(path).toString()));
  }
});

it('extends only original training service artwork and preserves every existing registry mapping and source byte', () => {
  const path = 'public/icons/manifest.json',
    before = JSON.parse(pr63Original(path).toString()),
    after = JSON.parse(readFileSync(path, 'utf8'));
  for (const [key, value] of Object.entries(before.assets))
    expect(after.assets[key]).toEqual(value);
  for (const [key, value] of Object.entries(before.aliases)) expect(after.aliases[key]).toBe(value);
  expect(
    Object.keys(after.assets)
      .filter((k) => !before.assets[k])
      .sort(),
  ).toEqual(['account', 'blob', 'container', 'nsg']);
  expect(
    Object.keys(after.aliases)
      .filter((k) => !before.aliases[k])
      .sort(),
  ).toEqual(['accounts', 'blobs', 'containers', 'nsgs']);
  expect(after.azure).toEqual(before.azure);
  expect(after.licenses).toEqual(before.licenses);
  for (const key of ['account', 'blob', 'container', 'nsg']) {
    const asset = after.assets[key];
    expect(asset.result).toBe('UNVERIFIED');
    expect(asset.family).toBe('azure');
    expect(pr63Hash(readFileSync('public/icons/' + asset.file))).toBe(asset.sha256);
  }
});

it('keeps common presentation authority-free and retains every original CI setting with one justified compact witness', () => {
  const source = readFileSync('src/features/portal/presentation.tsx', 'utf8');
  expect(source).not.toMatch(
    /\bfetch\s*\(|localStorage|sessionStorage|\.store\.|useCourse|useSandbox|laboratory\/v3\/repository/,
  );
  const extra =
    "  [\n    'shared-portal.spec.ts',\n    'shared Portal compact native search drawer properties dialogs reduced motion Axe and unavailable server preserve scope and visible controls',\n  ],\n";
  expect(readFileSync('playwright.desktop.config.ts', 'utf8').replace(extra, '')).toBe(
    pr63Original('playwright.desktop.config.ts').toString(),
  );
});

it('preserves the original Journal assistance and technical reset callback bodies inside the course adapter', () => {
  const path = 'src/features/portal/portal.tsx';
  const callbacks = (source: string, needle: string) => {
    const file = ts.createSourceFile(
        'portal.tsx',
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      ),
      out: string[] = [];
    const printer = ts.createPrinter({ removeComments: true });
    const visit = (node: ts.Node) => {
      if (ts.isArrowFunction(node) && node.body.getText(file).includes(needle))
        out.push(printer.printNode(ts.EmitHint.Unspecified, node.body, file).replace(/\s+/g, ' '));
      ts.forEachChild(node, visit);
    };
    visit(file);
    return out;
  };
  for (const needle of ['setReference(true)', 'chapter.store.restart()', 'module.store.clear()'])
    expect(callbacks(readFileSync(path, 'utf8'), needle), needle).toEqual(
      callbacks(pr63Original(path).toString(), needle),
    );
});
