'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { costNb as c } from '@/content/nb';
import {
  costHref,
  costLimit,
  costMissions,
  costTopics,
  evaluateCostAttempt,
  type CostTopic,
} from '@/domain/curriculum/cost';
import { costSources, costStudySources } from '@/domain/curriculum/cost-sources';
import { useCost } from './cost-provider';
import { CostWorkbench } from './cost-workbench';
import { CostAssessment } from './cost-assessment';
import { CostTable } from './cost-visuals';
import './cost.css';
export function CostRecovery({ focus = false }: { focus?: boolean }) {
  const t = useCost(),
    [confirm, setConfirm] = useState(false);
  const focusRecovery = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && focus)
        requestAnimationFrame(() => {
          if (node.isConnected) node.focus();
        });
    },
    [focus],
  );
  return (
    <div className="cost-recovery" role="status" tabIndex={-1} ref={focusRecovery}>
      <p>
        {c.storage.issue} ({t.issue})
      </p>
      <button onClick={t.store.load}>{c.storage.load}</button>
      {['corrupt', 'unsupported'].includes(t.issue ?? '') && (
        <>
          <button onClick={() => setConfirm(!confirm)}>{c.storage.recover}</button>
          {confirm && (
            <button
              onClick={() => {
                t.store.recoverInvalid();
                setConfirm(false);
              }}
            >
              {c.storage.confirm}
            </button>
          )}
        </>
      )}
    </div>
  );
}
export function CostEntry({
  navigation = false,
  topic,
  onNavigate,
}: {
  navigation?: boolean;
  topic?: string;
  onNavigate?: () => void;
}) {
  const t = useCost();
  return navigation ? (
    <section className="course-path-entry">
      <h2>{c.path}</h2>
      <Link
        href={costHref('introduction')}
        aria-current={topic ? 'page' : undefined}
        onClick={onNavigate}
      >
        {c.title}
      </Link>
      <small>{c.available}</small>
      {topic && (
        <ol className="course-units">
          {costTopics.map((id) => (
            <li key={id}>
              <Link
                onClick={onNavigate}
                href={costHref(id)}
                aria-current={id === topic ? 'step' : undefined}
              >
                {c.topics[id]}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  ) : (
    <section className="cost-entry" aria-label={c.title}>
      <small>{c.path}</small>
      <h2>{c.title}</h2>
      <p>{c.overview}</p>
      <p>{c.available}</p>
      <Link
        className="course-primary"
        href={costHref(
          t.facts.active ? 'assessment' : t.facts.topic,
          t.facts.active || t.facts.topic === 'assessment' ? t.facts.current?.item : undefined,
        )}
      >
        {t.facts.active ? c.assessment.title : c.intro} →
      </Link>
      <p>
        {c.summary.guided}: {t.facts.completed.length} /4 · {c.summary.firsts}:{' '}
        {t.facts.firsts.length} /10
      </p>
    </section>
  );
}
export function CostLesson({
  topic,
  selected,
  journal = false,
}: {
  topic: CostTopic;
  selected?: string | null;
  journal?: boolean;
}) {
  const t = useCost();
  useEffect(() => {
    if (t.ready && !journal && !t.issue) t.store.event({ kind: 'visit', topic });
  }, [topic, journal, t.ready, t.issue, t.store]);
  if (journal)
    return (
      <article className="cost-lesson cost-journal">
        <h2>{c.title}</h2>
        <p>{c.prerequisite}</p>
        {Object.keys(c.sections).map((id) => (
          <CostTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <CostSources />
      </article>
    );
  return (
    <article className="cost-lesson">
      <header>
        <small>{c.path} ·1.0.0</small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <CostRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= costLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <CostAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <CostSummary />
      ) : (
        <>
          <CostTheory topic={topic} />
          {(costMissions as readonly string[]).includes(topic) && (
            <>
              <p className="cost-boundary">{c.synthetic}</p>
              <p>{c.units}</p>
              <CostWorkbench key={topic} mission={topic as (typeof costMissions)[number]} />
            </>
          )}
          {topic === 'estimate' && (
            <section className="cost-calculator-bridge">
              <h3>{c.publicCalculator.title}</h3>
              <ol>
                {c.publicCalculator.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p>{c.publicCalculator.note}</p>
              <a href={costSources.CS28[1]} target="_blank" rel="noreferrer">
                {c.publicCalculator.open}
              </a>
            </section>
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisite}</p>
              <nav className="cost-prerequisites">
                <Link href="/learn/computing?topic=v2-metering">{c.topics.drivers}</Link>
                <Link href="/learn/architecture?topic=subscriptions">
                  {c.hierarchyPrerequisite}
                </Link>
              </nav>
              <div className="cost-cycle" aria-label={c.intro}>
                {(['estimate', 'analysis', 'budgets', 'tags'] as const).map((id, i) => (
                  <Link key={id} href={costHref(id)}>
                    <b>0{i + 1}</b>
                    <span>{c.topics[id]}</span>
                    <small>{c.missions[id].goal}</small>
                  </Link>
                ))}
              </div>
            </>
          )}
          <CostSources topic={topic} />
        </>
      )}
    </article>
  );
}
function CostTheory({ topic }: { topic: keyof typeof c.sections }) {
  const copy = c.sections[topic];
  return (
    <section className="cost-theory">
      <h3>{copy.title}</h3>
      <div className="cost-reading">
        <div>
          {copy.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside>
          <h4>{c.theoryLabels[0]}</h4>
          <dl>
            {copy.terms.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <section className="cost-worked">
        <h4>{c.theoryLabels[1]}</h4>
        <p>{copy.example}</p>
      </section>
      <p className="cost-limit">{copy.limit}</p>
    </section>
  );
}
export function CostSources({ topic }: { topic?: keyof typeof costStudySources }) {
  const ids = topic
    ? costStudySources[topic]
    : (Object.keys(costSources) as (keyof typeof costSources)[]);
  return (
    <section className="cost-sources">
      <h3>{c.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={costSources[id][1]} target="_blank" rel="noreferrer">
              {id} · {costSources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.human}</p>
    </section>
  );
}
function CostSummary() {
  const t = useCost();
  return (
    <section className="cost-summary">
      <h3>{c.summary.title}</h3>
      <p>{c.summary.boundary}</p>
      <dl>
        <div>
          <dt>{c.summary.visited}</dt>
          <dd>
            {t.facts.visited.filter((id) => !['assessment', 'summary'].includes(id)).length} /7
          </dd>
        </div>
        <div>
          <dt>{c.summary.guided}</dt>
          <dd>{t.facts.completed.length} /4</dd>
        </div>
        <div>
          <dt>{c.summary.firsts}</dt>
          <dd>{t.facts.firsts.length} /10</dd>
        </div>
      </dl>
      <ul>
        {costMissions.map((id) => (
          <li key={id}>
            <Link href={costHref(id)}>{c.missions[id].title}</Link> ·{' '}
            {t.facts.completed.includes(id) ? c.guided.done : c.summary.none}
          </li>
        ))}
      </ul>
      <CostTable label={c.summary.firsts}>
        <table>
          <caption>{c.summary.firsts}</caption>
          <thead>
            <tr>
              <th>{c.assessment.case}</th>
              <th>{c.assessment.result}</th>
              <th>{c.submissionClassification}</th>
            </tr>
          </thead>
          <tbody>
            {t.facts.firsts.map((a) => (
              <tr key={a.id}>
                <th>
                  <Link href={costHref('assessment', a.item)}>{a.item}</Link>
                </th>
                <td>{evaluateCostAttempt(a).relation ? c.assessment.pass : c.assessment.fail}</td>
                <td>
                  {a.assisted
                    ? c.assessment.assisted
                    : a.retry
                      ? c.assessment.retried
                      : c.assessment.unaided}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CostTable>
      <p>{c.summary.next}</p>
      <p>{c.human}</p>
      <CostSources />
    </section>
  );
}
