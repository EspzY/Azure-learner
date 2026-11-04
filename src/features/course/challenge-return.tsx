'use client';
import Link from 'next/link';
import { nb, challengeReturnNb as copy } from '@/content/nb';
import { useEffect, useRef } from 'react';
import { usePortalLearning } from '@/features/portal/learning-provider';
import { challengeResumeHref, challengeReturnHref } from '@/domain/portal/challenge-origin';

// A neutral return state: no lesson, feedback, visit or assistance is mounted here.
export function ChallengeReturn() {
  const state = usePortalLearning();
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
  }, []);
  const reliable = state.ready && !state.issue && !state.originIssue && state.originReady;
  const origin = reliable ? (state.origin ?? null) : null;
  return (
    <div className="portal course-shell course-hybrid">
      <header className="course-header">
        <Link className="course-brand" href="/learn">
          {nb.course.brand} <small>AZ-900</small>
        </Link>
        <nav aria-label={copy.nav}>
          <Link href="/learn">{copy.overview}</Link>
        </nav>
      </header>
      <main id="course-main" className="course-main">
        <h1 ref={title} tabIndex={-1}>
          {copy.title}
        </h1>
        <p>
          {origin
            ? origin.module === 'computing'
              ? copy.fromComputing
              : copy.fromServices
            : copy.unknownOrigin}
        </p>
        {state.issue || state.originIssue ? (
          <p role="alert">
            {copy.storageNeedsReview}{' '}
            <button type="button" onClick={state.store.load}>
              {copy.reloadSaved}
            </button>
          </p>
        ) : state.ready && state.originReady ? (
          <>
            <p>{state.facts.active ? copy.active : copy.inactive}</p>
            <p>
              <Link className="primary" href={challengeResumeHref(origin)}>
                {state.facts.active ? copy.resumeActive : copy.resumeHistory}
              </Link>
            </p>
            {origin && (
              <p>
                <Link href={challengeReturnHref(origin, false)}>
                  {state.facts.active ? copy.openTeachingAid : copy.returnTeaching}
                </Link>
              </p>
            )}
          </>
        ) : (
          <p role="status">{copy.loading}</p>
        )}
      </main>
    </div>
  );
}
