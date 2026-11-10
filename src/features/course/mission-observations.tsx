'use client';
import { useEffect, useRef, useState } from 'react';
import { missionsNb as c, nb } from '@/content/nb';
import { useMissions } from './mission-provider';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { missionEvaluation } from '@/domain/sandbox/missions';
import { conceptMilestones } from '@/domain/guidance/milestones';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { GuidanceWindow } from './guidance-window';
import { SavvyShark } from './savvy-shark';
/** UI history only. Actual model/receipts are re-evaluated; reload baselines rather than interrupts. */
export function MissionMilestones({ blocked }: { blocked: boolean }) {
  const m = useMissions(),
    t = useSandbox(),
    [open, setOpen] = useState(false),
    [warning, setWarning] = useState(false);
  const s = m.current,
    result = missionEvaluation(s, t.attempt.engine, t.attemptNumber);
  const kind =
    s?.mission === 'diagnose'
      ? 'mission-diagnosis'
      : s?.mission === 'platform'
        ? 'mission-settings'
        : null;
  const qualifies =
    !!kind &&
    !!s &&
    s.status === 'active' &&
    s.mode === 'guided' &&
    result.verifiable &&
    (kind === 'mission-diagnosis'
      ? result.checks.contrast
      : result.checks.restoration && result.checks.receipts && result.checks.draft);
  const key = kind && s ? `${kind}@${conceptMilestones[kind].version}:${s.attempt}:${s.id}` : '';
  const baseline = useRef<{ key: string; qualified: boolean } | null>(null);
  if ((blocked || !qualifies) && open) setOpen(false);
  useEffect(() => {
    if (!m.ready || !t.ready || !key) return;
    if (baseline.current?.key !== key) {
      baseline.current = { key, qualified: !!qualifies };
      return;
    }
    const previous = baseline.current.qualified;
    baseline.current.qualified = !!qualifies;
    if (blocked || !qualifies || previous || document.querySelector('dialog[open]')) return;
    const frame = requestAnimationFrame(() => {
      const claim = claimMilestone(localStorage, key);
      setWarning(claim === 'unavailable');
      if (claim === 'claimed') setOpen(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [key, qualifies, blocked, m.ready, t.ready]);
  useEffect(() => {
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === milestonePreferenceKey) {
        setOpen(false);
        try {
          setWarning(!parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey)));
        } catch {
          setWarning(true);
        }
      }
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  if (blocked || !qualifies || !s) return null;
  return (
    <div className="mission-observation">
      <button type="button" onClick={() => setOpen(true)}>
        {c.milestone.recall}
      </button>
      {warning && <p role="status">{nb.milestones.storage}</p>}
      {open && (
        <GuidanceWindow
          title={c.milestone.title}
          notice={c.boundary}
          onClose={() => setOpen(false)}
        >
          <SavvyShark>
            <p>{kind === 'mission-diagnosis' ? c.milestone.diagnosis : c.milestone.settings}</p>
          </SavvyShark>
          <p>
            {c.selected}:{' '}
            {result.chain?.vm.name ??
              result.world?.resources.find((r) => r.id === result.appId)?.name}
          </p>
          <p>{result.receipts.join(' → ')}</p>
        </GuidanceWindow>
      )}
    </div>
  );
}
