'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { learningPolishNb as copy, labsNb, nb, missionsNb } from '@/content/nb';
import type { MissionId } from '@/domain/sandbox/missions';
import type { LabKind } from '@/domain/sandbox/practical';
import { SavvyShark } from './savvy-shark';
import './mission-briefing.css';

/** Presentation only. Starting a session remains the caller's validated operation. */
export function MissionBriefing({
  kind,
  inspection,
  onStart,
  onClose,
  recall = false,
  existingApp = false,
  mission: missionId,
}: {
  kind: LabKind;
  inspection?: string;
  onStart: () => void;
  onClose: () => void;
  recall?: boolean;
  existingApp?: boolean;
  mission?: MissionId;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    title = useId();
  const c = copy.briefing,
    mission = kind === 'paas' && existingApp ? c.paasSettings : c[kind];
  useEffect(() => {
    const node = dialog.current,
      previous = document.activeElement;
    node?.showModal();
    return () => {
      node?.close();
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="mission-briefing"
      aria-labelledby={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="mission-heading">
        <small>{c.eyebrow}</small>
        <button type="button" aria-label={c.close} onClick={onClose}>
          ×
        </button>
      </div>
      <div className="mission-scroll" tabIndex={0} role="region" aria-label={nb.milestones.reading}>
        {missionId ? (
          <>
            <div className="mission-intro">
              <SavvyShark>
                <span>{missionsNb.guided}</span>
              </SavvyShark>
              <div>
                <h2 id={title}>{missionsNb.missions[missionId].title}</h2>
                <p>{missionsNb.missions[missionId].scenario}</p>
              </div>
            </div>
            <div className="mission-body">
              <section>
                <h3>{missionsNb.prerequisite}</h3>
                <p>{missionsNb.missions[missionId].prerequisites}</p>
                <h3>{missionsNb.purpose}</h3>
                <p>{missionsNb.missions[missionId].bridge}</p>
                <h3>{missionsNb.objectives}</h3>
                <ul>
                  {missionsNb.missions[missionId].goals.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <h3>{missionsNb.observe}</h3>
                <p>{missionsNb.missions[missionId].observation}</p>
              </section>
              <section className="mission-route">
                <h3>{missionsNb.steps}</h3>
                <ol>
                  {missionsNb.missions[missionId].stages.map((x, n) => (
                    <li key={x}>
                      <span aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                      <p>{x}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="mission-intro">
              <SavvyShark>
                <span>{inspection ? nb.refinement.inspectTarget : labsNb.guided}</span>
              </SavvyShark>
              <div>
                <h2 id={title}>{inspection ? c.inspection : mission.title}</h2>
                <h3>{c.purpose}</h3>
                <p>{inspection ? c.inspectionWhy : mission.why}</p>
              </div>
            </div>
            <div className="mission-body">
              <section>
                <h3>{nb.milestones.prerequisiteTitle}</h3>
                <p className="mission-prerequisite">{nb.milestones.prerequisites[kind]}</p>
                <h3>{c.outcomes}</h3>
                {inspection ? (
                  <p>{inspection}</p>
                ) : (
                  <ul>
                    {mission.outcomes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                )}
                <div className="mission-observation">
                  <h3>{c.observe}</h3>
                  <p>{inspection ?? mission.observation}</p>
                </div>
              </section>
              <section className="mission-route">
                <h3>{c.route}</h3>
                <ol>
                  {(inspection ? c.inspectionStages : mission.stages).map((x, n) => (
                    <li key={x}>
                      <span aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                      <p>{x}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </>
        )}
      </div>
      <footer>
        <p>
          {missionId
            ? recall
              ? nb.milestones.briefRecallAction
              : missionsNb.briefingNotice
            : recall
              ? nb.milestones.briefRecallAction
              : nb.milestones.briefAction}
        </p>
        <p>{c.boundary}</p>
        <div>
          <button type="button" onClick={onClose}>
            {recall ? c.close : c.cancel}
          </button>
          <button type="button" className="mission-start" onClick={onStart}>
            {recall ? c.continue : c.start}
          </button>
        </div>
      </footer>
    </dialog>
  );
}

export function MissionRecall({
  kind,
  existingApp = false,
}: {
  kind: LabKind;
  existingApp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        {copy.briefing.recall}
      </button>
      {open && (
        <MissionBriefing
          kind={kind}
          existingApp={existingApp}
          recall
          onStart={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
