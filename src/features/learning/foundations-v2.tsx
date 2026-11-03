'use client';
import { RelatedActivities } from './related-activities';
import { ownerAcceptanceNb as acceptance } from '@/content/nb';
import { SourceDisclosure } from './source-disclosure';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { nb } from '@/content/nb';
import {
  checks,
  beginnerSources,
  hostAllocation,
  laterUnits,
  provisioningResult,
  v2Bindings,
  v2Criteria,
  v2Topics,
  type CheckId,
  type V2Topic,
} from '@/domain/curriculum/foundations-v2';
import {
  capacityProof,
  campaignDemand,
  workedDemand,
  type Allocation,
} from '@/domain/curriculum/capacity';
import { units, sourceUrl } from '@/domain/curriculum/manifest';
import { useFoundationsV2 } from './v2-provider';
import { Server, CapacityBoard } from './foundations-visuals';
import { VersionedInvestigation } from './investigation';
import { ResponsibilityRecap } from './responsibility-recap';
import { CloudDeployment } from './cloud-deployment';
import './foundations-visuals.css';
import './foundations-v2.css';
const t = nb.foundationsV2,
  p = nb.foundationsVisuals;
export function foundationsSources(topic: V2Topic): { id: string; url: string }[] {
  const unit = laterUnits.find((u) => topic === `v2-${u}`);
  return unit
    ? units.find((u) => u.id === unit)!.sources.map((id) => ({ id, url: sourceUrl(id) }))
    : v2Bindings
        .find((b) => b.topic === topic)!
        .sources.map((id) => ({
          id,
          url: id.startsWith('BL')
            ? beginnerSources[id as keyof typeof beginnerSources]
            : sourceUrl(id as 'L02'),
        }));
}
export function FoundationsV2({
  topic,
  journal = false,
  embedded = false,
  focusPart = false,
}: {
  topic: string;
  journal?: boolean;
  embedded?: boolean;
  focusPart?: boolean;
}) {
  const v2 = useFoundationsV2(),
    { store, facts } = v2;
  const [part, setPart] = useState<(typeof p.parts)[number]['id']>('cpu');
  const [trace, setTrace] = useState(0),
    [catalogue, setCatalogue] = useState(false);
  const onProject = useCallback(() => {}, []);
  const section = useRef<HTMLElement>(null);
  const unit = laterUnits.find((u) => topic === `v2-${u}`);
  const copy = t.topics[topic as V2Topic];
  const onPractice = useCallback(
    (event: unknown) => store.event({ kind: 'practice', event }),
    [store],
  );
  const expose = useCallback(() => {
    if (!v2.ready || !copy || journal || v2.issue) return;
    if (!store.event({ kind: 'visit', topic })) return;
    if (unit) onPractice({ kind: 'visit', unit });
  }, [v2.ready, v2.issue, copy, journal, store, topic, unit, onPractice]);
  useEffect(() => {
    if (!v2.ready || !copy || journal || v2.issue) return;
    if (!embedded) {
      expose();
      return;
    }
    // A mounted chapter is not exposure to every part. Observe the actual
    // explanation inside the reading viewport, not its offscreen wrapper.
    const target = section.current?.querySelector('.v2-explanation > p');
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          document.visibilityState === 'visible' &&
          entries.some(
            (entry) =>
              entry.isIntersecting &&
              entry.intersectionRect.height >= Math.min(64, entry.boundingClientRect.height),
          )
        ) {
          expose();
          observer.disconnect();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '-84px 0px -160px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [v2.ready, v2.issue, copy, store, topic, journal, unit, onPractice, embedded, expose]);
  if (topic === 'v2-assessment') return <V2Assessment />;
  if (topic === 'v2-summary') return <V2Summary />;
  if (!copy) return null;
  const selected = p.parts.find((item) => item.id === part)!;
  return (
    <article
      ref={section}
      onFocusCapture={
        embedded
          ? (event) => {
              if (
                event.target instanceof HTMLElement &&
                event.target.matches('button,input,select,textarea')
              )
                expose();
            }
          : undefined
      }
      id={`cloud-part-${topic}`}
      className={`foundations-v2 proof-shell${embedded ? ' cloud-chapter-part' : ''}`}
      aria-label={copy.title}
    >
      {!embedded && v2.issue && (
        <div className="course-storage" role="status">
          <p>
            {t.storage} ({v2.issue})
          </p>
          <button onClick={store.load}>{nb.course.reload}</button>
          <button onClick={store.clear}>{t.reset}</button>
        </div>
      )}
      <header className="v2-lesson-heading">
        {embedded ? (
          <h3 data-activity-heading={focusPart || undefined} tabIndex={-1}>
            {copy.title}
          </h3>
        ) : (
          <>
            <small>{t.badge}</small>
            <h2 data-activity-heading tabIndex={-1}>
              {copy.title}
            </h2>
          </>
        )}
        {!embedded && <p>{copy.objective}</p>}
      </header>
      {topic !== 'v2-capacity' && (
        <div
          className={`v2-teaching ${unit === 'models' || unit === 'responsibility' ? 'v2-comparison' : ''}`}
        >
          <section
            className="v2-explanation"
            aria-label={`${nb.foundations.purpose} · ${copy.title}`}
          >
            <p>{copy.text}</p>
            <p>{copy.detail}</p>
            {topic === 'intro-request' && (
              <>
                <button
                  type="button"
                  className="proof-primary"
                  onClick={() => {
                    setTrace(1);
                    store.event({ kind: 'request' });
                  }}
                >
                  {trace ? p.replay : p.send}
                </button>
                {trace > 0 && (
                  <>
                    <p role="status" className="proof-causal">
                      {t.traceSteps[trace - 1]}
                    </p>
                    {trace < 3 && (
                      <button type="button" onClick={() => setTrace((n) => n + 1)}>
                        {t.traceNext}
                      </button>
                    )}
                  </>
                )}
                <label className="v2-toggle">
                  <input
                    type="checkbox"
                    checked={catalogue}
                    onChange={(e) => setCatalogue(e.target.checked)}
                  />
                  {p.websiteNote}
                </label>
              </>
            )}
            {topic === 'physical-server' && (
              <>
                <div className="proof-parts" role="group" aria-label={p.selectPart}>
                  {p.parts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={part === item.id}
                      onClick={() => {
                        setPart(item.id);
                        store.event({ kind: 'inspect', part: item.id });
                      }}
                    >
                      {item.name}
                      <span>{item.role}</span>
                    </button>
                  ))}
                </div>
                <p className="proof-part-detail" role="status">
                  <strong>{selected.name}</strong>
                  {selected.explanation}
                </p>
              </>
            )}
          </section>
          <section className="v2-model" aria-label={copy.objective}>
            {(topic === 'intro-request' || topic === 'physical-server') && (
              <div className={`proof-system ${trace ? 'v2-traced' : ''}`}>
                <Server
                  idPrefix={embedded ? `${topic}-` : undefined}
                  selected={topic === 'intro-request' ? 'app' : part}
                  request={topic === 'intro-request'}
                  phase={trace}
                />
                <p>{topic === 'intro-request' ? p.pathNote : selected.role}</p>
                {topic === 'intro-request' && (
                  <ol className={trace ? 'proof-trace proof-trace-sent' : 'proof-trace'}>
                    <li data-active={trace === 1}>{p.browser}</li>
                    <li data-active={trace === 2}>{p.parts[5].name}</li>
                    {catalogue && <li>{nb.foundationsV2.database}</li>}
                    <li data-active={trace === 3}>{p.response}</li>
                  </ol>
                )}
              </div>
            )}
            {topic === 'virtualization' && <Virtualization />}
            {topic === 'provisioning' && <Provisioning />}
            {topic === 'capacity-basics' && (
              <CapacityBoard
                worked
                allocation={6}
                result={capacityProof({ allocation: 6, demand: workedDemand })}
              />
            )}
            {unit === 'responsibility' && <ResponsibilityRecap />}
            {unit === 'models' && <CloudDeployment />}
          </section>
        </div>
      )}
      {topic === 'v2-capacity' && <CapacityExperiment />}
      {Object.hasOwn(checks, topic) && !journal && <PrerequisiteCheck topic={topic as CheckId} />}
      {unit && (
        <>
          <section className="v2-manuscript" aria-label={`${t.journal} · ${copy.title}`}>
            {(['purpose', 'mechanism', 'azure', 'example', 'misconception', 'limits'] as const).map(
              (key) => (
                <section key={key}>
                  <h3>{nb.foundations[key]}</h3>
                  <p>{nb.foundations.units[unit][key]}</p>
                </section>
              ),
            )}
            <dl>
              {nb.foundations.units[unit].terms.map(([term, meaning]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
          {!journal && (
            <VersionedInvestigation
              key={unit}
              unit={unit}
              onProject={onProject}
              learning={{
                save: facts.practice,
                facts: facts.observed,
                issue: v2.issue,
                store: { event: onPractice },
                openJournal: () => {
                  if (facts.active) store.event({ kind: 'aid' });
                },
              }}
            />
          )}
        </>
      )}
      {!embedded && (
        <>
          <p className="source-context">{p.sourceNote}</p>
          <SourceDisclosure entries={foundationsSources(topic as V2Topic)} />
        </>
      )}
      {!journal && !embedded && (
        <RelatedActivities
          assessment="/learn/computing?topic=v2-assessment"
          observations="/learn/computing?topic=v2-summary"
        />
      )}
    </article>
  );
}
function PrerequisiteCheck({ topic }: { topic: CheckId }) {
  const { store, save, facts } = useFoundationsV2(),
    item = t.checkItems[topic];
  const [choice, setChoice] = useState('');
  const last = save.events.findLast((e) => e.kind === 'check' && e.topic === topic);
  const capacityReady =
    topic !== 'v2-capacity' || [6, 10].every((n) => facts.runs.some((r) => r.allocation === n));
  return (
    <form
      className="v2-check"
      onSubmit={(e) => {
        e.preventDefault();
        store.event({ kind: 'check', topic, answer: choice });
      }}
    >
      <fieldset>
        <legend>{item.question}</legend>
        {item.choices.map(([id, label]) => (
          <label key={id}>
            <input
              type="radio"
              required
              name={`check-${topic}`}
              checked={choice === id}
              onChange={() => setChoice(id)}
            />
            {label}
          </label>
        ))}
        <button disabled={!capacityReady} type="submit">
          {t.check}
        </button>
        {!capacityReady && <p>{nb.foundationsVisuals.compareNote}</p>}
      </fieldset>
      {last?.kind === 'check' && (
        <p role="status" className="proof-causal">
          {last.answer === checks[topic][0] ? item.correct : item.wrong}
        </p>
      )}
    </form>
  );
}
function Virtualization() {
  const { store, facts } = useFoundationsV2();
  const [accepted, setAccepted] = useState<[number, number]>(facts.memory),
    [requested, setRequested] = useState<[number, number]>([3, 3]),
    [outcome, setOutcome] = useState<'accepted' | 'rejected' | null>(null);
  const v = t.vm;
  return (
    <div className="v2-vm">
      <strong>{v.host}</strong>
      <div className="v2-host-budget" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            className={i < accepted[0] ? 'vm-a' : i < accepted[0] + accepted[1] ? 'vm-b' : ''}
            key={i}
          />
        ))}
      </div>
      <div className="v2-guests">
        {accepted.map((value, i) => (
          <div key={i}>
            <strong>
              VM {i === 0 ? 'A' : 'B'} · {value} {v.unit}
            </strong>
            <p>{v.guest}</p>
          </div>
        ))}
      </div>
      <p className="v2-hypervisor">{v.hypervisor}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = hostAllocation(accepted, requested);
          setAccepted(result.accepted as [number, number]);
          setOutcome(result.outcome);
          store.event({ kind: 'memory', requested });
        }}
      >
        <div className="v2-selects">
          {[v.a, v.b].map((label, i) => (
            <label key={label}>
              {label}
              <select
                aria-label={label}
                value={requested[i]}
                onChange={(e) =>
                  setRequested(
                    (old) =>
                      old.map((n, j) => (i === j ? Number(e.target.value) : n)) as [number, number],
                  )
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button>{v.apply}</button>
      </form>
      <p>
        {v.requested}: {requested.join(' + ')} / 8
      </p>
      <p>
        {v.accepted}: {accepted.join(' + ')} / 8
      </p>
      {outcome && <p role="status">{outcome === 'accepted' ? v.ok : v.denied}</p>}
    </div>
  );
}
function Provisioning() {
  const { store } = useFoundationsV2();
  const [mode, setMode] = useState('cloud'),
    [supported, setSupported] = useState(true),
    [run, setRun] = useState<{ mode: string; supported: boolean } | null>(null),
    v = t.provision;
  return (
    <div className="v2-provision">
      <label>
        {v.mode}
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setRun(null);
          }}
        >
          <option value="owned">{v.owned}</option>
          <option value="cloud">{v.cloud}</option>
        </select>
      </label>
      <div className="v2-lane">
        <strong>{v.control}</strong>
        <p>{mode === 'owned' ? v.local : v.provider}</p>
      </div>
      <div className="v2-lane">
        <strong>{v.workload}</strong>
        <p>{v.traffic}</p>
      </div>
      <label>
        <input
          type="checkbox"
          checked={supported}
          onChange={(e) => {
            setSupported(e.target.checked);
            setRun(null);
          }}
        />
        {v.available}
      </label>
      <button
        type="button"
        onClick={() => {
          setRun({ mode, supported });
          store.event({ kind: 'provision', supported });
        }}
      >
        {v.request}
      </button>
      {run && (
        <section role="status">
          <h3>{v.result}</h3>
          <p>{provisioningResult(run.supported) === 'allocated' ? v.accepted : v.denied}</p>
        </section>
      )}
    </div>
  );
}
function CapacityExperiment() {
  const { store, facts } = useFoundationsV2();
  const [allocation, setAllocation] = useState<Allocation>(6),
    [prediction, setPrediction] = useState(''),
    [error, setError] = useState(false);
  const [current, setCurrent] = useState<null | { allocation: Allocation; prediction: number }>(
    facts.runs.at(-1) ?? null,
  );
  const last = current?.allocation === allocation ? current : null;
  const previous = facts.runs.findLast((r) => r.allocation !== allocation);
  const result = last
    ? capacityProof({ allocation: last.allocation, demand: campaignDemand })
    : null;
  return (
    <div className="v2-teaching">
      <section className="v2-explanation">
        <p>{t.topics['v2-capacity'].text}</p>
        <p>{t.topics['v2-capacity'].detail}</p>
        <form
          className="v2-capacity-controls"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(prediction);
            if (prediction.trim() === '' || !Number.isInteger(n) || n < 0 || n > 12) {
              setError(true);
              return;
            }
            if (store.event({ kind: 'capacity', allocation, prediction: n })) {
              setCurrent({ allocation, prediction: n });
              setError(false);
            }
          }}
        >
          <fieldset>
            <legend>{p.allocationLabel}</legend>
            {([4, 6, 10] as const).map((n) => (
              <label key={n}>
                <input
                  type="radio"
                  name="v2-allocation"
                  checked={n === allocation}
                  onChange={() => {
                    setAllocation(n);
                    setCurrent(null);
                    setPrediction('');
                  }}
                />
                {n} {p.allocationUnit}
              </label>
            ))}
          </fieldset>
          <label>
            {p.prediction}
            <input
              type="number"
              min="0"
              max="12"
              step="1"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            />
          </label>
          <p>{p.predictionHint}</p>
          {error && <p role="alert">{p.invalid}</p>}
          <button type="submit">{p.run}</button>
        </form>
      </section>
      <section className="v2-model">
        <CapacityBoard allocation={allocation} result={result} />
        <div aria-live="polite">
          {result && last ? (
            <>
              <p>
                {p.predictionWas}: {last.prediction} · {p.observed}: {result.peakUnmet} {p.bundles}
              </p>
              <p>{last.prediction === result.peakUnmet ? p.matched : p.correction}</p>
              <p>{p.causal}</p>
              <p>
                {p.totalUnused}: {result.unusedTotal} {p.unusedUnit}
              </p>
            </>
          ) : (
            <p>{facts.runs.length ? p.stale : p.awaiting}</p>
          )}
          {previous && result && (
            <p>
              {p.compare}: {previous.allocation} {p.allocationUnit} ·{' '}
              {
                capacityProof({ allocation: previous.allocation, demand: campaignDemand })!
                  .peakUnmet
              }{' '}
              {p.peak.toLowerCase()} ·{' '}
              {
                capacityProof({ allocation: previous.allocation, demand: campaignDemand })!
                  .unusedTotal
              }{' '}
              {p.unusedUnit}. {p.compareNote}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
const assessmentItems = [
  ...t.extraItems,
  ...nb.foundations.transferItems
    .filter((item) => item.id !== 'shortfall')
    .map((item) => (item.id === 'commitment' ? { ...item, question: t.commitmentQuestion } : item)),
];
function V2Assessment() {
  const [delivered, setDelivered] = useState(false);
  const revealSummary = useCallback(
    (node: HTMLHeadingElement | null) => {
      if (!node || !delivered) return;
      const frame = requestAnimationFrame(() => {
        if (!node.isConnected) return;
        node.scrollIntoView({ block: 'center', behavior: 'instant' });
        node.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    },
    [delivered],
  );
  const { store, facts, issue, save } = useFoundationsV2(),
    last = facts.submissions.at(-1),
    disabled = !!issue,
    terminalSubmit = issue === 'limit' && save.schema === 3;
  return (
    <article className="foundations-v2 v2-assessment">
      <h2 data-activity-heading tabIndex={-1}>
        {t.assessment}
      </h2>
      <p>{t.assessmentIntro}</p>
      <p>{t.assessmentRules}</p>
      <p className="v2-attempt-note">{acceptance.leaveNote}</p>
      {facts.assisted && <p role="status">{t.aid}</p>}
      {terminalSubmit && <p role="status">{acceptance.historyFull}</p>}
      {facts.active ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (store.event({ kind: 'submit', answers: facts.draft })) setDelivered(true);
          }}
        >
          {assessmentItems.map((item) => (
            <fieldset key={item.id} disabled={disabled}>
              <legend>{item.question}</legend>
              {item.id === 'shortfall' ? (
                <input
                  type="number"
                  required
                  aria-label={item.question}
                  min="0"
                  max="12"
                  value={facts.draft[item.id] ?? ''}
                  onChange={(e) =>
                    store.event({
                      kind: 'draft',
                      answers: { ...facts.draft, [item.id]: e.target.value },
                    })
                  }
                />
              ) : (
                item.choices.map(([id, label]) => (
                  <label key={id}>
                    <input
                      type="radio"
                      required
                      name={`v2-${item.id}`}
                      checked={facts.draft[item.id] === id}
                      onChange={() =>
                        store.event({ kind: 'draft', answers: { ...facts.draft, [item.id]: id } })
                      }
                    />
                    {label}
                  </label>
                ))
              )}
            </fieldset>
          ))}
          <button
            disabled={(disabled && !terminalSubmit) || v2Criteria.some((c) => !facts.draft[c.id])}
          >
            {t.sendAnswers}
          </button>
        </form>
      ) : (
        <>
          {facts.abandoned.length > 0 && (
            <section className="v2-abandoned">
              <h3>{acceptance.abandoned}</h3>
              <p>{acceptance.abandonedNote}</p>
              <details>
                <summary>
                  {acceptance.abandonedAnswers} ({facts.abandoned.length})
                </summary>
                {facts.abandoned.map((attempt, index) => (
                  <section key={index}>
                    <h4>
                      {acceptance.abandoned} {index + 1} ·{' '}
                      {attempt.assisted ? acceptance.assisted : acceptance.practice}
                    </h4>
                    <dl>
                      {assessmentItems
                        .filter((item) => attempt.answers[item.id])
                        .map((item) => (
                          <div key={item.id}>
                            <dt>{item.question}</dt>
                            <dd>{answerLabel(item, attempt.answers[item.id])}</dd>
                          </div>
                        ))}
                    </dl>
                  </section>
                ))}
              </details>
            </section>
          )}
          {last && <V2Feedback submission={last} onSummaryReady={revealSummary} />}
          {facts.submissions.length > 1 && (
            <details className="v2-feedback-history">
              <summary>
                {acceptance.historical} ({facts.submissions.length - 1})
              </summary>
              {facts.submissions.slice(0, -1).map((submission, index) => (
                <section key={index}>
                  <h3>
                    {acceptance.attempt} {index + 1}
                  </h3>
                  <V2Feedback submission={submission} />
                </section>
              ))}
            </details>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (store.event({ kind: 'begin' })) setDelivered(false);
            }}
          >
            {last || facts.abandoned.length ? t.retry : t.beginAssessment}
          </button>
        </>
      )}
    </article>
  );
}
function V2Summary() {
  const { facts } = useFoundationsV2();
  return (
    <article className="foundations-v2">
      <h2>{t.summary}</h2>
      <p>{t.summaryNote}</p>
      <p>{facts.complete ? t.complete : t.incomplete}</p>
      <table>
        <thead>
          <tr>
            <th>{nb.course.learning}</th>
            <th>{t.introduced}</th>
            <th>{t.practiced}</th>
          </tr>
        </thead>
        <tbody>
          {v2Topics.map((id) => (
            <tr key={id}>
              <th>
                <Link href={`/learn/computing?topic=${id}`}>{t.topics[id].title}</Link>
              </th>
              <td>{facts.visited(id) ? t.introduced : '—'}</td>
              <td>{facts.guided(id) ? t.practiced : t.notYet}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {facts.submissions[0]
          ? submissionStatus(facts.submissions[0])
          : nb.foundationsV2.noAssessment}
      </p>
      <Link href="/learn/computing?topic=v2-assessment">{t.assessment}</Link>
    </article>
  );
}

type V2Submission = ReturnType<
  typeof import('@/domain/curriculum/foundations-v2').v2Facts
>['submissions'][number];
function submissionStatus(s: V2Submission) {
  return s.retry
    ? s.assisted
      ? acceptance.assistedPractice
      : acceptance.practice
    : s.assisted
      ? acceptance.assisted
      : acceptance.first;
}
function answerLabel(item: (typeof assessmentItems)[number], value?: string) {
  if (item.id === 'shortfall') return value ?? acceptance.noAnswer;
  return item.choices.find(([id]) => id === value)?.[1] ?? acceptance.noAnswer;
}
const feedbackTopics = {
  shortfall: 'v2-capacity',
  unused: 'v2-capacity',
  cause: 'v2-capacity',
  host: 'virtualization',
  service: 'provisioning',
  duties: 'v2-responsibility',
  exclusive: 'v2-models',
  integration: 'v2-placement',
  idle: 'v2-metering',
  uncertain: 'v2-pricing',
  commitment: 'v2-pricing',
} as const;
function V2Feedback({
  submission,
  onSummaryReady,
}: {
  submission: V2Submission;
  onSummaryReady?: React.Ref<HTMLHeadingElement>;
}) {
  const correct = Object.values(submission.criteria).filter(Boolean).length;
  const review = [
    ...new Set(
      v2Criteria.filter((c) => !submission.criteria[c.id]).map((c) => feedbackTopics[c.id]),
    ),
  ];
  return (
    <section className="v2-feedback" aria-label={acceptance.feedback}>
      <header>
        <p role="status">
          {t.submitted} · <strong>{submissionStatus(submission)}</strong>
        </p>
        <h3 ref={onSummaryReady} tabIndex={-1}>
          {acceptance.criteria}: {correct} / {v2Criteria.length}
        </h3>
        <p>{acceptance.evidenceNote}</p>
      </header>
      {review.length ? (
        <div className="v2-review-areas">
          <h4>{acceptance.reviewAreas}</h4>
          <ul>
            {review.map((topic) => (
              <li key={topic}>
                <Link href={`/learn/computing?topic=${topic}`}>{t.topics[topic].title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{acceptance.allCriteria}</p>
      )}
      <div className="v2-feedback-items">
        {assessmentItems.map((item) => (
          <details key={item.id}>
            <summary>
              <span>{item.question}</span>
              <strong data-correct={submission.criteria[item.id]}>
                {submission.criteria[item.id] ? nb.foundations.correct : nb.foundations.incorrect}
              </strong>
            </summary>
            <div className="v2-feedback-detail">
              <h4>{acceptance.answer}</h4>
              <p>{answerLabel(item, submission.answers[item.id])}</p>
              <h4>{acceptance.explanation}</h4>
              <p>{item.explanation}</p>
              <Link
                href={`/learn/computing?topic=${feedbackTopics[item.id as keyof typeof feedbackTopics]}`}
              >
                {acceptance.review}
              </Link>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
