'use client';
import Link from 'next/link';
import { vmDebriefNb as c, missionsNb } from '@/content/nb';
import { missionPortal, type MissionSession } from '@/domain/sandbox/missions';
import { vmDebrief } from '@/domain/sandbox/vm-debrief';
import { useMissionResult } from './mission-context';

export function VmDebrief({ session, onRetry }: { session: MissionSession; onRetry?: () => void }) {
  const { result, engine, technical } = useMissionResult(session),
    diagnostic = vmDebrief(session, result);
  // Rendered only inside MissionDebrief's existing safety/ready/issue boundary, after submission.
  if (!diagnostic) return <p role="status">{c.unverified}</p>;
  const receipt = engine.ledger.find((e) => e.receipt.commandId === diagnostic.receiptId)?.receipt,
    currentAttempt = technical.attemptNumber === session.attempt;
  const display = (
    field: (typeof diagnostic.rows)[number]['field'],
    value: string | number | null,
  ) => {
    if (value === null) return c.missing;
    if (field === 'dataDiskGiB') return `${value} GiB`;
    const labels =
      field === 'image' ? c.images : field === 'profile' ? c.profiles : c.subscriptions;
    return (labels as Record<string, string>)[value] ?? String(value);
  };
  return (
    <div className="vm-debrief-diagnostics">
      <p className="vm-debrief-status" role="status">
        <strong>{diagnostic.complete ? missionsNb.complete : c.incomplete}</strong>
      </p>
      <p>{receipt ? c.technical : c.noCreation}</p>
      {diagnostic.complete ? (
        <p>{c.complete}</p>
      ) : (
        <>
          {diagnostic.mismatches.length > 0 && (
            <>
              <p>{c.configuration}</p>
              <ul className="vm-debrief-differences">
                {diagnostic.mismatches.map((r) => (
                  <li key={r.field}>
                    <strong>
                      {c.fields[r.field]}: {display(r.field, r.actual)} →{' '}
                      {display(r.field, r.expected)}.
                    </strong>{' '}
                    {c.explanations[r.field]}
                  </li>
                ))}
              </ul>
            </>
          )}
          {diagnostic.remaining.some((id) => id !== 'requirements') && (
            <>
              <p>{c.remaining}</p>
              <ul>
                {diagnostic.remaining
                  .filter((id) => id !== 'requirements')
                  .map((id) => (
                    <li key={id}>{missionsNb.criteria[id as keyof typeof missionsNb.criteria]}</li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}
      {session.mode === 'guided' &&
        (diagnostic.complete ? (
          <Link className="mission-primary" href="/learn/services?topic=assessment&version=2">
            {c.continue}
          </Link>
        ) : onRetry ? (
          <div className="vm-debrief-next">
            <button type="button" onClick={onRetry}>
              {c.retry}
            </button>
            <p>{c.retryNote}</p>
          </div>
        ) : null)}
      <table className="vm-debrief-comparison">
        <caption>{c.comparison}</caption>
        <thead>
          <tr>
            <th scope="col">{c.field}</th>
            <th scope="col">{c.expected}</th>
            <th scope="col">{c.actual}</th>
            <th scope="col">{c.status}</th>
          </tr>
        </thead>
        <tbody>
          {diagnostic.rows.map((r) => (
            <tr key={r.field} data-diagnostic-field={r.field}>
              <th scope="row">{c.fields[r.field]}</th>
              <td>{display(r.field, r.expected)}</td>
              <td>{display(r.field, r.actual)}</td>
              <td>{r.matches ? c.matches : c.differs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <details className="vm-debrief-evidence">
        <summary>{c.evidence}</summary>
        <p>{currentAttempt ? c.historical : c.archived}</p>
        <p>
          {missionsNb.attempt}: {session.attempt} · {c.through}:{' '}
          {session.through ?? missionsNb.emptyBoundary}
        </p>
        {diagnostic.resource && (
          <p>
            {diagnostic.resource.name} · {diagnostic.resource.id}{' '}
            {currentAttempt && (
              <Link
                href={`${missionPortal('infrastructure', 'resource')}&id=${diagnostic.resource.id}`}
              >
                {c.resource}
              </Link>
            )}
          </p>
        )}
        {receipt && (
          <section aria-label={c.receipt}>
            <h5>{c.receipt}</h5>
            <p>
              {receipt.commandId} · {receipt.operation} · {receipt.outcome} · {receipt.code} ·{' '}
              {receipt.beforeRevision} → {receipt.afterRevision}
            </p>
            {currentAttempt && (
              <Link href={`${missionPortal('infrastructure', 'activity')}&id=${receipt.commandId}`}>
                {c.openReceipt}
              </Link>
            )}
          </section>
        )}
      </details>
      <p className="vm-debrief-limit">{c.limitation}</p>
    </div>
  );
}
