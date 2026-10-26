'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Fingerprint,
  GraduationCap,
  Sparkles,
  Trash2,
  Trophy,
} from 'lucide-react';
import { nb } from '@/content/nb';
import { totalXp } from '@/domain/progression';
import { useProgress } from '@/components/progress-provider';

export default function ProgressPage() {
  const { progress, ready, clear } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const t = nb.progress;
  return (
    <div className="page progress-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow blue">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="page-intro">{t.intro}</p>
        </div>
      </div>
      <div className="progress-grid">
        <article className="progress-card xp-card">
          <Sparkles size={24} />
          <p>{t.xp}</p>
          <strong className="xp-value">
            {ready ? totalXp(progress) : '—'}
            <span> / 120 XP</span>
          </strong>
          <div className="xp-track">
            <span style={{ width: `${(totalXp(progress) / 120) * 100}%` }} />
          </div>
          <small>{t.xpText}</small>
        </article>
        <article className="progress-card">
          <Award size={24} />
          <h2>{t.mastery}</h2>
          <strong>{t.masteryValue}</strong>
          <p>{t.masteryText}</p>
        </article>
        <article className="progress-card">
          <GraduationCap size={26} />
          <h2>{t.readiness}</h2>
          <strong>{t.readinessValue}</strong>
          <p>{t.readinessText}</p>
        </article>
      </div>
      <section className="milestones">
        <h2>{t.history}</h2>
        {!ready ? (
          <p role="status">{nb.shell.loading}</p>
        ) : progress.completed.length === 0 ? (
          <div className="empty-milestones">
            <span>
              <Trophy size={32} />
            </span>
            <h3>{t.empty}</h3>
            <p>{t.emptyText}</p>
            <Link href="/learn" className="button button-dark">
              {t.continue}
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="milestone-list">
            {progress.completed.map((id) => (
              <div key={id}>
                <CheckCircle2 size={24} />
                <span>
                  <small>{t.historical}</small>
                  <strong>{id === 'organization-mission-v1' ? t.mission : t.assessment}</strong>
                </span>
                <span className="xp-pill">+{id === 'organization-mission-v1' ? 80 : 40} XP</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="cert-note">
        <GraduationCap size={29} />
        <div>
          <h2>{t.certification}</h2>
          <p>{t.certText}</p>
          <div className="tag-row">
            <span>AZ-900</span>
            <span>AZ-104 · {t.planned}</span>
            <span>AZ-305 · {t.planned}</span>
          </div>
        </div>
      </div>
      <section className="privacy-note">
        <Fingerprint size={25} />
        <div>
          <h2>{t.privacy}</h2>
          <p>{t.privacyText}</p>
          {confirming ? (
            <div className="clear-confirmation">
              <p>{t.confirmText}</p>
              <button
                type="button"
                className="button button-danger"
                onClick={() => {
                  clear();
                  setConfirming(false);
                  setCleared(true);
                }}
              >
                {t.confirm}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setConfirming(false)}
              >
                {t.cancel}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="delete-progress"
              disabled={!ready}
              onClick={() => setConfirming(true)}
            >
              <Trash2 size={14} />
              {t.reset}
            </button>
          )}
          {cleared && <p role="status">{t.resetDone}</p>}
        </div>
      </section>
    </div>
  );
}
