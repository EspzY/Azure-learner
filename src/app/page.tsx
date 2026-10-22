import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  Compass,
  Network,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { nb } from '@/content/nb';
import { ArchitectureArt } from '@/components/architecture-art';

export default function Dashboard() {
  const t = nb.dashboard;
  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{nb.shell.workspace}</p>
          <h1>{nb.nav[0].label}</h1>
        </div>
        <span className="edition">
          <span />
          {nb.shell.level}
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow mint">
            <span className="hero-dash" />
            {t.eyebrow}
          </p>
          <h2>
            {t.title.split('\n').map((line, i) => (
              <span key={line} className={i === 1 ? 'hero-emphasis' : ''}>
                {line}
                <br />
              </span>
            ))}
          </h2>
          <p className="hero-description">{t.intro}</p>
          <div className="hero-actions">
            <Link href="/explore" className="button button-mint">
              {t.cta}
              <ArrowRight size={18} />
            </Link>
            <Link href="/missions" className="hero-secondary">
              {t.secondary}
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="hero-footnote">
            <Check size={14} />
            {nb.mission.simulationNote}
          </div>
        </div>
        <ArchitectureArt />
      </section>
      <div className="quick-stats">
        {[
          { icon: Rocket, value: '01', label: t.stat1 },
          { icon: Compass, value: '01', label: t.stat2 },
          { icon: Sparkles, value: '120', label: t.stat3 },
        ].map(({ icon: Icon, value, label }) => (
          <div className="quick-stat" key={label}>
            <span className="stat-icon">
              <Icon size={20} />
            </span>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <h2>{t.section}</h2>
          <p>{t.sectionSub}</p>
        </div>
        <span className="small-label">AZURELAB / 001</span>
      </div>
      <div className="learning-grid">
        <article className="module-card">
          <div className="module-illustration">
            <div className="module-grid" />
            <Network size={72} strokeWidth={1} />
            <span className="illustration-tag">TENANT → RESOURCE</span>
          </div>
          <div className="module-content">
            <p className="eyebrow blue">{t.module}</p>
            <h3>{t.moduleTitle}</h3>
            <p>{t.moduleText}</p>
            <div className="tag-row">
              {t.moduleTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link href="/explore" className="text-link">
              {t.continue}
              <ArrowRight size={17} />
            </Link>
          </div>
        </article>
        <article className="mission-preview">
          <div className="card-icon">
            <Rocket size={22} />
          </div>
          <p className="eyebrow">{nb.mission.eyebrow}</p>
          <h3>{t.missionTitle}</h3>
          <p>{t.missionText}</p>
          <Link href="/missions" className="text-link">
            {t.missionCta}
            <ArrowRight size={17} />
          </Link>
          <span className="mission-reward">+120 XP</span>
        </article>
      </div>
      <div className="next-strip">
        <span className="next-icon">
          <Blocks size={25} />
        </span>
        <div>
          <p className="eyebrow">{t.next}</p>
          <h3>{t.future}</h3>
          <p>{t.futureText}</p>
        </div>
        <span className="badge">{t.preview}</span>
      </div>
      <div className="philosophy">
        <span>✦</span>
        <strong>{t.philosophy}</strong>
        <p>{t.philosophyText}</p>
      </div>
    </div>
  );
}
