import type { 
  BasePayment, 
  PaymentResponse, 
  IPaymentProvider,
  PaymentStatus 
} from '../types';

export class PaymentManager {
  private providers = new Map<string, IPaymentProvider>();

  registerProvider(provider: IPaymentProvider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): IPaymentProvider | undefined {
    return this.providers.get(name);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async createPayment(
    providerName: string, 
    payment: Partial<BasePayment>
  ): Promise<PaymentResponse> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`
      };
    }

    try {
      return await provider.createPayment(payment);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPayment(
    providerName: string, 
    paymentId: string
  ): Promise<BasePayment | null> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return await provider.getPayment(paymentId);
  }

  async cancelPayment(
    providerName: string, 
    paymentId: string
  ): Promise<boolean> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return false;
    }

    try {
      return await provider.cancelPayment(paymentId);
    } catch (error) {
      return false;
    }
  }

  async refundPayment(
    providerName: string, 
    paymentId: string, 
    amount?: number
  ): Promise<boolean> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return false;
    }

    try {
      return await provider.refundPayment(paymentId, amount);
    } catch (error) {
      return false;
    }
  }

  validatePaymentStatus(status: string): status is PaymentStatus {
    const validStatuses: PaymentStatus[] = [
      'pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded'
    ];
    return validStatuses.includes(status as PaymentStatus);
  }
}