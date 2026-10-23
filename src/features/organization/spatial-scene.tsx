'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Focus, Maximize2, Minus, Plus, RotateCcw, RotateCw } from 'lucide-react';
import { nb, regionLabels, scopeCopy } from '@/content/nb';
import type { Scope } from '@/domain/simulation';
import {
  footprint,
  points,
  project,
  relatedScopes,
  scenePosition,
  type Point3,
} from './scene-layout';

function Prism({
  center,
  width,
  depth,
  height,
  yaw,
  tone = 'violet',
}: {
  center: Point3;
  width: number;
  depth: number;
  height: number;
  yaw: number;
  tone?: string;
}) {
  const bottom = footprint(center, width, depth, yaw);
  const top = footprint(center, width, depth, yaw, height);
  return (
    <g className={`prism prism-${tone}`}>
      <polygon
        className="prism-side side-left"
        points={points([top[3]!, top[2]!, bottom[2]!, bottom[3]!])}
      />
      <polygon
        className="prism-side side-right"
        points={points([top[1]!, top[2]!, bottom[2]!, bottom[1]!])}
      />
      <polygon className="prism-top" points={points(top)} />
      <polyline className="prism-rim" points={points([...top, top[0]!])} />
    </g>
  );
}

function StorageVolume({ center, yaw }: { center: Point3; yaw: number }) {
  const segments = 24;
  const ring = (lift: number) =>
    Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2;
      return project(
        {
          x: center.x + Math.cos(angle) * 23,
          y: center.y + Math.sin(angle) * 23,
          z: center.z + lift,
        },
        yaw,
      );
    });
  const bottom = ring(5);
  const top = ring(66);
  return (
    <g className="storage-volume">
      {Array.from({ length: segments }, (_, i) => {
        const mid = ((i + 0.5) / segments) * Math.PI * 2;
        if (
          Math.cos(mid) * Math.sin((yaw * Math.PI) / 180) +
            Math.sin(mid) * Math.cos((yaw * Math.PI) / 180) <
          0
        )
          return null;
        const next = (i + 1) % segments;
        return (
          <polygon
            key={i}
            points={points([bottom[i]!, bottom[next]!, top[next]!, top[i]!])}
            fill={i < 6 ? '#493350' : '#342a49'}
          />
        );
      })}
      <polygon points={points(top)} fill="#65476b" stroke="#c599cf" strokeWidth="1" />
      {[23, 44].map((lift) => (
        <polyline
          key={lift}
          points={points(ring(lift))}
          fill="none"
          stroke="#bc8fc5"
          strokeWidth="1.2"
        />
      ))}
    </g>
  );
}

