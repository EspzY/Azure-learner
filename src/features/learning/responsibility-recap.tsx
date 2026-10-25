'use client';
import { useState } from 'react';
import Link from 'next/link';
import { nb } from '@/content/nb';
import { responsibility } from '@/domain/expedition';
export function ResponsibilityRecap() {
  const [task, setTask] = useState<'physical' | 'data' | 'identity'>('physical');
  const c = nb.expansion.common,
    r = nb.portal.responsibility;
  return (
    <section className="portal-responsibility" aria-label={c.beginnerRecap}>
      <h3>{c.beginnerRecap}</h3>
      <p>{c.recapNote}</p>
      <div className="portal-model-choice">
        {c.recapCases.map(([id, label]) => (
          <button key={id} aria-pressed={task === id} onClick={() => setTask(id as typeof task)}>
            {label}
          </button>
        ))}
      </div>
      <div className="expanded-causal" role="status">
        <strong>{r[responsibility('paas', task)]}</strong>
        <p>{r.notes[task]}</p>
      </div>
      <Link href="/learn/services?topic=overview">{c.recapDeep}</Link>
    </section>
  );
}
