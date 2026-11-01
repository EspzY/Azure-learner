'use client';
import { useState } from 'react';
import Link from 'next/link';
import { governanceNb as c } from '@/content/nb';
import type { GovernanceGuide } from '@/domain/curriculum/governance';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useGovernance } from './governance-provider';
export const governancePortalHref = '/portal?area=policy&governance=policy';
export function GovernanceEvidence({
  guide,
  onInspect,
  onRestart,
}: {
  guide: GovernanceGuide;
  onInspect: (ref: string, through: string | null) => boolean;
  onRestart: () => void;
}) {
  const technical = useSandbox(),
    t = useGovernance(),
    [groupId, setGroup] = useState(''),
    [receiptId, setReceipt] = useState(''),
    [failed, setFailed] = useState(false);
  const engine =
    technical.ready && !technical.issue && guide.attempt !== null
      ? technical.store.engineFor(guide.attempt)
      : undefined;
  const policy = engine?.world.policies.find((p) => p.id === 'policy-web-location'),
    groups = engine?.world.groups.filter((g) => g.subscriptionId === 'sub-app') ?? [],
    group = groups.find((g) => g.id === groupId) ?? groups[0];
  const boundary =
    guide.boundary === null
      ? -1
      : (engine?.ledger.findIndex((x) => x.receipt.commandId === guide.boundary) ?? -1);
  const entries =
    engine && (guide.boundary === null || boundary >= 0)
      ? engine.ledger.slice(boundary + 1).filter((x) => x.receipt.operation === 'CreatePlan')
      : [];
  const entry = entries.find((x) => x.receipt.commandId === receiptId) ?? entries.at(-1),
    proof = t.policyEvidence(guide);
  const inspect = (ref: string) => {
    technical.store.changed();
    const live = technical.store.getSnapshot();
    if (!live.ready || live.issue || guide.attempt === null) {
      setFailed(true);
      return;
    }
    const current = technical.store.engineFor(guide.attempt);
    if (!current) {
      setFailed(true);
      return;
    }
    const exists =
      ref === 'policy:policy-web-location' ||
      ref === 'resource:sub-app' ||
      current.world.groups.some((g) => `resource:${g.id}` === ref) ||
      current.ledger.some((x) => `receipt:${x.receipt.commandId}` === ref);
    const ok = exists && onInspect(ref, current.ledger.at(-1)?.receipt.commandId ?? null);
    setFailed(!ok);
  };
  return (
    <section className="governance-technical" aria-label={c.technical.title}>
      <h4>{c.technical.title}</h4>
      <p>{c.technical.boundary}</p>
      <p>
        <Link className="course-primary" href={governancePortalHref}>
          {c.technical.open} →
        </Link>
      </p>
      <p>
        {c.technical.startBoundary}: {guide.attempt} · {guide.boundary ?? '—'}
      </p>
      {!engine ? (
        <p role="status">{c.technical.unsafe}</p>
      ) : (
        <>
          {guide.attempt !== technical.attemptNumber && (
            <p className="compute-boundary">{c.technical.archive}</p>
          )}
          {policy && (
            <>
              <dl className="governance-facts">
                <div>
                  <dt>{c.technical.assignment}</dt>
                  <dd>{policy.id}</dd>
                </div>
                <div>
                  <dt>{c.technical.scope}</dt>
                  <dd>{policy.scopeId}</dd>
                </div>
                <div>
                  <dt>{c.technical.types}</dt>
                  <dd>{policy.targetTypes.join(', ')}</dd>
                </div>
                <div>
                  <dt>{c.technical.allowed}</dt>
                  <dd>{policy.allowedLocations.join(', ')}</dd>
                </div>
                <div>
                  <dt>{c.technical.mode}</dt>
                  <dd>{policy.mode}</dd>
                </div>
              </dl>
              <div className="compute-actions">
                <button onClick={() => inspect(`policy:${policy.id}`)}>
                  {c.technical.inspectPolicy}
                </button>
                <button onClick={() => inspect('resource:sub-app')}>
                  {c.technical.inspectScope}
                </button>
              </div>
            </>
          )}
          {group ? (
            <>
              <label className="compute-control">
                <span>{c.technical.group}</span>
                <select value={group.id} onChange={(e) => setGroup(e.target.value)}>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} · {g.subscriptionId} · {g.metadataLocation}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={() => inspect(`resource:${group.id}`)}>
                {c.technical.inspectGroup}
              </button>
            </>
          ) : (
            <p>{c.technical.emptyGroup}</p>
          )}
          {entry ? (
            <>
              <label className="compute-control">
                <span>{c.technical.receipt}</span>
                <select
                  value={entry.receipt.commandId}
                  onChange={(e) => setReceipt(e.target.value)}
                >
                  {entries.map((x) => (
                    <option key={x.receipt.commandId} value={x.receipt.commandId}>
                      {x.receipt.commandId} · {x.receipt.outcome} · {x.receipt.code}
                    </option>
                  ))}
                </select>
              </label>
              <dl className="governance-facts">
                <div>
                  <dt>{c.technical.outcome}</dt>
                  <dd>
                    {entry.receipt.outcome} · {entry.receipt.code}
                  </dd>
                </div>
                <div>
                  <dt>{c.technical.operation}</dt>
                  <dd>{entry.receipt.operation}</dd>
                </div>
                <div>
                  <dt>{c.technical.type}</dt>
                  <dd>{entry.receipt.targetType}</dd>
                </div>
                <div>
                  <dt>{c.technical.location}</dt>
                  <dd>{entry.receipt.location}</dd>
                </div>
                <div>
                  <dt>{c.technical.revision}</dt>
                  <dd>
                    {entry.receipt.beforeRevision} → {entry.receipt.afterRevision}
                  </dd>
                </div>
                <div>
                  <dt>{c.technical.count}</dt>
                  <dd>
                    {entry.receipt.beforeCount} → {entry.receipt.afterCount}
                  </dd>
                </div>
                <div>
                  <dt>{c.technical.added}</dt>
                  <dd>{entry.receipt.addedIds.join(', ') || '—'}</dd>
                </div>
              </dl>
              <pre tabIndex={0} aria-label={c.technical.request}>
                {JSON.stringify(entry.request.command, null, 2)}
              </pre>
              <button onClick={() => inspect(`receipt:${entry.receipt.commandId}`)}>
                {c.technical.inspectReceipt}
              </button>
            </>
          ) : (
            <p>{c.technical.emptyReceipts}</p>
          )}
          <p>{proof.complete ? c.technical.verified : c.technical.notVerified}</p>
          <ul>
            {Object.entries(proof.checks).map(([k, v]) => (
              <li key={k}>
                {c.technical.checks[k as keyof typeof c.technical.checks]}:{' '}
                {v ? c.visual.yes : c.visual.no}
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="compute-boundary">{c.technical.history}</p>
      <button onClick={onRestart}>{c.technical.newGuide}</button>
      {failed && <p role="alert">{c.storage.failed}</p>}
    </section>
  );
}
