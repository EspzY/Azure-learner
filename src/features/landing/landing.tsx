'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowRight, BookOpen, Layers3, Network, FlaskConical, LockKeyhole } from 'lucide-react';
import { landingNb as t } from '@/content/nb';
import { useCourse } from '@/features/course/provider';
import { currentAz900Status } from './course-status';
import { CourseStatusBadge } from './course-status-badge';
import './landing.css';

const icons = [BookOpen, Layers3, Network];
export function Landing({ commit }: { commit: string | null }) {
  const course = useCourse();
  const status = currentAz900Status(course);
  const router = useRouter();
  const [opening, setOpening] = useState<'course' | 'laboratory' | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    // Also reset a restored App Router / back-forward view. No learner state.
    queueMicrotask(() => setOpening(null));
    return () => window.clearTimeout(timer.current);
  }, []);
  const open = (
    event: MouseEvent<HTMLAnchorElement>,
    kind: 'course' | 'laboratory',
    url: string,
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    event.preventDefault();
    window.clearTimeout(timer.current);
    setOpening(kind);
    timer.current = window.setTimeout(() => router.push(url), 140);
  };
  return (
    <div className="azurelab-landing" data-opening={opening ?? undefined}>
      <a className="landing-skip" href="#landing-main">
        {t.skip}
      </a>
      <main id="landing-main" tabIndex={-1}>
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-wordmark">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M5 25L16 5l11 20M9 19h14M5 28h22" />
            </svg>
            <h1 id="landing-title">{t.brand}</h1>
          </div>
          <p className="landing-description">{t.description}</p>
        </section>
        <section className="landing-courses" aria-labelledby="landing-courses-title">
          <div className="landing-section-heading">
            <h2 id="landing-courses-title">{t.coursesTitle}</h2>
          </div>
          <div className="landing-course-grid">
            {t.courses.map((item, index) => {
              const Icon = icons[index]!;
              const available = item.code === 'AZ-900';
              const content = (
                <>
                  <div className="landing-course-top" id={`course-status-${item.code}`}>
                    <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                    {available ? (
                      <CourseStatusBadge status={status} />
                    ) : (
                      <span className="landing-planned">
                        <LockKeyhole size={13} aria-hidden="true" />
                        {t.planned}
                      </span>
                    )}
                  </div>
                  <p className="landing-course-code">{item.code}</p>
                  <h3 id={`course-${item.code}`}>{item.name}</h3>
                  {available && (
                    <ArrowRight className="landing-card-arrow" size={20} aria-hidden="true" />
                  )}
                </>
              );
              return (
                <article
                  key={item.code}
                  className={`landing-course ${available ? 'landing-course-available' : ''}`}
                  aria-labelledby={`course-${item.code}`}
                >
                  {available ? (
                    <Link
                      className="landing-card-link"
                      href="/learn"
                      prefetch={false}
                      aria-label={t.az900Link}
                      aria-describedby={`course-status-${item.code}`}
                      onClick={(event) => open(event, 'course', '/learn')}
                    />
                  ) : null}
                  {content}
                </article>
              );
            })}
          </div>
        </section>
        <section className="landing-laboratory-section" aria-labelledby="landing-lab-title">
          <div className="landing-laboratory">
            <Link
              className="landing-lab-link"
              href="/labs/laboratory"
              prefetch={false}
              aria-label={t.labLink}
              aria-describedby="landing-lab-description"
              onClick={(event) => open(event, 'laboratory', '/labs/laboratory')}
            />
            <div className="landing-lab-icon">
              <FlaskConical size={32} strokeWidth={1.3} aria-hidden="true" />
            </div>
            <div className="landing-lab-copy">
              <h2 id="landing-lab-title">{t.labTitle}</h2>
              <p id="landing-lab-description">{t.labDescription}</p>
            </div>
            <ArrowRight className="landing-lab-arrow" size={21} aria-hidden="true" />
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <p>{t.footer}</p>
        {commit && (
          <details>
            <summary>{t.build}</summary>
            <code>{commit}</code>
          </details>
        )}
      </footer>
    </div>
  );
}
