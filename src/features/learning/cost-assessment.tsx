'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { costNb as c, costItemsNb } from '@/content/nb';
import {
  costHref,
  costItems,
  costItemIds,
  evaluateCostAttempt,
  type CostItemId,
  type CostAttempt,
} from '@/domain/curriculum/cost';
import { SavvyShark } from '@/features/course/savvy-shark';
import { PortalDialog } from '@/features/portal/shared';
import { useCost } from './cost-provider';
import { ManagementTeachingBoundary } from './management-access';
import { CostRecovery, CostSources } from './cost';
import { CostBars } from './cost-visuals';
export function CostAssessment({ selected }: { selected: string | null }) {
  const t = useCost(),
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
  const item = costItemIds.includes(selected as CostItemId)
    ? (selected as CostItemId)
    : t.facts.active
      ? t.facts.current!.item
      : 'cm01';
  const active = t.facts.active ? t.facts.current : null,
    current = active?.item === item ? active : null;
  const latest = t.facts.attempts.findLast((a) => a.item === item && a.status === 'submitted'),
    copy = costItemsNb[item];
  const submissions = t.facts.attempts.filter((a) => a.status === 'submitted');
  const reviewed = submissions.find((a) => a.id === historical) ?? submissions[0];
  const event = (e: unknown) => {
    const ok = t.store.event(e);
    setFailed(!ok);
    return ok;
  };
  if (t.issue) return <CostRecovery focus={failed} />;
  if (!t.ready) return <p>{c.storage.loading}</p>;
  const begin = () => {
    setHistory(false);
    if (event({ kind: 'begin', item })) {
      setBrief(false);
      router.replace(costHref('assessment', item));
    }
  };
  return (
    <section className="cost-assessment" aria-label={c.assessment.title}>
      <p>{c.assessment.intro}</p>
      <p>{c.assessment.rules}</p>
      <label className="cost-control">
        <span>{c.assessment.case}</span>
        <select
          disabled={!!active}
          value={item}
          onChange={(e) => router.push(costHref('assessment', e.target.value as CostItemId))}
        >
          {costItemIds.map((id) => (
            <option key={id} value={id}>
              {id} · {costItemsNb[id].title}
            </option>
          ))}
        </select>
      </label>
      {active && !current ? (
        <p role="status">
          {c.assessmentActive}{' '}
          <Link href={costHref('assessment', active.item)}>{costItemsNb[active.item].title}</Link>
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
              · {c.assessment.draft}
            </small>
            <h3 ref={focus} key={current.id} tabIndex={-1}>
              {copy.title}
            </h3>
          </header>
          <p className="cost-problem">{copy.problem}</p>
          <ul className="cost-premises">
            {copy.premises.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <ScenarioFigure item={item} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              event({ kind: 'submit' });
            }}
          >
            <div className="cost-answer-grid">
              {(['decision', 'reason'] as const).map((field) => (
                <fieldset key={field}>
                  <legend>{c.assessment[field]}</legend>
                  {(field === 'decision' ? copy.decisions : copy.reasons).map((text, i) => (
                    <label key={text}>
                      <input
                        type="radio"
                        name={`cost-${field}`}
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
            <div className="cost-actions">
              <button
                className="cost-primary"
                disabled={current.answer.decision === null || current.answer.reason === null}
              >
                {c.assessment.submit}
              </button>
              <button type="button" onClick={() => event({ kind: 'abandon' })}>
                {c.assessment.abandon}
              </button>
              <Link href={costHref(costItems[item].repeat)}>{c.assessment.help}</Link>
            </div>
          </form>
        </>
      ) : (
        <>
          {!active && (
            <button className="cost-primary" disabled={t.facts.full} onClick={() => setBrief(true)}>
              {latest ? c.assessment.retry : c.assessment.start}
            </button>
          )}
          {latest && (
            <ManagementTeachingBoundary identity={`cost-result:${item}:${latest.id}`}>
              <CostFeedback attempt={latest} />
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
        <ManagementTeachingBoundary identity={`cost-history:${reviewed.id}`}>
          <section className="cost-history">
            <label className="cost-control">
              <span>{c.assessment.history}</span>
              <select value={reviewed.id} onChange={(e) => setHistorical(Number(e.target.value))}>
                {submissions.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} · {costItemsNb[a.item].title} ·{' '}
                    {a.assisted
                      ? c.assessment.assisted
                      : a.retry
                        ? c.assessment.retried
                        : c.assessment.first}
                  </option>
                ))}
              </select>
            </label>
            <CostFeedback attempt={reviewed} historical />
          </section>
        </ManagementTeachingBoundary>
      )}
      {brief && !active && (
        <PortalDialog title={c.assessment.title} onClose={() => setBrief(false)}>
          <div className="cost-brief">
            <SavvyShark compact>
              <p>{c.assessment.intro}</p>
            </SavvyShark>
            <p>{c.assessment.rules}</p>
            <p>{c.guided.notice}</p>
            {t.facts.full && <p role="status">{c.storage.capacity}</p>}
            {failed && <p role="alert">{c.storage.failed}</p>}
            <div className="cost-actions">
              <button onClick={() => setBrief(false)}>{c.guided.cancel}</button>
              <button className="cost-primary" disabled={t.facts.full} onClick={begin}>
                {c.assessment.start}
              </button>
            </div>
          </div>
        </PortalDialog>
      )}
    </section>
  );
}
function CostFeedback({
  attempt: a,
  historical = false,
}: {
  attempt: CostAttempt;
  historical?: boolean;
}) {
  const copy = costItemsNb[a.item],
    result = evaluateCostAttempt(a),
    definition = costItems[a.item];
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
      className="cost-feedback"
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
      <Link href={costHref(definition.repeat)}>
        {c.assessment.repeat} → {c.topics[definition.repeat]}
      </Link>
      <CostSources
        topic={
          definition.repeat as
            'drivers' | 'estimate' | 'analysis' | 'budgets' | 'tags' | 'optimization'
        }
      />
    </section>
  );
}
function ScenarioFigure({ item }: { item: CostItemId }) {
  return item === 'cm05' ? (
    <CostBars
      title={c.analysis.delta}
      rows={[
        { key: 'compute1', label: `Compute · ${c.analysis.earlier}`, cents: 8000 },
        { key: 'compute2', label: `Compute · ${c.analysis.later}`, cents: 8000 },
        { key: 'storage1', label: `Storage · ${c.analysis.earlier}`, cents: 2000 },
        { key: 'storage2', label: `Storage · ${c.analysis.later}`, cents: 9000 },
      ]}
    />
  ) : item === 'cm02' ? (
    <div className="cost-given" aria-label={c.controls.driver}>
      <div>
        <strong>2 × 40</strong>
        <span>
          {c.controls.count} × {c.controls.hours}
        </span>
      </div>
      <div>
        <strong>3 ØK</strong>
        <span>{c.unitLabels['instance-hour']}</span>
      </div>
      <div>
        <strong>50 GB ×0,40 ØK</strong>
        <span>{c.controls.storage}</span>
      </div>
    </div>
  ) : null;
}