function InfrastructureModel({
  scope,
  yaw,
  center,
  model,
}: {
  scope: Scope;
  yaw: number;
  center?: Point3;
  model?: 'plan' | 'webapp';
}) {
  const c = center ?? scenePosition(scope);
  const p = project(c, yaw);
  if (scope.kind === 'tenant')
    return (
      <g className="identity-beacon">
        <ellipse cx={p.x} cy={p.y + 12} rx="66" ry="23" />
        <ellipse cx={p.x} cy={p.y - 24} rx="45" ry="45" className="identity-orbit" />
        <path
          d={`M${p.x} ${p.y - 82}L${p.x + 29} ${p.y - 39}L${p.x} ${p.y - 4}L${p.x - 29} ${p.y - 39}Z`}
        />
        <path
          className="identity-facet"
          d={`M${p.x} ${p.y - 82}V${p.y - 4}M${p.x - 29} ${p.y - 39}H${p.x + 29}`}
        />
        <circle cx={p.x} cy={p.y - 39} r="6" />
      </g>
    );
  const isGroup = scope.kind === 'group';
  const isResource = scope.kind === 'resource';
  const size = scope.kind === 'subscription' ? 164 : isGroup ? 142 : isResource ? 92 : 126;
  const tone = isGroup ? 'cyan' : isResource ? 'pink' : 'violet';
  return (
    <g className="infrastructure-model">
      <polygon
        className="ground-shadow"
        points={points(footprint({ ...c, z: -23 }, size + 25, size * 0.72 + 25, yaw))}
      />
      <Prism
        center={{ ...c, z: c.z - 16 }}
        width={size + 12}
        depth={size * 0.72 + 12}
        height={10}
        yaw={yaw}
        tone="base"
      />
      <Prism
        center={{ ...c, z: c.z - 5 }}
        width={size}
        depth={size * 0.72}
        height={9}
        yaw={yaw}
        tone={tone}
      />
      {isGroup ? (
        <>
          <Prism
            center={{ ...c, x: c.x - 46, z: c.z + 4 }}
            width={8}
            depth={size * 0.58}
            height={22}
            yaw={yaw}
            tone="cyan"
          />
          <Prism
            center={{ ...c, y: c.y - 34, z: c.z + 4 }}
            width={100}
            depth={8}
            height={22}
            yaw={yaw}
            tone="cyan"
          />
          <polygon className="group-floor" points={points(footprint(c, 91, 52, yaw, 5))} />
        </>
      ) : model === 'plan' ? (
        <g className="hosting-plan-model">
          {[18, 39].map((z) => (
            <Prism
              key={z}
              center={{ ...c, z: c.z + z }}
              width={72}
              depth={48}
              height={12}
              yaw={yaw}
              tone="violet"
            />
          ))}
          <polyline className="server-line" points={points(footprint(c, 50, 30, yaw, 54))} />
        </g>
      ) : model === 'webapp' ? (
        <g className="webapp-model">
          <Prism
            center={{ ...c, z: c.z + 4 }}
            width={60}
            depth={38}
            height={9}
            yaw={yaw}
            tone="pink"
          />
          <polygon
            points={points(
              [
                { x: c.x - 34, y: c.y, z: c.z + 20 },
                { x: c.x + 34, y: c.y, z: c.z + 20 },
                { x: c.x + 34, y: c.y, z: c.z + 79 },
                { x: c.x - 34, y: c.y, z: c.z + 79 },
              ].map((point) => project(point, yaw)),
            )}
            fill="#311c40"
            stroke="#f08acb"
            strokeWidth="2"
          />
          <text
            x={p.x}
            y={p.y - 35}
            textAnchor="middle"
            fill="#f5b9dd"
            fontSize="19"
            fontFamily="monospace"
          >
            {'</>'}
          </text>
        </g>
      ) : scope.id === 'storage' ? (
        <StorageVolume center={c} yaw={yaw} />
      ) : scope.kind === 'root' ? (
        <>
          {[90, 62, 34].map((width, index) => (
            <Prism
              key={width}
              center={{ ...c, z: c.z + 5 + index * 11 }}
              width={width}
              depth={width * 0.75}
              height={10}
              yaw={yaw}
            />
          ))}
        </>
      ) : (
        <>
          <Prism
            center={{ ...c, z: c.z + 5 }}
            width={isResource ? 35 : 55}
            depth={isResource ? 35 : 55}
            height={isResource ? 64 : 49}
            yaw={yaw}
            tone={tone}
          />
          {(isResource ? [20, 36, 52] : scope.kind === 'subscription' ? [20, 37] : []).map(
            (lift) => (
              <polyline
                key={lift}
                className="server-line"
                points={points(
                  footprint(c, isResource ? 36 : 56, isResource ? 36 : 56, yaw, lift).slice(1, 4),
                )}
              />
            ),
          )}
          {scope.kind === 'subscription' &&
            [-1, 1].map((side) => (
              <Prism
                key={side}
                center={{ x: c.x + side * 54, y: c.y - side * 20, z: c.z + 5 }}
                width={24}
                depth={24}
                height={side === 1 ? 27 : 20}
                yaw={yaw}
                tone="violet"
              />
            ))}
          {scope.kind === 'management' && (
            <Prism
              center={{ x: c.x - 41, y: c.y + 20, z: c.z + 5 }}
              width={19}
              depth={19}
              height={25}
              yaw={yaw}
              tone="violet"
            />
          )}
        </>
      )}
    </g>
  );
}

