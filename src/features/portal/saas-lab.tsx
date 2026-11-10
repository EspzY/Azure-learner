'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { labsNb as t, nb } from '@/content/nb';
import { useSaas } from './saas-provider';
import { usePractical } from '@/features/course/practical-provider';
import { practicalReturn, saasGuideStep } from '@/domain/sandbox/practical';
import { userIds, type UserId, type Account } from '@/domain/sandbox/saas';
import {
  PracticalOutcome,
  PracticalAssistance,
  PracticalProgress,
  usePracticalResult,
} from '@/features/course/practical-lab';
import { SavvyShark } from '@/features/course/savvy-shark';
import './saas.css';
import { ExpansionAssistance } from '@/features/learning/expansion-provider';
import { usePortalLearning } from './learning-provider';
import { MissionRecall } from '@/features/course/mission-briefing';
import { ManagementTeachingBoundary } from '@/features/learning/management-access';
import { useMissionSafety } from '@/features/course/mission-context';
import { useMissions } from '@/features/course/mission-provider';
export function SaasLab() {
  const s = useSaas(),
    p = usePractical(),
    [selected, setSelected] = useState<UserId>('mina'),
    [history, setHistory] = useState(false),
    [confirm, setConfirm] = useState(false);
  const original = usePortalLearning();
  const safe = useMissionSafety(),
    missions = useMissions(),
    guidanceSafe = safe && !missions.active && s.ready && !s.issue;
  useEffect(() => {
    if (original.facts.active) original.store.event({ kind: 'aid' });
  }, [original.facts.active, original.store]);
  const { findings } = usePracticalResult();
  const guideStep = saasGuideStep(findings.criteria, findings.inspected);
  const replayNeedsRestart =
    guideStep === 'capacity' && s.engine.state.accounts.some((u) => u.id === 'erin' && u.licensed);
  const user = s.engine.state.accounts.find((u) => u.id === selected)!;
  const session = p.current?.kind === 'saas' ? p.current : null;
  const disabled = !s.ready || (!!s.issue && s.issue !== 'unsaved');
  const command = (type: string, value: string) => {
    const e = s.store.getSnapshot().engine;
    s.store.dispatch({
      commandId: `saas-${e.ledger.length + 1}`,
      expectedWorldRevision: e.state.revision,
      command: { type, userId: selected, value },
    });
  };
  const last = s.engine.ledger.at(-1)?.receipt;
  return (
    <div className="saas-lab">
      <PracticalAssistance />
      <ExpansionAssistance />
      <header className="saas-header">
        <Link href="/learn">AzureLab</Link>
        <span>{t.saas.title}</span>
        <Link href={session ? practicalReturn(session) : '/learn'}>{t.return}</Link>
      </header>
      <div className="saas-mode" role="region" aria-label={t.title}>
        <strong>
          {session?.mode === 'independent' ? t.independent : session ? t.guided : t.free}
        </strong>
        <span>{t.saas.note}</span>
      </div>
      <main id="saas-main" className="saas-layout">
        <aside className="saas-navigation" aria-label={t.saas.users}>
          <h2>{t.saas.users}</h2>
          {userIds.map((id) => (
            <button
              key={id}
              type="button"
              aria-current={!history && selected === id ? 'page' : undefined}
              onClick={() => {
                setSelected(id);
                setHistory(false);
              }}
            >
              {t.saas.names[id]}{' '}
              <small>
                {s.engine.state.accounts.find((u) => u.id === id)?.licensed
                  ? t.saas.licensed
                  : t.saas.unlicensed}
              </small>
            </button>
          ))}
          <button
            type="button"
            aria-current={history ? 'page' : undefined}
            onClick={() => setHistory(true)}
          >
            {t.history}
          </button>
          <hr />
          <button type="button" onClick={() => setConfirm(!confirm)}>
            {t.saas.reset}
          </button>
          {confirm && (
            <>
              <p>{t.saas.resetConfirm}</p>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (s.store.restart() && session)
                    p.store.restartContext(s.store.getSnapshot().attempt);
                  setConfirm(false);
                }}
              >
                {t.saas.confirmReset}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([s.store.exportSnapshot()], { type: 'application/json' }),
              );
              const a = document.createElement('a');
              a.href = url;
              a.download = 'azurelab-fictional-saas.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            {t.saas.export}
          </button>
        </aside>
        <article className="saas-workspace">
          <h1>{history ? t.history : t.saas.names[selected]}</h1>
          <p>
            {t.saas.capacity}:{' '}
            <strong>{s.engine.state.accounts.filter((u) => u.licensed).length} / 2</strong>
          </p>
          {(s.issue || p.issue) && (
            <p role="status">
              {t.storage} ({s.issue ?? p.issue}){' '}
              <button type="button" onClick={s.store.load}>
                {nb.portal.reload}
              </button>
            </p>
          )}
          {last && (
            <div className={`saas-receipt ${last.outcome}`} role="status">
              <strong>
                {last.outcome} · {last.commandId} · {last.action} · {last.subject}
              </strong>
              <p>{t.saas.reasons[last.reason]}</p>
              <small>
                {last.before} → {last.after}
              </small>
            </div>
          )}
          {history ? (
            <>
              <table>
                <caption>{t.history}</caption>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{nb.portal.type}</th>
                    <th>{t.saas.users}</th>
                    <th>{nb.portal.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {s.engine.ledger.map(({ receipt: r }) => (
                    <tr key={r.commandId}>
                      <td>{r.commandId}</td>
                      <td>
                        {r.action}
                        <small>
                          {t.saas.requested}:{' '}
                          {String(
                            s.engine.ledger.find((e) => e.receipt.commandId === r.commandId)
                              ?.request.command.value,
                          )}
                        </small>
                      </td>
                      <td>{r.subject}</td>
                      <td>
                        {r.outcome}
                        <p>{t.saas.reasons[r.reason]}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {session?.status === 'active' && (
                <button
                  type="button"
                  onClick={() =>
                    p.store.event({
                      type: 'inspect',
                      id: session.mode === 'independent' ? 'leo' : 'mina',
                    })
                  }
                >
                  {t.inspect}
                </button>
              )}
            </>
          ) : (
            <>
              <div className="saas-admin-section">
                <h2>{t.saas.license}</h2>
                <p>{user.licensed ? t.saas.licensed : t.saas.unlicensed}</p>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => command('SetLicense', user.licensed ? 'no' : 'yes')}
                >
                  {user.licensed ? t.saas.release : t.saas.assign}
                </button>
              </div>
              <RoleEditor
                key={`${s.attempt}-${selected}`}
                user={user}
                disabled={disabled}
                onSave={(value) => command('SetRole', value)}
              />
              <div className="saas-admin-section">
                <h2>{t.saas.blocked}</h2>
                <p>{user.blocked ? t.boolean.yes : t.boolean.no}</p>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => command('SetBlocked', user.blocked ? 'no' : 'yes')}
                >
                  {user.blocked ? t.saas.unblock : t.saas.block}
                </button>
              </div>
              <SharingEditor
                key={`${s.attempt}-${selected}-${s.engine.state.sharing}`}
                value={s.engine.state.sharing}
                disabled={disabled}
                onSave={(value) => command('SetSharing', value)}
              />
              <div className="saas-admin-section">
                <h2>{t.saas.data}</h2>
                <ManagementTeachingBoundary
                  identity="saas:retained-data"
                  assessment={
                    session?.mode === 'independent' && session.status === 'active'
                      ? 'practical'
                      : undefined
                  }
                >
                  <p>{t.saas.retained}</p>
                </ManagementTeachingBoundary>
                <p>{user.dataReviewed ? t.boolean.yes : t.boolean.no}</p>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => command('ReviewDepartureData', 'reviewed')}
                >
                  {t.saas.review}
                </button>
              </div>
            </>
          )}
        </article>
        <aside
          className="saas-learning"
          data-step={
            session?.mode === 'guided' && guidanceSafe
              ? `saas-${replayNeedsRestart ? 'replay' : guideStep}`
              : 'independent'
          }
          aria-label={t.title}
        >
          {session && (
            <>
              {(session.mode === 'independent' || guidanceSafe) && (
                <ManagementTeachingBoundary
                  identity={`saas:guide:${session.id}`}
                  assessment={session.mode === 'independent' ? 'practical' : undefined}
                >
                  <SavvyShark compact>
                    <h2>{t.lab.saas.title}</h2>
                    <p>
                      {session.mode === 'independent'
                        ? t.lab.saas.changed
                        : replayNeedsRestart
                          ? t.saas.replay
                          : t.saas.guidance[guideStep]}
                    </p>
                  </SavvyShark>
                  {session.mode === 'guided' && <MissionRecall kind="saas" />}
                </ManagementTeachingBoundary>
              )}
              {session.mode === 'independent' || (findings.configured && findings.inspected) ? (
                <PracticalOutcome />
              ) : (
                <>
                  <PracticalProgress />
                  <Link href={practicalReturn(session)}>{t.return}</Link>
                </>
              )}
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
function RoleEditor({
  user,
  disabled,
  onSave,
}: {
  user: Account;
  disabled: boolean;
  onSave: (s: string) => void;
}) {
  const [role, setRole] = useState(user.role);
  return (
    <form
      className="saas-admin-section"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(role);
      }}
    >
      <h2>{t.saas.role}</h2>
      <label>
        {t.saas.role}
        <select value={role} onChange={(e) => setRole(e.target.value as Account['role'])}>
          {Object.entries(t.saas.roles).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={disabled}>
        {t.saas.saveRole}
      </button>
    </form>
  );
}
function SharingEditor({
  value,
  disabled,
  onSave,
}: {
  value: string;
  disabled: boolean;
  onSave: (s: string) => void;
}) {
  const [sharing, setSharing] = useState(value);
  return (
    <form
      className="saas-admin-section"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(sharing);
      }}
    >
      <h2>{t.saas.sharing}</h2>
      <label>
        {t.saas.sharing}
        <select value={sharing} onChange={(e) => setSharing(e.target.value)}>
          <option value="team">{t.saas.team}</option>
          <option value="link">{t.saas.link}</option>
        </select>
      </label>
      <button type="submit" disabled={disabled}>
        {t.saas.saveSharing}
      </button>
    </form>
  );
}
