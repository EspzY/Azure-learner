import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateAudit, renderMatrix } from './az900-audit-check.mjs';

const data = JSON.parse(
  readFileSync(new URL('../docs/audits/az900-2026-07-20.json', import.meta.url), 'utf8'),
);
test('all 57 pinned official slots and code/evidence/source references resolve', () => {
  assert.deepEqual(validateAudit(data), []);
  assert.equal(data.objectives.filter((r) => r.status === 'COMPLETE').length, 14);
  for (const slot of ['2.1.04', '2.1.05', '2.1.06', '2.1.07']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('PB'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
  }
  assert.ok(renderMatrix(data).includes('35–40%'));
});
test('rejects omitted/duplicated official skills and stable IDs rather than increasing apparent coverage', () => {
  const invalid = structuredClone(data);
  invalid.objectives[1] = structuredClone(invalid.objectives[0]);
  assert.ok(validateAudit(invalid).some((e) => e.includes('57 official')));
  assert.ok(validateAudit(invalid).some((e) => e.includes('Duplicate')));
});
test('a title, test pointer or invented human approval cannot promote missing evidence to COMPLETE', () => {
  const invalid = structuredClone(data);
  invalid.objectives.find((r) => r.status === 'MISSING').status = 'COMPLETE';
  invalid.humanSmeReview = 'automatically approved';
  assert.ok(validateAudit(invalid).some((e) => e.includes('false COMPLETE')));
  assert.ok(validateAudit(invalid).some((e) => e.includes('Human approval')));
});
test('rejects missing files/symbols, nonofficial sources and unmapped next PRs', () => {
  const invalid = structuredClone(data);
  invalid.evidenceProfiles.F.teaching[0].marker = 'THIS_SYMBOL_DOES_NOT_EXIST';
  invalid.sources.EXAM.url = 'https://unreviewed.invalid/dump';
  invalid.objectives[0].plannedPRs = ['FAKE'];
  const errors = validateAudit(invalid);
  assert.ok(errors.some((e) => e.includes('unresolved teaching')));
  assert.ok(errors.some((e) => e.includes('official source')));
  assert.ok(errors.some((e) => e.includes('next PR')));
});
