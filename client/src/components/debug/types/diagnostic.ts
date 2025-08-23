
export interface PaymentRecord {
  id: string;
  walker_id: string;
  client_id: string;
  amount: number;
  status: string;
  stripe_payment_id?: string;
  paid_at?: string;
  created_at: string;
}

export interface WalkRecord {
  id: string;
  walker_id: string;
  client_id: string;
  scheduled_at: string;
  service_type: string;
  price: number;
  status: string;
  notes?: string;
  created_at: string;
}

export interface ServiceBookingRecord {
  id: string;
  walker_id: string;
  client_id: string;
  service_schedule_id: string;
  data_agendamento: string;
  status: string;
  created_at: string;
}

export interface SlotAnalysis {
  total_schedules: number;
  total_capacity: number;
  booked_walks: number;
  booked_service_bookings: number;
  available_slots: number;
  utilization_rate: number;
  paid_bookings: number;
  pending_payments: number;
}
