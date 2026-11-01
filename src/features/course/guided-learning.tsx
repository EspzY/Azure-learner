'use client';
import './learning-flow.css';
import { createContext, useContext } from 'react';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { computeVmFacts } from '@/domain/curriculum/compute-vm';
import { networkingInspection } from '@/domain/curriculum/networking-inspection';
import { projectGuides as project, type GuidedModule } from './learning-flow';
import { computeNb } from '@/content/nb';
import { useCompute } from '@/features/learning/compute-provider';
import {
  computeMissions,
  computeHref,
  computeGuidedFacts,
  computeMissionTopic,
} from '@/domain/curriculum/compute';
import { networkingNb } from '@/content/nb';
import { useNetworking } from '@/features/learning/networking-provider';
import {
  networkingMissions,
  networkingHref,
  networkingGuidedFacts,
  networkingMissionTopic,
} from '@/domain/curriculum/networking';
import { connectivityNb } from '@/content/nb';
import { useConnectivity } from '@/features/learning/connectivity-provider';
import {
  connectivityMissions,
  connectivityHref,
  connectivityGuidedFacts,
  connectivityMissionTopic,
} from '@/domain/curriculum/connectivity';
import { storageNb } from '@/content/nb';
import { useStorage } from '@/features/learning/storage-provider';
import { storageMissions, storageHref, storageGuidedFacts } from '@/domain/curriculum/storage';
import { storageResilienceNb } from '@/content/nb';
import { useResilience } from '@/features/learning/storage-resilience-provider';
import {
  resilienceMissions,
  resilienceHref,
  resilienceGuidedFacts,
} from '@/domain/curriculum/storage-resilience';
import { identityNb } from '@/content/nb';
import { useIdentity } from '@/features/learning/identity-foundations-provider';
import {
  identityMissions,
  identityHref,
  identityGuidedFacts,
} from '@/domain/curriculum/identity-foundations';
import { accessNb } from '@/content/nb';
import { useAccess } from '@/features/learning/access-control-provider';
import { accessMissions, accessHref, accessGuidedFacts } from '@/domain/curriculum/access-control';
import { securityNb } from '@/content/nb';
import { useSecurity } from '@/features/learning/security-provider';
import { securityMissions, securityHref, securityGuidedFacts } from '@/domain/curriculum/security';
import { costNb } from '@/content/nb';
import { useCost } from '@/features/learning/cost-provider';
import { costMissions, costHref, guidedCostFacts } from '@/domain/curriculum/cost';
import { governanceNb } from '@/content/nb';
import { useGovernance } from '@/features/learning/governance-provider';
import {
  governanceMissions,
  governanceHref,
  governanceGuidedFacts,
} from '@/domain/curriculum/governance';
import { toolsNb } from '@/content/nb';
import { useTools } from '@/features/learning/management-tools-provider';
import { toolsMissions, toolsHref, toolsGuidedFacts } from '@/domain/curriculum/management-tools';
import { monitoringNb } from '@/content/nb';
import { useMonitoring } from '@/features/learning/monitoring-provider';
import {
  monitoringMissions,
  monitoringHref,
  monitoringGuidedFacts,
} from '@/domain/curriculum/monitoring';
import { migrationNb } from '@/content/nb';
import { useMigration } from '@/features/learning/migration-provider';
import {
  migrationMissions,
  migrationHref,
  migrationGuidedFacts,
} from '@/domain/curriculum/migration';

