// Transformer para conversão de dados (Regra 7: Entidades pequenas)
import { Client } from "@/types/client";

export class ClientDataTransformer {
  public transformSupabaseData(supabaseData: any[]): Client[] {
    return supabaseData.map(item => this.transformSingleClient(item));
  }

  private transformSingleClient(item: any): Client {
    return {
      client_id: item.client_id,
      client_name: item.client_name,
      pet_name: item.pet_name,
      pet_breed: item.pet_breed || undefined,
      pet_age: item.pet_age || undefined,
      pet_notes: item.pet_notes || undefined,
      emergency_contact: item.emergency_contact || undefined,
      address: item.address || undefined,
      preferred_days: item.preferred_days || undefined,
      preferred_times: item.preferred_times || undefined,
      additional_schedule_notes: item.additional_schedule_notes || undefined,
      is_active: item.is_active,
      profiles: item.profiles
    };
  }
}