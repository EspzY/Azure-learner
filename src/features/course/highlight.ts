'use client';
import { useEffect, useState } from 'react';
import type { GuideTarget } from '@/domain/course/model';
export interface TargetBounds {
  left: number;
  top: number;
  width: number;
  height: number;
  visible: boolean;
}
export function resolveGuideTarget(target: GuideTarget): HTMLElement | null {
  return (
    [...document.querySelectorAll<HTMLElement>(`[data-guide="${target}"]`)].find(
      (el) => el.getClientRects().length > 0,
    ) ?? null
  );
}
export function useGuideBounds(target: GuideTarget, enabled: boolean) {
  const [bounds, setBounds] = useState<TargetBounds | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let element: HTMLElement | null = null,
      frame = 0;
    const resized = new ResizeObserver(() => schedule());
    const measure = () => {
      frame = 0;
      const next = resolveGuideTarget(target);
      if (next !== element) {
        resized.disconnect();
        element = next;
        if (element) resized.observe(element);
      }
      const r = element?.getBoundingClientRect();
      const value = r
        ? {
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            visible:
              r.bottom > (target === 'search' ? 0 : 90) &&
              r.top < window.innerHeight - (window.innerWidth <= 800 ? 250 : 12) &&
              r.right > 0 &&
              r.left < window.innerWidth,
          }
        : null;
      setBounds((old) => (JSON.stringify(old) === JSON.stringify(value) ? old : value));
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'open'],
    });
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    measure();
    return () => {
      observer.disconnect();
      resized.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [target, enabled]);
  return enabled ? bounds : null;
}
