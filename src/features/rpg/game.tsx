'use client';
import Link from 'next/link';
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
  X,
} from 'lucide-react';
import { nb } from '@/content/nb';
import { currentStage } from '@/domain/chapter01/scenario';
import { dialogue, entryNode, storyFacts, type Choice, type NodeId } from '@/domain/rpg/story';
import { gatewayReturn, places, type PlaceId } from '@/domain/rpg/world';
import { useChapter } from '@/features/chapter01/provider';
import { CommandDialog } from '@/components/command-dialog';
import { useProgress } from '@/components/progress-provider';
import { totalXp } from '@/domain/progression';
import { useGame } from './game-provider';
import { PlayerRuntime } from './runtime';
import { CinematicDialogue } from './cinematic-dialogue';
import { conversationShot } from './cinematics';

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
  const [runtime] = useState(
    () => new PlayerRuntime(save.returnPending ? gatewayReturn : save.pose),
  );
  const [near, setNear] = useState<PlaceId | null>(null);
  const [mode, setMode] = useState<'webgl' | 'semantic' | 'failed'>('webgl');
  const [semanticPlace, setSemanticPlace] = useState<PlaceId>('guide');
  const [started, setStarted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const restored = useRef(false);
  const sceneLoaded = useCallback(() => setSceneReady(true), []);
  const [node, setNode] = useState<NodeId | null>(null);
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
    hasWork: attempt.engine.world.revision > 0,
  };
  const facts = storyFacts(save, technical);
  const active = mode === 'webgl' ? near : semanticPlace;
  const interactRef = useRef<() => void>(() => {});
  const savePosition = useCallback(() => {
    store.position(runtime.pose);
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
      !started || !!node || settings || confirmReset || !visible || entering || mode !== 'webgl',
    );
  }, [runtime, started, node, settings, confirmReset, visible, entering, mode]);
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
        settings ||
        confirmReset ||
        !started
      )
        return;
      if (event.code === 'Escape') {
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
  }, [runtime, node, settings, confirmReset, started, mode]);
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
    runtime.direct(node ? conversationShot(node, dialogue[node].speaker) : null);
  }, [node, runtime]);
  const restoreFocus = useCallback(() => {
    if (runtime.route.length) viewport.current?.focus();
    else if (interactButton.current && !interactButton.current.disabled)
      interactButton.current.focus();
    else viewport.current?.focus();
  }, [runtime]);
  function close() {
    runtime.converse(null);
    setNode(null);
  }
  function navigate(id: PlaceId) {
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
    runtime.converse(target);
    setNode(entryNode(target, store.getSnapshot().save, technical));
    if (target === 'guide' || target === 'engineer') store.event({ kind: 'meet', npc: target });
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
      close();
      navigate('installation');
      return;
    }
    if (choice.action === 'enter') {
      if (!facts.canEnter || !store.portal()) return;
      runtime.activateGate();
      setEntering(true);
      close();
      // Presentation delay only; eligibility and persistence precede this transition.
      transitionTimer.current = setTimeout(
        () => router.push('/explore?chapter=01&from=rpg-g1'),
        reduced ? 0 : 650,
      );
      return;
    }
    if (choice.next) setNode(choice.next);
  }
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
      data-dialogue={node ?? ''}
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
              onNear={setNear}
              onSave={savePosition}
              onFailure={failure}
              onReady={sceneLoaded}
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
                  onClick={() => setSemanticPlace(id)}
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
          <Link href="/" aria-label={t.exit}>
            <X size={19} />
          </Link>
        </div>
      </header>
      {started && !node && (
        <aside className="rpg-quest" aria-label={t.questLabel}>
          <small>{t.questLabel}</small>
          <strong>{t.quest}</strong>
          <p>{t.objectives[objective]}</p>
          <span>{t.guided}</span>
        </aside>
      )}
      {issue && (
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
      {!started && (
        <div className="rpg-arrival">
          <p className="eyebrow">{t.subtitle}</p>
          <h2>{t.welcome}</h2>
          <p>{t.welcomeText}</p>
          <button
            type="button"
            className="button button-primary"
            disabled={!ready || (mode === 'webgl' && !sceneReady)}
            onClick={() => {
              setStarted(true);
              viewport.current?.focus();
            }}
          >
            {mode === 'webgl' && !sceneReady ? t.loading : t.begin}
            <ArrowRight size={17} />
          </button>
          <small>{t.controls}</small>
          <small>{t.loadHint}</small>
        </div>
      )}
      {started && !node && mode === 'webgl' && (
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
            <Link href="/">{t.exit}</Link>
          </div>
        </CommandDialog>
      )}
    </section>
  );
}
