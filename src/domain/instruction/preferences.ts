export const presentationKey = 'azurelab.presentation.v1';
export interface PresentationPreferences {
  schema: 1;
  speed: 80 | 130 | 180;
  manual: boolean;
  muted: boolean;
  music: number;
  effects: number;
}
export const defaultPresentation: PresentationPreferences = {
  schema: 1,
  speed: 130,
  manual: false,
  muted: true,
  music: 0.2,
  effects: 0.15,
};
export function parsePresentation(raw: string | null): PresentationPreferences | null {
  if (raw === null) return { ...defaultPresentation };
  if (raw.length > 500) return null;
  try {
    const p = JSON.parse(raw);
    if (
      !p ||
      Array.isArray(p) ||
      Object.keys(p).sort().join(',') !== 'effects,manual,music,muted,schema,speed' ||
      p.schema !== 1 ||
      ![80, 130, 180].includes(p.speed) ||
      typeof p.manual !== 'boolean' ||
      typeof p.muted !== 'boolean' ||
      ![p.music, p.effects].every(
        (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1,
      )
    )
      return null;
    return p as PresentationPreferences;
  } catch {
    return null;
  }
}
