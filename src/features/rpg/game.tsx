'use client';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Compass,
  MessageCircle,
  Settings2,
  BookOpen,
  ScrollText,
} from 'lucide-react';
import { nb } from '@/content/nb';
import { currentStage } from '@/domain/chapter01/scenario';
import { dialogue, entryNode, storyFacts, type Choice, type NodeId } from '@/domain/rpg/story';
import { gatewayReturn, places, nearestPlace, type PlaceId } from '@/domain/rpg/world';
import { useChapter } from '@/features/chapter01/provider';
import { CommandDialog } from '@/components/command-dialog';
import { useProgress } from '@/components/progress-provider';
import { totalXp } from '@/domain/progression';
import { useGame } from './game-provider';
import { PlayerRuntime } from './runtime';
import { CinematicDialogue } from './cinematic-dialogue';
import { conversationShot } from './cinematics';
import { useLearning } from '@/features/learning/provider';
import { FoundationsSession, type LearningProjection } from '@/features/learning/session';
import { initialProbe } from '@/domain/curriculum/foundations';
import { journeyGoals, goalPlaces, type JourneyGoal } from '@/domain/rpg/expedition';
import { useExpeditionFacts, useOrientation } from './use-expedition';
import { ExpeditionLog } from './expedition-log';
import { Arrival } from './arrival';
import './orientation.css';

