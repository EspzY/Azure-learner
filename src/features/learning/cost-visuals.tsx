'use client';
import { costNb as c } from '@/content/nb';
import { costAnalysis, type AnalysisScope } from '@/domain/curriculum/cost-model';
export const costMoney = (cents: number) =>
  `${new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100)} ${c.currency}`;
export function CostTable({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <small className="cost-table-help">{c.tableHelp}</small>
      <div className="cost-table-scroll" role="region" tabIndex={0} aria-label={label}>
        {children}
      </div>
    </>
  );
}
export function CostBars({
  rows,
  title,
}: {
  rows: readonly { key: string; cents: number; label: string }[];
  title: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.cents));
  return (
    <figure className="cost-bars">
      <figcaption>{title}</figcaption>
      <ol>
        {rows.map((row) => (
          <li key={row.key}>
            <span>{row.label}</span>
            <div className="cost-bar-track" aria-hidden="true">
              <i style={{ width: `${(Math.max(0, row.cents) / max) * 100}%` }} />
            </div>
            <strong>{costMoney(row.cents)}</strong>
          </li>
        ))}
      </ol>
      <small>0 → {costMoney(max)}</small>
    </figure>
  );
}
export function CostTrend({ scope, budget }: { scope: AnalysisScope; budget: number }) {
  const data = costAnalysis(scope),
    max = Math.ceil(Math.max(data.forecast, budget * 100) / 10000) * 10000 || 10000;
  const x = (day: number) => 55 + (day / 30) * 640,
    y = (value: number) => 200 - (value / max) * 165;
  const path = (days: typeof data.days) =>
    days.map((d, i) => `${i ? 'L' : 'M'}${x(d.day)},${y(d.cents)}`).join(' ');
  return (
    <figure className="cost-trend">
      <figcaption>{c.analysis.chart}</figcaption>
      <svg viewBox="0 0 750 250" aria-hidden="true">
        <rect width="750" height="250" fill="white" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1="55" x2="695" y1={y((i * max) / 4)} y2={y((i * max) / 4)} stroke="#d5e0eb" />
            <text x="47" y={y((i * max) / 4) + 5} textAnchor="end">
              {Math.round((i * max) / 400)}
            </text>
          </g>
        ))}
        <path
          d={`M55 200 ${path(data.days.slice(0, 20)).replace('M', 'L')}`}
          fill="none"
          stroke="#006cb7"
          strokeWidth="3"
        />
        <path
          d={path(data.days.slice(19))}
          fill="none"
          stroke="#5c6270"
          strokeWidth="3"
          strokeDasharray="7 5"
        />
        <line
          x1="55"
          x2="695"
          y1={y(budget * 100)}
          y2={y(budget * 100)}
          stroke="#9b5817"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        {[0, 10, 20, 30].map((d) => (
          <text key={d} x={x(d)} y="222" textAnchor="middle">
            {d}
          </text>
        ))}
        <text x="705" y="243" textAnchor="end">
          {c.analysis.day}
        </text>
        <text x="55" y="20">
          {c.currency}
        </text>
      </svg>
      <div className="cost-chart-key">
        <span>
          ━ {c.analysis.observed}: {costMoney(data.cents)}
        </span>
        <span>
          ┄ {c.analysis.forecast}: {costMoney(data.forecast)}
        </span>
        <span>
          ··· {c.analysis.budget}: {costMoney(budget * 100)}
        </span>
      </div>
      <p>{c.analysis.forecastRule}</p>
    </figure>
  );
}
