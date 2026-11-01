/** P12/1.0.0: bounded teaching assumptions, never a governance/runtime API. */
export const governanceModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export const scopeParents = {
  'mg-lab': null,
  'sub-app': 'mg-lab',
  'sub-shared': 'mg-lab',
  'rg-app': 'sub-app',
  'rg-shared': 'sub-shared',
  vm: 'rg-app',
  account: 'rg-app',
} as const;
export type GovernanceScope = keyof typeof scopeParents;
export const scopeChain = (target: GovernanceScope): GovernanceScope[] => {
  const result: GovernanceScope[] = [];
  let node: GovernanceScope | null = target;
  while (node) {
    result.unshift(node);
    node = scopeParents[node];
  }
  return result;
};
export const containsScope = (scope: GovernanceScope, target: GovernanceScope) =>
  scopeChain(target).includes(scope);
export const dataAssets = {
  product: { owner: 'product', classification: 'business', sources: [] },
  customer: { owner: 'privacy', classification: 'personal', sources: [] },
  sales: { owner: 'finance', classification: 'business', sources: ['product', 'customer'] },
  documents: { owner: 'operations', classification: 'business', sources: [] },
} as const;
export interface DataInput {
  kind: 'data';
  asset: keyof typeof dataAssets;
  registered: boolean;
  catalogAccess: boolean;
  classification: 'unknown' | 'business' | 'personal';
  owner: 'unknown' | 'product' | 'privacy' | 'finance' | 'operations';
  glossary: boolean;
  lineage: boolean;
  sourceAuthorized: boolean;
}
export const policyEffects = ['audit', 'deny', 'modify', 'deploy', 'disabled'] as const;
export interface PolicyInput {
  kind: 'policy';
  resourceType: 'plan' | 'app' | 'vm' | 'storage';
  resourceScope: 'rg-app' | 'rg-shared';
  location: 'westeurope' | 'northeurope' | 'norwayeast';
  assignment: 'mg-lab' | 'sub-app' | 'sub-shared' | 'rg-app';
  target: 'web' | 'vm' | 'all';
  allowed: 'westeurope' | 'northeurope';
  rule: 'location' | 'tag' | 'related';
  effect: (typeof policyEffects)[number];
  phase: 'request' | 'existing';
  evaluationReady: boolean;
  excluded: 'none' | 'rg-app' | 'rg-shared';
  exemption: 'none' | 'waiver' | 'mitigated' | 'expired';
  enforcement: boolean;
  propertyPresent: boolean;
  remediationRequested: boolean;
  identityReady: boolean;
}
export type LockType = 'none' | 'delete' | 'readonly';
export type LockScope = Exclude<GovernanceScope, 'mg-lab'>;
export const lockOperations = [
  'view',
  'modify-vm',
  'start-vm',
  'delete-vm',
  'delete-account',
  'list-keys',
  'delete-blob',
  'delete-group',
] as const;
export interface LockInput {
  kind: 'locks';
  lock: LockType;
  scope: LockScope;
  second: LockType;
  secondScope: LockScope;
  target: 'vm' | 'account' | 'rg-app' | 'rg-shared';
  operation: (typeof lockOperations)[number];
  authorized: boolean;
}
export type GovernanceInput = DataInput | PolicyInput | LockInput;
export const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export const exact = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
export const one = (v: unknown, values: readonly string[]) =>
  typeof v === 'string' && values.includes(v);
