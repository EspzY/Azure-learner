'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { identityNb as c } from '@/content/nb';
import {
  identityHref,
  identityMissions,
  identityItemIds,
  identityLimit,
  evaluateIdentityAttempt,
  type IdentityTopic,
} from '@/domain/curriculum/identity-foundations';
import {
  identitySources,
  identityStudySources,
} from '@/domain/curriculum/identity-foundations-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useIdentity } from './identity-foundations-provider';
import { IdentityAssessment } from './identity-foundations-assessment';
import { IdentityWorkbench } from './identity-foundations-workbench';
import './compute.css';
import './storage.css';
import './identity-foundations.css';
export function IdentityRecovery({ focus = false }: { focus?: boolean }) {
  const t = useIdentity(),
    [confirm, setConfirm] = useState(false);
  return (
    <section className="course-identity" role="status">
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

export function IdentityLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: IdentityTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useIdentity();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson identity-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <IdentityPrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <IdentityTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <IdentitySources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson identity-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <IdentityRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= identityLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <IdentityAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <IdentitySummary />
      ) : topic === 'missions' ? (
        <IdentityMissions />
      ) : (
        <>
          <IdentityTheory topic={topic} />
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <IdentityPrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <IdentityMissions />
            </>
          )}
          {topic === 'studio' && <IdentityStudio perspective={perspective} />}
          <IdentitySources topic={topic} />
        </>
      )}
    </article>
  );
}
function IdentityStudio({ perspective }: { perspective?: string | null }) {
  const t = useIdentity();
  const view =
    identityMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'directory';
  return (
    <section className="identity-studio" aria-label={c.topics.studio}>
      <nav className="identity-perspectives" aria-label={c.perspective}>
        {identityMissions.map((id, i) => (
          <Link
            key={id}
            href={identityHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <IdentityWorkbench key={view} mission={view} />
    </section>
  );
}
function IdentityMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {identityMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={identityHref('studio') + '&perspective=' + id}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
function IdentitySummary() {
  const t = useIdentity();
  return (
    <section className="compute-summary identity-summary">
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
            {t.facts.completed.length}/{identityMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{identityItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={identityHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateIdentityAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <IdentityMissions />
      <IdentitySources />
    </section>
  );
}
function IdentityTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function IdentitySources({ topic }: { topic?: IdentityTopic }) {
  const ids =
    topic && topic in identityStudySources
      ? identityStudySources[topic as keyof typeof identityStudySources]
      : (Object.keys(identitySources) as (keyof typeof identitySources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={identitySources[id][1]} target="_blank" rel="noreferrer">
              {id} · {identitySources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}

function IdentityPrerequisites() {
  return (
    <nav className="identity-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/architecture?topic=subscriptions">{c.links.core}</Link>
      <Link href="/learn/services?topic=saas&version=2">{c.links.services}</Link>
      <Link href="/learn/storage-resilience?topic=summary">{c.links.storage}</Link>
    </nav>
  );
}
