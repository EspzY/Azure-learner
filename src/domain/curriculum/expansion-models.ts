import { execute, freshEngine, type Receipt } from '../chapter01/model';
export type Input = Record<string, string | number>;
export const teachingPolicy = freshEngine().world.policies[0]!;
export interface Field {
  id: string;
  values: readonly (string | number)[];
}
const f = (id: string, ...values: (string | number)[]): Field => ({ id, values });
export const activities = {
  availability: {
    fields: [
      f('instances', 1, 2, 3),
      f('size', 4, 8),
      f('demand', 6, 10),
      f('failed', 'none', 'one'),
      f('routing', 'single', 'balanced'),
    ],
    initial: { instances: 1, size: 8, demand: 6, failed: 'none', routing: 'single' },
    required: ['baseline', 'singleFailure', 'redundant'],
  },
  reliability: {
    fields: [
      f('incident', 'capacity', 'instance', 'dependency', 'trend'),
      f('remedy', 'scale', 'reroute', 'restore', 'observe'),
    ],
    initial: { incident: 'capacity', remedy: 'observe' },
    required: ['capacity', 'instance', 'dependency', 'trend'],
  },
  governance: {
    fields: [f('subscription', 'sub-app', 'sub-shared'), f('region', 'northeurope', 'westeurope')],
    initial: { subscription: 'sub-app', region: 'northeurope' },
    required: ['denied', 'allowed', 'otherScope'],
  },
  management: {
    fields: [
      f('method', 'manual', 'template'),
      f('a', 'westeurope', 'northeurope'),
      f('b', 'westeurope', 'northeurope'),
      f('c', 'westeurope', 'northeurope'),
      f('template', 'westeurope', 'northeurope'),
    ],
    initial: {
      method: 'manual',
      a: 'westeurope',
      b: 'northeurope',
      c: 'westeurope',
      template: 'northeurope',
    },
    required: ['manual', 'rightTemplate', 'wrongTemplate'],
  },
  sustainability: {
    fields: [
      f('profile', 'dev', 'critical'),
      f('capacity', 4, 8),
      f('hours', 8, 24),
      f('copies', 1, 2),
    ],
    initial: { profile: 'dev', capacity: 8, hours: 24, copies: 1 },
    required: ['devAlways', 'devScheduled', 'critical'],
  },
  overview: {
    fields: [f('model', 'iaas', 'paas', 'saas')],
    initial: { model: 'paas' },
    required: ['iaas', 'paas', 'saas'],
  },
  iaas: {
    fields: [
      f('guest', 'linux', 'windows'),
      f('cpu', 2, 4),
      f('ram', 4, 8),
      f('disk', 'temporary', 'persistent'),
      f('network', 'missing', 'configured'),
      f('runtime', 'missing', 'installed'),
      f('patch', 'ignored', 'planned'),
    ],
    initial: {
      guest: 'linux',
      cpu: 2,
      ram: 4,
      disk: 'temporary',
      network: 'missing',
      runtime: 'missing',
      patch: 'ignored',
    },
    required: ['incomplete', 'complete'],
  },
  paas: {
    fields: [
      f('package', 'supported', 'unsupported', 'driver'),
      f('config', 'missing', 'set'),
      f('access', 'public', 'restricted'),
      f('data', 'missing', 'planned'),
    ],
    initial: { package: 'unsupported', config: 'missing', access: 'public', data: 'missing' },
    required: ['incompatible', 'supported'],
  },
  saas: {
    fields: [
      f('user', 'active', 'departed'),
      f('license', 'unlicensed', 'assigned'),
      f('role', 'user', 'admin'),
      f('sharing', 'team', 'everyone'),
    ],
    initial: { user: 'active', license: 'assigned', role: 'admin', sharing: 'everyone' },
    required: ['risky', 'safe', 'departure'],
  },
  selection: {
    fields: [
      f('scenario', 'legacy', 'custom', 'ready', 'open'),
      f('model', 'iaas', 'paas', 'saas'),
      f('reason', 'os-team', 'platform-supported', 'ready-service'),
    ],
    initial: { scenario: 'legacy', model: 'paas', reason: 'platform-supported' },
    required: ['legacy', 'custom', 'ready', 'open'],
  },
} satisfies Record<string, { fields: Field[]; initial: Input; required: string[] }>;
export type Activity = keyof typeof activities;
export interface Result {
  code: string;
  metrics: Record<string, number | string | null>;
  witnesses: string[];
  issues: string[];
  receipt?: Receipt;
  rows?: string[];
}
export function validInput(unit: Activity, raw: unknown): raw is Input {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const input = raw as Input,
    fields = activities[unit].fields;
  return (
    Object.keys(input).length === fields.length &&
    fields.every(
      (field) => Object.hasOwn(input, field.id) && field.values.includes(input[field.id]!),
    )
  );
}
/** Pure bounded teaching models; only governance invokes the existing engine, on an unsaved fork. */
export function experiment(unit: Activity, raw: unknown): Result | null {
  if (!validInput(unit, raw)) return null;
  const i = raw,
    witnesses: string[] = [],
    issues: string[] = [];
  const result = (
    code: string,
    metrics: Result['metrics'] = {},
    extra: Partial<Result> = {},
  ): Result => ({ code, metrics, witnesses, issues, ...extra });
  if (unit === 'availability') {
    const failed = i.failed === 'one' ? 1 : 0,
      n = Number(i.instances),
      size = Number(i.size),
      demand = Number(i.demand);
    const available = i.routing === 'single' ? (failed ? 0 : size) : (n - failed) * size;
    if (n === 1 && size === 8 && !failed) witnesses.push('baseline');
    if (n === 1 && size === 8 && failed) witnesses.push('singleFailure');
    if (n === 2 && size === 4 && failed && i.routing === 'balanced') witnesses.push('redundant');
    return result(available >= demand ? 'aligned' : 'capacityLimited', {
      available,
      served: Math.min(available, demand),
      unmet: Math.max(demand - available, 0),
      unused: Math.max(available - demand, 0),
    });
  }
  if (unit === 'reliability') {
    const correct =
      { capacity: 'scale', instance: 'reroute', dependency: 'restore', trend: 'observe' }[
        i.incident as string
      ] === i.remedy;
    if (correct) witnesses.push(String(i.incident));
    const code = {
      capacity: correct ? 'capacityFixed' : 'capacityLimited',
      instance: correct ? 'instanceFixed' : 'instanceDown',
      dependency: correct ? 'dependencyFixed' : 'dependencyDown',
      trend: correct ? 'trendPlanned' : 'trendUnplanned',
    }[i.incident as string]!;
    const demand = i.incident === 'capacity' ? 10 : 6,
      available =
        i.incident === 'capacity'
          ? correct
            ? 12
            : 6
          : i.incident === 'trend'
            ? 6
            : correct
              ? 6
              : 0;
    return result(code, {
      available,
      served: Math.min(demand, available),
      unmet: Math.max(0, demand - available),
    });
  }
  if (unit === 'governance') {
    let engine = freshEngine();
    engine = execute(engine, {
      commandId: 'benefit-group',
      expectedWorldRevision: engine.world.revision,
      command: {
        type: 'CreateGroup',
        subscriptionId: String(i.subscription),
        name: 'rg-benefit-probe',
        metadataRegion: 'norwayeast',
      },
    }).engine;
    const receipt = execute(engine, {
      commandId: 'benefit-plan',
      expectedWorldRevision: engine.world.revision,
      command: {
        type: 'CreatePlan',
        groupId: engine.world.groups[0]!.id,
        name: 'plan-benefit-probe',
        region: String(i.region),
        profile: 'linux-learning-v1',
      },
    }).receipt;
    if (receipt.code === 'policy-location-denied') witnesses.push('denied');
    if (i.subscription === 'sub-app' && receipt.outcome === 'accepted') witnesses.push('allowed');
    if (i.subscription === 'sub-shared' && receipt.outcome === 'accepted')
      witnesses.push('otherScope');
    return result(receipt.code, {}, { receipt });
  }
  if (unit === 'management') {
    const rows =
      i.method === 'template'
        ? [i.template, i.template, i.template].map(String)
        : [i.a, i.b, i.c].map(String);
    const consistent = new Set(rows).size === 1,
      violations = rows.filter((x) => x !== 'westeurope').length;
    if (i.method === 'manual' && !consistent) witnesses.push('manual');
    if (i.method === 'template') witnesses.push(violations ? 'wrongTemplate' : 'rightTemplate');
    return result(
      violations ? (consistent ? 'consistentWrong' : 'drift') : 'aligned',
      { consistent: consistent ? 'yes' : 'no', violations },
      { rows },
    );
  }
  if (unit === 'sustainability') {
    const capacity = Number(i.capacity) * Number(i.copies),
      hours = Number(i.hours),
      allocated = capacity * hours,
      demand = i.profile === 'dev' ? 16 : 48;
    const served = Math.min(capacity, 2) * (i.profile === 'dev' ? 8 : hours);
    if (i.profile === 'dev' && hours === 24 && i.capacity === 8 && i.copies === 1)
      witnesses.push('devAlways');
    if (i.profile === 'dev' && hours === 8 && i.capacity === 4 && i.copies === 1)
      witnesses.push('devScheduled');
    if (i.profile === 'critical' && hours === 8) witnesses.push('critical');
    return result('resourceSaving', {
      allocated,
      served,
      unmet: demand - served,
      unused: allocated - served,
      utilization: allocated ? (served / allocated) * 100 : null,
    });
  }
  if (unit === 'overview') {
    witnesses.push(String(i.model));
    return result('physical');
  }
  if (unit === 'iaas') {
    if (i.guest !== 'windows') issues.push('os');
    if (i.ram !== 8) issues.push('ram');
    if (i.disk !== 'persistent') issues.push('disk');
    if (i.network !== 'configured') issues.push('network');
    if (i.runtime !== 'installed') issues.push('runtime');
    if (i.patch !== 'planned') issues.push('patch');
    witnesses.push(issues.length ? 'incomplete' : 'complete');
    return result(issues.length ? 'physical' : 'aligned', { requirements: 6 - issues.length });
  }
  if (unit === 'paas') {
    const code =
      i.package === 'unsupported'
        ? 'unsupported'
        : i.package === 'driver'
          ? 'driver'
          : i.config !== 'set' || i.access !== 'restricted' || i.data !== 'planned'
            ? 'configuration'
            : 'fit';
    if (code === 'unsupported' || code === 'driver') witnesses.push('incompatible');
    if (code === 'fit') witnesses.push('supported');
    return result(code);
  }
  if (unit === 'saas') {
    const canUse = i.user === 'active' && i.license === 'assigned';
    if (i.user !== 'active') issues.push('inactive');
    if (i.license !== 'assigned') issues.push('unlicensed');
    if (i.role === 'admin') issues.push('admin');
    if (i.sharing === 'everyone') issues.push('sharing');
    if (i.role === 'admin' || i.sharing === 'everyone') witnesses.push('risky');
    if (!issues.length) witnesses.push('safe');
    if (i.user === 'departed') witnesses.push('departure');
    return result(issues[0] ?? 'fit', { canUse: canUse ? 'yes' : 'no' });
  }
  const valid =
    i.scenario === 'legacy'
      ? i.model === 'iaas' && i.reason === 'os-team'
      : i.scenario === 'custom'
        ? i.model === 'paas' && i.reason === 'platform-supported'
        : i.scenario === 'ready'
          ? i.model === 'saas' && i.reason === 'ready-service'
          : (i.model === 'iaas' && i.reason === 'os-team') ||
            (i.model === 'paas' && i.reason === 'platform-supported');
  if (valid) witnesses.push(String(i.scenario));
  else issues.push(String(i.scenario));
  return result(valid ? 'aligned' : 'failed');
}
