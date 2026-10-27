'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { nb, regionLabels } from '@/content/nb';
import {
  activities,
  experiment,
  type Activity,
  type Input,
  type Result,
} from '@/domain/curriculum/expansion-models';
import { trackUnits, criteria, type Track, type Unit } from '@/domain/curriculum/expansion';
import {
  bindings,
  expansionSources,
  manuscript,
  type Manuscript,
} from '@/domain/curriculum/expansion-content';
import { useExpansion } from './expansion-provider';
import { SavvyShark } from '@/features/course/savvy-shark';
import { ResponsibilityExplorer } from '@/features/portal/responsibility';
import './expansion.css';
import { ModelVisual } from './expansion-visuals';
import { LabEntry, BenefitsLabBridge } from '@/features/course/practical-lab';
import { MissionEntry } from '@/features/course/missions';
import { TransferPreparation } from './cloud-transfer';
const t = nb.expansion.common;
export function ExpandedModule({
  track,
  topic,
  technicalReady = false,
  embedded = false,
}: {
  track: Track;
  topic: string;
  technicalReady?: boolean;
  embedded?: boolean;
}) {
  const learning = useExpansion(track, technicalReady),
    [confirm, setConfirm] = useState(false);
  const c = manuscript(track, topic),
    unit = topic as Unit;
  useEffect(() => {
    if (learning.ready && c) learning.store.event({ kind: 'visit', unit });
  }, [learning.ready, learning.store, c, unit]);
  return (
    <article className={`expanded-module ${embedded ? 'expanded-embedded' : ''}`}>
      {learning.issue && (
        <div className="course-storage" role="status">
          <p>
            {t.storage} ({learning.issue})
          </p>
          {learning.issue === 'unsaved' && <p>{t.memory}</p>}
          <button onClick={learning.store.load}>{t.reload}</button>
          <button onClick={() => setConfirm(true)}>{t.reset}</button>
          {confirm && (
            <button
              onClick={() => {
                learning.store.clear();
                setConfirm(false);
              }}
            >
              {t.confirmReset}
            </button>
          )}
        </div>
      )}
      {topic === 'assessment' ? (
        <ExpandedAssessment track={track} />
      ) : topic === 'summary' ? (
        <ExpandedSummary track={track} technicalReady={technicalReady} />
      ) : c ? (
        <>
          <header className="expanded-heading">
            <small>{c.objective}</small>
            {embedded ? (
              <h3 data-activity-heading tabIndex={-1}>
                {c.title}
              </h3>
            ) : (
              <h2 data-activity-heading tabIndex={-1}>
                {c.title}
              </h2>
            )}
            <p>{c.prerequisite}</p>
          </header>
          {track === 'services' && topic === trackUnits[track][0] && (
            <p className="expanded-intro">{nb.expansion[track].intro}</p>
          )}
          <p className="expanded-intuition">{c.intuition}</p>
          <div className="expanded-explanation">
            <section>
              <h3>{t.mechanism}</h3>
              <p>{c.mechanism}</p>
            </section>
            <section>
              <h3>{t.azure}</h3>
              <p>{c.azure}</p>
            </section>
          </div>
          <section className="expanded-worked">
            <h3>{t.worked}</h3>
            <p>{c.example}</p>
          </section>
          <section className="expanded-assumptions">
            <h3>{t.limits}</h3>
            <p>{c.limits}</p>
          </section>
          <SavvyShark compact>
            <dl className="expanded-guidance">
              {(['goal', 'why', 'action', 'expect'] as const).map((k) => (
                <div key={k}>
                  <dt>{t[k]}</dt>
                  <dd>{c[k]}</dd>
                </div>
              ))}
            </dl>
          </SavvyShark>
          {unit === 'overview' ? (
            <ResponsibilityExplorer
              context="services-v2"
              guide
              onCompare={(model) =>
                learning.store.event({
                  kind: 'run',
                  unit: 'overview',
                  input: { model },
                  prediction: null,
                })
              }
            />
          ) : unit !== 'practice' ? (
            <Experiment key={`experiment-${unit}`} track={track} unit={unit} />
          ) : (
            <p className="expanded-technical" role="status">
              {technicalReady ? t.technicalReady : t.technicalMissing} {t.technicalRequired}
            </p>
          )}
          <section className="expanded-counterexample">
            <h3>{t.counterexample}</h3>
            <p>{c.misconception}</p>
          </section>
          <GuidedAnswer
            key={`answer-${unit}`}
            track={track}
            unit={unit}
            content={c}
            technicalReady={technicalReady}
          />
          {track === 'benefits' && <TransferPreparation topic={topic} />}
          <details>
            <summary>{t.terms}</summary>
            <dl>
              {c.terms.map(([term, meaning]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
          {track === 'benefits' && unit === 'reliability' && <MissionEntry id="diagnose" />}
          {track === 'benefits' && unit === 'governance' && <MissionEntry id="governance" />}
          {track === 'services' && unit === 'iaas' && <MissionEntry id="infrastructure" />}
          {track === 'services' && unit === 'paas' && <MissionEntry id="platform" />}
          {track === 'services' && ['iaas', 'paas', 'saas'].includes(unit) && (
            <LabEntry
              kind={unit === 'iaas' ? 'vm' : (unit as 'paas' | 'saas')}
              origin={{ module: 'services', topic: unit }}
            />
          )}
          {track === 'benefits' && <BenefitsLabBridge topic={unit} />}
          <Sources unit={unit} />
          <nav className="expanded-evidence">
            <Link href={`/learn/${track}?topic=assessment`}>{t.assessment}</Link>
            <Link href={`/learn/${track}?topic=summary`}>{t.summary}</Link>
          </nav>
        </>
      ) : null}
    </article>
  );
}
function Sources({ unit }: { unit: Unit }) {
  return (
    <details className="expanded-sources">
      <summary>{t.sources}</summary>
      <p>{t.review}</p>
      <ul>
        {bindings[unit].sources.map((id) => (
          <li key={id}>
            <a href={expansionSources[id]!.url} target="_blank" rel="noreferrer">
              {id} · Microsoft Learn ↗
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
export function ExpansionReference({ track, topic }: { track: Track; topic: string }) {
  const [unit, setUnit] = useState<Unit>(
    (trackUnits[track] as readonly string[]).includes(topic)
      ? (topic as Unit)
      : trackUnits[track][0],
  );
  const learning = useExpansion(track);
  useEffect(() => {
    if (learning.facts.active) learning.store.event({ kind: 'aid' });
  }, [learning.facts.active, learning.store]);
  const c = manuscript(track, unit)!;
  return (
    <article className="expanded-reference">
      <label>
        {nb.official.unitLabel}
        <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          {trackUnits[track].map((id) => (
            <option key={id} value={id}>
              {manuscript(track, id)!.title}
            </option>
          ))}
        </select>
      </label>
      <h2>{c.title}</h2>
      {(
        [
          'prerequisite',
          'intuition',
          'mechanism',
          'azure',
          'example',
          'misconception',
          'limits',
        ] as const
      ).map((key) => (
        <section key={key}>
          <h3>
            {key === 'intuition'
              ? t.goal
              : key === 'example'
                ? t.worked
                : key === 'misconception'
                  ? t.counterexample
                  : key === 'prerequisite'
                    ? t.prerequisite
                    : t[key]}
          </h3>
          <p>{c[key]}</p>
        </section>
      ))}
      <Sources unit={unit} />
    </article>
  );
}
function GuidedAnswer({
  track,
  unit,
  content: c,
  technicalReady,
}: {
  track: Track;
  unit: Unit;
  content: Manuscript;
  technicalReady: boolean;
}) {
  const { facts, store, ready, issue } = useExpansion(track, technicalReady),
    [choice, setChoice] = useState('');
  const answered = facts.answers[unit],
    feedback = c.choices.find((x) => x[0] === answered)?.[2],
    requirements = unit === 'practice' ? [] : activities[unit].required;
  return (
    <form
      className="expanded-practice"
      onSubmit={(e) => {
        e.preventDefault();
        store.event({ kind: 'answer', unit, answer: choice });
      }}
    >
      <h3>{t.required}</h3>
      <ul className="expanded-witnesses">
        {requirements.map((w) => (
          <li key={w} data-observed={facts.witnesses.get(unit)?.has(w) ?? false}>
            {facts.witnesses.get(unit)?.has(w) ? '✓' : '○'}{' '}
            {t.witnesses[w as keyof typeof t.witnesses]}
          </li>
        ))}
      </ul>
      <fieldset
        disabled={!ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '')}
      >
        <legend>{c.question}</legend>
        {c.choices.map(([id, label]) => (
          <label key={id}>
            <input
              type="radio"
              name={`apply-${unit}`}
              required
              checked={choice === id}
              onChange={() => setChoice(id!)}
            />
            {label}
          </label>
        ))}
        <button disabled={!facts.observed(unit) || (unit === 'practice' && !technicalReady)}>
          {t.check}
        </button>
      </fieldset>
      {!facts.observed(unit) && <p>{t.wait}</p>}
      {feedback && (
        <p className="expanded-causal" role="status">
          {feedback}
        </p>
      )}
      {facts.guided(unit) && (
        <p role="status">
          {t.practiced} · {c.objective}
        </p>
      )}
    </form>
  );
}
function valueLabel(id: string | number) {
  return typeof id === 'number'
    ? String(id)
    : id === 'sub-app'
      ? 'App Sandbox'
      : id === 'sub-shared'
        ? 'Shared Sandbox'
        : id in regionLabels
          ? regionLabels[id as keyof typeof regionLabels]
          : ((t.values as Record<string, string>)[id] ??
            (id === 'yes' ? t.results.yes : id === 'no' ? t.results.no : id));
}
function Experiment({ track, unit }: { track: Track; unit: Activity }) {
  const learning = useExpansion(track),
    last = learning.facts.runs.findLast((r) => r.unit === unit);
  const [input, setInput] = useState<Input>(last?.input ?? activities[unit].initial),
    [prediction, setPrediction] = useState(''),
    [error, setError] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const shown = last && JSON.stringify(last.input) === JSON.stringify(input),
    result = shown ? experiment(unit, last.input) : null;
  const change = (id: string, value: string) => {
    const field = activities[unit].fields.find((f) => f.id === id)!;
    setInput((old) => ({
      ...old,
      [id]: typeof field.values[0] === 'number' ? Number(value) : value,
    }));
    setError(false);
  };
  return (
    <section
      className="expanded-experiment"
      aria-label={manuscript(track, unit)!.title}
      data-unit={unit}
    >
      <div className="expanded-model-layout">
        <div className="expanded-visual">
          <ModelVisual unit={unit} input={input} result={result} />
        </div>
        <form
          ref={form}
          className="expanded-controls"
          onSubmit={(e) => {
            e.preventDefault();
            const p = unit === 'availability' ? Number(prediction) : null;
            if (
              unit === 'availability' &&
              (prediction.trim() === '' || !Number.isInteger(p) || p! < 0 || p! > 30)
            ) {
              setError(true);
              return;
            }
            if (!learning.store.event({ kind: 'run', unit, input, prediction: p })) setError(true);
          }}
        >
          {activities[unit].fields
            .filter(
              (f) =>
                unit !== 'management' ||
                (!(['a', 'b', 'c'].includes(f.id) && input.method === 'template') &&
                  !(f.id === 'template' && input.method === 'manual')),
            )
            .map((field) => (
              <label key={field.id}>
                {t.labels[field.id as keyof typeof t.labels]}
                <select value={input[field.id]} onChange={(e) => change(field.id, e.target.value)}>
                  {field.values.map((v) => (
                    <option key={v} value={v}>
                      {valueLabel(v)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          {unit === 'availability' && (
            <label>
              {t.prediction}
              <input
                aria-label={t.prediction}
                type="number"
                required
                min={0}
                max={30}
                step={1}
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
              <small>{t.predictionHelp}</small>
            </label>
          )}
          <button
            className="primary"
            disabled={
              !learning.ready ||
              ['corrupt', 'unsupported', 'conflict', 'limit'].includes(learning.issue ?? '')
            }
          >
            {t.run}
          </button>
          {error && <p role="alert">{t.invalid}</p>}
        </form>
      </div>
      {result ? (
        <ResultView unit={unit} result={result} prediction={last?.prediction ?? null} />
      ) : (
        <p className="expanded-causal">{t.pending}</p>
      )}
    </section>
  );
}
function ResultView({
  unit,
  result: r,
  prediction,
}: {
  unit: Activity;
  result: Result;
  prediction: number | null;
}) {
  const cause =
    unit === 'paas'
      ? (t.results.paasCause as Record<string, string>)[r.code]
      : unit === 'saas'
        ? r.issues.length
          ? r.issues.map((id) => (t.results.saasCause as Record<string, string>)[id]).join(' ')
          : t.results.saasCause.fit
        : (t.results as Record<string, unknown>)[r.code];
  return (
    <div className="expanded-result" aria-live="polite">
      {unit === 'governance' && r.receipt ? (
        <>
          <p>{t.results.fork}</p>
          <strong>{nb.chapter.errors[r.receipt.code]}</strong>
          <dl className="expanded-metrics">
            {[
              [
                nb.chapter.requestedLocation,
                r.receipt.location ? valueLabel(r.receipt.location) : '—',
              ],
              [nb.chapter.scope, r.receipt.scopeId],
              [nb.chapter.rule, r.receipt.ruleId],
              [nb.chapter.inventory, `${r.receipt.beforeCount} → ${r.receipt.afterCount}`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {r.receipt.policy && (
            <p>
              {r.receipt.policy.assignmentId} · {r.receipt.policy.assignmentScope} ·{' '}
              {r.receipt.policy.allowedLocations.map(valueLabel).join(', ')}
            </p>
          )}
          <p>
            {t.results.permission} {t.results.security}
          </p>
        </>
      ) : (
        <>
          <dl className="expanded-metrics">
            {Object.entries(r.metrics).map(([key, value]) => (
              <div key={key}>
                <dt>{(t.results as Record<string, unknown>)[key] as string}</dt>
                <dd>
                  {value === null
                    ? t.results.undefined
                    : typeof value === 'number'
                      ? Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 }).format(value)
                      : valueLabel(value)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="expanded-causal">{typeof cause === 'string' ? cause : ''}</p>
          {unit === 'iaas' &&
            r.issues.map((id) => (
              <p key={id}>{t.results.vmMissing[id as keyof typeof t.results.vmMissing]}</p>
            ))}
        </>
      )}
      {prediction !== null && (
        <p>
          {t.prediction}: {prediction} · {t.results.served}: {r.metrics.served}
        </p>
      )}
      {['iaas', 'paas', 'saas', 'selection'].includes(unit) && <p>{t.results.noGuarantee}</p>}
    </div>
  );
}
function ExpandedAssessment({ track }: { track: Track }) {
  const { facts, store, ready, issue } = useExpansion(track),
    [help, setHelp] = useState(false),
    task = nb.expansion[track].assessment,
    last = facts.submissions.at(-1),
    blocked = !ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '');
  return (
    <section className="expanded-assessment">
      <h2 data-activity-heading tabIndex={-1}>
        {t.assessment}
      </h2>
      <p>{task.brief}</p>
      <p>{t.summaryNote}</p>
      {facts.active ? (
        <>
          <p>{t.draft}</p>
          {facts.assisted && <p role="status">{t.assisted}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.event({ kind: 'submit' });
            }}
          >
            {task.items.map((q) => (
              <label key={q.id}>
                {q.question}
                {q.id === 'unmet' ? (
                  <input
                    aria-label={q.question}
                    type="number"
                    min={0}
                    max={12}
                    step={1}
                    required
                    value={facts.draft[q.id] ?? ''}
                    onChange={(e) =>
                      store.event({
                        kind: 'draft',
                        answers: { ...facts.draft, [q.id]: e.target.value },
                      })
                    }
                  />
                ) : (
                  <select
                    aria-label={q.question}
                    required
                    value={facts.draft[q.id] ?? ''}
                    onChange={(e) =>
                      store.event({
                        kind: 'draft',
                        answers: { ...facts.draft, [q.id]: e.target.value },
                      })
                    }
                  >
                    <option value="">{t.choose}</option>
                    {q.choices.map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            ))}
            <button
              className="primary"
              disabled={blocked || Object.keys(criteria[track]).some((id) => !facts.draft[id])}
            >
              {t.submit}
            </button>
          </form>
          <button
            onClick={() => {
              if (store.event({ kind: 'aid' })) setHelp(true);
            }}
          >
            {t.hint}
          </button>
          {help && <p>{t.hintText}</p>}
          <button disabled={blocked} onClick={() => store.event({ kind: 'abandon' })}>
            {t.cancel}
          </button>
        </>
      ) : (
        <>
          <button
            disabled={blocked}
            onClick={() => {
              if (store.event({ kind: 'begin' })) setHelp(false);
            }}
          >
            {last ? t.newAttempt : t.begin}
          </button>
          {last && (
            <section className="expanded-assessment-feedback" role="status">
              <h3>{last.retry ? t.retry : last.assisted ? t.firstAssisted : t.first}</h3>
              <p>{t.submitted}</p>
              {task.items.map((q) => (
                <section key={q.id}>
                  <h4>{q.question}</h4>
                  <p>{last.criteria[q.id] ? nb.foundations.correct : nb.foundations.incorrect}</p>
                  <p>{q.explanation}</p>
                </section>
              ))}
            </section>
          )}
        </>
      )}
      {facts.attempts.some((a) => a.status === 'abandoned') && <p>{t.cancelledNote}</p>}
      <Link href={`/learn/${track}?topic=summary`}>{t.summary}</Link>
    </section>
  );
}
function ExpandedSummary({ track, technicalReady }: { track: Track; technicalReady: boolean }) {
  const { facts } = useExpansion(track, technicalReady);
  return (
    <section className="expanded-summary">
      <h2 data-activity-heading tabIndex={-1}>
        {t.summary}
      </h2>
      <p>{t.summaryNote}</p>
      <p>{facts.guidedComplete ? t.guidedComplete : t.guidedIncomplete}</p>
      <table>
        <thead>
          <tr>
            <th>{nb.course.learning}</th>
            <th>{t.introduced}</th>
            <th>{t.practiced}</th>
          </tr>
        </thead>
        <tbody>
          {trackUnits[track].map((unit) => (
            <tr key={unit}>
              <th>
                <Link href={`/learn/${track}?topic=${unit}`}>{manuscript(track, unit)!.title}</Link>
              </th>
              <td>{facts.introduced.has(unit) ? t.introduced : t.notYet}</td>
              <td>{facts.guided(unit) ? t.practiced : t.notYet}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>{t.assessment}</h3>
      {facts.submissions.length ? (
        facts.submissions.map((s) => (
          <p key={s.attempt}>
            #{s.attempt} · {s.retry ? t.retry : s.assisted ? t.firstAssisted : t.first} ·{' '}
            {Object.entries(s.criteria)
              .map(
                ([id, ok]) =>
                  `${nb.expansion[track].assessment.items.find((q) => q.id === id)?.question}: ${ok ? nb.foundations.correct : nb.foundations.incorrect}`,
              )
              .join(' · ')}
          </p>
        ))
      ) : (
        <p>{t.noAssessment}</p>
      )}
      {facts.attempts
        .filter((a) => a.status === 'abandoned')
        .map((a) => (
          <p key={a.number}>
            #{a.number} · {t.cancelled}
          </p>
        ))}
      <Link href={`/learn/${track}?topic=assessment`}>
        {facts.active ? t.resumeAssessment : t.assessment}
      </Link>
    </section>
  );
}
