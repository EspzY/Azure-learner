'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  LockKeyhole,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { nb } from '@/content/nb';
import { useProgress } from '@/components/progress-provider';

export default function MissionsPage() {
  const { progress } = useProgress();
  const finished = progress.completed.includes('organization-mission-v1');
  const t = nb.mission;
  return (
    <div className="page missions-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow blue">{nb.shell.path}</p>
          <h1>{nb.nav[2].label}</h1>
          <p className="page-intro">{t.objective}</p>
        </div>
      </div>
      <article className="mission-detail">
        <div className="mission-detail-banner">
          <Rocket size={70} strokeWidth={1} />
          <span>AZURELAB / MISSION 001</span>
        </div>
        <div className="mission-detail-content">
          <div className="mission-meta">
            <span className="eyebrow blue">{t.eyebrow}</span>
            <span className={`badge ${finished ? 'badge-success' : ''}`}>
              {finished ? <CheckCircle2 size={13} /> : <Flag size={13} />}
              {finished ? t.completed : t.active}
            </span>
          </div>
          <h2>{t.title}</h2>
          <p>{t.intro}</p>
          <div className="mission-facts">
            <span>
              <Clock3 size={16} />
              {t.time}
            </span>
            <span>
              <Sparkles size={16} />
              {t.reward}
            </span>
            <span>{t.level}</span>
          </div>
          <div className="mission-context">
            <h3>{t.context}</h3>
            <p>{t.instructions}</p>
          </div>
          <ol className="mission-steps">
            {t.steps.map((step, index) => (
              <li key={step}>
                <span>0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <Link href="/explore?mission=organization" className="button button-dark">
            {t.open}
            <ArrowRight size={18} />
          </Link>
          <p className="form-disclaimer">{t.simulationNote}</p>
        </div>
      </article>
      <div className="future-mission">
        <LockKeyhole size={24} />
        <div>
          <span className="badge">{nb.dashboard.preview}</span>
          <h2>{t.futureTitle}</h2>
          <p>{t.futureText}</p>
        </div>
      </div>
    </div>
  );
}
