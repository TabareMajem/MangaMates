declare namespace Stripe {
  interface Subscription {
    id: string;
    status: 'active' | 'past_due' | 'canceled' | 'incomplete';
    current_period_end: number;
    cancel_at_period_end: boolean;
  }

  namespace Checkout {
    interface Session {
      id: string;
      metadata?: {
        user_id?: string;
        subscription_id?: string;
      };
      expires_at?: number;
    }
  }
}
