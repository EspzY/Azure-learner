import type { CourseSave } from '@/domain/course/model';

export type CourseCardStatus = 'available' | 'in-progress' | 'complete' | 'unknown';
/** Presentation only. This app has no approved whole-course completion issuer. */
export function currentAz900Status(view: {
  ready: boolean;
  issue: string | null;
  save: CourseSave;
}): Exclude<CourseCardStatus, 'complete'> {
  if (!view.ready) return 'available';
  if (view.issue) return 'unknown';
  return view.save.resume || view.save.lab ? 'in-progress' : 'available';
}
