'use client';
import { useState } from 'react';
import Link from 'next/link';
import { briefingHref, flowCopy } from './learning-flow';
import { useGuidedLearning } from './guided-learning';

/** Opens a briefing or returns to an existing session; navigation never starts a session. */
export function GuidedMissionLink({
  module,
  mission,
  label,
}: {
  module: string;
  mission: string;
  label?: string;
}) {
  const guide = useGuidedLearning()
    .find((m) => m.id === module)
    ?.guides.find((g) => g.id === mission);
  const [failed, setFailed] = useState(false);
  if (!guide) return null;
  const resume = (guide.phase === 'paused' || guide.phase === 'complete') && guide.resume;
  return (
    <>
      <p className="guided-mission-status">{flowCopy[guide.phase]}</p>
      <Link
        href={
          resume || guide.phase === 'unavailable' || guide.phase === 'complete'
            ? guide.href
            : briefingHref(guide)
        }
        onClick={(e) => {
          if (resume && !resume()) {
            e.preventDefault();
            setFailed(true);
          }
        }}
      >
        {label ??
          (guide.phase === 'unavailable'
            ? flowCopy.recovery
            : guide.phase === 'complete'
              ? flowCopy.review
              : resume
                ? flowCopy.resume
                : guide.phase === 'active' || guide.phase === 'cause'
                  ? flowCopy.work
                  : flowCopy.open)}{' '}
        →
      </Link>
      {failed && <p role="alert">{flowCopy.resumeFailed}</p>}
    </>
  );
}

export function OtherGuideNotice({ module, mission }: { module: string; mission: string }) {
  const current = useGuidedLearning()
    .find((m) => m.id === module)
    ?.guides.find((g) => g.current && g.id !== mission && g.phase !== 'complete');
  if (!current) return null;
  return (
    <p className="guided-other-mission">
      {current.phase === 'unavailable' ? flowCopy.unavailable : 'Du har en pågående undersøkelse.'}{' '}
      <Link href={current.href}>
        {current.title} · {current.phase === 'unavailable' ? flowCopy.recovery : flowCopy.work}
      </Link>
    </p>
  );
}
