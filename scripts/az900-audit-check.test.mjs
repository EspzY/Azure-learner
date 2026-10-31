import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateAudit, renderMatrix } from './az900-audit-check.mjs';

const data = JSON.parse(
  readFileSync(new URL('../docs/audits/az900-2026-07-20.json', import.meta.url), 'utf8'),
);
test('all 57 pinned official slots and code/evidence/source references resolve', () => {
  assert.deepEqual(validateAudit(data), []);
  assert.equal(data.objectives.filter((r) => r.status === 'COMPLETE').length, 39);
  assert.equal(
    data.objectives.filter((r) => r.slot.startsWith('1.') && r.status === 'COMPLETE').length,
    15,
  );
  for (const slot of [
    '1.1.03',
    '1.1.04',
    '1.1.06',
    '1.2.01',
    '1.2.02',
    '1.2.03',
    '1.2.04',
    '1.3.04',
  ]) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('TR'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.sources.some((id) => id.startsWith('TR')));
  }
  for (const slot of ['2.1.04', '2.1.05', '2.1.06', '2.1.07']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('PB'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
  }
  for (const slot of ['3.1.01', '3.1.02', '3.1.03', '3.1.04']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('CO'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.sources.some((id) => id.startsWith('CS')));
  }
  for (const slot of ['2.2.01', '2.2.02', '2.2.03', '2.2.04']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('CP'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.sources.some((id) => id.startsWith('PS')));
  }
  for (const slot of ['2.2.05', '2.2.06']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('NC'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.facets.every((facet) => facet.status === 'COMPLETE'));
    assert.ok(row.sources.some((id) => id.startsWith('NCS')));
    assert.ok(!row.evidence.includes('CP'));
  }
  for (const slot of ['2.3.01', '2.3.04']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('ST'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.facets.every((facet) => facet.status === 'COMPLETE'));
    assert.ok(row.sources.some((id) => id.startsWith('STG')));
  }
  for (const slot of ['2.3.02', '2.3.03']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('SR'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.facets.every((f) => f.status === 'COMPLETE'));
    assert.ok(row.sources.some((id) => id.startsWith('SRG')));
  }
  for (const slot of ['2.4.01', '2.4.02', '2.4.03']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'COMPLETE');
    assert.ok(row.evidence.includes('ID'));
    assert.deepEqual(Object.values(row.criteria), ['V', 'V', 'V', 'V', 'V', 'V']);
    assert.ok(row.facets.every((f) => f.status === 'COMPLETE'));
    assert.ok(row.sources.some((id) => id.startsWith('IDG')));
  }
  for (const slot of ['2.3.05', '2.3.06']) {
    const row = data.objectives.find((r) => r.slot === slot);
    assert.equal(row.status, 'MISSING');
    assert.ok(!row.evidence.includes('ST'));
  }
  assert.match(data.sources.STG21.url, /storage\/files\/files-management-concepts$/);
  // A new runtime source register may reuse local IDs; the shared audit must
  // retain the old Cost provenance and namespace the new connectivity sources.
  assert.match(
    data.sources.CS13.url,
    /cost-management-billing\/costs\/tutorial-acm-create-budgets$/,
  );
  assert.match(data.sources.NCS13.url, /expressroute\/expressroute-about-encryption$/);
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
test('public calculator is an exact official HTTPS source, not a lookalike or insecure URL', () => {
  for (const url of [
    'http://azure.microsoft.com/pricing/calculator/',
    'https://azure.microsoft.com.example.org/pricing/calculator/',
    'not a URL',
  ]) {
    const invalid = structuredClone(data);
    invalid.sources.CS28.url = url;
    assert.ok(validateAudit(invalid).some((e) => e.includes('CS28: missing official source')));
  }
  assert.deepEqual(validateAudit(data), []);
});
