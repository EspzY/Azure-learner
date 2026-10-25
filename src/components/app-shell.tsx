'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ExpeditionLog } from '@/features/rpg/expedition-log';
import { ChevronRight, ShieldCheck, Sparkles, BookOpen, ScrollText } from 'lucide-react';
import { nb } from '@/content/nb';
import { totalXp } from '@/domain/progression';
import { navIcons } from './icons';
import { useProgress } from './progress-provider';
import { useLearning } from '@/features/learning/provider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [log, setLog] = useState(false);
  const { progress, ready } = useProgress();
  const { openJournal } = useLearning();
  const active = nb.nav.find((item) => item.href === pathname);
  if (pathname === '/design/foundations-31a') return <>{children}</>;
  if (pathname === '/portal' || pathname === '/learn' || pathname.startsWith('/learn/'))
    return <>{children}</>;
  if (pathname === '/legacy/rpg')
    return (
      <div className="game-shell">
        <a href="#main" className="skip-link">
          {nb.shell.skip}
        </a>
        <main id="main">{children}</main>
      </div>
    );
  return (
    <div
      className={`app-shell ${pathname === '/explore' || pathname === '/legacy-expedition' ? 'shell-universe' : ''}`}
    >
      <a href="#main" className="skip-link">
        {nb.shell.skip}
      </a>
      <aside className="nav-rail">
        <Link href="/" className="brand-symbol" aria-label={nb.brand}>
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 4L36 13V30L20 39L4 30V13Z" />
            <path d="M12 28L20 12L28 28M15 23H25" />
          </svg>
        </Link>
        <nav aria-label={nb.shell.workspace}>
          {nb.nav.map((item) => {
            const Icon = navIcons[item.icon]!;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`rail-link ${pathname === item.href ? 'active' : ''}`}
              >
                <Icon size={21} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="rail-bottom" title={nb.shell.safe}>
          <ShieldCheck size={20} />
          <span>{nb.shell.release}</span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <Link className="wordmark" href="/" aria-label={nb.brand}>
            Azure<span>Lab</span>
            <i />
          </Link>
          <span className="header-divider" />
          <div className="breadcrumb">
            <span>{nb.shell.path}</span>
            <ChevronRight size={12} />
            <strong>{active?.label ?? nb.brand}</strong>
          </div>
          <div className="topbar-right">
            <button
              type="button"
              className="button button-secondary shell-action"
              aria-label={nb.orientation.log}
              title={nb.orientation.log}
              onClick={() => setLog(true)}
            >
              <ScrollText size={18} />
              <span className="shell-action-label">{nb.orientation.log}</span>
            </button>
            <button
              type="button"
              className="button button-secondary shell-action"
              aria-label={nb.foundations.journal}
              title={nb.foundations.journal}
              onClick={() => openJournal()}
            >
              <BookOpen size={18} />
              <span className="shell-action-label">{nb.foundations.journal}</span>
            </button>
            <span className="environment">
              <i />
              {nb.shell.simulation}
            </span>
            <span className="xp-pill">
              <Sparkles size={13} />
              {ready ? totalXp(progress) : '—'} XP
            </span>
            <span className="avatar" title={nb.shell.guest}>
              AL
            </span>
          </div>
        </header>
        {log && (
          <ExpeditionLog
            onClose={() => setLog(false)}
            onGoal={(goal) => {
              setLog(false);
              router.push(`/legacy/rpg?goal=${goal}`);
            }}
          />
        )}
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        {pathname !== '/explore' && pathname !== '/legacy-expedition' && (
          <footer className="app-footer">
            <span>{nb.shell.footer}</span>
            <span>
              {nb.shell.phase} · {nb.shell.safe}
            </span>
          </footer>
        )}
      </div>
    </div>
  );
}
