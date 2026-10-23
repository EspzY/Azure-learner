'use client';
import { nb, regionLabels } from '@/content/nb';
import type { Receipt } from '@/domain/chapter01/model';
export function ReceiptPanel({
  receipt,
  onPolicy,
  onEdit,
}: {
  receipt?: Receipt & { probe?: boolean };
  onPolicy: () => void;
  onEdit: () => void;
}) {
  const t = nb.chapter;
  if (!receipt) return <p>{t.noReceipts}</p>;
  const operation = Object.hasOwn(t.operations, receipt.operation)
    ? t.operations[receipt.operation as keyof typeof t.operations]
    : t.operations.unknown;
  return (
    <div className={`chapter-receipt receipt-${receipt.outcome}`} data-outcome={receipt.outcome}>
      <span className="eyebrow">
        {t.outcomes[receipt.outcome]} · {receipt.commandId}
      </span>
      <h2>{t.receiptTitle}</h2>
      {receipt.probe && <p className="probe-notice">{t.probeReceipt}</p>}
      <p className="receipt-cause">{t.errors[receipt.code]}</p>
      <dl className="technical-properties">
        <div>
          <dt>{t.operation}</dt>
          <dd>{operation}</dd>
        </div>
        <div>
          <dt>{t.targetType}</dt>
          <dd>{receipt.targetType}</dd>
        </div>
        <div>
          <dt>{t.scope}</dt>
          <dd>{receipt.scopeId || '—'}</dd>
        </div>
        <div>
          <dt>{t.requestedLocation}</dt>
          <dd>{receipt.location ? regionLabels[receipt.location] : '—'}</dd>
        </div>
        <div>
          <dt>{t.rule}</dt>
          <dd>
            {receipt.ruleId}
            <code>{receipt.code}</code>
          </dd>
        </div>
        <div>
          <dt>{t.revision}</dt>
          <dd>
            {receipt.beforeRevision} → {receipt.afterRevision}
          </dd>
        </div>
        <div>
          <dt>{t.inventory}</dt>
          <dd>
            {receipt.beforeCount} → {receipt.afterCount}
          </dd>
        </div>
        {receipt.addedIds.length > 0 && (
          <div>
            <dt>{t.added}</dt>
            <dd>{receipt.addedIds.join(', ')}</dd>
          </div>
        )}
        {receipt.removedIds.length > 0 && (
          <div>
            <dt>{t.removed}</dt>
            <dd>{receipt.removedIds.join(', ')}</dd>
          </div>
        )}
      </dl>
      {receipt.outcome !== 'accepted' && <p>{t.unchanged}</p>}
      {receipt.policy && (
        <div className="policy-witness">
          <strong>{t.customPolicy}</strong>
          <p>
            {receipt.policy.assignmentId} → {receipt.policy.assignmentScope}
          </p>
          <p>
            {receipt.policy.targetType} / {regionLabels[receipt.policy.requestedLocation]} ∉{' '}
            {receipt.policy.allowedLocations.map((r) => regionLabels[r]).join(', ')}
          </p>
          <button type="button" className="button button-secondary" onClick={onPolicy}>
            {t.showPolicy}
          </button>
        </div>
      )}
      <button type="button" className="text-control" onClick={onEdit}>
        {t.editConfiguration}
      </button>
    </div>
  );
}
