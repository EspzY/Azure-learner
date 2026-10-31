'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storageNb as c } from '@/content/nb';
import {
  storageGuidedFacts,
  storageWitnesses,
  storageMilestoneFacts,
  storageHref,
  storageMissionTopic,
  type StorageMission,
  type StorageGuide,
} from '@/domain/curriculum/storage';
import {
  initialStorage,
  runStorage,
  type StorageInput,
  type Outcome,
  storageServices,
  storageWorkloads,
  storageRequests,
  accountSupport,
  type StorageAccount,
  type StorageRequest,
  type StorageService,
} from '@/domain/curriculum/storage-model';
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
import { useStorage } from './storage-provider';
import { StorageModelResult } from './storage-visuals';
export function StorageWorkbench({ mission }: { mission: StorageMission }) {
  const t = useStorage(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const input = g?.configuration[mission] ?? initialStorage(mission),
    last = g?.runs.at(-1),
    facts = g ? storageGuidedFacts(g) : null,
    nextStep = g ? guideStep(g) : 0;
  const [overlay, setOverlay] = useState<'brief' | 'accounts' | 'delivery' | null>(null),
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
  const configure = (next: StorageInput) => {
    if (!safe) return;
    setFailed(!t.store.event({ kind: 'configure', input: next }));
    setPrediction(null);
  };
  const run = () => {
    if (!safe || prediction === null) return;
    const before = storageMilestoneFacts(t.store.getSnapshot().save);
    if (!t.store.event({ kind: 'run', input, prediction })) {
      setFailed(true);
      return;
    }
    setFailed(false);
    const after = storageMilestoneFacts(t.store.getSnapshot().save);
    const id = (['accounts', 'delivery'] as const).find(
      (k) => mission === k && after[k] && !before[k],
    );
    if (id && !document.querySelector('dialog[open]')) {
      const d = conceptMilestones[`storage-${id}`];
      let status;
      try {
        status = claimMilestone(localStorage, `storage-${id}@${d.version}:storage-services`);
      } catch {
        status = 'unavailable';
      }
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
  };
  return (
    <section className="compute-workbench storage-workbench" aria-label={copy.title}>
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
              <StorageGuideRecall mission={mission} />
            )}
          </div>
          {!g && t.facts.guide && (
            <p>
              {c.labels.switch}{' '}
              <Link href={storageHref(storageMissionTopic[t.facts.guide.mission])}>
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
                          · {c.labels.result}: {c.model.outcome[runStorage(last.input)!.outcome]}
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
                <StorageControls input={input} change={configure} />
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
                    {c.model.outcome[runStorage(last.input)!.outcome]}
                  </p>
                  {JSON.stringify(last.input) !== JSON.stringify(input) && (
                    <p className="compute-boundary">{c.model.draftChanged}</p>
                  )}
                  <StorageModelResult input={last.input} />
                </section>
              ) : (
                <p>{c.model.noRun}</p>
              )}
              {facts?.witnessed && (
                <section className="compute-debrief">
                  <StorageCausalChoice
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
          {(['accounts', 'delivery'] as const)
            .filter((id) => id === mission && storageMilestoneFacts(t.save)[id])
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
function guideStep(g: StorageGuide) {
  const missing = storageWitnesses(g).findIndex((x) => !x);
  return missing < 0 ? 3 : missing;
}
export function StorageGuideRecall({ mission }: { mission: StorageMission }) {
  const t = useStorage(),
    [failed, setFailed] = useState(false);
  const guides = t.facts.guided.filter((g) => g.mission === mission && g.id !== t.facts.guide?.id);
  return (
    <>
      {guides.map((g) => (
        <button
          key={g.id}
          disabled={t.facts.full && !storageGuidedFacts(g).witnessed}
          onClick={() => setFailed(!t.store.event({ kind: 'resume', id: g.id }))}
        >
          {c.recallGuided} · #{g.id}
        </button>
      ))}
      {failed && <p role="alert">{c.storage.failed}</p>}
    </>
  );
}
function StorageCausalChoice({
  mission,
  value,
  disabled,
  onChange,
}: {
  mission: StorageMission;
  value: number | null;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend>{c.labels.chooseCause}</legend>
      {c.causal[mission].map((s, i) => (
        <label className="storage-causal-choice" key={s}>
          <input
            type="radio"
            name={`storage-cause-${mission}`}
            checked={value === i}
            onChange={() => onChange(i)}
          />
          <span>{s}</span>
        </label>
      ))}
    </fieldset>
  );
}
function StorageControls({
  input,
  change,
}: {
  input: StorageInput;
  change: (v: StorageInput) => void;
}) {
  if (input.kind === 'design')
    return (
      <>
        {storageWorkloads.map((k) => (
          <label className="compute-control" key={k}>
            <span>{c.model.workloads[k]}</span>
            <select
              value={input.services[k]}
              onChange={(e) =>
                change({
                  ...input,
                  services: { ...input.services, [k]: e.target.value as StorageService },
                })
              }
            >
              {storageServices.map((s) => (
                <option key={s} value={s}>
                  {c.model.services[s]}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="compute-control">
          <span>{c.labels.imageAccess}</span>
          <select
            value={input.imageAccess}
            onChange={(e) => change({ ...input, imageAccess: e.target.value as 'http' | 'smb' })}
          >
            <option value="http">{c.model.imageOptions[0]}</option>
            <option value="smb">{c.model.imageOptions[1]}</option>
          </select>
        </label>
      </>
    );
  if (input.kind === 'accounts')
    return (
      <>
        <label className="compute-control">
          <span>{c.labels.account}</span>
          <select
            value={input.account}
            onChange={(e) => change({ ...input, account: e.target.value as StorageAccount })}
          >
            {Object.keys(accountSupport).map((k) => (
              <option key={k} value={k}>
                {c.model.accountNames[k as StorageAccount]}
              </option>
            ))}
          </select>
        </label>
        <label className="compute-control">
          <span>{c.labels.requested}</span>
          <select
            value={input.request}
            onChange={(e) => change({ ...input, request: e.target.value as StorageRequest })}
          >
            {storageRequests.map((k) => (
              <option key={k} value={k}>
                {c.model.requestNames[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="storage-check">
          <input
            type="checkbox"
            checked={input.regionDeclared}
            onChange={(e) => change({ ...input, regionDeclared: e.target.checked })}
          />
          <span>{c.labels.region}</span>
        </label>
      </>
    );
  return (
    <>
      <label className="compute-control">
        <span>{c.model.queueLabels.payload}</span>
        <select
          value={input.payload}
          onChange={(e) => change({ ...input, payload: e.target.value as 'pointer' | 'large' })}
        >
          <option value="pointer">{c.model.queueLabels.pointer}</option>
          <option value="large">{c.model.queueLabels.large}</option>
        </select>
      </label>
      <label className="storage-check">
        <input
          type="checkbox"
          checked={input.idempotent}
          onChange={(e) => change({ ...input, idempotent: e.target.checked })}
        />
        <span>{c.model.queueLabels.idempotent}</span>
      </label>
    </>
  );
}
