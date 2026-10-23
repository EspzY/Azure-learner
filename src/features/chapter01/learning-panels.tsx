'use client';
import { useState } from 'react';
import { nb, regionLabels } from '@/content/nb';
import type { Attempt, Event } from '@/domain/chapter01/scenario';
import { types } from '@/domain/chapter01/model';

const t = nb.chapter;
export function ResponsibilityPanel({
  attempt,
  initialModel,
  disabled,
  dispatch,
}: {
  attempt: Attempt;
  initialModel: string;
  disabled: boolean;
  dispatch: (event: Event) => boolean;
}) {
  const [model, setModel] = useState(attempt.responsibility?.model ?? initialModel);
  const [os, setOs] = useState(attempt.responsibility?.os ?? '');
  const [code, setCode] = useState(attempt.responsibility?.code ?? '');
  return (
    <form
      className="chapter-learning"
      onSubmit={(event) => {
        event.preventDefault();
        dispatch({ kind: 'responsibility', model, os, code } as Event);
      }}
    >
      <h2>{t.stages.responsibility}</h2>
      <p>{t.bridge}</p>
      <label>
        {t.model}
        <select value={model} onChange={(event) => setModel(event.target.value)}>
          {(['iaas', 'paas', 'saas'] as const).map((id) => (
            <option key={id} value={id}>
              {nb.expedition.models[id].label}
            </option>
          ))}
        </select>
      </label>
      {[
        { label: t.osOwner, value: os, setter: setOs },
        { label: t.codeOwner, value: code, setter: setCode },
      ].map(({ label, value, setter }) => (
        <label key={label}>
          {label}
          <select required value={value} onChange={(event) => setter(event.target.value)}>
            <option value="">—</option>
            <option value="microsoft">{t.microsoft}</option>
            <option value="customer">{t.customer}</option>
          </select>
        </label>
      ))}
      <button type="submit" className="button button-primary" disabled={disabled}>
        {t.confirmModel}
      </button>
      {attempt.responsibility && (
        <p className="causal-feedback" role="status">
          {t.modelFeedback}
        </p>
      )}
    </form>
  );
}
export function LocationDecisions({
  kind,
  attempt,
  disabled,
  dispatch,
  onPrediction,
}: {
  kind: 'prediction' | 'explain';
  attempt: Attempt;
  disabled: boolean;
  dispatch: (event: Event) => boolean;
  onPrediction: () => void;
}) {
  const [placement, setPlacement] = useState('');
  const [appLocation, setAppLocation] = useState('');
  const [remedy, setRemedy] = useState('');
  if (kind === 'prediction' && attempt.prediction)
    return (
      <div className="saved-prediction">
        <h2>{t.predictionRecorded}</h2>
        <p>{attempt.prediction.placement === 'metadata-independent' ? t.independent : t.forced}</p>
        <p>
          {attempt.prediction.appLocation === 'plan-determines-app-location'
            ? t.planDetermines
            : t.groupDetermines}
        </p>
        <p>{attempt.prediction.beforeResult ? t.predictionSaved : t.predictionLate}</p>
        <small>{t.predictAgain}</small>
      </div>
    );
  return (
    <form
      className="chapter-learning"
      onSubmit={(event) => {
        event.preventDefault();
        const action = {
          kind,
          placement,
          appLocation,
          ...(kind === 'explain' ? { remedy } : {}),
        } as Event;
        if (dispatch(action) && kind === 'prediction') onPrediction();
      }}
    >
      <h2>{kind === 'prediction' ? t.predictionTitle : t.explanation}</h2>
      <p>{kind === 'prediction' ? t.predictionIntro : t.compareNote}</p>
      {[
        {
          legend: t.placementQuestion,
          name: 'placement',
          value: placement,
          setter: setPlacement,
          options: [
            ['metadata-independent', t.independent],
            ['metadata-forces-location', t.forced],
          ],
        },
        {
          legend: t.appLocationQuestion,
          name: 'app-location',
          value: appLocation,
          setter: setAppLocation,
          options: [
            ['plan-determines-app-location', t.planDetermines],
            ['group-determines-app-location', t.groupDetermines],
          ],
        },
        ...(kind === 'explain'
          ? [
              {
                legend: t.remedy,
                name: 'remedy',
                value: remedy,
                setter: setRemedy,
                options: [
                  ['policy-targets-resource-location', t.fixResource],
                  ['change-group-metadata', t.fixMetadata],
                  ['remove-plan-link', t.breakDependency],
                ],
              },
            ]
          : []),
      ].map((row) => (
        <fieldset key={row.name}>
          <legend>{row.legend}</legend>
          {row.options.map(([id, label]) => (
            <label className="chapter-option" key={id}>
              <input
                type="radio"
                name={row.name}
                value={id}
                checked={row.value === id}
                required
                onChange={() => row.setter(id!)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
      ))}
      <button type="submit" className="button button-primary" disabled={disabled}>
        {kind === 'prediction' ? t.savePrediction : t.saveExplanation}
      </button>
      {kind === 'explain' && attempt.explanation && (
        <p className="causal-feedback" role="status">
          {attempt.explanation.placement === 'metadata-independent' &&
          attempt.explanation.appLocation === 'plan-determines-app-location' &&
          attempt.explanation.remedy === 'policy-targets-resource-location'
            ? t.explanationGood
            : t.explanationWrong}
        </p>
      )}
    </form>
  );
}
export function TechnicalDepth({ topic }: { topic: keyof typeof t.topics }) {
  const copy = t.topics[topic];
  return (
    <details className="chapter-depth">
      <summary>{t.depth}</summary>
      <h3>{t.intuition}</h3>
      <p>{copy.purpose}</p>
      <h3>{t.mechanism}</h3>
      <p>{copy.mechanism}</p>
      <h3>{t.nuance}</h3>
      <p>{copy.nuance}</p>
      <a href={copy.url} target="_blank" rel="noreferrer">
        {t.source}
      </a>
    </details>
  );
}
export function LocationsPanel({ attempt, groupId }: { attempt: Attempt; groupId?: string }) {
  const { world } = attempt.engine;
  const group = world.groups.find((g) => g.id === groupId);
  return (
    <div className="locations-panel">
      <h2>{t.locations}</h2>
      <div className="location-property metadata-property">
        <small>{t.metadataValue}</small>
        <strong>{group ? regionLabels[group.metadataLocation] : '—'}</strong>
        <span>{group?.name}</span>
      </div>
      {world.resources
        .filter((r) => r.groupId === group?.id)
        .map((r) => (
          <div className="location-property resource-property" key={r.id}>
            <small>{r.type === types.plan ? t.kindLabels.plan : t.kindLabels.app}</small>
            <strong>{regionLabels[r.location]}</strong>
            <span>{r.name}</span>
            {r.type === types.app && (
              <span>
                {t.derivedLocation}: {r.planId}
              </span>
            )}
          </div>
        ))}
      {world.resources.filter((r) => r.groupId === group?.id).length === 0 && (
        <p>{t.noResourceYet}</p>
      )}
      <p>{t.compareNote}</p>
      {attempt.prediction && (
        <details>
          <summary>{t.predictionRecorded}</summary>
          <p>
            {attempt.prediction.placement === 'metadata-independent' ? t.independent : t.forced}
          </p>
          <p>
            {attempt.prediction.appLocation === 'plan-determines-app-location'
              ? t.planDetermines
              : t.groupDetermines}
          </p>
        </details>
      )}
      <TechnicalDepth topic="location" />
    </div>
  );
}
