'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronRight, FlaskConical, Leaf, ShieldCheck } from 'lucide-react';
import { nb } from '@/content/nb';
import { totalXp } from '@/domain/progression';
import { navIcons } from './icons';
import { useProgress } from './progress-provider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress, ready } = useProgress();
  const active = nb.nav.find((item) => item.href === pathname);
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        {nb.shell.skip}
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label={nb.brand}>
          <span className="brand-mark">
            <FlaskConical size={23} strokeWidth={2.3} />
          </span>
          Azure<span className="brand-light">Lab</span>
          <span className="brand-dot" />
        </Link>
        <div className="nav-label">{nb.shell.workspace}</div>
        <nav aria-label={nb.shell.workspace}>
          {nb.nav.map((item) => {
            const Icon = navIcons[item.icon]!;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {pathname === item.href && <ChevronRight size={15} />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-path">
          <span className="tiny-label">{nb.shell.pathTag}</span>
          <div>
            <span className="path-symbol">
              <Leaf size={17} />
            </span>
            {nb.shell.path}
          </div>
          <div className="path-track">
            <span style={{ width: `${(progress.completed.length / 2) * 100}%` }} />
          </div>
          <span className="path-caption">
            {ready ? totalXp(progress) : '—'} / 120 {nb.shell.xp}
          </span>
        </div>
        <div className="sidebar-bottom">
          <div className="safe-icon">
            <ShieldCheck size={20} />
          </div>
          <strong>{nb.shell.local}</strong>
          <p>{nb.shell.safe}</p>
          <span className="version">
            v0.1 <ArrowUpRight size={12} />
          </span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <span>{nb.brand}</span>
            <ChevronRight size={14} />
            <strong>{active?.label ?? nb.brand}</strong>
          </div>
          <div className="topbar-right">
            <span className="environment">
              <i />
              {nb.shell.simulation}
            </span>
            <span className="xp-pill">
              ✦ {ready ? totalXp(progress) : '—'} {nb.shell.xp}
            </span>
            <span className="avatar" title={nb.shell.guest}>
              AL
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>{nb.shell.footer}</span>
          <span>
            {nb.shell.phase} <i /> {nb.shell.local}
          </span>
        </footer>
      </div>
    </div>
  );
}
