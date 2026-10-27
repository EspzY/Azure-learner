'use client';
import { useMissions } from './mission-provider';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  labsNb as t,
  nb,
  regionLabels,
  learningPolishNb as polish,
  missionsNb,
} from '@/content/nb';
import {
  evaluatePractical,
  practicalHref,
  practicalReturn,
  type LabKind,
  type Origin,
} from '@/domain/sandbox/practical';
import { startLab, labFacts } from '@/domain/course/model';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useSaas } from '@/features/portal/saas-provider';
import { usePractical } from './practical-provider';
import { useCourse } from './provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import { useExpansion } from '@/features/learning/expansion-provider';
import { useLearning } from '@/features/learning/provider';
import { SavvyShark } from './savvy-shark';
import { resolveGuideTarget, useGuideBounds } from './highlight';
import { benefitBridgeTopics, type PortalLocation } from '@/domain/portal/model';
import { infrastructure } from '@/domain/sandbox/model';
import { labDefinitions } from '@/domain/sandbox/practical';
import { practicalSources, practicalReview } from '@/domain/sandbox/content';
import { PropertyList, type Navigate } from '@/features/portal/shared';
import type { VmFormView } from '@/features/portal/vm-form';
import './practical.css';
import { MissionBriefing, MissionRecall } from './mission-briefing';
import { practicalGuidance } from './practical-guidance';
import { ManagementTeachingBoundary } from '@/features/learning/management-access';
function evaluatedSession(
  session: Parameters<typeof evaluatePractical>[0],
  technical: ReturnType<typeof useSandbox>,
  saas: ReturnType<typeof useSaas>,
) {
  const t =
    session?.status === 'submitted' && session.kind !== 'saas'
      ? technical.store.engineFor(session.attempt)
      : undefined;
  const s =
    session?.status === 'submitted' && session.kind === 'saas'
      ? saas.store.engineFor(session.attempt)
      : undefined;
  return evaluatePractical(
    session,
    t ?? technical.attempt.engine,
    t ? session!.attempt : technical.attemptNumber,
    s ?? saas.engine,
    s ? session!.attempt : saas.attempt,
  );
}
export function usePracticalResult() {
  const p = usePractical(),
    technical = useSandbox(),
    saas = useSaas();
  return {
    p,
    technical,
    saas,
    findings: evaluatedSession(p.current, technical, saas),
  };
}
export function PracticalAssistance() {
  const p = usePractical(),
    path = usePathname(),
    query = useSearchParams(),
    learning = useLearning();
  useEffect(() => {
    if (
      p.activeIndependent &&
      (learning.journalOpen ||
        (path === '/portal' &&
          (query.has('lab') ||
            ['learn', 'hierarchy', 'responsibility'].includes(query.get('area') ?? ''))))
    )
      p.store.event({ type: 'aid' });
  }, [p.activeIndependent, p.store, path, query, learning.journalOpen]);
  return null;
}
export function LabEntry({ kind, origin }: { kind: LabKind; origin: Origin }) {
  const missions = useMissions();
  const { p, technical, saas } = usePracticalResult(),
    course = useCourse(),
    router = useRouter();
  const [briefing, setBriefing] = useState(false);
  const original = usePortalLearning(),
    benefits = useExpansion('benefits'),
    services = useExpansion('services');
  const allReady =
    p.ready &&
    technical.ready &&
    saas.ready &&
    course.ready &&
    original.ready &&
    benefits.ready &&
    services.ready;
  const otherActive =
    original.facts.active || benefits.facts.active || services.facts.active || missions.active;
  const current = p.sessions.filter((s) => s.kind === kind).at(-1) ?? null;
  const currentFindings = evaluatedSession(current, technical, saas);
  const ref = useRef<HTMLElement>(null),
    query = useSearchParams();
  useEffect(() => {
    if (query.get('activity') !== 'practical' || !allReady) return;
    let settled = 0;
    const frame = requestAnimationFrame(() => {
      settled = requestAnimationFrame(() => {
        ref.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
        ref.current?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settled);
    };
  }, [query, allReady]);
  const start = (mode: 'guided' | 'independent') => {
    if (otherActive) return;
    if (current?.status === 'active' && !currentFindings.verifiable) {
      if (p.current?.id !== current.id && !p.store.event({ type: 'resume', id: current.id }))
        return;
      if (!p.store.event({ type: 'abandon' })) return;
    }
    if (origin.module === 'services') services.store.event({ kind: 'choose', version: 'v2' });
    const source = kind === 'saas' ? saas.engine : technical.attempt.engine;
    if (
      !p.store.event({
        type: 'start',
        kind,
        mode,
        origin,
        attempt: kind === 'saas' ? saas.attempt : technical.attemptNumber,
        boundary: source.ledger.at(-1)?.request.commandId ?? null,
      })
    )
      return;
    let href = kind === 'saas' ? '/labs/saas' : `/portal?area=home&practice=${kind}`;
    if (
      kind === 'paas' &&
      mode === 'guided' &&
      !technical.attempt.engine.world.resources.some((r) => r.type === 'Microsoft.Web/sites')
    ) {
      course.store.update({
        ...course.save,
        lab: {
          ...startLab(technical.attempt.engine, technical.attemptNumber),
          boundary: null,
          origin: 'services-v2',
        },
      });
      href += '&lab=web-platform';
    }
    router.push(href);
  };
  return (
    <section className="practical-entry" ref={ref} tabIndex={-1} aria-label={t.lab[kind].title}>
      <small>
        {t.title} · {kind.toUpperCase()}
      </small>
      <p>{missionsNb.legacy}</p>
      <h3>{t.lab[kind].title}</h3>
      <p>{t.lab[kind].purpose}</p>
      <p>{t.lab[kind].task}</p>
      {p.issue && (
        <p role="status">
          {t.storage} ({p.issue})
        </p>
      )}
      <div className="practical-actions">
        {current?.status === 'active' && currentFindings.verifiable ? (
          <Link
            href={practicalHref(current, technical.attempt.engine)}
            onClick={(e) => {
              if (!p.store.event({ type: 'resume', id: current.id })) e.preventDefault();
            }}
          >
            {t.resume}
          </Link>
        ) : (
          <button
            type="button"
            disabled={!allReady || otherActive}
            onClick={() => setBriefing(true)}
          >
            {current?.status === 'active' && !currentFindings.verifiable
              ? t.restartUnavailable
              : t.launch}
          </button>
        )}
        {!p.activeIndependent && (
          <button
            type="button"
            disabled={!allReady || otherActive}
            onClick={() => start('independent')}
          >
            {t.challenge}
          </button>
        )}
      </div>
      {briefing && (
        <MissionBriefing
          kind={kind}
          existingApp={technical.attempt.engine.world.resources.some(
            (r) => r.type === 'Microsoft.Web/sites',
          )}
          onClose={() => setBriefing(false)}
          onStart={() => {
            setBriefing(false);
            start('guided');
          }}
        />
      )}
      {current && (
        <>
          <p role="status">
            {!currentFindings.verifiable
              ? t.unverifiable
              : currentFindings.complete && current.status === 'submitted'
                ? current.mode === 'guided'
                  ? t.complete
                  : t.independentResult
                : t.pending}
          </p>
          <p>{current.mode === 'independent' && (current.aided ? t.aided : t.unaided)}</p>
          {current.status === 'submitted' && currentFindings.complete && (
            <>
              <h4>{t.debrief}</h4>
              <ResultDetails details={currentFindings.details} />
              <p>{t.feedback[kind]}</p>
            </>
          )}
        </>
      )}
      <details className="practical-sources">
        <summary>{nb.expansion.common.sources}</summary>
        <p>
          {practicalReview.reviewed} · {nb.expansion.common.review}
        </p>
        <ul>
          {labDefinitions[kind].sources.map((source) => (
            <li key={source}>
              <a href={practicalSources[source]} target="_blank" rel="noreferrer">
                {source} · Microsoft Learn ↗
              </a>
            </li>
          ))}
        </ul>
      </details>
      {p.sessions.filter((s) => s.kind === kind && s.status !== 'active').length > 0 && (
        <details>
          <summary>{t.attempts}</summary>
          <ol>
            {p.sessions
              .filter((s) => s.kind === kind && s.status !== 'active')
              .map((s) => {
                const r = evaluatedSession(s, technical, saas);
                return (
                  <li key={s.id}>
                    {s.mode === 'guided' ? t.guided : t.independent} ·{' '}
                    {s.aided ? t.aided : t.unaided} ·{' '}
                    {s.status === 'abandoned'
                      ? t.cancelled
                      : r.verifiable
                        ? r.complete
                          ? t.yes
                          : t.no
                        : t.unverifiable}
                  </li>
                );
              })}
          </ol>
        </details>
      )}
    </section>
  );
}
export function BenefitsLabBridge({ topic }: { topic: string }) {
  const [briefing, setBriefing] = useState(false),
    router = useRouter();
  const kind = topic === 'availability' || topic === 'sustainability' ? 'vm' : 'paas';
  const technical = useSandbox(),
    world = technical.attempt.engine.world;
  if (!(benefitBridgeTopics as readonly string[]).includes(topic)) return null;
  const vm = infrastructure(world).find((r) => r.kind === 'vm'),
    app = world.resources.find((r) => r.type === 'Microsoft.Web/sites');
  const denied = technical.attempt.engine.ledger.find(
    (e) => e.receipt.code === 'policy-location-denied',
  );
  const target =
    topic === 'governance'
      ? denied
        ? `area=activity&id=${denied.receipt.commandId}`
        : 'area=policy'
      : topic === 'reliability'
        ? 'area=architecture'
        : topic === 'management'
          ? app
            ? `area=settings&id=${app.id}`
            : 'area=apps'
          : vm
            ? `area=resource&id=${vm.id}`
            : 'area=vms';
  return (
    <section className="benefits-lab-bridge">
      <h3>{t.bridge.title}</h3>
      <p>{t.bridge[topic as 'availability']}</p>
      <p>{t.bridge.note}</p>
      <button type="button" onClick={() => setBriefing(true)}>
        {t.bridge.open}
      </button>
      {briefing && (
        <MissionBriefing
          kind={kind}
          inspection={t.bridge[topic as 'availability']}
          onClose={() => setBriefing(false)}
          onStart={() => {
            setBriefing(false);
            router.push(`/portal?${target}&bridge=${topic}`);
          }}
        />
      )}
      <LabEntry kind={kind} origin={{ module: 'benefits', topic }} />
    </section>
  );
}
export function PracticalOutcome() {
  const { p, technical, saas, findings } = usePracticalResult(),
    s = p.current;
  if (!s) return null;
  const active = s.status === 'active';
  const through = (s.kind === 'saas' ? saas.engine.ledger : technical.attempt.engine.ledger).at(-1)
    ?.request.commandId;
  return (
    <section className="practical-outcome">
      <h3>{t.reason}</h3>
      {(s.mode === 'guided' || s.aided || !active) && (
        <ManagementTeachingBoundary identity={`practical:feedback:${s.id}`}>
          <ul className="practical-criteria">
            {Object.entries(findings.criteria).map(([key, value]) => (
              <li key={key}>
                <span>{value ? t.yes : t.no}</span> {t.criteria[key as keyof typeof t.criteria]}
              </li>
            ))}
          </ul>
          {s.reason && <p>{t.feedback[s.kind]}</p>}
          {active && <p>{s.mode === 'guided' ? t.lab[s.kind].task : t.feedback[s.kind]}</p>}
          {s.status === 'submitted' && findings.complete && (
            <ResultDetails details={findings.details} />
          )}
        </ManagementTeachingBoundary>
      )}
      {active ? (
        <>
          <fieldset>
            <legend>{t.reason}</legend>
            {t.reasons[s.kind].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`reason-${s.id}`}
                  checked={s.reason === value}
                  onChange={() => p.store.event({ type: 'reason', value })}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            disabled={!through || !s.reason}
            onClick={() => through && p.store.event({ type: 'submit', through })}
          >
            {t.submit}
          </button>
          {s.mode === 'independent' && (
            <button type="button" onClick={() => p.store.event({ type: 'aid' })}>
              {t.hint}
            </button>
          )}
          <button type="button" onClick={() => p.store.event({ type: 'abandon' })}>
            {t.abandon}
          </button>
        </>
      ) : (
        <p role="status">
          {s.status === 'abandoned'
            ? t.cancelled
            : findings.complete
              ? s.mode === 'guided'
                ? t.complete
                : t.independentResult
              : t.wrong}{' '}
          {t.first}
        </p>
      )}
      <Link href={practicalReturn(s)}>{t.return}</Link>
    </section>
  );
}
export function PracticalCoach({
  location,
  navigate,
  suppressed = false,
  form,
}: {
  location: PortalLocation;
  navigate: Navigate;
  suppressed?: boolean;
  form?: VmFormView | null;
}) {
  const { p, technical, findings } = usePracticalResult(),
    course = useCourse();
  const [minimized, setMinimized] = useState(false);
  const s = p.current;
  const oldWeb =
    location.lab &&
    !labFacts(course.save.lab, technical.attempt.engine, technical.attemptNumber).complete;
  const active =
    !!s && location.practice === s.kind && s.mode === 'guided' && !suppressed && !oldWeb;
  const app = technical.attempt.engine.world.resources.find(
    (r) => r.type === 'Microsoft.Web/sites',
  );
  const direction = practicalGuidance({
    kind: s?.kind ?? 'vm',
    hasGroups: !!technical.attempt.engine.world.groups.length,
    hasApp: !!app,
    appId: app?.id,
    configured: findings.configured,
    inspected: findings.inspected,
    ids: findings.ids,
    location,
    form,
  });
  const { target, targetKind, phase } = direction;
  const bounds = useGuideBounds(
    target,
    active && !minimized && direction.matching,
    targetKind,
    `${location.area}:${location.id}:${location.kind}`,
  );
  if (!active || !s) return null;
  const instruction =
    phase === 'inspect' && s.kind === 'paas' ? polish.guide.inspectPaas : polish.guide[phase];
  return (
    <>
      {bounds?.visible && (
        <div
          aria-hidden="true"
          className="guide-target-ring"
          data-kind={targetKind}
          style={{
            left: bounds.left - 4,
            top: bounds.top - 4,
            width: bounds.width + 8,
            height: bounds.height + 8,
          }}
        />
      )}
      <aside
        className={`guided-coach practical-coach ${minimized ? 'coach-minimized' : ''}`}
        aria-label={t.guided}
        data-step={`practical-${s.kind}`}
        data-phase={phase}
      >
        <header>
          <span>{t.guided}</span>
          <button type="button" aria-expanded={!minimized} onClick={() => setMinimized(!minimized)}>
            {minimized ? nb.course.expand : nb.course.minimize}
          </button>
        </header>
        {!minimized && (
          <>
            <SavvyShark compact>
              <p className="coach-step">
                <strong>{t.lab[s.kind].title}</strong>
              </p>
            </SavvyShark>
            <p className="coach-step" role="status">
              <strong>{instruction[0]}</strong>
            </p>
            <dl className="coach-instruction">
              <div>
                <dt>{nb.milestones.where}</dt>
                <dd>{nb.milestones.targetLocations[target]}</dd>
              </div>
              <div>
                <dt>{nb.refinement.why}</dt>
                <dd>{instruction[1]}</dd>
              </div>
              <div>
                <dt>{nb.refinement.action}</dt>
                <dd>{instruction[2]}</dd>
              </div>
              <div>
                <dt>{nb.refinement.expect}</dt>
                <dd>{instruction[3]}</dd>
              </div>
            </dl>
            {!bounds && phase !== 'explain' && (
              <p className="coach-missing">
                {targetKind === 'inspection' ? nb.refinement.missingInspection : nb.course.missing}
              </p>
            )}
            <p className="coach-target-type" hidden={phase === 'explain'}>
              {targetKind === 'inspection'
                ? nb.refinement.inspectTarget
                : nb.refinement.actionTarget}
            </p>
            <div className="coach-actions">
              <MissionRecall kind={s.kind} existingApp={!!app} />
              {bounds && (
                <button
                  type="button"
                  onClick={() => {
                    const el = resolveGuideTarget(target, targetKind);
                    el?.scrollIntoView({
                      block: 'center',
                      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches
                        ? 'instant'
                        : 'smooth',
                    });
                    if (targetKind === 'action') el?.focus({ preventScroll: true });
                  }}
                >
                  {nb.course.locate}
                </button>
              )}
              {s.kind === 'vm' && (
                <button type="button" onClick={() => navigate('vms')}>
                  {nb.portal.areas.vms}
                </button>
              )}
              {s.kind === 'paas' && app && (
                <button type="button" onClick={() => navigate('settings', { id: app.id })}>
                  {t.settings.title}
                </button>
              )}
              <button type="button" onClick={() => navigate('architecture')}>
                {t.architecture}
              </button>
            </div>
            {findings.configured && findings.inspected ? (
              <PracticalOutcome />
            ) : (
              <>
                <PracticalProgress />
                {findings.configured &&
                  findings.ids
                    .filter((id) => !s.inspected.includes(id))
                    .map((id) => (
                      <button type="button" key={id} onClick={() => navigate('resource', { id })}>
                        {t.inspect} ·{' '}
                        {infrastructure(technical.attempt.engine.world).find((r) => r.id === id)
                          ?.name ??
                          technical.attempt.engine.world.resources.find((r) => r.id === id)?.name}
                      </button>
                    ))}
                <Link href={practicalReturn(s)}>{t.return}</Link>
              </>
            )}
          </>
        )}
      </aside>
    </>
  );
}

export function PracticalProgress() {
  const { findings } = usePracticalResult();
  return (
    <ManagementTeachingBoundary identity="practical:progress">
      <ul className="practical-criteria">
        {Object.entries(findings.criteria).map(([key, value]) => (
          <li key={key}>
            <span>{value ? t.yes : t.no}</span> {t.criteria[key as keyof typeof t.criteria]}
          </li>
        ))}
      </ul>
    </ManagementTeachingBoundary>
  );
}

function ResultDetails({ details }: { details: Record<string, string> }) {
  const value = (key: string, raw: string) =>
    key === 'image'
      ? t.vm.images[raw as keyof typeof t.vm.images]
      : key === 'profile'
        ? t.vm.profiles[raw as keyof typeof t.vm.profiles]
        : key.endsWith('Location')
          ? regionLabels[raw as keyof typeof regionLabels]
          : key === 'account'
            ? t.saas.names[raw as keyof typeof t.saas.names]
            : key === 'role'
              ? t.saas.roles[raw as keyof typeof t.saas.roles]
              : key === 'licensed'
                ? raw === 'true'
                  ? t.saas.licensed
                  : t.saas.unlicensed
                : key === 'blocked'
                  ? raw === 'true'
                    ? t.boolean.yes
                    : t.boolean.no
                  : key === 'osDiskGiB' || key === 'dataDiskGiB'
                    ? raw === '0'
                      ? t.vm.noData
                      : `${raw} GiB`
                    : raw;
  return (
    <PropertyList
      items={Object.entries(details).map(([key, raw]) => [
        t.debriefLabels[key as keyof typeof t.debriefLabels] ?? key,
        value(key, raw),
      ])}
    />
  );
}
