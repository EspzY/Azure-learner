'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { nb } from '@/content/nb';

export function CommandDialog({
  title,
  onClose,
  children,
  wide = false,
  restoreFocus,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  restoreFocus?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (restoreFocus) queueMicrotask(restoreFocus);
      else if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [restoreFocus]);
  return (
    <dialog
      ref={ref}
      className={`command-dialog ${wide ? 'command-wide' : ''}`}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last && first) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="command-header">
        <div>
          <span className="command-indicator" />
          <h2 id={titleId}>{title}</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label={nb.universe.close}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </header>
      <div className="command-body">{children}</div>
    </dialog>
  );
}
