'use client';
import dynamic from 'next/dynamic';
import { nb } from '@/content/nb';
const Game = dynamic(() => import('./game').then((m) => m.Game), {
  ssr: false,
  loading: () => (
    <div className="world-loading" role="status">
      {nb.rpg.loading}
    </div>
  ),
});
export function GameEntry() {
  return <Game />;
}
