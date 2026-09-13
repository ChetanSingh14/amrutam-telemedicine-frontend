import { apiClient } from '../config/api.config';
import { User } from '../types';

export class AuthService {
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
