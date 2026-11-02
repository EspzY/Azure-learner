import { describe, expect, it } from 'vitest';
import { parseLocation, portalHref } from '@/domain/portal/model';
import {
  directions,
  directionFrom,
  surfaces,
  surfaceFrom,
  visualBranch,
  visualHref,
  visualPortalHref,
  visualReviewAllowed,
} from './model';
import { characterAsset } from './character';

describe('isolated visual presentation', () => {
  it('requires trusted preview metadata, never a query flag or production branch', () => {
    expect(visualReviewAllowed('preview', visualBranch)).toBe(true);
    expect(visualReviewAllowed(undefined, undefined, visualBranch)).toBe(true);
    for (const env of ['production', 'development', 'anything'])
      expect(visualReviewAllowed(env, visualBranch)).toBe(false);
    expect(visualReviewAllowed()).toBe(false);
    expect(visualReviewAllowed('preview', 'main', visualBranch)).toBe(false);
  });
  it('has bounded nonpersistent view navigation and stable candidate fallback', () => {
    for (const d of directions)
      for (const s of surfaces) {
        const u = new URL(visualHref(d, s), 'https://example.test');
        expect(directionFrom(u.searchParams.get('direction'))).toBe(d);
        expect(surfaceFrom(u.searchParams.get('surface'))).toBe(s);
      }
    expect(surfaceFrom('vm')).toBe('hub');
    expect(directionFrom('random')).toBe('editorial');
  });
  it('roundtrips existing Portal resource, section, origin and attempt metadata without a second location model', () => {
    for (const query of [
      'area=groups&compute=vm',
      'area=resource&id=vm-example&view=properties&compute=vm',
      'area=resource&id=app-example&view=activity&tools=intent',
      'area=activity&governance=policy',
      'area=create-vm&compute=vm',
      'area=resource&id=missing&view=overview&unknown=javascript',
    ]) {
      const native = '/portal?' + query,
        before = parseLocation(new URLSearchParams(query));
      const out = new URL(visualPortalHref(native, 'editorial'), 'https://example.test');
      const after = parseLocation(out.searchParams);
      expect(portalHref(after, after.area, after)).toBe(portalHref(before, before.area, before));
      expect(after.id).toBe(before.id);
      expect(after.view).toBe(before.view);
      expect(out.searchParams.get('surface')).toBe('workspace');
      expect(out.searchParams.has('unknown')).toBe(false);
    }
    for (const bad of [
      'https://evil.test/portal',
      '//evil.test/portal',
      '/learn',
      '/portal/other',
      'javascript:alert(1)',
    ])
      expect(() => visualPortalHref(bad, 'editorial')).toThrow();
  });
  it('never renders rejected or unproduced poses as approved learning feedback or independent hints', () => {
    for (const phase of ['welcome', 'thinking', 'explain-right', 'checklist'] as const) {
      expect(characterAsset({ phase, ready: true, independent: false })).toBe(
        '/mascot/savvy-shark-default.png',
      );
      expect(characterAsset({ phase, ready: false, independent: false })).toBeNull();
      expect(characterAsset({ phase, ready: true, independent: true })).toBeNull();
    }
  });
});
