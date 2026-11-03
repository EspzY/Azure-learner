'use client';
import { nb } from '@/content/nb';
import { cloudChapterFor } from '@/features/course/cloud-computing-chapters';
import { SavvyShark } from '@/features/course/savvy-shark';
import { FoundationsV2, foundationsSources } from './foundations-v2';
import { useFoundationsV2 } from './v2-provider';
import { SourceDisclosure } from './source-disclosure';
import { RelatedActivities } from './related-activities';
import './cloud-computing-chapter.css';

/** Composes unchanged teaching/mechanisms; never synthesizes completion or evidence. */
export function CloudComputingChapter({ topic }: { topic: string }) {
  const chapter = cloudChapterFor(topic);
  const v2 = useFoundationsV2();
  if (!chapter) return <FoundationsV2 topic={topic} />;
  const entries = [
    ...new Map(
      chapter.members.flatMap(foundationsSources).map((source) => [source.id, source]),
    ).values(),
  ];
  return (
    <article className="cloud-chapter" aria-label={chapter.title}>
      <header className="cloud-chapter-heading">
        <h2 data-activity-heading={topic === chapter.topic || undefined} tabIndex={-1}>
          {chapter.title}
        </h2>
        <p>{chapter.objective}</p>
      </header>
      {v2.issue && (
        <div className="course-storage" role="status">
          <p>
            {nb.foundationsV2.storage} ({v2.issue})
          </p>
          <button onClick={v2.store.load}>{nb.course.reload}</button>
          <button onClick={v2.store.clear}>{nb.foundationsV2.reset}</button>
        </div>
      )}
      {chapter.members.length > 1 && (
        <nav className="cloud-chapter-parts" aria-label="I denne økten">
          {chapter.members.map((member) => (
            <a key={member} href={`#cloud-part-${member}`}>
              {nb.foundationsV2.topics[member].title}
            </a>
          ))}
        </nav>
      )}
      {chapter.guide && (
        <details className="cloud-chapter-guide">
          <summary>SavvyShark · Tips til undersøkelsen</summary>
          <SavvyShark compact>
            <p>{chapter.guide}</p>
          </SavvyShark>
        </details>
      )}
      {chapter.members.map((member) => (
        <FoundationsV2
          key={member}
          topic={member}
          embedded
          focusPart={topic === member && topic !== chapter.topic}
        />
      ))}
      <section className="cloud-chapter-connection" aria-label="Fra denne økten til den neste">
        <h3>Dette tar du med videre</h3>
        <p>{chapter.connection}</p>
      </section>
      <p className="source-context">{nb.foundationsVisuals.sourceNote}</p>
      <SourceDisclosure entries={entries} />
      <RelatedActivities
        assessment="/learn/computing?topic=v2-assessment"
        observations="/learn/computing?topic=v2-summary"
      />
    </article>
  );
}
