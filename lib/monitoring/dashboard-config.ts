import { Dashboard } from '@aws-sdk/client-cloudwatch';

export const dashboardConfig: Dashboard = {
  name: 'production-metrics',
  widgets: [
    {
      type: 'metric',
      properties: {
        metrics: [
          ['API', 'Latency', 'Endpoint', '/api/*'],
          ['API', 'RequestCount', 'Endpoint', '/api/*'],
          ['API', 'ErrorRate', 'Endpoint', '/api/*']
        ],
        period: 300,
        stat: 'Average',
        region: process.env.AWS_REGION,
        title: 'API Metrics'
      }
    },
    {
      type: 'metric',
      properties: {
        metrics: [
          ['Database', 'QueryLatency'],
          ['Database', 'ConnectionCount'],
          ['Database', 'CPUUtilization']
        ],
        period: 300,
        stat: 'Average',
        region: process.env.AWS_REGION,
        title: 'Database Metrics'
      }
    },
    {
      type: 'metric',
      properties: {
        metrics: [
          ['AI', 'TokenUsage'],
          ['AI', 'ResponseTime'],
          ['AI', 'ErrorRate']
        ],
        period: 300,
        stat: 'Average',
        region: process.env.AWS_REGION,
        title: 'AI Metrics'
      }
    }
  ]
};
