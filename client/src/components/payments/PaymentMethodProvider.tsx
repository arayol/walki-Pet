import { createContext, useContext, ReactNode } from 'react';
import { useHybridPayments } from '@/hooks/useHybridPayments';
import { HybridPaymentsManager } from '@/modules/hybrid-payments';

interface PaymentMethodContextType {
  hybridPayments: HybridPaymentsManager;
  createPayment: (amount: number, metadata?: any) => Promise<{ url?: string; error?: string }>;
  createSubscription: (priceId: string, metadata?: any) => Promise<{ url?: string; error?: string }>;
  createMarketplacePayment: (amount: number, walkerId: string, metadata?: any) => Promise<{ url?: string; error?: string }>;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | null>(null);

interface PaymentMethodProviderProps {
  children: ReactNode;
}

export const PaymentMethodProvider = ({ children }: PaymentMethodProviderProps) => {
  const hybridPayments = useHybridPayments();

  // Debug: Check if marketplace provider is available
  console.log('Available marketplace providers:', hybridPayments.marketplace.getAvailableProviders());
  
  const createPayment = async (amount: number, metadata?: any) => {
    try {
      const response = await hybridPayments.payments.createCheckoutSession('stripe', {
        amount,
        currency: 'brl',
        ...metadata
      });
      
      if (response.success && response.checkoutUrl) {
        return { url: response.checkoutUrl };
      } else {
        return { error: response.error || 'Erro ao criar pagamento' };
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      return { error: error instanceof Error ? error.message : 'Erro ao criar pagamento' };
    }
  };

  const createSubscription = async (priceId: string, metadata?: any) => {
    try {
      const response = await hybridPayments.subscriptions.createSubscription('stripe', {
        priceId,
        ...metadata
      });
      
      if (response.success && response.checkoutUrl) {
        return { url: response.checkoutUrl };
      } else {
        return { error: response.error || 'Erro ao criar assinatura' };
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { error: error instanceof Error ? error.message : 'Erro ao criar assinatura' };
    }
  };

  const createMarketplacePayment = async (amount: number, walkerId: string, metadata?: any) => {
    try {
      console.log('Creating marketplace payment with:', { amount, walkerId, metadata });
      
      const response = await hybridPayments.marketplace.createMarketplacePayment('stripe', {
        amount,
        currency: 'brl',
        sellerId: walkerId,
        platformFeePercent: 10, // 10% fee
        ...metadata
      });
      
      console.log('Marketplace payment response:', response);
      
      if (response.success && response.checkoutUrl) {
        return { url: response.checkoutUrl };
      } else if (response.success && !response.checkoutUrl) {
        // Response successful but missing checkoutUrl
        console.error('Response was successful but no checkout URL found:', response);
        return { error: 'URL de checkout não encontrada na resposta' };
      } else {
        console.error('Marketplace payment failed:', response);
        return { error: response.error || 'Erro ao criar pagamento' };
      }
    } catch (error) {
      console.error('Error creating marketplace payment:', error);
      return { error: error instanceof Error ? error.message : 'Erro ao criar pagamento' };
    }
  };

  const value = {
    hybridPayments,
    createPayment,
    createSubscription,
    createMarketplacePayment
  };

  return (
    <PaymentMethodContext.Provider value={value}>
      {children}
    </PaymentMethodContext.Provider>
  );
};

export const usePaymentMethod = () => {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error('usePaymentMethod must be used within a PaymentMethodProvider');
  }
  return context;
};