/** Bounded presentation-only URL metadata. Never workspace authorization or persisted graph state. */
export const studioKeys = ['ssub', 'sgroup', 'stype', 'sselected', 'sx', 'sy', 'sz', 'sw'] as const;
export function studioParameters(query: { get: (key: string) => string | null }) {
  const p = new URLSearchParams();
  for (const key of studioKeys) {
    const v = query.get(key);
    if (v && v.length <= 256) p.set(key, v);
  }
  return p;
}
export function studioContext(href: string, query: { get: (key: string) => string | null }) {
  if (query.get('studio') !== '1') return href;
  const [base, search = ''] = href.split('?');
  const p = new URLSearchParams(search);
  p.set('studio', '1');
  for (const [k, v] of studioParameters(query)) p.set(k, v);
  return base + '?' + p;
}
export function studioReturn(
  query: { get: (key: string) => string | null },
  base = '/labs/laboratory',
) {
  return base + '?view=studio&' + studioParameters(query);
}
export function readStudio(query: { get: (key: string) => string | null }, workspace: string) {
  const p = studioParameters(query),
    valid = p.get('sw') === workspace;
  const number = (key: string) => (p.has(key) ? Number(p.get(key)) : NaN);
  const x = number('sx'),
    y = number('sy'),
    zoom = number('sz');
  return {
    filters: {
      subscription: valid ? (p.get('ssub') ?? '') : '',
      group: valid ? (p.get('sgroup') ?? '') : '',
      kind: valid ? (p.get('stype') ?? '') : '',
    },
    selected: valid ? (p.get('sselected') ?? '') : '',
    viewport:
      valid &&
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Math.abs(x) <= 50000 &&
      Math.abs(y) <= 50000 &&
      zoom >= 0.01 &&
      zoom <= 1.6
        ? { x, y, zoom }
        : undefined,
  };
}
