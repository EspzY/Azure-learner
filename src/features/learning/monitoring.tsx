'use client';
import { SourceDisclosure } from './source-disclosure';
import { GuidedMissionLink } from '@/features/course/guided-mission-link';
import { useEffect } from 'react';
import Link from 'next/link';
import { monitoringNb as c } from '@/content/nb';
import {
  monitoringHref,
  monitoringMissions,
  monitoringItemIds,
  monitoringLimit,
  evaluateMonitoringAttempt,
  type MonitoringTopic,
} from '@/domain/curriculum/monitoring';
import { monitoringSources, monitoringStudySources } from '@/domain/curriculum/monitoring-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useMonitoring } from './monitoring-provider';
import { MonitoringAssessment } from './monitoring-assessment';
import { MonitoringWorkbench } from './monitoring-workbench';
import './compute.css';
import './storage.css';
import './monitoring.css';
export function MonitoringRecovery({ focus = false }: { focus?: boolean }) {
  const t = useMonitoring(),
    [confirm, setConfirm] = useState(false);
  return (
    <section className="course-access" role="status">
      <h3 tabIndex={-1} ref={focus ? (n) => n?.focus() : undefined}>
        {c.storage.title}
      </h3>
      <p>
        {c.storage.text} ({t.issue})
      </p>
      <button onClick={t.store.load}>{c.storage.reload}</button>
      {['corrupt', 'unsupported'].includes(t.issue ?? '') && (
        <button onClick={() => setConfirm(true)}>{c.storage.recover}</button>
      )}
      {confirm && (
        <PortalDialog title={c.storage.recover} onClose={() => setConfirm(false)}>
          <p>{c.storage.text}</p>
          <button onClick={() => setConfirm(false)}>{c.storage.cancel}</button>
          <button
            onClick={() => {
              t.store.recoverInvalid();
              setConfirm(false);
            }}
          >
            {c.storage.confirm}
          </button>
        </PortalDialog>
      )}
    </section>
  );
}

export function MonitoringLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: MonitoringTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useMonitoring();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson monitoring-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <MonitoringPrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <MonitoringTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <MonitoringQueries />
        <MonitoringSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson monitoring-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <MonitoringRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= monitoringLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <MonitoringAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <MonitoringSummary />
      ) : topic === 'missions' ? (
        <MonitoringMissions />
      ) : (
        <>
          {topic === 'studio' ? (
            <>
              <p>{c.studioLead}</p>
              <MonitoringStudio perspective={perspective} />
              <MonitoringTheory topic={topic} />
            </>
          ) : (
            <MonitoringTheory topic={topic} />
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <MonitoringPrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <MonitoringMissions />
            </>
          )}
          {topic === 'logs' && <MonitoringQueries />}
          <MonitoringSources topic={topic} />
        </>
      )}
    </article>
  );
}
function MonitoringStudio({ perspective }: { perspective?: string | null }) {
  const t = useMonitoring();
  const view =
    monitoringMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'evidence';
  return (
    <section className="monitoring-studio" aria-label={c.topics.studio}>
      <nav className="monitoring-perspectives" aria-label={c.perspective}>
        {monitoringMissions.map((id, i) => (
          <Link
            key={id}
            href={monitoringHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <MonitoringWorkbench key={view} mission={view} />
    </section>
  );
}
function MonitoringMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {monitoringMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <GuidedMissionLink module="monitoring" mission={id} />
          </div>
        </article>
      ))}
    </section>
  );
}
function MonitoringSummary() {
  const t = useMonitoring();
  return (
    <section className="compute-summary monitoring-summary">
      <p>{c.available}</p>
      <p>{c.labels.noXp}</p>
      <dl>
        <div>
          <dt>{c.labels.visited}</dt>
          <dd>
            {t.facts.visited.filter((x) => x in c.sections).length}/{Object.keys(c.sections).length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.guided}</dt>
          <dd>
            {t.facts.completed.length}/{monitoringMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{monitoringItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={monitoringHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateMonitoringAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <MonitoringMissions />
      <MonitoringSources />
    </section>
  );
}
function MonitoringTheory({ topic }: { topic: keyof typeof c.sections }) {
  const s = c.sections[topic];
  return (
    <section className="compute-theory">
      <h3>{s.title}</h3>
      <div className="compute-reading">
        <div>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside>
          <h4>{c.labels.terms}</h4>
          <dl>
            {s.terms.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <section className="compute-worked">
        <h4>{c.labels.example}</h4>
        <p>{s.example}</p>
      </section>
      <p className="compute-boundary">
        <strong>{c.labels.limits}</strong> · {s.limit}
      </p>
    </section>
  );
}

export function MonitoringSources({ topic }: { topic?: MonitoringTopic }) {
  const ids =
    topic && topic in monitoringStudySources
      ? monitoringStudySources[topic as keyof typeof monitoringStudySources]
      : (Object.keys(monitoringSources) as (keyof typeof monitoringSources)[]);
  return (
    <section className="compute-sources source-section">
      <SourceDisclosure
        entries={ids.map((id) => ({
          id,
          url: monitoringSources[id][0],
          title: monitoringSources[id][1].replace(/^'|'$/g, ''),
        }))}
      />
      <p className="source-context">{c.labels.human}</p>
    </section>
  );
}

function MonitoringPrerequisites() {
  return (
    <nav className="monitoring-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/architecture?topic=subscriptions">{c.links.core}</Link>
      <Link href="/learn/management-tools?topic=summary">{c.links.management}</Link>
      <Link href="/learn/cost?topic=analysis">{c.links.cost}</Link>
      <Link href="/portal">{c.links.sandbox}</Link>
    </nav>
  );
}
function MonitoringQueries() {
  return (
    <section className="monitoring-queries">
      <h3>{c.queries.title}</h3>
      <pre tabIndex={0} aria-label="KQL · AzureActivity">
        {c.queries.activity}
      </pre>
      <pre tabIndex={0} aria-label="KQL · AppRequests">
        {c.queries.requests}
      </pre>
      <p>{c.queries.limit}</p>
    </section>
  );
}
