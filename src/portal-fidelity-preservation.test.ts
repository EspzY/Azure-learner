import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import proof from '../docs/reviews/evidence/portal-resource-fidelity/preservation.json';
import { memoryResponse } from '../tests/e2e/ephemeral-actions';
import { validateFidelityProjection } from '../tests/portal-fidelity-preservation';

const base = 'c4119f3f770d6767881dc5ee455686cbae0150d7';
const hash = (bytes: Buffer) =>
  createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const mutable = new Set([
  'quality/releases/current.json',
  'docs/reviews/evidence/portal-resource-fidelity/preservation.json',
  'docs/quality/PORTAL_RESOURCE_FIDELITY_QA.md',
  'docs/quality/PORTAL_RESOURCE_FIDELITY_FINAL_AUDIT.md',
  'docs/quality/PORTAL_RESOURCE_FIDELITY_RELEASE_REVIEW.md',
]);
const approved = [
  '.gitattributes',
  'docs/PORTAL_ICONOGRAPHY.md',
  'docs/PORTAL_REFERENCE_FIDELITY.md',
  'docs/PROJECT_STATUS.md',
  'playwright.desktop.config.ts',
  'src/features/laboratory/integrated-resource.tsx',
  'src/features/laboratory/laboratory.tsx',
  'src/features/laboratory/portal-adapter.tsx',
  'src/features/portal/home.tsx',
  'src/features/portal/presentation.tsx',
  'src/integrated-platform-preservation.test.ts',
  'tests/integrated-platform-preservation.ts',
  'tests/e2e/ephemeral-actions.ts',
  'tests/e2e/integrated-actions.ts',
  'tests/e2e/integrated-chain.spec.ts',
  'tests/e2e/integrated-data.spec.ts',
  'tests/e2e/integrated-delivery.spec.ts',
  'tests/e2e/laboratory-actions.ts',
];
const rows = execFileSync('git', ['ls-tree', '-r', base], {
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
})
  .trim()
  .split('\n')
  .map((line) => {
    const [meta, path] = line.split('\t');
    return { path: path!, hash: meta!.split(' ')[2]! };
  });
const original = (path: string) =>
  execFileSync('git', ['show', base + ':' + path], { maxBuffer: 16 * 1024 * 1024 });
