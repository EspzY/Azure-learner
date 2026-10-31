'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { storageResilienceNb as c } from '@/content/nb';
import {
  resilienceHref,
  resilienceMissions,
  resilienceItemIds,
  resilienceLimit,
  evaluateResilienceAttempt,
  type ResilienceTopic,
} from '@/domain/curriculum/storage-resilience';
import {
  resilienceSources,
  resilienceStudySources,
} from '@/domain/curriculum/storage-resilience-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useResilience } from './storage-resilience-provider';
import { ResilienceAssessment } from './storage-resilience-assessment';
import { ResilienceWorkbench } from './storage-resilience-workbench';
import './compute.css';
import './storage.css';
import './storage-resilience.css';
export function ResilienceRecovery({ focus = false }: { focus?: boolean }) {
  const t = useResilience(),
    [confirm, setConfirm] = useState(false);
  return (
    <section className="course-resilience" role="status">
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

export function ResilienceLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: ResilienceTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useResilience();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson resilience-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <ResiliencePrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <ResilienceTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <ResilienceSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson resilience-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <ResilienceRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= resilienceLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <ResilienceAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <ResilienceSummary />
      ) : topic === 'missions' ? (
        <ResilienceMissions />
      ) : (
        <>
          <ResilienceTheory topic={topic} />
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <ResiliencePrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <ResilienceMissions />
            </>
          )}
          {topic === 'studio' && <ResilienceStudio perspective={perspective} />}
          <ResilienceSources topic={topic} />
        </>
      )}
    </article>
  );
}
function ResilienceStudio({ perspective }: { perspective?: string | null }) {
  const t = useResilience();
  const view =
    resilienceMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'tiers';
  return (
    <section className="resilience-studio" aria-label={c.topics.studio}>
      <nav className="resilience-perspectives" aria-label={c.perspective}>
        {resilienceMissions.map((id, i) => (
          <Link
            key={id}
            href={resilienceHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <ResilienceWorkbench key={view} mission={view} />
    </section>
  );
}
function ResilienceMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {resilienceMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={resilienceHref('studio') + '&perspective=' + id}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
function ResilienceSummary() {
  const t = useResilience();
  return (
    <section className="compute-summary resilience-summary">
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
            {t.facts.completed.length}/{resilienceMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{resilienceItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={resilienceHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateResilienceAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <ResilienceMissions />
      <ResilienceSources />
    </section>
  );
}
function ResilienceTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function ResilienceSources({ topic }: { topic?: ResilienceTopic }) {
  const ids =
    topic && topic in resilienceStudySources
      ? resilienceStudySources[topic as keyof typeof resilienceStudySources]
      : (Object.keys(resilienceSources) as (keyof typeof resilienceSources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={resilienceSources[id][1]} target="_blank" rel="noreferrer">
              {id} · {resilienceSources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}

function ResiliencePrerequisites() {
  return (
    <nav className="resilience-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/storage?topic=introduction">{c.links.partA}</Link>
      <Link href="/learn/architecture?topic=zones">{c.links.core}</Link>
      <Link href="/learn/cost?topic=introduction">{c.links.cost}</Link>
    </nav>
  );
}
