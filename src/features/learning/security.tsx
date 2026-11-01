'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { securityNb as c } from '@/content/nb';
import {
  securityHref,
  securityMissions,
  securityItemIds,
  securityLimit,
  evaluateSecurityAttempt,
  type SecurityTopic,
} from '@/domain/curriculum/security';
import { securitySources, securityStudySources } from '@/domain/curriculum/security-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useSecurity } from './security-provider';
import { SecurityAssessment } from './security-assessment';
import { SecurityWorkbench } from './security-workbench';
import './compute.css';
import './storage.css';
import './security.css';
export function SecurityRecovery({ focus = false }: { focus?: boolean }) {
  const t = useSecurity(),
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

export function SecurityLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: SecurityTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useSecurity();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson security-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <SecurityPrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <SecurityTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <SecuritySources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson security-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <SecurityRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= securityLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <SecurityAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <SecuritySummary />
      ) : topic === 'missions' ? (
        <SecurityMissions />
      ) : (
        <>
          {topic === 'studio' ? (
            <>
              <p>{c.studioLead}</p>
              <SecurityStudio perspective={perspective} />
              <SecurityTheory topic={topic} />
            </>
          ) : (
            <SecurityTheory topic={topic} />
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <SecurityPrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <SecurityMissions />
            </>
          )}

          <SecuritySources topic={topic} />
        </>
      )}
    </article>
  );
}
function SecurityStudio({ perspective }: { perspective?: string | null }) {
  const t = useSecurity();
  const view = securityMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'trust';
  return (
    <section className="security-studio" aria-label={c.topics.studio}>
      <nav className="security-perspectives" aria-label={c.perspective}>
        {securityMissions.map((id, i) => (
          <Link
            key={id}
            href={securityHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <SecurityWorkbench key={view} mission={view} />
    </section>
  );
}
function SecurityMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {securityMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={securityHref('studio') + '&perspective=' + id}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
function SecuritySummary() {
  const t = useSecurity();
  return (
    <section className="compute-summary security-summary">
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
            {t.facts.completed.length}/{securityMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{securityItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={securityHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateSecurityAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <SecurityMissions />
      <SecuritySources />
    </section>
  );
}
function SecurityTheory({ topic }: { topic: keyof typeof c.sections }) {
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
      {topic === 'depth' && <SecurityLayerPrimer />}
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

export function SecuritySources({ topic }: { topic?: SecurityTopic }) {
  const ids =
    topic && topic in securityStudySources
      ? securityStudySources[topic as keyof typeof securityStudySources]
      : (Object.keys(securitySources) as (keyof typeof securitySources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={securitySources[id].url} target="_blank" rel="noreferrer">
              {id} · {securitySources[id].title} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}

function SecurityPrerequisites() {
  return (
    <nav className="security-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/identity?topic=summary">{c.links.identity}</Link>
      <Link href="/learn/access-control?topic=summary">{c.links.access}</Link>
      <Link href="/learn/governance?topic=summary">{c.links.governance}</Link>
      <Link href="/learn/monitoring?topic=summary">{c.links.monitoring}</Link>
      <Link href="/portal">{c.links.sandbox}</Link>
    </nav>
  );
}
function SecurityLayerPrimer() {
  return (
    <section className="security-layer-primer">
      <h4>{c.visual.layersTitle}</h4>
      {Object.entries(c.layers).map(([id, l]) => (
        <article key={id}>
          <h5>{l.name}</h5>
          <p>
            <strong>{c.visual.purpose}: </strong>
            {l.purpose}
          </p>
          <p>
            <strong>{c.visual.controls}: </strong>
            {l.controls}
          </p>
          <p>
            <strong>{c.visual.risk}: </strong>
            {l.risk}
          </p>
          <p>
            <strong>{c.visual.limit}: </strong>
            {l.limit}
          </p>
          <p>
            <strong>{c.visual.complements}: </strong>
            {l.complement}
          </p>
        </article>
      ))}
    </section>
  );
}
