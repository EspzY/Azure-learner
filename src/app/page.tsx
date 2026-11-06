import { Landing } from '@/features/landing/landing';
export default function Home() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return (
    <Landing
      commit={
        process.env.VERCEL_ENV === 'preview' && sha && /^[a-f0-9]{40}$/.test(sha) ? sha : null
      }
    />
  );
}
