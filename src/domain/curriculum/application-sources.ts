/** Actual public bodies checked 2026-11-02; no runtime source fetch. */
export const applicationSources = {
  AT04: {
    id: 'AT04',
    title: 'Azure DNS Overview: Hosting and Resolution | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/dns/dns-overview',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT05: {
    id: 'AT05',
    title: 'Azure Virtual Network Name Resolution Guide | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT06: {
    id: 'AT06',
    title: 'Azure network security groups overview | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT07: {
    id: 'AT07',
    title: 'Authorize operations for data access - Azure Storage | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT10: {
    id: 'AT10',
    title: 'Introduction to Azure Storage - Cloud storage on Azure | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT11: {
    id: 'AT11',
    title: 'What is Azure Files? | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT12: {
    id: 'AT12',
    title: 'Plan an Azure Files deployment | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/storage/files/storage-files-planning',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT16: {
    id: 'AT16',
    title: 'What are Azure Reservations? - Microsoft Cost Management | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT17: {
    id: 'AT17',
    title: 'About Azure Spot Virtual Machines - Azure Virtual Machines | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT18: {
    id: 'AT18',
    title: 'What are savings plans? - Microsoft Cost Management | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT19: {
    id: 'AT19',
    title:
      'Secure applications and APIs by validating claims - Microsoft identity platform | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/claims-validation',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT20: {
    id: 'AT20',
    title:
      'How an Azure reservation discount is applied - Microsoft Cost Management | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-discount-application',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
  AT21: {
    id: 'AT21',
    title: 'SMB File Shares in Azure Files | Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/azure/storage/files/files-smb-protocol',
    reviewed: '2026-11-02',
    publisher: 'Microsoft',
  },
} as const;
export const applicationGroupSources = {
  networking: ['AT04', 'AT05', 'AT06', 'AT07', 'AT19'],
  storage: ['AT10', 'AT11', 'AT12', 'AT21'],
  cost: ['AT16', 'AT17', 'AT18', 'AT20'],
} as const;
