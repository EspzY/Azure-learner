'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Snapshot } from '@/laboratory/engine';
import type { CourseEvidence, CaptureRequest, CourseBinding } from '@/laboratory/course/contract';
import { courseApi } from './course-client';
import { PropertyList } from '@/features/portal/shared';
export function CourseEvidencePanel({ snapshot }: { snapshot: Snapshot }) {
  const query = useSearchParams();
  return (
    <EvidenceDetail key={snapshot.workspace + ':' + query.get('evidence')} snapshot={snapshot} />
  );
}
function EvidenceDetail({ snapshot }: { snapshot: Snapshot }) {
  const binding = (snapshot as Snapshot & { courseBinding: CourseBinding }).courseBinding;
  const query = useSearchParams(),
    router = useRouter();
  const id = query.get('evidence');
  const [review, setReview] = useState<{ workspace: string; request: CaptureRequest } | null>(null);
  const [evidence, setEvidence] = useState<CourseEvidence | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const epoch = useRef(0);
  useEffect(() => {
    const n = ++epoch.current;
    if (id)
      void courseApi('evidence?id=' + encodeURIComponent(id), undefined, snapshot.workspace)
        .then((value) => {
          if (n === epoch.current) setEvidence(value.evidence);
        })
        .catch((e) => {
          if (n === epoch.current) setError(e.message);
        });
    return () => {
      epoch.current = n + 1;
    };
  }, [snapshot.workspace, id]);
  if (!binding) return <p role="alert">Kursbindingen kunne ikke verifiseres.</p>;
  const save = async () => {
    if (!review || review.workspace !== snapshot.workspace) return;
    const n = epoch.current;
    setBusy(true);
    setError('');
    try {
      const result = await courseApi('evidence', review.request, review.workspace);
      if (n !== epoch.current) return;
      setEvidence(result.evidence);
      setReview(null);
      const p = new URLSearchParams(query);
      p.set('evidence', result.evidence.id);
      router.replace('/labs/course-workspace?' + p);
    } catch (e) {
      if (n === epoch.current)
        setError(e instanceof Error ? e.message : 'server-result-unavailable');
    } finally {
      if (n === epoch.current) setBusy(false);
    }
  };
  return (
    <details className="lab-course-evidence" open={!!id || undefined}>
      <summary>Kursbundet teknisk evidens</summary>
      <p>
        Serverlagrede originaler. Dette er teknisk evidens, ikke vurdering, XP eller kursfullføring.
      </p>
      <PropertyList
        items={[
          ['Kursprofil', binding.profile],
          ['Teknisk kontekst', binding.contextId],
          ['Arbeidsområde', binding.workspace],
          ['Adapter / modell', `${binding.adapter} / ${binding.model}`],
        ]}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setError('');
          setReview({
            workspace: snapshot.workspace,
            request: {
              captureId: crypto.randomUUID(),
              expectedRevision: snapshot.world.revision,
              through: snapshot.entries.length,
            },
          });
        }}
      >
        Review teknisk evidens
      </button>
      {review && (
        <section aria-label="Review teknisk evidens">
          <p>
            Arbeidsområde {review.workspace} · sekvens {review.request.through} · gjennomgått
            revisjon {review.request.expectedRevision}. Review lagrer ingenting.
          </p>
          <button type="button" disabled={busy} onClick={() => void save()}>
            Lagre evidenspunkt
          </button>
          <button type="button" disabled={busy} onClick={() => setReview(null)}>
            Avbryt
          </button>
        </section>
      )}
      {error && (
        <p role="alert">
          Evidens kunne ikke bekreftes: {error}. Ingen lokal historikk brukes som erstatning.
        </p>
      )}
      {evidence && (
        <section aria-label="Bekreftet teknisk evidens">
          <h2>Serververifisert evidenspunkt</h2>
          <PropertyList
            items={[
              ['Evidens-ID', evidence.id],
              ['Evidensadapter', evidence.adapter],
              ['Original sekvensgrense', String(evidence.through)],
              ['Revisjon / teknisk forsøk', `${evidence.revision} / ${evidence.attempt}`],
              ['Historikkdigest', evidence.historyDigest],
            ]}
          />
          <Link
            href={'/labs/course-workspace?view=history&evidence=' + encodeURIComponent(evidence.id)}
          >
            Original teknisk historikk
          </Link>
        </section>
      )}
    </details>
  );
}
