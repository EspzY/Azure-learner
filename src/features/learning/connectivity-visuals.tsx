'use client';
import { connectivityNb as c } from '@/content/nb';
import {
  runHybrid,
  runEndpoint,
  validHybrid,
  type ConnectivityInput,
  type HybridInput,
  type EndpointInput,
} from '@/domain/curriculum/connectivity-model';
import { resolvePortalIcon } from '@/features/portal/service-icon';

const yes = (value: boolean) => (value ? c.model.yes : c.model.no);

function VnetIdentity({ x, y }: { x: number; y: number }) {
  const asset = resolvePortalIcon('vnet');
  return asset ? (
    <image
      href={`/icons/${asset.file}`}
      x={x}
      y={y}
      width={36}
      height={36}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    />
  ) : null;
}

/** Original mechanism illustration: lanes show transport boundaries, not measured traffic. */
function HybridFigure({ input: i }: { input: HybridInput }) {
  const r = runHybrid(i)!;
  return (
    <figure className="connectivity-hybrid-figure">
      <svg viewBox="0 0 920 390" role="img" aria-label={c.model.hybrid}>
        <path className="connectivity-cloud-boundary" d="M678 28h214v330H678z" />
        <text x="785" y="55" textAnchor="middle">
          {c.model.vnet}
        </text>
        <VnetIdentity x={768} y={70} />
        <g className="connectivity-office" aria-hidden="true">
          <path d="M27 170h88v126H27zM13 296h118M42 186h13v16H42zM80 186h13v16H80zM42 221h13v16H42zM80 221h13v16H80zM61 260h21v36H61z" />
        </g>
        <text x="73" y="327" textAnchor="middle">
          {c.model.onPrem}
        </text>
        <g
          className={`connectivity-route ${r.viaVpn ? 'is-selected' : ''} ${r.viaVpn && !r.transportReady ? 'is-broken' : ''}`}
        >
          <path d="M115 191h96M327 191h100M557 191h154" />
          <circle cx="269" cy="191" r="57" />
          <path
            className="connectivity-globe-lines"
            d="M212 191h114M219 166h100M219 216h100M269 135c-38 23-38 89 0 113M269 135c38 23 38 89 0 113"
          />
          <path
            className="connectivity-gateway"
            d="M438 158h111v68H438zM449 171h22m0 42h-22m83-42h-22m0 42h22"
          />
          <text x="269" y="111" textAnchor="middle">
            {r.medium === 'microsoft' ? c.model.microsoftTransport : c.model.publicTransport}
          </text>
          <text x="494" y="253" textAnchor="middle">
            {c.model.options.transport[0]}
          </text>
          <text x="494" y="277" textAnchor="middle">
            {
              c.model.options.vpnMode[
                ['s2s', 'p2s', 'vnet'].indexOf(r.usedBackup ? 's2s' : i.vpnMode)
              ]
            }
          </text>
          <path
            className="connectivity-lock"
            d="M372 169v-10a10 10 0 0 1 20 0v10m-24 0h28v25h-28z"
          />
          <text x="382" y="226" textAnchor="middle">
            {c.model.tunnelEncryption}
          </text>
        </g>
        <g
          className={`connectivity-route ${!r.viaVpn ? 'is-selected' : ''} ${!r.viaVpn && !r.transportReady ? 'is-broken' : ''}`}
        >
          <path d="M115 275l88 38h353l154-38" />
          <path
            className="connectivity-provider"
            d="M243 281h122v64H243zM257 293h94m-94 14h94m-94 14h94"
          />
          <text x="304" y="369" textAnchor="middle">
            {c.model.provider}
          </text>
          <text x="493" y="338" textAnchor="middle">
            {c.model.options.transport[1]}
          </text>
        </g>
        <path className="connectivity-vnet" d="M720 149h138v141H720z" />
        <path
          className="connectivity-vnet-mark"
          d="M740 218h99m-74-28-24 28 24 28m50-56 24 28-24 28"
        />
        <text x="787" y="319" textAnchor="middle">
          {c.model.gateway}
        </text>
        {!r.knownPath && (
          <g
            className="connectivity-failure"
            aria-hidden="true"
            transform={`translate(${r.transportReady ? 645 : r.viaVpn ? 382 : 425} ${r.viaVpn ? 191 : 313})`}
          >
            <path d="M-13-14l26 28m0-28-26 28" />
          </g>
        )}
      </svg>
      <figcaption>
        <strong>{r.viaVpn ? c.model.options.transport[0] : c.model.options.transport[1]}</strong> ·{' '}
        {c.model.outcome[r.outcome]}
        <span>{c.model.noRuntime}</span>
      </figcaption>
    </figure>
  );
}

