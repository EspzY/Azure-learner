import { Suspense } from 'react';
import { Portal } from '@/features/portal/portal';
import { nb } from '@/content/nb';
export default function PortalPage() {
  return (
    <Suspense fallback={<p>{nb.portal.environment}</p>}>
      <Portal />
    </Suspense>
  );
}
