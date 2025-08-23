import type { 
  BaseSubscription, 
  SubscriptionResponse, 
  ISubscriptionProvider,
  SubscriptionStatus 
} from '../types';

export class SubscriptionManager {
  private providers = new Map<string, ISubscriptionProvider>();

  registerProvider(provider: ISubscriptionProvider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): ISubscriptionProvider | undefined {
    return this.providers.get(name);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async createSubscription(
    providerName: string, 
    subscription: Partial<BaseSubscription>
  ): Promise<SubscriptionResponse> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`
      };
    }

    try {
      return await provider.createSubscription(subscription);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getSubscription(
    providerName: string, 
    subscriptionId: string
  ): Promise<BaseSubscription | null> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return await provider.getSubscription(subscriptionId);
  }

  async cancelSubscription(
    providerName: string, 
    subscriptionId: string
  ): Promise<boolean> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return false;
    }

    try {
      return await provider.cancelSubscription(subscriptionId);
    } catch (error) {
      return false;
    }
  }

  async updateSubscription(
    providerName: string, 
    subscriptionId: string, 
    updates: Partial<BaseSubscription>
  ): Promise<BaseSubscription | null> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return null;
    }

    try {
      return await provider.updateSubscription(subscriptionId, updates);
    } catch (error) {
      return null;
    }
  }

  validateSubscriptionStatus(status: string): status is SubscriptionStatus {
    const validStatuses: SubscriptionStatus[] = [
      'active', 'canceled', 'incomplete', 'incomplete_expired', 
      'past_due', 'trialing', 'unpaid'
    ];
    return validStatuses.includes(status as SubscriptionStatus);
  }

  isSubscriptionActive(subscription: BaseSubscription): boolean {
    return subscription.status === 'active' || subscription.status === 'trialing';
  }

  isSubscriptionExpired(subscription: BaseSubscription): boolean {
    const now = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    return endDate < now && subscription.status !== 'active';
  }
}