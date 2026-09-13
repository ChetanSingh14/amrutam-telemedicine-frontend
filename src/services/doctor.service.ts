import { apiClient } from '../config/api.config';
import { Doctor, AvailabilitySlot } from '../types';

export class DoctorService {
  static async searchDoctors(filters?: { search?: string; specialization?: string; minRating?: string; maxFee?: string }): Promise<Doctor[]> {
    const response = await apiClient.get('/doctors', { params: filters });
    return response.data.data;
  }

  static async getDoctorById(id: string): Promise<Doctor> {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data.data;
  }

  static async updateDoctorProfile(data: any): Promise<Doctor> {
    const response = await apiClient.put('/doctors/profile/me', data);
    return response.data.data;
  }

  static async addAvailabilitySlot(startTime: string, endTime: string): Promise<AvailabilitySlot> {
    const response = await apiClient.post('/doctors/availability/me', { startTime, endTime });
    return response.data.data;
  }
}
