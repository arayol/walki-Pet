import type { 
  MarketplaceTransaction,
  MarketplaceResponse,
  MarketplaceSeller,
  IMarketplaceProvider
} from '../types';
import { MarketplaceManager } from '../core/MarketplaceManager';

export class MarketplaceService {
  private marketplaceManager: MarketplaceManager;

  constructor() {
    this.marketplaceManager = new MarketplaceManager();
  }

  registerProvider(provider: IMarketplaceProvider): void {
    this.marketplaceManager.registerProvider(provider);
  }

  getAvailableProviders(): string[] {
    return this.marketplaceManager.getAvailableProviders();
  }

  async createMarketplacePayment(
    providerName: string,
    paymentData: {
      amount: number;
      currency: string;
      sellerId: string;
      platformFeePercent?: number;
      platformFeeFixed?: number;
      customerId?: string;
      email?: string;
      name?: string;
      serviceName?: string;
      description?: string;
      successUrl?: string;
      cancelUrl?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<MarketplaceResponse> {
    // Calcular taxa da plataforma
    let platformFee = 0;
    if (paymentData.platformFeePercent) {
      platformFee = Math.round(paymentData.amount * (paymentData.platformFeePercent / 100));
    }
    if (paymentData.platformFeeFixed) {
      platformFee += paymentData.platformFeeFixed;
    }

    // Validar se taxa não é maior que o valor total
    if (platformFee >= paymentData.amount) {
      return {
        success: false,
        error: 'Platform fee cannot be equal to or greater than total amount'
      };
    }

    const transaction: Partial<MarketplaceTransaction> = {
      amount: paymentData.amount,
      currency: paymentData.currency,
      sellerId: paymentData.sellerId,
      platformFee,
      sellerAmount: paymentData.amount - platformFee,
      platformAmount: platformFee,
      customerId: paymentData.customerId,
      type: 'marketplace',
      status: 'pending',
      metadata: {
        email: paymentData.email,
        name: paymentData.name,
        serviceName: paymentData.serviceName,
        description: paymentData.description,
        successUrl: paymentData.successUrl,
        cancelUrl: paymentData.cancelUrl,
        origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        platformFeePercent: paymentData.platformFeePercent?.toString(),
        ...paymentData.metadata
      }
    };

    return await this.marketplaceManager.createMarketplacePayment(providerName, transaction);
  }

  async getMarketplaceTransaction(
    providerName: string, 
    transactionId: string
  ): Promise<MarketplaceTransaction | null> {
    const provider = this.marketplaceManager.getProvider(providerName);
    if (!provider) {
      return null;
    }

    // Verificar se o provider tem método getMarketplaceTransaction
    if ('getMarketplaceTransaction' in provider && typeof provider.getMarketplaceTransaction === 'function') {
      try {
        return await (provider as any).getMarketplaceTransaction(transactionId);
      } catch (error) {
        console.error('Error retrieving marketplace transaction:', error);
        return null;
      }
    }

    return null;
  }

  async createConnectedAccount(
    providerName: string, 
    sellerId: string,
    accountData?: {
      email?: string;
      name?: string;
      businessType?: string;
      country?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<{ accountId: string; onboardingUrl: string } | null> {
    try {
      const result = await this.marketplaceManager.createConnectedAccount(providerName, sellerId);
      
      // Se foram fornecidos dados adicionais, atualizá-los
      if (accountData && result.accountId) {
        await this.updateConnectedAccount(providerName, result.accountId, accountData);
      }

      return result;
    } catch (error) {
      console.error('Error creating connected account:', error);
      return null;
    }
  }

  async getConnectedAccount(
    providerName: string, 
    accountId: string
  ): Promise<MarketplaceSeller | null> {
    return await this.marketplaceManager.getConnectedAccount(providerName, accountId);
  }

  async updateConnectedAccount(
    providerName: string,
    accountId: string,
    updates: {
      email?: string;
      name?: string;
      businessType?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<boolean> {
    const provider = this.marketplaceManager.getProvider(providerName);
    if (!provider) {
      return false;
    }

    // Verificar se o provider tem método updateConnectedAccount
    if ('updateConnectedAccount' in provider && typeof provider.updateConnectedAccount === 'function') {
      try {
        return await (provider as any).updateConnectedAccount(accountId, updates);
      } catch (error) {
        console.error('Error updating connected account:', error);
        return false;
      }
    }

    return false;
  }

  async getAccountOnboardingLink(
    providerName: string,
    accountId: string,
    type: 'account_onboarding' | 'account_update' = 'account_onboarding'
  ): Promise<string | null> {
    const provider = this.marketplaceManager.getProvider(providerName);
    if (!provider) {
      return null;
    }

    // Verificar se o provider tem método createAccountLink
    if ('createAccountLink' in provider && typeof provider.createAccountLink === 'function') {
      try {
        return await (provider as any).createAccountLink(accountId, type);
      } catch (error) {
        console.error('Error creating account link:', error);
        return null;
      }
    }

    return null;
  }

  async getAccountStatus(
    providerName: string,
    accountId: string
  ): Promise<{
    onboardingComplete: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
    requiresInfo: boolean;
  } | null> {
    const provider = this.marketplaceManager.getProvider(providerName);
    if (!provider) {
      return null;
    }

    // Verificar se o provider tem método getAccountStatus
    if ('getAccountStatus' in provider && typeof provider.getAccountStatus === 'function') {
      try {
        return await (provider as any).getAccountStatus(accountId);
      } catch (error) {
        console.error('Error getting account status:', error);
        return null;
      }
    }

    return null;
  }

  async processTransfer(
    providerName: string,
    transferData: {
      paymentIntentId: string;
      sellerId: string;
      amount: number;
      currency?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<boolean> {
    const provider = this.marketplaceManager.getProvider(providerName);
    if (!provider) {
      return false;
    }

    // Verificar se o provider tem método processTransfer
    if ('processTransfer' in provider && typeof provider.processTransfer === 'function') {
      try {
        return await (provider as any).processTransfer(
          transferData.paymentIntentId,
          transferData.sellerId,
          transferData.amount
        );
      } catch (error) {
        console.error('Error processing transfer:', error);
        return false;
      }
    }

    return false;
  }

  // Métodos de conveniência para validação
  validateMarketplaceData(paymentData: {
    amount: number;
    currency: string;
    sellerId: string;
    platformFeePercent?: number;
    platformFeeFixed?: number;
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

    if (!paymentData.sellerId) {
      errors.push('Seller ID is required');
    }

    if (!paymentData.customerId && !paymentData.email) {
      errors.push('Either customer ID or email must be provided');
    }

    if (paymentData.email && !this.isValidEmail(paymentData.email)) {
      errors.push('Email must be valid');
    }

    // Validar taxa da plataforma
    let platformFee = 0;
    if (paymentData.platformFeePercent) {
      if (paymentData.platformFeePercent < 0 || paymentData.platformFeePercent > 100) {
        errors.push('Platform fee percentage must be between 0 and 100');
      }
      platformFee += Math.round(paymentData.amount * (paymentData.platformFeePercent / 100));
    }
    if (paymentData.platformFeeFixed) {
      if (paymentData.platformFeeFixed < 0) {
        errors.push('Platform fixed fee must be positive');
      }
      platformFee += paymentData.platformFeeFixed;
    }

    if (platformFee >= paymentData.amount) {
      errors.push('Total platform fee cannot be equal to or greater than payment amount');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculatePlatformFee(amount: number, feePercent?: number, feeFixed?: number): number {
    let fee = 0;
    if (feePercent) {
      fee += Math.round(amount * (feePercent / 100));
    }
    if (feeFixed) {
      fee += feeFixed;
    }
    return fee;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}