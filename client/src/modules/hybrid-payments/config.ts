// Hybrid Payments Module Configuration
export interface HybridPaymentsConfig {
  // Provider Configuration
  stripe: {
    secretKey: string;
    webhookSecret: string;
    connectWebhookSecret?: string;
    publishableKey?: string;
  };
  
  // Platform Configuration
  platform: {
    name: string;
    applicationFeePercent?: number; // For marketplace transactions
    currency: string;
    supportedCountries: string[];
  };
  
  // Feature Flags
  features: {
    subscriptions: boolean;
    marketplace: boolean;
    directPayments: boolean;
    multiTenant: boolean;
  };
  
  // Webhook Configuration
  webhooks: {
    subscriptionEndpoint: string;
    marketplaceEndpoint: string;
  };
  
  // Business Rules
  rules: {
    minTransactionAmount: number;
    maxTransactionAmount: number;
    supportedPaymentMethods: string[];
  };
}

// Default configuration for dog walking platform
export const defaultConfig: HybridPaymentsConfig = {
  stripe: {
    secretKey: '', // Will be loaded from environment
    webhookSecret: '',
    connectWebhookSecret: '',
  },
  platform: {
    name: 'DogWalking Platform',
    applicationFeePercent: 10, // 10% platform fee
    currency: 'brl',
    supportedCountries: ['BR'],
  },
  features: {
    subscriptions: true,
    marketplace: true,
    directPayments: true,
    multiTenant: false,
  },
  webhooks: {
    subscriptionEndpoint: '/functions/v1/hybrid-payments-subscription-webhook',
    marketplaceEndpoint: '/functions/v1/hybrid-payments-marketplace-webhook',
  },
  rules: {
    minTransactionAmount: 1000, // R$ 10.00 in cents
    maxTransactionAmount: 50000000, // R$ 500,000.00 in cents
    supportedPaymentMethods: ['card', 'pix', 'boleto'],
  },
};

// Environment-based configuration loader
export const loadConfig = (): HybridPaymentsConfig => {
  const config = { ...defaultConfig };
  
  // Load from environment variables or Supabase secrets
  // Note: This will be used in edge functions where Deno is available
  try {
    // @ts-ignore - Deno is available in edge function context
    if (typeof Deno !== 'undefined') {
      // @ts-ignore
      config.stripe.secretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
      // @ts-ignore  
      config.stripe.webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
      // @ts-ignore
      config.stripe.connectWebhookSecret = Deno.env.get('STRIPE_CONNECT_WEBHOOK_SECRET') || '';
    } else {
      // Frontend environment - use a dummy key to enable provider registration
      // The actual API calls will be made through edge functions
      config.stripe.secretKey = 'frontend-dummy-key';
    }
  } catch (error) {
    // Frontend environment - secrets will be loaded differently
    console.log('Config loading in frontend context');
    config.stripe.secretKey = 'frontend-dummy-key';
  }
  
  return config;
};