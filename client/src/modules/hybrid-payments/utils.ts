import type { PaymentStatus, PaymentMethod, SubscriptionStatus } from './types';

// Currency utilities
export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Convert from cents
};

export const parseCurrency = (amount: string): number => {
  // Remove currency symbols and convert to cents
  const cleaned = amount.replace(/[^\d,.-]/g, '').replace(',', '.');
  return Math.round(parseFloat(cleaned) * 100);
};

// Status utilities
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors = {
    pending: 'hsl(var(--warning))',
    processing: 'hsl(var(--info))',
    paid: 'hsl(var(--success))',
    failed: 'hsl(var(--destructive))',
    cancelled: 'hsl(var(--muted))',
    refunded: 'hsl(var(--secondary))',
  };
  return colors[status] || 'hsl(var(--muted))';
};

export const getPaymentStatusText = (status: PaymentStatus): string => {
  const texts = {
    pending: 'Pendente',
    processing: 'Processando',
    paid: 'Pago',
    failed: 'Falhou',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  };
  return texts[status] || status;
};

export const getSubscriptionStatusText = (status: SubscriptionStatus): string => {
  const texts = {
    active: 'Ativo',
    canceled: 'Cancelado',
    incomplete: 'Incompleto',
    incomplete_expired: 'Expirado',
    past_due: 'Em Atraso',
    trialing: 'Período de Teste',
    unpaid: 'Não Pago',
  };
  return texts[status] || status;
};

export const getPaymentMethodText = (method: PaymentMethod): string => {
  const texts = {
    card: 'Cartão',
    pix: 'PIX',
    boleto: 'Boleto',
    bank_transfer: 'Transferência',
  };
  return texts[method] || method;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAmount = (amount: number, min: number = 100, max: number = 50000000): boolean => {
  return amount >= min && amount <= max && Number.isInteger(amount);
};

export const validateCurrency = (currency: string): boolean => {
  const supportedCurrencies = ['BRL', 'USD', 'EUR'];
  return supportedCurrencies.includes(currency.toUpperCase());
};

// Date utilities
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export const isExpired = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

// ID generation utilities
export const generateId = (): string => {
  return crypto.randomUUID();
};

export const generatePaymentReference = (prefix: string = 'PAY'): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
};

// Error handling utilities
export class PaymentError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const createErrorResponse = (message: string, code?: string, details?: any) => ({
  success: false,
  error: message,
  code,
  details,
});

export const createSuccessResponse = <T>(data: T) => ({
  success: true,
  ...data,
});

// Logging utilities
export const logPaymentEvent = (event: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[PAYMENT] ${timestamp} - ${event}`, data || '');
};

export const logError = (error: Error, context?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] ${timestamp} - ${error.message}`, {
    stack: error.stack,
    context,
  });
};

// Metadata utilities
export const cleanMetadata = (metadata: Record<string, any>): Record<string, string> => {
  const cleaned: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== null && value !== undefined) {
      cleaned[key] = String(value);
    }
  }
  
  return cleaned;
};

export const parseMetadata = (metadata: string | Record<string, any> | null): Record<string, any> => {
  if (!metadata) return {};
  
  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }
  
  return metadata;
};