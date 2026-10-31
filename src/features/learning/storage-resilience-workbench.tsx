'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storageResilienceNb as c } from '@/content/nb';
import {
  resilienceGuidedFacts,
  resilienceWitnesses,
  resilienceMilestoneFacts,
  resilienceHref,
  resilienceMissionTopic,
  type ResilienceMission,
  type ResilienceGuide,
} from '@/domain/curriculum/storage-resilience';
import {
  initialResilience,
  runResilience,
  type ResilienceInput,
  type Outcome,
  tiers,
  redundancies,
} from '@/domain/curriculum/storage-resilience-model';
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
import { useResilience } from './storage-resilience-provider';
import { ResilienceModelResult, ResilienceComparison } from './storage-resilience-visuals';
export function ResilienceWorkbench({ mission }: { mission: ResilienceMission }) {
  const t = useResilience(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input = g?.configuration[mission] ?? initialResilience(mission),
    last = g?.runs.at(-1),
    facts = g ? resilienceGuidedFacts(g) : null,
    nextStep = g ? guideStep(g) : 0;
  const [overlay, setOverlay] = useState<'brief' | 'tiers' | 'replication' | null>(null),
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
  const configure = (next: ResilienceInput) => {
    if (!safe) return;
    if (next.kind === 'tiers' && (next.assignment === 'inherit' || next.tier !== 'archive'))
      next = { ...next, phase: 'stored', rule: 'none' };
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const run = () => {
    if (!safe || prediction === null) return;
    const before = resilienceMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event({ kind: 'run', input, prediction })) {
      setFailed(true);
      return;
    }
    setFailed(false);
    const after = resilienceMilestoneFacts(t.store.getSnapshot().save);
    const id = (['tiers', 'replication'] as const).find(
      (k) => mission === k && after[k] && !before[k],
    );
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`resilience-${id}`];
      let status;
      try {
        status = claimMilestone(localStorage, `resilience-${id}@${d.version}:storage-resilience`);
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
  };
  return (
    <section className="compute-workbench resilience-workbench" aria-label={copy.title}>
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
              <ResilienceGuideRecall mission={mission} />
            )}
          </div>
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch}{' '}
              <Link href={resilienceHref(resilienceMissionTopic[t.facts.guide.mission])}>
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
                          · {c.labels.result}: {c.model.outcome[runResilience(last.input)!.outcome]}
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
                <ResilienceControls input={input} change={configure} />
                {input.kind === 'tiers' && (
                  <p className="compute-boundary">{c.model.phaseOnlyArchive}</p>
                )}
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
                    {c.model.outcome[runResilience(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <ResilienceModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              <ResilienceComparison runs={g.runs} />
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <ResilienceCausalChoice
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
          {(['tiers', 'replication'] as const)
            .filter((id) => id === mission && resilienceMilestoneFacts(t.save)[id])
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
function guideStep(g: ResilienceGuide) {
  const missing = resilienceWitnesses(g).findIndex((x) => !x);
  return missing < 0 ? 3 : missing;
}
export function ResilienceGuideRecall({ mission }: { mission: ResilienceMission }) {
  const t = useResilience(),
    [failed, setFailed] = useState(false);
  const guides = t.facts.guided.filter((g) => g.mission === mission && g.id !== t.facts.guide?.id);
  return (
    <>
      {guides.map((g) => (
        <button
          key={g.id}
          disabled={t.facts.full && !resilienceGuidedFacts(g).witnessed}
          onClick={() => setFailed(!t.store.event({ kind: 'resume', id: g.id }))}
        >
          {c.recallGuided} · #{g.id}
        </button>
      ))}
      {failed && <p role="alert">{c.storage.failed}</p>}
    </>
  );
}
function ResilienceCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: ResilienceMission;
  value: number | null;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend>{c.labels.chooseCause}</legend>
      {c.causal[mission].map((s, i) => (
        <label className="resilience-causal-choice" key={s}>
          <input
            type="radio"
            name={`resilience-cause-${mission}`}
            checked={value === i}
            onChange={() => onChange(i)}
          />
          <span>{s}</span>
        </label>
      ))}
    </fieldset>
  );
}
function ResilienceControls({
  input,
  change,
}: {
  input: ResilienceInput;
  change: (v: ResilienceInput) => void;
}) {
  const select = (
    key: string,
    label: string,
    options: Record<string, string>,
    disabled = false,
  ) => (
    <label className="compute-control" key={key}>
      <span>{label}</span>
      <select
        disabled={disabled}
        value={String(input[key as keyof typeof input])}
        onChange={(e) => change({ ...input, [key]: e.target.value } as ResilienceInput)}
      >
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
  const names = (values: readonly string[]) =>
    Object.fromEntries(values.map((v) => [v, v.charAt(0).toUpperCase() + v.slice(1)]));
  return input.kind === 'tiers' ? (
    <>
      {select('service', c.labels.service, c.options.service)}
      {select('account', c.labels.account, c.options.account)}
      {(['amount', 'days'] as const).map((key) => (
        <label className="compute-control" key={key}>
          <span>{c.labels[key]}</span>
          <input
            type="number"
            min={1}
            max={key === 'days' ? 730 : 10000}
            value={input[key]}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (Number.isInteger(value) && value >= 1 && value <= (key === 'days' ? 730 : 10000))
                change({ ...input, [key]: value });
            }}
          />
        </label>
      ))}
      {select('usage', c.labels.usage, c.options.usage)}
      {select('retrieval', c.labels.retrieval, c.options.retrieval)}
      {select('change', c.labels.change, c.options.change)}
      {select('assignment', c.labels.assignment, c.options.assignment)}
      {select('defaultTier', c.labels.defaultTier, names(['hot', 'cool', 'cold']))}
      {select('tier', c.labels.tier, names(tiers))}
      {select('redundancy', c.labels.redundancy, names(redundancies))}
      {select(
        'phase',
        c.labels.phase,
        c.options.phase,
        input.assignment === 'inherit' || input.tier !== 'archive',
      )}
      {select(
        'rule',
        c.labels.rule,
        c.options.rule,
        input.assignment === 'inherit' || input.tier !== 'archive',
      )}
    </>
  ) : (
    <>
      {select('target', c.labels.target, c.options.target)}
      {select('redundancy', c.labels.redundancy, names(redundancies))}
      {select('failure', c.labels.failure, c.options.failure)}
      {select('lag', c.labels.lag, c.options.lag)}
      {select('tier', c.labels.replicaTier, { online: c.model.onlineDataset, archive: 'Archive' })}
      <label className="storage-check">
        <input
          type="checkbox"
          checked={input.region}
          onChange={(e) => change({ ...input, region: e.target.checked })}
        />
        <span>{c.labels.region}</span>
      </label>
    </>
  );
}
