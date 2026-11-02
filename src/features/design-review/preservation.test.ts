import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
it('retains every original locale byte before adding visual-review copy', () => {
  const raw = readFileSync('src/content/nb.ts');
  expect(createHash('sha256').update(raw.subarray(0, 1477092)).digest('hex')).toBe(
    '61cc9d68e228d7ea6513df5d053f5e4e4b552abf3cf4aab72437c82a6b4b036d',
  );
  expect(raw.subarray(1477092).toString()).toContain('visualReviewNb');
});
