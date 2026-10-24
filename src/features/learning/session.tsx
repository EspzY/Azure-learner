'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { nb } from '@/content/nb';
import { unitIds, units, type UnitId } from '@/domain/curriculum/manifest';
import {
  experiment,
  observationKey,
  initialProbe,
  type Probe,
  type Profile,
} from '@/domain/curriculum/foundations';
import type { PlayerRuntime } from '@/features/rpg/runtime';
import { useLearning } from './provider';
import { LearningDiagram } from './diagram';
import { TransferAssessment } from './transfer';
import { LearningSummary } from './summary';
import './learning.css';
import { unitSequence } from '@/content/instruction';
import { cueRegistry } from '@/domain/instruction/cues';
import {
  InstructionControls,
  InstructionIllustration,
  useInstruction,
} from '@/features/rpg/instruction';
import { CurriculumTrail } from './curriculum-trail';
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
export function FoundationsSession({
  runtime,
  onClose,
  onProject,
  onLog,
  initialUnit,
  blocked = false,
}: {
  runtime: PlayerRuntime;
  onClose: () => void;
  onProject: (p: LearningProjection | null) => void;
  onLog?: () => void;
  initialUnit?: UnitId;
  blocked?: boolean;
}) {
  const { save, store, ready, issue, facts, openJournal, journalOpen } = useLearning();
  const [unit, setUnit] = useState<UnitId>(initialUnit ?? save.unit);
  const [view, setView] = useState<'study' | 'transfer' | 'summary'>(
    facts.active ? 'transfer' : 'study',
  );
  const [reset, setReset] = useState(false);
  const sequence = useMemo(() => unitSequence(unit), [unit]);
  const instruction = useInstruction(
    sequence,
    blocked || journalOpen || reset || view !== 'study',
    unit,
  );
  const beat = view === 'study' ? instruction.beat : null;
  const [actualProjection, setActualProjection] = useState<LearningProjection | null>(null);
  const projectActual = useCallback((p: LearningProjection | null) => setActualProjection(p), []);
  useEffect(() => {
    const cue = beat?.cue ? cueRegistry[beat.cue] : null;
    onProject(
      view !== 'study'
        ? null
        : cue?.unit && cue.input
          ? { unit: cue.unit, input: cue.input }
          : beat
            ? null
            : actualProjection,
    );
  }, [beat, actualProjection, view, onProject]);
  const dialog = useRef<HTMLDialogElement>(null),
    panel = useRef<HTMLDivElement>(null);
  const title = useId();
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => {
      el?.close();
      onProject(null);
    };
  }, [onProject]);
  useEffect(() => {
    if (view !== 'study') return;
    store.event({ kind: 'visit', unit });
  }, [unit, view, store]);
  useEffect(() => {
    if (view !== 'study') onProject(null);
  }, [view, onProject]);
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const update = () => {
      const b = el.getBoundingClientRect();
      runtime.safeFrame(b.top / window.innerHeight, b.left / window.innerWidth);
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [runtime]);
  useEffect(() => {
    dialog.current
      ?.querySelector<HTMLElement>(
        beat ? '.instruction-transport button:not(:disabled)' : '[data-lesson-focus]',
      )
      ?.focus();
    // Automatic beat advancement must not steal focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, view, !!beat]);
  function transfer() {
    if (!facts.active && !store.event({ kind: 'begin-transfer' })) return;
    setView('transfer');
  }
  const c = t.units[unit];
  const latest = facts.observations[unit].probes.at(-1);
  return (
    <dialog
      ref={dialog}
      className={`cinematic-dialogue learning-dialogue ${beat ? 'learning-speaking' : ''}`}
      aria-labelledby={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key !== 'Tab') return;
        const controls = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled),a[href],input,select,summary,[tabindex="0"]',
          ),
        ).filter((n) => n.getClientRects().length > 0);
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="cinematic-topline">
        <span>{t.module}</span>
        {beat && (
          <button
            type="button"
            data-pause
            aria-label={instruction.cursor.paused ? nb.teaching.resume : nb.teaching.pause}
            title={instruction.cursor.paused ? nb.teaching.resume : nb.teaching.pause}
            onClick={() => instruction.act({ type: 'pause' })}
          >
            {instruction.cursor.paused ? '▶' : 'Ⅱ'}
          </button>
        )}
        {onLog && (
          <button type="button" onClick={onLog}>
            {nb.orientation.log}
          </button>
        )}
        <button type="button" onClick={onClose} aria-label={t.close}>
          ×
        </button>
      </div>
      <div ref={panel} className="learning-content" data-learning-unit={unit}>
        <section className="learning-narration">
          <p className="eyebrow">
            {nb.official.unitLabel} · {nb.rpg.speakers.guide} ·{' '}
            {units.find((u) => u.id === unit)!.objectives.join(' / ')}
          </p>
          <h2 id={title}>
            {view === 'study' ? c.title : view === 'transfer' ? t.transfer : t.summary}
          </h2>
          <p>
            {view === 'study'
              ? beat
                ? beat.text
                : latest
                  ? t.observations[observationKey(unit, latest.input)]
                  : c.spoken
              : view === 'transfer'
                ? t.transferRules
                : t.evidenceHint}
          </p>
          {view === 'study' && <InstructionControls state={instruction} />}
          <CurriculumTrail unit={unit} />
          <button type="button" className="cinematic-reference" onClick={() => openJournal(unit)}>
            {t.journal}
          </button>
          {view === 'study' && (
            <button type="button" className="cinematic-reference" onClick={transfer}>
              {t.transfer}
            </button>
          )}
        </section>
        <div className="learning-console">
          {issue && (
            <aside role="alert">
              <p>{t.issue[issue]}</p>
              <button type="button" onClick={store.load}>
                {t.reloadSave}
              </button>
            </aside>
          )}
          {ready &&
            view === 'study' &&
            (beat ? (
              <>
                <InstructionIllustration
                  cue={beat.cue}
                  onInspect={() => {
                    if (!instruction.cursor.paused) instruction.act({ type: 'pause' });
                  }}
                />
                <button type="button" onClick={() => instruction.act({ type: 'skip' })}>
                  {nb.teaching.interaction}
                </button>
              </>
            ) : (
              <UnitInvestigation key={unit} unit={unit} onProject={projectActual} />
            ))}
          {ready && view === 'transfer' && <TransferAssessment />}
          {view === 'summary' && <LearningSummary />}
          <nav aria-label={t.module} className="learning-navigation">
            {view === 'study' ? (
              <>
                <button
                  type="button"
                  disabled={unitIds.indexOf(unit) === 0}
                  onClick={() => setUnit(unitIds[unitIds.indexOf(unit) - 1]!)}
                >
                  {t.previous}
                </button>
                {unitIds.indexOf(unit) < unitIds.length - 1 && (
                  <button
                    type="button"
                    disabled={!facts.observations[unit].guided}
                    onClick={() => setUnit(unitIds[unitIds.indexOf(unit) + 1]!)}
                  >
                    {t.next}
                  </button>
                )}
                <button type="button" onClick={() => setView('summary')}>
                  {t.summary}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setView('study')}>
                {t.back}
              </button>
            )}
          </nav>
          <details>
            <summary>{t.assumptionTitle}</summary>
            <p>{t.assumptions}</p>
            <p>{t.exclusions}</p>
          </details>
          <button type="button" className="learning-reset" onClick={() => setReset(!reset)}>
            {t.reset}
          </button>
          {reset && (
            <div role="group" aria-label={t.reset}>
              <p>{t.resetQuestion}</p>
              <button
                type="button"
                onClick={() => {
                  store.clear();
                  setReset(false);
                  setUnit('capacity');
                  setView('study');
                  store.event({ kind: 'visit', unit: 'capacity' });
                }}
              >
                {t.confirmReset}
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
function UnitInvestigation({
  unit,
  onProject,
}: {
  unit: UnitId;
  onProject: (p: LearningProjection | null) => void;
}) {
  const { save, store, facts, openJournal } = useLearning();
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
  const available = !['corrupt', 'unsupported', 'conflict', 'limit'].includes(
    useLearning().issue ?? '',
  );
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
