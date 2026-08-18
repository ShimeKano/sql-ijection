export function parseTarget(raw) {
  const value = String(raw || '').trim();
  if (!value) throw new Error('Target URL is required.');
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid URL.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP/HTTPS targets are supported.');
  return url;
}

export function isLoopback(url) {
  const host = url.hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

export function assertAllowedTarget(url, authorized = false) {
  if (isLoopback(url)) return;
  if (!authorized) throw new Error('Target is not loopback. Use --authorized only for a public lab you own or are explicitly authorized to test.');
}
