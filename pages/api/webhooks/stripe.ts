import { ErrorHandler } from '@/lib/error/error-handler';
import { supabase } from '@/lib/supabase';
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const errorHandler = new ErrorHandler();

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      webhookSecret
    );

    console.log(`Processing Stripe webhook: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPaymentIntent(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleFailedPaymentIntent(paymentIntent);
        break;
      }
      case 'promotion_code.created':
      case 'promotion_code.updated': {
        const promoCode = event.data.object as Stripe.PromotionCode;
        await handlePromotionCode(promoCode);
        break;
      }
      case 'customer.discount.created': {
        const discount = event.data.object as Stripe.Discount;
        await handleDiscountCreated(discount);
        break;
      }
      case 'coupon.created': {
        const coupon = event.data.object as Stripe.Coupon;
        await handleCouponCreated(coupon);
        break;
      }
      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    await errorHandler.handleError(error, {
      context: 'stripe-webhook',
      headers: req.headers
    });
    
    return res.status(400).json({
      error: {
        message: 'Webhook error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { user_id, subscription_id } = session.metadata || {};
  if (!user_id || !subscription_id) return;

  // Update user's subscription status in database
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id,
      stripe_subscription_id: subscription_id,
      status: 'active',
      current_period_end: new Date(session.expires_at! * 1000).toISOString()
    });

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
}

async function handleSuccessfulPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from('payments')
    .insert({
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      customer_id: paymentIntent.customer,
      metadata: paymentIntent.metadata
    });

  if (error) {
    throw new Error(`Failed to record payment: ${error.message}`);
  }
}

async function handleFailedPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from('payments')
    .update({
      status: paymentIntent.status,
      last_error: paymentIntent.last_payment_error?.message
    })
    .eq('payment_intent_id', paymentIntent.id);

  if (error) {
    throw new Error(`Failed to update failed payment: ${error.message}`);
  }
}

async function handlePromotionCode(promoCode: Stripe.PromotionCode) {
  const { error } = await supabase
    .from('promotion_codes')
    .upsert({
      code: promoCode.code,
      active: promoCode.active,
      coupon_id: promoCode.coupon.id,
      customer_id: promoCode.customer,
      max_redemptions: promoCode.max_redemptions,
      times_redeemed: promoCode.times_redeemed,
      expires_at: promoCode.expires_at ? new Date(promoCode.expires_at * 1000).toISOString() : null,
      metadata: promoCode.metadata
    });

  if (error) {
    throw new Error(`Failed to update promotion code: ${error.message}`);
  }
}

async function handleDiscountCreated(discount: Stripe.Discount) {
  const { error } = await supabase
    .from('customer_discounts')
    .insert({
      customer_id: discount.customer,
      promotion_code: discount.promotion_code,
      coupon_id: discount.coupon.id,
      start: new Date(discount.start * 1000).toISOString(),
      end: discount.end ? new Date(discount.end * 1000).toISOString() : null
    });

  if (error) {
    throw new Error(`Failed to record discount: ${error.message}`);
  }
}

async function handleCouponCreated(coupon: Stripe.Coupon) {
  const { error } = await supabase
    .from('coupons')
    .insert({
      coupon_id: coupon.id,
      name: coupon.name,
      percent_off: coupon.percent_off,
      amount_off: coupon.amount_off,
      duration: coupon.duration,
      duration_in_months: coupon.duration_in_months,
      max_redemptions: coupon.max_redemptions,
      times_redeemed: coupon.times_redeemed,
      valid: coupon.valid,
      metadata: coupon.metadata
    });

  if (error) {
    throw new Error(`Failed to create coupon: ${error.message}`);
  }
}