function useProjectedGuides(): GuidedModule[] {
  const technical = useSandbox();
  const compute = useCompute();
  const networking = useNetworking();
  const connectivity = useConnectivity();
  const storage = useStorage();
  const resilience = useResilience();
  const identity = useIdentity();
  const access = useAccess();
  const security = useSecurity();
  const cost = useCost();
  const governance = useGovernance();
  const tools = useTools();
  const monitoring = useMonitoring();
  const migration = useMigration();
  return [
    project(
      'compute',
      compute,
      computeMissions,
      computeNb.missions,
      (id) => computeHref(computeMissionTopic[id]),
      computeHref('assessment'),
      (g) => {
        if (g.mission !== 'vm') return computeGuidedFacts(g);
        const f = computeVmFacts(g, technical.attempt.engine, technical.attemptNumber);
        return { witnessed: f.newBuild && f.inspected, complete: f.complete, valid: f.verifiable };
      },
    ),
    project(
      'networking',
      networking,
      networkingMissions,
      networkingNb.missions,
      (id) => networkingHref(networkingMissionTopic[id]),
      networkingHref('assessment'),
      (g) => {
        if (g.mission !== 'inspect') return networkingGuidedFacts(g);
        const f = networkingInspection(g, technical.attempt.engine, technical.attemptNumber);
        return { witnessed: f.inspected, complete: f.complete, valid: f.verifiable };
      },
    ),
    project(
      'connectivity',
      connectivity,
      connectivityMissions,
      connectivityNb.missions,
      (id) => connectivityHref(connectivityMissionTopic[id]),
      connectivityHref('assessment'),
      connectivityGuidedFacts,
    ),
    project(
      'storage',
      storage,
      storageMissions,
      storageNb.missions,
      (id) => storageHref('studio') + '&perspective=' + id,
      storageHref('assessment'),
      storageGuidedFacts,
    ),
    project(
      'storage-resilience',
      resilience,
      resilienceMissions,
      storageResilienceNb.missions,
      (id) => resilienceHref('studio') + '&perspective=' + id,
      resilienceHref('assessment'),
      resilienceGuidedFacts,
    ),
    project(
      'identity',
      identity,
      identityMissions,
      identityNb.missions,
      (id) => identityHref('studio') + '&perspective=' + id,
      identityHref('assessment'),
      identityGuidedFacts,
    ),
    project(
      'access-control',
      access,
      accessMissions,
      accessNb.missions,
      (id) => accessHref('studio') + '&perspective=' + id,
      accessHref('assessment'),
      accessGuidedFacts,
    ),
    project(
      'security',
      security,
      securityMissions,
      securityNb.missions,
      (id) => securityHref('studio') + '&perspective=' + id,
      securityHref('assessment'),
      securityGuidedFacts,
    ),
    project(
      'cost',
      cost,
      costMissions,
      costNb.missions,
      (id) => costHref(id),
      costHref('assessment'),
      guidedCostFacts,
      false,
    ),
    project(
      'governance',
      governance,
      governanceMissions,
      governanceNb.missions,
      (id) => governanceHref('studio') + '&perspective=' + id,
      governanceHref('assessment'),
      (g) => ({
        ...governanceGuidedFacts(g, governance.policyEvidence(g).complete),
        valid:
          g.mission !== 'policy' ||
          g.attempt === technical.attemptNumber ||
          governance.policyEvidence(g).complete,
      }),
    ),
    project(
      'management-tools',
      tools,
      toolsMissions,
      toolsNb.missions,
      (id) => toolsHref('studio') + '&perspective=' + id,
      toolsHref('assessment'),
      (g) => ({
        ...toolsGuidedFacts(g, tools.nativeEvidence(g).complete),
        valid:
          g.mission !== 'intent' ||
          g.attempt === technical.attemptNumber ||
          tools.nativeEvidence(g).complete,
      }),
    ),
    project(
      'monitoring',
      monitoring,
      monitoringMissions,
      monitoringNb.missions,
      (id) => monitoringHref('studio') + '&perspective=' + id,
      monitoringHref('assessment'),
      monitoringGuidedFacts,
    ),
    project(
      'migration',
      migration,
      migrationMissions,
      migrationNb.missions,
      (id) => migrationHref('studio') + '&perspective=' + id,
      migrationHref('assessment'),
      migrationGuidedFacts,
    ),
  ];
}

const GuidedContext = createContext<GuidedModule[]>([]);
export function GuidedLearning({ children }: { children: React.ReactNode }) {
  return <GuidedContext.Provider value={useProjectedGuides()}>{children}</GuidedContext.Provider>;
}
export const useGuidedLearning = () => useContext(GuidedContext);
