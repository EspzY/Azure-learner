'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { nb } from '@/content/nb';
import { portalWorkspaceNb as w } from '@/content/portal-workspace-nb';
import { laboratoryInventory, LaboratoryResourceList } from './portal-adapter';
import {
  PortalFrame,
  PortalHeader,
  PortalSearch,
  PortalNavigation,
  PortalTitle,
  PortalBreadcrumbs,
  PortalResourceLayout,
  PortalResourceMenu,
  PortalCreateLayout,
  PortalCreateActions,
  PortalOperationTable,
  PortalReceiptSummary,
} from '@/features/portal/presentation';
import Link from 'next/link';
import { AzureLabHomeLink } from '@/features/portal/azurelab-home-link';
import { ephemeralApi, ephemeralActive, startEphemeral } from './ephemeral-client';
import { laboratoryEphemeralNb as temp } from '@/content/laboratory-ephemeral-nb';
import { useSearchParams, useRouter } from 'next/navigation';
import { laboratoryV3Nb as c } from '@/content/nb';
import type { Snapshot, Request as LabRequest, Command, Receipt, Model } from '@/laboratory/engine';
import { isFirewallWorld } from './capabilities';
import { laboratoryModel as remediationModel } from '@/laboratory/v36/contract';
import { laboratoryModel as topologyModel } from '@/laboratory/v37/contract';
import { laboratoryTopologyNb as topologyCopy } from '@/content/laboratory-topology-nb';
import { laboratoryModel } from '@/laboratory/v35/contract';
import { firewallFields } from '@/laboratory/v35/contract';
import { laboratoryFirewallNb as f } from '@/content/laboratory-firewall-nb';
import { FirewallViews, firewallDefaults, firewallOptions } from './firewall';
import { laboratoryComputeNb as m } from '@/content/laboratory-compute-nb';
import { images, sizes, diskSizes, childNames } from '@/laboratory/v34/profiles';
import { ComputeViews, computeFields } from './compute';
import { laboratoryEndpointsNb as e } from '@/content/laboratory-endpoints-nb';
import { EndpointViews, PolicyAnalysisView, endpointFields } from './endpoints';
import { laboratoryRoutingNb as r } from '@/content/laboratory-routing-nb';
import { RoutingViews, RouteAnalysis, routingFields } from './routing';
import { laboratoryNetworkNb as n } from '@/content/laboratory-networking-nb';
import { NetworkViews, networkFields } from './networking';
import { PropertyList, PortalDialog } from '@/features/portal/shared';
import { ServiceIcon } from '@/features/portal/service-icon';
import '@/features/portal/portal.css';
import './laboratory.css';
import { ArchitectureStudio } from './studio';
import { architectureStudioNb as studioCopy } from '@/content/architecture-studio-nb';
import { studioContext, studioReturn } from './studio-location';
import { RuleLifecycle, RuleHistory, lifecycleMessage } from './rule-lifecycle';
import { laboratoryRemediationNb as remediationCopy } from '@/content/laboratory-remediation-nb';
import {
  PortalHome,
  PortalServiceNavigation,
  PortalServiceDirectory,
} from '@/features/portal/home';
import { portalServices } from '@/features/portal/service-catalog';
import { PortalSubscriptions, PortalSubscriptionDetails } from '@/features/portal/subscriptions';
import { laboratorySubscriptions, laboratoryResourceLink } from './scope-projection';
import { sharedPortalNb as sharedCopy } from '@/content/shared-portal-nb';
const base = '/labs/laboratory';
const baseHref = (view: string, id?: string, receipt?: string) =>
  base +
  '?' +
  new URLSearchParams({ view, ...(id ? { id } : {}), ...(receipt ? { receipt } : {}) });
const message = (code: string, operation?: string) =>
  ['read-only-rule', 'no-change'].includes(code)
    ? lifecycleMessage(code)
    : Object.hasOwn(f.codes, code) &&
        (!['incompatible-association', 'invalid-priority', 'priority-conflict'].includes(code) ||
          Object.hasOwn(f.operations, operation ?? ''))
      ? f.codes[code as keyof typeof f.codes]
      : code === 'incompatible-association' &&
          ['CreateNetworkInterface', 'AssociateNicNsg', 'CreateVirtualMachine'].includes(
            operation ?? '',
          )
        ? e.associationError
        : code === 'not-associated' && operation === 'DisassociateNicNsg'
          ? e.noAssociation
          : Object.hasOwn(e.codes, code)
            ? e.codes[code as keyof typeof e.codes]
            : code === 'incompatible-association' && operation === 'AssociateSubnetRouteTable'
              ? r.associationError
              : Object.hasOwn(r.codes, code)
                ? r.codes[code as keyof typeof r.codes]
                : Object.hasOwn(n.codes, code)
                  ? n.codes[code as keyof typeof n.codes]
                  : Object.hasOwn(c.codes, code)
                    ? c.codes[code as keyof typeof c.codes]
                    : c.unavailable;
const label = (key: string) =>
  Object.hasOwn(f.fields, key)
    ? f.fields[key as keyof typeof f.fields]
    : Object.hasOwn(m.fields, key)
      ? m.fields[key as keyof typeof m.fields]
      : Object.hasOwn(e.fields, key)
        ? e.fields[key as keyof typeof e.fields]
        : Object.hasOwn(r.fields, key)
          ? r.fields[key as keyof typeof r.fields]
          : Object.hasOwn(n.fields, key)
            ? n.fields[key as keyof typeof n.fields]
            : Object.hasOwn(c.fields, key)
              ? c.fields[key as keyof typeof c.fields]
              : key;
const operation = (key: string) =>
  Object.hasOwn(topologyCopy.operations, key)
    ? topologyCopy.operations[key as keyof typeof topologyCopy.operations]
    : Object.hasOwn(remediationCopy.operations, key)
      ? remediationCopy.operations[key as keyof typeof remediationCopy.operations]
      : Object.hasOwn(f.operations, key)
        ? f.operations[key as keyof typeof f.operations]
        : key === 'CreateVirtualMachine'
          ? m.create
          : Object.hasOwn(e.operations, key)
            ? e.operations[key as keyof typeof e.operations]
            : Object.hasOwn(r.operations, key)
              ? r.operations[key as keyof typeof r.operations]
              : Object.hasOwn(n.operations, key)
                ? n.operations[key as keyof typeof n.operations]
                : Object.hasOwn(c.operations, key)
                  ? c.operations[key as keyof typeof c.operations]
                  : key;
