import {
  Boxes,
  Compass,
  FlaskConical,
  Folder,
  Gauge,
  Globe2,
  Layers3,
  LayoutDashboard,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { ScopeKind } from '@/domain/simulation';
export const navIcons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  explore: Compass,
  missions: Rocket,
  progress: Trophy,
};
export const scopeIcons: Record<ScopeKind, LucideIcon> = {
  tenant: ShieldCheck,
  root: Network,
  management: Layers3,
  subscription: Boxes,
  group: Folder,
  resource: Server,
};
export { FlaskConical, Gauge, Globe2 };
