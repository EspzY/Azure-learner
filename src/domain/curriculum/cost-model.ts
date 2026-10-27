/** Fixed original teaching fixture. No World/Engine, prices API or billing imports. */
export const costModelVersion = '1.0.0';
export const analysisReferenceBudgets = { app: 600, shared: 900, all: 900 } as const;
export type CostScope = 'app' | 'shared';
export type CostComponent = 'compute' | 'storage' | 'operations' | 'egress' | 'license' | 'support';
export const costScopes = ['app', 'shared'] as const;
export const priceModels = ['payg', 'reservation', 'savings', 'spot'] as const;
export interface EstimateInput {
  service: 'vm' | 'paas';
  count: number;
  hours: number;
  size: 'standard' | 'large';
  region: 'west' | 'north';
  pricing: (typeof priceModels)[number];
  storage: number;
  operations: number;
  egress: number;
  license: boolean;
  support: boolean;
  scope: CostScope;
}
export const initialEstimate: EstimateInput = {
  service: 'vm',
  count: 1,
  hours: 720,
  size: 'standard',
  region: 'west',
  pricing: 'payg',
  storage: 100,
  operations: 20,
  egress: 50,
  license: false,
  support: false,
  scope: 'app',
};
export const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export const exactCostKeys = (v: object, keys: readonly string[]) =>
  Object.keys(v).sort().join('|') === [...keys].sort().join('|');
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
export function validEstimate(v: unknown): v is EstimateInput {
  return (
    record(v) &&
    exactCostKeys(v, Object.keys(initialEstimate)) &&
    ['vm', 'paas'].includes(v.service as string) &&
    integer(v.count, 1, 8) &&
    integer(v.hours, 0, 720) &&
    ['standard', 'large'].includes(v.size as string) &&
    ['west', 'north'].includes(v.region as string) &&
    priceModels.includes(v.pricing as EstimateInput['pricing']) &&
    !(v.service === 'paas' && v.pricing === 'spot') &&
    integer(v.storage, 0, 2000) &&
    integer(v.operations, 0, 1000) &&
    integer(v.egress, 0, 5000) &&
    typeof v.license === 'boolean' &&
    typeof v.support === 'boolean' &&
    costScopes.includes(v.scope as CostScope)
  );
}
export interface CostLine {
  id: CostComponent;
  service: 'vm' | 'paas' | 'storage' | 'network' | 'support';
  unit: 'instance-hour' | 'GB-period' | 'thousand-operations' | 'GB' | 'period';
  quantity: number;
  rateCents: number;
  fixedCents: number;
  cents: number;
  scope: CostScope;
  group: 'rg-catalog' | 'rg-shared';
  period: '30-day';
}
export function estimateCost(input: unknown): { lines: CostLine[]; cents: number } | null {
  if (!validEstimate(input)) return null;
  const i = input;
  const base = (i.service === 'vm' ? 100 : 150) * (i.size === 'large' ? 2 : 1);
  const rate = base * (i.region === 'north' ? 1.2 : 1);
  const hours = i.count * i.hours;
  let variable = rate,
    fixed = 0;
  if (i.pricing === 'reservation') {
    variable = 0;
    fixed = i.count * 720 * rate * 0.7;
  }
  if (i.pricing === 'savings') {
    // Identical active hours per instance; unused hourly commitment never rolls over.
    // 50 cents buys 50/discountedRate of each instance-hour. Remaining usage is PAYG.
    const discountedRate = rate * 0.75;
    fixed = i.count * 720 * 50;
    variable = (Math.max(discountedRate - 50, 0) * rate) / discountedRate;
  }
  if (i.pricing === 'spot') variable = rate * 0.35;
  const line = (
    id: CostComponent,
    service: CostLine['service'],
    unit: CostLine['unit'],
    quantity: number,
    rateCents: number,
    fixedCents = 0,
  ): CostLine => ({
    id,
    service,
    unit,
    quantity,
    rateCents,
    fixedCents: Math.round(fixedCents),
    cents: Math.round(quantity * rateCents + fixedCents),
    scope: i.scope,
    group: i.scope === 'app' ? 'rg-catalog' : 'rg-shared',
    period: '30-day',
  });
  const lines = [
    line('compute', i.service, 'instance-hour', hours, variable, fixed),
    line('storage', 'storage', 'GB-period', i.storage, 10),
    line('operations', 'storage', 'thousand-operations', i.operations, 5),
    line('egress', 'network', 'GB', i.egress, 20),
    line('license', i.service, 'instance-hour', i.license ? hours : 0, 20),
    line('support', 'support', 'period', 1, 0, i.support ? 12000 : 0),
  ];
  return { lines, cents: lines.reduce((sum, l) => sum + l.cents, 0) };
}
export const estimatePrediction = (a: EstimateInput, b: EstimateInput) => {
  const x = estimateCost(a),
    y = estimateCost(b);
  return x && y ? (y.cents < x.cents ? 'lower' : y.cents > x.cents ? 'higher' : 'same') : null;
};

