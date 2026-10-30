'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { nb, courseHubNb as h } from '@/content/nb';
import type { CourseModule } from '@/domain/course/model';
import { coursePaths, coursePathFor, moduleLabels } from './course-outline';

export type CourseDestinations = Record<CourseModule, string>;
export type CourseActivities = Record<
  CourseModule,
  readonly { href: string; title: string; topic: string; observed?: boolean; section?: string }[]
>;

export function CourseSidebar({
  module,
  topic,
  destinations,
  activities,
  onNavigate,
}: {
  module?: CourseModule;
  topic: string;
  destinations: CourseDestinations;
  activities: CourseActivities;
  onNavigate: () => void;
}) {
  const activePath = coursePathFor(module)?.id;
  const ref = useRef<HTMLElement>(null);
  const [openPaths, setOpenPaths] = useState<string[]>([activePath ?? 'cloud']);
  const [openModules, setOpenModules] = useState<string[]>(module ? [module] : []);
  const toggle = (current: string[], value: string) =>
    current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  useEffect(() => {
    const current = ref.current?.querySelector<HTMLElement>('[aria-current="step"]');
    const sidebar = ref.current?.closest<HTMLElement>('.course-navigation');
    if (!current || !sidebar || sidebar.scrollHeight <= sidebar.clientHeight) return;
    const pathHeading = current.closest('.course-tree-path')?.querySelector('h2');
    const reserve = () =>
      sidebar.style.setProperty(
        '--active-path-offset',
        `${pathHeading?.getBoundingClientRect().height ?? 60}px`,
      );
    const observer = new ResizeObserver(reserve);
    if (pathHeading) observer.observe(pathHeading);
    reserve();
    const item = current.getBoundingClientRect(),
      box = sidebar.getBoundingClientRect();
    if (item.bottom > box.bottom || item.top < box.top)
      sidebar.scrollTop +=
        item.top - box.top - (pathHeading?.getBoundingClientRect().height ?? 60) - 50;
    return () => observer.disconnect();
  }, [topic]);
  return (
    <nav ref={ref} className="course-navigation-content" aria-label={h.navigation}>
      <div className="course-sidebar-heading">
        <small>AZ-900</small>
        <strong>{h.certification}</strong>
      </div>
      <Link
        href="/learn"
        className="course-overview-link"
        aria-current={!module ? 'page' : undefined}
        onClick={onNavigate}
      >
        <LayoutGrid size={16} aria-hidden="true" /> {nb.course.overview}
      </Link>
      <div className="course-path-tree">
        {coursePaths.map((path) => {
          const open = openPaths.includes(path.id);
          return (
            <section key={path.id} className="course-tree-path">
              <h2>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`course-path-${path.id}`}
                  onClick={() => setOpenPaths(toggle(openPaths, path.id))}
                >
                  <span className="course-tree-number">{path.number}</span>
                  <span>{path.title}</span>
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
              </h2>
              <div id={`course-path-${path.id}`} hidden={!open}>
                <ul className="course-tree-modules">
                  {path.modules.map((group) => (
                    <li key={group.title}>
                      {group.parts.length > 1 && (
                        <span className="course-tree-group">{group.title}</span>
                      )}
                      {group.parts.map((part) => {
                        const expanded = openModules.includes(part);
                        return (
                          <div
                            key={part}
                            className={
                              part === 'architecture' ? 'course-architecture-nav' : undefined
                            }
                          >
                            <div className="course-tree-module">
                              <Link
                                href={destinations[part]}
                                aria-current={module === part ? 'page' : undefined}
                                onClick={onNavigate}
                              >
                                {moduleLabels[part]}
                              </Link>
                              <button
                                type="button"
                                aria-label={`${h.activities}: ${moduleLabels[part]}`}
                                aria-expanded={expanded}
                                aria-controls={`course-activities-${part}`}
                                onClick={() => setOpenModules(toggle(openModules, part))}
                              >
                                <ChevronDown size={14} aria-hidden="true" />
                              </button>
                            </div>
                            <ol
                              id={`course-activities-${part}`}
                              className="course-units"
                              hidden={!expanded}
                            >
                              {activities[part].map((activity) => (
                                <li key={activity.topic}>
                                  {activity.section && (
                                    <span className="course-activity-section">
                                      {activity.section}
                                    </span>
                                  )}
                                  <Link
                                    href={activity.href}
                                    aria-current={
                                      module === part && topic === activity.topic
                                        ? 'step'
                                        : undefined
                                    }
                                    onClick={onNavigate}
                                  >
                                    {activity.title}
                                    {activity.observed && (
                                      <span
                                        className="course-observed"
                                        aria-label={h.guidedObservation}
                                      >
                                        ·
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ol>
                          </div>
                        );
                      })}
                    </li>
                  ))}
                </ul>
                {path.planned.length > 0 && (
                  <p className="course-tree-planned">
                    {h.planned}: {path.planned.join(' · ')}
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <p className="course-sidebar-note">{h.localHistory}</p>
    </nav>
  );
}
