import pc from 'picocolors';

export function printReport(target, pages, findings) {
  console.log('');
  console.log(pc.bold('STORYGUARD v0.1'));
  console.log(`Target: ${target}`);
  console.log(`Pages:  ${pages.length}`);
  console.log('');
  if (!findings.length) {
    console.log(pc.green('✓ No findings from the enabled checks.'));
    return;
  }
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
  [...findings].sort((a,b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9)).forEach(f => {
    const color = f.severity === 'HIGH' || f.severity === 'CRITICAL' ? pc.red : f.severity === 'MEDIUM' ? pc.yellow : pc.cyan;
    console.log(color(`[${f.severity}] ${f.title}`));
    console.log(`  ${f.evidence}`);
    if (f.note) console.log(`  ${f.note}`);
    console.log('');
  });
}
