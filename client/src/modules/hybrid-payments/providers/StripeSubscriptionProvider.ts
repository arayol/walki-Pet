import type { 
  BaseSubscription, 
  SubscriptionResponse, 
  ISubscriptionProvider,
  SubscriptionStatus,
  PaymentMethod 
} from '../types';

export class StripeSubscriptionProvider implements ISubscriptionProvider {
  public readonly name = 'stripe';
  private stripe: any;

  constructor(stripe: any) {
    this.stripe = stripe;
  }

  async createSubscription(subscription: Partial<BaseSubscription>): Promise<SubscriptionResponse> {
    try {
      if (!subscription.customerId || !subscription.priceId) {
        return {
          success: false,
          error: 'Customer ID and Price ID are required'
        };
      }

      const stripeSubscription = await this.stripe.subscriptions.create({
        customer: subscription.customerId,
        items: [{ price: subscription.priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: subscription.metadata || {}
      });

      const mappedSubscription = this.mapStripeToBase(stripeSubscription);

      return {
        success: true,
        subscription: mappedSubscription,
        clientSecret: stripeSubscription.latest_invoice?.payment_intent?.client_secret
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getSubscription(subscriptionId: string): Promise<BaseSubscription | null> {
    try {
      const stripeSubscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return this.mapStripeToBase(stripeSubscription);
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  async updateSubscription(
    subscriptionId: string, 
    updates: Partial<BaseSubscription>
  ): Promise<BaseSubscription | null> {
    try {
      const updateData: any = {};

      if (updates.priceId) {
        // Para trocar o preço, precisamos atualizar o item da assinatura
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        updateData.items = [
          {
            id: subscription.items.data[0].id,
            price: updates.priceId,
          },
        ];
      }

      if (updates.metadata) {
        updateData.metadata = updates.metadata;
      }

      const stripeSubscription = await this.stripe.subscriptions.update(
        subscriptionId, 
        updateData
      );

      return this.mapStripeToBase(stripeSubscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return null;
    }
  }

  async pauseSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        pause_collection: {
          behavior: 'mark_uncollectible',
        },
      });
      return true;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      return false;
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        pause_collection: null,
      });
      return true;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      return false;
    }
  }

  async getSubscriptionsByCustomer(customerId: string): Promise<BaseSubscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit: 100,
      });

      return subscriptions.data.map(sub => this.mapStripeToBase(sub));
    } catch (error) {
      console.error('Error retrieving customer subscriptions:', error);
      return [];
    }
  }

  private mapStripeToBase(stripeSubscription: any): BaseSubscription {
    return {
      id: stripeSubscription.id,
      customerId: stripeSubscription.customer,
      priceId: stripeSubscription.items.data[0]?.price?.id,
      status: this.mapStripeStatus(stripeSubscription.status),
      amount: stripeSubscription.items.data[0]?.price?.unit_amount || 0,
      currency: stripeSubscription.items.data[0]?.price?.currency || 'usd',
      interval: stripeSubscription.items.data[0]?.price?.recurring?.interval,
      intervalCount: stripeSubscription.items.data[0]?.price?.recurring?.interval_count || 1,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      metadata: stripeSubscription.metadata || {},
      createdAt: new Date(stripeSubscription.created * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private mapStripeStatus(stripeStatus: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      'incomplete': 'incomplete',
      'incomplete_expired': 'incomplete_expired',
      'trialing': 'trialing',
      'active': 'active',
      'past_due': 'past_due',
      'canceled': 'canceled',
      'unpaid': 'unpaid'
    };

    return statusMap[stripeStatus] || 'canceled';
  }
}