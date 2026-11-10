'use client';
import { SourceDisclosure } from './source-disclosure';
import { GuidedMissionLink } from '@/features/course/guided-mission-link';
import { useEffect } from 'react';
import Link from 'next/link';
import { migrationNb as c } from '@/content/nb';
import {
  migrationHref,
  migrationMissions,
  migrationItemIds,
  migrationLimit,
  evaluateMigrationAttempt,
  type MigrationTopic,
} from '@/domain/curriculum/migration';
import { migrationSources, migrationStudySources } from '@/domain/curriculum/migration-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useMigration } from './migration-provider';
import { MigrationAssessment } from './migration-assessment';
import { MigrationWorkbench } from './migration-workbench';
import './compute.css';
import './storage.css';
import './migration.css';
export function MigrationRecovery({ focus = false }: { focus?: boolean }) {
  const t = useMigration(),
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

export function MigrationLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: MigrationTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useMigration();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson migration-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <MigrationPrerequisites />
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <MigrationTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <MigrationSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson migration-lesson">
      <header>
        <small>
          {c.path} · {c.part} · 1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <MigrationRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= migrationLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <MigrationAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <MigrationSummary />
      ) : topic === 'missions' ? (
        <MigrationMissions />
      ) : (
        <>
          {topic === 'studio' ? (
            <>
              <p>{c.studioLead}</p>
              <MigrationStudio perspective={perspective} />
              <MigrationTheory topic={topic} />
            </>
          ) : (
            <MigrationTheory topic={topic} />
          )}
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <MigrationPrerequisites />
              <p className="compute-boundary">{c.available}</p>
              <MigrationMissions />
            </>
          )}

          <MigrationSources topic={topic} />
        </>
      )}
    </article>
  );
}
function MigrationStudio({ perspective }: { perspective?: string | null }) {
  const t = useMigration();
  const view =
    migrationMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'method';
  return (
    <section className="migration-studio" aria-label={c.topics.studio}>
      <nav className="migration-perspectives" aria-label={c.perspective}>
        {migrationMissions.map((id, i) => (
          <Link
            key={id}
            href={migrationHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {c.labels[id]}
          </Link>
        ))}
      </nav>
      <MigrationWorkbench key={view} mission={view} />
    </section>
  );
}
function MigrationMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {migrationMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <GuidedMissionLink module="migration" mission={id} />
          </div>
        </article>
      ))}
    </section>
  );
}
function MigrationSummary() {
  const t = useMigration();
  return (
    <section className="compute-summary migration-summary">
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
            {t.facts.completed.length}/{migrationMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{migrationItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={migrationHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateMigrationAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <MigrationMissions />
      <MigrationSources />
    </section>
  );
}
function MigrationTheory({ topic }: { topic: keyof typeof c.sections }) {
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
      {topic === 'azcopy' && (
        <section className="migration-commands">
          <h4>{c.commands.title}</h4>
          <p>{c.commands.boundary}</p>
          {c.commands.examples.map(([name, text]) => (
            <div key={name}>
              <h5>{name}</h5>
              <pre>
                <code>{text}</code>
              </pre>
            </div>
          ))}
        </section>
      )}
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

export function MigrationSources({ topic }: { topic?: MigrationTopic }) {
  const ids =
    topic && topic in migrationStudySources
      ? migrationStudySources[topic as keyof typeof migrationStudySources]
      : (Object.keys(migrationSources) as (keyof typeof migrationSources)[]);
  return (
    <section className="compute-sources source-section">
      <SourceDisclosure
        entries={ids.map((id) => ({
          id,
          url: migrationSources[id].url,
          title: migrationSources[id].title,
        }))}
      />
      <p className="source-context">{c.labels.human}</p>
    </section>
  );
}

function MigrationPrerequisites() {
  return (
    <nav className="compute-related">
      <Link href="/learn/storage?topic=summary">{c.links.storage}</Link>
      <Link href="/learn/storage-resilience?topic=summary">{c.links.resilience}</Link>
      <Link href="/learn/connectivity?topic=summary">{c.links.network}</Link>
      <Link href="/learn/management-tools?topic=summary">{c.links.tools}</Link>
      <Link href="/portal">{c.links.sandbox}</Link>
    </nav>
  );
}
