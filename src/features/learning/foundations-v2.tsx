'use client';
import { useCallback, useEffect, useState } from 'react';
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
import { SavvyShark } from '@/features/course/savvy-shark';
import './foundations-visuals.css';
import './foundations-v2.css';
const t = nb.foundationsV2,
  p = nb.foundationsVisuals;
export function FoundationsV2({ topic, journal = false }: { topic: string; journal?: boolean }) {
  const v2 = useFoundationsV2(),
    { store, facts } = v2;
  const [part, setPart] = useState<(typeof p.parts)[number]['id']>('cpu');
  const [trace, setTrace] = useState(0),
    [catalogue, setCatalogue] = useState(false);
  const onProject = useCallback(() => {}, []);
  const unit = laterUnits.find((u) => topic === `v2-${u}`);
  const copy = t.topics[topic as V2Topic];
  const onPractice = useCallback(
    (event: unknown) => store.event({ kind: 'practice', event }),
    [store],
  );
  useEffect(() => {
    if (v2.ready && copy && !journal) store.event({ kind: 'visit', topic });
  }, [v2.ready, copy, store, topic, journal]);
  useEffect(() => {
    if (v2.ready && unit && !journal) onPractice({ kind: 'visit', unit });
  }, [v2.ready, unit, onPractice, journal]);
  if (topic === 'v2-assessment') return <V2Assessment />;
  if (topic === 'v2-summary') return <V2Summary />;
  if (!copy) return null;
  const selected = p.parts.find((item) => item.id === part)!;
  return (
    <article className="foundations-v2 proof-shell" aria-label={copy.title}>
      {v2.issue && (
        <div className="course-storage" role="status">
          <p>
            {t.storage} ({v2.issue})
          </p>
          <button onClick={store.load}>{nb.course.reload}</button>
          <button onClick={store.clear}>{t.reset}</button>
        </div>
      )}
      <header className="v2-lesson-heading">
        <small>
          {t.badge} · {String(v2Topics.indexOf(topic as V2Topic) + 1).padStart(2, '0')} / 12
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {copy.title}
        </h2>
        <p>{copy.objective}</p>
      </header>
      {topic !== 'v2-capacity' && (
        <div
          className={`v2-teaching ${unit === 'models' || unit === 'responsibility' ? 'v2-comparison' : ''}`}
        >
          <section className="v2-explanation" aria-label={nb.foundations.purpose}>
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
          <section className="v2-manuscript" aria-label={t.journal}>
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
      <SavvyShark compact>
        <p>{topic === 'resource-bridge' ? t.topics['resource-bridge'].detail : t.guidedNote}</p>
      </SavvyShark>
      <details className="v2-sources">
        <summary>{t.sources}</summary>
        <p>{p.sourceNote}</p>
        <ul>
          {(unit
            ? units.find((u) => u.id === unit)!.sources.map((id) => ({ id, url: sourceUrl(id) }))
            : v2Bindings
                .find((b) => b.topic === topic)!
                .sources.map((id) => ({
                  id,
                  url: id.startsWith('BL')
                    ? beginnerSources[id as keyof typeof beginnerSources]
                    : sourceUrl(id as 'L02'),
                }))
          ).map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.id} · Microsoft Learn ↗
              </a>
            </li>
          ))}
        </ul>
      </details>
      <nav className="v2-evidence-nav" aria-label={t.summary}>
        <Link href="/learn/computing?topic=v2-assessment">
          {facts.active ? t.continueAssessment : t.assessment}
        </Link>
        <Link href="/learn/computing?topic=v2-summary">{t.summary}</Link>
      </nav>
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
  const { store, facts, issue } = useFoundationsV2(),
    last = facts.submissions.at(-1),
    disabled = ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '');
  return (
    <article className="foundations-v2">
      <h2>{t.assessment}</h2>
      <p>{t.assessmentIntro}</p>
      <p>{t.assessmentRules}</p>
      {facts.assisted && <p role="status">{t.aid}</p>}
      {facts.active ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            store.event({ kind: 'submit', answers: facts.draft });
          }}
        >
          {assessmentItems.map((item) => (
            <fieldset key={item.id}>
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
          <button disabled={disabled || v2Criteria.some((c) => !facts.draft[c.id])}>
            {t.sendAnswers}
          </button>
        </form>
      ) : (
        <>
          {last && (
            <section>
              <p role="status">{t.submitted}</p>
              <strong>{last.retry ? t.retry : last.assisted ? t.assisted : t.first}</strong>
              {assessmentItems.map((item) => (
                <section key={item.id}>
                  <h3>{item.question}</h3>
                  <p>
                    {last.answers[item.id]} ·{' '}
                    {last.criteria[item.id] ? nb.foundations.correct : nb.foundations.incorrect}
                  </p>
                  <p>{item.explanation}</p>
                </section>
              ))}
            </section>
          )}
          <button type="button" disabled={disabled} onClick={() => store.event({ kind: 'begin' })}>
            {last ? t.retry : t.beginAssessment}
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
          ? facts.submissions[0].assisted
            ? t.assisted
            : t.first
          : nb.foundationsV2.noAssessment}
      </p>
      <Link href="/learn/computing?topic=v2-assessment">{t.assessment}</Link>
    </article>
  );
}
