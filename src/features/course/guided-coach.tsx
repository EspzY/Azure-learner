'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { nb, regionLabels } from '@/content/nb';
import {
  courseLabHref,
  guideStep,
  guideContextMatches,
  guideDefinitions,
  labFacts,
  type LabForm,
} from '@/domain/course/model';
import type { PortalLocation } from '@/domain/portal/model';
import { useSandbox as useChapter } from '@/features/portal/sandbox-provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import type { Navigate } from '@/features/portal/shared';
import { useCourse } from './provider';
import { SavvyShark } from './savvy-shark';
import { resolveGuideTarget, useGuideBounds } from './highlight';
import './course.css';
import { useExpansion } from '@/features/learning/expansion-provider';
import { MissionRecall } from './mission-briefing';
const c = nb.course;
export function GuidedCoach({
  location,
  form,
  navigate,
  returnHref,
}: {
  location: PortalLocation;
  form: LabForm | null;
  navigate: Navigate;
  returnHref?: string;
}) {
  const { save, store, ready } = useCourse(),
    chapter = useChapter(),
    module = usePortalLearning();
  const benefits = useExpansion('benefits'),
    services2 = useExpansion('services');
  const [minimized, setMinimized] = useState(false);
  const lab = save.lab;
  const active =
    !!lab &&
    ready &&
    module.ready &&
    benefits.ready &&
    services2.ready &&
    !!location.lab &&
    !module.facts.active &&
    !benefits.facts.active &&
    !services2.facts.active;
  const findings = labFacts(lab, chapter.attempt.engine, chapter.attemptNumber);
  const nextStep = lab
    ? guideStep(lab, chapter.attempt.engine, chapter.attemptNumber, location, form)
    : null;
  // Keep the policy readable after its inspection is recorded. The next domain predicate is unchanged.
  const step =
    location.area === 'policy' && findings.denial ? guideDefinitions['inspect-policy'] : nextStep;
  const matching =
    !!step &&
    guideContextMatches(step, location) &&
    (step.target !== 'resource' ||
      location.id === (step.id === 'inspect-group' ? findings.group?.id : findings.app?.id)) &&
    (step.target !== 'receipt' || location.id === findings.denial?.commandId);
  const bounds = useGuideBounds(
    step?.target ?? 'search',
    active && !minimized && matching,
    step?.targetKind,
    `${location.area}:${location.kind}:${location.id}`,
  );
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
          data-kind={step.targetKind}
          data-target={step.target}
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
        data-target-kind={step.targetKind}
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
              <MissionRecall kind="paas" />
              {bounds && !bounds.visible && (
                <button
                  type="button"
                  onClick={() => {
                    const target = resolveGuideTarget(step.target, step.targetKind);
                    if (target) {
                      target.scrollIntoView({
                        block: 'center',
                        behavior: matchMedia('(prefers-reduced-motion:reduce)').matches
                          ? 'instant'
                          : 'smooth',
                      });
                      if (step.targetKind === 'action') target.focus({ preventScroll: true });
                    }
                  }}
                >
                  {step.targetKind === 'inspection' ? nb.refinement.locateInspection : c.locate}
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
            <p className="coach-target-type">
              {step.targetKind === 'action'
                ? nb.refinement.actionTarget
                : nb.refinement.inspectTarget}
            </p>
            <dl className="coach-instruction">
              <div>
                <dt>{nb.refinement.why}</dt>
                <dd>{copy[2]}</dd>
              </div>
              <div>
                <dt>{nb.refinement.action}</dt>
                <dd>{copy[1]}</dd>
              </div>
              <div>
                <dt>{nb.refinement.expect}</dt>
                <dd>{nb.refinement.expectations[step.id]}</dd>
              </div>
            </dl>
            {['inspect-denial', 'inspect-policy'].includes(step.id) && findings.denial && (
              <p className="coach-observed">
                <strong>{nb.refinement.actual}: </strong>
                {findings.denial.operation} ·{' '}
                {findings.denial.location ? regionLabels[findings.denial.location] : '—'} ·{' '}
                {nb.chapter.inventory}: {findings.denial.beforeCount} → {findings.denial.afterCount}
              </p>
            )}
            {step.id === 'inspect-group' && findings.group && (
              <p className="coach-observed">
                <strong>{nb.refinement.actual}: </strong>
                {findings.group.name} · {regionLabels[findings.group.metadataLocation]}
              </p>
            )}
            {['inspect-app', 'relationship', 'complete'].includes(step.id) &&
              findings.app &&
              findings.plan && (
                <p className="coach-observed">
                  <strong>{nb.refinement.actual}: </strong>
                  {findings.app.name} → {findings.plan.name}
                </p>
              )}
            <details>
              <summary>{c.hint}</summary>
              <p>{copy[3]}</p>
            </details>
            {!bounds?.visible && !['complete', 'unverifiable'].includes(step.id) && (
              <p className="coach-missing">
                {step.targetKind === 'inspection' ? nb.refinement.missingInspection : c.missing}
              </p>
            )}
            <Link
              href={returnHref ?? courseLabHref(findings.complete, lab.origin)}
              className="coach-return"
            >
              {step.id === 'complete' ? c.returnCourse : c.leaveLab}
            </Link>
          </>
        )}
      </aside>
    </>
  );
}
