'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { architectureNb as c, managementNb } from '@/content/nb';
import {
  evaluateInfrastructure,
  failureTargets,
  initialInfrastructure,
  physicalCriteria,
  physicalSources,
  physicalStudy,
  regionExamples,
  validInfrastructure,
  type ExampleRegion,
  type Geography,
  type InfrastructureInput,
  type PhysicalCriterion,
  type PhysicalSection,
  type PhysicalTopic,
  type ServiceState,
} from '@/domain/curriculum/architecture-physical';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { conceptMilestones } from '@/domain/guidance/milestones';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { SavvyShark } from '@/features/course/savvy-shark';
import { usePhysical } from './physical-provider';
import { PhysicalRecovery } from './physical-recovery';
import {
  ComponentTable,
  DatacenterDrawing,
  InfrastructureScene,
  regionLabel,
} from './physical-visual';
import './physical.css';

export function PhysicalLesson({
  topic,
  journal = false,
  guidanceBlocked = false,
}: {
  topic: PhysicalTopic;
  journal?: boolean;
  guidanceBlocked?: boolean;
}) {
  const s = usePhysical();
  useEffect(() => {
    if (s.ready && !journal) s.store.event({ kind: 'visit', topic });
  }, [s.ready, s.store, topic, journal]);
  return (
    <article className="physical-lesson" aria-label={c.part}>
      <header>
        <small>{c.part} · 1.0.0</small>
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
          {!journal && <PhysicalRecovery />}
        </div>
      )}
      {s.facts.full && !journal && (
        <div role="status" className="course-storage">
          <p>{c.limit}</p>
          <Link href="/learn/architecture?topic=assessment">{c.limitReturn}</Link>
        </div>
      )}
      <p className="pa-prerequisite">{c.prerequisite}</p>
      {journal ? (
        <>
          {(Object.keys(physicalStudy) as PhysicalSection[]).map((section) => (
            <PhysicalTheory key={section} section={section} journal />
          ))}
          <PhysicalSources />
        </>
      ) : topic === 'explorer' ? (
        s.ready ? (
          <PhysicalExplorer blocked={guidanceBlocked} />
        ) : (
          <p>{c.loading}</p>
        )
      ) : topic === 'assessment' ? (
        <PhysicalAssessment blocked={guidanceBlocked} />
      ) : topic === 'summary' ? (
        <PhysicalSummary />
      ) : (
        <PhysicalTheory section={topic} />
      )}
    </article>
  );
}
function PhysicalTheory({
  section,
  journal = false,
}: {
  section: PhysicalSection;
  journal?: boolean;
}) {
  const s = usePhysical(),
    copy = c.sections[section];
  const study = s.save.events.findLast((e) => e.kind === 'study' && e.section === section);
  const answer = study?.kind === 'study' ? study.answer : '';
  return (
    <section className="pa-theory">
      <h3>{copy.title}</h3>
      <div className="pa-reading">
        <div>
          {copy.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside>
          <TheoryFigure section={section} />
          <dl className="pa-terms">
            {copy.terms.map(([term, definition]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{definition}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      {section === 'zones' && (
        <section className="pa-mapping">
          <h4>{c.mappingTitle}</h4>
          <p>{c.mappingText}</p>
          <div aria-hidden="true">
            <span>{c.mappingLabels[0]}</span>
            <b>{c.mappingLabels[1]}</b>
            <span>{c.mappingLabels[2]}</span>
            <b>{c.mappingLabels[3]}</b>
          </div>
        </section>
      )}
      {section === 'sovereign' && (
        <div className="pa-environments">
          {c.environmentNames.map((name, i) => (
            <section key={name}>
              <h4>{name}</h4>
              <p>{c.environmentDetails[i]}</p>
            </section>
          ))}
        </div>
      )}
      {!journal && (
        <fieldset
          className="pa-question"
          disabled={
            !s.ready ||
            s.facts.full ||
            ['corrupt', 'unsupported', 'conflict'].includes(s.issue ?? '')
          }
        >
          <legend>{copy.question}</legend>
          {copy.choices.map(([id, label]) => (
            <label key={id}>
              <input
                type="radio"
                name={`physical-study-${section}`}
                checked={answer === id}
                onChange={() => s.store.event({ kind: 'study', section, answer: id })}
              />
              <span>{label}</span>
            </label>
          ))}
          {answer && <p role="status">{copy.choices.find(([id]) => id === answer)?.[2]}</p>}
        </fieldset>
      )}
    </section>
  );
}
function TheoryFigure({ section }: { section: PhysicalSection }) {
  if (section === 'datacenters')
    return (
      <div className="pa-cutaway">
        <DatacenterDrawing />
        <strong>{c.hardware}</strong>
        <p>{c.support}</p>
        <p>
          {c.facility} · {c.locationLimit}
        </p>
      </div>
    );
  if (section === 'regions')
    return (
      <div className="pa-geography-preview">
        {(['norway', 'europe', 'italy'] as Geography[]).map((g) => (
          <div key={g}>
            <strong>{c.geographyNames[g]}</strong>
            {(Object.keys(regionExamples) as ExampleRegion[])
              .filter((r) => regionExamples[r].geography === g)
              .map((r) => (
                <span key={r}>◎ {regionLabel(r)}</span>
              ))}
          </div>
        ))}
      </div>
    );
  if (section === 'zones')
    return (
      <div className="pa-zone-preview">
        {['A', 'B', 'C'].map((z) => (
          <div key={z}>
            <strong>
              {c.zone} {z}
            </strong>
            <DatacenterDrawing />
            <small>{c.support}</small>
          </div>
        ))}
      </div>
    );
  if (section === 'pairs')
    return (
      <div className="pa-pair-preview">
        <strong>North Europe ↔ West Europe</strong>
        <span>{c.pairLimit}</span>
        <strong>Italy North · {c.noPair}</strong>
        <strong>Brazil South → South Central US → North Central US</strong>
        <span>{c.asymmetricNote}</span>
      </div>
    );
  return (
    <div className="pa-environment-glyph" aria-hidden="true">
      <span>Public</span>
      <i />
      <span>Government</span>
      <i />
      <span>21Vianet</span>
    </div>
  );
}
/** Same action identity in the working explorer and its clearly paused surface. */
export function PhysicalRunControl({ disabled, onRun }: { disabled: boolean; onRun?: () => void }) {
  return (
    <button type="button" className="pa-primary" disabled={disabled} onClick={onRun}>
      {c.run}
    </button>
  );
}
function PhysicalExplorer({ blocked }: { blocked: boolean }) {
  const s = usePhysical(),
    last = s.facts.runs.at(-1);
  const [input, setInput] = useState<InfrastructureInput>(last?.input ?? initialInfrastructure),
    [prediction, setPrediction] = useState<string>(last?.prediction ?? ''),
    [started, setStarted] = useState(!!last),
    [dialog, setDialog] = useState<'brief' | 'loss' | 'resilience' | null>(null),
    [warning, setWarning] = useState(false),
    [inspect, setInspect] = useState<keyof typeof c.inspection>('region');
  const safe = !blocked && !s.facts.active && s.ready && !s.issue;
  if (!safe && dialog !== null) setDialog(null);
  useEffect(() => {
    const changed = (e: StorageEvent) => {
      if (e.key !== null && e.key !== milestonePreferenceKey) return;
      try {
        setWarning(!parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey)));
      } catch {
        setWarning(true);
      }
    };
    const clear = () => {
      setDialog(null);
      setWarning(false);
      setStarted(false);
      setInput(initialInfrastructure);
      setPrediction('');
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, []);
  const change = (patch: Partial<InfrastructureInput>) => {
    const next = { ...input, ...patch };
    const targets = failureTargets(next);
    if (!targets.includes(next.target)) next.target = targets[0] ?? '';
    setInput(next);
    setPrediction('');
  };
  const result = last ? evaluateInfrastructure(last.input) : null;
  const run = () => {
    if (
      !['serving', 'unavailable', 'uncertain'].includes(prediction) ||
      !s.store.event({ kind: 'run', input, prediction: prediction as ServiceState })
    )
      return;
    if (!safe || s.store.getSnapshot().issue || document.querySelector('dialog[open]')) return;
    const r = evaluateInfrastructure(input)!;
    const kind =
      r.status === 'unavailable' && input.placement === 'single' && r.apps[0]?.state === 'down'
        ? 'loss'
        : r.status === 'serving' && r.components.some((p) => p.state === 'down')
          ? 'resilience'
          : null;
    if (!kind) return;
    const m = conceptMilestones[`physical-${kind}`];
    let status: ReturnType<typeof claimMilestone> = 'unavailable';
    try {
      status = claimMilestone(localStorage, `physical-${kind}@${m.version}:PartA`);
    } catch {
      /* History unavailable: explicit recall only. */
    }
    setWarning(status === 'unavailable');
    if (status === 'claimed') setDialog(kind);
  };
  const geographic = regionExamples[input.region].geography;
  const selected =
    dialog && dialog !== 'brief'
      ? s.facts.runs.findLast((e) => {
          const r = evaluateInfrastructure(e.input)!;
          return dialog === 'loss'
            ? e.input.placement === 'single' &&
                r.status === 'unavailable' &&
                r.apps[0]?.state === 'down'
            : r.status === 'serving' && r.components.some((p) => p.state === 'down');
        })
      : null;
  const observation = selected ? evaluateInfrastructure(selected.input) : null;
  const explanation = s.save.events.findLast((e) => e.kind === 'explain');
  return (
    <section className="pa-explorer">
      <p>{c.task}</p>
      <ol className="pa-task-steps">
        {c.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="pa-assumptions">{c.assumptions}</p>
      {!safe && (
        <div role="status" className="course-storage">
          <p>{c.blocked}</p>
        </div>
      )}
      {safe && <button onClick={() => setDialog('brief')}>{c.briefOpen}</button>}
      {!started ? (
        <button
          className="pa-primary"
          disabled={!safe || s.facts.full}
          onClick={() => setDialog('brief')}
        >
          {c.start}
        </button>
      ) : (
        <>
          <fieldset className="pa-controls" disabled={!safe || s.facts.full}>
            <legend>{c.controls}</legend>
            <label>
              {c.geography}
              <select
                value={geographic}
                onChange={(e) => {
                  const region = (Object.keys(regionExamples) as ExampleRegion[]).find(
                    (r) => regionExamples[r].geography === e.target.value,
                  )!;
                  change({ region, placement: 'single', failure: 'datacenter' });
                }}
              >
                {Object.entries(c.geographyNames).map(([id, label]) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {c.region}
              <select
                value={input.region}
                onChange={(e) =>
                  change({
                    region: e.target.value as ExampleRegion,
                    placement: 'single',
                    failure: 'datacenter',
                  })
                }
              >
                {(Object.keys(regionExamples) as ExampleRegion[])
                  .filter((r) => regionExamples[r].geography === geographic)
                  .map((r) => (
                    <option value={r} key={r}>
                      {regionLabel(r)}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              {c.placement}
              <select
                value={input.placement}
                onChange={(e) =>
                  change({ placement: e.target.value as InfrastructureInput['placement'] })
                }
              >
                {Object.entries(c.placements).map(([id, label]) => (
                  <option
                    value={id}
                    key={id}
                    disabled={
                      ['same-zone', 'multi-zone'].includes(id) &&
                      !regionExamples[input.region].zones
                    }
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {input.placement === 'multi-region' && (
              <label>
                {c.secondary}
                <select
                  value={input.secondary}
                  onChange={(e) => change({ secondary: e.target.value as ExampleRegion })}
                >
                  {(Object.keys(regionExamples) as ExampleRegion[]).map((r) => (
                    <option key={r} value={r} disabled={r === input.region}>
                      {regionLabel(r)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              {c.data}
              <select
                value={input.data}
                onChange={(e) => change({ data: e.target.value as InfrastructureInput['data'] })}
              >
                {Object.entries(c.dataModes).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {c.routing}
              <select
                value={input.routing}
                onChange={(e) =>
                  change({ routing: e.target.value as InfrastructureInput['routing'] })
                }
              >
                {Object.entries(c.routes).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {c.failure}
              <select
                value={input.failure}
                onChange={(e) =>
                  change({ failure: e.target.value as InfrastructureInput['failure'] })
                }
              >
                {Object.entries(c.failures).map(([id, label]) => (
                  <option
                    key={id}
                    value={id}
                    disabled={
                      id === 'zone' &&
                      !regionExamples[input.region].zones &&
                      input.placement !== 'multi-region'
                    }
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {input.failure !== 'none' && (
              <label>
                {c.target}
                <select value={input.target} onChange={(e) => change({ target: e.target.value })}>
                  {failureTargets(input).map((t) => (
                    <option value={t} key={t}>
                      {targetLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              {c.prediction}
              <select value={prediction} onChange={(e) => setPrediction(e.target.value)}>
                <option value="">{c.choose}</option>
                {Object.entries(c.states).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <PhysicalRunControl disabled={!validInfrastructure(input) || !prediction} onRun={run} />
          </fieldset>
          {!validInfrastructure(input) && <p role="status">{c.invalid}</p>}
          {input.placement === 'multi-region' &&
            regionExamples[input.region].geography !==
              regionExamples[input.secondary].geography && (
              <p className="pa-caution">{c.crossGeo}</p>
            )}
          <h3>{last ? c.observed : c.draft}</h3>
          {last && (
            <p className="pa-input-snapshot">
              {regionLabel(last.input.region)} · {c.placements[last.input.placement]} ·{' '}
              {c.dataModes[last.input.data]} · {c.routes[last.input.routing]} ·{' '}
              {c.failures[last.input.failure]} · {targetLabel(last.input.target)}
            </p>
          )}
          <InfrastructureScene input={last?.input ?? input} result={result} />
          <section className="pa-inspection">
            <label>
              {c.inspect}
              <select
                value={inspect}
                onChange={(e) => setInspect(e.target.value as typeof inspect)}
              >
                {Object.entries(c.inspection).map(([id, detail]) => (
                  <option value={id} key={id}>
                    {detail[0]}
                  </option>
                ))}
              </select>
            </label>
            <p>{c.inspection[inspect][1]}</p>
          </section>
          {result && last && (
            <>
              <section className={`pa-observation pa-outcome-${result.status}`} role="status">
                <h3>
                  {c.result}: {c.states[result.status]}
                </h3>
                <p>
                  {c.yourPrediction}: {c.states[last.prediction]}
                </p>
                <p>
                  {c.physical}: {result.physicalSurvivors} · {c.usable}: {result.usable.length}
                </p>
                <p>{c.causes[result.status]}</p>
              </section>
              <ComponentTable result={result} />
            </>
          )}
          <SavvyShark compact>
            <h3>{c.practice}</h3>
            <p>{c.reason}</p>
            <p>{c.actualGuide}</p>
            {result && (
              <p>
                {c.result}: {c.states[result.status]} · {c.usable}: {result.usable.length}
              </p>
            )}
          </SavvyShark>
          {warning && <p role="status">{c.historyIssue}</p>}
          <div className="pa-actions">
            {(['loss', 'resilience'] as const).map((kind) => {
              const witnessed = s.facts.runs.some((e) => {
                const r = evaluateInfrastructure(e.input)!;
                return kind === 'loss'
                  ? e.input.placement === 'single' &&
                      r.status === 'unavailable' &&
                      r.apps[0]?.state === 'down'
                  : r.status === 'serving' && r.components.some((p) => p.state === 'down');
              });
              return witnessed && safe ? (
                <button key={kind} onClick={() => setDialog(kind)}>
                  {c.recall} · {c.milestones[kind].title}
                </button>
              ) : null;
            })}
          </div>
          {s.facts.runs.length > 0 && (
            <fieldset className="pa-question" disabled={!safe || s.facts.full}>
              <legend>{c.explain}</legend>
              {c.explainChoices.map(([id, label]) => (
                <label key={id}>
                  <input
                    name="physical-explanation"
                    type="radio"
                    checked={explanation?.kind === 'explain' && explanation.answer === id}
                    onChange={() => s.store.event({ kind: 'explain', answer: id })}
                  />
                  <span>{label}</span>
                </label>
              ))}
              {explanation?.kind === 'explain' && (
                <p role="status">{c.explainFeedback[explanation.answer]}</p>
              )}
            </fieldset>
          )}
          <ul className="pa-witnesses">
            {c.witnesses.map((label, i) => (
              <li key={label}>
                {s.facts.witnesses[i] ? c.registered : c.pending}: {label}
              </li>
            ))}
          </ul>
          {s.facts.guided && <p role="status">{c.guidedDone}</p>}
        </>
      )}
      {safe && dialog && (
        <GuidanceWindow
          title={dialog === 'brief' ? c.brief.title : c.milestones[dialog].title}
          notice={dialog === 'brief' ? c.brief.consequence : c.milestoneLimit}
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
            <p>{dialog === 'brief' ? c.brief.why : c.milestones[dialog].text}</p>
          </SavvyShark>
          {dialog === 'brief' ? (
            <>
              <p>{c.prerequisite}</p>
              <ol>
                {c.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>{c.brief.observe}</p>
            </>
          ) : (
            observation && (
              <>
                <p>
                  {c.result}: <strong>{c.states[observation.status]}</strong>
                </p>
                <p>
                  {c.physical}: {observation.physicalSurvivors} · {c.usable}:{' '}
                  {observation.usable.length}
                </p>
                <p>{c.causes[observation.status]}</p>
                <p>{c.assumptions}</p>
              </>
            )
          )}
        </GuidanceWindow>
      )}
    </section>
  );
}
function targetLabel(target: string) {
  if (target === 'none') return c.failures.none;
  const [region, location] = target.split(':');
  return `${regionLabel(region as ExampleRegion)}${location ? ` · ${location.length === 1 ? c.zone : c.facility} ${location.toUpperCase()}` : ''}`;
}
function PhysicalAssessment({ blocked }: { blocked: boolean }) {
  const s = usePhysical(),
    f = s.facts,
    last = f.submissions.at(-1),
    unsafe = blocked || !s.ready || !!s.issue;
  const draft = (id: string, value: string) =>
    s.store.event({
      kind: 'draft',
      answers: {
        ...s.store
          .getSnapshot()
          .save.events.reduce(
            (a, e) => (e.kind === 'draft' ? e.answers : e.kind === 'begin' ? {} : a),
            {} as Record<string, string>,
          ),
        [id]: value,
      },
    });
  return (
    <section className="pa-assessment">
      <h3>{c.independent}</h3>
      <p>{c.assessmentIntro}</p>
      {blocked && <p role="status">{c.blocked}</p>}
      {!f.active ? (
        <button
          className="pa-primary"
          disabled={unsafe || f.full}
          onClick={() => s.store.event({ kind: 'begin' })}
        >
          {f.attempts ? c.retry : c.begin}
        </button>
      ) : (
        <>
          <p role="status">
            {c.active} · {f.assisted ? c.assisted : c.unaided} ·{' '}
            {f.attempts > 1 ? c.retryLabel : ''}
          </p>
          {c.scenarios.map((scenario, index) => (
            <section key={scenario.title}>
              <h3>{scenario.title}</h3>
              <p>{scenario.text}</p>
              {Object.entries(c.questions)
                .filter(([, q]) => q.scenario === index)
                .map(([id, q]) =>
                  ['facility', 'grouping'].includes(id) ? (
                    <label className="pa-matching" key={id}>
                      {q.label}
                      <select
                        disabled={unsafe || f.full}
                        value={f.draft[id] ?? ''}
                        onChange={(e) => draft(id, e.target.value)}
                      >
                        <option value="">{c.choose}</option>
                        {q.choices.map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <fieldset key={id} className="pa-question" disabled={unsafe || f.full}>
                      <legend>{q.label}</legend>
                      {q.choices.map(([key, label]) => (
                        <label key={key}>
                          <input
                            type="radio"
                            name={`physical-${id}`}
                            value={key}
                            checked={f.draft[id] === key}
                            onChange={() => draft(id, key)}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </fieldset>
                  ),
                )}
            </section>
          ))}
          <div className="pa-actions">
            <button
              className="pa-primary"
              disabled={unsafe || Object.keys(physicalCriteria).some((id) => !f.draft[id])}
              onClick={() => s.store.event({ kind: 'submit', answers: f.draft })}
            >
              {c.submit}
            </button>
            <button disabled={unsafe} onClick={() => s.store.event({ kind: 'aid' })}>
              {c.aid}
            </button>
            <button disabled={unsafe} onClick={() => s.store.event({ kind: 'abandon' })}>
              {c.abandon}
            </button>
          </div>
          {f.assisted && <p>{c.aidText}</p>}
        </>
      )}
      {!s.issue && !f.active && last && (
        <section className="pa-feedback">
          <h3>{c.feedback}</h3>
          <p>
            {last.assisted ? c.assisted : c.unaided} · {last.retry ? c.retryLabel : ''}
          </p>
          {Object.entries(c.questions).map(([id, q]) => (
            <article key={id}>
              <h4>
                {q.label} · {last.criteria[id as PhysicalCriterion] ? c.correct : c.wrong}
              </h4>
              <p>{(q.feedback as Record<string, string>)[last.answers[id]!]}</p>
              {!last.criteria[id as PhysicalCriterion] && (
                <p>
                  {
                    (q.feedback as Record<string, string>)[
                      physicalCriteria[id as PhysicalCriterion].answer
                    ]
                  }
                </p>
              )}
              <details>
                <summary>{c.allReasons}</summary>
                <dl>
                  {q.choices.map(([key, label]) => (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>{(q.feedback as Record<string, string>)[key]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
function PhysicalSummary() {
  const s = usePhysical(),
    first = s.facts.submissions[0];
  return (
    <section>
      <h3>{c.summary}</h3>
      <p>{c.boundary}</p>
      <div className="pa-objectives">
        {Object.entries(c.objectives).map(([id, label]) => {
          const f = s.facts.objective(id);
          return (
            <section key={id}>
              <h4>{label}</h4>
              <dl>
                <dt>{c.taught}</dt>
                <dd>{f.taught ? c.registered : c.notYet}</dd>
                <dt>{c.first}</dt>
                <dd>
                  {first
                    ? `${c.criterionCount}: ${f.criteria.filter((k) => first.criteria[k]).length}/${f.criteria.length} · ${first.assisted ? c.assisted : c.unaided} · ${first.retry ? c.retryLabel : ''}`
                    : c.noSubmission}
                </dd>
                <dt>{c.firstOutcome}</dt>
                <dd>{f.first ? c.registered : c.notYet}</dd>
              </dl>
            </section>
          );
        })}
      </div>
      <h4>{c.guided}</h4>
      <ul>
        {c.witnesses.map((label, i) => (
          <li key={label}>
            {s.facts.witnesses[i] ? c.registered : c.pending}: {label}
          </li>
        ))}
      </ul>
      <p>{s.facts.guided ? c.guidedDone : c.task}</p>
      <p>
        {c.abandoned}: {s.facts.abandoned}
      </p>
      <p>{c.summaryLimit}</p>
      <PhysicalSources />
      <section className="pa-next">
        <h4>{c.nextPart}</h4>
        <p>{c.planned}</p>
        <Link href="/learn/architecture?topic=organization">{managementNb.resumeB}</Link>
      </section>
    </section>
  );
}
function PhysicalSources() {
  return (
    <section className="pa-sources">
      <h3>{c.sources}</h3>
      <p>{c.sourceReview}</p>
      <ul>
        {Object.entries(physicalSources).map(([id, path]) => (
          <li key={id}>
            <a href={`https://learn.microsoft.com/en-us/${path}`} target="_blank" rel="noreferrer">
              {id} · {path.split('/').filter(Boolean).at(-1)} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.locationLimit}</p>
    </section>
  );
}
