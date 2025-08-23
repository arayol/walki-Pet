// API client for communicating with our Express server
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Profile operations
  async getProfile(id: string) {
    return this.request(`/api/profiles/${id}`);
  }

  async createProfile(profile: any) {
    return this.request('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // Walker operations
  async getAllWalkers() {
    return this.request('/api/walkers');
  }

  async getWalker(walkerId: string) {
    return this.request(`/api/walkers/${walkerId}`);
  }

  async createWalker(walker: any) {
    return this.request('/api/walkers', {
      method: 'POST',
      body: JSON.stringify(walker),
    });
  }

  async updateWalker(walkerId: string, walker: any) {
    return this.request(`/api/walkers/${walkerId}`, {
      method: 'PUT',
      body: JSON.stringify(walker),
    });
  }

  // Client operations
  async getClient(clientId: string) {
    return this.request(`/api/clients/${clientId}`);
  }

  async createClient(client: any) {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async getClientsByWalker(walkerId: string) {
    return this.request(`/api/walkers/${walkerId}/clients`);
  }

  // Payment operations
  async createPaymentSession(paymentData: {
    amount: number;
    currency?: string;
    walkerId: string;
    clientId: string;
    walkId?: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.request('/api/payments/create-session', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async createConnectAccount(accountData: {
    walkerId: string;
    email: string;
    country?: string;
  }) {
    return this.request('/api/payments/create-connect-account', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async checkConnectAccount(accountId: string) {
    return this.request('/api/payments/check-connect-account', {
      method: 'POST',
      body: JSON.stringify({ accountId }),
    });
  }

  // Service Plan operations
  async getServicePlansByWalker(walkerId: string) {
    return this.request(`/api/walkers/${walkerId}/service-plans`);
  }

  async createServicePlan(servicePlan: any) {
    return this.request('/api/service-plans', {
      method: 'POST',
      body: JSON.stringify(servicePlan),
    });
  }

  // Walk operations
  async getWalksByWalker(walkerId: string) {
    return this.request(`/api/walkers/${walkerId}/walks`);
  }

  async getWalksByClient(clientId: string) {
    return this.request(`/api/clients/${clientId}/walks`);
  }

  async createWalk(walk: any) {
    return this.request('/api/walks', {
      method: 'POST',
      body: JSON.stringify(walk),
    });
  }

  // Payment history
  async getPaymentsByWalker(walkerId: string) {
    return this.request(`/api/walkers/${walkerId}/payments`);
  }

  async getPaymentsByClient(clientId: string) {
    return this.request(`/api/clients/${clientId}/payments`);
  }

  // Client access tokens
  async generateClientAccessToken(clientId: string, expirationHours?: number) {
    return this.request('/api/client-access/generate-token', {
      method: 'POST',
      body: JSON.stringify({ clientId, expirationHours }),
    });
  }

  async validateClientAccessToken(token: string) {
    return this.request('/api/client-access/validate-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export const apiClient = new ApiClient();