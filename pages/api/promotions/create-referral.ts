import { ErrorHandler } from '@/lib/error/error-handler';
import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const errorHandler = new ErrorHandler();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create a coupon in Stripe
    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: 'once',
      metadata: {
        type: 'referral',
        referrerId: userId
      }
    });

    // Generate a unique code
    const code = `REF-${userId.substring(0, 6)}-${Date.now().toString(36)}`;

    // Create promotion code in Stripe
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
      metadata: {
        type: 'referral',
        referrerId: userId
      }
    });

    // Store in database
    const { error } = await supabase
      .from('promotion_codes')
      .insert({
        code: promotionCode.code,
        coupon_id: coupon.id,
        customer_id: userId,
        metadata: {
          type: 'referral',
          referrerId: userId
        }
      });

    if (error) throw error;

    res.json({ code: promotionCode.code });
  } catch (error) {
    await errorHandler.handleError(error, {
      context: 'create-referral',
      userId: req.body.userId
    });
    
    res.status(500).json({
      error: {
        message: 'Failed to create referral code',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}
