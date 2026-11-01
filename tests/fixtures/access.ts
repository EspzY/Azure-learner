import {
  initialAccess,
  type RbacInput,
  type ConditionalInput,
  type AccessPolicy,
} from '../../src/domain/curriculum/access-control-model';
export const rbac = (v: Partial<RbacInput> = {}) =>
  ({ ...initialAccess('rbac'), ...v }) as RbacInput;
export const conditional = (
  v: Partial<ConditionalInput> = {},
  a: Partial<AccessPolicy> = {},
  b: Partial<AccessPolicy> = {},
) => {
  const s = { ...initialAccess('conditional'), ...v } as ConditionalInput;
  return { ...s, policyA: { ...s.policyA, ...a }, policyB: { ...s.policyB, ...b } };
};
export const accessContrasts = {
  rbac: [
    rbac(),
    rbac({ action: 'modify-vm' }),
    rbac({ role: 'contributor', scope: 'rg-app', action: 'modify-vm' }),
    rbac({ role: 'contributor', scope: 'rg-app', action: 'assign-role' }),
    rbac({ role: 'contributor', scope: 'mg', action: 'modify-vm' }),
    rbac({ role: 'vm-contributor', scope: 'vm', action: 'modify-vm' }),
    rbac({ scope: 'vm', target: 'rg-app' }),
    rbac({ scope: 'sub-app', target: 'rg-app' }),
  ],
  conditional: [
    conditional(),
    conditional({ compliant: true }),
    conditional({ compliant: true }, {}, { control: 'block' }),
    conditional({ compliant: true }, {}, { state: 'report', control: 'block' }),
    conditional({ mfa: false, member: false }, { audience: 'team' }, { state: 'off' }),
    conditional({ mfa: false, member: true }, { audience: 'team' }, { state: 'off' }),
    conditional({ compliant: true }),
    conditional({ compliant: true, authorization: 'vm-contributor' }),
    conditional({ compliant: true, mfa: false, authorization: 'vm-contributor' }),
    conditional({ compliant: true, mfa: false, authorization: 'none' }),
  ],
};
