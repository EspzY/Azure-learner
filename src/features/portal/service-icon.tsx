import {
  Activity,
  AppWindow,
  Boxes,
  Database,
  Folder,
  HardDrive,
  Layers,
  Monitor,
  Network,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';

/** Original Lucide-based service cues, not Microsoft logos or downloaded Portal artwork. */
export function ServiceIcon({ kind, size = 16 }: { kind: string; size?: number }) {
  const Icon =
    kind === 'activity'
      ? Activity
      : kind === 'group' || kind === 'groups'
        ? Folder
        : kind === 'plan' || kind === 'plans'
          ? Layers
          : kind === 'app' || kind === 'apps'
            ? AppWindow
            : kind === 'vm' || kind === 'vms'
              ? Monitor
              : kind === 'disk'
                ? HardDrive
                : kind === 'nic' || kind === 'subnet'
                  ? Waypoints
                  : kind === 'vnet'
                    ? Network
                    : kind === 'subscription' || kind === 'subscriptions'
                      ? Database
                      : kind === 'policy'
                        ? ShieldCheck
                        : Boxes;
  return (
    <Icon
      size={size}
      aria-hidden="true"
      className={`portal-service-icon service-${kind}`}
      strokeWidth={1.7}
    />
  );
}
