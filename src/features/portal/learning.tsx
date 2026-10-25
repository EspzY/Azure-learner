'use client';
import { useCallback, useEffect, useState } from 'react';
import { nb } from '@/content/nb';
import {
  cases,
  evaluateCase,
  evaluateSubmission,
  models,
  reasons,
  type CaseId,
  type Model,
  type Reason,
  type Answers,
} from '@/domain/portal/learning';
import { topics, type PortalLocation } from '@/domain/portal/model';
import { useChapter } from '@/features/chapter01/provider';
import { useLearning } from '@/features/learning/provider';
import { unitIds, sourceUrl, units, type UnitId } from '@/domain/curriculum/manifest';
import { UnitInvestigation } from '@/features/learning/session';
import { LearningDiagram } from '@/features/learning/diagram';
import { initialProbe } from '@/domain/curriculum/foundations';
import { TransferAssessment } from '@/features/learning/transfer';
import { LearningSummary } from '@/features/learning/summary';
import { CurriculumTrail } from '@/features/learning/curriculum-trail';
import { usePortalLearning } from './learning-provider';
import { ResponsibilityExplorer } from './responsibility';
import type { Navigate } from './shared';
import { serviceSources } from '@/domain/portal/content';
const p = nb.portal,
  l = p.lesson;
