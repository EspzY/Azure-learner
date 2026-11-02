import React, { type ReactNode } from 'react';
import { sourceDisclosureNb as c } from '@/content/nb';
import './source-disclosure.css';
export interface SourceEntry {
  id: string;
  url: string;
  title?: string;
  publisher?: string;
  reviewed?: string;
  version?: string;
}
/** Presentation only. The caller retains its existing teaching boundary and
 * exact source selection. Native open state never writes learning evidence. */
export function SourceDisclosure({
  entries,
  note,
}: {
  entries: readonly SourceEntry[];
  note?: ReactNode;
}) {
  return (
    <details className="source-disclosure" key={entries.map((s) => s.id).join('|')}>
      <summary>
        {c.title} <span className="source-count">({entries.length})</span>
      </summary>
      {note && <div className="source-note">{note}</div>}
      <ul className="source-list">
        {entries.map((s) => (
          <li key={s.id} data-source-id={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.id} · {s.title || s.publisher || c.publisher} <span aria-hidden="true">↗</span>
            </a>
            {(s.publisher || s.reviewed || s.version) && (
              <small>
                {[s.title ? s.publisher : undefined, s.reviewed, s.version]
                  .filter(Boolean)
                  .join(' · ')}
              </small>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
