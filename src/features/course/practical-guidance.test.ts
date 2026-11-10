import { describe, it, expect } from 'vitest';
import { practicalGuidance, type GuideSnapshot } from './practical-guidance';
import { parseLocation } from '@/domain/portal/model';
const base: GuideSnapshot = {
  kind: 'vm',
  hasGroups: true,
  hasApp: false,
  configured: false,
  inspected: false,
  ids: [],
  location: parseLocation(new URLSearchParams('area=home')),
};
describe('read-only practical direction', () => {
  it('keeps VM phases distinct and dry validation informational', () => {
    const s = { ...base, location: parseLocation(new URLSearchParams('area=create&kind=vm')) };
    expect(
      practicalGuidance({ ...s, form: { tab: 1, name: 'vm-a', group: 'rg-a', valid: false } }),
    ).toMatchObject({ phase: 'disks', target: 'vm-disk', targetKind: 'action' });
    expect(
      practicalGuidance({ ...s, form: { tab: 2, name: 'vm-a', group: 'rg-a', valid: false } })
        .phase,
    ).toBe('network');
    expect(
      practicalGuidance({ ...s, form: { tab: 3, name: 'BAD', group: 'rg-a', valid: false } }),
    ).toMatchObject({ phase: 'review', target: 'validation', targetKind: 'inspection' });
    expect(
      practicalGuidance({ ...s, form: { tab: 3, name: 'vm-a', group: 'rg-a', valid: true } })
        .target,
    ).toBe('commit');
  });
  it('never recommends an unrelated inspection; repeated projection cannot mutate evidence', () => {
    const s = {
      ...base,
      configured: true,
      ids: ['vm-a'],
      location: parseLocation(new URLSearchParams('area=resource&id=disk-other')),
    };
    const before = JSON.stringify(s);
    expect(practicalGuidance(s).matching).toBe(false);
    expect(practicalGuidance(s)).toEqual(practicalGuidance(s));
    expect(JSON.stringify(s)).toBe(before);
    expect(practicalGuidance({ ...s, location: { ...s.location, id: 'vm-a' } }).matching).toBe(
      true,
    );
  });
  it('does not mistake PaaS settings for guided completion', () => {
    expect(
      practicalGuidance({
        ...base,
        kind: 'paas',
        hasApp: true,
        location: parseLocation(new URLSearchParams('area=settings&id=app-a')),
      }),
    ).toMatchObject({ phase: 'settings', target: 'settings' });
    expect(
      practicalGuidance({ ...base, kind: 'paas', hasApp: true, configured: true, inspected: true })
        .phase,
    ).toBe('explain');
  });
  it('does not highlight settings or informational properties for another app', () => {
    const s = {
      ...base,
      kind: 'paas' as const,
      hasApp: true,
      appId: 'app-a',
      location: parseLocation(new URLSearchParams('area=settings&id=app-b')),
    };
    expect(practicalGuidance(s).matching).toBe(false);
    expect(
      practicalGuidance({
        ...s,
        location: parseLocation(new URLSearchParams('area=resource&id=app-a')),
      }),
    ).toMatchObject({ targetKind: 'inspection', matching: true });
  });
});
