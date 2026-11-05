import { expect, it } from 'vitest';
import { courseHref, courseTopic, moduleIds, type CourseModule } from '@/domain/course/model';
import { az900RecommendedTopics } from '../../../tests/fixtures/az900-routes';
import observed from '../../../docs/reviews/evidence/pr57/recommended-routes-base.json';

it('matches every actual recommended sidebar route to canonical bank topics without aliases or retired destinations', () => {
  expect(Object.keys(az900RecommendedTopics).sort()).toEqual([...moduleIds].sort());
  const expected = Object.entries(az900RecommendedTopics).flatMap(([id, topics]) => {
    const module = id as CourseModule;
    expect(new Set(topics).size, module).toBe(topics.length);
    return topics.map((topic) => {
      expect(courseTopic(module, topic), `${module}/${topic}`).toBe(topic);
      return courseHref(module, topic);
    });
  });
  expect(new Set(expected).size).toBe(expected.length);
  expect([...expected].sort()).toEqual(observed.hrefs);
  expect(expected).toHaveLength(200);
  expect(observed.base).toBe('a3f1b575b2eb5b257fd455fec1a73b30a38706f4');
});
