'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { computeNb as c } from '@/content/nb';
import {
  computeGuidedFacts,
  computeMilestoneFacts,
  computeHref,
  computeMissionTopic,
  type ComputeMission,
} from '@/domain/curriculum/compute';
import {
  initialContainer,
  initialCapacity,
  initialDesktop,
  initialHosting,
  runCompute,
  hostingServices,
  hostingWorkloads,
  hostingReasons,
  type ComputeInput,
  type Outcome,
} from '@/domain/curriculum/compute-model';
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
import { useCompute } from './compute-provider';
import { ComputeModelResult } from './compute-visuals';
export function ComputeWorkbench({
  mission,
  desktop = false,
}: {
  mission: Exclude<ComputeMission, 'vm'>;
  desktop?: boolean;
}) {
  const t = useCompute(),
    safe = useMissionSafety(),
    copy = desktop ? c.avdInvestigation : c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const kind = desktop
    ? 'desktop'
    : mission === 'container'
      ? 'container'
      : mission === 'capacity'
        ? 'capacity'
        : 'hosting';
  const input =
    g?.configuration[kind] ??
    (desktop
      ? initialDesktop
      : mission === 'container'
        ? initialContainer
        : mission === 'capacity'
          ? initialCapacity
          : initialHosting);
  const last = g?.runs.findLast((r) => r.input.kind === kind);
  const predictionLabels =
    kind === 'container' ? c.models.container.predictions : c.labels.predictionOptions;
  const [overlay, setOverlay] = useState<'brief' | 'container' | 'capacity' | null>(null),
    [failed, setFailed] = useState(false),
    [warning, setWarning] = useState(false),
    [prediction, setPrediction] = useState<Outcome | null>(null),
    [answer, setAnswer] = useState<number | null>(null);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== null && e.key !== milestonePreferenceKey) return;
      setOverlay((x) => (x === 'brief' ? x : null));
      try {
        const p = parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey));
        setWarning(!p || p.seen.length >= 256);
      } catch {
        setWarning(true);
      }
    };
    const clear = () => {
      setWarning(false);
      setOverlay(null);
    };
    window.addEventListener('storage', sync);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, []);
  if (overlay && !safe) setOverlay(null);
  const configure = (input: ComputeInput) => {
    if (!safe) return;
    const ok = t.store.event({ kind: 'configure', input });
    setFailed(!ok);
  };
  const run = () => {
    if (!safe || prediction === null) return;
    const before = computeMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event({ kind: 'run', input, prediction })) {
      setFailed(true);
      return;
    }
    setFailed(false);
    const after = computeMilestoneFacts(t.store.getSnapshot().save);
    const id =
      mission === 'container' && after.container && !before.container
        ? 'container'
        : mission === 'capacity' && after.capacity && !before.capacity
          ? 'capacity'
          : null;
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`compute-${id}`];
      let status;
      try {
        status = claimMilestone(localStorage, `compute-${id}@${d.version}:compute-hosting`);
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
  };
  const facts = g ? computeGuidedFacts(g) : null,
    milestones = computeMilestoneFacts(t.save);
  return (
    <section
      className="compute-workbench"
      aria-label={desktop ? c.models.desktop.title : copy.title}
    >
      <header>
        <small>{c.labels.model}</small>
        <h3>{desktop ? c.models.desktop.title : copy.title}</h3>
        <p>{desktop ? c.sections.desktop.example : copy.situation}</p>
        <p>{copy.goal}</p>
      </header>
      {!safe ? (
        <>
          <p role="status">{c.storage.unsafe}</p>
          <MissionSafetyRecovery />
        </>
      ) : (
        <>
          <button className="compute-primary" onClick={() => setOverlay('brief')}>
            {g ? c.labels.recall : c.labels.begin}
          </button>
          {g ? (
            <button onClick={() => t.store.event({ kind: 'pause' })}>{c.pauseGuided}</button>
          ) : (
            <ComputeGuideRecall mission={mission} />
          )}
          {!g && t.facts.guide && (
            <aside className="compute-switch">
              <p>{c.labels.switch}</p>
              <Link href={computeHref(computeMissionTopic[t.facts.guide.mission])}>
                {c.labels.current} · {c.missions[t.facts.guide.mission].title}
              </Link>
            </aside>
          )}
          {g && (
            <>
              <SavvyShark compact>
                <dl>
                  <div>
                    <dt>{c.labels.next}</dt>
                    <dd>
                      {desktop
                        ? last
                          ? copy.debrief
                          : copy.observe
                        : facts?.complete
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
                    <dt>{c.labels.actual}</dt>
                    <dd>
                      {last
                        ? `${g.runs.filter((r) => r.input.kind === kind).length} · ${c.labels.observed}`
                        : c.labels.pending}
                    </dd>
                  </div>
                </dl>
              </SavvyShark>
              <ol className="compute-mission-steps">
                {copy.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p>{c.labels.configured}</p>
              <fieldset className="compute-parameter-grid" disabled={t.facts.full}>
                <legend>{desktop ? c.models.desktop.title : copy.title}</legend>
                <ComputeControls input={input} change={configure} />
              </fieldset>
              {input.kind === 'capacity' && (
                <p className="compute-unit-note">
                  {c.models.capacity.units}
                  {input.auto ? ` ${c.models.capacity.rule}` : ''}
                </p>
              )}
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
                  {predictionLabels.map((s, i) => (
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
              {last && (
                <section className="compute-observation" aria-label={c.labels.observed}>
                  <h4>{c.labels.observed}</h4>
                  <p>
                    {c.labels.predicted}: {predictionLabels[last.prediction + 1]} ·{' '}
                    {c.labels.result}: {predictionLabels[runCompute(last.input)!.outcome + 1]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">
                      {c.labels.configured} ≠ {c.labels.observed}
                    </p>
                  )}
                  <ComputeModelResult input={last.input} />
                </section>
              )}
              {facts?.witnessed && !desktop && (
                <section className="compute-debrief">
                  <h4>{c.labels.cause}</h4>
                  <ComputeCausalChoice
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
                  {g.answer !== null && <p>{c.causes[mission].feedback[g.answer]}</p>}
                  {facts.complete && <p>{copy.debrief}</p>}
                </section>
              )}
              {mission === 'hosting' && (
                <p>
                  <Link href={computeHref(desktop ? 'hosting' : 'desktop')}>
                    {desktop ? c.models.hosting.title : c.models.desktop.title} →
                  </Link>
                </p>
              )}
            </>
          )}
          {(['container', 'capacity'] as const)
            .filter((id) => id === mission && milestones[id])
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
                  if (t.store.event({ kind: 'mission', mission, attempt: null, boundary: null })) {
                    setOverlay(null);
                    setPrediction(null);
                    setAnswer(null);
                    setFailed(false);
                  } else setFailed(true);
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
              {!g && <p>{c.labels.switch}</p>}
            </>
          )}
          {failed && <p role="alert">{c.storage.failed}</p>}
        </GuidanceWindow>
      )}
    </section>
  );
}
export function ComputeGuideRecall({ mission }: { mission: ComputeMission }) {
  const t = useCompute();
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
function Select({
  label,
  value,
  values,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  values: readonly string[];
  labels: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="compute-control">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {values.map((v, n) => (
          <option key={v} value={v}>
            {labels[n]}
          </option>
        ))}
      </select>
    </label>
  );
}
function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="compute-toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
function NumberControl({
  label,
  value,
  max,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  min?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="compute-control">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => {
          if (Number.isInteger(e.target.valueAsNumber)) onChange(e.target.valueAsNumber);
        }}
      />
    </label>
  );
}
function ComputeControls({
  input: i,
  change,
}: {
  input: ComputeInput;
  change: (i: ComputeInput) => void;
}) {
  if (i.kind === 'container') {
    const t = c.models.container;
    return (
      <>
        <Select
          label={t.platform}
          value={i.platform}
          values={['vm', 'container', 'functions']}
          labels={t.platforms}
          onChange={(v) => change({ ...i, platform: v as typeof i.platform })}
        />
        {i.platform === 'container' && (
          <Select
            label={t.host}
            value={i.host}
            values={['managed', 'customer-vm']}
            labels={t.hosts}
            onChange={(v) => change({ ...i, host: v as typeof i.host })}
          />
        )}
        {i.platform === 'container' && (
          <Select
            label={t.isolation}
            value={i.isolation}
            values={['process', 'hyperv']}
            labels={t.isolations}
            onChange={(v) => change({ ...i, isolation: v as typeof i.isolation })}
          />
        )}
        <Select
          label={t.storage}
          value={i.storage}
          values={['ephemeral', 'external']}
          labels={t.storages}
          onChange={(v) => change({ ...i, storage: v as typeof i.storage })}
        />
        <Select
          label={t.action}
          value={i.action}
          values={['inspect', 'recreate']}
          labels={t.actions}
          onChange={(v) => change({ ...i, action: v as typeof i.action })}
        />
        {i.platform === 'functions' ? (
          <p>{t.functionCode}</p>
        ) : (
          <Toggle label={t.image} value={i.image} onChange={(v) => change({ ...i, image: v })} />
        )}
        <Toggle
          label={t.runtime}
          value={i.runtime}
          onChange={(v) => change({ ...i, runtime: v })}
        />
        <Toggle
          label={t.guestRequired}
          value={i.guestRequired}
          onChange={(v) => change({ ...i, guestRequired: v })}
        />
      </>
    );
  }
  if (i.kind === 'capacity') {
    const t = c.models.capacity;
    return (
      <>
        <Select
          label={t.mode}
          value={i.mode}
          values={['single', 'set', 'vmss', 'zones']}
          labels={t.modes}
          onChange={(v) =>
            change({
              ...i,
              mode: v as typeof i.mode,
              count: v === 'single' ? 1 : i.count,
              auto: v === 'vmss' ? i.auto : false,
              failure: i.failure === 'update' && v !== 'set' ? 'none' : i.failure,
            })
          }
        />
        <NumberControl
          label={t.count}
          value={i.count}
          min={1}
          max={i.mode === 'single' ? 1 : 6}
          onChange={(v) => change({ ...i, count: v })}
        />
        <NumberControl
          label={t.demand}
          value={i.demand}
          max={60}
          onChange={(v) => change({ ...i, demand: v })}
        />
        <Select
          label={t.failure}
          value={i.failure}
          values={[
            'none',
            'instance',
            'fault',
            ...(i.mode === 'set' ? ['update'] : []),
            'zone',
            'region',
            'data',
          ]}
          labels={t.failures.filter((_, n) => n !== 3 || i.mode === 'set')}
          onChange={(v) => change({ ...i, failure: v as typeof i.failure })}
        />
        <NumberControl
          label={t.target}
          value={i.target}
          max={2}
          onChange={(v) => change({ ...i, target: v })}
        />
        <Select
          label={t.routing}
          value={i.routing}
          values={['primary', 'balanced']}
          labels={t.routings}
          onChange={(v) => change({ ...i, routing: v as typeof i.routing })}
        />
        {i.mode === 'vmss' && (
          <Toggle label={t.auto} value={i.auto} onChange={(v) => change({ ...i, auto: v })} />
        )}
        <Toggle label={t.data} value={i.data} onChange={(v) => change({ ...i, data: v })} />
      </>
    );
  }
  if (i.kind === 'desktop') {
    const t = c.models.desktop;
    return (
      <>
        <Select
          label={t.pool}
          value={i.pool}
          values={['personal', 'pooled']}
          labels={t.pools}
          onChange={(v) => change({ ...i, pool: v as typeof i.pool })}
        />
        <Select
          label={t.publication}
          value={i.publication}
          values={['desktop', 'remoteapp']}
          labels={t.publications}
          onChange={(v) => change({ ...i, publication: v as typeof i.publication })}
        />
        <Select
          label={t.session}
          value={i.session}
          values={['single', 'multi']}
          labels={t.sessions}
          onChange={(v) => change({ ...i, session: v as typeof i.session })}
        />
        <NumberControl
          label={t.hosts}
          value={i.hosts}
          max={4}
          onChange={(v) => change({ ...i, hosts: v })}
        />
        <Toggle label={t.linked} value={i.linked} onChange={(v) => change({ ...i, linked: v })} />
        <Toggle
          label={t.assigned}
          value={i.assigned}
          onChange={(v) => change({ ...i, assigned: v })}
        />
      </>
    );
  }
  const t = c.models.hosting;
  return (
    <>
      <Select
        label={t.workload}
        value={i.workload}
        values={hostingWorkloads}
        labels={t.workloads}
        onChange={(v) => change({ ...i, workload: v as typeof i.workload })}
      />
      <Select
        label={t.service}
        value={i.service}
        values={hostingServices}
        labels={t.services}
        onChange={(v) => change({ ...i, service: v as typeof i.service })}
      />
      <Select
        label={t.reason}
        value={i.reason}
        values={hostingReasons}
        labels={t.reasons}
        onChange={(v) => change({ ...i, reason: v as typeof i.reason })}
      />
    </>
  );
}

export function ComputeCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: ComputeMission;
  value: number | null;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const copy = c.causes[mission];
  return (
    <fieldset className="compute-causal-choice" disabled={disabled}>
      <legend>{c.labels.cause}</legend>
      <p>{copy.prompt}</p>
      {copy.choices.map((text, n) => (
        <label key={text}>
          <input
            type="radio"
            name={`cause-${mission}`}
            checked={value === n}
            onChange={() => onChange(n)}
          />
          <span>{text}</span>
        </label>
      ))}
    </fieldset>
  );
}
