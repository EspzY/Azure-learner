'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { labsNb, learningPolishNb, missionsNb } from '@/content/nb';
import type { PortalLocation } from '@/domain/portal/model';
import { labFacts } from '@/domain/course/model';
import { practicalHref, practicalReturn } from '@/domain/sandbox/practical';
import { missionOrigin, missionPortal } from '@/domain/sandbox/missions';
import { useCourse } from '@/features/course/provider';
import { usePracticalResult } from '@/features/course/practical-lab';
import { useMissions } from '@/features/course/mission-provider';
import { useMissionResult } from '@/features/course/mission-context';
import { MissionSafetyRecovery } from '@/features/course/missions';
import { useGuidedLearning } from '@/features/course/guided-learning';
import { latestPausedGuide } from '@/features/course/learning-flow';
import { usePortalGuideVisibility } from '@/features/course/portal-guide-visibility';
import './guide-recovery.css';
type Candidate = {
  key: string;
  title: string;
  href: string;
  course: string;
  resident: boolean;
  matches: boolean;
};

export function PortalGuideRecovery({
  location,
  independent,
  uncertain,
}: {
  location: PortalLocation;
  independent: boolean;
  uncertain: boolean;
}) {
  const course = useCourse(),
    { p, technical, findings } = usePracticalResult(),
    missions = useMissions();
  const mission = useMissionResult(missions.activeSession),
    modules = useGuidedLearning();
  const [minimized, setMinimized] = usePortalGuideVisibility(),
    [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLDivElement>(null);
  const candidates: Candidate[] = [];
  const recovery: { key: string; title: string; href: string }[] = [];
  // Never reveal or bind old retained snapshots during an independent or uncertain context.
  if (!independent && !uncertain) {
    const session = p.current;
    if (
      session?.status === 'active' &&
      session.mode === 'guided' &&
      session.kind !== 'saas' &&
      !findings.verifiable
    )
      recovery.push({
        key: 'practical',
        title: labsNb.lab[session.kind].title,
        href: practicalReturn(session),
      });
    if (
      session?.status === 'active' &&
      session.mode === 'guided' &&
      session.kind !== 'saas' &&
      findings.verifiable
    )
      candidates.push({
        key: 'practical',
        title: labsNb.lab[session.kind].title,
        href: practicalHref(session, technical.attempt.engine),
        course: practicalReturn(session),
        resident: true,
        matches: location.practice === session.kind,
      });
    const lab = course.save.lab,
      legacy = labFacts(lab, technical.attempt.engine, technical.attemptNumber);
    if (
      lab &&
      legacy.verifiable &&
      !legacy.complete &&
      !(session?.status === 'active' && session.kind === 'paas')
    )
      candidates.push({
        key: 'web',
        title: learningPolishNb.briefing.paas.title,
        href: '/portal?lab=web-platform&mode=guided&module=services&topic=practice',
        course: `/learn/${lab.origin === 'architecture-management' ? 'architecture?topic=scope' : lab.origin === 'computing-v2' ? 'computing?topic=resource-bridge' : 'services?topic=practice'}&activity=lab${lab.origin === 'services-v1' ? '&version=1' : ''}`,
        resident: true,
        matches: !!location.lab,
      });
    if (lab && !legacy.verifiable)
      recovery.push({ key: 'web', title: learningPolishNb.briefing.paas.title, href: '/learn' });
    const ms = missions.activeSession;
    if (ms?.mode === 'guided' && !mission.result.verifiable)
      recovery.push({
        key: 'mission',
        title: missionsNb.missions[ms.mission].title,
        href: missionOrigin(ms.mission),
      });
    if (ms?.mode === 'guided' && mission.result.verifiable)
      candidates.push({
        key: 'mission',
        title: missionsNb.missions[ms.mission].title,
        href: missionPortal(ms.mission),
        course: missionOrigin(ms.mission),
        resident: true,
        matches: location.mission === ms.mission,
      });
    for (const module of modules) {
      const g =
        module.guides.find((g) => g.current && g.phase !== 'complete') ?? latestPausedGuide(module);
      if (!module.ready || module.issue || !g) continue;
      if (g.phase === 'unavailable') {
        recovery.push({ key: module.id, title: g.title, href: g.href });
        continue;
      }
      const native =
        (module.id === 'compute' && g.id === 'vm') ||
        (module.id === 'networking' && g.id === 'inspect');
      const match =
        module.id === 'compute'
          ? !!location.compute
          : module.id === 'networking'
            ? !!location.networking
            : module.id === 'governance'
              ? !!location.governance && g.id === 'policy'
              : module.id === 'management-tools'
                ? !!location.tools && g.id === 'intent'
                : module.id === 'security'
                  ? location.security === g.id
                  : module.id === 'migration'
                    ? location.migration === g.id
                    : module.id === 'monitoring'
                      ? location.monitoring === g.id
                      : false;
      candidates.push({
        key: module.id,
        title: g.title,
        course: g.href,
        href:
          native && g.phase !== 'paused'
            ? `/portal?area=home&${module.id === 'compute' ? 'compute=vm' : 'networking=inspect'}`
            : g.href,
        resident: native && g.phase !== 'paused',
        matches: match && g.phase !== 'paused',
      });
    }
  }
  const current = candidates.find((c) => c.matches);
  const showCoach = () => {
    setMinimized(false);
    setOpen(false);
    requestAnimationFrame(() => {
      const guide = document.querySelector<HTMLElement>('.guided-coach,.compute-portal-guide');
      guide?.focus({ preventScroll: true });
    });
  };
  useEffect(() => {
    if (!open) return;
    panel.current?.focus({ preventScroll: true });
    const outside = (e: PointerEvent) => {
      if (
        e.target instanceof Node &&
        !panel.current?.contains(e.target) &&
        !button.current?.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const direct = current?.resident && minimized && !independent && !uncertain;
  return (
    <div className="portal-guidance-control">
      <button
        ref={button}
        type="button"
        className="portal-guidance-toggle"
        aria-expanded={direct ? undefined : open}
        aria-controls={direct ? undefined : 'portal-guidance-menu'}
        onClick={() => (direct ? showCoach() : setOpen((v) => !v))}
      >
        <img src="/mascot/savvy-shark-default.png" width={21} height={24} alt="" />
        <span className="portal-guidance-toggle-label">
          SavvyShark
          <span className="portal-guidance-toggle-detail">
            {' '}
            · {direct ? 'Vis veiledning' : 'Veiledning'}
          </span>
        </span>
      </button>
      <div
        ref={panel}
        hidden={!open}
        id="portal-guidance-menu"
        className="portal-guidance-menu"
        role="region"
        aria-label="SavvyShark-veiledning"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            button.current?.focus();
          }
        }}
      >
        <div className="portal-guidance-menu-heading">
          <strong>SavvyShark</strong>
          <button
            type="button"
            aria-label="Lukk veiledningsmenyen"
            onClick={() => {
              setOpen(false);
              button.current?.focus();
            }}
          >
            ×
          </button>
        </div>
        {uncertain ? (
          <>
            <p>
              Lærings- eller oppdragskonteksten kan ikke bekreftes. Kontroller historikken før du
              fortsetter.
            </p>
            <MissionSafetyRecovery />
          </>
        ) : independent ? (
          <>
            <p>
              Du har en aktiv selvstendig vurdering. Løsningsveiledning er begrenset mens
              vurderingen pågår.
            </p>
            <p>Åpning av denne statusmenyen registrerer ingen hjelp.</p>
            <Link onClick={() => setOpen(false)} href="/learn">
              Til læringsoversikten og vurderingen
            </Link>
          </>
        ) : current ? (
          <>
            <h2>{current.title}</h2>
            <p>
              {current.resident
                ? 'Veiledningen følger det lagrede oppdraget. Vis neste handling eller åpne oppdragsbriefen i guidepanelet.'
                : 'Denne undersøkelsen veiledes i Studio. Portalen gir faktisk lokal ressurskontekst; fortsett undersøkelsen i kurset.'}
            </p>
            {current.resident && (
              <button type="button" onClick={showCoach}>
                Vis veiledningen
              </button>
            )}
            <Link onClick={() => setOpen(false)} href={current.course}>
              Tilbake til oppdraget i kurset
            </Link>
          </>
        ) : candidates.length || recovery.length ? (
          <>
            <p>Velg lagret arbeid du vil fortsette eller kontrollere.</p>
            <ul>
              {recovery.map((c) => (
                <li key={'recover-' + c.key}>
                  <Link onClick={() => setOpen(false)} href={c.href}>
                    {c.title} · Kontroller oppdragskonteksten
                  </Link>
                </li>
              ))}
              {candidates.map((c) => (
                <li key={c.key}>
                  <Link onClick={() => setOpen(false)} href={c.href}>
                    {c.title} · Fortsett veiledning
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>Fri Portal-sandbox</h2>
            <p>
              Her er ingen aktiv guidet oppgave. Bruk menyen til å finne de støttede tjenestene,
              eller velg et kursoppdrag med SavvyShark.
            </p>
            <Link onClick={() => setOpen(false)} href="/learn/services?topic=practice">
              Finn guidet Portal-praksis
            </Link>
            <Link onClick={() => setOpen(false)} href="/learn">
              Til læringsoversikten
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
