
export interface Booking {
  id: string;
  scheduled_at: string;
  duration: number;
  service_type: string;
  status: string;
  price: number;
  notes?: string;
  petName?: string;
  clientName?: string;
  locationAddress?: string;
  payment_info?: string;
  clients?: {
    client_id: string;
    pet_name: string;
    address?: string;
    client_name?: string;
    profiles?: {
      id: string;
      name: string;
      email: string;
    };
  };
}
