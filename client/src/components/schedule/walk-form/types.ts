
export interface Client {
  client_id: string;
  pet_name: string;
  client_name: string;
}

export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  walk_count: number;
}

export interface WalkFormData {
  client_id: string;
  service_plan_id: string;
  selected_slots: Array<{
    date: string;
    time: string;
  }>;
  price: string;
  walk_count: number;
  notes: string;
  payment_method: string;
}

export interface WalkFormProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: () => void;
}