function HybridResult({ input }: { input: HybridInput }) {
  const r = runHybrid(input)!;
  const checks = [
    'transportReady',
    'modeFits',
    'privateTransport',
    'encrypted',
    'linkEncrypted',
    'usedBackup',
    'knownPath',
    'permitted',
    'requirementsMet',
  ] as const;
  return (
    <section className="connectivity-result" aria-label={c.model.hybrid}>
      <HybridFigure input={input} />
      <dl className="connectivity-checks">
        {checks.map((key) => {
          const unknown = key === 'permitted' && input.access === 'unknown';
          return (
            <div key={key} data-state={r[key] ? 'yes' : unknown ? 'unknown' : 'no'}>
              <dt>{c.model.resultLabel[key]}</dt>
              <dd>{unknown ? c.model.unknown : yes(r[key])}</dd>
            </div>
          );
        })}
      </dl>
      <table className="connectivity-table">
        <caption>{c.model.hybrid}</caption>
        <thead>
          <tr>
            <th>{c.model.labels.transport}</th>
            <th>{c.model.transportMedium}</th>
            <th>{c.model.resultLabel.encrypted}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              {c.model.options.vpnMode[0]} / {c.model.options.vpnMode[1]}
            </th>
            <td>{c.model.publicTransport}</td>
            <td>{c.model.yes}</td>
          </tr>
          <tr>
            <th>{c.model.options.vpnMode[2]}</th>
            <td>{c.model.microsoftTransport}</td>
            <td>{c.model.yes}</td>
          </tr>
          <tr>
            <th>{c.model.options.transport[1]}</th>
            <td>{c.model.privateTransport}</td>
            <td>{c.model.options.encryption[0]}</td>
          </tr>
        </tbody>
      </table>
      <p className="compute-boundary">{c.model.linkOnly}</p>
      <p className="connectivity-verdict" role="status">
        {c.model.outcome[r.outcome]}
      </p>
      <p>{c.model.noRuntime}</p>
    </section>
  );
}

