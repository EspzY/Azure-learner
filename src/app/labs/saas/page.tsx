import { Suspense } from 'react';
import { SaasLab } from '@/features/portal/saas-lab';
import { labsNb } from '@/content/nb';
export default function SaasPage() {
  return (
    <Suspense fallback={<p>{labsNb.title}</p>}>
      <SaasLab />
    </Suspense>
  );
}
