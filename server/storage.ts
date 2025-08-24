import { db } from "./db.js";
import { eq, and } from "drizzle-orm";
import * as schema from "../shared/schema.js";

// Type aliases from our schema
export type Profile = typeof schema.profiles.$inferSelect;
export type InsertProfile = typeof schema.profiles.$inferInsert;
export type Walker = typeof schema.walkers.$inferSelect;
export type InsertWalker = typeof schema.walkers.$inferInsert;
export type Client = typeof schema.clients.$inferSelect;
export type InsertClient = typeof schema.clients.$inferInsert;
export type ServicePlan = typeof schema.service_plans.$inferSelect;
export type InsertServicePlan = typeof schema.service_plans.$inferInsert;
export type ServiceRegion = typeof schema.service_regions.$inferSelect;
export type InsertServiceRegion = typeof schema.service_regions.$inferInsert;
export type Walk = typeof schema.walks.$inferSelect;
export type InsertWalk = typeof schema.walks.$inferInsert;
export type Payment = typeof schema.payments.$inferSelect;
export type InsertPayment = typeof schema.payments.$inferInsert;

export interface IStorage {
  // Profile operations
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Walker operations
  getWalker(walkerId: string): Promise<Walker | undefined>;
  getWalkerWithProfile(walkerId: string): Promise<(Walker & { profile: Profile }) | undefined>;
  getWalkerBySlug(slug: string): Promise<(Walker & { profile: Profile }) | undefined>;
  createWalker(walker: InsertWalker): Promise<Walker>;
  updateWalker(walkerId: string, walker: Partial<InsertWalker>): Promise<Walker | undefined>;
  getAllWalkers(): Promise<Walker[]>;

