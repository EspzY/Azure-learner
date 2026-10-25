'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { nb } from '@/content/nb';
type Destination = { href: string; title: string };
export function CourseNavigation({
  moduleName,
  current,
  index,
  count,
  previous,
  next,
  continueTeaching = false,
  summary = false,
}: {
  moduleName: string;
  current: string;
  index: number;
  count: number;
  previous?: Destination;
  next?: Destination;
  continueTeaching?: boolean;
  summary?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current,
      shell = element?.closest<HTMLElement>('.course-learning-surface');
    if (!element || !shell) return;
    const reserve = () =>
      shell.style.setProperty(
        '--course-navigation-height',
        `${element.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(reserve);
    observer.observe(element);
    reserve();
    return () => {
      observer.disconnect();
      shell.style.removeProperty('--course-navigation-height');
    };
  }, []);
  return (
    <nav ref={ref} className="course-step-navigation" aria-label={nb.course.next}>
      <div className="course-nav-previous">
        {previous && (
          <Link scroll={false} href={previous.href}>
            ← {nb.course.previous}
            <small>{previous.title}</small>
          </Link>
        )}
      </div>
      <div className="course-nav-context">
        <small>
          {moduleName} ·{' '}
          {index >= 0
            ? `${nb.refinement.activity} ${index + 1} ${nb.refinement.of} ${count}`
            : summary
              ? nb.foundationsV2.summary
              : nb.refinement.assessmentPosition}
        </small>
        <strong>{current}</strong>
      </div>
      <div className="course-nav-next">
        {next && (
          <Link scroll={false} className="course-primary" href={next.href}>
            {continueTeaching ? nb.refinement.continueTeaching : nb.course.next} →
            <small>{next.title}</small>
          </Link>
        )}
      </div>
    </nav>
  );
}
