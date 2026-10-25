'use client';
import { useState } from 'react';
import { nb } from '@/content/nb';
const t = nb.refinement.topology;
type Model = keyof typeof t.models;
/** Original explanatory geometry. No network, resource or evidence commands. */
export function CloudDeployment() {
  const [model, setModel] = useState<Model>('public'),
    [offsite, setOffsite] = useState(false),
    [integration, setIntegration] = useState(true);
  const explanation =
    model === 'public'
      ? t.publicExplanation
      : model === 'private'
        ? t.privateExplanation
        : t.hybridExplanation;
  return (
    <section
      className="cloud-deployment"
      aria-label={t.title}
      data-model={model}
      data-location={model === 'private' ? (offsite ? 'operator' : 'local') : 'provider'}
    >
      <div className="deployment-toolbar" role="group" aria-label={t.select}>
        {(['public', 'private', 'hybrid'] as const).map((id) => (
          <button key={id} type="button" aria-pressed={id === model} onClick={() => setModel(id)}>
            {t.models[id]}
          </button>
        ))}
      </div>
      <div className="deployment-body">
        <div className="deployment-map">
          <svg viewBox="0 0 1080 370" aria-hidden="true">
            <defs>
              <marker
                id="deployment-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto-start-reverse"
              >
                <path d="M0 0L6 3 0 6" fill="none" stroke="currentColor" />
              </marker>
            </defs>
            {model === 'public' ? (
              <>
                <Organisation x={35} y={55} name={t.orgA} />
                <Organisation x={35} y={235} name={t.orgB} />
                <Boundary x={435} width={605} title={t.provider} />
                <text x="465" y="95">
                  {t.publicPlatform}
                </text>
                <Rack x={590} y={120} name={t.serviceA} />
                <Rack x={830} y={120} name={t.serviceB} />
                <path className="deployment-use" d="M265 103C390 103 390 170 590 170" />
                <path
                  className="deployment-use"
                  d="M265 283C430 283 500 320 1008 320L1008 172H982"
                />
                <text x="300" y="85" className="deployment-caption">
                  {t.use}
                </text>
                <text x="300" y="325" className="deployment-caption">
                  {t.use}
                </text>
              </>
            ) : model === 'private' ? (
              <>
                <Boundary x={35} width={455} title={t.orgA} />
                <Boundary x={600} width={440} title={t.operator} />
                <text x="65" y="96" className="deployment-caption">
                  {t.local}
                </text>
                <text x="630" y="96" className="deployment-caption">
                  {t.external}
                </text>
                <g transform={`translate(${offsite ? 685 : 125},130)`}>
                  <path
                    className="deployment-cloud"
                    d="M0 35Q-8 5 25 5Q45-30 80 0Q110-10 125 16Q170 5 172 45V120H0Z"
                  />
                  <Rack x={12} y={22} name={t.dedicated} />
                </g>
                <path
                  className="deployment-use"
                  d={offsite ? 'M280 110C400 90 530 100 700 152' : 'M90 115L140 160'}
                />
                <text x={offsite ? 680 : 115} y="320" className="deployment-caption">
                  {t.exclusive}
                </text>
              </>
            ) : (
              <>
                <Boundary x={35} width={415} title={t.orgA} />
                <Boundary x={620} width={420} title={t.provider} />
                <Rack x={150} y={115} name={t.localWorkload} />
                <Rack x={755} y={115} name={t.serviceA} />
                {integration && (
                  <>
                    <path className="deployment-integration" d="M355 180L745 180" />
                    <text x="462" y="210" className="deployment-caption">
                      {t.integration}
                    </text>
                  </>
                )}
              </>
            )}
          </svg>
          <p className="deployment-boundary-note">{t.boundary}</p>
        </div>
        <div className="deployment-interpretation">
          <h3>{t.models[model]}</h3>
          <p>{explanation}</p>
          {model === 'private' && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={offsite}
                  onChange={(e) => setOffsite(e.target.checked)}
                />
                {t.offsite}
              </label>
              <p role="status">{offsite ? t.unchanged : t.exclusive}</p>
            </>
          )}
          {model === 'hybrid' && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={integration}
                  onChange={(e) => setIntegration(e.target.checked)}
                />
                {t.relationship}
              </label>
              <p role="status">{integration ? t.hybridRelations : t.separate}</p>
            </>
          )}
        </div>
      </div>
      <details>
        <summary>{t.textView}</summary>
        <p>
          {model === 'public'
            ? t.publicRelations
            : model === 'private'
              ? t.privateRelations
              : integration
                ? t.hybridRelations
                : t.separate}
        </p>
      </details>
    </section>
  );
}
function Boundary({ x, width, title }: { x: number; width: number; title: string }) {
  return (
    <g>
      <rect x={x} y="25" width={width} height="320" rx="10" className="deployment-boundary" />
      <text x={x + 25} y="62" className="deployment-title">
        {title}
      </text>
    </g>
  );
}
function Organisation({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="36" cy="22" r="12" className="deployment-person" />
      <path
        d="M15 64V50Q15 35 36 35Q57 35 57 50V64M28 64v18m16-18v18"
        className="deployment-person"
      />
      <text x="75" y="50" className="deployment-title">
        {name}
      </text>
    </g>
  );
}
function Rack({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="150" height="105" rx="6" className="deployment-rack" />
      {[18, 43, 68].map((y) => (
        <g key={y}>
          <rect x="15" y={y} width="120" height="18" rx="2" />
          <path d={`M25 ${y + 9}h65`} stroke="#668da8" />
          <circle cx="120" cy={y + 9} r="3" fill="#087b78" />
        </g>
      ))}
      <text x="75" y="135" textAnchor="middle" className="deployment-caption">
        {name}
      </text>
    </g>
  );
}
