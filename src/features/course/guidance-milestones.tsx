'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { nb, regionLabels } from '@/content/nb';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useCourse } from './provider';
import { usePractical } from './practical-provider';
import { labFacts } from '@/domain/course/model';
import {
  milestoneAutoContext,
  milestoneObservations,
  type GuidedMilestoneContext,
  type MilestoneObservation,
} from '@/domain/guidance/milestones';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import type { PortalLocation } from '@/domain/portal/model';
import type { Region } from '@/domain/simulation';
import { SavvyShark } from './savvy-shark';
import './mission-briefing.css';
import './guidance-milestones.css';
function claim(key: string) {
  try {
    return claimMilestone(window.localStorage, key);
  } catch {
    return 'unavailable' as const;
  }
}

export function GuidanceMilestones({
  location,
  independent,
}: {
  location: PortalLocation;
  independent: boolean;
}) {
  const technical = useSandbox(),
    course = useCourse(),
    practical = usePractical();
  const engine = technical.attempt.engine;
  const session = practical.current;
  const findings = useMemo(
    () => labFacts(course.save.lab, engine, technical.attemptNumber),
    [course.save.lab, engine, technical.attemptNumber],
  );
  const context = useMemo<GuidedMilestoneContext | null>(
    () =>
      independent || !technical.ready || !course.ready || !practical.ready
        ? null
        : session &&
            session.status === 'active' &&
            session.mode === 'guided' &&
            location.practice === session.kind
          ? {
              scope: `practical-${session.id}`,
              attempt: session.attempt,
              boundary: session.boundary,
              kind: session.kind,
              inspected: session.inspected,
              groupId: findings.group?.id,
            }
          : location.lab && course.save.lab && findings.verifiable
            ? {
                scope: `web-${course.save.lab.boundary ?? 'origin'}`,
                attempt: course.save.lab.attempt,
                boundary: course.save.lab.boundary,
                kind: 'paas',
                inspected: [],
                groupId: findings.group?.id,
              }
            : null,
    [
      independent,
      technical.ready,
      course.ready,
      practical.ready,
      session,
      location.practice,
      location.lab,
      findings,
      course.save.lab,
    ],
  );
  const observations = useMemo(
    () => milestoneObservations(engine, technical.attemptNumber, context, independent),
    [engine, technical.attemptNumber, context, independent],
  );
  const baseline = useRef<{ attempt: number; ids: Set<string> } | null>(null);
  const attempted = useRef(new Set<string>());
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [storageIssue, setStorageIssue] = useState(false);
  const [modalBusy, setModalBusy] = useState(false);
  // Adjust presentation when its source disappears; do not resurrect an old dialog on return.
  if (openKey && (!context || independent || !observations.some((o) => o.key === openKey)))
    setOpenKey(null);
  useEffect(() => {
    const observe = () => setModalBusy(!!document.querySelector('dialog[open]'));
    const observer = new MutationObserver(observe);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['open'] });
    observe();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!technical.ready) return;
    // Historical work is available for recall, never a surprise popup on load/resume.
    if (!baseline.current || baseline.current.attempt !== technical.attemptNumber)
      baseline.current = {
        attempt: technical.attemptNumber,
        ids: new Set(engine.ledger.map((e) => e.receipt.commandId)),
      };
    if (
      !context ||
      independent ||
      storageIssue ||
      openKey ||
      modalBusy ||
      document.querySelector('dialog[open]')
    )
      return;
    const candidate = observations.find(
      (o) =>
        !baseline.current!.ids.has(o.receiptId) &&
        !attempted.current.has(o.key) &&
        milestoneAutoContext(o, context, location.area, location.id),
    );
    if (!candidate) return;
    attempted.current.add(candidate.key);
    const result = claim(candidate.key);
    if (result === 'claimed') setOpenKey(candidate.key);
    else if (result === 'unavailable') setStorageIssue(true);
  }, [
    technical.ready,
    technical.attemptNumber,
    engine,
    context,
    independent,
    storageIssue,
    openKey,
    modalBusy,
    observations,
    location.area,
    location.id,
  ]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== null && event.key !== milestonePreferenceKey) return;
      // Repair/clear can restore future guidance, never retry a past interruption.
      baseline.current = {
        attempt: technical.attemptNumber,
        ids: new Set(engine.ledger.map((e) => e.receipt.commandId)),
      };
      setStorageIssue(!parseMilestonePreferences(event.newValue));
    };
    const reset = () => {
      baseline.current = null;
      attempted.current.clear();
      setStorageIssue(false);
      setOpenKey(null);
    };
    window.addEventListener('storage', sync);
    window.addEventListener('azurelab:clear', reset);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('azurelab:clear', reset);
    };
  }, [engine, technical.attemptNumber]);
  if (!context || independent || !observations.length) return null;
  const open = observations.find((o) => o.key === openKey);
  return (
    <section className="milestone-library" aria-label={nb.milestones.library}>
      <details>
        <summary>{nb.milestones.library}</summary>
        {observations.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => {
              if (document.querySelector('dialog[open]')) return;
              const result = claim(o.key);
              setStorageIssue(result === 'unavailable');
              setOpenKey(o.key);
            }}
          >
            {nb.milestones.open} ·{' '}
            {o.id === 'policy-denial' ? nb.milestones.policy.title : nb.milestones.vm.title}
          </button>
        ))}
      </details>
      {storageIssue && <p role="status">{nb.milestones.storage}</p>}
      {open && <MilestoneDialogue observation={open} onClose={() => setOpenKey(null)} />}
    </section>
  );
}

