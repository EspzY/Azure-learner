import { redirect } from 'next/navigation';

/** Compatibility bookmark for a retired experience; no legacy runtime or state. */
export default function RetiredEntry() {
  redirect('/portal');
}
