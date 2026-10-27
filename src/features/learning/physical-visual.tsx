'use client';
import { architectureNb as c } from '@/content/nb';
import {
  evaluateInfrastructure,
  facilities,
  regionExamples,
  type ExampleRegion,
  type InfrastructureInput,
  type InfrastructureResult,
  type PhysicalPlacement,
  type PhysicalState,
} from '@/domain/curriculum/architecture-physical';
export const regionLabel = (id: ExampleRegion) => c.regionNames[id];
/** Original code-native cutaway, not a Microsoft illustration or a real facility/asset. */
export function DatacenterDrawing({ state = 'up' }: { state?: PhysicalState }) {
  return (
    <svg viewBox="0 0 180 117" aria-hidden="true" className={`pa-building pa-${state}`}>
      <path className="pa-shadow" d="M8 88 94 112 174 73 89 48Z" />
      <path className="pa-wall" d="M19 42 94 61 94 101 19 82Z" />
      <path className="pa-side" d="M94 61 161 31 161 71 94 101Z" />
      <path className="pa-roof" d="M19 42 86 12 161 31 94 61Z" />
      {[0, 1, 2].map((n) => (
        <g key={n} transform={`translate(${32 + n * 19} ${53 + n * 5})`}>
          <path className="pa-rack" d="M0 0 13 3 13 31 0 28Z" />
          {[5, 12, 19].map((y) => (
            <path key={y} className="pa-led" d={`M3 ${y} 10 ${y + 2}`} />
          ))}
        </g>
      ))}
      <path className="pa-trunk" d="m100 76 49-22m-39 17v13m16-20v13m16-20v13" />
      <path className="pa-cooling" d="m60 22 14 4-12 6-14-4Zm25 6 14 4-12 6-14-4Z" />
      {state === 'down' && (
        <g className="pa-fault-glyph">
          <circle cx="140" cy="86" r="15" />
          <path d="m134 80 12 12m0-12-12 12" />
        </g>
      )}
      {state === 'unknown' && (
        <text x="134" y="100" className="pa-question">
          ?
        </text>
      )}
    </svg>
  );
}
function sameSite(a: PhysicalPlacement, b: PhysicalPlacement) {
  return a.region === b.region && a.facility === b.facility;
}
export function InfrastructureScene({
  input,
  result,
}: {
  input: InfrastructureInput;
  result: InfrastructureResult | null;
}) {
  const preview = result ?? evaluateInfrastructure({ ...input, failure: 'none', target: 'none' });
  const regions =
    input.placement === 'multi-region' ? [input.region, input.secondary] : [input.region];
  return (
    <section className="pa-scene" aria-label={c.locationLimit}>
      <header>
        <span>{c.locationLimit}</span>
        <small>{c.reviewed}</small>
      </header>
      <div className={`pa-region-grid ${regions.length === 2 ? 'pa-two-regions' : ''}`}>
        {regions.map((region) => (
          <section className="pa-region" key={region}>
            <div className="pa-region-title">
              <span className="pa-location-pin" aria-hidden="true">
                ◎
              </span>
              <div>
                <h3>{regionLabel(region)}</h3>
                <p>
                  {c.geographyNames[regionExamples[region].geography]} ·{' '}
                  {regionExamples[region].zones ? c.hasZones : c.noZones}
                </p>
              </div>
            </div>
            {regionExamples[region].restricted && <p className="pa-caution">{c.restricted}</p>}
            <div className={`pa-zones ${!regionExamples[region].zones ? 'pa-unzoned' : ''}`}>
              {(regionExamples[region].zones ? ['a', 'b', 'c'] : [null]).map((zone) => (
                <section key={zone ?? 'regional'} className="pa-zone">
                  <h4>{zone ? `${c.zone} ${zone.toUpperCase()}` : c.noZones}</h4>
                  <small>{c.support}</small>
                  <div className="pa-facilities">
                    {facilities(region)
                      .filter((p) => p.zone === zone)
                      .map((p) => {
                        const site = result?.sites.find((s) => sameSite(s, p));
                        const parts = preview?.components.filter((part) => sameSite(part, p)) ?? [];
                        return (
                          <div className={`pa-facility pa-${site?.state ?? 'up'}`} key={p.facility}>
                            <DatacenterDrawing state={site?.state} />
                            <strong>
                              {c.facility} {p.facility?.toUpperCase()}
                            </strong>
                            {site && <span>{c.componentStates[site.state]}</span>}
                            <div className="pa-resource-chips">
                              {parts.map((part) => (
                                <span key={part.id} className={`pa-chip pa-${part.state}`}>
                                  {part.role === 'app' ? c.app : c.dataCopy} {part.id.split('-')[1]}{' '}
                                  · {c.componentStates[part.state]}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>
              ))}
            </div>
            {input.placement === 'nonzonal' && (
              <div className="pa-unknown">
                <strong>{c.placements.nonzonal}</strong>
                <p>{c.unknown}</p>
              </div>
            )}
            <p className="pa-pair-note">
              {c.pair}:{' '}
              {regionExamples[region].pair ? regionLabel(regionExamples[region].pair) : c.noPair} ·{' '}
              {c.pairLimit}
            </p>
          </section>
        ))}
      </div>
      {result && (
        <div className="pa-dependency-path">
          <span>
            {c.routing}: {c.routes[result.input.routing]}
          </span>
          <b aria-hidden="true">→</b>
          <span>
            {c.physical}: {result.physicalSurvivors}
          </span>
          <b aria-hidden="true">→</b>
          <span>
            {c.data}: {result.data.filter((d) => d.state === 'up').length}/{result.data.length}
          </span>
          <b aria-hidden="true">→</b>
          <strong>{c.states[result.status]}</strong>
        </div>
      )}
      <p className="pa-caption">
        {c.hardware} · {c.support}
      </p>
    </section>
  );
}
export function ComponentTable({ result }: { result: InfrastructureResult }) {
  return (
    <div className="pa-table-scroll" tabIndex={0} role="region" aria-label={c.table}>
      <table>
        <caption>{c.table}</caption>
        <thead>
          <tr>
            {c.columns.map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.components.map((part) => (
            <tr key={part.id}>
              <th scope="row">
                {part.role === 'app' ? c.app : c.dataCopy} {part.id.split('-')[1]}
              </th>
              <td>{regionLabel(part.region)}</td>
              <td>{part.zone?.toUpperCase() ?? '—'}</td>
              <td>{part.facility?.toUpperCase() ?? '—'}</td>
              <td>
                <span className={`pa-status pa-${part.state}`}>
                  {c.componentStates[part.state]}
                </span>
              </td>
              <td>
                {part.role === 'app'
                  ? `${c.depends}: ${result.relations
                      .filter((r) => r.from === part.id && r.type === 'requires-data')
                      .map((r) => c.dataCopy + ' ' + r.to.split('-')[1])
                      .join(', ')} · ${result.routed.includes(part.id) ? c.routed : c.notRouted}`
                  : c.dataAssumption}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
