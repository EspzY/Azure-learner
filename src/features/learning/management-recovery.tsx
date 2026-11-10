'use client';
import { useState } from 'react';
import { managementNb as c } from '@/content/nb';
import { PortalDialog } from '@/features/portal/shared';
import { useManagement } from './management-provider';

/** Explicit version-scoped recovery. Never dispatches global reset or writes another key. */
export function ManagementRecovery() {
  const s = useManagement(),
    [confirm, setConfirm] = useState(false);
  if (!s.ready || !['corrupt', 'unsupported'].includes(s.issue ?? '')) return null;
  return (
    <>
      <button type="button" onClick={() => setConfirm(true)}>
        {c.repair}
      </button>
      {confirm && (
        <PortalDialog title={c.repairTitle} onClose={() => setConfirm(false)}>
          <p>{c.repairText}</p>
          <div className="sl-actions">
            <button type="button" onClick={() => setConfirm(false)}>
              {c.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                s.store.recoverInvalid();
                setConfirm(false);
              }}
            >
              {c.repairConfirm}
            </button>
          </div>
        </PortalDialog>
      )}
    </>
  );
}
