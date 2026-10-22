import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { requiredFiles, validateDocumentation } from './docs-check.mjs';

function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'azurelab-docs-'));
  const target = resolve(root);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('azurelab-docs-'))
    throw new Error('Unsafe fixture cleanup path');
  try {
    for (const file of requiredFiles) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), '# Test document\n');
    }
    run(root);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
}
test('validates relative, encoded, image, reference and heading links without fetching external URLs', () =>
  fixture((root) => {
    writeFileSync(join(root, 'docs', 'a space.md'), '# A heading\n');
    writeFileSync(join(root, 'docs', 'figure.png'), 'fixture');
    writeFileSync(
      join(root, 'README.md'),
      '# Home\n[Valid](docs/a%20space.md#a-heading)\n![Image](docs/figure.png)\n[External](https://example.invalid)\n[Source]: docs/ARCHITECTURE.md\n```ts\n[Ignored](missing.md)\n```\n',
    );
    assert.deepEqual(validateDocumentation(root).errors, []);
  }));
test('reports missing files, heading targets and paths outside the repository', () =>
  fixture((root) => {
    writeFileSync(
      join(root, 'README.md'),
      '[Missing](lost.md)\n[Heading](docs/ARCHITECTURE.md#missing)\n[Escape](../outside.md)',
    );
    const result = validateDocumentation(root);
    assert.equal(result.errors.length, 3);
    assert.ok(result.errors.some((error) => error.includes('broken local link')));
    assert.ok(result.errors.some((error) => error.includes('missing heading')));
    assert.ok(result.errors.some((error) => error.includes('leaves repository')));
  }));
test('requires substantive continuity files', () =>
  fixture((root) => {
    writeFileSync(join(root, 'AGENTS.md'), '   ');
    assert.ok(validateDocumentation(root).errors.some((error) => error.includes('AGENTS.md')));
  }));
