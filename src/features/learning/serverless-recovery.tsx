'use client';
import { useState } from 'react';
import { serverlessNb as c } from '@/content/nb';
import { PortalDialog } from '@/features/portal/shared';
import { useServerless } from './serverless-provider';

/** Explicit version-scoped recovery. Never dispatches global reset or writes another key. */
export function ServerlessRecovery() {
  const s = useServerless(),
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
                s.store.clear();
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
