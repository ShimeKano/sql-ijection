const signatures = [
  'sql syntax', 'syntax error at or near', 'sqlite error', 'sequelize',
  'typeorm', 'stack trace', 'traceback', 'unhandled exception',
  'cannot read properties of undefined'
];

export function checkErrorDisclosure(page) {
  const body = page.text.toLowerCase();
  const hits = signatures.filter(s => body.includes(s));
  if (!hits.length) return [];
  return [{
    severity: 'MEDIUM', category: 'error-disclosure', title: 'Possible internal error details exposed',
    evidence: `${page.url} -> ${hits.join(', ')}`,
    note: 'Heuristic only; confirm whether sensitive internal details are actually exposed.'
  }];
}
