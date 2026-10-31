/** Actual public Microsoft bodies checked 2026-10-31 before manuscript; no protected items. */
export const resilienceSources = {
  SB01: [
    'Study guide for Exam AZ-900: Microsoft Azure Fundamentals',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  SB02: [
    'Describe Azure storage services - Training',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/',
  ],
  SB03: [
    'Access tiers for blob data - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview',
  ],
  SB04: [
    'Data redundancy - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy',
  ],
  SB05: [
    'Blob rehydration from the archive tier',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview',
  ],
  SB06: [
    'Azure Blob Storage lifecycle management overview - Azure Blob Storage',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview',
  ],
  SB07: [
    'Optimize Azure Blob Storage costs with smart tier - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-smart',
  ],
  SB08: [
    'Azure storage disaster recovery planning and failover - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance',
  ],
  SB09: [
    'Introduction - Training',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction',
  ],
  SB10: [
    'Describe Azure storage accounts - Training',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts',
  ],
  SB11: [
    'Describe Azure storage redundancy - Training',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/3-redundancy',
  ],
  SB12: [
    'Describe Azure storage services - Training',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services',
  ],
  SB13: [
    'Summary - Training',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary',
  ],
  SB14: [
    'Redundancy options for Azure managed disks - Azure Virtual Machines',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy',
  ],
  SB15: [
    'Data Redundancy in Azure Files',
    'https://learn.microsoft.com/en-us/azure/storage/files/files-redundancy',
  ],
  SB16: [
    'Blob Storage feature support in Azure storage accounts',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-feature-support-in-storage-accounts',
  ],
  SB17: [
    'Data protection overview - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/data-protection-overview',
  ],
  SB18: [
    'Azure Files management concepts',
    'https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts',
  ],
  SB19: [
    'Introduction to Cloud Infrastructure: Describe Azure Architecture and Services - Training',
    'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/',
  ],
  SB20: [
    'Azure Blob Storage lifecycle management policy structure - Azure Blob Storage',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-policy-structure',
  ],
  SB21: [
    'Check the Last Sync Time property for a storage account - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/common/last-sync-time-get',
  ],
  SB22: [
    'How Azure Storage account customer-managed unplanned failover works - Azure Storage',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-failover-customer-managed-unplanned',
  ],
  SB23: [
    'What are Azure Availability Zones?',
    'https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview',
  ],
} as const;
export const resilienceStudySources = {
  introduction: ['SB01', 'SB02', 'SB09', 'SB19'],
  tiers: ['SB03', 'SB12'],
  lifecycle: ['SB03', 'SB05', 'SB06', 'SB07', 'SB20'],
  redundancy: ['SB04', 'SB11', 'SB23'],
  recovery: ['SB04', 'SB08', 'SB17', 'SB21', 'SB22'],
  boundaries: ['SB03', 'SB04', 'SB14', 'SB15', 'SB16', 'SB18'],
  studio: ['SB03', 'SB04', 'SB05', 'SB20'],
} as const;
export const resilienceSourceReview = {
  reviewed: '2026-10-31',
  studyGuide: '2026-07-20',
  read: [
    'SB01',
    'SB02',
    'SB03',
    'SB04',
    'SB05',
    'SB06',
    'SB07',
    'SB08',
    'SB09',
    'SB10',
    'SB11',
    'SB12',
    'SB13',
    'SB14',
    'SB15',
    'SB16',
    'SB17',
    'SB18',
    'SB19',
    'SB20',
    'SB21',
    'SB22',
    'SB23',
  ],
  protectedAssessment: 'excluded',
  limits: [
    'No executed Azure sandbox, command, rehydration or failover. Embedded video documented, not watched.',
    'Current Smart page qualifies generic default-tier list: eligible GPv2 zonal block blobs, online only, separate billing. No Smart emulation.',
    'Current product page mentions separate Geo Priority Replication. No universal RPO or zero-loss guarantee taught.',
    'P08 and P16 objective rows and all historical learning contracts preserved.',
  ],
} as const;
