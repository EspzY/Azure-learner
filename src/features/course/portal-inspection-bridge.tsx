'use client';
import { useState } from 'react';
import Link from 'next/link';
import { inspectionBridgeNb as c } from '@/content/nb';
import {
  inspectionChoices,
  inspectionHref,
  type InspectionContext,
} from '@/domain/portal/inspection';
import { useSandbox } from '@/features/portal/sandbox-provider';
import './portal-inspection.css';
/** Mounted only in the existing protected course teaching activities. No evidence writes. */
export function PortalInspectionBridge({ context }: { context: InspectionContext }) {
  const technical = useSandbox(),
    [id, setId] = useState('');
  const choices =
    technical.ready && !technical.issue ? inspectionChoices(technical.attempt.engine, context) : [];
  const selected = choices.find((r) => r.id === id),
    copy = c.contexts[context];
  return (
    <section className="inspection-bridge" data-inspection-context={context}>
      <h3>{copy.title}</h3>
      <p>{copy.question}</p>
      {!technical.ready || technical.issue ? (
        <div role="status">
          <p>{c.unsafe}</p>
          <button onClick={technical.store.load}>{c.reload}</button>
        </div>
      ) : (
        <>
          <p className="inspection-meta">
            {c.attempt}: {technical.attemptNumber}
          </p>
          {choices.length ? (
            <label>
              {c.select}
              <select value={selected?.id ?? ''} onChange={(e) => setId(e.target.value)}>
                <option value="">{c.placeholder}</option>
                {choices.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.id}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p role="status">{c.empty}</p>
          )}
          {id && !selected && <p role="status">{c.missing}</p>}
          {selected && (
            <p>
              <Link className="course-primary" href={inspectionHref(context, selected.id)}>
                {c.open} →
              </Link>
            </p>
          )}
        </>
      )}
      <p>{copy.reflection}</p>
      <p className="inspection-meta">
        {c.boundary} {c.operationLimit}
      </p>
    </section>
  );
}
