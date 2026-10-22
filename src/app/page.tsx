'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CircleDot,
  Crosshair,
  LockKeyhole,
  Play,
  Radio,
  Sparkles,
} from 'lucide-react';
import { nb } from '@/content/nb';
import { useProgress } from '@/components/progress-provider';
import { initialSimulation } from '@/domain/simulation';
import { totalXp } from '@/domain/progression';
import { SpatialScene } from '@/features/organization/spatial-scene';

export default function MissionHub() {
  const { progress, ready } = useProgress();
  const complete = progress.completed.includes('organization-mission-v1');
  const t = nb.hub;
  return (
    <div className="mission-hub">
      <div className="hub-intro">
        <p className="eyebrow">
          <Radio size={13} />
          {t.eyebrow}
        </p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>
      <div className="hub-world">
        <SpatialScene scopes={initialSimulation.scopes} selected={null} preview />
        <div className="hub-world-caption">
          <span className="live-dot" />
          {t.sceneCaption}
        </div>
        <div className="hub-world-coordinate" aria-hidden="true">
          01 — 08
          <br />
          AZ / RESOURCE ORGANIZATION
        </div>
      </div>
      <section className="hub-mission" aria-labelledby="hub-mission-title">
        <div className="hub-mission-id">
          <span>01</span>
          <span>{nb.universe.missionReady}</span>
          <Crosshair size={20} />
        </div>
        <p className="mission-availability">
          <i />
          {complete ? t.complete : t.active}
        </p>
        <h2 id="hub-mission-title">{nb.mission.title}</h2>
        <p className="hub-mission-description">{t.missionText}</p>
        <div className="hub-mission-target">
          <span className="tiny-label">{t.next}</span>
          <strong>{nb.universe.targetSubscription}</strong>
          <span>
            {nb.universe.targetName} <ArrowRight size={12} />
            {nb.universe.targetRegion}
          </span>
        </div>
        <Link href="/explore?mission=organization" className="button button-primary launch-button">
          <Play size={16} />
          {complete ? t.continue : t.enter}
          <ArrowRight size={18} />
        </Link>
        <div className="hub-mission-meta">
          <span>{t.duration}</span>
          <span>
            <Sparkles size={12} />
            80 + 40 XP
          </span>
        </div>
        <Link href="/explore" className="free-explore">
          {nb.dashboard.continue}
          <ArrowRight size={14} />
        </Link>
      </section>
      <div className="hub-journey">
        <div className="journey-heading">
          <p className="eyebrow">{t.journey}</p>
          <span>{ready ? totalXp(progress) : '—'} / 120 XP</span>
        </div>
        <div className="journey-line">
          <div className="journey-active">
            <span className="journey-marker">
              {complete ? <Check size={17} /> : <CircleDot size={18} />}
            </span>
            <div>
              <small>01 / AZ-900</small>
              <strong>{t.current}</strong>
            </div>
          </div>
          <span className="journey-connector" />
          <div className="journey-future">
            <LockKeyhole size={16} />
            <div>
              <small>{t.planned}</small>
              <strong>{t.future}</strong>
            </div>
          </div>
          <Link href="/progress" className="journey-progress">
            <span>
              {progress.completed.length}
              <small> / 2</small>
            </span>
            <small>{t.milestone}</small>
            <ArrowRight size={16} />
          </Link>
        </div>
        <p className="journey-note">{t.pathHint}</p>
      </div>
    </div>
  );
}
