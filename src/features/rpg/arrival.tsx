'use client';
import { useEffect, useRef, useState } from 'react';
import { nb } from '@/content/nb';
import type { PlayerRuntime } from './runtime';
import { useExpeditionFacts } from './use-expedition';
import type { JourneyGoal, expeditionFacts } from '@/domain/rpg/expedition';
const t = nb.orientation;
export function Arrival({
  runtime,
  returning,
  available,
  onBegin,
  onLog,
  notice,
}: {
  runtime: PlayerRuntime;
  returning: boolean;
  available: boolean;
  onBegin: (goal?: JourneyGoal) => void;
  onLog: () => void;
  notice?: string;
}) {
  const facts = useExpeditionFacts();
  const [beat, setBeat] = useState(0);
  const next = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    runtime.establish(returning ? null : beat);
    return () => {
      runtime.establish(null);
    };
  }, [runtime, beat, returning]);
  const c = t.intro[beat]!;
  return (
    <section className="arrival-cinema" aria-label={returning ? t.returning : t.intro[0].title}>
      <div className="arrival-caption">
        <p className="eyebrow">
          {nb.rpg.region} / {returning ? t.resume : `0${beat + 1} · 03`}
        </p>
        <h2>{returning ? t.returning : c.title}</h2>
        <p aria-live="polite">{returning ? resumeText(facts) : c.text}</p>
        {notice && (
          <p className="arrival-notice" role="alert">
            {notice}
          </p>
        )}
        <div className="arrival-actions">
          {!returning && beat < 2 && (
            <button
              ref={next}
              type="button"
              className="button button-primary"
              disabled={!available}
              onClick={() => setBeat((n) => n + 1)}
            >
              {t.nextView}
            </button>
          )}
          <button
            type="button"
            className={
              returning || beat === 2 ? 'button button-primary' : 'button button-secondary'
            }
            disabled={!available}
            onClick={() => onBegin()}
          >
            {!available ? nb.rpg.loading : t.begin}
          </button>
          {returning && (
            <button
              type="button"
              className="button button-secondary"
              disabled={!available}
              onClick={() => onBegin(facts.recommended)}
            >
              {t.resume}
            </button>
          )}
          <button type="button" className="arrival-text" onClick={onLog}>
            {returning ? t.reorient : t.log}
          </button>
        </div>
        <small>{returning ? t.takeControl : beat === 2 ? t.takeControl : t.introHint}</small>
        {!returning && (
          <span className="rpg-sr">
            {t.skip}: {t.begin}
          </span>
        )}
      </div>
    </section>
  );
}

function resumeText(facts: ReturnType<typeof expeditionFacts>) {
  if (facts.hasWork) return facts.built ? t.technicalBuilt : t.technicalResume;
  if (facts.lesson.guidedComplete) return t.foundationsResumeComplete;
  if (facts.lastUnit)
    return (
      t.remembered +
      ' ' +
      nb.foundations.units[facts.lastUnit].title +
      '. ' +
      t.remaining +
      ' ' +
      nb.foundations.units[facts.nextUnit].title +
      '.'
    );
  if (facts.quest.accepted) return t.serviceResume;
  if (facts.hasModels) return t.modelsResume;
  if (facts.metGuide) return t.metGuideResume;
  if (facts.metEngineer) return t.metEngineerResume;
  return t.noHistory;
}
