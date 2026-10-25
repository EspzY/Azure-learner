import { nb } from '@/content/nb';
export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const branch = process.env.VERCEL_GIT_COMMIT_REF;
  const preview = process.env.VERCEL_ENV !== 'production';
  return (
    <div className="course-learning-surface">
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
