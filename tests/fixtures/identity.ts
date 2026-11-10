import type {
  IdentityInput,
  DirectoryInput,
  JourneyInput,
  ExternalInput,
} from '../../src/domain/curriculum/identity-foundations-model';
export const directory: DirectoryInput = {
  kind: 'directory',
  workload: 'modern',
  solution: 'entra',
  sync: 'ready',
  change: 'none',
};
export const journey: JourneyInput = {
  kind: 'journey',
  identity: true,
  trust: true,
  credential: 'verified',
  method: 'password',
  session: 'none',
  requirement: 'mfa',
  access: 'unknown',
};
export const external: ExternalInput = {
  kind: 'external',
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
export const identityContrasts: Record<IdentityInput['kind'], IdentityInput[]> = {
  directory: [
    directory,
    { ...directory, workload: 'legacy' },
    { ...directory, workload: 'legacy', solution: 'managed' },
    { ...directory, workload: 'legacy', solution: 'managed', sync: 'pending' },
    { ...directory, workload: 'legacy', solution: 'managed', change: 'synced' },
    { ...directory, workload: 'legacy', solution: 'managed', change: 'local' },
    { ...directory, workload: 'schema', solution: 'managed' },
    { ...directory, workload: 'schema', solution: 'adds' },
  ],
  journey: [
    { ...journey, method: 'two-secrets' },
    { ...journey, session: 'single' },
    { ...journey, session: 'single', method: 'passkey' },
    { ...journey, session: 'mfa', credential: 'failed' },
    { ...journey, method: 'passkey', access: 'deny' },
    { ...journey, method: 'passkey', access: 'allow' },
    { ...journey, method: 'sms' },
    { ...journey, method: 'hello' },
  ],
  external: [
    external,
    { ...external, guest: true, access: 'deny' },
    { ...external, audience: 'customer', guest: true },
    { ...external, audience: 'customer', approach: 'customer' },
    { ...external, audience: 'shared', approach: 'direct', outbound: false },
    { ...external, audience: 'shared', approach: 'direct' },
    { ...external, guest: true, invitation: false },
  ],
};
