'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CornerDownLeft, Info } from 'lucide-react';
import { nb } from '@/content/nb';
import { SavvyShark } from '@/features/course/savvy-shark';
import {
  allocations,
  campaignDemand,
  capacityProof,
  parsePrediction,
  workedDemand,
  type Allocation,
  type ProofResult,
} from '@/domain/design-proof/capacity';
import { Server, CapacityBoard } from '@/features/learning/foundations-visuals';
import './proof.css';

const t = nb.beginnerProof;
type Part = (typeof t.parts)[number]['id'];
type Run = { result: ProofResult; prediction: number };

export function BeginnerProof() {
  const [stage, setStage] = useState(0),
    [sent, setSent] = useState(false),
    [part, setPart] = useState<Part>('cpu');
  const [allocation, setAllocation] = useState<Allocation>(6),
    [prediction, setPrediction] = useState('');
  const [run, setRun] = useState<Run | null>(null),
    [previous, setPrevious] = useState<Run | null>(null);
  const [error, setError] = useState(false),
    [reflection, setReflection] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = t.parts.find((p) => p.id === part)!;
  function navigate(next: number) {
    setStage(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
  function execute(e: React.FormEvent) {
    e.preventDefault();
    const guess = parsePrediction(prediction),
      result = capacityProof({ allocation, demand: campaignDemand });
    if (guess === null || !result) {
      setError(true);
      return;
    }
    if (run) setPrevious(run);
    setRun({ result, prediction: guess });
    setError(false);
    setReflection(null);
  }
  return (
    <div className={`proof-shell ${stage > 0 ? 'proof-active' : ''}`}>
      <a className="proof-skip" href="#proof-main">
        {nb.shell.skip}
      </a>
      <header className="proof-header">
        <span>
          <BookOpen size={23} />
          {t.brand}
          <small>{t.badge}</small>
        </span>
        <a href="/learn">
          <ArrowLeft size={16} />
          {t.exit}
        </a>
      </header>
      <aside className="proof-notice" aria-label={t.badge}>
        <Info size={16} />
        {t.notice}
      </aside>
      <main id="proof-main">
        <div className="proof-intro">
          <p>{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </div>
        <nav className="proof-stages" aria-label={t.nav}>
          <ol>
            {t.stages.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  aria-current={stage === i ? 'step' : undefined}
                  onClick={() => navigate(i)}
                >
                  <span>{i + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <section className="proof-workspace" aria-labelledby="proof-title">
          <div className="proof-explanation">
            <small>
              {t.stage} {stage + 1} / 4
            </small>
            <h2 ref={heading} tabIndex={-1} id="proof-title">
              {t.titles[stage]}
            </h2>
            <p className="proof-purpose">
              <strong>{t.objective}</strong>
              {t.purposes[stage]}
            </p>
            <p>{t.explanations[stage]}</p>
            {stage === 0 && (
              <>
                <button className="proof-primary" type="button" onClick={() => setSent((s) => !s)}>
                  {sent ? t.replay : t.send}
                  <ArrowRight size={17} />
                </button>
                {sent && (
                  <p role="status" className="proof-causal">
                    {t.trace}
                  </p>
                )}
                <p className="proof-small">{t.websiteNote}</p>
              </>
            )}
            {stage === 1 && (
              <>
                <div className="proof-parts" role="group" aria-label={t.selectPart}>
                  {t.parts.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      aria-pressed={part === p.id}
                      onClick={() => setPart(p.id)}
                    >
                      {p.name}
                      <span>{p.role}</span>
                    </button>
                  ))}
                </div>
                <p className="proof-part-detail" role="status">
                  <strong>{selected.name}</strong>
                  {selected.explanation}
                </p>
              </>
            )}
            {stage === 3 && (
              <form onSubmit={execute} noValidate>
                <fieldset>
                  <legend>{t.allocationLabel}</legend>
                  <div className="proof-allocation">
                    {allocations.map((n) => (
                      <label key={n}>
                        <input
                          type="radio"
                          name="allocation"
                          value={n}
                          checked={allocation === n}
                          onChange={() => {
                            if (run) setPrevious(run);
                            setRun(null);
                            setAllocation(n);
                            setPrediction('');
                            setReflection(null);
                            setError(false);
                          }}
                        />
                        <strong>{n}</strong>
                        <span>{t.allocationUnit}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="proof-prediction">
                  {t.prediction}
                  <input
                    aria-describedby="proof-prediction-hint"
                    aria-invalid={error}
                    type="number"
                    min="0"
                    max="12"
                    step="1"
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                  />
                </label>
                <p id="proof-prediction-hint" className="proof-small">
                  {t.predictionHint}
                </p>
                {error && <p role="alert">{t.invalid}</p>}
                <button className="proof-primary" type="submit">
                  {t.run}
                  <ArrowRight size={17} />
                </button>
              </form>
            )}
          </div>
          <div className="proof-observation">
            {stage < 2 ? (
              <div className="proof-system">
                <Server selected={stage === 0 ? 'app' : part} request={stage === 0} />
                <p>{stage === 0 ? t.pathNote : selected.role}</p>
                {stage === 0 && (
                  <ol className={sent ? 'proof-trace proof-trace-sent' : 'proof-trace'}>
                    <li>{t.browser}</li>
                    <li>{t.parts[5].name}</li>
                    <li>{t.response}</li>
                  </ol>
                )}
              </div>
            ) : (
              <>
                <CapacityBoard
                  worked={stage === 2}
                  allocation={stage === 2 ? 6 : allocation}
                  result={
                    stage === 2
                      ? capacityProof({ allocation: 6, demand: workedDemand })
                      : (run?.result ?? null)
                  }
                />
                {stage === 3 && (
                  <div className="proof-outcome" aria-live="polite">
                    {run ? (
                      <>
                        <h3>
                          <Check size={18} />
                          {t.result}
                        </h3>
                        <p>
                          {t.predictionWas}: {run.prediction} · {t.observed}: {run.result.peakUnmet}{' '}
                          {t.bundles}
                        </p>
                        <p>{run.prediction === run.result.peakUnmet ? t.matched : t.correction}</p>
                        <p>{t.causal}</p>
                        <dl className="proof-summary">
                          <div>
                            <dt>{t.peak}</dt>
                            <dd>
                              {run.result.peakUnmet}
                              <small>{t.bundles}</small>
                            </dd>
                          </div>
                          <div>
                            <dt>{t.totalUnused}</dt>
                            <dd>
                              {run.result.unusedTotal}
                              <small>{t.unusedUnit}</small>
                            </dd>
                          </div>
                        </dl>
                      </>
                    ) : (
                      <p>{previous ? t.stale : t.awaiting}</p>
                    )}
                    {previous && run && (
                      <p className="proof-comparison">
                        {t.compare}: {previous.result.allocation} {t.allocationUnit} →{' '}
                        {previous.result.peakUnmet} {t.peak.toLowerCase()},{' '}
                        {previous.result.unusedTotal} {t.unusedUnit} {t.unused.toLowerCase()}.{' '}
                        {t.compareNote}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        <div className="proof-understanding">
          <SavvyShark compact>
            <p>{t.mentor[stage]}</p>
          </SavvyShark>
          {stage >= 2 && (
            <details>
              <summary>{t.assumptions}</summary>
              <p>{t.limits}</p>
            </details>
          )}
        </div>
        {stage === 3 && run && (
          <fieldset className="proof-reflection">
            <legend>{t.reflection}</legend>
            {t.reflectChoices.map((choice, i) => (
              <button
                key={choice}
                type="button"
                aria-pressed={reflection === i}
                onClick={() => setReflection(i)}
              >
                {choice}
              </button>
            ))}
            {reflection !== null && <p role="status">{t.reflectFeedback[reflection]}</p>}
          </fieldset>
        )}
        <footer className="proof-footer">
          <button type="button" disabled={stage === 0} onClick={() => navigate(stage - 1)}>
            <ArrowLeft size={16} />
            {t.previous}
          </button>
          {stage < 3 ? (
            <button type="button" onClick={() => navigate(stage + 1)}>
              {t.next}
              <ArrowRight size={16} />
            </button>
          ) : (
            <p>
              <CornerDownLeft size={16} />
              {t.continuation}
            </p>
          )}
        </footer>
        <details className="proof-references">
          <summary>{t.references}</summary>
          <p>{t.sourceNote}</p>
          <ul>
            {t.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </main>
    </div>
  );
}
