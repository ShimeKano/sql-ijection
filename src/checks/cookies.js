export function checkCookies(page) {
  const raw = page.headers?.['set-cookie'];
  if (!raw) return [];
  const findings = [];
  const cookies = raw.split(/,(?=[^;]+=[^;]+)/);
  for (const cookie of cookies) {
    const lower = cookie.toLowerCase();
    const name = cookie.split('=')[0].trim();
    if (!lower.includes('httponly')) findings.push({ severity: 'LOW', category: 'cookies', title: `Cookie ${name} missing HttpOnly`, evidence: page.url });
    if (page.url.startsWith('https://') && !lower.includes('secure')) findings.push({ severity: 'LOW', category: 'cookies', title: `Cookie ${name} missing Secure`, evidence: page.url });
    if (!lower.includes('samesite')) findings.push({ severity: 'LOW', category: 'cookies', title: `Cookie ${name} missing SameSite`, evidence: page.url });
  }
  return findings;
}