const Scene = dynamic(() => import('./scene').then((m) => m.GameScene), { ssr: false });
const t = nb.rpg;
const keys: Record<string, string> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};
class RenderBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function Game() {
  const { save, ready, issue, store } = useGame();
  const { attempt } = useChapter();
  const { progress } = useProgress();
  const router = useRouter();
  const expedition = useExpeditionFacts();
  const orientationState = useOrientation();
  const [replayingArrival, setReplayingArrival] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [travel, setTravel] = useState<JourneyGoal | null>(null);
  const [assisting, setAssisting] = useState(false);
  const goal = orientationState.preferences.goal ?? expedition.recommended;
  const destination = goalPlaces[goal];
  const objectiveCopy = nb.orientation.steps[goal];
  const [runtime] = useState(
    () => new PlayerRuntime(save.returnPending ? gatewayReturn : save.pose),
  );
  const [near, setNear] = useState<PlaceId | null>(null);
  const [mode, setMode] = useState<'webgl' | 'semantic' | 'failed'>('webgl');
  const [semanticChoice, setSemanticPlace] = useState<PlaceId | null>(null);
  const semanticPlace =
    semanticChoice ??
    (save.returnPending || save.pose.z < -18 ? 'portal' : (nearestPlace(save.pose) ?? 'guide'));
  const [started, setStarted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const restored = useRef(false);
  const sceneLoaded = useCallback(() => setSceneReady(true), []);
  const [node, setNode] = useState<NodeId | null>(null);
  const { openJournal, journalOpen } = useLearning();
  const [lessonOpen, setLessonOpen] = useState(false);
  const [lessonPending, setLessonPending] = useState(false);
  const [projection, setProjection] = useState<LearningProjection | null>(null);
  const project = useCallback((p: LearningProjection | null) => setProjection(p), []);
  const [orientation, setOrientation] = useState(false);
  const [settings, setSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [entering, setEntering] = useState(false);
  const [metrics, setMetrics] = useState(runtime.measurement);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLElement>(null),
    viewport = useRef<HTMLDivElement>(null);
  const interactButton = useRef<HTMLButtonElement>(null);
  const technical = {
    guidedBuilt: currentStage(attempt) === 'guided-built',
    hasWork: attempt.events.length > 0,
  };
  const facts = storyFacts(save, technical);
  const active = mode === 'webgl' ? near : semanticPlace;
  const interactRef = useRef<() => void>(() => {});
  const savePosition = useCallback(() => {
    store.position(runtime.pose);
    if (!runtime.route.length) setAssisting(false);
  }, [store, runtime]);
  const failure = useCallback(() => {
    runtime.stop();
    setMode('failed');
  }, [runtime]);
  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    runtime.restore(save.returnPending ? gatewayReturn : save.pose);
    store.returned();
    // Restoration runs once at readiness; ongoing position saves must not reset live movement.
  }, [ready, runtime, store, save.pose, save.returnPending]);
  useEffect(() => {
    runtime.attach(root.current);
    runtime.pause(
      !started ||
        !!node ||
        lessonOpen ||
        logOpen ||
        !!travel ||
        journalOpen ||
        settings ||
        confirmReset ||
        !visible ||
        entering ||
        mode !== 'webgl',
    );
  }, [
    runtime,
    started,
    node,
    lessonOpen,
    logOpen,
    travel,
    journalOpen,
    settings,
    confirmReset,
    visible,
    entering,
    mode,
  ]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    const visibility = () => {
      runtime.stop();
      setVisible(!document.hidden);
    };
    const blur = () => {
      runtime.stop();
    };
    const persist = () => store.position(runtime.pose);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', blur);
    window.addEventListener('pagehide', persist);
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', blur);
      window.removeEventListener('pagehide', persist);
      persist();
    };
  }, [runtime, store]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        !root.current?.contains(document.activeElement) ||
        node ||
        lessonOpen ||
        logOpen ||
        !!travel ||
        journalOpen ||
        settings ||
        confirmReset ||
        !started
      )
        return;
      if (event.code === 'Escape') {
        setAssisting(false);
        setLessonPending(false);
        runtime.stop();
        setOrientation(false);
        return;
      }
      if (event.code === 'KeyE' && !event.repeat) {
        event.preventDefault();
        interactRef.current();
        return;
      }
      const direction = keys[event.code];
      if (direction && mode === 'webgl') {
        setAssisting(false);
        setLessonPending(false);
        event.preventDefault();
        runtime.keys.add(direction);
      }
    };
    const up = (event: KeyboardEvent) => {
      if (keys[event.code]) runtime.keys.delete(keys[event.code]!);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [
    runtime,
    node,
    lessonOpen,
    logOpen,
    travel,
    journalOpen,
    settings,
    confirmReset,
    started,
    mode,
  ]);
  useEffect(() => {
    if (!settings) return;
    const timer = setInterval(() => setMetrics({ ...runtime.measurement }), 1000);
    return () => clearInterval(timer);
  }, [runtime, settings]);
  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );
  useEffect(() => {
    runtime.direct(
      lessonOpen
        ? { ...conversationShot('installation', 'guide'), framing: 'learning' }
        : node
          ? conversationShot(node, dialogue[node].speaker)
          : null,
    );
  }, [node, runtime, lessonOpen]);
  const observeNear = useCallback(
    (place: PlaceId | null) => {
      setNear(place);
      if (lessonPending && place === 'installation') {
        runtime.stop();
        runtime.converse('installation');
        setLessonPending(false);
        setLessonOpen(true);
      }
    },
    [lessonPending, runtime],
  );
  const restoreFocus = useCallback(() => {
    if (runtime.route.length) viewport.current?.focus();
    else if (interactButton.current && !interactButton.current.disabled)
      interactButton.current.focus();
    else viewport.current?.focus();
  }, [runtime]);
  function close() {
    if (
      expedition.statuses[goal] === 'guided-completed' ||
      (goal === 'assignment' && facts.accepted)
    )
      orientationState.store.update({ goal: null });
    runtime.converse(null);
    setNode(null);
  }
  function selectGoal(next: JourneyGoal) {
    setLessonOpen(false);
    close();
    setLogOpen(false);
    setOrientation(false);
    runtime.stop();
    setAssisting(false);
    setLessonPending(false);
    orientationState.store.update({ goal: next });
    setTravel(next);
  }
  function foundations() {
    selectGoal('foundations');
  }
  function enterWorld() {
    if (!store.portal()) return;
    runtime.activateGate();
    setEntering(true);
    close();
    transitionTimer.current = setTimeout(
      () => router.push('/explore?chapter=01&from=rpg-g1'),
      reduced ? 0 : 650,
    );
  }
  function begin(next?: JourneyGoal) {
    setReplayingArrival(false);
    if (goal === 'infrastructure' && expedition.built)
      orientationState.store.update({ goal: null });
    orientationState.store.update({
      seen: true,
      ...(!expedition.hasHistory && !next ? { goal: 'welcome' as const } : {}),
    });
    setStarted(true);
    runtime.establish(null);
    viewport.current?.focus();
    const incoming = new URLSearchParams(window.location.search).get('goal');
    const selected =
      next ??
      (journeyGoals.includes(incoming as JourneyGoal) ? (incoming as JourneyGoal) : undefined);
    if (selected) {
      selectGoal(selected);
      if (incoming && journeyGoals.includes(incoming as JourneyGoal))
        router.replace('/expedition-3d', { scroll: false });
    }
  }
  function navigate(id: PlaceId, activity = false) {
    if (!activity)
      orientationState.store.update({
        goal:
          id === 'guide'
            ? 'welcome'
            : id === 'installation'
              ? 'service'
              : id === 'engineer'
                ? 'assignment'
                : 'infrastructure',
      });
    setAssisting(mode === 'webgl');
    runtime.converse(null);
    setNode(null);
    setOrientation(false);
    if (mode === 'webgl') {
      runtime.navigate(id);
      viewport.current?.focus();
    } else setSemanticPlace(id);
  }
  function interact() {
    const target = mode === 'webgl' ? runtime.near : semanticPlace;
    if (!target || entering) return;
    runtime.stop();
    savePosition();
    if (target === 'installation' && goal === 'foundations') {
      runtime.converse('installation');
      setLessonOpen(true);
      return;
    }
    runtime.converse(target);
    setNode(entryNode(target, store.getSnapshot().save, technical));
    if (target === 'guide' || target === 'engineer') store.event({ kind: 'meet', npc: target });
    if (target === 'guide' && goal === 'welcome') orientationState.store.update({ goal: null });
  }
  useEffect(() => {
    interactRef.current = interact;
  });
  function choose(choice: Choice) {
    if (choice.when && !facts[choice.when]) return;
    if (choice.effect && !store.event(choice.effect)) return;
    if (choice.action === 'close') {
      close();
      return;
    }
    if (choice.action === 'installation') {
      selectGoal('service');
      return;
    }
    if (choice.action === 'enter') {
      if (!facts.canEnter) return;
      enterWorld();
      return;
    }
    if (choice.next) setNode(choice.next);
  }
  useEffect(() => {
    runtime.markDestination(destination);
  }, [runtime, destination]);
  const objective = !facts.compared
    ? 'compare'
    : !facts.challenge
      ? 'challenge'
      : !facts.accepted
        ? 'accept'
        : !technical.guidedBuilt
          ? 'build'
          : !facts.reported
            ? 'report'
            : 'done';
  return (
    <section
      ref={root}
      className={`rpg-world rpg-${mode}`}
      aria-labelledby="rpg-title"
      data-renderer={mode}
      data-reduced={String(reduced)}
      data-quest={objective}
      data-objective={goal}
      data-onboarding={started ? 'playing' : 'arrival'}
      data-dialogue={node ?? ''}
      data-learning-projection={lessonOpen ? (projection?.unit ?? 'brief') : ''}
    >
      <h1 id="rpg-title" className="rpg-sr">
        {t.title}
      </h1>
      <div
        className="rpg-viewport"
        ref={viewport}
        tabIndex={0}
        role="group"
        aria-label={t.moveArea}
      >
        {mode === 'webgl' && ready && (
          <RenderBoundary onFailure={failure}>
            <Scene
              runtime={runtime}
              model={facts.model}
              reduced={reduced}
              visible={visible}
              quality={save.quality}
              onNear={observeNear}
              onSave={savePosition}
              onFailure={failure}
              onReady={sceneLoaded}
              lesson={lessonOpen ? (projection ?? { unit: 'brief', input: initialProbe }) : null}
            />
          </RenderBoundary>
        )}
        {mode !== 'webgl' && (
          <div className="rpg-alternative">
            <p className="eyebrow">{t.region}</p>
            <h2>{mode === 'failed' ? t.fallback : t.alternative}</h2>
            <p>{mode === 'failed' ? t.fallbackText : t.alternativeHint}</p>
            {mode === 'failed' && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => location.reload()}
              >
                {t.retry}
              </button>
            )}
            <div className="rpg-place-list">
              {(Object.keys(places) as PlaceId[]).map((id) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={semanticPlace === id}
                  onClick={() => {
                    setSemanticPlace(id);
                    orientationState.store.update({
                      goal:
                        id === 'guide'
                          ? 'welcome'
                          : id === 'installation'
                            ? 'service'
                            : id === 'engineer'
                              ? 'assignment'
                              : 'infrastructure',
                    });
                  }}
                >
                  {t.places[id]}
                </button>
              ))}
            </div>
            <button
              ref={interactButton}
              type="button"
              className="button button-primary"
              onClick={interact}
            >
              {t.interact} · {t.places[semanticPlace]}
            </button>
          </div>
        )}
      </div>
      <header className="rpg-top">
        <div>
          <span className="rpg-location-mark">◈</span>
          <p>
            {t.region}
            <strong>{t.title}</strong>
          </p>
        </div>
        <div className="rpg-top-actions">
          <button type="button" aria-label={nb.foundations.journal} onClick={() => openJournal()}>
            <BookOpen size={19} />
          </button>
          <span className="rpg-xp">
            {totalXp(progress)} {nb.shell.xp}
          </span>
          <button
            type="button"
            aria-label={t.navigate}
            onClick={() => setOrientation(!orientation)}
          >
            <Compass size={19} />
          </button>
          <button
            type="button"
            aria-label={t.settings}
            onClick={() => {
              setMetrics({ ...runtime.measurement });
              setSettings(true);
            }}
          >
            <Settings2 size={19} />
          </button>
          <button
            type="button"
            className="expedition-log-button"
            onClick={() => {
              runtime.stop();
              setLogOpen(true);
            }}
            aria-label={nb.orientation.log}
          >
            <ScrollText size={19} />
            <span>{nb.orientation.log}</span>
          </button>
        </div>
      </header>
      {started && !node && !lessonOpen && (
        <aside className="expedition-hud" aria-label={nb.orientation.selected}>
          <small>
            {nb.orientation.selected} · {t.places[destination]}
          </small>
          <strong aria-live="polite">{objectiveCopy.title}</strong>
          <p>{objectiveCopy.why}</p>
          <output data-wayfinding aria-live="off" key={destination} />
          <button
            type="button"
            onClick={() => {
              runtime.stop();
              setLogOpen(true);
            }}
          >
            {nb.orientation.log} <ArrowRight size={13} />
          </button>
          <button type="button" onClick={() => selectGoal(goal)}>
            {nb.orientation.wayfinding}
          </button>
          {assisting && (
            <button
              type="button"
              onClick={() => {
                runtime.stop();
                setAssisting(false);
                setLessonPending(false);
              }}
            >
              {nb.orientation.stop}
            </button>
          )}
        </aside>
      )}
      {issue && started && (
        <div className="rpg-storage" role="alert">
          <p>{t.storage[issue]}</p>
          <button
            type="button"
            onClick={() => {
              store.load();
              runtime.restore(store.getSnapshot().save.pose);
            }}
          >
            {t.retryStorage}
          </button>
          <button type="button" onClick={() => setConfirmReset(true)}>
            {t.resetStorage}
          </button>
        </div>
      )}
      {orientation && (
        <aside className="rpg-orientation" aria-label={t.navigate}>
          <h2>{t.navigate}</h2>
          <p>{t.navigateHint}</p>
          {(Object.keys(places) as PlaceId[]).map((id) => (
            <button type="button" key={id} onClick={() => navigate(id)}>
              {t.walkTo} {t.places[id]}
              <ArrowRight size={14} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              runtime.stop();
              setMode(mode === 'webgl' ? 'semantic' : 'webgl');
              setOrientation(false);
            }}
          >
            {mode === 'webgl' ? t.semantic : t.spatial}
          </button>
        </aside>
      )}
      {confirmReset && (
        <CommandDialog title={t.resetStorage} onClose={() => setConfirmReset(false)}>
          <p>{t.resetExplanation}</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              store.clear();
              runtime.restore(store.getSnapshot().save.pose);
              setConfirmReset(false);
            }}
          >
            {t.confirmReset}
          </button>
        </CommandDialog>
      )}
      {!started && expedition.ready && orientationState.ready && (
        <Arrival
          notice={issue ? t.storage[issue] : undefined}
          runtime={runtime}
          returning={
            !replayingArrival &&
            (orientationState.preferences.seen ||
              expedition.hasHistory ||
              expedition.hasNavigationHistory ||
              totalXp(progress) > 0)
          }
          available={ready && (mode !== 'webgl' || sceneReady)}
          onBegin={begin}
          onLog={() => setLogOpen(true)}
        />
      )}
      {orientationState.issue && (
        <span className="orientation-warning" role="status">
          {nb.orientation.prefShort}
        </span>
      )}
      {logOpen && (
        <ExpeditionLog
          selected={goal}
          preferenceIssue={orientationState.issue}
          onClose={() => setLogOpen(false)}
          onGoal={(next) => {
            if (!started) begin();
            selectGoal(next);
          }}
          onReplay={() => {
            close();
            setLogOpen(false);
            setStarted(false);
            setReplayingArrival(true);
            setLessonOpen(false);
          }}
        />
      )}
      {travel && (
        <CommandDialog
          title={nb.orientation.travelTitle}
          restoreFocus={restoreFocus}
          onClose={() => {
            setTravel(null);
            queueMicrotask(restoreFocus);
          }}
        >
          <h3>{nb.orientation.steps[travel].title}</h3>
          <p>{nb.orientation.steps[travel].why}</p>
          <p>{nb.orientation.travelHint}</p>
          {travel === 'foundations' && <p>{nb.orientation.moduleBrief}</p>}
          <div className="travel-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                if (mode !== 'webgl') setSemanticPlace(goalPlaces[travel]);
                setTravel(null);
                queueMicrotask(restoreFocus);
              }}
            >
              {nb.orientation.manual}
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                const chosen = travel;
                setTravel(null);
                navigate(goalPlaces[chosen], true);
                if (chosen === 'foundations') {
                  if (mode !== 'webgl' || runtime.near === 'installation') {
                    runtime.converse('installation');
                    setLessonOpen(true);
                  } else setLessonPending(true);
                }
              }}
            >
              {nb.orientation.assisted}
            </button>
          </div>
        </CommandDialog>
      )}
      {started && !node && !lessonOpen && mode === 'webgl' && (
        <>
          <button
            type="button"
            className="rpg-interact"
            ref={interactButton}
            disabled={!active || entering}
            onClick={interact}
          >
            <kbd>E</kbd>
            <MessageCircle size={17} />
            {active
              ? `${active === 'guide' || active === 'engineer' ? t.talk : t.use} ${t.places[active]}`
              : t.approach}
          </button>
          <div className="rpg-dpad" role="group" aria-label={t.move}>
            {(
              [
                { id: 'forward', label: t.forward, icon: ArrowUp },
                { id: 'left', label: t.left, icon: ArrowLeft },
                { id: 'back', label: t.back, icon: ArrowDown },
                { id: 'right', label: t.right, icon: ArrowRight },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`direction-${id}`}
                aria-label={label}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setAssisting(false);
                  setLessonPending(false);
                  runtime.keys.add(id);
                }}
                onPointerUp={() => runtime.keys.delete(id)}
                onPointerCancel={() => runtime.keys.delete(id)}
                onLostPointerCapture={() => runtime.keys.delete(id)}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                    runtime.keys.add(id);
                  }
                }}
                onKeyUp={() => runtime.keys.delete(id)}
                onBlur={() => runtime.keys.delete(id)}
              >
                <Icon size={21} />
              </button>
            ))}
          </div>
          <span className="rpg-control-hint">{t.controls}</span>
        </>
      )}
      {entering && (
        <div className="rpg-portal-transition" role="status">
          {t.portalActivating}
        </div>
      )}
      {node && (
        <CinematicDialogue
          node={node}
          model={facts.model}
          facts={facts}
          runtime={runtime}
          onChoose={choose}
          onModel={(model) => store.event({ kind: 'model', model })}
          onClose={close}
          restoreFocus={restoreFocus}
          onFoundations={foundations}
          recommendFoundations={expedition.recommended === 'foundations'}
          onLog={() => setLogOpen(true)}
          onDirectEntry={active === 'portal' ? enterWorld : undefined}
        />
      )}
      {lessonOpen && (
        <FoundationsSession
          runtime={runtime}
          onProject={project}
          initialUnit={
            expedition.lesson.observations[expedition.lastUnit ?? expedition.nextUnit].guided
              ? expedition.nextUnit
              : (expedition.lastUnit ?? expedition.nextUnit)
          }
          onLog={() => setLogOpen(true)}
          onClose={() => {
            setLessonOpen(false);
            if (expedition.lesson.guidedComplete) orientationState.store.update({ goal: null });
            runtime.converse(null);
            queueMicrotask(restoreFocus);
          }}
        />
      )}
      {settings && (
        <CommandDialog title={t.settings} onClose={() => setSettings(false)}>
          <div className="rpg-settings">
            <label>
              {t.quality}
              <select
                value={save.quality}
                onChange={(event) => store.quality(event.target.value as typeof save.quality)}
              >
                {(['auto', 'low', 'high'] as const).map((q) => (
                  <option key={q} value={q}>
                    {t.qualities[q]}
                  </option>
                ))}
              </select>
            </label>
            <p>{t.motion}</p>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                runtime.stop();
                setMode(mode === 'webgl' ? 'semantic' : 'webgl');
                setSettings(false);
              }}
            >
              {mode === 'webgl' ? t.semantic : t.spatial}
            </button>
            {mode === 'failed' && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => location.reload()}
              >
                {t.retry}
              </button>
            )}
            <details>
              <summary>{t.metrics}</summary>
              <p>{t.metricsHint}</p>
              <output data-testid="render-measurement" aria-live="off">
                {t.fps}: {metrics.fps.toFixed(1)} · p95: {metrics.p95.toFixed(1)} ms · {t.calls}:{' '}
                {metrics.calls} · {t.triangles}: {metrics.triangles} · {t.samples}: {metrics.frames}
              </output>
            </details>
            <button
              type="button"
              onClick={() => {
                setSettings(false);
                setLogOpen(true);
              }}
            >
              {nb.orientation.log}
            </button>
          </div>
        </CommandDialog>
      )}
    </section>
  );
}
