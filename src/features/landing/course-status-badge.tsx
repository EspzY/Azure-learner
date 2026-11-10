import { Circle, CircleCheck, CircleDashed, CircleDot } from 'lucide-react';
import { landingNb as t } from '@/content/nb';
import type { CourseCardStatus } from './course-status';

/** Display primitive, not an evaluator. 'complete' is reserved for an approved issuer.
 * Current production projection can never return it; no URL/storage flag enables it.
 */
export function CourseStatusBadge({ status }: { status: CourseCardStatus }) {
  const Icon =
    status === 'complete'
      ? CircleCheck
      : status === 'in-progress'
        ? CircleDot
        : status === 'unknown'
          ? CircleDashed
          : Circle;
  return (
    <span
      className={`landing-status landing-status-${status}`}
      role="status"
      aria-label={t.statusNames[status]}
    >
      <Icon size={15} aria-hidden="true" />
      <span>{t.status[status]}</span>
    </span>
  );
}
