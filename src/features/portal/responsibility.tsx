'use client';
import { useState } from 'react';
import { nb } from '@/content/nb';
import { layers, responsibility, type Layer, type ServiceModel } from '@/domain/expedition';
import { usePortalLearning } from './learning-provider';
import { SavvyShark } from '@/features/course/savvy-shark';
const p = nb.portal,
  r = p.responsibility;
export function ResponsibilityExplorer({
  initialModel = 'paas',
  guide = false,
}: {
  initialModel?: ServiceModel;
  guide?: boolean;
}) {
  const [model, setModel] = useState<ServiceModel>(initialModel),
    [layer, setLayer] = useState<Layer | 'virtualization'>('os');
  const { store } = usePortalLearning();
  const all = ['physical', 'virtualization', ...layers.filter((l) => l !== 'physical')] as const;
  const owner = (l: Layer | 'virtualization') =>
    l === 'virtualization' ? 'microsoft' : responsibility(model, l);
  return (
    <section className="portal-responsibility" aria-label={r.title}>
      <div className="portal-model-choice">
        {(['iaas', 'paas', 'saas'] as const).map((m) => (
          <button
            type="button"
            key={m}
            aria-pressed={model === m}
            onClick={() => {
              setModel(m);
              store.event({ kind: 'compare', model: m });
            }}
          >
            <strong>{m.toUpperCase()}</strong>
            <span>{r.examples[m]}</span>
          </button>
        ))}
      </div>
      <p>{r.intro}</p>
      {guide && (
        <SavvyShark compact>
          <p aria-live="polite">{nb.course.modelGuide[model]}</p>
        </SavvyShark>
      )}
      <div className="portal-stack-layout">
        <div className="portal-layer-stack">
          {all.map((l) => (
            <button
              type="button"
              key={l}
              className={`owner-${owner(l)}`}
              aria-pressed={l === layer}
              onClick={() => {
                setLayer(l);
                store.event({ kind: 'aid' });
              }}
            >
              <span>
                {l === 'virtualization'
                  ? r.virtualization
                  : l === 'network'
                    ? r.networkLabel
                    : nb.expedition.layers[l].label}
              </span>
              <strong>{r[owner(l)]}</strong>
            </button>
          ))}
        </div>
        <aside className="portal-layer-inspector">
          <small>{r.examples[model]}</small>
          <h3>
            {layer === 'virtualization'
              ? r.virtualization
              : layer === 'network'
                ? r.networkLabel
                : nb.expedition.layers[layer].label}
          </h3>
          <p className={`portal-owner owner-${owner(layer)}`}>{r[owner(layer)]}</p>
          <p>{layer === 'virtualization' ? r.virtualizationNote : r.notes[layer]}</p>
          <p>{nb.rpg.modelNotes[model]}</p>
          <p>{p.lesson.sections[model].limits}</p>
        </aside>
      </div>
    </section>
  );
}
