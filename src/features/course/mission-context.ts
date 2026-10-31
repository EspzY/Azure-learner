'use client';
import { useStorage } from '@/features/learning/storage-provider';
import { storageHref } from '@/domain/curriculum/storage';

import { useConnectivity } from '@/features/learning/connectivity-provider';
import { connectivityHref } from '@/domain/curriculum/connectivity';
import { useNetworking } from '@/features/learning/networking-provider';
import { networkingHref } from '@/domain/curriculum/networking';
import type { MissionSession } from '@/domain/sandbox/missions';
import { missionEvaluation, missionOrigin } from '@/domain/sandbox/missions';
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
import { useTransfer } from '@/features/learning/transfer-provider';
import { transferHref } from '@/domain/curriculum/transfer';
import { useCompute } from '@/features/learning/compute-provider';
import { computeHref } from '@/domain/curriculum/compute';
import { useCost } from '@/features/learning/cost-provider';
import { costHref } from '@/domain/curriculum/cost';
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
/** Default: every independent context. Only PR24's own task controls omit their own store. */
export function useMissionSafetyContexts(owner?: 'missions') {
  const missions = useMissions(),
    management = useManagement(),
    physical = usePhysical(),
    sl = useServerless(),
    f = useLearning(),
    v2 = useFoundationsV2(),
    old = usePortalLearning(),
    benefits = useExpansion('benefits'),
    services = useExpansion('services'),
    practical = usePractical(),
    course = useCourse(),
    technical = useSandbox(),
    transfer = useTransfer(),
    cost = useCost(),
    compute = useCompute(),
    networking = useNetworking(),
    connectivity = useConnectivity(),
    storage = useStorage();
  return (
    [
      {
        id: 'missions',
        state: missions,
        active: missions.active,
        href: missionOrigin(missions.activeSession?.mission ?? 'diagnose'),
      },
      {
        id: 'storage',
        state: storage,
        active: storage.facts.active,
        href: storageHref('assessment', storage.facts.current?.item),
      },
      {
        id: 'connectivity',
        state: connectivity,
        active: connectivity.facts.active,
        href: connectivityHref('assessment', connectivity.facts.current?.item),
      },
      {
        id: 'networking',
        state: networking,
        active: networking.facts.active,
        href: networkingHref('assessment', networking.facts.current?.item),
      },
      {
        id: 'compute',
        state: compute,
        active: compute.facts.active,
        href: computeHref('assessment', compute.facts.current?.item),
      },
      {
        id: 'cost',
        state: cost,
        active: cost.facts.active,
        href: costHref('assessment', cost.facts.current?.item),
      },
      {
        id: 'transfer',
        state: transfer,
        active: transfer.facts.active,
        href: transfer.facts.current
          ? transferHref(transfer.facts.current.item)
          : '/learn/computing?topic=transfer',
      },
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
      {
        id: 'v2',
        state: v2,
        active: v2.facts.active,
        href: '/learn/computing?topic=v2-assessment',
      },
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
    ] as const
  ).filter(({ id }) => owner !== 'missions' || id !== 'missions');
}
export function useMissionSafety(owner?: 'missions') {
  return useMissionSafetyContexts(owner).every(
    ({ state, active }) => state.ready && !state.issue && !active,
  );
}
