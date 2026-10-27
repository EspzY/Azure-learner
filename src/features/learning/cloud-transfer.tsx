'use client';
import { useCallback, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { transferNb as c } from '@/content/nb';
import {
  transferIds,
  transferItems,
  transferHref,
  transferCase,
  transferLimit,
  evaluateTransfer,
  type TransferModule,
  type TransferItemId,
  type TransferAttempt,
} from '@/domain/curriculum/transfer';
import { useTransfer } from './transfer-provider';
import { ManagementTeachingBoundary } from './management-access';
import { SavvyShark } from '@/features/course/savvy-shark';
import { PortalDialog } from '@/features/portal/shared';
import './transfer.css';
import { transferSources, transferSourceDate } from '@/domain/curriculum/transfer-sources';
import { useExpansion } from './expansion-provider';

export function TransferRecovery({ focus = false }: { focus?: boolean }) {
  const t = useTransfer(),
    [confirm, setConfirm] = useState(false);
  const load = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!focus) return;
    const frame = requestAnimationFrame(() => load.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [focus]);
  return (
    <div className="transfer-recovery">
      <p>
        {c.issue} {t.issue}
      </p>
      <button ref={load} onClick={t.store.load}>
        {c.load}
      </button>
      {['corrupt', 'unsupported'].includes(t.issue ?? '') && (
        <>
          <button onClick={() => setConfirm(true)}>{c.recovery}</button>
          {confirm && (
            <button
              onClick={() => {
                t.store.recoverInvalid();
                setConfirm(false);
              }}
            >
              {c.confirm}
            </button>
          )}
        </>
      )}
    </div>
  );
}
export function TransferEntry({ module }: { module?: TransferModule }) {
  const t = useTransfer();
  return (
    <section className="transfer-entry" aria-label={c.title}>
      <h2>{c.entry}</h2>
      <p>{c.intro}</p>
      <nav aria-label={c.title}>
        {(module ? [module] : (['computing', 'benefits', 'services'] as const)).map((m) => (
          <Link key={m} href={`/learn/${m}?topic=transfer`}>
            {c.modules[m]} · {m === 'computing' ? '01' : m === 'benefits' ? '02' : '03'}
          </Link>
        ))}
      </nav>
      {t.facts.active && t.facts.current && (
        <Link href={transferHref(t.facts.current.item)}>{c.resume}</Link>
      )}
    </section>
  );
}
export function TransferAssessment({
  module,
  selected,
}: {
  module: TransferModule;
  selected: string | null;
}) {
  const t = useTransfer(),
    [brief, setBrief] = useState<TransferItemId | null>(null),
    [recall, setRecall] = useState(false),
    [history, setHistory] = useState(false),
    [reviewed, setReviewed] = useState<number | null>(null),
    [failed, setFailed] = useState(false);
  const focusScenario = useCallback((node: HTMLHeadingElement | null) => {
    if (node)
      requestAnimationFrame(() => {
        if (node.isConnected) node.focus();
      });
  }, []);
  const ids = transferIds.filter((id) => transferItems[id].module === module),
    candidate = transferCase(selected),
    chosen = candidate && ids.includes(candidate) ? candidate : ids[0]!,
    active = t.facts.active ? t.facts.current : undefined,
    id = active?.item ?? chosen,
    content = c.items[id],
    latest = t.facts.submitted.filter((a) => a.item === chosen).at(-1),
    submissions = t.facts.submitted.filter((a) => transferItems[a.item].module === module),
    review = submissions.find((a) => a.id === reviewed) ?? submissions[0],
    cannotBegin = t.save.events.length > transferLimit - 5;
  if (t.ready && !t.issue && active && active.item !== chosen)
    return (
      <article className="transfer-workspace">
        <h2>{c.title}</h2>
        <p>{c.activeElsewhere}</p>
        <h3>{c.items[active.item].title}</h3>
        <div className="transfer-actions">
          <Link href={transferHref(active.item)}>{c.resume}</Link>
          <button onClick={() => t.store.event({ kind: 'abandon' })}>{c.abandon}</button>
        </div>
      </article>
    );
  return (
    <article className="transfer-workspace">
      <header>
        <small>{c.title}</small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.entry}
        </h2>
        <p>{c.intro}</p>
        <p>{c.rules}</p>
        <p>{c.scope}</p>
      </header>
      {!t.ready || t.issue ? (
        <TransferRecovery focus={!!t.issue && !brief && !recall} />
      ) : (
        <>
          <nav className="transfer-cases" aria-label={c.choose}>
            {ids.map((item) => (
              <Link
                key={item}
                href={transferHref(item)}
                aria-current={chosen === item ? 'page' : undefined}
              >
                {c.items[item].title}
              </Link>
            ))}
          </nav>
          <button onClick={() => setRecall(true)}>{c.briefingOpen}</button>
          <ManagementTeachingBoundary identity={`transfer:scenario:${id}`} assessment="transfer">
            {(active || latest) && (
              <section className="transfer-scenario" aria-labelledby="transfer-scenario-title">
                <small>{c.families[transferItems[id].family]}</small>
                <h3
                  key={active?.id ?? latest?.id}
                  id="transfer-scenario-title"
                  tabIndex={-1}
                  ref={focusScenario}
                >
                  {content.title}
                </h3>
                <p>{content.situation}</p>
                <TransferSchematic id={id} />
                <aside aria-label={c.facts}>
                  <h4>{c.facts}</h4>
                  <ul>
                    {content.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </aside>
              </section>
            )}
            {!active && !latest && <p>{c.pending}</p>}
            {active ? (
              <>
                <SavvyShark compact>
                  <p>{c.coachActive}</p>
                </SavvyShark>
                <p role="status">
                  {c.draft} · {active.assisted ? c.aided : active.retry ? c.retry : c.unaided}
                </p>
                {t.save.events.length >= transferLimit - 5 && <p role="status">{c.capacity}</p>}
                {failed && <p role="alert">{c.blockedDraft}</p>}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFailed(!t.store.event({ kind: 'submit' }));
                  }}
                >
                  <div className="transfer-response">
                    {(['decision', 'reason'] as const).map((field) => (
                      <fieldset key={field}>
                        <legend>{c[field]}</legend>
                        {content[field === 'decision' ? 'decisions' : 'reasons'].map((label, n) => (
                          <label key={n}>
                            <input
                              type="radio"
                              name={field}
                              value={n}
                              checked={active.answer[field] === n}
                              onChange={() =>
                                setFailed(
                                  !t.store.event({
                                    kind: 'draft',
                                    answer: { ...active.answer, [field]: n },
                                  }),
                                )
                              }
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </fieldset>
                    ))}
                  </div>
                  <div className="transfer-actions">
                    <button
                      type="submit"
                      disabled={active.answer.decision === null || active.answer.reason === null}
                    >
                      {c.submit}
                    </button>
                    <button type="button" onClick={() => t.store.event({ kind: 'abandon' })}>
                      {c.abandon}
                    </button>
                    <Link href={transferItems[id].repeat}>{c.help}</Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                {cannotBegin && <p role="status">{c.capacityStart}</p>}
                <button
                  className="course-primary"
                  disabled={cannotBegin}
                  onClick={() => setBrief(chosen)}
                >
                  {c.start}
                </button>
              </>
            )}
          </ManagementTeachingBoundary>
          {!active && latest && <TransferFeedback key={latest.id} attempt={latest} focus />}
          <section className="transfer-history">
            <h3>{c.history}</h3>
            <p>{c.historyNote}</p>
            <button onClick={() => setHistory(!history)}>{c.history}</button>
            {history && (
              <ManagementTeachingBoundary identity="transfer:history">
                {review ? (
                  <>
                    <label>
                      {c.selectSubmission}
                      <select
                        aria-label={c.selectSubmission}
                        value={review.id}
                        onChange={(e) => setReviewed(Number(e.target.value))}
                      >
                        {submissions.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.id} · {c.items[a.item].title} ·{' '}
                            {a.assisted ? c.aided : a.retry ? c.retry : c.unaided}
                          </option>
                        ))}
                      </select>
                    </label>
                    <TransferFeedback key={review.id} attempt={review} historical />
                  </>
                ) : (
                  <p>{c.noHistory}</p>
                )}
              </ManagementTeachingBoundary>
            )}
          </section>
        </>
      )}
      <Link href={transferItems[id].repeat}>{c.previous}</Link>
      {(brief || recall) && (
        <PortalDialog
          title={c.briefingTitle}
          onClose={() => {
            setBrief(null);
            setRecall(false);
          }}
        >
          <div className="transfer-brief">
            <SavvyShark>
              <p>{c.briefing}</p>
            </SavvyShark>
            <p>{c.rules}</p>
            <p>{c.scope}</p>
            {cannotBegin && <p role="status">{c.capacityStart}</p>}
            {t.issue && (
              <p role="alert">
                {c.issue} ({t.issue})
              </p>
            )}
            <div className="transfer-actions">
              <button
                onClick={() => {
                  setBrief(null);
                  setRecall(false);
                }}
              >
                {c.cancel}
              </button>
              {brief && (
                <button
                  disabled={!t.ready || !!t.issue || cannotBegin}
                  onClick={() => {
                    if (t.store.event({ kind: 'begin', item: brief })) {
                      setBrief(null);
                      setFailed(false);
                    }
                  }}
                >
                  {c.start}
                </button>
              )}
              {t.issue && <button onClick={t.store.load}>{c.load}</button>}
            </div>
          </div>
        </PortalDialog>
      )}
    </article>
  );
}
function TransferFeedback({
  attempt: a,
  focus = false,
  historical = false,
}: {
  attempt: TransferAttempt;
  focus?: boolean;
  historical?: boolean;
}) {
  const focusResult = useCallback(
    (node: HTMLHeadingElement | null) => {
      if (focus && node)
        requestAnimationFrame(() => {
          if (node.isConnected) node.focus();
        });
    },
    [focus],
  );
  const content = c.items[a.item],
    result = evaluateTransfer(a);
  return (
    <ManagementTeachingBoundary identity={`transfer:feedback:${a.id}`}>
      <section
        className="transfer-feedback"
        aria-label={`${historical ? c.history : c.currentFeedback} · ${c.feedback} ${content.title}`}
      >
        <header>
          <small>
            {c.submitted} · {a.id} · {a.assisted ? c.aided : a.retry ? c.retry : c.unaided}
          </small>
          <h3 tabIndex={-1} ref={focusResult}>
            {content.title}
          </h3>
          <p className={result.relation ? 'transfer-pass' : 'transfer-fail'}>
            {result.relation ? c.passed : c.failed}
          </p>
        </header>
        <dl aria-label={c.criteria}>
          <div>
            <dt>{c.decisionResult}</dt>
            <dd>{result.decision ? c.yes : c.no}</dd>
          </div>
          <div>
            <dt>{c.relationResult}</dt>
            <dd>{result.relation ? c.yes : c.no}</dd>
          </div>
        </dl>
        <SavvyShark compact>
          <div>
            <strong>{c.decisive}</strong>
            <p>{content.decisive}</p>
          </div>
        </SavvyShark>
        <h4>{c.alternatives}</h4>
        <div className="transfer-feedback-columns">
          {(['decision', 'reason'] as const).map((field) => (
            <section key={field}>
              <h4>{c[field]}</h4>
              {content[field === 'decision' ? 'decisions' : 'reasons'].map((label, n) => (
                <div key={n} className={a.answer[field] === n ? 'transfer-selected' : ''}>
                  <h5>
                    {label}
                    {a.answer[field] === n && <small> · {c.selected}</small>}
                  </h5>
                  <p>{content[field === 'decision' ? 'decisionFeedback' : 'reasonFeedback'][n]}</p>
                  <p>
                    <strong>{c.when}: </strong>
                    {content[field === 'decision' ? 'decisionWhen' : 'reasonWhen'][n]}
                  </p>
                </div>
              ))}
            </section>
          ))}
        </div>
        <p>{c.resultNote}</p>
        <Link href={transferItems[a.item].repeat}>{c.repeat}</Link>
        <ul>
          {transferItems[a.item].sources.map((id) => {
            const source = transferSources[id as keyof typeof transferSources];
            return (
              <li key={id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>{' '}
                · {transferSourceDate}
              </li>
            );
          })}
        </ul>
      </section>
    </ManagementTeachingBoundary>
  );
}
export function TransferPreparation({ topic }: { topic: string }) {
  const own = useExpansion('benefits');
  // The existing module owns its recovery controls. Withhold this supplement
  // under its uncertainty rather than mounting a competing recovery panel.
  if (!own.ready || own.issue) return null;
  if (topic !== 'governance' && topic !== 'management') return null;
  return (
    <ManagementTeachingBoundary identity={`transfer:preparation:${topic}`}>
      <section className="transfer-preparation">
        <h3>{c.preparationTitle}</h3>
        <p>{c.preparation[topic]}</p>
      </section>
    </ManagementTeachingBoundary>
  );
}
function TransferSchematic({ id }: { id: TransferItemId }) {
  if (id === 'route-replica') {
    const d = c.diagrams.routing;
    return (
      <figure className="transfer-topology">
        <figcaption>{c.observations}</figcaption>
        <div className="transfer-routing">
          <span>{d.source}</span>
          <div>
            <p>
              {d.route} → <strong className="transfer-error">{d.a}</strong>
            </p>
            <p>
              {d.unused} · <strong>{d.b}</strong>
            </p>
          </div>
          <span>{d.data}</span>
        </div>
      </figure>
    );
  }
  if (id === 'shared-payment') {
    const d = c.diagrams.payment;
    return (
      <figure className="transfer-topology">
        <figcaption>{c.observations}</figcaption>
        <div className="transfer-dependency">
          <ul>
            {[d.a, d.b, d.c].map((x) => (
              <li key={x}>{x} →</li>
            ))}
          </ul>
          <strong className="transfer-error">{d.shared}</strong>
        </div>
        <p>{d.required}</p>
      </figure>
    );
  }
  if (id === 'manual-drift') {
    const d = c.diagrams.drift;
    return (
      <figure className="transfer-topology">
        <figcaption>{c.observations}</figcaption>
        <strong>{d.desired}</strong>
        <ol className="transfer-timeline">
          {[d.past, d.change, d.now].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </figure>
    );
  }
  if (id === 'memory-capacity') {
    const d = c.diagrams.memory;
    return (
      <figure className="transfer-topology">
        <figcaption>{c.observations}</figcaption>
        <div className="transfer-memory">
          <p>
            {d.available}
            <span style={{ width: '66.666%' }} />
          </p>
          <p>
            {d.required}
            <span style={{ width: '100%' }} />
          </p>
        </div>
        <p>{d.note}</p>
      </figure>
    );
  }
  return null;
}
