// API client for server communication
import { 
  Profile, 
  Walker, 
  Client, 
  ServicePlan, 
  Walk, 
  Payment,
  InsertProfile,
  InsertWalker,
  InsertClient,
  InsertServicePlan,
  InsertWalk,
  InsertPayment
} from '../../../../shared/schema.js';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Configuration
  async getConfig() {
    return this.fetchApi<{ stripePublishableKey: string; appUrl: string }>('/config');
  }

  // Profile operations
  async getProfile(id: string): Promise<Profile> {
    return this.fetchApi<Profile>(`/profiles/${id}`);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    return this.fetchApi<Profile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // Walker operations
  async getAllWalkers(): Promise<Walker[]> {
    return this.fetchApi<Walker[]>('/walkers');
  }

  async getWalker(walkerId: string): Promise<Walker & { profile: Profile }> {
    return this.fetchApi<Walker & { profile: Profile }>(`/walkers/${walkerId}`);
  }

  async createWalker(walker: InsertWalker): Promise<Walker> {
    return this.fetchApi<Walker>('/walkers', {
      method: 'POST',
      body: JSON.stringify(walker),
    });
  }

  async updateWalker(walkerId: string, walker: Partial<InsertWalker>): Promise<Walker> {
    return this.fetchApi<Walker>(`/walkers/${walkerId}`, {
      method: 'PUT',
      body: JSON.stringify(walker),
    });
  }

  // Client operations
  async getClient(clientId: string): Promise<Client & { profile: Profile }> {
    return this.fetchApi<Client & { profile: Profile }>(`/clients/${clientId}`);
  }

  async getClientsByWalker(walkerId: string): Promise<Client[]> {
    return this.fetchApi<Client[]>(`/walkers/${walkerId}/clients`);
  }

  async createClient(client: InsertClient): Promise<Client> {
    return this.fetchApi<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  // Service Plan operations
  async getServicePlansByWalker(walkerId: string): Promise<ServicePlan[]> {
    return this.fetchApi<ServicePlan[]>(`/walkers/${walkerId}/service-plans`);
  }

  async createServicePlan(plan: InsertServicePlan): Promise<ServicePlan> {
    return this.fetchApi<ServicePlan>('/service-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  }

  // Walk operations
  async getWalksByWalker(walkerId: string): Promise<Walk[]> {
    return this.fetchApi<Walk[]>(`/walkers/${walkerId}/walks`);
  }

  async getWalksByClient(clientId: string): Promise<Walk[]> {
    return this.fetchApi<Walk[]>(`/clients/${clientId}/walks`);
  }

  async createWalk(walk: InsertWalk): Promise<Walk> {
    return this.fetchApi<Walk>('/walks', {
      method: 'POST',
      body: JSON.stringify(walk),
    });
  }

  // Payment operations
  async getPaymentsByWalker(walkerId: string): Promise<Payment[]> {
    return this.fetchApi<Payment[]>(`/walkers/${walkerId}/payments`);
  }

  async getPaymentsByClient(clientId: string): Promise<Payment[]> {
    return this.fetchApi<Payment[]>(`/clients/${clientId}/payments`);
  }

  async createPaymentSession(data: {
    amount: number;
    currency?: string;
    walkerId: string;
    clientId: string;
    walkId?: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ success: boolean; sessionId: string; sessionUrl: string }> {
    return this.fetchApi<{ success: boolean; sessionId: string; sessionUrl: string }>('/payments/create-session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createConnectAccount(data: {
    walkerId: string;
    email: string;
    country?: string;
  }): Promise<{ success: boolean; accountId: string; onboardingUrl: string }> {
    return this.fetchApi<{ success: boolean; accountId: string; onboardingUrl: string }>('/payments/create-connect-account', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkConnectAccountStatus(accountId: string): Promise<{ success: boolean; account: any }> {
    return this.fetchApi<{ success: boolean; account: any }>('/payments/check-connect-account', {
      method: 'POST',
      body: JSON.stringify({ accountId }),
    });
  }

  // Client access token operations
  async generateClientAccessToken(clientId: string, expirationHours?: number): Promise<{ success: boolean; token: string; expiresAt: string }> {
    return this.fetchApi<{ success: boolean; token: string; expiresAt: string }>('/client-access/generate-token', {
      method: 'POST',
      body: JSON.stringify({ clientId, expirationHours }),
    });
  }

  async validateClientAccessToken(token: string): Promise<{ success: boolean; clientId: string }> {
    return this.fetchApi<{ success: boolean; clientId: string }>('/client-access/validate-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export const apiClient = new ApiClient();