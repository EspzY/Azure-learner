'use client';
import { useStorage } from '@/features/learning/storage-provider';
import { useConnectivity } from '@/features/learning/connectivity-provider';
import { networkingNb } from '@/content/nb';
import { networkingHref } from '@/domain/curriculum/networking';
import { useNetworking } from '@/features/learning/networking-provider';
import { NetworkingPortalMission } from '@/features/learning/networking-inspection';

import { architectureNb, managementNb, computeNb } from '@/content/nb';
import { computeHref } from '@/domain/curriculum/compute';
import { missionsNb } from '@/content/nb';
import { useMissions } from '@/features/course/mission-provider';
import { MissionRecovery } from '@/features/course/missions';
import { MissionPortalLayer } from '@/features/course/mission-portal';
import { missionOrigin } from '@/domain/sandbox/missions';
import { useManagement } from '@/features/learning/management-provider';
import { useTransfer } from '@/features/learning/transfer-provider';
import { useCompute } from '@/features/learning/compute-provider';
import { ComputePortalMission } from '@/features/learning/compute-vm';
import { useCost } from '@/features/learning/cost-provider';
import { usePhysical } from '@/features/learning/physical-provider';
import { ManagementRecovery } from '@/features/learning/management-recovery';
import { ManagementTeachingBoundary } from '@/features/learning/management-access';
import { PhysicalRecovery } from '@/features/learning/physical-recovery';

