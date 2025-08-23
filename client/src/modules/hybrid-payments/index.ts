// Main module exports
export * from './config';
export * from './types';
export * from './utils';
export * from './core';
export * from './providers';
export * from './services';

// Re-export commonly used items for convenience
export {
  type HybridPaymentsConfig,
  defaultConfig,
  loadConfig,
} from './config';

export {
  type BasePayment,
  type BaseSubscription,
  type MarketplaceTransaction,
} from './types';

export {
  type PaymentStatus,
  type PaymentType,
  type SubscriptionStatus,
  type PaymentMethod,
} from './types';

export {
  formatCurrency,
  getPaymentStatusText,
  getSubscriptionStatusText,
  validateEmail,
  validateAmount,
  PaymentError,
} from './utils';

export {
  PaymentManager,
  SubscriptionManager,
  MarketplaceManager,
  HybridPaymentsManager,
} from './core';