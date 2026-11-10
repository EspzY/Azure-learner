import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkDesignAssets } from './design-assets-check.mjs';

test('actual pose and licensed-font registrations are complete and explicitly not approved', async () => {
  assert.deepEqual(await checkDesignAssets(), {
    produced: 3,
    approved: 0,
    planned: 19,
    fontBytes: 146892,
  });
});
test('altered metadata, unregistered files and accidental production approval fail closed', async () => {
  const root = mkdtempSync(join(tmpdir(), 'azurelab-design-assets-'));
  try {
    cpSync('public/design-review', join(root, 'public/design-review'), { recursive: true });
    cpSync('public/mascot', join(root, 'public/mascot'), { recursive: true });
    const file = join(root, 'public/design-review/characters/v1/manifest.json');
    const original = readFileSync(file, 'utf8'),
      m = JSON.parse(original);
    m.poses[0].productionAllowed = true;
    writeFileSync(file, JSON.stringify(m));
    await assert.rejects(() => checkDesignAssets(root), /Unapproved/);
    writeFileSync(file, original);
    m.poses[0].productionAllowed = false;
    m.poses[0].variants[0].sha256 = '0'.repeat(64);
    writeFileSync(file, JSON.stringify(m));
    await assert.rejects(() => checkDesignAssets(root), /Altered/);
    writeFileSync(file, original);
    writeFileSync(join(root, 'public/design-review/characters/v1/rogue.png'), 'rogue');
    await assert.rejects(() => checkDesignAssets(root), /Unregistered/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
