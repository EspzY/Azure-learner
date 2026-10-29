'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { connectivityNb as c } from '@/content/nb';
import {
  connectivityHref,
  connectivityTopics,
  connectivityMissions,
  connectivityMissionTopic,
  connectivityLimit,
  connectivityItemIds,
  evaluateConnectivityAttempt,
  type ConnectivityTopic,
} from '@/domain/curriculum/connectivity';
import {
  connectivitySources,
  connectivityStudySources,
} from '@/domain/curriculum/connectivity-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { infrastructure } from '@/domain/sandbox/model';
import { useConnectivity } from './connectivity-provider';
import { ConnectivityAssessment } from './connectivity-assessment';
import { ConnectivityWorkbench } from './connectivity-workbench';
import './compute.css';
import './connectivity.css';

export function ConnectivityRecovery({ focus = false }: { focus?: boolean }) {
  const t = useConnectivity(),
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

export function ConnectivityEntry({
  navigation = false,
  topic,
  onNavigate,
}: {
  navigation?: boolean;
  topic?: string;
  onNavigate?: () => void;
}) {
  const t = useConnectivity();
  return navigation ? (
    <section className="course-compute-nav connectivity-nav">
      <Link
        href={connectivityHref('introduction')}
        aria-current={topic ? 'page' : undefined}
        onClick={onNavigate}
      >
        {c.title} · {c.partB}
      </Link>
      <small>{c.available}</small>
      {topic && (
        <ol className="course-units">
          {connectivityTopics.map((id) => (
            <li key={id}>
              <Link
                href={connectivityHref(id)}
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
    <section className="connectivity-entry" aria-label={c.title}>
      <div>
        <small>
          {c.path} · {c.partB}
        </small>
        <h2>{c.title}</h2>
        <p>{c.overview}</p>
        <p>{c.available}</p>
      </div>
      <Link
        className="course-primary"
        href={connectivityHref(
          t.facts.active ? 'assessment' : t.facts.topic,
          t.facts.active ? t.facts.current?.item : undefined,
        )}
      >
        {t.facts.active ? c.assessment.title : c.topics[t.facts.topic]} →
      </Link>
    </section>
  );
}

export function ConnectivityLesson({
  topic,
  selected,
  journal = false,
}: {
  topic: ConnectivityTopic;
  selected?: string | null;
  journal?: boolean;
}) {
  const t = useConnectivity();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal connectivity-lesson">
        <h2>
          {c.title} · {c.partB}
        </h2>
        <p>{c.prerequisites}</p>
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <ConnectivityTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <ConnectivitySources />
      </article>
    );
  return (
    <article className="compute-lesson connectivity-lesson">
      <header>
        <small>
          {c.path} · {c.partB} ·1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <ConnectivityRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= connectivityLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <ConnectivityAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <ConnectivitySummary />
      ) : topic === 'missions' ? (
        <ConnectivityMissions />
      ) : (
        <>
          <ConnectivityTheory topic={topic} />
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <p className="compute-boundary">{c.available}</p>
              <PartABridge />
              <ConnectivityMissions />
            </>
          )}
          {topic === 'vpn' && <ConnectivityWorkbench mission="diagnose" />}
          {topic === 'expressroute' && <ConnectivityWorkbench mission="choose" />}
          {topic === 'endpoints' && <ConnectivityWorkbench mission="endpoint" />}
          {topic === 'private-dns' && <ConnectivityWorkbench mission="dns" />}
          {topic === 'hybrid' && (
            <>
              <ConnectivityActualContext />
              <ConnectivityExplorer hybrid />
            </>
          )}
          {topic === 'explorer' && (
            <>
              <ConnectivityActualContext />
              <ConnectivityExplorer />
            </>
          )}
          <ConnectivitySources topic={topic} />
        </>
      )}
    </article>
  );
}

function PartABridge() {
  return (
    <aside className="connectivity-part-a">
      <Link href="/learn/networking?topic=introduction">{c.partALink}</Link>
      <p>{c.partAContext}</p>
      <Link href="/learn/networking?topic=summary">{c.partASummary}</Link>
    </aside>
  );
}

function ConnectivityActualContext() {
  const technical = useSandbox(),
    safe = technical.ready && !technical.issue,
    resources = safe ? infrastructure(technical.attempt.engine.world) : [],
    vms = resources.filter((r) => r.kind === 'vm');
  return (
    <aside className="connectivity-actual-context">
      <h4>{c.actualContext}</h4>
      <p>{c.actualBoundary}</p>
      {!safe ? (
        <p role="status">{c.actualUnverified}</p>
      ) : vms.length === 0 ? (
        <p>{c.actualEmpty}</p>
      ) : (
        <ul>
          {vms.map((vm) => (
            <li key={vm.id}>
              <strong>{vm.name}</strong> · VM <code>{vm.id}</code> → NIC{' '}
              <code>{vm.kind === 'vm' ? vm.nicId : '—'}</code>
            </li>
          ))}
        </ul>
      )}
      <Link href="/learn/networking?topic=dependencies">{c.actualOpen}</Link>
    </aside>
  );
}

function ConnectivityTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function ConnectivitySources({ topic }: { topic?: ConnectivityTopic }) {
  const ids =
    topic && topic in connectivityStudySources
      ? connectivityStudySources[topic as keyof typeof connectivityStudySources]
      : (Object.keys(connectivitySources) as (keyof typeof connectivitySources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={connectivitySources[id][1]} target="_blank" rel="noreferrer">
              {id} · {connectivitySources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}

function ConnectivityExplorer({ hybrid = false }: { hybrid?: boolean }) {
  const t = useConnectivity(),
    missions = hybrid ? (['choose', 'diagnose'] as const) : (['endpoint', 'dns'] as const),
    [view, setView] = useState<(typeof connectivityMissions)[number]>(
      t.facts.guide && missions.some((m) => m === t.facts.guide!.mission)
        ? t.facts.guide.mission
        : missions[0],
    );
  return (
    <section className="connectivity-explorer">
      <nav className="compute-actions" aria-label={c.perspective}>
        {missions.map((id) => (
          <button key={id} aria-pressed={view === id} onClick={() => setView(id)}>
            {c.missions[id].title}
          </button>
        ))}
      </nav>
      <ConnectivityWorkbench key={view} mission={view} />
    </section>
  );
}

function ConnectivityMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {connectivityMissions.map((id, n) => (
        <article key={id}>
          <b>0{n + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={connectivityHref(connectivityMissionTopic[id])}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}

function ConnectivitySummary() {
  const t = useConnectivity();
  return (
    <section className="compute-summary connectivity-summary">
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
          <dd>{t.facts.completed.length}/4</dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{connectivityItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <PartABridge />
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={connectivityHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateConnectivityAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <ConnectivityMissions />
      <ConnectivitySources />
    </section>
  );
}
