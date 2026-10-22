'use client';
import dynamic from 'next/dynamic';
import { nb } from '@/content/nb';

// This world needs browser measurement and native dialogs. Its loading boundary
// avoids streaming a second, inert copy of the interactive SVG during hydration.
export const OrganizationWorld = dynamic(
  () => import('./workbench').then((module) => module.Workbench),
  {
    ssr: false,
    loading: () => (
      <div className="world-loading" role="status">
        {nb.expedition.worldLoading}
      </div>
    ),
  },
);
