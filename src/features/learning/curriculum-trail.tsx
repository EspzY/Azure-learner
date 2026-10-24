import { nb } from '@/content/nb';
import { officialLearning } from '@/domain/curriculum/official';
import type { UnitId } from '@/domain/curriculum/manifest';
import './learning.css';
import '@/features/rpg/instruction.css';
export function CurriculumTrail({
  overview = false,
  module = 'computing',
  unit,
}: {
  overview?: boolean;
  module?: 'computing' | 'services' | 'benefits' | 'technical';
  unit?: UnitId;
}) {
  const t = nb.official;
  return (
    <details className="curriculum-trail">
      <summary>{t.label}</summary>
      <dl>
        <dt>{t.certificationLabel}</dt>
        <dd>
          <a href={officialLearning.certification.url} target="_blank" rel="noreferrer">
            {t.certification}
          </a>
          <br />
          {t.exam}
        </dd>
        <dt>{t.pathLabel}</dt>
        <dd>
          <a href={officialLearning.path.url} target="_blank" rel="noreferrer">
            {t.path}
          </a>
        </dd>
        <dt>{module === 'technical' ? t.activityLabel : t.moduleLabel}</dt>
        <dd>{module === 'technical' ? nb.orientation.steps.infrastructure.title : t[module]}</dd>
        {unit && (
          <>
            <dt>{t.learningUnitLabel}</dt>
            <dd>{officialLearning.unitMapping[unit].map((i) => t.officialUnits[i]).join(' / ')}</dd>
          </>
        )}
      </dl>
      {overview && (
        <>
          <p>{t.references}</p>
          <ol className="curriculum-modules">
            {officialLearning.modules.map((m) => (
              <li key={m.id}>
                <a
                  href={`https://learn.microsoft.com/en-us/training/modules/${m.slug}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t[m.id]} <span aria-hidden="true">↗</span>
                </a>
                <small>
                  {
                    t[
                      m.status === 'implemented'
                        ? 'implemented'
                        : m.status === 'planned'
                          ? 'planned'
                          : 'partial'
                    ]
                  }
                </small>
              </li>
            ))}
          </ol>
          <details>
            <summary>{t.mapping}</summary>
            <ol>
              {t.officialUnits.map((unit) => (
                <li key={unit}>{unit}</li>
              ))}
            </ol>
          </details>
        </>
      )}
      <p>{t.boundary}</p>
      <small>{t.reviewed}</small>
    </details>
  );
}
