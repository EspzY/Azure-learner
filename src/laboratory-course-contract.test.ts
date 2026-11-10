import { expect, it } from 'vitest';
import { parseCapture, courseUuid } from './laboratory/course/contract';
const input = {
  captureId: '00000000-1111-2222-3333-444444444444',
  expectedRevision: 0,
  through: 0,
};
it('accepts only the fixed technical pointer contract, independently of object key order', () => {
  expect(parseCapture(input)).toEqual(input);
  expect(parseCapture({ through: 0, expectedRevision: 0, captureId: input.captureId })).toEqual(
    input,
  );
  expect(
    parseCapture({ ...input, through: 512, expectedRevision: Number.MAX_SAFE_INTEGER }),
  ).not.toBeNull();
});
it.each([
  null,
  [],
  {},
  'x',
  input.captureId,
  { ...input, captureId: '../other' },
  { ...input, world: {} },
  { ...input, receipt: { outcome: 'accepted' } },
  { ...input, course: 'az104' },
  { ...input, through: 513 },
  { ...input, through: -1 },
  { ...input, through: 0.5 },
  { ...input, expectedRevision: -1 },
  { ...input, expectedRevision: NaN },
  { ...input, expectedRevision: Infinity },
  { ...input, expectedRevision: Number.MAX_SAFE_INTEGER + 1 },
])('rejects malformed or client-owned evidence request %j', (value) => {
  expect(parseCapture(value)).toBeNull();
});
it('does not treat a resource name, foreign ID expression or URL as workspace ownership', () => {
  for (const v of [
    '',
    null,
    32,
    '../../x',
    '00000000-1111-2222-3333-444444444444-extra',
    'https://example.test',
  ])
    expect(courseUuid(v)).toBe(false);
  expect(courseUuid(input.captureId)).toBe(true);
});