import { useServerless } from '@/features/learning/serverless-provider';
import { ServerlessRecovery } from '@/features/learning/serverless-recovery';
import {
  PracticalCoach,
  PracticalOutcome,
  PracticalAssistance,
} from '@/features/course/practical-lab';
import { ServiceIcon } from './service-icon';
import { VmForm, type VmFormView } from './vm-form';
import { AppSettings } from './app-settings';
import { InfrastructureDetails } from './infrastructure-details';
import { usePractical } from '@/features/course/practical-provider';
import { GuidanceMilestones } from '@/features/course/guidance-milestones';
import { useFoundationsV2 } from '@/features/learning/v2-provider';
import { practicalReturn } from '@/domain/sandbox/practical';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { labsNb, nb, regionLabels, learningPolishNb as polish } from '@/content/nb';
import { useSandbox as useChapter } from '@/features/portal/sandbox-provider';
import { useLearning } from '@/features/learning/provider';
import { ReceiptPanel } from './receipt-panel';
import {
  inventory,
  parseLocation,
  portalHref,
  requestFor,
  type CreateKind,
} from '@/domain/portal/model';
import type { Command, Receipt } from '@/domain/sandbox/model';
import { serviceSources } from '@/domain/portal/content';
import { usePortalLearning } from './learning-provider';
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
import { useCourse } from '@/features/course/provider';
import { courseHref, courseLabHref, labFacts, startLab, type LabForm } from '@/domain/course/model';
import { GuidedCoach } from '@/features/course/guided-coach';
import Link from 'next/link';
import { useExpansion, ExpansionAssistance } from '@/features/learning/expansion-provider';
const p = nb.portal;
const services = [
  'subscriptions',
  'groups',
  'resources',
  'apps',
  'plans',
  'vms',
  'activity',
] as const;
const educational = ['learn', 'responsibility', 'hierarchy', 'architecture', 'challenge'] as const;
export function Portal() {
  return <PortalWorkspace />;
}
function PortalWorkspace() {
  const router = useRouter(),
    query = useSearchParams(),
    location = parseLocation(new URLSearchParams(query.toString()));
  const chapter = useChapter(),
    learning = useLearning(),
    module = usePortalLearning();
  const course = useCourse(),
    practical = usePractical(),
    missions = useMissions();
  const benefits = useExpansion('benefits'),
    services2 = useExpansion('services');
  const foundationsV2 = useFoundationsV2(),
    serverless = useServerless(),
    physical = usePhysical(),
    management = useManagement(),
    transfer = useTransfer(),
    cost = useCost(),
    compute = useCompute(),
    networking = useNetworking(),
    connectivity = useConnectivity(),
    storage = useStorage();
  useEffect(() => {
    if (serverless.facts.active && ['learn', 'responsibility', 'hierarchy'].includes(location.area))
      serverless.store.event({ kind: 'aid' });
  }, [
    serverless.facts.active,
    serverless.ready,
    serverless.issue,
    serverless.store,
    location.area,
  ]);
  useEffect(() => {
    if (physical.facts.active && ['learn', 'responsibility', 'hierarchy'].includes(location.area))
      physical.store.event({ kind: 'aid' });
  }, [physical.facts.active, physical.ready, physical.issue, physical.store, location.area]);
  useEffect(() => {
    if (
      management.facts.active &&
      ['learn', 'responsibility', 'hierarchy', 'architecture', 'policy'].includes(location.area)
    )
      management.store.event({ kind: 'aid' });
  }, [
    management.facts.active,
    management.ready,
    management.issue,
    management.store,
    location.area,
  ]);
  const otherIndependentContext =
    storage.facts.active ||
    connectivity.facts.active ||
    networking.facts.active ||
    compute.facts.active ||
    cost.facts.active ||
    transfer.facts.active ||
    location.mode === 'independent' ||
    management.facts.active ||
    physical.facts.active ||
    serverless.facts.active ||
    practical.activeIndependent ||
    learning.facts.active ||
    foundationsV2.facts.active ||
    module.facts.active ||
    benefits.facts.active ||
    services2.facts.active;
  const independentContext = otherIndependentContext || missions.active;
  const guidanceContexts = [
    storage,
    connectivity,
    compute,
    networking,
    cost,
    transfer,
    missions,
    physical,
    management,
    serverless,
    learning,
    foundationsV2,
    module,
    benefits,
    services2,
    practical,
    chapter,
    course,
  ];
  const contextIssue = guidanceContexts.some((c) => c.ready && c.issue !== null);
  const guidanceSuppressed =
    independentContext || contextIssue || guidanceContexts.some((c) => !c.ready);
  const [vmForm, setVmForm] = useState<VmFormView | null>(null);
  const [labForm, setLabForm] = useState<LabForm | null>(null);
  const guidedLab =
    !!location.lab &&
    course.ready &&
    module.ready &&
    benefits.ready &&
    services2.ready &&
    !!course.save.lab &&
    !practical.activeIndependent &&
    !module.facts.active &&
    !benefits.facts.active &&
    !services2.facts.active;
  const managementLab = guidedLab && course.save.lab?.origin === 'architecture-management';
  const courseReturn = location.networking
    ? networkingHref('dependencies')
    : location.compute
      ? computeHref('dependencies')
      : location.mission
        ? missionOrigin(location.mission)
        : location.bridge
          ? `/learn/benefits?topic=${location.bridge}&activity=practical`
          : location.practice && practical.current
            ? practicalReturn(practical.current)
            : guidedLab
              ? courseLabHref(
                  labFacts(course.save.lab, chapter.attempt.engine, chapter.attemptNumber).complete,
                  course.save.lab?.origin,
                )
              : location.course
                ? courseHref(location.module, location.topic)
                : '/learn';
  const returnLearning = () =>
    location.networking ||
    location.compute ||
    location.mission ||
    location.bridge ||
    location.practice ||
    guidedLab ||
    location.course
      ? router.push(courseReturn)
      : navigate('learn');
  const practicalMission =
    location.practice && practical.current ? labsNb.lab[practical.current.kind] : null;
  const { world } = chapter.attempt.engine;
  const rows = inventory(world),
    [menu, setMenu] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [flyout, setFlyout] = useState(false),
    [appearance, setAppearance] = useState(false),
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
    const media = matchMedia('(max-width:1100px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const heading = useRef<HTMLHeadingElement>(null),
    searchRef = useRef<HTMLInputElement>(null);
  const helpLearning = () => {
    if (practical.activeIndependent) practical.store.event({ type: 'aid' });
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
  const resourceArea =
    current?.kind === 'vm'
      ? 'vms'
      : current?.kind === 'app'
        ? 'apps'
        : current?.kind === 'plan'
          ? 'plans'
          : current?.kind === 'subscription'
            ? 'subscriptions'
            : current?.kind === 'group'
              ? 'groups'
              : 'resources';
  const title =
    location.area === 'create'
      ? p.createTitles[location.kind]
      : location.area === 'resource'
        ? (current?.name ??
          scope?.name ??
          (location.id === world.identity.id ? world.identity.name : p.noResource))
        : p.areas[location.area];
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    // This workspace owns the page. Restore its breadcrumb/title together below the sticky header.
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      const showResource = receipt.outcome === 'accepted' && receipt.code !== 'deleted';
      navigate(showResource ? 'resource' : 'activity', {
        id: showResource
          ? (receipt.addedIds[0] ??
            (typeof value === 'object' && 'appId' in value ? value.appId : ''))
          : receipt.commandId,
      });
      return true;
    }
    return false;
  };
  const receiptEntry = chapter.attempt.engine.ledger.find(
    (e) => e.request.commandId === location.id,
  );
  const receipt = receiptEntry?.receipt;
  const updatedAppId = receiptEntry?.request.command.appId;
  const receiptResourceId =
    receipt?.outcome === 'accepted'
      ? (receipt.addedIds.find((id) => rows.some((r) => r.id === id)) ??
        (typeof updatedAppId === 'string' ? updatedAppId : ''))
      : '';
  const edit = (r: Receipt) => {
    const cmd = chapter.attempt.engine.ledger.find((e) => e.request.commandId === r.commandId)
      ?.request.command;
    if (cmd?.type === 'SetAppSettings' && typeof cmd.appId === 'string') {
      navigate('settings', { id: cmd.appId });
      return;
    }
    const kind =
      cmd?.type === 'CreateGroup'
        ? 'group'
        : cmd?.type === 'CreatePlan'
          ? 'plan'
          : cmd?.type === 'CreateVmBundle'
            ? 'vm'
            : 'app';
    navigate('create', { kind, edit: r.commandId });
  };
  const searchItems = useMemo(
    () =>
      [
        ...(['home', 'services', ...services, ...educational, 'policy'] as const).map((area) => ({
          id: area,
          label: p.areas[area],
          category: nb.portalUi.services,
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
    location.area === 'vms' || current?.kind === 'vm'
      ? 'vm'
      : current?.kind === 'plan'
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
      {(['groups', 'plans', 'apps', 'vms', 'resources'].includes(location.area) ||
        (location.area === 'resource' &&
          current &&
          ['group', 'subscription', 'plan'].includes(current.kind))) && (
        <button type="button" data-guide="create" onClick={() => startCreate()}>
          <ServiceIcon kind="create" size={16} />
          {p.create}
        </button>
      )}
      {location.area === 'home' && (
        <button type="button" onClick={() => navigate('services')}>
          <ServiceIcon kind="create" size={16} />
          {p.areas.create}
        </button>
      )}
      <button type="button" onClick={() => chapter.store.load()}>
        <ServiceIcon kind="refresh" size={15} />
        {p.refresh}
      </button>
    </div>
  );
  return (
    <div
      data-training={
        guidedLab || location.practice || independentContext || location.bridge
          ? 'learning'
          : 'free'
      }
      data-area={location.area}
      className={`portal ${flyout ? 'portal-flyout' : ''} ${collapsed ? 'portal-collapsed' : ''} ${location.practice && practical.activeIndependent ? 'portal-practical-independent' : ''} ${location.mission || guidedLab || (location.practice && practical.current?.mode === 'guided') ? 'portal-guided-lab' : ''}`}
      style={{ '--teaching-width': `${width}px` } as React.CSSProperties}
    >
      <ExpansionAssistance />
      <PracticalAssistance />
      <a className="portal-skip" href="#portal-main">
        {nb.shell.skip}
      </a>
      <header className="portal-header">
        <button
          type="button"
          aria-label={p.menu}
          aria-expanded={narrow || flyout ? menu : !collapsed}
          onClick={() => {
            if (narrow || flyout) setMenu(!menu);
            else setCollapsed(!collapsed);
          }}
        >
          <ServiceIcon kind="menu" size={20} />
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
        <div
          className="portal-search"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearch('');
              searchRef.current?.focus();
            }
            if (e.target !== searchRef.current && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
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
            data-guide="search"
            ref={searchRef}
            type="search"
            aria-label={p.search}
            placeholder={p.searchPlaceholder}
            aria-controls={search ? 'portal-search-results' : undefined}
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
            <div
              id="portal-search-results"
              className="portal-search-results"
              aria-label={p.searchResults}
            >
              <strong>{p.searchResults}</strong>
              {[nb.portalUi.services, p.resources].map(
                (category) =>
                  searchItems.some((item) => item.category === category) && (
                    <div className="portal-search-group" key={category}>
                      <strong>{category}</strong>
                      {searchItems
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <a
                            key={item.id}
                            href={portalHref(location, item.area, { id: item.idValue })}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(item.area, { id: item.idValue });
                            }}
                          >
                            <ServiceIcon
                              kind={
                                item.area === 'resource'
                                  ? (rows.find((r) => r.id === item.idValue)?.kind ?? 'resources')
                                  : item.area
                              }
                            />
                            {item.label}
                          </a>
                        ))}
                    </div>
                  ),
              )}
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
                    <small>{nb.portalUi.documentation}</small>
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
        <span className="portal-simulation">{nb.portalUi.training}</span>
        <button
          type="button"
          className="portal-notifications"
          onClick={() => setNotification(true)}
        >
          <ServiceIcon kind="notifications" size={19} />
          <span className="sr-only">
            {p.notifications} ({chapter.attempt.engine.ledger.length})
          </span>
          {chapter.attempt.engine.ledger.length > 0 && (
            <i className="portal-notification-count" aria-hidden="true">
              {chapter.attempt.engine.ledger.length}
            </i>
          )}
        </button>
        <button
          type="button"
          aria-label={nb.portalUi.appearance}
          onClick={() => setAppearance(true)}
        >
          <ServiceIcon kind="settings" size={17} />
        </button>
        <button type="button" aria-label={p.limitations} onClick={() => setHelp(true)}>
          <ServiceIcon kind="help" size={17} />
        </button>
        <button
          type="button"
          aria-label={p.journal}
          onClick={() => {
            if (!management.store.prepareTeaching()) return;
            helpLearning();
            if (learning.facts.active) learning.store.event({ kind: 'aid' });
            if (serverless.facts.active) serverless.store.event({ kind: 'aid' });
            if (physical.facts.active) physical.store.event({ kind: 'aid' });
            if (management.facts.active) management.store.event({ kind: 'aid' });
            setReference(true);
          }}
        >
          <ServiceIcon kind="learn" size={19} />
        </button>
      </header>
      <div className="portal-body">
        <aside className={`portal-nav ${menu ? 'mobile-open' : ''}`} aria-label={p.navLabel}>
          <nav aria-label={p.navLabel}>
            <a
              href={portalHref(location, 'services')}
              onClick={(e) => {
                e.preventDefault();
                navigate('services');
              }}
            >
              <ServiceIcon kind="create" size={17} />
              {nb.portalUi.create}
            </a>
            {(['home', 'services'] as const).map((area) => {
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
                  <ServiceIcon kind={area} size={17} />
                  {p.areas[area]}
                </a>
              );
            })}
            <span className="portal-nav-category">
              <ServiceIcon kind="favorite" size={12} />
              {nb.portalUi.favorites}
            </span>
            {services.map((area) => {
              return (
                <a
                  key={area}
                  data-guide={area === 'groups' ? 'groups' : undefined}
                  href={portalHref(location, area)}
                  aria-current={
                    location.area === area ||
                    ((location.area === 'resource' || location.area === 'settings') &&
                      resourceArea === area)
                      ? 'page'
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(area);
                  }}
                >
                  <ServiceIcon kind={area} size={17} />
                  {p.areas[area]}
                </a>
              );
            })}
            <details
              className="portal-learning-tools"
              open={
                !!location.practice ||
                !!location.lab ||
                educational.some((a) => a === location.area)
              }
            >
              <summary>
                <ServiceIcon kind="learn" size={14} />
                {nb.portalUi.learningTools}
              </summary>
              {educational.map((area) => {
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
                    <ServiceIcon kind={area} size={17} />
                    {p.areas[area]}
                  </a>
                );
              })}
            </details>
          </nav>
          <small>{p.environment}</small>
        </aside>
        <main className="portal-working" id="portal-main" aria-labelledby="portal-page-title">
          <div className="portal-breadcrumbs">
            <button type="button" onClick={() => navigate('home')}>
              {p.areas.home}
            </button>
            <ServiceIcon kind="next" size={12} />
            <button
              type="button"
              onClick={() =>
                navigate(
                  ['resource', 'settings'].includes(location.area) ? resourceArea : location.area,
                )
              }
            >
              {
                p.areas[
                  ['resource', 'settings'].includes(location.area) ? resourceArea : location.area
                ]
              }
            </button>
            {['resource', 'settings'].includes(location.area) && (
              <>
                <ServiceIcon kind="next" size={12} />
                {location.area === 'settings' && (
                  <>
                    <button type="button" onClick={() => navigate('resource', { id: location.id })}>
                      {current?.name}
                    </button>
                    <ServiceIcon kind="next" size={12} />
                  </>
                )}
                <span>{title}</span>
              </>
            )}
          </div>
          <div className="portal-title">
            <span className="portal-title-icon">
              {(() => {
                if (location.area === 'resource' || location.area === 'settings')
                  return (
                    <ServiceIcon
                      kind={
                        current?.kind ??
                        scope?.kind ??
                        (location.id === world.identity.id ? 'tenant' : 'resources')
                      }
                      size={28}
                    />
                  );
                if (location.area === 'create')
                  return <ServiceIcon kind={location.kind} size={28} />;
                return <ServiceIcon kind={location.area} size={28} />;
              })()}
            </span>
            <div>
              <h1
                ref={heading}
                tabIndex={-1}
                id="portal-page-title"
                data-guide={location.area === 'resource' ? 'resource' : undefined}
              >
                {title}
              </h1>
              <small>
                {['resource', 'settings'].includes(location.area) &&
                  current &&
                  `${p.graph.types[current.kind]} · `}
                {location.area === 'learn' ? nb.official.path : `${p.directory} · ${p.environment}`}
              </small>
            </div>
          </div>
          {!['resource', 'settings', 'create'].includes(location.area) && commands}
          <div className="portal-training-strip">
            <span className={`mode-${independentContext ? 'independent' : location.mode}`}>
              {independentContext
                ? p.modes.independent
                : location.networking && networking.facts.guide?.mission === 'inspect'
                  ? nb.course.guided
                  : location.compute && compute.facts.guide?.mission === 'vm'
                    ? nb.course.guided
                    : location.mission && missions.current
                      ? missions.current.mode === 'guided'
                        ? missionsNb.guided
                        : missionsNb.independent
                      : location.bridge
                        ? labsNb.bridge.mode
                        : location.practice && practical.current
                          ? practical.current.mode === 'guided'
                            ? labsNb.guided
                            : labsNb.independent
                          : guidedLab
                            ? nb.course.guided
                            : location.mode === 'learn' &&
                                !['learn', 'responsibility', 'hierarchy', 'challenge'].includes(
                                  location.area,
                                )
                              ? nb.course.free
                              : p.modes[location.mode]}
            </span>
            <span
              hidden={
                !location.networking &&
                !location.compute &&
                !location.mission &&
                !location.bridge &&
                !location.practice &&
                !guidedLab &&
                !independentContext
              }
            >
              {location.networking
                ? networkingNb.title
                : location.compute
                  ? computeNb.title
                  : location.mission
                    ? missionsNb.missions[location.mission].title
                    : managementLab
                      ? architectureNb.title
                      : location.bridge ||
                          (location.practice && practical.current?.origin.module === 'benefits')
                        ? nb.official.benefits
                        : location.module === 'computing' ||
                            (guidedLab && course.save.lab?.origin === 'computing-v2')
                          ? nb.official.computing
                          : nb.official.services}
            </span>
            <Link href={courseReturn}>{nb.course.returnCourse}</Link>
            <button
              type="button"
              data-guide="architecture"
              onClick={() => navigate('architecture', { id: location.id })}
            >
              <ServiceIcon kind="architecture" size={15} />
              {p.areas.architecture}
            </button>
            <button type="button" onClick={returnLearning}>
              <ServiceIcon kind="learn" size={15} />
              {p.returnLearning}
            </button>

            {module.facts.active ? (
              <button type="button" onClick={() => navigate('challenge', { mode: 'independent' })}>
                {p.continueChallenge}
              </button>
            ) : (
              <span />
            )}
            {location.mode === 'guided' && !guidedLab && !guidanceSuppressed && (
              <button type="button" onClick={() => setPane(!pane)}>
                {pane ? p.hidePane : p.showPane}
              </button>
            )}
          </div>
          <GuidanceMilestones location={location} independent={guidanceSuppressed} />
          {contextIssue && (
            <div role="status" className="portal-storage" data-guidance-context="uncertain">
              <p>
                {p.storage} {guidanceContexts.find((c) => c.issue)?.issue}
              </p>
              <p>{nb.milestones.contextUnavailable}</p>
              <ServerlessRecovery />
              <PhysicalRecovery />
              <ManagementRecovery />
              <MissionRecovery />
              <button
                type="button"
                onClick={() => {
                  guidanceContexts.forEach((c) => c.store.load());
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
            className={`portal-content ${location.mode === 'guided' && !guidedLab && pane && !guidanceSuppressed && !['learn', 'challenge', 'architecture', 'hierarchy'].includes(location.area) ? 'with-teaching' : ''}`}
          >
            <ManagementTeachingBoundary
              identity="portal-teaching"
              assessment={
                location.mission &&
                missions.active &&
                ['policy', 'architecture'].includes(location.area)
                  ? 'missions'
                  : location.area === 'learn' &&
                      location.module === 'computing' &&
                      ['assessment', 'summary'].includes(location.topic)
                    ? 'foundations'
                    : undefined
              }
              orientation={
                !['learn', 'responsibility', 'hierarchy', 'policy', 'architecture'].includes(
                  location.area,
                )
              }
              only={['policy', 'architecture'].includes(location.area) ? 'management' : undefined}
            >
              <div className="portal-view">
                {location.area === 'home' ? (
                  <>
                    <h2>{p.services}</h2>
                    <div className="portal-home-services">
                      <button type="button" onClick={() => navigate('services')}>
                        <ServiceIcon kind="create" size={30} />
                        <span>{nb.portalUi.create}</span>
                      </button>
                      {services.map((area) => {
                        return (
                          <button key={area} type="button" onClick={() => navigate(area)}>
                            <ServiceIcon kind={area} size={30} />
                            <span>{p.areas[area]}</span>
                          </button>
                        );
                      })}
                      <button type="button" onClick={() => navigate('services')}>
                        <ServiceIcon kind="next" size={28} />
                        <span>{nb.portalUi.moreServices}</span>
                      </button>
                    </div>
                    {(practicalMission || guidedLab || location.bridge) && (
                      <details className="portal-home-training">
                        <summary>
                          {nb.portalUi.learningLayer} ·{' '}
                          {managementLab
                            ? architectureNb.title
                            : (practicalMission?.title ?? nb.official.services)}
                        </summary>
                        <ServiceIcon kind="learn" size={25} />
                        <div>
                          <h2>
                            {managementLab
                              ? architectureNb.title
                              : (practicalMission?.title ??
                                (location.bridge ? nb.official.benefits : nb.official.services))}
                          </h2>
                          <p>
                            {managementLab
                              ? managementNb.portalWhy
                              : (practicalMission?.purpose ??
                                (location.bridge ? labsNb.bridge[location.bridge] : p.homeIntro))}
                          </p>
                          <small>
                            {nb.official.certification} ·{' '}
                            {managementLab ? architectureNb.path : nb.official.path}
                          </small>
                        </div>
                        <button
                          type="button"
                          className="primary"
                          onClick={() =>
                            managementLab || practicalMission || location.bridge
                              ? returnLearning()
                              : navigate(module.facts.active ? 'challenge' : 'learn')
                          }
                        >
                          {managementLab || practicalMission || location.bridge
                            ? nb.course.returnCourse
                            : module.facts.active
                              ? p.continueChallenge
                              : p.startLearning}
                        </button>
                      </details>
                    )}
                    <h2>{p.recent}</h2>
                    <p>{p.recentHint}</p>
                    {recent.length ? (
                      <ResourceTable
                        compact
                        world={world}
                        navigate={navigate}
                        rows={rows
                          .filter((r) => recent.includes(r.id))
                          .sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id))}
                      />
                    ) : (
                      <div className="portal-empty">
                        <p>{polish.resource.empty}</p>
                        <button type="button" onClick={() => navigate('resources')}>
                          {p.areas.resources}
                        </button>
                      </div>
                    )}
                    <section className="portal-home-navigate">
                      <h2>{nb.portalUi.navigate}</h2>
                      <div>
                        {(['subscriptions', 'groups', 'resources'] as const).map((area) => (
                          <button key={area} type="button" onClick={() => navigate(area)}>
                            <ServiceIcon kind={area} size={22} />
                            {p.areas[area]}
                          </button>
                        ))}
                      </div>
                    </section>
                  </>
                ) : location.area === 'services' ? (
                  <>
                    <p>{p.serviceHint}</p>
                    <div className="portal-services-index">
                      {[...services, 'policy' as const].map((area) => {
                        return (
                          <button key={area} type="button" onClick={() => navigate(area)}>
                            <ServiceIcon kind={area} size={22} />
                            <span>{p.areas[area]}</span>
                            <ServiceIcon kind="next" size={14} />
                          </button>
                        );
                      })}
                    </div>
                    <details className="portal-learning-tools">
                      <summary>
                        <ServiceIcon kind="learn" />
                        {nb.portalUi.learningTools}
                      </summary>
                      <div className="portal-services-index">
                        {educational.map((area) => (
                          <button key={area} type="button" onClick={() => navigate(area)}>
                            <ServiceIcon kind={area} size={22} />
                            <span>{p.areas[area]}</span>
                            <ServiceIcon kind="next" size={14} />
                          </button>
                        ))}
                      </div>
                    </details>
                    <h2>{p.unavailable}</h2>
                    <p>{p.unavailableServices}</p>
                  </>
                ) : ['subscriptions', 'groups', 'resources', 'apps', 'plans', 'vms'].includes(
                    location.area,
                  ) ? (
                  <ResourceTable
                    key={location.area}
                    world={world}
                    navigate={navigate}
                    area={location.area}
                  />
                ) : location.area === 'create' ? (
                  location.kind === 'vm' ? (
                    <VmForm
                      onObserve={setVmForm}
                      key={`${location.kind}-${location.edit}-${location.id}`}
                      engine={chapter.attempt.engine}
                      location={location}
                      sequence={chapter.attempt.events.length + 1}
                      disabled={disabled}
                      onCreate={command}
                      navigate={navigate}
                    />
                  ) : (
                    <CreateResource
                      key={`${location.kind}-${location.edit}-${location.id}`}
                      engine={chapter.attempt.engine}
                      location={location}
                      sequence={chapter.attempt.events.length + 1}
                      disabled={disabled}
                      onCreate={command}
                      navigate={navigate}
                      onObserve={guidedLab ? setLabForm : undefined}
                    />
                  )
                ) : location.area === 'settings' || location.area === 'resource' ? (
                  <ResourceDetails
                    key={location.id}
                    world={world}
                    id={location.id}
                    navigate={navigate}
                    settings={location.area === 'settings'}
                    commands={commands}
                  >
                    {(view) =>
                      location.area === 'settings' ? (
                        <AppSettings
                          key={location.id}
                          world={world}
                          id={location.id}
                          disabled={disabled}
                          onCreate={command}
                          onDraft={
                            location.mission &&
                            missions.current?.mission === 'platform' &&
                            missions.current.status === 'active' &&
                            !contextIssue &&
                            !otherIndependentContext
                              ? (values) =>
                                  missions.store.event({
                                    type: 'draft',
                                    target: location.id,
                                    through:
                                      chapter.attempt.engine.ledger.at(-1)?.receipt.commandId ??
                                      null,
                                    ...values,
                                  })
                              : undefined
                          }
                        />
                      ) : (
                        <InfrastructureDetails
                          view={view}
                          world={world}
                          id={location.id}
                          navigate={navigate}
                          onCreate={command}
                          receipt={
                            chapter.attempt.engine.ledger
                              .filter(
                                (e) =>
                                  e.receipt.outcome === 'accepted' &&
                                  (e.receipt.addedIds.includes(location.id) ||
                                    e.request.command.appId === location.id),
                              )
                              .at(-1)?.receipt
                          }
                        />
                      )
                    }
                  </ResourceDetails>
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
                    onSelectRelation={
                      guidedLab
                        ? (appId) => {
                            const snapshot = course.store.getSnapshot().save;
                            const f = labFacts(
                              snapshot.lab,
                              chapter.attempt.engine,
                              chapter.attemptNumber,
                            );
                            if (snapshot.lab && f.app?.id === appId)
                              course.store.update({
                                ...snapshot,
                                lab: { ...snapshot.lab, relationship: appId },
                              });
                          }
                        : undefined
                    }
                  />
                ) : location.area === 'policy' ? (
                  <>
                    <h2>{nb.chapter.customPolicy}</h2>
                    {world.policies.map((policy) => (
                      <section key={policy.id} data-guide="policy">
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
                        {!missions.issue && (!missions.active || missions.assisted) && (
                          <p>{p.graph.explanations['policy-scope']}</p>
                        )}
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
                      <div data-guide="receipt">
                        <ReceiptPanel
                          receipt={receipt}
                          onPolicy={() => navigate('policy')}
                          onEdit={
                            receipt.code === 'deleted' ||
                            (receipt.operation === 'CreateVmBundle' &&
                              receipt.outcome === 'accepted')
                              ? undefined
                              : () => edit(receipt)
                          }
                        />
                        {receiptResourceId && (
                          <button
                            type="button"
                            onClick={() => navigate('resource', { id: receiptResourceId })}
                          >
                            {p.viewResource}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </ManagementTeachingBoundary>
            {location.mode === 'guided' &&
              !guidedLab &&
              pane &&
              !guidanceSuppressed &&
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
      {!(
        location.practice &&
        practical.current?.kind === 'paas' &&
        labFacts(course.save.lab, chapter.attempt.engine, chapter.attemptNumber).complete
      ) &&
        !guidanceSuppressed && (
          <GuidedCoach
            location={location}
            form={labForm}
            navigate={navigate}
            returnHref={
              location.practice && practical.current?.kind === location.practice
                ? practicalReturn(practical.current)
                : undefined
            }
          />
        )}
      <PracticalCoach
        location={location}
        navigate={navigate}
        suppressed={guidanceSuppressed}
        form={vmForm}
      />
      {location.networking && (
        <NetworkingPortalMission
          location={location}
          navigate={navigate}
          independent={independentContext}
        />
      )}
      {location.compute && (
        <ComputePortalMission
          location={location}
          navigate={navigate}
          independent={independentContext}
        />
      )}
      <MissionPortalLayer
        location={location}
        blocked={
          contextIssue || guidanceContexts.some((x) => !x.ready) || !!otherIndependentContext
        }
      />
      {location.practice && practical.current?.mode === 'independent' && (
        <section className="portal-independent-practical" aria-label={labsNb.independent}>
          <h2>{labsNb.independent}</h2>
          <p>{labsNb.lab[practical.current.kind].changed}</p>
          <PracticalOutcome />
        </section>
      )}
      {appearance && (
        <PortalDialog panel title={nb.portalUi.appearance} onClose={() => setAppearance(false)}>
          <fieldset>
            <legend>{nb.portalUi.menuBehavior}</legend>
            {(['docked', 'flyout'] as const).map((mode) => (
              <label key={mode}>
                <input
                  type="radio"
                  name="portal-menu-mode"
                  checked={flyout === (mode === 'flyout')}
                  onChange={() => {
                    setFlyout(mode === 'flyout');
                    setMenu(false);
                    setCollapsed(false);
                  }}
                />
                {nb.portalUi[mode]}
              </label>
            ))}
          </fieldset>
          <p>{nb.portalUi.preferenceScope}</p>
        </PortalDialog>
      )}
      {notification && (
        <PortalDialog panel title={p.notifications} onClose={() => setNotification(false)}>
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
          <ManagementTeachingBoundary identity="portal-reference">
            {location.module === 'computing' ? (
              <FoundationsReference topic={location.topic} />
            ) : (
              <ServiceReference topic={location.topic} />
            )}
          </ManagementTeachingBoundary>
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
                    if (location.practice && practical.current?.kind === location.practice) {
                      const fresh = chapter.store.getSnapshot();
                      practical.store.restartContext(fresh.attemptNumber);
                      if (location.practice === 'paas' && practical.current.mode === 'guided')
                        course.store.update({
                          ...course.save,
                          lab: {
                            ...startLab(fresh.attempt.engine, fresh.attemptNumber),
                            origin: 'services-v2',
                          },
                        });
                    }
                    setHelp(false);
                    setResetConfirm(false);
                    navigate(
                      'resources',
                      location.practice === 'paas' && practical.current?.mode === 'guided'
                        ? { lab: true }
                        : {},
                    );
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
