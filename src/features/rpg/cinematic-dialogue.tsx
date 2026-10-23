'use client';
import './cinematic-dialogue.css';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, X } from 'lucide-react';
import { nb } from '@/content/nb';
import {
  layers,
  responsibility,
  serviceModels,
  type Layer,
  type ServiceModel,
} from '@/domain/expedition';
import { dialogue, type NodeId, type Choice } from '@/domain/rpg/story';
import type { PlayerRuntime } from './runtime';
import { useLearning } from '@/features/learning/provider';

const t = nb.rpg;
export function CinematicDialogue({
  node,
  model,
  facts,
  runtime,
  onChoose,
  onModel,
  onClose,
  restoreFocus,
  onFoundations,
}: {
  node: NodeId;
  model: ServiceModel;
  facts: { compared: boolean; canEnter: boolean; ready: boolean; accepted: boolean };
  runtime: PlayerRuntime;
  onChoose: (choice: Choice) => void;
  onModel: (model: ServiceModel) => void;
  onClose: () => void;
  restoreFocus: () => void;
  onFoundations: () => void;
}) {
  const { openJournal } = useLearning();
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [journal, setJournal] = useState(false);
  const [large, setLarge] = useState(false);
  const [layer, setLayer] = useState<Layer>('os');
  const title = useId(),
    subtitle = useId();
  const speaker = dialogue[node].speaker;
  const spoken = node in t.spoken ? t.spoken[node as keyof typeof t.spoken] : t.dialogue[node];
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => {
      el?.close();
      runtime.inspect(null);
      queueMicrotask(restoreFocus);
    };
    // Keep the native modal/focus lifetime across conversational beats.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dialog.current
      ?.querySelector<HTMLElement>(journal ? '[data-return]' : '[data-choice]:not(:disabled)')
      ?.focus();
  }, [node, journal]);
  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const measure = () => {
      const bounds = el.getBoundingClientRect();
      runtime.safeFrame(bounds.top / window.innerHeight, bounds.left / window.innerWidth);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [runtime]);
  const technical = () => {
    runtime.inspect(layer);
    setJournal(true);
  };
  return (
    <dialog
      ref={dialog}
      className={`cinematic-dialogue ${large ? 'cinematic-large' : ''}`}
      aria-labelledby={title}
      aria-describedby={subtitle}
      onCancel={(e) => {
        e.preventDefault();
        if (journal) {
          setJournal(false);
          runtime.inspect(null);
        } else onClose();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        const controls = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], select'),
        ).filter((el) => el.getClientRects().length > 0);
        if (e.key === 'Tab') {
          const first = controls[0],
            last = controls.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
        const choices = Array.from(
          e.currentTarget.querySelectorAll<HTMLButtonElement>('[data-choice]:not(:disabled)'),
        );
        if (journal || e.altKey || e.ctrlKey || e.metaKey) return;
        const current = choices.indexOf(document.activeElement as HTMLButtonElement);
        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && current >= 0) {
          e.preventDefault();
          choices[
            (current + (e.key === 'ArrowDown' ? 1 : choices.length - 1)) % choices.length
          ]?.focus();
        } else if (/^[1-9]$/.test(e.key) && current >= 0) {
          e.preventDefault();
          choices[Number(e.key) - 1]?.click();
        }
      }}
    >
      <div className="cinematic-topline">
        <span>{speaker === 'system' ? t.cinematic.system : t.cinematic.conversation}</span>
        <div>
          <button
            type="button"
            className="cinematic-type"
            aria-label={t.cinematic.textSize}
            aria-pressed={large}
            onClick={() => setLarge(!large)}
          >
            Aa
          </button>
          <button type="button" aria-label={t.close} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>
      <div
        ref={content}
        className={`cinematic-content rpg-dialogue ${node === 'installation' ? 'cinematic-workshop' : ''}`}
        data-node={node}
        data-speaker={speaker}
      >
        <div className="cinematic-subtitles">
          <h2 id={title}>
            {t.speakers[speaker]}
            <span>{t.roles[speaker]}</span>
          </h2>
          <p className="rpg-dialogue-text" id={subtitle} aria-live="polite" aria-atomic="true">
            {spoken}
          </p>
          {node === 'installation' && (
            <>
              <div className="rpg-models" role="group" aria-label={t.installationTitle}>
                {serviceModels.map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={model === m}
                    onClick={() => onModel(m)}
                  >
                    {nb.expedition.models[m].label}
                  </button>
                ))}
              </div>
              <p className="rpg-model-feedback" role="status">
                {t.modelNotes[model]}
              </p>
            </>
          )}
          <button type="button" className="cinematic-reference" onClick={technical}>
            <BookOpen size={15} />
            {t.detail}
          </button>
        </div>
        {journal ? (
          <section className="cinematic-journal" aria-label={t.cinematic.journal}>
            <button
              type="button"
              data-return
              onClick={() => {
                setJournal(false);
                runtime.inspect(null);
              }}
            >
              <ArrowLeft size={15} />
              {t.cinematic.back}
            </button>
            <h3>{t.cinematic.journal}</h3>
            <p>{t.dialogue[node]}</p>
            <p>{t.mechanism}</p>
            <p>{t.caveat}</p>
            {runtime.conversation === 'installation' && (
              <>
                <label>
                  {t.cinematic.inspect}
                  <select
                    value={layer}
                    onChange={(e) => {
                      const l = e.target.value as Layer;
                      setLayer(l);
                      runtime.inspect(l);
                    }}
                  >
                    {layers.map((l) => (
                      <option key={l} value={l}>
                        {nb.expedition.layers[l].label}
                      </option>
                    ))}
                  </select>
                </label>
                <p>{nb.expedition.layers[layer].detail}</p>
                <p>
                  {t.owners[responsibility(model, layer)]} · {t.cinematic.layerHint}
                </p>
                <dl className="rpg-responsibilities">
                  {layers.map((l) => (
                    <div key={l} data-layer={l} data-owner={responsibility(model, l)}>
                      <dt>{nb.expedition.layers[l].label}</dt>
                      <dd>{t.owners[responsibility(model, l)]}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            <a
              href="https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility"
              target="_blank"
              rel="noreferrer"
            >
              {t.source}
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans"
              target="_blank"
              rel="noreferrer"
            >
              {t.planSource}
              <ArrowUpRight size={14} />
            </a>
          </section>
        ) : (
          <div className="cinematic-responses">
            <p className="cinematic-response-label">{t.cinematic.response}</p>
            <div className="rpg-choices">
              {dialogue[node].choices.map((choice, i) => (
                <button
                  type="button"
                  data-choice
                  key={choice.id}
                  disabled={!!choice.when && !facts[choice.when]}
                  onClick={() => (choice.action === 'reference' ? technical() : onChoose(choice))}
                >
                  <span>{i + 1}</span>
                  {t.choices[choice.id as keyof typeof t.choices]}
                </button>
              ))}
            </div>
            <small>{t.cinematic.instruction}</small>
            {speaker === 'guide' && (
              <button type="button" className="cinematic-reference" onClick={onFoundations}>
                {nb.foundations.launch}
              </button>
            )}
            <button type="button" className="cinematic-reference" onClick={() => openJournal()}>
              {nb.foundations.journal}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
