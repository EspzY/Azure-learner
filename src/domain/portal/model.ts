import {
  execute,
  relations,
  types,
  type Engine,
  type World,
  type Command,
} from '../chapter01/model';
export const areas = [
  'home',
  'services',
  'subscriptions',
  'groups',
  'resources',
  'apps',
  'plans',
  'activity',
  'resource',
  'create',
  'learn',
  'responsibility',
  'hierarchy',
  'architecture',
  'policy',
  'challenge',
] as const;
export type Area = (typeof areas)[number];
export const topics = ['overview', 'iaas', 'paas', 'saas', 'selection', 'practice'] as const;
export type Topic = (typeof topics)[number];
export type CreateKind = 'group' | 'plan' | 'app';
export interface PortalLocation {
  area: Area;
  id: string;
  kind: CreateKind;
  module: 'services' | 'computing';
  topic: string;
  mode: 'learn' | 'guided' | 'independent';
  edit: string;
}
export function parseLocation(query: URLSearchParams): PortalLocation {
  const area = query.get('area') ?? 'home',
    mode = query.get('mode') ?? 'learn';
  return {
    area: areas.includes(area as Area) ? (area as Area) : 'home',
    id: /^[a-zA-Z0-9_-]{1,64}$/.test(query.get('id') ?? '') ? query.get('id')! : '',
    kind: query.get('kind') === 'plan' ? 'plan' : query.get('kind') === 'app' ? 'app' : 'group',
    module: query.get('module') === 'computing' ? 'computing' : 'services',
    topic: [
      ...topics,
      'capacity',
      'responsibility',
      'models',
      'placement',
      'metering',
      'pricing',
      'assessment',
      'summary',
    ].includes(query.get('topic') ?? '')
      ? query.get('topic')!
      : 'overview',
    mode:
      area === 'challenge'
        ? 'independent'
        : mode === 'guided' || mode === 'independent'
          ? mode
          : 'learn',
    edit: /^[a-zA-Z0-9_-]{1,64}$/.test(query.get('edit') ?? '') ? query.get('edit')! : '',
  };
}
export function portalHref(
  location: PortalLocation,
  area: Area,
  change: Partial<PortalLocation> = {},
) {
  const next = { ...location, area, id: '', edit: '', ...change };
  const query = new URLSearchParams({
    area: next.area,
    module: next.module,
    topic: next.topic,
    mode: next.mode,
  });
  if (next.id) query.set('id', next.id);
  if (next.area === 'create') query.set('kind', next.kind);
  if (next.edit) query.set('edit', next.edit);
  return `/portal?${query}`;
}
export type InventoryKind = 'subscription' | 'group' | 'plan' | 'app';
export interface InventoryRow {
  id: string;
  name: string;
  kind: InventoryKind;
  type: string;
  subscriptionId: string;
  groupId?: string;
  location?: string;
  planId?: string;
}
export function inventory(world: World): InventoryRow[] {
  return [
    ...world.scopes
      .filter((s) => s.kind === 'subscription')
      .map((s) => ({
        id: s.id,
        name: s.name,
        kind: 'subscription' as const,
        type: 'Microsoft.Resources/subscriptions',
        subscriptionId: s.id,
      })),
    ...world.groups.map((g) => ({
      id: g.id,
      name: g.name,
      kind: 'group' as const,
      type: types.group,
      subscriptionId: g.subscriptionId,
      location: g.metadataLocation,
    })),
    ...world.resources.map((r) => ({
      id: r.id,
      name: r.name,
      kind: r.type === types.plan ? ('plan' as const) : ('app' as const),
      type: r.type,
      subscriptionId: world.groups.find((g) => g.id === r.groupId)!.subscriptionId,
      groupId: r.groupId,
      location: r.location,
      ...(r.type === types.app ? { planId: r.planId } : {}),
    })),
  ];
}
const normalize = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
export function resourceInventory(world: World) {
  return inventory(world).filter((row) => row.kind === 'plan' || row.kind === 'app');
}
export function filterInventory(rows: InventoryRow[], query: string, subscription = '', kind = '') {
  const needle = normalize(query.trim());
  return rows.filter(
    (r) =>
      (!subscription || r.subscriptionId === subscription) &&
      (!kind || r.kind === kind) &&
      normalize(`${r.name} ${r.type}`).includes(needle),
  );
}
export function commandFor(
  kind: CreateKind,
  values: { name: string; subscription: string; group: string; region: string; plan: string },
): Command {
  return kind === 'group'
    ? {
        type: 'CreateGroup',
        name: values.name,
        subscriptionId: values.subscription,
        metadataRegion: values.region,
      }
    : kind === 'plan'
      ? {
          type: 'CreatePlan',
          name: values.name,
          groupId: values.group,
          region: values.region,
          profile: 'linux-learning-v1',
        }
      : { type: 'CreateWebApp', name: values.name, groupId: values.group, planId: values.plan };
}
/** Resource-menu creation must preserve the selected scope, including the non-default subscription. */
export function creationContext(world: World, contextId: string, prior?: Record<string, unknown>) {
  const resource = world.resources.find((r) => r.id === contextId);
  const groupId =
    typeof prior?.groupId === 'string'
      ? prior.groupId
      : world.groups.some((g) => g.id === contextId)
        ? contextId
        : resource?.groupId;
  const group = world.groups.find((g) => g.id === groupId);
  const subscription =
    typeof prior?.subscriptionId === 'string'
      ? prior.subscriptionId
      : world.scopes.some((s) => s.id === contextId && s.kind === 'subscription')
        ? contextId
        : (group?.subscriptionId ?? 'sub-app');
  return {
    subscription,
    group: groupId ?? world.groups.find((g) => g.subscriptionId === subscription)?.id ?? '',
    plan:
      typeof prior?.planId === 'string'
        ? prior.planId
        : resource?.type === types.plan
          ? resource.id
          : '',
  };
}
export function requestFor(engine: Engine, command: Command, sequence: number, review = false) {
  return {
    commandId: `${review ? 'review' : 'portal'}-${sequence}`,
    expectedWorldRevision: engine.world.revision,
    command: { ...command },
  };
}
export function reviewCommand(engine: Engine, command: Command, sequence: number) {
  return execute(engine, requestFor(engine, command, sequence, true)).receipt;
}
export function projectArchitecture(
  world: World,
  lens: 'architecture' | 'hierarchy' = 'architecture',
) {
  const nodes: {
    id: string;
    name: string;
    kind: string;
    location?: string;
    x: number;
    y: number;
  }[] = [{ id: world.identity.id, name: world.identity.name, kind: 'tenant', x: 200, y: 0 }];
  for (const s of world.scopes)
    nodes.push({
      id: s.id,
      name: s.name,
      kind: s.kind,
      x: s.id === 'sub-shared' ? 650 : 200,
      y: s.kind === 'root' ? 110 : s.kind === 'management' ? 220 : 340,
    });
  world.groups.forEach((g, i) => {
    const x = i * 650;
    nodes.push({ id: g.id, name: g.name, kind: 'group', location: g.metadataLocation, x, y: 480 });
    const resources = world.resources.filter((r) => r.groupId === g.id);
    resources.forEach((r, j) =>
      nodes.push({
        id: r.id,
        name: r.name,
        kind: r.type === types.plan ? 'plan' : 'app',
        location: r.location,
        x: x + j * 250,
        y: r.type === types.plan ? 650 : 820,
      }),
    );
  });
  world.policies.forEach((p, i) =>
    nodes.push({ id: p.id, name: p.id, kind: 'policy', x: 1100 + i * 270, y: 340 }),
  );
  const edges = [
    ...relations(world),
    ...world.policies.map((p) => ({ kind: 'policy-scope' as const, from: p.id, to: p.scopeId })),
  ];
  const visible = nodes
    .filter((n) =>
      lens === 'hierarchy'
        ? n.kind !== 'policy'
        : !['tenant', 'root', 'management'].includes(n.kind),
    )
    .map((n) =>
      lens === 'hierarchy'
        ? n
        : {
            ...n,
            x:
              n.kind === 'subscription'
                ? n.id === 'sub-shared'
                  ? 450
                  : 0
                : n.kind === 'policy'
                  ? 800
                  : n.x,
            y:
              n.kind === 'subscription'
                ? 0
                : n.kind === 'policy'
                  ? 140
                  : n.kind === 'group'
                    ? 160
                    : n.kind === 'plan'
                      ? 320
                      : 480,
          },
    );
  const visibleIds = new Set(visible.map((n) => n.id));
  return {
    nodes: visible,
    edges: edges
      .filter(
        (e) =>
          visibleIds.has(e.from) &&
          visibleIds.has(e.to) &&
          (lens !== 'hierarchy' || (e.kind !== 'depends-on' && e.kind !== 'policy-scope')),
      )
      .map((e, i) => ({ ...e, id: `${e.kind}-${e.from}-${e.to}-${i}` })),
  };
}
