import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Course } from '@/features/course/course';
export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  if (
    module !== 'services' &&
    module !== 'computing' &&
    module !== 'benefits' &&
    module !== 'architecture' &&
    module !== 'cost' &&
    module !== 'compute'
  )
    notFound();
  return (
    <Suspense>
      <Course module={module} />
    </Suspense>
  );
}
