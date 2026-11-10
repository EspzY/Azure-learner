'use client';
import { OtherGuideNotice } from '@/features/course/guided-mission-link';
import { useGuideBriefing } from '@/features/course/guide-briefing-request';
import { useEffect, useState } from 'react';
import { toolsNb as c } from '@/content/nb';
import {
  toolsGuidedFacts,
  toolsWitnesses,
  toolsMilestoneFacts,
  type ToolsMission,
  type ToolsGuide,
} from '@/domain/curriculum/management-tools';
import {
  initialTools,
  runTools,
  type ToolsInput,
  type Outcome,
} from '@/domain/curriculum/management-tools-model';
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
import { useTools } from './management-tools-provider';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { ToolsEvidence } from './management-tools-evidence';
import { ToolsControls } from './management-tools-controls';
import { ToolsModelResult, ToolsComparison } from './management-tools-visuals';
export function ToolsWorkbench({ mission }: { mission: ToolsMission }) {
  const t = useTools(),
    safe = useMissionSafety(),
    technical = useSandbox(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input = g?.configuration[mission] ?? initialTools(mission),
    last = g?.runs.at(-1),
    facts = g ? toolsGuidedFacts(g, t.nativeEvidence(g).complete) : null,
    nextStep = g ? guideStep(g, t.nativeEvidence(g).checks) : 0;
  const [overlay, setOverlay] = useState<'brief' | ToolsMission | null>(null),
    [failed, setFailed] = useState(false),
    [restart, setRestart] = useState(false),
    [warning, setWarning] = useState(false),
    [prediction, setPrediction] = useState<Outcome | null>(null),
    [answer, setAnswer] = useState<number | null>(null);
  useGuideBriefing(mission, safe, () => setOverlay('brief'));
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
  const configure = (next: ToolsInput) => {
    if (!safe) return;
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const persist = (event: unknown) => {
    if (!safe) return false;
    const verify = (guide: ToolsGuide) => t.nativeEvidence(guide).complete;
    const before = toolsMilestoneFacts(t.store.getSnapshot().save, verify);
    if (!t.store.event(event)) {
      setFailed(true);
      return false;
    }
    setFailed(false);
    const after = toolsMilestoneFacts(t.store.getSnapshot().save, verify);
    const id = (['arc', 'intent', 'change'] as const).find(
      (k) => mission === k && after[k] && !before[k],
    );
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`tools-${id}`];
      let status;
      try {
        status = claimMilestone(localStorage, `tools-${id}@${d.version}:management-tools`);
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
    return true;
  };
  const run = () => {
    if (prediction !== null) persist({ kind: 'run', input, prediction });
  };
  const begin = () => {
    technical.store.changed();
    const live = technical.store.getSnapshot();
    if (mission === 'intent' && (!live.ready || live.issue)) {
      setFailed(true);
      return;
    }
    const ok = persist({
      kind: 'mission',
      mission,
      attempt: mission === 'intent' ? live.attemptNumber : null,
      boundary:
        mission === 'intent'
          ? (live.attempt.engine.ledger.at(-1)?.receipt.commandId ?? null)
          : null,
    });
    if (ok) {
      setOverlay(null);
      setPrediction(null);
      setAnswer(null);
      setRestart(false);
    }
  };
  return (
    <section
      id="guided-work"
      tabIndex={-1}
      className="compute-workbench tools-workbench"
      aria-label={copy.title}
    >
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
              onClick={() => {
                setRestart(false);
                setOverlay('brief');
              }}
            >
              {g ? c.labels.recall : c.labels.begin}
            </button>
            {g ? (
              <button disabled={t.facts.full} onClick={() => t.store.event({ kind: 'pause' })}>
                {c.pauseGuided}
              </button>
            ) : (
              <ToolsGuideRecall mission={mission} />
            )}
          </div>
          <OtherGuideNotice module="management-tools" mission={mission} />
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
                          · {c.labels.result}: {c.model.outcome[runTools(last.input)!.outcome]}
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
                <ToolsControls input={input} change={configure} />
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
                    {c.model.outcome[runTools(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <ToolsModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              <ToolsComparison runs={g.runs} />
              {mission === 'intent' && (
                <ToolsEvidence
                  guide={g}
                  onInspect={(ref, through) => persist({ kind: 'inspect', ref, through })}
                  onRestart={() => {
                    setRestart(true);
                    setOverlay('brief');
                  }}
                />
              )}
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <ToolsCausalChoice
                    mission={mission}
                    value={answer ?? g.answer}
                    disabled={facts.complete}
                    onChange={setAnswer}
                  />
                  <button
                    disabled={facts.complete || (answer ?? g.answer) === null}
                    onClick={() => persist({ kind: 'explain', answer: answer ?? g.answer })}
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
          {(['arc', 'intent', 'change'] as const)
            .filter(
              (id) =>
                id === mission &&
                toolsMilestoneFacts(t.save, (guide) => t.nativeEvidence(guide).complete)[id],
            )
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
          onStart={overlay === 'brief' && (!g || restart) && !t.facts.full ? begin : undefined}
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
function guideStep(
  g: ToolsGuide,
  checks: {
    group: boolean;
    scope: boolean;
    plan: boolean;
    app: boolean;
    receipts: boolean;
    dependency: boolean;
  },
) {
  const missing = toolsWitnesses(g).findIndex((x) => !x);
  if (g.mission === 'intent') {
    if (missing >= 0) return missing;
    if (!checks.group || !checks.plan || !checks.app) return 2;
    if (!checks.scope || !checks.receipts || !checks.dependency) return 3;
    return 4;
  }
  return missing < 0 ? c.missions[g.mission].steps.length - 1 : missing;
}
export function ToolsGuideRecall({ mission }: { mission: ToolsMission }) {
  const t = useTools(),
    [failed, setFailed] = useState(false);
  const guides = t.facts.guided.filter((g) => g.mission === mission && g.id !== t.facts.guide?.id);
  return (
    <>
      {guides.map((g) => (
        <button
          key={g.id}
          disabled={t.facts.full && !toolsGuidedFacts(g).witnessed}
          onClick={() => setFailed(!t.store.event({ kind: 'resume', id: g.id }))}
        >
          {c.recallGuided} · #{g.id}
        </button>
      ))}
      {failed && <p role="alert">{c.storage.failed}</p>}
    </>
  );
}
function ToolsCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: ToolsMission;
  value: number | null;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset id="guided-cause" tabIndex={-1} disabled={disabled}>
      <legend>{c.labels.chooseCause}</legend>
      {c.causal[mission].map((s, i) => (
        <label className="tools-causal-choice" key={s}>
          <input
            type="radio"
            name={`tools-cause-${mission}`}
            checked={value === i}
            onChange={() => onChange(i)}
          />
          <span>{s}</span>
        </label>
      ))}
    </fieldset>
  );
}
