'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toolsNb as c } from '@/content/nb';
import { types } from '@/domain/chapter01/model';
import type { ToolsGuide } from '@/domain/curriculum/management-tools';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useTools } from './management-tools-provider';
export const toolsPortalHref = '/portal?area=groups&tools=intent';
export function ToolsEvidence({
  guide,
  onInspect,
  onRestart,
}: {
  guide: ToolsGuide;
  onInspect: (ref: string, through: string | null) => boolean;
  onRestart: () => void;
}) {
  const technical = useSandbox(),
    t = useTools(),
    [groupId, setGroup] = useState(''),
    [appId, setApp] = useState(''),
    [receiptId, setReceipt] = useState(''),
    [failed, setFailed] = useState(false);
  const engine =
    technical.ready && !technical.issue && guide.attempt !== null
      ? technical.store.engineFor(guide.attempt)
      : undefined;
  const start =
    guide.boundary === null
      ? -1
      : (engine?.ledger.findIndex((e) => e.receipt.commandId === guide.boundary) ?? -1);
  const entries =
    engine && (guide.boundary === null || start >= 0)
      ? engine.ledger
          .slice(start + 1)
          .filter(
            (e) =>
              e.receipt.outcome === 'accepted' &&
              ['CreateGroup', 'CreatePlan', 'CreateWebApp'].includes(e.receipt.operation),
          )
      : [];
  const groups =
    engine?.world.groups.filter(
      (g) =>
        g.subscriptionId === 'sub-app' &&
        g.metadataLocation === 'norwayeast' &&
        entries.some(
          (e) => e.receipt.operation === 'CreateGroup' && e.receipt.addedIds.includes(g.id),
        ),
    ) ?? [];
  const group = groups.find((g) => g.id === groupId) ?? groups[0];
  const apps =
    engine?.world.resources.filter((a) => a.type === types.app && a.groupId === group?.id) ?? [];
  const app = apps.find((a) => a.id === appId) ?? apps[0];
  const plan =
    app && app.type === types.app
      ? engine?.world.resources.find((p) => p.type === types.plan && p.id === app.planId)
      : engine?.world.resources.find((p) => p.type === types.plan && p.groupId === group?.id);
  const entry = entries.find((e) => e.receipt.commandId === receiptId) ?? entries.at(-1),
    proof = t.nativeEvidence(guide);
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
      ref === 'resource:sub-app' ||
      current.world.groups.some((g) => 'resource:' + g.id === ref) ||
      current.world.resources.some(
        (r) => 'resource:' + r.id === ref || (r.type === types.app && 'dependency:' + r.id === ref),
      ) ||
      current.ledger.some((e) => 'receipt:' + e.receipt.commandId === ref);
    setFailed(!(exists && onInspect(ref, current.ledger.at(-1)?.receipt.commandId ?? null)));
  };
  const resource = (
    label: string,
    r:
      | {
          id: string;
          name: string;
          type?: string;
          location?: string;
          metadataLocation?: string;
          groupId?: string;
        }
      | undefined,
    action: string,
  ) =>
    r ? (
      <section className="tools-native-resource">
        <h5>{label}</h5>
        <dl className="tools-facts">
          <div>
            <dt>{c.visual.resource}</dt>
            <dd>
              {r.name} · <code>{r.id}</code>
            </dd>
          </div>
          <div>
            <dt>{c.technical.type}</dt>
            <dd>{r.type ?? types.group}</dd>
          </div>
          <div>
            <dt>{c.technical.location}</dt>
            <dd>{r.location ?? r.metadataLocation}</dd>
          </div>
        </dl>
        <button onClick={() => inspect('resource:' + r.id)}>{action}</button>
      </section>
    ) : null;
  return (
    <section className="tools-technical" aria-label={c.technical.title}>
      <h4>{c.technical.title}</h4>
      <p>{c.technical.boundary}</p>
      <p>
        <Link className="course-primary" href={toolsPortalHref}>
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
          <p>
            {c.technical.scope}: <code>sub-app</code>
          </p>
          <button onClick={() => inspect('resource:sub-app')}>{c.technical.inspectScope}</button>
          {group ? (
            <>
              <label className="compute-control">
                <span>{c.technical.group}</span>
                <select value={group.id} onChange={(e) => setGroup(e.target.value)}>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} · {g.id}
                    </option>
                  ))}
                </select>
              </label>
              {resource(c.technical.group, group, c.technical.inspectGroup)}
            </>
          ) : (
            <p>{c.technical.emptyGroup}</p>
          )}
          {plan ? (
            resource(c.technical.plan, plan, c.technical.inspectPlan)
          ) : (
            <p>{c.technical.emptyPlan}</p>
          )}
          {app && app.type === types.app ? (
            <>
              <label className="compute-control">
                <span>{c.technical.app}</span>
                <select value={app.id} onChange={(e) => setApp(e.target.value)}>
                  {apps.map((a) => (
                    <option value={a.id} key={a.id}>
                      {a.name} · {a.id}
                    </option>
                  ))}
                </select>
              </label>
              {resource(c.technical.app, app, c.technical.inspectApp)}
              <figure className="tools-native-relation">
                <figcaption>
                  {c.labels.intent} · {c.technical.inspectDependency}
                </figcaption>
                <p>
                  <strong>{app.name}</strong> <code>{app.id}</code> →{' '}
                  <code>planId: {app.planId}</code> → <strong>{plan?.name ?? '—'}</strong>
                </p>
                <button onClick={() => inspect('dependency:' + app.id)}>
                  {c.technical.inspectDependency}
                </button>
              </figure>
            </>
          ) : (
            <p>{c.technical.emptyApp}</p>
          )}
          {entry ? (
            <>
              <label className="compute-control">
                <span>{c.technical.receipt}</span>
                <select
                  value={entry.receipt.commandId}
                  onChange={(e) => setReceipt(e.target.value)}
                >
                  {entries.map((e) => (
                    <option key={e.receipt.commandId} value={e.receipt.commandId}>
                      {e.receipt.commandId} · {e.receipt.operation} · {e.receipt.outcome}
                    </option>
                  ))}
                </select>
              </label>
              <dl className="tools-facts">
                {Object.entries({
                  [c.technical.operation]: entry.receipt.operation,
                  [c.technical.outcome]: entry.receipt.outcome,
                  [c.technical.code]: entry.receipt.code,
                  [c.technical.type]: entry.receipt.targetType,
                  [c.technical.revision]:
                    `${entry.receipt.beforeRevision} → ${entry.receipt.afterRevision}`,
                  [c.technical.count]: `${entry.receipt.beforeCount} → ${entry.receipt.afterCount}`,
                  [c.technical.added]: entry.receipt.addedIds.join(', '),
                }).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v ?? '—'}</dd>
                  </div>
                ))}
              </dl>
              <pre tabIndex={0} aria-label={c.technical.request}>
                {JSON.stringify(entry.request, null, 2)}
              </pre>
              <button onClick={() => inspect('receipt:' + entry.receipt.commandId)}>
                {c.technical.inspectReceipt}
              </button>
            </>
          ) : (
            <p>{c.technical.emptyReceipts}</p>
          )}
          <ul>
            {Object.entries(proof.checks).map(([k, v]) => (
              <li key={k}>
                {c.technical.checks[k as keyof typeof c.technical.checks]}:{' '}
                {v ? c.model.yes : c.model.no}
              </li>
            ))}
          </ul>
          <p role="status">{proof.complete ? c.technical.verified : c.technical.notVerified}</p>
          <p>{c.technical.history}</p>
        </>
      )}
      <button onClick={onRestart}>{c.technical.newGuide}</button>
      {failed && <p role="alert">{c.storage.failed}</p>}
    </section>
  );
}
