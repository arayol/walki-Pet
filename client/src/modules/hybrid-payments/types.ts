// Core Payment Types
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type PaymentType = 'subscription' | 'marketplace' | 'direct';
export type PaymentMethod = 'card' | 'pix' | 'boleto' | 'bank_transfer';

// Subscription Types
export type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
export type SubscriptionInterval = 'day' | 'week' | 'month' | 'year';

// Base interfaces
export interface BasePaymentProvider {
  id: string;
  name: string;
  supportedMethods: PaymentMethod[];
  supportedCountries: string[];
}

export interface BaseCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  providerId?: string; // Stripe customer ID
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BasePayment {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  method?: PaymentMethod;
  providerId?: string; // Stripe payment ID
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  failureReason?: string;
}

export interface BaseSubscription {
  id: string;
  customerId: string;
  planId?: string;
  priceId?: string; // Stripe price ID
  amount?: number;
  currency?: string;
  interval?: SubscriptionInterval;
  intervalCount?: number;
  status: SubscriptionStatus;
  providerId?: string; // Stripe subscription ID
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  canceledAt?: string;
}

export interface BaseSubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number;
  providerId?: string; // Stripe price ID
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Marketplace-specific types
export interface MarketplaceTransaction extends BasePayment {
  sellerId: string;
  platformFee: number;
  sellerAmount: number;
  platformAmount: number;
  transferId?: string; // Stripe transfer ID
}

export interface MarketplaceSeller {
  id: string;
  userId: string;
  stripeAccountId?: string;
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Service abstraction (for platform-specific services)
export interface BaseService {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  providerId: string;
  data: any;
  processed: boolean;
  processedAt?: string;
  createdAt: string;
}

// API Response types
export interface PaymentResponse {
  success: boolean;
  payment?: BasePayment;
  checkoutUrl?: string;
  clientSecret?: string;
  error?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: BaseSubscription;
  checkoutUrl?: string;
  clientSecret?: string;
  error?: string;
}

export interface MarketplaceResponse {
  success: boolean;
  transaction?: MarketplaceTransaction;
  checkoutUrl?: string;
  error?: string;
}

// Configuration types
export interface PaymentProviderConfig {
  name: string;
  credentials: Record<string, string>;
  webhookEndpoint: string;
  supportedMethods: PaymentMethod[];
}

// Service interfaces for dependency injection
export interface IPaymentProvider {
  name: string;
  createPayment(payment: Partial<BasePayment>): Promise<PaymentResponse>;
  getPayment(id: string): Promise<BasePayment | null>;
  cancelPayment(id: string): Promise<boolean>;
  refundPayment(id: string, amount?: number): Promise<boolean>;
}

export interface ISubscriptionProvider {
  name: string;
  createSubscription(subscription: Partial<BaseSubscription>): Promise<SubscriptionResponse>;
  getSubscription(id: string): Promise<BaseSubscription | null>;
  cancelSubscription(id: string): Promise<boolean>;
  updateSubscription(id: string, updates: Partial<BaseSubscription>): Promise<BaseSubscription | null>;
}

export interface IMarketplaceProvider {
  name: string;
  createMarketplacePayment(transaction: Partial<MarketplaceTransaction>): Promise<MarketplaceResponse>;
  createConnectedAccount(sellerId: string): Promise<{ accountId: string; onboardingUrl: string }>;
  getConnectedAccount(accountId: string): Promise<MarketplaceSeller | null>;
}