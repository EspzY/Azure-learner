'use client';
import { useEffect, useState } from 'react';
import { serverlessNb as c } from '@/content/nb';
import {
  executeEvents,
  validExecution,
  initialExecution,
  serverlessCriteria,
  serverlessManifest,
  type ExecutionInput,
  type ServerlessCriterion,
  type ServerlessTopic,
} from '@/domain/curriculum/serverless';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { conceptMilestones } from '@/domain/guidance/milestones';
import { SavvyShark } from '@/features/course/savvy-shark';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { useServerless } from './serverless-provider';
import { ServerlessRecovery } from './serverless-recovery';
import './serverless.css';

export function ServerlessLesson({
  topic,
  journal = false,
  guidanceBlocked = false,
}: {
  topic: ServerlessTopic;
  journal?: boolean;
  guidanceBlocked?: boolean;
}) {
  const s = useServerless();
  useEffect(() => {
    if (s.ready && !journal) s.store.event({ kind: 'visit', topic });
  }, [s.ready, s.store, topic, journal]);
  return (
    <article className="serverless-lesson" aria-label={c.title}>
      <header>
        <small>{c.badge}</small>
        <h2 data-activity-heading tabIndex={-1}>
          {journal ? c.journal : c.topics[topic]}
        </h2>
        <p>{c.objective}</p>
      </header>
      {s.issue && (
        <div className="course-storage" role="status">
          <p>
            {c.storage} ({s.issue})
          </p>
          <button onClick={s.store.load}>{c.reload}</button>
          {!journal && <ServerlessRecovery />}
        </div>
      )}
      <p className="sl-prerequisite">{c.prerequisite}</p>
      {journal ? (
        <>
          {(['concept', 'mechanism', 'hosting'] as const).map((section) => (
            <Theory key={section} section={section} journal />
          ))}
          <Sources />
        </>
      ) : topic === 'serverless-explorer' ? (
        s.ready ? (
          <Explorer blocked={guidanceBlocked} />
        ) : (
          <p>{c.loading}</p>
        )
      ) : topic === 'serverless-assessment' ? (
        <Assessment />
      ) : topic === 'serverless-summary' ? (
        <Summary />
      ) : (
        <Theory
          section={
            topic === 'serverless-concept'
              ? 'concept'
              : topic === 'serverless-mechanism'
                ? 'mechanism'
                : 'hosting'
          }
        />
      )}
    </article>
  );
}
function Theory({
  section,
  journal = false,
}: {
  section: 'concept' | 'mechanism' | 'hosting';
  journal?: boolean;
}) {
  const s = useServerless(),
    copy = c.sections[section];
  const answered = s.save.events.findLast((e) => e.kind === 'study' && e.section === section);
  return (
    <section className="sl-theory">
      <h3>{copy.title}</h3>
      <div className="sl-reading">
        <div>
          {copy.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside>
          {section === 'concept' ? (
            <>
              <div className="sl-problem">
                <span aria-hidden="true">↗</span>
                <h4>{c.sections.concept.title}</h4>
                <div className="sl-burst" aria-hidden="true">
                  {[1, 4, 2, 1, 1, 5, 3, 1, 1, 4].map((n, i) => (
                    <i key={i} style={{ height: `${n * 14}px` }} />
                  ))}
                </div>
                <p>{c.burstCaption}</p>
              </div>
              <dl className="sl-terms">
                {c.terms.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : section === 'mechanism' ? (
            <>
              <Mechanism />
              <dl className="sl-terms">
                {Object.entries(c.events).map(([k, v]) => (
                  <div key={k}>
                    <dt>{v}</dt>
                    <dd>
                      {k === 'upload'
                        ? 'Blob trigger'
                        : k === 'http'
                          ? 'HTTP trigger'
                          : k === 'queue'
                            ? 'Queue trigger'
                            : 'Timer trigger'}
                    </dd>
                  </div>
                ))}
              </dl>
              <p>{c.exampleLabel}</p>
            </>
          ) : (
            <>
              <Ownership />
              <p>{c.sections.hosting.paragraphs[1]}</p>
            </>
          )}
        </aside>
      </div>
      {section === 'hosting' && (
        <section className="sl-plans">
          <h3>{c.planHeading}</h3>
          <div>
            {c.plans.map((p) => (
              <article key={p.name}>
                <h4>{p.name}</h4>
                <p>{p.scale}</p>
                <p>{p.cost}</p>
                <small>{p.limit}</small>
              </article>
            ))}
          </div>
        </section>
      )}
      {!journal && (
        <fieldset className="sl-check">
          <legend>{copy.check}</legend>
          {copy.choices.map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name={section}
                checked={answered?.kind === 'study' && answered.answer === value}
                onChange={() => s.store.event({ kind: 'study', section, answer: value })}
              />
              {label}
            </label>
          ))}
          {answered?.kind === 'study' && (
            <p role="status">{(copy.feedback as Record<string, string>)[answered.answer]}</p>
          )}
        </fieldset>
      )}
    </section>
  );
}
function Mechanism() {
  return (
    <ol className="sl-chain" aria-label={c.topics['serverless-mechanism']}>
      {[c.event, c.trigger, c.execution, c.output].map((label, i) => (
        <li key={label}>
          <span aria-hidden="true">{['◎', 'ϟ', 'ƒ', '✓'][i]}</span>
          <strong>{label}</strong>
          {i < 3 && <b aria-hidden="true">↓</b>}
        </li>
      ))}
    </ol>
  );
}
function Ownership() {
  return (
    <div className="sl-ownership">
      <section>
        <h4>{c.provider}</h4>
        <p>{c.providerTasks}</p>
      </section>
      <section>
        <h4>{c.customer}</h4>
        <p>{c.customerTasks}</p>
      </section>
    </div>
  );
}
function Sources() {
  return (
    <section className="sl-sources">
      <h3>{c.sources}</h3>
      <p>{c.reviewed}</p>
      <ul>
        {Object.entries(serverlessManifest.sources).map(([id, path]) => (
          <li key={id}>
            <a href={`https://learn.microsoft.com/en-us/${path}`} target="_blank" rel="noreferrer">
              {id} · {path.split('/').at(-1) || 'Describe cloud computing'} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.boundary}</p>
    </section>
  );
}

function Explorer({ blocked }: { blocked: boolean }) {
  const s = useServerless(),
    last = s.facts.runs.at(-1);
  const [input, setInput] = useState<ExecutionInput>(last?.input ?? initialExecution),
    [prediction, setPrediction] = useState(''),
    [started, setStarted] = useState(!!last),
    [dialog, setDialog] = useState<'brief' | 'milestone' | null>(null),
    [warning, setWarning] = useState(false);
  const safe = !blocked && !s.facts.active && s.ready && !s.issue;
  // Discard a presentation intent when its context becomes unsafe; never replay it on recovery.
  if (!safe && dialog !== null) setDialog(null);
  const result = last ? executeEvents(last.input) : null;
  const milestone = conceptMilestones['serverless-execution'];
  useEffect(() => {
    const changed = (e: StorageEvent) => {
      if (e.key !== null && e.key !== milestonePreferenceKey) return;
      try {
        const prefs = parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey));
        setWarning(
          !prefs ||
            (prefs.seen.length >= 256 &&
              !prefs.seen.includes(`serverless-execution@${milestone.version}:FC08`)),
        );
      } catch {
        setWarning(true);
      }
    };
    const clear = () => {
      setDialog(null);
      setWarning(false);
      setStarted(false);
      setInput(initialExecution);
      setPrediction('');
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, [milestone.version]);
  const run = () => {
    if (prediction === '' || !Number.isInteger(Number(prediction))) return;
    if (!s.store.event({ kind: 'run', input, prediction: Number(prediction) })) return;
    const current = s.store.getSnapshot();
    if (
      !safe ||
      current.issue ||
      !executeEvents(input)?.started ||
      document.querySelector('dialog[open]')
    )
      return;
    let status: ReturnType<typeof claimMilestone> = 'unavailable';
    try {
      status = claimMilestone(localStorage, `serverless-execution@${milestone.version}:FC08`);
    } catch {
      /* Denied Storage access: manual recall only. */
    }
    setWarning(status === 'unavailable');
    if (status === 'claimed') setDialog('milestone');
  };
  const open = (kind: 'brief' | 'milestone') => {
    if (safe) setDialog(kind);
  };
  const explanation = s.save.events.findLast((e) => e.kind === 'explain');
  return (
    <section className="sl-explorer">
      <p>{c.explorerIntro}</p>
      <p className="sl-assumptions">{c.assumptions}</p>
      {!safe && <p role="status">{c.blocked}</p>}
      {safe && <button onClick={() => open('brief')}>{c.briefOpen}</button>}
      {!started ? (
        <button className="sl-primary" disabled={!safe} onClick={() => open('brief')}>
          {c.start}
        </button>
      ) : (
        <>
          <fieldset
            className="sl-controls"
            disabled={
              !s.ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(s.issue ?? '')
            }
          >
            <legend>{c.practice}</legend>
            <label>
              {c.eventLabel}
              <select
                value={input.event}
                onChange={(e) =>
                  setInput({ ...input, event: e.target.value as ExecutionInput['event'] })
                }
              >
                {Object.entries(c.events).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {(
              [
                ['count', c.count, 0, 12],
                ['slots', c.slots, 1, 4],
                ['rounds', c.rounds, 1, 3],
              ] as const
            ).map(([key, label, min, max]) => (
              <label key={key}>
                {label}
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={input[key]}
                  onChange={(e) => setInput({ ...input, [key]: Number(e.target.value) })}
                />
              </label>
            ))}
            <label>
              {c.situation}
              <select
                value={input.situation}
                onChange={(e) =>
                  setInput({ ...input, situation: e.target.value as ExecutionInput['situation'] })
                }
              >
                {Object.entries(c.situations).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {c.prediction}
              <input
                type="number"
                min={0}
                max={12}
                required
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
            </label>
            <button
              className="sl-primary"
              disabled={
                !validExecution(input) ||
                prediction === '' ||
                !Number.isInteger(Number(prediction)) ||
                Number(prediction) < 0 ||
                Number(prediction) > 12
              }
              onClick={run}
            >
              {c.run}
            </button>
          </fieldset>
          {(!validExecution(input) ||
            (prediction !== '' &&
              (!Number.isInteger(Number(prediction)) ||
                Number(prediction) < 0 ||
                Number(prediction) > 12))) && <p role="status">{c.invalid}</p>}
          {result && last ? (
            <>
              <h3>{c.previous}</h3>
              <p>
                {c.events[result.input.event]} · {result.input.count} / {c.slots}:{' '}
                {result.input.slots} / {c.rounds}: {result.input.rounds} ·{' '}
                {c.situations[result.input.situation]}
              </p>
              <ExecutionTrace result={result} />
              <section className="sl-observation" role="status">
                <h3>{c.compare}</h3>
                <p>
                  {c.predicted}: <strong>{last.prediction}</strong> · {c.observed}:{' '}
                  <strong>{result.completed}</strong> · {c.pending}: {result.pending} · {c.failed}:{' '}
                  {result.failed}
                </p>
                <p>{c.causal}</p>
              </section>
              {safe && (
                <SavvyShark compact>
                  <p>{c.milestone.message}</p>
                  <p>
                    {c.observed}: {result.completed}; {c.pending}: {result.pending}; {c.failed}:{' '}
                    {result.failed}. {c.milestone.limit}
                  </p>
                </SavvyShark>
              )}
              {safe && result.started > 0 && (
                <button onClick={() => open('milestone')}>{c.milestone.recall}</button>
              )}
              <fieldset className="sl-check">
                <legend>{c.guidedCheck}</legend>
                {c.guidedChoices.map(([answer, label]) => (
                  <label key={answer}>
                    <input
                      type="radio"
                      name="sl-cause"
                      checked={explanation?.kind === 'explain' && explanation.answer === answer}
                      onChange={() => s.store.event({ kind: 'explain', answer })}
                    />
                    {label}
                  </label>
                ))}
                {explanation?.kind === 'explain' && (
                  <p role="status">{c.guidedFeedback[explanation.answer]}</p>
                )}
              </fieldset>
              <p>{s.facts.guided ? c.practiceDone : c.practiceRemaining}</p>
            </>
          ) : (
            <p>{c.empty}</p>
          )}
        </>
      )}
      {warning && <p role="status">{c.milestoneStorage}</p>}
      {dialog && safe && (
        <GuidanceWindow
          title={dialog === 'brief' ? c.brief.title : c.milestone.title}
          onClose={() => setDialog(null)}
          onStart={
            dialog === 'brief'
              ? () => {
                  setStarted(true);
                  setDialog(null);
                }
              : undefined
          }
        >
          <SavvyShark>
            <p>{dialog === 'brief' ? c.brief.why : c.milestone.message}</p>
          </SavvyShark>
          {dialog === 'brief' ? (
            <>
              <p>{c.prerequisite}</p>
              <h3>{c.outcomesHeading}</h3>
              <ul>
                {c.brief.outcomes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <h3>{c.stagesHeading}</h3>
              <ol>
                {c.brief.stages.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
              <p>{c.brief.observation}</p>
            </>
          ) : (
            <>
              <p>
                {c.observed}: {result?.completed} · {c.pending}: {result?.pending} · {c.failed}:{' '}
                {result?.failed}
              </p>
              <p>{c.causal}</p>
              <p>{c.milestone.limit}</p>
            </>
          )}
        </GuidanceWindow>
      )}
    </section>
  );
}
function ExecutionTrace({ result }: { result: NonNullable<ReturnType<typeof executeEvents>> }) {
  return (
    <section className="sl-execution" aria-label={c.trace}>
      <div className="sl-pipeline" aria-hidden="true">
        <div className="sl-inbox">
          <small>{c.event}</small>
          <div>
            {result.events.map((e) => (
              <span className={`sl-token ${e.state}`} key={e.id}>
                {String(e.id).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>
        <span className="sl-arrow">→</span>
        <div className="sl-trigger">
          <b>ϟ</b>
          <strong>{c.trigger}</strong>
        </div>
        <span className="sl-arrow">→</span>
        <div className="sl-workers">
          <small>{c.execution}</small>
          {Array.from({ length: result.input.slots }, (_, i) => (
            <div key={i}>
              <b>ƒ</b>
              {result.events
                .filter((e) => e.round !== null && (e.id - 1) % result.input.slots === i)
                .map((e) => (
                  <span key={e.id} className={`sl-token ${e.state}`}>
                    {e.id}
                  </span>
                ))}
            </div>
          ))}
        </div>
        <span className="sl-arrow">→</span>
        <div className="sl-output">
          <b>{result.completed}</b>
          <span>{c.completed}</span>
          {result.failed > 0 && (
            <strong>
              {result.failed} · {c.failed}
            </strong>
          )}
        </div>
      </div>
      <Ownership />
      <table>
        <caption>{c.trace}</caption>
        <thead>
          <tr>
            {[c.event, c.round, c.trigger, c.execution, c.output].map((x) => (
              <th key={x} scope="col">
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.events.map((e) => (
            <tr key={e.id}>
              <th scope="row">
                {e.id} · {c.events[result.input.event]}
              </th>
              <td>{e.round ?? '—'}</td>
              <td>{e.round ? c.started : c.notStarted}</td>
              <td>
                <span className={`sl-status ${e.state}`}>{c[e.state]}</span>
              </td>
              <td>{e.state === 'completed' ? c.outputSaved : c.noOutput}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {result.preparationRounds > 0 && (
        <p>
          {c.prepared}: 1 · {c.round}. {c.situations.cold}
        </p>
      )}
    </section>
  );
}

function Assessment() {
  const s = useServerless(),
    f = s.facts,
    last = f.submissions.at(-1);
  const choose = (id: string, value: string) =>
    s.store.event({ kind: 'draft', answers: { ...f.draft, [id]: value } });
  return (
    <section className="sl-assessment">
      <p>{c.assessIntro}</p>
      {!f.active ? (
        <>
          <button className="sl-primary" onClick={() => s.store.event({ kind: 'begin' })}>
            {f.attempts ? c.retry : c.begin}
          </button>
          {f.attempts > 0 && (
            <p>
              {c.retryLabel} · {c.abandoned}: {f.abandoned}
            </p>
          )}
        </>
      ) : (
        <>
          <p role="status">
            {c.active} · {f.assisted ? c.assisted : c.unaided} ·{' '}
            {f.attempts > 1 ? c.retryLabel : ''}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              s.store.event({ kind: 'submit', answers: f.draft });
            }}
          >
            {Object.entries(c.questions).map(([id, q], i) => (
              <section key={id}>
                {i === 0 && (
                  <header>
                    <h3>{c.cases[0].title}</h3>
                    <p>{c.cases[0].text}</p>
                  </header>
                )}
                {i === 2 && (
                  <header>
                    <h3>{c.cases[1].title}</h3>
                    <p>{c.cases[1].text}</p>
                  </header>
                )}
                <fieldset>
                  <legend>{q.label}</legend>
                  {q.choices.map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={id}
                        value={value}
                        required
                        checked={f.draft[id] === value}
                        onChange={() => choose(id, value)}
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
              </section>
            ))}
            <div className="sl-actions">
              <button className="sl-primary" type="submit">
                {c.submit}
              </button>
              <button type="button" onClick={() => s.store.event({ kind: 'aid' })}>
                {c.aid}
              </button>
              <button type="button" onClick={() => s.store.event({ kind: 'abandon' })}>
                {c.abandon}
              </button>
            </div>
          </form>
          {f.assisted && <p>{c.aidText}</p>}
        </>
      )}
      {!f.active && last && (
        <section className="sl-feedback">
          <h3>{c.feedback}</h3>
          <p>
            {last.assisted ? c.assisted : c.unaided} · {last.retry ? c.retryLabel : ''}
          </p>
          {Object.entries(c.questions).map(([id, q]) => (
            <article key={id}>
              <h4>
                {q.label} · {last.criteria[id] ? c.correct : c.wrong}
              </h4>
              <p>{(q.feedback as Record<string, string>)[last.answers[id]!]}</p>
              {!last.criteria[id] && (
                <p>
                  {
                    (q.feedback as Record<string, string>)[
                      serverlessCriteria[id as ServerlessCriterion].answer
                    ]
                  }
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
function Summary() {
  const s = useServerless();
  return (
    <section>
      <h3>{c.summary}</h3>
      <dl className="sl-summary">
        <dt>{c.taught}</dt>
        <dd>{s.facts.taught ? c.yes : c.no}</dd>
        {(['concept', 'mechanism', 'hosting'] as const).map((section) => (
          <div key={section}>
            <dt>{c.sections[section].title}</dt>
            <dd>{s.facts.studied(section) ? c.yes : c.no}</dd>
          </div>
        ))}
        <dt>{c.guided}</dt>
        <dd>{s.facts.guided ? c.yes : c.no}</dd>
        <dt>{c.independent}</dt>
        <dd>{s.facts.firstIndependent ? c.independentYes : c.independentNo}</dd>
        <dt>{c.abandoned}</dt>
        <dd>{s.facts.abandoned}</dd>
      </dl>
      <p>{c.summaryLimit}</p>
      <Sources />
    </section>
  );
}