export interface CostRecord {
  id: string;
  resource: string;
  day: number;
  date: string;
  scope: CostScope;
  group: 'rg-catalog' | 'rg-shared';
  service: 'vm' | 'paas' | 'storage' | 'network';
  component: 'compute' | 'storage' | 'egress';
  unit: 'instance-hour' | 'GB-day' | 'GB';
  quantity: number;
  rateCents: number;
  cents: number;
}
export const costDataset = Array.from({ length: 20 }, (_, index) => {
  const day = index + 1,
    late = day > 10;
  const row = (
    resource: string,
    scope: CostScope,
    service: CostRecord['service'],
    component: CostRecord['component'],
    unit: CostRecord['unit'],
    quantity: number,
    rateCents: number,
  ): CostRecord => ({
    id: `day-${day}-${resource}`,
    resource,
    day,
    date: `2026-09-${String(day).padStart(2, '0')}`,
    scope,
    group: scope === 'app' ? 'rg-catalog' : 'rg-shared',
    service,
    component,
    unit,
    quantity,
    rateCents,
    cents: quantity * rateCents,
  });
  return [
    row('fixture-vm', 'app', 'vm', 'compute', 'instance-hour', late ? 20 : 8, 100),
    row('fixture-large', 'app', 'vm', 'compute', 'instance-hour', late ? 6 : 0, 200),
    row('fixture-disk', 'app', 'storage', 'storage', 'GB-day', late ? 100 : 80, 1),
    row('fixture-transfer', 'app', 'network', 'egress', 'GB', late ? 5 : 2, late ? 30 : 20),
    row('fixture-plan', 'shared', 'paas', 'compute', 'instance-hour', 6, 150),
    row('fixture-shared-disk', 'shared', 'storage', 'storage', 'GB-day', 50, 1),
  ];
}).flat();
export type AnalysisScope = CostScope | 'all';
export type AnalysisDimension = 'component' | 'service' | 'scope' | 'group';
export const analysisDimensions: readonly AnalysisDimension[] = [
  'component',
  'service',
  'scope',
  'group',
];
export function costAnalysis(scope: AnalysisScope, dimension: AnalysisDimension = 'component') {
  if (!['all', 'app', 'shared'].includes(scope) || !analysisDimensions.includes(dimension))
    throw new RangeError('invalid-cost-dimension');
  const rows = costDataset.filter((r) => scope === 'all' || r.scope === scope);
  const total = (list: readonly CostRecord[]) => list.reduce((s, r) => s + r.cents, 0);
  const keys = [...new Set(rows.map((r) => r[dimension]))];
  const groups = keys.map((key) => {
    const selected = rows.filter((r) => r[dimension] === key),
      earlier = total(selected.filter((r) => r.day <= 10)),
      later = total(selected.filter((r) => r.day > 10));
    return { key, earlier, later, delta: later - earlier, cents: earlier + later };
  });
  const cents = total(rows),
    late = total(rows.filter((r) => r.day > 10));
  return {
    rows,
    groups,
    cents,
    forecast: cents + late,
    days: Array.from({ length: 30 }, (_, idx) => {
      const day = idx + 1;
      return {
        day,
        cents:
          day <= 20
            ? total(rows.filter((r) => r.day <= day))
            : cents + Math.round((late / 10) * (day - 20)),
        projected: day > 20,
      };
    }),
  };
}
export interface BudgetInput {
  scope: CostScope;
  amount: number;
  percent: number;
  type: 'actual' | 'forecast';
}
export function validBudget(v: unknown): v is BudgetInput {
  return (
    record(v) &&
    exactCostKeys(v, ['scope', 'amount', 'percent', 'type']) &&
    costScopes.includes(v.scope as CostScope) &&
    integer(v.amount, 1, 100000) &&
    integer(v.percent, 1, 200) &&
    ['actual', 'forecast'].includes(v.type as string)
  );
}
export function evaluateBudget(v: unknown) {
  if (!validBudget(v)) return null;
  const data = costAnalysis(v.scope),
    observed = v.type === 'actual' ? data.cents : data.forecast;
  return {
    ...data,
    thresholdCents: v.amount * v.percent,
    observed,
    triggered: observed >= v.amount * v.percent,
    resourcesStopped: false,
    emailsSent: 0,
  };
}
export const departments = ['', 'Product', 'Finance', 'Shared'] as const;
export const environments = ['', 'Development', 'Production'] as const;
export const fixtureResources = [
  'fixture-vm',
  'fixture-large',
  'fixture-disk',
  'fixture-transfer',
  'fixture-plan',
  'fixture-shared-disk',
] as const;
export type FixtureResource = (typeof fixtureResources)[number];
export interface TagValue {
  department: (typeof departments)[number];
  environment: (typeof environments)[number];
}
export interface TagInput {
  mode: 'off' | 'keep-resource' | 'prefer-parent';
  values: Record<FixtureResource, TagValue>;
}
export const initialTags = (): TagInput => ({
  mode: 'off',
  values: {
    'fixture-vm': { department: 'Product', environment: 'Development' },
    'fixture-large': { department: '', environment: '' },
    'fixture-disk': { department: '', environment: '' },
    'fixture-transfer': { department: '', environment: '' },
    'fixture-plan': { department: 'Finance', environment: 'Production' },
    'fixture-shared-disk': { department: '', environment: 'Production' },
  },
});
export function validTags(v: unknown): v is TagInput {
  return (
    record(v) &&
    exactCostKeys(v, ['mode', 'values']) &&
    ['off', 'keep-resource', 'prefer-parent'].includes(v.mode as string) &&
    record(v.values) &&
    exactCostKeys(v.values, fixtureResources) &&
    Object.values(v.values).every(
      (t) =>
        record(t) &&
        exactCostKeys(t, ['department', 'environment']) &&
        departments.includes(t.department as TagValue['department']) &&
        environments.includes(t.environment as TagValue['environment']),
    )
  );
}
export function allocateCost(v: unknown, dimension: 'department' | 'environment' = 'department') {
  if (!validTags(v)) return null;
  const rows = fixtureResources.map((id) => {
    const records = costDataset.filter((r) => r.resource === id),
      scope = records[0]!.scope;
    const parent: TagValue = {
      department: scope === 'app' ? 'Product' : 'Shared',
      environment: scope === 'app' ? 'Development' : 'Production',
    };
    const direct = v.values[id],
      emits = id !== 'fixture-transfer';
    const report = (key: keyof TagValue) =>
      v.mode === 'off'
        ? emits
          ? direct[key]
          : ''
        : v.mode === 'prefer-parent'
          ? parent[key]
          : emits && direct[key]
            ? direct[key]
            : parent[key];
    return {
      id,
      scope,
      emits,
      direct: { ...direct },
      parent,
      report: { department: report('department'), environment: report('environment') },
      cents: records.reduce((s, r) => s + r.cents, 0),
    };
  });
  const groups = [...new Set(rows.map((r) => r.report[dimension]))].map((key) => ({
    key,
    cents: rows.filter((r) => r.report[dimension] === key).reduce((s, r) => s + r.cents, 0),
  }));
  return {
    rows,
    groups,
    cents: rows.reduce((s, r) => s + r.cents, 0),
    unassigned: groups.find((g) => g.key === '')?.cents ?? 0,
  };
}
