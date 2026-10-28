'use client';
import { useId, useState } from 'react';
import { computeNb as c } from '@/content/nb';
import {
  runContainer,
  runCapacity,
  runDesktop,
  runHosting,
  hostingServices,
  hostingMismatch,
  type ComputeInput,
} from '@/domain/curriculum/compute-model';
export function ComputeComparison() {
  return (
    <figure className="compute-comparison">
      <figcaption>{c.topics.fundamentals}</figcaption>
      <div>
        {c.diagram.layers.map((layers, n) => (
          <ol key={layers[0]} className={`compute-stack stack-${n}`} aria-label={layers[0]}>
            {layers.map((x, i) => (
              <li key={x}>
                <b>{i === 0 ? '' : `0${i}`}</b>
                {x}
              </li>
            ))}
          </ol>
        ))}
      </div>
      <p>{c.sections.fundamentals.limit}</p>
    </figure>
  );
}

/** Teaching relationships only, before any prediction. No precomputed experiment result. */
export function ComputeConceptFigure({ topic }: { topic: string }) {
  const marker = useId().replaceAll(':', ''),
    d = c.diagram;
  const type = [
    'containers',
    'functions',
    'fundamentals',
    'introduction',
    'hosting',
    'context',
  ].includes(topic)
    ? 'container'
    : ['options', 'resilience'].includes(topic)
      ? 'capacity'
      : topic === 'desktop'
        ? 'desktop'
        : 'dependencies';
  const line = (x1: number, y1: number, x2: number, y2: number) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#477c9f"
      strokeWidth="2"
      markerEnd={`url(#${marker})`}
    />
  );
  return (
    <figure className={`compute-concept-figure concept-${type}`}>
      <figcaption>{d.title}</figcaption>
      <svg viewBox={type === 'dependencies' ? '0 0 440 340' : '0 0 420 340'} aria-hidden="true">
        <defs>
          <marker
            id={marker}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10z" fill="#477c9f" />
          </marker>
        </defs>
        {type === 'container' ? (
          <>
            <path
              d="M155 20 L210 8 L265 20 L265 70 L210 84 L155 70Z"
              fill="#c9e2f3"
              stroke="#3e7197"
              strokeWidth="2"
            />
            <path d="M155 20 L210 35 L265 20 M210 35V84" fill="none" stroke="#3e7197" />
            <text x="210" y="105" textAnchor="middle">
              {d.container[0]}
            </text>
            {line(210, 115, 210, 142)}
            <circle cx="210" cy="165" r="22" fill="#e6f0f7" stroke="#477c9f" />
            <text x="210" y="170" textAnchor="middle">
              {d.container[1]}
            </text>
            {line(195, 183, 118, 212)}
            {line(225, 183, 302, 212)}
            {[58, 248].map((x, n) => (
              <g key={x}>
                <rect
                  x={x}
                  y="218"
                  width="112"
                  height="65"
                  rx="5"
                  fill="#d9ecf3"
                  stroke="#477c9f"
                  strokeDasharray="5 3"
                />
                <rect x={x + 14} y="233" width="84" height="17" fill="#619bb7" />
                <text x={x + 56} y="272" textAnchor="middle">
                  {d.container[n + 2]}
                </text>
              </g>
            ))}
            <rect x="32" y="297" width="356" height="34" fill="#1e4f71" />
            <text x="210" y="319" textAnchor="middle" fill="#fff">
              {d.container[5]}
            </text>
          </>
        ) : type === 'capacity' ? (
          <>
            <rect
              x="10"
              y="20"
              width="400"
              height="310"
              rx="5"
              fill="#f4f8fb"
              stroke="#699ab9"
              strokeWidth="2"
            />
            <text x="210" y="47" textAnchor="middle">
              {d.capacity[0]}
            </text>
            {[30, 160, 290].map((x, n) => (
              <g key={x}>
                <rect
                  x={x}
                  y="68"
                  width="105"
                  height="235"
                  fill={['#e0edf5', '#d9e8f0', '#e9f0f5'][n]}
                  stroke="#7d9fb7"
                />
                <text x={x + 52} y="92" textAnchor="middle">
                  {d.capacity[n + 1]}
                </text>
                {[120, 220].map((y, row) => (
                  <g key={y}>
                    <rect
                      x={x + 25}
                      y={y}
                      width="55"
                      height="54"
                      rx="3"
                      fill="#fff"
                      stroke="#41799e"
                    />
                    <path
                      d={`M${x + 34} ${y + 13}h36 M${x + 34} ${y + 24}h36`}
                      stroke="#41799e"
                      strokeWidth="4"
                    />
                    <text x={x + 52} y={y + 46} textAnchor="middle">
                      {d.capacity[6]}
                      {n + row * 3 + 1}
                    </text>
                  </g>
                ))}
              </g>
            ))}
            <path d="M20 194H400" stroke="#316e97" strokeDasharray="7 4" />
            <text x="18" y="115">
              {d.capacity[4]}
            </text>
            <text x="18" y="215">
              {d.capacity[5]}
            </text>
          </>
        ) : type === 'desktop' ? (
          <>
            {d.desktop.map((s, n) => (
              <g key={s}>
                <rect
                  x={n % 2 === 0 ? 45 : 135}
                  y={18 + n * 62}
                  width="245"
                  height="41"
                  rx={n === 3 ? 0 : 6}
                  fill={n === 3 ? '#d7eaf0' : '#e4eef7'}
                  stroke="#477c9f"
                />
                <text x={n % 2 === 0 ? 167 : 257} y={45 + n * 62} textAnchor="middle">
                  {s}
                </text>
                {n < 4 &&
                  line(n % 2 === 0 ? 210 : 230, 59 + n * 62, n % 2 === 0 ? 230 : 210, 76 + n * 62)}
              </g>
            ))}
          </>
        ) : (
          <>
            {d.dependencies.map((s, n) => {
              const x = n === 0 ? 100 : n < 3 ? (n === 1 ? 10 : 230) : n === 3 ? 100 : 100;
              const y = n === 0 ? 10 : n < 3 ? 95 : n === 3 ? 175 : n === 4 ? 235 : 295;
              return (
                <g key={s}>
                  <rect
                    x={x}
                    y={y}
                    width="200"
                    height="36"
                    rx={n === 1 || n === 2 ? 12 : 3}
                    fill={n === 0 ? '#d4e7f5' : '#edf4f8'}
                    stroke="#477c9f"
                  />
                  <text x={x + 100} y={y + 24} textAnchor="middle">
                    {s}
                  </text>
                </g>
              );
            })}
            {line(175, 46, 105, 95)}
            {line(225, 46, 330, 95)}
            {line(200, 46, 200, 175)}
            {line(200, 211, 200, 235)}
            {line(200, 271, 200, 295)}
          </>
        )}
      </svg>
      <p>
        {type === 'container'
          ? d.containerText
          : type === 'capacity'
            ? d.capacityText
            : type === 'desktop'
              ? d.desktopText
              : d.dependenciesText}
      </p>
      <small>{d.original}</small>
    </figure>
  );
}
export function ComputeModelResult({ input }: { input: ComputeInput }) {
  if (input.kind === 'container') return <ContainerDiagram input={input} />;
  if (input.kind === 'capacity') return <CapacityDiagram input={input} />;
  if (input.kind === 'desktop') return <DesktopDiagram input={input} />;
  const r = runHosting(input)!;
  return (
    <section className="compute-hosting-result">
      <h4>{c.models.hosting.title}</h4>
      <p className="compute-outcome">
        {r.outcome === 2
          ? c.models.hosting.valid
          : r.outcome === 1
            ? c.models.hosting.wrongReason
            : c.models.hosting.wrongService}
      </p>
      <dl>
        <dt>{c.models.hosting.service}</dt>
        <dd>{c.models.hosting.services[hostingServices.indexOf(input.service)]}</dd>
        <dt>{c.models.hosting.reason}</dt>
        <dd>
          {
            c.models.hosting.reasons[
              ['guest', 'web', 'event', 'instance', 'managed-container', 'kubernetes'].indexOf(
                input.reason,
              )
            ]
          }
        </dd>
      </dl>
      <h5>{c.models.hosting.alternatives}</h5>
      <ul>
        {r.candidates.map((s) => (
          <li key={s}>{c.models.hosting.services[hostingServices.indexOf(s)]}</li>
        ))}
      </ul>
      <p>{c.models.hosting.retained}</p>
      <div
        className="compute-table compute-hosting-matrix"
        role="region"
        aria-label={c.models.hosting.comparison}
        tabIndex={0}
      >
        <table>
          <caption>{c.models.hosting.comparison}</caption>
          <thead>
            <tr>
              {c.models.hosting.columns.map((s) => (
                <th key={s}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hostingServices.map((service, n) => {
              const gaps = hostingMismatch(input.workload, service);
              return (
                <tr
                  key={service}
                  data-selected={input.service === service}
                  data-fit={gaps.length === 0}
                >
                  <th scope="row">{c.models.hosting.services[n]}</th>
                  <td>
                    {gaps.length ? (
                      <ul>
                        {gaps.map((gap) => (
                          <li key={gap}>{c.models.hosting.mismatch[gap]}</li>
                        ))}
                      </ul>
                    ) : (
                      c.models.hosting.included
                    )}
                  </td>
                  <td>{gaps.length ? c.models.hosting.excluded : c.models.hosting.included}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>{c.models.hosting.qualified}</p>
      <p>{c.models.hosting.counter}</p>
    </section>
  );
}
function ContainerDiagram({ input }: { input: Extract<ComputeInput, { kind: 'container' }> }) {
  const r = runContainer(input)!,
    t = c.models.container;
  return (
    <figure className="compute-container-figure">
      <figcaption>{t.title}</figcaption>
      <ol className="compute-execution-flow">
        {t.pipeline.map((label, n) => (
          <li
            key={label}
            data-state={
              n === 0
                ? input.platform === 'functions' || input.image
                  ? 'ready'
                  : 'missing'
                : n === 1
                  ? input.runtime
                    ? 'ready'
                    : 'missing'
                  : n === 4
                    ? r.retained
                      ? 'ready'
                      : 'missing'
                    : r.created
                      ? 'ready'
                      : 'missing'
            }
          >
            <span className={`compute-mechanism mechanism-${n}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <b>0{n + 1}</b>
            <strong>{label}</strong>
            <small>
              {n === 2
                ? (r.instance ?? '—')
                : n === 4
                  ? r.retained
                    ? t.yes
                    : t.no
                  : n === 3
                    ? r.created
                      ? t.yes
                      : t.no
                    : n === 1
                      ? input.runtime
                        ? t.yes
                        : t.no
                      : input.platform === 'functions'
                        ? t.functionCode
                        : input.image
                          ? t.yes
                          : t.no}
            </small>
          </li>
        ))}
      </ol>
      <p className="compute-outcome">{!r.created ? t.noProcess : r.retained ? t.kept : t.lost}</p>
      {input.platform === 'container' && (
        <div className="compute-container-anatomy">
          <section className="compute-image-cutaway">
            <h5>{t.imageAnatomy}</h5>
            <ol>
              {t.imageLayers.map((layer, n) => (
                <li key={layer}>
                  <span aria-hidden="true">0{n + 1}</span>
                  {layer}
                </li>
              ))}
            </ol>
            <p>{t.imageBoundary}</p>
          </section>
          <section className="compute-data-lifecycle">
            <h5>{t.lifecycle}</h5>
            <div className="compute-old-instance">
              <strong>{input.storage === 'external' ? t.reportProducer : t.localLayer}</strong>
              <span>{input.storage === 'external' ? t.reportWritten : t.reportFile}</span>
            </div>
            {input.storage === 'external' && (
              <span className="compute-data-arrow" aria-hidden="true">
                ↓
              </span>
            )}
            {input.storage === 'external' && (
              <div className="compute-external-volume">
                <strong>{t.externalData}</strong>
                <span>{t.reportFile}</span>
              </div>
            )}
            <span className="compute-data-arrow" aria-hidden="true">
              ↓
            </span>
            <div className="compute-new-instance" data-retained={r.retained}>
              <strong>
                {!r.created
                  ? t.noProcess
                  : input.action === 'recreate'
                    ? t.replacement
                    : t.currentInstance}
              </strong>
              <span>
                {r.retained
                  ? !r.created
                    ? t.storedWithoutExecution
                    : input.action === 'inspect'
                      ? t.currentData
                      : t.retainedData
                  : t.lostData}
              </span>
            </div>
          </section>
        </div>
      )}
      <div className="compute-kernel-boundary">
        <strong>
          {input.platform === 'functions' ? t.providerKernel : r.ownKernel ? t.kernel : t.shared}
        </strong>
        <p>
          {t.responsibility}:{' '}
          {r.hostResponsibility === 'customer' ? t.customerHost : t.providerHost}
        </p>
        <p>{t.hostBoundary}</p>
      </div>
      <dl className="compute-properties">
        <div>
          <dt>{t.instance}</dt>
          <dd>{r.instance ?? '—'}</dd>
        </div>
        <div>
          <dt>{t.data}</dt>
          <dd>{r.retained ? t.yes : t.no}</dd>
        </div>
        <div>
          <dt>{t.storage}</dt>
          <dd>{input.storage === 'external' ? t.storages[1] : t.storages[0]}</dd>
        </div>
      </dl>
      <p>{t.note}</p>
    </figure>
  );
}
function CapacityDiagram({ input }: { input: Extract<ComputeInput, { kind: 'capacity' }> }) {
  const r = runCapacity(input)!,
    t = c.models.capacity;
  return (
    <figure className="compute-capacity-figure">
      <figcaption>{t.title}</figcaption>
      <div className="compute-demand-track">
        <span>
          {t.demand}: <b>{input.demand}</b>
        </span>
        <div>
          <i style={{ width: `${(input.demand / 60) * 100}%` }} />
        </div>
        <span>
          {t.metrics[2]}: <b>{r.capacity}</b>
        </span>
      </div>
      <div className="compute-zone-floor">
        {Array.from({ length: input.mode === 'zones' ? 3 : 1 }, (_, zone) => (
          <section
            key={zone}
            data-failed={
              input.failure === 'region' || (input.failure === 'zone' && input.target === zone)
            }
          >
            <h5>{input.mode === 'zones' ? `${t.zonalLabel} ${zone + 1}` : t.fixtureSite}</h5>
            <div>
              {r.instances
                .filter((x) => x.site === zone)
                .map((x) => (
                  <span className="compute-vm-tower" key={x.id} data-failed={x.affected}>
                    <b>VM {x.id}</b>
                    <i />
                    <i />
                    <small>
                      FD{x.fault}
                      {x.update === null ? '' : ` · UD${x.update}`}
                    </small>
                    <em>{x.affected ? t.affected : t.survived}</em>
                  </span>
                ))}
            </div>
          </section>
        ))}
      </div>
      <dl className="compute-metrics">
        {[r.count, r.surviving, r.capacity, r.unmet].map((v, n) => (
          <div key={n}>
            <dt>{t.metrics[n]}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="compute-table" role="region" aria-label={t.title} tabIndex={0}>
        <table>
          <caption>{c.labels.all}</caption>
          <thead>
            <tr>
              {t.columns.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.instances.map((x) => (
              <tr key={x.id}>
                <th>VM{x.id}</th>
                <td>{x.zone === null ? t.unknownZone : x.zone + 1}</td>
                <td>{x.fault}</td>
                <td>{x.update ?? t.none}</td>
                <td>{x.affected ? c.models.container.yes : c.models.container.no}</td>
                <td>{x.routed ? c.models.container.yes : c.models.container.no}</td>
                <td>{x.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{t.note}</p>
    </figure>
  );
}
function DesktopDiagram({ input }: { input: Extract<ComputeInput, { kind: 'desktop' }> }) {
  const r = runDesktop(input)!,
    t = c.models.desktop,
    [selected, setSelected] = useState(0);
  return (
    <figure className="compute-desktop-figure">
      <figcaption>{t.title}</figcaption>
      <ol className="compute-desktop-chain">
        {t.nodes.map((node, n) => (
          <li key={node}>
            <button aria-pressed={selected === n} onClick={() => setSelected(n)}>
              <span aria-hidden="true" className={`compute-avd-object avd-object-${n}`} />
              <small>0{n + 1}</small>
              <strong>{node}</strong>
              <span className="compute-avd-relation">{t.relations[n]}</span>
              <small>
                {n === 0
                  ? t.statuses[input.assigned ? 0 : 1]
                  : n === 1
                    ? t.statuses[input.linked ? 2 : 3]
                    : n === 3
                      ? t.pools[input.pool === 'personal' ? 0 : 1]
                      : n === 5
                        ? t.publications[input.publication === 'desktop' ? 0 : 1]
                        : ''}
              </small>
              {n === 4 ? <b>{input.hosts}</b> : null}
            </button>
          </li>
        ))}
      </ol>
      <section aria-label={t.inspect}>
        <h5>{t.nodes[selected]}</h5>
        <p>{t.details[selected]}</p>
      </section>
      <p className="compute-outcome">
        {!r.compatible ? t.invalid : !r.published ? t.missing : !r.backed ? t.noHost : t.ready}
      </p>
      <p>{t.note}</p>
    </figure>
  );
}
