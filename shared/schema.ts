import { pgTable, text, varchar, timestamp, boolean, integer, numeric, serial, jsonb, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Profiles table for user authentication
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Walkers table
export const walkers = pgTable('walkers', {
  walker_id: uuid('walker_id').primaryKey().references(() => profiles.id),
  bio: text('bio'),
  location: text('location'),
  phone: varchar('phone', { length: 20 }),
  cpf: varchar('cpf', { length: 11 }),
  years_experience: integer('years_experience'),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  total_reviews: integer('total_reviews').default(0),
  max_clients: integer('max_clients').default(10),
  has_transport: boolean('has_transport').default(false),
  emergency_available: boolean('emergency_available').default(false),
  is_active: boolean('is_active').default(true),
  plan_type: varchar('plan_type', { length: 50 }).default('basic'),
  trial_start: timestamp('trial_start'),
  trial_days: integer('trial_days').default(0),
  terms_accepted_at: timestamp('terms_accepted_at'),
  slug: varchar('slug', { length: 100 }),
  device_fingerprint: text('device_fingerprint'),
  availability: jsonb('availability'),
  services: jsonb('services'),
  regions_served: jsonb('regions_served'),
  branding: jsonb('branding'),
  specialties: text('specialties').array(),
  certifications: text('certifications').array(),
  additional_services: text('additional_services').array(),
  languages_spoken: text('languages_spoken').array(),
  pet_size_preference: text('pet_size_preference').array(),
  stripe_account_id: text('stripe_account_id'),
  stripe_onboarding_complete: boolean('stripe_onboarding_complete').default(false),
  instagram_user_id: text('instagram_user_id'),
  instagram_username: text('instagram_username'),
  instagram_access_token: text('instagram_access_token'),
  instagram_account_type: varchar('instagram_account_type', { length: 50 }),
  instagram_last_sync: timestamp('instagram_last_sync'),
  google_access_token: text('google_access_token'),
  google_refresh_token: text('google_refresh_token'),
  google_calendar_connected: boolean('google_calendar_connected').default(false),
  google_last_sync: timestamp('google_last_sync'),
  // Campos LGPD
  lgpd_consent_terms: boolean('lgpd_consent_terms').default(false),
  lgpd_consent_privacy: boolean('lgpd_consent_privacy').default(false),
  lgpd_consent_data_processing: boolean('lgpd_consent_data_processing').default(false),
  lgpd_consent_marketing: boolean('lgpd_consent_marketing').default(false),
  lgpd_consent_date: timestamp('lgpd_consent_date'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Clients table
export const clients = pgTable('clients', {
  client_id: uuid('client_id').primaryKey().references(() => profiles.id),
  walker_id: uuid('walker_id').notNull().references(() => walkers.walker_id),
  client_name: varchar('client_name', { length: 255 }).notNull(),
  pet_name: varchar('pet_name', { length: 255 }).notNull(),
  pet_breed: varchar('pet_breed', { length: 100 }),
  pet_age: integer('pet_age'),
  pet_notes: text('pet_notes'),
  address: text('address'),
  emergency_contact: varchar('emergency_contact', { length: 255 }),
  preferred_days: text('preferred_days').array(),
  preferred_times: text('preferred_times').array(),
  additional_schedule_notes: text('additional_schedule_notes'),
  is_active: boolean('is_active').default(true),
  has_password: boolean('has_password').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Service Plans table
export const service_plans = pgTable('service_plans', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  walker_id: uuid('walker_id').notNull().references(() => walkers.walker_id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  walk_count: integer('walk_count').default(1),
  is_recurring: boolean('is_recurring').default(false),
  recurrence_type: varchar('recurrence_type', { length: 50 }),
  includes_feeding: boolean('includes_feeding').default(false),
  includes_playtime: boolean('includes_playtime').default(false),
  includes_bath: boolean('includes_bath').default(false),
  includes_grooming: boolean('includes_grooming').default(false),
  image_url: text('image_url'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Service Regions table
export const service_regions = pgTable('service_regions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  service_plan_id: uuid('service_plan_id').notNull().references(() => service_plans.id),
  cep: varchar('cep', { length: 8 }).notNull(),
  endereco: text('endereco'), // Nome da rua/avenida
  bairro: text('bairro'), // Nome do bairro
  cidade: text('cidade'), // Nome da cidade
  uf: varchar('uf', { length: 2 }), // Estado (UF)
  raio_km: numeric('raio_km', { precision: 5, scale: 2 }).default('5.0'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Service Schedules table - Simplified: only associated with service_plan
export const service_schedules = pgTable('service_schedules', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  service_plan_id: uuid('service_plan_id').notNull().references(() => service_plans.id),
  service_region_id: uuid('service_region_id').references(() => service_regions.id), // Optional now - will be removed
  dia_semana: integer('dia_semana').notNull(), // 1-7, Monday-Sunday
  hora_inicio: varchar('hora_inicio', { length: 5 }).notNull(), // HH:MM format
  hora_fim: varchar('hora_fim', { length: 5 }).notNull(), // HH:MM format
  capacidade_maxima: integer('capacidade_maxima').default(1),
  vagas_disponiveis: integer('vagas_disponiveis').default(1),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Service Bookings table
export const service_bookings = pgTable('service_bookings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  walker_id: uuid('walker_id').notNull().references(() => walkers.walker_id),
  client_id: uuid('client_id').notNull().references(() => clients.client_id),
  service_schedule_id: uuid('service_schedule_id').notNull().references(() => service_schedules.id),
  data_agendamento: varchar('data_agendamento', { length: 10 }).notNull(), // YYYY-MM-DD format
  data_hora_inicio: timestamp('data_hora_inicio').notNull(),
  data_hora_fim: timestamp('data_hora_fim').notNull(),
  status: varchar('status', { length: 50 }).default('agendado'),
  observacoes: text('observacoes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Walks table
export const walks = pgTable('walks', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  walker_id: uuid('walker_id').notNull().references(() => walkers.walker_id),
  client_id: uuid('client_id').notNull().references(() => clients.client_id),
  scheduled_date: timestamp('scheduled_date').notNull(),
  duration: integer('duration').notNull(), // minutes
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('scheduled'),
  notes: text('notes'),
  photos: text('photos').array(),
  is_recurring: boolean('is_recurring').default(false),
  parent_walk_id: uuid('parent_walk_id'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  walker_id: uuid('walker_id').references(() => walkers.walker_id),
  client_id: uuid('client_id').references(() => clients.client_id),
  walk_id: uuid('walk_id').references(() => walks.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('BRL'),
  status: varchar('status', { length: 50 }).default('pending'),
  payment_type: varchar('payment_type', { length: 50 }),
  payment_method: varchar('payment_method', { length: 50 }),
  payment_method_types: text('payment_method_types').array(),
  stripe_payment_id: text('stripe_payment_id'),
  stripe_session_id: text('stripe_session_id'),
  stripe_session_url: text('stripe_session_url'),
  stripe_customer_id: text('stripe_customer_id'),
  payment_intent_id: text('payment_intent_id'),
  customer_name: varchar('customer_name', { length: 255 }),
  customer_email: varchar('customer_email', { length: 255 }),
  due_date: timestamp('due_date'),
  paid_at: timestamp('paid_at'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Client Access Tokens table
export const client_access_tokens = pgTable('client_access_tokens', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  client_id: uuid('client_id').notNull().references(() => clients.client_id),
  token: varchar('token', { length: 255 }).notNull(),
  expires_at: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

// Plan Capacity Slots table
export const plan_capacity_slots = pgTable('plan_capacity_slots', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  service_plan_id: uuid('service_plan_id').notNull().references(() => service_plans.id),
  scheduled_date: varchar('scheduled_date', { length: 10 }).notNull(), // YYYY-MM-DD format
  scheduled_time: varchar('scheduled_time', { length: 5 }).notNull(), // HH:MM format
  max_capacity: integer('max_capacity').default(1),
  current_bookings: integer('current_bookings').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Type exports for easier use throughout the application
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

export type Walker = typeof walkers.$inferSelect;
export type InsertWalker = typeof walkers.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export type ServicePlan = typeof service_plans.$inferSelect;
export type InsertServicePlan = typeof service_plans.$inferInsert;

export type ServiceRegion = typeof service_regions.$inferSelect;
export type InsertServiceRegion = typeof service_regions.$inferInsert;

export type ServiceSchedule = typeof service_schedules.$inferSelect;
export type InsertServiceSchedule = typeof service_schedules.$inferInsert;

export type ServiceBooking = typeof service_bookings.$inferSelect;
export type InsertServiceBooking = typeof service_bookings.$inferInsert;

export type Walk = typeof walks.$inferSelect;
export type InsertWalk = typeof walks.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export type ClientAccessToken = typeof client_access_tokens.$inferSelect;
export type InsertClientAccessToken = typeof client_access_tokens.$inferInsert;

export type PlanCapacitySlot = typeof plan_capacity_slots.$inferSelect;
export type InsertPlanCapacitySlot = typeof plan_capacity_slots.$inferInsert;

// Utility types for extended queries with relations
export type WalkerWithProfile = Walker & {
  profile: Profile;
};

export type ClientWithProfile = Client & {
  profile: Profile;
};

export type ServicePlanWithRegions = ServicePlan & {
  service_regions: ServiceRegion[];
};

export type ServicePlanWithSchedules = ServicePlan & {
  service_schedules: ServiceSchedule[];
};