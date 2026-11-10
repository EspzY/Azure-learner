import { Suspense } from 'react';
import { Course } from '@/features/course/course';
export default function LearnPage() {
  return (
    <Suspense>
      <Course />
    </Suspense>
  );
}
