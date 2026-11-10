'use client';
import { migrationNb as c } from '@/content/nb';
import {
  runMigration,
  runMethod,
  runSync,
  runPlanning,
  movementTools,
  type MigrationInput,
  type MethodInput,
  type SyncInput,
  type PlanningInput,
  type ManifestVersion,
} from '@/domain/curriculum/migration-model';
import type { MigrationRun } from '@/domain/curriculum/migration';
const yes = (v: boolean) => (v ? c.visual.yes : c.visual.no);
function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="migration-facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
function Method({ input }: { input: MethodInput }) {
  const r = runMethod(input)!;
  return (
    <>
      <figure className="migration-intent">
        <figcaption>{c.visual.methodTitle}</figcaption>
        <ol>
          <li>
            <small>01</small>
            <strong>{c.options.dataset[input.dataset]}</strong>
            <span>{c.options.destination[input.destination]}</span>
          </li>
          <li>
            <small>02</small>
            <strong>{c.options.cadence[input.cadence]}</strong>
            <span>{c.options.interface[input.interface]}</span>
          </li>
          <li>
            <small>03</small>
            <strong>{c.options.tool[input.tool]}</strong>
            <span>{(c.visual.roles as Record<string, string>)[r.role]}</span>
          </li>
        </ol>
      </figure>
      <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.tools}>
        <table>
          <caption>{c.visual.tools}</caption>
          <thead>
            <tr>
              <th scope="col">{c.controls.tool}</th>
              <th scope="col">{c.visual.fits}</th>
              <th scope="col">{c.labels.limits}</th>
            </tr>
          </thead>
          <tbody>
            {movementTools.map((t) => (
              <tr key={t} data-selected={t === input.tool}>
                <th scope="row">{c.options.tool[t]}</th>
                <td>{yes(r.candidates.includes(t))}</td>
                <td>{c.visual.toolLimits[t]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Facts
        rows={[
          [c.visual.prerequisites, yes(r.prerequisitesMet)],
          [c.visual.fidelity, yes(r.fidelityMet)],
          [
            c.visual.alternatives,
            r.candidates.length
              ? r.candidates.map((t) => c.options.tool[t]).join(' · ')
              : c.visual.none,
          ],
        ]}
      />
      <p className="compute-boundary">{c.visual.methodLimit}</p>
    </>
  );
}
const version = (v: ManifestVersion | null) =>
  v ? `${v.version} · t${v.modified}` : c.visual.absent;
function Sync({ input }: { input: SyncInput }) {
  const r = runSync(input)!;
  const names = [
    c.visual.serverA,
    input.method === 'file-sync' ? 'Azure Files SMB' : 'Azure Blob',
    ...(input.method === 'file-sync' ? [c.visual.serverB] : []),
  ];
  return (
    <>
      <figure className="migration-topology">
        <figcaption>{c.visual.topology}</figcaption>
        <ol>
          {names.map((n, i) => (
            <li key={n}>
              <strong>{n}</strong>
              {i < names.length - 1 && (
                <span
                  aria-label={
                    input.method === 'file-sync'
                      ? 'Endringer via sentral share'
                      : c.options.direction[input.direction]
                  }
                >
                  {input.method === 'file-sync'
                    ? '↔'
                    : input.direction === 'a-to-cloud'
                      ? '→'
                      : '←'}
                </span>
              )}
            </li>
          ))}
        </ol>
      </figure>
      <div
        className="compute-table migration-manifest"
        role="region"
        tabIndex={0}
        aria-label={c.visual.manifestTitle}
      >
        <table>
          <caption>{c.visual.manifestTitle}</caption>
          <thead>
            <tr>
              <th scope="col">{c.visual.file}</th>
              <th scope="col">{c.visual.serverA}</th>
              <th scope="col">{c.visual.cloud}</th>
              {input.method === 'file-sync' && <th scope="col">{c.visual.serverB}</th>}
              <th scope="col">{c.visual.action}</th>
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.before.name}>
                <th scope="row">{row.before.name}</th>
                {(
                  ['a', 'cloud', ...(input.method === 'file-sync' ? ['b'] : [])] as (
                    'a' | 'cloud' | 'b'
                  )[]
                ).map((k) => (
                  <td
                    key={k}
                    data-changed={JSON.stringify(row.before[k]) !== JSON.stringify(row.after[k])}
                  >
                    <span>{version(row.before[k])}</span>
                    <span aria-hidden="true">↓</span>
                    <strong>{version(row.after[k])}</strong>
                  </td>
                ))}
                <td>{c.visual.actions[row.action]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Facts
        rows={[
          [c.visual.syncPrerequisites, yes(r.prerequisitesMet)],
          [c.visual.fidelity, yes(r.fidelityMet)],
          [c.visual.content, c.visual.contentStates[r.contentState]],
        ]}
      />
      <p>{c.visual.manifestLimit}</p>
      <p className="compute-boundary">{c.visual.cacheLimit}</p>
    </>
  );
}
function Planning({ input }: { input: PlanningInput }) {
  const r = runPlanning(input)!;
  const stages = [
    input.discovered,
    r.assessmentReady,
    r.planReady,
    r.dataCheckDeclared,
    r.cutoverReviewed,
    r.validationDeclared,
  ];
  return (
    <>
      <figure className="migration-stages">
        <figcaption>{c.visual.planningTitle}</figcaption>
        <ol>
          {c.visual.phaseStates.map((n, i) => (
            <li key={n} data-met={stages[i]}>
              <small>0{i + 1}</small>
              <strong>{n}</strong>
              <span>{yes(stages[i]!)}</span>
            </li>
          ))}
        </ol>
      </figure>
      <figure className="migration-dependencies">
        <figcaption>{c.visual.dependencyTitle}</figcaption>
        <div>
          <strong>{c.visual.web}</strong>
          <span aria-hidden="true">→</span>
          <strong>{c.visual.database}</strong>
          <span aria-hidden="true">→</span>
          <strong>{c.visual.identity}</strong>
        </div>
        {!input.dependencies && <p>{c.visual.dependencyMissing}</p>}
      </figure>
      <div className="migration-budget">
        <section>
          <small>{c.visual.networkLower}</small>
          <strong>
            {new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 }).format(
              r.networkLowerBoundHours,
            )}{' '}
            {c.visual.hours}
          </strong>
          <p>{c.visual.formula}</p>
        </section>
        <section>
          <small>{c.visual.physical}</small>
          <strong>
            {input.physicalHours} {c.visual.hours}
          </strong>
          <p>
            {c.options.strategy[input.strategy]} · {c.controls.windowHours}: {input.windowHours}
          </p>
        </section>
      </div>
      <Facts
        rows={[
          [c.visual.transport, c.visual.transportStates[r.transport]],
          [c.visual.assessmentReady, yes(r.assessmentReady)],
          [c.visual.planReady, yes(r.planReady)],
          [c.visual.dataCheck, yes(r.dataCheckDeclared)],
          [c.visual.cutover, yes(r.cutoverReviewed)],
          [c.visual.validation, yes(r.validationDeclared)],
        ]}
      />
      <p className="compute-boundary">{c.visual.planningLimit}</p>
    </>
  );
}
const format = ([k, v]: [string, unknown]) =>
  `${(c.controls as Record<string, string>)[k]}: ${typeof v === 'boolean' ? yes(v) : ((c.options as Record<string, Record<string, string>>)[k]?.[String(v)] ?? String(v))}`;
export function MigrationModelResult({ input }: { input: MigrationInput }) {
  if (!runMigration(input)) return null;
  return (
    <section className="migration-result" aria-label={c.visual.result}>
      <p className="compute-boundary">{c.visual.boundary}</p>
      {input.kind === 'method' ? (
        <Method input={input} />
      ) : input.kind === 'sync' ? (
        <Sync input={input} />
      ) : (
        <Planning input={input} />
      )}
      <details>
        <summary>{c.visual.details}</summary>
        <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.snapshot}>
          <table>
            <caption>{c.visual.snapshot}</caption>
            <tbody>
              {Object.entries(input)
                .filter(([k]) => k !== 'kind')
                .map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{(c.controls as Record<string, string>)[k]}</th>
                    <td>{format([k, v]).split(': ').slice(1).join(': ')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
export function MigrationComparison({ runs }: { runs: MigrationRun[] }) {
  return (
    <div
      className="compute-table migration-comparison"
      role="region"
      tabIndex={0}
      aria-label={c.visual.comparison}
    >
      <table>
        <caption>{c.visual.comparison}</caption>
        <thead>
          <tr>
            <th scope="col">{c.visual.run}</th>
            <th scope="col">{c.visual.input}</th>
            <th scope="col">{c.labels.predicted}</th>
            <th scope="col">{c.visual.observation}</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r, i) => {
            const previous = runs[i - 1];
            const entries = Object.entries(r.input).filter(
              ([k, v]) =>
                k !== 'kind' &&
                (!previous ||
                  previous.input.kind !== r.input.kind ||
                  (previous.input as unknown as Record<string, unknown>)[k] !== v),
            );
            return (
              <tr key={i}>
                <th scope="row">#{i + 1}</th>
                <td>
                  {entries.length
                    ? entries.map((x) => <p key={x[0]}>{format(x)}</p>)
                    : c.visual.sameInputs}
                </td>
                <td>{c.model.outcome[r.prediction]}</td>
                <td>{c.model.outcome[runMigration(r.input)!.outcome]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
