'use client';
import { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Node,
  type NodeProps,
  type Edge,
} from '@xyflow/react';
import { Database, Layers, AppWindow, ShieldCheck, FolderTree, Network } from 'lucide-react';
import { nb, regionLabels, scopeCopy } from '@/content/nb';
import { projectArchitecture } from '@/domain/portal/model';
import type { World } from '@/domain/chapter01/model';
import type { Navigate } from './shared';
import { PropertyList } from './shared';
import { usePortalLearning } from './learning-provider';
const t = nb.portal,
  g = t.graph;
type DiagramNode = Node<{ label: string; kind: string; location?: string }, 'resource'>;
function ResourceNode({ data }: NodeProps<DiagramNode>) {
  const Icon =
    data.kind === 'group'
      ? FolderTree
      : data.kind === 'plan'
        ? Layers
        : data.kind === 'app'
          ? AppWindow
          : data.kind === 'policy'
            ? ShieldCheck
            : data.kind === 'tenant'
              ? Network
              : Database;
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Right} id="side-in" />
      <div className={`portal-graph-node kind-${data.kind}`}>
        <Icon size={21} />
        <div>
          <small>{g.types[data.kind as keyof typeof g.types]}</small>
          <strong>{data.label}</strong>
          {data.location && <span>{regionLabels[data.location as keyof typeof regionLabels]}</span>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} id="side-out" />
    </>
  );
}
const nodeTypes = { resource: ResourceNode };
const colors = {
  'identity-authority': '#8764b8',
  'management-parent': '#69797e',
  'resource-member': '#0078d4',
  'depends-on': '#107c10',
  'policy-scope': '#a45b00',
};
export function ArchitectureExplorer({
  world,
  navigate,
  initialSelection = '',
  lens = 'architecture',
}: {
  world: World;
  navigate: Navigate;
  initialSelection?: string;
  lens?: 'architecture' | 'hierarchy';
}) {
  const [selection, setSelection] = useState(initialSelection),
    [list, setList] = useState(false),
    [explaining, setExplaining] = useState(false);
  const { store } = usePortalLearning();
  const projection = useMemo(() => projectArchitecture(world, lens), [world, lens]);
  const node = projection.nodes.find((n) => n.id === selection),
    relation = projection.edges.find((e) => e.id === selection);
  const select = (id: string) => {
    setSelection(id);
    setExplaining(false);
  };
  const nodes: DiagramNode[] = projection.nodes.map((n) => ({
    id: n.id,
    type: 'resource',
    position: { x: n.x, y: n.y },
    data: { label: n.name, kind: n.kind, location: n.location },
    selected: n.id === selection,
    draggable: false,
  }));
  const edges: Edge[] = projection.edges.map((e) => ({
    id: e.id,
    source:
      e.kind === 'depends-on' || e.kind === 'identity-authority' || e.kind === 'policy-scope'
        ? e.from
        : e.to,
    target:
      e.kind === 'depends-on' || e.kind === 'identity-authority' || e.kind === 'policy-scope'
        ? e.to
        : e.from,
    ariaLabel: g.relations[e.kind],
    sourceHandle: e.kind === 'depends-on' || e.kind === 'policy-scope' ? 'side-out' : undefined,
    targetHandle: e.kind === 'depends-on' || e.kind === 'policy-scope' ? 'side-in' : undefined,
    style: {
      stroke: colors[e.kind],
      strokeWidth: e.id === selection ? 3 : 1.6,
      strokeDasharray:
        e.kind === 'identity-authority'
          ? '4 5'
          : e.kind === 'depends-on'
            ? '9 4'
            : e.kind === 'policy-scope'
              ? '2 4'
              : undefined,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: colors[e.kind] },
  }));
  return (
    <section className="portal-architecture">
      <p>
        {g.title}. {g.location}
      </p>
      <div className="portal-graph-toolbar">
        <button type="button" aria-pressed={!list} onClick={() => setList(false)}>
          {g.diagram}
        </button>
        <button type="button" aria-pressed={list} onClick={() => setList(true)}>
          {g.list}
        </button>
      </div>
      <div className="portal-graph-layout">
        <div>
          {!list && (
            <div className="portal-graph" aria-label={g.diagram}>
              <ReactFlow
                key={world.revision}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.22 }}
                minZoom={0.2}
                maxZoom={1.6}
                nodesConnectable={false}
                nodesDraggable={false}
                deleteKeyCode={null}
                onNodeClick={(_, n) => select(n.id)}
                onEdgeClick={(_, e) => select(e.id)}
                colorMode="light"
                ariaLabelConfig={{
                  'controls.zoomIn.ariaLabel': nb.explore.controls.zoomIn,
                  'controls.zoomOut.ariaLabel': nb.explore.controls.zoomOut,
                  'controls.fitView.ariaLabel': nb.explore.controls.fit,
                  'node.a11yDescription.default': g.select,
                }}
              >
                <Background gap={24} color="#c5cdd2" />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          )}
          <div className="portal-legend" aria-label={g.legend}>
            {Object.entries(g.relations).map(([id, label]) => (
              <span key={id} style={{ borderLeftColor: colors[id as keyof typeof colors] }}>
                {label}
              </span>
            ))}
          </div>
          <details open={list}>
            <summary>{g.list}</summary>
            <div className="portal-node-list">
              {projection.nodes.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  aria-pressed={selection === n.id}
                  onClick={() => select(n.id)}
                >
                  {g.types[n.kind as keyof typeof g.types]} · {n.name}
                </button>
              ))}
            </div>
            <ul className="portal-relation-list">
              {projection.edges.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    aria-pressed={selection === e.id}
                    onClick={() => select(e.id)}
                  >
                    {projection.nodes.find((n) => n.id === e.from)?.name} →{' '}
                    {projection.nodes.find((n) => n.id === e.to)?.name} · {g.relations[e.kind]}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <aside className="portal-graph-inspector" aria-label={g.inspectRelation}>
          {node ? (
            <>
              <small>{g.types[node.kind as keyof typeof g.types]}</small>
              <h2>{node.name}</h2>
              <PropertyList
                items={[
                  [t.name, node.name],
                  [t.type, g.types[node.kind as keyof typeof g.types]],
                  [
                    node.kind === 'group' ? t.metadata : t.resourceLocation,
                    node.location ? regionLabels[node.location as keyof typeof regionLabels] : '—',
                  ],
                ]}
              />
              <button
                type="button"
                onClick={() =>
                  navigate(node.kind === 'policy' ? 'policy' : 'resource', { id: node.id })
                }
              >
                {t.viewResource}
              </button>
              <button
                type="button"
                onClick={() => {
                  store.event({ kind: 'aid' });
                  setExplaining(true);
                }}
              >
                {t.relatedLearning}
              </button>
              {explaining &&
                (Object.hasOwn(scopeCopy, node.kind) ? (
                  <>
                    <p>{scopeCopy[node.kind as keyof typeof scopeCopy].role}</p>
                    <p>{scopeCopy[node.kind as keyof typeof scopeCopy].nuance}</p>
                  </>
                ) : (
                  <p>
                    {node.kind === 'plan'
                      ? t.planNote
                      : node.kind === 'app'
                        ? t.appNote
                        : g.explanations['policy-scope']}
                  </p>
                ))}
            </>
          ) : relation ? (
            <>
              <h2>{g.relations[relation.kind]}</h2>
              <p>
                {projection.nodes.find((n) => n.id === relation.from)?.name} →{' '}
                {projection.nodes.find((n) => n.id === relation.to)?.name}
              </p>
              <button
                type="button"
                onClick={() => {
                  store.event({ kind: 'aid' });
                  setExplaining(true);
                }}
              >
                {t.relatedLearning}
              </button>
              {explaining && <p>{g.explanations[relation.kind]}</p>}
            </>
          ) : (
            <p>{g.select}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
