'use client';
import { useConnectivity } from './connectivity-provider';
import {
  connectivityFacts,
  connectivityKey,
  restoreConnectivity,
  connectivityHref,
} from '@/domain/curriculum/connectivity';
import { ConnectivityRecovery } from './connectivity';
import { useNetworking } from './networking-provider';
import {
  networkingFacts,
  networkingKey,
  restoreNetworking,
  networkingHref,
} from '@/domain/curriculum/networking';
import { NetworkingRecovery } from './networking';

import { useEffect, useEffectEvent, useState } from 'react';
import Link from 'next/link';
import { managementNb as c, architectureNb } from '@/content/nb';
import { prepareExistingTeaching } from '@/domain/curriculum/teaching-access';
import {
  managementKey,
  restoreManagement,
  managementFacts,
} from '@/domain/curriculum/architecture-management';
import { learningKey, restoreLearning, learningFacts } from '@/domain/curriculum/foundations';
import { foundationsV2Key, restoreV2, v2Facts } from '@/domain/curriculum/foundations-v2';
import { serviceLearningKey, restoreServices, serviceFacts } from '@/domain/portal/learning';
import {
  expansionKeys,
  restore as restoreExpansion,
  facts as expansionFacts,
} from '@/domain/curriculum/expansion';
import { serverlessKey, restoreServerless, serverlessFacts } from '@/domain/curriculum/serverless';
import {
  physicalKey,
  restorePhysical,
  physicalFacts,
} from '@/domain/curriculum/architecture-physical';
import { practicalKey, restorePractical, practicalFacts } from '@/domain/sandbox/practical';
import { useManagement } from './management-provider';
import { useLearning } from './provider';
import { useFoundationsV2 } from './v2-provider';
import { usePhysical } from './physical-provider';
import { useServerless } from './serverless-provider';
import { useExpansion } from './expansion-provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import { usePractical } from '@/features/course/practical-provider';
import { useMissions } from '@/features/course/mission-provider';
import {
  missionKey,
  missionFacts,
  restoreMissions,
  missionOrigin,
} from '@/domain/sandbox/missions';
import { MissionRecovery } from '@/features/course/missions';
import { ManagementRecovery } from './management-recovery';
import { PhysicalRecovery } from './physical-recovery';
import { PhysicalRunControl } from './physical';
import { useTransfer } from './transfer-provider';
import {
  transferKey,
  restoreTransfer,
  transferFacts,
  transferHref,
} from '@/domain/curriculum/transfer';
import { TransferRecovery } from './cloud-transfer';
import { useCompute } from './compute-provider';
import { computeFacts, computeKey, restoreCompute, computeHref } from '@/domain/curriculum/compute';
import { ComputeRecovery } from './compute';
import { useCost } from './cost-provider';
import { costFacts, costKey, restoreCost, costHref } from '@/domain/curriculum/cost';
import { CostRecovery } from './cost';
export type TeachingContextId = keyof typeof c.accessContexts;
const read = (key: string) => localStorage.getItem(key);
function check<S>(
  id: TeachingContextId,
  state: {
    ready: boolean;
    issue: string | null;
    save: S;
    store: {
      getSnapshot(): { ready: boolean; issue: string | null; save: S };
      changed(): void;
      load(): void;
    };
  },
  key: string,
  restore: (raw: string | null) => { save: S; issue: string | null },
  facts: (save: S) => { active: boolean; assisted: boolean },
  aid: () => boolean,
  href: string,
) {
  return {
    id,
    state,
    ...facts(state.save),
    href,
    prepare: () => prepareExistingTeaching(state.store, key, read, restore, facts, aid),
  };
}
/** Reuse existing independent contracts. No new evidence store or generic
 * assessment engine. Own assessment/operational controls are deliberate exclusions. */
