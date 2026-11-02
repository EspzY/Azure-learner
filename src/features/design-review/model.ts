import { parseLocation, portalHref } from '@/domain/portal/model';

/** Preview presentation only. Never curriculum, progress or a second Portal location engine. */
export const visualBranch = 'codex/azurelab-visual-excellence';
export const visualRoute = '/learn/design-review';
export const directions = ['continuity', 'editorial'] as const;
export type Direction = (typeof directions)[number];
export const surfaces = [
  'hub',
  'introduction',
  'theory',
  'studio',
  'guide',
  'handoff',
  'workspace',
  'journal',
  'character',
] as const;
export type Surface = (typeof surfaces)[number];
export function visualReviewAllowed(environment?: string, branch?: string, ciHead?: string) {
  return (
    (environment === 'preview' || environment === undefined) && (branch ?? ciHead) === visualBranch
  );
}
export const directionFrom = (value: string | null): Direction =>
  value === 'continuity' ? value : 'editorial';
export const surfaceFrom = (value: string | null): Surface =>
  surfaces.includes(value as Surface) ? (value as Surface) : 'hub';
export function visualHref(direction: Direction, surface: Surface) {
  return visualRoute + '?' + new URLSearchParams({ direction, surface });
}
/** Existing Portal allowlist remains authoritative; unknown parameters cannot become origins. */
export function visualPortalHref(native: string, direction: Direction) {
  const url = new URL(native, 'https://azurelab.invalid');
  if (
    url.origin !== 'https://azurelab.invalid' ||
    url.pathname !== '/portal' ||
    !native.startsWith('/portal')
  )
    throw Error('Expected an internal Portal destination');
  const location = parseLocation(url.searchParams);
  const safe = new URL(portalHref(location, location.area, location), url.origin).searchParams;
  safe.set('direction', direction);
  safe.set('surface', 'workspace');
  return visualRoute + '?' + safe;
}