  // Client operations
  getClient(clientId: string): Promise<Client | undefined>;
  getClientWithProfile(clientId: string): Promise<(Client & { profile: Profile }) | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(clientId: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  getClientsByWalker(walkerId: string): Promise<Client[]>;
  getWalksByClient(clientId: string): Promise<Walk[]>;
  getServiceBookingsByClient(clientId: string): Promise<ServiceBooking[]>;
  getPaymentsByClient(clientId: string): Promise<Payment[]>;
  
  // Atomic operations
  createClientComplete(data: { profileData: InsertProfile, clientData: InsertClient }): Promise<{ profile: Profile, client: Client }>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;

  // Service Plan operations
  getServicePlan(id: string): Promise<ServicePlan | undefined>;
  createServicePlan(plan: InsertServicePlan): Promise<ServicePlan>;
  updateServicePlan(id: string, plan: Partial<InsertServicePlan>): Promise<ServicePlan | undefined>;
  getServicePlansByWalker(walkerId: string): Promise<ServicePlan[]>;
  deleteServicePlan(id: string): Promise<boolean>;

  // Walk operations
  getWalk(id: string): Promise<Walk | undefined>;
  createWalk(walk: InsertWalk): Promise<Walk>;
  updateWalk(id: string, walk: Partial<InsertWalk>): Promise<Walk | undefined>;
  getWalksByClient(clientId: string): Promise<Walk[]>;
  getWalksByWalker(walkerId: string): Promise<Walk[]>;
  getUpcomingWalks(walkerId: string): Promise<Walk[]>;

  // Payment operations
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  getPaymentsByClient(clientId: string): Promise<Payment[]>;
  getPaymentsByWalker(walkerId: string): Promise<Payment[]>;

  // Service Regions operations
  getServiceRegion(id: string): Promise<ServiceRegion | undefined>;
  createServiceRegion(region: InsertServiceRegion): Promise<ServiceRegion>;
  getServiceRegionsByPlan(planId: string): Promise<ServiceRegion[]>;
  deleteServiceRegion(id: string): Promise<boolean>;

  // Access token operations
  createClientAccessToken(clientId: string, token: string, expiresAt: Date): Promise<void>;
  validateClientAccessToken(token: string): Promise<{ clientId: string } | undefined>;
  markTokenAsUsed(token: string): Promise<void>;

  // Booking validation operations
  validateBookingSlots(planId: string, selectedSlots: any[]): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Profile operations
  async getProfile(id: string): Promise<Profile | undefined> {
    try {
      const result = await db.select().from(schema.profiles).where(eq(schema.profiles.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting profile:", error);
      return undefined;
    }
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    try {
      const result = await db.insert(schema.profiles).values(profile).returning();
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    try {
      const result = await db.update(schema.profiles)
        .set({ ...profile, updated_at: new Date() })
        .where(eq(schema.profiles.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating profile:", error);
      return undefined;
    }
  }

  // Walker operations
  async getWalker(walkerId: string): Promise<Walker | undefined> {
    try {
      const result = await db.select().from(schema.walkers).where(eq(schema.walkers.walker_id, walkerId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting walker:", error);
      return undefined;
    }
  }

  async getWalkerWithProfile(walkerId: string): Promise<(Walker & { profile: Profile }) | undefined> {
    try {
      const result = await db.select({
        walker: schema.walkers,
        profile: schema.profiles,
      })
      .from(schema.walkers)
      .innerJoin(schema.profiles, eq(schema.walkers.walker_id, schema.profiles.id))
      .where(eq(schema.walkers.walker_id, walkerId))
      .limit(1);

      if (result.length === 0) return undefined;
      
      return {
        ...result[0].walker,
        profile: result[0].profile,
      };
    } catch (error) {
      console.error("Error getting walker with profile:", error);
      return undefined;
    }
  }

  async createWalker(walker: InsertWalker): Promise<Walker> {
    try {
      const result = await db.insert(schema.walkers).values(walker).returning();
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create walker: ${error.message}`);
    }
  }

  async updateWalker(walkerId: string, walker: Partial<InsertWalker>): Promise<Walker | undefined> {
    try {
      const result = await db.update(schema.walkers)
        .set({ ...walker, updated_at: new Date() })
        .where(eq(schema.walkers.walker_id, walkerId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating walker:", error);
      return undefined;
    }
  }

  async getWalkerBySlug(slug: string): Promise<(Walker & { profile: Profile }) | undefined> {
    try {
      const result = await db.select({
        walker: schema.walkers,
        profile: schema.profiles,
      })
      .from(schema.walkers)
      .innerJoin(schema.profiles, eq(schema.walkers.walker_id, schema.profiles.id))
      .where(eq(schema.walkers.slug, slug))
      .limit(1);

      if (result.length === 0) return undefined;
      
      return {
        ...result[0].walker,
        profile: result[0].profile,
      };
    } catch (error) {
      console.error("Error getting walker by slug:", error);
      return undefined;
    }
  }

  async getAllWalkers(): Promise<Walker[]> {
    try {
      const result = await db.select().from(schema.walkers).where(eq(schema.walkers.is_active, true));
      return result;
    } catch (error) {
      console.error("Error getting all walkers:", error);
      return [];
    }
  }

  // Client operations
  async getClient(clientId: string): Promise<Client | undefined> {
    try {
      const result = await db.select().from(schema.clients).where(eq(schema.clients.client_id, clientId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting client:", error);
      return undefined;
    }
  }

  async getClientWithProfile(clientId: string): Promise<(Client & { profile: Profile }) | undefined> {
    try {
      const result = await db.select({
        client: schema.clients,
        profile: schema.profiles,
      })
      .from(schema.clients)
      .innerJoin(schema.profiles, eq(schema.clients.client_id, schema.profiles.id))
      .where(eq(schema.clients.client_id, clientId))
      .limit(1);

      if (result.length === 0) return undefined;
      
      return {
        ...result[0].client,
        profile: result[0].profile,
      };
    } catch (error) {
      console.error("Error getting client with profile:", error);
      return undefined;
    }
  }

  async createClient(client: InsertClient): Promise<Client> {
    try {
      const result = await db.insert(schema.clients).values(client).returning();
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  async updateClient(clientId: string, client: Partial<InsertClient>): Promise<Client | undefined> {
    try {
      const result = await db.update(schema.clients)
        .set({ ...client, updated_at: new Date() })
        .where(eq(schema.clients.client_id, clientId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating client:", error);
      return undefined;
    }
  }

  async getClientsByWalker(walkerId: string): Promise<Client[]> {
    try {
      const result = await db.select().from(schema.clients).where(eq(schema.clients.walker_id, walkerId));
      return result;
    } catch (error) {
      console.error("Error getting clients by walker:", error);
      return [];
    }
  }

  async getWalksByClient(clientId: string): Promise<Walk[]> {
    try {
      const result = await db.select().from(schema.walks).where(eq(schema.walks.client_id, clientId));
      return result;
    } catch (error) {
      console.error("Error getting walks by client:", error);
      return [];
    }
  }

  async getServiceBookingsByClient(clientId: string): Promise<ServiceBooking[]> {
    try {
      const result = await db.select().from(schema.service_bookings).where(eq(schema.service_bookings.client_id, clientId));
      return result;
    } catch (error) {
      console.error("Error getting service bookings by client:", error);
      return [];
    }
  }

  async getPaymentsByClient(clientId: string): Promise<Payment[]> {
    try {
      const result = await db.select().from(schema.payments).where(eq(schema.payments.client_id, clientId));
      return result;
    } catch (error) {
      console.error("Error getting payments by client:", error);
      return [];
    }
  }

  // Atomic operations - Manual rollback since Neon doesn't support transactions
  async createClientComplete(data: { profileData: InsertProfile, clientData: InsertClient }): Promise<{ profile: Profile, client: Client }> {
    let createdProfile: Profile | null = null;
    
    try {
      // Create profile first
      createdProfile = await this.createProfile(data.profileData);
      
      // Create client
      const client = await this.createClient(data.clientData);
      
      return { profile: createdProfile, client };
    } catch (error: any) {
      // Manual rollback: delete profile if client creation failed
      if (createdProfile) {
        try {
          await db.delete(schema.profiles).where(eq(schema.profiles.id, createdProfile.id));
        } catch (rollbackError) {
          console.error("Failed to rollback profile creation:", rollbackError);
        }
      }
      throw new Error(`Failed to create client complete: ${error.message}`);
    }
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    try {
      const result = await db.select().from(schema.profiles).where(eq(schema.profiles.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting profile by email:", error);
      return undefined;
    }
  }

  // Service Plan operations
  async getServicePlan(id: string): Promise<ServicePlan | undefined> {
    try {
      const result = await db.select().from(schema.service_plans).where(eq(schema.service_plans.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting service plan:", error);
      return undefined;
    }
  }

  async createServicePlan(plan: InsertServicePlan): Promise<ServicePlan> {
    try {
      const result = await db.insert(schema.service_plans).values(plan).returning();
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create service plan: ${error.message}`);
    }
  }

  async updateServicePlan(id: string, plan: Partial<InsertServicePlan>): Promise<ServicePlan | undefined> {
    try {
      const result = await db.update(schema.service_plans)
        .set({ ...plan, updated_at: new Date() })
        .where(eq(schema.service_plans.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating service plan:", error);
      return undefined;
    }
  }

  async getServicePlansByWalker(walkerId: string): Promise<ServicePlan[]> {
    try {
      const result = await db.select().from(schema.service_plans).where(eq(schema.service_plans.walker_id, walkerId));
      return result;
    } catch (error) {
      console.error("Error getting service plans by walker:", error);
      return [];
    }
  }

  async deleteServicePlan(id: string): Promise<boolean> {
    try {
      const result = await db.update(schema.service_plans)
        .set({ is_active: false, updated_at: new Date() })
        .where(eq(schema.service_plans.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting service plan:", error);
      return false;
    }
  }

  // Walk operations
  async getWalk(id: string): Promise<Walk | undefined> {
    try {
      const result = await db.select().from(schema.walks).where(eq(schema.walks.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting walk:", error);
      return undefined;
    }
  }

  async createWalk(walk: InsertWalk): Promise<Walk> {
    try {
      const result = await db.insert(schema.walks).values(walk).returning();
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create walk: ${error.message}`);
    }
  }

  async updateWalk(id: string, walk: Partial<InsertWalk>): Promise<Walk | undefined> {
    try {
      const result = await db.update(schema.walks)
        .set({ ...walk, updated_at: new Date() })
        .where(eq(schema.walks.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating walk:", error);
      return undefined;
    }
  }

  async getWalksByClient(clientId: string): Promise<Walk[]> {
    try {
      const result = await db.select().from(schema.walks).where(eq(schema.walks.client_id, clientId));
      return result;
    } catch (error) {
      console.error("Error getting walks by client:", error);
      return [];
    }
  }

  async getWalksByWalker(walkerId: string): Promise<Walk[]> {
    try {
      const result = await db.select().from(schema.walks).where(eq(schema.walks.walker_id, walkerId));
      return result;
    } catch (error) {
      console.error("Error getting walks by walker:", error);
      return [];
    }
  }

  async getUpcomingWalks(walkerId: string): Promise<Walk[]> {
    try {
      const result = await db.select().from(schema.walks)
        .where(and(
          eq(schema.walks.walker_id, walkerId),
          eq(schema.walks.status, 'scheduled')
        ));
      return result;
    } catch (error) {
      console.error("Error getting upcoming walks:", error);
      return [];
    }
  }

  // Payment operations
  async getPayment(id: string): Promise<Payment | undefined> {
    try {
      const result = await db.select().from(schema.payments).where(eq(schema.payments.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting payment:", error);
      return undefined;
    }
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    try {
      const result = await db.insert(schema.payments).values(payment).returning();
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    try {
      const result = await db.update(schema.payments)
        .set({ ...payment, updated_at: new Date() })
        .where(eq(schema.payments.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating payment:", error);
      return undefined;
    }
  }

  async getPaymentsByClient(clientId: string): Promise<Payment[]> {
    try {
      const result = await db.select().from(schema.payments).where(eq(schema.payments.client_id, clientId));
      return result;
    } catch (error) {
      console.error("Error getting payments by client:", error);
      return [];
    }
  }

  async getPaymentsByWalker(walkerId: string): Promise<Payment[]> {
    try {
      const result = await db.select().from(schema.payments).where(eq(schema.payments.walker_id, walkerId));
      return result;
    } catch (error) {
      console.error("Error getting payments by walker:", error);
      return [];
    }
  }

  // Service Regions operations
  async getServiceRegion(id: string): Promise<ServiceRegion | undefined> {
    try {
      const result = await db.select().from(schema.service_regions).where(eq(schema.service_regions.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting service region:", error);
      return undefined;
    }
  }

  async createServiceRegion(region: InsertServiceRegion): Promise<ServiceRegion> {
    try {
      console.log('📝 Creating service region with address data:', region);
      const result = await db.insert(schema.service_regions).values(region).returning();
      console.log('✅ Service region created in PostgreSQL with address:', result[0]);
      return result[0];
    } catch (error: any) {
      console.error("Error creating service region:", error);
      throw new Error(`Failed to create service region: ${error.message}`);
    }
  }

  async getServiceRegionsByPlan(planId: string): Promise<ServiceRegion[]> {
    try {
      const result = await db.select().from(schema.service_regions)
        .where(and(eq(schema.service_regions.service_plan_id, planId), eq(schema.service_regions.is_active, true)));
      return result;
    } catch (error) {
      console.error("Error getting service regions by plan:", error);
      return [];
    }
  }

  async getServicePlanAvailability(planId: string, startDate?: string, endDate?: string): Promise<any[]> {
    try {
      console.log('🔍 [Storage] Buscando disponibilidade para:', { planId, startDate, endDate });

      // Buscar plano de serviço
      const [servicePlan] = await db.select().from(schema.service_plans)
        .where(eq(schema.service_plans.id, planId))
        .limit(1);

      if (!servicePlan) {
        console.log('❌ [Storage] Plano não encontrado');
        return [];
      }

      // Buscar horários disponíveis
      const schedules = await db.select({
        service_plan_id: schema.service_schedules.service_plan_id,
        dia_semana: schema.service_schedules.dia_semana,
        hora_inicio: schema.service_schedules.hora_inicio,
        hora_fim: schema.service_schedules.hora_fim,
        capacidade_maxima: schema.service_schedules.capacidade_maxima,
        vagas_disponiveis: schema.service_schedules.vagas_disponiveis,
      })
      .from(schema.service_schedules)
      .where(and(
        eq(schema.service_schedules.service_plan_id, planId),
        eq(schema.service_schedules.is_active, true)
      ));

      console.log('📅 [Storage] Horários encontrados:', schedules.length);

      if (!schedules.length) {
        console.log('❌ [Storage] Nenhum horário disponível');
        return [];
      }

      // Gerar slots de disponibilidade com datas reais
      const availability = [];
      const today = new Date();
      const start = startDate ? new Date(startDate) : today;
      const end = endDate ? new Date(endDate) : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      for (const schedule of schedules) {
        // Gerar datas para o próximo mês que correspondem ao dia da semana
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
          const currentDayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // Converter domingo (0) para 7
          
          if (currentDayOfWeek === schedule.dia_semana && currentDate >= today) {
            availability.push({
              plan_id: planId,
              plan_name: servicePlan.name,
              plan_type: "single",
              walk_count: servicePlan.walk_count,
              is_recurring: servicePlan.is_recurring,
              day_of_week: schedule.dia_semana,
              start_time: schedule.hora_inicio,
              end_time: schedule.hora_fim,
              max_capacity: schedule.capacidade_maxima,
              current_bookings: schedule.capacidade_maxima - schedule.vagas_disponiveis,
              available_slots: schedule.vagas_disponiveis,
              schedule_date: currentDate.toISOString().split('T')[0],
              is_available: schedule.vagas_disponiveis > 0
            });
          }
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      console.log('✅ [Storage] Disponibilidade gerada:', availability.length, 'slots');
      return availability;
    } catch (error) {
      console.error("Error getting service plan availability:", error);
      return [];
    }
  }

  async deleteServiceRegion(id: string): Promise<boolean> {
    try {
      const result = await db.delete(schema.service_regions).where(eq(schema.service_regions.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting service region:", error);
      return false;
    }
  }

  // Access token operations
  async createClientAccessToken(clientId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      await db.insert(schema.client_access_tokens).values({
        client_id: clientId,
        token,
        expires_at: expiresAt,
      });
    } catch (error: any) {
      throw new Error(`Failed to create access token: ${error.message}`);
    }
  }

  async validateClientAccessToken(token: string): Promise<{ clientId: string } | undefined> {
    try {
      const result = await db.select().from(schema.client_access_tokens)
        .where(and(
          eq(schema.client_access_tokens.token, token),
          eq(schema.client_access_tokens.used, false)
        ))
        .limit(1);

      if (result.length === 0) return undefined;
      
      const tokenData = result[0];
      if (new Date() > new Date(tokenData.expires_at)) {
        return undefined;
      }
      
      return { clientId: tokenData.client_id };
    } catch (error) {
      console.error("Error validating access token:", error);
      return undefined;
    }
  }

  async markTokenAsUsed(token: string): Promise<void> {
    try {
      await db.update(schema.client_access_tokens)
        .set({ used: true })
        .where(eq(schema.client_access_tokens.token, token));
    } catch (error: any) {
      throw new Error(`Failed to mark token as used: ${error.message}`);
    }
  }

  // Service Schedules operations - Simplified: only by service plan
  async getServiceSchedules(servicePlanId: string): Promise<any[]> {
    try {
      const schedules = await db.select().from(schema.service_schedules)
        .where(eq(schema.service_schedules.service_plan_id, servicePlanId))
        .orderBy(schema.service_schedules.dia_semana, schema.service_schedules.hora_inicio);
      
      console.log('📊 [Storage] Service schedules encontrados:', schedules.length);
      return schedules;
    } catch (error: any) {
      console.error("Error fetching service schedules:", error);
      return [];
    }
  }

  async createServiceSchedule(data: any): Promise<any> {
    try {
      const scheduleData = {
        id: crypto.randomUUID(),
        service_plan_id: data.service_plan_id,
        // service_region_id removed - schedules are now plan-level only
        dia_semana: data.dia_semana,
        hora_inicio: data.hora_inicio,
        hora_fim: data.hora_fim,
        capacidade_maxima: data.capacidade_maxima,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await db.insert(schema.service_schedules).values(scheduleData).returning();
      console.log('✅ [Storage] Service schedule criado:', result[0]);
      return result[0];
    } catch (error: any) {
      console.error("Error creating service schedule:", error);
      throw new Error(`Failed to create service schedule: ${error.message}`);
    }
  }

  async updateServiceSchedule(id: string, data: any): Promise<any> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date(),
      };

      const result = await db.update(schema.service_schedules)
        .set(updateData)
        .where(eq(schema.service_schedules.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error("Schedule não encontrado");
      }

      console.log('✅ [Storage] Service schedule atualizado:', result[0]);
      return result[0];
    } catch (error: any) {
      console.error("Error updating service schedule:", error);
      throw new Error(`Failed to update service schedule: ${error.message}`);
    }
  }

  async deleteServiceSchedule(id: string): Promise<boolean> {
    try {
      const result = await db.delete(schema.service_schedules)
        .where(eq(schema.service_schedules.id, id))
        .returning();

      const success = result.length > 0;
      console.log('🗑️ [Storage] Service schedule deletado:', success);
      return success;
    } catch (error: any) {
      console.error("Error deleting service schedule:", error);
      return false;
    }
  }

  // Booking validation operations
  async validateBookingSlots(planId: string, selectedSlots: any[]): Promise<any> {
    try {
      console.log('🔍 [Storage] Validando slots para plano:', planId);
      console.log('🔍 [Storage] Slots recebidos:', selectedSlots);

      const slotValidations = [];

      for (const slot of selectedSlots) {
        const { date, time } = slot;
        console.log(`🔍 [Storage] Validando slot: ${date} às ${time}`);

        // Verificar disponibilidade
        const availability = await this.getServicePlanAvailability(planId, date, date);
        
        const availableSlot = availability.find((av: any) => 
          av.schedule_date === date && 
          time >= av.start_time && 
          time < av.end_time &&
          av.available_slots > 0
        );

        const validation = {
          date,
          time,
          is_valid: !!availableSlot,
          available_slots: availableSlot?.available_slots || 0,
          message: availableSlot 
            ? `Horário disponível com ${availableSlot.available_slots} vagas`
            : 'Horário não disponível'
        };

        console.log(`🔍 [Storage] Resultado para ${date} às ${time}:`, validation);
        slotValidations.push(validation);
      }

      const allValid = slotValidations.every(v => v.is_valid);

      const result = {
        is_valid: allValid,
        error_message: allValid ? '' : 'Alguns horários não estão disponíveis',
        slot_validations: slotValidations
      };

      console.log('✅ [Storage] Resultado final da validação:', result);
      return result;
    } catch (error: any) {
      console.error('❌ [Storage] Erro na validação:', error);
      throw new Error(`Failed to validate booking slots: ${error.message}`);
    }
  }
}

export const storage = new DatabaseStorage();