'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { networkingNb as c } from '@/content/nb';
import {
  networkingHref,
  networkingGuidedAnswer,
  networkingFacts,
} from '@/domain/curriculum/networking';
import { networkingInspection } from '@/domain/curriculum/networking-inspection';
import { infrastructure } from '@/domain/sandbox/model';
import { inventory, type PortalLocation } from '@/domain/portal/model';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { SavvyShark } from '@/features/course/savvy-shark';
import { useMissionSafety } from '@/features/course/mission-context';
import { MissionSafetyRecovery } from '@/features/course/missions';
import { ServiceIcon } from '@/features/portal/service-icon';
import type { Navigate } from '@/features/portal/shared';
import { conceptMilestones } from '@/domain/guidance/milestones';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { useNetworking } from './networking-provider';
import { NetworkingGuideRecall, NetworkingCausalChoice } from './networking-workbench';
import './networking.css';
export const networkingPortal = (area: string, id?: string) =>
  `/portal?area=${area}&networking=inspect${id ? `&id=${id}` : ''}`;
export function NetworkingInspectionLesson() {
  const t = useNetworking(),
    technical = useSandbox(),
    safe = useMissionSafety(),
    [brief, setBrief] = useState(false),
    [insight, setInsight] = useState(false),
    [failed, setFailed] = useState(false),
    [answer, setAnswer] = useState<number | null>(null),
    g = t.facts.guide?.mission === 'inspect' ? t.facts.guide : undefined,
    f = networkingInspection(g, technical.attempt.engine, technical.attemptNumber),
    copy = c.missions.inspect;
  if (brief && !safe) setBrief(false);
  if (insight && (!safe || !f.inspected)) setInsight(false);
  return (
    <section className="compute-workbench" aria-label={copy.title}>
      <h3>{copy.title}</h3>
      <p>{copy.situation}</p>
      <p>{copy.goal}</p>
      {!safe ? (
        <>
          <p>{c.storage.unsafe}</p>
          <MissionSafetyRecovery />
        </>
      ) : (
        <>
          <div className="compute-actions">
            <button className="compute-primary" onClick={() => setBrief(true)}>
              {g ? c.labels.recall : c.labels.begin}
            </button>
            {g ? (
              <button onClick={() => t.store.event({ kind: 'pause' })}>{c.pauseGuided}</button>
            ) : (
              <NetworkingGuideRecall mission="inspect" />
            )}
          </div>
          {g && (
            <>
              <SavvyShark compact>
                <dl>
                  <div>
                    <dt>{c.labels.next}</dt>
                    <dd>{f.complete ? copy.debrief : copy.observe}</dd>
                  </div>
                  <div>
                    <dt>{c.labels.where}</dt>
                    <dd>{copy.where}</dd>
                  </div>
                  <div>
                    <dt>{c.labels.why}</dt>
                    <dd>{copy.why}</dd>
                  </div>
                  <div>
                    <dt>{c.labels.actual}</dt>
                    <dd>
                      {f.verifiable
                        ? `${g.inspected.filter((id) => f.refs.includes(id)).length}/7`
                        : c.inspection.missing}
                    </dd>
                  </div>
                </dl>
              </SavvyShark>
              <ol>
                {copy.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <nav className="compute-actions">
                <Link href={networkingPortal('groups')}>{c.labels.portal} · Resource groups</Link>
                <Link href={networkingPortal('vms')}>{c.labels.portal} · Virtual machines</Link>
              </nav>
              <NetworkSelection />
              {!f.verifiable && <p role="status">{c.inspection.missing}</p>}
              {f.chain && (
                <>
                  <NetworkReferences />
                  {f.inspected && (
                    <button onClick={() => setInsight(true)}>{c.milestone.inspect.title}</button>
                  )}
                  <p>{f.newBuild ? c.inspection.newBuild : c.inspection.reuse}</p>
                  {f.inspected && (
                    <section className="compute-debrief">
                      <NetworkingCausalChoice
                        mission="inspect"
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
                      <p role="status">
                        {f.complete
                          ? c.labels.done
                          : g.answer === null
                            ? c.labels.pending
                            : c.assessment.fail}
                      </p>
                      {f.complete && <p>{copy.debrief}</p>}
                    </section>
                  )}
                </>
              )}
            </>
          )}
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
                    mission: 'inspect',
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
          <p>{copy.debrief}</p>
          {failed && <p role="alert">{c.storage.failed}</p>}
        </GuidanceWindow>
      )}
      {insight && safe && (
        <GuidanceWindow
          title={c.milestone.inspect.title}
          onClose={() => setInsight(false)}
          notice={c.milestoneNotice}
        >
          <SavvyShark compact>
            <p>{c.milestone.inspect.text}</p>
          </SavvyShark>
        </GuidanceWindow>
      )}
    </section>
  );
}
function NetworkSelection() {
  const t = useNetworking(),
    technical = useSandbox(),
    g = t.facts.guide,
    rs = infrastructure(technical.attempt.engine.world).filter((r) => r.kind === 'vm');
  return (
    <>
      <label className="compute-control">
        <span>{c.inspection.choose}</span>
        <select
          value={g?.target ?? ''}
          disabled={g?.answer === networkingGuidedAnswer.inspect}
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
      {rs.length === 0 && <p>{c.inspection.empty}</p>}
    </>
  );
}
function NetworkReferences() {
  const t = useNetworking(),
    technical = useSandbox(),
    g = t.facts.guide,
    f = networkingInspection(g, technical.attempt.engine, technical.attemptNumber);
  if (!f.chain || !g) return null;
  const rows = inventory(technical.attempt.engine.world);
  return (
    <section>
      <h4>{c.inspection.title}</h4>
      <ol className="network-refs">
        {f.refs.map((id, i) => {
          const r = rows.find((r) => r.id === id);
          return (
            <li key={id}>
              {r ? <ServiceIcon kind={r.kind} /> : <span aria-hidden="true">↳</span>}
              <div>
                <strong>{c.inspection.fields[i]}</strong>
                <Link href={networkingPortal(i === 6 ? 'activity' : 'resource', id)}>
                  {r?.name ?? id}
                </Link>
                <small>
                  {r?.type ?? f.receipt?.receipt.operation} · {id}
                </small>
                {i === 2 && f.chain?.subnet.kind === 'subnet' && (
                  <small>
                    {c.inspection.prefix}: {f.chain.subnet.addressPrefix}
                  </small>
                )}
                {i === 3 && f.chain?.vnet.kind === 'vnet' && (
                  <small>
                    {c.inspection.prefix}: {f.chain.vnet.addressSpace}
                  </small>
                )}
              </div>
              <span>{g.inspected.includes(id) ? c.labels.done : c.labels.pending}</span>
            </li>
          );
        })}
      </ol>
      <p>
        {c.inspection.noIp} {c.inspection.noTraffic}
      </p>
    </section>
  );
}
export function NetworkingPortalMission({
  location,
  navigate,
  independent,
}: {
  location: PortalLocation;
  navigate: Navigate;
  independent: boolean;
}) {
  const t = useNetworking(),
    technical = useSandbox(),
    safe = useMissionSafety(),
    [minimized, setMinimized] = useState(false),
    [failed, setFailed] = useState(false),
    [milestone, setMilestone] = useState(false),
    [milestoneScope, setMilestoneScope] = useState(''),
    [warning, setWarning] = useState(false),
    g = t.facts.guide?.mission === 'inspect' ? t.facts.guide : undefined;
  useEffect(() => {
    const changed = (e: StorageEvent) => {
      if (e.key !== null && e.key !== milestonePreferenceKey) return;
      setMilestone(false);
      try {
        const p = parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey));
        setWarning(!p || p.seen.length >= 256);
      } catch {
        setWarning(true);
      }
    };
    const clear = () => {
      setMilestone(false);
      setWarning(false);
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, []);
  const scope = JSON.stringify([
    g?.id,
    g?.target,
    technical.attemptNumber,
    location.area,
    location.id,
  ]);
  const openMilestone = () => {
    setMilestoneScope(scope);
    setMilestone(true);
  };
  if (
    milestone &&
    (!safe || independent || g?.attempt !== technical.attemptNumber || milestoneScope !== scope)
  )
    setMilestone(false);
  if (!g)
    return (
      <aside className="compute-portal-guide">
        <Link href={networkingHref('dependencies')}>{c.labels.return}</Link>
      </aside>
    );
  const f = networkingInspection(g, technical.attempt.engine, technical.attemptNumber);
  if (!safe || independent || !f.verifiable)
    return (
      <aside className="compute-portal-guide">
        <p>{c.storage.unsafe}</p>
        <p>{c.inspection.missing}</p>
        <Link href={networkingHref('dependencies')}>{c.labels.return}</Link>
        <MissionSafetyRecovery />
      </aside>
    );
  const rows = inventory(technical.attempt.engine.world),
    reference =
      (location.area === 'resource' &&
        rows.some((r) => r.id === location.id) &&
        f.refs.slice(0, 6).includes(location.id)) ||
      (location.area === 'activity' && f.receipt?.receipt.commandId === location.id)
        ? location.id
        : null,
    current = rows.find((r) => r.id === location.id),
    instruction =
      location.area === 'create'
        ? location.kind === 'group'
          ? c.inspection.guide.group
          : location.kind === 'vm'
            ? c.inspection.guide.vm
            : c.inspection.guide.otherCreate
        : location.area === 'activity'
          ? reference
            ? c.inspection.guide.receipt
            : c.inspection.guide.activity
          : location.area === 'resource'
            ? c.inspection.guide.resource
            : c.inspection.guide.list;
  const where =
    location.area === 'create'
      ? location.kind === 'group'
        ? c.inspection.locations.group
        : location.kind === 'vm'
          ? c.inspection.locations.vm
          : c.inspection.locations.otherCreate
      : location.area === 'activity'
        ? c.inspection.locations.activity
        : location.area === 'resource'
          ? c.inspection.locations.resource
          : location.area === 'groups'
            ? c.inspection.locations.groups
            : c.inspection.locations.vms;
  const why =
    location.area === 'create'
      ? location.kind === 'group'
        ? c.inspection.createReasons.group
        : location.kind === 'vm'
          ? c.inspection.createReasons.vm
          : c.inspection.createReasons.other
      : c.missions.inspect.why;
  const inspect = () => {
    if (!reference) return;
    const was = f.inspected;
    const ok = t.store.event({
      kind: 'inspect',
      ref: reference,
      through: technical.attempt.engine.ledger.at(-1)?.receipt.commandId ?? null,
    });
    setFailed(!ok);
    if (
      ok &&
      !was &&
      networkingInspection(
        networkingFacts(t.store.getSnapshot().save).guide,
        technical.attempt.engine,
        technical.attemptNumber,
      ).inspected
    ) {
      let status;
      try {
        status = claimMilestone(
          localStorage,
          `networking-inspect@${conceptMilestones['networking-inspect'].version}:networking-foundations:${technical.attemptNumber}`,
        );
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed' && !document.querySelector('dialog[open]')) openMilestone();
    }
  };
  return (
    <aside
      className={`compute-portal-guide network-portal-guide ${minimized ? 'compute-guide-minimized' : ''}`}
      aria-label={c.missions.inspect.title}
    >
      <div className="compute-guide-toolbar">
        <strong>SavvyShark</strong>
        <button onClick={() => setMinimized(!minimized)} aria-expanded={!minimized}>
          {minimized ? c.inspection.show : c.inspection.hide}
        </button>
        <Link href={networkingHref('dependencies')}>{c.labels.return}</Link>
      </div>
      {!minimized && (
        <>
          <h2>{c.missions.inspect.title}</h2>
          <p>
            <strong>{c.labels.next}</strong> · {f.inspected ? c.inspection.guide.done : instruction}
          </p>
          <p>
            <strong>{c.labels.where}</strong> · {where}
          </p>
          <p>
            <strong>{c.labels.why}</strong> · {why}
          </p>
          <p>
            <strong>{c.labels.expected}</strong> · {c.missions.inspect.observe}
          </p>
          <NetworkSelection />
          {reference ? (
            <>
              <p>
                {c.labels.actual}: {current?.name ?? reference} ·{' '}
                {current?.type ?? f.receipt?.receipt.operation}
              </p>
              {current?.kind === 'subnet' && f.chain?.subnet.kind === 'subnet' && (
                <p>{f.chain.subnet.addressPrefix}</p>
              )}
              {current?.kind === 'vnet' && f.chain?.vnet.kind === 'vnet' && (
                <p>{f.chain.vnet.addressSpace}</p>
              )}
              <button disabled={g.inspected.includes(reference)} onClick={inspect}>
                {g.inspected.includes(reference) ? c.labels.done : c.inspection.observed}
              </button>
            </>
          ) : (
            <p>{f.chain ? c.inspection.openReference : instruction}</p>
          )}
          <nav>
            {f.refs.map((id, i) => (
              <button key={id} onClick={() => navigate(i === 6 ? 'activity' : 'resource', { id })}>
                {c.inspection.fields[i]} · {rows.find((r) => r.id === id)?.name ?? id} ·{' '}
                {g.inspected.includes(id) ? '✓' : '—'}
              </button>
            ))}
          </nav>
          <p>
            {c.inspection.counted}: {g.inspected.filter((id) => f.refs.includes(id)).length}/7
          </p>
          <p>
            {c.inspection.noIp} {c.inspection.noTraffic}
          </p>
          {f.inspected && <button onClick={openMilestone}>{c.milestone.inspect.title}</button>}
          {failed && <p role="alert">{c.storage.failed}</p>}
          {warning && <p role="status">{c.storage.milestones}</p>}
        </>
      )}
      {milestone && safe && (
        <GuidanceWindow
          title={c.milestone.inspect.title}
          onClose={() => setMilestone(false)}
          notice={c.milestoneNotice}
        >
          <SavvyShark compact>
            <p>{c.milestone.inspect.text}</p>
          </SavvyShark>
        </GuidanceWindow>
      )}
    </aside>
  );
}
