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

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    try {
      const result = await db.select().from(schema.profiles).where(eq(schema.profiles.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting profile by email:", error);
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
      const result = await db.insert(schema.service_regions).values(region).returning();
      return result[0];
    } catch (error: any) {
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
}

export const storage = new DatabaseStorage();