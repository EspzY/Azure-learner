'use client';
import { governanceNb as c } from '@/content/nb';
import {
  runData,
  runPolicy,
  runLocks,
  runGovernance,
  scopeChain,
  type GovernanceInput,
} from '@/domain/curriculum/governance-model';
import type { GovernanceRun } from '@/domain/curriculum/governance';
const yn = (v: boolean) => (v ? c.visual.yes : c.visual.no);
function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
function Flow({ steps }: { steps: { title: string; text: string; decision?: boolean }[] }) {
  return (
    <ol className="governance-flow">
      {steps.map((s, i) => (
        <li key={s.title} className={s.decision ? 'governance-decision' : ''}>
          <small>{String(i + 1).padStart(2, '0')}</small>
          <strong>{s.title}</strong>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
export function GovernanceModelResult({ input }: { input: GovernanceInput }) {
  const data = runData(input),
    policy = runPolicy(input),
    locks = runLocks(input);
  return (
    <section className="governance-result">
      <p className="compute-boundary">{c.visual.boundary}</p>
      {data ? (
        <>
          <h4>{c.visual.dataTitle}</h4>
          <p>{c.assets[data.input.asset].description}</p>
          <Flow
            steps={[
              { title: c.controls.asset, text: c.options.asset[data.input.asset] },
              { title: c.visual.registered, text: yn(data.input.registered) },
              { title: c.visual.discovered, text: yn(data.discoverable), decision: true },
              { title: c.visual.curated, text: yn(data.curated) },
              {
                title: c.visual.dataAccess,
                text: yn(data.declaredSourceAuthorized),
                decision: true,
              },
              { title: c.visual.noRuntime, text: c.visual.notAccess },
            ]}
          />
          <dl className="governance-facts">
            <Fact label={c.visual.classified} value={yn(data.classified)} />
            <Fact label={c.visual.accountable} value={yn(data.accountable)} />
            <Fact label={c.visual.domain} value={c.assets[data.input.asset].domain} />
            <Fact label={c.visual.dataProduct} value={c.assets[data.input.asset].product} />
            <Fact
              label={c.visual.businessTerm}
              value={data.input.glossary ? c.assets[data.input.asset].term : c.visual.no}
            />
            <Fact label={c.visual.traceable} value={yn(data.traceable)} />
          </dl>
          <section aria-label={c.visual.lineage}>
            <h4>{c.visual.lineage}</h4>
            {data.input.lineage ? (
              <ol className="governance-lineage">
                {data.asset.sources.length > 0 && (
                  <li>
                    <ul className="governance-lineage-sources">
                      {data.asset.sources.map((id) => (
                        <li key={id}>{c.options.asset[id]}</li>
                      ))}
                    </ul>
                    <span>↓</span>
                  </li>
                )}
                {data.asset.sources.length > 0 && (
                  <li>
                    {c.visual.process}
                    <span>↓</span>
                  </li>
                )}
                <li>
                  <strong>{c.options.asset[data.input.asset]}</strong>
                </li>
              </ol>
            ) : (
              <p>{c.visual.unknownLineage}</p>
            )}
            {data.asset.sources.length === 0 && data.input.lineage && <p>{c.visual.noUpstream}</p>}
          </section>
          <p className="compute-boundary">{c.visual.notAccess}</p>
        </>
      ) : policy ? (
        <>
          <h4>{c.visual.policyTitle}</h4>
          <Flow
            steps={[
              { title: c.controls.assignment, text: c.options.scopes[policy.input.assignment] },
              { title: c.visual.inScope, text: yn(policy.inScope) },
              { title: c.visual.typeMatches, text: yn(policy.typeMatches) },
              {
                title: c.controls.rule,
                text: `${c.options.rule[policy.input.rule]} · ${c.options.effect[policy.input.effect]}`,
              },
              { title: c.visual.state, text: c.visual.states[policy.state], decision: true },
              { title: c.visual.blocked, text: yn(policy.blocked), decision: true },
            ]}
          />
          <ol className="governance-scope-map">
            {scopeChain(policy.input.resourceScope).map((id, i) => (
              <li
                key={id}
                style={{ marginInlineStart: `${i * 0.65}rem` }}
                className={id === policy.input.assignment ? 'governance-assigned' : ''}
              >
                {c.options.scopes[id]}
              </li>
            ))}
          </ol>
          <dl className="governance-facts">
            {(
              [
                'excluded',
                'exempt',
                'evaluated',
                'condition',
                'modifyRequest',
                'wouldDeploy',
                'needsRemediation',
                'remediationEligible',
              ] as const
            ).map((k) => (
              <Fact key={k} label={c.visual[k]} value={yn(policy[k])} />
            ))}
          </dl>
          <p>{c.visual.noRepair}</p>
          <p className="compute-boundary">{c.visual.noApplicable}</p>
        </>
      ) : locks ? (
        <>
          <h4>{c.visual.lockTitle}</h4>
          <Flow
            steps={[
              { title: c.controls.lockTarget, text: c.options.scopes[locks.input.target] },
              { title: c.visual.operation, text: c.options.operation[locks.input.operation] },
              {
                title: c.visual.plane,
                text: locks.dataPlane ? c.visual.dataPlane : c.visual.controlPlane,
              },
              {
                title: c.visual.inherited,
                text: locks.applicable.length
                  ? locks.applicable
                      .map((l) => `${c.options.lock[l.type]} · ${c.options.scopes[l.scope]}`)
                      .join(' / ')
                  : c.options.lock.none,
              },
              { title: c.visual.lockBlocked, text: yn(locks.lockBlocked), decision: true },
              { title: c.visual.result, text: c.visual.lockCauses[locks.cause], decision: true },
            ]}
          />
          <dl className="governance-facts">
            <Fact label={c.visual.permission} value={yn(locks.input.authorized)} />
            <Fact label={c.visual.allowed} value={yn(locks.allowed)} />
            <Fact label={c.visual.method} value={locks.method} />
            <Fact label={c.visual.endpoint} value={locks.endpoint} />
            <Fact label={c.visual.descendant} value={yn(locks.descendantBlock)} />
          </dl>
          <p className="compute-boundary">{c.visual.noBackup}</p>
        </>
      ) : null}
      <details>
        <summary>{c.visual.details}</summary>
        <div className="compute-table" role="region" aria-label={c.visual.snapshot} tabIndex={0}>
          <table>
            <caption>{c.visual.snapshot}</caption>
            <thead>
              <tr>
                <th>{c.visual.input}</th>
                <th>{c.visual.result}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(input)
                .filter(([k]) => k !== 'kind')
                .map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{String(v)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <pre tabIndex={0} aria-label={c.visual.snapshot}>
          {JSON.stringify(runGovernance(input), null, 2)}
        </pre>
      </details>
    </section>
  );
}
export function GovernanceComparison({ runs }: { runs: GovernanceRun[] }) {
  if (runs.length < 2) return null;
  return (
    <section className="governance-comparison">
      <h4>{c.visual.comparison}</h4>
      <div className="compute-table" role="region" aria-label={c.visual.comparison} tabIndex={0}>
        <table>
          <caption>{c.visual.comparison}</caption>
          <thead>
            <tr>
              <th>{c.visual.run}</th>
              <th>{c.visual.input}</th>
              <th>{c.visual.result}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>
                  {r.input.kind === 'data'
                    ? `${c.options.asset[r.input.asset]} · ${c.controls.registered}: ${yn(r.input.registered)} · ${c.controls.lineage}: ${yn(r.input.lineage)} · ${c.controls.sourceAuthorized}: ${yn(r.input.sourceAuthorized)}`
                    : r.input.kind === 'policy'
                      ? `${c.options.effect[r.input.effect]} · ${c.options.scopes[r.input.assignment]} · ${c.options.phase[r.input.phase]} · ${c.options.exemption[r.input.exemption]}`
                      : `${c.options.lock[r.input.lock]} · ${c.options.scopes[r.input.scope]} · ${c.options.operation[r.input.operation]}`}
                </td>
                <td>{c.model.outcome[runGovernance(r.input)!.outcome]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
