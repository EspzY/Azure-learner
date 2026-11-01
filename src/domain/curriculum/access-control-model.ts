import type { World } from '../chapter01/model';
import { managementHierarchy, ancestry } from './architecture-management';
/** P11/1.0.0. Declared permission subsets; never Azure IAM/CA or a technical command. */
export const accessModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export const roles = [
  'none',
  'reader',
  'contributor',
  'owner',
  'rbac-admin',
  'vm-contributor',
  'blob-reader',
  'custom-no-delete',
  'custom-delete',
  'entra-admin',
] as const;
export type AccessRole = (typeof roles)[number];
export const actions = ['view', 'modify-vm', 'delete-vm', 'assign-role', 'read-blob'] as const;
export type AccessAction = (typeof actions)[number];
export interface ScopeNode {
  id: string;
  name: string;
  parent: string | null;
  kind: 'management' | 'subscription' | 'group' | 'vm' | 'resource' | 'blob';
}
export interface ScopeContext {
  origin: 'fjordverk' | 'sandbox';
  revision: number;
  tenant: string;
  nodes: ScopeNode[];
}
export const exampleContext: ScopeContext = {
  origin: 'fjordverk',
  revision: 0,
  tenant: 'Fjordverk — konseptuell identitetskontekst',
  nodes: [
    { id: 'mg', name: 'Fjordverk', kind: 'management', parent: null },
    { id: 'sub-app', name: 'Applications', kind: 'subscription', parent: 'mg' },
    { id: 'sub-shared', name: 'Shared services', kind: 'subscription', parent: 'mg' },
    { id: 'rg-app', name: 'Application team', kind: 'group', parent: 'sub-app' },
    { id: 'rg-other', name: 'Other team', kind: 'group', parent: 'sub-app' },
    { id: 'rg-shared', name: 'Shared team', kind: 'group', parent: 'sub-shared' },
    { id: 'vm', name: 'Application VM', kind: 'vm', parent: 'rg-app' },
    { id: 'vm-other', name: 'Other VM', kind: 'vm', parent: 'rg-other' },
    {
      id: 'account',
      name: 'Reports storage account — konseptuell ressurs',
      kind: 'resource',
      parent: 'rg-app',
    },
    {
      id: 'container',
      name: 'Reports container — konseptuell Blob-ressurs',
      kind: 'blob',
      parent: 'account',
    },
  ],
};
export interface RbacInput {
  kind: 'rbac';
  context: ScopeContext;
  principal: 'user' | 'service' | 'managed';
  assignment: 'user' | 'group' | 'service' | 'managed' | 'other';
  member: boolean;
  role: AccessRole;
  second: AccessRole;
  scope: string;
  target: string;
  action: AccessAction;
  route: 'entra-rbac' | 'other';
  deny: boolean;
}
export interface AccessPolicy {
  state: 'off' | 'report' | 'on';
  audience: 'all' | 'team' | 'emergency';
  excludeEmergency: boolean;
  app: 'all' | 'azure' | 'project';
  location: 'all' | 'outside';
  control: 'mfa' | 'device' | 'both' | 'either' | 'block';
}
export interface ConditionalInput {
  kind: 'conditional';
  subject: 'employee' | 'partner' | 'emergency' | 'service' | 'managed';
  member: boolean;
  app: 'azure' | 'project';
  location: 'known' | 'outside';
  authenticated: boolean;
  mfa: boolean;
  compliant: boolean;
  policyA: AccessPolicy;
  policyB: AccessPolicy;
  authorization: 'none' | 'reader' | 'vm-contributor';
}
export type AccessInput = RbacInput | ConditionalInput;
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: object, fields: string[]) =>
  Object.keys(v).sort().join() === fields.sort().join();
const one = (v: unknown, a: readonly unknown[]) => a.includes(v);
const text = (v: unknown): v is string =>
  typeof v === 'string' &&
  v.length > 0 &&
  v.length <= 160 &&
  [...v].every((char) => char.charCodeAt(0) >= 32);
