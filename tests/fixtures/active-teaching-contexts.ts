import {
  freshLearning,
  applyLearning,
  learningKey,
  restoreLearning,
  learningFacts,
} from '../../src/domain/curriculum/foundations';
import {
  freshV2,
  applyV2,
  foundationsV2Key,
  restoreV2,
  v2Facts,
} from '../../src/domain/curriculum/foundations-v2';
import {
  freshServerless,
  applyServerless,
  serverlessKey,
  restoreServerless,
  serverlessFacts,
} from '../../src/domain/curriculum/serverless';
import {
  freshPhysical,
  applyPhysical,
  physicalKey,
  restorePhysical,
  physicalFacts,
} from '../../src/domain/curriculum/architecture-physical';
import {
  freshManagement,
  applyManagement,
  managementKey,
  restoreManagement,
  managementFacts,
} from '../../src/domain/curriculum/architecture-management';
import {
  freshServices,
  applyModuleEvent,
  serviceLearningKey,
  restoreServices,
  serviceFacts,
} from '../../src/domain/portal/learning';
import { fresh, apply, restore, expansionKeys, facts } from '../../src/domain/curriculum/expansion';
import {
  freshPractical,
  applyPractical,
  restorePractical,
  practicalKey,
  practicalFacts,
} from '../../src/domain/sandbox/practical';
function fixture<S>(
  key: string,
  save: S | null,
  parse: (raw: string | null) => { save: S; issue: string | null },
  state: (save: S) => { active: boolean; assisted: boolean },
) {
  if (!save) throw Error('invalid active-context test fixture: ' + key);
  const raw = JSON.stringify(save);
  if (parse(raw).issue || !state(save).active || state(save).assisted)
    throw Error('not a fresh unaided fixture: ' + key);
  return {
    key,
    raw,
    state: (raw: string | null) => {
      const r = parse(raw);
      if (r.issue) throw Error(r.issue);
      return state(r.save);
    },
  };
}
/** Valid records from frozen reducers, never new runtime curriculum. */
export function activeTeachingContexts() {
  return [
    fixture(
      managementKey,
      applyManagement(freshManagement(), { kind: 'begin' }),
      restoreManagement,
      managementFacts,
    ),
    fixture(
      physicalKey,
      applyPhysical(freshPhysical(), { kind: 'begin' }),
      restorePhysical,
      physicalFacts,
    ),
    fixture(
      serverlessKey,
      applyServerless(freshServerless(), { kind: 'begin' }),
      restoreServerless,
      serverlessFacts,
    ),
    fixture(
      learningKey,
      applyLearning(freshLearning(), { kind: 'begin-transfer' }),
      restoreLearning,
      learningFacts,
    ),
    fixture(foundationsV2Key, applyV2(freshV2(), { kind: 'begin' }), restoreV2, v2Facts),
    fixture(
      serviceLearningKey,
      applyModuleEvent(freshServices(), { kind: 'begin', boundary: null, attemptNumber: 1 }),
      restoreServices,
      serviceFacts,
    ),
    fixture(
      expansionKeys.benefits,
      apply(fresh('benefits'), { kind: 'begin' }),
      (raw) => restore('benefits', raw),
      facts,
    ),
    fixture(
      expansionKeys.services,
      apply(fresh('services'), { kind: 'begin' }),
      (raw) => restore('services', raw),
      facts,
    ),
    fixture(
      practicalKey,
      applyPractical(freshPractical(), {
        type: 'start',
        kind: 'paas',
        mode: 'independent',
        origin: { module: 'services', topic: 'paas' },
        attempt: 1,
        boundary: null,
      }),
      (raw) => ({ save: restorePractical(raw), issue: null }),
      (save) => {
        const f = practicalFacts(save);
        return { active: f.activeIndependent, assisted: !!f.current?.aided };
      },
    ),
  ];
}
