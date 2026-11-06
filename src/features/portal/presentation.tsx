'use client';

import { useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { nb } from '@/content/nb';
import { ServiceIcon } from './service-icon';
import './presentation.css';

const p = nb.portal;

/** Presentation only. The route adapter owns every World, request and learning layer. */
export function PortalFrame({
  className = 'portal',
  mode,
  training,
  area,
  style,
  before,
  header,
  navigation,
  mainId,
  titleId,
  children,
  layers,
}: {
  className?: string;
  mode: 'course' | 'laboratory';
  training?: string;
  area?: string;
  style?: CSSProperties;
  before?: ReactNode;
  header: ReactNode;
  navigation: ReactNode;
  mainId: string;
  titleId: string;
  children: ReactNode;
  layers?: ReactNode;
}) {
  return (
    <div
      className={className}
      data-portal-mode={mode}
      data-training={training}
      data-area={area}
      style={style}
    >
      {before}
      <a className="portal-skip" href={'#' + mainId}>
        {nb.shell.skip}
      </a>
      {header}
      <div className="portal-body">
        {navigation}
        <main className="portal-working" id={mainId} aria-labelledby={titleId}>
          {children}
        </main>
      </div>
      {layers}
    </div>
  );
}

export function PortalHeader({
  expanded,
  onToggle,
  homeHref,
  onHome,
  search,
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  homeHref: string;
  onHome: React.MouseEventHandler<HTMLAnchorElement>;
  search: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="portal-header" data-portal-component="header">
      <button type="button" aria-label={p.menu} aria-expanded={expanded} onClick={onToggle}>
        <ServiceIcon kind="menu" size={20} />
      </button>
      <a href={homeHref} onClick={onHome} className="portal-brand">
        {p.brand} <small>{p.version}</small>
      </a>
      {search}
      {children}
    </header>
  );
}

export function PortalSearch({
  value,
  onChange,
  inputRef,
  guide,
  label = p.search,
  placeholder = p.searchPlaceholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  guide?: string;
  label?: string;
  placeholder?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="portal-search"
      data-portal-component="search"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onChange('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onChange('');
          inputRef.current?.focus();
        }
        if (e.target !== inputRef.current && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
          const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('a'));
          const index = links.indexOf(document.activeElement as HTMLAnchorElement);
          if (index >= 0) {
            e.preventDefault();
            links[
              (index + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
            ]?.focus();
          }
        }
      }}
    >
      <ServiceIcon kind="search" size={17} />
      <input
        data-guide={guide}
        ref={inputRef}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        aria-controls={value ? 'portal-search-results' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('');
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            e.currentTarget.parentElement
              ?.querySelector<HTMLAnchorElement>('.portal-search-results a')
              ?.focus();
          }
        }}
      />
      {value && (
        <div
          id="portal-search-results"
          className="portal-search-results"
          aria-label={p.searchResults}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function PortalNavigation({
  open,
  label = p.navLabel,
  footer,
  children,
}: {
  open: boolean;
  label?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <aside
      className={`portal-nav ${open ? 'mobile-open' : ''}`}
      aria-label={label}
      data-portal-component="navigation"
    >
      <nav aria-label={label}>{children}</nav>
      {footer && <small>{footer}</small>}
    </aside>
  );
}

export function PortalTitle({
  id,
  title,
  icon,
  subtitle,
  headingRef,
  guide,
}: {
  id: string;
  title: string;
  icon?: ReactNode;
  subtitle?: ReactNode;
  headingRef?: Ref<HTMLHeadingElement>;
  guide?: string;
}) {
  return (
    <div className="portal-title" data-portal-component="title">
      {icon && <span className="portal-title-icon">{icon}</span>}
      <div>
        <h1 ref={headingRef} tabIndex={-1} id={id} data-guide={guide}>
          {title}
        </h1>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
}

export function PortalBreadcrumbs({ children }: { children: ReactNode }) {
  return <div className="portal-breadcrumbs">{children}</div>;
}

export type PortalColumn<Row> = {
  key: string;
  label: ReactNode;
  sort?: 'ascending' | 'descending' | 'none';
  onSort?: () => void;
  cell: (row: Row) => ReactNode;
};

export function PortalTable<Row extends { id: string }>({
  rows,
  columns,
  caption,
  empty,
  className,
}: {
  rows: readonly Row[];
  columns: readonly PortalColumn<Row>[];
  caption: ReactNode;
  empty?: ReactNode;
  className?: string;
}) {
  return (
    <div className="portal-table-scroll" tabIndex={0} data-portal-component="table">
      <table className={className}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" aria-sort={column.sort}>
                {column.onSort ? (
                  <button type="button" onClick={column.onSort}>
                    {column.label}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{column.cell(row)}</td>
              ))}
            </tr>
          ))}
          {!rows.length && empty && (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

type Choice = { id: string; name: string };
export function PortalListFilters({
  query,
  onQuery,
  subscription,
  onSubscription,
  subscriptions,
  kind,
  onKind,
  kinds,
  location,
  onLocation,
  locations,
}: {
  query: string;
  onQuery: (value: string) => void;
  subscription: string;
  onSubscription: (value: string) => void;
  subscriptions: readonly Choice[];
  kind?: string;
  onKind?: (value: string) => void;
  kinds?: readonly Choice[];
  location?: string;
  onLocation?: (value: string) => void;
  locations?: readonly Choice[];
}) {
  return (
    <div className="portal-list-filters">
      <label>
        {p.filter}
        <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} />
      </label>
      <label>
        {p.subscription}
        <select value={subscription} onChange={(e) => onSubscription(e.target.value)}>
          <option value="">{p.allSubscriptions}</option>
          {subscriptions.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.name}
            </option>
          ))}
        </select>
      </label>
      {onKind && (
        <label>
          {p.type}
          <select value={kind} onChange={(e) => onKind(e.target.value)}>
            <option value="">{p.allTypes}</option>
            {kinds?.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {onLocation && (
        <label>
          {nb.portalUi.location}
          <select value={location} onChange={(e) => onLocation(e.target.value)}>
            <option value="">{nb.portalUi.allLocations}</option>
            {locations?.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

export type ResourceMenuItem = {
  key: string;
  label: string;
  icon: string;
  active?: boolean;
  settings?: boolean;
  onSelect: () => void;
};

export function PortalResourceMenu({
  name,
  icon,
  items,
  learning,
  footer,
}: {
  name: string;
  icon: string;
  items: readonly ResourceMenuItem[];
  learning?: ReactNode;
  footer?: ReactNode;
}) {
  const [query, setQuery] = useState('');
  const filtered = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  const button = (item: ResourceMenuItem) => (
    <button
      key={item.key}
      type="button"
      aria-current={item.active ? 'page' : undefined}
      onClick={item.onSelect}
    >
      <ServiceIcon kind={item.icon} />
      {item.label}
    </button>
  );
  return (
    <nav
      className="portal-resource-menu"
      aria-label={`${name} · ${p.overview}`}
      data-portal-component="resource-menu"
    >
      <strong>
        <ServiceIcon kind={icon} />
        {name}
      </strong>
      <label className="portal-menu-search">
        <span className="sr-only">{nb.portalUi.resourceSearch}</span>
        <input
          type="search"
          placeholder={nb.portalUi.resourceSearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      {filtered.filter((item) => !item.settings).map(button)}
      <details open>
        <summary>{nb.portalUi.settings}</summary>
        {filtered.filter((item) => item.settings).map(button)}
      </details>
      {learning}
      {footer && <small>{footer}</small>}
    </nav>
  );
}

export function PortalResourceLayout({
  menu,
  contentRef,
  children,
}: {
  menu: ReactNode;
  contentRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div className="portal-resource-overview" data-portal-component="resource-layout">
      {menu}
      <div className="portal-resource-main" ref={contentRef} tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}

export function PortalCreateLayout({
  className = '',
  intro,
  title,
  children,
}: {
  className?: string;
  intro?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`portal-create ${className}`} data-portal-component="create">
      {title}
      {intro && <p>{intro}</p>}
      {children}
    </div>
  );
}

export function PortalCreateActions({ children }: { children: ReactNode }) {
  return <footer className="portal-create-footer">{children}</footer>;
}

export type PortalOperation = {
  commandId: string;
  operation: string;
  outcome: string;
  code: string;
  beforeRevision: number;
  afterRevision: number;
};

export function PortalOperationTable<Row extends PortalOperation>({
  receipts,
  onSelect,
  renderIdentity,
  operationLabel = (r) =>
    nb.chapter.operations[r.operation as keyof typeof nb.chapter.operations] ?? r.operation,
  outcomeLabel = (r) =>
    nb.chapter.outcomes[r.outcome as keyof typeof nb.chapter.outcomes] ?? r.outcome,
  caption = p.operations,
  empty = p.noOperations,
}: {
  receipts: readonly Row[];
  onSelect?: (receipt: Row) => void;
  renderIdentity?: (receipt: Row) => ReactNode;
  operationLabel?: (receipt: Row) => ReactNode;
  outcomeLabel?: (receipt: Row) => ReactNode;
  caption?: string;
  empty?: string;
}) {
  return (
    <>
      <PortalTable
        rows={receipts.map((receipt) => ({ receipt, id: receipt.commandId }))}
        caption={caption}
        columns={[
          {
            key: 'sequence',
            label: p.sequence,
            cell: (r) =>
              renderIdentity ? (
                renderIdentity(r.receipt)
              ) : (
                <button
                  type="button"
                  className="portal-resource-link"
                  onClick={() => onSelect?.(r.receipt)}
                >
                  {r.receipt.commandId}
                </button>
              ),
          },
          { key: 'operation', label: p.operation, cell: (r) => operationLabel(r.receipt) },
          {
            key: 'outcome',
            label: p.outcome,
            cell: (r) => (
              <>
                <span className={`portal-operation-${r.receipt.outcome}`}>
                  {outcomeLabel(r.receipt)}
                </span>
                <small>{r.receipt.code}</small>
              </>
            ),
          },
          {
            key: 'revision',
            label: p.revision,
            cell: (r) => `${r.receipt.beforeRevision} → ${r.receipt.afterRevision}`,
          },
        ]}
      />
      {!receipts.length && <p>{empty}</p>}
    </>
  );
}

export function PortalReceiptSummary({
  outcome,
  identity,
  title,
  description,
  notice,
  live,
  children,
  className = '',
}: {
  outcome: string;
  identity: ReactNode;
  title: ReactNode;
  description: ReactNode;
  notice?: ReactNode;
  live?: 'polite';
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`chapter-receipt receipt-${outcome} ${className}`}
      data-outcome={outcome}
      aria-live={live}
      data-portal-component="receipt"
    >
      <span className="eyebrow">{identity}</span>
      <h2>{title}</h2>
      {notice}
      <p className="receipt-cause">{description}</p>
      {children}
    </div>
  );
}
