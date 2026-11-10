import { describe, expect, it } from 'vitest';
import { awardProgress, emptyProgress, parseProgress, totalXp } from './progression';
import { answerKey, scoreAssessment } from './assessment';

describe('local progression', () => {
  it('awards each non-repeatable activity once across replay and reload', () => {
    const first = awardProgress(emptyProgress, 'organization-mission-v1');
    expect(totalXp(first)).toBe(80);
    expect(awardProgress(first, 'organization-mission-v1')).toBe(first);
    const reloaded = parseProgress(JSON.stringify(first));
    const completed = awardProgress(
      awardProgress(reloaded, 'organization-check-v1'),
      'organization-mission-v1',
    );
    expect(totalXp(completed)).toBe(120);
    expect(emptyProgress.completed).toEqual([]);
  });
  it.each([
    null,
    '',
    '{broken',
    'null',
    '[]',
    '42',
    '{"version":2,"completed":[]}',
    '{"version":1,"completed":{}}',
  ])('recovers from invalid/unsupported storage: %s', (raw) => {
    expect(parseProgress(raw)).toEqual(emptyProgress);
  });
  it('ignores forged XP, unknown IDs, non-string IDs and duplicates', () => {
    const result = parseProgress(
      '{"version":1,"xp":99999,"completed":["organization-check-v1","organization-check-v1","invented",null,4,"__proto__"]}',
    );
    expect(result.completed).toEqual(['organization-check-v1']);
    expect(totalXp(result)).toBe(40);
  });
});
describe('original assessment', () => {
  it('requires all three correct stable answer IDs', () => {
    expect(scoreAssessment({})).toEqual({ correct: 0, total: 3, passed: false });
    expect(scoreAssessment({ parent: 'subscription' })).toEqual({
      correct: 1,
      total: 3,
      passed: false,
    });
    expect(scoreAssessment({ ...answerKey, geography: 'same' })).toEqual({
      correct: 2,
      total: 3,
      passed: false,
    });
    expect(scoreAssessment(answerKey)).toEqual({ correct: 3, total: 3, passed: true });
  });
});
