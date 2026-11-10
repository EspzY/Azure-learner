/** Technical scope only. No learning attempt, rubric or completion is issued here. */
export const courseWorkspaceAdapter = 'course-workspace@1' as const;
export const courseEvidenceAdapter = 'course-evidence@1' as const;
export const courseProfile = 'az900-technical@1' as const;
export const courseModel = 'laboratory@3.9.0' as const;
export type WorkspacePurpose = 'free' | 'course-technical';
export type CourseBinding = {
  adapter: typeof courseWorkspaceAdapter;
  contextId: string;
  workspace: string;
  profile: typeof courseProfile;
  course: 'az900';
  model: typeof courseModel;
  startThrough: 0;
  learningAttempt: null;
};
export type CaptureRequest = { captureId: string; expectedRevision: number; through: number };
export type CourseEvidence = {
  adapter: typeof courseEvidenceAdapter;
  id: string;
  binding: CourseBinding;
  through: number;
  revision: number;
  attempt: number;
  historyDigest: string;
};
export const courseUuid = (v: unknown): v is string =>
  typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v);
export function parseCapture(value: unknown): CaptureRequest | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).length !== 3 ||
    Object.keys(v).some((k) => !['captureId', 'expectedRevision', 'through'].includes(k)) ||
    !courseUuid(v.captureId) ||
    !Number.isSafeInteger(v.expectedRevision) ||
    Number(v.expectedRevision) < 0 ||
    !Number.isSafeInteger(v.through) ||
    Number(v.through) < 0 ||
    Number(v.through) > 512
  )
    return null;
  return v as CaptureRequest;
}
