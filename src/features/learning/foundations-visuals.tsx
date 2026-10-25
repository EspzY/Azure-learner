import { nb } from '@/content/nb';
import {
  campaignDemand,
  workedDemand,
  type Allocation,
  type ProofResult,
} from '@/domain/design-proof/capacity';
const t = nb.beginnerProof;
type Part = (typeof t.parts)[number]['id'];

/** Purpose-built code illustration; its native controls supply the accessible explanation. */
export function Server({
  selected,
  request = false,
  phase = 3,
}: {
  selected: Part;
  request?: boolean;
  phase?: number;
}) {
  return (
    <svg
      className={`proof-server ${request ? 'proof-request' : ''}`}
      viewBox="0 0 680 410"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="proof-chassis" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#233e55" />
          <stop offset="1" stopColor="#101f32" />
        </linearGradient>
        <pattern id="proof-vents" width="8" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 2h4" stroke="#506a7d" strokeWidth="2" />
        </pattern>
      </defs>
      {request && (
        <>
          <text x="34" y="39" className="proof-drawing-label">
            {t.client}
          </text>
          <rect x="34" y="66" width="174" height="139" rx="9" fill="#243e57" stroke="#7592ac" />
          <rect x="43" y="78" width="156" height="116" rx="3" fill="#f3f7fb" />
          <path d="M43 98h156" stroke="#c6d3df" />
          <circle cx="53" cy="87" r="3" fill="#8094a7" />
          <circle cx="63" cy="87" r="3" fill="#8094a7" />
          <rect x="55" y="112" width="54" height="58" rx="4" fill="#c3d9ea" />
          <path d="M66 157l11-32 18 24" fill="none" stroke="#527fa0" strokeWidth="3" />
          <path d="M121 119h65m-65 12h49m-49 27h54" stroke="#60839d" strokeWidth="4" />
          <path d="M18 207h206l-13 15H30Z" fill="#70859a" />
          <text x="48" y="253" className="proof-drawing-text">
            {t.browser}
          </text>
          <path
            opacity={phase >= 1 ? 1 : 0.3}
            d="M220 119h91l15 35h26"
            fill="none"
            stroke="#66c8db"
            strokeWidth="2"
          />
          <path d="M340 149l12 5-12 5" fill="none" stroke="#66c8db" strokeWidth="2" />
          <path
            opacity={phase >= 3 ? 1 : 0.3}
            d="M352 206h-38l-17 32h-77"
            fill="none"
            stroke="#abc1d5"
            strokeWidth="2"
          />
          <path d="M230 233l-10 5 10 5" fill="none" stroke="#abc1d5" strokeWidth="2" />
          <text x="225" y="102" className="proof-path-label">
            {t.requestLabel}
          </text>
          <text x="221" y="276" className="proof-path-label">
            {t.responseLabel}
          </text>
        </>
      )}
      {request && (
        <text x="363" y="39" className="proof-drawing-label">
          {t.server}
        </text>
      )}
      <g transform={request ? 'translate(345,50) scale(.6)' : 'translate(60,0)'}>
        <text
          x="30"
          y="28"
          className="proof-drawing-label"
          visibility={request ? 'hidden' : 'visible'}
        >
          {t.server}
        </text>
        <path
          d="M30 58L457 58 492 81 492 355 457 377 30 377Z"
          fill="url(#proof-chassis)"
          stroke="#7893a8"
        />
        <path d="M457 58v319m0-296h35" stroke="#456077" />
        <rect
          x="43"
          y="75"
          width="401"
          height="50"
          rx="4"
          fill={selected === 'app' ? '#126c9d' : '#29465e'}
          stroke={selected === 'app' ? '#8ae3f5' : '#58738a'}
        />
        <text x="59" y="106" className="proof-drawing-text">
          {t.parts[5].name}
        </text>
        <rect
          x="43"
          y="134"
          width="401"
          height="42"
          rx="4"
          fill={selected === 'os' ? '#126c9d' : '#203a52'}
          stroke={selected === 'os' ? '#8ae3f5' : '#58738a'}
        />
        <text x="59" y="161" className="proof-drawing-text">
          {t.parts[4].name}
        </text>
        <path d="M43 188h401" stroke="#607c94" strokeDasharray="3 5" />
        <rect x="43" y="201" width="401" height="157" rx="4" fill="#152c3c" stroke="#46667d" />
        <path
          d="M69 217v122m0-69h76m-38-52v120m39-121v121m-77-102h90m-90 83h90"
          stroke="#294c55"
          strokeWidth="3"
        />
        <g stroke={selected === 'cpu' ? '#8ae3f5' : '#789ca8'}>
          <rect
            x="95"
            y="239"
            width="92"
            height="75"
            rx="4"
            fill={selected === 'cpu' ? '#126c9d' : '#38545f'}
          />
          <rect x="109" y="253" width="64" height="47" fill="#213f50" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${100 + i * 11} 230v9m0 75v8`} />
          ))}
          <text x="124" y="283" className="proof-drawing-text" stroke="none">
            {t.parts[0].name}
          </text>
        </g>
        <g stroke={selected === 'ram' ? '#8ae3f5' : '#789ca8'}>
          {[208, 231, 254].map((x) => (
            <g key={x}>
              <rect
                x={x}
                y="224"
                width="16"
                height="97"
                rx="2"
                fill={selected === 'ram' ? '#126c9d' : '#40665b'}
              />
              {[231, 251, 271, 291].map((y) => (
                <rect key={y} x={x + 3} y={y} width="10" height="14" fill="#192d35" stroke="none" />
              ))}
            </g>
          ))}
        </g>
        <g stroke={selected === 'storage' ? '#8ae3f5' : '#789ca8'}>
          {[224, 265, 306].map((y) => (
            <g key={y}>
              <rect
                x="300"
                y={y}
                width="126"
                height="33"
                rx="3"
                fill={selected === 'storage' ? '#126c9d' : '#3a5060'}
              />
              <rect x="312" y={y + 7} width="82" height="18" fill="url(#proof-vents)" />
              <circle cx="414" cy={y + 16} r="3" fill="#7fc6c0" />
            </g>
          ))}
        </g>
        <rect
          x="89"
          y="331"
          width="45"
          height="16"
          fill={selected === 'network' ? '#2ba1be' : '#708b92'}
          stroke="#9db4bd"
        />
        <path d="M94 335v8h34v-8m-30 4h26" stroke="#193342" fill="none" />
      </g>
      {!request && (
        <>
          <text x="77" y="397" className="proof-drawing-label">
            {t.hardware}
          </text>
          <text x="538" y="101" className="proof-path-label">
            {t.software}
          </text>
          <path d="M529 106h-11v62h11" fill="none" stroke="#8eabc3" />
        </>
      )}
    </svg>
  );
}

export function CapacityBoard({
  allocation,
  result,
  worked = false,
}: {
  allocation: Allocation;
  result: ProofResult | null;
  worked?: boolean;
}) {
  const demand = worked ? workedDemand : campaignDemand;
  return (
    <div className="proof-capacity">
      <p className="proof-board-kicker">{worked ? t.singleHour : t.unit}</p>
      <div className={`proof-columns ${worked ? 'proof-one-hour' : ''}`} aria-hidden="true">
        {(worked ? [demand[0]] : demand).map((d, i) => {
          const p = result?.periods[i];
          return (
            <div className="proof-hour" key={i}>
              <div className="proof-hour-label">{t.periods[i]}</div>
              <div className="proof-quantity">
                {d}
                <small>{t.demand}</small>
              </div>
              <div className="proof-tile-grid">
                {Array.from({ length: Math.max(d, allocation) }, (_, j) => (
                  <span
                    key={j}
                    className={
                      !p
                        ? 'tile-unknown'
                        : j < p.served
                          ? 'tile-served'
                          : j < d
                            ? 'tile-unmet'
                            : 'tile-unused'
                    }
                  />
                ))}
              </div>
              <div className="proof-rail">
                <span>{allocation}</span> {t.allocation}
              </div>
              {p && (
                <dl>
                  <div>
                    <dt>{t.served}</dt>
                    <dd>{p.served}</dd>
                  </div>
                  <div>
                    <dt>{t.unused}</dt>
                    <dd>{p.unused}</dd>
                  </div>
                  <div>
                    <dt>{t.unmet}</dt>
                    <dd>{p.unmet}</dd>
                  </div>
                </dl>
              )}
            </div>
          );
        })}
      </div>
      <div className="proof-legend" aria-hidden="true">
        <span className="legend-served">{t.served}</span>
        <span className="legend-unused">{t.unused}</span>
        <span className="legend-unmet">{t.unmet}</span>
      </div>
      <details className="proof-data">
        <summary>{t.numericTable}</summary>
        <table>
          <caption>{t.unit}</caption>
          <thead>
            <tr>
              <th scope="col">{t.period}</th>
              {(worked ? t.periods.slice(0, 1) : t.periods).map((p) => (
                <th scope="col" key={p}>
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                'demand',
                'allocation',
                ...(result ? (['served', 'unused', 'unmet'] as const) : []),
              ] as const
            ).map((key) => (
              <tr key={key}>
                <th scope="row">{t[key]}</th>
                {(worked ? [demand[0]] : demand).map((d, i) => (
                  <td key={i}>
                    {key === 'demand'
                      ? d
                      : key === 'allocation'
                        ? allocation
                        : result!.periods[i]![key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
