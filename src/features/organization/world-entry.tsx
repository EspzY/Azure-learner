'use client';
import dynamic from 'next/dynamic';
import { nb } from '@/content/nb';
import { useSearchParams } from 'next/navigation';

// This world needs browser measurement and native dialogs. Its loading boundary
// avoids streaming a second, inert copy of the interactive SVG during hydration.
const LegacyWorld = dynamic(() => import('./workbench').then((module) => module.Workbench), {
  ssr: false,
  loading: () => (
    <div className="world-loading" role="status">
      {nb.expedition.worldLoading}
    </div>
  ),
});
const GuidedWorld = dynamic(
  () => import('@/features/chapter01/workbench').then((module) => module.ChapterWorkbench),
  {
    ssr: false,
    loading: () => (
      <div className="world-loading" role="status">
        {nb.expedition.worldLoading}
      </div>
    ),
  },
);
export function OrganizationWorld() {
  const search = useSearchParams();
  return search.get('chapter') === '01' ? <GuidedWorld /> : <LegacyWorld />;
}
