import type { 
  BasePayment, 
  PaymentResponse, 
  IPaymentProvider
} from '../types';
import { PaymentManager } from '../core/PaymentManager';

export class PaymentService {
  private paymentManager: PaymentManager;

  constructor() {
    this.paymentManager = new PaymentManager();
  }

  registerProvider(provider: IPaymentProvider): void {
    this.paymentManager.registerProvider(provider);
  }

  getAvailableProviders(): string[] {
    return this.paymentManager.getAvailableProviders();
  }

  async createPayment(
    providerName: string,
    paymentData: {
      amount: number;
      currency: string;
      customerId?: string;
      email?: string;
      name?: string;
      productName?: string;
      description?: string;
      successUrl?: string;
      cancelUrl?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<PaymentResponse> {
    const payment: Partial<BasePayment> = {
      amount: paymentData.amount,
      currency: paymentData.currency,
      customerId: paymentData.customerId,
      type: 'direct',
      metadata: {
        email: paymentData.email,
        name: paymentData.name,
        productName: paymentData.productName,
        description: paymentData.description,
        successUrl: paymentData.successUrl,
        cancelUrl: paymentData.cancelUrl,
        origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        ...paymentData.metadata
      }
    };

    return await this.paymentManager.createPayment(providerName, payment);
  }

  async getPayment(providerName: string, paymentId: string): Promise<BasePayment | null> {
    return await this.paymentManager.getPayment(providerName, paymentId);
  }

  async cancelPayment(providerName: string, paymentId: string): Promise<boolean> {
    return await this.paymentManager.cancelPayment(providerName, paymentId);
  }

  async refundPayment(
    providerName: string, 
    paymentId: string, 
    amount?: number
  ): Promise<boolean> {
    return await this.paymentManager.refundPayment(providerName, paymentId, amount);
  }

  async createCheckoutSession(
    providerName: string,
    paymentData: {
      amount: number;
      currency: string;
      customerId?: string;
      email?: string;
      name?: string;
      productName?: string;
      description?: string;
      successUrl?: string;
      cancelUrl?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<PaymentResponse> {
    // Para checkout sessions, usamos o mesmo método createPayment
    return await this.createPayment(providerName, paymentData);
  }

  async createPaymentIntent(
    providerName: string,
    paymentData: {
      amount: number;
      currency: string;
      customerId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<PaymentResponse> {
    const provider = this.paymentManager.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`
      };
    }

    // Verificar se o provider tem método createPaymentIntent
    if ('createPaymentIntent' in provider && typeof provider.createPaymentIntent === 'function') {
      const payment: Partial<BasePayment> = {
        amount: paymentData.amount,
        currency: paymentData.currency,
        customerId: paymentData.customerId,
        type: 'direct',
        metadata: paymentData.metadata
      };

      return await (provider as any).createPaymentIntent(payment);
    }

    return {
      success: false,
      error: `Provider ${providerName} does not support payment intents`
    };
  }

  async processWebhook(
    providerName: string,
    webhookData: any,
    signature?: string
  ): Promise<{ success: boolean; processed?: boolean; error?: string }> {
    const provider = this.paymentManager.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`
      };
    }

    // Verificar se o provider tem método processWebhook
    if ('processWebhook' in provider && typeof provider.processWebhook === 'function') {
      try {
        const result = await (provider as any).processWebhook(webhookData, signature);
        return { success: true, processed: result };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Webhook processing failed'
        };
      }
    }

    return {
      success: false,
      error: `Provider ${providerName} does not support webhook processing`
    };
  }

  // Método de conveniência para validar dados de pagamento
  validatePaymentData(paymentData: {
    amount: number;
    currency: string;
    customerId?: string;
    email?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!paymentData.currency || paymentData.currency.length !== 3) {
      errors.push('Currency must be a valid 3-letter code');
    }

    if (!paymentData.customerId && !paymentData.email) {
      errors.push('Either customer ID or email must be provided');
    }

    if (paymentData.email && !this.isValidEmail(paymentData.email)) {
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
}