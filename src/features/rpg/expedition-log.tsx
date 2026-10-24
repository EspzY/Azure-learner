'use client';
import { useRef, useState } from 'react';
import { nb } from '@/content/nb';
import { CommandDialog } from '@/components/command-dialog';
import { journeyGoals, type JourneyGoal } from '@/domain/rpg/expedition';
import { unitIds } from '@/domain/curriculum/manifest';
import { useExpeditionFacts } from './use-expedition';
import { useLearning } from '@/features/learning/provider';
import { LearningSummary } from '@/features/learning/summary';
import { useProgress } from '@/components/progress-provider';
import { totalXp } from '@/domain/progression';
import './orientation.css';
import { CurriculumTrail } from '@/features/learning/curriculum-trail';
const t = nb.orientation;
export function ExpeditionLog({
  onClose,
  onGoal,
  selected,
  onReplay,
  preferenceIssue = false,
}: {
  onClose: () => void;
  onGoal: (goal: JourneyGoal) => void;
  selected?: JourneyGoal;
  onReplay?: () => void;
  preferenceIssue?: boolean;
}) {
  const facts = useExpeditionFacts();
  const { openJournal } = useLearning();
  const { progress } = useProgress();
  const [detail, setDetail] = useState<JourneyGoal>(selected ?? facts.recommended);
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const step = t.steps[detail];
  const first = facts.lesson.submissions[0];
  return (
    <CommandDialog title={t.log} onClose={onClose} wide>
      <div className="expedition-log">
        <p className="eyebrow">{t.logHint}</p>
        {preferenceIssue && <p role="status">{t.prefIssue}</p>}
        <h3>{t.chapter}</h3>
        <p>{t.premise}</p>
        <CurriculumTrail
          overview
          module={
            detail === 'service'
              ? 'services'
              : ['assignment', 'infrastructure', 'debrief'].includes(detail)
                ? 'technical'
                : 'computing'
          }
        />
        <div className="expedition-route">
          <nav aria-label={t.chapter}>
            {journeyGoals.map((id, i) => (
              <button
                type="button"
                key={id}
                onClick={() => {
                  setDetail(id);
                  requestAnimationFrame(() => detailTitle.current?.focus());
                }}
                aria-current={detail === id ? 'step' : undefined}
              >
                <span className="expedition-stop">{i + 1}</span>
                <span>
                  {t.steps[id].title}
                  <small>
                    {id === facts.recommended ? `${t.recommended} · ` : ''}
                    {t.states[facts.statuses[id]]}
                  </small>
                </span>
              </button>
            ))}
          </nav>
          <section className="expedition-detail" aria-label={step.title}>
            <p className="eyebrow">{t.states[facts.statuses[detail]]}</p>
            <h3 ref={detailTitle} tabIndex={-1}>
              {step.title}
            </h3>
            <p>{step.why}</p>
            <p>{step.skills}</p>
            {detail === 'foundations' && !facts.lesson.guidedComplete && (
              <p>
                {t.remaining} <strong>{nb.foundations.units[facts.nextUnit].title}</strong>
              </p>
            )}
            {(detail === 'infrastructure' || detail === 'debrief') && (
              <p>
                {facts.built
                  ? t.technicalBuilt
                  : facts.hasWork
                    ? t.technicalResume
                    : t.debriefUnfinished}
              </p>
            )}
            <button type="button" className="button button-primary" onClick={() => onGoal(detail)}>
              {t.changeGoal} · {step.action}
            </button>
          </section>
        </div>
        <details open>
          <summary>{t.evidence}</summary>
          <h4>{t.units}</h4>
          <ul className="expedition-evidence">
            {unitIds.map((id) => {
              const o = facts.lesson.observations[id];
              return (
                <li key={id}>
                  <span>{nb.foundations.units[id].title}</span>
                  <strong>
                    {o.guided
                      ? t.states['guided-completed']
                      : o.practiced
                        ? t.practiced
                        : o.introduced
                          ? t.introduced
                          : t.notStarted}
                  </strong>
                </li>
              );
            })}
          </ul>
          <p>
            {facts.lesson.active
              ? t.assessmentActive
              : first
                ? first.assisted
                  ? t.assistedSubmission
                  : t.independent
                : t.noAssessment}
          </p>
          <p>{t.assessmentLimit}</p>
          <details>
            <summary>{t.objectiveDetail}</summary>
            <LearningSummary />
          </details>
          <h4>{t.technical}</h4>
          <ul className="expedition-evidence">
            {facts.findings.map((f) => (
              <li key={f.id}>
                <span>{nb.chapter.stages[f.id]}</span>
                <strong>{f.met ? t.states['guided-completed'] : t.notStarted}</strong>
              </li>
            ))}
          </ul>
          <p>
            {totalXp(progress)} XP · {nb.rpg.guided}
          </p>
        </details>
        <details>
          <summary>{t.world}</summary>
          <div className="expedition-regions">
            <article>
              <small>{t.here}</small>
              <h4>{nb.rpg.title}</h4>
              <p>{t.purpose}</p>
            </article>
            <article>
              <small>{t.supported}</small>
              <h4>{t.technicalWorld}</h4>
              <p>{nb.chapter.boundary}</p>
            </article>
            {t.future.map((r) => (
              <article key={r.title} className="expedition-planned">
                <small>
                  {t.planned} · {r.ids}
                </small>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
          <p>{t.overviewHint}</p>
        </details>
        <details>
          <summary>{t.optional}</summary>
          <p>{t.expertHint}</p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => onGoal('infrastructure')}
          >
            {t.expert}
          </button>
          <button className="button button-secondary" type="button" onClick={() => openJournal()}>
            {t.journal}
          </button>
          {onReplay && (
            <button className="button button-secondary" type="button" onClick={onReplay}>
              {t.replay}
            </button>
          )}
        </details>
      </div>
    </CommandDialog>
  );
}
