'use client';
import Link from 'next/link';
import { SourceDisclosure } from '@/features/learning/source-disclosure';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nb, managementNb, challenge2Nb as c } from '@/content/nb';
import {
  challenge2Href,
  challenge2Return,
  evaluateChallenge2,
  challenge2Limit,
  type Challenge2Answers,
} from '@/domain/portal/challenge-v2';
import {
  challengeOriginFromLocation,
  challengeResumeHref,
  type ChallengeOrigin,
} from '@/domain/portal/challenge-origin';
import { portalHref, type PortalLocation } from '@/domain/portal/model';
import { useMissionSafetyContexts } from '@/features/course/mission-context';
import { ManagementTeachingBoundary } from '@/features/learning/management-access';
import { useSandbox } from './sandbox-provider';
import { usePortalLearning } from './learning-provider';
import { useChallenge2 } from './challenge-v2-provider';
import { IndependentChallenge } from './learning';
import type { Navigate } from './shared';
const t = nb.portal.challenge;
export function Challenge2Recovery() {
  const old = usePortalLearning();
  const state = useChallenge2(),
    [confirm, setConfirm] = useState(false);
  return state.issue ? (
    <div role="alert">
      <p>
        {c.ui.storage} ({state.issue})
      </p>
      <button
        type="button"
        onClick={() => {
          old.store.load();
          state.store.load();
        }}
      >
        {c.ui.reload}
      </button>
      {['corrupt', 'unsupported'].includes(state.issue) && (
        <>
          <button type="button" onClick={() => setConfirm(!confirm)}>
            {c.ui.reset}
          </button>
          {confirm && (
            <>
              <p>{c.ui.resetConfirm}</p>
              <button
                type="button"
                onClick={() => {
                  state.store.recover();
                  setConfirm(false);
                }}
              >
                {c.ui.reset}
              </button>
            </>
          )}
        </>
      )}
    </div>
  ) : null;
}
export function ChallengeEntry({
  location,
  navigate,
}: {
  location: PortalLocation;
  navigate: Navigate;
}) {
  const old = usePortalLearning(),
    updated = useChallenge2(),
    router = useRouter();
  const ambiguous = !location.assessment && old.facts.active && updated.facts.active;
  const version = location.assessment ?? (old.facts.active ? 'legacy' : 'updated');
  useEffect(() => {
    if (old.ready && updated.ready && !location.assessment && !ambiguous)
      router.replace(portalHref(location, 'challenge', { assessment: version }), { scroll: false });
  }, [old.ready, updated.ready, location, version, router, ambiguous]);
  if (!old.ready || !updated.ready) return <p role="status">{c.ui.loading}</p>;
  if (ambiguous)
    return (
      <section>
        <h2>{c.ui.conflict}</h2>
        <p>
          <Link
            href={
              challengeResumeHref(old.issue ? null : (old.origin ?? null)) + '&assessment=legacy'
            }
          >
            {c.ui.resumeOld}
          </Link>
        </p>
        <p>
          <Link href={challenge2Href(updated.issue ? null : updated.facts.origin)}>
            {c.ui.resumeNew}
          </Link>
        </p>
      </section>
    );
  const origin = challengeOriginFromLocation(location);
  return (
    <>
      <nav className="portal-learning-actions" aria-label={c.ui.versionInfo}>
        <Link
          href={portalHref(location, 'challenge', { assessment: 'updated' })}
          aria-current={version === 'updated' ? 'page' : undefined}
        >
          {c.ui.updated}
        </Link>
        <Link
          href={portalHref(location, 'challenge', { assessment: 'legacy' })}
          aria-current={version === 'legacy' ? 'page' : undefined}
        >
          {c.ui.legacy}
        </Link>
      </nav>
      <p>{c.ui.versionInfo}</p>
      {version === 'updated' && old.facts.active && !updated.facts.active && <Challenge2Recovery />}
      {version === 'legacy' ? (
        <ManagementTeachingBoundary identity="legacy-web-challenge" assessment="legacyServices">
          <IndependentChallenge
            navigate={navigate}
            origin={origin}
            canBegin={updated.ready && !updated.facts.active && !updated.issue}
          />
        </ManagementTeachingBoundary>
      ) : old.facts.active && !updated.facts.active ? (
        <section>
          <h2>{c.ui.resumeOld}</h2>
          <p>{c.ui.conflict}</p>
          <Link href={challengeResumeHref(old.origin ?? null) + '&assessment=legacy'}>
            {c.ui.resumeOld}
          </Link>
        </section>
      ) : (
        <ManagementTeachingBoundary identity="updated-web-challenge" assessment="portalUpdated">
          <UpdatedChallenge navigate={navigate} origin={origin} />
        </ManagementTeachingBoundary>
      )}
    </>
  );
}
function UpdatedChallenge({
  navigate,
  origin,
}: {
  navigate: Navigate;
  origin: ChallengeOrigin | null;
}) {
  const state = useChallenge2(),
    { attempt, attemptNumber } = useSandbox(),
    contexts = useMissionSafetyContexts();
  const other = contexts.filter((x) => x.id !== 'portalUpdated');
  const safe = other.every((x) => x.state.ready && !x.state.issue && !x.active);
  const blocked = other.filter((x) => !x.state.ready || x.state.issue || x.active);
  const allowed = state.ready && (!state.issue || state.issue === 'limit');
  const update = (answers: Challenge2Answers) => state.store.event({ kind: 'draft', answers });
  const inputAllowed = allowed && state.save.events.length < challenge2Limit - 3;
  return (
    <article className="portal-challenge portal-challenge-updated">
      <h2>{c.title}</h2>
      <p>{c.instructions}</p>
      <p>{c.webBrief}</p>
      <p>{nb.portal.modeHints.independent}</p>
      <Challenge2Recovery />
      {!safe && (
        <div role="status">
          <p>{c.ui.conflict}</p>
          <ul>
            {blocked.map((x) => (
              <li key={x.id}>
                <Link href={x.href}>
                  {x.id === 'portal' ? c.ui.resumeOld : managementNb.accessReview}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!state.facts.active ? (
        <button
          type="button"
          className="primary"
          disabled={!allowed || !safe}
          onClick={() => {
            void state.store.begin(
              origin,
              attempt.engine.ledger.at(-1)?.request.commandId ?? null,
              attemptNumber,
            );
          }}
        >
          {state.facts.submissions.length ? c.ui.retry : c.ui.start}
        </button>
      ) : (
        <>
          <p role="status">
            {c.ui.active}
            {state.facts.assisted ? ' · ' + c.ui.assisted : ''}
          </p>
          <p>{c.ui.draft}</p>
          <button
            type="button"
            disabled={!allowed}
            onClick={() => state.store.event({ kind: 'abandon' })}
          >
            {c.ui.abandon}
          </button>
          {safe && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                state.store.event({
                  kind: 'submit',
                  through:
                    attempt.engine.ledger.at(-1)?.request.commandId ?? 'no-technical-command',
                });
              }}
            >
              <fieldset disabled={!inputAllowed}>
                <legend>{c.ui.updated}</legend>
                {c.items.map((item, i) => {
                  const key = i === 0 ? 'osModel' : 'platformModel',
                    reason = i === 0 ? 'osReason' : 'platformReason';
                  return (
                    <section key={item.id}>
                      <h3>{item.title}</h3>
                      <p>{item.scenario}</p>
                      <label>
                        {c.ui.decision}
                        <select
                          required
                          value={state.facts.draft[key] ?? ''}
                          onChange={(e) => update({ [key]: e.target.value })}
                        >
                          <option value="">{t.required}</option>
                          {item.decisions.map(([id, label]) => (
                            <option key={id} value={id}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {c.ui.reason}
                        <select
                          required
                          value={state.facts.draft[reason] ?? ''}
                          onChange={(e) => update({ [reason]: e.target.value })}
                        >
                          <option value="">{t.required}</option>
                          {item.reasons.map(([id, label]) => (
                            <option key={id} value={id}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </section>
                  );
                })}
                <section>
                  <h3>{t.references}</h3>
                  {(
                    [
                      ['webModel', t.web],
                      ['readyModel', t.ready],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <select
                        required
                        value={state.facts.draft[key] ?? ''}
                        onChange={(e) => update({ [key]: e.target.value })}
                      >
                        <option value="">{t.required}</option>
                        {c.webChoices.models.map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                  <label>
                    {t.reason}
                    <select
                      required
                      value={state.facts.draft.reason ?? ''}
                      onChange={(e) =>
                        update({ reason: e.target.value as Challenge2Answers['reason'] })
                      }
                    >
                      <option value="">{t.required}</option>
                      {c.webChoices.reasons.map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t.cause}
                    <select
                      required
                      value={state.facts.draft.locationCause ?? ''}
                      onChange={(e) =>
                        update({
                          locationCause: e.target.value as Challenge2Answers['locationCause'],
                        })
                      }
                    >
                      <option value="">{t.required}</option>
                      {c.webChoices.locationCauses.map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {(['groupId', 'planId', 'appId'] as const).map((key, i) => (
                    <label key={key}>
                      {[nb.portal.group, nb.portal.plan, nb.portal.app][i]}
                      <select
                        required
                        value={state.facts.draft[key] ?? ''}
                        onChange={(e) => update({ [key]: e.target.value })}
                      >
                        <option value="">{t.required}</option>
                        {(key === 'groupId'
                          ? attempt.engine.world.groups
                          : attempt.engine.world.resources.filter(
                              (r) =>
                                r.type ===
                                (key === 'planId'
                                  ? 'Microsoft.Web/serverfarms'
                                  : 'Microsoft.Web/sites'),
                            )
                        ).map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </section>
              </fieldset>
              <div className="portal-learning-actions">
                <button
                  type="button"
                  onClick={() =>
                    navigate('resources', { assessment: 'updated', mode: 'independent' })
                  }
                >
                  {nb.portal.areas.resources}
                </button>
                <button type="submit" className="primary" disabled={!allowed}>
                  {c.ui.submit}
                </button>
              </div>
            </form>
          )}
        </>
      )}
      {state.facts.prior === 'documented' && <p>{c.ui.prior}</p>}
      <Challenge2History />
      <p>{c.ui.limits}</p>
    </article>
  );
}
export function Challenge2History() {
  const state = useChallenge2(),
    { attempt, attemptNumber } = useSandbox();
  if (!state.ready || state.issue) return null;
  if (!state.facts.submissions.length) return null;
  if (state.facts.active && !state.facts.assisted)
    return (
      <p>
        {c.ui.closedHistory}{' '}
        <button type="button" onClick={() => state.store.event({ kind: 'aid' })}>
          {c.ui.aid}
        </button>
      </p>
    );
  return (
    <ManagementTeachingBoundary identity="updated-web-history" assessment="portalUpdated">
      <section className="portal-challenge-updated">
        <h3>{c.ui.history}</h3>
        {state.facts.submissions.map((submission, index) => {
          const result = evaluateChallenge2(submission, attempt.engine, attemptNumber),
            a = submission.answers;
          const label = submission.abandoned
            ? c.ui.abandoned
            : submission.assisted
              ? c.ui.assisted
              : index === 0
                ? c.ui.first
                : c.ui.practice;
          return (
            <section className="portal-submission" key={index} data-correct={result.correct}>
              <h4>{label}</h4>
              <p>
                {submission.assisted ? c.ui.assisted : index === 0 ? c.ui.local : c.ui.practice}
              </p>
              {submission.prior === 'documented' && <p>{c.ui.prior}</p>}
              <strong>
                {submission.abandoned
                  ? c.ui.abandoned
                  : !result.verifiable
                    ? c.ui.notVerifiable
                    : result.correct
                      ? c.ui.pass
                      : c.ui.fail}
              </strong>
              {!submission.abandoned && (
                <details>
                  <summary>{c.ui.details}</summary>
                  {c.items.map((item, i) => {
                    const key = i === 0 ? 'osModel' : 'platformModel',
                      reason = i === 0 ? 'osReason' : 'platformReason',
                      criterion = i === 0 ? 'os' : 'platform';
                    return (
                      <section key={item.id}>
                        <h5>{item.title}</h5>
                        <p>{item.scenario}</p>
                        <p>
                          {c.ui.yourDecision}:{' '}
                          {item.decisions.find((x) => x[0] === a[key])?.[1] ?? c.ui.missing}
                        </p>
                        <p>
                          {c.ui.yourReason}:{' '}
                          {item.reasons.find((x) => x[0] === a[reason])?.[1] ?? c.ui.missing}
                        </p>
                        <p>{result.criteria[criterion] ? c.ui.met : c.ui.notMet}</p>
                        <p>{c.feedback[criterion]}</p>
                      </section>
                    );
                  })}
                  <ul>
                    {Object.entries(result.criteria)
                      .filter(([id]) => id !== 'os' && id !== 'platform')
                      .map(([id, met]) => (
                        <li key={id}>
                          <strong>
                            {met ? c.ui.met : c.ui.notMet}:{' '}
                            {c.criteria[id as keyof typeof c.criteria]}
                          </strong>
                          <p>{c.feedback[id as keyof typeof c.feedback]}</p>
                        </li>
                      ))}
                  </ul>
                  <Link href="/learn/services?topic=selection&version=2">
                    {nb.official.services}
                  </Link>
                </details>
              )}
            </section>
          );
        })}
        <SourceDisclosure
          entries={c.sources.map((s) => ({ ...s, publisher: nb.portal.referencePublisher }))}
          note={c.ui.sources}
        />
      </section>
    </ManagementTeachingBoundary>
  );
}
export function UpdatedChallengeReturn() {
  const state = useChallenge2(),
    heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <div className="portal course-shell course-hybrid">
      <header className="course-header">
        <Link className="course-brand" href="/learn">
          {nb.course.brand} <small>AZ-900</small>
        </Link>
        <Link href="/learn">{c.ui.overview}</Link>
      </header>
      <main id="course-main" className="course-main">
        <h1 ref={heading} tabIndex={-1}>
          {c.ui.neutralTitle}
        </h1>
        <p>
          {(state.issue ? null : state.facts.origin)?.module === 'computing'
            ? c.ui.fromComputing
            : (state.issue ? null : state.facts.origin)?.module === 'services'
              ? c.ui.fromServices
              : c.ui.unknownOrigin}
        </p>
        <Challenge2Recovery />
        {state.ready && !state.issue && (
          <>
            <p>{state.facts.active ? c.ui.neutralActive : c.ui.neutralInactive}</p>
            <p>
              <Link className="primary" href={challenge2Href(state.facts.origin)}>
                {c.ui.resume}
              </Link>
            </p>
            {state.facts.origin && (
              <Link href={challenge2Return(state.facts.origin, false)}>
                {state.facts.active ? c.ui.teaching : c.ui.back}
              </Link>
            )}
          </>
        )}
      </main>
    </div>
  );
}
