'use client';
import { networkingNb as c } from '@/content/nb';
import { resolvePortalIcon } from '@/features/portal/service-icon';
import {
  address,
  cidr,
  runAddress,
  runPeering,
  runDns,
  type NetworkInput,
} from '@/domain/curriculum/networking-model';
const value = (b: boolean) => (b ? c.model.yes : c.model.no);
/** Same approved original local asset register as the operational Portal. */
function NetworkIdentity({
  kind,
  x,
  y,
  size = 32,
}: {
  kind: string;
  x: number;
  y: number;
  size?: number;
}) {
  const asset = resolvePortalIcon(kind);
  return asset?.family === 'azure' ? (
    <image
      href={`/icons/${asset.file}`}
      x={x}
      y={y}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    />
  ) : (
    <text x={x} y={y} data-icon-missing={kind}>
      ?
    </text>
  );
}
export function NetworkingStructureFigure() {
  return (
    <figure className="network-structure">
      <svg viewBox="0 0 700 245" role="img" aria-label={c.sections.vnet.title}>
        <path className="network-region" d="M172 26h490v190H172z" />
        <path className="network-subnet" d="M210 75h406v103H210z" />
        <path className="network-wire" d="M90 130h164m50 0h75m95 0h75" />
        <NetworkIdentity kind="vm" x={65} y={102} size={48} />
        <NetworkIdentity kind="nic" x={258} y={107} size={44} />
        <NetworkIdentity kind="vnet" x={184} y={36} size={28} />
        <NetworkIdentity kind="subnet" x={216} y={155} size={24} />
        <circle cx="413" cy="130" r="32" className="network-switch" />
        <path d="M397 120h30m-8-7 8 7-8 7m9 12h-30m8-7-8 7 8 7" className="network-arrow" />
        <text x="90" y="185" textAnchor="middle">
          VM
        </text>
        <text x="280" y="94" textAnchor="middle">
          NIC
        </text>
        <text x="413" y="193" textAnchor="middle">
          Subnet ·10.42.1.0/24
        </text>
        <text x="410" y="52" textAnchor="middle">
          VNet ·10.42.0.0/16
        </text>
        <text x="555" y="130" textAnchor="middle">
          subnetId
        </text>
      </svg>
      <figcaption>
        {c.inspection.network} · {c.inspection.noIp} {c.inspection.noTraffic}
      </figcaption>
    </figure>
  );
}
export function NetworkingModelResult({ input }: { input: NetworkInput }) {
  if (input.kind === 'address') {
    const r = runAddress(input)!,
      parent = cidr(input.vnet),
      child = cidr(input.app);
    return (
      <section className="network-result" aria-label={c.model.address}>
        <figure className="network-address-figure">
          <div className="network-address-ruler" aria-hidden="true">
            {Array.from({ length: 32 }, (_, i) => (
              <span
                key={i}
                className={
                  i < (parent?.prefix ?? 0)
                    ? 'network-bit-fixed'
                    : i < (child?.prefix ?? 0)
                      ? 'network-bit-subnet'
                      : 'network-bit-host'
                }
              >
                {i + 1}
              </span>
            ))}
          </div>
          <div className="network-prefix-legend">
            <b>{c.model.bitTitle}</b>
            <span>VNet /{parent?.prefix ?? '—'}</span>
            <span>Subnet /{child?.prefix ?? '—'}</span>
            <span>
              {c.model.hostBits} · {child ? 32 - child.prefix : '—'}
            </span>
          </div>
          <figcaption>{c.model.bitExplain}</figcaption>
        </figure>
        <table className="network-table">
          <caption>{c.model.interval}</caption>
          <thead>
            <tr>
              <th>CIDR</th>
              <th>{c.model.interval}</th>
              <th>{c.model.total}</th>
              <th>{c.model.available}</th>
            </tr>
          </thead>
          <tbody>
            {[input.vnet, input.app, input.data].map((p, i) => {
              const n = cidr(p);
              return (
                <tr key={i}>
                  <th>{p || '—'}</th>
                  <td>{n ? `${address(n.first)} → ${address(n.last)}` : '—'}</td>
                  <td>{n?.total ?? '—'}</td>
                  <td>{i === 0 ? '—' : i === 1 ? (r.appUsable ?? '—') : (r.dataUsable ?? '—')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <dl className="network-checks">
          {(
            ['syntax', 'privateRanges', 'contained', 'overlap', 'subnetSize', 'capacity'] as const
          ).map((k) => (
            <div key={k} data-pass={k === 'overlap' ? !r[k] : r[k]}>
              <dt>{c.model[k]}</dt>
              <dd>{value(r[k])}</dd>
            </div>
          ))}
        </dl>
        <p>{c.model.reservation}</p>
        <p className="network-verdict" role="status">
          {r.outcome === 2 ? c.model.valid : c.model.invalid}
        </p>
      </section>
    );
  }
  if (input.kind === 'peering') {
    const r = runPeering(input)!;
    return (
      <section className="network-result" aria-label={c.model.peering}>
        <figure className="network-topology">
          <svg viewBox="0 0 740 325" role="img" aria-label={c.model.peering}>
            {r.links.map((l) => {
              const coords: readonly [number, number, number, number] =
                l.pair === 'ab'
                  ? [150, 90, 370, 245]
                  : l.pair === 'bc'
                    ? [370, 245, 590, 90]
                    : [150, 90, 590, 90];
              return (
                <g key={l.pair} className={`network-edge network-edge-${l.status}`}>
                  <path d={`M${coords[0]} ${coords[1]}L${coords[2]} ${coords[3]}`} />
                  <text
                    x={(coords[0] + coords[2]) / 2}
                    y={(coords[1] + coords[3]) / 2 - 13}
                    textAnchor="middle"
                  >
                    {l.pair.toUpperCase()} · {l.forward ? '→' : '—'} {l.back ? '←' : '—'}
                  </text>
                </g>
              );
            })}
            {(['a', 'b', 'c'] as const).map((n, i) => {
              const x = i === 0 ? 150 : i === 1 ? 370 : 590,
                y = i === 1 ? 245 : 90;
              return (
                <g key={n}>
                  <path
                    className="network-vnet-node"
                    d={`M${x - 91} ${y - 35}l91-30 91 30v70l-91 30-91-30z`}
                  />
                  <NetworkIdentity kind="vnet" x={x - 14} y={y - 47} size={28} />
                  <text x={x} y={y - 7} textAnchor="middle">
                    VNet {n.toUpperCase()}
                  </text>
                  <text x={x} y={y + 20} textAnchor="middle">
                    {r.networks[n]}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption>
            A → {input.destination.toUpperCase()} ·{' '}
            {r.permitted ? c.model.logical : !r.direct ? c.model.peeringMissing : c.model.partial}
          </figcaption>
        </figure>
        <table className="network-table">
          <caption>{c.model.sides}</caption>
          <thead>
            <tr>
              <th>VNet ↔ VNet</th>
              <th>{c.model.sides}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {r.links.map((l) => (
              <tr key={l.pair}>
                <th>{l.pair.toUpperCase()}</th>
                <td>
                  {l.forward ? '→' : '—'} {l.back ? '←' : '—'}
                </td>
                <td>{c.model.statuses[l.status as keyof typeof c.model.statuses]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="network-checks">
          {(['direct', 'subnet', 'knownPath', 'permitted'] as const).map((k, i) => (
            <div key={k} data-pass={r[k]}>
              <dt>
                {[c.model.direct, c.model.participatingResult, c.model.path, c.model.permitted][i]}
              </dt>
              <dd>{value(r[k])}</dd>
            </div>
          ))}
        </dl>
        {input.scope === 'selected' && <p className="compute-boundary">{c.model.qualification}</p>}
        <p className="network-verdict" role="status">
          {r.permitted ? c.model.logical : !r.direct ? c.model.peeringMissing : c.model.partial}
        </p>
      </section>
    );
  }
  const r = runDns(input)!;
  const stages = [
    {
      text:
        input.zone === 'provided'
          ? c.model.providedHostname
          : input.record === 'cname'
            ? 'alias.training.example'
            : 'archive.training.example',
      ok: true,
    },
    { text: `${input.zone} · ${input.record}`, ok: r.visible && r.resolved },
    { text: r.resolvedAddress ?? '—', ok: r.correctDestination },
    { text: c.model.path, ok: r.knownPath },
    {
      text: c.model.accesses[input.access === 'allow' ? 0 : input.access === 'deny' ? 1 : 2],
      ok: input.access === 'allow',
    },
  ];
  return (
    <section className="network-result" aria-label={c.model.dns}>
      <ol className="network-dns-pipeline">
        {stages.map((s, i) => (
          <li key={i} data-pass={s.ok}>
            <span className="network-stage-number">0{i + 1}</span>
            <h5>{c.model.stages[i]}</h5>
            <strong>{s.text}</strong>
            <span>{value(s.ok)}</span>
          </li>
        ))}
      </ol>
      {r.cnameChain.length > 0 && (
        <p className="network-alias">
          {r.cnameChain.join(' → ')} → {r.resolvedAddress ?? '—'}
        </p>
      )}
      <dl className="network-checks">
        {(
          [
            'visible',
            'resolved',
            'correctDestination',
            'topology',
            'knownPath',
            'permitted',
          ] as const
        ).map((k) => (
          <div key={k} data-pass={r[k]}>
            <dt>
              {k === 'knownPath'
                ? c.model.path
                : k === 'permitted'
                  ? c.model.permitted
                  : c.model[k]}
            </dt>
            <dd>{value(r[k])}</dd>
          </div>
        ))}
      </dl>
      <p className="network-verdict" role="status">
        {!r.resolved ? c.model.resolutionFail : r.permitted ? c.model.logical : c.model.dnsOnly}
      </p>
      <p>{c.model.publicNote}</p>
    </section>
  );
}
