import {
  initialTools,
  type IntentInput,
  type ChangeInput,
  type ArcInput,
} from '../../src/domain/curriculum/management-tools-model';
export const intent = (v: Partial<IntentInput> = {}) =>
  ({ ...initialTools('intent'), ...v }) as IntentInput;
export const change = (v: Partial<ChangeInput> = {}) =>
  ({ ...initialTools('change'), ...v }) as ChangeInput;
export const arc = (v: Partial<ArcInput> = {}) => ({ ...initialTools('arc'), ...v }) as ArcInput;
export const toolsContrasts = {
  intent: [
    intent(),
    intent({ installed: true }),
    intent({ tool: 'portal', host: 'browser' }),
    intent({ tool: 'powershell', host: 'local-pwsh', installed: true }),
    intent({ tool: 'arm' }),
    intent({ tool: 'bicep' }),
  ],
  change: [
    change(),
    change({ order: 'explicit' }),
    change({ baseline: 'dev', order: 'explicit' }),
    change({ baseline: 'dev', order: 'explicit', costCenter: 'sales' }),
    change({ baseline: 'dev', stage: 'prod', order: 'explicit' }),
    change({ syntax: 'bicep' }),
  ],
  arc: [
    arc(),
    arc({ approach: 'servers' }),
    arc({ resource: 'onprem-kubernetes', approach: 'servers' }),
    arc({ resource: 'onprem-kubernetes', approach: 'kubernetes' }),
    arc({ resource: 'othercloud-server', approach: 'servers' }),
    arc({ resource: 'othercloud-server', approach: 'servers', connected: false }),
  ],
};
