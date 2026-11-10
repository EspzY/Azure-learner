'use client';
import { monitoringNb as c } from '@/content/nb';
import {
  runMonitoring,
  runEvidence,
  runHealth,
  runTelemetry,
  type MonitoringInput,
  type EvidenceInput,
  type HealthInput,
  type TelemetryInput,
} from '@/domain/curriculum/monitoring-model';
import type { MonitoringRun } from '@/domain/curriculum/monitoring';
const yes = (v: boolean) => (v ? c.visual.yes : c.visual.no);
const number = (v: number | null) =>
  v === null ? c.visual.unknown : Number(v.toFixed(2)).toLocaleString('nb-NO');
function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="monitoring-facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
function Evidence({ input }: { input: EvidenceInput }) {
  const r = runEvidence(input)!;
  return (
    <>
      <figure className="monitoring-flow">
        <figcaption>{c.visual.evidenceTitle}</figcaption>
        <ol>
          {[
            c.options.question[input.question],
            c.options.tool[input.tool],
            c.options.signal[input.signal],
            r.supported
              ? c.visual.supportedClaim
              : !r.suitable || !r.signalFits
                ? c.visual.toolGap
                : c.visual.dataGap,
          ].map((x, i) => (
            <li key={x}>
              <small>0{i + 1}</small>
              <strong>{x}</strong>
            </li>
          ))}
        </ol>
      </figure>
      <Facts
        rows={[
          [c.visual.fits, yes(r.suitable)],
          [c.visual.signalFits, yes(r.signalFits)],
          [c.visual.ready, yes(r.supported)],
        ]}
      />
      {r.category && (
        <>
          <h5>
            {c.visual.category}:{' '}
            {c.visual.categories[r.category as keyof typeof c.visual.categories]}
          </h5>
          <ul className="monitoring-categories">
            {Object.values(c.visual.categories).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      <p>{c.visual.noCause}</p>
    </>
  );
}
function Health({ input }: { input: HealthInput }) {
  const r = runHealth(input)!;
  return (
    <>
      <figure className="monitoring-health">
        <figcaption>{c.visual.healthTitle}</figcaption>
        <p>{c.visual.eventScope}</p>
        <p>{c.visual.eventTime}</p>
        <ol>
          <li>
            <strong>{c.visual.public}</strong>
            <span>{yes(r.globalVisible)}</span>
            <p>{c.visual.globalLimit}</p>
          </li>
          <li>
            <strong>{c.visual.personal}</strong>
            <span>
              {yes(r.relevant)} · {c.options.event[input.event]}
            </span>
            <p>
              {c.options.subscription[input.subscription]} · {c.options.region[input.region]} ·{' '}
              {c.options.resourceType[input.resourceType]}
            </p>
          </li>
          <li>
            <strong>{c.visual.individual}</strong>
            <span>
              {c.visual.recorded}:{' '}
              {input.supported ? c.options.health[input.health] : c.visual.unknown}
            </span>
            <p>
              {c.visual.currentHealth}: {c.options.health[r.currentHealth]}
            </p>
          </li>
          <li>
            <strong>{c.visual.app}</strong>
            <span>
              {r.appSignalMissing
                ? c.visual.unknown
                : c.options.appObservation[input.appObservation]}
            </span>
            <p>{r.observedAt}</p>
          </li>
        </ol>
      </figure>
      <Facts
        rows={[
          [
            c.visual.scopeMatch,
            `${yes(r.subscriptionMatches)} / ${yes(r.regionMatches)} / ${yes(r.serviceMatches)}`,
          ],
          [c.visual.relevant, yes(r.relevant)],
          [c.visual.current, `${yes(r.current)} · ${r.inspectedAt}`],
        ]}
      />
      {!input.supported && <p>{c.visual.notSupported}</p>}
      {!r.current && <p>{c.visual.historical}</p>}
      <p>{c.visual.healthAvailableLimit}</p>
      <p className="compute-boundary">{c.visual.correlation}</p>
    </>
  );
}
function Telemetry({ input }: { input: TelemetryInput }) {
  const r = runTelemetry(input)!;
  const max =
    Math.max(input.threshold, ...r.points.flatMap((p) => (p.value === null ? [] : [p.value])), 1) *
    1.12;
  const x = (i: number) => 65 + i * 118,
    y = (v: number) => 210 - (v / max) * 170;
  const segments: string[] = [];
  let line: string[] = [];
  r.points.forEach((p, i) => {
    if (p.value === null) {
      if (line.length) segments.push(line.join(' '));
      line = [];
    } else line.push(`${x(i)},${y(p.value)}`);
  });
  if (line.length) segments.push(line.join(' '));
  return (
    <>
      <figure className="monitoring-chart">
        <figcaption>{c.visual.telemetryTitle}</figcaption>
        <svg viewBox="0 0 740 260" role="img" aria-label={c.visual.chart}>
          <rect
            x={x(6 - input.window) - 45}
            y="25"
            width={740 - (x(6 - input.window) - 45) - 35}
            height="185"
            className="monitoring-window"
          />
          <path d="M65 30V210H690" className="monitoring-axis" />
          <path d={`M65 ${y(input.threshold)}H690`} className="monitoring-threshold" />
          <text x="70" y={y(input.threshold) - 8}>
            {'>'} {input.threshold} {r.unit}
          </text>
          {segments.map((p, i) => (
            <polyline key={i} points={p} className="monitoring-series" />
          ))}
          {r.points.map((p, i) => (
            <g key={p.minute}>
              {p.value === null ? (
                <text x={x(i)} y="198" textAnchor="middle">
                  ?
                </text>
              ) : (
                <>
                  <circle cx={x(i)} cy={y(p.value)} r="5" />
                  <text x={x(i)} y={y(p.value) - 12} textAnchor="middle">
                    {p.value}
                  </text>
                </>
              )}
              <text x={x(i)} y="235" textAnchor="middle">
                {p.minute}
              </text>
            </g>
          ))}
        </svg>
        <p>
          {c.visual.time} · {r.unit} · {c.options.aggregation[input.aggregation]} ·{' '}
          {c.options.window[input.window]}
        </p>
      </figure>
      <div className="compute-table" tabIndex={0} role="region" aria-label={c.visual.chart}>
        <table>
          <caption>{c.visual.chart}</caption>
          <thead>
            <tr>
              <th>{c.visual.time}</th>
              <th>
                {c.visual.metric} · {r.unit}
              </th>
              <th>{c.visual.selected}</th>
            </tr>
          </thead>
          <tbody>
            {r.points.map((p) => (
              <tr key={p.minute}>
                <th>{p.minute}</th>
                <td>{p.value ?? c.visual.missing}</td>
                <td>{yes(p.inWindow)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Facts
        rows={[
          [c.visual.valid, `${r.validCount} / ${r.expectedCount}`],
          [c.visual.aggregate, `${number(r.observedAggregate)} ${r.unit}`],
          [c.visual.complete, yes(r.completeWindow)],
          [
            c.visual.condition,
            `${c.options.aggregation[input.aggregation]} > ${input.threshold} ${r.unit} · ${r.conditionMet === null ? c.visual.unknown : yes(r.conditionMet)}`,
          ],
        ]}
      />
      <p>{c.visual.coverageLimit}</p>
      <p>{c.visual.equalWeights}</p>
      <figure className="monitoring-alert-flow">
        <figcaption>{c.visual.alertControls}</figcaption>
        <ol>
          <li>
            <strong>{c.options.rule[input.rule]}</strong>
            <span>{c.options.ruleSignal[input.ruleSignal]}</span>
          </li>
          <li>
            <strong>{c.visual.assessments[r.assessment]}</strong>
            <span>
              {c.visual.notification}: {yes(r.notificationPath)}
            </span>
          </li>
          <li>
            <strong>{c.visual.notSent}</strong>
          </li>
        </ol>
      </figure>
      <p>{c.visual.notStateful}</p>
      <h5>{c.visual.logsTitle}</h5>
      <p>
        {c.options.logSource[input.logSource]} · {c.options.filter[input.filter]} ·{' '}
        {c.options.window[input.window]}
      </p>
      {!r.logsAvailable ? (
        <p role="status">{c.visual.logsMissing}</p>
      ) : !r.records.length ? (
        <p>{c.visual.zeroRows}</p>
      ) : (
        <div className="compute-table" tabIndex={0} role="region" aria-label={c.visual.logsTitle}>
          <table>
            <caption>{c.visual.logsTitle}</caption>
            <thead>
              <tr>
                <th>{c.visual.time}</th>
                <th>{c.visual.operation}</th>
                <th>{c.visual.code}</th>
                <th>{c.visual.id}</th>
                <th>{c.visual.detail}</th>
              </tr>
            </thead>
            <tbody>
              {r.records.map((p, i) => (
                <tr key={i}>
                  <th>{p.minute}</th>
                  <td>{p.operation}</td>
                  <td>{p.code}</td>
                  <td>{p.operationId}</td>
                  <td>{p.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p>{c.visual.queryLimit}</p>
      <figure className="monitoring-trace">
        <figcaption>{c.visual.traceTitle}</figcaption>
        {r.traceRows.length ? (
          <ol>
            {r.traceRows.map((p) => (
              <li key={p.operation}>
                <strong>{p.operation}</strong>
                <span>
                  {p.code} · {p.operationId} · {p.minute}
                </span>
                <p>{p.detail}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p>{c.visual.traceMissing}</p>
        )}
        <p>{c.visual.traceLimit}</p>
      </figure>
    </>
  );
}
export function MonitoringModelResult({ input }: { input: MonitoringInput }) {
  const result = runMonitoring(input);
  if (!result) return null;
  return (
    <section className="monitoring-result" aria-label={c.visual.result}>
      <p className="compute-boundary">{c.visual.boundary}</p>
      {input.kind === 'evidence' ? (
        <Evidence input={input} />
      ) : input.kind === 'health' ? (
        <Health input={input} />
      ) : (
        <Telemetry input={input} />
      )}
      <details>
        <summary>{c.visual.details}</summary>
        <div className="compute-table" tabIndex={0} role="region" aria-label={c.visual.snapshot}>
          <table>
            <caption>{c.visual.snapshot}</caption>
            <thead>
              <tr>
                <th>{c.visual.input}</th>
                <th>{c.visual.value}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(input)
                .filter(([k]) => k !== 'kind')
                .map(([k, v]) => (
                  <tr key={k}>
                    <th>{(c.controls as Record<string, string>)[k]}</th>
                    <td>
                      {typeof v === 'boolean'
                        ? yes(v)
                        : ((c.options as Record<string, Record<string, string>>)[k]?.[v] ?? v)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <pre tabIndex={0}>{JSON.stringify(result, null, 2)}</pre>
      </details>
    </section>
  );
}
export function MonitoringComparison({ runs }: { runs: MonitoringRun[] }) {
  if (runs.length < 2) return null;
  return (
    <section className="monitoring-comparison">
      <h4>{c.visual.comparison}</h4>
      <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.comparison}>
        <table>
          <caption>{c.visual.comparison}</caption>
          <thead>
            <tr>
              <th>{c.visual.run}</th>
              <th>{c.visual.input}</th>
              <th>{c.labels.predicted}</th>
              <th>{c.visual.observation}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => {
              const o = runMonitoring(r.input)!;
              const prior = runs[i - 1]?.input;
              const entries = Object.entries(r.input).filter(([k]) => k !== 'kind');
              const changed =
                prior?.kind === r.input.kind
                  ? entries.filter(
                      ([k, v]) => (prior as unknown as Record<string, unknown>)[k] !== v,
                    )
                  : entries.filter(([k]) =>
                      [
                        'question',
                        'tool',
                        'signal',
                        'subscription',
                        'region',
                        'resourceType',
                        'fixture',
                      ].includes(k),
                    );
              const describe = ([k, v]: [string, unknown]) =>
                `${(c.controls as Record<string, string>)[k]}: ${typeof v === 'boolean' ? yes(v) : ((c.options as Record<string, Record<string, string>>)[k]?.[String(v)] ?? String(v))}`;
              return (
                <tr key={i}>
                  <th>#{i + 1}</th>
                  <td>
                    <p>
                      {changed.length ? changed.map(describe).join(' · ') : c.visual.sameInputs}
                    </p>
                    <details>
                      <summary>{c.visual.snapshot}</summary>
                      <dl>
                        {entries.map(([k, v]) => (
                          <div key={k}>
                            <dt>{(c.controls as Record<string, string>)[k]}</dt>
                            <dd>{describe([k, v]).split(': ').slice(1).join(': ')}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  </td>
                  <td>{c.model.outcome[r.prediction]}</td>
                  <td>
                    {c.model.outcome[o.outcome]}
                    {o.kind === 'telemetry'
                      ? ` · ${c.visual.assessments[o.assessment]} · ${c.visual.aggregate}: ${number(o.observedAggregate)} ${o.unit}`
                      : o.kind === 'health'
                        ? ` · ${c.visual.relevant}: ${yes(o.relevant)} · ${c.options.health[o.currentHealth]}`
                        : ` · ${c.visual.ready}: ${yes(o.supported)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
