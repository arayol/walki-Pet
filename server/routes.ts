import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { z } from "zod";
import bcrypt from "bcrypt";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});

// Validation schemas
const createPaymentSessionSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  walkerId: z.string().uuid(),
  clientId: z.string().uuid(),
  walkId: z.string().uuid().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const createConnectAccountSchema = z.object({
  walkerId: z.string().uuid(),
  email: z.string().email(),
  country: z.string().default("US"),
});

const clientAccessSchema = z.object({
  clientId: z.string().uuid(),
  expirationHours: z.number().default(24),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.string(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  planType: z.string().optional(),
  // Consentimentos LGPD
  acceptedTerms: z.boolean(),
  acceptedPrivacy: z.boolean(),
  acceptedDataProcessing: z.boolean(),
  acceptedMarketing: z.boolean().optional(),
});

const checkoutSchema = z.object({
  priceAmount: z.number().positive(),
  planName: z.string(),
  planType: z.string(),
  billingCycle: z.string(),
  userEmail: z.string().email(),
  userName: z.string(),
  userCpf: z.string().optional(),
  userPhone: z.string().optional(),
  userPassword: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  // Consentimentos LGPD
  acceptedTerms: z.boolean(),
  acceptedPrivacy: z.boolean(),
  acceptedDataProcessing: z.boolean(),
  acceptedMarketing: z.boolean().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configuration endpoint for frontend
  app.get("/api/config", async (req, res) => {
    res.json({
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      appUrl: process.env.FRONTEND_URL || `http://localhost:5000`,
    });
  });

  // Marketing/Public Profile API endpoints
  app.get("/api/walkers/public/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Get walker by slug with profile info
      const walker = await storage.getWalkerBySlug(slug);
      
      if (!walker) {
        return res.status(404).json({ error: "Walker not found" });
      }

      // Get walker's service plans
      const servicePlans = await storage.getServicePlansByWalker(walker.walker_id);
      
      res.json({
        walker,
        servicePlans: servicePlans.filter(plan => plan.is_active)
      });
    } catch (error) {
      console.error("Error fetching public walker:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/walkers/:walkerId/marketing", async (req, res) => {
    try {
      const { walkerId } = req.params;
      const marketingData = req.body;

      // Validate phone format
      if (marketingData.phone) {
        let numbersOnly = marketingData.phone.replace(/\D/g, '');
        
        // If phone starts with +55, remove the country code for validation
        if (marketingData.phone.startsWith('+55')) {
          numbersOnly = numbersOnly.substring(2); // Remove '55' from +55
        }
        
        if (numbersOnly.length < 10 || numbersOnly.length > 11) {
          return res.status(400).json({ 
            error: "Telefone deve ter 10 ou 11 dígitos (incluindo DDD)" 
          });
        }
      }

      // Validate CEPs
      if (marketingData.regions_served) {
        for (const region of marketingData.regions_served) {
          if (region.cep) {
            const cepNumbers = region.cep.replace(/\D/g, '');
            if (cepNumbers.length !== 8) {
              return res.status(400).json({ 
                error: `CEP "${region.cep}" deve ter 8 dígitos` 
              });
            }
          }
        }
      }

      // Update walker with marketing data
      const updatedWalker = await storage.updateWalker(walkerId, {
        bio: marketingData.bio,
        location: marketingData.location,
        phone: marketingData.phone,
        years_experience: marketingData.years_experience,
        specialties: marketingData.specialties || [],
        certifications: marketingData.certifications || [],
        emergency_available: marketingData.emergency_available || false,
        has_transport: marketingData.has_transport || false,
        languages_spoken: marketingData.languages_spoken || [],
        pet_size_preference: marketingData.pet_size_preference || [],
        additional_services: marketingData.additional_services || [],
        availability: marketingData.availability || {},
        regions_served: marketingData.regions_served || [],
        instagram_username: marketingData.instagram_username,
        slug: marketingData.slug,
        updated_at: new Date()
      });

      if (!updatedWalker) {
        return res.status(404).json({ error: "Walker not found" });
      }

      res.json({ success: true, walker: updatedWalker });
    } catch (error) {
      console.error("Error updating walker marketing data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Service Plans API endpoints
  app.get("/api/walkers/:walkerId/service-plans", async (req, res) => {
    try {
      const { walkerId } = req.params;
      const plans = await storage.getServicePlansByWalker(walkerId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching service plans:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/service-plans", async (req, res) => {
    try {
      const planData = req.body;
      const newPlan = await storage.createServicePlan(planData);
      res.json(newPlan);
    } catch (error) {
      console.error("Error creating service plan:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/service-plans/:planId", async (req, res) => {
    try {
      const { planId } = req.params;
      const updates = req.body;
      const updatedPlan = await storage.updateServicePlan(planId, updates);
      
      if (!updatedPlan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      res.json(updatedPlan);
    } catch (error) {
      console.error("Error updating service plan:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/service-plans/:planId", async (req, res) => {
    try {
      const { planId } = req.params;
      const success = await storage.deleteServicePlan(planId);
      
      if (!success) {
        return res.status(404).json({ error: "Plan not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service plan:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Service Regions API endpoints
  app.get("/api/service-plans/:planId/regions", async (req, res) => {
    try {
      const { planId } = req.params;
      const regions = await storage.getServiceRegionsByPlan(planId);
      res.json(regions);
    } catch (error) {
      console.error("Error fetching service regions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/service-regions", async (req, res) => {
    try {
      const regionData = req.body;
      
      // Validate CEP
      if (regionData.cep) {
        const cepNumbers = regionData.cep.replace(/\D/g, '');
        if (cepNumbers.length !== 8) {
          return res.status(400).json({ 
            error: `CEP "${regionData.cep}" deve ter 8 dígitos` 
          });
        }
      }

      const newRegion = await storage.createServiceRegion(regionData);
      res.json(newRegion);
    } catch (error) {
      console.error("Error creating service region:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/service-regions/:regionId", async (req, res) => {
    try {
      const { regionId } = req.params;
      const success = await storage.deleteServiceRegion(regionId);
      
      if (!success) {
        return res.status(404).json({ error: "Region not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service region:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create profile first
      const profile = await storage.createProfile({
        id: crypto.randomUUID(),
        email: validatedData.email,
        name: validatedData.fullName,
        role: validatedData.role,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Create walker/client based on role
      if (validatedData.role === 'walker') {
        // Limpar CPF e telefone removendo formatação
        const cleanCPF = validatedData.cpf?.replace(/[^\d]/g, '') || null;
        const cleanPhone = validatedData.phone?.replace(/[^\d]/g, '') || null;
        
        await storage.createWalker({
          walker_id: profile.id,
          cpf: cleanCPF,
          phone: cleanPhone,
          plan_type: validatedData.planType || 'free',
          terms_accepted_at: validatedData.acceptedTerms ? new Date() : null,
          // Consentimentos LGPD
          lgpd_consent_terms: validatedData.acceptedTerms,
          lgpd_consent_privacy: validatedData.acceptedPrivacy,
          lgpd_consent_data_processing: validatedData.acceptedDataProcessing,
          lgpd_consent_marketing: validatedData.acceptedMarketing || false,
          lgpd_consent_date: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      } else if (validatedData.role === 'client') {
        await storage.createClient({
          walker_id: '', // Empty for now - clients don't have assigned walkers initially
          client_id: profile.id,
          client_name: validatedData.fullName,
          pet_name: 'Pet padrão',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Create session (simple implementation)
      const session = {
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
        },
        access_token: `token_${profile.id}_${Date.now()}`,
      };

      res.status(201).json({ profile, session });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: 'Failed to create account' });
    }
  });

  // Checkout route
  app.post("/api/payments/create-checkout", async (req, res) => {
    try {
      const validatedData = checkoutSchema.parse(req.body);
      
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: validatedData.planName,
                description: `Plano ${validatedData.planType} - ${validatedData.billingCycle}`,
              },
              unit_amount: validatedData.priceAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: validatedData.successUrl,
        cancel_url: validatedData.cancelUrl,
        metadata: {
          planType: validatedData.planType,
          billingCycle: validatedData.billingCycle,
          userEmail: validatedData.userEmail,
          userName: validatedData.userName,
          userCpf: validatedData.userCpf || '',
          userPhone: validatedData.userPhone || '',
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(400).json({ error: 'Failed to create checkout session' });
    }
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Get profile by email
      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Create session (for now, just return the profile)
      const session = {
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
        },
        access_token: `token_${profile.id}_${Date.now()}`,
      };

      res.json({ profile, session });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });

  // Stripe webhook to process successful payments
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      if (!sig) {
        return res.status(400).json({ error: 'No signature provided' });
      }
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const metadata = session.metadata;

        // Create user account after successful payment
        if (metadata.userEmail && metadata.planType) {
          const hashedPassword = await bcrypt.hash(metadata.userPassword || 'temp123', 10);
          
          const profile = await storage.createProfile({
            id: crypto.randomUUID(),
            email: metadata.userEmail,
            name: metadata.userName,
            role: 'walker',
            created_at: new Date(),
            updated_at: new Date(),
          });

          await storage.createWalker({
            walker_id: profile.id,
            cpf: metadata.userCpf || null,
            phone: metadata.userPhone || null,
            plan_type: metadata.planType,
            terms_accepted_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook failed' });
    }
  });

  // Profile routes
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Walker data routes
  app.get("/api/walkers/:id", async (req, res) => {
    try {
      const walker = await storage.getWalker(req.params.id);
      if (!walker) {
        return res.status(404).json({ error: "Walker not found" });
      }
      
      // Get profile data too
      const profile = await storage.getProfile(req.params.id);
      
      res.json({
        ...walker,
        profile: profile
      });
    } catch (error) {
      console.error('Error fetching walker:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Walker stats route
  app.get("/api/walkers/:id/stats", async (req, res) => {
    try {
      // Return mock stats for now - you can implement real calculations later
      const stats = {
        todayWalks: 0,
        activeClients: 0,
        monthlyRevenue: 0,
        rating: 4.8
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching walker stats:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Walker plan limits route
  app.get("/api/walkers/:id/plan-limits", async (req, res) => {
    try {
      // Return mock plan limits for now
      const planLimits = {
        should_upgrade: false,
        reason: "Within limits",
        client_count: 0,
        max_clients: 10,
        account_age_days: 1,
        trial_days: 30
      };
      
      res.json(planLimits);
    } catch (error) {
      console.error('Error fetching plan limits:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const profile = await storage.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Walker routes
  app.get("/api/walkers", async (req, res) => {
    try {
      const walkers = await storage.getAllWalkers();
      res.json(walkers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/walkers/by-slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const walker = await storage.getWalkerBySlug(slug);
      
      if (!walker) {
        return res.status(404).json({ error: "Walker not found" });
      }
      
      res.json(walker);
    } catch (error) {
      console.error("Error getting walker by slug:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/walkers/:walkerId", async (req, res) => {
    try {
      const walker = await storage.getWalkerWithProfile(req.params.walkerId);
      if (!walker) {
        return res.status(404).json({ error: "Walker not found" });
      }
      res.json(walker);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/walkers", async (req, res) => {
    try {
      const walker = await storage.createWalker(req.body);
      res.status(201).json(walker);
    } catch (error) {
      res.status(500).json({ error: "Failed to create walker" });
    }
  });

  app.put("/api/walkers/:walkerId", async (req, res) => {
    try {
      const walker = await storage.updateWalker(req.params.walkerId, req.body);
      if (!walker) {
        return res.status(404).json({ error: "Walker not found" });
      }
      res.json(walker);
    } catch (error) {
      res.status(500).json({ error: "Failed to update walker" });
    }
  });

  // Client routes
  app.get("/api/clients/:clientId", async (req, res) => {
    try {
      const client = await storage.getClientWithProfile(req.params.clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clients/:clientId/walks", async (req, res) => {
    try {
      const walks = await storage.getWalksByClient(req.params.clientId);
      res.json(walks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clients/:clientId/service-bookings", async (req, res) => {
    try {
      const bookings = await storage.getServiceBookingsByClient(req.params.clientId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clients/:clientId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByClient(req.params.clientId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/walkers/:walkerId/clients", async (req, res) => {
    try {
      const clients = await storage.getClientsByWalker(req.params.walkerId);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Client login route
  app.post("/api/clients/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("🔑 Login attempt for email:", email);
      
      // Find profile by email with client role AND existing client record
      const result = await db.select({
        profile: schema.profiles,
        client: schema.clients,
      })
      .from(schema.profiles)
      .innerJoin(schema.clients, eq(schema.profiles.id, schema.clients.client_id))
      .where(eq(schema.profiles.email, email))
      .limit(1);

      if (result.length === 0) {
        console.log("❌ No client found for email:", email);
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const { profile, client } = result[0];
      console.log("✅ Found client:", client.client_name, "with profile:", profile.name);
      
      // In a real app, you'd verify the password here
      // For now, we'll assume password is correct since we don't store hashed passwords yet
      
      res.json({ 
        success: true, 
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role
        },
        client: client
      });
    } catch (error) {
      console.error("Error during client login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/clients/signup", async (req, res) => {
    try {
      const { walker_id, name, email, password, pet_name, pet_breed, pet_age, pet_notes, emergency_contact, address } = req.body;
      
      // Check if user already exists
      const existingProfile = await storage.getProfileByEmail(email);
      if (existingProfile) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }
      
      // Generate a unique ID for the client
      const clientId = crypto.randomUUID();
      
      // Create BOTH profile and client in a single transaction
      const result = await storage.createClientComplete({
        profileData: {
          id: clientId,
          email,
          name,
          role: "client" as const
        },
        clientData: {
          client_id: clientId,
          walker_id,
          client_name: name,
          pet_name,
          pet_breed: pet_breed || null,
          pet_age: pet_age ? parseInt(pet_age) : null,
          pet_notes: pet_notes || null,
          emergency_contact: emergency_contact || null,
          address: address || null,
          is_active: true
        }
      });
      
      res.json({ success: true, client_id: result.client.client_id });
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Payment routes - migrated from Supabase Edge Functions
  app.post("/api/payments/create-session", async (req, res) => {
    try {
      const validatedData = createPaymentSessionSchema.parse(req.body);
      
      // Get walker's Stripe account
      const walker = await storage.getWalker(validatedData.walkerId);
      if (!walker || !walker.stripe_account_id) {
        return res.status(400).json({ error: "Walker Stripe account not found" });
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: validatedData.currency,
            product_data: {
              name: 'Dog Walking Service',
            },
            unit_amount: Math.round(validatedData.amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: validatedData.successUrl,
        cancel_url: validatedData.cancelUrl,
        payment_intent_data: {
          application_fee_amount: Math.round(validatedData.amount * 100 * 0.05), // 5% platform fee
          transfer_data: {
            destination: walker.stripe_account_id,
          },
        },
      });

      // Store payment record
      await storage.createPayment({
        client_id: validatedData.clientId,
        walker_id: validatedData.walkerId,
        walk_id: validatedData.walkId,
        amount: validatedData.amount.toString(),
        currency: validatedData.currency,
        status: 'pending',
        stripe_session_id: session.id,
        stripe_session_url: session.url,
      });

      res.json({
        success: true,
        sessionId: session.id,
        sessionUrl: session.url,
      });
    } catch (error) {
      console.error("Payment session creation error:", error);
      res.status(500).json({ error: "Failed to create payment session" });
    }
  });

  app.post("/api/payments/create-connect-account", async (req, res) => {
    try {
      const validatedData = createConnectAccountSchema.parse(req.body);
      
      // Create Stripe Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        country: validatedData.country,
        email: validatedData.email,
      });

      // Update walker with Stripe account ID
      await storage.updateWalker(validatedData.walkerId, {
        stripe_account_id: account.id,
      });

      // Create account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/walker/payments/refresh`,
        return_url: `${process.env.FRONTEND_URL}/walker/payments/success`,
        type: 'account_onboarding',
      });

      res.json({
        success: true,
        accountId: account.id,
        onboardingUrl: accountLink.url,
      });
    } catch (error) {
      console.error("Connect account creation error:", error);
      res.status(500).json({ error: "Failed to create connect account" });
    }
  });

  app.post("/api/payments/check-connect-account", async (req, res) => {
    try {
      const { accountId } = req.body;
      
      if (!accountId) {
        return res.status(400).json({ error: "Account ID is required" });
      }

      // Get account details from Stripe
      const account = await stripe.accounts.retrieve(accountId);
      
      res.json({
        success: true,
        account: {
          id: account.id,
          type: account.type,
          country: account.country,
          default_currency: account.default_currency,
          details_submitted: account.details_submitted,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          capabilities: account.capabilities,
          requirements: {
            currently_due: account.requirements?.currently_due || [],
            eventually_due: account.requirements?.eventually_due || [],
            past_due: account.requirements?.past_due || [],
            pending_verification: account.requirements?.pending_verification || [],
            disabled_reason: account.requirements?.disabled_reason,
          },
          business_profile: account.business_profile,
        }
      });
    } catch (error) {
      console.error("Account status check error:", error);
      res.status(500).json({ error: "Failed to check account status" });
    }
  });

  // Client access token routes
  app.post("/api/client-access/generate-token", async (req, res) => {
    try {
      const validatedData = clientAccessSchema.parse(req.body);
      
      // Generate secure token
      const token = require('crypto').randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + validatedData.expirationHours);
      
      await storage.createClientAccessToken(
        validatedData.clientId,
        token,
        expiresAt
      );

      res.json({
        success: true,
        token,
        expiresAt: expiresAt.toISOString(),
      });
    } catch (error) {
      console.error("Token generation error:", error);
      res.status(500).json({ error: "Failed to generate access token" });
    }
  });

  app.post("/api/client-access/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const validation = await storage.validateClientAccessToken(token);
      
      if (!validation) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      res.json({
        success: true,
        clientId: validation.clientId,
      });
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(500).json({ error: "Failed to validate token" });
    }
  });

  // Service Plan routes
  app.get("/api/walkers/:walkerId/service-plans", async (req, res) => {
    try {
      const servicePlans = await storage.getServicePlansByWalker(req.params.walkerId);
      res.json(servicePlans);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/service-plans/:planId", async (req, res) => {
    try {
      const servicePlan = await storage.getServicePlan(req.params.planId);
      if (!servicePlan) {
        return res.status(404).json({ error: "Service plan not found" });
      }
      res.json(servicePlan);
    } catch (error) {
      console.error("Error fetching service plan:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/service-plans/:planId/availability", async (req, res) => {
    try {
      const { planId } = req.params;
      const { start_date, end_date } = req.query;
      
      console.log('🔍 [API] Buscando disponibilidade real para:', { planId, start_date, end_date });
      
      // Buscar dados reais do banco
      const availability = await storage.getServicePlanAvailability(
        planId, 
        start_date as string, 
        end_date as string
      );
      
      console.log('✅ [API] Disponibilidade encontrada:', availability.length, 'slots');
      res.json(availability);
    } catch (error) {
      console.error("Error fetching service plan availability:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/service-plans/:planId/validate-booking
  app.post("/api/service-plans/:planId/validate-booking", async (req, res) => {
    try {
      const { planId } = req.params;
      const { selected_slots } = req.body;

      console.log('🔍 [API] Validando slots para plano:', planId);
      console.log('🔍 [API] Slots selecionados:', selected_slots);

      const validation = await storage.validateBookingSlots(planId, selected_slots);

      console.log('✅ [API] Validação concluída:', validation);
      res.json(validation);
    } catch (error: any) {
      console.error('❌ [API] Erro na validação:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/service-plans", async (req, res) => {
    try {
      const servicePlan = await storage.createServicePlan(req.body);
      res.status(201).json(servicePlan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service plan" });
    }
  });

  // Service Schedules endpoints - Simplified: only by service plan
  app.get("/api/service-schedules", async (req, res) => {
    try {
      const { service_plan_id } = req.query;
      
      console.log('🔍 [API] Buscando service schedules para plano:', service_plan_id);
      
      if (!service_plan_id) {
        return res.status(400).json({ error: "service_plan_id é obrigatório" });
      }

      const schedules = await storage.getServiceSchedules(service_plan_id as string);
      
      console.log('✅ [API] Service schedules encontrados:', schedules.length);
      res.json(schedules);
    } catch (error: any) {
      console.error("Error fetching service schedules:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/service-schedules", async (req, res) => {
    try {
      console.log('🔄 [API] Criando service schedule:', req.body);
      
      const schedule = await storage.createServiceSchedule(req.body);
      console.log('✅ [API] Service schedule criado:', schedule);
      
      res.json(schedule);
    } catch (error: any) {
      console.error("Error creating service schedule:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/service-schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🔄 [API] Atualizando service schedule:', { id, data: req.body });
      
      const schedule = await storage.updateServiceSchedule(id, req.body);
      console.log('✅ [API] Service schedule atualizado:', schedule);
      
      res.json(schedule);
    } catch (error: any) {
      console.error("Error updating service schedule:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/service-schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🔄 [API] Deletando service schedule:', id);
      
      const success = await storage.deleteServiceSchedule(id);
      
      if (success) {
        console.log('✅ [API] Service schedule deletado');
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Schedule não encontrado" });
      }
    } catch (error: any) {
      console.error("Error deleting service schedule:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Walk routes
  app.get("/api/walkers/:walkerId/walks", async (req, res) => {
    try {
      const walkerId = req.params.walkerId;
      const { start, end } = req.query;
      
      let walks = await storage.getWalksByWalker(walkerId);
      
      // Filter by date range if provided
      if (start && end) {
        walks = walks.filter((walk: any) => {
          const walkDate = new Date(walk.scheduled_at);
          return walkDate >= new Date(start as string) && walkDate <= new Date(end as string);
        });
      }
      
      res.json(walks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Service bookings routes
  app.get("/api/walkers/:walkerId/service-bookings", async (req, res) => {
    try {
      const walkerId = req.params.walkerId;
      const { start, end } = req.query;
      
      // For now, return empty array as service bookings aren't implemented yet
      // This can be expanded when the service booking system is implemented
      const serviceBookings: any[] = [];
      
      res.json(serviceBookings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clients/:clientId/walks", async (req, res) => {
    try {
      const walks = await storage.getWalksByClient(req.params.clientId);
      res.json(walks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/walks", async (req, res) => {
    try {
      const walk = await storage.createWalk(req.body);
      res.status(201).json(walk);
    } catch (error) {
      res.status(500).json({ error: "Failed to create walk" });
    }
  });

  // Payment history routes
  app.get("/api/walkers/:walkerId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByWalker(req.params.walkerId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Transactions endpoint (alias for payments with additional processing)
  app.get("/api/walkers/:walkerId/transactions", async (req, res) => {
    try {
      const walkerId = req.params.walkerId;
      
      // Get payments data (same as transactions for this implementation)
      const payments = await storage.getPaymentsByWalker(walkerId);
      
      // Process payments to match expected transaction format
      const transactions = payments.map((payment: any) => ({
        ...payment,
        clients: payment.clients || {
          client_name: payment.client_name || 'Cliente',
          pet_name: payment.pet_name || 'Pet',
          client_id: payment.client_id || ''
        },
        service_plan_name: payment.metadata?.service_plan_name || 'Serviço',
        scheduled_by: payment.metadata?.scheduled_by || 'Cliente',
        payment_method_label: payment.stripe_payment_id ? 'Stripe' : (payment.payment_method || 'Manual')
      }));

      res.json({ 
        transactions: transactions,
        total: transactions.length
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Financial stats endpoint
  app.get("/api/walkers/:walkerId/financial-stats", async (req, res) => {
    try {
      const walkerId = req.params.walkerId;
      
      // Get current month date range
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Get payments for current month
      const payments = await storage.getPaymentsByWalker(walkerId);
      const monthlyPayments = payments.filter((payment: any) => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth;
      });

      // Get walks for current month
      const walks = await storage.getWalksByWalker(walkerId);
      const monthlyWalks = walks.filter((walk: any) => {
        const walkDate = new Date(walk.scheduled_at || walk.created_at);
        return walkDate >= firstDayOfMonth && walkDate <= lastDayOfMonth;
      });

      // Calculate stats
      const paidPayments = monthlyPayments.filter((p: any) => p.status === 'paid');
      const pendingPayments = monthlyPayments.filter((p: any) => p.status === 'pending');
      const scheduledWalks = monthlyWalks.filter((w: any) => w.status === 'scheduled');

      const monthlyRevenue = paidPayments.reduce((sum: number, payment: any) => 
        sum + Number(payment.amount || 0), 0
      );
      const pendingAmount = pendingPayments.reduce((sum: number, payment: any) => 
        sum + Number(payment.amount || 0), 0
      );
      const averageValue = paidPayments.length > 0 ? monthlyRevenue / paidPayments.length : 0;

      res.json({
        monthlyRevenue,
        scheduledWalks: scheduledWalks.length,
        averageValue,
        pendingAmount,
      });
    } catch (error) {
      console.error("Error fetching financial stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clients/:clientId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByClient(req.params.clientId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Payment update endpoint
  app.patch("/api/payments/:paymentId", async (req, res) => {
    try {
      const paymentId = req.params.paymentId;
      const updateData = req.body;
      
      const updatedPayment = await storage.updatePayment(paymentId, updateData);
      
      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json(updatedPayment);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Payment deletion endpoint
  app.delete("/api/payments/:paymentId", async (req, res) => {
    try {
      const paymentId = req.params.paymentId;
      
      // For now, mark payment as cancelled instead of deleting
      const updatedPayment = await storage.updatePayment(paymentId, { 
        status: 'cancelled',
        updated_at: new Date()
      });
      
      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json({ success: true, message: "Payment cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Google Calendar integration endpoints
  app.post("/api/google-calendar/auth-url", async (req, res) => {
    try {
      const { user_id } = req.body;
      
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }

      const { GoogleCalendarService } = await import('./lib/googleCalendar');
      const authUrl = GoogleCalendarService.generateAuthUrl(user_id);
      
      res.json({
        auth_url: authUrl,
        message: "Redirect to Google for authentication"
      });
    } catch (error) {
      console.error("Error generating Google auth URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/google-calendar/callback", async (req, res) => {
    try {
      const { code, state: userId } = req.query;
      
      if (!code || !userId) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/schedule?google_auth=error&message=Missing authorization code or user ID`);
      }

      const { GoogleCalendarService } = await import('./lib/googleCalendar');
      const tokens = await GoogleCalendarService.exchangeCodeForTokens(code as string);
      
      // Atualizar walker com tokens do Google Calendar
      const walker = await storage.getWalker(userId as string);
      if (walker) {
        await storage.updateWalker(userId as string, {
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          google_calendar_connected: true,
          google_last_sync: null,
          updated_at: new Date()
        });
      }

      // Close the popup window after successful auth
      res.send(`
        <script>
          // Notify parent window and close popup
          if (window.opener) {
            window.opener.postMessage({type: 'google_auth_success'}, '*');
          }
          window.close();
        </script>
        <p>Autenticação concluída! Fechando janela...</p>
      `);
    } catch (error) {
      console.error("Error in Google Calendar callback:", error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/schedule?google_auth=error&message=Authentication failed`);
    }
  });

  app.delete("/api/walkers/:walkerId/google-calendar", async (req, res) => {
    try {
      const walkerId = req.params.walkerId;
      
      await storage.updateWalker(walkerId, {
        google_access_token: null,
        google_refresh_token: null,
        google_calendar_connected: false,
        google_last_sync: null,
        updated_at: new Date()
      });
      
      res.json({ 
        success: true, 
        message: "Google Calendar disconnected successfully" 
      });
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/walkers/:walkerId/google-calendar/sync", async (req, res) => {
    try {
      const walkerId = req.params.walkerId;
      
      const walker = await storage.getWalker(walkerId);
      if (!walker || !walker.google_access_token) {
        return res.status(400).json({ error: "Google Calendar not connected" });
      }

      // Buscar agendamentos do walker
      const walks = await storage.getWalksByWalker(walkerId);
      
      // Filtrar apenas agendamentos futuros (próximos 30 dias)
      const now = new Date();
      const futureDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const futureWalks = walks.filter((walk: any) => {
        const walkDate = new Date(walk.scheduled_at);
        return walkDate >= now && walkDate <= futureDate;
      });

      const { GoogleCalendarService } = await import('./lib/googleCalendar');
      const result = await GoogleCalendarService.syncWalksToCalendar(
        walker.google_access_token!,
        walker.google_refresh_token || '',
        futureWalks
      );

      // Atualizar timestamp da última sincronização
      await storage.updateWalker(walkerId, {
        google_last_sync: new Date(),
        updated_at: new Date()
      });
      
      res.json({ 
        success: true, 
        message: `${result.syncedCount} agendamentos sincronizados com sucesso!`,
        synced_events: result.syncedCount
      });
    } catch (error) {
      console.error("Error syncing to Google Calendar:", error);
      res.status(500).json({ 
        error: "Erro na sincronização",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Stripe webhooks
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!sig || !webhookSecret) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }

      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          // Update payment status
          await storage.updatePayment(session.id, {
            status: 'paid',
            paid_at: new Date(),
          });
          break;
          
        case 'payment_intent.payment_failed':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // Update payment status
          await storage.updatePayment(paymentIntent.id, {
            status: 'failed',
          });
          break;
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
