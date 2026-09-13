import React, { useState, useEffect } from 'react';
import { DoctorService } from '../services/doctor.service';
import { BookingService } from '../services/booking.service';
import { Doctor, AvailabilitySlot } from '../types';
import { useToast } from '../context/ToastContext';
import { X, Calendar, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onSuccess }) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (doctor) {
      setFetching(true);
      DoctorService.getDoctorById(doctor.id)
        .then((data) => {
          const fetchedSlots = data.availableSlots || [];
          setSlots(fetchedSlots);
          if (fetchedSlots.length > 0) {
            setSelectedSlotId(fetchedSlots[0].id);
          }
        })
        .catch((err) => showToast('Failed to load doctor availability slots.', 'error'))
        .finally(() => setFetching(false));
    }
  }, [doctor]);

  if (!doctor) return null;

  const handleBookSlot = async () => {
    if (!selectedSlotId) return;
    setLoading(true);

    const idempotencyKey = `book-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      await BookingService.bookConsultation(selectedSlotId, notes, idempotencyKey);
      showToast('🎉 Consultation booked successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to book slot. It might have been booked concurrently.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} color="var(--text-muted)" />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Book Consultation</h2>
        <p style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          with {doctor.name} ({doctor.specialization})
        </p>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consultation Fee</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{doctor.consultationFee}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontSize: '0.85rem', fontWeight: 700 }}>
            <ShieldCheck size={18} /> High Concurrency Lock Protected
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={18} color="var(--primary)" /> Select Available Time Slot
        </h3>

        {fetching ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading slots...</div>
        ) : slots.length === 0 ? (
          <div style={{ background: '#fef3c7', color: '#b45309', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            No upcoming slots available for this doctor. Please check back later.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {slots.map((slot) => {
              const start = new Date(slot.startTime);
              const formattedTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const formattedDate = start.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const isSelected = selectedSlotId === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    background: isSelected ? 'var(--primary-light)' : 'white',
                    color: isSelected ? 'var(--primary-dark)' : 'var(--text-dark)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
                  <span style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {formattedTime}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Symptoms / Notes for Doctor (Optional)</label>
          <textarea
            rows={3}
            placeholder="Describe your health symptoms or questions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={loading || !selectedSlotId || slots.length === 0}
          onClick={handleBookSlot}
        >
          {loading ? 'Confirming Lock & Booking...' : 'Confirm Consultation Booking'}
        </button>
      </div>
    </div>
  );
};
