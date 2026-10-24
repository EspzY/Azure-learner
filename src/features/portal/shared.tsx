'use client';
import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { nb } from '@/content/nb';
import type { Area, PortalLocation } from '@/domain/portal/model';
export type Navigate = (area: Area, change?: Partial<PortalLocation>) => void;
export function PortalDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    const element = ref.current;
    element?.showModal();
    return () => {
      element?.close();
      prior?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="portal-dialog"
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <h2 id={id}>{title}</h2>
        <button type="button" aria-label={nb.portal.close} onClick={onClose}>
          <X size={18} />
        </button>
      </header>
      <div className="portal-dialog-body">{children}</div>
    </dialog>
  );
}
export function PropertyList({
  items,
}: {
  items: readonly (readonly [string, React.ReactNode])[];
}) {
  return (
    <dl className="portal-properties">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
