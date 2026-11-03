'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ownerAcceptanceNb as t } from '@/content/nb';
import { useFoundationsV2 } from '@/features/learning/v2-provider';
import { v2Facts } from '@/domain/curriculum/foundations-v2';
import { PortalDialog } from '@/features/portal/shared';

export const v2AssessmentHref = '/learn/computing?topic=v2-assessment';
/** Navigation metadata only: no unmount/reload-based evidence and no other-tab abandonment. */
export function v2ExitIntent(from: URL, to: URL): { assistance: boolean } | null {
  const assessment = (u: URL) =>
    u.pathname === '/learn/computing' && u.searchParams.get('topic') === 'v2-assessment';
  if (
    from.origin !== to.origin ||
    !assessment(from) ||
    assessment(to) ||
    !/^\/(?:$|learn(?:\/|$)|portal$|labs\/saas$|missions(?:\/|$)|progress$)/.test(to.pathname)
  )
    return null;
  // Neutral catalogue/raw resource inspection is not answer-bearing teaching.
  const assistance =
    to.pathname.startsWith('/learn/') ||
    to.pathname === '/labs/saas' ||
    to.pathname.startsWith('/missions') ||
    to.pathname === '/progress' ||
    (to.pathname === '/portal' &&
      (['lab', 'practice', 'mission', 'compute', 'networking'].some((k) =>
        to.searchParams.has(k),
      ) ||
        ['learn', 'hierarchy', 'responsibility', 'policy'].includes(
          to.searchParams.get('area') ?? '',
        )));
  return { assistance };
}
type NavigateEvent = Event & { navigationType: string; destination: { url: string } };
type Navigation = EventTarget;

export function AssessmentNavigationExit() {
  const { store } = useFoundationsV2();
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const navigation = (window as Window & { navigation?: Navigation }).navigation;
    // Ephemeral ownership of THIS document's open assessment, never another tab.
    // popstate may arrive after the URL has already changed; it is not an unmount.
    let ownsAssessment = false;
    const remember = () => {
      const view = store.getSnapshot();
      if (!v2Facts(view.save).active) ownsAssessment = false;
      else if (
        location.pathname === '/learn/computing' &&
        new URL(location.href).searchParams.get('topic') === 'v2-assessment'
      )
        ownsAssessment = true;
    };
    remember();
    const unsubscribe = store.subscribe(remember);
    const source = () =>
      ownsAssessment ? new URL(v2AssessmentHref, location.origin).href : location.href;
    const leave = (from: string, to: string) => {
      const intent = v2ExitIntent(new URL(from), new URL(to));
      if (!intent) return true;
      const view = store.getSnapshot();
      if (!view.ready || (view.issue && view.issue !== 'limit')) {
        setBlocked(true);
        return false;
      }
      if (!v2Facts(view.save).active) return true;
      const ok = store.leaveForNavigation(
        view.save.events.findLastIndex((e) => e.kind === 'begin'),
        intent.assistance,
      );
      if (!ok) setBlocked(true);
      return ok;
    };
    const onNavigate = (raw: Event) => {
      const event = raw as NavigateEvent;
      if (event.navigationType === 'reload') return;
      if (!leave(source(), event.destination.url) && event.cancelable) event.preventDefault();
    };
    // Native navigate observes actual push/replace/traverse intent, including Next router.push.
    if (navigation) {
      navigation.addEventListener('navigate', onNavigate);
      return () => {
        navigation.removeEventListener('navigate', onNavigate);
        unsubscribe();
      };
    }
    // Progressive fallback: explicit same-tab links, plus browser traversal. A failed
    // noncancelable traversal leaves the store uncertain and teaching boundaries closed.
    const originalPush = history.pushState,
      originalReplace = history.replaceState;
    const wrap = (original: typeof history.pushState) =>
      function (this: History, data: unknown, unused: string, url?: string | URL | null) {
        if (url && !leave(location.href, new URL(url, location.href).href)) return;
        original.call(this, data, unused, url);
      };
    const push = wrap(originalPush),
      replace = wrap(originalReplace);
    history.pushState = push;
    history.replaceState = replace;
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (
        !anchor ||
        event.defaultPrevented ||
        event.button ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.download ||
        (anchor.target && anchor.target !== '_self')
      )
        return;
      if (!leave(location.href, anchor.href)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const onPop = () => {
      leave(source(), location.href);
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPop, true);
    return () => {
      unsubscribe();
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPop, true);
      if (history.pushState === push) history.pushState = originalPush;
      if (history.replaceState === replace) history.replaceState = originalReplace;
    };
  }, [store]);
  if (!blocked) return null;
  return (
    <PortalDialog title={t.leaveFailedTitle} onClose={() => setBlocked(false)}>
      <p role="alert">{t.leaveFailed}</p>
      <button
        type="button"
        onClick={() => {
          store.load();
          if (!store.getSnapshot().issue) setBlocked(false);
        }}
      >
        {t.reload}
      </button>
      <p>
        <Link href={v2AssessmentHref}>{t.returnAssessment}</Link>
      </p>
    </PortalDialog>
  );
}
