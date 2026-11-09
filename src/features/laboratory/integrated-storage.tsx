'use client';
import {
  IntegratedResourceViews,
  type IntegratedFamily,
  type IntegratedViewsProps,
} from './integrated-resource';
const families: IntegratedFamily[] = [
  {
    view: 'account',
    label: 'Storage account',
    type: 'Microsoft.Storage/storageAccounts',
    resources: (w) =>
      w.accounts.map((r) => ({
        ...r,
        view: 'account',
        type: 'Microsoft.Storage/storageAccounts',
        parentId: r.groupId,
        source: { ...r },
      })),
    operations: [
      {
        type: 'DeleteStorageAccount',
        label: 'Delete storage account',
        fields: ['accountId'],
        lockedFields: ['accountId'],
        defaults: (_w, r) => ({ accountId: r?.id ?? '' }),
      },
    ],
  },
  {
    view: 'container',
    label: 'Blob container',
    type: 'local/blob-container',
    resources: (w) =>
      w.containers.map((r) => {
        const a = w.accounts.find((a) => a.id === r.accountId)!;
        return {
          ...r,
          view: 'container',
          type: 'local/blob-container',
          groupId: a.groupId,
          region: a.region,
          parentId: a.id,
          source: { ...r },
        };
      }),
    operations: [
      {
        type: 'DeleteBlobContainer',
        label: 'Delete blob container',
        fields: ['containerId'],
        lockedFields: ['containerId'],
        defaults: (_w, r) => ({ containerId: r?.id ?? '' }),
      },
    ],
  },
];
export function IntegratedStorageActions(props: IntegratedViewsProps) {
  return (
    <>
      <p>
        Simulator restriction: only empty storage accounts and containers can be deleted. Configured
        Function dependencies must be removed first. This is not full Azure deletion behavior.
      </p>
      <IntegratedResourceViews {...props} families={families} actionsOnly />
    </>
  );
}
