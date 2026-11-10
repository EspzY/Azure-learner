import Link from 'next/link';
import { House } from 'lucide-react';
/** Product navigation only. No course/workspace provider or learning event. */
export function AzureLabHomeLink({ className }: { className: string }) {
  return (
    <Link href="/" className={className} aria-label="Til forsiden">
      <House size={16} aria-hidden="true" />
      <span>Til forsiden</span>
    </Link>
  );
}
