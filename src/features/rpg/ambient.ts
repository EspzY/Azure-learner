import type { PresentationPreferences } from '@/domain/instruction/preferences';
export class AmbientAudio {
  context: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private musicGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private generation = 0;
  private loading: Promise<void> | null = null;
  private disposed = false;
  mount() {
    this.disposed = false;
  }
  async enable(preferences: PresentationPreferences) {
    if (this.disposed) return;
    if (!this.context) {
      this.context = new AudioContext();
      this.musicGain = this.context.createGain();
      this.musicGain.gain.value = 0;
      this.musicGain.connect(this.context.destination);
      this.effectsGain = this.context.createGain();
      this.effectsGain.connect(this.context.destination);
    }
    // Called only from a trusted button handler; resume failures are returned to the UI.
    await this.context.resume();
    if (this.context.state !== 'running') throw Error('Audio unavailable');
    if (!this.source && !this.loading) {
      const generation = this.generation;
      const context = this.context;
      this.loading = (async () => {
        const response = await fetch('/game/audio/lysningen.wav');
        if (!response.ok) throw Error('Audio asset unavailable');
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        if (generation !== this.generation || this.disposed) return;
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(this.musicGain!);
        source.start();
        this.source = source;
      })().finally(() => {
        this.loading = null;
      });
    }
    await this.loading;
    this.update(preferences, !document.hidden);
  }
  update(preferences: PresentationPreferences, visible: boolean) {
    const context = this.context;
    if (!context || context.state === 'closed') return;
    const now = context.currentTime;
    for (const [gain, value] of [
      [this.musicGain, preferences.music],
      [this.effectsGain, preferences.effects],
    ] as const) {
      if (!gain) continue;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(!visible || preferences.muted ? 0 : value, now, 0.18);
    }
  }
  effect() {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running' || !this.effectsGain) return;
    const tone = ctx.createOscillator(),
      gain = ctx.createGain();
    tone.frequency.value = 523.25;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    tone.connect(gain);
    gain.connect(this.effectsGain);
    tone.start();
    tone.stop(ctx.currentTime + 0.15);
    tone.onended = () => {
      tone.disconnect();
      gain.disconnect();
    };
  }
  dispose() {
    this.disposed = true;
    this.generation++;
    this.source?.stop();
    this.source?.disconnect();
    this.source = null;
    this.musicGain?.disconnect();
    this.effectsGain?.disconnect();
    void this.context?.close().catch(() => {});
    this.context = null;
  }
}
