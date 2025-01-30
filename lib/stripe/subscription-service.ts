import { AppError, ErrorCode } from '@/lib/error/error-handler';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    aiCalls: number;
    storageGB: number;
    charactersPerMonth: number;
  };
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: ['Basic journaling', 'Limited AI analysis'],
    limits: {
      aiCalls: 50,
      storageGB: 1,
      charactersPerMonth: 3
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1500, // $15.00
    features: ['Advanced AI analysis', 'Unlimited characters'],
    limits: {
      aiCalls: 500,
      storageGB: 10,
      charactersPerMonth: -1 // unlimited
    }
  }
];

export class SubscriptionService {
  async createSubscription(userId: string, priceId: string) {
    try {
      // Get user
      const { data: user } = await supabase
        .from('users')
        .select('stripe_customer_id, email')
        .eq('id', userId)
        .single();

      if (!user) {
        throw new AppError('User not found', ErrorCode.AUTH_FAILED, 404);
      }

      // Create or get Stripe customer
      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId }
        });
        customerId = customer.id;

        // Update user with Stripe customer ID
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', userId);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Store subscription in database
      await supabase.from('subscriptions').insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        tier: subscription.items.data[0].price.nickname?.toLowerCase(),
        current_period_end: new Date(subscription.current_period_end * 1000)
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as Stripe.Invoice)
          .payment_intent?.client_secret
      };
    } catch (error) {
      throw new AppError(
        'Failed to create subscription',
        ErrorCode.PAYMENT_FAILED,
        500,
        error
      );
    }
  }

  // Additional subscription management methods...
}
