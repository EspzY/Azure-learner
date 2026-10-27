'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { nb } from '@/content/nb';
import { totalXp } from '@/domain/progression';
import { navIcons } from './icons';
import { useProgress } from './progress-provider';
import { useLearning } from '@/features/learning/provider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress, ready } = useProgress();
  const { openJournal } = useLearning();
  const serverless = useServerless(),
    physical = usePhysical();
  const active = nb.nav.find((item) => item.href === pathname);
  if (
    pathname.startsWith('/labs/') ||
    pathname === '/portal' ||
    pathname === '/learn' ||
    pathname.startsWith('/learn/')
  )
    return <>{children}</>;
  return (
    <div className="app-shell">
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
              aria-label={nb.foundations.journal}
              title={nb.foundations.journal}
              onClick={() => {
                if (serverless.facts.active) serverless.store.event({ kind: 'aid' });
                if (physical.facts.active) physical.store.event({ kind: 'aid' });
                openJournal();
              }}
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
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>{nb.shell.footer}</span>
          <span>
            {nb.shell.phase} · {nb.shell.safe}
          </span>
        </footer>
      </div>
    </div>
  );
}
import { usePhysical } from '@/features/learning/physical-provider';
import { useServerless } from '@/features/learning/serverless-provider';
