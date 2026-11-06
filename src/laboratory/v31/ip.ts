/** Strict dotted-decimal IPv4. No octal, leading zeros, whitespace or host-bit normalization. */
export function ipv4(value: string): number | null {
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((p) => !/^(0|[1-9][0-9]{0,2})$/.test(p) || Number(p) > 255))
    return null;
  return parts.reduce((n, p) => n * 256 + Number(p), 0);
}
export function address(value: number): string {
  return [24, 16, 8, 0].map((shift) => Math.floor(value / 2 ** shift) % 256).join('.');
}
export function cidr(value: string) {
  const parts = value.split('/');
  if (parts.length !== 2 || !/^(0|[1-9][0-9]?)$/.test(parts[1]!)) return null;
  const first = ipv4(parts[0]!),
    prefix = Number(parts[1]);
  if (first === null || prefix > 32) return null;
  const size = 2 ** (32 - prefix);
  if (first % size !== 0) return null;
  return { first, last: first + size - 1, prefix, size };
}
export const contains = (
  parent: { first: number; last: number },
  child: { first: number; last: number },
) => child.first >= parent.first && child.last <= parent.last;
export const overlaps = (a: { first: number; last: number }, b: { first: number; last: number }) =>
  a.first <= b.last && b.first <= a.last;
export function privateSpace(value: string) {
  const block = cidr(value);
  return (
    !!block &&
    block.prefix >= 8 &&
    block.prefix <= 29 &&
    ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'].some((p) => contains(cidr(p)!, block))
  );
}
export function subnetMetadata(value: string) {
  const block = cidr(value);
  if (!block || block.prefix < 8 || block.prefix > 29) return null;
  return {
    first: address(block.first),
    last: address(block.last),
    reserved: [0, 1, 2, 3, block.size - 1].map((i) => address(block.first + i)),
    usableCount: block.size - 5,
  };
}
