'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { applicationNb as c } from '@/content/nb';
import {
  applicationIds,
  applicationItems,
  applicationHref,
  isApplicationItem,
  evaluateApplication,
  type ApplicationAttempt,
  type ApplicationGroup,
} from '@/domain/curriculum/application-transfer';
import {
  applicationSources,
  applicationGroupSources,
} from '@/domain/curriculum/application-sources';
import { useMissionSafetyContexts, missionContextLabel } from '@/features/course/mission-context';
import { PortalDialog } from '@/features/portal/shared';
import { useApplication } from './application-provider';
import { ManagementTeachingBoundary } from './management-access';
import { SourceDisclosure } from './source-disclosure';
import './application-transfer.css';

export function ApplicationRecovery() {
  const t = useApplication(),
    [confirm, setConfirm] = useState(false);
  return (
    <section className="course-storage" role="status">
      <h2>{c.ui.recovery}</h2>
      <p>{t.issue ?? c.ui.loading}</p>
      <button onClick={t.store.load}>{c.ui.load}</button>
      {['corrupt', 'unsupported'].includes(t.issue ?? '') && (
        <>
          <button onClick={() => setConfirm(!confirm)}>{c.ui.reset}</button>
          {confirm && (
            <button
              onClick={() => {
                t.store.recoverInvalid();
                setConfirm(false);
              }}
            >
              {c.ui.confirm}
            </button>
          )}
        </>
      )}
    </section>
  );
}
export function ApplicationEntry({ group }: { group: ApplicationGroup }) {
  return (
    <section className="application-entry" aria-label={c.ui.title}>
      <h2>{c.ui.title}</h2>
      <p>{c.ui.optional}</p>
      <p>{c.ui.preps[group]}</p>
      <ul>
        {applicationIds
          .filter((id) => applicationItems[id].group === group)
          .map((id) => (
            <li key={id}>
              <Link href={applicationHref(id)}>{c.items[id].title}</Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
function Exposure({ attempt: a }: { attempt: ApplicationAttempt }) {
  return (
    <section className="application-exposure" aria-label={c.ui.exposure}>
      <h4>{c.ui.exposure}</h4>
      <p>{a.retry ? c.ui.sameFamily : c.ui.newBank}</p>
      {a.exposure.related.length > 0 ? (
        <p>
          {c.ui.related} {a.exposure.related.map((x) => c.ui.banks[x]).join(' · ')}
        </p>
      ) : (
        !a.exposure.uncertain.length && <p>{c.ui.absent}</p>
      )}
      {a.exposure.uncertain.length > 0 && (
        <p>
          {c.ui.unknown} {a.exposure.uncertain.map((x) => c.ui.banks[x]).join(' · ')}
        </p>
      )}
      <p>{c.ui.exposureLimit}</p>
    </section>
  );
}
export function ApplicationAssessment({
  selected,
  module,
}: {
  selected: string | null;
  module: string;
}) {
  const t = useApplication(),
    router = useRouter();
  const contexts = useMissionSafetyContexts().filter((x) => x.id !== 'application' && x.active);
  const [brief, setBrief] = useState(false),
    [failed, setFailed] = useState(false);
  const focus = useCallback((node: HTMLHeadingElement | null) => {
    if (node)
      requestAnimationFrame(() => {
        if (node.isConnected) node.focus();
      });
  }, []);
  if (!t.ready) return <p>{c.ui.loading}</p>;
  if (!isApplicationItem(selected) || applicationItems[selected].group !== module)
    return (
      <section role="status">
        <p>{c.ui.invalid}</p>
        <Link href={`/learn/${module}?topic=assessment`}>{c.ui.return}</Link>
      </section>
    );
  const item = selected,
    copy = c.items[item],
    current = t.facts.active ? t.facts.current : null;
  const latest = t.facts.submitted.findLast((a) => a.item === item);
  const event = (e: unknown) => {
    const ok = t.store.event(e);
    setFailed(!ok);
    return ok;
  };
  return (
    <section
      className="compute-assessment application-assessment"
      aria-label={c.ui.title}
      data-application-item={item}
    >
      <h2>
        {c.ui.title} · {c.ui.groups[applicationItems[item].group]}
      </h2>
      <p>{c.ui.intro}</p>
      <p>{c.ui.preps[applicationItems[item].group]}</p>
      {t.issue && <ApplicationRecovery />}
      {!current && <p>{c.ui.rules}</p>}
      {current && current.item !== item ? (
        <p role="status">
          <Link href={applicationHref(current.item)}>
            {c.ui.resume} · {c.items[current.item].title}
          </Link>
        </p>
      ) : current ? (
        <>
          <p role="status">
            {current.assisted ? c.ui.assisted : current.retry ? c.ui.retried : c.ui.draft}
          </p>
          <h3 key={current.id} ref={focus} tabIndex={-1}>
            {copy.title}
          </h3>
          <p className="compute-problem">{copy.problem}</p>
          <ul className="compute-premises">
            {copy.premises.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <Exposure attempt={current} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              event({ kind: 'submit' });
            }}
          >
            <div className="compute-answer-grid">
              {(['decision', 'reason'] as const).map((field) => (
                <fieldset key={field}>
                  <legend>{c.ui[field]}</legend>
                  {(field === 'decision' ? copy.decisions : copy.reasons).map((option) => (
                    <label key={option.id}>
                      <input
                        type="radio"
                        name={`application-${field}`}
                        value={option.id}
                        disabled={!!t.issue}
                        checked={current.answer[field] === option.id}
                        onChange={() =>
                          event({
                            kind: 'draft',
                            answer: { ...current.answer, [field]: option.id },
                          })
                        }
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            <div className="compute-actions">
              <button
                className="compute-primary"
                disabled={
                  !!t.issue || current.answer.decision === null || current.answer.reason === null
                }
              >
                {c.ui.submit}
              </button>
              <button type="button" disabled={!!t.issue} onClick={() => event({ kind: 'abandon' })}>
                {c.ui.abandon}
              </button>
              <Link href={applicationItems[item].repeat}>{c.ui.help}</Link>
            </div>
          </form>
        </>
      ) : (
        <>
          {contexts.length ? (
            <section role="status">
              <p>{c.ui.active}</p>
              {contexts.map((x) => (
                <p key={x.id}>
                  <Link href={x.href}>{missionContextLabel(x.id)}</Link>
                </p>
              ))}
            </section>
          ) : (
            <button
              className="compute-primary"
              disabled={!!t.issue || t.facts.full}
              onClick={() => setBrief(true)}
            >
              {latest ? c.ui.retry : c.ui.start}
            </button>
          )}
          {latest && (
            <ManagementTeachingBoundary identity={`application-result:${latest.id}`}>
              <ApplicationFeedback attempt={latest} />
            </ManagementTeachingBoundary>
          )}
        </>
      )}
      {failed && <p role="alert">{c.ui.failed}</p>}
      {t.facts.full && <p>{c.ui.capacity}</p>}
      {!current && <ApplicationHistory group={applicationItems[item].group} />}
      <Link href={`/learn/${module}?topic=assessment`}>{c.ui.return}</Link>
      {brief && !current && (
        <PortalDialog title={c.ui.title} onClose={() => setBrief(false)}>
          <div className="compute-brief">
            <p>{copy.title}</p>
            <p>{c.ui.rules}</p>
            <p>{c.ui.preps[applicationItems[item].group]}</p>
            {failed && <p role="alert">{c.ui.failed}</p>}
            <div className="compute-actions">
              <button onClick={() => setBrief(false)}>{c.ui.cancel}</button>
              <button
                className="compute-primary"
                disabled={!!t.issue || t.facts.full || contexts.length > 0}
                onClick={() => {
                  const ok = t.store.begin(item);
                  setFailed(!ok);
                  if (ok) {
                    setBrief(false);
                    router.replace(applicationHref(item));
                  }
                }}
              >
                {c.ui.start}
              </button>
            </div>
          </div>
        </PortalDialog>
      )}
    </section>
  );
}
function ApplicationFeedback({ attempt: a }: { attempt: ApplicationAttempt }) {
  const copy = c.items[a.item],
    result = evaluateApplication(a);
  const text = (field: 'decision' | 'reason') =>
    (field === 'decision' ? copy.decisions : copy.reasons).find((o) => o.id === a.answer[field])
      ?.text;
  return (
    <section className="compute-feedback" aria-label={c.ui.feedback} data-application-result={a.id}>
      <h3>
        {c.ui.feedback} · {copy.title} · #{a.id}
      </h3>
      <p>{a.assisted ? c.ui.assisted : a.retry ? c.ui.retried : c.ui.unaided}</p>
      <strong>{result.relation ? c.ui.pass : c.ui.fail}</strong>
      <p>
        {c.ui.decisive}: {copy.decisive}
      </p>
      <Exposure attempt={a} />
      <dl>
        {(['decision', 'reason'] as const).map((field) => (
          <div key={field}>
            <dt>
              {c.ui.chosen} · {c.ui[field]}
            </dt>
            <dd>
              {text(field)}
              <p>{(copy.feedback[field] as Record<string, string>)[a.answer[field] ?? '']}</p>
            </dd>
          </div>
        ))}
      </dl>
      <details>
        <summary>{c.ui.alternatives}</summary>
        {(['decision', 'reason'] as const).map((field) => (
          <section key={field}>
            <h4>{c.ui[field]}</h4>
            <ul>
              {(field === 'decision' ? copy.decisions : copy.reasons).map((o) => (
                <li key={o.id}>
                  <strong>{o.text}</strong>
                  <p>{(copy.feedback[field] as Record<string, string>)[o.id]}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </details>
      <h4>{c.ui.counter}</h4>
      <p>{copy.change}</p>
      <Link href={applicationItems[a.item].repeat}>{c.ui.repeat}</Link>
      <SourceDisclosure
        entries={applicationGroupSources[applicationItems[a.item].group].map(
          (id) => applicationSources[id],
        )}
      />
    </section>
  );
}
export function ApplicationHistory({ group }: { group?: ApplicationGroup }) {
  const t = useApplication(),
    [opened, setOpened] = useState(false),
    [selected, setSelected] = useState<number | null>(null);
  const rows = t.facts.submitted.filter((a) => !group || applicationItems[a.item].group === group);
  const attempt = rows.find((a) => a.id === selected) ?? rows[0];
  if (!rows.length) return null;
  return (
    <section className="application-history">
      <button aria-expanded={opened} onClick={() => setOpened(!opened)}>
        {c.ui.history} ({rows.length})
      </button>
      {opened && (
        <ManagementTeachingBoundary identity={`application-history:${attempt?.id}`}>
          {t.issue ? (
            <ApplicationRecovery />
          ) : (
            attempt && (
              <>
                <label className="compute-control">
                  <span>{c.ui.history}</span>
                  <select value={attempt.id} onChange={(e) => setSelected(Number(e.target.value))}>
                    {rows.map((a) => (
                      <option key={a.id} value={a.id}>
                        #{a.id} · {c.items[a.item].title} ·{' '}
                        {t.facts.firsts.some((f) => f.id === a.id) ? c.ui.first : c.ui.retried} ·{' '}
                        {a.assisted ? c.ui.assisted : c.ui.unaided}
                      </option>
                    ))}
                  </select>
                </label>
                <ApplicationFeedback attempt={attempt} />
              </>
            )
          )}
        </ManagementTeachingBoundary>
      )}
    </section>
  );
}
