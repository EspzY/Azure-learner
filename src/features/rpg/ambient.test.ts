import { afterEach, expect, it, vi } from 'vitest';
import { AmbientAudio } from './ambient';
import { defaultPresentation } from '@/domain/instruction/preferences';
afterEach(() => vi.unstubAllGlobals());
it('requires explicit enable, deduplicates loop sources, fades/mutes and cleans up', async () => {
  const ramp = vi.fn(),
    start = vi.fn(),
    stop = vi.fn(),
    disconnect = vi.fn(),
    close = vi.fn(async () => {});
  const source = { buffer: null, loop: false, connect: vi.fn(), start, stop, disconnect };
  const gain = () => ({
    gain: { value: 0, cancelScheduledValues: vi.fn(), setTargetAtTime: ramp },
    connect: vi.fn(),
    disconnect,
  });
  const context = {
    state: 'running',
    currentTime: 1,
    destination: {},
    resume: vi.fn(async () => {}),
    createGain: vi.fn(gain),
    createBufferSource: vi.fn(() => source),
    decodeAudioData: vi.fn(async () => ({})),
    close,
  };
  vi.stubGlobal(
    'AudioContext',
    class {
      constructor() {
        return context;
      }
    },
  );
  vi.stubGlobal('document', { hidden: false });
  const fetch = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) }));
  vi.stubGlobal('fetch', fetch);
  const audio = new AmbientAudio();
  expect(fetch).not.toHaveBeenCalled();
  await Promise.all([
    audio.enable({ ...defaultPresentation, muted: false }),
    audio.enable({ ...defaultPresentation, muted: false }),
  ]);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(start).toHaveBeenCalledTimes(1);
  expect(source.loop).toBe(true);
  audio.update({ ...defaultPresentation, muted: false }, false);
  expect(ramp).toHaveBeenLastCalledWith(0, 1, 0.18);
  audio.dispose();
  expect(stop).toHaveBeenCalledTimes(1);
  expect(close).toHaveBeenCalledTimes(1);
});
it('surfaces denied playback and never starts a source after unmount while loading', async () => {
  const start = vi.fn(),
    context = {
      state: 'running',
      currentTime: 0,
      destination: {},
      resume: vi.fn(async () => {}),
      createGain: () => ({
        gain: { value: 0, cancelScheduledValues: vi.fn(), setTargetAtTime: vi.fn() },
        connect: vi.fn(),
        disconnect: vi.fn(),
      }),
      decodeAudioData: async () => ({}),
      createBufferSource: () => ({ start, stop: vi.fn(), disconnect: vi.fn(), connect: vi.fn() }),
      close: async () => {},
    };
  vi.stubGlobal(
    'AudioContext',
    class {
      constructor() {
        return context;
      }
    },
  );
  vi.stubGlobal('document', { hidden: false });
  let resolve!: (value: unknown) => void;
  vi.stubGlobal(
    'fetch',
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const audio = new AmbientAudio(),
    pending = audio.enable(defaultPresentation);
  await Promise.resolve();
  audio.dispose();
  resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) });
  await pending;
  expect(start).not.toHaveBeenCalled();
  context.resume.mockRejectedValueOnce(Error('NotAllowedError'));
  const denied = new AmbientAudio();
  await expect(denied.enable(defaultPresentation)).rejects.toThrow('NotAllowedError');
  denied.dispose();
});
