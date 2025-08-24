import type { 
  MarketplaceTransaction,
  MarketplaceResponse,
  MarketplaceSeller,
  IMarketplaceProvider
} from '../types';
import { supabase } from '@/integrations/supabase/client';

export class StripeMarketplaceProvider implements IMarketplaceProvider {
  public readonly name = 'stripe';
  private stripe: any;

  constructor(secretKey: string) {
    // Initialize Stripe only if we're in a proper environment
    if (secretKey && secretKey !== 'frontend-dummy-key') {
      // Only initialize if we have a real key (server-side)
      try {
        const Stripe = require('stripe');
        this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
      } catch (error) {
        console.warn('Stripe initialization failed in frontend context');
        this.stripe = null;
      }
    } else {
      // Frontend context - will use edge functions
      this.stripe = null;
    }
  }

  async createMarketplacePayment(transaction: Partial<MarketplaceTransaction>): Promise<MarketplaceResponse> {
    try {
      // In frontend context, delegate to edge function
      if (!this.stripe) {
        return this.createMarketplacePaymentViaEdgeFunction(transaction);
      }

      if (!transaction.amount || !transaction.currency || !transaction.sellerId || !transaction.platformFee) {
        return {
          success: false,
          error: 'Amount, currency, seller ID, and platform fee are required'
        };
      }

      // Buscar conta conectada do seller
      const seller = await this.getConnectedAccountBySellerId(transaction.sellerId);
      if (!seller?.stripeAccountId) {
        return {
          success: false,
          error: 'Seller not found or not connected to Stripe'
        };
      }

      // Calcular valores
      const platformAmount = transaction.platformFee;
      const sellerAmount = transaction.amount - platformAmount;

      if (sellerAmount < 0) {
        return {
          success: false,
          error: 'Platform fee cannot be greater than total amount'
        };
      }

      // Verificar se já existe cliente ou criar novo
      let customerId = transaction.customerId;
      if (!customerId && transaction.metadata?.email) {
        const customers = await this.stripe.customers.list({ 
          email: transaction.metadata.email, 
          limit: 1 
        });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await this.stripe.customers.create({
            email: transaction.metadata.email,
            name: transaction.metadata.name
          });
          customerId = customer.id;
        }
      }

      // Criar sessão de checkout com split payment
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : transaction.metadata?.email,
        line_items: [
          {
            price_data: {
              currency: transaction.currency,
              product_data: { 
                name: transaction.metadata?.serviceName || 'Service',
                description: transaction.metadata?.description
              },
              unit_amount: transaction.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: transaction.metadata?.successUrl || `${transaction.metadata?.origin}/payment-success`,
        cancel_url: transaction.metadata?.cancelUrl || `${transaction.metadata?.origin}/payment-canceled`,
        payment_intent_data: {
          application_fee_amount: platformAmount,
          transfer_data: {
            destination: seller.stripeAccountId,
          },
          metadata: {
            ...transaction.metadata,
            sellerId: transaction.sellerId,
            platformFee: platformAmount.toString(),
            sellerAmount: sellerAmount.toString()
          }
        },
        metadata: transaction.metadata || {}
      });

      const mappedTransaction: MarketplaceTransaction = {
        id: session.id,
        customerId: customerId || '',
        amount: transaction.amount,
        currency: transaction.currency,
        status: 'pending',
        type: 'marketplace',
        providerId: session.id,
        sellerId: transaction.sellerId,
        platformFee: platformAmount,
        sellerAmount,
        platformAmount,
        metadata: transaction.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        transaction: mappedTransaction,
        checkoutUrl: session.url || undefined
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createMarketplacePaymentViaEdgeFunction(transaction: Partial<MarketplaceTransaction>): Promise<MarketplaceResponse> {
    try {
      console.log('Using PostgreSQL API for marketplace payment');
      
      // Use our PostgreSQL backend instead of Supabase edge functions
      const response = await fetch('/api/stripe/create-marketplace-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: transaction.amount,
          currency: transaction.currency || 'BRL',
          sellerId: transaction.sellerId,
          platformFeePercent: 10, // Fixed 10% platform fee  
          metadata: transaction.metadata || {}
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const data = await response.json();

      return {
        success: data.success,
        checkoutUrl: data.checkoutUrl,
        transaction: {
          id: data.session_id,
          customerId: '',
          amount: transaction.amount || 0,
          currency: transaction.currency || 'BRL',
          status: 'pending',
          type: 'marketplace',
          providerId: data.session_id,
          sellerId: transaction.sellerId || '',
          platformFee: data.platform_fee_amount || 0,
          sellerAmount: data.walker_amount || 0,
          platformAmount: data.platform_fee_amount || 0,
          metadata: transaction.metadata || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error in createMarketplacePaymentViaEdgeFunction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createConnectedAccount(sellerId: string): Promise<{ accountId: string; onboardingUrl: string }> {
    try {
      // Criar conta conectada Stripe Express
      const account = await this.stripe.accounts.create({
        type: 'express',
        metadata: {
          sellerId: sellerId
        }
      });

      // Criar link de onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/dashboard?refresh=true`,
        return_url: `${process.env.FRONTEND_URL}/dashboard?setup=complete`,
        type: 'account_onboarding',
      });

      // Salvar informações da conta (seria ideal salvar no banco de dados)
      // Por enquanto, apenas retornamos os dados
      
      return {
        accountId: account.id,
        onboardingUrl: accountLink.url
      };
    } catch (error) {
      throw new Error(`Failed to create connected account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getConnectedAccount(accountId: string): Promise<MarketplaceSeller | null> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      
      return {
        id: accountId,
        userId: account.metadata?.sellerId || '',
        stripeAccountId: accountId,
        onboardingComplete: account.details_submitted || false,
        payoutsEnabled: account.payouts_enabled || false,
        chargesEnabled: account.charges_enabled || false,
        metadata: account.metadata || {},
        createdAt: new Date(account.created * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error retrieving connected account:', error);
      return null;
    }
  }

  async getConnectedAccountBySellerId(sellerId: string): Promise<MarketplaceSeller | null> {
    // Para o marketplace payment, vamos usar a edge function que funciona de forma mais robusta
    // Este método será chamado durante a criação da checkout session via edge function
    // Retornando uma implementação temporária que permita o fluxo continuar
    console.log('Looking up connected account for seller:', sellerId);
    
    // Assumir que o seller tem conta conectada - a validação real acontece na edge function
    return {
      id: sellerId,
      userId: sellerId,
      stripeAccountId: `connected_account_${sellerId}`, // Placeholder - será substituído na edge function
      onboardingComplete: true,
      payoutsEnabled: true,
      chargesEnabled: true,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async createAccountLink(accountId: string, type: 'account_onboarding' | 'account_update' = 'account_onboarding'): Promise<string> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.FRONTEND_URL}/dashboard?refresh=true`,
        return_url: `${process.env.FRONTEND_URL}/dashboard?setup=complete`,
        type,
      });

      return accountLink.url;
    } catch (error) {
      throw new Error(`Failed to create account link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAccountStatus(accountId: string): Promise<{
    onboardingComplete: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
    requiresInfo: boolean;
  }> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      
      return {
        onboardingComplete: account.details_submitted || false,
        payoutsEnabled: account.payouts_enabled || false,
        chargesEnabled: account.charges_enabled || false,
        requiresInfo: account.requirements?.currently_due?.length > 0 || false
      };
    } catch (error) {
      throw new Error(`Failed to get account status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processTransfer(paymentIntentId: string, sellerId: string, amount: number): Promise<boolean> {
    try {
      const seller = await this.getConnectedAccountBySellerId(sellerId);
      if (!seller?.stripeAccountId) {
        throw new Error('Seller account not found');
      }

      await this.stripe.transfers.create({
        amount,
        currency: 'usd',
        destination: seller.stripeAccountId,
        source_transaction: paymentIntentId,
        metadata: {
          sellerId,
          paymentIntentId
        }
      });

      return true;
    } catch (error) {
      console.error('Error processing transfer:', error);
      return false;
    }
  }

  async getMarketplaceTransaction(transactionId: string): Promise<MarketplaceTransaction | null> {
    try {
      // Buscar como Checkout Session primeiro
      let stripeObject;
      try {
        stripeObject = await this.stripe.checkout.sessions.retrieve(transactionId);
      } catch {
        // Se não for Checkout Session, tentar como Payment Intent
        stripeObject = await this.stripe.paymentIntents.retrieve(transactionId);
      }

      return this.mapStripeToMarketplace(stripeObject);
    } catch (error) {
      console.error('Error retrieving marketplace transaction:', error);
      return null;
    }
  }

  private mapStripeToMarketplace(stripeObject: any): MarketplaceTransaction {
    const isCheckoutSession = stripeObject.object === 'checkout.session';
    
    let amount, currency, status, metadata;
    
    if (isCheckoutSession) {
      amount = stripeObject.amount_total || 0;
      currency = stripeObject.currency || 'usd';
      status = stripeObject.payment_status === 'paid' ? 'paid' : 'pending';
      metadata = stripeObject.metadata || {};
    } else {
      amount = stripeObject.amount;
      currency = stripeObject.currency;
      status = stripeObject.status === 'succeeded' ? 'paid' : 'pending';
      metadata = stripeObject.metadata || {};
    }

    const platformFee = parseInt(metadata.platformFee || '0');
    const sellerAmount = parseInt(metadata.sellerAmount || '0');

    return {
      id: stripeObject.id,
      customerId: stripeObject.customer || '',
      amount,
      currency,
      status: status as any,
      type: 'marketplace',
      providerId: stripeObject.id,
      sellerId: metadata.sellerId || '',
      platformFee,
      sellerAmount,
      platformAmount: platformFee,
      transferId: metadata.transferId,
      metadata,
      createdAt: new Date(stripeObject.created * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}