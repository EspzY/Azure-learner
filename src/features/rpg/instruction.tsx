'use client';
import { useEffect, useState } from 'react';
import { nb } from '@/content/nb';
import {
  initialCursor,
  playback,
  readingDuration,
  type PlaybackAction,
  type TeachingSequence,
} from '@/domain/instruction/playback';
import { cueRegistry } from '@/domain/instruction/cues';
import { layers, responsibility } from '@/domain/expedition';
import { LearningDiagram } from '@/features/learning/diagram';
import { initialProbe } from '@/domain/curriculum/foundations';
import { usePresentation } from './presentation';
import './instruction.css';
const t = nb.teaching;
export function useInstruction(
  sequence: TeachingSequence | null,
  blocked: boolean,
  context: string,
) {
  const p = usePresentation();
  const [session, setSession] = useState({ context, cursor: initialCursor });
  if (session.context !== context) setSession({ context, cursor: initialCursor });
  const cursor = session.context === context ? session.cursor : initialCursor;
  const [history, setHistory] = useState(false),
    [options, setOptions] = useState(false),
    [visible, setVisible] = useState(true);
  const beat = sequence?.beats[cursor.index] ?? null;
  const suspended = blocked || history || options || !visible;
  function act(action: PlaybackAction) {
    if (!sequence) return;
    setSession((s) =>
      s.context === context ? { ...s, cursor: playback(s.cursor, action, sequence) } : s,
    );
  }
  useEffect(() => {
    const change = () => setVisible(!document.hidden);
    change();
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => {
    let cancelled = false;
    if (!sequence || !beat || beat.wait || suspended || cursor.paused || p.preferences.manual)
      return;
    const timer = setTimeout(
      () => {
        if (!cancelled)
          setSession((s) =>
            s.context === context
              ? {
                  ...s,
                  cursor: playback(
                    s.cursor,
                    { type: 'elapsed', generation: cursor.generation },
                    sequence,
                  ),
                }
              : s,
          );
      },
      readingDuration(beat.text, p.preferences.speed),
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    sequence,
    beat,
    context,
    cursor.index,
    cursor.generation,
    cursor.paused,
    suspended,
    p.preferences.manual,
    p.preferences.speed,
  ]);
  return {
    beat,
    cursor,
    act,
    history,
    setHistory,
    options,
    setOptions,
    suspended,
    sequence,
    preferences: p.preferences,
    update: p.update,
    seen: cursor.seen,
    issue: p.issue,
  };
}
export type InstructionState = ReturnType<typeof useInstruction>;
export function InstructionControls({ state }: { state: InstructionState }) {
  if (!state.sequence) return null;
  const { act, cursor, beat } = state;
  return (
    <section
      className="instruction-controls"
      aria-label={t.auto}
      data-sequence={state.sequence.id}
      data-beat={beat?.id ?? 'interaction'}
      data-paused={String(cursor.paused || state.suspended || state.preferences.manual)}
    >
      <small>
        {beat
          ? `${t.progress} ${cursor.index + 1} / ${state.sequence.beats.length} · ${t.category[beat.kind]}`
          : t.ended}
      </small>
      <div className="instruction-transport">
        <button
          type="button"
          disabled={cursor.index === 0}
          onClick={() => act({ type: 'previous' })}
        >
          {t.previous}
        </button>
        {beat && (
          <>
            <button type="button" disabled={!!beat.wait} onClick={() => act({ type: 'next' })}>
              {state.preferences.manual ? t.next : t.skipBeat}
            </button>
          </>
        )}
        {beat && (
          <button type="button" onClick={() => act({ type: 'skip' })}>
            {t.skip}
          </button>
        )}
      </div>
      <details
        open={state.options}
        onToggle={(e) => {
          state.setOptions(e.currentTarget.open);
          if (!e.currentTarget.open) state.setHistory(false);
        }}
      >
        <summary>
          {t.speed} · {t.history}
        </summary>
        <label>
          {t.speed}
          <select
            aria-label={t.speed}
            value={state.preferences.speed}
            onChange={(e) => state.update({ speed: Number(e.target.value) as 80 | 130 | 180 })}
          >
            <option value="80">{t.slow}</option>
            <option value="130">{t.normal}</option>
            <option value="180">{t.fast}</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.preferences.manual}
            onChange={(e) => state.update({ manual: e.target.checked })}
          />
          {t.manual}
        </label>
        <button type="button" disabled={!beat} onClick={() => act({ type: 'replay' })}>
          {t.replay}
        </button>
        <button type="button" onClick={() => state.setHistory(!state.history)}>
          {state.history ? t.back : t.history}
        </button>
        {state.history && (
          <ol className="instruction-history" aria-label={t.history} tabIndex={0}>
            {state.sequence.beats.slice(0, state.seen + 1).map((b) => (
              <li key={b.id}>
                <strong>
                  {nb.rpg.speakers[b.speaker]} · {t.category[b.kind]}
                </strong>
                <p>{b.text}</p>
              </li>
            ))}
          </ol>
        )}
        <p>{t.controlHint}</p>
      </details>
      {state.issue && <small role="status">{t.preferencesIssue}</small>}
    </section>
  );
}
export function InstructionIllustration({
  cue,
  onInspect,
}: {
  cue: NonNullable<InstructionState['beat']>['cue'];
  onInspect?: () => void;
}) {
  if (!cue) return null;
  const c = cueRegistry[cue];
  return (
    <figure
      className="instruction-illustration"
      data-cue={cue}
      tabIndex={0}
      onFocus={onInspect}
      onPointerDown={onInspect}
    >
      <figcaption>{t.demonstration}</figcaption>
      {c.kind === 'flow' ? (
        <>
          <ol className="instruction-flow">
            {t.flow.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ol>
          <p>{t.flowCaption}</p>
        </>
      ) : c.kind === 'topologies' ? (
        <div className="instruction-topologies">
          {(['public', 'private', 'hybrid'] as const).map((topology) => (
            <LearningDiagram key={topology} unit="models" input={{ ...initialProbe, topology }} />
          ))}
        </div>
      ) : c.kind === 'model' && c.model ? (
        <>
          <p>{nb.rpg.modelNotes[c.model]}</p>
          <dl className="instruction-matrix">
            {layers.map((l) => (
              <div key={l}>
                <dt>{nb.expedition.layers[l].label}</dt>
                <dd>{nb.rpg.owners[responsibility(c.model!, l)]}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : c.unit && c.input ? (
        <LearningDiagram unit={c.unit} input={c.input} />
      ) : null}
    </figure>
  );
}
