'use client';
import { toolsNb as c, toolsDefinition } from '@/content/nb';
import {
  runTools,
  type ToolsInput,
  type IntentInput,
  type ChangeInput,
  type ArcInput,
} from '@/domain/curriculum/management-tools-model';
import type { ToolsRun } from '@/domain/curriculum/management-tools';
const yes = (v: boolean) => (v ? c.model.yes : c.model.no);
function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="tools-facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
function IntentView({ input }: { input: IntentInput }) {
  const r = runTools(input)!;
  if (r.kind !== 'intent') return null;
  return (
    <>
      <figure className="tools-request-map">
        <figcaption>{c.visual.intentTitle}</figcaption>
        <ol>
          <li>
            <small>01</small>
            <strong>{c.options.tool[input.tool]}</strong>
            <span>{c.options.host[input.host]}</span>
          </li>
          <li>
            <small>02</small>
            <strong>{c.visual.intent}</strong>
            <span>
              {c.visual.scope}: {c.options.subscription[input.subscription]}
            </span>
          </li>
          <li>
            <small>03</small>
            <strong>Azure Resource Manager</strong>
            <span>
              {c.visual.ready}: {yes(r.ready)}
            </span>
          </li>
          <li>
            <small>04</small>
            <strong>{r.provider}</strong>
            <code>{r.resourceType}</code>
          </li>
          <li>
            <small>05</small>
            <strong>{c.visual.unexecuted}</strong>
          </li>
        </ol>
      </figure>
      <Facts
        rows={[
          [c.visual.compatible, yes(r.prerequisites.hostCompatible)],
          [c.visual.toolReady, yes(r.prerequisites.toolReady)],
          [c.visual.auth, yes(input.authenticated && input.authorized)],
          [c.visual.configuration, yes(input.policyAllows && input.lockAllows)],
          [c.controls.providerReady, yes(input.providerReady)],
          [c.visual.groupMetadata, c.options.metadataRegion[input.metadataRegion]],
        ]}
      />
      <p>{c.visual.authoring}</p>
      <h5>{c.visual.sameIntent}</h5>
      <p>{c.visual.snippet}</p>
      <pre className="tools-code" tabIndex={0} aria-label={c.visual.selectedCode}>
        {c.snippets[input.tool].replaceAll('{{location}}', input.metadataRegion)}
      </pre>
      <div
        className="compute-table"
        role="region"
        tabIndex={0}
        aria-label={c.visual.toolComparison}
      >
        <table>
          <caption>{c.visual.toolComparison}</caption>
          <thead>
            <tr>
              <th>{c.controls.tool}</th>
              <th>{c.visual.notation}</th>
              <th>{c.visual.scope}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(c.options.tool).map(([tool, name]) => (
              <tr key={tool} aria-current={input.tool === tool ? 'true' : undefined}>
                <th>{name}</th>
                <td>{c.visual.toolModes[tool as keyof typeof c.visual.toolModes]}</td>
                <td>Subscription → Microsoft.Resources/resourceGroups</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function ChangeView({ input }: { input: ChangeInput }) {
  const r = runTools(input)!;
  if (r.kind !== 'change') return null;
  return (
    <>
      <figure className="tools-dependency-map">
        <figcaption>{c.visual.definitionTitle}</figcaption>
        <div className="tools-config-chain">
          <section>
            <small>{c.visual.plan}</small>
            <strong>{r.planName}</strong>
            <code>Microsoft.Web/serverfarms</code>
          </section>
          <div className={r.structureValid ? 'tools-edge' : 'tools-edge tools-edge-invalid'}>
            <strong>{c.visual.order}</strong>
            <span>{c.visual.orders[r.effectiveOrder]}</span>
            <span aria-hidden="true">→</span>
          </div>
          <section>
            <small>{c.visual.app}</small>
            <strong>{r.appName}</strong>
            <code>Microsoft.Web/sites</code>
          </section>
        </div>
        <p className="tools-reference">
          <strong>{r.appName}</strong> → <code>serverFarmId</code> →{' '}
          <strong>
            {r.referenceValid
              ? r.planName
              : input.binding === 'dangling'
                ? 'plan-absent'
                : 'rg-absent / plan-absent'}
          </strong>
        </p>
        <p>
          {c.visual.refValid}: {yes(r.referenceValid)} · {c.visual.order}:{' '}
          {c.visual.orders[r.effectiveOrder]}
        </p>
        <p>{r.planNew ? c.visual.newPlan : c.visual.existing}</p>
      </figure>
      <Facts
        rows={[
          [c.visual.ready, yes(r.ready)],
          [c.visual.previewKnown, yes(!r.previewUnresolved)],
          [c.visual.auth, yes(input.authorized)],
          [c.visual.configuration, yes(input.policyAllows && input.lockAllows)],
          [c.controls.providerReady, yes(input.providerReady)],
        ]}
      />
      <p className="compute-boundary">{c.visual.notRealWhatif}</p>
      {r.previewUnresolved && <p role="status">{c.visual.previewUnknown}</p>}
      <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.difference}>
        <table>
          <caption>{c.visual.difference}</caption>
          <thead>
            <tr>
              <th>{c.visual.resource}</th>
              <th>{c.visual.before}</th>
              <th>{c.visual.desired}</th>
              <th>{c.visual.difference}</th>
            </tr>
          </thead>
          <tbody>
            {r.changes.map((x) => (
              <tr key={x.type}>
                <th>
                  {x.name}
                  <br />
                  <code>{x.type}</code>
                </th>
                <td>{x.before ? JSON.stringify(x.before) : '—'}</td>
                <td>{JSON.stringify(x.desired)}</td>
                <td>{c.visual.changeTypes[x.change]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        {c.visual.retained}:{' '}
        {r.retainedOld.length ? r.retainedOld.join(' · ') : c.visual.noneRetained}
      </p>
      <p>{c.visual.incremental}</p>
      <p>{c.visual.localTemplateBoundary}</p>
      <pre className="tools-code" tabIndex={0} aria-label={c.visual.definition}>
        {toolsDefinition(input)}
      </pre>
    </>
  );
}
function ArcView({ input }: { input: ArcInput }) {
  const r = runTools(input)!;
  if (r.kind !== 'arc') return null;
  return (
    <>
      <figure className="tools-arc-map">
        <figcaption>{c.visual.arcTitle}</figcaption>
        <div className="tools-physical-lanes">
          {Object.entries(c.visual.locations).map(([id, label]) => (
            <section key={id} className={r.physical === id ? 'tools-active-location' : ''}>
              <small>{c.visual.physical}</small>
              <strong>{label}</strong>
              {r.physical === id && <span>{c.options.resource[input.resource]}</span>}
            </section>
          ))}
        </div>
        <div className="tools-management-link">
          <span aria-hidden="true">↓</span>
          <strong>{c.visual.managementLink}</strong>
        </div>
        <section className="tools-representation">
          <small>{c.visual.representation}</small>
          <strong>
            {r.represented ? c.options.approach[input.approach] : c.visual.notRegistered}
          </strong>
          <p>
            Azure Resource Manager · {c.visual.metadataRegion}: {r.metadataRegion}
          </p>
        </section>
        <p>{c.visual.notMigrated}</p>
      </figure>
      {!r.correctApproach && <p>{c.visual.wrongApproach}</p>}
      {!r.supported && <p>{c.visual.notSupported}</p>}
      {r.stale && <p role="status">{c.visual.stale}</p>}
      <Facts
        rows={[
          [c.visual.representation, yes(r.represented)],
          [c.visual.supported, yes(r.supported)],
          [c.visual.current, yes(r.available)],
          [c.visual.extension, yes(r.extensionNeeded)],
          [c.visual.capabilityReady, yes(r.capabilityReady)],
        ]}
      />
      <p className="compute-boundary">{c.visual.arcConnectionBoundary}</p>
    </>
  );
}
export function ToolsModelResult({ input }: { input: ToolsInput }) {
  const result = runTools(input);
  if (!result) return null;
  const options = c.options as Record<string, Record<string, string>>,
    labels = c.controls as Record<string, string>;
  return (
    <section className="tools-result" aria-label={c.visual.result}>
      <p className="compute-boundary">{c.visual.boundary}</p>
      {input.kind === 'intent' ? (
        <IntentView input={input} />
      ) : input.kind === 'change' ? (
        <ChangeView input={input} />
      ) : (
        <ArcView input={input} />
      )}
      <details>
        <summary>{c.visual.details}</summary>
        <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.snapshot}>
          <table>
            <caption>{c.visual.snapshot}</caption>
            <thead>
              <tr>
                <th>{c.visual.input}</th>
                <th>{c.visual.declaredValue}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(input)
                .filter(([k]) => k !== 'kind')
                .map(([k, v]) => (
                  <tr key={k}>
                    <th>{labels[k] ?? k}</th>
                    <td>{typeof v === 'boolean' ? yes(v) : (options[k]?.[v] ?? v)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <pre tabIndex={0} aria-label={c.visual.snapshot}>
          {JSON.stringify({ input, result }, null, 2)}
        </pre>
      </details>
    </section>
  );
}
export function ToolsComparison({ runs }: { runs: ToolsRun[] }) {
  if (runs.length < 2) return null;
  return (
    <section className="tools-comparison">
      <h4>{c.visual.comparison}</h4>
      <div className="compute-table" role="region" tabIndex={0} aria-label={c.visual.comparison}>
        <table>
          <caption>{c.visual.comparison}</caption>
          <thead>
            <tr>
              <th>{c.visual.run}</th>
              <th>{c.visual.input}</th>
              <th>{c.labels.predicted}</th>
              <th>{c.labels.result}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => (
              <tr key={i}>
                <th>#{i + 1}</th>
                <td>
                  {run.input.kind === 'intent'
                    ? `${c.options.tool[run.input.tool]} · ${c.options.host[run.input.host]}`
                    : run.input.kind === 'change'
                      ? `${c.options.syntax[run.input.syntax]} · ${run.input.stage} · ${run.input.costCenter} · ${c.options.order[run.input.order]}`
                      : `${c.options.resource[run.input.resource]} · ${c.options.approach[run.input.approach]} · ${yes(run.input.connected)}`}
                </td>
                <td>{c.model.outcome[run.prediction]}</td>
                <td>{c.model.outcome[runTools(run.input)!.outcome]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
