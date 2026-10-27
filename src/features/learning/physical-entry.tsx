'use client';
import Link from 'next/link';
import { architectureNb as c } from '@/content/nb';
import { physicalTopics, type PhysicalTopic } from '@/domain/curriculum/architecture-physical';
import { usePhysical } from './physical-provider';
export function PhysicalCourseEntry({
  navigation = false,
  active = false,
  topic,
  onNavigate,
}: {
  navigation?: boolean;
  active?: boolean;
  topic?: string;
  onNavigate?: () => void;
}) {
  const s = usePhysical();
  return navigation ? (
    <section className="course-architecture-nav">
      <h2>{c.path}</h2>
      <Link
        href="/learn/architecture?topic=datacenters"
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
      >
        {c.title} · {c.part}
      </Link>
      <p>{c.available}</p>
      {active && (
        <ol className="course-units">
          {physicalTopics.map((t) => (
            <li key={t}>
              <Link
                href={`/learn/architecture?topic=${t}`}
                aria-current={topic === t ? 'step' : undefined}
                onClick={onNavigate}
              >
                {c.topics[t]}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  ) : (
    <section className="course-syllabus course-architecture-entry">
      <small>{c.path}</small>
      <h2>{c.title}</h2>
      <p>
        <strong>
          {c.part} · {c.available}
        </strong>
      </p>
      <p>{c.intro}</p>
      <p>{c.boundary}</p>
      <p>
        {c.guided}: {s.facts.guided ? c.registered : c.notYet}
      </p>
      <Link
        className="course-primary"
        href={`/learn/architecture?topic=${s.facts.lastTopic ?? ('datacenters' satisfies PhysicalTopic)}`}
      >
        {c.open}
      </Link>
      <p>
        {c.nextPart} · {c.planned}
      </p>
    </section>
  );
}
