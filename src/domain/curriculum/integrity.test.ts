import { describe, it, expect } from 'vitest';
import { validateCurriculum, contentCoverage } from './integrity';
import { activities, units, curriculum, competencies } from './manifest';
import { nb } from '@/content/nb';
describe('authored curriculum integrity (not educational approval)', () => {
  it('binds every required objective to substantive structured content, three activities and a changed task', () => {
    expect(validateCurriculum()).toEqual([]);
    expect(competencies).toHaveLength(30);
    expect(curriculum.review.humanSme).toBeNull();
    expect(curriculum.review.learnerStudy).toBeNull();
    expect(Object.values(contentCoverage())).toHaveLength(7);
    for (const status of Object.values(contentCoverage())) {
      expect(
        status.authored &&
          status.teaching &&
          status.practice &&
          status.assessment &&
          status.sourceReviewed,
      ).toBe(true);
      expect(status.humanSmeReviewed).toBe(false);
    }
  });
  it('rejects missing mechanisms and assessments rather than counting titles', () => {
    expect(
      validateCurriculum(units, {
        ...nb.foundations.units,
        capacity: { ...nb.foundations.units.capacity, mechanism: '' },
      }),
    ).toContain('capacity: missing mechanism');
    const missing = { ...activities };
    delete missing['apply-capacity'];
    expect(validateCurriculum(units, nb.foundations.units, missing).join(' ')).toContain(
      'Missing implementation apply-capacity',
    );
  });
  it('rejects gaps, orphaned activities, missing references and prerequisite cycles', () => {
    expect(validateCurriculum(units.slice(1)).join(' ')).toContain('Uncovered objective FC01');
    expect(
      validateCurriculum(units, nb.foundations.units, {
        ...activities,
        ghost: { unit: 'capacity', kind: 'practice', implemented: true },
      }),
    ).toContain('Orphan activity ghost');
    expect(
      validateCurriculum([{ ...units[0]!, sources: [] }, ...units.slice(1)]).join(' '),
    ).toContain('capacity: source');
    expect(
      validateCurriculum([{ ...units[0]!, prerequisites: ['pricing'] }, ...units.slice(1)]),
    ).toContain('Prerequisite cycle');
  });
});
