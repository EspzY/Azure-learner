import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { visualReviewAllowed } from '@/features/design-review/model';
import { VisualReview } from '@/features/design-review/visual-review';

export default function VisualReviewPage() {
  if (
    !visualReviewAllowed(
      process.env.VERCEL_ENV,
      process.env.VERCEL_GIT_COMMIT_REF,
      process.env.GITHUB_HEAD_REF,
    )
  )
    notFound();
  return (
    <Suspense>
      <VisualReview />
    </Suspense>
  );
}
