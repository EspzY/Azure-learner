import { createResourceGroup, initialSimulation, type Simulation } from './simulation';

export const stops = [
  'arrival',
  'models',
  'decision',
  'crossing',
  'ownership',
  'gateway',
  'horizon',
] as const;
export type Stop = (typeof stops)[number];
export const routeGraph: Record<
  Stop,
  { next?: Stop; previous?: Stop; kind: 'route' | 'teaching' | 'detour' | 'portal' | 'preview' }
> = {
  arrival: { next: 'models', kind: 'route' },
  models: { next: 'decision', previous: 'arrival', kind: 'teaching' },
  decision: { next: 'crossing', previous: 'models', kind: 'detour' },
  crossing: { next: 'ownership', previous: 'models', kind: 'route' },
  ownership: { next: 'gateway', previous: 'crossing', kind: 'detour' },
  gateway: { next: 'horizon', previous: 'crossing', kind: 'portal' },
  horizon: { next: 'models', previous: 'gateway', kind: 'preview' },
};
export const serviceModels = ['iaas', 'paas', 'saas'] as const;
export type ServiceModel = (typeof serviceModels)[number];
export const layers = [
  'physical',
  'os',
  'runtime',
  'application',
  'network',
  'settings',
  'identity',
  'data',
] as const;
export type Layer = (typeof layers)[number];
export type Owner = 'customer' | 'microsoft' | 'shared';
export function responsibility(model: ServiceModel, layer: Layer): Owner {
  if (['data', 'identity', 'settings'].includes(layer)) return 'customer';
  if (layer === 'physical') return 'microsoft';
  if (model === 'iaas') return 'customer';
  if (layer === 'application') return 'shared';
  if (layer === 'network' && model === 'paas') return 'shared';
  return 'microsoft';
}

export type ChallengeId = 'service-fit' | 'retained-control';
export interface DetourDefinition {
  id: ChallengeId;
  version: 1;
  objectives: readonly string[];
  trigger: Stop;
  returnTo: Stop;
  interaction: 'decision' | 'allocate';
  evaluator: 'choose-paas' | 'retain-data-identity';
  sourceIds: readonly string[];
  assistance: 'explain-after-attempt';
  retry: 'unlimited';
  reward: 0;
  accessible: 'radio-group' | 'checkbox-group';
}
export const detours: readonly DetourDefinition[] = [
  {
    id: 'service-fit',
    version: 1,
    objectives: ['F01'],
    trigger: 'decision',
    returnTo: 'crossing',
    interaction: 'decision',
    evaluator: 'choose-paas',
    sourceIds: ['S01', 'S12'],
    assistance: 'explain-after-attempt',
    retry: 'unlimited',
    reward: 0,
    accessible: 'radio-group',
  },
  {
    id: 'retained-control',
    version: 1,
    objectives: ['F01', 'I01'],
    trigger: 'ownership',
    returnTo: 'gateway',
    interaction: 'allocate',
    evaluator: 'retain-data-identity',
    sourceIds: ['S01'],
    assistance: 'explain-after-attempt',
    retry: 'unlimited',
    reward: 0,
    accessible: 'checkbox-group',
  },
];
export function evaluateDetour(id: ChallengeId, answer: string): boolean {
  return id === 'service-fit' ? answer === 'paas' : answer === 'data,identity';
}
export function validAnswer(id: ChallengeId, answer: unknown): answer is string {
  if (typeof answer !== 'string') return false;
  if (id === 'service-fit') return serviceModels.includes(answer as ServiceModel);
  const parts = answer === '' ? [] : answer.split(',');
  return (
    parts.length <= 4 &&
    new Set(parts).size === parts.length &&
    parts.every((part) => ['data', 'identity', 'os', 'physical'].includes(part)) &&
    parts.join(',') === [...parts].sort().join(',')
  );
}
export interface Attempt {
  answer: string;
}
export interface GroupCommand {
  name: string;
  region: string;
  subscriptionId: string;
}
export interface Expedition {
  version: 1;
  stop: Stop;
  visited: Stop[];
  model: ServiceModel;
  layer: Layer;
  attempts: Record<ChallengeId, Attempt[]>;
  commands: GroupCommand[];
  missionActive: boolean;
}
export const expeditionKey = 'azurelab.expedition.v1';
export const emptyExpedition: Expedition = {
  version: 1,
  stop: 'arrival',
  visited: ['arrival'],
  model: 'iaas',
  layer: 'os',
  attempts: { 'service-fit': [], 'retained-control': [] },
  commands: [],
  missionActive: false,
};
export function isStop(value: unknown): value is Stop {
  return stops.includes(value as Stop);
}
export function replayCommands(commands: readonly GroupCommand[]): Simulation {
  let state = initialSimulation;
  for (const command of commands) {
    const result = createResourceGroup(state, command);
    if (!result.ok) return initialSimulation;
    state = result.state;
  }
  return state;
}
export function parseExpedition(raw: string | null): Expedition {
  try {
    if (!raw || raw.length > 24_000) return emptyExpedition;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return emptyExpedition;
    const data = value as Record<string, unknown>;
    if (data.version !== 1) return emptyExpedition;
    const commands: GroupCommand[] = [];
    let state = initialSimulation;
    if (Array.isArray(data.commands) && data.commands.length <= 3) {
      for (const item of data.commands) {
        if (!item || typeof item !== 'object') break;
        const c = item as Record<string, unknown>;
        if (
          typeof c.name !== 'string' ||
          typeof c.region !== 'string' ||
          typeof c.subscriptionId !== 'string'
        )
          break;
        const command = { name: c.name, region: c.region, subscriptionId: c.subscriptionId };
        const result = createResourceGroup(state, command);
        if (!result.ok) break;
        commands.push(command);
        state = result.state;
      }
    }
    const attempts = { 'service-fit': [], 'retained-control': [] } as Expedition['attempts'];
    if (data.attempts && typeof data.attempts === 'object') {
      for (const { id } of detours) {
        const list = (data.attempts as Record<string, unknown>)[id];
        if (Array.isArray(list))
          attempts[id] = list.slice(-20).flatMap((item: unknown) => {
            if (!item || typeof item !== 'object') return [];
            const answer = (item as Record<string, unknown>).answer;
            return validAnswer(id, answer) ? [{ answer }] : [];
          });
      }
    }
    return {
      version: 1,
      stop: isStop(data.stop) ? data.stop : 'arrival',
      visited: Array.isArray(data.visited)
        ? [...new Set(data.visited.filter(isStop))].slice(0, stops.length)
        : ['arrival'],
      model: serviceModels.includes(data.model as ServiceModel)
        ? (data.model as ServiceModel)
        : 'iaas',
      layer: layers.includes(data.layer as Layer) ? (data.layer as Layer) : 'os',
      attempts,
      commands,
      missionActive: data.missionActive === true,
    };
  } catch {
    return emptyExpedition;
  }
}
export function recordAttempt(state: Expedition, id: ChallengeId, answer: string): Expedition {
  if (!validAnswer(id, answer)) return state;
  const list = state.attempts[id];
  // Keep successful guided participation through retries, with a bounded local history.
  const firstSuccess = list.find((attempt) => evaluateDetour(id, attempt.answer));
  const recent = [...list, { answer }].slice(-19);
  return {
    ...state,
    attempts: { ...state.attempts, [id]: firstSuccess ? [firstSuccess, ...recent] : recent },
  };
}
export function detourCompleted(state: Expedition, id: ChallengeId): boolean {
  return state.attempts[id].some((attempt) => evaluateDetour(id, attempt.answer));
}
