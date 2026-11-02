'use client';
import { useState } from 'react';
import manifest from '../../../public/design-review/characters/v1/manifest.json';
import { visualReviewNb as c } from '@/content/nb';

/** Presentation projection only. Rejected/unproduced assets can never imply an approved pose. */
export function characterAsset({
  independent,
  ready,
  phase,
}: {
  independent: boolean;
  ready: boolean;
  phase: 'welcome' | 'thinking' | 'explain-right' | 'checklist';
}) {
  if (independent || !ready) return null;
  const approved = manifest.poses.find((p) => p.id === phase && p.productionAllowed);
  return approved
    ? '/design-review/characters/v1/' + approved.variants[0]!.file
    : manifest.canonical.file;
}
export function CharacterPortrait({
  phase = 'welcome',
  ready = true,
  independent = false,
}: {
  phase?: 'welcome' | 'thinking' | 'explain-right' | 'checklist';
  ready?: boolean;
  independent?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = characterAsset({ phase, ready, independent });
  return src && !failed ? (
    <img
      className="ve-character"
      src={src}
      width={281}
      height={317}
      alt=""
      onError={() => setFailed(true)}
    />
  ) : null;
}
export function CharacterGallery() {
  return (
    <section className="ve-character-gallery">
      <header>
        <span className="ve-eyebrow">{c.character.eyebrow}</span>
        <h1 tabIndex={-1} data-ve-heading>
          {c.character.title}
        </h1>
        <p className="ve-lead">{c.character.intro}</p>
      </header>
      <div className="ve-truth-note">
        <strong>{c.character.blockedTitle}</strong>
        <p>{c.character.blocked}</p>
      </div>
      <div className="ve-art-grid">
        <figure className="ve-art-original">
          <div>
            <img
              src={manifest.canonical.file}
              width={281}
              height={317}
              alt={c.character.originalAlt}
            />
          </div>
          <figcaption>
            <span>{c.character.locked}</span>
            <h2>{c.character.original}</h2>
            <p>{c.character.originalText}</p>
          </figcaption>
        </figure>
        {manifest.poses.map((p) => (
          <figure key={p.id}>
            <div>
              <img
                src={'/design-review/characters/v1/' + p.variants[1]!.file}
                width={p.variants[1]!.width}
                height={p.variants[1]!.height}
                loading="lazy"
                alt={c.character.names[p.id as keyof typeof c.character.names]}
              />
            </div>
            <figcaption>
              <span>{c.character.candidate}</span>
              <h2>{c.character.names[p.id as keyof typeof c.character.names]}</h2>
              <p>{c.character.revision}</p>
              <a href={'/design-review/characters/v1/' + p.file}>{c.character.master}</a>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="ve-two-column">
        <section>
          <h2>{c.character.lockTitle}</h2>
          <ul>
            {c.character.locks.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{c.character.nextTitle}</h2>
          <p>{c.character.next}</p>
          <p>{c.character.plan}</p>
          <a href="/design-review/characters/v1/manifest.json">{c.character.manifest}</a>
        </section>
      </div>
    </section>
  );
}
