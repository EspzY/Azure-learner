import { redirect } from 'next/navigation';
export default async function Expedition3DPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const input = await searchParams;
  const query = new URLSearchParams();
  if (
    ['welcome', 'foundations', 'service', 'assignment', 'infrastructure', 'debrief'].includes(
      String(input.goal),
    )
  )
    query.set('goal', String(input.goal));
  if (input.return === 'chapter01') query.set('return', 'chapter01');
  redirect(`/legacy/rpg${query.size ? `?${query}` : ''}`);
}
