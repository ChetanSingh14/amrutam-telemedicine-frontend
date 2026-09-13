import { apiClient } from '../config/api.config';
import { Consultation } from '../types';

export class BookingService {
  static async bookConsultation(slotId: string, notes?: string, idempotencyKey?: string): Promise<Consultation> {
    const response = await apiClient.post(
      '/bookings',
      { slotId, notes },
      {
        headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : {}
      }
    );
    return response.data.data;
  }

  static async cancelBooking(id: string, reason?: string): Promise<Consultation> {
    const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
    return response.data.data;
  }

  static async getMyBookings(): Promise<Consultation[]> {
    const response = await apiClient.get('/bookings/my-bookings');
    return response.data.data;
  }
}
