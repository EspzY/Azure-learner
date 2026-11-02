import Link from 'next/link';
import { journeyNb as j } from '@/content/learning-journey';
import type { CourseModule } from '@/domain/course/model';

/** Short orientation inside the existing teaching boundary; no progress or start action. */
export function CourseJourneyContext({
  module,
  topic,
  transitioning,
}: {
  module: CourseModule;
  topic: string;
  transitioning: boolean;
}) {
  const intro =
    topic === 'introduction' && (module === 'security' || module === 'migration')
      ? j.introductions[module]
      : undefined;
  const bridge =
    transitioning && module in j.transitions
      ? j.transitions[module as keyof typeof j.transitions]
      : undefined;
  if (!intro && !bridge) return null;
  const finishing = module === 'migration' && !!bridge;
  return (
    <aside className="course-journey-context" aria-label={j.context}>
      <h2 data-activity-heading tabIndex={-1}>
        {intro ? j.closing : finishing ? j.finish : j.next}
      </h2>
      <p>{intro ?? bridge}</p>
      {finishing && (
        <nav aria-label={j.finish}>
          <Link href="/learn">{j.open}</Link>
          <Link href="/portal">{j.sandbox}</Link>
        </nav>
      )}
    </aside>
  );
}
