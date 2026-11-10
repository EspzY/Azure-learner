'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MarkerType, type Edge } from '@xyflow/react';
import type { Snapshot } from '@/laboratory/engine';
import { architectureStudioNb as t } from '@/content/architecture-studio-nb';
import { laboratoryTopologyNb as topologyCopy } from '@/content/laboratory-topology-nb';
import { laboratoryFirewallNb as firewallCopy } from '@/content/laboratory-firewall-nb';
import { laboratoryEndpointsNb as endpointCopy } from '@/content/laboratory-endpoints-nb';
import { laboratoryInventory } from './portal-adapter';
import {
  projectTopology,
  relationLabel,
  validStudioFilters,
  filterTopology,
  currentAnalysis,
  architectureObservations,
  diagnosticReferences,
} from './studio-model';
import { studioParameters, readStudio } from './studio-location';
import { PolicyAnalysisView, type LaboratoryPolicyResult } from './endpoints';
import { PortalArchitectureGraph, type DiagramNode } from '@/features/portal/architecture-graph';
import { PortalTable } from '@/features/portal/presentation';
import { PropertyList } from '@/features/portal/shared';
import { ServiceIcon } from '@/features/portal/service-icon';
import './studio.css';
export function ArchitectureStudio({
  snapshot,
  accept,
}: {
  snapshot: Snapshot;
  accept: (s: Snapshot) => void;
}) {
  const query = useSearchParams(),
    parsed = readStudio(query, snapshot.workspace);
  const [list, setList] = useState(false),
    [diagnostics, setDiagnostics] = useState(false),
    [expectFirewall, setExpectFirewall] = useState(false),
    [analysis, setAnalysis] = useState<LaboratoryPolicyResult | null>(null);
  const inspector = useRef<HTMLHeadingElement>(null),
    graph = useRef<HTMLDivElement>(null),
    diagnosticPanel = useRef<HTMLDetailsElement>(null);
  const rows = useMemo(() => laboratoryInventory(snapshot.world), [snapshot.world]);
  const state = { ...parsed, filters: validStudioFilters(rows, parsed.filters) };
  const topology = useMemo(() => projectTopology(snapshot, rows), [snapshot, rows]);
  const visible = filterTopology(topology, state.filters);
  const result = currentAnalysis(snapshot, analysis) ? analysis : null;
  const refs = diagnosticReferences(snapshot, result),
    highlight = new Set(refs);
  const observations = architectureObservations(snapshot, rows, result, expectFirewall);
  const node = topology.nodes.find((n) => n.id === state.selected),
    relation = topology.edges.find((e) => e.id === state.selected);
  const update = (change: Record<string, string>, clearViewport = false) => {
    const p = new URLSearchParams(window.location.search);
    p.set('view', 'studio');
    p.delete('id');
    p.delete('receipt');
    p.delete('section');
    p.delete('studio');
    p.set('sw', snapshot.workspace);
    if (clearViewport) for (const k of ['sx', 'sy', 'sz', 'sselected']) p.delete(k);
    for (const [k, v] of Object.entries(change)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    window.history.replaceState(null, '', '/labs/laboratory?' + p);
  };
  const select = (id: string) => update({ sselected: id });
  const open = (view: string, id?: string, receipt?: string) => {
    const p = new URLSearchParams({
      view,
      studio: '1',
      sw: snapshot.workspace,
      ...(id ? { id } : {}),
      ...(receipt ? { receipt } : {}),
    });
    for (const [k, v] of studioParameters(query)) p.set(k, v);
    return '/labs/laboratory?' + p;
  };
  useEffect(() => {
    if (!diagnostics || !diagnosticPanel.current) return;
    diagnosticPanel.current.querySelector('summary')?.focus();
    diagnosticPanel.current.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [diagnostics]);
  const selectedExists = !!node || !!relation;
  useEffect(() => {
    if (!state.selected || !selectedExists || !inspector.current) return;
    const heading = inspector.current,
      box = heading.getBoundingClientRect();
    heading.focus({ preventScroll: box.top >= 50 && box.bottom <= innerHeight - 40 });
  }, [state.selected, selectedExists]);
  const nodes: DiagramNode[] = visible.nodes.map((n) => ({
    id: n.id,
    type: 'resource',
    position: { x: n.x, y: n.y },
    data: {
      label: n.name,
      kind: n.kind,
      typeLabel: n.typeName,
      location: n.resource?.location,
      scope: n.scope,
      onInspect: () => select(n.id),
    },
    selected: n.id === state.selected,
    draggable: false,
    focusable: false,
    ariaRole: 'group',
    className: highlight.has(n.id) ? 'studio-analysed' : '',
  }));
  const edges: Edge[] = visible.edges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    label:
      e.id === state.selected
        ? relationLabel(e.kind) + (e.status ? ' · ' + e.status : '')
        : e.status === 'Initiated'
          ? 'Initiated'
          : undefined,
    ariaLabel: relationLabel(e.kind) + (e.status ? ' · ' + e.status : ''),
    animated: false,
    style: {
      stroke:
        e.id === state.selected
          ? '#0865bd'
          : e.kind === 'appliance-reference'
            ? '#8764b8'
            : e.status === 'Initiated'
              ? '#8b5e16'
              : '#69797e',
      strokeWidth: e.id === state.selected ? 3 : 1.5,
      strokeDasharray:
        e.status === 'Initiated' ? '3 5' : e.kind === 'appliance-reference' ? '8 5' : undefined,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#69797e' },
  }));
  const options = (
    field: 'subscriptionId' | 'groupId' | 'view',
    name: 'subscriptionName' | 'groupName' | 'typeName',
  ) =>
    [...new Map(rows.map((r) => [r[field], r[name]])).entries()].sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  const resource = node?.resource;
  return (
    <section
      className="architecture-studio"
      aria-label={t.title}
      data-workspace={snapshot.workspace}
      data-revision={snapshot.world.revision}
    >
      <p className="studio-boundary">{t.boundary}</p>
      <div className="studio-filters">
        {(
          [
            ['ssub', 'subscription', t.subscription, options('subscriptionId', 'subscriptionName')],
            ['sgroup', 'group', t.group, options('groupId', 'groupName')],
            ['stype', 'kind', t.kind, options('view', 'typeName')],
          ] as const
        ).map(([key, field, label, choices]) => (
          <label key={key}>
            {label}
            <select
              value={state.filters[field]}
              onChange={(e) => update({ [key]: e.target.value }, true)}
            >
              <option value="">{t.all}</option>
              {choices.map(([id, name]) => (
                <option key={id} value={id}>
                  {name} · {id}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button type="button" onClick={() => update({ ssub: '', sgroup: '', stype: '' }, true)}>
          {t.resetFilters}
        </button>
      </div>
      <div className="portal-graph-toolbar">
        <button type="button" aria-pressed={!list} onClick={() => setList(false)}>
          {t.topology}
        </button>
        <button type="button" aria-pressed={list} onClick={() => setList(true)}>
          {t.list}
        </button>
        <button
          type="button"
          aria-expanded={diagnostics}
          onClick={() => setDiagnostics(!diagnostics)}
        >
          {t.diagnostics}
        </button>
      </div>
      <p className="studio-caption">
        {visible.nodes.length} / {topology.nodes.length} · {snapshot.world.model} · {t.revision}{' '}
        {snapshot.world.revision}.
      </p>
      <details className="studio-help">
        <summary>{t.help}</summary>
        <p>
          {t.diagramNote} {t.omitted}
        </p>
      </details>
      {result && (
        <p className="studio-analysis-summary">
          <strong>
            {'firewallPath' in result
              ? firewallCopy.outcome[result.firewallPath.disposition]
              : endpointCopy.statuses[result.status]}
          </strong>{' '}
          · {t.revision} {result.revision}
        </p>
      )}
      <div className="studio-workbench">
        <div ref={graph} className="studio-diagram-pane">
          {!list ? (
            <>
              <div className="portal-graph studio-graph" aria-label={t.topology}>
                <PortalArchitectureGraph
                  graphKey={`${snapshot.workspace}:${snapshot.world.model}:${JSON.stringify(state.filters)}`}
                  nodes={nodes}
                  edges={edges}
                  onSelect={select}
                  viewport={state.viewport}
                  onViewport={(v) =>
                    update({
                      sx: String(Math.round(v.x)),
                      sy: String(Math.round(v.y)),
                      sz: String(v.zoom),
                    })
                  }
                  focusNode={node?.id}
                  focusLabel={t.focus}
                  focusable={false}
                  minZoom={0.01}
                />
              </div>
              <p className="studio-legend">
                {t.structural} · - - {t.configuredHop} · <span>{t.analysed}</span>
              </p>
            </>
          ) : (
            <PortalTable
              caption={t.list}
              rows={visible.nodes}
              empty={t.empty}
              columns={[
                {
                  key: 'name',
                  label: t.name,
                  cell: (n) => (
                    <button
                      type="button"
                      aria-pressed={state.selected === n.id}
                      onClick={() => select(n.id)}
                    >
                      <ServiceIcon kind={n.kind} />
                      {n.name} · {n.id}
                    </button>
                  ),
                },
                { key: 'type', label: t.kind, cell: (n) => n.typeName },
                { key: 'scope', label: t.scope, cell: (n) => n.scope },
              ]}
            />
          )}
          <details>
            <summary>
              {t.relations} · {visible.edges.length}
            </summary>
            <ul className="studio-relations">
              {visible.edges.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => select(e.id)}>
                    {topology.nodes.find((n) => n.id === e.from)?.name} [{e.from}] →{' '}
                    {topology.nodes.find((n) => n.id === e.to)?.name} [{e.to}] ·{' '}
                    {relationLabel(e.kind)}
                    {e.status ? ' · ' + e.status : ''}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <aside className="studio-inspector" aria-label={t.inspect}>
          <h2 ref={inspector} tabIndex={-1}>
            {node?.name ?? (relation ? relationLabel(relation.kind) : t.selected)}
          </h2>
          {node ? (
            <>
              <PropertyList
                items={[
                  [t.identity, node.id],
                  [t.kind, node.typeName],
                  [t.scope, node.scope],
                ]}
              />
              {resource && (
                <>
                  <Link className="studio-open" href={open(resource.view, resource.id)}>
                    {t.open}
                  </Link>
                  <p>
                    <Link href={open('history', undefined, resource.origin)}>
                      {t.receipt} · {resource.origin}
                    </Link>
                  </p>
                  <details>
                    <summary>{t.properties}</summary>
                    <PropertyList
                      items={Object.entries(resource.source).map(([k, v]) => [
                        k,
                        v === null ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v),
                      ])}
                    />
                  </details>
                </>
              )}
              <h3>{t.relations}</h3>
              <ul>
                {topology.edges
                  .filter((e) => e.from === node.id || e.to === node.id)
                  .map((e) => {
                    const other = topology.nodes.find(
                      (n) => n.id === (e.from === node.id ? e.to : e.from),
                    )!;
                    return (
                      <li key={e.id}>
                        <button type="button" onClick={() => select(other.id)}>
                          {other.name} · {other.id}
                        </button>
                        <small>
                          {relationLabel(e.kind)}
                          {e.status ? ' · ' + e.status : ''}
                        </small>
                      </li>
                    );
                  })}
              </ul>
            </>
          ) : relation ? (
            <>
              <PropertyList
                items={[
                  [t.identity, relation.id],
                  [t.status, relation.status ?? t.structural],
                ]}
              />
              {[relation.from, relation.to].map((id) => (
                <button key={id} type="button" onClick={() => select(id)}>
                  {topology.nodes.find((n) => n.id === id)?.name} · {id}
                </button>
              ))}
            </>
          ) : (
            <p>{t.select}</p>
          )}
        </aside>
      </div>
      {analysis && !result && <p role="status">{t.stale}</p>}
      <details
        open={diagnostics}
        onToggle={(event) => setDiagnostics(event.currentTarget.open)}
        className="studio-diagnostics"
        ref={diagnosticPanel}
      >
        <summary>{t.diagnostics}</summary>
        <p>{t.analysisNote}</p>
        <label>
          <input
            type="checkbox"
            checked={expectFirewall}
            onChange={(e) => setExpectFirewall(e.target.checked)}
          />
          {t.intent}
        </label>
        {'nics' in snapshot.world ? (
          <PolicyAnalysisView
            snapshot={snapshot}
            initialSource={null}
            accept={accept}
            onAnalysis={setAnalysis}
          />
        ) : (
          <p>{t.legacy}</p>
        )}
        {result && (
          <section aria-label={t.evidence}>
            <h3>{t.evidence}</h3>
            <p>
              {t.analysed}. {t.workspace} {result.workspace} · {result.model} · {t.revision}{' '}
              {result.revision}.
            </p>
            <ol>
              {refs.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      update({ ssub: '', sgroup: '', stype: '', sselected: id }, true);
                      setList(false);
                      graph.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
                    }}
                  >
                    {topology.nodes.find((n) => n.id === id)?.name} · {id}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        )}
      </details>
      <section className="studio-observations" aria-label={t.observations}>
        <h2>{t.observations}</h2>
        {observations.length ? (
          <ul>
            {observations.map((o) => (
              <li key={o.id} data-observation={o.type}>
                <strong>
                  {o.type in topologyCopy.observationTypes
                    ? topologyCopy.observationTypes[
                        o.type as keyof typeof topologyCopy.observationTypes
                      ]
                    : t.observationTypes[o.type as keyof typeof t.observationTypes]}
                </strong>{' '}
                · {t.classes[o.classification]}
                <p>{o.reason}</p>
                {o.ruleId && (
                  <p>
                    {t.ruleReference}: {o.ruleId}
                  </p>
                )}
                <button type="button" onClick={() => select(o.resourceId)}>
                  {topology.nodes.find((n) => n.id === o.resourceId)?.name ?? o.resourceId} ·{' '}
                  {o.resourceId}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t.noObservations}</p>
        )}
      </section>
    </section>
  );
}
