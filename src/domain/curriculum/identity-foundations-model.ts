/** P10 / 1.0.0: declared educational facts, never credentials, tokens, policy or World. */
export const identityModelVersion = '1.0.0';
export type Outcome = 0 | 1 | 2;
export interface DirectoryInput {
  kind: 'directory';
  workload: 'modern' | 'legacy' | 'schema';
  solution: 'entra' | 'managed' | 'adds';
  sync: 'ready' | 'pending';
  change: 'none' | 'synced' | 'local';
}
export const methods = [
  'password',
  'two-secrets',
  'password-otp',
  'passkey',
  'hello',
  'authenticator',
  'sms',
] as const;
export type Method = (typeof methods)[number];
export type Strength = 'single' | 'mfa' | 'resistant';
export interface JourneyInput {
  kind: 'journey';
  identity: boolean;
  trust: boolean;
  credential: 'verified' | 'unregistered' | 'failed';
  method: Method;
  session: 'none' | Strength;
  requirement: Strength;
  access: 'allow' | 'deny' | 'unknown';
}
export interface ExternalInput {
  kind: 'external';
  audience: 'partner' | 'customer' | 'shared';
  approach: 'b2b' | 'direct' | 'customer';
  home: 'entra' | 'other';
  guest: boolean;
  invitation: boolean;
  inbound: boolean;
  outbound: boolean;
  homeAuth: boolean;
  access: 'allow' | 'deny' | 'unknown';
}
export type IdentityInput = DirectoryInput | JourneyInput | ExternalInput;
export const methodFacts = {
  password: { factors: ['knowledge'], passwordless: false, mfa: false, resistant: false },
  'two-secrets': { factors: ['knowledge'], passwordless: false, mfa: false, resistant: false },
  'password-otp': {
    factors: ['knowledge', 'possession'],
    passwordless: false,
    mfa: true,
    resistant: false,
  },
  passkey: {
    factors: ['possession', 'knowledge-or-inherence'],
    passwordless: true,
    mfa: true,
    resistant: true,
  },
  hello: {
    factors: ['possession', 'knowledge-or-inherence'],
    passwordless: true,
    mfa: true,
    resistant: true,
  },
  authenticator: {
    factors: ['possession', 'knowledge-or-inherence'],
    passwordless: true,
    mfa: true,
    resistant: false,
  },
  sms: { factors: ['possession'], passwordless: true, mfa: false, resistant: false },
} as const;
export const directoryCapabilities = {
  entra: { modern: true, legacy: false, schema: false },
  managed: { modern: false, legacy: true, schema: false },
  adds: { modern: false, legacy: true, schema: true },
} as const;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: object, fields: string[]) =>
  Object.keys(v).sort().join(',') === fields.sort().join(',');
const one = (v: unknown, values: readonly unknown[]) => values.includes(v);
export function validIdentityInput(v: unknown): v is IdentityInput {
  if (!object(v)) return false;
  if (v.kind === 'directory')
    return (
      exact(v, ['kind', 'workload', 'solution', 'sync', 'change']) &&
      one(v.workload, ['modern', 'legacy', 'schema']) &&
      one(v.solution, ['entra', 'managed', 'adds']) &&
      one(v.sync, ['ready', 'pending']) &&
      one(v.change, ['none', 'synced', 'local'])
    );
  if (v.kind === 'journey')
    return (
      exact(v, [
        'kind',
        'identity',
        'trust',
        'credential',
        'method',
        'session',
        'requirement',
        'access',
      ]) &&
      typeof v.identity === 'boolean' &&
      typeof v.trust === 'boolean' &&
      one(v.credential, ['verified', 'unregistered', 'failed']) &&
      one(v.method, methods) &&
      one(v.session, ['none', 'single', 'mfa', 'resistant']) &&
      one(v.requirement, ['single', 'mfa', 'resistant']) &&
      one(v.access, ['allow', 'deny', 'unknown'])
    );
  return (
    v.kind === 'external' &&
    exact(v, [
      'kind',
      'audience',
      'approach',
      'home',
      'guest',
      'invitation',
      'inbound',
      'outbound',
      'homeAuth',
      'access',
    ]) &&
    one(v.audience, ['partner', 'customer', 'shared']) &&
    one(v.approach, ['b2b', 'direct', 'customer']) &&
    one(v.home, ['entra', 'other']) &&
    ['guest', 'invitation', 'inbound', 'outbound', 'homeAuth'].every(
      (k) => typeof v[k] === 'boolean',
    ) &&
    one(v.access, ['allow', 'deny', 'unknown'])
  );
}
export function initialIdentity(kind: IdentityInput['kind']): IdentityInput {
  if (kind === 'directory')
    return { kind, workload: 'modern', solution: 'entra', sync: 'ready', change: 'none' };
  if (kind === 'journey')
    return {
      kind,
      identity: true,
      trust: true,
      credential: 'verified',
      method: 'password',
      session: 'none',
      requirement: 'single',
      access: 'unknown',
    };
  return {
    kind,
    audience: 'partner',
    approach: 'b2b',
    home: 'entra',
    guest: false,
    invitation: true,
    inbound: true,
    outbound: true,
    homeAuth: true,
    access: 'unknown',
  };
}
export function runDirectory(raw: unknown) {
  if (!validIdentityInput(raw) || raw.kind !== 'directory') return null;
  const input = raw,
    capabilities = directoryCapabilities[input.solution];
  const capability = capabilities[input.workload];
  const writeAllowed = input.solution !== 'managed' || input.change !== 'synced';
  const credentialsReady = input.solution !== 'managed' || input.sync === 'ready';
  const compatible = capability && writeAllowed;
  const ready = compatible && credentialsReady;
  const cause = !capability
    ? 'capability'
    : !writeAllowed
      ? 'readonly'
      : !credentialsReady
        ? 'sync'
        : 'fit';
  return {
    input,
    capabilities,
    compatible,
    ready,
    writeAllowed,
    credentialsReady,
    cause,
    syncBack: false,
    actualDeployment: false,
    outcome: (!compatible ? 0 : !ready ? 1 : 2) as Outcome,
  } as const;
}
const meets = (strength: Strength, requirement: Strength) =>
  ({ single: 1, mfa: 2, resistant: 3 })[strength] >=
  { single: 1, mfa: 2, resistant: 3 }[requirement];
