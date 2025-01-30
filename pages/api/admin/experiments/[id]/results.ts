import { ABTestingService } from '@/lib/experiments/ab-testing';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid experiment ID' });
  }

  try {
    const service = new ABTestingService();
    const results = await service.getResults(id);
    res.status(200).json(results);
  } catch (error) {
    console.error('Failed to fetch experiment results:', error);
    res.status(500).json({ error: 'Failed to fetch experiment results' });
  }
}
