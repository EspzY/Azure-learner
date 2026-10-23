import { OrganizationWorld } from '@/features/organization/world-entry';
import { Suspense } from 'react';
import LoadingWorld from './loading';
export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingWorld />}>
      <OrganizationWorld />
    </Suspense>
  );
}
