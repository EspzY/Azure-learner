import { Boxes, Folder, Layers3, ShieldCheck, SquareTerminal } from 'lucide-react';
import { nb } from '@/content/nb';

export function ArchitectureArt() {
  return (
    <div className="architecture-art" aria-hidden="true">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <svg className="art-connections" viewBox="0 0 480 340" fill="none">
        <path d="M240 65V120M240 167V215H115V250M205 280H275M269 274L275 280L269 286" />
        <circle cx="240" cy="215" r="4" />
      </svg>
      <div className="art-node art-tenant">
        <span>
          <ShieldCheck size={23} />
        </span>
        <div>
          <small>IDENTITY</small>
          <strong>Entra tenant</strong>
        </div>
        <i />
      </div>
      <div className="art-node art-sub">
        <span>
          <Layers3 size={23} />
        </span>
        <div>
          <small>GOVERNANCE</small>
          <strong>Management scope</strong>
        </div>
        <i />
      </div>
      <div className="art-node art-group">
        <span>
          <Folder size={23} />
        </span>
        <div>
          <small>ORGANIZATION</small>
          <strong>Resource group</strong>
        </div>
      </div>
      <div className="art-node art-resource">
        <span>
          <SquareTerminal size={23} />
        </span>
        <div>
          <small>YOUR BUILDING BLOCKS</small>
          <strong>Azure resources</strong>
        </div>
      </div>
      <span className="art-spark spark-a">
        <Boxes size={19} />
      </span>
      <span className="art-spark spark-b">
        <Folder size={16} />
      </span>
      <div className="art-caption">
        <span />
        {nb.dashboard.heroCaption}
      </div>
    </div>
  );
}
