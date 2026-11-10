'use client';
import { inspectionBridgeNb as c, nb } from '@/content/nb';
import {
  resourceOperations,
  receiptReferences,
  requestConfiguration,
  type LedgerEntry,
} from '@/domain/portal/inspection';
import type { Engine } from '@/domain/sandbox/model';
import type { Navigate } from './shared';
import { PropertyList } from './shared';
import { ServiceIcon } from './service-icon';
import '@/features/course/portal-inspection.css';
/** Original technical facts only, no guidance answers or inspection events. */
export function ResourceEvidence({
  engine,
  id,
  navigate,
}: {
  engine: Engine;
  id: string;
  navigate: Navigate;
}) {
  const entries = resourceOperations(engine, id);
  return (
    <section className="portal-inspection-evidence" data-resource-evidence={id}>
      <h2>{c.evidence}</h2>
      {entries.length ? (
        <ul>
          {entries
            .slice(-3)
            .reverse()
            .map(({ entry, basis }) => (
              <li key={entry.receipt.commandId}>
                <button
                  type="button"
                  onClick={() =>
                    navigate('activity', { id: entry.receipt.commandId, resource: id })
                  }
                >
                  {entry.receipt.commandId} ·{' '}
                  {nb.chapter.operations[
                    entry.receipt.operation as keyof typeof nb.chapter.operations
                  ] ?? entry.receipt.operation}
                </button>{' '}
                · {nb.chapter.outcomes[entry.receipt.outcome]}
                <small>{c[basis]}</small>
              </li>
            ))}
        </ul>
      ) : (
        <p>{c.noEvidence}</p>
      )}
      <button type="button" onClick={() => navigate('activity', { resource: id })}>
        <ServiceIcon kind="activity" /> {c.history}
      </button>
    </section>
  );
}
export function ReceiptReferences({
  engine,
  entry,
  navigate,
}: {
  engine: Engine;
  entry: LedgerEntry;
  navigate: Navigate;
}) {
  return (
    <section className="portal-inspection-evidence" data-receipt-evidence={entry.receipt.commandId}>
      <h2>{c.submitted}</h2>
      {requestConfiguration(entry).length ? (
        <PropertyList
          items={requestConfiguration(entry).map(([key, value]) => [c.requestFields[key], value])}
        />
      ) : (
        <p>{c.noFields}</p>
      )}
      <h3>{c.references}</h3>
      <ul>
        {receiptReferences(engine, entry).map((ref) => (
          <li key={ref.id}>
            {ref.row ? (
              <button type="button" onClick={() => navigate('resource', { id: ref.id })}>
                <ServiceIcon kind={ref.row.kind} /> {ref.row.name} · {ref.id}
              </button>
            ) : (
              <span>
                {ref.id} · {c.absent}
              </span>
            )}
            {(ref.added || ref.removed) && <small>{ref.added ? c.added : c.removed}</small>}
          </li>
        ))}
      </ul>
    </section>
  );
}
