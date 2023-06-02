export function getDomain(sourceUrl: string | undefined) {
  if (!sourceUrl) return sourceUrl
  const url = new URL(sourceUrl);
  const domain = url.hostname.split('.').slice(-2).join('.');
  return domain
}
