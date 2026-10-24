import { learningFacts, type LearningSave } from '@/domain/curriculum/foundations';
import { unitIds } from '@/domain/curriculum/manifest';
import { currentStage, findings, type Attempt } from '@/domain/chapter01/scenario';
import { storyFacts, type Story } from './story';
import { spawn, type PlaceId, type Pose } from './world';

export const journeyGoals = [
  'welcome',
  'foundations',
  'service',
  'assignment',
  'infrastructure',
  'debrief',
] as const;
export type JourneyGoal = (typeof journeyGoals)[number];
export type JourneyStatus = 'available' | 'in-progress' | 'guided-completed';
export const goalPlaces: Record<JourneyGoal, PlaceId> = {
  welcome: 'guide',
  foundations: 'installation',
  service: 'installation',
  assignment: 'engineer',
  infrastructure: 'portal',
  debrief: 'engineer',
};
/** Read-only projection. Preferences, visits and XP cannot satisfy a learning predicate. */
export function expeditionFacts(
  learning: LearningSave,
  story: Story & { pose?: Pose; returnPending?: boolean },
  attempt: Attempt,
) {
  const lesson = learningFacts(learning);
  const built = currentStage(attempt) === 'guided-built';
  const hasWork = attempt.events.length > 0;
  const quest = storyFacts(story, { guidedBuilt: built, hasWork });
  const nextUnit = unitIds.find((id) => !lesson.observations[id].guided) ?? learning.unit;
  const recommended: JourneyGoal =
    hasWork && !built
      ? 'infrastructure'
      : built && !quest.reported
        ? 'debrief'
        : quest.accepted && !built
          ? quest.canEnter
            ? 'infrastructure'
            : 'service'
          : !lesson.guidedComplete
            ? 'foundations'
            : !quest.compared || !quest.challenge
              ? 'service'
              : !quest.accepted
                ? 'assignment'
                : !built
                  ? 'infrastructure'
                  : 'debrief';
  const statuses: Record<JourneyGoal, JourneyStatus> = {
    welcome: 'available', // orientation is not a competency
    foundations: lesson.guidedComplete
      ? 'guided-completed'
      : learning.events.length
        ? 'in-progress'
        : 'available',
    service:
      quest.compared && quest.challenge
        ? 'guided-completed'
        : quest.compared || story.events.some((e) => e.kind === 'model' || e.kind === 'answer')
          ? 'in-progress'
          : 'available',
    assignment: quest.accepted
      ? quest.reported
        ? 'guided-completed'
        : 'in-progress'
      : 'available',
    infrastructure: built ? 'guided-completed' : hasWork ? 'in-progress' : 'available',
    debrief: quest.reported ? 'guided-completed' : 'available',
  };
  return {
    lesson,
    quest,
    built,
    hasWork,
    nextUnit,
    recommended,
    statuses,
    findings: findings(attempt),
    stage: currentStage(attempt),
    hasHistory: learning.events.length > 0 || story.events.length > 0 || hasWork,
    hasNavigationHistory:
      story.returnPending === true ||
      (!!story.pose &&
        (story.pose.x !== spawn.x || story.pose.z !== spawn.z || story.pose.yaw !== spawn.yaw)),
    hasModels: story.events.some((e) => e.kind === 'model'),
    metGuide: story.events.some((e) => e.kind === 'meet' && e.npc === 'guide'),
    metEngineer: story.events.some((e) => e.kind === 'meet' && e.npc === 'engineer'),
    lastUnit: learning.events.some((e) => 'unit' in e) ? learning.unit : null,
  };
}

export const orientationKey = 'azurelab.orientation.v1';
export interface Orientation {
  schema: 1;
  seen: boolean;
  goal: JourneyGoal | null;
}
export const freshOrientation = (): Orientation => ({ schema: 1, seen: false, goal: null });
export function parseOrientation(raw: string | null): Orientation | null {
  if (raw === null) return freshOrientation();
  try {
    if (raw.length > 500) return null;
    const s = JSON.parse(raw);
    return s &&
      Object.keys(s).sort().join(',') === 'goal,schema,seen' &&
      s.schema === 1 &&
      typeof s.seen === 'boolean' &&
      (s.goal === null || journeyGoals.includes(s.goal))
      ? s
      : null;
  } catch {
    return null;
  }
}
