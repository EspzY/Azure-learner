'use client';
import { nb } from '@/content/nb';
import type { Receipt } from '@/domain/chapter01/model';
import { SpatialScene } from '@/features/organization/spatial-scene';
import { project, footprint, points } from '@/features/organization/scene-layout';
import { projectWorld } from './projection';

export function ChapterScene({
  projection,
  selected,
  onSelect,
  receipt,
  policyActive,
  comparison,
  onPolicy,
  onReceipt,
  labels,
}: {
  projection: ReturnType<typeof projectWorld>;
  selected: string;
  onSelect: (id: string) => void;
  receipt?: Receipt;
  policyActive: boolean;
  comparison: boolean;
  onPolicy: () => void;
  onReceipt: () => void;
  labels: Record<string, string>;
}) {
  return (
    <SpatialScene
      scopes={projection.scopes}
      frameRelations
      positions={projection.positions}
      models={projection.models}
      dependencies={projection.dependencies}
      labels={labels}
      selected={selected}
      comparison={comparison}
      onSelect={onSelect}
      overlay={(yaw) => {
        const scope = projection.positions['sub-app']!;
        const policyPosition = { x: scope.x + 70, y: scope.y - 130, z: 35 };
        const p = project(policyPosition, yaw);
        const target = project(scope, yaw);
        const group = receipt && projection.positions[receipt.scopeId];
        const rejected =
          receipt && receipt.outcome !== 'accepted' && group
            ? { x: group.x + 200, y: group.y + 80, z: 0 }
            : null;
        const r = rejected && project(rejected, yaw);
        return (
          <>
            <g
              className={`policy-annotation ${policyActive ? 'policy-highlighted' : ''}`}
              data-policy-scope="sub-app"
            >
              {policyActive && (
                <path
                  d={`M${p.x},${p.y}L${target.x},${target.y}`}
                  fill="none"
                  stroke="#edc887"
                  strokeWidth="2"
                  strokeDasharray="3 7"
                />
              )}
              <path
                d={`M${p.x} ${p.y - 36}L${p.x + 24} ${p.y - 25}V${p.y - 1}L${p.x} ${p.y + 16}L${p.x - 24} ${p.y - 1}V${p.y - 25}Z`}
                fill="#342b30"
                stroke="#edc887"
                strokeWidth={policyActive ? 3 : 1.5}
              />
              <foreignObject x={p.x - 80} y={p.y + 17} width="160" height="60">
                <button type="button" className="policy-scene-button" onClick={onPolicy}>
                  {nb.chapter.customPolicy}
                </button>
              </foreignObject>
            </g>
            {rejected && r && (
              <g className="rejected-operation" data-rejected-command={receipt!.commandId}>
                <polygon
                  points={points(footprint(rejected, 130, 90, yaw, 30))}
                  fill="#38273244"
                  stroke="#edb27c"
                  strokeWidth="2"
                  strokeDasharray="7 5"
                />
                <path
                  d={`M${r.x - 13} ${r.y - 41}L${r.x + 13} ${r.y - 15}M${r.x + 13} ${r.y - 41}L${r.x - 13} ${r.y - 15}`}
                  stroke="#edb27c"
                  strokeWidth="3"
                />
                <foreignObject x={r.x - 110} y={r.y + 15} width="220" height="80">
                  <button type="button" className="rejected-scene-button" onClick={onReceipt}>
                    {nb.chapter.operationRejected}
                  </button>
                </foreignObject>
              </g>
            )}
          </>
        );
      }}
    />
  );
}