it('retains the original default memory transport and rejects persistent command responses at that boundary', () => {
  let predicate:
    | ((response: {
        url: () => string;
        request: () => { method: () => string; postDataJSON: () => unknown };
      }) => boolean)
    | undefined;
  const page = {
    waitForResponse: (test: typeof predicate) => {
      predicate = test;
      return Promise.resolve();
    },
  };
  memoryResponse(page as unknown as Parameters<typeof memoryResponse>[0], 'command');
  const response = (url: string) => ({
    url: () => url,
    request: () => ({ method: () => 'POST', postDataJSON: () => ({ action: 'command' }) }),
  });
  expect(predicate?.(response('http://127.0.0.1:3006/api/laboratory/command'))).toBe(false);
  expect(predicate?.(response('http://127.0.0.1:3006/api/laboratory/ephemeral'))).toBe(true);
  const source = ts.createSourceFile(
    'helper.ts',
    readFileSync('tests/e2e/ephemeral-actions.ts', 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const create = source.statements.find(
    (node) => ts.isFunctionDeclaration(node) && node.name?.text === 'create',
  ) as ts.FunctionDeclaration;
  expect(create.parameters.at(-1)?.initializer?.getText(source)).toBe("'memory'");
  const responseStatement = create.body!.statements.find(
    (node) =>
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.some(
        (declaration) => declaration.name.getText(source) === 'response',
      ),
  ) as ts.VariableStatement;
  const selection = responseStatement.declarationList.declarations[0]!
    .initializer as ts.ConditionalExpression;
  expect(selection.condition.getText(source)).toBe("transport === 'persistent'");
  expect(selection.whenFalse.getText(source)).toBe("memoryResponse(page, 'command')");
});
const partition = (path: string) =>
  path.startsWith('public/')
    ? 'assets'
    : path.startsWith('docs/reviews/evidence/')
      ? 'locked evidence'
      : path.startsWith('docs/')
        ? 'documentation'
        : 'source and tests';
const partitions = ['assets', 'locked evidence', 'documentation', 'source and tests'].map(
  (name) => ({ name, rows: rows.filter((row) => partition(row.path) === name) }),
);
it('pins the exact complete fidelity boundary and original whole-parent partition union', () => {
  expect(proof.base).toBe(base);
  expect(Object.keys(proof.files).sort()).toEqual([...approved].sort());
  expect(partitions.flatMap((part) => part.rows.map((row) => row.path)).sort()).toEqual(
    rows.map((row) => row.path).sort(),
  );
});
it.each(partitions)(
  'checks actual raw bytes for every final-parent $name path without a historical reader',
  ({ rows }) => {
    for (const row of rows) {
      if (mutable.has(row.path)) continue;
      const binding = (proof.files as Record<string, { before: string; after: string }>)[row.path];
      if (binding) expect(binding.before, row.path).toBe(row.hash);
      expect(hash(readFileSync(row.path)), row.path).toBe(binding?.after ?? row.hash);
    }
  },
);
it('checks every actual added file and rejects any undeclared source or evidence path', () => {
  const basePaths = new Set(rows.map((row) => row.path));
  const paths = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
  )
    .split('\0')
    .filter(Boolean);
  const actualAdded = [...new Set(paths)]
    .filter((path) => !basePaths.has(path) && !mutable.has(path))
    .sort();
  expect(Object.keys(proof.added).sort()).toEqual(actualAdded);
  for (const [path, expected] of Object.entries(proof.added as Record<string, string>))
    expect(hash(readFileSync(path)), path).toBe(expected);
});
it('fails closed for changed protected bytes, missing paths and unknown additions at the historical projection boundary', () => {
  const expected = new Map(
    rows
      .filter((row) => !mutable.has(row.path))
      .map((row) => [
        row.path,
        (proof.files as Record<string, { after: string }>)[row.path]?.after ?? row.hash,
      ]),
  );
  for (const [path, value] of Object.entries(proof.added as Record<string, string>))
    expected.set(path, value);
  expect(() => validateFidelityProjection(expected)).not.toThrow();
  const corrupt = new Map(expected);
  corrupt.set('src/laboratory/v39/domain.ts', '0'.repeat(40));
  expect(() => validateFidelityProjection(corrupt)).toThrow('unapproved current bytes');
  const missing = new Map(expected);
  missing.delete('src/features/portal/portal.tsx');
  expect(() => validateFidelityProjection(missing)).toThrow('unapproved current bytes');
  const unknown = new Map(expected);
  unknown.set('docs/quality/UNDECLARED_REPORT.md', '0'.repeat(40));
  expect(() => validateFidelityProjection(unknown)).toThrow('unknown or missing added files');
});
it('preserves original raw captures through exact path attributes without a wildcard exemption', () => {
  const paths = Object.keys(proof.added)
    .filter((path) => path.endsWith('.raw'))
    .sort();
  expect(readFileSync('.gitattributes', 'utf8')).toBe(
    original('.gitattributes').toString() +
      '# Preserve the original Portal fidelity command and failure captures exactly.\n' +
      paths.map((path) => path + ' -text\n').join(''),
  );
  for (const path of paths)
    expect(execFileSync('git', ['check-attr', 'text', '--', path], { encoding: 'utf8' })).toBe(
      path + ': text: unset\n',
    );
});
const printer = ts.createPrinter();
function body(text: string, name: string) {
  const source = ts.createSourceFile(
    'guard.tsx',
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let result: string | undefined;
  const visit = (node: ts.Node) => {
    if (
      (ts.isFunctionDeclaration(node) && node.name?.text === name) ||
      (ts.isVariableDeclaration(node) && node.name.getText(source) === name)
    )
      result = printer.printNode(ts.EmitHint.Unspecified, node, source);
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!result) throw Error('Missing original controller: ' + name);
  return result;
}
it('preserves original technical session command review and commit controller bodies and historical report bodies', () => {
  const path = 'src/features/laboratory/laboratory.tsx',
    old = original(path).toString(),
    current = readFileSync(path, 'utf8');
  for (const name of [
    'api',
    'run',
    'start',
    'startTemporary',
    'begin',
    'review',
    'visit',
    'accept',
    'load',
  ])
    expect(body(current, name), name).toBe(body(old, name));
  const integrated = 'src/features/laboratory/integrated-resource.tsx';
  for (const name of ['inspect', 'open'])
    expect(body(readFileSync(integrated, 'utf8'), name), name).toBe(
      body(original(integrated).toString(), name),
    );
  const commitBody = (text: string) => {
    const source = ts.createSourceFile(
      'resource.tsx',
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    let result = '';
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node) && node.expression.getText(source) === 'props.commit') {
        let parent: ts.Node | undefined = node.parent;
        while (parent && !ts.isArrowFunction(parent)) parent = parent.parent;
        if (parent) result = printer.printNode(ts.EmitHint.Unspecified, parent, source);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    if (!result) throw Error('Missing original commit callback');
    return result;
  };
  expect(commitBody(readFileSync(integrated, 'utf8'))).toBe(
    commitBody(original(integrated).toString()),
  );

  for (const path of [
    'docs/PROJECT_STATUS.md',
    'docs/PORTAL_REFERENCE_FIDELITY.md',
    'docs/PORTAL_ICONOGRAPHY.md',
  ])
    expect(readFileSync(path, 'utf8').endsWith(original(path).toString()), path).toBe(true);
  for (const path of [
    'src/integrated-platform-preservation.test.ts',
    'tests/integrated-platform-preservation.ts',
  ])
    expect(readFileSync(path, 'utf8'), path).toBe(
      original(path)
        .toString()
        .replace(
          "import { readFileSync } from 'node:fs';",
          `import { readFidelityHistory as readFileSync } from '${path.startsWith('src/') ? '../tests/' : './'}portal-fidelity-preservation';`,
        )
        .replace(
          "import { execFileSync } from 'node:child_process';",
          `import { execFidelityHistory as execFileSync } from '${path.startsWith('src/') ? '../tests/' : './'}portal-fidelity-preservation';`,
        ),
    );
});
