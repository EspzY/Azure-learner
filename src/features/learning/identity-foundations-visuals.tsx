'use client';
import { identityNb as c } from '@/content/nb';
import {
  directoryCapabilities,
  methodFacts,
  runDirectory,
  runJourney,
  runExternal,
  runIdentity,
  type IdentityInput,
} from '@/domain/curriculum/identity-foundations-model';
import type { IdentityRun } from '@/domain/curriculum/identity-foundations';
const yes = (v: boolean) => (v ? c.model.yes : c.model.no);
const short = (v: boolean) => (v ? c.model.shortYes : c.model.no);
function Facts({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className="identity-facts">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function Flow({
  title,
  steps,
  separateAccess = false,
}: {
  title: string;
  steps: readonly (readonly [string, string])[];
  separateAccess?: boolean;
}) {
  return (
    <figure className="identity-flow" data-steps={steps.length}>
      <figcaption>{title}</figcaption>
      <ol>
        {steps.map(([label, text], i) => (
          <li key={label} data-access-boundary={separateAccess && i === steps.length - 1}>
            {i > 0 && (
              <span className="identity-flow-arrow" aria-hidden="true">
                →
              </span>
            )}
            <b>
              <span>{i + 1}</span>
              {label}
            </b>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
export function IdentityModelResult({ input }: { input: IdentityInput }) {
  const d = runDirectory(input),
    j = runJourney(input),
    e = runExternal(input);
  return (
    <section className="identity-result">
      <p className="compute-boundary">{c.model.scope}</p>
      {d ? (
        <>
          <Flow
            title={c.visual.directoryTitle}
            steps={[
              [c.controls.workload, c.options.workload[d.input.workload]],
              [c.controls.solution, c.options.solution[d.input.solution]],
              [c.visual.capability, yes(d.compatible)],
              [c.visual.consequence, c.model.directoryCauses[d.cause]],
            ]}
          />
          <Facts
            rows={[
              [c.visual.capability, yes(d.compatible)],
              [
                c.visual.credentials,
                d.input.solution === 'managed' ? yes(d.credentialsReady) : c.model.na,
              ],
              [c.visual.write, d.input.solution === 'managed' ? yes(d.writeAllowed) : c.model.na],
            ]}
          />
          <p>{c.model.directoryAssumptions}</p>
          {d.input.solution === 'managed' ? (
            <p className="identity-source-direction">{c.model.syncDirection}</p>
          ) : (
            <p>{c.model.noSyncClaim}</p>
          )}
          <details>
            <summary>{c.visual.details}</summary>
            <div
              className="compute-table"
              tabIndex={0}
              role="region"
              aria-label={c.visual.directoryTitle}
            >
              <table>
                <caption>{c.visual.directoryTitle}</caption>
                <thead>
                  <tr>
                    <th>{c.controls.solution}</th>
                    <th>{c.visual.modern}</th>
                    <th>{c.visual.legacy}</th>
                    <th>{c.visual.schema}</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    Object.keys(directoryCapabilities) as (keyof typeof directoryCapabilities)[]
                  ).map((k) => (
                    <tr key={k}>
                      <th>{c.options.solution[k]}</th>
                      <td>{short(directoryCapabilities[k].modern)}</td>
                      <td>{short(directoryCapabilities[k].legacy)}</td>
                      <td>{short(directoryCapabilities[k].schema)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>{c.model.directoryAssumptions}</p>
          </details>
        </>
      ) : j ? (
        <>
          <aside className="identity-session">
            <b>
              {c.controls.session}: {c.options.session[j.input.session]}
            </b>
            <p>{c.model.sessionNote}</p>
          </aside>
          <Flow
            title={c.visual.journeyTitle}
            separateAccess
            steps={[
              [
                c.visual.identity,
                j.input.identity ? c.model.identityAvailable : c.model.identityMissing,
              ],
              [c.visual.app, j.input.trust ? c.model.appTrusted : c.model.appUntrusted],
              [c.visual.idp, c.model.journeyCauses[j.cause]],
              [
                c.visual.proof,
                j.reused ? c.options.session[j.input.session] : c.options.method[j.input.method],
              ],
              [c.visual.authn, yes(j.requirementsMet)],
              [c.visual.authz, c.model.accessText[j.access]],
            ]}
          />
          <Facts
            rows={[
              [c.visual.proven, yes(j.identityProven)],
              [c.visual.requirements, yes(j.requirementsMet)],
              [c.visual.reused, yes(j.reused)],
              [c.visual.methodUsed, yes(j.methodChecked)],
            ]}
          />
          <p>{c.model.methodAssumptions}</p>
          <details>
            <summary>{c.visual.details}</summary>
            <div
              className="compute-table"
              tabIndex={0}
              role="region"
              aria-label={c.visual.methodTable}
            >
              <table>
                <caption>{c.visual.methodTable}</caption>
                <thead>
                  <tr>
                    <th>{c.controls.method}</th>
                    <th>{c.visual.factors}</th>
                    <th>{c.visual.passwordless}</th>
                    <th>{c.visual.mfa}</th>
                    <th>{c.visual.resistant}</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(methodFacts) as (keyof typeof methodFacts)[]).map((k) => (
                    <tr key={k}>
                      <th>{c.options.method[k]}</th>
                      <td>
                        {methodFacts[k].factors.map((f) => c.model.factorNames[f]).join(' + ')}
                      </td>
                      <td>{short(methodFacts[k].passwordless)}</td>
                      <td>{short(methodFacts[k].mfa)}</td>
                      <td>{short(methodFacts[k].resistant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>{c.model.methodAssumptions}</p>
          </details>
        </>
      ) : e ? (
        <>
          <Flow
            title={c.visual.externalTitle}
            separateAccess
            steps={[
              [e.homeProvider ? c.visual.home : c.visual.customer, c.options.home[e.input.home]],
              [
                c.visual.tenant,
                e.tenant === 'workforce' ? c.visual.workforce : c.visual.externalTenant,
              ],
              [
                c.visual.representation,
                e.guestRequired
                  ? c.visual.guest
                  : e.tenant === 'external'
                    ? c.visual.customerObject
                    : c.visual.noGuest,
              ],
              [c.visual.trust, e.crossRequired ? yes(e.crossAllowed) : c.model.na],
              [c.visual.resourceAccepted, yes(e.resourceAccepted)],
              [c.visual.target, c.model.accessText[e.access]],
            ]}
          />
          <p className="identity-cause">{c.model.externalCauses[e.cause]}</p>
          <Facts
            rows={[
              [c.visual.homeProof, yes(e.homeProof)],
              [c.visual.representation, yes(e.representationReady)],
              [c.visual.resourceAccepted, yes(e.resourceAccepted)],
              [c.visual.collaborationReady, yes(e.ready)],
              [c.visual.administration, yes(e.adminGranted)],
            ]}
          />
          <p>{c.model.noAdmin}</p>
          <p>{c.model.externalAssumptions}</p>
          <details>
            <summary>{c.visual.details}</summary>
            <div
              className="compute-table"
              tabIndex={0}
              role="region"
              aria-label={c.visual.externalTitle}
            >
              <table>
                <caption>{c.visual.externalTitle}</caption>
                <thead>
                  <tr>
                    <th>{c.controls.approach}</th>
                    <th>{c.visual.tenant}</th>
                    <th>{c.visual.representation}</th>
                    <th>{c.visual.target}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{c.options.approach.b2b}</th>
                    <td>{c.visual.workforce}</td>
                    <td>{c.visual.guest}</td>
                    <td>{c.options.audience.partner}</td>
                  </tr>
                  <tr>
                    <th>{c.options.approach.direct}</th>
                    <td>{c.visual.workforce}</td>
                    <td>{c.visual.noGuest}</td>
                    <td>{c.options.audience.shared}</td>
                  </tr>
                  <tr>
                    <th>{c.options.approach.customer}</th>
                    <td>{c.visual.externalTenant}</td>
                    <td>{c.visual.customerObject}</td>
                    <td>{c.options.audience.customer}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>{c.model.externalAssumptions}</p>
          </details>
        </>
      ) : null}
      <p className="identity-truth">{c.visual.truth}</p>
    </section>
  );
}
export function IdentityComparison({ runs }: { runs: IdentityRun[] }) {
  if (!runs.length) return null;
  return (
    <details className="identity-comparison">
      <summary>
        {c.visual.compare} ({runs.length})
      </summary>
      <div className="compute-table" tabIndex={0} role="region" aria-label={c.visual.compare}>
        <table>
          <caption>{c.visual.compare}</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>{c.visual.input}</th>
              <th>{c.visual.consequence}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>
                  {r.input.kind === 'directory'
                    ? `${c.options.workload[r.input.workload]} · ${c.options.solution[r.input.solution]} · ${c.options.sync[r.input.sync]} · ${c.options.change[r.input.change]}`
                    : r.input.kind === 'journey'
                      ? `${c.options.method[r.input.method]} · ${c.options.session[r.input.session]} · ${c.options.requirement[r.input.requirement]} · ${c.options.access[r.input.access]}`
                      : `${c.options.audience[r.input.audience]} · ${c.options.approach[r.input.approach]} · ${c.options.access[r.input.access]}`}
                  <details className="identity-input-details">
                    <summary>{c.visual.inputDetails}</summary>
                    <dl>
                      {Object.entries(r.input)
                        .filter(([key]) => key !== 'kind')
                        .map(([key, value]) => (
                          <div key={key}>
                            <dt>{c.controls[key as keyof typeof c.controls]}</dt>
                            <dd>
                              {typeof value === 'boolean'
                                ? short(value)
                                : (c.options as Record<string, Record<string, string>>)[key]![
                                    String(value)
                                  ]}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </details>
                </td>
                <td>{c.model.outcome[runIdentity(r.input)!.outcome]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
