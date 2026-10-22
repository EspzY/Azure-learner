import { nb } from '@/content/nb';
import { Workbench } from '@/features/organization/workbench';
export default function ExplorePage() {
  return (
    <div className="page explore-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow blue">{nb.explore.eyebrow}</p>
          <h1>{nb.explore.title}</h1>
          <p className="page-intro">{nb.explore.intro}</p>
        </div>
        <span className="simulation-badge">
          <span />
          {nb.shell.simulation}
        </span>
      </div>
      <Workbench />
    </div>
  );
}
