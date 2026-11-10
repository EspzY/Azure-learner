import {
  computeNb,
  finalQualityNb as copy,
  monitoringNb,
  securityNb,
  storageNb,
} from '@/content/nb';

/** Read-only display copies. No item, answer, feedback, model or persisted event is replaced. */
export const storagePresentation = { ...storageNb, available: copy.storageAvailable };
export const computePresentation = { ...computeNb, available: copy.computeAvailable };
export const securityPresentation = {
  ...securityNb,
  sections: {
    ...securityNb.sections,
    introduction: { ...securityNb.sections.introduction, limit: copy.security.introductionLimit },
    'zero-trust': {
      ...securityNb.sections['zero-trust'],
      paragraphs: securityNb.sections['zero-trust'].paragraphs.map((p, i) =>
        i === 1 ? copy.security.zeroTrust : p,
      ),
    },
    posture: {
      ...securityNb.sections.posture,
      paragraphs: securityNb.sections.posture.paragraphs.map((p, i) =>
        i === 4 ? copy.security.posture : p,
      ),
    },
  },
};
export const monitoringPresentation = {
  ...monitoringNb,
  available: copy.monitoring.available,
  sections: {
    ...monitoringNb.sections,
    health: { ...monitoringNb.sections.health, example: copy.monitoring.healthExample },
    signals: { ...monitoringNb.sections.signals, example: copy.monitoring.signalsExample },
    logs: {
      ...monitoringNb.sections.logs,
      paragraphs: monitoringNb.sections.logs.paragraphs.map((p, i) =>
        i === 2 ? copy.monitoring.logs : p,
      ),
    },
    alerts: {
      ...monitoringNb.sections.alerts,
      example: copy.monitoring.alertsExample,
      paragraphs: monitoringNb.sections.alerts.paragraphs.map((p, i) =>
        i === 0 ? copy.monitoring.alerts : p,
      ),
    },
    insights: { ...monitoringNb.sections.insights, example: copy.monitoring.insightsExample },
  },
  missions: {
    ...monitoringNb.missions,
    telemetry: {
      ...monitoringNb.missions.telemetry,
      where: copy.monitoring.telemetryWhere,
      steps: monitoringNb.missions.telemetry.steps.map((s, i) =>
        i === 2 ? copy.monitoring.telemetryStep : s,
      ),
    },
  },
};