export function runJourney(raw: unknown) {
  if (!validIdentityInput(raw) || raw.kind !== 'journey') return null;
  const input = raw,
    method = methodFacts[input.method];
  const reused =
    input.identity &&
    input.trust &&
    input.session !== 'none' &&
    meets(input.session, input.requirement);
  const identityProven =
    input.identity && input.trust && (reused || input.credential === 'verified');
  const strength: Strength = method.resistant ? 'resistant' : method.mfa ? 'mfa' : 'single';
  const requirementsMet = identityProven && (reused || meets(strength, input.requirement));
  const access = !requirementsMet
    ? 'not-evaluated'
    : input.access === 'allow'
      ? 'allowed'
      : input.access === 'deny'
        ? 'denied'
        : 'unknown';
  const cause = !input.identity
    ? 'identity'
    : !input.trust
      ? 'trust'
      : reused
        ? 'reused'
        : input.credential !== 'verified'
          ? 'credential'
          : !requirementsMet
            ? 'strength'
            : 'verified';
  return {
    input,
    method,
    reused,
    identityProven,
    requirementsMet,
    access,
    cause,
    methodChecked: !reused && input.identity && input.trust && input.credential === 'verified',
    evidence: reused ? input.session : identityProven ? strength : null,
    actualSignIn: false,
    tokenIssued: false,
    appResponse: null,
    outcome: (!requirementsMet || access === 'denied'
      ? 0
      : access === 'unknown'
        ? 1
        : 2) as Outcome,
  } as const;
}
export function runExternal(raw: unknown) {
  if (!validIdentityInput(raw) || raw.kind !== 'external') return null;
  const input = raw;
  // Scenario goals: partner custom app; shared channel without guest; separate customer lifecycle.
  const fit =
    input.audience === 'partner'
      ? input.approach === 'b2b'
      : input.audience === 'shared'
        ? input.approach === 'direct'
        : input.approach === 'customer';
  const tenant = input.approach === 'customer' ? 'external' : 'workforce';
  const crossRequired =
    input.approach === 'direct' || (input.approach === 'b2b' && input.home === 'entra');
  const crossAllowed = !crossRequired || (input.inbound && input.outbound);
  const mechanismSupported =
    input.approach !== 'direct' || (input.audience === 'shared' && input.home === 'entra');
  const representationReady = input.approach !== 'b2b' || input.guest;
  const invitationBlocked = input.approach === 'b2b' && !input.guest && !input.invitation;
  const ready =
    fit && mechanismSupported && crossAllowed && representationReady && !invitationBlocked;
  const resourceAccepted = ready && input.homeAuth;
  const access = !resourceAccepted
    ? 'not-evaluated'
    : input.access === 'allow'
      ? 'allowed'
      : input.access === 'deny'
        ? 'denied'
        : 'unknown';
  const cause = !fit
    ? 'purpose'
    : !mechanismSupported
      ? 'direct-scope'
      : !crossAllowed
        ? 'cross'
        : invitationBlocked
          ? 'invitation'
          : !representationReady
            ? 'guest'
            : !input.homeAuth
              ? 'authentication'
              : 'ready';
  return {
    input,
    fit,
    tenant,
    crossRequired,
    crossAllowed,
    mechanismSupported,
    representationReady,
    invitationBlocked,
    ready,
    homeProof: input.homeAuth,
    resourceAccepted,
    access,
    cause,
    homeProvider: input.approach !== 'customer',
    guestRequired: input.approach === 'b2b',
    adminGranted: false,
    accountCreated: false,
    tokenIssued: false,
    appResponse: null,
    outcome: (!fit ||
    !mechanismSupported ||
    !crossAllowed ||
    invitationBlocked ||
    access === 'denied'
      ? 0
      : !resourceAccepted || access === 'unknown'
        ? 1
        : 2) as Outcome,
  } as const;
}
export function runIdentity(input: unknown) {
  return runDirectory(input) ?? runJourney(input) ?? runExternal(input);
}
