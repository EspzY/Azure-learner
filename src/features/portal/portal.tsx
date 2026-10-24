'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Home,
  Boxes,
  Folder,
  Layers,
  AppWindow,
  Activity,
  Network,
  BookOpen,
  ShieldCheck,
  Plus,
  RefreshCw,
  ChevronRight,
  Compass,
  Database,
  GitBranch,
} from 'lucide-react';
import { nb, regionLabels } from '@/content/nb';
import { useChapter } from '@/features/chapter01/provider';
import { useLearning } from '@/features/learning/provider';
import { ReceiptPanel } from '@/features/chapter01/receipt-panel';
import {
  inventory,
  parseLocation,
  portalHref,
  requestFor,
  type CreateKind,
} from '@/domain/portal/model';
import type { Command, Receipt } from '@/domain/chapter01/model';
import { serviceSources } from '@/domain/portal/content';
import { PortalLearningProvider, usePortalLearning } from './learning-provider';
import { PortalDialog, PropertyList, type Navigate } from './shared';
import { ResourceTable, ResourceDetails } from './inventory';
import { CreateResource } from './create-resource';
import {
  LearningWorkspace,
  IndependentChallenge,
  ServiceReference,
  FoundationsReference,
} from './learning';
import { ResponsibilityExplorer } from './responsibility';
import { ArchitectureExplorer } from './architecture';
import './portal.css';
const p = nb.portal;
const services = ['subscriptions', 'groups', 'resources', 'apps', 'plans', 'activity'] as const;
const educational = ['learn', 'responsibility', 'hierarchy', 'architecture', 'challenge'] as const;
const icons = {
  home: Home,
  services: Boxes,
  subscriptions: Database,
  groups: Folder,
  resources: Boxes,
  apps: AppWindow,
  plans: Layers,
  activity: Activity,
  learn: BookOpen,
  responsibility: Layers,
  hierarchy: GitBranch,
  architecture: Network,
  challenge: Compass,
  policy: ShieldCheck,
  resource: Boxes,
  create: Plus,
};
export function Portal() {
  return (
    <PortalLearningProvider>
      <PortalWorkspace />
    </PortalLearningProvider>
  );
}
function PortalWorkspace() {
  const router = useRouter(),
    query = useSearchParams(),
    location = parseLocation(new URLSearchParams(query.toString()));
  const chapter = useChapter(),
    learning = useLearning(),
    module = usePortalLearning();
  const { world } = chapter.attempt.engine;
  const rows = inventory(world),
    [menu, setMenu] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [notification, setNotification] = useState(false),
    [help, setHelp] = useState(false),
    [resetConfirm, setResetConfirm] = useState(false),
    [resetModule, setResetModule] = useState(false),
    [reference, setReference] = useState(false),
    [pane, setPane] = useState(true),
    [width, setWidth] = useState(320),
    [recent, setRecent] = useState<string[]>(() =>
      location.area === 'resource' && location.id ? [location.id] : [],
    ),
    [search, setSearch] = useState('');
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = matchMedia('(max-width:800px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const heading = useRef<HTMLHeadingElement>(null),
    searchRef = useRef<HTMLInputElement>(null);
  const helpLearning = () => {
    if (module.facts.active) module.store.event({ kind: 'aid' });
  };
  // Address-bar entry and Back/Forward must classify the same displayed help as in-app navigation.
  useEffect(() => {
    if (!['learn', 'responsibility', 'hierarchy'].includes(location.area)) return;
    if (module.facts.active) module.store.event({ kind: 'aid' });
    if (
      learning.facts.active &&
      !(
        location.area === 'learn' &&
        location.module === 'computing' &&
        ['assessment', 'summary'].includes(location.topic)
      )
    )
      learning.store.event({ kind: 'aid' });
  }, [
    module.facts.active,
    module.store,
    learning.facts.active,
    learning.store,
    location.area,
    location.module,
    location.topic,
  ]);
  const navigate: Navigate = (area, change = {}) => {
    change = {
      ...change,
      ...(area === 'challenge'
        ? { mode: 'independent' as const }
        : area === 'learn'
          ? { mode: 'learn' as const }
          : {}),
    };
    if (area === 'resource' && change.id)
      setRecent((old) => [change.id!, ...old.filter((id) => id !== change.id)].slice(0, 8));
    if (['learn', 'responsibility', 'hierarchy'].includes(area)) {
      helpLearning();
      const target = { ...location, ...change };
      if (
        learning.facts.active &&
        !(
          area === 'learn' &&
          target.module === 'computing' &&
          ['assessment', 'summary'].includes(target.topic)
        )
      )
        learning.store.event({ kind: 'aid' });
    }
    setMenu(false);
    setSearch('');
    router.push(portalHref(location, area, change), { scroll: false });
  };
  const current = rows.find((r) => r.id === location.id),
    scope = world.scopes.find((s) => s.id === location.id);
  const title =
    location.area === 'create'
      ? p.createTitles[location.kind]
      : location.area === 'resource'
        ? (current?.name ??
          scope?.name ??
          (location.id === world.identity.id ? world.identity.name : p.noResource))
        : p.areas[location.area];
  useEffect(() => {
    heading.current?.focus();
  }, [location.area, location.id, location.kind, location.topic]);
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [menu]);
  const disabled =
    !chapter.ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(chapter.issue ?? '');
  const command = (value: Command) => {
    const snapshot = chapter.store.getSnapshot();
    const request = requestFor(snapshot.attempt.engine, value, snapshot.attempt.events.length + 1);
    if (chapter.store.dispatch({ kind: 'command', request, bindResult: false })) {
      const receipt = chapter.store.getSnapshot().attempt.responses.at(-1)!;
      navigate(receipt.outcome === 'accepted' ? 'resource' : 'activity', {
        id: receipt.outcome === 'accepted' ? (receipt.addedIds[0] ?? '') : receipt.commandId,
      });
    }
  };
  const receipt = chapter.attempt.engine.ledger.find(
    (e) => e.request.commandId === location.id,
  )?.receipt;
  const edit = (r: Receipt) => {
    const cmd = chapter.attempt.engine.ledger.find((e) => e.request.commandId === r.commandId)
      ?.request.command;
    const kind =
      cmd?.type === 'CreateGroup' ? 'group' : cmd?.type === 'CreatePlan' ? 'plan' : 'app';
    navigate('create', { kind, edit: r.commandId });
  };
  const searchItems = useMemo(
    () =>
      [
        ...(['home', 'services', ...services, ...educational, 'policy'] as const).map((area) => ({
          id: area,
          label: p.areas[area],
          category: p.serviceHint,
          area,
          idValue: '',
        })),
        ...rows.map((r) => ({
          id: r.id,
          label: `${r.name} · ${p.graph.types[r.kind]}`,
          category: p.resources,
          area: 'resource' as const,
          idValue: r.id,
        })),
      ]
        .filter((i) => `${i.label} ${i.id}`.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 14),
    [rows, search],
  );
  const createKind: CreateKind =
    current?.kind === 'plan'
      ? 'app'
      : current?.kind === 'group'
        ? 'plan'
        : location.area === 'plans'
          ? 'plan'
          : location.area === 'apps'
            ? 'app'
            : 'group';
  const startCreate = (kind: CreateKind = createKind) =>
    navigate('create', {
      kind,
      id: current && ['group', 'subscription', 'plan'].includes(current.kind) ? current.id : '',
    });
  const commands = (
    <div className="portal-commandbar">
      {(['groups', 'plans', 'apps', 'resources'].includes(location.area) ||
        (location.area === 'resource' && current && current.kind !== 'app')) && (
        <button type="button" onClick={() => startCreate()}>
          <Plus size={16} />
          {p.create}
        </button>
      )}
      {location.area === 'home' && (
        <button type="button" onClick={() => navigate('services')}>
          <Plus size={16} />
          {p.areas.create}
        </button>
      )}
      <button type="button" onClick={() => chapter.store.load()}>
        <RefreshCw size={15} />
        {p.refresh}
      </button>
      <button type="button" onClick={() => navigate('architecture', { id: location.id })}>
        <Network size={15} />
        {p.areas.architecture}
      </button>
      <button type="button" onClick={() => navigate('learn')}>
        <BookOpen size={15} />
        {p.returnLearning}
      </button>
    </div>
  );
  return (
    <div
      className={`portal ${collapsed ? 'portal-collapsed' : ''}`}
      style={{ '--teaching-width': `${width}px` } as React.CSSProperties}
    >
      <a className="portal-skip" href="#portal-main">
        {nb.shell.skip}
      </a>
      <header className="portal-header">
        <button
          type="button"
          aria-label={p.menu}
          aria-expanded={narrow ? menu : !collapsed}
          onClick={() => {
            if (narrow) setMenu(!menu);
            else setCollapsed(!collapsed);
          }}
        >
          <Menu size={20} />
        </button>
        <a
          href="/portal"
          onClick={(e) => {
            e.preventDefault();
            navigate('home');
          }}
          className="portal-brand"
        >
          {p.brand} <small>{p.version}</small>
        </a>
        <div className="portal-search">
          <Search size={17} />
          <input
            ref={searchRef}
            type="search"
            aria-label={p.search}
            placeholder={p.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearch('');
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                document.querySelector<HTMLAnchorElement>('.portal-search-results a')?.focus();
              }
            }}
          />
          {search && (
            <div className="portal-search-results" aria-label={p.searchResults}>
              <strong>{p.searchResults}</strong>
              {searchItems.map((item) => (
                <a
                  key={item.id}
                  href={portalHref(location, item.area, { id: item.idValue })}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.area, { id: item.idValue });
                  }}
                >
                  <small>{item.category}</small>
                  {item.label}
                </a>
              ))}
              {Object.entries(serviceSources)
                .filter(([id]) =>
                  `${id} ${p.referenceTitles[id as keyof typeof p.referenceTitles]}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map(([id, record]) => (
                  <a
                    key={id}
                    href={record.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={helpLearning}
                  >
                    <small>{p.source}</small>
                    {p.referenceTitles[id as keyof typeof p.referenceTitles]} ↗
                  </a>
                ))}
              {!searchItems.length &&
                !Object.keys(serviceSources).some((id) =>
                  `${id} ${p.referenceTitles[id as keyof typeof p.referenceTitles]}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                ) && <p>{p.noResults}</p>}
            </div>
          )}
        </div>
        <span className="portal-simulation">{p.simulation}</span>
        <button
          type="button"
          className="portal-notifications"
          onClick={() => setNotification(true)}
        >
          <Bell size={19} />
          <span>
            {p.notifications} ({chapter.attempt.engine.ledger.length})
          </span>
        </button>
        <button type="button" aria-label={p.limitations} onClick={() => setHelp(true)}>
          <HelpCircle size={19} />
        </button>
        <button
          type="button"
          aria-label={p.journal}
          onClick={() => {
            helpLearning();
            if (learning.facts.active) learning.store.event({ kind: 'aid' });
            setReference(true);
          }}
        >
          <BookOpen size={19} />
        </button>
      </header>
      <div className="portal-body">
        <aside className={`portal-nav ${menu ? 'mobile-open' : ''}`} aria-label={p.navLabel}>
          <nav aria-label={p.navLabel}>
            {(['home', 'services'] as const).map((area) => {
              const Icon = icons[area];
              return (
                <a
                  key={area}
                  href={portalHref(location, area)}
                  aria-current={location.area === area ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(area);
                  }}
                >
                  <Icon size={17} />
                  {p.areas[area]}
                </a>
              );
            })}
            <span>{p.favourites}</span>
            {services.map((area) => {
              const Icon = icons[area];
              return (
                <a
                  key={area}
                  href={portalHref(location, area)}
                  aria-current={location.area === area ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(area);
                  }}
                >
                  <Icon size={17} />
                  {p.areas[area]}
                </a>
              );
            })}
            <span>{p.understand}</span>
            {educational.map((area) => {
              const Icon = icons[area];
              return (
                <a
                  key={area}
                  href={portalHref(location, area)}
                  aria-current={location.area === area ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(area);
                  }}
                >
                  <Icon size={17} />
                  {p.areas[area]}
                </a>
              );
            })}
          </nav>
          <small>{p.environment}</small>
        </aside>
        <main className="portal-working" id="portal-main" aria-labelledby="portal-page-title">
          <div className="portal-breadcrumbs">
            <button type="button" onClick={() => navigate('home')}>
              {p.areas.home}
            </button>
            <ChevronRight size={12} />
            <button
              type="button"
              onClick={() =>
                navigate(
                  location.area === 'resource'
                    ? current?.kind === 'app'
                      ? 'apps'
                      : current?.kind === 'plan'
                        ? 'plans'
                        : current?.kind === 'subscription'
                          ? 'subscriptions'
                          : 'groups'
                    : location.area,
                )
              }
            >
              {p.areas[location.area === 'resource' ? 'resources' : location.area]}
            </button>
            {location.area === 'resource' && (
              <>
                <ChevronRight size={12} />
                <span>{title}</span>
              </>
            )}
          </div>
          <div className="portal-title">
            <span className="portal-title-icon">
              {(() => {
                const Icon = icons[location.area];
                return <Icon size={26} />;
              })()}
            </span>
            <div>
              <h1 ref={heading} tabIndex={-1} id="portal-page-title">
                {title}
              </h1>
              <small>
                {location.area === 'learn' ? nb.official.path : `${p.directory} · ${p.environment}`}
              </small>
            </div>
          </div>
          {commands}
          <div className="portal-training-strip">
            <span className={`mode-${module.facts.active ? 'independent' : location.mode}`}>
              {p.modes[module.facts.active ? 'independent' : location.mode]}
            </span>
            <span>
              {location.module === 'computing' ? nb.official.computing : nb.official.services}
            </span>
            {module.facts.active ? (
              <button type="button" onClick={() => navigate('challenge', { mode: 'independent' })}>
                {p.continueChallenge}
              </button>
            ) : (
              <button type="button" onClick={() => navigate('learn')}>
                {p.returnLearning}
              </button>
            )}
            {location.mode === 'guided' && !module.facts.active && (
              <button type="button" onClick={() => setPane(!pane)}>
                {pane ? p.hidePane : p.showPane}
              </button>
            )}
          </div>
          {(chapter.issue || module.issue) && (
            <div role="status" className="portal-storage">
              <p>
                {p.storage} {chapter.issue ?? module.issue}
              </p>
              <button
                type="button"
                onClick={() => {
                  chapter.store.load();
                  module.store.load();
                }}
              >
                {p.reload}
              </button>
              {module.issue && (
                <button type="button" onClick={() => setResetModule(true)}>
                  {p.resetModule}
                </button>
              )}
              {resetModule && (
                <section>
                  <p>{p.resetConfirm}</p>
                  <button
                    type="button"
                    onClick={() => {
                      module.store.clear();
                      setResetModule(false);
                    }}
                  >
                    {p.confirmModuleReset}
                  </button>
                </section>
              )}
            </div>
          )}
          <div
            className={`portal-content ${location.mode === 'guided' && pane && !module.facts.active && !['learn', 'challenge', 'architecture', 'hierarchy'].includes(location.area) ? 'with-teaching' : ''}`}
          >
            <div className="portal-view">
              {location.area === 'home' ? (
                <>
                  <h2>{p.services}</h2>
                  <div className="portal-home-services">
                    {services.map((area) => {
                      const Icon = icons[area];
                      return (
                        <button key={area} type="button" onClick={() => navigate(area)}>
                          <Icon size={31} />
                          <span>{p.areas[area]}</span>
                        </button>
                      );
                    })}
                  </div>
                  <section className="portal-home-training">
                    <BookOpen size={25} />
                    <div>
                      <h2>{nb.official.services}</h2>
                      <p>{p.homeIntro}</p>
                      <small>
                        {nb.official.certification} · {nb.official.path}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="primary"
                      onClick={() => navigate(module.facts.active ? 'challenge' : 'learn')}
                    >
                      {module.facts.active ? p.continueChallenge : p.startLearning}
                    </button>
                  </section>
                  <h2>{p.recent}</h2>
                  <p>{p.recentHint}</p>
                  {recent.length ? (
                    <ResourceTable
                      world={world}
                      navigate={navigate}
                      rows={rows
                        .filter((r) => recent.includes(r.id))
                        .sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id))}
                    />
                  ) : (
                    <p className="portal-empty">{p.noRecent}</p>
                  )}
                </>
              ) : location.area === 'services' ? (
                <>
                  <p>{p.serviceHint}</p>
                  <div className="portal-services-index">
                    {[...services, ...educational, 'policy' as const].map((area) => {
                      const Icon = icons[area];
                      return (
                        <button key={area} type="button" onClick={() => navigate(area)}>
                          <Icon size={22} />
                          <span>{p.areas[area]}</span>
                          <ChevronRight size={14} />
                        </button>
                      );
                    })}
                  </div>
                  <h2>{p.unavailable}</h2>
                  <p>{p.unavailableServices}</p>
                </>
              ) : ['subscriptions', 'groups', 'resources', 'apps', 'plans'].includes(
                  location.area,
                ) ? (
                <ResourceTable
                  key={location.area}
                  world={world}
                  navigate={navigate}
                  area={location.area}
                />
              ) : location.area === 'create' ? (
                <CreateResource
                  key={`${location.kind}-${location.edit}-${location.id}`}
                  engine={chapter.attempt.engine}
                  location={location}
                  sequence={chapter.attempt.events.length + 1}
                  disabled={disabled}
                  onCreate={command}
                  navigate={navigate}
                />
              ) : location.area === 'resource' ? (
                <ResourceDetails world={world} id={location.id} navigate={navigate} />
              ) : location.area === 'learn' ? (
                <LearningWorkspace location={location} navigate={navigate} />
              ) : location.area === 'challenge' ? (
                <IndependentChallenge navigate={navigate} />
              ) : location.area === 'responsibility' ? (
                <>
                  <h2>{p.responsibility.title}</h2>
                  <ResponsibilityExplorer />
                </>
              ) : location.area === 'architecture' || location.area === 'hierarchy' ? (
                <ArchitectureExplorer
                  key={location.area}
                  world={world}
                  initialSelection={location.id}
                  lens={location.area === 'hierarchy' ? 'hierarchy' : 'architecture'}
                  navigate={navigate}
                />
              ) : location.area === 'policy' ? (
                <>
                  <h2>{nb.chapter.customPolicy}</h2>
                  {world.policies.map((policy) => (
                    <section key={policy.id}>
                      <PropertyList
                        items={[
                          [p.name, policy.id],
                          [p.scope, world.scopes.find((s) => s.id === policy.scopeId)?.name],
                          [p.type, policy.targetTypes.join(', ')],
                          [
                            p.resourceLocation,
                            policy.allowedLocations.map((r) => regionLabels[r]).join(', '),
                          ],
                        ]}
                      />
                      <p>{p.graph.explanations['policy-scope']}</p>
                      <button
                        type="button"
                        onClick={() => navigate('architecture', { id: policy.id })}
                      >
                        {p.viewArchitecture}
                      </button>
                    </section>
                  ))}
                </>
              ) : (
                <>
                  <OperationTable
                    receipts={chapter.attempt.engine.ledger.map((e) => e.receipt)}
                    onSelect={(r) => navigate('activity', { id: r.commandId })}
                  />
                  {receipt && (
                    <ReceiptPanel
                      receipt={receipt}
                      onPolicy={() => navigate('policy')}
                      onEdit={() => edit(receipt)}
                    />
                  )}
                </>
              )}
            </div>
            {location.mode === 'guided' &&
              pane &&
              !module.facts.active &&
              !['learn', 'challenge', 'architecture', 'hierarchy'].includes(location.area) && (
                <aside className="portal-teaching-pane" aria-label={p.guidedBrief}>
                  <span>{p.modes.guided}</span>
                  <h2>{p.training}</h2>
                  <p>{p.guidedBrief}</p>
                  <ol>
                    {p.guidedSteps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  <button type="button" onClick={() => navigate('learn', { topic: 'practice' })}>
                    {p.focusLearning}
                  </button>
                  <label>
                    {p.paneWidth}
                    <input
                      type="range"
                      min={280}
                      max={460}
                      step={20}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                    />
                  </label>
                </aside>
              )}
          </div>
          <footer className="portal-footer">{p.boundary}</footer>
        </main>
      </div>
      {notification && (
        <PortalDialog title={p.notifications} onClose={() => setNotification(false)}>
          <p>{p.notificationCount}</p>
          <OperationTable
            receipts={chapter.attempt.engine.ledger
              .map((e) => e.receipt)
              .slice(-12)
              .reverse()}
            onSelect={(r) => {
              setNotification(false);
              navigate('activity', { id: r.commandId });
            }}
          />
        </PortalDialog>
      )}
      {reference && (
        <PortalDialog title={p.journal} onClose={() => setReference(false)}>
          {location.module === 'computing' ? (
            <FoundationsReference topic={location.topic} />
          ) : (
            <ServiceReference topic={location.topic} />
          )}
        </PortalDialog>
      )}
      {help && (
        <PortalDialog title={p.limitations} onClose={() => setHelp(false)}>
          <p>{p.technicalLimits}</p>
          <p>{p.unavailableServices}</p>
          <p>{p.boundary}</p>
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([chapter.store.exportSnapshot()], { type: 'application/json' }),
              );
              const link = document.createElement('a');
              link.href = url;
              link.download = 'azurelab-technical-attempt.json';
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            {p.exportTechnical}
          </button>
          <button type="button" onClick={() => setResetConfirm(true)}>
            {p.resetTechnical}
          </button>
          {resetConfirm && (
            <section>
              <p>{p.resetWarning}</p>
              <button
                type="button"
                disabled={!chapter.ready || chapter.issue === 'conflict'}
                onClick={() => {
                  if (module.facts.active) module.store.event({ kind: 'abandon' });
                  if (chapter.store.restart()) {
                    setHelp(false);
                    setResetConfirm(false);
                    navigate('resources');
                  }
                }}
              >
                {p.confirmReset}
              </button>
            </section>
          )}
        </PortalDialog>
      )}
    </div>
  );
}
function OperationTable({
  receipts,
  onSelect,
}: {
  receipts: Receipt[];
  onSelect: (receipt: Receipt) => void;
}) {
  return (
    <div className="portal-table-scroll" tabIndex={0}>
      <table>
        <caption>{p.operations}</caption>
        <thead>
          <tr>
            <th scope="col">{p.sequence}</th>
            <th scope="col">{p.operation}</th>
            <th scope="col">{p.outcome}</th>
            <th scope="col">{p.revision}</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((r) => (
            <tr key={r.commandId}>
              <td>
                <button type="button" className="portal-resource-link" onClick={() => onSelect(r)}>
                  {r.commandId}
                </button>
              </td>
              <td>
                {nb.chapter.operations[r.operation as keyof typeof nb.chapter.operations] ??
                  r.operation}
              </td>
              <td>
                <span className={`portal-operation-${r.outcome}`}>
                  {nb.chapter.outcomes[r.outcome]}
                </span>
                <small>{r.code}</small>
              </td>
              <td>
                {r.beforeRevision} → {r.afterRevision}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!receipts.length && <p>{p.noOperations}</p>}
    </div>
  );
}
