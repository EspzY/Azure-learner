'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { missionsNb as c, nb } from '@/content/nb';
import {
  missionAnswerIds,
  missionDefinitions,
  missionIds,
  missionOrigin,
  missionPortal,
  type MissionId,
  type MissionSession,
} from '@/domain/sandbox/missions';
import { missionSources, missionReviewDate } from '@/domain/sandbox/mission-sources';
import { inventory } from '@/domain/portal/model';
import { appSettings } from '@/domain/sandbox/model';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useMissions } from './mission-provider';
import { useMissionResult, useMissionSafety, useMissionSafetyContexts } from './mission-context';
import { MissionBriefing } from './mission-briefing';
import { MissionMilestones } from './mission-observations';
import { DiagnosisExplorer } from './mission-diagnosis';
import './missions.css';
export function MissionOverview() {
  const m = useMissions();
  return (
    <section className="mission-discovery" aria-label={c.title}>
      <h2>{c.title}</h2>
      <p>{c.intro}</p>
      {m.ready && !m.issue && m.activeSession && (
        <Link className="mission-primary" href={missionOrigin(m.activeSession.mission)}>
          {c.resume} · {c.missions[m.activeSession.mission].title}
        </Link>
      )}
      <ol>
        {missionIds.map((id) => (
          <li key={id}>
            <Link href={missionOrigin(id)}>{c.missions[id].title}</Link>
            <small>
              {missionDefinitions[id].module === 'benefits'
                ? nb.official.benefits
                : nb.official.services}
            </small>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function MissionRecovery() {
  const m = useMissions(),
    [confirm, setConfirm] = useState(false);
  if (!m.issue) return null;
  return (
    <div className="course-storage" role="status">
      <p>
        {c.storage} ({m.issue})
      </p>
      {m.issue === 'unsaved' && <p>{c.memory}</p>}
      <button type="button" onClick={m.store.load}>
        {c.reload}
      </button>
      {['corrupt', 'unsupported'].includes(m.issue) && (
        <>
          <button type="button" onClick={() => setConfirm(!confirm)}>
            {c.recover}
          </button>
          {confirm && (
            <>
              <p>{c.recovery}</p>
              <button
                type="button"
                onClick={() => {
                  m.store.recoverInvalid();
                  setConfirm(false);
                }}
              >
                {c.confirm}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
export function MissionSafetyRecovery({ owner }: { owner?: 'missions' }) {
  const contexts = useMissionSafetyContexts(owner);
  return (
    <div className="mission-safety-recovery">
      {contexts
        .filter(({ state, active }) => !state.ready || state.issue || active)
        .map(({ id, state, href, active }) => (
          <section key={id}>
            <strong>{c.recoveryContexts[id]}</strong>
            <p>{state.issue ?? (active ? c.activeElsewhere : c.loading)}</p>
            <button type="button" onClick={state.store.load}>
              {c.reloadContext} · {c.recoveryContexts[id]}
            </button>{' '}
            <Link href={href}>
              {c.reviewContext} · {c.recoveryContexts[id]}
            </Link>
          </section>
        ))}
    </div>
  );
}
export function MissionEntry({ id }: { id: MissionId }) {
  const m = useMissions(),
    technical = useSandbox(),
    router = useRouter(),
    safe = useMissionSafety('missions'),
    query = useSearchParams();
  const [brief, setBrief] = useState(false),
    ref = useRef<HTMLElement>(null);
  const session = m.sessions.filter((s) => s.mission === id).at(-1),
    data = c.missions[id];
  useEffect(() => {
    if (query.get('activity') !== 'mission' || !m.ready) return;
    const frame = requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      ref.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [query, m.ready]);
  const start = (mode: 'guided' | 'independent') => {
    if (!safe || !m.ready || m.issue || !technical.ready || technical.issue || m.activeSession)
      return;
    if (
      m.store.event({
        type: 'start',
        mission: id,
        mode,
        attempt: technical.attemptNumber,
        boundary: technical.attempt.engine.ledger.at(-1)?.receipt.commandId ?? null,
      })
    )
      router.push(
        missionPortal(
          id,
          id === 'diagnose' || id === 'infrastructure'
            ? 'vms'
            : id === 'governance'
              ? 'subscriptions'
              : 'apps',
        ),
      );
  };
  if (!safe)
    return (
      <section className="mission-entry" ref={ref} tabIndex={-1} aria-label={data.title}>
        <small>{c.title}</small>
        <h3>{data.title}</h3>
        <p role="status">{c.blocked}</p>
        <MissionRecovery />
        {session?.status === 'active' && m.activeSession?.mission === id ? (
          <MissionActivity />
        ) : (
          <MissionSafetyRecovery owner="missions" />
        )}
      </section>
    );
  return (
    <section className="mission-entry" ref={ref} tabIndex={-1} aria-label={data.title}>
      <small>{c.title}</small>
      <h3>{data.title}</h3>
      <p className="mission-bridge">{data.bridge}</p>
      <p>{session?.mode === 'independent' ? data.independent : data.scenario}</p>
      <p>{data.prerequisites}</p>
      <MissionRecovery />
      {!safe && session?.status !== 'active' && <MissionSafetyRecovery owner="missions" />}
      {m.save.events.length >= 600 && <p role="status">{c.capacity}</p>}
      {m.activeSession && m.activeSession.mission !== id ? (
        <>
          <p>{c.activeElsewhere}</p>
          <Link href={missionOrigin(m.activeSession.mission)}>
            {c.resume} · {c.missions[m.activeSession.mission].title}
          </Link>
        </>
      ) : session?.status === 'active' ? (
        <>
          <Link href={missionPortal(id)} className="mission-primary">
            {c.resume}
          </Link>
          <MissionActivity />
        </>
      ) : (
        <>
          <div className="mission-actions">
            <button
              type="button"
              disabled={
                !safe ||
                !m.ready ||
                !!m.issue ||
                !technical.ready ||
                !!technical.issue ||
                m.save.events.length >= 600 ||
                !!m.activeSession
              }
              onClick={() => setBrief(true)}
            >
              {c.start}
            </button>
            <button
              type="button"
              disabled={
                !safe ||
                !m.ready ||
                !!m.issue ||
                !technical.ready ||
                !!technical.issue ||
                m.save.events.length >= 600 ||
                !!m.activeSession
              }
              onClick={() => start('independent')}
            >
              {c.independent}
            </button>
          </div>
          {!safe && <p role="status">{c.blocked}</p>}
          {session && <MissionDebrief session={session} />}
        </>
      )}
      {brief && (
        <MissionBriefing
          kind={id === 'diagnose' || id === 'infrastructure' ? 'vm' : 'paas'}
          mission={id}
          onClose={() => setBrief(false)}
          onStart={() => {
            setBrief(false);
            start('guided');
          }}
        />
      )}
      <details className="mission-sources">
        <summary>{nb.expansion.common.sources}</summary>
        <p>
          {missionReviewDate} · {nb.expansion.common.review}
        </p>
        <ul>
          {missionDefinitions[id].sources.map((source) => (
            <li key={source}>
              <a href={missionSources[source]} target="_blank" rel="noreferrer">
                {source} · Microsoft Learn ↗
              </a>
            </li>
          ))}
        </ul>
      </details>
      {m.sessions.some((s) => s.mission === id && s.status !== 'active') && (
        <details>
          <summary>{c.history}</summary>
          <ol>
            {m.sessions
              .filter((s) => s.mission === id && s.status !== 'active')
              .map((s) => (
                <li key={s.id}>
                  #{s.id} · {s.mode === 'guided' ? c.guided : s.aided ? c.aided : c.unaided} ·{' '}
                  {s.status === 'abandoned' ? c.abandoned : c.result}
                </li>
              ))}
          </ol>
        </details>
      )}
    </section>
  );
}
export function MissionActivity() {
  const { m, s, result, technical } = useMissionResult(),
    safe = useMissionSafety('missions');
  if (!s) return null;
  const data = c.missions[s.mission];
  if (!safe || m.issue || !result.verifiable)
    return (
      <section className="mission-activity">
        <p role="status">{c.blocked}</p>
        {!result.verifiable && <p>{c.unverified}</p>}
        <MissionRecovery />
        <MissionSafetyRecovery owner="missions" />
        <button
          type="button"
          disabled={!!m.issue}
          onClick={() => m.store.event({ type: 'abandon' })}
        >
          {c.abandon}
        </button>
      </section>
    );
  if (s.status !== 'active') return <MissionDebrief session={s} />;
  return (
    <section
      className="mission-activity"
      aria-label={`${s.mode === 'guided' ? c.guided : c.independentMode} · ${data.title}`}
    >
      <h2 data-activity-heading tabIndex={-1}>
        {data.title}
      </h2>
      <small>
        {s.mode === 'guided' ? c.guided : s.aided ? c.aided : c.unaided} · #{s.id}
      </small>
      <MissionAttemptLabel session={s} />
      <p>{s.mode === 'independent' ? data.independent : data.scenario}</p>
      {s.mode === 'guided' && (
        <ol>
          {data.stages.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
      <MissionRecovery />
      {!result.verifiable && <p role="status">{c.unverified}</p>}
      <p className="mission-technical-boundary">
        {c.attempt}: {s.attempt} · {c.commandBoundary}: {s.boundary ?? c.emptyBoundary}
      </p>
      <Link className="mission-primary" href={missionPortal(s.mission)}>
        {c.portal}
      </Link>
      <MissionSubject />
      {s.mission === 'diagnose' && <DiagnosisExplorer />}
      <MissionActual />
      {s.mode === 'guided' && <MissionCriteria checks={result.checks} />}
      <MissionReflection />
      <MissionMilestones
        blocked={!safe || s.mode === 'independent' || !!m.issue || !!technical.issue}
      />
      <div className="mission-actions">
        {s.mode === 'independent' && (
          <button
            type="button"
            disabled={!safe || !!m.issue}
            onClick={() => m.store.prepareTeaching()}
          >
            {c.help}
          </button>
        )}
        <button
          type="button"
          disabled={!m.ready || ['conflict', 'corrupt', 'unsupported'].includes(m.issue ?? '')}
          onClick={() => m.store.event({ type: 'abandon' })}
        >
          {c.abandon}
        </button>
      </div>
      {s.mode === 'independent' && s.aided && safe && !m.issue && <p>{data.feedback}</p>}
      {(!technical.ready || technical.issue) && <p role="status">{c.blocked}</p>}
    </section>
  );
}
export function MissionSubject() {
  const { m, s, technical, result } = useMissionResult();
  if (!s || s.status !== 'active') return null;
  const rows = inventory(technical.attempt.engine.world).filter(
    (r) => r.kind === (s.mission === 'diagnose' || s.mission === 'infrastructure' ? 'vm' : 'app'),
  );
  return (
    <div className="mission-subject">
      <label>
        {c.selected}
        <select
          value={s.target ?? ''}
          disabled={!!m.issue || !!technical.issue}
          onChange={(e) => {
            if (e.target.value) m.store.event({ type: 'select', target: e.target.value });
          }}
        >
          <option value="">{c.choose}</option>
          {rows.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} · {r.subscriptionId} · {r.location}
            </option>
          ))}
        </select>
      </label>
      {!rows.length && <p>{c.noSubject}</p>}
      {s.target && result.verifiable && <p>{result.reused ? c.reused : c.fresh}</p>}
    </div>
  );
}
function MissionCriteria({ checks }: { checks: Record<string, boolean> }) {
  return (
    <ul className="mission-criteria">
      {Object.entries(checks).map(([key, value]) => (
        <li key={key}>
          <strong>{value ? c.yes : c.no}</strong> · {c.criteria[key as keyof typeof c.criteria]}
        </li>
      ))}
    </ul>
  );
}
export function MissionActual() {
  const { s, result, engine } = useMissionResult();
  if (!s) return null;
  const rows = result.world ? inventory(result.world) : [];
  const selected = rows.find((r) => r.id === s.target);
  const saved =
    result.appId && result.world
      ? appSettings(result.world).find((a) => a.appId === result.appId)
      : null;
  return (
    <section className="mission-actual">
      <h3>{c.actual}</h3>
      {selected && (
        <p>
          {selected.name} · {selected.type} · {selected.location} · {selected.subscriptionId}
        </p>
      )}
      {saved && (
        <p>
          APP_ENVIRONMENT={saved.environment} · CATALOG_MODE={saved.catalogMode}
        </p>
      )}
      <ul>
        {result.refs.map((id) => (
          <li key={id}>
            <Link href={`/portal?area=resource&id=${id}&mission=${s.mission}`}>
              {c.inspectResource} · {rows.find((r) => r.id === id)?.name ?? id}
            </Link>{' '}
            · {s.inspected.includes(`resource:${id}`) ? c.yes : c.no}
          </li>
        ))}
      </ul>
      {s.mission === 'governance' && (
        <Link href={missionPortal(s.mission, 'policy')}>{c.inspectPolicy}</Link>
      )}
      <div className="mission-receipts">
        {result.receipts.length ? (
          result.receipts.map((id) => {
            const r = engine.ledger.find((e) => e.receipt.commandId === id)?.receipt;
            return (
              <p key={id}>
                <Link href={`/portal?area=activity&id=${id}&mission=${s.mission}`}>
                  {c.inspectReceipt} · {id}
                </Link>{' '}
                · {r?.operation} · {r?.code} · {r?.beforeRevision} → {r?.afterRevision}
              </p>
            );
          })
        ) : (
          <p>{c.noReceipts}</p>
        )}
      </div>
    </section>
  );
}
function MissionReflection() {
  const { m, s, engine, technical } = useMissionResult(),
    safe = useMissionSafety('missions');
  if (!s || s.status !== 'active') return null;
  const data = assessmentCopy(s);
  const options = data.choices as Record<string, readonly [string, string]>;
  const order =
    s.mission === 'diagnose'
      ? [1, 0, 2]
      : s.mission === 'governance'
        ? [2, 1, 0]
        : s.mission === 'infrastructure'
          ? [1, 2, 0]
          : [0, 2, 1];
  return (
    <section>
      <h3>{c.reflect}</h3>
      {(['decision', 'reason'] as const).map((field) => (
        <fieldset key={field}>
          <legend>{data[field]}</legend>
          {(field === 'decision' ? order : [order[2]!, order[0]!, order[1]!]).map((n) => {
            const value = missionAnswerIds(s)[field][n]!;
            return (
              <label key={value}>
                <input
                  type="radio"
                  name={`mission-${s.id}-${field}`}
                  checked={s.answers[field] === value}
                  disabled={
                    !safe ||
                    !!m.issue ||
                    !!technical.issue ||
                    (m.save.events.length >= 600 && s.answers[field] !== null)
                  }
                  onChange={() => m.store.event({ type: 'answer', field, value })}
                />
                <span>{options[value]![0]}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
      <p>{c.draftSaved}</p>
      <button
        type="button"
        disabled={
          !safe || !!m.issue || !!technical.issue || !s.answers.decision || !s.answers.reason
        }
        onClick={() =>
          m.store.event({
            type: 'submit',
            through: engine.ledger.at(-1)?.receipt.commandId ?? null,
          })
        }
      >
        {c.submit}
      </button>
    </section>
  );
}
function assessmentCopy(s: MissionSession) {
  const data = c.missions[s.mission];
  if (s.mode !== 'independent') return data;
  if (s.mission === 'platform')
    return {
      ...c.missions.platform,
      ...c.missions.platform.independentQuestions,
      feedback: c.missions.platform.independentFeedback,
    };
  if (s.mission === 'diagnose')
    return { ...c.missions.diagnose, decision: c.missions.diagnose.independentDecision };
  return data;
}
function MissionAttemptLabel({ session }: { session: MissionSession }) {
  const m = useMissions();
  return (
    <p>
      {m.sessions.some(
        (prior) =>
          prior.id < session.id &&
          prior.mission === session.mission &&
          prior.mode === session.mode &&
          prior.status === 'submitted',
      )
        ? c.attemptRetry
        : c.initial}
    </p>
  );
}
function MissionDebrief({ session }: { session: MissionSession }) {
  const { m, result, technical } = useMissionResult(session),
    safe = useMissionSafety('missions');
  if (!safe || m.issue || !technical.ready || technical.issue)
    return (
      <>
        <p role="status">{c.unverified}</p>
        <MissionRecovery />
        <MissionSafetyRecovery owner="missions" />
      </>
    );
  const data = assessmentCopy(session),
    options = data.choices as Record<string, readonly [string, string]>;
  return (
    <section className="mission-debrief" aria-label={c.result}>
      <h3>{c.result}</h3>
      <MissionAttemptLabel session={session} />
      <p role="status">
        {session.status === 'abandoned'
          ? c.abandoned
          : !result.verifiable
            ? c.unverified
            : result.complete
              ? c.complete
              : c.incomplete}
      </p>
      <p>
        {session.mode === 'guided' ? c.guided : session.aided ? c.aided : c.unaided} · {c.first}
      </p>
      {result.verifiable && session.status === 'submitted' && (
        <>
          <MissionCriteria checks={result.checks} />
          <p>{data.feedback}</p>
          {(['decision', 'reason'] as const).map((field) => (
            <section key={field}>
              <h4>{data[field]}</h4>
              <p>{options[session.answers[field] ?? '']?.[1]}</p>
              <details>
                <summary>{c.rationale}</summary>
                <dl>
                  {missionAnswerIds(session)[field].map((value) => (
                    <div key={value}>
                      <dt>{options[value]![0]}</dt>
                      <dd>{options[value]![1]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </section>
          ))}
          <p>{c.next}</p>
        </>
      )}
      <p>{c.boundary}</p>
    </section>
  );
}
