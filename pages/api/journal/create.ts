import { validateBody } from '@/lib/middleware/validate';
import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    await validateBody('journalEntry')(req, res, async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(req.body)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create journal entry',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
