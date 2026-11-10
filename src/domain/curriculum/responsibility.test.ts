import { describe, expect, it } from 'vitest';
import { responsibility } from './responsibility';
describe('reviewed responsibility boundaries', () => {
  it('changes operating responsibility without surrendering customer data and identity', () => {
    expect(responsibility('iaas', 'os')).toBe('customer');
    expect(responsibility('paas', 'os')).toBe('microsoft');
    expect(responsibility('paas', 'application')).toBe('shared');
    expect(responsibility('saas', 'application')).toBe('shared');
    expect(responsibility('paas', 'network')).toBe('shared');
    for (const model of ['iaas', 'paas', 'saas'] as const) {
      expect(responsibility(model, 'data')).toBe('customer');
      expect(responsibility(model, 'identity')).toBe('customer');
      expect(responsibility(model, 'settings')).toBe('customer');
      expect(responsibility(model, 'physical')).toBe('microsoft');
    }
  });
});
