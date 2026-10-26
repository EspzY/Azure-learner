'use client';
import { useId } from 'react';
import { nb, regionLabels, learningPolishNb } from '@/content/nb';
import {
  teachingPolicy,
  type Activity,
  type Input,
  type Result,
} from '@/domain/curriculum/expansion-models';
import './learning-visuals.css';
const c = learningPolishNb.visual,
  t = nb.expansion.common;
const label = (v: string | number) =>
  typeof v === 'number'
    ? String(v)
    : ((c.scopes as Record<string, string>)[v] ??
      (regionLabels as Record<string, string>)[v] ??
      (t.values as Record<string, string>)[v] ??
      v);

/** Configuration projection only; the parent supplies a result AFTER an explicit run. */
export function ModelVisual({
  unit,
  input: i,
  result,
}: {
  unit: Activity;
  input: Input;
  result: Result | null;
}) {
  const marker = useId().replaceAll(':', '');
  let caption: string = c.boundary;
  if (unit === 'availability') caption = c.availability;
  if (unit === 'reliability') caption = c.reliability;
  if (unit === 'governance') caption = c.policyNote;
  if (unit === 'management') caption = c.management;
  if (unit === 'sustainability') caption = c.efficiency;
  if (unit === 'iaas') caption = c.vmNote;
  if (unit === 'paas') caption = c.platformNote;
  if (unit === 'saas') caption = c.saasNote;
  if (unit === 'selection') caption = c.selectionNote;
  const arrow = (d: string, dim = false) => (
    <path d={d} className={`lv-link ${dim ? 'lv-dim' : ''}`} markerEnd={`url(#${marker})`} />
  );
  return (
    <figure className={`learning-visual lv-${unit}`} data-visual={unit}>
      <div className="lv-caption">
        <small>{result ? c.result : c.configuration}</small>
        <span>{c.mechanism}</span>
      </div>
      {unit === 'management' ? (
        <div className="lv-template">
          <div className="lv-source">
            <strong>{i.method === 'template' ? c.template : c.manual}</strong>
            <p>{i.method === 'template' ? label(i.template!) : t.labels.method}</p>
          </div>
          <div className="lv-fan" aria-hidden="true">
            <span>↙</span>
            <span>↓</span>
            <span>↘</span>
          </div>
          <div className="lv-regions">
            {(i.method === 'template' ? [i.template, i.template, i.template] : [i.a, i.b, i.c]).map(
              (v, n) => (
                <div key={n}>
                  <small>{String.fromCharCode(65 + n)}</small>
                  <strong>{label(v!)}</strong>
                </div>
              ),
            )}
          </div>
          <p>{c.intended}</p>
        </div>
      ) : unit === 'sustainability' ? (
        <div className="lv-schedule">
          <strong>
            {label(i.profile!)} · {c.day}
          </strong>
          {(
            [
              [c.required, i.profile === 'dev' ? 8 : 24],
              [c.allocated, Number(i.hours)],
            ] as const
          ).map(([name, hours]) => (
            <div className="lv-time-row" key={name}>
              <span>
                {name} · {hours} h
              </span>
              <div className="lv-hours" aria-hidden="true">
                {Array.from({ length: 24 }, (_, h) => (
                  <i data-on={h < hours} key={h} />
                ))}
              </div>
            </div>
          ))}
          <div className="lv-formula">
            <b>{i.capacity}</b>
            <span>×</span>
            <b>{i.copies}</b>
            <span>×</span>
            <b>{i.hours} h</b>
          </div>
          <p>
            {t.labels.capacity} × {t.labels.copies} × {t.labels.hours}
          </p>
        </div>
      ) : (
        <svg
          viewBox={`0 0 1000 ${unit === 'availability' && Number(i.instances) < 3 ? 320 : 400}`}
          role="img"
          aria-label={caption}
        >
          <defs>
            <marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M1 1L7 4 1 7" fill="none" stroke="#78bdd5" strokeWidth="1.5" />
            </marker>
          </defs>
          {unit === 'availability' ? (
            <>
              <Browser x={35} y={138} />
              <text x="35" y="115">
                {c.request}
              </text>
              <text x="40" y="270">
                {i.demand} {c.unit}
              </text>
              {arrow('M190 195H285')}
              <path className="lv-router" d="M290 160l40-24 40 24v62l-40 24-40-24z" />
              <path className="lv-detail" d="M310 180h40m-20-17v37" />
              <text x="270" y="290">
                {label(i.routing!)}
              </text>
              {Array.from({ length: Number(i.instances) }, (_, n) => {
                const y = 65 + n * 107,
                  failed = n === 0 && i.failed === 'one',
                  routed = i.routing === 'balanced' || n === 0;
                return (
                  <g key={n}>
                    {arrow(`M370 195H425V${y + 34}H490`, !routed || failed)}
                    <path
                      className={`lv-app ${failed ? 'lv-failed' : ''}`}
                      d={`M500 ${y}h410v70H500z`}
                    />
                    <path className="lv-detail" d={`M520 ${y + 22}h25m-25 12h16m-16 12h25`} />
                    <text x="565" y={y + 29}>
                      {c.copy} {n + 1} · {i.size} {c.unit}
                    </text>
                    <text className="lv-small" x="565" y={y + 55}>
                      {failed ? c.failed : routed ? c.reachable : c.unusedRoute}
                    </text>
                  </g>
                );
              })}
            </>
          ) : unit === 'reliability' ? (
            <>
              <text x="45" y="42">
                {c.function}
              </text>
              <Browser x={45} y={110} />
              {arrow('M200 167H310')}
              <path className="lv-app" d="M325 103h255v135H325z" />
              <path className="lv-detail" d="M345 126h215M346 147h25m-25 17h25m-25 17h25" />
              <text x="345" y="210">
                {c.application}
              </text>
              {arrow('M580 167H720')}
              <Database x={730} y={100} />
              <text x="725" y="270">
                {c.dependency}
              </text>
              <text className="lv-small" x="45" y="322">
                {c.incident}: {label(i.incident!)}
              </text>
              <text className="lv-small" x="45" y="356">
                {c.remedy}: {label(i.remedy!)}
              </text>
              {i.incident === 'dependency' && result?.code !== 'dependencyFixed' && (
                <path className="lv-break" d="M640 144l25 45m0-45-25 45" />
              )}
              {i.incident === 'instance' && result?.code !== 'instanceFixed' && (
                <path className="lv-break" d="M415 142l45 45m0-45-45 45" />
              )}
            </>
          ) : unit === 'governance' ? (
            <>
              <text x="45" y="50">
                {c.requestScope}
              </text>
              <text x="45" y="90">
                {label(i.subscription!)}
              </text>
              <path className="lv-document" d="M50 125h210l30 30v165H50z" />
              <path className="lv-detail" d="M260 125v30h30M75 180h140m-140 25h140m-140 25h100" />
              <text className="lv-small" x="75" y="280">
                {label(i.region!)}
              </text>
              {arrow('M300 225H470')}
              <path className="lv-scope" d="M490 80h450v250H490z" />
              <text x="515" y="121">
                {c.policy}
              </text>
              <text className="lv-small" x="515" y="160">
                {label(teachingPolicy.scopeId)}
              </text>
              <text className="lv-small" x="515" y="208">
                {c.filter}
              </text>
              <text x="515" y="260">
                {teachingPolicy.allowedLocations.map(label).join(' / ')}
              </text>
              <text className="lv-small" x="515" y="302">
                {i.subscription === teachingPolicy.scopeId ? t.results.applies : t.results.outside}
              </text>
            </>
          ) : unit === 'iaas' ? (
            <>
              <path className="lv-host" d="M55 85H645L690 115V340H55z" />
              <path className="lv-detail" d="M645 85v255m0-225h45" />
              <text className="lv-small" x="80" y="316">
                {c.hardware}
              </text>
              <path className="lv-guest" d="M80 100h540v170H80z" />
              <text className="lv-small" x="100" y="128">
                {c.guest} · {c.customer}
              </text>
              <text x="100" y="168">
                {c.os}: {label(i.guest!)}
              </text>
              <text className="lv-small" x="100" y="205">
                {c.runtime}
              </text>
              <text className="lv-small" x="100" y="240">
                {label(i.runtime!)} · {label(i.patch!)}
              </text>
              <Chip x={420} y={153} />
              <text className="lv-small" x="500" y="181">
                {i.cpu} vCPU
              </text>
              <text className="lv-small" x="500" y="215">
                {i.ram} GiB
              </text>
              {arrow('M690 175H750')}
              <Disk x={770} y={110} />
              <text className="lv-small" x="750" y="225">
                {c.disk}
              </text>
              <text className="lv-small" x="750" y="253">
                {label(i.disk!)}
              </text>
              {arrow('M690 295H750')}
              <path className="lv-nic" d="M770 285h160v50H770z" />
              <path className="lv-detail" d="M790 305h50m-50 10h20" />
              <text className="lv-small" x="755" y="367">
                {c.nic}: {label(i.network!)}
              </text>
            </>
          ) : unit === 'paas' ? (
            <>
              <text className="lv-small" x="45" y="45">
                {c.customer}
              </text>
              <path className="lv-document" d="M55 80h155l30 30v135H55z" />
              <text x="87" y="145">
                {'</>'}
              </text>
              <text className="lv-small" x="60" y="205">
                {c.artifact}
              </text>
              {arrow('M250 155H340')}
              <path className="lv-boundary" d="M365 65v200" />
              <text className="lv-small" x="260" y="300">
                {label(i.package!)}
              </text>
              {arrow('M390 155H500')}
              {result && ['unsupported', 'driver'].includes(result.code) && (
                <path className="lv-break" d="M350 130l30 50m0-50-30 50" />
              )}
              <path className="lv-platform" d="M515 90h405v155H515z" />
              <path className="lv-detail" d="M535 115h360m-360 20h230" />
              <text x="540" y="180">
                {c.hosting}
              </text>
              <text className="lv-small" x="540" y="218">
                {c.provider}
              </text>
              <text className="lv-small" x="45" y="352">
                {c.compatibility}
              </text>
            </>
          ) : unit === 'saas' ? (
            <>
              <Person x={90} y={120} />
              <text x="50" y="265">
                {c.person}
              </text>
              <text className="lv-small" x="50" y="300">
                {label(i.user!)}
              </text>
              {arrow('M155 168H265')}
              <path className="lv-boundary" d="M285 95v145" />
              <text className="lv-small" x="210" y="65">
                {c.account}
              </text>
              <text className="lv-small" x="205" y="280">
                {label(i.license!)}
              </text>
              {arrow('M310 168H420')}
              {result?.metrics.canUse === 'no' && (
                <path className="lv-break" d="M270 140l30 50m0-50-30 50" />
              )}
              <Browser x={440} y={110} />
              <text className="lv-small" x="390" y="300">
                {c.product}
              </text>
              {arrow('M600 140H690V85H735')}
              <path
                className="lv-key"
                d="M760 58a20 20 0 1 0 0 40 20 20 0 0 0 0-40m20 20h85m-20 0v20m-20-20v14"
              />
              <text className="lv-small" x="720" y="133">
                {c.authority}
              </text>
              <text className="lv-small" x="720" y="165">
                {label(i.role!)}
              </text>
              {arrow('M600 195H690V250H735')}
              <path className="lv-document" d="M755 210h95l25 25v95H755z" />
              <text className="lv-small" x="720" y="365">
                {c.sharing}: {label(i.sharing!)}
              </text>
            </>
          ) : (
            <>
              <text x="50" y="65">
                {t.choiceModel.requirements}
              </text>
              <text className="lv-small" x="50" y="110">
                {t.choiceModel[i.scenario as 'legacy' | 'custom' | 'ready' | 'open']}
              </text>
              {(['iaas', 'paas', 'saas'] as const).map((model, n) => (
                <g key={model} transform={`translate(${65 + n * 315},150)`}>
                  <path className="lv-detail" d="M0 195h260" />
                  {model === 'iaas' ? (
                    <>
                      <path className="lv-host" d="M12 15h185l25 20v100H12z" />
                      <path className="lv-guest" d="M28 30h150v65H28z" />
                      <Chip x={45} y={45} />
                    </>
                  ) : model === 'paas' ? (
                    <>
                      <path className="lv-platform" d="M5 35h220v95H5z" />
                      <path className="lv-base" d="M-5 133h240l-15 10H10z" />
                      <text x="80" y="95">
                        {'</>'}
                      </text>
                    </>
                  ) : (
                    <>
                      <Browser x={40} y={20} />
                      <path className="lv-detail" d="M72 65h75m-75 17h50" />
                    </>
                  )}
                  <text x="5" y="175">
                    {label(model)}
                  </text>
                  <text className="lv-small" x="5" y="230">
                    {c.retainedTasks[n]}
                  </text>
                  {i.model === model && <path d="M5 188h245" stroke="#8dd2e5" strokeWidth="4" />}
                </g>
              ))}
            </>
          )}
        </svg>
      )}
      {unit === 'reliability' && i.incident === 'trend' && (
        <div className="lv-trend">
          <strong>{c.trend}</strong>
          {[2, 4, 6].map((n, k) => (
            <span key={n}>
              {k + 1}: <meter min={0} max={6} value={n} />
              {n} / 6 {c.unit}
            </span>
          ))}
        </div>
      )}
      {unit === 'paas' && (
        <dl className="lv-retained">
          {(['config', 'access', 'data'] as const).map((key) => (
            <div key={key}>
              <dt>{t.labels[key]}</dt>
              <dd>{label(i[key]!)}</dd>
            </div>
          ))}
        </dl>
      )}
      {unit === 'saas' && i.user === 'departed' && <p className="lv-footnote">{c.departure}</p>}
      {!result && <p className="lv-pending">{c.before}</p>}
      {result && ['availability', 'reliability'].includes(unit) && (
        <div className="lv-outcome" role="status">
          <span>
            {t.results.served}: <strong>{result.metrics.served}</strong> {c.unit}
          </span>
          <span>
            {t.results.unmet}: <strong>{result.metrics.unmet}</strong> {c.unit}
          </span>
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Browser({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect className="lv-screen" width="150" height="105" rx="7" />
      <path className="lv-detail" d="M0 22h150M15 11h5m8 0h5M15 43h65m-65 18h105m-105 18h80" />
      <path className="lv-base" d="M-12 110h174l-12 9H0z" />
    </g>
  );
}
function Person({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle className="lv-person" cx="0" cy="0" r="23" />
      <path className="lv-person" d="M-35 80V48q35-35 70 0v32z" />
    </g>
  );
}
function Database({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path className="lv-database" d="M0 20v105c0 30 150 30 150 0V20z" />
      <ellipse className="lv-database" cx="75" cy="20" rx="75" ry="22" />
      <path className="lv-detail" d="M0 62c0 30 150 30 150 0m-150 42c0 30 150 30 150 0" />
    </g>
  );
}
function Disk({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path className="lv-disk" d="M0 0h150v80H0z" />
      <circle className="lv-detail" cx="75" cy="40" r="28" />
      <path className="lv-detail" d="M75 40l45 24m-105 4h10" />
    </g>
  );
}
function Chip({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path className="lv-chip" d="M0 0h65v65H0z" />
      {[10, 25, 40, 55].map((n) => (
        <path className="lv-detail" key={n} d={`M${n} -9v9m0 65v9M-9 ${n}h9m65 0h9`} />
      ))}
    </g>
  );
}
