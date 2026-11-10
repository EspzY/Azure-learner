'use client';
import { managementNb } from '@/content/nb';
import { managementTopics, isManagementTopic } from '@/domain/curriculum/architecture-management';
import { useManagement } from './management-provider';
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
  const s = usePhysical(),
    b = useManagement();
  return navigation ? (
    <section className="course-architecture-nav">
      <h2>{c.path}</h2>
      <Link
        href="/learn/architecture?topic=datacenters"
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
      >
        {c.title}
      </Link>
      <p>{managementNb.available}</p>
      {active && (
        <ol className="course-units">
          {[...physicalTopics, ...managementTopics].map((t) => (
            <li key={t}>
              <Link
                href={`/learn/architecture?topic=${t}`}
                aria-current={topic === t ? 'step' : undefined}
                onClick={onNavigate}
              >
                {isManagementTopic(t) ? managementNb.topics[t] : c.topics[t]}
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
        <strong>{managementNb.available}</strong>
      </p>
      <p>{managementNb.intro}</p>
      <p>{managementNb.summaryLimit}</p>
      <p>
        {c.guided}: {s.facts.guided ? c.registered : c.notYet}
      </p>
      <p>
        {managementNb.guided}: {b.facts.guided ? c.registered : c.notYet}
      </p>
      <Link
        className="course-primary"
        href={`/learn/architecture?topic=${b.facts.active ? 'management-assessment' : s.facts.active ? 'assessment' : (b.facts.lastTopic ?? s.facts.lastTopic ?? ('datacenters' satisfies PhysicalTopic))}`}
      >
        {c.open}
      </Link>
      <Link href="/learn/architecture?topic=organization">{managementNb.resumeB}</Link>
    </section>
  );
}
