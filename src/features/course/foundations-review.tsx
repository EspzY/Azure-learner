import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { nb } from '@/content/nb';

/** Branch review entry: remove before any production release (see AGENTS.md). */
export function FoundationsReviewEntry() {
  const t = nb.beginnerProof;
  return (
    <aside className="course-review" aria-labelledby="foundations-review-title">
      <div>
        <small>{t.reviewBadge}</small>
        <h2 id="foundations-review-title">{t.reviewTitle}</h2>
        <p>{t.reviewDescription}</p>
      </div>
      <Link href="/design/foundations-31a">
        {t.reviewAction}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </aside>
  );
}
