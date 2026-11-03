import Link from 'next/link';
import { ownerAcceptanceNb as t } from '@/content/nb';
import './related-activities.css';
/** Secondary, voluntary destinations; the course footer owns the recommended next action. */
export function RelatedActivities({
  assessment,
  observations,
}: {
  assessment: string;
  observations: string;
}) {
  return (
    <details className="related-activities">
      <summary>{t.otherActivities}</summary>
      <nav aria-label={t.otherActivities}>
        <ul>
          <li>
            <Link href={assessment}>{t.assessment}</Link>
            <p>{t.assessmentPurpose}</p>
          </li>
          <li>
            <Link href={observations}>{t.observations}</Link>
            <p>{t.observationsPurpose}</p>
          </li>
        </ul>
      </nav>
      <p className="related-direction">{t.footerDirection}</p>
    </details>
  );
}
