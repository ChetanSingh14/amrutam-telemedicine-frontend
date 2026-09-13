import { apiClient } from '../config/api.config';
import { SystemAnalytics } from '../types';

export class AdminService {
  static async getAnalytics(): Promise<SystemAnalytics> {
    const response = await apiClient.get('/admin/analytics');
    return response.data.data;
  }

  static async verifyDoctor(doctorId: string, isVerified: boolean): Promise<any> {
    const response = await apiClient.patch(`/admin/doctors/${doctorId}/verify`, { isVerified });
    return response.data.data;
  }

  static async getAuditLogs(page: number = 1, limit: number = 20): Promise<any[]> {
    const response = await apiClient.get('/admin/audit-logs', { params: { page, limit } });
    return response.data.data;
  }
}
