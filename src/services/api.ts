// SECORA Frontend API Service Layer

const API_BASE = ""; // Handled by Vite proxy in dev, blank in production

async function request(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ensure session cookies are sent/received
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Authentication
  async getAuthConfig() {
    return request(`${API_BASE}/api/auth/config`);
  },

  async googleAuth(payload: string | { credential?: string; email?: string; name?: string; picture?: string }) {
    const body = typeof payload === 'string' ? { credential: payload } : payload;
    return request(`${API_BASE}/api/auth/google`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async login(payload: any) {
    return request(`${API_BASE}/api/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  
  async signup(payload: any) {
    return request(`${API_BASE}/api/signup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async verifyOtp(payload: any) {
    return request(`${API_BASE}/api/verify-otp-auth`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async completeProfile(payload: any) {
    return request(`${API_BASE}/api/profile-completion`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getProfile() {
    return request(`${API_BASE}/api/profile`);
  },

  async updateProfile(payload: any) {
    return request(`${API_BASE}/api/profile`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async logout() {
    return request(`${API_BASE}/api/logout`, {
      method: "POST",
    });
  },

  async getSession() {
    return request(`${API_BASE}/api/session`);
  },

  async forgotPassword(payload: any) {
    return request(`${API_BASE}/api/forgot-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async resetPassword(payload: any) {
    return request(`${API_BASE}/api/reset-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Dashboard
  async getDashboard() {
    return request(`${API_BASE}/api/dashboard`);
  },

  // Scanner
  async startScan(payload: { target: string; modules: string[] }) {
    return request(`${API_BASE}/api/scan/start`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async cancelScan() {
    return request(`${API_BASE}/scan/cancel`, {
      method: "POST",
    });
  },

  async getScanResults(scanId: number | string) {
    return request(`${API_BASE}/api/scan/results/${scanId}`);
  },

  // AI Security Assistant
  async getChatSession() {
    return request(`${API_BASE}/api/chat/session`);
  },

  async clearChat() {
    return request(`${API_BASE}/api/chat/clear`, {
      method: "POST",
    });
  },

  async sendChatMessage(message: string, options: { scanContext?: any; conversation?: any[] } = {}) {
    return request(`${API_BASE}/api/chat`, {
      method: "POST",
      body: JSON.stringify({ 
        message, 
        scan_context: options.scanContext,
        conversation: options.conversation
      }),
    });
  },

  // Scan History
  async getHistory() {
    return request(`${API_BASE}/api/history`);
  },

  async deleteScan(scanId: number | string) {
    return request(`${API_BASE}/scan/delete/${scanId}`, {
      method: "POST",
    });
  },

  // Settings
  async getSettings() {
    return request(`${API_BASE}/api/settings`);
  },

  async saveSettings(payload: any) {
    return request(`${API_BASE}/api/settings`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async resetSettings() {
    return request(`${API_BASE}/settings/reset`, {
      method: "POST",
    });
  },

  async clearHistory() {
    return request(`${API_BASE}/settings/clear-history`, {
      method: "POST",
    });
  },
};
