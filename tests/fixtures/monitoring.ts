import {
  initialMonitoring,
  type EvidenceInput,
  type HealthInput,
  type TelemetryInput,
} from '../../src/domain/curriculum/monitoring-model';
export const evidence = (v: Partial<EvidenceInput> = {}) =>
  ({ ...initialMonitoring('evidence'), ...v }) as EvidenceInput;
export const health = (v: Partial<HealthInput> = {}) =>
  ({ ...initialMonitoring('health'), ...v }) as HealthInput;
export const telemetry = (v: Partial<TelemetryInput> = {}) =>
  ({ ...initialMonitoring('telemetry'), ...v }) as TelemetryInput;
const configured = { rule: 'enabled' as const, actionGroup: true };
export const monitoringContrasts = {
  evidence: [
    evidence(),
    evidence({ tool: 'application-insights', signal: 'correlated-records' }),
    evidence({ question: 'cost-review', fresh: false }),
    evidence({ question: 'cost-review' }),
    evidence({ question: 'performance-review' }),
  ],
  health: [
    health(),
    health({ subscription: 'shared' }),
    health({ health: 'unknown' }),
    health({ inspection: 'after' }),
  ],
  telemetry: [
    telemetry(),
    telemetry({ rule: 'enabled' }),
    telemetry(configured),
    telemetry({ ...configured, aggregation: 'average' }),
    telemetry({ ...configured, coverage: 'gap' }),
    telemetry({ ...configured, routed: true }),
    telemetry({ ...configured, routed: true, filter: 'errors' }),
  ],
};
