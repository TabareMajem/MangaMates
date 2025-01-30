import { CostCalculator } from '@/lib/monitoring/cost-calculator';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const calculator = new CostCalculator();
    const costs = await calculator.calculateCosts();
    
    res.status(200).json({
      costs: costs.daily,
      totalCost: costs.total,
      projectedCost: costs.projected
    });
  } catch (error) {
    console.error('Failed to fetch costs:', error);
    res.status(500).json({ error: 'Failed to fetch costs' });
  }
}
