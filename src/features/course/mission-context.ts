'use client';
import type { MissionSession } from '@/domain/sandbox/missions';
import { missionEvaluation } from '@/domain/sandbox/missions';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useMissions } from './mission-provider';
import { useManagement } from '@/features/learning/management-provider';
import { usePhysical } from '@/features/learning/physical-provider';
import { useServerless } from '@/features/learning/serverless-provider';
import { useLearning } from '@/features/learning/provider';
import { useFoundationsV2 } from '@/features/learning/v2-provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import { useExpansion } from '@/features/learning/expansion-provider';
import { usePractical } from './practical-provider';
import { useCourse } from './provider';
export function useMissionResult(session?: MissionSession | null) {
  const m = useMissions(),
    technical = useSandbox(),
    s = session === undefined ? m.current : session;
  const archived = s?.status === 'submitted' ? technical.store.engineFor(s.attempt) : null;
  const engine = archived ?? technical.attempt.engine;
  return {
    m,
    technical,
    engine,
    s,
    result: missionEvaluation(s, engine, archived && s ? s.attempt : technical.attemptNumber),
  };
}
export function useMissionSafetyContexts() {
  const management = useManagement(),
    physical = usePhysical(),
    sl = useServerless(),
    f = useLearning(),
    v2 = useFoundationsV2(),
    old = usePortalLearning(),
    benefits = useExpansion('benefits'),
    services = useExpansion('services'),
    practical = usePractical(),
    course = useCourse(),
    technical = useSandbox();
  return [
    {
      id: 'management',
      state: management,
      active: management.facts.active,
      href: '/learn/architecture?topic=management-assessment',
    },
    {
      id: 'physical',
      state: physical,
      active: physical.facts.active,
      href: '/learn/architecture?topic=assessment',
    },
    {
      id: 'serverless',
      state: sl,
      active: sl.facts.active,
      href: '/learn/computing?topic=serverless-assessment',
    },
    {
      id: 'foundations',
      state: f,
      active: f.facts.active,
      href: '/learn/computing?topic=assessment&version=1',
    },
    { id: 'v2', state: v2, active: v2.facts.active, href: '/learn/computing?topic=v2-assessment' },
    {
      id: 'portal',
      state: old,
      active: old.facts.active,
      href: '/portal?area=challenge&mode=independent',
    },
    {
      id: 'benefits',
      state: benefits,
      active: benefits.facts.active,
      href: '/learn/benefits?topic=assessment',
    },
    {
      id: 'services',
      state: services,
      active: services.facts.active,
      href: '/learn/services?topic=assessment&version=2',
    },
    {
      id: 'practical',
      state: practical,
      active: practical.activeIndependent,
      href: '/learn/services?topic=practice',
    },
    { id: 'course', state: course, active: false, href: '/learn' },
    { id: 'technical', state: technical, active: false, href: '/portal' },
  ] as const;
}
export function useMissionSafety() {
  return useMissionSafetyContexts().every(
    ({ state, active }) => state.ready && !state.issue && !active,
  );
}
