import { initialProbe, type Probe } from '@/domain/curriculum/foundations';
import type { UnitId } from '@/domain/curriculum/manifest';
import type { CueId } from './playback';
export const cueRegistry: Record<
  CueId,
  {
    version: 1;
    kind: 'flow' | 'model' | 'experiment' | 'topologies';
    model?: 'iaas' | 'paas' | 'saas';
    unit?: UnitId;
    input?: Probe;
  }
> = {
  'deployment-models': { version: 1, kind: 'topologies' },
  flow: { version: 1, kind: 'flow' },
  iaas: { version: 1, kind: 'model', model: 'iaas' },
  paas: { version: 1, kind: 'model', model: 'paas' },
  saas: { version: 1, kind: 'model', model: 'saas' },
  'capacity-owned': {
    version: 1,
    kind: 'experiment',
    unit: 'capacity',
    input: { ...initialProbe },
  },
  'capacity-cloud': {
    version: 1,
    kind: 'experiment',
    unit: 'capacity',
    input: { ...initialProbe, mode: 'cloud' },
  },
  responsibility: {
    version: 1,
    kind: 'experiment',
    unit: 'responsibility',
    input: { ...initialProbe, mode: 'cloud' },
  },
  public: {
    version: 1,
    kind: 'experiment',
    unit: 'models',
    input: { ...initialProbe, topology: 'public' },
  },
  private: {
    version: 1,
    kind: 'experiment',
    unit: 'models',
    input: { ...initialProbe, topology: 'private' },
  },
  hybrid: {
    version: 1,
    kind: 'experiment',
    unit: 'models',
    input: { ...initialProbe, topology: 'hybrid' },
  },
  idle: {
    version: 1,
    kind: 'experiment',
    unit: 'metering',
    input: { ...initialProbe, mode: 'cloud', profile: 'idle' },
  },
  released: {
    version: 1,
    kind: 'experiment',
    unit: 'metering',
    input: { ...initialProbe, mode: 'cloud', profile: 'idle', released: true },
  },
  usage: {
    version: 1,
    kind: 'experiment',
    unit: 'pricing',
    input: { ...initialProbe, mode: 'cloud', profile: 'steady' },
  },
  commitment: {
    version: 1,
    kind: 'experiment',
    unit: 'pricing',
    input: { ...initialProbe, mode: 'cloud', profile: 'steady', pricing: 'commitment' },
  },
};
