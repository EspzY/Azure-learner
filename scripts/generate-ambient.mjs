// Original AzureLab score: four overlapping Dm9/Bbmaj7/Fmaj9/Cadd9 pads.
// Integer cycles and periodic envelopes make the 32-second mono loop continuous.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const rate = 22050,
  seconds = 32,
  frames = rate * seconds;
const chords = [
  [146.832, 220, 261.626, 329.628],
  [116.541, 174.614, 220, 293.665],
  [130.813, 174.614, 220, 261.626],
  [130.813, 195.998, 261.626, 293.665],
];
const data = Buffer.alloc(44 + frames * 2);
data.write('RIFF');
data.writeUInt32LE(data.length - 8, 4);
data.write('WAVEfmt ', 8);
data.writeUInt32LE(16, 16);
data.writeUInt16LE(1, 20);
data.writeUInt16LE(1, 22);
data.writeUInt32LE(rate, 24);
data.writeUInt32LE(rate * 2, 28);
data.writeUInt16LE(2, 32);
data.writeUInt16LE(16, 34);
data.write('data', 36);
data.writeUInt32LE(frames * 2, 40);
for (let i = 0; i < frames; i++) {
  const t = i / rate;
  let value = 0;
  for (let c = 0; c < 4; c++) {
    const distance = Math.min(Math.abs(t - (c * 8 + 4)), seconds - Math.abs(t - (c * 8 + 4)));
    const envelope = Math.exp((-distance * distance) / 24);
    for (const note of chords[c]) {
      const cycles = Math.round(note * seconds);
      value +=
        (envelope *
          (Math.sin((2 * Math.PI * cycles * t) / seconds) +
            0.12 * Math.sin((4 * Math.PI * cycles * t) / seconds))) /
        32;
    }
  }
  value *= 0.85 + 0.15 * Math.cos((2 * Math.PI * t) / seconds);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), 44 + i * 2);
}
mkdirSync('public/game/audio', { recursive: true });
writeFileSync('public/game/audio/lysningen.wav', data);
writeFileSync(
  'public/game/audio/license.txt',
  'AzureLab original score and offline synthesis, 2026-10-24.\nCreator: AzureLab project, authored in scripts/generate-ambient.mjs.\nNo third-party samples, recordings or melodies used.\nThis original audio is dedicated under CC0 1.0 Universal: https://creativecommons.org/publicdomain/zero/1.0/\nEducational, workplace and commercial reuse permitted. Attribution appreciated, not required. No Microsoft or game soundtrack affiliation.\n',
);
writeFileSync(
  'public/game/audio/manifest.json',
  JSON.stringify(
    {
      schema: 1,
      file: '/game/audio/lysningen.wav',
      creator: 'AzureLab',
      license: 'CC0-1.0',
      reviewed: '2026-10-24',
      duration: seconds,
      sampleRate: rate,
      bytes: data.length,
      sha256: createHash('sha256').update(data).digest('hex'),
    },
    null,
    2,
  ) + '\n',
);
console.log(`Original local ambient loop: ${data.length} bytes, ${seconds}s; no external sample.`);
