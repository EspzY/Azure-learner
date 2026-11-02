'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { refinedAssessmentNb as c } from '@/content/nb';
import type { Track } from '@/domain/curriculum/expansion';
import {
  completeRefined,
  refinedHref,
  refinedItems,
  refinedLimit,
  refinedVersion,
  type RefinedAttempt,
} from '@/domain/curriculum/refined-assessment';
import { useRefined } from './refined-assessment-provider';
import { useExpansion } from './expansion-provider';
import { PortalDialog } from '@/features/portal/shared';
const t = c.ui;
/** Teaching version remains independent of assessment selection. An old active
 * attempt wins only when no assessment version was explicitly requested. */
export function useHistoricalAssessment(track: Track) {
  const query = useSearchParams(),
    old = useExpansion(track),
    path = usePathname(),
    router = useRouter();
  useEffect(() => {
    if (
      old.ready &&
      old.facts.active &&
      path === `/learn/${track}` &&
      query.get('topic') === 'assessment' &&
      !query.has('assessment')
    ) {
      const next = new URLSearchParams(query);
      next.set('assessment', 'legacy');
      router.replace(`${path}?${next}`);
    }
  }, [old.ready, old.facts.active, path, query, router, track]);
  return (
    query.get('assessment') === 'legacy' ||
    (query.get('assessment') !== 'updated' && old.facts.active)
  );
}
export function RefinedRecovery({ track }: { track: Track }) {
  const s = useRefined(track);
  if (!s.issue) return null;
  return (
    <div className="course-storage" role="status">
      <p>
        {t.recovery} ({s.issue})
      </p>
      <button onClick={s.store.load}>{t.reload}</button>
      {['corrupt', 'unsupported'].includes(s.issue) && (
        <button onClick={s.store.recoverInvalid}>{t.clear}</button>
      )}
    </div>
  );
}
export function AssessmentVersions({ track }: { track: Track }) {
  const old = useExpansion(track),
    s = useRefined(track);
  return (
    <nav aria-label={t.version}>
      <p>{t.replay}</p>
      {old.facts.active && s.facts.active && <p role="status">{t.conflict}</p>}
      <Link href={refinedHref(track)}>
        {s.facts.active ? `${t.resume} · ${t.title}` : t.updated}
      </Link>
      {' · '}
      <Link href={refinedHref(track, true)}>
        {old.facts.active ? `${t.resume} · ${t.legacy}` : t.historical}
      </Link>
    </nav>
  );
}
export function RefinedAssessment({ track }: { track: Track }) {
  const s = useRefined(track),
    old = useExpansion(track),
    [confirm, setConfirm] = useState(false),
    [help, setHelp] = useState(false);
  const firstQuestion = useRef<HTMLFieldSetElement>(null);
  const bounded = s.save.events.length >= refinedLimit - 3;
  const a = s.facts.current,
    blocked = !s.ready || !!s.issue;
  return (
    <section className="expanded-assessment">
      <h2 data-activity-heading tabIndex={-1}>
        {t.title}
      </h2>
      <p>{t.intro}</p>
      <p>
        {t.version} {refinedVersion(track)}
      </p>
      <RefinedRecovery track={track} />
      {bounded && <p role="status">{t.bounded}</p>}
      {s.facts.active && a ? (
        <>
          <p role="status">
            {a.assisted ? t.assisted : t.unaided} · {a.retry ? t.retry : t.first}
          </p>
          <p>{t.draft}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              s.store.event({ kind: 'submit' });
            }}
          >
            {refinedItems(track).map((item, index) => {
              const answer = a.answers[item.id] ?? {};
              return (
                <fieldset
                  key={item.id}
                  data-refined-item={item.id}
                  disabled={blocked || bounded}
                  tabIndex={-1}
                  ref={index === 0 ? firstQuestion : undefined}
                >
                  <legend>
                    {index + 1}. {item.title}
                  </legend>
                  <p>{item.scenario}</p>
                  <ul>
                    {item.premises.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <p>{item.question}</p>
                  {'number' in item && (
                    <label>
                      {item.number.prompt}
                      <input
                        aria-label={item.number.prompt}
                        inputMode="numeric"
                        type="text"
                        pattern="[0-9]{1,3}"
                        required
                        value={answer.number ?? ''}
                        onChange={(e) =>
                          s.store.event({
                            kind: 'answer',
                            item: item.id,
                            field: 'number',
                            value: e.target.value,
                          })
                        }
                      />
                      <small>{item.number.unit}</small>
                    </label>
                  )}
                  {(['decision', 'reason'] as const).map((field) => (
                    <label key={field}>
                      {field === 'decision' ? t.decision : t.reason}
                      <select
                        aria-label={`${item.title} · ${field === 'decision' ? t.decision : t.reason}`}
                        required
                        value={answer[field] ?? ''}
                        onChange={(e) =>
                          s.store.event({
                            kind: 'answer',
                            item: item.id,
                            field,
                            value: e.target.value,
                          })
                        }
                      >
                        <option value="">{t.choose}</option>
                        {(field === 'decision' ? item.decisions : item.reasons).map((o) => (
                          <option value={o.id} key={o.id}>
                            {o.text}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </fieldset>
              );
            })}
            <button className="primary" disabled={blocked || !completeRefined(track, a.answers)}>
              {t.submit}
            </button>
          </form>
          <button
            disabled={blocked}
            onClick={() => {
              if (s.store.event({ kind: 'aid' })) setHelp(true);
            }}
          >
            {t.help}
          </button>
          {help && (
            <p>
              <Link
                href={`/learn/${track}?topic=${track === 'benefits' ? 'availability' : 'selection'}${track === 'services' ? '&version=2' : ''}`}
              >
                {t.repeat}
              </Link>
            </p>
          )}
          <button disabled={blocked} onClick={() => s.store.event({ kind: 'abandon' })}>
            {t.abandon}
          </button>
          <p>{t.feedback}</p>
        </>
      ) : (
        <>
          {old.facts.active && <p role="status">{t.blocked}</p>}
          <button
            disabled={blocked || bounded || old.facts.active}
            onClick={() => setConfirm(true)}
          >
            {s.facts.attempts.length ? t.newAttempt : t.start}
          </button>
          {!s.issue && <RefinedHistory track={track} />}
        </>
      )}
      {confirm && (
        <PortalDialog title={t.title} onClose={() => setConfirm(false)}>
          <p>{t.intro}</p>
          <button onClick={() => setConfirm(false)}>{t.cancel}</button>
          <button
            className="primary"
            disabled={blocked || bounded || old.facts.active}
            onClick={() => {
              if (s.store.event({ kind: 'begin' })) {
                setConfirm(false);
                setHelp(false);
                requestAnimationFrame(() => {
                  firstQuestion.current?.focus({ preventScroll: true });
                  firstQuestion.current?.scrollIntoView({ block: 'start' });
                });
              }
            }}
          >
            {t.confirm}
          </button>
        </PortalDialog>
      )}
      <p>
        <Link href={`/learn/${track}?topic=summary`}>{t.summary}</Link>
      </p>
    </section>
  );
}
function AttemptFeedback({ track, attempt }: { track: Track; attempt: RefinedAttempt }) {
  return (
    <section>
      <h4>
        {attempt.retry ? t.retry : t.first} #{attempt.number} ·{' '}
        {attempt.assisted ? t.assisted : t.unaided}
      </h4>
      <p>
        {attempt.result!.filter((r) => r.correct).length}/{refinedItems(track).length} {t.score}
      </p>
      {refinedItems(track).map((item) => {
        const answer = attempt.answers[item.id] ?? {},
          rule = c.feedback[item.id],
          result = attempt.result!.find((r) => r.id === item.id);
        return (
          <section key={item.id}>
            <h5>{item.title}</h5>
            <p>{result?.correct ? t.correct : t.incorrect}</p>
            <p>
              {t.selected}: {item.decisions.find((o) => o.id === answer.decision)?.text} ·{' '}
              {item.reasons.find((o) => o.id === answer.reason)?.text}
            </p>
            {item.id === 'b-capacity' && (
              <p>
                {t.number}: {answer.number}
              </p>
            )}
            <p>{rule.explain}</p>
            <p>{rule.counter}</p>
            <Link href={rule.repeat}>{t.repeat}</Link>
          </section>
        );
      })}
    </section>
  );
}
/** Parent teaching boundary authorizes historical feedback. Own active form
 * never mounts history; opening Summary/Journal performs the durable preflight. */
export function RefinedHistory({ track, legacy = false }: { track: Track; legacy?: boolean }) {
  const s = useRefined(track),
    old = useExpansion(track);
  return (
    <section aria-label={t.history}>
      {legacy && (
        <section>
          <h3>{t.legacy}</h3>
          {old.facts.submissions.map((a) => (
            <p key={a.attempt}>
              {a.retry ? t.retry : t.first} #{a.attempt} ·{' '}
              {Object.values(a.criteria).filter(Boolean).length}/{Object.values(a.criteria).length}{' '}
              · {a.assisted ? t.assisted : t.unaided}
            </p>
          ))}
          <Link href={refinedHref(track, true)}>{t.historical}</Link>
        </section>
      )}
      <h3>
        {t.title} · {t.history}
      </h3>
      <RefinedRecovery track={track} />
      {!s.issue &&
        !s.facts.active &&
        (s.facts.submissions.length ? (
          s.facts.submissions.map((a) => (
            <details key={a.number} open={a.number === s.facts.current?.number}>
              <summary>
                {a.retry ? t.retry : t.first} #{a.number} · {t.result}
              </summary>
              <AttemptFeedback track={track} attempt={a} />
            </details>
          ))
        ) : (
          <p>{t.none}</p>
        ))}
      {s.facts.active && <Link href={refinedHref(track)}>{t.resume}</Link>}
      {s.facts.attempts
        .filter((a) => a.status === 'abandoned')
        .map((a) => (
          <p key={a.number}>
            #{a.number} · {t.abandoned}
          </p>
        ))}
    </section>
  );
}
