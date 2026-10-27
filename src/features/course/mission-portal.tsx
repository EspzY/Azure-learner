'use client';
import { useState } from 'react';
import Link from 'next/link';
import { missionsNb as c } from '@/content/nb';
import { missionOrigin } from '@/domain/sandbox/missions';
import { inventory, type PortalLocation } from '@/domain/portal/model';
import { useMissionResult } from './mission-context';
import { MissionRecovery, MissionActual, MissionSafetyRecovery } from './missions';
import { MissionBriefing } from './mission-briefing';
import { SavvyShark } from './savvy-shark';
import { MissionMilestones } from './mission-observations';
export function MissionPortalLayer({
  location,
  blocked,
}: {
  location: PortalLocation;
  blocked: boolean;
}) {
  const { m, s, technical, result } = useMissionResult(),
    [minimized, setMinimized] = useState(false),
    [brief, setBrief] = useState(false);
  if (!location.mission) return null;
  if (!s || s.mission !== location.mission || s.status !== 'active')
    return (
      <section className="mission-portal-notice">
        <p>{c.unverified}</p>
        <Link href={missionOrigin(location.mission)}>{c.return}</Link>
      </section>
    );
  const independent = s.mode === 'independent',
    data = c.missions[s.mission],
    world = technical.attempt.engine.world;
  if (blocked || !result.verifiable)
    return (
      <aside className="guided-coach mission-coach" aria-label={c.blocked}>
        <p role="status">{c.blocked}</p>
        {!result.verifiable && <p>{c.unverified}</p>}
        <MissionRecovery />
        <MissionSafetyRecovery />
        <Link href={missionOrigin(s.mission)}>{c.return}</Link>
        <button
          type="button"
          disabled={!!m.issue}
          onClick={() => m.store.event({ type: 'abandon' })}
        >
          {c.abandon}
        </button>
      </aside>
    );
  const row = inventory(world).find((r) => r.id === location.id);
  const hasSubject = inventory(world).some(
    (r) => r.kind === (['diagnose', 'infrastructure'].includes(s.mission) ? 'vm' : 'app'),
  );
  const receipt = technical.attempt.engine.ledger.find(
    (e) => e.receipt.commandId === location.id,
  )?.receipt;
  const inspection =
    ['resource', 'settings'].includes(location.area) && row
      ? `resource:${row.id}`
      : location.area === 'activity' && receipt
        ? `receipt:${receipt.commandId}`
        : location.area === 'policy' && world.policies.some((p) => p.id === 'policy-web-location')
          ? 'policy:policy-web-location'
          : null;
  const selectable =
    location.area === 'resource' &&
    row &&
    row.kind === (['diagnose', 'infrastructure'].includes(s.mission) ? 'vm' : 'app');
  const boundary =
    s.boundary === null
      ? -1
      : technical.attempt.engine.ledger.findIndex((e) => e.receipt.commandId === s.boundary);
  const denied = technical.attempt.engine.ledger
    .slice(boundary + 1)
    .some((e) => e.receipt.code === 'policy-location-denied');
  const phase: keyof typeof c.guidance =
    s.mission === 'diagnose'
      ? !s.target
        ? 'choose'
        : !result.checks.attachments
          ? 'inspect'
          : result.checks.contrast
            ? 'reflect'
            : 'model'
      : s.mission === 'infrastructure'
        ? !s.target
          ? 'build'
          : result.checks.requirements && result.checks.newBuild
            ? !result.checks.attachments || !result.checks.receipt
              ? 'inspect'
              : 'reflect'
            : 'build'
        : s.mission === 'governance'
          ? !denied
            ? 'deny'
            : !s.target || !result.checks.corrected
              ? 'correct'
              : !result.checks.scopeInspection || !result.checks.receipts
                ? 'inspect'
                : 'reflect'
          : !s.target
            ? 'choose'
            : !result.checks.draft || !result.checks.maintenance
              ? 'settings'
              : !result.checks.restoration
                ? 'restore'
                : !result.checks.attachments || !result.checks.receipts
                  ? 'inspect'
                  : 'reflect';
  const direction = c.guidance[phase];
  return (
    <>
      <aside
        className={`guided-coach mission-coach ${minimized ? 'coach-minimized' : ''}`}
        aria-label={independent ? c.independentMode : c.guided}
        data-mission={s.mission}
      >
        <header>
          <span>{independent ? c.independentMode : c.guided}</span>
          <button type="button" aria-expanded={!minimized} onClick={() => setMinimized(!minimized)}>
            {minimized ? c.expand : c.minimize}
          </button>
        </header>
        {!minimized && (
          <>
            <h2>{data.title}</h2>
            {!independent && <p className="mission-requirements">{data.scenario}</p>}
            {!hasSubject && !independent && (
              <p>
                {c.noSubject}{' '}
                {s.mission === 'governance'
                  ? data.stages[0]
                  : s.mission === 'platform'
                    ? c.createPlatform
                    : c.createVm}
              </p>
            )}
            <MissionRecovery />
            {blocked && <p role="status">{c.blocked}</p>}
            {independent ? (
              <p>{data.independent}</p>
            ) : (
              <>
                <SavvyShark compact>
                  <strong>{direction[0]}</strong>
                </SavvyShark>
                <dl className="coach-instruction">
                  <div>
                    <dt>{c.where}</dt>
                    <dd>{direction[1]}</dd>
                  </div>
                  <div>
                    <dt>{c.why}</dt>
                    <dd>{data.bridge}</dd>
                  </div>
                  <div>
                    <dt>{c.now}</dt>
                    <dd>{direction[0]}</dd>
                  </div>
                  <div>
                    <dt>{c.expect}</dt>
                    <dd>{direction[2]}</dd>
                  </div>
                </dl>
                <button type="button" onClick={() => setBrief(true)}>
                  {c.recall}
                </button>
              </>
            )}
            <p>
              {c.attempt}: {s.attempt} · {c.commandBoundary}: {s.boundary ?? c.emptyBoundary}
            </p>
            {selectable && (
              <button
                type="button"
                disabled={blocked || !!m.issue || !!technical.issue}
                onClick={() => m.store.event({ type: 'select', target: row.id })}
              >
                {c.select} · {row.name}
              </button>
            )}
            {inspection && (
              <button
                type="button"
                disabled={blocked || !!m.issue || !!technical.issue}
                onClick={() => m.store.event({ type: 'inspect', ref: inspection })}
              >
                {s.inspected.includes(inspection) ? c.inspected : c.inspect} ·{' '}
                {row?.name ?? receipt?.commandId ?? 'policy-web-location'}
              </button>
            )}
            {!independent && <MissionActual />}
            <MissionMilestones blocked={blocked || independent || !!m.issue || !!technical.issue} />
            <Link href={missionOrigin(s.mission)}>{c.return}</Link>
            <button
              type="button"
              disabled={!!m.issue}
              onClick={() => m.store.event({ type: 'abandon' })}
            >
              {c.abandon}
            </button>
          </>
        )}
      </aside>
      {brief && !blocked && !independent && (
        <MissionBriefing
          kind={['diagnose', 'infrastructure'].includes(s.mission) ? 'vm' : 'paas'}
          mission={s.mission}
          recall
          onClose={() => setBrief(false)}
          onStart={() => setBrief(false)}
        />
      )}
    </>
  );
}
