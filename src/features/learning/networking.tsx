'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { networkingNb as c } from '@/content/nb';
import {
  networkingHref,
  networkingTopics,
  networkingMissions,
  networkingMissionTopic,
  networkingLimit,
  evaluateNetworkingAttempt,
  type NetworkingTopic,
} from '@/domain/curriculum/networking';
import { networkingSources, networkingStudySources } from '@/domain/curriculum/networking-sources';
import { networkingInspection } from '@/domain/curriculum/networking-inspection';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { PortalDialog } from '@/features/portal/shared';
import { useNetworking } from './networking-provider';
import { NetworkingAssessment } from './networking-assessment';
import { NetworkingWorkbench } from './networking-workbench';
import { NetworkingInspectionLesson } from './networking-inspection';
import { NetworkingStructureFigure } from './networking-visuals';
import './compute.css';
import './networking.css';
export function NetworkingRecovery({ focus = false }: { focus?: boolean }) {
  const t = useNetworking(),
    [confirm, setConfirm] = useState(false);
  return (
    <section className="course-storage" role="status">
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
export function NetworkingEntry({
  navigation = false,
  topic,
  onNavigate,
}: {
  navigation?: boolean;
  topic?: string;
  onNavigate?: () => void;
}) {
  const t = useNetworking();
  return navigation ? (
    <section className="course-compute-nav">
      <Link
        href={networkingHref('introduction')}
        aria-current={topic ? 'page' : undefined}
        onClick={onNavigate}
      >
        {c.title} · {c.partA}
      </Link>
      <small>{c.available}</small>
      {topic && (
        <ol className="course-units">
          {networkingTopics.map((id) => (
            <li key={id}>
              <Link
                href={networkingHref(id)}
                aria-current={id === topic ? 'step' : undefined}
                onClick={onNavigate}
              >
                {c.topics[id]}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  ) : (
    <section className="networking-entry" aria-label={c.title}>
      <div>
        <small>
          {c.path} · {c.partA}
        </small>
        <h2>{c.title}</h2>
        <p>{c.overview}</p>
        <p>{c.available}</p>
      </div>
      <Link
        className="course-primary"
        href={networkingHref(
          t.facts.active ? 'assessment' : t.facts.topic,
          t.facts.active ? t.facts.current?.item : undefined,
        )}
      >
        {t.facts.active ? c.assessment.title : c.topics[t.facts.topic]} →
      </Link>
    </section>
  );
}
export function NetworkingLesson({
  topic,
  selected,
  journal = false,
}: {
  topic: NetworkingTopic;
  selected?: string | null;
  journal?: boolean;
}) {
  const t = useNetworking();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal networking-lesson">
        <h2>
          {c.title} · {c.partA}
        </h2>
        <p>{c.available}</p>
        <p>{c.prerequisites}</p>
        {Object.keys(c.sections).map((id) => (
          <NetworkingTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <NetworkingSources />
      </article>
    );
  return (
    <article className="compute-lesson networking-lesson">
      <header>
        <small>
          {c.path} · {c.partA} ·1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <NetworkingRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= networkingLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <NetworkingAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <NetworkingSummary />
      ) : topic === 'missions' ? (
        <NetworkingMissions />
      ) : (
        <>
          <NetworkingTheory topic={topic} />
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <p className="compute-boundary">{c.available}</p>
              <NetworkingMissions />
            </>
          )}
          {topic === 'dependencies' && <NetworkingInspectionLesson />}
          {topic === 'addressing' && <NetworkingWorkbench mission="address" />}
          {topic === 'peering' && <NetworkingWorkbench mission="peering" />}
          {topic === 'dns' && <NetworkingWorkbench mission="dns" />}
          {topic === 'explorer' && <NetworkingExplorer />}
          <NetworkingSources topic={topic} />
        </>
      )}
    </article>
  );
}
function NetworkingTheory({ topic }: { topic: keyof typeof c.sections }) {
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
      {(topic === 'vnet' || topic === 'dependencies') && <NetworkingStructureFigure />}
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
export function NetworkingSources({ topic }: { topic?: NetworkingTopic }) {
  const ids =
    topic && topic in networkingStudySources
      ? networkingStudySources[topic as keyof typeof networkingStudySources]
      : (Object.keys(networkingSources) as (keyof typeof networkingSources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={networkingSources[id][1]} target="_blank" rel="noreferrer">
              {id} · {networkingSources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}
function NetworkingExplorer() {
  const t = useNetworking(),
    [view, setView] = useState<(typeof networkingMissions)[number]>(
      t.facts.guide?.mission ?? 'inspect',
    );
  return (
    <section className="network-explorer">
      <h3>{c.topics.explorer}</h3>
      <nav className="compute-actions" aria-label={c.perspective}>
        {networkingMissions.map((id, i) => (
          <button key={id} aria-pressed={view === id} onClick={() => setView(id)}>
            {c.perspectives[i]}
          </button>
        ))}
      </nav>
      {view === 'inspect' ? (
        <NetworkingInspectionLesson />
      ) : (
        <NetworkingWorkbench key={view} mission={view} />
      )}
    </section>
  );
}
function NetworkingMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {networkingMissions.map((id, n) => (
        <article key={id}>
          <b>0{n + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={networkingHref(networkingMissionTopic[id])}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
function NetworkingSummary() {
  const t = useNetworking(),
    technical = useSandbox(),
    technicalSafe = technical.ready && !technical.issue,
    actual =
      technicalSafe &&
      t.facts.guided.some((g) => {
        const e = g.attempt ? technical.store.engineFor(g.attempt) : null;
        return e && networkingInspection(g, e, g.attempt!).complete;
      });
  return (
    <section className="compute-summary">
      <p>{c.available}</p>
      <p>{c.labels.noXp}</p>
      <dl>
        <div>
          <dt>{c.labels.visited}</dt>
          <dd>{t.facts.visited.filter((x) => x in c.sections).length}/8</dd>
        </div>
        <div>
          <dt>{c.labels.guided}</dt>
          <dd>
            {technicalSafe
              ? `${t.facts.completed.length + Number(actual)}/4`
              : c.inspection.unverified}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>{t.facts.firsts.length}/12</dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      {!technicalSafe && (
        <p>
          {c.inspection.unverified} <Link href="/portal">{c.labels.portal}</Link>
        </p>
      )}
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={networkingHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateNetworkingAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <NetworkingMissions />
      <NetworkingSources />
    </section>
  );
}