async function api(action: string, request?: unknown, workspace?: string) {
  if (ephemeralActive()) return ephemeralApi(action, request, workspace);
  let response: Response, value;
  try {
    response = await fetch('/api/laboratory/' + action, {
      method: request === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      ...(request === undefined
        ? {}
        : {
            headers: {
              'Content-Type': 'application/json',
              ...(workspace ? { 'If-Laboratory-Workspace': workspace } : {}),
            },
            body: JSON.stringify(request),
          }),
    });
    value = await response.json();
  } catch {
    throw Error('server-result-unavailable');
  }
  if (value.error) throw Error(value.error);
  return value;
}
export function Laboratory() {
  const query = useSearchParams(),
    router = useRouter();
  const href = (view: string, id?: string, receipt?: string) =>
    studioContext(baseHref(view, id, receipt), query);
  const routeFocusKey = [
    query.get('view'),
    query.get('id'),
    query.get('section'),
    query.get('receipt'),
  ].join('|');
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [startModel, setStartModel] = useState<Model>(topologyModel),
    [newWorkspace, setNewWorkspace] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [form, setForm] = useState<Command['type'] | null>(null),
    [values, setValues] = useState<Record<string, string>>({}),
    [preview, setPreview] = useState<{
      receipt: Receipt;
      request: LabRequest;
      workspace: string;
    } | null>(null),
    [reset, setReset] = useState<{ workspace: string; revision: number } | null>(null),
    [pendingView, setPendingView] = useState<{ request: LabRequest; workspace: string } | null>(
      null,
    );
  const pending = useRef<{ request: LabRequest; workspace: string } | null>(null),
    channel = useRef<BroadcastChannel | null>(null),
    version = useRef(0),
    snapshotRef = useRef(snapshot),
    resultRef = useRef<HTMLHeadingElement>(null),
    formHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (form) formHeading.current?.focus({ preventScroll: true });
  }, [form]);
  useEffect(() => {
    // Enter a received workspace without stealing focus on Studio filters/pan.
    if (snapshot?.workspace) resultRef.current?.focus({ preventScroll: true });
  }, [snapshot?.workspace]);
  const updatePending = useCallback((value: { request: LabRequest; workspace: string } | null) => {
    pending.current = value;
    setPendingView(value);
  }, []);
  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);
  useEffect(() => {
    // Route commits move focus; presentation-only Studio filters/pan must not steal it.
    resultRef.current?.focus({ preventScroll: true });
  }, [routeFocusKey]);
  const accept = useCallback(
    (incoming: Snapshot) =>
      setSnapshot((previous) =>
        previous &&
        previous.workspace === incoming.workspace &&
        previous.entries.length > incoming.entries.length
          ? previous
          : incoming,
      ),
    [],
  );
  const load = useCallback(async () => {
    const v = ++version.current;
    try {
      const incoming = await api('state');
      if (v === version.current) {
        accept(incoming);
        const changed = snapshotRef.current && snapshotRef.current.workspace !== incoming.workspace;
        if (changed) {
          updatePending(null);
          setForm(null);
          setPreview(null);
          setReset(null);
          setError('workspace-changed');
        } else setError('');
        const id = pending.current?.request.commandId;
        if (id && pending.current) {
          if (pending.current.workspace !== incoming.workspace) {
            updatePending(null);
            setError('workspace-changed');
          } else if (
            incoming.entries.some(
              (e: { request: { commandId: string } }) => e.request.commandId === id,
            )
          ) {
            updatePending(null);
          } else setError('server-result-unavailable');
        }
      }
    } catch (e) {
      if (v === version.current) {
        const code = e instanceof Error ? e.message : 'server-result-unavailable';
        setError(code);
        if (code === 'session-required') {
          setSnapshot(null);
          updatePending(null);
          setForm(null);
          setPreview(null);
          setReset(null);
        }
      }
    } finally {
      if (v === version.current) setLoading(false);
    }
  }, [accept, updatePending]);
  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
    const refresh = () => {
      if (document.visibilityState === 'visible') void load();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('azurelab.laboratory.v3.invalidate');
      channel.current = bc;
      bc.onmessage = () => {
        if (!ephemeralActive()) void load();
      };
    }
    return () => {
      version.current = -1;
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      channel.current?.close();
    };
  }, [load]);
  const run = async (request: LabRequest, workspace: string) => {
    if (snapshotRef.current?.workspace !== workspace) {
      setError('workspace-changed');
      setForm(null);
      setPreview(null);
      setReset(null);
      updatePending(null);
      return;
    }
    setBusy(true);
    updatePending({ request, workspace });
    try {
      const result = await api('command', request, workspace);
      if (snapshotRef.current?.workspace === workspace && result.workspace === workspace) {
        accept(result);
        updatePending(null);
        setError('');
        setForm(null);
        setPreview(null);
        setReset(null);
        const target = result.receipt.addedIds[0];
        const kind =
          (
            {
              CreateAzureFirewall: 'firewall',
              CreateFirewallPolicy: 'firewallPolicy',
              CreateFirewallRuleCollectionGroup: 'firewallGroup',
              CreateFirewallNetworkCollection: 'firewallCollection',
              CreateFirewallNetworkRule: 'firewallRule',
              CreateFirewallRoute: 'route',
              CreateVirtualMachine: 'vm',
              CreateNetworkInterface: 'nic',
              CreateVirtualNetwork: 'vnet',
              CreateSubnet: 'subnet',
              CreateNetworkSecurityGroup: 'nsg',
              CreateSecurityRule: 'rule',
              CreateVnetPeering: 'peering',
              CreateRouteTable: 'routeTable',
              CreateRoute: 'route',
            } as Record<string, string>
          )[request.command.type] ??
          (request.command.type === 'CreateGroup'
            ? 'group'
            : request.command.type === 'CreateStorageAccount'
              ? 'account'
              : request.command.type === 'CreateBlobContainer'
                ? 'container'
                : 'blob');
        router.push(
          (request.command.type === 'UpdateSecurityRule' ||
            request.command.type === 'UpdateFirewallNetworkRule') &&
            result.receipt.outcome === 'accepted'
            ? href(
                request.command.type === 'UpdateSecurityRule' ? 'rule' : 'firewallRule',
                request.command.ruleId,
              )
            : request.command.type === 'UpdateRoute' && result.receipt.outcome === 'accepted'
              ? href('route', request.command.routeId)
              : (request.command.type === 'SetPeeringForwardedTraffic' ||
                    request.command.type === 'SetPeeringVirtualNetworkAccess') &&
                  result.receipt.outcome === 'accepted'
                ? href('peering', request.command.peeringId)
                : request.command.type === 'DeleteRoute' && result.receipt.outcome === 'accepted'
                  ? href(
                      'routeTable',
                      isFirewallWorld(snapshotRef.current?.world)
                        ? snapshotRef.current.world.routes.find(
                            (r) => r.id === (request.command as { routeId: string }).routeId,
                          )?.routeTableId
                        : undefined,
                    )
                  : ['AssociateNicNsg', 'DisassociateNicNsg'].includes(request.command.type) &&
                      'nicId' in request.command &&
                      result.receipt.outcome === 'accepted'
                    ? href('nic', request.command.nicId)
                    : [
                          'AssociateSubnetNsg',
                          'DisassociateSubnetNsg',
                          'AssociateSubnetRouteTable',
                          'DisassociateSubnetRouteTable',
                        ].includes(request.command.type) &&
                        'subnetId' in request.command &&
                        result.receipt.outcome === 'accepted'
                      ? href('subnet', request.command.subnetId)
                      : target && result.receipt.outcome === 'accepted'
                        ? href(kind, target)
                        : href('history', undefined, result.receipt.commandId),
        );
        if (!ephemeralActive()) channel.current?.postMessage('changed');
      } else {
        updatePending(null);
        setForm(null);
        setPreview(null);
        setReset(null);
        setError('workspace-changed');
      }
    } catch (e) {
      const code = e instanceof Error ? e.message : 'server-result-unavailable';
      if (
        ['command-id-conflict', 'workspace-changed', 'session-required', 'history-limit'].includes(
          code,
        )
      ) {
        updatePending(null);
        setPreview(null);
        if (code === 'workspace-changed' || code === 'session-required') {
          setForm(null);
          setReset(null);
        }
      }
      setError(code);
    } finally {
      setBusy(false);
    }
  };
  const start = async (replace = false) => {
    setBusy(true);
    try {
      if (!navigator.locks) throw Error('backend-unavailable');
      await navigator.locks.request('azurelab.laboratory.v3.session', async () => {
        const incoming = await api('session', {
          model: replace ? topologyModel : startModel,
          ...(replace ? { newWorkspace: true } : {}),
        });
        updatePending(null);
        setForm(null);
        setPreview(null);
        setReset(null);
        setNewWorkspace(false);
        ++version.current;
        accept(incoming);
        setError('');
        if (!ephemeralActive()) channel.current?.postMessage('changed');
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'server-result-unavailable');
    } finally {
      setBusy(false);
      setLoading(false);
    }
  };
  const startTemporary = async () => {
    setBusy(true);
    try {
      const incoming = await startEphemeral(topologyModel);
      ++version.current;
      setSnapshot(incoming);
      updatePending(null);
      setForm(null);
      setPreview(null);
      setReset(null);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'server-result-unavailable');
    } finally {
      setBusy(false);
      setLoading(false);
    }
  };
  const temporary = ephemeralActive();
  const modeNote = temporary ? temp.mode : snapshot ? w.modeNote : temp.mode;
  const world = snapshot?.world,
    network = world && world.model !== 'laboratory@3.0.0' ? world : undefined,
    routing =
      world?.model === 'laboratory@3.2.0' ||
      world?.model === 'laboratory@3.3.0' ||
      world?.model === 'laboratory@3.4.0' ||
      isFirewallWorld(world)
        ? world
        : undefined,
    endpoints =
      isFirewallWorld(world) ||
      world?.model === 'laboratory@3.4.0' ||
      world?.model === 'laboratory@3.3.0'
        ? world
        : undefined,
    compute = isFirewallWorld(world) || world?.model === 'laboratory@3.4.0' ? world : undefined,
    firewall = isFirewallWorld(world) ? world : undefined,
    view = query.get('view') ?? 'home',
    id = query.get('id'),
    selectedReceipt = snapshot?.entries.find((e) => e.receipt.commandId === query.get('receipt'));
  const group = world?.groups.find((r) => r.id === id),
    account = world?.accounts.find((r) => r.id === id),
    container = world?.containers.find((r) => r.id === id),
    blob = world?.blobs.find((r) => r.id === id);
  const groupScope = (groupId: string) => {
    const g = world?.groups.find((item) => item.id === groupId);
    return g ? `${g.name} · ${g.subscriptionId}` : groupId;
  };
  const vnetScope = (vnetId: string) => {
    const v = network?.vnets.find((item) => item.id === vnetId);
    return v ? `${v.name} · ${groupScope(v.groupId)} · ${v.region}` : vnetId;
  };
  const begin = (type: Command['type']) => {
    const chosenSubnet = network?.subnets.find((x) => x.id === id);
    const chosenVnet =
      chosenSubnet?.vnetId ??
      network?.vnets.find((x) => x.id === id)?.id ??
      network?.vnets[0]?.id ??
      '';
    setForm(type);
    setPreview(null);
    setValues({
      image: 'ubuntu-22.04-gen2',
      size: 'Standard_D2s_v4',
      osDiskSku: 'StandardSSD_LRS',
      osDiskSizeGiB: '128',
      nicId: endpoints?.nics.find((x) => x.id === id)?.id ?? endpoints?.nics[0]?.id ?? '',
      privateIpAddress: '',
      allocation: 'Static',
      name: '',
      subscriptionId: subscription?.id ?? 'sub-shared',
      metadataRegion: 'norwayeast',
      groupId: group?.id ?? world?.groups[0]?.id ?? '',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
      accountId: account?.id ?? world?.accounts[0]?.id ?? '',
      access: type === 'CreateSecurityRule' ? 'Allow' : 'private',
      containerId: container?.id ?? world?.containers[0]?.id ?? '',
      text: '',
      contentType: 'text/plain',
      vnetId: chosenVnet,
      subnetId: chosenSubnet?.id ?? network?.subnets.find((x) => x.vnetId === chosenVnet)?.id ?? '',
      nsgId:
        type === 'CreateVirtualMachine'
          ? 'none'
          : (network?.nsgs.find((x) => x.id === id)?.id ?? network?.nsgs[0]?.id ?? ''),
      addressSpace: '10.20.0.0/16',
      addressPrefix: '10.20.1.0/24',
      direction: 'Inbound',
      priority: '100',
      protocol: 'Tcp',
      source: '*',
      sourcePort: '*',
      destination: '*',
      destinationPort: '443',
      remoteVnetId: routing?.vnets.find((x) => x.id !== id)?.id ?? '',
      routeTableId:
        routing?.routeTables.find((x) => x.id === id)?.id ?? routing?.routeTables[0]?.id ?? '',
      nextHopType: 'None',
      ...(firewall ? firewallDefaults(firewall, id, type) : {}),
    });
  };
  const receiptLink = (origin: string) => (
    <Link className="lab-evidence-link" href={href('history', undefined, origin)}>
      {c.receipt}
    </Link>
  );
  const records = world ? laboratoryInventory(world) : [];
  const links = (type: string, rows: { id: string; name: string; origin: string }[]) => (
    <LaboratoryResourceList
      rows={records.filter((r) => r.view === type && rows.some((x) => x.id === r.id))}
      groups={type === 'group'}
      href={href}
    />
  );
  const field = (key: string, label: string, options?: [string, string][], note?: string) => (
    <label key={key}>
      {label}
      {options ? (
        <select
          aria-label={label}
          aria-describedby={note ? `lab-note-${key}` : undefined}
          value={
            firewall &&
            form &&
            Object.hasOwn(firewallFields, form) &&
            !options.some(([value]) => value === values[key])
              ? ''
              : (values[key] ?? '')
          }
          onChange={(e) => {
            setValues({
              ...values,
              [key]: e.target.value,
              ...(key === 'firewallId' && firewall
                ? {
                    nextHopIp:
                      firewall.firewalls.find((f) => f.id === e.target.value)?.privateIpAddress ??
                      '',
                  }
                : {}),
              ...(key === 'vnetId' &&
              ['CreateNetworkInterface', 'CreateVirtualMachine'].includes(form ?? '')
                ? { subnetId: '' }
                : {}),
            });
            setPreview(null);
          }}
          required
        >
          <option value="" disabled>
            —
          </option>
          {options.map(([value, title]) => (
            <option key={value} value={value}>
              {title}
            </option>
          ))}
        </select>
      ) : key === 'text' ? (
        <textarea
          aria-label={label}
          aria-describedby={note ? `lab-note-${key}` : undefined}
          maxLength={120}
          required
          value={values[key] ?? ''}
          onChange={(e) => {
            setValues({ ...values, [key]: e.target.value });
            setPreview(null);
          }}
        />
      ) : (
        <input
          aria-label={label}
          aria-describedby={note ? `lab-note-${key}` : undefined}
          required
          maxLength={key === 'name' ? 90 : 120}
          value={values[key] ?? ''}
          onChange={(e) => {
            setValues({ ...values, [key]: e.target.value });
            setPreview(null);
          }}
        />
      )}
      {note && <small id={`lab-note-${key}`}>{note}</small>}
    </label>
  );
  const regions: [string, string][] = [
    ['norwayeast', 'Norway East'],
    ['westeurope', 'West Europe'],
    ['northeurope', 'North Europe'],
  ];
  const review = async () => {
    if (!world || !form || !snapshot) return;
    setBusy(true);
    const requestType =
      form === 'CreateRoute' && firewall && values.nextHopType === 'VirtualAppliance'
        ? 'CreateFirewallRoute'
        : form;
    const keys =
      firewallFields[requestType]?.filter((k) => k !== 'type') ??
      computeFields[form] ??
      endpointFields[form] ??
      routingFields[form] ??
      networkFields[form] ??
      (form === 'CreateGroup'
        ? ['subscriptionId', 'name', 'metadataRegion']
        : form === 'CreateStorageAccount'
          ? ['groupId', 'name', 'region', 'kind', 'sku']
          : form === 'CreateBlobContainer'
            ? ['accountId', 'name', 'access']
            : ['containerId', 'name', 'text', 'contentType']);
    const request: LabRequest = {
      commandId: crypto.randomUUID(),
      expectedRevision: world.revision,
      command: {
        type: requestType,
        ...Object.fromEntries(keys.map((k) => [k, values[k] ?? ''])),
      } as Command,
    };
    try {
      const result = await api('review', request, snapshot.workspace);
      if (
        result.workspace !== snapshot.workspace ||
        snapshotRef.current?.workspace !== snapshot.workspace
      )
        throw Error('workspace-changed');
      setPreview({ receipt: result.preview, request, workspace: result.workspace });
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'server-result-unavailable');
    } finally {
      setBusy(false);
    }
  };
  const [menu, setMenu] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [narrow, setNarrow] = useState(false),
    [search, setSearch] = useState(''),
    [help, setHelp] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (preview) {
      reviewHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      reviewHeading.current?.focus({ preventScroll: true });
    }
  }, [preview]);
  const priorForm = useRef(form);
  useEffect(() => {
    if (!form && priorForm.current) resultRef.current?.focus({ preventScroll: true });
    priorForm.current = form;
  }, [form]);
  useEffect(() => {
    const media = matchMedia('(max-width:1100px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    // Match the course Portal: Escape dismisses navigation, never toggles it.
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, []);
  const visit = (next: string, target?: string, receipt?: string) => {
    setMenu(false);
    setSearch('');
    setForm(null);
    setPreview(null);
    router.push(href(next, target, receipt));
  };
  const resource = records.find((r) => r.id === id && r.view === view);
  const recentResourceId = resource?.id;
  const [recent, setRecent] = useState<{ workspace: string; ids: string[] }>({
    workspace: '',
    ids: [],
  });
  useEffect(() => {
    if (!snapshot?.workspace || !recentResourceId) return;
    const frame = requestAnimationFrame(() =>
      setRecent((previous) => ({
        workspace: snapshot.workspace,
        ids: [
          recentResourceId,
          ...(previous.workspace === snapshot.workspace ? previous.ids : []).filter(
            (x) => x !== recentResourceId,
          ),
        ].slice(0, 8),
      })),
    );
    return () => cancelAnimationFrame(frame);
  }, [snapshot?.workspace, recentResourceId]);
  const resourceDestination = (view: string, id: string) => ({
    href: href(view, id),
    onSelect: () => visit(view, id),
  });
  const subscriptions = world ? laboratorySubscriptions(world, records, resourceDestination) : [];
  const subscription = view === 'subscription' ? subscriptions.find((s) => s.id === id) : undefined;
  const section =
    query.get('section') === 'properties'
      ? 'properties'
      : query.get('section') === 'networking' && view === 'vm' && compute
        ? 'networking'
        : 'overview';
  const catalog = portalServices('laboratory', world?.model);
  const services: [string, string, string][] = catalog.map((s) => [s.view, s.title, s.icon]);
  const serviceView = resource
    ? (
        {
          firewall: 'firewalls',
          firewallPolicy: 'firewallPolicies',
          firewallGroup: 'firewallPolicies',
          firewallCollection: 'firewallPolicies',
          firewallRule: 'firewallPolicies',
          publicIp: 'publicIps',
          vm: 'vms',
          disk: 'disks',
          nic: 'nics',
          group: 'groups',
          account: 'accounts',
          container: 'accounts',
          blob: 'accounts',
          vnet: 'vnets',
          subnet: 'vnets',
          nsg: 'nsgs',
          rule: 'nsgs',
          peering: 'vnets',
          routeTable: 'routeTables',
          route: 'routeTables',
        } as Record<string, string>
      )[resource.view]
    : view === 'subscription'
      ? 'subscriptions'
      : view === 'peerings'
        ? 'vnets'
        : view;
  const title = !snapshot
    ? c.title
    : view === 'peerings' && routing?.vnets.some((x) => x.id === id)
      ? `${routing.vnets.find((x) => x.id === id)?.name} · ${r.peerings}`
      : (subscription?.name ??
        resource?.name ??
        (view === 'home'
          ? nb.portal.areas.home
          : view === 'history'
            ? c.history
            : view === 'resources'
              ? nb.portal.areas.resources
              : view === 'services'
                ? nb.portal.areas.services
                : (services.find(([key]) => key === view)?.[1] ?? c.missing)));
  const titleIcon =
    resource?.kind ??
    services.find(([key]) => key === view)?.[2] ??
    (view === 'home'
      ? 'home'
      : subscription
        ? 'subscription'
        : view === 'history'
          ? 'activity'
          : view === 'services'
            ? 'services'
            : 'resources');
  const formIcon =
    form && firewallFields[form]
      ? form === 'CreateAzureFirewall'
        ? 'firewall'
        : form === 'CreateFirewallPolicy'
          ? 'firewallPolicy'
          : 'properties'
      : form === 'CreateVirtualMachine'
        ? 'vm'
        : form === 'CreateGroup'
          ? 'groups'
          : form === 'CreateStorageAccount'
            ? 'account'
            : form === 'CreateBlobContainer'
              ? 'container'
              : form === 'CreateTextBlob'
                ? 'blob'
                : form === 'CreateVirtualNetwork'
                  ? 'vnet'
                  : form === 'CreateSubnet'
                    ? 'subnet'
                    : form === 'CreateNetworkSecurityGroup'
                      ? 'nsg'
                      : 'settings';
  const parent = records.find((r) => r.id === resource?.parentId);
  const actions: [Command['type'], string][] =
    view === 'nic' && endpoints
      ? [
          ['AssociateNicNsg', e.operations.AssociateNicNsg],
          ...(endpoints.nics.find((x) => x.id === id)?.nsgId
            ? ([['DisassociateNicNsg', e.operations.DisassociateNicNsg]] as [
                Command['type'],
                string,
              ][])
            : []),
        ]
      : view === 'group'
        ? [
            ['CreateStorageAccount', c.newAccount],
            ...(compute
              ? ([['CreateVirtualMachine', m.create]] as [Command['type'], string][])
              : []),
            ...(endpoints
              ? ([['CreateNetworkInterface', e.operations.CreateNetworkInterface]] as [
                  Command['type'],
                  string,
                ][])
              : []),
            ...(routing
              ? ([['CreateRouteTable', r.operations.CreateRouteTable]] as [
                  Command['type'],
                  string,
                ][])
              : []),
            ...(network
              ? ([
                  ['CreateVirtualNetwork', n.newVnet],
                  ['CreateNetworkSecurityGroup', n.newNsg],
                ] as [Command['type'], string][])
              : []),
          ]
        : view === 'account'
          ? [['CreateBlobContainer', c.newContainer]]
          : view === 'container'
            ? [['CreateTextBlob', c.newBlob]]
            : view === 'vnet'
              ? [['CreateSubnet', n.newSubnet]]
              : view === 'subnet'
                ? [
                    ['AssociateSubnetNsg', n.associate],
                    ...(routing
                      ? ([
                          ['AssociateSubnetRouteTable', r.operations.AssociateSubnetRouteTable],
                          ...(routing.subnets.find((x) => x.id === id)?.routeTableId
                            ? [
                                [
                                  'DisassociateSubnetRouteTable',
                                  r.operations.DisassociateSubnetRouteTable,
                                ],
                              ]
                            : []),
                        ] as [Command['type'], string][])
                      : []),
                  ]
                : view === 'nsg'
                  ? [['CreateSecurityRule', n.newRule]]
                  : view === 'routeTable' && routing
                    ? [['CreateRoute', r.operations.CreateRoute]]
                    : [];
  const body = snapshot && world && (
    <>
      {(world.model === remediationModel || world.model === topologyModel) &&
        id &&
        ['rule', 'firewallRule', 'route', 'subnet', 'peering'].includes(view) && (
          <RuleLifecycle
            key={`${snapshot.workspace}:${world.model}:${view}:${id}`}
            snapshot={snapshot}
            view={view}
            id={id}
            href={href}
            disabled={busy || !!error}
            review={(request, workspace) => api('review', request, workspace)}
            commit={run}
          />
        )}
      {view === 'studio' &&
        (error ? (
          <p role="status">{c.unavailable}</p>
        ) : (
          <ArchitectureStudio
            key={`${snapshot.workspace}:${snapshot.world.model}:${snapshot.world.attempt}`}
            snapshot={snapshot}
            accept={accept}
          />
        ))}
      {view === 'home' && (
        <PortalHome
          services={catalog}
          destination={(view) => ({ href: href(view), onSelect: () => visit(view) })}
          recent={
            recent.workspace === snapshot.workspace
              ? recent.ids.flatMap((id) =>
                  records
                    .filter((r) => r.id === id)
                    .map((r) => laboratoryResourceLink(r, resourceDestination)),
                )
              : []
          }
          createGroup={
            <button disabled={busy || !!error} onClick={() => begin('CreateGroup')}>
              {c.newGroup}
            </button>
          }
        />
      )}
      {view === 'subscriptions' && (
        <PortalSubscriptions
          subscriptions={subscriptions}
          destination={(id) => resourceDestination('subscription', id)}
        />
      )}
      {view === 'subscription' && subscription && (
        <PortalSubscriptionDetails
          subscription={subscription}
          createGroup={
            <button disabled={busy || !!error} onClick={() => begin('CreateGroup')}>
              {c.newGroup}
            </button>
          }
          section={section === 'properties' ? 'properties' : 'overview'}
          onSection={(section) =>
            router.push(href('subscription', subscription.id) + '&section=' + section)
          }
        />
      )}
      {view === 'services' && (
        <>
          <p>{w.menuNote}</p>
          <PortalServiceDirectory
            services={catalog}
            destination={(view) => ({ href: href(view), onSelect: () => visit(view) })}
          />
          <p className="portal-inline-info">{sharedCopy.pendingWeb}</p>
        </>
      )}
      {view === 'resources' && (
        <LaboratoryResourceList
          rows={records.filter((r) => r.category === 'resource')}
          href={href}
        />
      )}
      {view === 'groups' && (
        <>
          <button disabled={busy || !!error} onClick={() => begin('CreateGroup')}>
            {c.newGroup}
          </button>
          {links('group', world.groups)}
        </>
      )}
      {view === 'accounts' && (
        <>
          <button
            disabled={busy || !!error || !world.groups.length}
            onClick={() => begin('CreateStorageAccount')}
          >
            {c.newAccount}
          </button>
          {links('account', world.accounts)}
        </>
      )}
      {view === 'group' && group && (
        <>
          <h2>{nb.portalUi.essentials}</h2>
          <PropertyList
            items={[
              [c.id, group.id],
              [
                c.subscription,
                <Link key="subscription" href={href('subscription', group.subscriptionId)}>
                  {subscriptions.find((s) => s.id === group.subscriptionId)?.name}
                </Link>,
              ],
              [nb.portal.metadata, group.metadataRegion],
            ]}
          />
          {receiptLink(group.origin)}
          <LaboratoryResourceList
            rows={records.filter((r) => r.category === 'resource' && r.groupId === group.id)}
            href={href}
          />
        </>
      )}
      {view === 'account' && account && (
        <>
          <h2>{nb.portalUi.essentials}</h2>
          <PropertyList
            items={[
              [c.id, account.id],
              [c.kind, account.kind],
              [c.sku, account.sku],
              [c.region, account.region],
              [
                c.group,
                <Link href={href('group', account.groupId)} key="group">
                  {world.groups.find((g) => g.id === account.groupId)?.name}
                </Link>,
              ],
              [
                c.subscription,
                <Link
                  key="subscription"
                  href={href(
                    'subscription',
                    world.groups.find((g) => g.id === account.groupId)?.subscriptionId,
                  )}
                >
                  {
                    subscriptions.find(
                      (s) =>
                        s.id === world.groups.find((g) => g.id === account.groupId)?.subscriptionId,
                    )?.name
                  }
                </Link>,
              ],
            ]}
          />
          {receiptLink(account.origin)}

          {links(
            'container',
            world.containers.filter((x) => x.accountId === account.id),
          )}
        </>
      )}
      {view === 'container' && container && (
        <>
          <h2>{nb.portalUi.essentials}</h2>
          <PropertyList
            items={[
              [c.id, container.id],
              [c.access, container.access],
              [
                c.account,
                <Link href={href('account', container.accountId)} key="parent">
                  {world.accounts.find((a) => a.id === container.accountId)?.name}
                </Link>,
              ],
            ]}
          />
          {receiptLink(container.origin)}

          {links(
            'blob',
            world.blobs.filter((b) => b.containerId === container.id),
          )}
        </>
      )}
      {view === 'blob' && blob && (
        <>
          <h2>{nb.portalUi.essentials}</h2>
          <PropertyList
            items={[
              [c.id, blob.id],
              [c.contentType, blob.contentType],
              [c.bytes, blob.byteLength],
              [c.hash, <code key="hash">{blob.sha256}</code>],
              [
                c.container,
                <Link href={href('container', blob.containerId)} key="parent">
                  {world.containers.find((x) => x.id === blob.containerId)?.name}
                </Link>,
              ],
            ]}
          />
          <pre className="lab-blob" aria-label={c.text}>
            {blob.text}
          </pre>
          {receiptLink(blob.origin)}
        </>
      )}
      {firewall && (
        <FirewallViews
          world={firewall}
          view={view}
          id={id}
          begin={begin}
          disabled={busy || !!error}
          list={links}
          receipt={receiptLink}
        />
      )}
      {compute && (
        <ComputeViews
          world={compute}
          view={view}
          id={id}
          begin={begin}
          disabled={busy || !!error}
          receipt={receiptLink}
          list={links}
          networking={query.get('section') === 'networking'}
        />
      )}
      {network && (
        <NetworkViews
          world={network}
          view={view}
          id={id}
          begin={begin}
          disabled={busy || !!error}
          receipt={receiptLink}
          list={links}
          headingRef={resultRef}
          headings={false}
          actions={!resource}
        />
      )}
      {routing && (
        <RoutingViews
          world={routing}
          view={view}
          id={id}
          begin={begin}
          disabled={busy || !!error}
          receipt={receiptLink}
          list={links}
        />
      )}
      {routing && view === 'analysis' && (
        <RouteAnalysis
          key={snapshot.workspace + ':' + id}
          snapshot={snapshot}
          initialSource={id}
          initialNic={query.get('nic')}
          initialDestination={query.get('destination')}
          accept={accept}
        />
      )}
      {endpoints && (
        <EndpointViews
          world={endpoints}
          view={view}
          id={id}
          begin={begin}
          disabled={busy || !!error}
          receipt={receiptLink}
          list={links}
        />
      )}
      {endpoints && view === 'policy' && (
        <PolicyAnalysisView
          key={snapshot.workspace + ':' + id}
          snapshot={snapshot}
          initialSource={id}
          accept={accept}
        />
      )}
      {view === 'history' && (
        <>
          {selectedReceipt ? (
            <PortalReceiptSummary
              outcome={selectedReceipt.receipt.outcome}
              className="lab-result"
              live="polite"
              identity={selectedReceipt.receipt.commandId}
              title={
                <>
                  {temporary ? temp.result : c.result} · {selectedReceipt.receipt.sequence}
                </>
              }
              description={
                <>
                  {selectedReceipt.receipt.outcome === 'accepted'
                    ? temporary
                      ? temp.accepted
                      : c.committed
                    : temporary
                      ? temp.rejected
                      : c.rejected}{' '}
                  {message(selectedReceipt.receipt.code, selectedReceipt.receipt.operation)}
                </>
              }
            >
              {temporary && <p className="portal-inline-info">{temp.evidence}</p>}
              <PropertyList
                items={[
                  [c.attempt, selectedReceipt.attempt],
                  [
                    c.revision,
                    `${selectedReceipt.receipt.beforeRevision} → ${selectedReceipt.receipt.afterRevision}`,
                  ],
                  ['commandId', selectedReceipt.receipt.commandId],
                  ...selectedReceipt.receipt.addedIds.map(
                    (id) =>
                      [
                        c.id,
                        records.find((r) => r.id === id) ? (
                          <Link href={href(records.find((r) => r.id === id)!.view, id)}>
                            {records.find((r) => r.id === id)!.name} · {id}
                          </Link>
                        ) : (
                          id
                        ),
                      ] as [string, React.ReactNode],
                  ),
                ]}
              />
              {(selectedReceipt.receipt.change || selectedReceipt.receipt.topologyChange) && (
                <RuleHistory
                  key={`${snapshot.workspace}:${selectedReceipt.receipt.commandId}`}
                  entry={selectedReceipt}
                  snapshot={snapshot}
                  href={href}
                  read={(through) => api('state?through=' + through)}
                />
              )}
              <details>
                <summary>{c.details}</summary>
                <pre>{JSON.stringify(selectedReceipt, null, 2)}</pre>
              </details>
            </PortalReceiptSummary>
          ) : query.has('receipt') ? (
            <p role="status">{c.missing}</p>
          ) : null}
          <PortalOperationTable
            receipts={snapshot!.entries.map((e) => e.receipt)}
            caption={c.history}
            empty={c.empty}
            renderIdentity={(r) => (
              <Link href={href('history', undefined, r.commandId)}>{r.commandId}</Link>
            )}
            operationLabel={(r) => operation(r.operation)}
            outcomeLabel={(r) => (r.outcome === 'accepted' ? w.accepted : w.denied)}
          />
        </>
      )}
      {(![
        'home',
        'subscriptions',
        'subscription',
        'services',
        'studio',
        'resources',
        'groups',
        'group',
        'accounts',
        'account',
        'container',
        'blob',
        'history',
        ...(compute ? ['vms', 'vm', 'disks', 'disk'] : []),
        ...(endpoints ? ['nics', 'nic', 'policy'] : []),
        ...(network ? ['vnets', 'vnet', 'subnet', 'nsgs', 'nsg', 'rule'] : []),
        ...(firewall
          ? [
              'firewalls',
              'firewall',
              'firewallPolicies',
              'firewallPolicy',
              'firewallGroup',
              'firewallCollection',
              'firewallRule',
              'publicIps',
              'publicIp',
            ]
          : []),
        ...(routing
          ? ['peerings', 'peering', 'routeTables', 'routeTable', 'route', 'analysis']
          : []),
      ].includes(view) ||
        (view === 'subscription' && !subscription) ||
        (view === 'group' && !group) ||
        (view === 'account' && !account) ||
        (view === 'container' && !container) ||
        (view === 'blob' && !blob) ||
        (view === 'rule' && !network?.securityRules.some((r) => r.id === id)) ||
        (view === 'firewallRule' && !firewall?.firewallRules.some((r) => r.id === id))) && (
        <p role="status">{c.missing}</p>
      )}
    </>
  );
  return (
    <PortalFrame
      mode="laboratory"
      className={`portal laboratory-v3 ${collapsed ? 'portal-collapsed' : ''}`}
      training="free"
      area={form ? 'create' : view}
      mainId="lab-main"
      titleId="lab-page-title"
      header={
        <PortalHeader
          expanded={narrow ? menu : !collapsed}
          onToggle={() => {
            // CSS can cross the breakpoint before its change event reaches React.
            const compact = matchMedia('(max-width:1100px)').matches;
            setNarrow(compact);
            if (compact) setMenu((open) => !open);
            else setCollapsed((closed) => !closed);
          }}
          homeHref={base}
          onHome={(e) => {
            e.preventDefault();
            visit('home');
          }}
          search={
            <PortalSearch
              value={search}
              onChange={setSearch}
              inputRef={searchRef}
              label={w.search}
              placeholder={w.search}
            >
              <strong>{nb.portal.searchResults}</strong>
              <div className="portal-search-group">
                <strong>{nb.portalUi.services}</strong>
                {[['home', nb.portal.areas.home, 'home'], ...services]
                  .filter(([, label]) => label!.toLowerCase().includes(search.toLowerCase()))
                  .map(([key, label, icon]) => (
                    <Link
                      key={key}
                      href={href(key!)}
                      onClick={(e) => {
                        e.preventDefault();
                        visit(key!);
                      }}
                    >
                      <ServiceIcon kind={icon!} />
                      {label}
                    </Link>
                  ))}
              </div>
              <div className="portal-search-group">
                <strong>{w.searchObjects}</strong>
                {records
                  .filter((r) =>
                    `${r.name} ${r.typeName} ${r.groupName}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .slice(0, 30)
                  .map((r) => (
                    <Link
                      key={r.id}
                      href={href(r.view, r.id)}
                      onClick={(e) => {
                        e.preventDefault();
                        visit(r.view, r.id);
                      }}
                    >
                      <ServiceIcon kind={r.kind} />
                      {r.name}
                      <small>
                        {r.typeName} · {r.groupName}
                      </small>
                    </Link>
                  ))}
              </div>
              {!records.some((r) =>
                `${r.name} ${r.typeName} ${r.groupName}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              ) &&
                ![['home', nb.portal.areas.home], ...services].some(([, label]) =>
                  label!.toLowerCase().includes(search.toLowerCase()),
                ) && <p>{nb.portal.noResults}</p>}
            </PortalSearch>
          }
        >
          <span className="portal-simulation">{w.free}</span>
          <button type="button" aria-label={c.history} onClick={() => visit('history')}>
            <ServiceIcon kind="notifications" size={19} />
          </button>
          <button type="button" aria-label={nb.portal.limitations} onClick={() => setHelp(true)}>
            <ServiceIcon kind="help" size={17} />
          </button>
          <Link className="portal-workspace-link" href="/portal">
            {w.course}
          </Link>
          <Link className="portal-workspace-link" href="/learn">
            {c.course}
          </Link>
          <AzureLabHomeLink className="portal-workspace-link portal-landing-link" />
        </PortalHeader>
      }
      navigation={
        <PortalNavigation open={menu} label={c.navigation} footer={w.menuNote}>
          <PortalServiceNavigation
            services={catalog}
            current={serviceView ?? view}
            destination={(view) => ({ href: href(view), onSelect: () => visit(view) })}
          />
        </PortalNavigation>
      }
      layers={
        <>
          {' '}
          {reset && world && (
            <PortalDialog title={c.resetTitle} onClose={() => setReset(null)}>
              <p>{temporary ? temp.reset : c.resetNote}</p>
              <button
                disabled={busy}
                onClick={() => {
                  void run(
                    {
                      commandId: crypto.randomUUID(),
                      expectedRevision: reset.revision,
                      command: { type: 'ResetWorkspace' },
                    },
                    reset.workspace,
                  );
                }}
              >
                {c.confirmReset}
              </button>
              <button onClick={() => setReset(null)}>{c.cancel}</button>
            </PortalDialog>
          )}
          {newWorkspace && (
            <PortalDialog title={topologyCopy.newWorkspace} onClose={() => setNewWorkspace(false)}>
              <p>{topologyCopy.newWorkspaceNote}</p>
              <button
                className="primary"
                disabled={busy}
                onClick={() => {
                  void start(true);
                }}
              >
                {topologyCopy.newWorkspace}
              </button>
              <button onClick={() => setNewWorkspace(false)}>{c.cancel}</button>
            </PortalDialog>
          )}
          {help && (
            <PortalDialog title={nb.portal.limitations} onClose={() => setHelp(false)}>
              <p>{w.scopeNote}</p>
              <p>{c.limits}</p>
              <p>{temporary || !snapshot ? temp.limits : c.startNote}</p>
            </PortalDialog>
          )}
        </>
      }
    >
      <PortalBreadcrumbs>
        <button type="button" onClick={() => visit('home')}>
          {nb.portal.areas.home}
        </button>
        <ServiceIcon kind="next" size={12} />
        <button type="button" onClick={() => visit(serviceView ?? 'groups')}>
          {services.find(([key]) => key === serviceView)?.[1] ?? title}
        </button>
        {parent && (
          <>
            <ServiceIcon kind="next" size={12} />
            <button type="button" onClick={() => visit(parent.view, parent.id)}>
              {parent.name}
            </button>
          </>
        )}
        {resource && (
          <>
            <ServiceIcon kind="next" size={12} />
            <span>{resource.name}</span>
          </>
        )}
      </PortalBreadcrumbs>
      {query.get('studio') === '1' && view !== 'studio' && (
        <p className="studio-return">
          <Link href={studioReturn(query)}>{studioCopy.back}</Link>
        </p>
      )}
      {!form && (
        <PortalTitle
          id="lab-page-title"
          title={title}
          headingRef={resultRef}
          icon={<ServiceIcon kind={titleIcon} size={28} />}
          subtitle={resource ? `${resource.typeName} · ${modeNote}` : modeNote}
        />
      )}
      <div className="portal-content">
        <div className="portal-view">
          {loading && <p role="status">{c.loading}</p>}
          {error &&
            (!snapshot && ['backend-unavailable', 'server-result-unavailable'].includes(error) ? (
              <details className="lab-storage-status" open aria-label="Serverlagring">
                <summary>{temp.persistentUnavailable}</summary>
                <p className="lab-alert">
                  <span role="alert">{message(error)}</span>
                  {error === 'backend-unavailable' &&
                    c.unavailable.slice(c.codes['backend-unavailable'].length)}
                </p>
              </details>
            ) : (
              <div role="alert" className="lab-alert">
                <p>{message(error)}</p>
                {pendingView && (
                  <button
                    disabled={busy}
                    onClick={() => {
                      const action = pending.current;
                      if (action) void run(action.request, action.workspace);
                    }}
                  >
                    {c.retry}
                  </button>
                )}
              </div>
            ))}
          {!snapshot && !loading && (
            <section>
              <div className="lab-temporary-entry">
                <button type="button" disabled={busy} onClick={() => void startTemporary()}>
                  {temp.start}
                </button>
                <p>{temp.entry}</p>
              </div>
              {!['backend-unavailable', 'server-result-unavailable'].includes(error) && (
                <p>{c.startNote}</p>
              )}
              <details className="lab-model-choice">
                <summary>Tidligere arbeidsområdemodeller</summary>
                <label>
                  Arbeidsområdemodell
                  <select
                    value={startModel}
                    onChange={(e) => setStartModel(e.target.value as Model)}
                  >
                    <option value={remediationModel}>3.6 · Security Rule Lifecycle</option>
                    <option value={topologyModel}>3.7 · Topology Remediation</option>
                    <option value={laboratoryModel}>
                      3.5 · Storage, Networking, Compute og Firewall A
                    </option>
                    <option value="laboratory@3.4.0">3.4 · Storage, Networking og Compute A</option>
                    <option value="laboratory@3.3.0">3.3 · Storage og Networking A/B/C</option>
                    <option value="laboratory@3.2.0">3.2 · Storage og Networking A/B</option>
                    <option value="laboratory@3.1.0">3.1 · Storage og Networking A</option>
                    <option value="laboratory@3.0.0">3.0 · Storage</option>
                  </select>
                </label>
                <p>
                  Valget gjelder bare et nytt arbeidsområde. Eksisterende sesjon gjenopptas uten
                  oppgradering.
                </p>
              </details>
              <button
                disabled={busy || error === 'backend-unavailable'}
                onClick={() => {
                  void start();
                }}
              >
                {c.start}
              </button>
            </section>
          )}

          {snapshot && world && (
            <>
              {!network && <p className="lab-network-boundary">{n.legacy}</p>}
              {world.model !== topologyModel && ['groups', 'services'].includes(view) && (
                <div className="lab-network-boundary">
                  <p>{topologyCopy.legacy}</p>
                  <button
                    disabled={busy || !!pendingView || !!error}
                    onClick={() => setNewWorkspace(true)}
                  >
                    {topologyCopy.newWorkspace}
                  </button>
                </div>
              )}
              {form ? (
                <PortalCreateLayout
                  className="lab-form"
                  intro={w.createNote}
                  title={
                    <PortalTitle
                      id="lab-page-title"
                      title={operation(form!)}
                      headingRef={formHeading}
                      subtitle={modeNote}
                      icon={<ServiceIcon kind={formIcon} size={28} />}
                    />
                  }
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void review();
                    }}
                  >
                    <fieldset disabled={busy || !!pendingView}>
                      {![
                        'SetPeeringForwardedTraffic',
                        'DeleteRoute',
                        'AssociateNicNsg',
                        'DisassociateNicNsg',
                        'AssociateSubnetNsg',
                        'DisassociateSubnetNsg',
                        'AssociateSubnetRouteTable',
                        'DisassociateSubnetRouteTable',
                      ].includes(form) &&
                        field(
                          'name',
                          c.name,
                          undefined,
                          form === 'CreateAzureFirewall'
                            ? f.nameNote
                            : form === 'CreateStorageAccount'
                              ? c.accountLimit
                              : form === 'CreateBlobContainer'
                                ? c.containerLimit
                                : form === 'CreateTextBlob'
                                  ? c.blobLimit
                                  : undefined,
                        )}
                      {firewall &&
                        firewallFields[form] &&
                        firewallFields[form]!.filter((k) => !['type', 'name'].includes(k)).map(
                          (key) =>
                            field(
                              key,
                              label(key),
                              firewallOptions(firewall, key),
                              key === 'priority' ? f.priorityNote : undefined,
                            ),
                        )}
                      {firewall && form === 'CreateAzureFirewall' && (
                        <>
                          <p>{f.publicNote}</p>
                          <p>{f.privateNote}</p>
                        </>
                      )}
                      {compute && form === 'CreateVirtualMachine' && (
                        <>
                          {field(
                            'groupId',
                            c.group,
                            world.groups.map((g) => [g.id, groupScope(g.id)]),
                          )}
                          {field('region', c.region, regions)}
                          {field(
                            'image',
                            m.image,
                            images.map((x) => [x.id, x.name]),
                            m.imageNote,
                          )}
                          {field(
                            'size',
                            m.size,
                            sizes.map((x) => [
                              x.id,
                              `${x.id} · ${x.vcpus} vCPU / ${x.memoryGiB} GiB`,
                            ]),
                          )}
                          {field(
                            'vnetId',
                            n.vnet,
                            compute.vnets.map((v) => [v.id, vnetScope(v.id)]),
                          )}
                          {field(
                            'subnetId',
                            n.subnet,
                            compute.subnets
                              .filter((x) => x.vnetId === values.vnetId)
                              .map((x) => [x.id, `${x.name} · ${x.addressPrefix}`]),
                          )}
                          {field(
                            'privateIpAddress',
                            e.fields.privateIpAddress,
                            undefined,
                            m.staticNote,
                          )}
                          {field('allocation', e.fields.allocation, [['Static', 'Static']])}
                          {field('nsgId', n.nsg, [
                            ['none', m.none],
                            ...compute.nsgs.map(
                              (x) =>
                                [x.id, `${x.name} · ${groupScope(x.groupId)} · ${x.region}`] as [
                                  string,
                                  string,
                                ],
                            ),
                          ])}
                          {field('osDiskSku', m.osDiskSku, [
                            ['StandardSSD_LRS', 'Standard SSD LRS'],
                          ])}
                          {field(
                            'osDiskSizeGiB',
                            m.osDiskSizeGiB,
                            diskSizes.map((x) => [x, x]),
                          )}
                          <p>
                            {m.nameNote} {m.childNote}
                          </p>
                          <PropertyList
                            items={[
                              [m.nicName, childNames(values.name ?? '').nic],
                              [m.osDiskName, childNames(values.name ?? '').disk],
                            ]}
                          />
                          <p>{m.boundary}</p>
                        </>
                      )}
                      {endpoints && endpointFields[form] && (
                        <>
                          {form === 'CreateNetworkInterface' && (
                            <>
                              {field(
                                'groupId',
                                c.group,
                                world.groups.map((g) => [g.id, groupScope(g.id)]),
                              )}
                              {field('region', c.region, regions)}
                              {field(
                                'vnetId',
                                n.vnet,
                                endpoints.vnets.map((v) => [v.id, vnetScope(v.id)]),
                              )}
                              {field(
                                'subnetId',
                                n.subnet,
                                endpoints.subnets
                                  .filter((x) => x.vnetId === values.vnetId)
                                  .map((x) => [x.id, `${x.name} · ${x.addressPrefix}`]),
                              )}
                              {field(
                                'privateIpAddress',
                                e.fields.privateIpAddress,
                                undefined,
                                e.ipNote,
                              )}
                              {field('allocation', e.fields.allocation, [['Static', 'Static']])}
                              <p className="lab-form-note">
                                {e.nameNote} {e.boundary}
                              </p>
                            </>
                          )}
                          {['AssociateNicNsg', 'DisassociateNicNsg'].includes(form) && (
                            <>
                              {field(
                                'nicId',
                                e.nic,
                                endpoints.nics.map((x) => [
                                  x.id,
                                  `${x.name} · ${x.privateIpAddress} · ${groupScope(x.groupId)}`,
                                ]),
                              )}
                              {form === 'AssociateNicNsg' &&
                                field(
                                  'nsgId',
                                  n.nsg,
                                  endpoints.nsgs.map((x) => [
                                    x.id,
                                    `${x.name} · ${groupScope(x.groupId)} · ${x.region}`,
                                  ]),
                                )}
                              <p className="lab-form-note">{e.associationNote}</p>
                            </>
                          )}
                        </>
                      )}
                      {network && networkFields[form] && (
                        <>
                          {['CreateVirtualNetwork', 'CreateNetworkSecurityGroup'].includes(
                            form,
                          ) && (
                            <>
                              {field(
                                'groupId',
                                c.group,
                                world.groups.map((g) => [g.id, groupScope(g.id)]),
                              )}
                              {field('region', c.region, regions)}
                            </>
                          )}
                          {form === 'CreateVirtualNetwork' &&
                            field('addressSpace', n.addressSpace, undefined, n.privateLimit)}
                          {form === 'CreateSubnet' && (
                            <>
                              {field(
                                'vnetId',
                                n.vnet,
                                network.vnets.map((v) => [v.id, vnetScope(v.id)]),
                              )}
                              {field(
                                'addressPrefix',
                                n.addressPrefix,
                                undefined,
                                firewall ? f.subnetNote : n.subnetLimit,
                              )}
                            </>
                          )}
                          {form === 'CreateSecurityRule' && (
                            <>
                              {field(
                                'nsgId',
                                n.nsg,
                                network.nsgs.map((g) => [
                                  g.id,
                                  `${g.name} · ${groupScope(g.groupId)} · ${g.region}`,
                                ]),
                              )}
                              {field('direction', n.direction, [
                                ['Inbound', 'Inbound'],
                                ['Outbound', 'Outbound'],
                              ])}
                              {field('priority', n.priority)}
                              {field('protocol', n.protocol, [
                                ['Tcp', 'TCP'],
                                ['Udp', 'UDP'],
                                ['*', 'Any'],
                              ])}
                              {field('source', n.source)}
                              {field('sourcePort', n.sourcePort)}
                              {field('destination', n.destination)}
                              {field('destinationPort', n.destinationPort)}
                              {field('access', n.access, [
                                ['Allow', 'Allow'],
                                ['Deny', 'Deny'],
                              ])}
                              <p className="lab-form-note">{n.ruleLimit}</p>
                            </>
                          )}
                          {form === 'AssociateSubnetNsg' && (
                            <>
                              {field(
                                'subnetId',
                                n.subnet,
                                network.subnets.map((x) => [
                                  x.id,
                                  `${x.name} · ${vnetScope(x.vnetId)}`,
                                ]),
                              )}
                              {field(
                                'nsgId',
                                n.nsg,
                                network.nsgs.map((x) => [
                                  x.id,
                                  `${x.name} · ${groupScope(x.groupId)} · ${x.region}`,
                                ]),
                              )}
                              <p className="lab-form-note">{n.associationLimit}</p>
                            </>
                          )}
                        </>
                      )}
                      {routing && routingFields[form] && (
                        <>
                          {form === 'CreateRouteTable' && (
                            <>
                              {field(
                                'groupId',
                                c.group,
                                world.groups.map((g) => [g.id, groupScope(g.id)]),
                              )}
                              {field('region', c.region, regions)}
                            </>
                          )}
                          {form === 'CreateVnetPeering' && (
                            <>
                              {field(
                                'vnetId',
                                n.vnet,
                                routing.vnets.map((v) => [v.id, vnetScope(v.id)]),
                              )}
                              {field(
                                'remoteVnetId',
                                r.fields.remoteVnetId,
                                routing.vnets.map((v) => [v.id, vnetScope(v.id)]),
                              )}
                              <p>{r.peeringNote}</p>
                            </>
                          )}
                          {form === 'CreateRoute' && (
                            <>
                              {field(
                                'routeTableId',
                                r.table,
                                routing.routeTables.map((t) => [
                                  t.id,
                                  `${t.name} · ${groupScope(t.groupId)} · ${t.region}`,
                                ]),
                              )}
                              {field('addressPrefix', n.addressPrefix)}
                              {field('nextHopType', r.fields.nextHopType, [
                                ['VnetLocal', 'Virtual network'],
                                ['Internet', 'Internet'],
                                ['None', 'None · dropp'],
                                ...(firewall
                                  ? [
                                      [
                                        'VirtualAppliance',
                                        'Virtual appliance · modellert Firewall',
                                      ] as [string, string],
                                    ]
                                  : []),
                              ])}
                              {firewall && values.nextHopType === 'VirtualAppliance' && (
                                <>
                                  {field(
                                    'firewallId',
                                    f.fields.firewallId,
                                    firewallOptions(firewall, 'firewallId'),
                                  )}
                                  {field('nextHopIp', f.fields.nextHopIp)}
                                </>
                              )}
                              <p>{firewall ? f.routeNote : r.routeNote}</p>
                            </>
                          )}
                          {['AssociateSubnetRouteTable', 'DisassociateSubnetRouteTable'].includes(
                            form,
                          ) && (
                            <>
                              {field(
                                'subnetId',
                                n.subnet,
                                routing.subnets.map((s) => [
                                  s.id,
                                  `${s.name} · ${vnetScope(s.vnetId)}`,
                                ]),
                              )}
                              {form === 'AssociateSubnetRouteTable' &&
                                field(
                                  'routeTableId',
                                  r.table,
                                  routing.routeTables.map((t) => [
                                    t.id,
                                    `${t.name} · ${groupScope(t.groupId)} · ${t.region}`,
                                  ]),
                                )}
                              <p>{r.association}</p>
                            </>
                          )}
                        </>
                      )}
                      {form === 'CreateGroup' && (
                        <>
                          {field('subscriptionId', c.subscription, [
                            ['sub-shared', 'Shared Sandbox'],
                            ['sub-app', 'App Sandbox'],
                          ])}
                          {field('metadataRegion', c.region, regions)}
                        </>
                      )}
                      {form === 'CreateStorageAccount' && (
                        <>
                          {field(
                            'groupId',
                            c.group,
                            world.groups.map((g) => [g.id, g.name]),
                          )}
                          {field('region', c.region, regions)}
                          {field('kind', c.kind, [['StorageV2', 'StorageV2']])}
                          {field('sku', c.sku, [['Standard_LRS', 'Standard_LRS']])}
                        </>
                      )}
                      {form === 'CreateBlobContainer' && (
                        <>
                          {field(
                            'accountId',
                            c.account,
                            world.accounts.map((a) => [a.id, a.name]),
                          )}
                          {field('access', c.access, [['private', 'Private']])}
                        </>
                      )}
                      {form === 'CreateTextBlob' && (
                        <>
                          {field(
                            'containerId',
                            c.container,
                            world.containers.map((a) => [a.id, a.name]),
                          )}
                          {field('text', c.text, undefined, c.textLimit)}
                          {field('contentType', c.contentType, [['text/plain', 'text/plain']])}
                        </>
                      )}
                      <PortalCreateActions>
                        <button type="submit" className="primary" disabled={busy}>
                          {c.review}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setForm(null);
                            setPreview(null);
                          }}
                        >
                          {c.cancel}
                        </button>
                      </PortalCreateActions>
                    </fieldset>
                  </form>
                  {preview && (
                    <section className="lab-review" aria-label={c.review}>
                      <h2 ref={reviewHeading} tabIndex={-1}>
                        {c.review}
                      </h2>
                      <p>{c.reviewNote}</p>
                      <p>
                        {preview.receipt.outcome === 'accepted'
                          ? w.reviewAccepted
                          : message(preview.receipt.code, preview.request.command.type)}{' '}
                        {preview.receipt.field && label(preview.receipt.field)}
                      </p>
                      <PropertyList
                        items={Object.entries(preview.request.command).map(([k, v]) => [
                          label(k),
                          k === 'image'
                            ? (images.find((x) => x.id === v)?.name ?? v)
                            : k === 'nsgId' && v === 'none'
                              ? m.none
                              : records.find((x) => x.id === v)
                                ? `${records.find((x) => x.id === v)!.name} · ${v}`
                                : v,
                        ])}
                      />
                      {preview.request.command.type === 'CreateVirtualMachine' && (
                        <PropertyList
                          items={[
                            [m.nicName, childNames(preview.request.command.name).nic],
                            [m.osDiskName, childNames(preview.request.command.name).disk],
                            [
                              'VNet',
                              compute?.vnets.find(
                                (v) =>
                                  v.id ===
                                  compute.subnets.find(
                                    (x) =>
                                      x.id ===
                                      (
                                        preview.request
                                          .command as import('@/laboratory/v34/contract').ComputeCommand
                                      ).subnetId,
                                  )?.vnetId,
                              )?.name,
                            ],
                          ]}
                        />
                      )}
                      <button
                        className="primary"
                        disabled={busy || preview.receipt.outcome !== 'accepted' || !!error}
                        onClick={() => {
                          void run(preview.request, preview.workspace);
                        }}
                      >
                        {[
                          'SetPeeringForwardedTraffic',
                          'DeleteRoute',
                          'AssociateNicNsg',
                          'DisassociateNicNsg',
                          'AssociateSubnetNsg',
                          'AssociateSubnetRouteTable',
                          'DisassociateSubnetRouteTable',
                        ].includes(form)
                          ? n.apply
                          : c.create}
                      </button>
                    </section>
                  )}
                </PortalCreateLayout>
              ) : resource ? (
                <PortalResourceLayout
                  menu={
                    <PortalResourceMenu
                      key={resource.id}
                      name={resource.name}
                      icon={resource.kind}
                      items={[
                        {
                          key: 'overview',
                          label: nb.portal.overview,
                          icon: resource.kind,
                          active: section === 'overview',
                          onSelect: () => router.push(href(view, id ?? undefined)),
                        },
                        {
                          key: 'history',
                          label: nb.portal.areas.activity,
                          icon: 'activity',
                          onSelect: () => visit('history', undefined, resource.origin),
                        },
                        ...(compute && resource.view === 'vm'
                          ? [
                              {
                                key: 'networking',
                                label: m.network,
                                icon: 'nic',
                                active: section === 'networking',
                                onSelect: () =>
                                  router.push(href(view, id ?? undefined) + '&section=networking'),
                              },
                            ]
                          : []),
                        ...(routing && resource.view === 'vnet'
                          ? [
                              {
                                key: 'peerings',
                                label: r.peerings,
                                icon: 'peering',
                                onSelect: () => visit('peerings', resource.id),
                              },
                            ]
                          : []),
                        {
                          key: 'properties',
                          label: nb.portalUi.properties,
                          icon: 'properties',
                          settings: true,
                          active: section === 'properties',
                          onSelect: () =>
                            router.push(href(view, id ?? undefined) + '&section=properties'),
                        },
                      ]}
                      footer={w.localScope}
                    />
                  }
                >
                  {section === 'properties' ? (
                    <>
                      <h2>{nb.portalUi.properties}</h2>
                      <PropertyList
                        items={Object.entries(resource.source).map(([key, value]) => [
                          resource.view === 'disk' && key === 'sku' ? m.osDiskSku : label(key),
                          value === null ? (
                            '—'
                          ) : [
                              'origin',
                              'associationOrigin',
                              'routeAssociationOrigin',
                              'forwardingOrigin',
                            ].includes(key) ? (
                            receiptLink(String(value))
                          ) : ((compute && ['vm', 'disk'].includes(resource.view)) ||
                              (firewall &&
                                [
                                  'firewall',
                                  'firewallPolicy',
                                  'firewallGroup',
                                  'firewallCollection',
                                  'firewallRule',
                                  'publicIp',
                                ].includes(resource.view))) &&
                            [
                              'policyId',
                              'collectionGroupId',
                              'collectionId',
                              'firewallId',
                              'publicIpId',
                              'nicId',
                              'osDiskId',
                              'subnetId',
                              'vnetId',
                              'groupId',
                              'nsgId',
                              'routeTableId',
                            ].includes(key) &&
                            records.some((r) => r.id === value) ? (
                            <Link
                              href={href(records.find((r) => r.id === value)!.view, String(value))}
                            >
                              {records.find((r) => r.id === value)!.name} · {String(value)}
                            </Link>
                          ) : typeof value === 'object' ? (
                            JSON.stringify(value)
                          ) : (
                            String(value)
                          ),
                        ])}
                      />
                    </>
                  ) : (
                    <>
                      {!!actions.length && (
                        <div className="portal-commandbar">
                          {actions.map(([type, label]) => (
                            <button
                              key={type}
                              type="button"
                              disabled={busy || !!error}
                              onClick={() => begin(type)}
                            >
                              <ServiceIcon kind="create" />
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                      {body}
                    </>
                  )}
                </PortalResourceLayout>
              ) : (
                body
              )}
            </>
          )}
          {busy && <p role="status">{c.busy}</p>}
        </div>
      </div>
      <footer className="portal-footer laboratory-workspace-status">
        <span>{w.free}</span>
        {ephemeralActive() && (
          <span className="lab-ephemeral-status" role="status">
            {temp.status}
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            void load();
          }}
          disabled={busy}
        >
          <ServiceIcon kind="refresh" size={15} />
          {temporary ? temp.refresh : c.refresh}
        </button>
        {world && (
          <>
            <span className="lab-model-note">
              {c.revision}: {world.revision} · {c.attempt}: {world.attempt} · {n.model}:{' '}
              {world.model}
            </span>
            <button
              type="button"
              disabled={busy || !!error}
              onClick={() => setReset({ workspace: snapshot!.workspace, revision: world.revision })}
            >
              {c.reset}
            </button>
          </>
        )}
      </footer>
    </PortalFrame>
  );
}
