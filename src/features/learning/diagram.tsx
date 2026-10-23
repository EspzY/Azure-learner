import { nb } from '@/content/nb';
import { experiment, type Probe } from '@/domain/curriculum/foundations';
import type { UnitId } from '@/domain/curriculum/manifest';
const t = nb.foundations;
export function LearningDiagram({ unit, input }: { unit: UnitId; input: Probe }) {
  const result = experiment(input);
  if (unit === 'models' || unit === 'placement')
    return (
      <div
        className="learning-topology"
        role="img"
        aria-label={`${t[input.topology]} · ${input.topology === 'hybrid' ? t.integration : t[input.topology === 'private' ? 'localBoundary' : 'providerBoundary']}`}
      >
        <span className={input.topology === 'public' ? 'boundary-muted' : ''}>
          {t.localBoundary}
        </span>
        <b>{input.topology === 'hybrid' ? '⇄' : '·'}</b>
        <span className={input.topology === 'private' ? 'boundary-muted' : ''}>
          {t.providerBoundary}
        </span>
        <small>{t[input.topology]}</small>
      </div>
    );
  if (unit === 'responsibility')
    return (
      <dl className="learning-roles">
        {t.responsibilityTasks.map((task, i) => (
          <div key={task}>
            <dt>{task}</dt>
            <dd>{i === 0 ? t.provider : t.customer}</dd>
          </div>
        ))}
      </dl>
    );
  return (
    <div className="learning-timeline">
      <p className="learning-assumptions-label">{t.synthetic}</p>
      <div className="learning-bars" aria-hidden="true">
        {result.demand.map((d, i) => (
          <div key={i}>
            <div className="bar-pair">
              <i style={{ height: `${d * 5}px` }} />
              {d > result.allocated[i]! && (
                <em
                  style={{
                    height: `${(d - result.allocated[i]!) * 5}px`,
                    bottom: `${result.allocated[i]! * 5}px`,
                  }}
                />
              )}
              <b style={{ height: `${result.allocated[i]! * 5}px` }} />
            </div>
            <small>{i + 1}</small>
          </div>
        ))}
      </div>
      <table>
        <caption>
          {t.demand} / {t.allocated} / {t.served}
        </caption>
        <thead>
          <tr>
            <th>{t.period}</th>
            {result.demand.map((_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(['demand', 'allocated', 'served'] as const).map((key) => (
            <tr key={key}>
              <th>{t[key]}</th>
              {result[key].map((n, i) => (
                <td key={i}>{n}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="learning-totals">
        <div>
          <dt>{t.shortage}</dt>
          <dd>{result.shortfall}</dd>
        </div>
        <div>
          <dt>{t.idle}</dt>
          <dd>{result.idle}</dd>
        </div>
        <div>
          <dt>{t.cost}</dt>
          <dd>{result.cost}</dd>
        </div>
      </dl>
      {unit === 'pricing' && input.pricing === 'commitment' && (
        <dl className="learning-totals">
          <div>
            <dt>{t.unusedCommitment}</dt>
            <dd>{result.commitmentUnused}</dd>
          </div>
          <div>
            <dt>{t.overflow}</dt>
            <dd>{result.overflow}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
