import { apiClient } from '../config/api.config';
import { User } from '../types';

const TOKEN_KEY = 'amrutam_session_token';
const SESSION_ID_KEY = 'amrutam_session_id';

export class AuthService {
  /**
   * Retrieves active session token from sessionStorage.
   * If legacy localStorage exists, migrates it to sessionStorage for strong session isolation.
   */
  static getSessionToken(): string | null {
    let token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      // Check legacy localStorage and migrate
      const legacyToken = localStorage.getItem('amrutam_token');
      if (legacyToken) {
        token = legacyToken;
        sessionStorage.setItem(TOKEN_KEY, legacyToken);
        localStorage.removeItem('amrutam_token');
      }
    }
    return token;
  }

  static getSessionId(): string | null {
    return sessionStorage.getItem(SESSION_ID_KEY);
  }

  static setSession(token: string, userId: string): string {
    const sessionId = `sess_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    // Remove legacy token if any
    localStorage.removeItem('amrutam_token');
    return sessionId;
  }

  static clearSession(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem('amrutam_token');
  }

  static async register(data: any): Promise<{ token: string; user: User }> {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  }

  static async login(data: any): Promise<{ token: string; user: User }> {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  }

  static async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  }

  static async updateProfile(data: any): Promise<any> {
    const response = await apiClient.put('/auth/me', data);
    return response.data.data;
  }
}

