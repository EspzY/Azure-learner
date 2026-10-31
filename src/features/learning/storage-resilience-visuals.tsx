import { storageResilienceNb as c } from '@/content/nb';
import {
  runTiers,
  runReplication,
  validTiers,
  redundancies,
  targets,
  replicationSupport,
  type ResilienceInput,
} from '@/domain/curriculum/storage-resilience-model';
import type { ResilienceRun } from '@/domain/curriculum/storage-resilience';
const number = (n: number) => n.toLocaleString('nb-NO');
export function ResilienceModelResult({ input }: { input: ResilienceInput }) {
  return (
    <div className="resilience-result">
      <p className="compute-boundary">{c.model.scope}</p>
      {validTiers(input) ? <TierResult input={input} /> : <ReplicationResult input={input} />}
    </div>
  );
}
function TierResult({ input }: { input: ResilienceInput }) {
  const r = runTiers(input);
  if (!r) return null;
  return (
    <>
      <ol className="resilience-lifecycle" aria-label={c.labels.tiers}>
        <li>
          <small>{c.labels.account}</small>
          <strong>{c.options.account[r.input.account]}</strong>
          <span>{c.options.service[r.input.service]}</span>
        </li>
        <li>
          <small>{c.labels.assignment}</small>
          <strong>{r.selected.toUpperCase()}</strong>
          <span>{c.options.assignment[r.input.assignment]}</span>
        </li>
        <li data-state={r.state}>
          <small>{c.labels.phase}</small>
          <strong>
            {r.supported
              ? c.model[r.state as 'online' | 'offline' | 'pending' | 'rehydrated']
              : !r.typeSupported
                ? c.model.tierUnsupported
                : c.model.archiveConflict}
          </strong>
        </li>
      </ol>
      {r.supported && r.selected === 'archive' && (
        <section className="resilience-phase-track" aria-label={c.visual.phaseTitle}>
          <h4>{c.visual.phaseTitle}</h4>
          <ol>
            {(['stored', 'pending', 'complete'] as const).map((phase, i) => (
              <li key={phase} data-current={r.input.phase === phase}>
                <b>{i + 1}</b>
                <span>{c.options.phase[phase]}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {!r.typeSupported && <p className="storage-verdict">{c.model.tierUnsupported}</p>}
      {!r.compatible && <p className="storage-verdict">{c.model.archiveConflict}</p>}
      {r.supported && (
        <>
          {r.overwriteBlocked && <p className="storage-verdict">{c.model.overwriteBlocked}</p>}
          <dl className="resilience-facts">
            <div>
              <dt>{c.model.minimum}</dt>
              <dd>{r.minimum}</dd>
            </div>
            <div>
              <dt>{c.model.remaining}</dt>
              <dd>{r.remaining}</dd>
            </div>
          </dl>
          <p>{r.remaining ? c.model.earlySome : c.model.earlyNone}</p>
          <section aria-label={c.labels.costs}>
            <h4>{c.labels.costs}</h4>
            <p>{c.model.costAssumptions}</p>
            <figure className="resilience-cost-bars">
              <figcaption>{c.visual.costTitle}</figcaption>
              {(['capacity', 'access', 'early', 'rehydrate'] as const).map((k) => (
                <div key={k}>
                  <span>
                    {c.costLabels[k]} · {number(r.costs![k])}
                  </span>
                  <i
                    aria-hidden="true"
                    data-driver={k}
                    style={{
                      width: `${r.costs!.total ? (100 * r.costs![k]) / r.costs!.total : 0}%`,
                    }}
                  />
                </div>
              ))}
            </figure>
            <table>
              <caption>
                {c.labels.costs} · {r.input.amount} GiB · {r.input.days} {c.units.days}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{c.labels.configured}</th>
                  <th scope="col">{c.labels.result}</th>
                </tr>
              </thead>
              <tbody>
                {(['capacity', 'access', 'early', 'rehydrate', 'total'] as const).map((k) => (
                  <tr key={k}>
                    <th scope="row">{c.costLabels[k]}</th>
                    <td>{number(r.costs![k])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {r.selected === 'archive' &&
            (!r.online ? (
              <p>{c.model.lifecycleOffline}</p>
            ) : r.input.rule !== 'none' ? (
              <p className="storage-verdict">
                {r.lifecycleRisk ? c.model.lifecycleRisk : c.model.lifecycleGuard}
              </p>
            ) : null)}
        </>
      )}
    </>
  );
}
function ReplicationResult({ input }: { input: ResilienceInput }) {
  const r = runReplication(input);
  if (!r) return null;
  return (
    <>
      {!r.typeSupported && <p className="storage-verdict">{c.model.typeConflict}</p>}
      {!r.tierSupported && (
        <p className="storage-verdict">
          {r.input.target === 'blob' ? c.model.archiveConflict : c.model.tierUnsupported}
        </p>
      )}
      {r.supported && !r.qualified && <p className="storage-verdict">{c.model.regionUnknown}</p>}
      {r.qualified && (
        <>
          {r.input.tier === 'archive' && <p className="storage-verdict">{c.model.offline}</p>}
          <p>
            {c.options.failure[r.input.failure]} · {r.input.redundancy}
          </p>
          <figure className="resilience-replica-map">
            <figcaption>
              {c.labels.replicas} · {c.model.schematic}
            </figcaption>
            <strong>
              {r.input.redundancy} · {c.options.failure[r.input.failure]}
            </strong>
            <ol className="resilience-replication-flow" aria-label={c.visual.flowTitle}>
              {[
                c.visual.write,
                c.visual.sync,
                r.hasGeo ? c.visual.async : c.model.localOnly,
                `${c.visual.incident}: ${c.options.failure[r.input.failure]}`,
              ].map((text, i) => (
                <li key={i}>
                  <b>{i + 1}</b>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
            {(['primary', 'secondary'] as const)
              .filter((region) => region === 'primary' || r.hasGeo)
              .map((region) => (
                <section key={region}>
                  <h4>{c.labels[region]}</h4>
                  <p>{region === 'primary' ? c.model.synchronous : c.model.asynchronous}</p>
                  <ol>
                    {r.replicas
                      .filter((p) => p.region === region)
                      .map((p) => (
                        <li key={`${p.site}:${p.copy}`} data-state={p.state}>
                          <strong>
                            {p.site} · {c.units.copy} {p.copy}
                          </strong>
                          <span>{c.model[p.state]}</span>
                          <b>
                            {c.labels.version}: {p.version ?? '—'}
                          </b>
                        </li>
                      ))}
                  </ol>
                </section>
              ))}
          </figure>
          <div className="storage-table-scroll">
            <table>
              <caption>{c.model.schematic}</caption>
              <thead>
                <tr>
                  {[c.labels.location, c.labels.version, c.labels.copyState].map((s) => (
                    <th scope="col" key={s}>
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.replicas.map((p) => (
                  <tr key={`${p.region}:${p.copy}`}>
                    <th scope="row">
                      {c.labels[p.region]} · {p.site} · {p.copy}
                    </th>
                    <td>{p.version ?? '—'}</td>
                    <td>{c.model[p.state]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{c.model.physicalVsAccess}</p>
          {r.input.target === 'filesHdd' && r.input.redundancy.startsWith('RA-') && (
            <p className="storage-verdict">{c.model.filesRa}</p>
          )}
          <dl className="resilience-decisions">
            <div>
              <dt>{c.labels.primaryRead}</dt>
              <dd>{r.primaryRead ? c.model.readYes : c.model.readNo}</dd>
            </div>
            <div>
              <dt>{c.labels.secondaryRead}</dt>
              <dd>
                {!r.hasGeo
                  ? c.model.notConfigured
                  : r.secondaryRead
                    ? c.model.readYes
                    : c.model.readNo}
              </dd>
            </div>
            <div>
              <dt>{c.labels.secondaryWrite}</dt>
              <dd>{c.model.writeNo}</dd>
            </div>
            <div>
              <dt>{c.labels.failover}</dt>
              <dd>
                {r.input.failure === 'deletion'
                  ? c.model.restoreNeeded
                  : r.failoverRequired
                    ? c.model.failoverNeeded
                    : !r.protectedCopy
                      ? c.model.noRegionalCopy
                      : c.model.failoverNotNeeded}
              </dd>
            </div>
            <div>
              <dt>{c.labels.loss}</dt>
              <dd>
                {r.input.failure === 'deletion'
                  ? c.model.deletion
                  : !r.hasGeo
                    ? c.model.localOnly
                    : r.pendingWrite
                      ? c.model.pendingWrite
                      : c.model.caughtUp}
              </dd>
            </div>
            <div>
              <dt>{c.labels.app}</dt>
              <dd>{c.model.appUnknown}</dd>
            </div>
          </dl>
          {r.hasGeo && <p className="compute-boundary">{c.model.noZero}</p>}
        </>
      )}
      <h4>{c.labels.matrix}</h4>
      <p>{c.matrixBoundary}</p>
      <div className="storage-table-scroll">
        <table>
          <caption>{c.labels.matrix}</caption>
          <thead>
            <tr>
              <th scope="col">{c.labels.target}</th>
              {redundancies.map((k) => (
                <th scope="col" key={k}>
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {targets.map((t) => (
              <tr key={t}>
                <th scope="row">{c.options.target[t]}</th>
                {redundancies.map((k) => (
                  <td key={k}>
                    {replicationSupport(t, k)
                      ? t === 'filesHdd' && k.startsWith('RA-')
                        ? c.matrixFiles
                        : c.matrixYes
                      : c.matrixNo}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export function ResilienceComparison({ runs }: { runs: ResilienceRun[] }) {
  if (!runs.length) return null;
  return (
    <section className="resilience-comparisons">
      <h4>{c.labels.compare}</h4>
      <div className="storage-table-scroll">
        <table>
          <caption>{c.comparisonBoundary}</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{c.labels.configured}</th>
              <th scope="col">{c.labels.result}</th>
              <th scope="col">{c.labels.total}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => {
              const t = runTiers(r.input),
                p = runReplication(r.input);
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>
                    {t ? (
                      <>
                        {t.input.amount} GiB · {t.input.days} {c.units.days} ·{' '}
                        {c.options.usage[t.input.usage]} · {t.selected.toUpperCase()} ·{' '}
                        {c.options.retrieval[t.input.retrieval]}
                      </>
                    ) : p ? (
                      <>
                        {p.input.redundancy} · {c.options.failure[p.input.failure]} ·{' '}
                        {c.options.lag[p.input.lag]}
                      </>
                    ) : null}
                  </td>
                  <td>
                    {t
                      ? c.model[t.state as 'online' | 'offline' | 'pending' | 'rehydrated']
                      : p
                        ? c.model.outcome[p.outcome]
                        : null}
                  </td>
                  <td>{t?.costs ? number(t.costs.total) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
