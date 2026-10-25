'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { nb } from '@/content/nb';
import { courseLabHref, guideStep, labFacts, type LabForm } from '@/domain/course/model';
import type { PortalLocation } from '@/domain/portal/model';
import { useChapter } from '@/features/chapter01/provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import type { Navigate } from '@/features/portal/shared';
import { useCourse } from './provider';
import { SavvyShark } from './savvy-shark';
import { resolveGuideTarget, useGuideBounds } from './highlight';
import './course.css';
const c = nb.course;
export function GuidedCoach({
  location,
  form,
  navigate,
}: {
  location: PortalLocation;
  form: LabForm | null;
  navigate: Navigate;
}) {
  const { save, store, ready } = useCourse(),
    chapter = useChapter(),
    module = usePortalLearning();
  const [minimized, setMinimized] = useState(false);
  const lab = save.lab;
  const active = !!lab && ready && !!location.lab && !module.facts.active;
  const step = lab
    ? guideStep(lab, chapter.attempt.engine, chapter.attemptNumber, location, form)
    : null;
  const bounds = useGuideBounds(step?.target ?? 'search', active && !minimized);
  const findings = labFacts(lab, chapter.attempt.engine, chapter.attemptNumber);
  useEffect(() => {
    if (active && lab && location.area === 'policy' && findings.denial && !findings.policy)
      store.update({ ...save, lab: { ...lab, policy: findings.denial.commandId } });
  }, [active, lab, location.area, findings.denial, findings.policy, save, store]);
  if (!active || !lab || !step) return null;
  const copy = c.guidance[step.id];
  return (
    <>
      {!minimized && bounds?.visible && (
        <div
          aria-hidden="true"
          className="guide-target-ring"
          style={{
            left: bounds.left - 4,
            top: bounds.top - 4,
            width: bounds.width + 8,
            height: bounds.height + 8,
          }}
        />
      )}
      <aside
        className={`guided-coach ${minimized ? 'coach-minimized' : ''}`}
        aria-label={c.guided}
        data-step={step.id}
        style={
          bounds?.visible && !minimized
            ? ({ '--guide-top': `${bounds.top}px` } as React.CSSProperties)
            : undefined
        }
      >
        <header>
          <span>{c.guided}</span>
          <button type="button" aria-expanded={!minimized} onClick={() => setMinimized(!minimized)}>
            {minimized ? c.expand : c.minimize}
          </button>
        </header>
        {!minimized && (
          <>
            <SavvyShark compact>
              <p className="coach-step" role="status">
                <small>{c.currentStep}</small>
                <strong>{copy[0]}</strong>
              </p>
            </SavvyShark>
            <div className="coach-actions">
              {bounds && !bounds.visible && (
                <button
                  type="button"
                  onClick={() => {
                    const target = resolveGuideTarget(step.target);
                    if (target) {
                      target.scrollIntoView({
                        block: 'center',
                        behavior: matchMedia('(prefers-reduced-motion:reduce)').matches
                          ? 'instant'
                          : 'smooth',
                      });
                      target.focus({ preventScroll: true });
                    }
                  }}
                >
                  {c.locate}
                </button>
              )}
              {['create-plan', 'inspect-policy', 'inspect-group'].includes(step.id) && (
                <button type="button" onClick={() => navigate('plans')}>
                  {c.goPlans}
                </button>
              )}
              {step.id === 'create-app' && (
                <button type="button" onClick={() => navigate('apps')}>
                  {c.goApps}
                </button>
              )}
              {step.id === 'inspect-denial' && findings.denial && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('activity', { id: findings.denial!.commandId })}
                  >
                    {c.goReceipt}
                  </button>
                  <button type="button" onClick={() => navigate('policy')}>
                    {c.goPolicy}
                  </button>
                </>
              )}
              {['architecture', 'inspect-app'].includes(step.id) && (
                <button type="button" onClick={() => navigate('architecture')}>
                  {nb.portal.areas.architecture}
                </button>
              )}
              {step.id === 'find-groups' && location.area !== 'home' && (
                <button type="button" onClick={() => navigate('groups')}>
                  {c.goGroups}
                </button>
              )}
            </div>
            <p>{copy[1]}</p>
            <details key={step.id}>
              <summary>{c.why}</summary>
              <p>{copy[2]}</p>
            </details>
            <details>
              <summary>{c.hint}</summary>
              <p>{copy[3]}</p>
            </details>
            {!bounds?.visible && <p className="coach-missing">{c.missing}</p>}
            <Link href={courseLabHref(findings.complete, lab.origin)} className="coach-return">
              {step.id === 'complete' ? c.returnCourse : c.leaveLab}
            </Link>
          </>
        )}
      </aside>
    </>
  );
}
