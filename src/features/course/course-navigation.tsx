'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { nb } from '@/content/nb';
import { flowCopy, type FlowAction } from './learning-flow';
import { focusGuidedTarget } from './guide-briefing-request';
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
  recommended,
}: {
  moduleName: string;
  current: string;
  index: number;
  count: number;
  previous?: Destination;
  next?: Destination;
  continueTeaching?: boolean;
  summary?: boolean;
  recommended?: FlowAction;
}) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname(),
    query = useSearchParams();
  const [failed, setFailed] = useState(false);
  const target = recommended ?? next;
  useEffect(() => {
    if (!location.hash.startsWith('#guided-')) return;
    const frame = requestAnimationFrame(() => focusGuidedTarget(location.hash));
    return () => cancelAnimationFrame(frame);
  }, [pathname, query]);
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
        {target && (
          <Link
            scroll={false}
            className="course-primary"
            href={target.href}
            data-flow-action={recommended?.kind}
            onClick={(e) => {
              if (recommended?.kind === 'recovery') {
                const status = document.querySelector<HTMLElement>(
                  '.course-learning-surface .course-storage,.course-learning-surface .course-access,.cost-recovery,#guided-work [role="status"]',
                );
                if (status) {
                  e.preventDefault();
                  status.tabIndex = -1;
                  status.scrollIntoView({ block: 'center', behavior: 'instant' });
                  status.focus({ preventScroll: true });
                  return;
                }
              }
              if (recommended?.activate && !recommended.activate()) {
                e.preventDefault();
                setFailed(true);
                return;
              }
              setFailed(false);
              const dest = new URL(target.href, location.href),
                here = new URL(location.href);
              dest.searchParams.sort();
              here.searchParams.sort();
              if (dest.pathname === here.pathname && dest.search === here.search && dest.hash) {
                e.preventDefault();
                focusGuidedTarget(dest.hash);
              }
            }}
          >
            {recommended?.label ??
              (continueTeaching ? nb.refinement.continueTeaching : nb.course.next)}{' '}
            →<small>{target.title}</small>
          </Link>
        )}
        {failed && <span role="alert">{flowCopy.resumeFailed}</span>}
      </div>
    </nav>
  );
}
