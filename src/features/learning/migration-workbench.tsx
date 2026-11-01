'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { migrationNb as c } from '@/content/nb';
import {
  migrationGuidedFacts,
  migrationWitnesses,
  migrationMilestoneFacts,
  migrationHref,
  migrationMissionTopic,
  type MigrationMission,
  type MigrationGuide,
} from '@/domain/curriculum/migration';
import {
  initialMigration,
  runMigration,
  type MigrationInput,
  type Outcome,
} from '@/domain/curriculum/migration-model';
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
import { useMigration } from './migration-provider';

import { MigrationContext } from './migration-context';
import { MigrationControls } from './migration-controls';
import { MigrationModelResult, MigrationComparison } from './migration-visuals';
export function MigrationWorkbench({ mission }: { mission: MigrationMission }) {
  const t = useMigration(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input = g?.configuration[mission] ?? initialMigration(mission),
    last = g?.runs.at(-1),
    facts = g ? migrationGuidedFacts(g) : null,
    nextStep = g ? guideStep(g) : 0;
  const [overlay, setOverlay] = useState<'brief' | MigrationMission | null>(null),
    [failed, setFailed] = useState(false),
    [restart, setRestart] = useState(false),
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
  const configure = (next: MigrationInput) => {
    if (!safe) return;
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const persist = (event: unknown) => {
    if (!safe) return false;
    const before = migrationMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event(event)) {
      setFailed(true);
      return false;
    }
    setFailed(false);
    const after = migrationMilestoneFacts(t.store.getSnapshot().save);
    const id = (['method', 'sync', 'planning'] as const).find(
      (k) => mission === k && after[k] && !before[k],
    );
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`migration-${id}`];
      let status;
      try {
        status = claimMilestone(localStorage, `migration-${id}@${d.version}:migration`);
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
    const ok = persist({ kind: 'mission', mission });
    if (ok) {
      setOverlay(null);
      setPrediction(null);
      setAnswer(null);
      setRestart(false);
    }
  };
  return (
    <section className="compute-workbench migration-workbench" aria-label={copy.title}>
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
              <MigrationGuideRecall mission={mission} />
            )}
          </div>
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch}{' '}
              <Link href={migrationHref(migrationMissionTopic[t.facts.guide.mission])}>
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
                          · {c.labels.result}: {c.model.outcome[runMigration(last.input)!.outcome]}
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
                <MigrationControls input={input} change={configure} />
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
                    {c.model.outcome[runMigration(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <MigrationModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              <MigrationComparison runs={g.runs} />
              <MigrationContext perspective={mission} />
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <MigrationCausalChoice
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
          {(['method', 'sync', 'planning'] as const)
            .filter((id) => id === mission && migrationMilestoneFacts(t.save)[id])
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
function guideStep(g: MigrationGuide) {
  const missing = migrationWitnesses(g).findIndex((x) => !x);
  return missing < 0 ? c.missions[g.mission].steps.length - 1 : missing;
}
export function MigrationGuideRecall({ mission }: { mission: MigrationMission }) {
  const t = useMigration(),
    [failed, setFailed] = useState(false);
  const guides = t.facts.guided.filter((g) => g.mission === mission && g.id !== t.facts.guide?.id);
  return (
    <>
      {guides.map((g) => (
        <button
          key={g.id}
          disabled={t.facts.full && !migrationGuidedFacts(g).witnessed}
          onClick={() => setFailed(!t.store.event({ kind: 'resume', id: g.id }))}
        >
          {c.recallGuided} · #{g.id}
        </button>
      ))}
      {failed && <p role="alert">{c.storage.failed}</p>}
    </>
  );
}
function MigrationCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: MigrationMission;
  value: number | null;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend>{c.labels.chooseCause}</legend>
      {c.causal[mission].map((s, i) => (
        <label className="migration-causal-choice" key={s}>
          <input
            type="radio"
            name={`migration-cause-${mission}`}
            checked={value === i}
            onChange={() => onChange(i)}
          />
          <span>{s}</span>
        </label>
      ))}
    </fieldset>
  );
}
