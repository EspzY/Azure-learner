'use client';
import { useEffect, useState } from 'react';
import { nb } from '@/content/nb';
import type { UnitId } from '@/domain/curriculum/manifest';
import {
  experiment,
  observationKey,
  initialProbe,
  type Probe,
  type Profile,
} from '@/domain/curriculum/foundations';
import { useLearning } from './provider';
import { LearningDiagram } from './diagram';
import './learning.css';
const t = nb.foundations;
export interface LearningProjection {
  unit: UnitId | 'brief';
  input: Probe;
}
function defaultProbe(unit: UnitId): Probe {
  return {
    ...initialProbe,
    ...(unit === 'responsibility'
      ? { mode: 'cloud' as const }
      : unit === 'metering'
        ? { mode: 'cloud' as const, profile: 'idle' as const }
        : unit === 'pricing'
          ? { mode: 'cloud' as const, profile: 'steady' as const, pricing: 'commitment' as const }
          : {}),
  };
}
export function UnitInvestigation({
  unit,
  onProject,
  showCore = true,
}: {
  unit: UnitId;
  onProject: (p: LearningProjection | null) => void;
  showCore?: boolean;
}) {
  const learning = useLearning();
  return (
    <VersionedInvestigation
      unit={unit}
      onProject={onProject}
      showCore={showCore}
      learning={learning}
    />
  );
}
export function VersionedInvestigation({
  unit,
  onProject,
  showCore = false,
  learning,
}: {
  unit: UnitId;
  onProject: (p: LearningProjection | null) => void;
  showCore?: boolean;
  learning: Pick<ReturnType<typeof useLearning>, 'save' | 'facts' | 'issue' | 'openJournal'> & {
    store: { event: (event: unknown) => boolean };
  };
}) {
  const { save, store, facts, openJournal } = learning;
  const [input, setInput] = useState<Probe>(
    () => facts.observations[unit].probes.at(-1)?.input ?? defaultProbe(unit),
  );
  const [prediction, setPrediction] = useState('');
  const [answer, setAnswer] = useState('');
  const [roles, setRoles] = useState(['', '', '']);
  const observation = facts.observations[unit],
    last = observation.probes.at(-1);
  const c = t.units[unit];
  useEffect(() => {
    onProject(last ? { unit, input: last.input } : null);
  }, [unit, last, onProject]);
  const update = (change: Partial<Probe>) => setInput((p) => ({ ...p, ...change }));
  const available = !['corrupt', 'unsupported', 'conflict', 'limit'].includes(learning.issue ?? '');
  const response = observation.last?.kind === 'answer' ? observation.last.answer : null;
  const correct =
    response !== null &&
    response ===
      (unit === 'responsibility'
        ? 'provider,customer,customer'
        : unit === 'placement'
          ? 'public,private,hybrid'
          : Object.keys(c.answers)[0]);
  function submit() {
    store.event({
      kind: 'answer',
      unit,
      answer: unit === 'responsibility' || unit === 'placement' ? roles.join(',') : answer,
    });
  }
  return (
    <>
      {showCore && (
        <section className="learning-core">
          <h3 data-lesson-focus tabIndex={-1}>
            {t.purpose}
          </h3>
          <p>{c.purpose}</p>
          <details open>
            <summary>{t.askMechanism}</summary>
            <p>{c.mechanism}</p>
          </details>
          <details>
            <summary>{t.azure}</summary>
            <p>{c.azure}</p>
          </details>
          <details>
            <summary>{t.example}</summary>
            <p>{c.example}</p>
          </details>
          <button type="button" onClick={() => openJournal(unit)}>
            {t.detail}
          </button>
        </section>
      )}
      <fieldset disabled={!available}>
        <legend>{t.investigate}</legend>
        {['capacity', 'pricing'].includes(unit) && (
          <label>
            {t.profile}
            <select
              aria-label={t.profile}
              value={input.profile}
              onChange={(e) => update({ profile: e.target.value as Profile })}
            >
              {(['campaign', 'steady', 'uncertain'] as const).map((p) => (
                <option key={p} value={p}>
                  {t.profiles[p]}
                </option>
              ))}
            </select>
          </label>
        )}
        {unit === 'capacity' && (
          <>
            <label>
              {t.operation}
              <select
                aria-label={t.operation}
                value={input.mode}
                onChange={(e) => update({ mode: e.target.value as Probe['mode'] })}
              >
                <option value="owned">{t.owned}</option>
                <option value="cloud">{t.cloud}</option>
              </select>
            </label>
            <label>
              {t.fixed}
              <select
                aria-label={t.fixed}
                value={input.capacity}
                onChange={(e) => update({ capacity: Number(e.target.value) as 6 | 10 })}
              >
                <option value="6">6</option>
                <option value="10">10</option>
              </select>
            </label>
            <label>
              {t.predict}
              <input
                type="number"
                min="0"
                max="40"
                step="1"
                required
                aria-label={t.predict}
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
            </label>
            <small>{t.predictionHint}</small>
          </>
        )}
        {(unit === 'models' || unit === 'placement') && (
          <label>
            {t.topology}
            <select
              aria-label={t.topology}
              value={input.topology}
              onChange={(e) => update({ topology: e.target.value as Probe['topology'] })}
            >
              {(['public', 'private', 'hybrid'] as const).map((v) => (
                <option key={v} value={v}>
                  {t[v]}
                </option>
              ))}
            </select>
          </label>
        )}
        {unit === 'metering' && (
          <label className="learning-checkbox">
            <input
              type="checkbox"
              checked={input.released}
              onChange={(e) => update({ released: e.target.checked })}
            />
            {t.released}
          </label>
        )}
        {unit === 'pricing' && (
          <label>
            {t.billing}
            <select
              aria-label={t.billing}
              value={input.pricing}
              onChange={(e) => update({ pricing: e.target.value as Probe['pricing'] })}
            >
              <option value="usage">{t.usage}</option>
              <option value="commitment">{t.commitment}</option>
            </select>
          </label>
        )}
        <p>{t.practiceRequirements[unit]}</p>
        <button
          type="button"
          disabled={
            unit === 'capacity' &&
            (prediction === '' ||
              !Number.isInteger(Number(prediction)) ||
              Number(prediction) < 0 ||
              Number(prediction) > 40)
          }
          onClick={() =>
            store.event({
              kind: 'probe',
              unit,
              input,
              prediction: unit === 'capacity' ? Number(prediction) : 0,
            })
          }
        >
          {t.run}
        </button>
      </fieldset>
      {last && (
        <section aria-label={t.investigate} className="learning-result">
          <LearningDiagram unit={unit} input={last.input} />
          {unit === 'capacity' && (
            <p>
              {t.predictionRecorded}: {observation.probes[0]!.prediction} · {t.shortage}:{' '}
              {experiment(observation.probes[0]!.input).shortfall}
            </p>
          )}
          <p>{c.azure}</p>
          <p>{c.example}</p>
          <p role="status">{t.observations[observationKey(unit, last.input)]}</p>
        </section>
      )}
      <fieldset disabled={!available}>
        <legend>{c.question}</legend>
        {unit === 'responsibility' || unit === 'placement' ? (
          (unit === 'responsibility' ? t.responsibilityTasks : t.placements).map((label, i) => (
            <label key={label}>
              {label}
              <select
                aria-label={label}
                value={roles[i]}
                onChange={(e) =>
                  setRoles((old) => old.map((v, j) => (j === i ? e.target.value : v)))
                }
              >
                <option value="">{t.select}</option>
                {(unit === 'responsibility'
                  ? (['provider', 'customer'] as const)
                  : (['public', 'private', 'hybrid'] as const)
                ).map((v) => (
                  <option key={v} value={v}>
                    {t[v]}
                  </option>
                ))}
              </select>
            </label>
          ))
        ) : (
          <div className="learning-answers">
            {Object.entries(c.answers).map(([id, label]) => (
              <label key={id}>
                <input
                  type="radio"
                  name={`practice-${unit}`}
                  value={id}
                  checked={answer === id}
                  onChange={() => setAnswer(id)}
                />
                {label}
              </label>
            ))}
          </div>
        )}
        {!observation.practiced && <p>{t.needProbe}</p>}
        <button
          type="button"
          disabled={
            !observation.practiced ||
            (unit === 'responsibility' || unit === 'placement' ? roles.some((r) => !r) : !answer)
          }
          onClick={submit}
        >
          {t.check}
        </button>
      </fieldset>
      {response && (
        <section role="status" className={`learning-feedback ${correct ? 'feedback-correct' : ''}`}>
          <h3>{correct ? t.correct : t.incorrect}</h3>
          <p>
            {(c.feedback as Record<string, string>)[response] ??
              (c.feedback as Record<string, string>)[correct ? 'correct' : 'wrong']}
          </p>
          <p>{c.misconception}</p>
          {(unit === 'responsibility' || unit === 'placement') &&
            response
              .split(',')
              .map(
                (value, i) =>
                  value !==
                    (unit === 'responsibility'
                      ? ['provider', 'customer', 'customer']
                      : ['public', 'private', 'hybrid'])[i] && (
                    <p key={i}>
                      {(unit === 'responsibility' ? t.roleFeedback : t.placementFeedback)[i]}
                    </p>
                  ),
              )}
          {!observation.practiced && <p>{t.needProbe}</p>}
        </section>
      )}
      <small>
        {t.reviewed} · {save.events.length}
      </small>
    </>
  );
}
