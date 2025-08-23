import type { 
  BaseSubscription, 
  SubscriptionResponse, 
  ISubscriptionProvider,
  BaseSubscriptionPlan
} from '../types';
import { SubscriptionManager } from '../core/SubscriptionManager';

export class SubscriptionService {
  private subscriptionManager: SubscriptionManager;

  constructor() {
    this.subscriptionManager = new SubscriptionManager();
  }

  registerProvider(provider: ISubscriptionProvider): void {
    this.subscriptionManager.registerProvider(provider);
  }

  getAvailableProviders(): string[] {
    return this.subscriptionManager.getAvailableProviders();
  }

  async createSubscription(
    providerName: string,
    subscriptionData: {
      customerId?: string;
      email?: string;
      name?: string;
      priceId?: string;
      planId?: string;
      trialDays?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<SubscriptionResponse> {
    const subscription: Partial<BaseSubscription> = {
      customerId: subscriptionData.customerId,
      priceId: subscriptionData.priceId,
      planId: subscriptionData.planId,
      status: 'incomplete',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      cancelAtPeriodEnd: false,
      metadata: {
        email: subscriptionData.email,
        name: subscriptionData.name,
        trialDays: subscriptionData.trialDays?.toString(),
        ...subscriptionData.metadata
      }
    };

    return await this.subscriptionManager.createSubscription(providerName, subscription);
  }

  async getSubscription(providerName: string, subscriptionId: string): Promise<BaseSubscription | null> {
    return await this.subscriptionManager.getSubscription(providerName, subscriptionId);
  }

  async cancelSubscription(providerName: string, subscriptionId: string): Promise<boolean> {
    return await this.subscriptionManager.cancelSubscription(providerName, subscriptionId);
  }

  async updateSubscription(
    providerName: string, 
    subscriptionId: string, 
    updates: {
      priceId?: string;
      planId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<BaseSubscription | null> {
    const subscriptionUpdates: Partial<BaseSubscription> = {
      priceId: updates.priceId,
      planId: updates.planId,
      metadata: updates.metadata,
      updatedAt: new Date().toISOString()
    };

    return await this.subscriptionManager.updateSubscription(providerName, subscriptionId, subscriptionUpdates);
  }

  async pauseSubscription(providerName: string, subscriptionId: string): Promise<boolean> {
    const provider = this.subscriptionManager.getProvider(providerName);
    if (!provider) {
      return false;
    }

    // Verificar se o provider tem método pauseSubscription
    if ('pauseSubscription' in provider && typeof provider.pauseSubscription === 'function') {
      try {
        return await (provider as any).pauseSubscription(subscriptionId);
      } catch (error) {
        console.error('Error pausing subscription:', error);
        return false;
      }
    }

    return false;
  }

  async resumeSubscription(providerName: string, subscriptionId: string): Promise<boolean> {
    const provider = this.subscriptionManager.getProvider(providerName);
    if (!provider) {
      return false;
    }

    // Verificar se o provider tem método resumeSubscription
    if ('resumeSubscription' in provider && typeof provider.resumeSubscription === 'function') {
      try {
        return await (provider as any).resumeSubscription(subscriptionId);
      } catch (error) {
        console.error('Error resuming subscription:', error);
        return false;
      }
    }

    return false;
  }

  async getSubscriptionsByCustomer(
    providerName: string, 
    customerId: string
  ): Promise<BaseSubscription[]> {
    const provider = this.subscriptionManager.getProvider(providerName);
    if (!provider) {
      return [];
    }

    // Verificar se o provider tem método getSubscriptionsByCustomer
    if ('getSubscriptionsByCustomer' in provider && typeof provider.getSubscriptionsByCustomer === 'function') {
      try {
        return await (provider as any).getSubscriptionsByCustomer(customerId);
      } catch (error) {
        console.error('Error retrieving customer subscriptions:', error);
        return [];
      }
    }

    return [];
  }

  isSubscriptionActive(subscription: BaseSubscription): boolean {
    return this.subscriptionManager.isSubscriptionActive(subscription);
  }

  isSubscriptionExpired(subscription: BaseSubscription): boolean {
    return this.subscriptionManager.isSubscriptionExpired(subscription);
  }

  validateSubscriptionStatus(status: string): boolean {
    return this.subscriptionManager.validateSubscriptionStatus(status);
  }

  async createCheckoutSession(
    providerName: string,
    checkoutData: {
      customerId?: string;
      email?: string;
      name?: string;
      priceId: string;
      successUrl?: string;
      cancelUrl?: string;
      trialDays?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<SubscriptionResponse> {
    const provider = this.subscriptionManager.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`
      };
    }

    // Para checkout de assinatura, criamos a subscription diretamente
    return await this.createSubscription(providerName, {
      customerId: checkoutData.customerId,
      email: checkoutData.email,
      name: checkoutData.name,
      priceId: checkoutData.priceId,
      trialDays: checkoutData.trialDays,
      metadata: {
        successUrl: checkoutData.successUrl,
        cancelUrl: checkoutData.cancelUrl,
        origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        ...checkoutData.metadata
      }
    });
  }

  // Método de conveniência para validar dados de assinatura
  validateSubscriptionData(subscriptionData: {
    customerId?: string;
    email?: string;
    priceId?: string;
    planId?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!subscriptionData.customerId && !subscriptionData.email) {
      errors.push('Either customer ID or email must be provided');
    }

    if (!subscriptionData.priceId && !subscriptionData.planId) {
      errors.push('Either price ID or plan ID must be provided');
    }

    if (subscriptionData.email && !this.isValidEmail(subscriptionData.email)) {
      errors.push('Email must be valid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Métodos para gerenciar planos (se necessário)
  async createSubscriptionPlan(
    providerName: string,
    planData: Omit<BaseSubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BaseSubscriptionPlan | null> {
    const provider = this.subscriptionManager.getProvider(providerName);
    if (!provider) {
      return null;
    }

    // Verificar se o provider tem método createPlan
    if ('createPlan' in provider && typeof provider.createPlan === 'function') {
      try {
        return await (provider as any).createPlan(planData);
      } catch (error) {
        console.error('Error creating subscription plan:', error);
        return null;
      }
    }

    return null;
  }

  async getSubscriptionPlan(
    providerName: string, 
    planId: string
  ): Promise<BaseSubscriptionPlan | null> {
    const provider = this.subscriptionManager.getProvider(providerName);
    if (!provider) {
      return null;
    }

    // Verificar se o provider tem método getPlan
    if ('getPlan' in provider && typeof provider.getPlan === 'function') {
      try {
        return await (provider as any).getPlan(planId);
      } catch (error) {
        console.error('Error retrieving subscription plan:', error);
        return null;
      }
    }

    return null;
  }
}