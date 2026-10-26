import type { PortalLocation } from '@/domain/portal/model';
import type { GuideTarget } from '@/domain/course/model';
import type { LabKind } from '@/domain/sandbox/practical';
import type { VmFormView } from '@/features/portal/vm-form';

export interface GuideSnapshot {
  kind: LabKind;
  hasGroups: boolean;
  hasApp: boolean;
  appId?: string;
  configured: boolean;
  inspected: boolean;
  ids: readonly string[];
  location: PortalLocation;
  form?: VmFormView | null;
}
/** Read-only presentation projection. Never emits evidence, navigation or commands. */
export function practicalGuidance(s: GuideSnapshot) {
  const l = s.location;
  const phase:
    | 'group'
    | 'explain'
    | 'inspect'
    | 'disks'
    | 'network'
    | 'review'
    | 'basics'
    | 'search'
    | 'web'
    | 'settings' = !s.hasGroups
    ? 'group'
    : s.kind === 'vm'
      ? s.configured
        ? s.inspected
          ? 'explain'
          : 'inspect'
        : l.area === 'create' && l.kind === 'vm'
          ? s.form?.tab === 1
            ? 'disks'
            : s.form?.tab === 2
              ? 'network'
              : s.form?.tab === 3
                ? 'review'
                : 'basics'
          : 'search'
      : !s.hasApp
        ? 'web'
        : s.configured
          ? s.inspected
            ? 'explain'
            : 'inspect'
          : 'settings';
  const target: GuideTarget =
    phase === 'group'
      ? l.area === 'create' && l.kind === 'group'
        ? 'name'
        : l.area === 'groups'
          ? 'create'
          : 'search'
      : phase === 'disks'
        ? 'vm-disk'
        : phase === 'network'
          ? 'vm-network'
          : phase === 'review'
            ? s.form?.valid
              ? 'commit'
              : 'validation'
            : phase === 'basics'
              ? !s.form?.group
                ? 'group'
                : !s.form.name
                  ? 'name'
                  : 'vm-profile'
              : phase === 'search'
                ? l.area === 'vms'
                  ? 'create'
                  : 'search'
                : phase === 'settings'
                  ? l.area === 'settings'
                    ? 'settings'
                    : 'resource'
                  : phase === 'web'
                    ? 'search'
                    : l.area === 'resource'
                      ? 'inspect-practical'
                      : 'architecture';
  const targetKind =
    target === 'validation' || target === 'resource'
      ? ('inspection' as const)
      : ('action' as const);
  // A button on an unrelated resource is real, but it is not THIS lab's inspection target.
  const matching =
    phase === 'explain'
      ? false
      : target === 'inspect-practical'
        ? s.ids.includes(l.id)
        : phase === 'settings' && ['resource', 'settings'].includes(l.area)
          ? l.id === s.appId
          : true;
  return { phase, target, targetKind, matching };
}