function MilestoneDialogue({
  observation: o,
  onClose,
}: {
  observation: MilestoneObservation;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    title = useId();
  const c = nb.milestones,
    content = o.id === 'policy-denial' ? c.policy : c.vm;
  useEffect(() => {
    const previous = document.activeElement,
      node = ref.current;
    if (!document.querySelector('dialog[open]')) node?.showModal();
    return () => {
      node?.close();
      if (previous instanceof HTMLElement && previous.isConnected && !previous.closest('[inert]'))
        previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="mission-briefing milestone-dialog"
      aria-labelledby={title}
      data-milestone={o.id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="mission-heading">
        <small>{c.eyebrow}</small>
        <button type="button" aria-label={c.defer} onClick={onClose}>
          ×
        </button>
      </div>
      <div className="mission-scroll" tabIndex={0} role="region" aria-label={c.reading}>
        <div className="mission-intro">
          <SavvyShark>
            <span>{c.actual}</span>
          </SavvyShark>
          <div>
            <h2 id={title}>{content.title}</h2>
            <p>{content.main}</p>
          </div>
        </div>
        <div className="milestone-body">
          <section>
            <h3>{c.cause}</h3>
            <p>{content.cause}</p>
            <h3>{c.consequence}</h3>
            <p>{content.consequence}</p>
          </section>
          <section>
            <h3>{c.actual}</h3>
            <dl className="milestone-facts">
              <div>
                <dt>{c.receipt}</dt>
                <dd>{o.receiptId}</dd>
              </div>
              <div>
                <dt>{c.scope}</dt>
                <dd>{o.scopeId}</dd>
              </div>
              <div>
                <dt>{c.region}</dt>
                <dd>{regionLabels[o.requestedLocation as Region] ?? o.requestedLocation}</dd>
              </div>
              {o.allowedLocations.length > 0 && (
                <div>
                  <dt>{c.allowed}</dt>
                  <dd>
                    {o.allowedLocations.map((r) => regionLabels[r as Region] ?? r).join(', ')}
                  </dd>
                </div>
              )}
              <div>
                <dt>{c.inventory}</dt>
                <dd>
                  {o.beforeCount} → {o.afterCount}
                </dd>
              </div>
              {o.resources.map((r) => (
                <div key={r.id}>
                  <dt>{c.roles[r.role]}</dt>
                  <dd>{r.name}</dd>
                </div>
              ))}
            </dl>
            <h3>{c.next}</h3>
            <p>{content.next}</p>
          </section>
        </div>
      </div>
      <footer>
        <p>{c.boundary}</p>
        <div>
          <button type="button" onClick={onClose}>
            {c.defer}
          </button>
          <button type="button" className="mission-start" onClick={onClose}>
            {c.close}
          </button>
        </div>
      </footer>
    </dialog>
  );
}
