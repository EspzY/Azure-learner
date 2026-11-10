'use client';
import { useEffect, useEffectEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/** One explicit navigation intent, consumed with replace. Reload/back never reopens it. */
export function useGuideBriefing(mission: string, safe: boolean, open: () => void) {
  const query = useSearchParams(),
    path = usePathname(),
    router = useRouter();
  const show = useEffectEvent(open);
  useEffect(() => {
    if (query.get('brief') !== mission) return;
    const next = new URLSearchParams(query.toString());
    next.delete('brief');
    router.replace(path + '?' + next, { scroll: false });
    if (safe) show();
  }, [query, path, router, mission, safe]);
}

export function focusGuidedTarget(hash: string) {
  const node = document.getElementById(hash.replace(/^#/, ''));
  if (!node) return false;
  node.scrollIntoView({ block: 'start', behavior: 'instant' });
  node.focus({ preventScroll: true });
  return true;
}
