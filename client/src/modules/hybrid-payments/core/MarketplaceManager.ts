import type { 
  MarketplaceTransaction, 
  MarketplaceResponse, 
  MarketplaceSeller,
  IMarketplaceProvider 
} from '../types';

export class MarketplaceManager {
  private providers = new Map<string, IMarketplaceProvider>();

  registerProvider(provider: IMarketplaceProvider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): IMarketplaceProvider | undefined {
    return this.providers.get(name);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async createMarketplacePayment(
    providerName: string, 
    transaction: Partial<MarketplaceTransaction>
  ): Promise<MarketplaceResponse> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`
      };
    }

    try {
      return await provider.createMarketplacePayment(transaction);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createConnectedAccount(
    providerName: string, 
    sellerId: string
  ): Promise<{ accountId: string; onboardingUrl: string } | null> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return null;
    }

    try {
      return await provider.createConnectedAccount(sellerId);
    } catch (error) {
      return null;
    }
  }

  async getConnectedAccount(
    providerName: string, 
    accountId: string
  ): Promise<MarketplaceSeller | null> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return null;
    }

    try {
      return await provider.getConnectedAccount(accountId);
    } catch (error) {
      return null;
    }
  }

  calculatePlatformFee(
    amount: number, 
    feePercentage: number = 5
  ): { platformFee: number; sellerAmount: number; platformAmount: number } {
    const platformFee = Math.round(amount * (feePercentage / 100));
    const sellerAmount = amount - platformFee;
    const platformAmount = platformFee;

    return { platformFee, sellerAmount, platformAmount };
  }

  validateMarketplaceTransaction(transaction: Partial<MarketplaceTransaction>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!transaction.sellerId) {
      errors.push('Seller ID is required');
    }

    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!transaction.platformFee || transaction.platformFee < 0) {
      errors.push('Valid platform fee is required');
    }

    if (transaction.amount && transaction.platformFee && 
        transaction.platformFee >= transaction.amount) {
      errors.push('Platform fee cannot be equal or greater than total amount');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}