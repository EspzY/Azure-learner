'use client';
import { securityNb as c } from '@/content/nb';
import {
  runSecurity,
  runTrust,
  runDepth,
  runDefender,
  securityLayers,
  type SecurityInput,
  type TrustInput,
  type DepthInput,
  type DefenderInput,
} from '@/domain/curriculum/security-model';
import type { SecurityRun } from '@/domain/curriculum/security';
const yes = (v: boolean) => (v ? c.visual.yes : c.visual.no);
function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="security-facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
function Trust({ input }: { input: TrustInput }) {
  const r = runTrust(input)!;
  return (
    <>
      <figure className="security-trust-map">
        <figcaption>{c.visual.trustTitle}</figcaption>
        <ol>
          <li>
            <small>01</small>
            <strong>{c.options.identity[input.identity]}</strong>
            <span>{c.options.network[input.network]}</span>
          </li>
          <li>
            <small>02</small>
            <strong>{c.options.device[input.device]}</strong>
            <span>{c.options.sensitivity[input.sensitivity]}</span>
          </li>
          <li>
            <small>03</small>
            <strong>{c.options.scope[input.scope]}</strong>
            <span>{c.options.duration[input.duration]}</span>
          </li>
        </ol>
      </figure>
      <div className="security-principles">
        {(
          [
            [c.visual.verify, r.verify, c.visual.verifyFacts],
            [c.visual.privilege, r.privilege, c.visual.privilegeFacts],
            [c.visual.preparation, r.preparation, c.visual.preparationFacts],
          ] as const
        ).map(([title, facts, labels]) => (
          <section key={title}>
            <h5>{title}</h5>
            <ul>
              {Object.entries(facts).map(([k, v]) => (
                <li key={k}>
                  <span aria-hidden="true">{v ? '✓' : '○'}</span>{' '}
                  {(labels as Record<string, string>)[k]} · <strong>{yes(v)}</strong>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p>{c.visual.networkLimit}</p>
      <p className="compute-boundary">{c.visual.reviewOnly}</p>
    </>
  );
}
export function SecurityLayerMap({
  input,
  change,
}: {
  input: DepthInput;
  change?: (v: SecurityInput) => void;
}) {
  const r = runDepth(input)!;
  return (
    <figure className="security-layer-map">
      <figcaption>{c.visual.layersTitle}</figcaption>
      <p>{c.visual.layerLegend}</p>
      <ol>
        {securityLayers.map((id, i) => {
          const l = c.layers[id];
          return (
            <li
              key={id}
              data-risk={r.directLayer === id}
              data-failure={input.failure === id}
              style={{ '--layer-inset': `${i * 5}px` } as React.CSSProperties}
            >
              {change ? (
                <button
                  type="button"
                  aria-pressed={input.inspectedLayer === id}
                  onClick={() => change({ ...input, inspectedLayer: id })}
                >
                  <small>0{i + 1}</small>
                  <strong>{l.name}</strong>
                  <span>{l.purpose}</span>
                </button>
              ) : (
                <div>
                  <small>0{i + 1}</small>
                  <strong>{l.name}</strong>
                  <span>{l.purpose}</span>
                </div>
              )}
              <span className="security-layer-mark">
                {r.directLayer === id ? c.visual.directLayer : ''}
                {input.failure === id ? ' · ' + c.controls.failure : ''}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="security-selected-layer">
        <h5>{c.layers[input.inspectedLayer].name}</h5>
        <p>{c.layers[input.inspectedLayer].controls}</p>
        <p>{c.layers[input.inspectedLayer].limit}</p>
      </div>
    </figure>
  );
}
function Depth({ input }: { input: DepthInput }) {
  const r = runDepth(input)!;
  return (
    <>
      <SecurityLayerMap input={input} />
      <div className="security-control-path">
        <section>
          <small>{c.controls.primary}</small>
          <strong>{c.options.primary[input.primary]}</strong>
          <span>{c.layers[r.primaryLayer].name}</span>
          <p>
            {c.visual.primaryContribution}: {yes(r.primaryContribution)}
          </p>
        </section>
        <span aria-hidden="true">+</span>
        <section>
          <small>{c.controls.complement}</small>
          <strong>{c.options.complement[input.complement]}</strong>
          <span>{c.layers[r.complementLayer].name}</span>
          <p>
            {c.visual.complementContribution}: {yes(r.complementContribution)}
          </p>
        </section>
      </div>
      <Facts
        rows={[
          [c.visual.inspected, yes(r.inspectedRelevant)],
          [c.visual.primaryFits, yes(r.primaryFits)],
          [c.visual.complementFits, yes(r.complementFits)],
          [c.visual.independent, yes(r.independentBoundary)],
          [c.visual.available, `${yes(r.primaryAvailable)} / ${yes(r.complementAvailable)}`],
          [c.visual.remainingWeakness, yes(r.originalWeaknessStillPresent)],
        ]}
      />
      <p>
        <strong>{c.visual.contribution}: </strong>
        {c.visual.contributions[r.contribution]}
      </p>
      <p className="security-residual">
        <strong>{c.labels.limits}: </strong>
        {c.visual.residuals[r.remaining]}
      </p>
      <p>{c.visual.failureLimit}</p>
    </>
  );
}
function Defender({ input }: { input: DefenderInput }) {
  const r = runDefender(input)!;
  return (
    <>
      <figure className="security-defender-map">
        <figcaption>{c.visual.defenderTitle}</figcaption>
        <ol>
          <li>
            <small>01</small>
            <strong>{c.options.resource[input.resource]}</strong>
            <span>{c.options.posturePlan[input.posturePlan]}</span>
            <span>
              {c.controls.workloadPlan}: {yes(input.workloadPlan)}
            </span>
          </li>
          <li>
            <small>02</small>
            <strong>{c.options.feature[input.feature]}</strong>
            <span>
              {c.visual.selectedFeature}: {yes(r.selectedFeatureAvailable)}
            </span>
            <span>
              {c.visual.selectedEvidence}: {yes(r.selectedEvidenceAvailable)}
            </span>
          </li>
          <li>
            <small>03</small>
            <strong>{c.options.followUp[input.followUp]}</strong>
            <span>
              {c.visual.followUpFits}: {yes(r.followUpFits)}
            </span>
          </li>
        </ol>
      </figure>
      <Facts
        rows={[
          [c.visual.postureAvailable, yes(r.postureAvailable)],
          [c.visual.advancedAvailable, yes(r.advancedAvailable)],
          [c.visual.workloadAvailable, yes(r.workloadAvailable)],
          [c.visual.recommendation, yes(r.recommendationVisible)],
          [c.visual.alert, yes(r.alertVisible)],
          [c.visual.needsCoverage, yes(r.needsCoverage)],
          [c.visual.noRecord, yes(r.noRecord)],
          [c.visual.unavailableRecord, yes(r.unavailableRecord)],
        ]}
      />
      <p>{c.visual.planLimit}</p>
      <p className="compute-boundary">{c.visual.noCause}</p>
      <section className="security-score">
        <h5>{c.visual.scoreTitle}</h5>
        <strong>{c.options.scoreView[input.scoreView]}</strong>
        <p>{c.visual.scoreModels[r.scoreModel]}</p>
        <p>{c.visual.noScore}</p>
      </section>
    </>
  );
}
const format = ([k, v]: [string, unknown]) =>
  `${(c.controls as Record<string, string>)[k]}: ${typeof v === 'boolean' ? yes(v) : ((c.options as Record<string, Record<string, string>>)[k]?.[String(v)] ?? String(v))}`;
export function SecurityModelResult({ input }: { input: SecurityInput }) {
  const r = runSecurity(input);
  if (!r) return null;
  return (
    <section className="security-result" aria-label={c.visual.result}>
      <p className="compute-boundary">{c.visual.boundary}</p>
      {input.kind === 'trust' ? (
        <Trust input={input} />
      ) : input.kind === 'depth' ? (
        <Depth input={input} />
      ) : (
        <Defender input={input} />
      )}
      <details>
        <summary>{c.visual.details}</summary>
        <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.snapshot}>
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
                    <td>{format([k, v]).split(': ').slice(1).join(': ')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <pre tabIndex={0}>{JSON.stringify(r, null, 2)}</pre>
      </details>
    </section>
  );
}
export function SecurityComparison({ runs }: { runs: SecurityRun[] }) {
  if (runs.length < 2) return null;
  return (
    <section className="security-comparison">
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
            {runs.map((run, i) => {
              const r = runSecurity(run.input)!,
                prior = runs[i - 1]?.input,
                entries = Object.entries(run.input).filter(([k]) => k !== 'kind'),
                changed =
                  prior?.kind === run.input.kind
                    ? entries.filter(
                        ([k, v]) => (prior as unknown as Record<string, unknown>)[k] !== v,
                      )
                    : entries.filter(([k]) =>
                        ['risk', 'network', 'identity', 'resource', 'feature'].includes(k),
                      );
              return (
                <tr key={i}>
                  <th>#{i + 1}</th>
                  <td>
                    <p>{changed.length ? changed.map(format).join(' · ') : c.visual.sameInputs}</p>
                    <details>
                      <summary>{c.visual.snapshot}</summary>
                      <ul>
                        {entries.map((e) => (
                          <li key={e[0]}>{format(e)}</li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td>{c.model.outcome[run.prediction]}</td>
                  <td>
                    {c.model.outcome[r.outcome]}
                    {r.kind === 'depth'
                      ? ` · ${c.visual.contributions[r.contribution]} · ${c.visual.remainingWeakness}: ${yes(r.originalWeaknessStillPresent)}`
                      : r.kind === 'defender'
                        ? ` · ${c.visual.selectedFeature}: ${yes(r.selectedFeatureAvailable)} · ${c.visual.followUpFits}: ${yes(r.followUpFits)}`
                        : ` · ${c.visual.verify}: ${yes(r.verificationDescribed)} · ${c.visual.privilege}: ${yes(r.privilegeBounded)} · ${c.visual.preparation}: ${yes(r.breachPrepared)}`}
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
