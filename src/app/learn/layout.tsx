import { nb } from '@/content/nb';
import { auditReviewHref } from '@/features/course/audit-review';
export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const branch = process.env.VERCEL_GIT_COMMIT_REF;
  const preview = process.env.VERCEL_ENV !== 'production';
  const auditHref = auditReviewHref(process.env.VERCEL_ENV, branch, sha);
  return (
    <div className="course-learning-surface">
      {auditHref && (
        <aside className="course-audit-review" aria-label={nb.auditReview.title}>
          <strong>{nb.auditReview.title}</strong>
          <span>{nb.auditReview.description}</span>
          <a href={auditHref} target="_blank" rel="noreferrer">
            {nb.auditReview.open}
          </a>
        </aside>
      )}
      {children}
      {preview && (
        <details className="course-build">
          <summary>{nb.foundationsV2.build}</summary>
          <p>
            {sha && /^[a-f0-9]{40}$/.test(sha) ? (
              <>
                {nb.foundationsV2.commit}: <code>{sha}</code>
              </>
            ) : (
              nb.foundationsV2.local
            )}
          </p>
          {branch && /^[\w./-]{1,160}$/.test(branch) && (
            <p>
              {nb.foundationsV2.branch}: <code>{branch}</code>
            </p>
          )}
        </details>
      )}
    </div>
  );
}