export function ManagementTeachingBoundary({
  identity,
  assessment,
  orientation = false,
  only,
  children,
}: {
  identity: string;
  assessment?: TeachingContextId;
  orientation?: boolean;
  only?: 'management' | 'core';
  children: React.ReactNode;
}) {
  const b = useManagement(),
    a = usePhysical(),
    sl = useServerless(),
    f = useLearning(),
    v = useFoundationsV2(),
    old = usePortalLearning(),
    benefits = useExpansion('benefits'),
    services = useExpansion('services'),
    practical = usePractical(),
    missions = useMissions(),
    transfer = useTransfer(),
    cost = useCost(),
    compute = useCompute(),
    networking = useNetworking(),
    connectivity = useConnectivity();
  const checks = [
    check(
      'connectivity',
      connectivity,
      connectivityKey,
      restoreConnectivity,
      connectivityFacts,
      () => connectivity.store.event({ kind: 'aid' }),
      connectivityHref('assessment', connectivity.facts.current?.item),
    ),
    check(
      'networking',
      networking,
      networkingKey,
      restoreNetworking,
      networkingFacts,
      () => networking.store.event({ kind: 'aid' }),
      networkingHref('assessment', networking.facts.current?.item),
    ),
    check(
      'compute',
      compute,
      computeKey,
      restoreCompute,
      computeFacts,
      () => compute.store.event({ kind: 'aid' }),
      computeHref('assessment', compute.facts.current?.item),
    ),
    check(
      'cost',
      cost,
      costKey,
      restoreCost,
      costFacts,
      () => cost.store.event({ kind: 'aid' }),
      costHref('assessment', cost.facts.current?.item),
    ),
    check(
      'transfer',
      transfer,
      transferKey,
      restoreTransfer,
      transferFacts,
      () => transfer.store.event({ kind: 'aid' }),
      transfer.facts.current
        ? transferHref(transfer.facts.current.item)
        : '/learn/computing?topic=transfer',
    ),
    check(
      'missions',
      missions,
      missionKey,
      restoreMissions,
      missionFacts,
      () => missions.store.event({ type: 'aid' }),
      missionOrigin(missions.activeSession?.mission ?? 'diagnose'),
    ),
    check(
      'management',
      b,
      managementKey,
      restoreManagement,
      managementFacts,
      () => b.store.event({ kind: 'aid' }),
      '/learn/architecture?topic=management-assessment',
    ),
    check(
      'physical',
      a,
      physicalKey,
      restorePhysical,
      physicalFacts,
      () => a.store.event({ kind: 'aid' }),
      '/learn/architecture?topic=assessment',
    ),
    check(
      'serverless',
      sl,
      serverlessKey,
      restoreServerless,
      serverlessFacts,
      () => sl.store.event({ kind: 'aid' }),
      '/learn/computing?topic=serverless-assessment',
    ),
    check(
      'foundations',
      f,
      learningKey,
      restoreLearning,
      learningFacts,
      () => f.store.event({ kind: 'aid' }),
      '/learn/computing?topic=assessment',
    ),
    check(
      'v2',
      v,
      foundationsV2Key,
      restoreV2,
      v2Facts,
      () => v.store.event({ kind: 'aid' }),
      '/learn/computing?topic=v2-assessment',
    ),
    check(
      'legacyServices',
      old,
      serviceLearningKey,
      restoreServices,
      serviceFacts,
      () => old.store.event({ kind: 'aid' }),
      '/portal?area=challenge&mode=independent',
    ),
    check(
      'benefits',
      benefits,
      expansionKeys.benefits,
      (raw) => restoreExpansion('benefits', raw),
      expansionFacts,
      () => benefits.store.event({ kind: 'aid' }),
      '/learn/benefits?topic=assessment',
    ),
    check(
      'services',
      services,
      expansionKeys.services,
      (raw) => restoreExpansion('services', raw),
      expansionFacts,
      () => services.store.event({ kind: 'aid' }),
      '/learn/services?topic=assessment&version=2',
    ),
    check(
      'practical',
      practical,
      practicalKey,
      (raw) => ({ save: restorePractical(raw), issue: null }),
      (save) => {
        const result = practicalFacts(save);
        return {
          active: result.activeIndependent,
          assisted: !!result.sessions.find((s) => s.status === 'active' && s.mode === 'independent')
            ?.aided,
        };
      },
      () => practical.store.event({ type: 'aid' }),
      '/learn/services?topic=practice',
    ),
  ].filter(
    (item) =>
      item.id !== assessment &&
      (!only ||
        item.id === 'missions' ||
        item.id === 'transfer' ||
        item.id === 'cost' ||
        item.id === 'compute' ||
        item.id === 'networking' ||
        item.id === 'connectivity' ||
        (only === 'core' ? ['management', 'physical'].includes(item.id) : item.id === only)),
  );
  const token = JSON.stringify([
    identity,
    ...checks.map((item) => [
      item.id,
      item.state.ready,
      item.state.issue,
      item.active,
      item.assisted,
    ]),
  ]);
  const [approved, setApproved] = useState<string | null>(null);
  const RecoveryHeading = identity.startsWith('course:') ? 'h1' : 'h2';
  const authorize = useEffectEvent(
    () =>
      checks.every((item) => item.state.ready && !item.state.issue) &&
      checks.every((item) => item.prepare()),
  );
  useEffect(() => {
    if (orientation) return;
    const frame = requestAnimationFrame(() => {
      if (authorize()) setApproved(token);
    });
    return () => cancelAnimationFrame(frame);
  }, [orientation, token]);
  if (
    orientation ||
    (approved === token && checks.every((item) => item.state.ready && !item.state.issue))
  )
    return children;
  return (
    <section className="management-lesson">
      <div className="course-storage" role="status">
        <RecoveryHeading>{c.accessTitle}</RecoveryHeading>
        <p>{c.accessText}</p>
        {checks
          .filter((item) => item.state.issue)
          .map((item) => (
            <div key={item.id}>
              <p>
                {c.accessContexts[item.id]} ({item.state.issue})
              </p>
              <button type="button" onClick={item.state.store.load}>
                {item.id === 'physical' ? architectureNb.reload : c.accessReload}
              </button>{' '}
              <Link href={item.href}>
                {c.accessReview} · {c.accessContexts[item.id]}
              </Link>
              {item.id === 'management' && <ManagementRecovery />}
              {item.id === 'physical' && <PhysicalRecovery />}
              {item.id === 'missions' && <MissionRecovery />}
              {item.id === 'transfer' && <TransferRecovery />}
              {item.id === 'cost' && <CostRecovery />}
              {item.id === 'compute' && <ComputeRecovery />}
              {item.id === 'networking' && <NetworkingRecovery />}
              {item.id === 'connectivity' && <ConnectivityRecovery />}
            </div>
          ))}
      </div>
      {identity === 'course:architecture:explorer' && (
        <section aria-label={architectureNb.topics.explorer}>
          <p>{architectureNb.blocked}</p>
          <PhysicalRunControl disabled />
        </section>
      )}
    </section>
  );
}
