const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.access_token;
    localStorage.setItem('access_token', this.token!);
    return response;
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Organizations
  async getOrganizations() {
    return this.request('/organizations');
  }

  async createOrganization(orgData: any) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  }

  async getOrganization(orgId: number) {
    return this.request(`/organizations/${orgId}`);
  }

  async updateOrganization(orgId: number, orgData: any) {
    return this.request(`/organizations/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(orgData),
    });
  }

  // Configuration
  async getConfiguration(orgId: number) {
    return this.request(`/organizations/${orgId}/config`);
  }

  async updateConfiguration(orgId: number, configData: any) {
    return this.request(`/organizations/${orgId}/config`, {
      method: 'PUT',
      body: JSON.stringify(configData),
    });
  }

  // Documents
  async getDocuments(orgId: number) {
    return this.request(`/organizations/${orgId}/documents`);
  }

  async createDocument(orgId: number, docData: any) {
    return this.request(`/organizations/${orgId}/documents`, {
      method: 'POST',
      body: JSON.stringify(docData),
    });
  }

  async deleteDocument(orgId: number, docId: number) {
    return this.request(`/organizations/${orgId}/documents/${docId}`, {
      method: 'DELETE',
    });
  }

  // Service Types
  async getServiceTypes(orgId: number) {
    return this.request(`/organizations/${orgId}/service-types`);
  }

  async createServiceType(orgId: number, serviceData: any) {
    return this.request(`/organizations/${orgId}/service-types`, {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  // Appointments
  async getAppointments(orgId: number) {
    return this.request(`/organizations/${orgId}/appointments`);
  }

  async createAppointment(orgId: number, appointmentData: any) {
    return this.request(`/organizations/${orgId}/appointments`, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  // Messages
  async getMessages(orgId: number) {
    return this.request(`/organizations/${orgId}/messages`);
  }

  async createMessage(orgId: number, messageData: any) {
    return this.request(`/organizations/${orgId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Analytics
  async getOrganizationAnalytics(orgId: number) {
    return this.request(`/organizations/${orgId}/analytics`);
  }

  async getPlatformAnalytics() {
    return this.request('/analytics/platform');
  }
}

export const apiService = new ApiService();