'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { nb } from '@/content/nb';
import {
  detours,
  evaluateDetour,
  recordAttempt,
  serviceModels,
  type ChallengeId,
  type Stop,
} from '@/domain/expedition';
import { useExpedition } from './expedition-provider';

export function KnowledgeDetour({
  id,
  onReturn,
  onAllocation,
}: {
  id: ChallengeId;
  onReturn: (stop: Stop) => void;
  onAllocation: (value: string[]) => void;
}) {
  const { state, update } = useExpedition();
  const definition = detours.find((item) => item.id === id)!;
  const [answer, setAnswer] = useState(state.attempts[id].at(-1)?.answer ?? '');
  const [submitted, setSubmitted] = useState(false);
  const correct = evaluateDetour(id, answer);
  const text = nb.expedition;
  useEffect(() => {
    if (id === 'retained-control') onAllocation(answer.split(',').filter(Boolean));
  }, [id, answer, onAllocation]);
  return (
    <div
      className={`detour-content ${submitted ? (correct ? 'detour-correct' : 'detour-incorrect') : ''}`}
    >
      <p className="eyebrow">{text.checkTitles[id]}</p>
      <h1 id="journey-heading">{text.stops[definition.trigger].title}</h1>
      <p>{text.stops[definition.trigger].text}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          update((previous) => recordAttempt(previous, id, answer));
          setSubmitted(true);
        }}
      >
        <fieldset disabled={submitted}>
          <legend className="sr-only">{text.stops[definition.trigger].title}</legend>
          {definition.interaction === 'decision'
            ? serviceModels.map((model) => (
                <label className="decision-choice" key={model}>
                  <input
                    type="radio"
                    name="service-model"
                    value={model}
                    checked={answer === model}
                    onChange={() => {
                      setAnswer(model);
                      update((previous) => ({ ...previous, model }));
                    }}
                  />
                  <span>
                    <strong>{text.models[model].label}</strong>
                    <small>{text.models[model].example}</small>
                  </span>
                </label>
              ))
            : (['data', 'identity', 'os', 'physical'] as const).map((key) => (
                <label className="allocation-choice" key={key}>
                  <input
                    type="checkbox"
                    checked={answer.split(',').includes(key)}
                    onChange={(event) => {
                      const chosen = new Set(answer.split(',').filter(Boolean));
                      if (event.target.checked) chosen.add(key);
                      else chosen.delete(key);
                      const value = [...chosen].sort();
                      setAnswer(value.join(','));
                      onAllocation(value);
                    }}
                  />
                  <span>{text.choices[key]}</span>
                </label>
              ))}
        </fieldset>
        {!submitted && (
          <button
            className="button button-primary"
            type="submit"
            disabled={definition.interaction === 'decision' && !answer}
          >
            {definition.interaction === 'decision' ? text.validate : text.allocate}
            <ArrowRight size={16} />
          </button>
        )}
      </form>
      <div className="detour-feedback" role="status" aria-live="polite">
        {submitted && (
          <>
            <strong>
              {correct ? <CheckCircle2 size={18} /> : <RotateCcw size={18} />}
              {correct ? text.correct : text.incorrect}
            </strong>
            <p>
              {id === 'service-fit'
                ? text.decisionFeedback[answer as keyof typeof text.decisionFeedback]
                : correct
                  ? text.allocationGood
                  : text.allocationBad}
            </p>
            <small>{text.recorded}</small>
          </>
        )}
      </div>
      <div className="detour-actions">
        {submitted && (
          <button className="text-control" type="button" onClick={() => setSubmitted(false)}>
            {text.retry}
          </button>
        )}
        <button
          type="button"
          className={submitted && correct ? 'button button-primary' : 'text-control'}
          onClick={() =>
            onReturn(
              submitted && correct
                ? definition.returnTo
                : id === 'service-fit'
                  ? 'models'
                  : 'crossing',
            )
          }
        >
          {submitted && correct ? text.return : text.leave}
          <ArrowRight size={16} />
        </button>
      </div>
      <p className="journey-evidence">{text.guided}</p>
    </div>
  );
}
