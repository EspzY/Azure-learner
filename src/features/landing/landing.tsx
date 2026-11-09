'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type MouseEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Layers3,
  Network,
  FlaskConical,
  LockKeyhole,
  ArrowUpRight,
} from 'lucide-react';
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
  const open = (event: MouseEvent<HTMLAnchorElement>, kind: 'course' | 'laboratory', url: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;
    event.preventDefault();
    setOpening(kind);
    window.setTimeout(() => router.push(url), 160);
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
              return (
                <article
                  key={item.code}
                  className={`landing-course ${available ? 'landing-course-available' : ''}`}
                  aria-labelledby={`course-${item.code}`}
                >
                  <div className="landing-course-top">
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
                    <div className="landing-course-bottom">
                      <Link
                        className="landing-action"
                        href="/learn"
                        prefetch={false}
                        aria-label={t.az900Link}
                        onClick={(event) => open(event, 'course', '/learn')}
                      >
                        {t.openCourse}
                        <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        <section className="landing-laboratory" aria-labelledby="landing-lab-title">
          <div className="landing-lab-icon">
            <FlaskConical size={34} strokeWidth={1.3} aria-hidden="true" />
          </div>
          <div className="landing-lab-copy">
            <h2 id="landing-lab-title">{t.labTitle}</h2>
            <p>{t.labDescription}</p>
          </div>
          <Link
            className="landing-lab-action"
            href="/labs/laboratory"
            prefetch={false}
            aria-label={t.labLink}
            onClick={(event) => open(event, 'laboratory', '/labs/laboratory')}
          >
            {t.openLab}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
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
