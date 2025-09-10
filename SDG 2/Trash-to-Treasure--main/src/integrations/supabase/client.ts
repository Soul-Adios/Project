// src/integrations/supabase/client.ts
// Replace Supabase client with Django API client

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Django API client utility
export const djangoAPI = {
  // Generic request method
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          data: errorData,
          message: errorData.error || `HTTP error ${response.status}`,
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth methods
  async signup(username: string, email: string, password: string) {
    return this.request('/signup/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async login(username: string, password: string) {
    return this.request('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    // Django may use session-based logout, or you can implement token invalidation
    return this.request('/logout/', {
      method: 'POST',
    });
  },

  // Waste submission methods
  async getWasteSubmissions() {
    return this.request('/waste/');
  },

  async createWasteSubmission(wasteData: {
    waste_type: string;
    weight_kg: number;
    date: string;
  }) {
    return this.request('/waste/', {
      method: 'POST',
      body: JSON.stringify(wasteData),
    });
  },

  async updateWasteSubmission(id: number, wasteData: any) {
    return this.request(`/waste/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(wasteData),
    });
  },

  async deleteWasteSubmission(id: number) {
    return this.request(`/waste/${id}/`, {
      method: 'DELETE',
    });
  },

  // Dashboard methods
  async getDashboardData(userId: number) {
    return this.request(`/dashboard/${userId}/`);
  },

  // Leaderboard methods
  async getLeaderboard() {
    return this.request('/leaderboard/');
  },
};

// For backward compatibility (if other components still expect a supabase export)
export const supabase = {
  auth: {
    // Mock auth methods that use Django API instead
    signUp: async (credentials: { email: string; password: string; options?: { data: { username: string } } }) => {
      const username = credentials.options?.data?.username || credentials.email.split('@')[0];
      return djangoAPI.signup(username, credentials.email, credentials.password);
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      // Note: Your Django login uses username, not email
      // This is a temporary workaround - you should update your components to use username
      return djangoAPI.login(credentials.email, credentials.password);
    },
    signOut: async () => {
      return djangoAPI.logout();
    },
  },
  // Add other mock methods as needed
};

export default djangoAPI;