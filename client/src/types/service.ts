
export interface ServicePlanWithAvailability {
  id: string;
  name: string;
  description?: string;
  price: number;
  walk_count: number;
  is_recurring: boolean;
  recurrence_type?: string;
  includes_bath: boolean;
  includes_grooming: boolean;
  includes_feeding: boolean;
  includes_playtime: boolean;
  duration?: string;
  available_regions: Array<{
    region_id: string;
    cep: string;
    raio_km: number;
    available_slots: number;
  }>;
}
