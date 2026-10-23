import {
  execute,
  freshEngine,
  parseRequest,
  types,
  type Engine,
  type Receipt,
  type Request,
  type Group,
  type Plan,
  type WebApp,
} from './model';

export const chapterDefinition = {
  id: 'chapter-01-guided',
  version: '1.0.0',
  modelVersion: 'organization-web@1.0.0',
  objectives: ['F01', 'G01', 'F02', 'G02', 'C01', 'G03'],
  sourceIds: ['S01', 'S03', 'S04', 'S07', 'S12', 'S38'],
  constraints: {
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
    probeRegion: 'northeurope',
  },
  stages: [
    { id: 'responsibility', evaluator: 'responsibility-fit@1' },
    { id: 'organize', evaluator: 'group-in-target-scope@1' },
    { id: 'predict', evaluator: 'pre-result-prediction@1' },
    { id: 'investigate', evaluator: 'deny-observed@1' },
    { id: 'construct', evaluator: 'web-hosting-valid@1' },
    { id: 'explain', evaluator: 'location-policy-cause@1' },
  ],
  award: null,
  classification: 'guided-local-unverified',
} as const;
export type StageId = (typeof chapterDefinition.stages)[number]['id'] | 'guided-built';
export type Role = 'group' | 'plan' | 'app';
export type Event =
  | {
      kind: 'responsibility';
      model: 'iaas' | 'paas' | 'saas';
      os: 'customer' | 'microsoft';
      code: 'customer' | 'microsoft';
    }
  | { kind: 'command'; request: Request; bindResult: boolean }
  | { kind: 'bind'; role: Role; id: string }
  | {
      kind: 'prediction';
      placement: 'metadata-independent' | 'metadata-forces-location';
      appLocation: 'plan-determines-app-location' | 'group-determines-app-location';
    }
  | { kind: 'probe'; groupId: string }
  | { kind: 'inspect-receipt'; commandId: string }
  | { kind: 'inspect-policy' }
  | {
      kind: 'explain';
      placement: 'metadata-independent' | 'metadata-forces-location';
      appLocation: 'plan-determines-app-location' | 'group-determines-app-location';
      remedy: 'policy-targets-resource-location' | 'change-group-metadata' | 'remove-plan-link';
    };
export interface Attempt {
  engine: Engine;
  events: Event[];
  bindings: Partial<Record<Role, string>>;
  responsibility?: Extract<Event, { kind: 'responsibility' }>;
  prediction?: Extract<Event, { kind: 'prediction' }> & {
    beforeResult: boolean;
    worldRevision: number;
  };
  explanation?: Extract<Event, { kind: 'explain' }>;
  responses: (Receipt & { probe?: boolean })[];
  inspectedReceipts: string[];
  policyInspected: boolean;
}
export const freshAttempt = (): Attempt => ({
  engine: freshEngine(),
  events: [],
  bindings: {},
  responses: [],
  inspectedReceipts: [],
  policyInspected: false,
});
export function roleEntities(attempt: Attempt) {
  const { world } = attempt.engine;
  return {
    group: world.groups.find((item) => item.id === attempt.bindings.group),
    plan: world.resources.find(
      (item): item is Plan => item.id === attempt.bindings.plan && item.type === types.plan,
    ),
    app: world.resources.find(
      (item): item is WebApp => item.id === attempt.bindings.app && item.type === types.app,
    ),
  };
}
const groupFits = (group?: Group) =>
  group?.subscriptionId === chapterDefinition.constraints.subscriptionId &&
  group.metadataLocation === chapterDefinition.constraints.metadataRegion;
