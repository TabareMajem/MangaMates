import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runSecurityAudit() {
  const results = {
    npmAudit: null,
    dependencyCheck: null,
    secretScan: null,
    timestamp: new Date().toISOString()
  };

  try {
    // Run npm audit
    const { stdout: npmOutput } = await execAsync('npm audit --json');
    results.npmAudit = JSON.parse(npmOutput);

    // Run dependency check
    const { stdout: depOutput } = await execAsync('npx dependency-check ./package.json');
    results.dependencyCheck = depOutput;

    // Run secret scanner
    const { stdout: secretOutput } = await execAsync('npx detect-secrets scan .');
    results.secretScan = JSON.parse(secretOutput);

    // Save results
    writeFileSync(
      `./security-reports/audit-${results.timestamp}.json`,
      JSON.stringify(results, null, 2)
    );

    console.log('Security audit completed successfully');
  } catch (error) {
    console.error('Security audit failed:', error);
    process.exit(1);
  }
}

runSecurityAudit();
