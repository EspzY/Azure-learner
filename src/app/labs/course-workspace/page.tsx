import { Suspense } from 'react';
import { Laboratory } from '@/features/laboratory/laboratory';
import { laboratoryV3Nb as c } from '@/content/nb';
export default function CourseWorkspacePage() {
  return (
    <Suspense fallback={<p>{c.loading}</p>}>
      <Laboratory key="course-technical" workspaceMode="course-technical" />
    </Suspense>
  );
}
