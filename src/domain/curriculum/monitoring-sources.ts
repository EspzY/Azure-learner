export const monitoringSources = {
  MO01: [
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
    "'Study guide for Exam AZ-900: Microsoft Azure Fundamentals | Microsoft Learn'",
  ],
  MO02: [
    'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/',
    'Describe monitoring tools in Azure - Training | Microsoft Learn',
  ],
  MO03: [
    'https://learn.microsoft.com/en-us/azure/advisor/advisor-overview',
    'Introduction to Azure Advisor - Azure Advisor | Microsoft Learn',
  ],
  MO04: [
    'https://learn.microsoft.com/en-us/azure/service-health/overview',
    'What is Azure Service Health? - Azure Service Health | Microsoft Learn',
  ],
  MO05: [
    'https://learn.microsoft.com/en-us/azure/service-health/azure-status-overview',
    'Azure Status Overview - Azure Service Health | Microsoft Learn',
  ],
  MO06: [
    'https://learn.microsoft.com/en-us/azure/service-health/resource-health-overview',
    'Azure Resource Health overview - Azure Service Health | Microsoft Learn',
  ],
  MO07: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/overview',
    'Azure Monitor overview - Azure Monitor | Microsoft Learn',
  ],
  MO08: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/getting-started',
    'Monitor Azure resources with Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO09: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/activity-log',
    'Activity Log in Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO10: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
    'Overview of Log Analytics in Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO11: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview',
    'Log queries in Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO12: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
    'Overview of Azure Monitor alerts - Azure Monitor | Microsoft Learn',
  ],
  MO13: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview',
    'Application Insights OpenTelemetry observability overview - Azure Monitor | Microsoft Learn',
  ],
  MO14: [
    'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/1-introduction',
    'Introduction - Training | Microsoft Learn',
  ],
  MO15: [
    'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/2-describe-purpose-of-azure-advisor',
    'Describe the purpose of Azure Advisor - Training | Microsoft Learn',
  ],
  MO16: [
    'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/3-describe-azure-service-health',
    'Describe Azure Service Health - Training | Microsoft Learn',
  ],
  MO17: [
    'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/4-describe-azure-monitor',
    'Describe Azure Monitor - Training | Microsoft Learn',
  ],
  MO18: [
    'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/6-summary',
    'Summary - Training | Microsoft Learn',
  ],
  MO20: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/diagnostic-settings',
    'Diagnostic Settings in Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO21: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/resource-logs',
    'Resource logs in Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO22: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/metrics-aggregation-explained',
    'Azure Monitor metrics aggregation and display explained - Azure Monitor | Microsoft Learn',
  ],
  MO23: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types',
    'Types of Azure Monitor alerts - Azure Monitor | Microsoft Learn',
  ],
  MO24: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups',
    'Create and manage action groups in Azure Monitor - Azure Monitor | Microsoft Learn',
  ],
  MO25: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview',
    'Log Analytics workspace overview - Azure Monitor | Microsoft Learn',
  ],
  MO28: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/apprequests',
    'Azure Monitor Logs reference - AppRequests - Azure Monitor | Microsoft Learn',
  ],
  MO29: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/azureactivity',
    'Azure Monitor Logs reference - AzureActivity - Azure Monitor | Microsoft Learn',
  ],
  MO30: [
    'https://learn.microsoft.com/en-us/azure/service-health/service-health-portal-update',
    'Azure Service Health Portal - Azure Service Health | Microsoft Learn',
  ],
  MO31: [
    'https://learn.microsoft.com/en-us/azure/service-health/resource-health-checks-resource-types',
    'Supported Resource Types through Azure Resource Health - Azure Service Health | Microsoft Learn',
  ],
  MO32: [
    'https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations',
    'Cost recommendations - Azure Advisor | Microsoft Learn',
  ],
  MO33: [
    'https://learn.microsoft.com/en-us/azure/advisor/advisor-security-recommendations',
    'Review Security Recommendations in Microsoft Defender for Cloud - Microsoft Defender for Cloud | Microsoft Learn',
  ],
  MO34: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial',
    "'Log Analytics Tutorial: Query and Analyze Log Data - Azure Monitor | Microsoft Learn'",
  ],
  MO35: [
    'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/data-sources',
    'Azure Monitor data sources and data collection methods - Azure Monitor | Microsoft Learn',
  ],
  MO36: [
    'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-concepts',
    'Distributed tracing concepts - .NET | Microsoft Learn',
  ],
  MO37: [
    'https://learn.microsoft.com/en-us/kusto/query/countif-aggregation-function',
    'countif() (aggregation function) - Kusto | Microsoft Learn',
  ],
} as const;
export const monitoringStudySources = {
  introduction: ['MO01', 'MO02', 'MO14', 'MO18'],
  advisor: ['MO03', 'MO15', 'MO32', 'MO33'],
  health: ['MO04', 'MO05', 'MO06', 'MO16', 'MO30', 'MO31'],
  monitor: ['MO07', 'MO08', 'MO35'],
  signals: ['MO09', 'MO21', 'MO22', 'MO36'],
  logs: ['MO10', 'MO11', 'MO20', 'MO25', 'MO28', 'MO29', 'MO34', 'MO37'],
  alerts: ['MO12', 'MO17', 'MO23', 'MO24'],
  insights: ['MO13', 'MO35', 'MO36'],
  studio: ['MO05', 'MO06', 'MO12', 'MO20', 'MO22', 'MO24', 'MO35'],
} as const;
export const monitoringSourceReview = {
  reviewed: '2026-11-01',
  officialUnits: 6,
  publicUnitsReviewed: 5,
  protectedAssessment: 'not-opened',
  demos:
    'Public source examples inspected; no videos, hosted queries, sign-in or Azure runtime executed.',
  sources: {
    MO01: {
      url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
      final:
        'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
      status: 200,
      updated: '2026-06-22T23:35:00.0000000Z',
      sha256: '177b736af1bae8702d9e04ef68bac8c1f2985838652bb40818a5ac25ed320716',
      disposition: 'reviewed-applied',
      claim: 'Current AZ-900 guide: only3.4.01–03; all named Monitor facets required.',
    },
    MO02: {
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/',
      final: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/',
      status: 200,
      updated: '2026-10-28T17:12:00.0000000Z',
      sha256: 'c355d9406349a9743a592216b32c9f80c4ac89a1b8f776ec2e7ca6f86edd54f5',
      disposition: 'reviewed-applied',
      claim:
        'Six-unit Learn module; five public intro/teaching/summary units reviewed, protected assessment not opened.',
    },
    MO03: {
      url: 'https://learn.microsoft.com/en-us/azure/advisor/advisor-overview',
      final: 'https://learn.microsoft.com/en-us/azure/advisor/advisor-overview',
      status: 200,
      updated: '2026-05-18T22:10:00.0000000Z',
      sha256: 'f901b121f9a1272ae08e2bf5fc8d8c6bf68d5b6b1771d5163bffe2e0285e2bc1',
      disposition: 'reviewed-applied',
      claim:
        'Advisor uses configuration and usage telemetry for five recommendation categories; proposed changes require review, not incident proof.',
    },
    MO04: {
      url: 'https://learn.microsoft.com/en-us/azure/service-health/overview',
      final: 'https://learn.microsoft.com/en-us/azure/service-health/overview',
      status: 200,
      updated: '2025-10-31T22:10:00.0000000Z',
      sha256: '90922449784598ef984f5ddd1a6566951570ae4a46487207c50d4968f7688325',
      disposition: 'reviewed-applied',
      claim:
        'Service Health combines public Status, personalized Service Health and individual Resource Health perspectives.',
    },
    MO05: {
      url: 'https://learn.microsoft.com/en-us/azure/service-health/azure-status-overview',
      final: 'https://learn.microsoft.com/en-us/azure/service-health/azure-status-overview',
      status: 200,
      updated: '2026-06-02T22:21:00.0000000Z',
      sha256: '448016079a47de3cfaf44ce0a8b914c7f4dce659b9215b801ed7917ada1b263f',
      disposition: 'reviewed-applied',
      claim:
        'Public Status publishes selected widespread/access-path/uncertain-broad incidents; public history is not every subscription incident.',
    },
    MO06: {
      url: 'https://learn.microsoft.com/en-us/azure/service-health/resource-health-overview',
      final: 'https://learn.microsoft.com/en-us/azure/service-health/resource-health-overview',
      status: 200,
      updated: '2026-09-22T06:04:00.0000000Z',
      sha256: '0aaa426ec80441e63d323c90cfedffe1d0fddca264608af081ab53cdaf703376',
      disposition: 'reviewed-applied',
      claim:
        'Available/Unavailable/Degraded/Unknown and supported-resource/access qualifications; resource availability is not complete application correctness.',
    },
    MO07: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/overview',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview',
      status: 200,
      updated: '2026-10-09T22:14:00.0000000Z',
      sha256: '07e0f1cfa600de08982f9f1880416362d42061d82ae82879a41489def55f0f99',
      disposition: 'reviewed-applied',
      claim:
        'Collect/analyze/respond across metrics/logs/traces/events; distinct Log Analytics versus Azure Monitor workspaces; agentic extensions outside P14 scope.',
    },
    MO08: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/getting-started',
      final:
        'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/monitor-azure-resource',
      status: 200,
      updated: '2026-09-22T06:04:00.0000000Z',
      sha256: 'c364bdfeb8d989ec45af56f83fd9681d9355c195a822268639cdb91b9afd8303',
      disposition: 'reviewed-applied',
      claim:
        'Resource monitoring overview: platform metrics and Activity Log available by default, resource monitoring options/service support vary.',
    },
    MO09: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/activity-log',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/activity-log',
      status: 200,
      updated: '2026-10-27T06:04:00.0000000Z',
      sha256: '58e340a43522daa5f63e6151528ddad0e74e284086628960ef95953b3a9a2598',
      disposition: 'reviewed-applied',
      claim:
        'Activity Log control-plane events collected by default,90-day native retention; exported/queryable workspace data requires routing; ingestion is not instantaneous.',
    },
    MO10: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
      status: 200,
      updated: '2026-07-20T12:04:00.0000000Z',
      sha256: 'e7b706b1cca1cb61d259e566b2db661b5d00c41e92c8bbeb1160cb372b17212f',
      disposition: 'reviewed-applied',
      claim:
        'Log Analytics interface supports simple/KQL query modes; query scope/time/access determine available records, not automatic alert configuration.',
    },
    MO11: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview',
      status: 200,
      updated: '2026-04-29T22:07:00.0000000Z',
      sha256: 'dbcd9ca79cb2655f55f05b4dfa645bb272eabc6457fdbf222aa13b3013d9a4a3',
      disposition: 'reviewed-applied',
      claim:
        'KQL queries analyze stored data; scheduled log search alert rules are separate consumers/configurations.',
    },
    MO12: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
      status: 200,
      updated: '2026-07-08T22:11:00.0000000Z',
      sha256: '7d9e53434ea413b12ef61b7a9a30c30ef1727af9feca4b3e30d42ed3802fd644',
      disposition: 'reviewed-applied',
      claim:
        'Rule resource/signal/condition, action groups, Fired/Resolved monitor condition versus New/Acknowledged/Closed user response; stateful/stateless differ.',
    },
    MO13: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview',
      status: 200,
      updated: '2026-10-09T22:14:00.0000000Z',
      sha256: '395637b202f9216948b5adbe1d5c95d3620ca8dc81f8ae93429921ba4774af63',
      disposition: 'reviewed-applied',
      claim:
        'Current APM Application Insights and supported OTel instrumentation paths; browser JavaScript SDK differs, data collection is not universal automatic onboarding.',
    },
    MO14: {
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/1-introduction',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/1-introduction',
      status: 200,
      updated: '2026-03-24T17:11:00.0000000Z',
      sha256: '211b6cd661ff60c7e8bd5ea2c687bd5faec08f9a4ffeb89eae2cba71ea041d5d',
      disposition: 'reviewed-applied',
      claim:
        'Public introduction defines three monitoring goals and cloud/onprem/multicloud context.',
    },
    MO15: {
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/2-describe-purpose-of-azure-advisor',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/2-describe-purpose-of-azure-advisor',
      status: 200,
      updated: '2026-03-24T17:11:00.0000000Z',
      sha256: '6c5721cc6be62cbdd8b9f331e6cc9b9ce338836197d00cef55fd0605db8d5693',
      disposition: 'reviewed-applied',
      claim:
        'Public Advisor unit introduces five categories; security wording qualified by product recommendation context and MO33.',
    },
    MO16: {
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/3-describe-azure-service-health',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/3-describe-azure-service-health',
      status: 200,
      updated: '2026-03-24T17:11:00.0000000Z',
      sha256: '888978926e0ec1f4646163072fc2ce3bcd34f240ce79808b48fa5c285c4ea6da',
      disposition: 'reviewed-applied',
      claim:
        'Public health unit three views; broad normal/resource/root-cause shorthand qualified by MO05/06/30/31.',
    },
    MO17: {
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/4-describe-azure-monitor',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/4-describe-azure-monitor',
      status: 200,
      updated: '2026-03-24T17:11:00.0000000Z',
      sha256: 'eeca3d8e8e822e4e81a39075f6b63b853005063b43e68e56d4bc5d3a99568c75',
      disposition: 'reviewed-applied',
      claim:
        'Public Monitor unit analysis/alerts/APM; broad collection/setup shorthand qualified by MO13/20/21/35.',
    },
    MO18: {
      url: 'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/6-summary',
      final:
        'https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/6-summary',
      status: 200,
      updated: '2026-03-24T17:11:00.0000000Z',
      sha256: '502d9457c52a1f5e3eba6baa77254bc39db0f82c47e4cf349303d55bf2267aaa',
      disposition: 'reviewed-applied',
      claim:
        'Public summary confirms the same three scoped learning goals; assessment not accessed.',
    },
    MO19: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-sources',
      final: null,
      status: 'BLOCKED',
      updated: null,
      sha256: null,
      disposition: 'blocked',
      claim:
        'Old data-collection/data-sources route returned404; official fundamentals/data-sources MO35 is the available factual replacement.',
    },
    MO20: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/diagnostic-settings',
      final:
        'https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/diagnostic-settings',
      status: 200,
      updated: '2026-09-22T06:04:00.0000000Z',
      sha256: 'a8e53edfd1e231ddf3f276a958333c32da2aaa156bca012e3b55fbd45579184b',
      disposition: 'reviewed-applied',
      claim:
        'Diagnostic settings route platform metrics/Activity Log and explicitly collect supported resource-log categories; destinations, permissions and latency matter.',
    },
    MO21: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/resource-logs',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/resource-logs',
      status: 200,
      updated: '2026-10-27T06:04:00.0000000Z',
      sha256: '2177fa0af14d2535aa6da19654155467ff8367b765a12d93ae0cda23d940551f',
      disposition: 'reviewed-applied',
      claim:
        'Resource logs are service-specific records of resource operations; no configured collection means missing evidence, not absence of failures.',
    },
    MO22: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/metrics-aggregation-explained',
      final:
        'https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/metrics-aggregation-explained',
      status: 200,
      updated: '2026-08-10T22:17:00.0000000Z',
      sha256: '7a32ba4b4376ed2698d9c3b5850e9590ad3eb2960bfd9713b07c6d75f4f5b9b0',
      disposition: 'reviewed-applied',
      claim:
        'Time granularity/aggregation, Average versus Max; NULL differs from zero and Azure averages exclude absent values; provider handling varies.',
    },
    MO23: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-types',
      status: 200,
      updated: '2026-07-08T22:11:00.0000000Z',
      sha256: '63820713a84e37cfbdfb910b359e625258015345a4bd87d28fade8bddf7554c8',
      disposition: 'reviewed-applied',
      claim:
        'Metric/log-search/activity/health alert types use different evaluations; no universal one-evaluation resolution; bounded Studio uses declared stateless evaluation only.',
    },
    MO24: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups',
      status: 200,
      updated: '2026-07-29T22:13:00.0000000Z',
      sha256: 'aa86ca1cf8e7fa883313b5d72abcf8fb2c62471c8fd688e7a078863f109d536d',
      disposition: 'reviewed-applied',
      claim:
        'Reusable action groups carry configured notification/automation actions; eligible path is neither confirmed delivery nor automatic remediation.',
    },
    MO25: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview',
      final:
        'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview',
      status: 200,
      updated: '2026-08-13T17:12:00.0000000Z',
      sha256: 'f93ceeebfbf9cf617b4db96ed5a065b0893a70225dc046f2f706c12f7e1db69e',
      disposition: 'reviewed-applied',
      claim:
        'Log Analytics workspace stores selected tables with access/retention/table-plan constraints; it is not every monitoring metric datastore.',
    },
    MO26: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/distributed-trace-data',
      final:
        'https://learn.microsoft.com/en-us/previous-versions/azure/azure-monitor/app/classic-api',
      status: 200,
      updated: '2026-05-04T22:46:00.0000000Z',
      sha256: 'd56c8ef8708d6158a63eaa01bce506966b8833924157b71fa5356da561f368ba',
      disposition: 'optional-classic-selected',
      claim:
        'Distributed-trace old route redirects to very large Classic API2.x guide; selected correlation paragraphs only, not reviewed as current universal OTel setup; MO36 supplies generic concepts.',
    },
    MO27: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-overview',
      final:
        'https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview#getting-started',
      status: 200,
      updated: '2026-10-09T22:14:00.0000000Z',
      sha256: '395637b202f9216948b5adbe1d5c95d3620ca8dc81f8ae93429921ba4774af63',
      disposition: 'duplicate-canonical-MO13',
      claim:
        'opentelemetry-overview redirects to the same actual MO13 canonical body; not independent corroboration.',
    },
    MO28: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/apprequests',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/apprequests',
      status: 200,
      updated: '2026-07-28T17:16:00.0000000Z',
      sha256: '683859c15531c91b49b50bfc02b2f551605756f5d3733f88de4753b8ecd28d31',
      disposition: 'reviewed-applied',
      claim:
        'AppRequests schema: TimeGenerated,Success bool,OperationId,DurationMs support original KQL illustration.',
    },
    MO29: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/azureactivity',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/azureactivity',
      status: 200,
      updated: '2026-07-28T17:16:00.0000000Z',
      sha256: '90f2274a15880fb70a11dc91292cd3fe40df67d06b98a93faeeab6dedec37312',
      disposition: 'reviewed-applied',
      claim:
        'AzureActivity schema: TimeGenerated,ActivityStatusValue,OperationNameValue,ResourceId support original failed-management query.',
    },
    MO30: {
      url: 'https://learn.microsoft.com/en-us/azure/service-health/service-health-portal-update',
      final: 'https://learn.microsoft.com/en-us/azure/service-health/service-health-portal-update',
      status: 200,
      updated: '2026-09-22T06:04:00.0000000Z',
      sha256: '2427b5a49b2e440aa8bf6ad5b09ddd0932838a2e3126155064d393d5593fff7a',
      disposition: 'reviewed-applied',
      claim:
        'Personalized Service Health scope, service issues/planned maintenance/health advisories; subscription/region/service context and communications matter.',
    },
    MO31: {
      url: 'https://learn.microsoft.com/en-us/azure/service-health/resource-health-checks-resource-types',
      final:
        'https://learn.microsoft.com/en-us/azure/service-health/resource-health-checks-resource-types',
      status: 200,
      updated: '2026-03-12T05:06:00.0000000Z',
      sha256: '6551fedc19366ef79b87a676e9f4441529dc2d74b6a3ee787e9a05c01d3f3f54',
      disposition: 'reviewed-applied',
      claim:
        'Resource Health supports specific resource types/checks; VM/Web health checks do not establish business-response correctness.',
    },
    MO32: {
      url: 'https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations',
      final:
        'https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations',
      status: 200,
      updated: '2026-09-25T22:08:00.0000000Z',
      sha256: 'c75dc3eb8863243cb48e2aa47de1177be8ee796501414aff3d94fe166fa04614',
      disposition: 'reviewed-applied',
      claim:
        'Advisor cost recommendations use declared/configuration/usage context and need workload review; examples include right-sizing and capacity risks, not actual invoices.',
    },
    MO33: {
      url: 'https://learn.microsoft.com/en-us/azure/advisor/advisor-security-recommendations',
      final:
        'https://learn.microsoft.com/en-us/azure/defender-for-cloud/review-security-recommendations',
      status: 200,
      updated: '2026-09-17T17:37:00.0000000Z',
      sha256: '63bc71d26e5824d57ebddcaa382d6b94ff2b470ec69bf55e304af89614b7fb15',
      disposition: 'reviewed-applied',
      claim:
        'Advisor Security link resolves to current Defender recommendation documentation; findings/recommendations are not universal proof of active compromise; P15 depth deferred.',
    },
    MO34: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial',
      status: 200,
      updated: '2026-05-14T22:14:00.0000000Z',
      sha256: '8e435c11931d5af23fbcaf919eeec962b71aa7fc89d085148e5bb241fa520818',
      disposition: 'reviewed-applied',
      claim:
        'Public Log Analytics tutorial query/filter/group/time mechanisms reviewed; no actual hosted workspace/query or video run claimed.',
    },
    MO35: {
      url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/data-sources',
      final: 'https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/data-sources',
      status: 200,
      updated: '2026-09-22T06:04:00.0000000Z',
      sha256: '46933dddb33bec316dd8b24c46bd14208fc17cf6657d7fc4ba5834c6976892c7',
      disposition: 'reviewed-applied',
      claim:
        'Current common data-collection methods qualify automatically collected platform metrics/Activity Log versus resource logs and application onboarding.',
    },
    MO36: {
      url: 'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-concepts',
      final:
        'https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-concepts',
      status: 200,
      updated: '2026-03-30T21:10:00.0000000Z',
      sha256: '742a4dec2a9d0e62f1a206cec9d25b08563faedb93c91ebbacc984aba2ea44e5',
      disposition: 'reviewed-applied',
      claim:
        'Official distributed tracing concepts: trace/span IDs, parent-child work, collection and sampling; no actual .NET/OTel runtime performed.',
    },
    MO37: {
      url: 'https://learn.microsoft.com/en-us/kusto/query/countif-aggregation-function',
      final:
        'https://learn.microsoft.com/en-us/kusto/query/countif-aggregation-function?view=microsoft-fabric',
      status: 200,
      updated: '2025-02-05T12:13:00.0000000Z',
      sha256: 'bd90c7bdb46fd2c346eb58272933967e43f7ea3d9c6d14fd6440caed1d5593eb',
      disposition: 'reviewed-applied',
      claim:
        'KQL countif counts true predicates under summarize; original examples use documented table fields, not a general local interpreter.',
    },
  },
} as const;
