export const identitySources = {
  IF01: [
    'Study guide for Exam AZ-900: Microsoft Azure Fundamentals | Microsoft Learn',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  IF02: [
    'Describe Azure identity, access, and security - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/',
  ],
  IF03: [
    'Identity and Access Management (IAM): Core Concepts and Benefits - Microsoft Entra | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/fundamentals/identity-fundamental-concepts',
  ],
  IF04: [
    'Overview of Microsoft Entra Domain Services - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/domain-services/overview',
  ],
  IF05: [
    'What is single sign-on in Microsoft Entra ID? - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/what-is-single-sign-on',
  ],
  IF06: [
    'Passwordless authentication with Microsoft Entra ID - Microsoft Entra | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/architecture/auth-passwordless',
  ],
  IF07: [
    'Microsoft Entra multifactor authentication overview - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks',
  ],
  IF08: [
    'Microsoft Entra External ID Overview - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/external-identities-overview',
  ],
  IF09: [
    'What is Microsoft Entra B2B collaboration? - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b',
  ],
  IF10: [
    'B2B direct connect Microsoft Entra overview - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/b2b-direct-connect-overview',
  ],
  IF11: [
    'Introduction - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/1-introduction',
  ],
  IF12: [
    'Describe Azure directory services - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/2-directory-services',
  ],
  IF13: [
    'Describe Azure authentication methods - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/3-authentication-methods',
  ],
  IF14: [
    'Describe Azure external identities - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/4-external-identities',
  ],
  IF15: [
    'Summary - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/11-summary',
  ],
  IF16: [
    'How synchronization works in Microsoft Entra Domain Services - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/domain-services/synchronization',
  ],
  IF17: [
    'Compare Microsoft directory-based services - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/domain-services/compare-identity-solutions',
  ],
  IF18: [
    'Microsoft Entra authentication overview - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-methods',
  ],
  IF19: [
    'Passkeys (FIDO2) authentication method in Microsoft Entra ID - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-passwordless',
  ],
  IF20: [
    'Tenant Configurations - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/tenant-configurations',
  ],
  IF21: [
    'Cross-tenant access overview - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview',
  ],
  IF22: [
    'Configure external collaboration - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/external-collaboration-settings-configure',
  ],
  IF23: [
    'Add an existing Azure subscription to your tenant - Microsoft Entra | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory',
  ],
  IF24: [
    'Passwordless sign-in with Authenticator - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-passwordless-phone',
  ],
  IF25: [
    'External Tenant Overview - Microsoft Entra External ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/external-id/customers/overview-customers-ciam',
  ],
  IF26: [
    'Windows Hello for Business overview | Microsoft Learn',
    'https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/hello-overview',
  ],
  IF27: [
    'SMS-based user sign-in for Microsoft Entra ID - Microsoft Entra ID | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-sms-signin',
  ],
  IF28: [
    'Authentication vs. authorization - Microsoft identity platform | Microsoft Learn',
    'https://learn.microsoft.com/en-us/entra/identity-platform/authentication-vs-authorization',
  ],
  IF29: [
    'Introduction to Cloud Infrastructure: Describe Azure Architecture and Services - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  ],
} as const;
export const identityStudySources = {
  introduction: ['IF01', 'IF02', 'IF11', 'IF29'],
  directory: ['IF03', 'IF12', 'IF23'],
  domain: ['IF04', 'IF16', 'IF17'],
  authentication: ['IF03', 'IF28'],
  sso: ['IF05', 'IF13'],
  mfa: ['IF07', 'IF18'],
  passwordless: ['IF06', 'IF18', 'IF19', 'IF24', 'IF26', 'IF27'],
  external: ['IF08', 'IF09', 'IF10', 'IF14', 'IF20', 'IF21', 'IF22', 'IF25'],
  studio: ['IF04', 'IF05', 'IF07', 'IF09', 'IF10', 'IF20'],
} as const;

export const identitySourceReview = {
  reviewed: '2026-10-31',
  boundary:
    'Author actual public-body check, not protected assessment, deployed Azure, human SME or learning validation.',
  claims: {
    IF01: {
      claim:
        'Current 20 July 2026 scoped three identity/auth/external objectives; no readiness claim.',
      updated: '2026-06-22T23:35:00.0000000Z',
      sha256: '177b736af1bae8702d9e04ef68bac8c1f2985838652bb40818a5ac25ed320716',
    },
    IF02: {
      claim:
        'Twelve-unit module and actual scoped unit structure; later access/security units deferred.',
      updated: '2026-10-28T17:12:00.0000000Z',
      sha256: '70aeac9267c6e6c173edeececfed3e522cd58a5734e5152653ac5dd083ed388b',
    },
    IF03: {
      claim: 'Identity objects, IdP, AuthN/AuthZ and directory boundary.',
      updated: '2026-06-26T22:37:00.0000000Z',
      sha256: '05f80d1a1705e74f4ecb0a2079e60cb0743ab7fa85fe28d706ce1e1bcefaa982',
    },
    IF04: {
      claim:
        'Managed domain protocols and responsibility split; one-way sync and scoped legacy use.',
      updated: '2026-03-03T23:42:00.0000000Z',
      sha256: 'e241fed2ef14ebe74dd03cec3201d00a26f95bff59a3d66bc658325bb28baa43',
    },
    IF05: {
      claim: 'Trusted-app SSO, session versus new method, integration prerequisites.',
      updated: '2026-10-06T17:42:00.0000000Z',
      sha256: 'c2d0284c9b5fd60bd716db7f1b520890a01ad11af6c01702c4909436a4b56bdf',
    },
    IF06: {
      claim: 'Passwordless method/deployment context, not universal equivalence.',
      updated: '2026-02-26T06:11:00.0000000Z',
      sha256: '9722423b9634e8081fae51c9869b89b6c0a2c5784b2bb0b321761613c172e9b3',
    },
    IF07: {
      claim: 'Knowledge/possession/inherence and relevant MFA methods; no security guarantee.',
      updated: '2026-04-01T17:23:00.0000000Z',
      sha256: '4f560da5f5296220c525a69e63aaa6dc67476af912a027fbc15b305a4126da72',
    },
    IF08: {
      claim: 'External ID workforce/external purpose and product boundaries.',
      updated: '2026-06-15T17:40:00.0000000Z',
      sha256: '5d364c510d84e34947bc60ee8739d7b3b692cab906cbe2231ba9158e1fa112cd',
    },
    IF09: {
      claim:
        'Home provider/resource guest, separate permissions, invitation versus cross-tenant control.',
      updated: '2026-04-25T05:05:00.0000000Z',
      sha256: '3ac60a013f50c6ddb7450d2aac8c6aa3abc383eb59e2cc59b3baa21721680b50',
    },
    IF10: {
      claim:
        'Current Entra shared-channel direct-connect scope, mutual directions and no ordinary guest.',
      updated: '2026-04-25T05:05:00.0000000Z',
      sha256: '5e71f5ac9bd1535614a5090cc448ae8b036cd547e10a1275b726c8f974bd300b',
    },
    IF11: {
      claim: 'Intro scope and basic terminology prerequisite; no protected questions.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '0ce001af136a8d592905aad76fd63d8e61deddc1316e06ca795b205b73caf8f0',
    },
    IF12: {
      claim: 'Directory Learn unit versus actual managed-domain/product limits.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '0531096e15c89310dcea725baded524f1f070bff7d1bfe2a43d86d5c832a1f18',
    },
    IF13: {
      claim: 'SSO/MFA/passwordless Learn unit qualified by method-specific current docs.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '7b2f59a7b833a2cbd2ed95052c72a05af1ea1b3e4b0f3e961f50d70446157628',
    },
    IF14: {
      claim: 'External Learn unit, qualified B2C/product wording and current scopes.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '5466c76a75c6a9dfa2c467bfa62ad0735810460b740365f4e25c5b2d9ca72a08',
    },
    IF15: {
      claim: 'Official summary scope; only P10 units credited.',
      updated: '2025-03-28T23:01:00.0000000Z',
      sha256: '1045366e34c1525a1e333a72c05e9c0a4a77a42cd270513d241020a6c3ed423e',
    },
    IF16: {
      claim:
        'One-way automatic sync, password-hash prerequisites, read-only synced versus local OU objects, no reverse sync.',
      updated: '2026-08-18T12:37:00.0000000Z',
      sha256: 'e6103be2394472caec7f17e49e2de40c9b43373e4cbc1e6fc79d84186ca44dd6',
    },
    IF17: {
      claim:
        'AD DS versus managed domain versus Entra ID; no managed schema/Domain Admin equivalence.',
      updated: '2026-02-19T06:03:00.0000000Z',
      sha256: '835c9b18cdc6cec3c1dd093018e18ba4c682707bd1fe4a3483536aacd8060912',
    },
    IF18: {
      claim: 'Current method matrix, phishing resistance and Hello step-up qualification.',
      updated: '2026-09-16T17:38:00.0000000Z',
      sha256: 'a40e240f0be4b98b4a7d828ffda12844538e65cccf8d382762b75234e75bacd7',
    },
    IF19: {
      claim:
        'FIDO2 origin-bound credentials, local UV and device-bound/synced distinction; no crypto emulation.',
      updated: '2026-06-15T17:40:00.0000000Z',
      sha256: '90ba88176dcd1476dcef953ce67f7674f3ab630005b46737c7e224172f5dec39',
    },
    IF20: {
      claim: 'Distinct workforce and external configurations; existing B2C versus current CIAM.',
      updated: '2026-06-26T22:37:00.0000000Z',
      sha256: '3f03ca74bb9ce71871f50efbe64aa01d4700fcd2f21c06a87746189bcd7e711c',
    },
    IF21: {
      claim: 'Inbound/outbound and relevant trust conditions with other Entra organizations.',
      updated: '2026-10-13T17:41:00.0000000Z',
      sha256: '3c6756d67143a3b9ece68a3cdd7eeba3dd638bd6f58fd00229523b83b1694b49',
    },
    IF22: {
      claim:
        'Who may invite, domain restrictions and guest directory visibility; not an app grant.',
      updated: '2026-04-25T05:05:00.0000000Z',
      sha256: 'ddd2a470d4b3e292aff8619758ff7870f50a3ed985664bc81b19bba56d103816',
    },
    IF23: {
      claim:
        'One directory per subscription, many subscriptions per tenant, directory/resource role distinction.',
      updated: '2026-06-19T22:42:00.0000000Z',
      sha256: '9ad5b8df07fc3ffe52fe873c0b70f195a0cb9a742d2bf89949a070ee596f227b',
    },
    IF24: {
      claim:
        'Authenticator phone sign-in with device credential/local confirmation; distinct from passkey and push.',
      updated: '2026-03-27T05:06:00.0000000Z',
      sha256: 'f2a044850b0ebe6e189ebb1ee54cea58c887e0b833e16fa816bda4b93db28b2f',
    },
    IF25: {
      claim: 'Separate external tenant CIAM, customer lifecycle, app/user flows.',
      updated: '2026-05-29T12:39:00.0000000Z',
      sha256: '7ae0100587ec126cd320106353f5d5d67df0005330ec7df77ec2005cf5f6c77c',
    },
    IF26: {
      claim:
        'Hello device-bound credential plus PIN/biometric, phishing-resistant properties; not any arbitrary PIN.',
      updated: '2026-10-08T11:38:00.0000000Z',
      sha256: '8d3b428fedd7208c2564359ac8766e0861daa7517fdc0208b5a7ec338922697b',
    },
    IF27: {
      claim:
        'Supported SMS first-factor users/apps; not B2B or Entra MFA-compatible. Microsoft-provided SMS/voice, including this flow, retires2027-02-01; dated comparison, not rollout advice.',
      updated: '2026-10-30T22:39:00.0000000Z',
      sha256: 'df86a7b37478d1c9653051cd270ac28be25a3d41f370ec600df58f4e08812b2f',
    },
    IF28: {
      claim: 'AuthN versus AuthZ, OIDC/SAML app integration and separate authorization.',
      updated: '2026-06-15T17:40:00.0000000Z',
      sha256: '89198c45576b4324aa6f600262f8519fdd732554b37b3f9d3399b2f78ae59b39',
    },
    IF29: {
      claim: 'Actual official path/module discovery, prerequisite and later-unit scope.',
      updated: '2026-10-28T17:12:00.0000000Z',
      sha256: '495d8c70d431838e52036777509a578f87a11855abc47cc147c936d1b83f057c',
    },
  },
} as const;
