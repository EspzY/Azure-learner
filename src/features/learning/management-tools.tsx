'use client';
import { SourceDisclosure } from './source-disclosure';
import { GuidedMissionLink } from '@/features/course/guided-mission-link';
import { useEffect } from 'react';
import Link from 'next/link';
import { toolsNb as c } from '@/content/nb';
import {
  toolsHref,
  toolsMissions,
  toolsItemIds,
  toolsLimit,
  evaluateToolsAttempt,
  type ToolsTopic,
} from '@/domain/curriculum/management-tools';
import { toolsSources, toolsStudySources } from '@/domain/curriculum/management-tools-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useTools } from './management-tools-provider';
import { ToolsAssessment } from './management-tools-assessment';
import { ToolsWorkbench } from './management-tools-workbench';
import './compute.css';
import './storage.css';
import './management-tools.css';
export function ToolsRecovery({ focus = false }: { focus?: boolean }) {
  const t = useTools(),
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

export function ToolsLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: ToolsTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useTools();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson tools-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <ToolsPrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <ToolsTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <ToolsSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson tools-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <ToolsRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= toolsLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <ToolsAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <ToolsSummary />
      ) : topic === 'missions' ? (
        <ToolsMissions />
      ) : (
        <>
          {topic === 'studio' ? (
            <>
              <p>{c.studioLead}</p>
              <ToolsStudio perspective={perspective} />
              <ToolsTheory topic={topic} />
            </>
          ) : (
            <ToolsTheory topic={topic} />
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <ToolsPrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <ToolsMissions />
            </>
          )}
          <ToolsSources topic={topic} />
        </>
      )}
    </article>
  );
}
function ToolsStudio({ perspective }: { perspective?: string | null }) {
  const t = useTools();
  const view = toolsMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'intent';
  return (
    <section className="tools-studio" aria-label={c.topics.studio}>
      <nav className="tools-perspectives" aria-label={c.perspective}>
        {toolsMissions.map((id, i) => (
          <Link
            key={id}
            href={toolsHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <ToolsWorkbench key={view} mission={view} />
    </section>
  );
}
function ToolsMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {toolsMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <GuidedMissionLink module="management-tools" mission={id} />
          </div>
        </article>
      ))}
    </section>
  );
}
function ToolsSummary() {
  const t = useTools();
  return (
    <section className="compute-summary tools-summary">
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
            {t.facts.completed.length}/{toolsMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{toolsItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={toolsHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateToolsAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <ToolsMissions />
      <ToolsSources />
    </section>
  );
}
function ToolsTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function ToolsSources({ topic }: { topic?: ToolsTopic }) {
  const ids =
    topic && topic in toolsStudySources
      ? toolsStudySources[topic as keyof typeof toolsStudySources]
      : (Object.keys(toolsSources) as (keyof typeof toolsSources)[]);
  return (
    <section className="compute-sources source-section">
      <SourceDisclosure
        entries={ids.map((id) => ({ id, url: toolsSources[id][1], title: toolsSources[id][0] }))}
      />
      <p className="source-context">{c.labels.human}</p>
    </section>
  );
}

function ToolsPrerequisites() {
  return (
    <nav className="tools-prerequisites" aria-label={c.links.title}>
      <Link href="/learn/architecture?topic=subscriptions">{c.links.core}</Link>
      <Link href="/learn/access-control?topic=summary">{c.links.identity}</Link>
      <Link href="/learn/governance?topic=summary">{c.links.governance}</Link>
      <Link href="/portal">{c.links.sandbox}</Link>
    </nav>
  );
}
