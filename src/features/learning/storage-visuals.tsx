'use client';
import { useState } from 'react';
import { storageNb as c } from '@/content/nb';
import {
  accountSupport,
  runDesign,
  runAccounts,
  runDelivery,
  type StorageInput,
} from '@/domain/curriculum/storage-model';

export function StorageModelResult({ input }: { input: StorageInput }) {
  if (input.kind === 'design') {
    const r = runDesign(input)!;
    return (
      <div className="storage-result">
        <div
          className="storage-table-scroll"
          role="region"
          aria-label={c.labels.workload}
          tabIndex={0}
        >
          <table>
            <caption>{c.model.boundary}</caption>
            <thead>
              <tr>
                {c.model.designColumns.map((x) => (
                  <th key={x} scope="col">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.fits.map((f) => (
                <tr key={f.workload}>
                  <th scope="row">{c.model.workloads[f.workload]}</th>
                  <td>{c.model.services[f.chosen]}</td>
                  <td>{c.model.mechanisms[f.expected]}</td>
                  <td>{f.met ? c.model.met : c.model.notMet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>{c.model.designChanged[input.imageAccess]}</p>
        <dl className="storage-alternatives">
          {Object.entries(c.model.mechanisms).map(([k, v]) => (
            <div key={k}>
              <dt>{c.model.services[k as keyof typeof c.model.services]}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (input.kind === 'accounts') {
    const r = runAccounts(input)!;
    return (
      <div className="storage-result">
        <p className="storage-verdict">
          <strong>
            {!r.supported
              ? c.model.unsupported
              : r.qualified
                ? c.model.supported
                : c.model.unverified}
          </strong>
        </p>
        <p>{c.model.accountReasons[input.account]}</p>
        <p>{c.model.noAccess}</p>
        <p>{input.regionDeclared ? c.model.declared : c.model.unverified}</p>
        <div
          className="storage-table-scroll"
          role="region"
          aria-label={c.labels.accounts}
          tabIndex={0}
        >
          <table>
            <caption>{c.model.matrixCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{c.labels.account}</th>
                {c.model.matrixRequests.map((k) => (
                  <th key={k} scope="col">
                    {c.model.requestNames[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(accountSupport).map(([a, requests]) => (
                <tr key={a} data-selected={a === input.account}>
                  <th scope="row">{c.model.accountNames[a as keyof typeof accountSupport]}</th>
                  {c.model.matrixRequests.map((k) => (
                    <td key={k}>
                      {(requests as readonly string[]).includes(k) ? c.model.yes : c.model.no}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>{c.model.matrixBoundary}</p>
      </div>
    );
  }
  const r = runDelivery(input)!;
  return (
    <div className="storage-result">
      {!r.accepted ? (
        <p role="status">{c.model.queueLabels.rejected}</p>
      ) : (
        <>
          <dl className="storage-queue-counts">
            <div>
              <dt>{c.model.queueLabels.deliveries}</dt>
              <dd>{r.deliveries}</dd>
            </div>
            <div>
              <dt>{c.model.queueLabels.effects}</dt>
              <dd>{r.effects}</dd>
            </div>
          </dl>
          <ol className="storage-timeline">
            {r.steps.map((n) => (
              <li key={n}>
                <b>{n + 1}</b>
                <span>
                  {c.model.queueLabels.steps[n]}
                  {n === 5 && (
                    <strong>
                      {input.idempotent
                        ? c.model.queueLabels.deduplicated
                        : c.model.queueLabels.repeated}
                    </strong>
                  )}
                </span>
              </li>
            ))}
          </ol>
          <p>{c.model.queueLabels.assumption}</p>
        </>
      )}
    </div>
  );
}

/** Read-only navigation through different data structures; never produces learning evidence. */
export function StorageRelationships() {
  const [service, setService] = useState<'blob' | 'files' | 'queue' | 'table'>('blob');
  return (
    <section className="storage-relationships" aria-label={c.labels.relationships}>
      <h3>{c.labels.relationships}</h3>
      <p>{c.model.boundary}</p>
      <nav className="compute-actions" aria-label={c.labels.structure}>
        {(['blob', 'files', 'queue', 'table'] as const).map((k) => (
          <button key={k} aria-pressed={service === k} onClick={() => setService(k)}>
            {c.model.services[k]}
          </button>
        ))}
      </nav>
      <figure>
        <ol className="storage-relationship-chain">
          {c.model.structures[service].map((text, i) => (
            <li key={text}>
              <small>{c.model.relationshipLevels[i]}</small>
              <strong>{text}</strong>
            </li>
          ))}
        </ol>
        <figcaption>{c.model.structureText[service]}</figcaption>
      </figure>
      {service === 'table' && (
        <table>
          <caption>{c.model.entityCaption}</caption>
          <thead>
            <tr>
              <th scope="col">PartitionKey</th>
              <th scope="col">RowKey</th>
              <th scope="col">{c.model.properties}</th>
            </tr>
          </thead>
          <tbody>
            {c.model.entities.map((e) => (
              <tr key={e.PartitionKey}>
                <td>{e.PartitionKey}</td>
                <td>{e.RowKey}</td>
                <td>{e.egenskaper}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
