import type { HybridPaymentsConfig } from '../config';
import { PaymentManager } from './PaymentManager';
import { SubscriptionManager } from './SubscriptionManager';
import { MarketplaceManager } from './MarketplaceManager';
import { PaymentService } from '../services/PaymentService';
import { SubscriptionService } from '../services/SubscriptionService';
import { MarketplaceService } from '../services/MarketplaceService';
import { StripePaymentProvider } from '../providers/StripePaymentProvider';
import { StripeSubscriptionProvider } from '../providers/StripeSubscriptionProvider';
import { StripeMarketplaceProvider } from '../providers/StripeMarketplaceProvider';

export class HybridPaymentsManager {
  private paymentManager: PaymentManager;
  private subscriptionManager: SubscriptionManager;
  private marketplaceManager: MarketplaceManager;
  
  public payments: PaymentService;
  public subscriptions: SubscriptionService;
  public marketplace: MarketplaceService;

  constructor(config: HybridPaymentsConfig) {
    // Initialize managers
    this.paymentManager = new PaymentManager();
    this.subscriptionManager = new SubscriptionManager();
    this.marketplaceManager = new MarketplaceManager();

    // Initialize services
    this.payments = new PaymentService();
    this.subscriptions = new SubscriptionService();
    this.marketplace = new MarketplaceService();

    // Initialize and register Stripe providers
    if (config.stripe?.secretKey) {
      const stripePaymentProvider = new StripePaymentProvider(config.stripe.secretKey);
      const stripeSubscriptionProvider = new StripeSubscriptionProvider(config.stripe.secretKey);
      const stripeMarketplaceProvider = new StripeMarketplaceProvider(config.stripe.secretKey);

      this.paymentManager.registerProvider(stripePaymentProvider);
      this.subscriptionManager.registerProvider(stripeSubscriptionProvider);
      this.marketplaceManager.registerProvider(stripeMarketplaceProvider);
      
      this.payments.registerProvider(stripePaymentProvider);
      this.subscriptions.registerProvider(stripeSubscriptionProvider);
      this.marketplace.registerProvider(stripeMarketplaceProvider);
    }
  }

  /**
   * Get available payment providers
   */
  getAvailableProviders() {
    return {
      payments: this.paymentManager.getAvailableProviders(),
      subscriptions: this.subscriptionManager.getAvailableProviders(),
      marketplace: this.marketplaceManager.getAvailableProviders(),
    };
  }

  /**
   * Health check for all services
   */
  async healthCheck() {
    const results = {
      payments: this.paymentManager.getAvailableProviders().length > 0,
      subscriptions: this.subscriptionManager.getAvailableProviders().length > 0,
      marketplace: this.marketplaceManager.getAvailableProviders().length > 0,
    };

    return {
      healthy: Object.values(results).every(Boolean),
      services: results,
    };
  }
}