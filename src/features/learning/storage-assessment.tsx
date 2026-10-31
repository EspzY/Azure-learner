'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storageNb as c, storageItemsNb } from '@/content/nb';
import {
  storageHref,
  storageItems,
  storageItemIds,
  evaluateStorageAttempt,
  type StorageItemId,
  type StorageAttempt,
} from '@/domain/curriculum/storage';
import { SavvyShark } from '@/features/course/savvy-shark';
import { PortalDialog } from '@/features/portal/shared';
import { useStorage } from './storage-provider';
import { ManagementTeachingBoundary } from './management-access';
import { StorageRecovery, StorageSources } from './storage';
export function StorageAssessment({ selected }: { selected: string | null }) {
  const t = useStorage(),
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
  const item = storageItemIds.includes(selected as StorageItemId)
    ? (selected as StorageItemId)
    : t.facts.current
      ? t.facts.current.item
      : 'sa01';
  const active = t.facts.active ? t.facts.current : null,
    current = active?.item === item ? active : null;
  const latest = t.facts.attempts.findLast((a) => a.item === item && a.status === 'submitted'),
    copy = storageItemsNb[item];
  const submissions = t.facts.attempts.filter((a) => a.status === 'submitted');
  const reviewed = submissions.find((a) => a.id === historical) ?? submissions[0];
  const event = (e: unknown) => {
    const ok = t.store.event(e);
    setFailed(!ok);
    return ok;
  };
  if (t.issue && !t.facts.active) return <StorageRecovery focus={failed} />;
  if (!t.ready) return <p>{c.storage.loading}</p>;
  const begin = () => {
    setHistory(false);
    if (event({ kind: 'begin', item })) {
      setBrief(false);
      router.replace(storageHref('assessment', item));
    }
  };
  return (
    <section className="compute-assessment" aria-label={c.assessment.title}>
      {t.issue && <StorageRecovery focus={failed} />}
      <p>{c.assessment.intro}</p>
      <p>{c.assessment.rules}</p>
      <label className="compute-control">
        <span>{c.assessment.case}</span>
        <select
          disabled={!!active || !!t.issue}
          value={item}
          onChange={(e) => router.push(storageHref('assessment', e.target.value as StorageItemId))}
        >
          {storageItemIds.map((id) => (
            <option key={id} value={id}>
              {id} · {storageItemsNb[id].title}
            </option>
          ))}
        </select>
      </label>
      {active && !current ? (
        <p role="status">
          {c.assessmentActive}{' '}
          <Link href={storageHref('assessment', active.item)}>
            {storageItemsNb[active.item].title}
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
                        name={`storage-${field}`}
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
              <Link href={storageHref(storageItems[item].repeat)}>{c.assessment.help}</Link>
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
          {latest && (
            <ManagementTeachingBoundary identity={`storage-result:${item}:${latest.id}`}>
              <StorageFeedback attempt={latest} />
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
        <ManagementTeachingBoundary identity={`storage-history:${reviewed.id}`}>
          <section className="compute-history">
            <label className="compute-control">
              <span>{c.assessment.history}</span>
              <select value={reviewed.id} onChange={(e) => setHistorical(Number(e.target.value))}>
                {submissions.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} · {storageItemsNb[a.item].title} ·{' '}
                    {a.assisted
                      ? c.assessment.assisted
                      : a.retry
                        ? c.assessment.retried
                        : c.assessment.first}
                  </option>
                ))}
              </select>
            </label>
            <StorageFeedback attempt={reviewed} historical />
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
function StorageFeedback({
  attempt: a,
  historical = false,
}: {
  attempt: StorageAttempt;
  historical?: boolean;
}) {
  const copy = storageItemsNb[a.item],
    result = evaluateStorageAttempt(a),
    definition = storageItems[a.item];
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
        <p>{copy.decisive}</p>
      </SavvyShark>
      <dl>
        <div>
          <dt>{c.assessment.decision}</dt>
          <dd>
            {copy.decisions[a.answer.decision!]}
            <p>{copy.feedback[0][a.answer.decision!]}</p>
          </dd>
        </div>
        <div>
          <dt>{c.assessment.reason}</dt>
          <dd>
            {copy.reasons[a.answer.reason!]}
            <p>{copy.feedback[1][a.answer.reason!]}</p>
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
                <p>{copy.feedback[f]![i]}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Link href={storageHref(definition.repeat)}>
        {c.assessment.repeat} → {c.topics[definition.repeat]}
      </Link>
      <StorageSources topic={definition.repeat} />
    </section>
  );
}
