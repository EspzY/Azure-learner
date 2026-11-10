import type { PortalLocation } from './model';
import type { ServiceSave } from './learning';

// Navigation evidence only. Never an assessment event, result or teaching authorization.
export const challengeOriginKey = 'azurelab.portal.challenge-origin.v1';
export type ChallengeOrigin =
  { module: 'computing'; topic: 'resource-bridge' } | { module: 'services'; topic: 'practice' };
export type ChallengeOriginRecord = {
  schema: 1;
  begin: number;
  prefix: string;
  committed: boolean;
  origin: ChallengeOrigin | null;
};
export function validChallengeOrigin(value: unknown): value is ChallengeOrigin {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).sort().join() === 'module,topic' &&
    ((v.module === 'computing' && v.topic === 'resource-bridge') ||
      (v.module === 'services' && v.topic === 'practice'))
  );
}
export function challengeOriginFromLocation(location: PortalLocation): ChallengeOrigin | null {
  if (
    !location.course ||
    location.lab ||
    location.practice ||
    location.bridge ||
    location.mission ||
    location.compute ||
    location.networking ||
    location.governance ||
    location.tools ||
    location.monitoring ||
    location.security ||
    location.migration
  )
    return null;
  const value = { module: location.module, topic: location.topic };
  return validChallengeOrigin(value) ? value : null;
}
export function readChallengeOrigin(raw: string | null): ChallengeOriginRecord | null {
  if (!raw || raw.length > 512) return null;
  try {
    const v = JSON.parse(raw);
    return v &&
      Object.keys(v).sort().join() === 'begin,committed,origin,prefix,schema' &&
      v.schema === 1 &&
      Number.isInteger(v.begin) &&
      v.begin >= 0 &&
      v.begin < 400 &&
      /^[a-f0-9]{64}$/.test(v.prefix) &&
      typeof v.committed === 'boolean' &&
      (v.origin === null || validChallengeOrigin(v.origin))
      ? v
      : null;
  } catch {
    return null;
  }
}
export function challengeBegin(save: ServiceSave) {
  return save.events.findLastIndex((event) => event.kind === 'begin');
}
export async function challengePrefix(save: ServiceSave, begin = challengeBegin(save)) {
  const bytes = new TextEncoder().encode(
    JSON.stringify({ ...save, events: save.events.slice(0, begin + 1) }),
  );
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
export function challengeResumeHref(origin: ChallengeOrigin | null) {
  return origin
    ? `/portal?area=challenge&course=1&module=${origin.module}&topic=${origin.topic}&mode=independent`
    : '/portal?area=challenge&mode=independent';
}
export function challengeReturnHref(origin: ChallengeOrigin | null, active: boolean) {
  if (!origin) return active ? '/learn?activity=challenge-return' : '/learn';
  return `/learn/${origin.module}?topic=${origin.topic}&activity=${active ? 'challenge-return' : origin.module === 'computing' ? 'debrief' : 'lab'}`;
}
