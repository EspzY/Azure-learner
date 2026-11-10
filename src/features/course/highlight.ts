'use client';
import { useEffect, useState } from 'react';
import type { GuideTarget, GuideStep } from '@/domain/course/model';
export interface TargetBounds {
  left: number;
  top: number;
  width: number;
  height: number;
  visible: boolean;
}
export type TargetKind = GuideStep['targetKind'];
/** Scope and native semantics prevent a coincidental duplicate from becoming a guide target. */
export function resolveGuideTarget(
  target: GuideTarget,
  kind: TargetKind = 'action',
): HTMLElement | null {
  const root = document.querySelector(
    target === 'search'
      ? '.portal-header'
      : target === 'create' || target === 'architecture'
        ? '.portal-commandbar'
        : '#portal-main',
  );
  const candidates = [
    ...(root?.querySelectorAll<HTMLElement>(`[data-guide="${target}"]`) ?? []),
  ].filter((el) => {
    const modal = document.querySelector('dialog[open]');
    if (modal && !modal.contains(el)) return false;
    const rect = el.getBoundingClientRect();
    if (
      !el.getClientRects().length ||
      rect.width <= 0 ||
      rect.height <= 0 ||
      el.closest('[hidden],[inert],[aria-hidden="true"]') ||
      getComputedStyle(el).visibility === 'hidden'
    )
      return false;
    for (let parent: HTMLElement | null = el; parent; parent = parent.parentElement)
      if (Number(getComputedStyle(parent).opacity) === 0) return false;
    return (
      kind === 'inspection' ||
      (el.matches('button,input,select,a[href],textarea') && !el.matches(':disabled'))
    );
  });
  // Ambiguity is a missing target, never a guess.
  return candidates.length === 1 ? (candidates[0] ?? null) : null;
}
export function useGuideBounds(
  target: GuideTarget,
  enabled: boolean,
  kind: TargetKind = 'action',
  context = '',
) {
  const key = `${target}:${kind}:${context}`;
  const [snapshot, setSnapshot] = useState<{ key: string; bounds: TargetBounds | null } | null>(
    null,
  );
  useEffect(() => {
    if (!enabled) return;
    let element: HTMLElement | null = null,
      frame = 0;
    const resized = new ResizeObserver(() => schedule());
    const measure = () => {
      frame = 0;
      const next = resolveGuideTarget(target, kind);
      if (next !== element) {
        resized.disconnect();
        element = next;
        if (element) resized.observe(element);
      }
      const r = element?.getBoundingClientRect();
      // A long receipt may be partly in view: inspect the visible intersection rather
      // than its off-screen centre. Every accepted sample must hit the actual target.
      const left = r ? Math.max(0, r.left) : 0,
        right = r ? Math.min(window.innerWidth, r.right) : 0,
        top = r ? Math.max(target === 'search' ? 0 : 90, r.top) : 0,
        bottom = r
          ? Math.min(window.innerHeight - (window.innerWidth <= 800 ? 250 : 12), r.bottom)
          : 0;
      const unobscured =
        right > left &&
        bottom > top &&
        [(left + right) / 2, left + Math.min(12, (right - left) / 2)].some((x) =>
          [top + Math.min(2, (bottom - top) / 2), (top + bottom) / 2, bottom - 2].some((y) => {
            const hit = document.elementFromPoint(x, y);
            return !!hit && !!element?.contains(hit);
          }),
        );
      const bounds = r
        ? {
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            visible:
              unobscured &&
              r.bottom > (target === 'search' ? 0 : 90) &&
              r.top < window.innerHeight - (window.innerWidth <= 800 ? 250 : 12) &&
              r.right > 0 &&
              r.left < window.innerWidth,
          }
        : null;
      const value = { key, bounds };
      setSnapshot((old) => (JSON.stringify(old) === JSON.stringify(value) ? old : value));
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'open', 'disabled', 'inert'],
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
  }, [target, enabled, kind, context, key]);
  return enabled && snapshot?.key === key ? snapshot.bounds : null;
}
