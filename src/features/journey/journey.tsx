'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, Layers3, Map, MoveUpRight } from 'lucide-react';
import { nb } from '@/content/nb';
import {
  detourCompleted,
  evaluateDetour,
  isStop,
  responsibility,
  routeGraph,
  serviceModels,
  stops,
  type Stop,
} from '@/domain/expedition';
import { useProgress } from '@/components/progress-provider';
import { useExpedition } from './expedition-provider';
import { JourneyScene } from './journey-scene';
import { KnowledgeDetour } from './knowledge-detour';

export function Journey() {
  const { state, update, ready } = useExpedition();
  const { progress } = useProgress();
  const router = useRouter();
  const search = useSearchParams();
  const at = search.get('at');
  const stop: Stop = isStop(at) ? at : state.stop;
  const [overview, setOverview] = useState(false);
  const [depth, setDepth] = useState(0);
  const [allocations, setAllocations] = useState<string[]>([]);
  const [entering, setEntering] = useState(false);
  const heading = useRef<HTMLDivElement>(null);
  const previousStop = useRef<Stop>(stop);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const complete =
    progress.completed.includes('organization-mission-v1') &&
    progress.completed.includes('organization-check-v1');
  const created = progress.completed.includes('organization-mission-v1');
  const text = nb.expedition;
  const applyLocation = useEffectEvent(() => {
    if (!isStop(at)) router.replace(`/?at=${state.stop}`, { scroll: false });
    else if (at !== state.stop)
      update((old) => ({ ...old, stop: at, visited: [...new Set([...old.visited, at])] }));
  });
  useEffect(() => {
    if (ready) applyLocation();
  }, [at, ready]);
  useEffect(() => {
    if (stop === 'gateway') router.prefetch('/explore');
    if (previousStop.current !== stop && heading.current) {
      heading.current.scrollTop = 0;
      heading.current.focus({ preventScroll: true });
    }
    previousStop.current = stop;
    return () => {
      clearTimeout(timer.current);
    };
  }, [stop, router]);
  function travel(next: Stop) {
    setOverview(false);
    setEntering(false);
    update((old) => ({ ...old, stop: next, visited: [...new Set([...old.visited, next])] }));
    router.push(`/?at=${next}`, { scroll: false });
  }
  function enter() {
    if (!ready || entering) return;
    update((old) => ({
      ...old,
      stop: 'gateway',
      visited: [...new Set([...old.visited, 'gateway' as const])],
    }));
    setEntering(true);
    const enterWorld = () =>
      router.push('/explore?journey=1&mission=organization', { scroll: false });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) enterWorld();
    else timer.current = setTimeout(enterWorld, 440);
  }
  const { next, previous } = routeGraph[stop];
  const detour =
    stop === 'decision' ? 'service-fit' : stop === 'ownership' ? 'retained-control' : null;
  const lastAttempt = detour ? state.attempts[detour].at(-1) : undefined;
  const verdict =
    detour && lastAttempt
      ? evaluateDetour(detour, lastAttempt.answer)
        ? 'correct'
        : 'incorrect'
      : null;
  const portalStatus = complete
    ? text.portalComplete
    : created
      ? text.portalPartial
      : text.portalReady;
  return (
    <section
      className={`expedition expedition-${stop} ${overview ? 'expedition-overview' : ''}`}
      aria-labelledby="journey-heading"
    >
      <JourneyScene
        stop={stop}
        model={state.model}
        selectedLayer={state.layer}
        overview={overview}
        complete={complete}
        allocations={allocations}
        entering={entering}
        verdict={verdict}
        onLayer={(layer) => update((old) => ({ ...old, layer }))}
      />
      <div className="journey-topline">
        <p className="eyebrow">
          <Compass size={15} />
          {text.sector}
        </p>
        <button
          className="journey-map-toggle"
          type="button"
          aria-pressed={overview}
          onClick={() => setOverview(!overview)}
        >
          <Map size={16} />
          {overview ? text.mapClose : text.map}
        </button>
      </div>
      <div className="journey-coordinate" aria-hidden="true">
        <span>
          AZURE<span>LAB</span>
        </span>
        <i />
        {text.stops[stop].label}
      </div>
      {overview ? (
        <div className="journey-overview-panel">
          <p className="eyebrow">{text.map}</p>
          <h1 id="journey-heading">{text.title}</h1>
          <p>{text.journeyNotGeography}</p>
          <nav aria-label={text.orientation}>
            {stops.map((id) => (
              <button
                type="button"
                key={id}
                aria-current={stop === id ? 'location' : undefined}
                onClick={() => travel(id)}
              >
                <span>{text.stops[id].label}</span>
                <MoveUpRight size={16} />
              </button>
            ))}
          </nav>
          <p className="journey-evidence">{text.experienced}</p>
        </div>
      ) : (
        <div
          className={`journey-console ${detour ? 'journey-detour-console' : ''}`}
          ref={heading}
          tabIndex={-1}
        >
          {detour ? (
            <KnowledgeDetour
              key={detour}
              id={detour}
              onReturn={travel}
              onAllocation={setAllocations}
            />
          ) : (
            <>
              <p className="eyebrow">{text.stops[stop].label}</p>
              <h1 id="journey-heading">{text.stops[stop].title}</h1>
              <p className="journey-intro">{text.stops[stop].text}</p>
              {stop === 'arrival' && (
                <div className="expedition-brief">
                  <span>F01 → G01 / F02</span>
                  <p>{text.local}</p>
                  <p>{text.reward}</p>
                </div>
              )}
              {stop === 'models' && (
                <div className="teaching-sequence">
                  <div className="model-switch" role="group" aria-label={text.inspect}>
                    {serviceModels.map((model) => (
                      <button
                        type="button"
                        aria-pressed={state.model === model}
                        key={model}
                        onClick={() => update((old) => ({ ...old, model }))}
                      >
                        {text.models[model].label}
                      </button>
                    ))}
                  </div>
                  <p className="model-example">
                    <Layers3 size={16} />
                    {text.models[state.model].example}
                  </p>
                  <div className="depth-tabs" role="group" aria-label={text.inspect}>
                    {text.levels.map((label, i) => (
                      <button
                        type="button"
                        aria-pressed={depth === i}
                        key={label}
                        onClick={() => setDepth(i)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="concept-explanation" aria-live="polite">
                    {depth === 0 && <p>{text.models[state.model].summary}</p>}
                    {depth === 1 && (
                      <>
                        <p>{text.mechanism}</p>
                        <strong>
                          {text.layers[state.layer].label} ·{' '}
                          {text.owners[responsibility(state.model, state.layer)]}
                        </strong>
                      </>
                    )}
                    {depth === 2 && (
                      <>
                        <strong>{text.layers[state.layer].label}</strong>
                        <p>{text.layers[state.layer].detail}</p>
                        <small>{text.nuance}</small>
                      </>
                    )}
                    {depth === 3 && <p>{text.models[state.model].application}</p>}
                  </div>
                  <details className="teaching-sources">
                    <summary>{text.source}</summary>
                    <a
                      href="https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {text.sourceResponsibility}
                    </a>
                    <a
                      href="https://learn.microsoft.com/en-us/azure/app-service/overview-patch-os-runtime"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {text.sourceRuntime}
                    </a>
                  </details>
                </div>
              )}
              {stop === 'crossing' && (
                <div className="journey-checkpoint">
                  <Check size={21} />
                  <span>
                    {detourCompleted(state, 'service-fit') ? text.checkDone : text.checkOpen}
                  </span>
                  <p>{text.guided}</p>
                </div>
              )}
              {stop === 'gateway' && (
                <div className="portal-brief">
                  <span className={`portal-status ${complete ? 'complete' : ''}`}>
                    <i />
                    {portalStatus}
                  </span>
                  <p className="portal-skills">{text.portalSkills}</p>
                  <p>{text.portalActions}</p>
                  <small>{text.portalBoundary}</small>
                  <button
                    type="button"
                    className="button button-primary portal-launch"
                    disabled={!ready || entering}
                    onClick={enter}
                  >
                    {entering
                      ? text.portalEntering
                      : state.commands.length
                        ? text.resume
                        : text.portal}
                    <ArrowRight size={17} />
                  </button>
                  <small>{text.saved}</small>
                </div>
              )}
              {stop === 'horizon' && (
                <div className="journey-results">
                  <p>{text.milestone}</p>
                  <ul>
                    <li>
                      {text.checkTitles['service-fit']}
                      <span>
                        {detourCompleted(state, 'service-fit') ? text.checkDone : text.checkOpen}
                      </span>
                    </li>
                    <li>
                      {text.checkTitles['retained-control']}
                      <span>
                        {detourCompleted(state, 'retained-control')
                          ? text.checkDone
                          : text.checkOpen}
                      </span>
                    </li>
                    <li>
                      {text.stops.gateway.label}
                      <span>{portalStatus}</span>
                    </li>
                  </ul>
                  <small>{text.completionNote}</small>
                </div>
              )}
              <div className="journey-primary-actions">
                {previous && (
                  <button
                    className="journey-back"
                    type="button"
                    aria-label={text.back}
                    onClick={() => travel(previous)}
                  >
                    <ArrowLeft size={19} />
                  </button>
                )}
                <button
                  type="button"
                  className={stop === 'gateway' ? 'text-control' : 'button button-primary'}
                  disabled={!ready}
                  onClick={() => travel(next ?? 'models')}
                >
                  {stop === 'arrival'
                    ? text.begin
                    : stop === 'models' || stop === 'crossing'
                      ? text.detour
                      : text.continue}
                  <ArrowRight size={17} />
                </button>
              </div>
              {stop === 'arrival' && (
                <div className="experienced-entry">
                  <Link href="/explore?mission=organization">
                    {text.quickEntry}
                    <MoveUpRight size={14} />
                  </Link>
                  <small>{text.experienced}</small>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <div className="journey-navigation-strip" aria-label={text.orientation}>
        <span className="journey-route-signal" />
        <span>{text.stops[stop].label}</span>
        <span className="route-dots" aria-hidden="true">
          {['arrival', 'models', 'crossing', 'gateway', 'horizon'].map((id) => (
            <i
              key={id}
              className={
                id === stop ? 'active' : state.visited.includes(id as Stop) ? 'visited' : ''
              }
            />
          ))}
        </span>
        <small>{text.local}</small>
      </div>
    </section>
  );
}
