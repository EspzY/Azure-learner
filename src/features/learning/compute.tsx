'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { computeNb as c } from '@/content/nb';
import {
  computeHref,
  computeTopics,
  computeMissions,
  computeMissionTopic,
  computeLimit,
  computeGuidedFacts,
  evaluateComputeAttempt,
  type ComputeTopic,
} from '@/domain/curriculum/compute';
import { computeSources, computeStudySources } from '@/domain/curriculum/compute-sources';
import { computeVmFacts } from '@/domain/curriculum/compute-vm';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { PortalDialog } from '@/features/portal/shared';
import { useCompute } from './compute-provider';
import { ComputeAssessment } from './compute-assessment';
import { ComputeWorkbench } from './compute-workbench';
import { ComputeVmLesson } from './compute-vm';
import { ComputeComparison, ComputeConceptFigure } from './compute-visuals';
import './compute.css';
export function ComputeRecovery({ focus = false }: { focus?: boolean }) {
  const t = useCompute(),
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
export function ComputeEntry({
  navigation = false,
  topic,
  onNavigate,
}: {
  navigation?: boolean;
  topic?: string;
  onNavigate?: () => void;
}) {
  const t = useCompute();
  return navigation ? (
    <section className="course-compute-nav">
      <Link
        href={computeHref('introduction')}
        aria-current={topic ? 'page' : undefined}
        onClick={onNavigate}
      >
        {c.title}
      </Link>
      <small>{c.available}</small>
      {topic && (
        <ol className="course-units">
          {computeTopics.map((id) => (
            <li key={id}>
              <Link
                href={computeHref(id)}
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
    <section className="compute-entry" aria-label={c.title}>
      <div>
        <small>{c.path}</small>
        <h2>{c.title}</h2>
        <p>{c.overview}</p>
        <p>{c.available}</p>
      </div>
      <Link
        className="course-primary"
        href={computeHref(
          t.facts.active ? 'assessment' : t.facts.topic,
          t.facts.active ? t.facts.current?.item : undefined,
        )}
      >
        {t.facts.active ? c.assessment.title : c.topics[t.facts.topic]} →
      </Link>
    </section>
  );
}
export function ComputeLesson({
  topic,
  selected,
  journal = false,
}: {
  topic: ComputeTopic;
  selected?: string | null;
  journal?: boolean;
}) {
  const t = useCompute();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        {Object.keys(c.sections).map((id) => (
          <ComputeTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <ComputeSources />
      </article>
    );
  return (
    <article className="compute-lesson">
      <header>
        <small>{c.path} ·1.0.0</small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <ComputeRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= computeLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <ComputeAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <ComputeSummary />
      ) : topic === 'missions' ? (
        <ComputeMissions />
      ) : (
        <>
          <ComputeTheory topic={topic} />
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <ComputeComparison />
              <ComputeMissions />
            </>
          )}
          {topic === 'fundamentals' && <ComputeComparison />}
          {topic === 'functions' && (
            <Link href="/learn/computing?topic=serverless-concept">
              {c.topics.functions} → Serverless Execution Explorer
            </Link>
          )}
          {topic === 'dependencies' && <ComputeVmLesson />}
          {topic === 'containers' && <ComputeWorkbench mission="container" />}
          {topic === 'resilience' && <ComputeWorkbench mission="capacity" />}
          {topic === 'hosting' && <ComputeWorkbench mission="hosting" />}
          {topic === 'desktop' && <ComputeWorkbench mission="hosting" desktop />}
          <ComputeSources topic={topic} />
        </>
      )}
    </article>
  );
}
function ComputeTheory({ topic }: { topic: keyof typeof c.sections }) {
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
          <ComputeConceptFigure topic={topic} />
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
export function ComputeSources({ topic }: { topic?: ComputeTopic }) {
  const ids =
    topic && topic in computeStudySources
      ? computeStudySources[topic as keyof typeof computeStudySources]
      : (Object.keys(computeSources) as (keyof typeof computeSources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={computeSources[id][1]} target="_blank" rel="noreferrer">
              {id} · {computeSources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}
function ComputeMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {computeMissions.map((id, n) => (
        <article key={id}>
          <b>0{n + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={computeHref(computeMissionTopic[id])}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
function ComputeSummary() {
  const t = useCompute(),
    technical = useSandbox();
  const technicalSafe = technical.ready && !technical.issue;
  const vm =
    technicalSafe &&
    t.facts.guided.some((g) => {
      const engine = g.attempt ? technical.store.engineFor(g.attempt) : null;
      return engine && computeVmFacts(g, engine, g.attempt!).complete;
    });
  return (
    <section className="compute-summary">
      <p>{c.labels.noXp}</p>
      <dl>
        <div>
          <dt>{c.labels.visited}</dt>
          <dd>{t.facts.visited.filter((x) => x in c.sections).length}/11</dd>
        </div>
        <div>
          <dt>{c.labels.guided}</dt>
          <dd>
            {technicalSafe ? `${t.facts.completed.length + Number(vm)}/4` : c.vmCopy.unverified}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>{t.facts.firsts.length}/14</dd>
        </div>
      </dl>
      {!technicalSafe && (
        <p role="status">
          {c.vmCopy.uncertain} <Link href="/portal">{c.labels.portal}</Link>
        </p>
      )}
      <ul>
        {computeMissions.map((id) => (
          <li key={id}>
            <Link href={computeHref(computeMissionTopic[id])}>{c.missions[id].title}</Link> ·{' '}
            {id === 'vm' && !technicalSafe
              ? c.vmCopy.unverified
              : (
                    id === 'vm'
                      ? vm
                      : t.facts.guided.some(
                          (g) => g.mission === id && computeGuidedFacts(g).complete,
                        )
                  )
                ? c.labels.done
                : c.labels.pending}
          </li>
        ))}
      </ul>
      <div className="compute-table" role="region" aria-label={c.labels.first} tabIndex={0}>
        <table>
          <caption>{c.labels.first}</caption>
          <thead>
            <tr>
              <th>{c.assessment.case}</th>
              <th>{c.assessment.result}</th>
              <th>{c.assessment.draft}</th>
            </tr>
          </thead>
          <tbody>
            {t.facts.firsts.map((a) => (
              <tr key={a.id}>
                <th>
                  <Link href={computeHref('assessment', a.item)}>{a.item}</Link>
                </th>
                <td>
                  {evaluateComputeAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
                </td>
                <td>{a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{c.available}</p>
      <p>{c.labels.human}</p>
      <Link href="/learn">← {c.courseOverview}</Link>
      <ComputeSources />
    </section>
  );
}
