'use client';
import { useState } from 'react';
import { nb } from '@/content/nb';
import {
  layers,
  responsibility,
  type Layer,
  type ServiceModel,
} from '@/domain/curriculum/responsibility';
import { usePortalLearning } from './learning-provider';
import { SavvyShark } from '@/features/course/savvy-shark';
const p = nb.portal,
  r = p.responsibility;
export function ResponsibilityExplorer({
  initialModel = 'paas',
  guide = false,
  context = 'reference',
  onCompare,
}: {
  initialModel?: ServiceModel;
  guide?: boolean;
  context?: 'foundations' | 'reference' | 'service-v1' | 'services-v2';
  onCompare?: (model: ServiceModel) => void;
}) {
  const [model, setModel] = useState<ServiceModel>(initialModel),
    [previous, setPrevious] = useState<ServiceModel>(initialModel),
    [layer, setLayer] = useState<Layer | 'virtualization'>('os');
  const { store } = usePortalLearning();
  const compare = (m: ServiceModel) => {
    setPrevious(model);
    setModel(m);
    if (context === 'service-v1') store.event({ kind: 'compare', model: m });
    if (context === 'services-v2') onCompare?.(m);
  };
  const all = ['physical', 'virtualization', ...layers.filter((l) => l !== 'physical')] as const;
  const owner = (l: Layer | 'virtualization', m: ServiceModel = model) =>
    l === 'virtualization' ? 'microsoft' : responsibility(m, l);
  const label = (l: Layer | 'virtualization') =>
    l === 'virtualization'
      ? r.virtualization
      : l === 'network'
        ? r.networkLabel
        : nb.learningResponsibility.layers[l].label;
  const changed = all.filter((l) => owner(l, previous) !== owner(l));
  return (
    <section className="portal-responsibility" aria-label={r.title}>
      <div className="portal-model-choice">
        {(['iaas', 'paas', 'saas'] as const).map((m) => (
          <button
            type="button"
            key={m}
            aria-pressed={model === m}
            onClick={() => {
              compare(m);
            }}
          >
            <strong>{m.toUpperCase()}</strong>
            <span>{r.examples[m]}</span>
          </button>
        ))}
      </div>
      <p>{r.intro}</p>
      <p className="responsibility-instruction">{nb.refinement.responsibilityPrompt}</p>
      <div className="portal-stack-layout">
        <div className="portal-layer-stack">
          {all.map((l) => (
            <button
              type="button"
              key={l}
              className={`owner-${owner(l)}`}
              data-changed={changed.includes(l)}
              aria-pressed={l === layer}
              onClick={() => {
                setLayer(l);
                if (context === 'service-v1') store.event({ kind: 'aid' });
              }}
            >
              <span>
                {l === 'virtualization'
                  ? r.virtualization
                  : l === 'network'
                    ? r.networkLabel
                    : nb.learningResponsibility.layers[l].label}
              </span>
              <strong>{r[owner(l)]}</strong>
            </button>
          ))}
        </div>
        <aside className="portal-layer-inspector">
          <small>
            {nb.refinement.selectedLayer} · {model.toUpperCase()}
          </small>
          <h3>
            {layer === 'virtualization'
              ? r.virtualization
              : layer === 'network'
                ? r.networkLabel
                : nb.learningResponsibility.layers[layer].label}
          </h3>
          <p className={`portal-owner owner-${owner(layer)}`}>{r[owner(layer)]}</p>
          <p>{layer === 'virtualization' ? r.virtualizationNote : r.notes[layer]}</p>
          <div
            className="responsibility-comparison"
            role="group"
            aria-label={nb.refinement.comparison}
          >
            {(['iaas', 'paas', 'saas'] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={model === m}
                onClick={() => {
                  compare(m);
                }}
              >
                <strong>{m.toUpperCase()}</strong>
                <span>{r[owner(layer, m)]}</span>
              </button>
            ))}
          </div>
          {guide && (
            <SavvyShark compact>
              <p>{nb.course.modelGuide[model]}</p>
            </SavvyShark>
          )}
          <p className="responsibility-changes" role="status">
            <strong>{nb.refinement.changes}: </strong>
            {previous === model ? (
              r.examples[model]
            ) : (
              <>
                {previous.toUpperCase()} → {model.toUpperCase()} ·{' '}
                {changed.length ? changed.map(label).join(', ') : nb.refinement.unchanged}
              </>
            )}
          </p>
        </aside>
      </div>
      <section className="responsibility-context" aria-label={nb.refinement.serviceNuance}>
        <h4>
          {nb.refinement.serviceNuance} · {r.examples[model]}
        </h4>
        <div>
          <p>{nb.learningResponsibility.modelNotes[model]}</p>
          <p>{p.lesson.sections[model].limits}</p>
        </div>
      </section>
    </section>
  );
}
