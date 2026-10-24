import { Suspense } from 'react';
import { Journey } from '@/features/journey/journey';
import { nb } from '@/content/nb';
export default function Home() {
  return (
    <Suspense fallback={<p role="status">{nb.expedition.worldLoading}</p>}>
      <Journey />
    </Suspense>
  );
}
