
export interface PaymentRecord {
  id: string;
  client_id: string;
  walker_id: string;
  amount: number;
  status: string;
  stripe_payment_id: string;
  paid_at: string;
  created_at: string;
}

export interface WalkRecord {
  id: string;
  client_id: string;
  walker_id: string;
  scheduled_at: string;
  service_type: string;
  price: number;
  status: string;
  created_at: string;
}

export interface SearchResult {
  stripeData: {
    sessionId: string;
    paymentIntentId: string;
    amount: number;
    clientEmail: string;
    status: string;
  };
  databaseRecords: {
    payments: number;
    walks: number;
    serviceBookings: number;
  };
  metadata: {
    client_id: string;
    walker_id: string;
    service_id: string;
    scheduled_date: string;
    scheduled_time: string;
  };
  webhookProcessed: boolean;
}
