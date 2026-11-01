'use client';
import type { CSSProperties } from 'react';
import { accessNb as c } from '@/content/nb';
import {
  runRbac,
  runConditional,
  roles,
  actions,
  roleAllows,
  type AccessInput,
  type ScopeNode,
} from '@/domain/curriculum/access-control-model';
import type { AccessRun } from '@/domain/curriculum/access-control';
const yn = (v: boolean) => (v ? c.model.yes : c.model.no);
function Flow({ steps }: { steps: { title: string; text: string; decision?: boolean }[] }) {
  return (
    <ol className="access-flow">
      {steps.map((s, i) => (
        <li key={s.title} className={s.decision ? 'access-decision' : ''}>
          <small>{String(i + 1).padStart(2, '0')}</small>
          <strong>{s.title}</strong>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
export function AccessModelResult({ input }: { input: AccessInput }) {
  const r = runRbac(input),
    ca = runConditional(input);
  return (
    <section className="access-result">
      <p className="compute-boundary">{c.visual.boundary}</p>
      {r ? (
        <>
          <p>
            {r.input.context.tenant} ·{' '}
            {r.input.context.origin === 'sandbox'
              ? c.sandbox.title
              : 'Fjordverk — konseptuelt eksempel'}{' '}
            · revision {r.input.context.revision}
          </p>
          <p>{c.visual.snapshot}</p>
          <Flow
            steps={[
              { title: c.controls.principal, text: c.options.principal[r.input.principal] },
              {
                title: c.visual.assignment,
                text: `${c.options.roles[r.input.role]} + ${c.options.roles[r.input.second]}`,
              },
              {
                title: c.controls.scope,
                text: r.input.context.nodes.find((n) => n.id === r.input.scope)!.name,
              },
              { title: c.controls.target, text: r.target.name },
              { title: c.visual.permission, text: r.permission },
              { title: c.visual.result, text: c.visual.cause[r.cause], decision: true },
            ]}
          />
          <h4>{c.visual.scope}</h4>
          <ol className="access-scope-map">
            {r.path.map((n, depth) => (
              <li
                key={n.id}
                style={{ '--scope-depth': depth } as CSSProperties}
                className={n.id === r.input.scope ? 'access-assigned' : ''}
              >
                <span>{n.kind}</span>
                <strong>{n.name}</strong>
                {n.id === r.input.scope && <em>{c.visual.assignment}</em>}
              </li>
            ))}
          </ol>
          <dl className="access-facts">
            <Fact label={c.visual.principal} value={yn(r.principalMatches)} />
            <Fact label={c.visual.inScope} value={yn(r.inScope)} />
            <Fact label={c.visual.inherited} value={yn(r.inherited)} />
            <Fact
              label={c.visual.plane}
              value={r.plane === 'data' ? 'DataActions — data plane' : 'Actions — control plane'}
            />
            <Fact
              label={c.visual.allowed}
              value={r.withinModel ? yn(r.allowed) : c.model.outcome[1]}
            />
            <Fact label={c.visual.breadth} value={r.scopeBreadth} />
          </dl>
          <p>{c.visual.cause[r.cause]}</p>
          <details>
            <summary>{c.visual.details}</summary>
            <div
              className="compute-table"
              role="region"
              aria-label={c.visual.permission}
              tabIndex={0}
            >
              <table>
                <caption>Delmengde: VM management / Blob data — {c.visual.boundary}</caption>
                <thead>
                  <tr>
                    <th>Role</th>
                    {actions.map((a) => (
                      <th key={a}>{c.options.action[a]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role}>
                      <th scope="row">{c.options.roles[role]}</th>
                      {actions.map((a) => (
                        <td key={a}>
                          {yn(
                            roleAllows(
                              role,
                              a,
                              (a === 'read-blob' ? 'blob' : 'vm') as ScopeNode['kind'],
                            ),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <pre tabIndex={0} aria-label={c.visual.snapshot}>
              {JSON.stringify(r.input, null, 2)}
            </pre>
          </details>
        </>
      ) : ca ? (
        <>
          <Flow
            steps={[
              { title: 'Authentication', text: yn(ca.input.authenticated) },
              {
                title: 'Targeting',
                text: `${c.options.subject[ca.input.subject]} · ${c.options.app[ca.input.app]}`,
              },
              {
                title: c.visual.policy,
                text: ca.policies
                  .map(
                    (p, i) =>
                      `${i ? 'B' : 'A'}: ${p.applies ? c.visual.policyResult[p.would] : !ca.input.authenticated ? c.visual.notEvaluated : c.visual.notApplicable}`,
                  )
                  .join(' · '),
              },
              { title: c.visual.status, text: c.visual.caStatus[ca.status], decision: true },
              {
                title: 'Azure RBAC',
                text: ca.azure
                  ? `${c.options.authorization[ca.input.authorization]} · ${yn(ca.rbac.allowed)}`
                  : c.visual.appOutside,
              },
              {
                title: c.visual.combined,
                text: ca.azure ? `${c.visual.both}: ${yn(ca.combined)}` : c.visual.appOutside,
                decision: true,
              },
            ]}
          />
          <p>{c.visual.caStatus[ca.status]}</p>
          <div className="access-policy-results">
            {ca.policies.map((p, i) => (
              <section key={i}>
                <h4>
                  {c.visual.policy} {i ? 'B' : 'A'} · {c.options.state[p.policy.state]}
                </h4>
                <p>
                  {c.options.audience[p.policy.audience]} · {c.options.policyApp[p.policy.app]} ·{' '}
                  {c.options.policyLocation[p.policy.location]}
                </p>
                <dl className="access-facts">
                  <Fact label={c.visual.included} value={yn(p.included)} />
                  <Fact label={c.visual.excluded} value={yn(p.excluded)} />
                  <Fact label={c.visual.applies} value={yn(p.applies)} />
                  <Fact label={c.controls.control} value={c.options.control[p.policy.control]} />
                  <Fact label={c.visual.enforced} value={yn(p.enforced)} />
                  <Fact
                    label={c.visual.would}
                    value={
                      p.applies
                        ? c.visual.policyResult[p.would]
                        : !ca.input.authenticated
                          ? c.visual.notEvaluated
                          : c.visual.notApplicable
                    }
                  />
                </dl>
                {p.reportOnly && <p className="compute-boundary">{c.visual.report}</p>}
              </section>
            ))}
          </div>
          <dl className="access-facts">
            <Fact label={c.controls.mfa} value={yn(ca.input.mfa)} />
            <Fact label={c.controls.compliant} value={yn(ca.input.compliant)} />
            <Fact label={c.visual.ca} value={ca.supported ? yn(ca.caMet) : c.model.outcome[1]} />
            <Fact
              label={c.visual.rbac}
              value={ca.azure ? yn(ca.rbac.allowed) : c.visual.appOutside}
            />
            <Fact label={c.visual.both} value={ca.azure ? yn(ca.combined) : c.model.outcome[1]} />
          </dl>
          <p className="compute-boundary">{c.visual.assumptions}</p>
          <details>
            <summary>{c.visual.details}</summary>
            <div className="compute-table" role="region" aria-label={c.visual.status} tabIndex={0}>
              <table>
                <caption>{c.visual.status}</caption>
                <thead>
                  <tr>
                    <th>{c.visual.policy}</th>
                    <th>{c.visual.applies}</th>
                    <th>{c.visual.enforced}</th>
                    <th>{c.visual.would}</th>
                  </tr>
                </thead>
                <tbody>
                  {ca.policies.map((p, i) => (
                    <tr key={i}>
                      <th scope="row">
                        {i ? 'B' : 'A'} · {c.options.state[p.policy.state]}
                      </th>
                      <td>{yn(p.applies)}</td>
                      <td>{yn(p.enforced)}</td>
                      <td>
                        {p.applies
                          ? c.visual.policyResult[p.would]
                          : !ca.input.authenticated
                            ? c.visual.notEvaluated
                            : c.visual.notApplicable}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <pre>{JSON.stringify(ca.input, null, 2)}</pre>
          </details>
        </>
      ) : null}
    </section>
  );
}
export function AccessComparison({ runs }: { runs: AccessRun[] }) {
  if (runs.length < 2) return null;
  return (
    <section className="access-comparison">
      <h4>{c.labels.compare}</h4>
      <div className="compute-table" role="region" aria-label={c.labels.compare} tabIndex={0}>
        <table>
          <caption>{c.visual.snapshot}</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>
                {c.controls.role} / {c.visual.policy}
              </th>
              <th>
                {c.visual.scope} / {c.controls.mfa}
              </th>
              <th>{c.labels.result}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, i) => {
              const r = runRbac(run.input),
                a = runConditional(run.input);
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>
                    {r
                      ? `${c.options.roles[r.input.role]} · ${c.options.action[r.input.action]}`
                      : a
                        ? `A: ${c.options.state[a.input.policyA.state]} / ${c.options.control[a.input.policyA.control]}; B: ${c.options.state[a.input.policyB.state]} / ${c.options.control[a.input.policyB.control]}`
                        : ''}
                  </td>
                  <td>
                    {r
                      ? `${r.input.scope} → ${r.input.target}`
                      : a
                        ? `MFA ${yn(a.input.mfa)} / device ${yn(a.input.compliant)} / ${c.options.authorization[a.input.authorization]}`
                        : ''}
                  </td>
                  <td>
                    {r
                      ? c.visual.cause[r.cause]
                      : a
                        ? `${c.visual.caStatus[a.status]} · Azure RBAC ${yn(a.rbac.allowed)}`
                        : ''}
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
