import { ErrorHandler } from '@/lib/error/error-handler';
import { lineClient } from '@/lib/line/client';
import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

const errorHandler = new ErrorHandler();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // Get tokens from LINE
    const tokens = await lineClient.getTokens(code);
    
    // Get user profile
    const profile = await lineClient.getUserProfile(tokens.access_token);
    
    // Store user data
    const { error: dbError } = await supabase.from('line_users').upsert({
      line_user_id: profile.userId,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });

    if (dbError) throw dbError;

    res.redirect(302, '/dashboard');
  } catch (error) {
    await errorHandler.handleError(error as Error, {
      context: 'line.callback',
      req
    });
    res.redirect(302, '/error?source=line-auth');
  }
}
