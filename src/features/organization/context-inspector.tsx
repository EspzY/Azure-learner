'use client';

import { ArrowUpRight, ChevronRight, Globe2, Plus, X } from 'lucide-react';
import { nb, regionLabels, scopeCopy } from '@/content/nb';
import { scopeIcons } from '@/components/icons';
import type { Scope } from '@/domain/simulation';

export function ContextInspector({
  scope,
  scopes,
  onSelect,
  onClose,
  onCreate,
  onCompare,
}: {
  scope: Scope;
  scopes: Scope[];
  onSelect: (id: string) => void;
  onClose: () => void;
  onCreate: () => void;
  onCompare: () => void;
}) {
  const Icon = scopeIcons[scope.kind];
  const parent = scopes.find((item) => item.id === scope.parentId);
  const children = scopes.filter((item) => item.parentId === scope.id);
  return (
    <aside className="context-inspector" aria-labelledby="inspector-title">
      <div className="inspector-grip" />
      <div className="inspector-kicker">
        <span>{nb.universe.inspect}</span>
        <button
          type="button"
          className="icon-button"
          aria-label={nb.universe.close}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <div className="inspector-heading">
        <span className={`component-icon kind-${scope.kind}`}>
          <Icon size={24} />
        </span>
        <div>
          <span className="scope-kind">{scopeCopy[scope.kind].label}</span>
          <h2 id="inspector-title">{scope.label}</h2>
        </div>
      </div>
      <p className="scope-explanation">{scopeCopy[scope.kind].role}</p>
      <dl className="scope-properties">
        {parent && (
          <div>
            <dt>{scope.kind === 'root' ? nb.explore.identity : nb.explore.parent}</dt>
            <dd>
              <button type="button" onClick={() => onSelect(parent.id)}>
                {parent.label}
                <ArrowUpRight size={12} />
              </button>
            </dd>
          </div>
        )}
        <div>
          <dt>{scope.kind === 'group' ? nb.explore.metadataRegion : nb.explore.region}</dt>
          <dd>
            <Globe2 size={12} />
            {scope.region ? regionLabels[scope.region] : nb.explore.noRegion}
          </dd>
        </div>
      </dl>
      {scope.kind === 'subscription' && (
        <button type="button" className="button button-primary inspector-action" onClick={onCreate}>
          <Plus size={17} />
          {nb.universe.create}
        </button>
      )}
      {(scope.kind === 'group' || scope.kind === 'resource') && (
        <button
          type="button"
          className="button button-secondary inspector-action"
          onClick={onCompare}
        >
          <Globe2 size={15} />
          {nb.universe.compare}
        </button>
      )}
      <details className="technical-depth">
        <summary>
          {nb.universe.more}
          <Plus size={14} />
        </summary>
        <p>{scopeCopy[scope.kind].nuance}</p>
        <a
          href="https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview"
          target="_blank"
          rel="noreferrer"
        >
          {nb.explore.sources}
          <ArrowUpRight size={12} />
        </a>
      </details>
      {children.length > 0 && (
        <div className="scope-children">
          <span className="tiny-label">{nb.universe.children}</span>
          {children.map((child) => (
            <button key={child.id} type="button" onClick={() => onSelect(child.id)}>
              <span>{child.label}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
