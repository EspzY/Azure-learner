/** Source claims actually checked before manuscript. Named fields avoid title/URL inversion. */
export const securitySources = {
  SE01: {
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
    title: 'Study guide for Exam AZ-900: Microsoft Azure Fundamentals | Microsoft Learn',
  },
  SE02: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/',
    title: 'Describe Azure identity, access, and security - Training | Microsoft Learn',
  },
  SE03: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/7-describe-zero-trust-model',
    title: 'Describe Zero Trust model - Training | Microsoft Learn',
  },
  SE04: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/8-describe-defense-depth',
    title: 'Describe defense-in-depth - Training | Microsoft Learn',
  },
  SE05: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/9a-describe-encryption-key-management',
    title: 'Describe encryption and key management in Azure - Training | Microsoft Learn',
  },
  SE06: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/9-describe-microsoft-defender-for-cloud',
    title: 'Describe Microsoft Defender for Cloud - Training | Microsoft Learn',
  },
  SE07: {
    url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
    title: 'Zero Trust as a security foundation | Microsoft Learn',
  },
  SE08: {
    url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/zero-trust',
    title: 'Zero Trust security in Azure | Microsoft Learn',
  },
  SE09: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction',
    title: 'Microsoft Defender for Cloud Overview - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE10: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-cloud-security-posture-management',
    title:
      'What is Cloud Security Posture Management (CSPM) - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE11: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/security-recommendations',
    title: 'Security Recommendations - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE12: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/secure-score-security-controls',
    title:
      'Cloud Secure Score in Microsoft Defender for Cloud - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE13: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/manage-respond-alerts',
    title: 'Manage and Respond to Security Alerts - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE14: {
    url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/overview',
    title: 'Azure Key Vault Overview - Azure Key Vault | Microsoft Learn',
  },
  SE15: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/1-introduction',
    title: 'Introduction - Training | Microsoft Learn',
  },
  SE16: {
    url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/11-summary',
    title: 'Summary - Training | Microsoft Learn',
  },
  SE17: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/alerts-overview',
    title: 'Security Alerts and Incidents - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE18: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-servers-overview',
    title:
      'Overview of Defender for Servers in Defender for Cloud - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE19: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-containers-introduction',
    title:
      'Introduction to Microsoft Defender for Containers - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE20: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-introduction',
    title:
      'What is Microsoft Defender for Storage - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE21: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-databases-introduction',
    title:
      'Overview of Defender for Open-Source Relational Databases - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE22: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-app-service-introduction',
    title:
      'Microsoft Defender for App Service - Benefits and Features - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE23: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/support-matrix-defender-for-cloud',
    title:
      'Interoperability with Azure services, Azure clouds, and client operating systems - Microsoft Defender for Cloud | Microsoft Learn',
  },
  SE24: {
    url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/encryption-overview',
    title: 'Azure encryption overview | Microsoft Learn',
  },
  SE25: {
    url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates',
    title: 'Azure Key Vault Keys, Secrets, and Certificates Overview | Microsoft Learn',
  },
  SE26: {
    url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/secure-key-vault',
    title: 'Secure your Azure Key Vault | Microsoft Learn',
  },
  SE27: {
    url: 'https://learn.microsoft.com/en-us/azure/key-vault/keys/how-to-configure-key-rotation',
    title: 'Configure cryptographic key auto-rotation in Azure Key Vault | Microsoft Learn',
  },
  SE28: {
    url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/risk-prioritization',
    title: 'Risk prioritization - Microsoft Defender for Cloud | Microsoft Learn',
  },
} as const;
export const securityStudySources = {
  introduction: ['SE01', 'SE02', 'SE15', 'SE07'],
  'zero-trust': ['SE03', 'SE07', 'SE08'],
  depth: ['SE04', 'SE08'],
  encryption: ['SE05', 'SE14', 'SE24', 'SE25', 'SE26', 'SE27'],
  defender: ['SE06', 'SE09', 'SE23'],
  posture: ['SE10', 'SE11', 'SE28'],
  protection: ['SE13', 'SE17', 'SE18', 'SE19', 'SE20', 'SE21', 'SE22'],
  score: ['SE12', 'SE28'],
  studio: ['SE07', 'SE04', 'SE10', 'SE12', 'SE17', 'SE23'],
} as const;
export const securitySourceReview = {
  reviewed: '2026-11-01',
  officialUnits: 12,
  publicScopedUnits: ['1', '7', '8', '9a', '9', '11'],
  preservedPrerequisiteUnits: ['2', '3', '4', '5', '6'],
  protectedAssessment: '10-not-opened',
  scope: ['2.4.06', '2.4.07', '2.4.08'],
  supplement: 'encryption-key-management',
  sources: [
    {
      id: 'SE01',
      url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
      final:
        'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
      status: 200,
      title: 'Study guide for Exam AZ-900: Microsoft Azure Fundamentals | Microsoft Learn',
      updated: '2026-06-22T23:35:00.0000000Z',
      sha256: '177b736af1bae8702d9e04ef68bac8c1f2985838652bb40818a5ac25ed320716',
      bytes: 11486,
      retrieved: '2026-11-01T14:11:03.679821+00:00',
      claim:
        'Current July20 AZ-900 guide: only2.4.06–08; encryption/key management is Learn supplement, not a fourth exam objective.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE02',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/',
      status: 200,
      title: 'Describe Azure identity, access, and security - Training | Microsoft Learn',
      updated: '2026-10-28T17:12:00.0000000Z',
      sha256: '70aeac9267c6e6c173edeececfed3e522cd58a5734e5152653ac5dd083ed388b',
      bytes: 4891,
      retrieved: '2026-11-01T14:11:03.681174+00:00',
      claim:
        'Twelve-unit Identity/Access/Security module; P15 units7,8,9a,9 and public introduction/summary scoped; units2–6 preserved prerequisite material; protected10assessment not opened.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE03',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/7-describe-zero-trust-model',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/7-describe-zero-trust-model',
      status: 200,
      title: 'Describe Zero Trust model - Training | Microsoft Learn',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: 'c4ec67fb9ed259b58e09d0fe958b0b94efa1a699339ef43c478528661131d411',
      bytes: 4436,
      retrieved: '2026-11-01T14:11:03.682226+00:00',
      claim:
        'Three Zero Trust principles; network location is insufficient; authentication plus authorization/context; broad Learn shorthand qualified by actual Azure documentation.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE04',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/8-describe-defense-depth',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/8-describe-defense-depth',
      status: 200,
      title: 'Describe defense-in-depth - Training | Microsoft Learn',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: 'bf47072ee09485b3477bdb9d1fcd6903f04325468b1074c2c36d70a5627094f5',
      bytes: 7420,
      retrieved: '2026-11-01T14:11:03.683027+00:00',
      claim:
        'Seven layers and their purpose/controls; layered reduction not an absolute protection guarantee. Original AzureLab diagram only.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE05',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/9a-describe-encryption-key-management',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/9a-describe-encryption-key-management',
      status: 200,
      title: 'Describe encryption and key management in Azure - Training | Microsoft Learn',
      updated: '2026-03-24T01:47:00.0000000Z',
      sha256: '889967b38d712741d373929ac457a2a1479e0b468651dc4643affc1fbfe8cbe0',
      bytes: 4641,
      retrieved: '2026-11-01T14:11:04.247952+00:00',
      claim:
        'Encryption at rest/in transit, keys/secrets/certificates and centralized Key Vault; rotation/access responsibilities remain separate.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE06',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/9-describe-microsoft-defender-for-cloud',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/9-describe-microsoft-defender-for-cloud',
      status: 200,
      title: 'Describe Microsoft Defender for Cloud - Training | Microsoft Learn',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: 'c27dc44cf773d422d43f8bd4507aee1fd492f3a847dd70bb8078b988bf32cfa0',
      bytes: 6975,
      retrieved: '2026-11-01T14:11:04.250371+00:00',
      claim:
        'Learn assessment/secure/defend overview; Azure/hybrid/multicloud connectivity/plan prerequisites qualified by current product sources.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE07',
      url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
      final: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
      status: 200,
      title: 'Zero Trust as a security foundation | Microsoft Learn',
      updated: '2026-05-31T12:33:00.0000000Z',
      sha256: '6c7b0b94d67f8736c6c05c326c5b5e2a19f2cf7f28a7d583dd3244fec71de23b',
      bytes: 7327,
      retrieved: '2026-11-01T14:11:04.293263+00:00',
      claim:
        'Zero Trust is a strategy covering explicit contextual verification, shortest adequate access and assume-breach containment/detection, not a product or confirmed incident.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE08',
      url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/zero-trust',
      final: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/zero-trust',
      status: 200,
      title: 'Zero Trust security in Azure | Microsoft Learn',
      updated: '2026-07-24T18:54:00.0000000Z',
      sha256: 'c7d946d3d9ee6e72045d081a678f3a890cdefa5af8a6602adccc1ed0a7ec9c4e',
      bytes: 12960,
      retrieved: '2026-11-01T14:11:04.364289+00:00',
      claim:
        'Azure Zero Trust patterns: MFA/CA/RBAC/managed identities, segmentation, encryption/monitoring/recovery are coordinated controls, not a new evaluator.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE09',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction',
      status: 200,
      title:
        'Microsoft Defender for Cloud Overview - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-08-10T22:36:00.0000000Z',
      sha256: '72dfee448af156964f26beaa7d1c58f0a3420c4c5e39600f8f0be6de91075d7c',
      bytes: 21876,
      retrieved: '2026-11-01T14:11:04.525249+00:00',
      claim:
        'CNAPP combines CSPM, CWPP and DevSecOps; expanding Defender portal differs from Azure portal; extra plans/collection/support required; advanced AI/SOC products outside P15.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE10',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-cloud-security-posture-management',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-cloud-security-posture-management',
      status: 200,
      title:
        'What is Cloud Security Posture Management (CSPM) - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-09-30T17:37:00.0000000Z',
      sha256: '1b1e18470b0d1d322af8762daff3a4a066cf31ef7ca2658980088d644ca7fffe',
      bytes: 22526,
      retrieved: '2026-11-01T14:11:04.529349+00:00',
      claim:
        'Free Foundational CSPM versus paid Defender CSPM; risk prioritization/attack paths and advanced DevOps are plan-dependent. Some recommendations require CWPP. Regional/cloud/resource availability varies.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE11',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/security-recommendations',
      final: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/security-recommendations',
      status: 200,
      title: 'Security Recommendations - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-06-17T12:36:00.0000000Z',
      sha256: 'a1162bf672519dfe7d07a982194cb59ca401dbe3d6d232ecc82c97f67845f068',
      bytes: 10412,
      retrieved: '2026-11-01T14:11:04.545095+00:00',
      claim:
        'Posture recommendations arise from assessment; risk context differs from threat evidence; risk-level evaluation requires relevant Defender CSPM coverage and is not universal safety proof.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE12',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/secure-score-security-controls',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/secure-score-security-controls',
      status: 200,
      title:
        'Cloud Secure Score in Microsoft Defender for Cloud - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-07-07T17:36:00.0000000Z',
      sha256: 'a89e39681dd655f53410ef190997d1fffc945629de7899fa837ee8956c57cd7d',
      bytes: 33700,
      retrieved: '2026-11-01T14:11:04.806821+00:00',
      claim:
        'Both actual portal pivots reviewed: classic control-based Secure Score and risk-based Cloud Secure Score have different calculations/values. No numeric score computed in AzureLab; changing coverage can change score; preview recommendation qualification applies today.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE13',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/managing-and-responding-alerts',
      final: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/manage-respond-alerts',
      status: 200,
      title:
        'Manage and Respond to Security Alerts - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-09-22T17:34:00.0000000Z',
      sha256: 'f27e1229e6d50029fc2f5c4602873199e91eaa819e8df766d9f20fd82d799116',
      bytes: 10490,
      retrieved: '2026-11-01T14:11:04.834441+00:00',
      claim:
        'Canonical redirect to manage-respond-alerts: investigate resource/time/evidence/severity and possible false positives; remediation/automation are separate actions, not automatic from alert.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE14',
      url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/overview',
      final: 'https://learn.microsoft.com/en-us/azure/key-vault/general/overview',
      status: 200,
      title: 'Azure Key Vault Overview - Azure Key Vault | Microsoft Learn',
      updated: '2026-10-06T17:34:00.0000000Z',
      sha256: '22fa34895ca98f21a1781510902752f0b6337e78acb4c5cf2cbc3882fae3b874',
      bytes: 8873,
      retrieved: '2026-11-01T14:11:04.946146+00:00',
      claim:
        'Key Vault protects secrets, encryption keys and certificates; Entra authentication plus data authorization needed; not a general application database. Premium cryptography/preview internals excluded.',
      disposition: 'reviewed-essential',
    },
    {
      id: 'SE15',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/1-introduction',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/1-introduction',
      status: 200,
      title: 'Introduction - Training | Microsoft Learn',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '0ce001af136a8d592905aad76fd63d8e61deddc1316e06ca795b205b73caf8f0',
      bytes: 2821,
      retrieved: '2026-11-01T14:17:38.010151+00:00',
      claim:
        'Public module introduction reviewed as prerequisite bridge only; earlier P10/P11 manuscripts and rubrics unchanged.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE16',
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/11-summary',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/11-summary',
      status: 200,
      title: 'Summary - Training | Microsoft Learn',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '1045366e34c1525a1e333a72c05e9c0a4a77a42cd270513d241020a6c3ed423e',
      bytes: 2768,
      retrieved: '2026-11-01T14:17:38.011098+00:00',
      claim:
        'Public module summary confirms scoped security concepts and encryption supplement; assessment not opened.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE17',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/alerts-overview',
      final: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/alerts-overview',
      status: 200,
      title: 'Security Alerts and Incidents - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-07-07T17:36:00.0000000Z',
      sha256: 'bca20af1cfe299a74ec5d44ffcb972c2c2a24916550ef5db46723a4389a01128',
      bytes: 12307,
      retrieved: '2026-11-01T14:17:38.014017+00:00',
      claim:
        'Workload-plan detections generate security alerts, severity expresses confidence/context; incidents correlate alerts and still require investigation. Alert is not universal proof of successful compromise.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE18',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-servers-overview',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-servers-overview',
      status: 200,
      title:
        'Overview of Defender for Servers in Defender for Cloud - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-09-30T07:42:00.0000000Z',
      sha256: 'bdb565e00bb7013f05b600717fa719327a1297be2faa026b1e081477f568170e',
      bytes: 13839,
      retrieved: '2026-11-01T14:17:38.016010+00:00',
      claim:
        'Servers Plan1/2 and feature/integration differences; machine existence is not Endpoint protection or active Defender coverage. Separately sold Experts service excluded.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE19',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-containers-introduction',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-containers-introduction',
      status: 200,
      title:
        'Introduction to Microsoft Defender for Containers - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-08-10T22:36:00.0000000Z',
      sha256: '50319a336c920859566c629861aa6bb85cce14f4e8938fa4d71e0f2ea4d20561',
      bytes: 16974,
      retrieved: '2026-11-01T14:17:38.535677+00:00',
      claim:
        'Containers posture/agentless/sensor/runtime features vary with configuration/plan/platform; preview capabilities not generalized to all containers.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE20',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-introduction',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-introduction',
      status: 200,
      title:
        'What is Microsoft Defender for Storage - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-08-06T12:40:00.0000000Z',
      sha256: '9b2ef61ebc2989d4b70a3503092752551e8e2c8b9fd0848639b591eebfed3035',
      bytes: 16958,
      retrieved: '2026-11-01T14:17:38.543950+00:00',
      claim:
        'Defender for Storage protects supported Azure Storage with enabled scope/settings; activity monitoring/malware scanning/sensitive-data features and cost/limits separate; no universal free scan.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE21',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-databases-introduction',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-databases-introduction',
      status: 200,
      title:
        'Overview of Defender for Open-Source Relational Databases - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-08-10T22:36:00.0000000Z',
      sha256: '9a9cac6b134cf98504a9b4c6955e771c5260ca146c72c33ff220d7e103121c59',
      bytes: 5971,
      retrieved: '2026-11-01T14:17:38.547873+00:00',
      claim:
        'Databases overview is specifically open-source relational database protection with platform availability limits, not one universal plan for every database.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE22',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-app-service-introduction',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-app-service-introduction',
      status: 200,
      title:
        'Microsoft Defender for App Service - Benefits and Features - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-07-07T17:36:00.0000000Z',
      sha256: '48b2239f737ed85e4b4f450ae9fc7780a2227f5877bc677f38852bfe20ad4aab',
      bytes: 9486,
      retrieved: '2026-11-01T14:17:38.768578+00:00',
      claim:
        'App Service workload protection is a specific enabled plan for supported Azure App Service threats; resource creation alone does not enable security instrumentation/protection.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE23',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/support-matrix-defender-for-cloud',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/support-matrix-defender-for-cloud',
      status: 200,
      title:
        'Interoperability with Azure services, Azure clouds, and client operating systems - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-09-03T12:37:00.0000000Z',
      sha256: 'eb101c10d98fd3e463606cebf0b2a15fcd81ad911ae6e1de6087b1ec397f4110',
      bytes: 14033,
      retrieved: '2026-11-01T14:17:38.916380+00:00',
      claim:
        'Actual support matrices distinguish services/clouds/portals/regions and preview; no universal all-cloud coverage. China retirement qualification reviewed, no onboarding performed.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE24',
      url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/encryption-overview',
      final: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/encryption-overview',
      status: 200,
      title: 'Azure encryption overview | Microsoft Learn',
      updated: '2026-09-18T22:43:00.0000000Z',
      sha256: '99219cdf14063cd5d7abcd52c92a09affd8f041dd11513b7a3a16101ecccc2b8',
      bytes: 13454,
      retrieved: '2026-11-01T14:17:38.951206+00:00',
      claim:
        'At-rest/in-transit and client/server encryption responsibilities; decrypting authorized services can still expose data to overprivileged users. No ADE implementation or legacy universal recommendation.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE25',
      url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates',
      final:
        'https://learn.microsoft.com/en-us/azure/key-vault/general/about-keys-secrets-certificates',
      status: 200,
      title: 'Azure Key Vault Keys, Secrets, and Certificates Overview | Microsoft Learn',
      updated: '2026-06-12T22:35:00.0000000Z',
      sha256: '195dd44b217e989636790ac4ce4f1e51bb30061ba6066a4ff91543623eeef47a',
      bytes: 8396,
      retrieved: '2026-11-01T14:17:38.973166+00:00',
      claim:
        'Key/secret/certificate object types and versioning differ; deprecated Storage-account-key management is not taught as current feature.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE26',
      url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices',
      final: 'https://learn.microsoft.com/en-us/azure/key-vault/general/secure-key-vault',
      status: 200,
      title: 'Secure your Azure Key Vault | Microsoft Learn',
      updated: '2026-10-06T17:34:00.0000000Z',
      sha256: '720e1610f16c4489d692ce8ca670328268253b041d3da276d8da88393700a9fd',
      bytes: 17299,
      retrieved: '2026-11-01T14:17:39.256286+00:00',
      claim:
        'Best-practices URL redirects to secure-key-vault: access restrictions, managed identities/least privilege, rotation/logging and recovery protections remain customer configuration responsibilities.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE27',
      url: 'https://learn.microsoft.com/en-us/azure/key-vault/keys/how-to-configure-key-rotation',
      final: 'https://learn.microsoft.com/en-us/azure/key-vault/keys/how-to-configure-key-rotation',
      status: 200,
      title: 'Configure cryptographic key auto-rotation in Azure Key Vault | Microsoft Learn',
      updated: '2026-06-12T22:35:00.0000000Z',
      sha256: 'c94628eceefac8a85010d7d13260a213c7a45c1c27a1c1db1b86a6f047247377',
      bytes: 15825,
      retrieved: '2026-11-01T14:17:39.257234+00:00',
      claim:
        'Rotation creates new key version using policy/permissions and service-specific integration; applying new versions/retaining old decryptability not universally automatic. No key operation executed.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE28',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/risk-prioritization',
      final: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/risk-prioritization',
      status: 200,
      title: 'Risk prioritization - Microsoft Defender for Cloud | Microsoft Learn',
      updated: '2026-06-16T18:23:00.0000000Z',
      sha256: '7ad409a18b05ffb7212da98501de076145bd1554c58291e24219f77a15ae9c86',
      bytes: 4238,
      retrieved: '2026-11-01T14:17:39.328442+00:00',
      claim:
        'Risk-prioritization prerequisites: paid Defender CSPM; contextual exposure/sensitivity/criticality guides review, not confirmed threat or universal score formula.',
      disposition: 'reviewed-applied',
    },
    {
      id: 'SE29',
      url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-defender-for-cloud-defender-portal',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/concept-defender-for-cloud-defender-portal',
      status: 404,
      title: 'Unavailable official source',
      updated: 'unavailable',
      sha256: '',
      bytes: 0,
      retrieved: '2026-11-01T14:17:39.448426+00:00',
      claim:
        'Guessed portal-experience URL404; not relied on. Current SE09 overview and both SE12 documented portal pivots provide the official alternative.',
      disposition: 'blocked-with-official-alternative',
    },
  ],
  unperformed: [
    'video playback',
    'hosted Azure exercise',
    'portal login',
    'scan',
    'cryptography',
    'human SME',
  ],
} as const;
