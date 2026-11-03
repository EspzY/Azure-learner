'use client';
import { useState } from 'react';
import { nb, hybridExperienceNb as experience } from '@/content/nb';
export function SavvyShark({
  children,
  compact = false,
  dismissiblePortrait = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
  dismissiblePortrait?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [hidden, setHidden] = useState(false);
  return (
    <div className={`savvy ${compact ? 'savvy-compact' : ''}`}>
      {!failed && !hidden && (
        <img
          src="/mascot/savvy-shark-default.png"
          width={281}
          height={317}
          alt=""
          onError={() => setFailed(true)}
        />
      )}
      <div>
        <strong>{nb.course.assistant}</strong>
        <small>{nb.course.assistantRole}</small>
        {dismissiblePortrait && !failed && (
          <button
            className="savvy-portrait-toggle"
            type="button"
            onClick={() => setHidden(!hidden)}
          >
            {hidden ? experience.showPortrait : experience.hidePortrait}
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
