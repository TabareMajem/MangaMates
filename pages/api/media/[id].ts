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

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const media = await animeClient.getMediaById(Number(id));
    res.status(200).json(media);
  } catch (_error) {
    // Log error internally but don't expose details
    res.status(500).json({ error: 'Failed to fetch media' });
  }
}
