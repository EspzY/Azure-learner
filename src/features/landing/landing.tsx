'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowRight, Cloud, Server, Network, FlaskConical, Clock3 } from 'lucide-react';
import { landingNb as t } from '@/content/nb';
import { useCourse } from '@/features/course/provider';
import { currentAz900Status } from './course-status';
import { CourseStatusBadge } from './course-status-badge';
import { BifrostBrandMark } from '@/features/design/brand-mark';
import { ThemeToggle } from '@/features/design/theme';
import './landing.css';

const icons = [Cloud, Server, Network];
export function Landing({ commit }: { commit: string | null }) {
  const course = useCourse();
  const status = currentAz900Status(course);
  const router = useRouter();
  const [opening, setOpening] = useState<'course' | 'laboratory' | null>(null);
  useEffect(() => {
    // Also reset a restored App Router / back-forward view. No learner state.
    queueMicrotask(() => setOpening(null));
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
    setOpening(kind);
    router.push(url);
  };
  return (
    <div className="azurelab-landing bifrost-learning" data-opening={opening ?? undefined}>
      <a className="landing-skip" href="#landing-main">
        {t.skip}
      </a>
      <header className="landing-theme-bar">
        <ThemeToggle />
      </header>
      <main id="landing-main" tabIndex={-1}>
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-wordmark">
            <BifrostBrandMark className="landing-brand-mark" />
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
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    {available ? (
                      <CourseStatusBadge status={status} />
                    ) : (
                      <span className="landing-planned">
                        <Clock3 size={12} aria-hidden="true" />
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
              <FlaskConical size={21} strokeWidth={1.8} aria-hidden="true" />
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
