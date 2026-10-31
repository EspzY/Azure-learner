/** Actual public bodies checked2026-10-31; original manuscript, not copied Learn questions. */
export const storageSources = {
  SS01: [
    'Study guide for Exam AZ-900: Microsoft Azure Fundamentals | Microsoft Learn',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  SS02: [
    'Describe Azure storage services - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/',
  ],
  SS03: [
    'Introduction - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction',
  ],
  SS04: [
    'Describe Azure storage accounts - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts',
  ],
  SS05: [
    'Describe Azure storage services - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services',
  ],
  SS06: [
    'Summary - Training | Microsoft Learn',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary',
  ],
  SS07: [
    'Introduction to Azure Storage - Cloud storage on Azure | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction',
  ],
  SS08: [
    'Storage Account Overview - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview',
  ],
  SS09: [
    'About Blob (object) storage - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview',
  ],
  SS10: [
    'Introduction to Blob (object) Storage - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction',
  ],
  SS11: [
    'What is Azure Files? | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction',
  ],
  SS12: [
    'Plan an Azure Files deployment | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/files/storage-files-planning',
  ],
  SS13: [
    'Introduction to Azure Queue Storage - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction',
  ],
  SS14: [
    'Compare Azure Storage queues and Service Bus queues - Azure Service Bus | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted',
  ],
  SS15: [
    'Web-Queue-Worker Architecture Style - Azure Architecture Center | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/web-queue-worker',
  ],
  SS16: [
    'Introduction to Table storage - Object storage in Azure | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/tables/table-storage-overview',
  ],
  SS17: [
    'Understanding the Table service data model (REST API) - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/rest/api/storageservices/Understanding-the-Table-Service-Data-Model',
  ],
  SS18: [
    'Overview of Azure Disk Storage - Azure Virtual Machines | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview',
  ],
  SS19: [
    'Configure anonymous read access for containers and blobs - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure',
  ],
  SS20: [
    'Create an Azure Storage Account - Azure Storage | Microsoft Learn',
    'https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create',
  ],
  SS21: [
    'Azure Files management concepts',
    'https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts',
  ],
} as const;
export const storageStudySources = {
  introduction: ['SS01', 'SS02', 'SS03', 'SS07', 'SS19'],
  blob: ['SS05', 'SS09', 'SS10', 'SS19'],
  files: ['SS05', 'SS11', 'SS12', 'SS21'],
  queues: ['SS13', 'SS14', 'SS15'],
  tables: ['SS16', 'SS17'],
  accounts: ['SS04', 'SS08', 'SS12', 'SS20', 'SS21'],
  disks: ['SS05', 'SS18'],
  studio: ['SS08', 'SS10', 'SS12', 'SS14', 'SS17', 'SS21'],
} as const satisfies Record<string, readonly (keyof typeof storageSources)[]>;
export const storageSourceReview = {
  checked: '2026-10-31',
  studyGuideVersion: '2026-07-20',
  available: [
    'SS01',
    'SS02',
    'SS03',
    'SS04',
    'SS05',
    'SS06',
    'SS07',
    'SS08',
    'SS09',
    'SS10',
    'SS11',
    'SS12',
    'SS13',
    'SS14',
    'SS15',
    'SS16',
    'SS17',
    'SS18',
    'SS19',
    'SS20',
    'SS21',
  ],
  protectedAssessment: 'excluded',
  blocked: [],
  limits: [
    'Files management SS21 qualifies older four-family Learn tables: FileStorage HDD and SSD, plus separate top-level NFS resources.',
    'No region/pricing/SLA/live availability check or deployment; classic account matrix has explicit declared-region qualification.',
    'Source08 generic type-change restrictions have legacy upgrade exceptions: no universal in-place premium conversion promise.',
    'Learn video present, not credited as watched; protected assessment excluded. No actual Azure sandbox used.',
    'P09 tiers/redundancy and P16 movement/migration are outside scope.',
  ],
} as const;
