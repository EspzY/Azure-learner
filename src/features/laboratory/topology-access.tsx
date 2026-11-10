'use client';
import { useWorkspaceNavigation } from './workspace-context';
import Link from 'next/link';
import { PortalTable } from '@/features/portal/presentation';
import { laboratoryTopologyNb as t } from '@/content/laboratory-topology-nb';
import type { AccessCheck } from '@/laboratory/v37/analysis';
/** Original server analysis only, never a client policy evaluator. */
export function TopologyAccess({
  analysis,
}: {
  analysis: { accessChecks: AccessCheck[]; accessEvaluation: string };
}) {
  const { href } = useWorkspaceNavigation();
  if (!analysis.accessChecks.length) return null;
  return (
    <section className="lab-topology-access" aria-label={t.accessTitle}>
      {analysis.accessEvaluation === 'undetermined' && (
        <p className="lab-network-boundary">{t.accessLimit}</p>
      )}
      <details>
        <summary>
          {t.accessTitle} · {analysis.accessChecks.length}
        </summary>
        {analysis.accessEvaluation !== 'undetermined' && <p>{t.accessEnabled}</p>}
        <PortalTable
          caption={t.accessTitle}
          rows={analysis.accessChecks.map((p) => ({ ...p, id: p.peeringId }))}
          columns={[
            {
              key: 'id',
              label: t.identity,
              cell: (p) => <Link href={href('peering', p.peeringId)}>{p.peeringId}</Link>,
            },
            { key: 'local', label: t.localVnet, cell: (p) => p.localVnetId },
            { key: 'remote', label: t.remoteVnet, cell: (p) => p.remoteVnetId },
            {
              key: 'access',
              label: t.fields.value,
              cell: (p) => String(p.allowVirtualNetworkAccess),
            },
            {
              key: 'forwarding',
              label: 'Allow forwarded traffic',
              cell: (p) => String(p.allowForwardedTraffic),
            },
          ]}
        />
      </details>
    </section>
  );
}
