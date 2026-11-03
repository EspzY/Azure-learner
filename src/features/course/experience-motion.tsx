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
    const destination = document.querySelector(
      toPortal ? '.portal-title' : '.course-module-header, .learn-hub-intro',
    );
    if (!destination) return;
    const rect = destination.getBoundingClientRect();
    const top = Math.max(4, rect.top + 4);
    if (rect.bottom < 0 || top >= innerHeight - 12) return;
    Object.assign(node.style, {
      left: Math.max(2, rect.left - 10) + 'px',
      top: top + 'px',
      height: Math.max(8, Math.min(rect.height - 8, innerHeight - top - 8)) + 'px',
    });
    node.dataset.mode = mode;
    const animation = node.animate(
      [
        { clipPath: mode === 'learning' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0 0)' },
      ],
      { duration: mode === 'workspace' ? 320 : 240, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
    node.dataset.running = 'true';
    const finish = () => {
      delete node.dataset.running;
    };
    animation.addEventListener('finish', finish);
    return () => {
      animation.cancel();
      delete node.dataset.running;
    };
  }, [route, path]);
  return <div ref={rail} className="experience-route-mark" aria-hidden="true" />;
}
