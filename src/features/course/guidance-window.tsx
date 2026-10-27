'use client';
import { useEffect, useId, useRef } from 'react';
import { nb, serverlessNb as c } from '@/content/nb';
import './mission-briefing.css';
/** Native presentation frame, no technical or evidence effects. */
export function GuidanceWindow({
  title,
  children,
  onClose,
  onStart,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onStart?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    const el = ref.current,
      prior = document.activeElement;
    el?.showModal();
    return () => {
      el?.close();
      if (prior instanceof HTMLElement && prior.isConnected) prior.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      className="mission-briefing sl-guidance"
      ref={ref}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="mission-heading">
        <small>SavvyShark</small>
        <button onClick={onClose} aria-label={c.close}>
          ×
        </button>
      </div>
      <div className="mission-scroll" role="region" tabIndex={0} aria-label={nb.milestones.reading}>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
      <footer>
        <p>{onStart ? c.briefAction : c.boundary}</p>
        <div>
          <button onClick={onClose}>{onStart ? c.cancel : c.close}</button>
          {onStart && (
            <button className="mission-start" onClick={onStart}>
              {c.start}
            </button>
          )}
        </div>
      </footer>
    </dialog>
  );
}
