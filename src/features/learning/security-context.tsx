'use client';
import { useState } from 'react';
import Link from 'next/link';
import { securityNb as c } from '@/content/nb';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { types } from '@/domain/chapter01/model';
import { inventory } from '@/domain/portal/model';
export const securityPortalHref = '/portal?area=resources&security=inspect';
/** Read-only configuration context; never an input to the synthetic security design/evidence model. */
export function SecurityContext({
  perspective = 'defender',
}: {
  perspective?: 'trust' | 'depth' | 'defender';
}) {
  const t = useSandbox(),
    [id, setId] = useState('');
  const resources = inventory(t.attempt.engine.world).filter(
    (r) => r.kind !== 'group' && r.kind !== 'subscription',
  );
  const resource = resources.find((r) => r.id === id) ?? resources[0];
  const last = resource
    ? t.attempt.engine.ledger.findLast(
        (e) => e.receipt.addedIds.includes(resource.id) || e.receipt.scopeId === resource.id,
      )
    : undefined;
  return (
    <section className="security-context" aria-label={c.context.title}>
      <h4>{c.context.title}</h4>
      <p>{c.context.boundary}</p>
      {!t.ready || t.issue ? (
        <p role="status">{c.context.unsafe}</p>
      ) : resource ? (
        <>
          <label className="compute-control">
            <span>{c.context.select}</span>
            <select value={resource.id} onChange={(e) => setId(e.target.value)}>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.id}
                </option>
              ))}
            </select>
          </label>
          <dl className="security-facts">
            <div>
              <dt>{c.context.resource}</dt>
              <dd>
                {resource.name} · <code>{resource.id}</code>
              </dd>
            </div>
            <div>
              <dt>{c.context.type}</dt>
              <dd>{resource.type}</dd>
            </div>
            <div>
              <dt>{c.context.scope}</dt>
              <dd>
                {resource.groupId} · {resource.subscriptionId}
              </dd>
            </div>
            {resource.type === types.app && (
              <div>
                <dt>{c.context.relation}</dt>
                <dd>
                  <code>planId: {resource.planId}</code>
                </dd>
              </div>
            )}
            <div>
              <dt>{c.context.receipt}</dt>
              <dd>
                {last
                  ? `${last.receipt.commandId} · ${last.receipt.operation} · ${last.receipt.outcome}`
                  : '—'}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p>{c.context.empty}</p>
      )}
      <Link className="course-primary" href={securityPortalHref + '&perspective=' + perspective}>
        {c.context.open} →
      </Link>
      <p>{c.context.noCredit}</p>
    </section>
  );
}
