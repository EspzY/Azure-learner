'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { networkingNb as c } from '@/content/nb';
import {
  networkingGuidedFacts,
  networkingMilestoneFacts,
  networkingHref,
  networkingMissionTopic,
  type NetworkingMission,
} from '@/domain/curriculum/networking';
import {
  initialAddress,
  initialPeering,
  initialDns,
  peers,
  runNetwork,
  type NetworkInput,
  type Outcome,
} from '@/domain/curriculum/networking-model';
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
import { useNetworking } from './networking-provider';
import { NetworkingModelResult } from './networking-visuals';
export function NetworkingWorkbench({
  mission,
}: {
  mission: Exclude<NetworkingMission, 'inspect'>;
}) {
  const t = useNetworking(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input =
      g?.configuration[mission] ??
      (mission === 'address'
        ? initialAddress
        : mission === 'peering'
          ? initialPeering
          : initialDns),
    last = g?.runs.at(-1),
    facts = g ? networkingGuidedFacts(g) : null;
  const [overlay, setOverlay] = useState<'brief' | 'peering' | 'dns' | null>(null),
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
  const configure = (next: NetworkInput) => {
    if (!safe) return;
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const run = () => {
    if (!safe || prediction === null) return;
    const before = networkingMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event({ kind: 'run', input, prediction })) {
      setFailed(true);
      return;
    }
    setFailed(false);
    const after = networkingMilestoneFacts(t.store.getSnapshot().save);
    const id = (['peering', 'dns'] as const).find((k) => mission === k && after[k] && !before[k]);
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`networking-${id}`];
      let status;
      try {
        status = claimMilestone(
          localStorage,
          `networking-${id}@${d.version}:networking-foundations`,
        );
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
  };
  return (
    <section className="compute-workbench" aria-label={copy.title}>
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
            <button className="compute-primary" onClick={() => setOverlay('brief')}>
              {g ? c.labels.recall : c.labels.begin}
            </button>
            {g ? (
              <button onClick={() => t.store.event({ kind: 'pause' })}>{c.pauseGuided}</button>
            ) : (
              <NetworkingGuideRecall mission={mission} />
            )}
          </div>
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch}{' '}
              <Link href={networkingHref(networkingMissionTopic[t.facts.guide.mission])}>
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
                          : copy.observe}
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
                <NetworkingControls input={input} change={configure} />
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
                    {c.model.outcome[runNetwork(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <NetworkingModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <NetworkingCausalChoice
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
          {(['peering', 'dns'] as const)
            .filter((id) => id === mission && networkingMilestoneFacts(t.save)[id])
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
                    attempt: null,
                    boundary: null,
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
export function NetworkingGuideRecall({ mission }: { mission: NetworkingMission }) {
  const t = useNetworking();
  return (
    <div className="compute-actions">
      {t.facts.guided
        .filter((g) => g.mission === mission)
        .map((g) => (
          <button key={g.id} onClick={() => t.store.event({ kind: 'resume', id: g.id })}>
            {c.recallGuided} · #{g.id}
          </button>
        ))}
    </div>
  );
}
export function NetworkingCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: NetworkingMission;
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
            name={`networking-cause-${mission}`}
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
function NetworkingControls({
  input: i,
  change,
}: {
  input: NetworkInput;
  change: (input: NetworkInput) => void;
}) {
  if (i.kind === 'address')
    return (
      <>
        {(['vnet', 'app', 'data'] as const).map((k) => (
          <label className="compute-control" key={k}>
            <span>{c.model[k]}</span>
            <input
              value={i[k]}
              maxLength={18}
              spellCheck={false}
              onChange={(e) => change({ ...i, [k]: e.target.value })}
            />
          </label>
        ))}
        <label className="compute-control">
          <span>{c.model.required}</span>
          <input
            type="number"
            min={1}
            max={500}
            value={i.required}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isInteger(n) && n >= 1 && n <= 500) change({ ...i, required: n });
            }}
          />
        </label>
      </>
    );
  if (i.kind === 'peering')
    return (
      <>
        <Toggle
          label={c.model.overlapToggle}
          value={i.overlap}
          change={(v) => change({ ...i, overlap: v })}
        />
        <Select
          label={c.model.destination}
          value={i.destination}
          values={['b', 'c']}
          labels={['VNet B', 'VNet C']}
          change={(v) => change({ ...i, destination: v as 'b' | 'c' })}
        />
        <fieldset>
          <legend>{c.model.sides}</legend>
          {peers.map((p) => (
            <Toggle
              key={p}
              label={`${p[0]!.toUpperCase()} → ${p[1]!.toUpperCase()}`}
              value={i.configured.includes(p)}
              change={(v) =>
                change({
                  ...i,
                  configured: v ? [...i.configured, p] : i.configured.filter((x) => x !== p),
                })
              }
            />
          ))}
        </fieldset>
        <Select
          label={c.model.scope}
          value={i.scope}
          values={['whole', 'selected']}
          labels={c.model.scopes}
          change={(v) => change({ ...i, scope: v as typeof i.scope })}
        />
        {i.scope === 'selected' && (
          <>
            <Toggle
              label={c.model.participating}
              value={i.participating}
              change={(v) => change({ ...i, participating: v })}
            />
            <p>{c.model.qualification}</p>
          </>
        )}
        <PathControls input={i} change={change} />
      </>
    );
  return (
    <>
      <Select
        label={c.model.zone}
        value={i.zone}
        values={['private', 'public', 'provided']}
        labels={c.model.zones}
        change={(v) =>
          change({
            ...i,
            zone: v as typeof i.zone,
            ...(v === 'provided' ? { record: 'a' as const } : {}),
          })
        }
      />
      <Select
        label={c.model.record}
        value={i.record}
        values={
          i.zone === 'provided' ? ['a', 'missing'] : ['a', 'cname', 'missing', 'wrong', 'loop']
        }
        labels={i.zone === 'provided' ? [c.model.records[0], c.model.records[2]] : c.model.records}
        change={(v) => change({ ...i, record: v as typeof i.record })}
      />
      {i.zone === 'provided' && <p>{c.model.providedNote}</p>}
      <Select
        label={c.model.resolver}
        value={i.resolver}
        values={['azure', 'custom']}
        labels={c.model.resolvers}
        change={(v) => change({ ...i, resolver: v as typeof i.resolver })}
      />
      <Toggle label={c.model.linked} value={i.linked} change={(v) => change({ ...i, linked: v })} />
      <Toggle
        label={c.model.forwarding}
        value={i.forwarding}
        change={(v) => change({ ...i, forwarding: v })}
      />
      <Toggle
        label={c.model.sameVnet}
        value={i.sameVnet}
        change={(v) => change({ ...i, sameVnet: v })}
      />
      <Toggle label={c.model.peered} value={i.peered} change={(v) => change({ ...i, peered: v })} />
      <PathControls input={i} change={change} />
      <p>{c.model.publicNote}</p>
    </>
  );
}
function PathControls({
  input: i,
  change,
}: {
  input: Exclude<NetworkInput, { kind: 'address' }>;
  change: (i: NetworkInput) => void;
}) {
  return (
    <>
      <Select
        label={c.model.route}
        value={i.route}
        values={['declared', 'unknown']}
        labels={c.model.routes}
        change={(v) => change({ ...i, route: v as typeof i.route })}
      />
      <Select
        label={c.model.access}
        value={i.access}
        values={['allow', 'deny', 'unknown']}
        labels={c.model.accesses}
        change={(v) => change({ ...i, access: v as typeof i.access })}
      />
    </>
  );
}
