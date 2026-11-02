'use client';
import { SourceDisclosure } from './source-disclosure';
import { GuidedMissionLink } from '@/features/course/guided-mission-link';
import { useEffect } from 'react';
import Link from 'next/link';
import { accessNb as c } from '@/content/nb';
import {
  accessHref,
  accessMissions,
  accessItemIds,
  accessLimit,
  evaluateAccessAttempt,
  type AccessTopic,
} from '@/domain/curriculum/access-control';
import { accessSources, accessStudySources } from '@/domain/curriculum/access-control-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useAccess } from './access-control-provider';
import { AccessAssessment } from './access-control-assessment';
import { AccessWorkbench } from './access-control-workbench';
import './compute.css';
import './storage.css';
import './access-control.css';
export function AccessRecovery({ focus = false }: { focus?: boolean }) {
  const t = useAccess(),
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

export function AccessLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: AccessTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useAccess();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson access-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <AccessPrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <AccessTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <AccessSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson access-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <AccessRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= accessLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <AccessAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <AccessSummary />
      ) : topic === 'missions' ? (
        <AccessMissions />
      ) : (
        <>
          {topic === 'studio' ? (
            <>
              <p>{c.studioLead}</p>
              <AccessStudio perspective={perspective} />
              <AccessTheory topic={topic} />
            </>
          ) : (
            <AccessTheory topic={topic} />
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <AccessPrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <AccessMissions />
            </>
          )}
          <AccessSources topic={topic} />
        </>
      )}
    </article>
  );
}
function AccessStudio({ perspective }: { perspective?: string | null }) {
  const t = useAccess();
  const view = accessMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'rbac';
  return (
    <section className="access-studio" aria-label={c.topics.studio}>
      <nav className="access-perspectives" aria-label={c.perspective}>
        {accessMissions.map((id, i) => (
          <Link
            key={id}
            href={accessHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <AccessWorkbench key={view} mission={view} />
    </section>
  );
}
function AccessMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {accessMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <GuidedMissionLink module="access-control" mission={id} />
          </div>
        </article>
      ))}
    </section>
  );
}
function AccessSummary() {
  const t = useAccess();
  return (
    <section className="compute-summary access-summary">
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
            {t.facts.completed.length}/{accessMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{accessItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={accessHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateAccessAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <AccessMissions />
      <AccessSources />
    </section>
  );
}
function AccessTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function AccessSources({ topic }: { topic?: AccessTopic }) {
  const ids =
    topic && topic in accessStudySources
      ? accessStudySources[topic as keyof typeof accessStudySources]
      : (Object.keys(accessSources) as (keyof typeof accessSources)[]);
  return (
    <section className="compute-sources source-section">
      <SourceDisclosure
        entries={ids.map((id) => ({ id, url: accessSources[id][1], title: accessSources[id][0] }))}
      />
      <p className="source-context">{c.labels.human}</p>
    </section>
  );
}

function AccessPrerequisites() {
  return (
    <nav className="access-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/architecture?topic=subscriptions">{c.links.core}</Link>
      <Link href="/learn/identity?topic=summary">{c.links.identity}</Link>
      <Link href="/portal">{c.links.sandbox}</Link>
    </nav>
  );
}