export const objectiveEvaluators = {
  'responsibility-fit@1': (a: Attempt) =>
    a.responsibility?.model === 'paas' &&
    a.responsibility.os === 'microsoft' &&
    a.responsibility.code === 'customer',
  'group-in-target-scope@1': (a: Attempt) => groupFits(roleEntities(a).group),
  'pre-result-prediction@1': (a: Attempt) => a.prediction?.beforeResult === true,
  'deny-observed@1': (a: Attempt) =>
    a.policyInspected &&
    a.responses.some(
      (r) => r.code === 'policy-location-denied' && a.inspectedReceipts.includes(r.commandId),
    ),
  'web-hosting-valid@1': (a: Attempt) => {
    const { group, plan, app } = roleEntities(a);
    return !!(
      groupFits(group) &&
      plan &&
      app &&
      plan.groupId === group!.id &&
      app.groupId === group!.id &&
      app.planId === plan.id &&
      app.location === plan.location &&
      plan.location === 'westeurope'
    );
  },
  'location-policy-cause@1': (a: Attempt) =>
    a.explanation?.placement === 'metadata-independent' &&
    a.explanation.appLocation === 'plan-determines-app-location' &&
    a.explanation.remedy === 'policy-targets-resource-location',
} as const;
export function findings(attempt: Attempt) {
  return chapterDefinition.stages.map((stage) => ({
    id: stage.id,
    met: objectiveEvaluators[stage.evaluator](attempt),
  }));
}
export function currentStage(attempt: Attempt): StageId {
  return findings(attempt).find((item) => !item.met)?.id ?? 'guided-built';
}
export function applyEvent(attempt: Attempt, event: Event): Attempt | null {
  if (attempt.events.length >= 500) return null;
  const next: Attempt = { ...attempt, events: [...attempt.events, event] };
  switch (event.kind) {
    case 'responsibility':
      next.responsibility = event;
      break;
    case 'command': {
      const result = execute(attempt.engine, event.request);
      next.engine = result.engine;
      next.responses = [...attempt.responses, result.receipt];
      if (event.bindResult && result.receipt.outcome === 'accepted' && result.receipt.addedIds[0]) {
        const id = result.receipt.addedIds[0];
        const world = result.engine.world;
        const role = world.groups.some((item) => item.id === id)
          ? 'group'
          : world.resources.find((item) => item.id === id)?.type === types.plan
            ? 'plan'
            : world.resources.some((item) => item.id === id)
              ? 'app'
              : null;
        if (role) next.bindings = { ...attempt.bindings, [role]: id };
      }
      break;
    }
    case 'bind': {
      const world = attempt.engine.world;
      const valid =
        event.role === 'group'
          ? world.groups.some((item) => item.id === event.id)
          : world.resources.some(
              (item) =>
                item.id === event.id &&
                item.type === (event.role === 'plan' ? types.plan : types.app),
            );
      if (!valid) return null;
      next.bindings = { ...attempt.bindings, [event.role]: event.id };
      break;
    }
    case 'prediction':
      if (attempt.prediction) return null;
      next.prediction = {
        ...event,
        beforeResult: !attempt.events.some(
          (item) => item.kind === 'command' && item.request.command.type === 'CreatePlan',
        ),
        worldRevision: attempt.engine.world.revision,
      };
      break;
    case 'probe': {
      const group = attempt.engine.world.groups.find((item) => item.id === event.groupId);
      if (!groupFits(group)) return null;
      const result = execute(
        { world: attempt.engine.world, ledger: [] },
        {
          commandId: `probe-${attempt.events.length + 1}`,
          expectedWorldRevision: attempt.engine.world.revision,
          command: {
            type: 'CreatePlan',
            groupId: event.groupId,
            name: 'probe-location',
            region: chapterDefinition.constraints.probeRegion,
            profile: 'linux-learning-v1',
          },
        },
      );
      next.responses = [...attempt.responses, { ...result.receipt, probe: true }];
      break;
    }
    case 'inspect-receipt':
      if (!attempt.responses.some((item) => item.commandId === event.commandId)) return null;
      next.inspectedReceipts = [...new Set([...attempt.inspectedReceipts, event.commandId])];
      break;
    case 'inspect-policy':
      next.policyInspected = true;
      break;
    case 'explain':
      next.explanation = event;
      break;
  }
  return next;
}
const placement = ['metadata-independent', 'metadata-forces-location'];
const appLocation = ['plan-determines-app-location', 'group-determines-app-location'];
export function parseEvent(raw: unknown): Event | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const e = raw as Record<string, unknown>;
  const keys: Record<Event['kind'], string[]> = {
    responsibility: ['kind', 'model', 'os', 'code'],
    command: ['kind', 'request', 'bindResult'],
    bind: ['kind', 'role', 'id'],
    prediction: ['kind', 'placement', 'appLocation'],
    probe: ['kind', 'groupId'],
    'inspect-receipt': ['kind', 'commandId'],
    'inspect-policy': ['kind'],
    explain: ['kind', 'placement', 'appLocation', 'remedy'],
  };
  if (
    typeof e.kind !== 'string' ||
    !Object.hasOwn(keys, e.kind) ||
    Object.keys(e).some((key) => !keys[e.kind as Event['kind']]!.includes(key))
  )
    return null;
  const text = (value: unknown): value is string =>
    typeof value === 'string' && value.length > 0 && value.length <= 120;
  switch (e.kind) {
    case 'responsibility':
      return ['iaas', 'paas', 'saas'].includes(e.model as string) &&
        ['customer', 'microsoft'].includes(e.os as string) &&
        ['customer', 'microsoft'].includes(e.code as string)
        ? ({ kind: 'responsibility', model: e.model, os: e.os, code: e.code } as Event)
        : null;
    case 'command': {
      const request = parseRequest(e.request);
      return request && typeof e.bindResult === 'boolean'
        ? { kind: 'command', request, bindResult: e.bindResult }
        : null;
    }
    case 'bind':
      return ['group', 'plan', 'app'].includes(e.role as string) && text(e.id)
        ? ({ kind: 'bind', role: e.role, id: e.id } as Event)
        : null;
    case 'prediction':
      return placement.includes(e.placement as string) &&
        appLocation.includes(e.appLocation as string)
        ? ({ kind: 'prediction', placement: e.placement, appLocation: e.appLocation } as Event)
        : null;
    case 'probe':
      return text(e.groupId) ? { kind: 'probe', groupId: e.groupId } : null;
    case 'inspect-receipt':
      return text(e.commandId) ? { kind: 'inspect-receipt', commandId: e.commandId } : null;
    case 'inspect-policy':
      return { kind: 'inspect-policy' };
    case 'explain':
      return placement.includes(e.placement as string) &&
        appLocation.includes(e.appLocation as string) &&
        ['policy-targets-resource-location', 'change-group-metadata', 'remove-plan-link'].includes(
          e.remedy as string,
        )
        ? ({
            kind: 'explain',
            placement: e.placement,
            appLocation: e.appLocation,
            remedy: e.remedy,
          } as Event)
        : null;
    default:
      return null;
  }
}
