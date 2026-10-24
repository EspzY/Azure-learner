import { freshOrientation, orientationKey, parseOrientation, type Orientation } from './expedition';
interface Port {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
}
export class OrientationStore {
  private value = { preferences: freshOrientation(), ready: false, issue: false };
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private port: Port) {}
  getSnapshot = () => this.value;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private publish(preferences: Orientation, issue: boolean) {
    this.value = { preferences, ready: true, issue };
    this.listeners.forEach((fn) => fn());
  }
  load = () => {
    try {
      this.base = this.port.getItem(orientationKey);
      const parsed = parseOrientation(this.base);
      this.publish(parsed ?? freshOrientation(), !parsed);
    } catch {
      this.publish(this.value.preferences, true);
    }
  };
  update = (patch: Partial<Omit<Orientation, 'schema'>>) => {
    if (!this.value.ready) return;
    const next = { ...this.value.preferences, ...patch };
    if (!parseOrientation(JSON.stringify(next))) return;
    // Quarantine invalid/unknown or concurrently changed preferences. Memory still works.
    try {
      if (!parseOrientation(this.base) || this.port.getItem(orientationKey) !== this.base)
        throw Error('conflict');
      const raw = JSON.stringify(next);
      if (!parseOrientation(raw)) return;
      this.port.setItem(orientationKey, raw);
      this.base = raw;
      this.publish(next, false);
    } catch {
      this.publish(next, true);
    }
  };
  clear = () => {
    try {
      this.port.removeItem(orientationKey);
      this.base = null;
      this.publish(freshOrientation(), false);
    } catch {
      this.publish(freshOrientation(), true);
    }
  };
}
