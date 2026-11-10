import { describe, expect, it } from 'vitest';
import { nb } from '@/content/nb';
import { officialLearning } from './official';
describe('official metadata remains distinct from local evidence', () => {
  it('pins official metadata, distinct local investigations and honest implementation states', () => {
    expect(officialLearning.reviewed).toBe('2026-10-25');
    expect(officialLearning.modules.map((m) => m.status)).toEqual([
      'implemented',
      'implemented',
      'implemented',
    ]);
    expect(nb.official.officialUnits).toHaveLength(8);
    expect(officialLearning.unitMapping.pricing).toEqual([5]);
    expect(nb.official.certification).toBe('Microsoft Certified: Azure Fundamentals');
    expect(nb.official.path).toBe('Introduction to Cloud Infrastructure: Describe cloud concepts');
    expect(nb.official.boundary).toContain('ikke Microsoft Learn-fullføring');
  });
});
