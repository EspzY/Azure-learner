'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, ShieldCheck } from 'lucide-react';
import { architectureNb, nb, courseHubNb as h, missionsNb, transferNb, labsNb } from '@/content/nb';
import { courseHref, type CourseModule } from '@/domain/course/model';
import { missionIds, missionOrigin } from '@/domain/sandbox/missions';
import { coursePaths, moduleLabels } from './course-outline';
import type { CourseDestinations } from './course-sidebar';

export type HubRecord = {
  id: string;
  label: string;
  ready: boolean;
  issue: string | null;
  href: string;
  reload: () => void;
};

export function CourseHub({
  resumeHref,
  resumeLabel,
  hasResume,
  activeIndependent,
  destinations,
  observations,
  records,
  missionResume,
  onServiceLab,
}: {
  resumeHref: string;
  resumeLabel: string;
  hasResume: boolean;
  activeIndependent: boolean;
  destinations: CourseDestinations;
  observations: Record<CourseModule, string>;
  records: HubRecord[];
  missionResume?: { href: string; title: string };
  onServiceLab: () => void;
}) {
  const ready = records.every((record) => record.ready);
  const uncertain = records.filter((record) => record.issue);
  const known = ready && !uncertain.length;
  return (
    <div className="course-hub">
      <section className="course-intro learn-hub-intro" aria-labelledby="learn-hub-title">
        <div className="learn-hub-eyebrow">
          <span>AZ-900</span> AZURE FUNDAMENTALS
        </div>
        <h1 id="learn-hub-title">{nb.course.title}</h1>
        <p>{h.intro}</p>
        <div className="learn-hub-start">
          {known ? (
            <Link className="course-primary" href={resumeHref}>
              {resumeLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ) : (
            <button className="course-primary" disabled>
              {ready ? h.checkHistory : h.loading}
            </button>
          )}
          <span className="learn-hub-start-context">
            {known
              ? activeIndependent
                ? h.activeAssessment
                : hasResume
                  ? h.savedPosition
                  : h.firstModule
              : h.historyUnknown}
          </span>
        </div>
        <p className="learn-hub-local-note">
          <ShieldCheck size={15} aria-hidden="true" />
          {h.simulator}
        </p>
      </section>

      {uncertain.length > 0 && (
        <section className="learn-hub-recovery" aria-labelledby="learn-hub-recovery-title">
          <h2 id="learn-hub-recovery-title">{h.checkHistory}</h2>
          <p>{h.historyUnknown}</p>
          <ul>
            {uncertain.map((record) => (
              <li key={record.id}>
                <span>
                  {record.label} · {record.issue}
                </span>
                <button onClick={record.reload}>
                  {nb.course.reload} · {record.label}
                </button>
                <Link href={record.href}>
                  {h.reviewRecord} · {record.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="learn-hub-paths" aria-labelledby="learn-hub-paths-title">
        <div className="learn-hub-section-heading">
          <div>
            <small>{h.courseMap}</small>
            <h2 id="learn-hub-paths-title">{h.pathsTitle}</h2>
          </div>
          <p>{h.pathsNote}</p>
        </div>
        <div className="learn-hub-path-grid">
          {coursePaths.map((path) => (
            <article
              className="learn-hub-path"
              key={path.id}
              aria-labelledby={`learn-hub-${path.id}-title`}
            >
              <div className="learn-hub-path-heading">
                <span className="learn-hub-path-number">{path.number}</span>
                <span className="learn-hub-availability">
                  {path.modules.length}{' '}
                  {path.modules.length === 1 ? h.availableModule : h.availableModules}
                </span>
              </div>
              <h3 id={`learn-hub-${path.id}-title`}>{path.title}</h3>
              <p className="learn-hub-path-description">{path.description}</p>
              <ul className="learn-hub-modules">
                {path.modules.map((group) => (
                  <li key={group.title}>
                    {(group.parts.length > 1 || group.title !== moduleLabels[group.parts[0]]) && (
                      <strong className="learn-hub-module-group">{group.title}</strong>
                    )}
                    {group.parts.map((part) => (
                      <div key={part} className="learn-hub-module" data-module={part}>
                        <Link
                          href={destinations[part]}
                          aria-label={
                            part === 'architecture'
                              ? architectureNb.open
                              : `${nb.course.open}: ${moduleLabels[part]}`
                          }
                        >
                          <span>{moduleLabels[part]}</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <small>{known ? observations[part] : h.historyUnknownShort}</small>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
              {path.planned.length > 0 && (
                <p className="learn-hub-planned">
                  <span>{h.planned}</span>
                  {path.planned.join(' · ')}
                </p>
              )}
              <details className="learn-hub-path-activities">
                <summary aria-label={`${h.explorePath} · ${path.title}`}>{h.explorePath}</summary>
                <div>
                  <p>{h.activityNote}</p>
                  {path.id === 'cloud' ? (
                    <>
                      <nav className="transfer-entry" aria-label={transferNb.title}>
                        <h4>{h.assessments}</h4>
                        {(['computing', 'benefits', 'services'] as const).map((part, index) => (
                          <Link key={part} href={courseHref(part, 'transfer')}>
                            {transferNb.modules[part]} · 0{index + 1}
                          </Link>
                        ))}
                      </nav>
                      <nav className="mission-discovery" aria-label={missionsNb.title}>
                        <h4>{missionsNb.title}</h4>
                        {missionResume && (
                          <Link href={missionResume.href}>
                            {missionsNb.resume} · {missionResume.title}
                          </Link>
                        )}
                        {missionIds.map((id) => (
                          <Link key={id} href={missionOrigin(id)}>
                            {missionsNb.missions[id].title}
                          </Link>
                        ))}
                      </nav>
                      <nav aria-label={h.serviceLabs}>
                        <h4>{h.serviceLabs}</h4>
                        {(['iaas', 'paas', 'saas'] as const).map((part) => (
                          <Link
                            key={part}
                            href={`/learn/services?topic=${part}&activity=practical&version=2`}
                            onClick={onServiceLab}
                          >
                            {labsNb.models[part]} · {labsNb.title}
                          </Link>
                        ))}
                      </nav>
                    </>
                  ) : (
                    path.modules
                      .flatMap((group) => group.parts)
                      .map((part) => (
                        <nav key={part} aria-label={`${h.activities}: ${moduleLabels[part]}`}>
                          <h4>{moduleLabels[part]}</h4>
                          <Link href={destinations[part]}>{h.openLearning}</Link>
                          <Link href={courseHref(part, 'assessment')}>{h.assessments}</Link>
                          {part === 'architecture' && (
                            <Link href={courseHref(part, 'management-assessment')}>
                              {h.partBAssessment}
                            </Link>
                          )}
                          <Link href={courseHref(part, 'summary')}>{h.historyAndSummary}</Link>
                          {part === 'architecture' && (
                            <Link href={courseHref(part, 'core-summary')}>{h.partBSummary}</Link>
                          )}
                        </nav>
                      ))
                  )}
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>
      <footer className="learn-hub-footer">
        <div>
          <BookOpen size={19} aria-hidden="true" />
          <p>
            <strong>{h.historyTitle}</strong>
            <span>{h.progressNote}</span>
          </p>
        </div>
        <Link href="/portal">
          <FlaskConical size={17} aria-hidden="true" />
          {h.sandbox}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
