'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { storageNb as c } from '@/content/nb';
import {
  storageHref,
  storageMissions,
  storageItemIds,
  storageLimit,
  evaluateStorageAttempt,
  type StorageTopic,
} from '@/domain/curriculum/storage';
import { storageSources, storageStudySources } from '@/domain/curriculum/storage-sources';
import { PortalDialog } from '@/features/portal/shared';
import { useState } from 'react';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { infrastructure } from '@/domain/sandbox/model';
import { useStorage } from './storage-provider';
import { StorageAssessment } from './storage-assessment';
import { StorageWorkbench } from './storage-workbench';
import { StorageRelationships } from './storage-visuals';
import './compute.css';
import './storage.css';
export function StorageRecovery({ focus = false }: { focus?: boolean }) {
  const t = useStorage(),
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

export function StorageLesson({
  topic,
  selected,
  journal = false,
  perspective,
}: {
  topic: StorageTopic;
  selected?: string | null;
  journal?: boolean;
  perspective?: string | null;
}) {
  const t = useStorage();
  useEffect(() => {
    if (t.ready && !t.issue && !journal) t.store.event({ kind: 'visit', topic });
  }, [t.ready, t.issue, t.store, topic, journal]);
  if (journal)
    return (
      <article className="compute-lesson compute-journal storage-lesson">
        <h2>{c.title}</h2>
        <p>{c.prerequisites}</p>
        <p>{c.available}</p>
        {Object.keys(c.sections).map((id) => (
          <StorageTheory key={id} topic={id as keyof typeof c.sections} />
        ))}
        <StorageSources />
      </article>
    );
  return (
    <article className="compute-lesson storage-lesson">
      <header>
        <small>
          {c.path} · {c.part} ·1.0.0
        </small>
        <h2 data-activity-heading tabIndex={-1}>
          {c.topics[topic]}
        </h2>
      </header>
      {topic !== 'assessment' &&
        (t.issue ? <StorageRecovery /> : !t.ready ? <p>{c.storage.loading}</p> : null)}
      {t.save.events.length >= storageLimit - 5 && <p role="status">{c.storage.capacity}</p>}
      {topic === 'assessment' ? (
        <StorageAssessment selected={selected ?? null} />
      ) : topic === 'summary' ? (
        <StorageSummary />
      ) : topic === 'missions' ? (
        <StorageMissions />
      ) : (
        <>
          <StorageTheory topic={topic} />
          {topic === 'introduction' && (
            <>
              <p>{c.prerequisites}</p>
              <p className="compute-boundary">{c.available}</p>
              <StorageMissions />
            </>
          )}
          {topic === 'disks' && <StorageActualDisks />}
          {topic === 'studio' && <StorageStudio perspective={perspective} />}
          <StorageSources topic={topic} />
        </>
      )}
    </article>
  );
}
export function StorageActualDisks() {
  const technical = useSandbox(),
    safe = technical.ready && !technical.issue;
  const resources = safe ? infrastructure(technical.attempt.engine.world) : [];
  const vms = resources.filter((r) => r.kind === 'vm');
  return (
    <aside className="storage-actual-context">
      <h3>{c.actualContext}</h3>
      <p>{c.actualBoundary}</p>
      {!safe ? (
        <p role="status">{c.actualUnverified}</p>
      ) : vms.length === 0 ? (
        <p>{c.actualEmpty}</p>
      ) : (
        <ul>
          {vms.map((vm) => (
            <li key={vm.id}>
              <strong>{vm.name}</strong> · <code>{vm.id}</code>
              <dl>
                <div>
                  <dt>OS disk</dt>
                  <dd>
                    <code>{vm.kind === 'vm' ? vm.osDiskId : '—'}</code>
                  </dd>
                </div>
                <div>
                  <dt>Data disk</dt>
                  <dd>
                    <code>{vm.kind === 'vm' ? (vm.dataDiskId ?? c.model.noDisk) : '—'}</code>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
      <Link href="/portal?area=vms">{c.actualOpen}</Link>
    </aside>
  );
}
function StorageStudio({ perspective }: { perspective?: string | null }) {
  const t = useStorage();
  const view = storageMissions.find((k) => k === perspective) ?? t.facts.guide?.mission ?? 'design';
  return (
    <section className="storage-studio" aria-label={c.topics.studio}>
      <nav className="storage-perspectives" aria-label={c.perspective}>
        {storageMissions.map((id, i) => (
          <Link
            key={id}
            href={storageHref('studio') + '&perspective=' + id}
            aria-current={view === id ? 'page' : undefined}
          >
            <span>0{i + 1}</span>
            {id === 'design'
              ? c.labels.workload
              : id === 'accounts'
                ? c.labels.accounts
                : c.labels.delivery}
          </Link>
        ))}
      </nav>
      <StorageWorkbench key={view} mission={view} />
      <StorageRelationships />
    </section>
  );
}
function StorageMissions() {
  return (
    <section className="compute-mission-list" aria-label={c.topics.missions}>
      {storageMissions.map((id, i) => (
        <article key={id}>
          <b>0{i + 1}</b>
          <div>
            <h3>{c.missions[id].title}</h3>
            <p>{c.missions[id].situation}</p>
            <p>{c.missions[id].goal}</p>
            <Link href={storageHref('studio') + '&perspective=' + id}>{c.labels.begin} →</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
function StorageSummary() {
  const t = useStorage();
  return (
    <section className="compute-summary storage-summary">
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
            {t.facts.completed.length}/{storageMissions.length}
          </dd>
        </div>
        <div>
          <dt>{c.labels.independent}</dt>
          <dd>
            {t.facts.firsts.length}/{storageItemIds.length}
          </dd>
        </div>
      </dl>
      <p>{c.summaryBoundary}</p>
      <ul>
        {t.facts.firsts.map((a) => (
          <li key={a.id}>
            <Link href={storageHref('assessment', a.item)}>{a.item}</Link> ·{' '}
            {a.assisted ? c.labels.aided : a.retry ? c.labels.retry : c.labels.unaided} ·{' '}
            {evaluateStorageAttempt(a).relation ? c.assessment.pass : c.assessment.fail}
          </li>
        ))}
      </ul>
      <StorageMissions />
      <StorageSources />
    </section>
  );
}
function StorageTheory({ topic }: { topic: keyof typeof c.sections }) {
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

export function StorageSources({ topic }: { topic?: StorageTopic }) {
  const ids =
    topic && topic in storageStudySources
      ? storageStudySources[topic as keyof typeof storageStudySources]
      : (Object.keys(storageSources) as (keyof typeof storageSources)[]);
  return (
    <section className="compute-sources">
      <h3>{c.labels.sources}</h3>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={storageSources[id][1]} target="_blank" rel="noreferrer">
              {id} · {storageSources[id][0]} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{c.labels.human}</p>
    </section>
  );
}
