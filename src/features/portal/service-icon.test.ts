import { describe, expect, it } from 'vitest';
import { portalIconRegistry, resolvePortalIcon } from './service-icon';

describe('reviewed Portal icon contract', () => {
  it('maps every supported service/resource and alias to a local original Azure asset', () => {
    for (const kind of [
      'group',
      'groups',
      'subscription',
      'subscriptions',
      'vm',
      'vms',
      'plan',
      'plans',
      'app',
      'apps',
      'disk',
      'nic',
      'vnet',
      'subnet',
      'activity',
      'policy',
      'resources',
      'root',
      'management',
    ]) {
      expect(resolvePortalIcon(kind)?.family).toBe('azure');
    }
    expect(resolvePortalIcon('apps')).toBe(resolvePortalIcon('app'));
    expect(resolvePortalIcon('groups')).toBe(resolvePortalIcon('group'));
    expect(resolvePortalIcon('resource')).toBe(resolvePortalIcon('resources'));
  });
  it('keeps action glyphs and non-service teaching symbols separate, with honest reference status', () => {
    for (const kind of ['search', 'notifications', 'settings', 'help', 'create', 'refresh'])
      expect(resolvePortalIcon(kind)?.family).toBe('fluent');
    expect(resolvePortalIcon('tenant')?.result).toBe('UNVERIFIED');
    expect(resolvePortalIcon('disk')?.result).toBe('UNVERIFIED');
    expect(portalIconRegistry.azure.scope).toContain('training');
  });
  it('reports unknown mappings instead of a generic service fallback', () => {
    expect(resolvePortalIcon('unregistered-service')).toBeUndefined();
    for (const inherited of ['__proto__', 'constructor', 'toString'])
      expect(resolvePortalIcon(inherited)).toBeUndefined();
  });
});
