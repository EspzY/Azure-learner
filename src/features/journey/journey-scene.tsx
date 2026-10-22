'use client';

import { useEffect, useRef, useState } from 'react';
import {
  layers,
  responsibility,
  type Layer,
  type ServiceModel,
  type Stop,
} from '@/domain/expedition';
import { nb } from '@/content/nb';
import {
  cameraAt,
  interpolateCamera,
  locations,
  project,
  routeX,
  type Camera,
  type Point3,
} from './route-geometry';

const colors = { customer: '#f05bb5', microsoft: '#50d8e8', shared: '#b39aff' };
export function JourneyScene({
  stop,
  model,
  selectedLayer,
  overview,
  complete,
  allocations,
  entering,
  verdict,
  onLayer,
}: {
  stop: Stop;
  model: ServiceModel;
  selectedLayer: Layer;
  overview: boolean;
  complete: boolean;
  allocations: string[];
  entering: boolean;
  verdict: 'correct' | 'incorrect' | null;
  onLayer: (layer: Layer) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const current = useRef<Camera>(cameraAt(stop, overview));
  const [camera, setCamera] = useState(() => cameraAt(stop, overview));
  const [width, setWidth] = useState(1200);
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const ratio = entry.contentRect.width / Math.max(1, entry.contentRect.height);
      setWidth(Math.max(500, ratio * 800));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const destination = cameraAt(stop, overview);
    const from = current.current;
    let frame = 0;
    let start: number | undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => {
      cancelAnimationFrame(frame);
      current.current = destination;
      setCamera(destination);
      setMoving(false);
    };
    const tick = (time: number) => {
      start ??= time;
      const progress = Math.min(1, (time - start) / 850);
      current.current = interpolateCamera(from, destination, progress);
      setCamera(current.current);
      setMoving(progress < 1);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const change = () => {
      if (media.matches) finish();
    };
    if (media.matches) frame = requestAnimationFrame(finish);
    else frame = requestAnimationFrame(tick);
    media.addEventListener('change', change);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener('change', change);
    };
  }, [stop, overview]);
  const p = (x: number, y: number, z = 0) => project({ x, y, z }, camera, width);
  const polygon = (points: Point3[]) =>
    points
      .map((point) => {
        const v = project(point, camera, width);
        return `${v.x},${v.y}`;
      })
      .join(' ');
  const path = (points: Point3[]) =>
    points
      .map((point, i) => {
        const v = project(point, camera, width);
        return `${i ? 'L' : 'M'}${v.x},${v.y}`;
      })
      .join(' ');
  const route = Array.from({ length: 100 }, (_, i) => {
    const y = camera.y + 10 + i * 35;
    return { x: routeX(y), y, z: 0 };
  });
  const landmark = (
    x: number,
    y: number,
    name: string,
    kind: 'network' | 'operations' | 'architecture',
  ) => {
    const v = p(x, y);
    if (!v.visible) return null;
    return (
      <g
        key={name}
        transform={`translate(${v.x} ${v.y}) scale(${v.scale})`}
        className={`distant-landmark ${kind}`}
      >
        <ellipse rx="130" ry="36" fill="#111b35" stroke="#394469" />
        {kind === 'network' ? (
          <g stroke="#4c9baa" strokeWidth="3" fill="#152f42">
            {[-70, 0, 70].map((n) => (
              <g key={n}>
                <path d={`M0 -90L${n} -35`} />
                <circle cx={n} cy="-35" r="15" />
              </g>
            ))}
            <circle cy="-90" r="21" />
          </g>
        ) : kind === 'operations' ? (
          <g stroke="#9079be" fill="#201a38">
            {[0, 1, 2, 3].map((n) => (
              <rect key={n} x={n * 27 - 50} y={-35 - n * 22} width="18" height={35 + n * 22} />
            ))}
          </g>
        ) : (
          <g stroke="#c983ac" fill="#301c39">
            <path d="M-70 0L0 -140L70 0L0 -30Z" />
            <path d="M0 -140V-30M-70 0L70 0" />
          </g>
        )}
        <text y="65" textAnchor="middle" fill="#c1c8e4" fontSize="22">
          {name}
        </text>
        <text y="89" textAnchor="middle" fill="#a8b1cb" fontSize="15">
          {nb.expedition.future}
        </text>
      </g>
    );
  };
  function platform(point: Point3, radius: number, color: string) {
    const v = project(point, camera, width);
    return (
      <g transform={`translate(${v.x} ${v.y}) scale(${v.scale})`}>
        <path
          d={`M${-radius} 0L0 ${radius * 0.32}L${radius} 0V18L0 ${radius * 0.32 + 18}L${-radius} 18Z`}
          fill="#11172a"
          stroke="#303955"
        />
        <path
          d={`M${-radius} 0L0 ${-radius * 0.32}L${radius} 0L0 ${radius * 0.32}Z`}
          fill="#1a2039"
          stroke={color}
          strokeWidth="1.5"
        />
        <ellipse cy="28" rx={radius * 0.7} ry="13" fill={color} opacity=".08" />
      </g>
    );
  }
  const modelPoint = locations.models;
  const gate = p(locations.gateway.x, locations.gateway.y);
  const activeDetour = stop === 'decision' || stop === 'ownership';
  return (
    <div
      className={`journey-landscape ${entering ? 'portal-entering' : ''}`}
      ref={container}
      data-moving={moving}
      data-stop={stop}
      data-camera={`${camera.x.toFixed(1)},${camera.y.toFixed(1)}`}
    >
      <svg
        viewBox={`0 0 ${width} 800`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={nb.expedition.scene}
      >
        <defs>
          <linearGradient id="exp-sky" x2="0" y2="1">
            <stop stopColor="#0a1028" />
            <stop offset=".5" stopColor="#171432" />
            <stop offset="1" stopColor="#080d1c" />
          </linearGradient>
          <radialGradient id="exp-aurora">
            <stop stopColor="#8560b9" stopOpacity=".24" />
            <stop offset="1" stopColor="#8560b9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="exp-portal" x2="1" y2="1">
            <stop stopColor="#8b70ff" stopOpacity=".1" />
            <stop offset=".5" stopColor={complete ? '#50d8e8' : '#af7ef3'} stopOpacity=".38" />
            <stop offset="1" stopColor="#f05bb5" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <rect width={width} height="800" fill="url(#exp-sky)" />
        <ellipse cx={width * 0.58} cy="170" rx={width * 0.6} ry="260" fill="url(#exp-aurora)" />
        {Array.from({ length: 42 }, (_, i) => (
          <circle
            key={i}
            cx={(i * 173 + 49) % width}
            cy={(i * 47) % 240}
            r={i % 3 === 0 ? 1.3 : 0.7}
            fill="#aeb6e2"
            opacity=".45"
          />
        ))}
        <path
          d={`M0 262L${width * 0.1} 210L${width * 0.2} 240L${width * 0.33} 180L${width * 0.44} 234L${width * 0.64} 192L${width * 0.8} 230L${width} 190V800H0Z`}
          fill="#0b1225"
        />
        <g opacity=".3" stroke="#333957" fill="none">
          {Array.from({ length: 14 }, (_, i) => {
            const y = camera.y + 30 + i * i * 22;
            return (
              <path
                key={i}
                d={path([
                  { x: -2600, y, z: -20 },
                  { x: 2600, y, z: -20 },
                ])}
              />
            );
          })}
        </g>
        <polygon
          points={polygon([
            ...route.map((point) => ({ ...point, x: point.x - 54 })),
            ...route.toReversed().map((point) => ({ ...point, x: point.x + 54 })),
          ])}
          fill="#171c34"
          stroke="#303554"
        />
        {[-56, 56].map((offset) => (
          <path
            key={offset}
            d={path(route.map((point) => ({ ...point, x: point.x + offset })))}
            fill="none"
            stroke="#9a79ef"
            strokeWidth="2"
            opacity=".7"
          />
        ))}
        <path d={path(route)} fill="none" stroke="#97a4d4" strokeDasharray="5 24" opacity=".4" />
        {(['decision', 'ownership'] as const).map((id) => {
          const loc = locations[id];
          const start = { x: routeX(loc.y - 150), y: loc.y - 150, z: 0 };
          return (
            <path
              key={id}
              d={path([start, { x: loc.x * 0.5, y: loc.y - 60, z: 0 }, loc])}
              fill="none"
              stroke={stop === id ? '#f05bb5' : '#4b4166'}
              strokeWidth={stop === id ? 6 : 3}
              strokeDasharray={stop === id ? undefined : '7 7'}
            />
          );
        })}
        {landmark(480, 2660, nb.expedition.landmarks.architecture, 'architecture')}
        {landmark(0, 2460, nb.expedition.landmarks.operations, 'operations')}
        {landmark(-420, 2220, nb.expedition.landmarks.network, 'network')}
        {gate.visible && (
          <g
            className={`exp-gateway ${complete ? 'complete' : ''}`}
            transform={`translate(${gate.x} ${gate.y}) scale(${gate.scale})`}
          >
            <ellipse rx="140" ry="34" fill="#18182f" stroke={complete ? '#50d8e8' : '#9b79ec'} />
            <path
              d="M-100 0V-220L0 -270L100 -220V0L82 -10V-207L0 -247L-82 -207V-10Z"
              fill="#252343"
              stroke="#b497f2"
              strokeWidth="2"
            />
            <path
              d="M-80 -10V-207L0 -245L80 -207V-10L0 18Z"
              fill="url(#exp-portal)"
              stroke={complete ? '#50d8e8' : '#f05bb5'}
            />
            <path
              d="M-30 -80L0 -96L30 -80V-45L0 -29L-30 -45ZM0 -96V-62M-30 -80L0 -62L30 -80M0 -62V-29"
              fill="none"
              stroke="#dfd5ff"
              strokeWidth="2"
            />
            <text y="52" textAnchor="middle" fill="#eee9ff" fontSize="20">
              {nb.expedition.stops.gateway.label}
            </text>
            <text y="76" textAnchor="middle" fill="#bcc4df" fontSize="12">
              G01 / F02
            </text>
          </g>
        )}
        {(['decision', 'ownership'] as const).map((id) => {
          const loc = locations[id];
          const v = project(loc, camera, width);
          if (!v.visible) return null;
          return (
            <g key={id} className={stop === id ? 'detour-lit' : ''}>
              {platform(
                loc,
                id === stop ? 170 : 95,
                stop === id ? (verdict === 'correct' ? '#88e2d7' : '#f05bb5') : '#76639e',
              )}
              <g
                transform={`translate(${v.x} ${v.y}) scale(${v.scale})`}
                fill="none"
                stroke="#76639e"
              >
                <path d="M-65 -20V-90L0 -120L65 -90V-20" />
                <path d="M-100 -5V-65M100 -5V-65" />
                {id === 'ownership' ? (
                  ['data', 'identity', 'os', 'physical'].map((key, i) => (
                    <g
                      key={key}
                      transform={`translate(${(i % 2) * 80 - 40} ${Math.floor(i / 2) * 48 - 90})`}
                    >
                      <path
                        d="M-22 0L0 -13L22 0V22L0 35L-22 22Z"
                        fill={allocations.includes(key) ? '#833e76' : '#203443'}
                        stroke={allocations.includes(key) ? '#f05bb5' : '#50d8e8'}
                      />
                    </g>
                  ))
                ) : (
                  <path
                    d="M-30 -55L0 -75L30 -55L0 -35ZM0 -75V-105"
                    stroke="#f05bb5"
                    strokeWidth="3"
                  />
                )}
              </g>
            </g>
          );
        })}
        {p(modelPoint.x, modelPoint.y).visible && (
          <g className="responsibility-structure">
            {platform(modelPoint, 135, '#9e84ef')}
            {layers.map((layer, i) => {
              const z = 20 + i * 23;
              const owner = responsibility(model, layer);
              const selected = layer === selectedLayer;
              const corners = [
                { x: modelPoint.x - 75, y: modelPoint.y - 42, z },
                { x: modelPoint.x + 75, y: modelPoint.y - 42, z },
                { x: modelPoint.x + 75, y: modelPoint.y + 42, z },
                { x: modelPoint.x - 75, y: modelPoint.y + 42, z },
              ];
              const top = corners.map((point) => ({ ...point, z: point.z + 13 }));
              return (
                <g
                  key={layer}
                  data-layer={layer}
                  data-owner={owner}
                  className={selected ? 'layer-selected' : ''}
                >
                  <polygon
                    points={polygon([corners[2]!, corners[3]!, top[3]!, top[2]!])}
                    fill={colors[owner]}
                    opacity={selected ? 0.8 : 0.35}
                  />
                  <polygon
                    points={polygon([corners[1]!, corners[2]!, top[2]!, top[1]!])}
                    fill={colors[owner]}
                    opacity=".2"
                  />
                  <polygon
                    points={polygon(top)}
                    fill={selected ? '#34304c' : '#19243b'}
                    stroke={colors[owner]}
                    strokeWidth={selected ? 2.5 : 1}
                  />
                </g>
              );
            })}
          </g>
        )}
        <g
          className="journey-position"
          transform={`translate(${p(locations[stop].x, locations[stop].y - 100).x} ${p(locations[stop].x, locations[stop].y - 100).y})`}
        >
          <ellipse rx="26" ry="9" fill="#e3d4ff" opacity=".18" />
          <path d="M0 -12L9 2L0 -2L-9 2Z" fill="#eee4ff" />
        </g>
        {activeDetour && (
          <path d={`M${width * 0.15} 745H${width * 0.85}`} stroke="#f05bb5" opacity=".3" />
        )}
      </svg>
      {stop === 'models' && !overview && (
        <div className="scene-layer-controls" aria-label={nb.expedition.selection}>
          {layers.toReversed().map((layer) => (
            <button
              key={layer}
              type="button"
              aria-pressed={selectedLayer === layer}
              onClick={() => onLayer(layer)}
              style={{ '--owner': colors[responsibility(model, layer)] } as React.CSSProperties}
            >
              <i />
              <span>{nb.expedition.layers[layer].label}</span>
              <small>{nb.expedition.owners[responsibility(model, layer)]}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
