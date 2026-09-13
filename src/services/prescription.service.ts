import { apiClient } from '../config/api.config';
import { Prescription } from '../types';

export class PrescriptionService {
  static async createPrescription(data: {
    consultationId: string;
    diagnosis: string;
    medicines: Array<{ name: string; dosage: string; duration: string; frequency?: string }>;
    instructions?: string;
  }): Promise<Prescription> {
    const response = await apiClient.post('/prescriptions', data);
    return response.data.data;
  }

  static async getPrescriptionById(id: string): Promise<Prescription> {
    const response = await apiClient.get(`/prescriptions/${id}`);
    return response.data.data;
  }
}
