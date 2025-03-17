interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  timeout: number;
}

export class HealthCheckSystem {
  private checks: HealthCheck[] = [];

  registerCheck(check: HealthCheck) {
    this.checks.push(check);
  }

  async runHealthChecks() {
    const results = await Promise.all(
      this.checks.map(async (check) => {
        try {
          const result = await Promise.race([
            check.check(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), check.timeout)
            )
          ]);

          return {
            name: check.name,
            status: result ? 'healthy' : 'unhealthy',
            timestamp: new Date()
          };
        } catch (error) {
          return {
            name: check.name,
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date()
          };
        }
      })
    );

    return results;
  }
}