export const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
export function validGovernanceInput(v: unknown): v is GovernanceInput {
  if (!object(v)) return false;
  if (v.kind === 'data')
    return (
      exact(v, [
        'kind',
        'asset',
        'registered',
        'catalogAccess',
        'classification',
        'owner',
        'glossary',
        'lineage',
        'sourceAuthorized',
      ]) &&
      one(v.asset, Object.keys(dataAssets)) &&
      one(v.classification, ['unknown', 'business', 'personal']) &&
      one(v.owner, ['unknown', 'product', 'privacy', 'finance', 'operations']) &&
      ['registered', 'catalogAccess', 'glossary', 'lineage', 'sourceAuthorized'].every(
        (k) => typeof v[k] === 'boolean',
      )
    );
  if (v.kind === 'policy')
    return (
      exact(v, [
        'kind',
        'resourceType',
        'resourceScope',
        'location',
        'assignment',
        'target',
        'allowed',
        'rule',
        'effect',
        'phase',
        'evaluationReady',
        'excluded',
        'exemption',
        'enforcement',
        'propertyPresent',
        'remediationRequested',
        'identityReady',
      ]) &&
      one(v.resourceType, ['plan', 'app', 'vm', 'storage']) &&
      one(v.resourceScope, ['rg-app', 'rg-shared']) &&
      one(v.location, ['westeurope', 'northeurope', 'norwayeast']) &&
      one(v.assignment, ['mg-lab', 'sub-app', 'sub-shared', 'rg-app']) &&
      one(v.target, ['web', 'vm', 'all']) &&
      one(v.allowed, ['westeurope', 'northeurope']) &&
      one(v.rule, ['location', 'tag', 'related']) &&
      one(v.effect, policyEffects) &&
      one(v.phase, ['request', 'existing']) &&
      one(v.excluded, ['none', 'rg-app', 'rg-shared']) &&
      one(v.exemption, ['none', 'waiver', 'mitigated', 'expired']) &&
      [
        'evaluationReady',
        'enforcement',
        'propertyPresent',
        'remediationRequested',
        'identityReady',
      ].every((k) => typeof v[k] === 'boolean')
    );
  return (
    v.kind === 'locks' &&
    exact(v, [
      'kind',
      'lock',
      'scope',
      'second',
      'secondScope',
      'target',
      'operation',
      'authorized',
    ]) &&
    one(v.lock, ['none', 'delete', 'readonly']) &&
    one(v.second, ['none', 'delete', 'readonly']) &&
    one(
      v.scope,
      Object.keys(scopeParents).filter((k) => k !== 'mg-lab'),
    ) &&
    one(
      v.secondScope,
      Object.keys(scopeParents).filter((k) => k !== 'mg-lab'),
    ) &&
    one(v.target, ['vm', 'account', 'rg-app', 'rg-shared']) &&
    one(v.operation, lockOperations) &&
    typeof v.authorized === 'boolean'
  );
}
export function initialGovernance(kind: GovernanceInput['kind']): GovernanceInput {
  if (kind === 'data')
    return {
      kind,
      asset: 'sales',
      registered: false,
      catalogAccess: true,
      classification: 'unknown',
      owner: 'unknown',
      glossary: false,
      lineage: false,
      sourceAuthorized: false,
    };
  if (kind === 'policy')
    return {
      kind,
      resourceType: 'plan',
      resourceScope: 'rg-app',
      location: 'northeurope',
      assignment: 'sub-app',
      target: 'web',
      allowed: 'westeurope',
      rule: 'location',
      effect: 'audit',
      phase: 'request',
      evaluationReady: true,
      excluded: 'none',
      exemption: 'none',
      enforcement: true,
      propertyPresent: false,
      remediationRequested: false,
      identityReady: false,
    };
  return {
    kind,
    lock: 'delete',
    scope: 'rg-app',
    second: 'none',
    secondScope: 'sub-app',
    target: 'vm',
    operation: 'modify-vm',
    authorized: true,
  };
}
export function runData(raw: unknown) {
  if (!validGovernanceInput(raw) || raw.kind !== 'data') return null;
  const input = raw,
    asset = dataAssets[input.asset],
    discoverable = input.registered && input.catalogAccess;
  const classified = input.classification === asset.classification,
    accountable = input.owner === asset.owner;
  const traceable = input.lineage,
    curated = discoverable && classified && accountable && input.glossary && traceable;
  return {
    input,
    asset,
    discoverable,
    classified,
    accountable,
    traceable,
    curated,
    declaredSourceAuthorized: input.sourceAuthorized,
    actualRead: false,
    actualScan: false,
    securityProven: false,
    complianceProven: false,
    outcome: (!discoverable ? 0 : curated && input.sourceAuthorized ? 2 : 1) as Outcome,
  };
}
export function runPolicy(raw: unknown) {
  if (!validGovernanceInput(raw) || raw.kind !== 'policy') return null;
  const input = raw,
    inScope = containsScope(input.assignment, input.resourceScope);
  const typeMatches =
    input.target === 'all' ||
    (input.target === 'web'
      ? ['plan', 'app'].includes(input.resourceType)
      : input.resourceType === 'vm');
  const excluded = input.excluded !== 'none' && containsScope(input.excluded, input.resourceScope);
  const exempt = ['waiver', 'mitigated'].includes(input.exemption);
  const supported =
    input.effect === 'disabled' ||
    (input.rule === 'related'
      ? input.effect === 'deploy'
      : input.effect === 'deploy'
        ? false
        : input.effect === 'modify'
          ? input.rule === 'tag'
          : true);
  const relevant = inScope && typeMatches,
    applicable = supported && relevant && !excluded && !exempt && input.effect !== 'disabled';
  const evaluated = applicable && input.evaluationReady;
  const condition =
    input.rule === 'location' ? input.location !== input.allowed : !input.propertyPresent;
  const nonCompliant = evaluated && condition;
  const blocked =
    nonCompliant && input.effect === 'deny' && input.phase === 'request' && input.enforcement;
  const modifyRequest =
    nonCompliant && input.effect === 'modify' && input.phase === 'request' && input.enforcement;
  const wouldDeploy =
    nonCompliant &&
    input.effect === 'deploy' &&
    input.phase === 'request' &&
    input.enforcement &&
    input.identityReady;
  const needsRemediation =
    nonCompliant && input.phase === 'existing' && ['modify', 'deploy'].includes(input.effect);
  // Explicit remediation is separate from request enforcement. No task is executed.
  const remediationEligible = needsRemediation && input.remediationRequested && input.identityReady;
  const state:
    | 'unsupported'
    | 'not-applicable'
    | 'excluded'
    | 'exempt'
    | 'disabled'
    | 'pending'
    | 'non-compliant'
    | 'compliant' = !supported
    ? 'unsupported'
    : !relevant
      ? 'not-applicable'
      : excluded
        ? 'excluded'
        : exempt
          ? 'exempt'
          : input.effect === 'disabled'
            ? 'disabled'
            : !input.evaluationReady
              ? 'pending'
              : condition
                ? 'non-compliant'
                : 'compliant';
  return {
    input,
    inScope,
    typeMatches,
    relevant,
    excluded,
    exempt,
    supported,
    applicable,
    evaluated,
    condition,
    nonCompliant,
    blocked,
    modifyRequest,
    wouldDeploy,
    needsRemediation,
    remediationEligible,
    state,
    proposedChange: modifyRequest
      ? 'add-declared-tag'
      : wouldDeploy || remediationEligible
        ? 'declared-remediation-only'
        : 'none',
    actualOperation: false,
    actualDeployment: false,
    actualRemediation: false,
    actualReceipt: false,
    outcome: (blocked ? 0 : state === 'compliant' ? 2 : 1) as Outcome,
  };
}
const operationTargets = {
  view: ['vm', 'account', 'rg-app', 'rg-shared'],
  'modify-vm': ['vm'],
  'start-vm': ['vm'],
  'delete-vm': ['vm'],
  'delete-account': ['account'],
  'list-keys': ['account'],
  'delete-blob': ['account'],
  'delete-group': ['rg-app', 'rg-shared'],
} as const;
export function runLocks(raw: unknown) {
  if (!validGovernanceInput(raw) || raw.kind !== 'locks') return null;
  const input = raw,
    supported = (operationTargets[input.operation] as readonly string[]).includes(input.target);
  const dataPlane = input.operation === 'delete-blob',
    deleting = ['delete-vm', 'delete-account', 'delete-group'].includes(input.operation),
    reading = input.operation === 'view';
  const locks = [
    { type: input.lock, scope: input.scope },
    { type: input.second, scope: input.secondScope },
  ].map((l) => ({
    ...l,
    inherited: containsScope(l.scope, input.target),
    descendant: input.operation === 'delete-group' && containsScope(input.target, l.scope),
  }));
  const applicable = locks.filter((l) => l.type !== 'none' && (l.inherited || l.descendant));
  const lockBlocked =
    supported &&
    !dataPlane &&
    applicable.some((l) => (l.type === 'readonly' ? !reading : deleting));
  const descendantBlock = lockBlocked && applicable.some((l) => l.descendant && !l.inherited);
  const allowed = supported && input.authorized && !lockBlocked;
  const cause:
    'outside' | 'authorization' | 'protected-descendant' | 'lock' | 'data-plane' | 'no-block' =
    !supported
      ? 'outside'
      : !input.authorized
        ? 'authorization'
        : lockBlocked
          ? descendantBlock
            ? 'protected-descendant'
            : 'lock'
          : dataPlane
            ? 'data-plane'
            : 'no-block';
  return {
    input,
    supported,
    locks,
    applicable,
    dataPlane,
    deleting,
    reading,
    lockBlocked,
    descendantBlock,
    allowed,
    cause,
    method: reading
      ? 'GET'
      : input.operation === 'start-vm' || input.operation === 'list-keys'
        ? 'POST'
        : deleting || dataPlane
          ? 'DELETE'
          : 'PUT',
    endpoint: dataPlane ? 'blob.core.windows.net' : 'management.azure.com',
    actualOperation: false,
    actualLock: false,
    actualReceipt: false,
    backupCreated: false,
    outcome: (!supported ? 1 : allowed ? 2 : 0) as Outcome,
  };
}
export function runGovernance(input: unknown) {
  if (!validGovernanceInput(input)) return null;
  return input.kind === 'data'
    ? runData(input)
    : input.kind === 'policy'
      ? runPolicy(input)
      : runLocks(input);
}
