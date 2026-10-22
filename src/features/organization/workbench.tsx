'use client';

import { useCallback, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Info,
  List,
  Map,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { nb, creationErrors, regionLabels, scopeCopy } from '@/content/nb';
import {
  createResourceGroup,
  initialSimulation,
  missionSatisfied,
  regions,
} from '@/domain/simulation';
import { useProgress } from '@/components/progress-provider';
import { scopeIcons } from '@/components/icons';
import { ScopeGraph } from './scope-graph';
import { Assessment } from './assessment';

export function Workbench() {
  const [simulation, setSimulation] = useState(initialSimulation);
  const [selected, setSelected] = useState('rg-app');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('westeurope');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [hint, setHint] = useState(false);
  const { progress, award, ready } = useProgress();
  const select = useCallback((id: string) => setSelected(id), []);
  const scope = simulation.scopes.find((item) => item.id === selected)!;
  const parent = simulation.scopes.find((item) => item.id === scope.parentId);
  const Icon = scopeIcons[scope.kind];
  const finished = progress.completed.includes('organization-mission-v1');

  function create(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = createResourceGroup(simulation, { name, region, subscriptionId: 'sub' });
    if (!result.ok) {
      setError(creationErrors[result.error]);
      setFeedback('');
      return;
    }
    setSimulation(result.state);
    setSelected(result.created.id);
    setError('');
    if (missionSatisfied(result.state)) {
      award('organization-mission-v1');
      setFeedback(nb.mission.success);
    } else setFeedback(nb.mission.createdOther);
    setName('');
  }
  return (
    <>
      <section className="workbench" aria-label={nb.explore.map}>
        <div className="map-toolbar">
          <div className="map-title">
            <span className="live-dot" />
            <strong>{nb.explore.map}</strong>
            <span className="map-status">{nb.explore.status}</span>
          </div>
          <div className="view-switch" aria-label={nb.explore.map}>
            <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>
              <Map size={15} />
              {nb.explore.map}
            </button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <List size={15} />
              {nb.explore.list}
            </button>
          </div>
        </div>
        <div className="workbench-grid">
          <div className="map-area">
            <div className="map-label">
              <span className="map-line" />
              {nb.explore.hierarchy}
              <span className="identity-line" />
              {nb.explore.identity}
            </div>
            {view === 'map' ? (
              <ScopeGraph
                key={simulation.scopes.length}
                scopes={simulation.scopes}
                selected={selected}
                onSelect={select}
              />
            ) : (
              <div className="scope-list" aria-label={nb.explore.nodeList}>
                {simulation.scopes.map((item) => {
                  const ItemIcon = scopeIcons[item.kind];
                  return (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={selected === item.id}
                      className={selected === item.id ? 'selected' : ''}
                      onClick={() => select(item.id)}
                    >
                      <ItemIcon size={20} />
                      <span>
                        <small>{scopeCopy[item.kind].label}</small>
                        <strong>{item.label}</strong>
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  );
                })}
              </div>
            )}
            <div className="map-bottom">
              <span>{nb.explore.keyboard}</span>
              <button
                type="button"
                onClick={() => {
                  setSimulation(initialSimulation);
                  setSelected('rg-app');
                  setFeedback(nb.explore.resetNote);
                  setError('');
                }}
              >
                <RotateCcw size={14} />
                {nb.explore.reset}
              </button>
            </div>
          </div>
          <aside className="inspector" aria-labelledby="inspector-title">
            <p className="eyebrow">{nb.explore.inspector}</p>
            <div className={`inspector-icon kind-${scope.kind}`}>
              <Icon size={28} />
            </div>
            <span className="scope-kind">{scopeCopy[scope.kind].label}</span>
            <h2 id="inspector-title">{scope.label}</h2>
            <div className="inspector-separator" />
            <h3>{nb.explore.role}</h3>
            <p>{scopeCopy[scope.kind].role}</p>
            <dl className="properties">
              {parent && (
                <div>
                  <dt>{scope.kind === 'root' ? nb.explore.identity : nb.explore.parent}</dt>
                  <dd>{parent.label}</dd>
                </div>
              )}
              <div>
                <dt>{scope.kind === 'group' ? nb.explore.metadataRegion : nb.explore.region}</dt>
                <dd>
                  <Globe2 size={13} />
                  {scope.region ? regionLabels[scope.region] : nb.explore.noRegion}
                </dd>
              </div>
            </dl>
            <div className="nuance">
              <Info size={17} />
              <div>
                <h3>{nb.explore.nuance}</h3>
                <p>{scopeCopy[scope.kind].nuance}</p>
              </div>
            </div>
          </aside>
        </div>
        <div className="geography-note">
          <span className="geography-icon">
            <Globe2 size={21} />
          </span>
          <div>
            <strong>{nb.explore.geography}</strong>
            <p>{nb.explore.regionExample}</p>
          </div>
        </div>
      </section>
      <section className="mission-task" id="create-group" aria-labelledby="task-title">
        <div className="task-brief">
          <span className="task-number" aria-hidden="true">
            01
          </span>
          <p className="eyebrow blue">{nb.mission.eyebrow} / +80 XP</p>
          <h2 id="task-title">{nb.mission.createTitle}</h2>
          <p>{nb.mission.instructions}</p>
          <ul className="task-checklist">
            <li>
              <Check size={15} />
              Learning Sandbox
            </li>
            <li>
              <Check size={15} />
              rg-azurelab-dev
            </li>
            <li>
              <Check size={15} />
              Norway East
            </li>
          </ul>
          <button
            type="button"
            className="hint-button"
            aria-expanded={hint}
            onClick={() => setHint(!hint)}
          >
            <Info size={15} />
            {nb.mission.hint}
          </button>
          {hint && <p className="hint-text">{nb.mission.hintText}</p>}
          {finished && (
            <p className="completed-note">
              <CheckCircle2 size={17} />
              {nb.mission.already}
            </p>
          )}
        </div>
        <form className="creation-form" onSubmit={create}>
          <div className="form-field">
            <label htmlFor="subscription">{nb.mission.subscription}</label>
            <select id="subscription" defaultValue="sub">
              <option value="sub">Learning Sandbox</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="group-name">{nb.mission.name}</label>
            <input
              id="group-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={90}
              required
              placeholder="rg-…"
              aria-describedby={`name-help${error ? ' creation-error' : ''}`}
              aria-invalid={!!error}
              autoComplete="off"
            />
            <small id="name-help">{nb.mission.nameHelp}</small>
          </div>
          <div className="form-field">
            <label htmlFor="group-region">{nb.mission.region}</label>
            <select
              id="group-region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              {regions.map((id) => (
                <option key={id} value={id}>
                  {regionLabels[id]}
                </option>
              ))}
            </select>
          </div>
          <button className="button button-dark" type="submit" disabled={!ready}>
            <Plus size={17} />
            {nb.mission.submit}
          </button>
          <p className="form-disclaimer">{nb.mission.simulationNote}</p>
          {error && (
            <p role="alert" className="form-error" id="creation-error">
              {error}
            </p>
          )}
        </form>
      </section>
      <div aria-live="polite" aria-atomic="true">
        {feedback && (
          <div className="action-feedback">
            <CheckCircle2 size={21} />
            <p>{feedback}</p>
          </div>
        )}
      </div>
      <Assessment unlocked={finished || missionSatisfied(simulation)} />
      <div className="source-note">
        <Info size={14} />
        <span>
          {nb.explore.sources}:{' '}
          <a
            href="https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview"
            target="_blank"
            rel="noreferrer"
          >
            {nb.explore.sourceLink}
          </a>{' '}
          · 22.10.2026
        </span>
      </div>
    </>
  );
}
