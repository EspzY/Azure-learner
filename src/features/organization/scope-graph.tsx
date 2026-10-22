'use client';

import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { useMemo } from 'react';
import { nb, scopeCopy } from '@/content/nb';
import type { Scope } from '@/domain/simulation';
import { scopeIcons } from '@/components/icons';

type ScopeNode = Node<{ scope: Scope; active: boolean; select: (id: string) => void }, 'scope'>;
function ScopeCard({ data }: NodeProps<ScopeNode>) {
  const Icon = scopeIcons[data.scope.kind];
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <button
        id={`scene-node-${data.scope.id}`}
        type="button"
        onClick={() => data.select(data.scope.id)}
        className={`scope-node kind-${data.scope.kind} ${data.active ? 'is-selected' : ''}`}
        aria-pressed={data.active}
      >
        <span className="scope-node-icon">
          <Icon size={19} />
        </span>
        <span>
          <small>{scopeCopy[data.scope.kind].label}</small> <strong>{data.scope.label}</strong>
        </span>
        <span className="node-indicator" />
      </button>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
const nodeTypes = { scope: ScopeCard };
export function ScopeGraph({
  scopes,
  selected,
  onSelect,
}: {
  scopes: Scope[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const nodes = useMemo<ScopeNode[]>(
    () =>
      scopes.map((scope) => {
        let position = { x: 210, y: 0 };
        if (scope.kind === 'root') position = { x: 210, y: 96 };
        if (scope.kind === 'management') position = { x: 210, y: 192 };
        if (scope.kind === 'subscription') position = { x: 210, y: 288 };
        if (scope.kind === 'group') {
          const index = scopes
            .filter((item) => item.kind === 'group')
            .findIndex((item) => item.id === scope.id);
          position = { x: index * 260, y: 402 };
        }
        if (scope.kind === 'resource') position = { x: scope.id === 'app' ? 0 : 260, y: 510 };
        return {
          id: scope.id,
          type: 'scope',
          position,
          data: { scope, active: selected === scope.id, select: onSelect },
          draggable: false,
          focusable: false,
          selectable: false,
        };
      }),
    [scopes, selected, onSelect],
  );
  const edges = useMemo<Edge[]>(
    () =>
      scopes
        .filter((scope) => scope.parentId)
        .map((scope) => ({
          id: `${scope.parentId}-${scope.id}`,
          source: scope.parentId!,
          target: scope.id,
          type: 'smoothstep',
          selectable: false,
          focusable: false,
          style: {
            stroke: scope.kind === 'root' ? '#f08acb' : '#50d8e8',
            strokeWidth: 1.5,
            strokeDasharray: scope.kind === 'root' ? '5 5' : undefined,
          },
        })),
    [scopes],
  );
  return (
    <div className="graph-canvas" role="region" aria-label={nb.explore.canvas}>
      <ReactFlow<ScopeNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.25}
        maxZoom={1.5}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={false}
        deleteKeyCode={null}
        panOnScroll={false}
        zoomOnScroll={false}
        colorMode="dark"
        ariaLabelConfig={{
          'controls.zoomIn.ariaLabel': nb.explore.controls.zoomIn,
          'controls.zoomOut.ariaLabel': nb.explore.controls.zoomOut,
          'controls.fitView.ariaLabel': nb.explore.controls.fit,
          'controls.interactive.ariaLabel': nb.explore.controls.interactive,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#304055" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
