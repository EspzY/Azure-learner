import { trackUnits } from '../../src/domain/curriculum/expansion';
import { physicalTopics } from '../../src/domain/curriculum/architecture-physical';
import { managementTopics } from '../../src/domain/curriculum/architecture-management';
import { computeTopics } from '../../src/domain/curriculum/compute';
import { networkingTopics } from '../../src/domain/curriculum/networking';
import { connectivityTopics } from '../../src/domain/curriculum/connectivity';
import { storageTopics } from '../../src/domain/curriculum/storage';
import { resilienceTopics } from '../../src/domain/curriculum/storage-resilience';
import { migrationTopics } from '../../src/domain/curriculum/migration';
import { identityTopics } from '../../src/domain/curriculum/identity-foundations';
import { accessTopics } from '../../src/domain/curriculum/access-control';
import { securityTopics } from '../../src/domain/curriculum/security';
import { costTopics } from '../../src/domain/curriculum/cost';
import { governanceTopics } from '../../src/domain/curriculum/governance';
import { toolsTopics } from '../../src/domain/curriculum/management-tools';
import { monitoringTopics } from '../../src/domain/curriculum/monitoring';
import { cloudRecommendedTopics } from '../../src/features/course/cloud-computing-chapters';
import type { CourseModule } from '../../src/domain/course/model';

/** Test adapter over the actual bank/topic metadata selected by Course; no progress authority. */
export const az900RecommendedTopics = {
  computing: cloudRecommendedTopics,
  benefits: [...trackUnits.benefits, 'summary', 'transfer'],
  services: [...trackUnits.services, 'summary', 'transfer'],
  architecture: [...physicalTopics, ...managementTopics],
  compute: computeTopics,
  networking: networkingTopics,
  connectivity: connectivityTopics,
  storage: storageTopics,
  'storage-resilience': resilienceTopics,
  migration: migrationTopics,
  identity: identityTopics,
  'access-control': accessTopics,
  security: securityTopics,
  cost: costTopics,
  governance: governanceTopics,
  'management-tools': toolsTopics,
  monitoring: monitoringTopics,
} satisfies Record<CourseModule, readonly string[]>;
