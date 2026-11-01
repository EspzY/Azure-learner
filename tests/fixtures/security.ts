import {
  initialSecurity,
  type TrustInput,
  type DepthInput,
  type DefenderInput,
} from '../../src/domain/curriculum/security-model';
export const trust = (v: Partial<TrustInput> = {}) =>
  ({ ...initialSecurity('trust'), ...v }) as TrustInput;
export const depth = (v: Partial<DepthInput> = {}) =>
  ({ ...initialSecurity('depth'), ...v }) as DepthInput;
export const defender = (v: Partial<DefenderInput> = {}) =>
  ({ ...initialSecurity('defender'), ...v }) as DefenderInput;
const verified = { device: 'documented' as const, contextReview: true };
const bounded = { ...verified, scope: 'minimal' as const, duration: 'task-bound' as const };
const host = {
  risk: 'host' as const,
  inspectedLayer: 'compute' as const,
  primary: 'patch' as const,
  complement: 'backup' as const,
  complementConfigured: true,
};
const app = {
  risk: 'application' as const,
  inspectedLayer: 'application' as const,
  primary: 'app' as const,
  complementConfigured: true,
};
export const securityContrasts = {
  trust: [
    trust(),
    trust({ network: 'external' }),
    trust(verified),
    trust(bounded),
    trust({
      ...bounded,
      segmented: true,
      dataProtection: true,
      observability: true,
      recovery: true,
    }),
  ],
  depth: [
    depth(),
    depth({ complementConfigured: true }),
    depth({ complementConfigured: true, failure: 'identity' }),
    depth(host),
    depth({ ...host, failure: 'compute' }),
    depth({ ...app, complement: 'encrypt' }),
    depth({ ...app, complement: 'dataScope' }),
  ],
  defender: [
    defender(),
    defender({ feature: 'workload', followUp: 'confirm-coverage' }),
    defender({ feature: 'workload', followUp: 'investigate-evidence', workloadPlan: true }),
    defender({ feature: 'risk-prioritization', followUp: 'confirm-coverage' }),
    defender({ feature: 'risk-prioritization', posturePlan: 'defender' }),
    defender({ feature: 'risk-prioritization', posturePlan: 'defender', scoreView: 'cloud-risk' }),
  ],
};
