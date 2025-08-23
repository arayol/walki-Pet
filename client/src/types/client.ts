
export interface RpcResponse {
  success: boolean;
  error?: string;
  client_id?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pet_name: string;
  pet_breed: string;
  pet_age: string;
  pet_notes: string;
  emergency_contact: string;
  use_whatsapp_for_emergency: boolean;
  address: string;
  preferred_days: string[];
  preferred_times: string[];
  additional_schedule_notes: string;
}

export interface WalkerInfo {
  walker_id: string;
  slug: string;
  profiles: {
    name: string;
  };
}

export interface Client {
  client_id: string;
  client_name: string;
  pet_name: string;
  pet_breed?: string;
  pet_age?: number;
  pet_notes?: string;
  emergency_contact?: string;
  address?: string;
  preferred_days?: string[];
  preferred_times?: string[];
  additional_schedule_notes?: string;
  is_active?: boolean;
  profiles?: {
    email: string;
  };
}
