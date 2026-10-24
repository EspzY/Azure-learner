'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Layers3,
  List,
  Network,
  Play,
  RotateCcw,
  X,
} from 'lucide-react';
import { nb, creationErrors, scopeCopy } from '@/content/nb';
import { createResourceGroup, missionSatisfied } from '@/domain/simulation';
import { useProgress } from '@/components/progress-provider';
import { scopeIcons } from '@/components/icons';
import { CommandDialog } from '@/components/command-dialog';
import { ScopeGraph } from './scope-graph';
import { SpatialScene } from './spatial-scene';
import { ContextInspector } from './context-inspector';
import { CreateCommand } from './create-command';
import { Assessment } from './assessment';
import { useExpedition } from '@/features/journey/expedition-provider';

type Overlay = 'brief' | 'create' | 'check' | 'reset' | null;
export function Workbench() {
  const { state: expedition, simulation, update, ready: worldReady } = useExpedition();
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<'spatial' | 'diagram' | 'list'>('spatial');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const mission = expedition.missionActive;
  const [subscriptionFound, setSubscriptionFound] = useState(false);
  const [comparison, setComparison] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<{ title: string; text: string; xp: number } | null>(
    null,
  );
  const [hint, setHint] = useState(false);
  const [sceneEpoch, setSceneEpoch] = useState(0);
  const [checkPassed, setCheckPassed] = useState(false);
  const pendingFocus = useRef<string | null>(null);
  const { progress, award, ready } = useProgress();
  const finished = progress.completed.includes('organization-mission-v1');
  const createdCorrectly = missionSatisfied(simulation);
  const scope = simulation.scopes.find((item) => item.id === selected);
  const select = useCallback((id: string) => {
    setSelected(id);
    setFeedback(null);
    if (id === 'sub') setSubscriptionFound(true);
  }, []);
  useEffect(() => {
    function initialize() {
      if (new URLSearchParams(window.location.search).get('mission') === 'organization')
        setOverlay('brief');
    }
    initialize();
  }, []);
  useEffect(() => {
    if (overlay === null && pendingFocus.current) {
      const id = pendingFocus.current;
      const frame = requestAnimationFrame(() => {
        document.getElementById(`scene-node-${id}`)?.focus({ preventScroll: true });
        pendingFocus.current = null;
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [overlay]);
  function create(name: string, region: string) {
    const result = createResourceGroup(simulation, {
      name,
      region,
      subscriptionId: scope?.id ?? '',
    });
    if (!result.ok) {
      setError(creationErrors[result.error]);
      return;
    }
    update((previous) => ({
      ...previous,
      commands: [...previous.commands, { name, region, subscriptionId: scope?.id ?? '' }],
    }));
    setSelected(result.created.id);
    setError('');
    setOverlay(null);
    pendingFocus.current = result.created.id;
    if (missionSatisfied(result.state)) {
      update((previous) => ({ ...previous, missionActive: true }));
      award('organization-mission-v1');
      setFeedback({
        title: nb.universe.createdTitle,
        text: finished ? nb.universe.replaySuccess : nb.universe.missionSuccess,
        xp: finished ? 0 : 80,
      });
    } else setFeedback({ title: nb.universe.createdTitle, text: nb.universe.noAward, xp: 0 });
  }
  const goal = createdCorrectly
    ? checkPassed
      ? nb.universe.goalDone
      : nb.universe.goalReflect
    : subscriptionFound
      ? nb.universe.goalCreate
      : nb.universe.goalSelect;
  return (
    <section
      className={`universe ${scope ? 'has-selection' : ''}`}
      aria-labelledby="universe-title"
    >
      <div className="universe-heading">
        <div>
          <p className="eyebrow">{nb.universe.sector}</p>
          <h1 id="universe-title">
            {nb.universe.title}
            <span> / 01</span>
          </h1>
        </div>
        <Link
          className="world-return"
          href={
            typeof window !== 'undefined' &&
            new URLSearchParams(window.location.search).get('journey') === '1'
              ? '/legacy-expedition?at=gateway'
              : '/portal'
          }
          onClick={() =>
            update((previous) => ({
              ...previous,
              stop: 'gateway',
              visited: [...new Set([...previous.visited, 'gateway' as const])],
            }))
          }
        >
          {nb.expedition.worldReturn}
          <ArrowRight size={15} />
        </Link>
        <Link className="chapter-entry-link" href="/explore?chapter=01">
          {nb.chapter.entry}
          <ArrowRight size={14} />
        </Link>
        <div className="view-switch" aria-label={nb.explore.map}>
          {[
            { id: 'spatial' as const, text: nb.universe.spatial, icon: Layers3 },
            { id: 'diagram' as const, text: nb.universe.diagram, icon: Network },
            { id: 'list' as const, text: nb.universe.list, icon: List },
          ].map(({ id, text, icon: Icon }) => (
            <button type="button" key={id} aria-pressed={view === id} onClick={() => setView(id)}>
              <Icon size={15} />
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="scene-legend">
        <span>
          <i className="legend-identity" />
          {nb.explore.identity}
        </span>
        <span>
          <i className="legend-containment" />
          {nb.explore.hierarchy}
        </span>
      </div>
      <div className="scene-stage">
        {view === 'spatial' ? (
          <SpatialScene
            key={sceneEpoch}
            scopes={simulation.scopes}
            selected={selected}
            onSelect={select}
            comparison={comparison}
          />
        ) : view === 'diagram' ? (
          <ScopeGraph
            key={simulation.scopes.length}
            scopes={simulation.scopes}
            selected={selected ?? ''}
            onSelect={select}
          />
        ) : (
          <div className="universe-list">
            <p>{nb.universe.listHelp}</p>
            <div className="scope-list" aria-label={nb.explore.nodeList}>
              {simulation.scopes.map((item) => {
                const Icon = scopeIcons[item.kind];
                return (
                  <button
                    id={`scene-node-${item.id}`}
                    type="button"
                    key={item.id}
                    aria-pressed={selected === item.id}
                    onClick={() => select(item.id)}
                  >
                    <Icon size={21} />
                    <span>
                      <small>{scopeCopy[item.kind].label}</small> <strong>{item.label}</strong>
                    </span>
                    <ChevronRight size={17} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {!scope && view !== 'list' && (
        <div className="discover-prompt">
          <span className="target-cross" />
          {nb.universe.discover}
        </div>
      )}
      {scope && (
        <ContextInspector
          key={scope.id}
          scope={scope}
          scopes={simulation.scopes}
          onSelect={select}
          onClose={() => {
            setSelected(null);
            requestAnimationFrame(() =>
              document.getElementById(`scene-node-${scope.id}`)?.focus({ preventScroll: true }),
            );
          }}
          onCreate={() => {
            setError('');
            setOverlay('create');
          }}
          onCompare={() => {
            setComparison(true);
            setSelected('rg-app');
          }}
        />
      )}
      {comparison && (
        <aside className="geography-layer" aria-label={nb.universe.geographyTitle}>
          <button
            type="button"
            className="icon-button"
            aria-label={nb.universe.geographyClose}
            onClick={() => setComparison(false)}
          >
            <X size={16} />
          </button>
          <span className="eyebrow">
            <Globe2 size={13} />
            {nb.explore.geography}
          </span>
          <h2>{nb.universe.geographyTitle}</h2>
          <div className="location-comparison">
            <button type="button" onClick={() => select('rg-app')}>
              <small>{nb.universe.metadata}</small>
              <strong>Norway East</strong>
              <span>rg-webapp-dev</span>
            </button>
            <span>≠</span>
            <button type="button" onClick={() => select('app')}>
              <small>App Service</small>
              <strong>West Europe</strong>
              <span>{nb.universe.location}</span>
            </button>
          </div>
          <p>{nb.universe.geographyText}</p>
        </aside>
      )}
      <div className={`mission-hud ${mission ? 'mission-running' : ''}`}>
        <div className="mission-hud-title">
          <span className="mission-signal" />
          <span>{mission ? nb.universe.missionActive : nb.universe.missionReady}</span>
          <span className="mission-xp">80 + 40 XP</span>
        </div>
        <div className="mission-hud-main">
          <div>
            <h2>{nb.universe.missionTitle}</h2>
            <p>{mission ? goal : nb.universe.briefText}</p>
          </div>
          {!mission ? (
            <button
              type="button"
              className="button button-primary"
              onClick={() => setOverlay('brief')}
            >
              <Play size={15} />
              {finished ? nb.universe.missionReplay : nb.universe.start}
            </button>
          ) : (
            (createdCorrectly || finished) && (
              <button
                type="button"
                className="button button-primary"
                onClick={() => setOverlay('check')}
              >
                {nb.universe.check}
                <ArrowRight size={15} />
              </button>
            )
          )}
        </div>
        {mission && (
          <>
            <ol className="mission-steps-compact">
              {[
                { label: nb.universe.stepSelect, done: subscriptionFound },
                { label: nb.universe.stepCreate, done: createdCorrectly },
                { label: nb.universe.stepCheck, done: checkPassed },
              ].map((step, index) => (
                <li key={step.label} className={step.done ? 'done' : ''}>
                  <span>{step.done ? <Check size={11} /> : index + 1}</span>
                  {step.label}
                </li>
              ))}
            </ol>
            <button
              className="hud-hint"
              type="button"
              aria-expanded={hint}
              onClick={() => setHint(!hint)}
            >
              {nb.mission.hint}
            </button>
            {hint && <p className="hud-hint-text">{nb.mission.hintText}</p>}
          </>
        )}
      </div>
      <div className="scene-footer">
        <span className="scene-coordinates">{nb.universe.depthNote}</span>
        <details className="scene-help">
          <summary>{nb.universe.help}</summary>
          <p>{nb.universe.keyboardHelp}</p>
          <a
            href="https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview"
            target="_blank"
            rel="noreferrer"
          >
            {nb.universe.sourceDate}
          </a>
        </details>
        <button type="button" className="reset-scene" onClick={() => setOverlay('reset')}>
          <RotateCcw size={14} />
          <span>{nb.universe.reset}</span>
        </button>
      </div>
      <div className="scene-announcement" aria-live="polite" aria-atomic="true">
        {feedback && (
          <div className="scene-feedback">
            <CheckCircle2 size={24} />
            <div>
              <strong>{feedback.title}</strong>
              <p>{feedback.text}</p>
            </div>
            <span className="feedback-xp">
              {feedback.xp ? `+${feedback.xp} XP` : nb.universe.awardNone}
            </span>
            <button
              className="icon-button"
              type="button"
              aria-label={nb.universe.close}
              onClick={() => setFeedback(null)}
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
      {overlay === 'brief' && (
        <CommandDialog title={nb.universe.brief} onClose={() => setOverlay(null)}>
          <div className="brief-symbol">
            <Network size={36} />
          </div>
          <p className="eyebrow">
            {nb.mission.eyebrow} / {nb.expedition.portalSkills}
          </p>
          <h3 className="brief-title">{nb.universe.missionTitle}</h3>
          <p className="brief-description">{nb.universe.briefText}</p>
          <dl className="brief-targets">
            <div>
              <dt>{nb.mission.subscription}</dt>
              <dd>{nb.universe.targetSubscription}</dd>
            </div>
            <div>
              <dt>{nb.mission.name}</dt>
              <dd>{nb.universe.targetName}</dd>
            </div>
            <div>
              <dt>{nb.mission.region}</dt>
              <dd>{nb.universe.targetRegion}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="button button-primary command-submit"
            onClick={() => {
              update((previous) => ({ ...previous, missionActive: true }));
              setOverlay(null);
            }}
          >
            {nb.universe.accept}
            <ArrowRight size={17} />
          </button>
          <p className="form-disclaimer">{nb.mission.simulationNote}</p>
        </CommandDialog>
      )}
      {overlay === 'create' && scope?.kind === 'subscription' && (
        <CommandDialog title={nb.universe.create} onClose={() => setOverlay(null)}>
          <CreateCommand
            subscription={scope.label}
            error={error}
            ready={ready && worldReady}
            onCreate={create}
            onEdit={() => setError('')}
          />
        </CommandDialog>
      )}
      {overlay === 'check' && (finished || createdCorrectly) && (
        <CommandDialog title={nb.assessment.title} onClose={() => setOverlay(null)}>
          <Assessment
            onComplete={(xp) => {
              setCheckPassed(true);
              setFeedback({
                title: nb.assessment.passed,
                text: xp ? nb.universe.checkAward : nb.universe.replaySuccess,
                xp,
              });
            }}
          />
        </CommandDialog>
      )}
      {overlay === 'reset' && (
        <CommandDialog title={nb.universe.reset} onClose={() => setOverlay(null)}>
          <p className="brief-description">{nb.universe.resetText}</p>
          <div className="dialog-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                update((previous) => ({ ...previous, commands: [] }));
                setSceneEpoch((value) => value + 1);
                setCheckPassed(false);
                setSelected(null);
                setComparison(false);
                setError('');
                setSubscriptionFound(false);
                setFeedback(null);
                setOverlay(null);
              }}
            >
              {nb.universe.resetConfirm}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setOverlay(null)}
            >
              {nb.universe.cancel}
            </button>
          </div>
        </CommandDialog>
      )}
    </section>
  );
}
