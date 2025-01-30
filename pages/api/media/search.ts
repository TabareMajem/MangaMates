import { AnimeClient } from '@/lib/api/anime-client';
import type { NextApiRequest, NextApiResponse } from 'next';

const animeClient = new AnimeClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q: query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query' });
  }

  try {
    const results = await searchMedia(query);
    res.status(200).json(results);
  } catch (_error) {
    // Log error internally but don't expose details
    res.status(500).json({ error: 'Search failed' });
  }
}
