'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { migrationNb as c, migrationItemsNb } from '@/content/nb';
import {
  migrationHref,
  migrationItems,
  migrationItemIds,
  evaluateMigrationAttempt,
  type MigrationItemId,
  type MigrationAttempt,
} from '@/domain/curriculum/migration';
import { SavvyShark } from '@/features/course/savvy-shark';
import { PortalDialog } from '@/features/portal/shared';
import { useMigration } from './migration-provider';
import { ManagementTeachingBoundary } from './management-access';
import { MigrationRecovery, MigrationSources } from './migration';
export function MigrationAssessment({ selected }: { selected: string | null }) {
  const t = useMigration(),
    router = useRouter(),
    [brief, setBrief] = useState(false),
    [history, setHistory] = useState(false),
    [historical, setHistorical] = useState<number | null>(null),
    [failed, setFailed] = useState(false);
  const focus = useCallback((node: HTMLHeadingElement | null) => {
    if (node)
      requestAnimationFrame(() => {
        if (node.isConnected) node.focus();
      });
  }, []);
  const item = migrationItemIds.includes(selected as MigrationItemId)
    ? (selected as MigrationItemId)
    : t.facts.current
      ? t.facts.current.item
      : 'fm01';
  const active = t.facts.active ? t.facts.current : null,
    current = active?.item === item ? active : null;
  const latest = t.facts.attempts.findLast((a) => a.item === item && a.status === 'submitted'),
    copy = migrationItemsNb[item];
  const submissions = t.facts.attempts.filter((a) => a.status === 'submitted');
  const reviewed = submissions.find((a) => a.id === historical) ?? submissions[0];
  const event = (e: unknown) => {
    const ok = t.store.event(e);
    setFailed(!ok);
    return ok;
  };
  if (t.issue && !t.facts.active) return <MigrationRecovery focus={failed} />;
  if (!t.ready) return <p>{c.storage.loading}</p>;
  const begin = () => {
    setHistory(false);
    if (event({ kind: 'begin', item })) {
      setBrief(false);
      router.replace(migrationHref('assessment', item));
    }
  };
  return (
    <section className="compute-assessment" aria-label={c.assessment.title}>
      {t.issue && <MigrationRecovery focus={failed} />}
      <p>{c.assessment.intro}</p>
      <p>{c.assessment.rules}</p>
      <label className="compute-control">
        <span>{c.assessment.case}</span>
        <select
          disabled={!!active || !!t.issue}
          value={item}
          onChange={(e) =>
            router.push(migrationHref('assessment', e.target.value as MigrationItemId))
          }
        >
          {migrationItemIds.map((id) => (
            <option key={id} value={id}>
              {id} · {migrationItemsNb[id].title}
            </option>
          ))}
        </select>
      </label>
      {active && !current ? (
        <p role="status">
          {c.assessmentActive}{' '}
          <Link href={migrationHref('assessment', active.item)}>
            {migrationItemsNb[active.item].title}
          </Link>
        </p>
      ) : null}
      {current ? (
        <>
          <header>
            <small>
              {current.assisted
                ? c.assessment.assisted
                : current.retry
                  ? c.assessment.retried
                  : c.assessment.unaided}{' '}
              · {t.issue ? c.storage.ownDraft : c.assessment.draft}
            </small>
            <h3 ref={focus} key={current.id} tabIndex={-1}>
              {copy.title}
            </h3>
          </header>
          <p className="compute-problem">{copy.problem}</p>
          <ul className="compute-premises">
            {copy.premises.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              event({ kind: 'submit' });
            }}
          >
            <div className="compute-answer-grid">
              {(['decision', 'reason'] as const).map((field) => (
                <fieldset key={field}>
                  <legend>{c.assessment[field]}</legend>
                  {(field === 'decision' ? copy.decisions : copy.reasons).map((text, i) => (
                    <label key={text}>
                      <input
                        type="radio"
                        disabled={!!t.issue}
                        name={`migration-${field}`}
                        checked={current.answer[field] === i}
                        onChange={() =>
                          event({ kind: 'draft', answer: { ...current.answer, [field]: i } })
                        }
                      />
                      <span>{text}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            <p>{c.assessment.neutral}</p>
            <div className="compute-actions">
              <button
                className="compute-primary"
                disabled={
                  !!t.issue || current.answer.decision === null || current.answer.reason === null
                }
              >
                {c.assessment.submit}
              </button>
              <button type="button" disabled={!!t.issue} onClick={() => event({ kind: 'abandon' })}>
                {c.assessment.abandon}
              </button>
              <Link href={migrationHref(migrationItems[item].repeat)}>{c.assessment.help}</Link>
            </div>
          </form>
        </>
      ) : (
        <>
          {!active && (
            <button
              className="compute-primary"
              disabled={t.facts.full}
              onClick={() => setBrief(true)}
            >
              {latest ? c.assessment.retry : c.assessment.start}
            </button>
          )}
          {latest && !active && (
            <ManagementTeachingBoundary identity={`migration-result:${item}:${latest.id}`}>
              <MigrationFeedback attempt={latest} />
            </ManagementTeachingBoundary>
          )}
        </>
      )}
      {failed && <p role="alert">{c.storage.failed}</p>}
      {!active && submissions.length > 0 && (
        <button aria-expanded={history} onClick={() => setHistory(!history)}>
          {c.assessment.history}
        </button>
      )}
      {history && reviewed && (
        <ManagementTeachingBoundary identity={`migration-history:${reviewed.id}`}>
          <section className="compute-history">
            <label className="compute-control">
              <span>{c.assessment.history}</span>
              <select value={reviewed.id} onChange={(e) => setHistorical(Number(e.target.value))}>
                {submissions.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} · {migrationItemsNb[a.item].title} ·{' '}
                    {a.assisted
                      ? c.assessment.assisted
                      : a.retry
                        ? c.assessment.retried
                        : c.assessment.first}
                  </option>
                ))}
              </select>
            </label>
            <MigrationFeedback attempt={reviewed} historical />
          </section>
        </ManagementTeachingBoundary>
      )}
      {brief && !active && (
        <PortalDialog title={c.assessment.title} onClose={() => setBrief(false)}>
          <div className="compute-brief">
            <SavvyShark compact>
              <p>{c.assessment.intro}</p>
            </SavvyShark>
            <p>{c.assessment.rules}</p>
            <p>{c.labels.notice}</p>
            {t.facts.full && <p role="status">{c.storage.capacity}</p>}
            {failed && <p role="alert">{c.storage.failed}</p>}
            <div className="compute-actions">
              <button onClick={() => setBrief(false)}>{c.labels.cancel}</button>
              <button className="compute-primary" disabled={t.facts.full} onClick={begin}>
                {c.assessment.start}
              </button>
            </div>
          </div>
        </PortalDialog>
      )}
    </section>
  );
}
function MigrationFeedback({
  attempt: a,
  historical = false,
}: {
  attempt: MigrationAttempt;
  historical?: boolean;
}) {
  const copy = migrationItemsNb[a.item],
    result = evaluateMigrationAttempt(a),
    definition = migrationItems[a.item];
  const focus = useCallback(
    (node: HTMLHeadingElement | null) => {
      if (node && !historical)
        requestAnimationFrame(() => {
          if (node.isConnected) node.focus();
        });
    },
    [historical],
  );
  return (
    <section
      className="compute-feedback"
      aria-label={historical ? c.historyFeedback : c.currentFeedback}
    >
      <h3 ref={focus} key={a.id} tabIndex={-1}>
        {historical ? c.historyFeedback : c.currentFeedback} · #{a.id}
      </h3>
      <p>
        {a.assisted ? c.assessment.assisted : a.retry ? c.assessment.retried : c.assessment.unaided}
      </p>
      <strong>{result.relation ? c.assessment.pass : c.assessment.fail}</strong>
      <SavvyShark compact>
        <p>{copy.reasonFeedback[a.answer.reason!]}</p>
      </SavvyShark>
      <dl>
        <div>
          <dt>{c.assessment.decision}</dt>
          <dd>
            {copy.decisions[a.answer.decision!]}
            <p>{copy.decisionFeedback[a.answer.decision!]}</p>
          </dd>
        </div>
        <div>
          <dt>{c.assessment.reason}</dt>
          <dd>
            {copy.reasons[a.answer.reason!]}
            <p>{copy.reasonFeedback[a.answer.reason!]}</p>
          </dd>
        </div>
      </dl>
      <h4>{c.assessment.alternatives}</h4>
      {(['decision', 'reason'] as const).map((field, f) => (
        <section key={field}>
          <h5>{c.assessment[field]}</h5>
          <ul>
            {(field === 'decision' ? copy.decisions : copy.reasons).map((option, i) => (
              <li key={option}>
                <strong>{option}</strong>
                <p>{(f === 0 ? copy.decisionFeedback : copy.reasonFeedback)[i]}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="migration-counterfactual">{copy.explain}</p>
      <Link href={migrationHref(definition.repeat)}>
        {c.assessment.repeat} → {c.topics[definition.repeat]}
      </Link>
      <MigrationSources topic={definition.repeat} />
    </section>
  );
}
