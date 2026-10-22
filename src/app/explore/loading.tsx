import { nb } from '@/content/nb';
export default function LoadingWorld() {
  return (
    <div className="world-loading" role="status">
      {nb.expedition.worldLoading}
    </div>
  );
}
