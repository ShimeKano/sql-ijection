const recommended = [
  ['content-security-policy', 'Content-Security-Policy'],
  ['x-content-type-options', 'X-Content-Type-Options'],
  ['referrer-policy', 'Referrer-Policy'],
  ['permissions-policy', 'Permissions-Policy']
];

export function checkHeaders(page) {
  const findings = [];
  for (const [key, label] of recommended) {
    if (!page.headers?.[key]) findings.push({ severity: 'LOW', category: 'headers', title: `Missing ${label}`, evidence: page.url });
  }
  if (page.headers?.server) findings.push({ severity: 'INFO', category: 'information-disclosure', title: 'Server header exposed', evidence: `${page.url} -> ${page.headers.server}` });
  return findings;
}
