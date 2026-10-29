'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { connectivityNb as c } from '@/content/nb';
import {
  connectivityGuidedFacts,
  connectivityMilestoneFacts,
  connectivityHref,
  connectivityMissionTopic,
  connectivityLimit,
  type ConnectivityMission,
  type ConnectivityGuide,
} from '@/domain/curriculum/connectivity';
import {
  initialConnectivity,
  validHybrid,
  runHybrid,
  runEndpoint,
  runConnectivity,
  type ConnectivityInput,
  type Outcome,
} from '@/domain/curriculum/connectivity-model';
import { conceptMilestones } from '@/domain/guidance/milestones';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { useMissionSafety } from '@/features/course/mission-context';
import { MissionSafetyRecovery } from '@/features/course/missions';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { SavvyShark } from '@/features/course/savvy-shark';
import { useConnectivity } from './connectivity-provider';
import { ConnectivityModelResult } from './connectivity-visuals';
export function ConnectivityWorkbench({ mission }: { mission: ConnectivityMission }) {
  const t = useConnectivity(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input = g?.configuration[mission] ?? initialConnectivity(mission),
    last = g?.runs.at(-1),
    facts = g ? connectivityGuidedFacts(g) : null,
    nextStep = g ? guideStep(g) : 0;
  const [overlay, setOverlay] = useState<'brief' | 'diagnose' | 'dns' | null>(null),
    [failed, setFailed] = useState(false),
    [warning, setWarning] = useState(false),
    [prediction, setPrediction] = useState<Outcome | null>(null),
    [answer, setAnswer] = useState<number | null>(null);
  useEffect(() => {
    const changed = (e: StorageEvent) => {
      if (e.key !== null && e.key !== milestonePreferenceKey) return;
      setOverlay(null);
      try {
        const p = parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey));
        setWarning(!p || p.seen.length >= 256);
      } catch {
        setWarning(true);
      }
    };
    const clear = () => {
      setOverlay(null);
      setWarning(false);
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, []);
  if (overlay && !safe) setOverlay(null);
  const configure = (next: ConnectivityInput) => {
    if (!safe) return;
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const run = () => {
    if (!safe || prediction === null) return;
    const before = connectivityMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event({ kind: 'run', input, prediction })) {
      setFailed(true);
      return;
    }
    setFailed(false);
    const after = connectivityMilestoneFacts(t.store.getSnapshot().save);
    const id = (['diagnose', 'dns'] as const).find((k) => mission === k && after[k] && !before[k]);
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`connectivity-${id}`];
      let status;
      try {
        status = claimMilestone(
          localStorage,
          `connectivity-${id}@${d.version}:connectivity-foundations`,
        );
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
  };
  return (
    <section className="compute-workbench connectivity-workbench" aria-label={copy.title}>
      <header>
        <small>{c.labels.model}</small>
        <h3>{copy.title}</h3>
        <p>{copy.situation}</p>
        <p>{copy.goal}</p>
      </header>
      {!safe ? (
        <>
          <p role="status">{c.storage.unsafe}</p>
          <MissionSafetyRecovery />
        </>
      ) : (
        <>
          <div className="compute-actions">
            <button
              className="compute-primary"
              disabled={!g && t.facts.full}
              onClick={() => setOverlay('brief')}
            >
              {g ? c.labels.recall : c.labels.begin}
            </button>
            {g ? (
              <button disabled={t.facts.full} onClick={() => t.store.event({ kind: 'pause' })}>
                {c.pauseGuided}
              </button>
            ) : (
              <ConnectivityGuideRecall mission={mission} />
            )}
          </div>
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch}{' '}
              <Link href={connectivityHref(connectivityMissionTopic[t.facts.guide.mission])}>
                {c.labels.current}
              </Link>
            </p>
          )}
          {g && (
            <>
              <SavvyShark compact>
                <dl>
                  <div>
                    <dt>{c.labels.next}</dt>
                    <dd>
                      {facts?.complete
                        ? copy.debrief
                        : facts?.witnessed
                          ? c.labels.cause
                          : copy.steps[nextStep]}
                    </dd>
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
                    <dt>{c.labels.expected}</dt>
                    <dd>{copy.observe}</dd>
                  </div>
                  <div>
                    <dt>{c.labels.actual}</dt>
                    <dd>
                      {g.runs.length} · {c.model.snapshot}
                      {last && (
                        <>
                          {' '}
                          · {c.labels.result}:{' '}
                          {c.model.outcome[runConnectivity(last.input)!.outcome]}
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
              </SavvyShark>
              <ol>
                {copy.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <fieldset className="compute-parameter-grid" disabled={t.facts.full}>
                <legend>{c.labels.configured}</legend>
                <ConnectivityControls input={input} change={configure} />
              </fieldset>
              <label className="compute-control">
                <span>{c.labels.predict}</span>
                <select
                  value={prediction ?? ''}
                  disabled={t.facts.full}
                  onChange={(e) =>
                    setPrediction(
                      e.target.value === '' ? null : (Number(e.target.value) as Outcome),
                    )
                  }
                >
                  {c.labels.predictionOptions.map((s, i) => (
                    <option key={s} value={i === 0 ? '' : i - 1}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="compute-primary"
                disabled={prediction === null || t.facts.full || g.runs.length >= 24}
                onClick={run}
              >
                {c.labels.run}
              </button>
              {last ? (
                <section className="compute-observation" aria-label={c.labels.observed}>
                  <h4>{c.labels.observed}</h4>
                  <p>
                    {c.labels.predicted}: {c.model.outcome[last.prediction]} · {c.labels.result}:{' '}
                    {c.model.outcome[runConnectivity(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <ConnectivityModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <ConnectivityCausalChoice
                    mission={mission}
                    value={answer ?? g.answer}
                    disabled={facts.complete}
                    onChange={setAnswer}
                  />
                  <button
                    disabled={facts.complete || (answer ?? g.answer) === null}
                    onClick={() =>
                      setFailed(!t.store.event({ kind: 'explain', answer: answer ?? g.answer }))
                    }
                  >
                    {c.labels.explain}
                  </button>
                  <p role="status">
                    {facts.complete
                      ? c.labels.done
                      : g.answer === null
                        ? c.labels.pending
                        : c.assessment.fail}
                  </p>
                  {facts.complete && <p>{copy.debrief}</p>}
                </section>
              )}
            </>
          )}
          {(['diagnose', 'dns'] as const)
            .filter((id) => id === mission && connectivityMilestoneFacts(t.save)[id])
            .map((id) => (
              <button key={id} onClick={() => setOverlay(id)}>
                {c.milestone[id].title}
              </button>
            ))}
        </>
      )}
      {failed && <p role="alert">{c.storage.failed}</p>}
      {warning && <p role="status">{c.storage.milestones}</p>}
      {overlay && safe && (
        <GuidanceWindow
          title={overlay === 'brief' ? copy.title : c.milestone[overlay].title}
          onClose={() => setOverlay(null)}
          onStart={
            overlay === 'brief' && !g && !t.facts.full
              ? () => {
                  const ok = t.store.event({
                    kind: 'mission',
                    mission,
                  });
                  setFailed(!ok);
                  if (ok) {
                    setOverlay(null);
                    setPrediction(null);
                    setAnswer(null);
                  }
                }
              : undefined
          }
          notice={overlay === 'brief' ? c.labels.notice : c.milestoneNotice}
        >
          <SavvyShark compact>
            <p>{overlay === 'brief' ? copy.situation : c.milestone[overlay].text}</p>
          </SavvyShark>
          {overlay === 'brief' && (
            <>
              <p>{c.prerequisites}</p>
              <h3>{copy.goal}</h3>
              <ol>
                {copy.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p>{copy.observe}</p>
              <p>{c.labels.model}</p>
            </>
          )}
          {failed && <p role="alert">{c.storage.failed}</p>}
        </GuidanceWindow>
      )}
    </section>
  );
}
/** Select the next observation from saved runs, never from visits or elapsed time. */
function guideStep(g: ConnectivityGuide) {
  const hybrid = g.runs.flatMap((run) => {
      const result = runHybrid(run.input);
      return result ? [result] : [];
    }),
    endpoint = g.runs.flatMap((run) => {
      const result = runEndpoint(run.input);
      return result ? [result] : [];
    });
  if (g.mission === 'choose') {
    if (
      !hybrid.some(
        (r) =>
          r.input.transport === 'vpn' &&
          r.knownPath &&
          r.encrypted &&
          !r.privateTransport &&
          r.input.requirePrivate &&
          r.input.requireEncryption,
      )
    )
      return 1;
    return hybrid.some(
      (r) => r.input.transport === 'expressroute' && r.knownPath && !r.encrypted && !r.usedBackup,
    )
      ? 3
      : 2;
  }
  if (g.mission === 'diagnose') {
    if (!hybrid.some((r) => !r.input.circuitUp && !r.input.backupReady && !r.knownPath)) return 3;
    return hybrid.some((r) => r.usedBackup && r.requirementsMet) ? 1 : 3;
  }
  if (g.mission === 'endpoint') {
    if (
      !endpoint.some(
        (r) => r.input.endpoint === 'private' && r.input.publicAccess === 'enabled' && r.authorized,
      )
    )
      return 0;
    return endpoint.some(
      (r) =>
        r.input.endpoint === 'public' &&
        r.input.publicAccess === 'disabled' &&
        r.resolved &&
        !r.networkAllowed,
    )
      ? 3
      : 2;
  }
  if (
    !endpoint.some(
      (r) => r.actualEndpoint === 'public' && r.input.endpoint === 'private' && !r.networkAllowed,
    )
  )
    return 0;
  return endpoint.some((r) => r.actualEndpoint === 'private' && !r.knownPath) ? 3 : 1;
}
export function ConnectivityGuideRecall({ mission }: { mission: ConnectivityMission }) {
  const t = useConnectivity();
  return (
    <div className="compute-actions">
      {t.facts.guided
        .filter((g) => g.mission === mission)
        .map((g) => (
          <button
            key={g.id}
            disabled={
              t.save.events.length >= connectivityLimit - 1 ||
              (t.facts.full && !connectivityGuidedFacts(g).witnessed)
            }
            onClick={() => t.store.event({ kind: 'resume', id: g.id })}
          >
            {c.recallGuided} · #{g.id}
          </button>
        ))}
    </div>
  );
}
export function ConnectivityCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: ConnectivityMission;
  value: number | null;
  disabled: boolean;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend>{c.labels.cause}</legend>
      {c.causal[mission].map((s, i) => (
        <label className="compute-toggle" key={s}>
          <input
            type="radio"
            name={`connectivity-cause-${mission}`}
            checked={value === i}
            onChange={() => onChange(i)}
          />
          <span>{s}</span>
        </label>
      ))}
    </fieldset>
  );
}
function Select({
  label,
  value,
  values,
  labels,
  change,
}: {
  label: string;
  value: string;
  values: readonly string[];
  labels: readonly string[];
  change: (v: string) => void;
}) {
  return (
    <label className="compute-control">
      <span>{label}</span>
      <select value={value} onChange={(e) => change(e.target.value)}>
        {values.map((v, i) => (
          <option key={v} value={v}>
            {labels[i]}
          </option>
        ))}
      </select>
    </label>
  );
}
function Toggle({
  label,
  value,
  change,
}: {
  label: string;
  value: boolean;
  change: (v: boolean) => void;
}) {
  return (
    <label className="compute-toggle">
      <input type="checkbox" checked={value} onChange={(e) => change(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
function ConnectivityControls({
  input: i,
  change,
}: {
  input: ConnectivityInput;
  change: (input: ConnectivityInput) => void;
}) {
  if (validHybrid(i))
    return (
      <>
        <Select
          label={c.model.labels.transport}
          value={i.transport}
          values={['vpn', 'expressroute']}
          labels={c.model.options.transport}
          change={(v) => change({ ...i, transport: v as typeof i.transport })}
        />
        <Select
          label={c.model.labels.demand}
          value={i.demand}
          values={['site', 'user', 'vnet']}
          labels={c.model.options.demand}
          change={(v) => change({ ...i, demand: v as typeof i.demand })}
        />
        <Select
          label={c.model.labels.vpnMode}
          value={i.vpnMode}
          values={['s2s', 'p2s', 'vnet']}
          labels={c.model.options.vpnMode}
          change={(v) => change({ ...i, vpnMode: v as typeof i.vpnMode })}
        />
        <Toggle
          label={c.model.labels.gatewayReady}
          value={i.gatewayReady}
          change={(v) => change({ ...i, gatewayReady: v })}
        />
        <Toggle
          label={c.model.labels.tunnelReady}
          value={i.tunnelReady}
          change={(v) => change({ ...i, tunnelReady: v })}
        />
        {i.transport === 'expressroute' && (
          <>
            <Toggle
              label={c.model.labels.providerReady}
              value={i.providerReady}
              change={(v) => change({ ...i, providerReady: v })}
            />
            <Toggle
              label={c.model.labels.circuitUp}
              value={i.circuitUp}
              change={(v) => change({ ...i, circuitUp: v })}
            />
            <Toggle
              label={c.model.labels.backupReady}
              value={i.backupReady}
              change={(v) => change({ ...i, backupReady: v })}
            />
            <Toggle
              label={c.model.labels.direct}
              value={i.direct}
              change={(v) => change({ ...i, direct: v })}
            />
            <Select
              label={c.model.labels.encryption}
              value={i.encryption}
              values={['none', 'ipsec', 'macsec']}
              labels={c.model.options.encryption}
              change={(v) => change({ ...i, encryption: v as typeof i.encryption })}
            />
            <p>{c.model.linkOnly}</p>
          </>
        )}
        <Toggle
          label={c.model.labels.requirePrivate}
          value={i.requirePrivate}
          change={(v) => change({ ...i, requirePrivate: v })}
        />
        <Toggle
          label={c.model.labels.requireEncryption}
          value={i.requireEncryption}
          change={(v) => change({ ...i, requireEncryption: v })}
        />
        <Toggle
          label={c.model.labels.routeReady}
          value={i.routeReady}
          change={(v) => change({ ...i, routeReady: v })}
        />
        <Select
          label={c.model.labels.access}
          value={i.access}
          values={['allow', 'deny', 'unknown']}
          labels={c.model.options.access}
          change={(v) => change({ ...i, access: v as typeof i.access })}
        />
      </>
    );
  return (
    <>
      <Select
        label={c.model.labels.endpoint}
        value={i.endpoint}
        values={['public', 'private']}
        labels={c.model.options.endpoint}
        change={(v) => change({ ...i, endpoint: v as typeof i.endpoint })}
      />
      <Select
        label={c.model.labels.dns}
        value={i.dns}
        values={['public', 'private', 'missing', 'wrong']}
        labels={c.model.options.dns}
        change={(v) => change({ ...i, dns: v as typeof i.dns })}
      />
      <Select
        label={c.model.labels.resolver}
        value={i.resolver}
        values={['azure', 'custom']}
        labels={c.model.options.resolver}
        change={(v) => change({ ...i, resolver: v as typeof i.resolver })}
      />
      <Toggle
        label={c.model.labels.linked}
        value={i.linked}
        change={(v) => change({ ...i, linked: v })}
      />
      <Toggle
        label={c.model.labels.forwarding}
        value={i.forwarding}
        change={(v) => change({ ...i, forwarding: v })}
      />
      <Select
        label={c.model.labels.privateState}
        value={i.privateState}
        values={['absent', 'pending', 'approved']}
        labels={c.model.options.privateState}
        change={(v) => change({ ...i, privateState: v as typeof i.privateState })}
      />
      <Toggle
        label={c.model.labels.path}
        value={i.path}
        change={(v) => change({ ...i, path: v })}
      />
      <Select
        label={c.model.labels.publicAccess}
        value={i.publicAccess}
        values={['enabled', 'disabled', 'selected']}
        labels={c.model.options.publicAccess}
        change={(v) => change({ ...i, publicAccess: v as typeof i.publicAccess })}
      />
      <Select
        label={c.model.labels.networkRule}
        value={i.networkRule}
        values={['allow', 'deny', 'unknown']}
        labels={c.model.options.networkRule}
        change={(v) => change({ ...i, networkRule: v as typeof i.networkRule })}
      />
      <Select
        label={c.model.labels.appAuth}
        value={i.appAuth}
        values={['allow', 'deny', 'unknown']}
        labels={c.model.options.appAuth}
        change={(v) => change({ ...i, appAuth: v as typeof i.appAuth })}
      />
      <Select
        label={c.model.labels.response}
        value={i.response}
        values={['assumed', 'unknown']}
        labels={c.model.options.response}
        change={(v) => change({ ...i, response: v as typeof i.response })}
      />
      <p>{c.model.noRuntime}</p>
    </>
  );
}