export function scopePath(c: ScopeContext, id: string): ScopeNode[] {
  const path: ScopeNode[] = [];
  let n = c.nodes.find((n) => n.id === id);
  while (n && !path.some((x) => x.id === n!.id) && path.length < 17) {
    path.unshift(n);
    n = c.nodes.find((x) => x.id === n!.parent);
  }
  return path;
}
export function validScopeContext(v: unknown): v is ScopeContext {
  if (
    !obj(v) ||
    !exact(v, ['origin', 'revision', 'tenant', 'nodes']) ||
    !one(v.origin, ['fjordverk', 'sandbox']) ||
    !Number.isSafeInteger(v.revision) ||
    Number(v.revision) < 0 ||
    !text(v.tenant) ||
    !Array.isArray(v.nodes) ||
    !v.nodes.length ||
    v.nodes.length > 16
  )
    return false;
  if (
    !v.nodes.every(
      (n) =>
        obj(n) &&
        exact(n, ['id', 'name', 'parent', 'kind']) &&
        text(n.id) &&
        text(n.name) &&
        (n.parent === null || text(n.parent)) &&
        one(n.kind, ['management', 'subscription', 'group', 'vm', 'resource', 'blob']),
    )
  )
    return false;
  const c = v as unknown as ScopeContext;
  if (new Set(c.nodes.map((n) => n.id)).size !== c.nodes.length) return false;
  return c.nodes.every((n) => {
    const path = scopePath(c, n.id);
    if (path.length > 8 || path[0]?.parent !== null || path[0]?.kind !== 'management') return false;
    if (n.parent === null) return n.kind === 'management';
    const p = c.nodes.find((x) => x.id === n.parent);
    return (
      !!p &&
      (n.kind === 'management'
        ? p.kind === 'management'
        : n.kind === 'subscription'
          ? p.kind === 'management'
          : n.kind === 'group'
            ? p.kind === 'subscription'
            : n.kind === 'blob'
              ? p.kind === 'resource'
              : n.kind === 'resource'
                ? ['group', 'resource'].includes(p.kind)
                : p.kind === 'group')
    );
  });
}
function validPolicy(v: unknown): v is AccessPolicy {
  return (
    obj(v) &&
    exact(v, ['state', 'audience', 'excludeEmergency', 'app', 'location', 'control']) &&
    one(v.state, ['off', 'report', 'on']) &&
    one(v.audience, ['all', 'team', 'emergency']) &&
    typeof v.excludeEmergency === 'boolean' &&
    one(v.app, ['all', 'azure', 'project']) &&
    one(v.location, ['all', 'outside']) &&
    one(v.control, ['mfa', 'device', 'both', 'either', 'block'])
  );
}
export function validAccessInput(v: unknown): v is AccessInput {
  if (!obj(v)) return false;
  if (v.kind === 'rbac')
    return (
      exact(v, [
        'kind',
        'context',
        'principal',
        'assignment',
        'member',
        'role',
        'second',
        'scope',
        'target',
        'action',
        'route',
        'deny',
      ]) &&
      validScopeContext(v.context) &&
      one(v.principal, ['user', 'service', 'managed']) &&
      one(v.assignment, ['user', 'group', 'service', 'managed', 'other']) &&
      typeof v.member === 'boolean' &&
      one(v.role, roles) &&
      one(v.second, roles) &&
      text(v.scope) &&
      text(v.target) &&
      v.context.nodes.some((n) => n.id === v.scope) &&
      v.context.nodes.some((n) => n.id === v.target) &&
      one(v.action, actions) &&
      one(v.route, ['entra-rbac', 'other']) &&
      typeof v.deny === 'boolean'
    );
  return (
    v.kind === 'conditional' &&
    exact(v, [
      'kind',
      'subject',
      'member',
      'app',
      'location',
      'authenticated',
      'mfa',
      'compliant',
      'policyA',
      'policyB',
      'authorization',
    ]) &&
    one(v.subject, ['employee', 'partner', 'emergency', 'service', 'managed']) &&
    one(v.app, ['azure', 'project']) &&
    one(v.location, ['known', 'outside']) &&
    ['member', 'authenticated', 'mfa', 'compliant'].every((k) => typeof v[k] === 'boolean') &&
    validPolicy(v.policyA) &&
    validPolicy(v.policyB) &&
    one(v.authorization, ['none', 'reader', 'vm-contributor'])
  );
}
export function initialAccess(kind: AccessInput['kind']): AccessInput {
  if (kind === 'rbac')
    return {
      kind,
      context: structuredClone(exampleContext),
      principal: 'user',
      assignment: 'user',
      member: true,
      role: 'reader',
      second: 'none',
      scope: 'sub-app',
      target: 'vm',
      action: 'view',
      route: 'entra-rbac',
      deny: false,
    };
  return {
    kind,
    subject: 'employee',
    member: true,
    app: 'azure',
    location: 'outside',
    authenticated: true,
    mfa: true,
    compliant: false,
    policyA: {
      state: 'on',
      audience: 'all',
      excludeEmergency: true,
      app: 'all',
      location: 'all',
      control: 'mfa',
    },
    policyB: {
      state: 'on',
      audience: 'all',
      excludeEmergency: true,
      app: 'all',
      location: 'all',
      control: 'device',
    },
    authorization: 'none',
  };
}
const permission = {
  view: '*/read (relevant control-plane read)',
  'modify-vm': 'Microsoft.Compute/virtualMachines/write',
  'delete-vm': 'Microsoft.Compute/virtualMachines/delete',
  'assign-role': 'Microsoft.Authorization/roleAssignments/write',
  'read-blob': 'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read',
} as const;
export function roleAllows(role: AccessRole, action: AccessAction, kind: ScopeNode['kind']) {
  if (role === 'none' || role === 'entra-admin') return false;
  if (action === 'view')
    return role === 'blob-reader'
      ? kind === 'blob'
      : role === 'vm-contributor'
        ? ['vm', 'group'].includes(kind)
        : role === 'custom-delete'
          ? false
          : true;
  if (action === 'assign-role') return role === 'owner' || role === 'rbac-admin';
  if (action === 'read-blob') return kind === 'blob' && role === 'blob-reader';
  if (kind !== 'vm') return false;
  return action === 'modify-vm'
    ? ['contributor', 'owner', 'vm-contributor', 'custom-no-delete'].includes(role)
    : ['contributor', 'owner', 'vm-contributor', 'custom-delete'].includes(role);
}
export function runRbac(raw: unknown) {
  if (!validAccessInput(raw) || raw.kind !== 'rbac') return null;
  const input = raw,
    target = input.context.nodes.find((n) => n.id === input.target)!,
    path = scopePath(input.context, input.target);
  const principalMatches =
    input.assignment === input.principal ||
    (input.principal === 'user' && input.assignment === 'group' && input.member);
  const inScope = path.some((n) => n.id === input.scope),
    inherited = inScope && input.scope !== input.target;
  const grantingRoles = [input.role, input.second].filter((r) =>
    roleAllows(r, input.action, target.kind),
  );
  const covered = principalMatches && inScope && grantingRoles.length > 0;
  const actionApplicable =
    input.action === 'view' ||
    input.action === 'assign-role' ||
    (input.action === 'read-blob' ? target.kind === 'blob' : target.kind === 'vm');
  const withinModel =
    input.route === 'entra-rbac' &&
    actionApplicable &&
    !(
      [input.role, input.second].includes('vm-contributor') &&
      input.action === 'view' &&
      target.kind === 'resource' &&
      !grantingRoles.length
    );
  const allowed = withinModel && covered && !input.deny;
  const cause: 'outside' | 'principal' | 'scope' | 'permission' | 'deny' | 'allowed' = !withinModel
    ? 'outside'
    : !principalMatches
      ? 'principal'
      : !inScope
        ? 'scope'
        : !grantingRoles.length
          ? 'permission'
          : input.deny
            ? 'deny'
            : 'allowed';
  return {
    input,
    target,
    path,
    principalMatches,
    inScope,
    inherited,
    grantingRoles,
    covered,
    allowed,
    withinModel,
    permission: permission[input.action],
    plane: input.action === 'read-blob' ? 'data' : 'control',
    scopeBreadth: input.context.nodes.filter((n) =>
      scopePath(input.context, n.id).some((p) => p.id === input.scope),
    ).length,
    cause,
    actualOperation: false,
    appResponse: null,
    outcome: (!withinModel ? 1 : allowed ? 2 : 0) as Outcome,
  };
}
export function evaluatePolicy(p: AccessPolicy, s: ConditionalInput) {
  const user = ['employee', 'partner', 'emergency'].includes(s.subject);
  const included =
    p.audience === 'all' ||
    (p.audience === 'team' && s.member) ||
    (p.audience === 'emergency' && s.subject === 'emergency');
  const excluded = p.excludeEmergency && s.subject === 'emergency';
  const targeted =
    user &&
    included &&
    !excluded &&
    (p.app === 'all' || p.app === s.app) &&
    (p.location === 'all' || s.location === 'outside');
  const applies = targeted && p.state !== 'off' && s.authenticated;
  const requirements =
    p.control === 'mfa'
      ? s.mfa
      : p.control === 'device'
        ? s.compliant
        : p.control === 'both'
          ? s.mfa && s.compliant
          : p.control === 'either'
            ? s.mfa || s.compliant
            : false;
  const would: 'block' | 'met' | 'either-needed' | 'both-needed' | 'mfa-needed' | 'device-needed' =
    p.control === 'block'
      ? 'block'
      : requirements
        ? 'met'
        : p.control === 'either'
          ? 'either-needed'
          : p.control === 'both' && !s.mfa && !s.compliant
            ? 'both-needed'
            : p.control === 'mfa' || (p.control === 'both' && !s.mfa)
              ? 'mfa-needed'
              : 'device-needed';
  return {
    policy: p,
    included,
    excluded,
    targeted,
    applies,
    requirements,
    would,
    enforced: applies && p.state === 'on',
    reportOnly: applies && p.state === 'report',
  };
}
export function runConditional(raw: unknown) {
  if (!validAccessInput(raw) || raw.kind !== 'conditional') return null;
  const input = raw,
    policies = [evaluatePolicy(input.policyA, input), evaluatePolicy(input.policyB, input)];
  const supported = !['service', 'managed'].includes(input.subject),
    enforced = policies.filter((p) => p.enforced);
  const blocked = enforced.some((p) => p.would === 'block'),
    missing = enforced.filter((p) => !p.requirements && p.would !== 'block');
  const status:
    'outside' | 'authentication' | 'blocked' | 'requirements' | 'not-applicable' | 'met' =
    !supported
      ? 'outside'
      : !input.authenticated
        ? 'authentication'
        : blocked
          ? 'blocked'
          : missing.length
            ? 'requirements'
            : !policies.some((p) => p.applies)
              ? 'not-applicable'
              : 'met';
  const caMet = supported && input.authenticated && !blocked && !missing.length;
  const r = initialAccess('rbac') as RbacInput;
  r.role = input.authorization;
  r.scope = 'vm';
  r.action = 'modify-vm';
  const rbac = runRbac(r)!,
    azure = input.app === 'azure';
  const combined = azure && caMet && rbac.allowed;
  return {
    input,
    policies,
    supported,
    enforced,
    blocked,
    missing,
    status,
    caMet,
    rbac,
    azure,
    combined,
    actualSignIn: false,
    tokenIssued: false,
    actualOperation: false,
    appResponse: null,
    outcome: (!supported ? 1 : !caMet ? 0 : !azure ? 1 : combined ? 2 : 0) as Outcome,
  };
}
export function runAccess(raw: unknown) {
  return runRbac(raw) ?? runConditional(raw);
}
/** Capture one actual current ancestry as a teaching snapshot, never a second inventory. */
export function sandboxScopeContext(world: World, targetId: string): ScopeContext | null {
  const nodes = managementHierarchy(world),
    path = ancestry(nodes, targetId);
  if (!path) return null;
  const selected = path.map((id) => nodes.find((n) => n.id === id)!);
  const mapped = selected.map((n) => ({
    id: n.id,
    name: n.name,
    parent: n.parentId ?? null,
    kind: (n.kind === 'management' ||
    n.kind === 'subscription' ||
    n.kind === 'group' ||
    n.kind === 'vm'
      ? n.kind
      : 'resource') as ScopeNode['kind'],
  }));
  const context: ScopeContext = {
    origin: 'sandbox',
    revision: world.revision,
    tenant: world.identity.name,
    nodes: mapped,
  };
  return validScopeContext(context) ? context : null;
}
