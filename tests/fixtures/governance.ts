import {
  initialGovernance,
  type DataInput,
  type PolicyInput,
  type LockInput,
} from '../../src/domain/curriculum/governance-model';
export const data = (v: Partial<DataInput> = {}) =>
  ({ ...initialGovernance('data'), ...v }) as DataInput;
export const policy = (v: Partial<PolicyInput> = {}) =>
  ({ ...initialGovernance('policy'), ...v }) as PolicyInput;
export const locks = (v: Partial<LockInput> = {}) =>
  ({ ...initialGovernance('locks'), ...v }) as LockInput;
const curated = {
  registered: true,
  classification: 'business' as const,
  owner: 'finance' as const,
  glossary: true,
};
export const governanceContrasts = {
  data: [
    data(),
    data({ registered: true }),
    data({ registered: true, classification: 'business' }),
    data(curated),
    data({ ...curated, lineage: true }),
    data({ ...curated, lineage: true, sourceAuthorized: true }),
  ],
  policy: [
    policy(),
    policy({ effect: 'deny' }),
    policy({ effect: 'deny', resourceScope: 'rg-shared' }),
    policy({ effect: 'deny', resourceScope: 'rg-shared', assignment: 'mg-lab' }),
  ],
  locks: [
    locks(),
    locks({ operation: 'delete-vm' }),
    locks({ operation: 'start-vm' }),
    locks({ operation: 'start-vm', lock: 'readonly' }),
    locks({ target: 'account', scope: 'account', lock: 'readonly', operation: 'list-keys' }),
    locks({ target: 'account', scope: 'account', lock: 'readonly', operation: 'delete-blob' }),
    locks({ target: 'rg-app', scope: 'vm', lock: 'none', operation: 'delete-group' }),
    locks({ target: 'rg-app', scope: 'vm', lock: 'delete', operation: 'delete-group' }),
  ],
};
