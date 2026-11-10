import { nb } from '@/content/nb';
import { objectiveIds } from '@/domain/curriculum/manifest';
import { useLearning } from './provider';
import { CurriculumTrail } from './curriculum-trail';
const t = nb.foundations;
export function LearningSummary() {
  const { facts } = useLearning();
  return (
    <section className="learning-summary">
      <h3 data-lesson-focus tabIndex={-1}>
        {facts.guidedComplete ? t.guidedComplete : t.incomplete}
      </h3>
      <p>{t.evidenceHint}</p>
      <p>
        {nb.official.computing} · {nb.official.implemented}
      </p>
      <p>{nb.official.boundary}</p>
      <CurriculumTrail />
      <dl>
        {objectiveIds.map((id) => (
          <div key={id}>
            <dt>
              {id} · {t.objectives[id]}
            </dt>
            <dd>
              {(['introduced', 'practiced', 'guided', 'independent'] as const).map((key) => (
                <p key={key}>
                  {key === 'independent' ? t.independentLabel : t[key]}:{' '}
                  <strong>{facts.evidence[id][key] ? '✓' : t.pending}</strong>
                </p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