const references = Object.entries(serviceSources).map(([id, record]) => [id, record.url]);
export function FoundationsReference({ topic }: { topic: string }) {
  const { save } = useLearning();
  const [selected, setSelected] = useState<UnitId>(
    unitIds.includes(topic as UnitId) ? (topic as UnitId) : save.unit,
  );
  const c = nb.foundations.units[selected];
  return (
    <article className="portal-reference portal-foundations">
      <p>{nb.official.computing}</p>
      <label>
        {nb.official.learningUnitLabel}
        <select value={selected} onChange={(e) => setSelected(e.target.value as UnitId)}>
          {unitIds.map((id) => (
            <option value={id} key={id}>
              {nb.foundations.units[id].title}
            </option>
          ))}
        </select>
      </label>
      <h3>{c.title}</h3>
      <dl>
        {c.terms.map(([term, meaning]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <LearningDiagram
        unit={selected}
        input={{
          ...initialProbe,
          ...(selected === 'metering' ? { mode: 'cloud' as const, profile: 'idle' as const } : {}),
          ...(['models', 'placement'].includes(selected) ? { topology: 'hybrid' as const } : {}),
        }}
      />
      <p>{nb.foundations.assumptions}</p>
      {(['purpose', 'mechanism', 'azure', 'example', 'misconception', 'limits'] as const).map(
        (key) => (
          <section key={key}>
            <h4>{nb.foundations[key]}</h4>
            <p>{c[key]}</p>
          </section>
        ),
      )}
      <h4>{p.source}</h4>
      <ul>
        {units
          .find((u) => u.id === selected)!
          .sources.map((id) => (
            <li key={id}>
              <a href={sourceUrl(id)} target="_blank" rel="noreferrer">
                {id} · {p.referencePublisher} ↗
              </a>
            </li>
          ))}
      </ul>
    </article>
  );
}
export function ServiceReference({ topic }: { topic: string }) {
  const [selected, setSelected] = useState(
    topics.includes(topic as (typeof topics)[number])
      ? (topic as (typeof topics)[number])
      : 'overview',
  );
  const c = l.sections[selected];
  return (
    <article className="portal-reference">
      <p>
        {p.modes.learn} · {l.title}
      </p>
      <label>
        {nb.official.unitLabel}
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as (typeof topics)[number])}
        >
          {topics.map((id) => (
            <option key={id} value={id}>
              {l.sections[id].title}
            </option>
          ))}
        </select>
      </label>
      <h3>{c.title}</h3>
      <p>{c.intro}</p>
      {(['mechanism', 'example', 'misconception', 'limits'] as const).map((key) => (
        <section key={key}>
          <h4>{l.headings[key]}</h4>
          <p>{c[key]}</p>
        </section>
      ))}
      <h4>{p.source}</h4>
      <ul>
        {references.map(([id, url]) => (
          <li key={id}>
            <a href={url} target="_blank" rel="noreferrer">
              {id} · {p.referencePublisher} ↗
            </a>
          </li>
        ))}
      </ul>
      <small>{p.reviewed}</small>
    </article>
  );
}
export function LearningWorkspace({
  location,
  navigate,
}: {
  location: PortalLocation;
  navigate: Navigate;
}) {
  return (
    <div className="portal-learning-workspace">
      <nav className="portal-lesson-menu" aria-label={p.learning}>
        <h2>{nb.official.path}</h2>
        <button
          type="button"
          aria-pressed={location.module === 'services'}
          onClick={() => navigate('learn', { module: 'services', topic: 'overview' })}
        >
          {l.title}
        </button>
        <button
          type="button"
          aria-pressed={location.module === 'computing'}
          onClick={() => navigate('learn', { module: 'computing', topic: 'capacity' })}
        >
          {nb.official.computing}
        </button>
        <p>
          {nb.official.benefits} · {nb.official.planned}
        </p>
        <hr />
        {location.module === 'services'
          ? topics.map((topic) => (
              <button
                type="button"
                key={topic}
                aria-current={location.topic === topic ? 'step' : undefined}
                onClick={() => navigate('learn', { topic })}
              >
                {l.sections[topic].title}
              </button>
            ))
          : unitIds.map((unit) => (
              <button
                type="button"
                key={unit}
                aria-current={location.topic === unit ? 'step' : undefined}
                onClick={() => navigate('learn', { topic: unit })}
              >
                {nb.foundations.units[unit].title}
              </button>
            ))}
      </nav>
      {location.module === 'computing' ? (
        <FoundationsWorkspace location={location} navigate={navigate} />
      ) : (
        <ServicesWorkspace location={location} navigate={navigate} />
      )}
    </div>
  );
}
export function ServicesWorkspace({
  location,
  navigate,
  course = false,
  operational = false,
  extension,
}: {
  location: PortalLocation;
  navigate: Navigate;
  course?: boolean;
  operational?: boolean;
  extension?: React.ReactNode;
}) {
  const topic = topics.includes(location.topic as (typeof topics)[number])
    ? (location.topic as (typeof topics)[number])
    : 'overview';
  const c = l.sections[topic];
  const { facts } = usePortalLearning();
  return (
    <article className="portal-manuscript">
      <small>{l.subtitle}</small>
      <h2>{c.title}</h2>
      <CurriculumTrail module="services" overview />
      {!course && (
        <div className="portal-learning-actions">
          <button
            type="button"
            className="primary"
            onClick={() => navigate('groups', { mode: 'guided' })}
          >
            {p.openPractice}
          </button>
        </div>
      )}
      {topic === 'overview' && (
        <>
          <ul>
            {l.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <h3>{l.headings.terms}</h3>
          <dl>
            {l.terms.map(([term, definition]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{definition}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <p>{c.intro}</p>
      <h3>{l.headings.mechanism}</h3>
      <p>{c.mechanism}</p>
      <h3>{l.headings.example}</h3>
      <p>{c.example}</p>
      {!operational && ['overview', 'iaas', 'paas', 'saas'].includes(topic) && (
        <ResponsibilityExplorer
          context="service-v1"
          key={topic}
          guide={course}
          initialModel={models.includes(topic as Model) ? (topic as Model) : 'paas'}
        />
      )}
      <h3>{l.headings.misconception}</h3>
      <p>{c.misconception}</p>
      <h3>{l.headings.limits}</h3>
      <p>{c.limits}</p>
      {extension}
      {!operational && topic === 'selection' && (
        <>
          <h3>{l.guided}</h3>
          {cases.map((id) => (
            <GuidedCase key={id} id={id} />
          ))}
        </>
      )}
      {topic === 'practice' && !course && (
        <div className="portal-practice-brief">
          <h3>{p.guidedBrief}</h3>
          <ol>
            {p.guidedSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <button
            type="button"
            className="primary"
            onClick={() => navigate('groups', { mode: 'guided' })}
          >
            {p.openPractice}
          </button>
        </div>
      )}
      {!operational && (
        <div className="portal-evidence-note">
          <p>
            {l.compared}: {facts.compared.size} / 3
          </p>
          <p>{facts.guidedComplete ? l.guidedComplete : l.guidedIncomplete}</p>
          <button type="button" onClick={() => navigate('challenge', { mode: 'independent' })}>
            {p.areas.challenge}
          </button>
        </div>
      )}
      <h3>{p.source}</h3>
      <ul className="portal-references">
        {references.map(([id, url]) => (
          <li key={id}>
            <a href={url} target="_blank" rel="noreferrer">
              {id} · {p.referencePublisher} ↗
            </a>
          </li>
        ))}
      </ul>
      <small>{p.reviewed}</small>
    </article>
  );
}
function GuidedCase({ id }: { id: CaseId }) {
  const { store, facts, ready, issue } = usePortalLearning();
  const prior = facts.guided[id];
  const [model, setModel] = useState(prior?.model ?? ''),
    [reason, setReason] = useState(prior?.reason ?? '');
  return (
    <form
      className="portal-guided-case"
      onSubmit={(e) => {
        e.preventDefault();
        store.event({ kind: 'guided', caseId: id, model, reason });
      }}
    >
      <fieldset
        disabled={!ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '')}
      >
        <legend>{l.cases[id]}</legend>
        <label>
          {l.model}
          <select required value={model} onChange={(e) => setModel(e.target.value as Model)}>
            <option value="">{p.challenge.required}</option>
            {models.map((m) => (
              <option value={m} key={m}>
                {m.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <label>
          {l.reason}
          <select required value={reason} onChange={(e) => setReason(e.target.value as Reason)}>
            <option value="">{p.challenge.required}</option>
            {reasons.map((r) => (
              <option value={r} key={r}>
                {l.reasons[r]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">{l.check}</button>
      </fieldset>
      {prior && (
        <p role="status">
          {evaluateCase(id, prior.model, prior.reason) ? l.correct : l.incorrect} {l.feedback[id]}
        </p>
      )}
    </form>
  );
}
export function IndependentChallenge({ navigate }: { navigate: Navigate }) {
  const { store, facts, ready, issue } = usePortalLearning();
  const { attempt, attemptNumber } = useChapter(),
    engine = attempt.engine;
  const t = p.challenge;
  const update = (answers: Answers) => store.event({ kind: 'draft', answers });
  const allowed = ready && !['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '');
  return (
    <article className="portal-challenge">
      <h2>{t.title}</h2>
      <p>{t.brief}</p>
      <p>{p.modeHints.independent}</p>
      {!facts.active ? (
        <button
          type="button"
          className="primary"
          disabled={!allowed}
          onClick={() =>
            store.event({
              kind: 'begin',
              boundary: engine.ledger.at(-1)?.request.commandId ?? null,
              attemptNumber,
            })
          }
        >
          {facts.submissions.length ? t.retry : t.start}
        </button>
      ) : (
        <>
          <p role="status">
            {t.active} {facts.assisted ? t.assisted : t.unassisted}
          </p>
          <button type="button" onClick={() => store.event({ kind: 'abandon' })}>
            {t.abandon}
          </button>
          <button type="button" onClick={() => navigate('resources', { mode: 'independent' })}>
            {p.areas.resources}
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.event({
                kind: 'submit',
                through: engine.ledger.at(-1)?.request.commandId ?? 'no-technical-command',
              });
            }}
          >
            <fieldset disabled={!allowed}>
              <legend>{t.references}</legend>
              {(
                [
                  ['osModel', t.os],
                  ['webModel', t.web],
                  ['readyModel', t.ready],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <select
                    required
                    value={facts.draft[key] ?? ''}
                    onChange={(e) => update({ [key]: e.target.value })}
                  >
                    <option value="">{t.required}</option>
                    {models.map((m) => (
                      <option value={m} key={m}>
                        {m.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <label>
                {t.reason}
                <select
                  required
                  value={facts.draft.reason ?? ''}
                  onChange={(e) => update({ reason: e.target.value as Reason })}
                >
                  <option value="">{t.required}</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {l.reasons[r]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t.cause}
                <select
                  required
                  value={facts.draft.locationCause ?? ''}
                  onChange={(e) =>
                    update({ locationCause: e.target.value as Answers['locationCause'] })
                  }
                >
                  <option value="">{t.required}</option>
                  {Object.entries(t.causes).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {(['groupId', 'planId', 'appId'] as const).map((key, i) => (
                <label key={key}>
                  {[p.group, p.plan, p.app][i]}
                  <select
                    required
                    value={facts.draft[key] ?? ''}
                    onChange={(e) => update({ [key]: e.target.value })}
                  >
                    <option value="">{t.required}</option>
                    {(key === 'groupId'
                      ? engine.world.groups
                      : engine.world.resources.filter(
                          (r) =>
                            r.type ===
                            (key === 'planId'
                              ? 'Microsoft.Web/serverfarms'
                              : 'Microsoft.Web/sites'),
                        )
                    ).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <button type="submit" className="primary">
                {t.submit}
              </button>
            </fieldset>
          </form>
        </>
      )}
      <h3>{t.history}</h3>
      {!facts.submissions.length && <p>{t.noSubmission}</p>}
      {facts.submissions.map((s, index) => {
        const result = evaluateSubmission(s, engine, attemptNumber);
        return (
          <section
            key={index}
            className="portal-submission"
            data-correct={result.correct}
            aria-label={index === 0 ? t.first : `${t.retryResult} ${index + 1}`}
          >
            <h3>{index === 0 ? t.first : `${t.retryResult} ${index + 1}`}</h3>
            <p>{s.assisted ? t.assisted : index === 0 ? t.unassisted : t.retryResult}</p>
            <strong>
              {s.abandoned
                ? t.abandoned
                : !result.verifiable
                  ? t.unverifiable
                  : result.correct
                    ? t.passed
                    : t.failed}
            </strong>
            <ul>
              {Object.entries(result.criteria).map(([id, met]) => (
                <li key={id}>
                  <span aria-hidden="true">{met ? '✓' : '✕'}</span>{' '}
                  {t.criteria[id as keyof typeof t.criteria]}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p>{t.notMastery}</p>
    </article>
  );
}
export function FoundationsWorkspace({
  location,
  navigate,
}: {
  location: PortalLocation;
  navigate: Navigate;
}) {
  const { save, store, facts, ready } = useLearning();
  const unit = unitIds.includes(location.topic as UnitId) ? (location.topic as UnitId) : save.unit;
  const copy = nb.foundations.units[unit];
  const onProject = useCallback(() => {}, []);
  useEffect(() => {
    if (ready && location.topic !== 'assessment' && location.topic !== 'summary')
      store.event({ kind: 'visit', unit });
  }, [ready, store, unit, location.topic]);
  const study = location.topic !== 'assessment' && location.topic !== 'summary';
  return (
    <article className="portal-manuscript portal-foundations">
      <h2>{nb.official.computing}</h2>
      <CurriculumTrail unit={unit} />
      <div className="portal-learning-actions">
        <button
          type="button"
          onClick={() => {
            if (!facts.active) store.event({ kind: 'begin-transfer' });
            navigate('learn', { topic: 'assessment' });
          }}
        >
          {nb.foundations.transfer}
        </button>
        <button type="button" onClick={() => navigate('learn', { topic: 'summary' })}>
          {nb.foundations.summary}
        </button>
      </div>
      {location.topic === 'assessment' ? (
        <TransferAssessment />
      ) : location.topic === 'summary' ? (
        <LearningSummary />
      ) : (
        <>
          <h3>{copy.title}</h3>
          <dl>
            {copy.terms.map(([term, meaning]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
          {(['purpose', 'mechanism', 'azure', 'example', 'misconception', 'limits'] as const).map(
            (key) => (
              <section key={key}>
                <h3>{nb.foundations[key]}</h3>
                <p>{copy[key]}</p>
              </section>
            ),
          )}
          <UnitInvestigation key={unit} unit={unit} onProject={onProject} showCore={false} />
          <ul>
            {units
              .find((u) => u.id === unit)!
              .sources.map((id) => (
                <li key={id}>
                  <a href={sourceUrl(id)} target="_blank" rel="noreferrer">
                    {id} · {p.referencePublisher} ↗
                  </a>
                </li>
              ))}
          </ul>
        </>
      )}
      {!study && (
        <button type="button" onClick={() => navigate('learn', { topic: unit })}>
          {nb.foundations.back}
        </button>
      )}
    </article>
  );
}
