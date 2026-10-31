'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { identityNb as c } from '@/content/nb';
import {
  identityGuidedFacts,
  identityWitnesses,
  identityMilestoneFacts,
  identityHref,
  identityMissionTopic,
  type IdentityMission,
  type IdentityGuide,
} from '@/domain/curriculum/identity-foundations';
import {
  initialIdentity,
  runIdentity,
  type IdentityInput,
  type Outcome,
} from '@/domain/curriculum/identity-foundations-model';
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
import { useIdentity } from './identity-foundations-provider';
import { IdentityModelResult, IdentityComparison } from './identity-foundations-visuals';
export function IdentityWorkbench({ mission }: { mission: IdentityMission }) {
  const t = useIdentity(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input = g?.configuration[mission] ?? initialIdentity(mission),
    last = g?.runs.at(-1),
    facts = g ? identityGuidedFacts(g) : null,
    nextStep = g ? guideStep(g) : 0;
  const [overlay, setOverlay] = useState<'brief' | 'directory' | 'journey' | 'external' | null>(
      null,
    ),
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
  const configure = (next: IdentityInput) => {
    if (!safe) return;
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const run = () => {
    if (!safe || prediction === null) return;
    const before = identityMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event({ kind: 'run', input, prediction })) {
      setFailed(true);
      return;
    }
    setFailed(false);
    const after = identityMilestoneFacts(t.store.getSnapshot().save);
    const id = (['directory', 'journey', 'external'] as const).find(
      (k) => mission === k && after[k] && !before[k],
    );
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`identity-${id}`];
      let status;
      try {
        status = claimMilestone(localStorage, `identity-${id}@${d.version}:identity-foundations`);
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
  };
  return (
    <section className="compute-workbench identity-workbench" aria-label={copy.title}>
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
              <IdentityGuideRecall mission={mission} />
            )}
          </div>
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch}{' '}
              <Link href={identityHref(identityMissionTopic[t.facts.guide.mission])}>
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
                          · {c.labels.result}: {c.model.outcome[runIdentity(last.input)!.outcome]}
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
                <IdentityControls input={input} change={configure} />
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
                    {c.model.outcome[runIdentity(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <IdentityModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              <IdentityComparison runs={g.runs} />
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <IdentityCausalChoice
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
          {(['directory', 'journey', 'external'] as const)
            .filter((id) => id === mission && identityMilestoneFacts(t.save)[id])
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
function guideStep(g: IdentityGuide) {
  const missing = identityWitnesses(g).findIndex((x) => !x);
  return missing < 0 ? c.missions[g.mission].steps.length - 1 : missing;
}
export function IdentityGuideRecall({ mission }: { mission: IdentityMission }) {
  const t = useIdentity(),
    [failed, setFailed] = useState(false);
  const guides = t.facts.guided.filter((g) => g.mission === mission && g.id !== t.facts.guide?.id);
  return (
    <>
      {guides.map((g) => (
        <button
          key={g.id}
          disabled={t.facts.full && !identityGuidedFacts(g).witnessed}
          onClick={() => setFailed(!t.store.event({ kind: 'resume', id: g.id }))}
        >
          {c.recallGuided} · #{g.id}
        </button>
      ))}
      {failed && <p role="alert">{c.storage.failed}</p>}
    </>
  );
}
function IdentityCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: IdentityMission;
  value: number | null;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend>{c.labels.chooseCause}</legend>
      {c.causal[mission].map((s, i) => (
        <label className="identity-causal-choice" key={s}>
          <input
            type="radio"
            name={`identity-cause-${mission}`}
            checked={value === i}
            onChange={() => onChange(i)}
          />
          <span>{s}</span>
        </label>
      ))}
    </fieldset>
  );
}
function IdentityControls({
  input,
  change,
}: {
  input: IdentityInput;
  change: (v: IdentityInput) => void;
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
        onChange={(e) => change({ ...input, [key]: e.target.value } as IdentityInput)}
      >
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
  const check = (key: string, label: string, disabled = false) => (
    <label className="storage-check" key={key}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={Boolean(input[key as keyof typeof input])}
        onChange={(e) => change({ ...input, [key]: e.target.checked } as IdentityInput)}
      />
      <span>{label}</span>
    </label>
  );
  return input.kind === 'directory' ? (
    <>
      {select('workload', c.controls.workload, c.options.workload)}
      {select('solution', c.controls.solution, c.options.solution)}
      {select('sync', c.controls.sync, c.options.sync, input.solution !== 'managed')}
      {select('change', c.controls.change, c.options.change, input.solution !== 'managed')}
    </>
  ) : input.kind === 'journey' ? (
    <>
      {check('identity', c.controls.identity)}
      {check('trust', c.controls.trust)}
      {select('session', c.controls.session, c.options.session)}
      {select('method', c.controls.method, c.options.method)}
      {select('credential', c.controls.credential, c.options.credential)}
      {select('requirement', c.controls.requirement, c.options.requirement)}
      {select('access', c.controls.access, c.options.access)}
    </>
  ) : (
    <>
      {select('audience', c.controls.audience, c.options.audience)}
      {select('approach', c.controls.approach, c.options.approach)}
      {select('home', c.controls.home, c.options.home)}
      {check('guest', c.controls.guest, input.approach !== 'b2b')}
      {check('invitation', c.controls.invitation, input.approach !== 'b2b')}
      {check(
        'inbound',
        c.controls.inbound,
        input.approach === 'customer' || input.home === 'other',
      )}
      {check(
        'outbound',
        c.controls.outbound,
        input.approach === 'customer' || input.home === 'other',
      )}
      {check('homeAuth', c.controls.homeAuth)}
      {select('access', c.controls.access, c.options.access)}
    </>
  );
}
