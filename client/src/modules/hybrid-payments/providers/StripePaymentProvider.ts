import type { 
  BasePayment, 
  PaymentResponse, 
  IPaymentProvider,
  PaymentStatus,
  PaymentMethod 
} from '../types';

export class StripePaymentProvider implements IPaymentProvider {
  public readonly name = 'stripe';
  private stripe: any;

  constructor(stripe: any) {
    this.stripe = stripe;
  }

  async createPayment(payment: Partial<BasePayment>): Promise<PaymentResponse> {
    try {
      if (!payment.amount || !payment.currency) {
        return {
          success: false,
          error: 'Amount and currency are required'
        };
      }

      // Verificar se já existe cliente ou criar novo
      let customerId = payment.customerId;
      if (!customerId && payment.metadata?.email) {
        const customers = await this.stripe.customers.list({ 
          email: payment.metadata.email, 
          limit: 1 
        });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await this.stripe.customers.create({
            email: payment.metadata.email,
            name: payment.metadata.name
          });
          customerId = customer.id;
        }
      }

      // Criar sessão de checkout para pagamentos únicos
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : payment.metadata?.email,
        line_items: [
          {
            price_data: {
              currency: payment.currency,
              product_data: { 
                name: payment.metadata?.productName || 'Payment',
                description: payment.metadata?.description
              },
              unit_amount: payment.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: payment.metadata?.successUrl || `${payment.metadata?.origin}/payment-success`,
        cancel_url: payment.metadata?.cancelUrl || `${payment.metadata?.origin}/payment-canceled`,
        metadata: payment.metadata || {}
      });

      const mappedPayment = this.mapStripeToBase(session, payment);

      return {
        success: true,
        payment: mappedPayment,
        checkoutUrl: session.url || undefined,
        clientSecret: session.payment_intent?.client_secret
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPayment(paymentId: string): Promise<BasePayment | null> {
    try {
      // Tentar buscar como Payment Intent
      let stripePayment;
      try {
        stripePayment = await this.stripe.paymentIntents.retrieve(paymentId);
      } catch {
        // Se não for Payment Intent, tentar como Checkout Session
        stripePayment = await this.stripe.checkout.sessions.retrieve(paymentId);
      }

      return this.mapStripeToBase(stripePayment);
    } catch (error) {
      console.error('Error retrieving payment:', error);
      return null;
    }
  }

  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await this.stripe.paymentIntents.cancel(paymentId);
      return true;
    } catch (error) {
      console.error('Error canceling payment:', error);
      return false;
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    try {
      const refundData: any = { payment_intent: paymentId };
      if (amount) {
        refundData.amount = amount;
      }

      await this.stripe.refunds.create(refundData);
      return true;
    } catch (error) {
      console.error('Error refunding payment:', error);
      return false;
    }
  }

  async createPaymentIntent(payment: Partial<BasePayment>): Promise<PaymentResponse> {
    try {
      if (!payment.amount || !payment.currency) {
        return {
          success: false,
          error: 'Amount and currency are required'
        };
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: payment.amount,
        currency: payment.currency,
        customer: payment.customerId,
        metadata: payment.metadata || {},
        automatic_payment_methods: { enabled: true }
      });

      const mappedPayment = this.mapStripeToBase(paymentIntent, payment);

      return {
        success: true,
        payment: mappedPayment,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private mapStripeToBase(stripePayment: any, originalPayment?: Partial<BasePayment>): BasePayment {
    // Detectar se é Checkout Session ou Payment Intent
    const isCheckoutSession = stripePayment.object === 'checkout.session';
    const isPaymentIntent = stripePayment.object === 'payment_intent';

    let id, amount, currency, status, customerId, metadata, created;

    if (isCheckoutSession) {
      id = stripePayment.id;
      amount = stripePayment.amount_total || 0;
      currency = stripePayment.currency || 'usd';
      status = this.mapStripeCheckoutStatus(stripePayment.payment_status);
      customerId = stripePayment.customer;
      metadata = stripePayment.metadata || {};
      created = stripePayment.created;
    } else if (isPaymentIntent) {
      id = stripePayment.id;
      amount = stripePayment.amount;
      currency = stripePayment.currency;
      status = this.mapStripePaymentStatus(stripePayment.status);
      customerId = stripePayment.customer;
      metadata = stripePayment.metadata || {};
      created = stripePayment.created;
    } else {
      // Fallback para outros tipos
      id = stripePayment.id;
      amount = originalPayment?.amount || 0;
      currency = originalPayment?.currency || 'usd';
      status = 'pending';
      customerId = originalPayment?.customerId;
      metadata = originalPayment?.metadata || {};
      created = Date.now() / 1000;
    }

    return {
      id,
      customerId: customerId || '',
      amount,
      currency,
      status,
      type: 'direct',
      method: this.detectPaymentMethod(stripePayment),
      providerId: id,
      metadata,
      createdAt: new Date(created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: status === 'paid' ? new Date().toISOString() : undefined
    };
  }

  private mapStripePaymentStatus(stripeStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'requires_payment_method': 'pending',
      'requires_confirmation': 'pending',
      'requires_action': 'processing',
      'processing': 'processing',
      'succeeded': 'paid',
      'requires_capture': 'processing',
      'canceled': 'cancelled'
    };

    return statusMap[stripeStatus] || 'failed';
  }

  private mapStripeCheckoutStatus(stripeStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'paid': 'paid',
      'unpaid': 'pending',
      'no_payment_required': 'paid'
    };

    return statusMap[stripeStatus] || 'pending';
  }

  private detectPaymentMethod(stripePayment: any): PaymentMethod {
    // Para Checkout Sessions
    if (stripePayment.payment_method_types) {
      if (stripePayment.payment_method_types.includes('card')) return 'card';
      if (stripePayment.payment_method_types.includes('boleto')) return 'boleto';
      if (stripePayment.payment_method_types.includes('pix')) return 'pix';
    }

    // Para Payment Intents
    if (stripePayment.payment_method?.type) {
      const type = stripePayment.payment_method.type;
      if (type === 'card') return 'card';
      if (type === 'boleto') return 'boleto';
      if (type === 'pix') return 'pix';
    }

    return 'card'; // fallback
  }
}