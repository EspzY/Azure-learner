export const accessSources = {
  AC01: [
    'Study guide for Exam AZ-900: Microsoft Azure Fundamentals | Microsoft Learn',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  AC02: [
    'Describe Azure identity, access, and security - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/',
  ],
  AC03: [
    'Describe Azure conditional access - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/5-conditional-access',
  ],
  AC04: [
    'Describe Azure role-based access control - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/6-role-based-access-control',
  ],
  AC05: [
    'What is Azure role-based access control (Azure RBAC)? | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview',
  ],
  AC06: [
    'Understand scope for Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview',
  ],
  AC07: [
    'Understand Azure role definitions - Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions',
  ],
  AC08: [
    'Azure roles, Microsoft Entra roles, and classic subscription administrator roles | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/rbac-and-directory-admin-roles',
  ],
  AC09: [
    'Microsoft Entra Conditional Access: Zero Trust Policy Engine - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview',
  ],
  AC10: [
    'Build Conditional Access policies in Microsoft Entra - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-policies',
  ],
  AC11: [
    'Conditional Access Policy Insights: Monitoring and Evaluation - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-report-only',
  ],
  AC12: [
    'The Conditional Access What If tool - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/what-if-tool',
  ],
  AC13: [
    'Manage emergency access admin accounts - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access',
  ],
  AC14: [
    'Conditional Access Setup: Users, Groups, Agents, and Workload Identities - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-users-groups',
  ],
  AC15: [
    'How to Configure Grant Controls in Microsoft Entra - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-grant',
  ],
  AC16: [
    'How to Use Conditions in Conditional Access Policies - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-conditions',
  ],
  AC17: [
    'Targeting Resources in Conditional Access Policies - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-cloud-apps',
  ],
  AC18: [
    'Azure built-in roles for Privileged - Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/privileged',
  ],
  AC19: [
    'Azure built-in roles for Compute - Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/compute',
  ],
  AC20: [
    'Azure built-in roles for Storage - Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/storage',
  ],
  AC21: [
    'List Azure deny assignments - Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments',
  ],
  AC22: [
    'Azure custom roles - Azure RBAC | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles',
  ],
  AC23: [
    'Assign an Azure Role for Blob Data Access - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/assign-azure-role-data-access',
  ],
  AC24: [
    'What is Azure attribute-based access control (Azure ABAC)? | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/role-based-access-control/conditions-overview',
  ],
  AC25: [
    'Microsoft Entra Conditional Access for workload identities - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/conditional-access/workload-identity',
  ],
  AC26: [
    'Control plane and data plane operations - Azure Resource Manager | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane',
  ],
  AC27: [
    'Overview of Azure Policy - Azure Policy | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/governance/policy/overview',
  ],
  AC28: [
    'Introduction - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/1-introduction',
  ],
  AC29: [
    'Summary - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/11-summary',
  ],
  AC30: [
    'Introduction to Cloud Infrastructure: Describe Azure Architecture and Services - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  ],
} as const;
export const accessStudySources = {
  introduction: ['AC01', 'AC02', 'AC03', 'AC04', 'AC28'],
  rbac: ['AC05', 'AC07'],
  scope: ['AC05', 'AC06'],
  roles: ['AC07', 'AC08', 'AC18', 'AC19', 'AC20', 'AC21', 'AC22'],
  planes: ['AC07', 'AC23', 'AC26', 'AC27'],
  conditional: ['AC09', 'AC10', 'AC14', 'AC15', 'AC16', 'AC17'],
  policies: ['AC10', 'AC11', 'AC12', 'AC17'],
  testing: ['AC09', 'AC11', 'AC12', 'AC13', 'AC14', 'AC25'],
  studio: ['AC05', 'AC06', 'AC10', 'AC15'],
} as const;
export const accessSourceReview = {
  reviewed: '2026-10-31',
  officialUnits: 12,
  protectedAssessment: 'not-opened',
  claims: {
    AC01: {
      claim: 'Current20July2026 study guide, scoped Conditional Access and Azure RBAC objectives.',
      updated: '2026-06-22T23:35:00.0000000Z',
      sha256: '177b736af1bae8702d9e04ef68bac8c1f2985838652bb40818a5ac25ed320716',
    },
    AC02: {
      claim: 'Actual12-unit module, public relevant units5/6; protected assessment not opened.',
      updated: '2026-10-28T17:12:00.0000000Z',
      sha256: '70aeac9267c6e6c173edeececfed3e522cd58a5734e5152653ac5dd083ed388b',
    },
    AC03: {
      claim:
        'Public CA signal/decision/enforcement introduction qualified by current product targeting/grant boundaries.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '8b4be3d7716d31635640625aef79bfd37499bfd1dbfea25f6c194c5d0b41664a',
    },
    AC04: {
      claim:
        'RBAC scope/least privilege; broad no-data-plane wording qualified by actual DataActions product docs.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '9cf779af36cc199e593f51ce06fc7de5ba08567ed30c352f483e84981ad67117',
    },
    AC05: {
      claim:
        'Principal/role/scope, group/transitive membership, additive grants and authorization evaluation.',
      updated: '2025-10-15T22:11:00.0000000Z',
      sha256: '43a071a048c21a91c864ec244b9bde76830f5e5d0cf3a78cafe215d929b2f641',
    },
    AC06: {
      claim:
        'Downward management-group/subscription/resource-group/resource inheritance; no upward/sibling grant.',
      updated: '2026-02-13T12:10:00.0000000Z',
      sha256: '7496f3cc8bf2baadc0ec52ef50989e3ea7da991e91c1d57a4eb817e0bb97ee91',
    },
    AC07: {
      claim:
        'Actions/NotActions/DataActions; subtract within one role, not global deny; another role can grant.',
      updated: '2026-05-24T11:44:00.0000000Z',
      sha256: 'e6345c607d8355bc6bec3e2cae51634d95acff36b197a7cd884bc089d4a9159d',
    },
    AC08: {
      claim:
        'Azure versus Entra roles, no automatic GlobalAdmin=Owner; explicit elevation is separate.',
      updated: '2026-05-07T06:30:00.0000000Z',
      sha256: '60ac604377d77d7906a3ccc82c9ce624f6fde2ff9a6ad4c6c6358a99e5469985',
    },
    AC09: {
      claim:
        'CA after first factor, signals, P1/bundles, risk P2/IDProtection and other product licenses.',
      updated: '2026-04-28T05:19:00.0000000Z',
      sha256: '4adbd9fa4ddff288176367dbe3c75ae3871be7f41d1e421ce4cee9d6a5490d20',
    },
    AC10: {
      claim:
        'All applicable policies must be satisfied; targeting and grant controls distinct, AND across policies.',
      updated: '2026-03-25T05:05:00.0000000Z',
      sha256: 'f4277335657c46d7ba3a86b852437807d5740f4db182a04e9d5c3735767166e3',
    },
    AC11: {
      claim:
        'Report-only evaluated not enforced, real certificate prompt qualifications, policy-impact preview context.',
      updated: '2026-06-01T22:39:00.0000000Z',
      sha256: 'c791760d9a4d1bb76bce6d09abaaae1f2c99636e0ef444c1cd8e9db361427dee',
    },
    AC12: {
      claim:
        'What If estimates supplied conditions, current supported identities, does not test service dependencies.',
      updated: '2026-08-27T22:38:00.0000000Z',
      sha256: '1818b215417988d46af9d7d42c2ba7145fefd5ad3bdddaf03538096fb0d1fb27',
    },
    AC13: {
      claim:
        'Current emergency account protections, restrict-policy exclusions, monitoring/testing, mandatory MFA remains.',
      updated: '2026-06-05T07:33:00.0000000Z',
      sha256: 'f664bc138d38833f0d2ad7569b132710e6330e2b9ba3a94e194f7e95f34f3cbc',
    },
    AC14: {
      claim:
        'Identity inclusion/exclusion precedence perpolicy; user/group/directory role and workload distinctions.',
      updated: '2026-05-18T22:35:00.0000000Z',
      sha256: 'cb3d3eb20e80424a6fdf9486ca326abd5e69bc82712eb01399f004a9185cd55e',
    },
    AC15: {
      claim:
        'Within-policy AND/OR grant controls, MFA/compliance/block distinctions; other controls outside model.',
      updated: '2026-06-16T22:43:00.0000000Z',
      sha256: 'a6fb21471181b5aa389facf3d1c984844da594352aed85e8844eb7d141855d2a',
    },
    AC16: {
      claim: 'Actual condition signals and limits; no fabricated risk/device verification.',
      updated: '2026-09-28T17:38:00.0000000Z',
      sha256: '64bbe46375e850fc8060ddf5213b74a6e2ec05821f1c60ab7239eba60131084f',
    },
    AC17: {
      claim:
        'Target-resource include/exclude and app boundaries distinct from principal targeting.',
      updated: '2026-05-28T07:44:00.0000000Z',
      sha256: 'f3a01f32d826d57c265ad7bf7b30a5fb89192920a8cfa8a88cbb701d9f3fa07a',
    },
    AC18: {
      claim:
        'Current Contributor/Owner/RBAC Administrator definitions, access delegation and */read qualification.',
      updated: '2026-07-01T23:48:00.0000000Z',
      sha256: '19505a0cf80b0d87e9f0c2635e172feae4f9ec80de351cb55125f2fbc541622c',
    },
    AC19: {
      claim:
        'VM Contributor actual operation set and other scoped management permissions; not full data isolation.',
      updated: '2026-07-01T23:48:00.0000000Z',
      sha256: 'ba794e3a473d303386289704e66cfc277cc013bd18c07303821881b6d200c594',
    },
    AC20: {
      claim:
        'Blob Data Reader includes data read plus service-specific Actions; not arbitrary account management.',
      updated: '2026-07-01T23:48:00.0000000Z',
      sha256: '44e8e39bdc4e532a41a24081ee804524e3a97a4263d5cabf29c34897be894952',
    },
    AC21: {
      claim:
        'Applicable deny assignments distinct from role NotActions and additional role grants.',
      updated: '2026-10-07T17:13:00.0000000Z',
      sha256: '79e84053b318c439921d0c83de84f02b58b82efb0e0cce2d6171a6c37485bfe3',
    },
    AC22: {
      claim: 'Custom roles concept and assignable scopes, not a deployed role definition.',
      updated: '2026-04-30T17:19:00.0000000Z',
      sha256: 'a2415dd73d9ed3f04f9941974f52f5e822045148e48857b3287bf87465947652',
    },
    AC23: {
      claim:
        'Entra/RBAC Blob API data role scope; Portal navigation and alternate keys/SAS are separate.',
      updated: '2026-05-09T06:18:00.0000000Z',
      sha256: 'd3b18badf827f59881c5d3ceb560b9aa05249292b9c48d4b042fa186464a5765',
    },
    AC24: {
      claim: 'ABAC conditions can qualify RBAC service grants; not implemented as an engine.',
      updated: '2025-09-09T05:11:00.0000000Z',
      sha256: 'da714801369b000daf04bd5cdd6230638d300b0c7d30e51fb18ca45b8014ac71',
    },
    AC25: {
      claim:
        'Workload CA direct single-tenant principal targeting/Workload ID Premium; no managed identity or group-MFA equivalence.',
      updated: '2026-05-18T22:35:00.0000000Z',
      sha256: 'fedbd80393cc63e9e3fa5e583fc3241e7153ccb6742192869cc36817404cc279',
    },
    AC26: {
      claim: 'Control plane versus data plane and service-specific authorization paths.',
      updated: '2026-02-27T18:31:00.0000000Z',
      sha256: 'be7a2dbed6422d1faac6d015f1f001157a0e9a11190c8590ffdbc84a14cc782a',
    },
    AC27: {
      claim:
        'Azure Policy configuration rules distinct from authority; valid RBAC does not override applicable Policy deny.',
      updated: '2026-07-08T05:12:00.0000000Z',
      sha256: '7e01f318bb65486430622adca4000d2f8543a49e0b6cb12026e525a9ee751060',
    },
    AC28: {
      claim: 'Official public introduction/discovery, no protected question use.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '0ce001af136a8d592905aad76fd63d8e61deddc1316e06ca795b205b73caf8f0',
    },
    AC29: {
      claim: 'Official public summary, source discovery and later-unit scope.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '1045366e34c1525a1e333a72c05e9c0a4a77a42cd270513d241020a6c3ed423e',
    },
    AC30: {
      claim:
        'Actual official five-module path and identity/security-module discovery; no unrelated unit re-audit.',
      updated: '2026-10-28T17:12:00.0000000Z',
      sha256: '495d8c70d431838e52036777509a578f87a11855abc47cc147c936d1b83f057c',
    },
  },
} as const;
