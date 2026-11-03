'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/** Non-semantic route orientation. Never delays navigation, reads learning
 * records, transforms a workspace ancestor or emits a learning event. */
export function ExperienceMotion() {
  const path = usePathname(),
    query = useSearchParams();
  const previous = useRef<string | null>(null),
    rail = useRef<HTMLDivElement>(null);
  const route = path + '?' + query.toString();
  useEffect(() => {
    const before = previous.current;
    previous.current = route;
    const node = rail.current;
    if (
      !node ||
      typeof node.animate !== 'function' ||
      !before ||
      before === route ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const fromPortal = before.startsWith('/portal?'),
      toPortal = path === '/portal';
    const mode = toPortal
      ? fromPortal
        ? 'resource'
        : 'workspace'
      : fromPortal
        ? 'learning'
        : 'chapter';
    // A route can commit before its Suspense destination or native scroll restore.
    // Observe only this transition; never delay routing or animate outgoing content.
    let frame: number | null = null;
    let animation: Animation | null = null;
    let stopped = false;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const destination = () => {
      if (toPortal) {
        const workspace = document.querySelector<HTMLElement>('.portal[data-area]');
        if (workspace?.dataset.area !== (query.get('area') ?? 'home')) return null;
        const title = workspace.querySelector<HTMLElement>('.portal-title');
        if (title && title.getBoundingClientRect().height > 1) return title;
        return workspace.querySelector<HTMLElement>('.portal-view > h2');
      }
      const shell = document.querySelector<HTMLElement>('.course-hybrid');
      const module = path === '/learn' ? 'hub' : path.slice('/learn/'.length);
      if (shell?.dataset.courseModule !== module) return null;
      return shell.querySelector<HTMLElement>('.course-module-header, .learn-hub-intro');
    };
    const observer = new MutationObserver(() => schedule());
    const stopWaiting = () => {
      stopped = true;
      observer.disconnect();
      clearTimeout(deadline);
      window.removeEventListener('scroll', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };
    const draw = () => {
      frame = null;
      if (stopped || media.matches) return;
      const target = destination();
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const top = Math.max(4, rect.top + 4);
      if (rect.bottom < 0 || top >= innerHeight - 12 || rect.height <= 1) return;
      stopWaiting();
      Object.assign(node.style, {
        left: Math.max(2, rect.left - 10) + 'px',
        top: top + 'px',
        height: Math.max(8, Math.min(rect.height - 8, innerHeight - top - 8)) + 'px',
      });
      node.dataset.mode = mode;
      animation = node.animate(
        [
          { clipPath: mode === 'learning' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0 0)' },
        ],
        { duration: mode === 'workspace' ? 320 : 240, easing: 'cubic-bezier(.22,1,.36,1)' },
      );
      node.dataset.running = 'true';
      animation.addEventListener('finish', () => delete node.dataset.running);
    };
    function schedule() {
      if (!stopped && frame === null) frame = requestAnimationFrame(draw);
    }
    const cancel = () => {
      stopWaiting();
      animation?.cancel();
      delete node.dataset.running;
    };
    const motionChanged = () => {
      if (media.matches) cancel();
    };
    // Observation is bounded; a slow/unsupported enhancement never blocks the UI.
    const deadline = setTimeout(stopWaiting, 2000);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    media.addEventListener('change', motionChanged);
    schedule();
    return () => {
      cancel();
      media.removeEventListener('change', motionChanged);
    };
  }, [route, path, query]);
  return <div ref={rail} className="experience-route-mark" aria-hidden="true" />;
}