/** DNS chooses an entry; each subsequent condition has a separate declared state. */
function EndpointResult({ input: i }: { input: EndpointInput }) {
  const r = runEndpoint(i)!;
  const stages = [
    { value: c.model.client, state: 'yes' },
    {
      value: c.model.options.dns[['public', 'private', 'missing', 'wrong'].indexOf(i.dns)],
      state: r.resolved ? 'yes' : 'no',
    },
    { value: r.resolvedAddress ?? '—', state: r.endpointMatch ? 'yes' : 'no' },
    { value: c.model.resultLabel.knownPath, state: r.knownPath ? 'yes' : 'no' },
    {
      value: c.model.resultLabel.endpointControls,
      state: r.endpointControls
        ? 'yes'
        : r.endpointReady && r.publicAllowed && i.networkRule === 'unknown'
          ? 'unknown'
          : 'no',
    },
    {
      value: c.model.options.appAuth[['allow', 'deny', 'unknown'].indexOf(i.appAuth)],
      state: r.applicationAllowed ? 'yes' : i.appAuth === 'unknown' ? 'unknown' : 'no',
    },
    {
      value: c.model.options.response[i.response === 'assumed' ? 0 : 1],
      state: r.responseAssumed ? 'assumed' : 'unknown',
    },
  ];
  const checks = [
    'resolved',
    'endpointMatch',
    'endpointReady',
    'knownPath',
    'endpointControls',
    'applicationAllowed',
    'networkAllowed',
    'authorized',
    'requirementsMet',
    'responseAssumed',
  ] as const;
  return (
    <section className="connectivity-result" aria-label={c.model.endpoint}>
      <figure className="connectivity-entry-figure">
        <div className="connectivity-entry-client">
          <strong>{c.model.client}</strong>
          <span>catalog.training.example</span>
        </div>
        <div className="connectivity-entry-choice" aria-hidden="true">
          →
        </div>
        <div className="connectivity-entry-lanes">
          <div data-selected={r.actualEndpoint === 'public'}>
            <b>{c.model.options.endpoint[0]}</b>
            <code>203.0.113.24</code>
            <span>
              {
                c.model.options.publicAccess[
                  ['enabled', 'disabled', 'selected'].indexOf(i.publicAccess)
                ]
              }
            </span>
          </div>
          <div data-selected={r.actualEndpoint === 'private'}>
            <b>{c.model.options.endpoint[1]}</b>
            <code>10.87.4.12</code>
            <span>
              {
                c.model.options.privateState[
                  ['absent', 'pending', 'approved'].indexOf(i.privateState)
                ]
              }
            </span>
          </div>
        </div>
        <div className="connectivity-entry-choice" aria-hidden="true">
          →
        </div>
        <div className="connectivity-entry-service">
          <strong>{c.model.service}</strong>
          <span>{c.model.noRuntime}</span>
        </div>
        <figcaption>
          <span>
            {c.model.labels.endpoint}: {c.model.options.endpoint[i.endpoint === 'public' ? 0 : 1]}
          </span>
          <span>
            {c.model.actualEndpoint}:{' '}
            {r.actualEndpoint === null
              ? c.model.unknown
              : c.model.options.endpoint[r.actualEndpoint === 'public' ? 0 : 1]}
          </span>
          <span>
            {c.model.labels.dns}: {r.resolvedAddress ?? c.model.unknown}
          </span>
        </figcaption>
      </figure>
      <ol className="connectivity-pipeline">
        {stages.map((stage, index) => (
          <li key={index} data-state={stage.state}>
            <span className="connectivity-stage-number">0{index + 1}</span>
            <h5>{c.model.stageLabels[index]}</h5>
            <strong>{stage.value}</strong>
            <span>
              {stage.state === 'yes'
                ? c.model.yes
                : stage.state === 'no'
                  ? c.model.no
                  : stage.state === 'assumed'
                    ? c.model.options.response[0]
                    : c.model.unknown}
            </span>
          </li>
        ))}
      </ol>
      <dl className="connectivity-checks">
        {checks.map((key) => {
          const endpointUnknown = r.endpointReady && r.publicAllowed && i.networkRule === 'unknown',
            networkUnknown = r.knownPath && endpointUnknown,
            combinedUnknown =
              (r.networkAllowed && i.appAuth === 'unknown') ||
              (networkUnknown && i.appAuth !== 'deny');
          const unknown =
            !r[key] &&
            (key === 'responseAssumed' ||
              (key === 'endpointControls' && endpointUnknown) ||
              (key === 'applicationAllowed' && i.appAuth === 'unknown') ||
              (key === 'networkAllowed' && networkUnknown) ||
              (key === 'authorized' && combinedUnknown) ||
              (key === 'requirementsMet' && r.endpointMatch && combinedUnknown));
          return (
            <div key={key} data-state={r[key] ? 'yes' : unknown ? 'unknown' : 'no'}>
              <dt>{c.model.resultLabel[key]}</dt>
              <dd>{unknown ? c.model.unknown : yes(r[key])}</dd>
            </div>
          );
        })}
      </dl>
      <p className="connectivity-verdict" role="status">
        {c.model.outcome[r.outcome]}
      </p>
      <p>{c.model.noRuntime}</p>
    </section>
  );
}

export function ConnectivityModelResult({ input }: { input: ConnectivityInput }) {
  return validHybrid(input) ? <HybridResult input={input} /> : <EndpointResult input={input} />;
}
