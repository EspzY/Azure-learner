export const toolsModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export const toolNames = ['portal', 'cli', 'powershell', 'arm', 'bicep'] as const;
export const hostNames = [
  'browser',
  'cloud-bash',
  'cloud-pwsh',
  'local-bash',
  'local-pwsh',
] as const;
export interface IntentInput {
  kind: 'intent';
  tool: (typeof toolNames)[number];
  host: (typeof hostNames)[number];
  subscription: 'app' | 'shared';
  metadataRegion: 'norwayeast' | 'westeurope';
  installed: boolean;
  authenticated: boolean;
  authorized: boolean;
  providerReady: boolean;
  policyAllows: boolean;
  lockAllows: boolean;
}
export interface ChangeInput {
  kind: 'change';
  syntax: 'arm' | 'bicep';
  stage: 'dev' | 'prod';
  baseline: 'empty' | 'dev';
  binding: 'correct' | 'dangling' | 'wrong-scope';
  order: 'auto' | 'explicit' | 'none' | 'cycle';
  costCenter: 'engineering' | 'sales';
  evaluation: 'complete' | 'unresolved';
  authorized: boolean;
  providerReady: boolean;
  policyAllows: boolean;
  lockAllows: boolean;
}
export const arcResources = [
  'azure-vm',
  'onprem-server',
  'othercloud-server',
  'onprem-kubernetes',
  'sql-mi',
] as const;
export const arcApproaches = ['native', 'servers', 'kubernetes', 'data'] as const;
export const arcCapabilities = [
  'inventory',
  'machine-config',
  'gitops',
  'sql-service',
  'resize-vm',
] as const;
export interface ArcInput {
  kind: 'arc';
  resource: (typeof arcResources)[number];
  approach: (typeof arcApproaches)[number];
  capability: (typeof arcCapabilities)[number];
  onboarded: boolean;
  connected: boolean;
  prerequisites: boolean;
  extension: boolean;
}
export type ToolsInput = IntentInput | ChangeInput | ArcInput;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: Record<string, unknown>, keys: string[]) =>
  Object.keys(v).sort().join() === keys.sort().join();
const one = (v: unknown, choices: readonly string[]) =>
  typeof v === 'string' && choices.includes(v);
const bools = (v: Record<string, unknown>, keys: string[]) =>
  keys.every((k) => typeof v[k] === 'boolean');
