'use client';
import { GuidedMissionLink } from '@/features/course/guided-mission-link';
import { useEffect } from 'react';
import Link from 'next/link';
import { governanceNb as c } from '@/content/nb';
import {
  governanceHref,
  governanceMissions,
  governanceItemIds,
  governanceLimit,
  evaluateGovernanceAttempt,
  type GovernanceTopic,
} from '@/domain/curriculum/governance';
import { governanceSources, governanceStudySources } from '@/domain/curriculum/governance-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useGovernance } from './governance-provider';
import { GovernanceAssessment } from './governance-assessment';
import { GovernanceWorkbench } from './governance-workbench';
import './compute.css';
import './storage.css';
import './governance.css';
export function GovernanceRecovery({ focus = false }: { focus?: boolean }) {
  const t = useGovernance(),
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

export function GovernanceLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: GovernanceTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useGovernance();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson governance-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <GovernancePrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <GovernanceTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <GovernanceSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson governance-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <GovernanceRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= governanceLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <GovernanceAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <GovernanceSummary />
      ) : topic === 'missions' ? (
        <GovernanceMissions />
      ) : (
        <>
          {topic === 'studio' ? (
            <>
              <p>{c.studioLead}</p>
              <GovernanceStudio perspective={perspective} />
              <GovernanceTheory topic={topic} />
            </>
          ) : (
            <GovernanceTheory topic={topic} />
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <GovernancePrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <GovernanceMissions />
            </>
          )}
          <GovernanceSources topic={topic} />
        </>
      )}
    </article>
  );
}
function GovernanceStudio({ perspective }: { perspective?: string | null }) {
  const t = useGovernance();
  const view =
    governanceMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'data';
  return (
    <section className="governance-studio" aria-label={c.topics.studio}>
      <nav className="governance-perspectives" aria-label={c.perspective}>
        {governanceMissions.map((id, i) => (
          <Link
            key={id}
            href={governanceHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <GovernanceWorkbench key={view} mission={view} />
    </section>
  );
}
function GovernanceMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {governanceMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <GuidedMissionLink module="governance" mission={id} />
          </div>
        </article>
      ))}
    </section>
  );
}
function GovernanceSummary() {
  const t = useGovernance();
  return (
    <section className="compute-summary governance-summary">
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
            {t.facts.completed.length}/{governanceMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{governanceItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={governanceHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateGovernanceAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <GovernanceMissions />
      <GovernanceSources />
    </section>
  );
}
function GovernanceTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function GovernanceSources({ topic }: { topic?: GovernanceTopic }) {
  const ids =
    topic && topic in governanceStudySources
      ? governanceStudySources[topic as keyof typeof governanceStudySources]
      : (Object.keys(governanceSources) as (keyof typeof governanceSources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={governanceSources[id][1]} target="_blank" rel="noreferrer">
              {id} · {governanceSources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}

function GovernancePrerequisites() {
  return (
    <nav className="governance-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/architecture?topic=subscriptions">{c.links.core}</Link>
      <Link href="/learn/access-control?topic=summary">{c.links.identity}</Link>
      <Link href="/learn/cost?topic=tags">{c.links.cost}</Link>
      <Link href="/portal">{c.links.sandbox}</Link>
    </nav>
  );
}
