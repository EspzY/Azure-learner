'use client';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  Panel,
  useReactFlow,
  type Node,
  type NodeProps,
  type Edge,
  type Viewport,
} from '@xyflow/react';
import { ServiceIcon } from './service-icon';
import { nb, regionLabels } from '@/content/nb';
const g = nb.portal.graph;
export type DiagramNode = Node<
  {
    label: string;
    kind: string;
    location?: string;
    typeLabel?: string;
    scope?: string;
    onInspect?: () => void;
  },
  'resource'
>;
function ResourceNode({ data }: NodeProps<DiagramNode>) {
  const content = (
    <>
      <ServiceIcon kind={data.kind} size={21} />
      <div>
        <small>{data.typeLabel ?? g.types[data.kind as keyof typeof g.types]}</small>
        <strong>{data.label}</strong>
        {data.location && (
          <span>{regionLabels[data.location as keyof typeof regionLabels] ?? data.location}</span>
        )}
        {data.scope && <span>{data.scope}</span>}
      </div>
    </>
  );
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Right} id="side-in" />
      <div className={`portal-graph-node kind-${data.kind}`}>
        {data.onInspect ? (
          <button
            type="button"
            className="studio-node-control nodrag nopan"
            onClick={data.onInspect}
          >
            {content}
          </button>
        ) : (
          content
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} id="side-out" />
    </>
  );
}
function FocusResource({ id, label }: { id: string; label: string }) {
  const flow = useReactFlow();
  return (
    <Panel position="top-right">
      <button
        type="button"
        onClick={() => {
          void flow.fitView({ nodes: [{ id }], minZoom: 1, maxZoom: 1, duration: 0, padding: 0.2 });
        }}
      >
        {label}
      </button>
    </Panel>
  );
}
const nodeTypes = { resource: ResourceNode };
/** Shared rendering only: no World, course provider, navigation controller or persistence. */
export function PortalArchitectureGraph({
  graphKey,
  nodes,
  edges,
  onSelect,
  viewport,
  onViewport,
  focusable = true,
  minZoom = 0.2,
  focusNode,
  focusLabel,
}: {
  graphKey: string | number;
  nodes: DiagramNode[];
  edges: Edge[];
  onSelect: (id: string) => void;
  viewport?: Viewport;
  onViewport?: (viewport: Viewport) => void;
  focusable?: boolean;
  minZoom?: number;
  focusNode?: string;
  focusLabel?: string;
}) {
  return (
    <ReactFlow
      key={graphKey}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView={!viewport}
      defaultViewport={viewport}
      fitViewOptions={{ padding: 0.22 }}
      minZoom={minZoom}
      maxZoom={1.6}
      nodesConnectable={false}
      nodesDraggable={false}
      nodesFocusable={focusable}
      edgesFocusable={focusable}
      deleteKeyCode={null}
      onNodeClick={(_, n) => onSelect(n.id)}
      onEdgeClick={(_, e) => onSelect(e.id)}
      onMoveEnd={(_, v) => onViewport?.(v)}
      colorMode="light"
      ariaLabelConfig={{
        'controls.zoomIn.ariaLabel': nb.explore.controls.zoomIn,
        'controls.zoomOut.ariaLabel': nb.explore.controls.zoomOut,
        'controls.fitView.ariaLabel': nb.explore.controls.fit,
        'node.a11yDescription.default': g.select,
      }}
    >
      {focusNode && focusLabel && nodes.some((n) => n.id === focusNode) && (
        <FocusResource id={focusNode} label={focusLabel} />
      )}
      <Background gap={24} color="#c5cdd2" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
