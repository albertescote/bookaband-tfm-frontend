export function formatNumberShort(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 10000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return Math.floor(n / 1000) + 'k';
}
