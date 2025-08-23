// Legacy types compatibility - redirect to new schema types
export * from '../../shared/schema.js';

// Legacy Database type for backward compatibility
import { 
  Profile, 
  Walker, 
  Client, 
  ServicePlan, 
  Walk, 
  Payment,
  ServiceRegion,
  ServiceSchedule,
  ServiceBooking,
  ClientAccessToken,
  PlanCapacitySlot
} from '../../shared/schema.js';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      walkers: {
        Row: Walker;
        Insert: Partial<Walker>;
        Update: Partial<Walker>;
      };
      clients: {
        Row: Client;
        Insert: Partial<Client>;
        Update: Partial<Client>;
      };
      service_plans: {
        Row: ServicePlan;
        Insert: Partial<ServicePlan>;
        Update: Partial<ServicePlan>;
      };
      service_regions: {
        Row: ServiceRegion;
        Insert: Partial<ServiceRegion>;
        Update: Partial<ServiceRegion>;
      };
      service_schedules: {
        Row: ServiceSchedule;
        Insert: Partial<ServiceSchedule>;
        Update: Partial<ServiceSchedule>;
      };
      service_bookings: {
        Row: ServiceBooking;
        Insert: Partial<ServiceBooking>;
        Update: Partial<ServiceBooking>;
      };
      walks: {
        Row: Walk;
        Insert: Partial<Walk>;
        Update: Partial<Walk>;
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment>;
        Update: Partial<Payment>;
      };
      client_access_tokens: {
        Row: ClientAccessToken;
        Insert: Partial<ClientAccessToken>;
        Update: Partial<ClientAccessToken>;
      };
      plan_capacity_slots: {
        Row: PlanCapacitySlot;
        Insert: Partial<PlanCapacitySlot>;
        Update: Partial<PlanCapacitySlot>;
      };
    };
  };
}