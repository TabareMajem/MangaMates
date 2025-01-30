import { kakaoClient } from '@/lib/kakao/client';
import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // Get tokens from Kakao
    const tokens = await kakaoClient.getTokens(code);
    
    // Get user profile
    const profile = await kakaoClient.getUserProfile(tokens.access_token);
    
    // Store user data
    const { error: dbError } = await supabase.from('kakao_users').upsert({
      kakao_id: profile.id,
      nickname: profile.nickname,
      profile_image: profile.profile_image,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      updated_at: new Date().toISOString()
    });

    if (dbError) throw dbError;

    res.redirect(302, '/dashboard');
  } catch (error) {
    console.error('Kakao auth error:', error);
    res.redirect(302, '/error?source=kakao-auth');
  }
}