export function SpatialScene({
  scopes,
  selected,
  onSelect,
  comparison = false,
  preview = false,
  positions,
  labels,
  models,
  dependencies = [],
  overlay,
  frameRelations = false,
}: {
  scopes: Scope[];
  selected: string | null;
  onSelect?: (id: string) => void;
  comparison?: boolean;
  preview?: boolean;
  positions?: Record<string, Point3>;
  labels?: Record<string, string>;
  models?: Record<string, 'plan' | 'webapp'>;
  dependencies?: { from: string; to: string }[];
  overlay?: (yaw: number) => ReactNode;
  frameRelations?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [narrow, setNarrow] = useState(false);
  const [aspect, setAspect] = useState(1.5);
  const [yaw, setYaw] = useState(45);
  const [zoom, setZoom] = useState(1);
  const [overview, setOverview] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const gridId = useId().replaceAll(':', '');
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setNarrow(entry.contentRect.width < 700);
        if (entry.contentRect.height > 0)
          setAspect(entry.contentRect.width / entry.contentRect.height);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const width = narrow && !preview ? 680 : 1280;
  const height = frameRelations ? width / aspect : 850;
  const position = (scope: Scope) => positions?.[scope.id] ?? scenePosition(scope);
  const related = relatedScopes(scopes, selected);
  for (const edge of dependencies)
    if (selected === edge.from || selected === edge.to) {
      related.add(edge.from);
      related.add(edge.to);
    }
  const targetScope = scopes.find((scope) => scope.id === (focused ?? selected));
  let target =
    targetScope && !overview
      ? project(position(targetScope), yaw)
      : narrow && !overview
        ? project(
            position(scopes.find((scope) => scope.kind === 'subscription') ?? scopes[0]!),
            yaw,
          )
        : { x: 610, y: 365 };
  let scale =
    zoom *
    (targetScope && !overview ? 1.3 : narrow ? (overview ? 0.66 : 1.08) : preview ? 1.02 : 0.98);
  if (frameRelations) {
    const companionId = dependencies.find((edge) => edge.from === targetScope?.id)?.to;
    const companion = scopes.find((scope) => scope.id === companionId);
    const framed = overview
      ? scopes
      : companion && targetScope
        ? [targetScope, companion]
        : targetScope
          ? [targetScope]
          : scopes;
    const coordinates = framed.map((scope) => project(position(scope), yaw));
    const xs = coordinates.map((p) => p.x);
    const ys = coordinates.map((p) => p.y);
    target = {
      x: (Math.min(...xs) + Math.max(...xs)) / 2,
      y: (Math.min(...ys) + Math.max(...ys)) / 2 - 45,
    };
    scale =
      zoom *
      (overview
        ? Math.min(
            (width - 100) / (Math.max(...xs) - Math.min(...xs) + 220),
            (height - 100) / (Math.max(...ys) - Math.min(...ys) + 240),
            1.1,
          )
        : narrow
          ? companion
            ? 0.8
            : 0.95
          : 1.1);
  }
  const offsetX = width * (selected && !narrow && !preview ? 0.43 : 0.5) - target.x * scale + pan.x;
  const offsetY =
    height * (frameRelations ? 0.5 : selected && narrow ? 0.4 : 0.49) - target.y * scale + pan.y;
  const resetCamera = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOverview(true);
  };
  const focusCamera = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOverview(false);
  };
  const choose = (id: string) => {
    focusCamera();
    onSelect?.(id);
  };
  return (
    <div
      className={`spatial-scene ${preview ? 'scene-preview' : ''}`}
      data-camera={overview ? 'overview' : (selected ?? 'universe')}
    >
      <svg
        ref={ref}
        className="universe-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        role={preview ? 'presentation' : 'group'}
        aria-label={preview ? undefined : nb.universe.sceneLabel}
        aria-hidden={preview || undefined}
        tabIndex={preview ? undefined : 0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === '+' || event.key === '=')
            setZoom((value) => Math.min(1.8, value + 0.15));
          else if (event.key === '-') setZoom((value) => Math.max(0.55, value - 0.15));
          else if (event.key === 'Home' || event.key === '0') resetCamera();
          else if (event.key.startsWith('Arrow')) {
            event.preventDefault();
            setPan((value) => ({
              x: value.x + (event.key === 'ArrowLeft' ? 45 : event.key === 'ArrowRight' ? -45 : 0),
              y: value.y + (event.key === 'ArrowUp' ? 45 : event.key === 'ArrowDown' ? -45 : 0),
            }));
          }
        }}
        onPointerDown={(event) => {
          if (preview || (event.target as Element).closest('button')) return;
          drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start || !ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const factor = Math.max(rect.width / width, rect.height / height);
          setPan({
            x: start.panX + (event.clientX - start.x) / factor,
            y: start.panY + (event.clientY - start.y) / factor,
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <defs>
          <marker
            id={`${gridId}-dependency`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="#c7a4ff" />
          </marker>
          <radialGradient id={`${gridId}-light`}>
            <stop stopColor="#54429e" stopOpacity=".26" />
            <stop offset="1" stopColor="#070b1a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g
          className="camera-world"
          style={{ transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})` }}
        >
          <g aria-hidden="true">
            <ellipse cx="650" cy="500" rx="670" ry="380" fill={`url(#${gridId}-light)`} />
            <g className="world-grid">
              {Array.from({ length: 18 }, (_, i) => -650 + i * 90).map((value) => (
                <g key={value}>
                  <line
                    x1={project({ x: value, y: -600, z: -28 }, yaw).x}
                    y1={project({ x: value, y: -600, z: -28 }, yaw).y}
                    x2={project({ x: value, y: 950, z: -28 }, yaw).x}
                    y2={project({ x: value, y: 950, z: -28 }, yaw).y}
                  />
                  <line
                    x1={project({ x: -650, y: value, z: -28 }, yaw).x}
                    y1={project({ x: -650, y: value, z: -28 }, yaw).y}
                    x2={project({ x: 900, y: value, z: -28 }, yaw).x}
                    y2={project({ x: 900, y: value, z: -28 }, yaw).y}
                  />
                </g>
              ))}
            </g>
            <g className="scene-links">
              {scopes
                .filter((scope) => scope.parentId)
                .map((scope) => {
                  const parent = scopes.find((item) => item.id === scope.parentId)!;
                  const from = project(position(parent), yaw);
                  const to = project(position(scope), yaw);
                  const active = related.has(scope.id) && related.has(parent.id);
                  return (
                    <g
                      key={scope.id}
                      className={`${scope.kind === 'root' ? 'identity-link' : models?.[scope.id] ? 'resource-member-link' : 'containment-link'} ${active ? 'link-related' : 'link-muted'}`}
                      data-relation={
                        scope.kind === 'root'
                          ? 'identity-authority'
                          : scope.kind === 'resource'
                            ? 'resource-member'
                            : 'management-parent'
                      }
                      data-from={parent.id}
                      data-to={scope.id}
                    >
                      <path
                        d={`M${from.x},${from.y} C${from.x},${from.y + 65} ${to.x},${to.y - 65} ${to.x},${to.y}`}
                      />
                      <circle cx={to.x} cy={to.y} r="3" />
                    </g>
                  );
                })}
            </g>
            {dependencies.map((edge) => {
              const fromScope = scopes.find((s) => s.id === edge.from);
              const toScope = scopes.find((s) => s.id === edge.to);
              if (!fromScope || !toScope) return null;
              const from = project({ ...position(fromScope), z: position(fromScope).z + 40 }, yaw);
              const to = project({ ...position(toScope), z: position(toScope).z + 50 }, yaw);
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  className="hosting-dependency"
                  data-relation="depends-on"
                  data-from={edge.from}
                  data-to={edge.to}
                  d={`M${from.x},${from.y} C${from.x},${from.y - 90} ${to.x},${to.y - 90} ${to.x},${to.y}`}
                  fill="none"
                  stroke="#c7a4ff"
                  strokeWidth="2.5"
                  strokeDasharray="10 6"
                  markerEnd={`url(#${gridId}-dependency)`}
                />
              );
            })}
          </g>
          {[...scopes]
            .sort((a, b) => project(position(a), yaw).y - project(position(b), yaw).y)
            .map((scope) => {
              const p = project(position(scope), yaw);
              const active = selected === scope.id;
              return (
                <g
                  key={scope.id}
                  className={`scene-object object-${models?.[scope.id] ?? scope.kind} ${active ? 'object-selected' : ''} ${related.has(scope.id) ? 'object-related' : 'object-muted'} ${scope.id.startsWith('created-group-') ? 'object-created' : ''}`}
                  data-scope-id={scope.id}
                >
                  <g className="object-geometry" aria-hidden="true">
                    {active && (
                      <ellipse className="selection-ring" cx={p.x} cy={p.y + 9} rx="103" ry="42" />
                    )}
                    <InfrastructureModel
                      scope={scope}
                      yaw={yaw}
                      center={position(scope)}
                      model={models?.[scope.id]}
                    />
                  </g>
                  <foreignObject
                    x={p.x - 117}
                    y={p.y - 92}
                    width="234"
                    height={comparison && scope.region ? 178 : 150}
                    className="object-label-container"
                  >
                    {preview ? (
                      <div className="scene-node-label preview-node-label">
                        <small>{labels?.[scope.id] ?? scopeCopy[scope.kind].label}</small>
                        <strong>{scope.label}</strong>
                      </div>
                    ) : (
                      <button
                        id={`scene-node-${scope.id}`}
                        className="scene-node-label"
                        type="button"
                        onClick={() => choose(scope.id)}
                        onFocus={() => {
                          setFocused(scope.id);
                          focusCamera();
                        }}
                        onBlur={() => setFocused(null)}
                        aria-pressed={active}
                      >
                        <span className="node-hit-area" />
                        <small>{labels?.[scope.id] ?? scopeCopy[scope.kind].label}</small>{' '}
                        <strong>{scope.label}</strong>
                        {comparison && scope.region && (
                          <span className="node-location">
                            {scope.kind === 'group' ? nb.universe.metadata : nb.universe.location} ·{' '}
                            {regionLabels[scope.region]}
                          </span>
                        )}
                      </button>
                    )}
                  </foreignObject>
                </g>
              );
            })}
          {overlay?.(yaw)}
        </g>
      </svg>
      {!preview && (
        <div className="camera-controls" aria-label={nb.universe.camera}>
          <button
            type="button"
            aria-label={nb.universe.overview}
            title={nb.universe.overview}
            onClick={resetCamera}
          >
            <Maximize2 size={17} />
          </button>
          <button
            type="button"
            aria-label={nb.universe.focus}
            title={nb.universe.focus}
            onClick={focusCamera}
          >
            <Focus size={18} />
          </button>
          <span />
          <button
            type="button"
            aria-label={nb.explore.controls.zoomIn}
            onClick={() => setZoom((value) => Math.min(1.8, value + 0.15))}
          >
            <Plus size={19} />
          </button>
          <button
            type="button"
            aria-label={nb.explore.controls.zoomOut}
            onClick={() => setZoom((value) => Math.max(0.55, value - 0.15))}
          >
            <Minus size={19} />
          </button>
          <span />
          <button
            type="button"
            aria-label={nb.universe.rotateLeft}
            onClick={() => setYaw((value) => Math.max(20, value - 10))}
          >
            <RotateCcw size={17} />
          </button>
          <button
            type="button"
            aria-label={nb.universe.rotateRight}
            onClick={() => setYaw((value) => Math.min(70, value + 10))}
          >
            <RotateCw size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