export function validToolsInput(v: unknown): v is ToolsInput {
  if (!object(v)) return false;
  if (v.kind === 'intent')
    return (
      exact(v, [
        'kind',
        'tool',
        'host',
        'subscription',
        'metadataRegion',
        'installed',
        'authenticated',
        'authorized',
        'providerReady',
        'policyAllows',
        'lockAllows',
      ]) &&
      one(v.tool, toolNames) &&
      one(v.host, hostNames) &&
      one(v.subscription, ['app', 'shared']) &&
      one(v.metadataRegion, ['norwayeast', 'westeurope']) &&
      bools(v, [
        'installed',
        'authenticated',
        'authorized',
        'providerReady',
        'policyAllows',
        'lockAllows',
      ])
    );
  if (v.kind === 'change')
    return (
      exact(v, [
        'kind',
        'syntax',
        'stage',
        'baseline',
        'binding',
        'order',
        'costCenter',
        'evaluation',
        'authorized',
        'providerReady',
        'policyAllows',
        'lockAllows',
      ]) &&
      one(v.syntax, ['arm', 'bicep']) &&
      one(v.stage, ['dev', 'prod']) &&
      one(v.baseline, ['empty', 'dev']) &&
      one(v.binding, ['correct', 'dangling', 'wrong-scope']) &&
      one(v.order, ['auto', 'explicit', 'none', 'cycle']) &&
      one(v.costCenter, ['engineering', 'sales']) &&
      one(v.evaluation, ['complete', 'unresolved']) &&
      bools(v, ['authorized', 'providerReady', 'policyAllows', 'lockAllows'])
    );
  if (v.kind === 'arc')
    return (
      exact(v, [
        'kind',
        'resource',
        'approach',
        'capability',
        'onboarded',
        'connected',
        'prerequisites',
        'extension',
      ]) &&
      one(v.resource, arcResources) &&
      one(v.approach, arcApproaches) &&
      one(v.capability, arcCapabilities) &&
      bools(v, ['onboarded', 'connected', 'prerequisites', 'extension'])
    );
  return false;
}
const conceptual = {
  actualRequest: false,
  actualReceipt: false,
  actualDeployment: false,
  actualApplicationHealth: false,
} as const;
export function runIntent(input: IntentInput) {
  if (!validToolsInput(input) || input.kind !== 'intent') return null;
  const definition = input.tool === 'arm' || input.tool === 'bicep';
  const hostCompatible =
    definition ||
    (input.tool === 'portal'
      ? input.host === 'browser'
      : input.tool === 'powershell'
        ? input.host.endsWith('pwsh')
        : input.host !== 'browser');
  const localTool = !definition && input.tool !== 'portal' && input.host.startsWith('local');
  const toolReady = !localTool || input.installed;
  const prerequisites = {
    hostCompatible,
    toolReady,
    authenticated: input.authenticated,
    authorized: input.authorized,
    providerReady: input.providerReady,
    policyAllows: input.policyAllows,
    lockAllows: input.lockAllows,
  };
  const ready = Object.values(prerequisites).every(Boolean);
  return {
    kind: 'intent' as const,
    input,
    definition,
    prerequisites,
    ready,
    provider: 'Microsoft.Resources',
    resourceType: 'Microsoft.Resources/resourceGroups',
    requestScope: 'subscription',
    groupMetadataRegion: input.metadataRegion,
    outcome: (!hostCompatible ? 0 : ready ? 2 : 1) as Outcome,
    ...conceptual,
  };
}
export function runChange(input: ChangeInput) {
  if (!validToolsInput(input) || input.kind !== 'change') return null;
  const planName = `plan-fjord-${input.stage}`,
    appName = `fjord-${input.stage}`;
  const planNew = input.baseline === 'empty' || input.stage !== 'dev';
  const referenceValid = input.binding === 'correct';
  const implicit = input.syntax === 'bicep' && referenceValid;
  const effectiveOrder: 'cycle' | 'implicit' | 'explicit' | 'unspecified' =
    input.order === 'cycle'
      ? 'cycle'
      : implicit
        ? 'implicit'
        : input.order === 'explicit'
          ? 'explicit'
          : 'unspecified';
  const cycle = effectiveOrder === 'cycle';
  const missingOrder = planNew && effectiveOrder === 'unspecified';
  const structureValid = referenceValid && !cycle && !missingOrder;
  const prerequisites = {
    authorized: input.authorized,
    providerReady: input.providerReady,
    policyAllows: input.policyAllows,
    lockAllows: input.lockAllows,
  };
  const ready =
    structureValid &&
    input.evaluation === 'complete' &&
    Object.values(prerequisites).every(Boolean);
  type Difference = 'unknown' | 'create' | 'no-change' | 'modify';
  const selectedChange = (
    before: Record<string, string> | null,
    desired: Record<string, string>,
  ): Difference =>
    input.evaluation === 'unresolved'
      ? 'unknown'
      : before === null
        ? 'create'
        : Object.keys({ ...before, ...desired }).every((key) => before[key] === desired[key])
          ? 'no-change'
          : 'modify';
  const planBefore = planNew ? null : { costCenter: 'engineering' };
  const appBefore = planNew ? null : { costCenter: 'engineering', plan: 'plan-fjord-dev' };
  const planDesired = { costCenter: input.costCenter };
  const appDesired = {
    costCenter: input.costCenter,
    plan: referenceValid
      ? planName
      : input.binding === 'dangling'
        ? 'plan-absent'
        : 'other-group/plan',
  };
  const changes = [
    {
      type: 'Microsoft.Web/serverfarms',
      name: planName,
      before: planBefore,
      desired: planDesired,
      change: selectedChange(planBefore, planDesired),
    },
    {
      type: 'Microsoft.Web/sites',
      name: appName,
      before: appBefore,
      desired: appDesired,
      change: selectedChange(appBefore, appDesired),
    },
  ];
  return {
    kind: 'change' as const,
    input,
    planName,
    appName,
    planNew,
    referenceValid,
    implicit,
    effectiveOrder,
    cycle,
    missingOrder,
    structureValid,
    prerequisites,
    ready,
    previewUnresolved: input.evaluation === 'unresolved',
    changes,
    retainedOld:
      input.baseline === 'dev' && input.stage === 'prod' ? ['plan-fjord-dev', 'fjord-dev'] : [],
    mode: 'incremental' as const,
    outcome: (!structureValid ? 0 : ready ? 2 : 1) as Outcome,
    ...conceptual,
  };
}
const expectedArc = {
  'azure-vm': 'native',
  'onprem-server': 'servers',
  'othercloud-server': 'servers',
  'onprem-kubernetes': 'kubernetes',
  'sql-mi': 'data',
} as const;
export function runArc(input: ArcInput) {
  if (!validToolsInput(input) || input.kind !== 'arc') return null;
  const correctApproach = expectedArc[input.resource] === input.approach;
  const native = input.resource === 'azure-vm';
  const represented = correctApproach && (native || input.onboarded);
  const available = represented && input.connected && input.prerequisites;
  const supported =
    correctApproach &&
    (input.capability === 'inventory' ||
      (input.approach === 'native' && ['machine-config', 'resize-vm'].includes(input.capability)) ||
      (input.approach === 'servers' && input.capability === 'machine-config') ||
      (input.approach === 'kubernetes' && input.capability === 'gitops') ||
      (input.approach === 'data' && input.capability === 'sql-service'));
  const extensionNeeded = ['machine-config', 'gitops', 'sql-service'].includes(input.capability);
  const capabilityReady = available && supported && (!extensionNeeded || input.extension);
  const physical = native
    ? 'azure'
    : input.resource === 'othercloud-server'
      ? 'othercloud'
      : 'onprem';
  return {
    kind: 'arc' as const,
    input,
    correctApproach,
    represented,
    available,
    supported,
    extensionNeeded,
    capabilityReady,
    physical,
    representation: represented ? input.approach : 'none',
    metadataRegion: 'westeurope',
    stale: represented && !input.connected,
    localReconciliation: 'not-evaluated' as const,
    migrated: false,
    actualOnboarding: false,
    actualAgent: false,
    outcome: (!correctApproach || !supported ? 0 : capabilityReady ? 2 : 1) as Outcome,
    ...conceptual,
  };
}
export const initialTools = (kind: ToolsInput['kind']): ToolsInput =>
  kind === 'intent'
    ? {
        kind,
        tool: 'cli',
        host: 'local-bash',
        subscription: 'app',
        metadataRegion: 'norwayeast',
        installed: false,
        authenticated: true,
        authorized: true,
        providerReady: true,
        policyAllows: true,
        lockAllows: true,
      }
    : kind === 'change'
      ? {
          kind,
          syntax: 'arm',
          stage: 'dev',
          baseline: 'empty',
          binding: 'correct',
          order: 'none',
          costCenter: 'engineering',
          evaluation: 'complete',
          authorized: true,
          providerReady: true,
          policyAllows: true,
          lockAllows: true,
        }
      : {
          kind,
          resource: 'onprem-server',
          approach: 'native',
          capability: 'inventory',
          onboarded: true,
          connected: true,
          prerequisites: true,
          extension: true,
        };
export function runTools(v: unknown) {
  if (!validToolsInput(v)) return null;
  return v.kind === 'intent' ? runIntent(v) : v.kind === 'change' ? runChange(v) : runArc(v);
}
