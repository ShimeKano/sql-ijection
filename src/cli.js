import { DEFAULTS } from './config.js';
import { parseTarget, assertAllowedTarget } from './core/target.js';
import { request } from './core/http.js';
import { crawl } from './core/crawler.js';
import { checkHeaders } from './checks/headers.js';
import { checkGetFormReflection } from './checks/reflection.js';
import { checkErrorDisclosure } from './checks/errors.js';
import { checkCookies } from './checks/cookies.js';
import { printReport } from './report.js';

const args = process.argv.slice(2);
const rawTarget = args.find(a => !a.startsWith('--'));
const authorized = args.includes('--authorized');

if (!rawTarget) {
  console.error('Usage: npm run scan -- http://127.0.0.1:5000 [--authorized]');
  process.exit(1);
}

let target;
try {
  target = parseTarget(rawTarget);
  assertAllowedTarget(target, authorized);
} catch (error) {
  console.error(`Target rejected: ${error.message}`);
  process.exit(2);
}

console.log(`Scanning authorized lab: ${target.href}`);

try {
  const root = await request(target, DEFAULTS);
  console.log(`Target status: ${root.status}`);
  const pages = await crawl(target, DEFAULTS);
  const findings = [];

  for (const page of pages) {
    findings.push(...checkHeaders(page));
    findings.push(...checkErrorDisclosure(page));
    findings.push(...checkCookies(page));
    for (const form of page.forms) findings.push(...await checkGetFormReflection(form, DEFAULTS.timeoutMs));
  }

  const unique = [];
  const seen = new Set();
  for (const finding of findings) {
    const key = `${finding.title}|${finding.evidence}`;
    if (!seen.has(key)) { seen.add(key); unique.push(finding); }
  }

  printReport(target.href, pages, unique);
} catch (error) {
  console.error(`Scan failed: ${error.message}`);
  process.exit(3);
}
