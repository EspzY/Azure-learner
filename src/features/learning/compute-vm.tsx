'use client';
import { useState } from 'react';
import Link from 'next/link';
import { computeNb as c } from '@/content/nb';
import { computeHref, computeGuidedAnswer } from '@/domain/curriculum/compute';
import { computeVmFacts } from '@/domain/curriculum/compute-vm';
import { infrastructure } from '@/domain/sandbox/model';
import { inventory, type PortalLocation } from '@/domain/portal/model';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { SavvyShark } from '@/features/course/savvy-shark';
import { useMissionSafety } from '@/features/course/mission-context';
import { MissionSafetyRecovery } from '@/features/course/missions';
import { ServiceIcon } from '@/features/portal/service-icon';
import type { Navigate } from '@/features/portal/shared';
import { useCompute } from './compute-provider';
import { ComputeGuideRecall, ComputeCausalChoice } from './compute-workbench';
const portal = (area: string, id?: string) =>
  `/portal?area=${area}&compute=vm${id ? `&id=${id}` : ''}`;
export function ComputeVmLesson() {
  const t = useCompute(),
    technical = useSandbox(),
    safe = useMissionSafety(),
    [brief, setBrief] = useState(false),
    [failed, setFailed] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  const g = t.facts.guide?.mission === 'vm' ? t.facts.guide : undefined,
    f = computeVmFacts(g, technical.attempt.engine, technical.attemptNumber),
    copy = c.missions.vm;
  if (brief && !safe) setBrief(false);
  return (
    <section className="compute-workbench" aria-label={copy.title}>
      <h3>{copy.title}</h3>
      <p>{copy.situation}</p>
      <p>{copy.goal}</p>
      {safe ? (
        <>
          <button className="compute-primary" onClick={() => setBrief(true)}>
            {g ? c.labels.recall : c.labels.begin}
          </button>
          {g ? (
            <button onClick={() => t.store.event({ kind: 'pause' })}>{c.pauseGuided}</button>
          ) : (
            <ComputeGuideRecall mission="vm" />
          )}
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch} <Link href={computeHref('missions')}>{c.topics.missions}</Link>
            </p>
          )}
          {g && (
            <>
              <SavvyShark compact>
                <p>{copy.why}</p>
                <p>{copy.where}</p>
                <p>{f.complete ? copy.debrief : copy.observe}</p>
              </SavvyShark>
              <ol>
                {copy.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <nav className="compute-actions">
                <Link href={portal('groups')}>{c.labels.portal} · Resource groups</Link>
                <Link href={portal('vms')}>{c.labels.portal} · Virtual machines</Link>
              </nav>
              <ActualVmSelection />
              {!f.verifiable && (
                <p role="status">
                  {c.storage.text} <Link href="/portal">{c.labels.portal}</Link>
                </p>
              )}
              {f.chain && (
                <>
                  <VmReferenceList />
                  <p>{f.newBuild ? c.vmCopy.newBuild : c.vmCopy.notNew}</p>
                  {f.inspected && f.newBuild && (
                    <section className="compute-debrief">
                      <ComputeCausalChoice
                        mission="vm"
                        value={answer ?? g.answer}
                        disabled={f.complete}
                        onChange={setAnswer}
                      />
                      <button
                        disabled={f.complete || (answer ?? g.answer) === null}
                        onClick={() =>
                          setFailed(!t.store.event({ kind: 'explain', answer: answer ?? g.answer }))
                        }
                      >
                        {c.labels.explain}
                      </button>
                      <p role="status">{f.complete ? c.labels.done : c.labels.pending}</p>
                      {g.answer !== null && <p>{c.causes.vm.feedback[g.answer]}</p>}
                      {f.complete && <p>{copy.debrief}</p>}
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <p>{c.storage.unsafe}</p>
          <MissionSafetyRecovery />
        </>
      )}
      {failed && <p role="alert">{c.storage.failed}</p>}
      {brief && safe && (
        <GuidanceWindow
          title={copy.title}
          onClose={() => setBrief(false)}
          onStart={
            !g && !t.facts.full
              ? () => {
                  const ok = t.store.event({
                    kind: 'mission',
                    mission: 'vm',
                    attempt: technical.attemptNumber,
                    boundary: technical.attempt.engine.ledger.at(-1)?.receipt.commandId ?? null,
                  });
                  setFailed(!ok);
                  if (ok) setBrief(false);
                }
              : undefined
          }
          notice={c.labels.notice}
        >
          <SavvyShark compact>
            <p>{copy.situation}</p>
          </SavvyShark>
          <p>{c.prerequisites}</p>
          <h3>{copy.goal}</h3>
          <ol>
            {copy.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>{copy.observe}</p>
          <p>{c.labels.switch}</p>
          {failed && <p role="alert">{c.storage.failed}</p>}
        </GuidanceWindow>
      )}
    </section>
  );
}
function ActualVmSelection() {
  const t = useCompute(),
    technical = useSandbox(),
    g = t.facts.guide;
  const rs = infrastructure(technical.attempt.engine.world).filter((r) => r.kind === 'vm');
  return (
    <label className="compute-control">
      <span>{c.vmCopy.select}</span>
      <select
        value={g?.target ?? ''}
        disabled={g?.answer === computeGuidedAnswer.vm}
        onChange={(e) => {
          if (e.target.value) t.store.event({ kind: 'select', target: e.target.value });
        }}
      >
        <option value="">—</option>
        {rs.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} · {r.id}
          </option>
        ))}
      </select>
    </label>
  );
}
function VmReferenceList() {
  const t = useCompute(),
    technical = useSandbox(),
    g = t.facts.guide,
    f = computeVmFacts(g, technical.attempt.engine, technical.attemptNumber);
  if (!f.chain || !g) return null;
  const chain = f.chain,
    rs = [
      chain.vm,
      chain.os,
      ...(chain.data ? [chain.data] : []),
      chain.nic,
      chain.subnet,
      chain.vnet,
    ];
  return (
    <section className="compute-real-chain">
      <h4>{c.vmCopy.references}</h4>
      <ol>
        {rs.map((r) => (
          <li key={r.id}>
            <ServiceIcon kind={r.kind} />
            <Link href={portal('resource', r.id)}>{r.name}</Link>
            <small>
              {r.kind} · {r.id} · {r.location}
            </small>
            <span>{g.inspected.includes(r.id) ? c.vmCopy.inspected : c.vmCopy.uninspected}</span>
          </li>
        ))}
        {f.receipt && (
          <li>
            <Link href={portal('activity', f.receipt.receipt.commandId)}>
              {f.receipt.receipt.commandId} · {f.receipt.receipt.outcome}
            </Link>
            <span>
              {g.inspected.includes(f.receipt.receipt.commandId)
                ? c.vmCopy.inspected
                : c.vmCopy.uninspected}
            </span>
          </li>
        )}
      </ol>
      <p>{c.missions.vm.debrief}</p>
    </section>
  );
}
export function ComputePortalMission({
  location,
  navigate,
  independent,
}: {
  location: PortalLocation;
  navigate: Navigate;
  independent: boolean;
}) {
  const t = useCompute(),
    technical = useSandbox(),
    safe = useMissionSafety(),
    [minimized, setMinimized] = useState(false),
    [failed, setFailed] = useState(false),
    g = t.facts.guide?.mission === 'vm' ? t.facts.guide : undefined;
  if (!g)
    return (
      <aside className="compute-portal-guide">
        <Link href={computeHref('dependencies')}>{c.labels.return}</Link>
      </aside>
    );
  if (!safe || independent || g.attempt !== technical.attemptNumber)
    return (
      <aside className="compute-portal-guide">
        <p>{c.storage.unsafe}</p>
        <Link href={computeHref('dependencies')}>{c.labels.return}</Link>
        <MissionSafetyRecovery />
      </aside>
    );
  const f = computeVmFacts(g, technical.attempt.engine, technical.attemptNumber),
    chain = f.chain;
  const rs = chain
    ? [chain.vm, chain.os, ...(chain.data ? [chain.data] : []), chain.nic, chain.subnet, chain.vnet]
    : [];
  const resource = location.area === 'resource' ? rs.find((r) => r.id === location.id) : null;
  const receipt =
    location.area === 'activity' && f.receipt?.receipt.commandId === location.id
      ? f.receipt.receipt
      : null;
  const reference = resource?.id ?? receipt?.commandId;
  const current = inventory(technical.attempt.engine.world).find((r) => r.id === location.id);
  return (
    <aside
      className={`compute-portal-guide ${minimized ? 'compute-guide-minimized' : ''}`}
      aria-label={c.missions.vm.title}
    >
      <div className="compute-guide-toolbar">
        <strong>SavvyShark</strong>
        <button onClick={() => setMinimized(!minimized)} aria-expanded={!minimized}>
          {minimized ? c.vmCopy.show : c.vmCopy.hide}
        </button>
        <Link href={computeHref('dependencies')}>{c.labels.return}</Link>
      </div>
      {!minimized && (
        <>
          <h2>{c.missions.vm.title}</h2>
          <p>{f.complete ? c.missions.vm.debrief : c.missions.vm.observe}</p>
          <p>
            <strong>{c.labels.where}</strong> ·{' '}
            {location.area === 'create' ? c.vmCopy.form : c.missions.vm.where}
          </p>
          <p>
            <strong>{c.labels.why}</strong> · {c.missions.vm.why}
          </p>
          <ActualVmSelection />
          {reference ? (
            <>
              <p>
                {c.labels.actual}: {current?.name ?? receipt?.commandId} ·{' '}
                {current?.type ?? receipt?.outcome}
              </p>
              <button
                disabled={g.inspected.includes(reference)}
                onClick={() =>
                  setFailed(
                    !t.store.event({
                      kind: 'inspect',
                      ref: reference,
                      through: technical.attempt.engine.ledger.at(-1)?.receipt.commandId ?? null,
                    }),
                  )
                }
              >
                {g.inspected.includes(reference) ? c.vmCopy.inspected : c.labels.inspect}
              </button>
            </>
          ) : (
            <p>{c.vmCopy.openReference}</p>
          )}
          {chain && (
            <nav>
              {rs
                .filter((r) => !g.inspected.includes(r.id))
                .map((r) => (
                  <button key={r.id} onClick={() => navigate('resource', { id: r.id })}>
                    {r.name} · {r.kind}
                  </button>
                ))}
              {f.receipt && !g.inspected.includes(f.receipt.receipt.commandId) && (
                <button onClick={() => navigate('activity', { id: f.receipt!.receipt.commandId })}>
                  {c.vmCopy.receipt}
                </button>
              )}
            </nav>
          )}
          {!chain && (
            <button onClick={() => navigate('vms')}>{c.labels.portal} · Virtual machines</button>
          )}
          <p>{c.vmCopy.noCommands}</p>
          {failed && <p role="alert">{c.storage.failed}</p>}
        </>
      )}
    </aside>
  );
}
