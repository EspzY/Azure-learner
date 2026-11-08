import type { World } from '@/laboratory/engine';
import type { World as Previous } from '@/laboratory/v35/contract';
import type { World as Current } from '@/laboratory/v36/contract';
import { computeProjection } from '@/laboratory/v35/projection';
import { firewallProjection } from '@/laboratory/v36/projection';
export const isFirewallWorld = (w: World | undefined): w is Previous | Current =>
  w?.model === 'laboratory@3.5.0' || w?.model === 'laboratory@3.6.0';
/** Existing pure render projection; no alternate resource authority. */
export const computeView = (w: Previous | Current) =>
  computeProjection(w.model === 'laboratory@3.6.0' ? firewallProjection(w) : w);
