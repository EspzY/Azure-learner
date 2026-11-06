import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { freshCourse, restoreCourse } from '@/domain/course/model';
import { currentAz900Status } from './course-status';
import { CourseStatusBadge } from './course-status-badge';
import { landingNb } from '@/content/nb';

describe('navigation-only course status, not a new completion evaluator', () => {
  it('keeps new/loading course available without asserting that no other historical work exists', () => {
    expect(currentAz900Status({ ready: false, issue: null, save: freshCourse() })).toBe(
      'available',
    );
    expect(currentAz900Status({ ready: true, issue: null, save: freshCourse() })).toBe('available');
  });
  it('shows only a validated saved course position as ongoing, including the final module, never complete', () => {
    for (const resume of [
      { module: 'computing', topic: 'intro-request' },
      { module: 'migration', topic: 'summary' },
    ] as const) {
      const parsed = restoreCourse(JSON.stringify({ ...freshCourse(), resume }));
      expect(parsed.issue).toBeNull();
      expect(currentAz900Status({ ready: true, ...parsed })).toBe('in-progress');
    }
  });
  it('withholds status on corrupt/unsupported/unsaved/conflicting history even with a valid-looking old position', () => {
    for (const issue of ['corrupt', 'unsupported', 'unsaved', 'conflict', 'unrecognized']) {
      expect(
        currentAz900Status({
          ready: true,
          issue,
          save: { ...freshCourse(), resume: { module: 'services', topic: 'summary' } },
        }),
      ).toBe('unknown');
    }
  });
  it('never accepts injected completion, XP or assessment claims as a whole-course contract', () => {
    for (const extra of [
      { completed: true },
      { completion: { schema: 1, course: 'AZ-900', verified: true } },
      { xp: 999999 },
      { first: { passed: true } },
    ]) {
      const parsed = restoreCourse(JSON.stringify({ ...freshCourse(), ...extra }));
      expect(parsed.issue).toBe('corrupt');
      expect(currentAz900Status({ ready: true, ...parsed })).toBe('unknown');
    }
  });
  it.each(['available', 'in-progress', 'complete', 'unknown'] as const)(
    'renders the real %s display primitive with readable status and accessible name',
    (status) => {
      const html = renderToStaticMarkup(createElement(CourseStatusBadge, { status }));
      expect(html).toContain(`landing-status-${status}`);
      expect(html).toContain(landingNb.status[status]);
      expect(html).toContain(`aria-label="${landingNb.statusNames[status]}"`);
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-hidden="true"');
      if (status === 'complete') {
        expect(html).toContain('circle-check');
        expect(html).toContain('ikke en Microsoft-sertifisering');
      }
    },
  );
});
