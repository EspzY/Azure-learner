'use client';
import { useState } from 'react';
import { nb } from '@/content/nb';
export function SavvyShark({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`savvy ${compact ? 'savvy-compact' : ''}`}>
      {!failed && (
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
        {children}
      </div>
    </div>
  );
}
