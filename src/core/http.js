export async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 6000);
  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: { 'user-agent': options.userAgent ?? 'StoryGuard/0.1 (authorized security lab)', ...(options.headers || {}) },
      redirect: 'manual',
      signal: controller.signal,
      body: options.body
    });
    return {
      url: response.url || String(url),
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      text: await response.text()
    };
  } finally { clearTimeout(timeout); }
}

export function absoluteUrl(base, href) {
  try {
    const u = new URL(href, base);
    return ['http:', 'https:'].includes(u.protocol) ? u : null;
  } catch { return null; }
}
