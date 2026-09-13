import React, { useState, useEffect } from 'react';
import { BookingService } from '../services/booking.service';
import { Consultation, Prescription } from '../types';
import { Video, FileText, Calendar, Clock, CheckCircle2, Download, X } from 'lucide-react';

export const PatientBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load patient bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar color="var(--primary)" /> My Scheduled & Past Consultations
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading consultation history...</div>
      ) : bookings.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No consultations booked yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Explore doctors and book your first video consultation.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((item) => {
            const date = item.slot?.startTime ? new Date(item.slot.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled';
            const time = item.slot?.startTime ? new Date(item.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <div key={item.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>
                      {item.doctor?.name || 'Dr. Assigned Specialist'}
                    </h3>
                    <span className={`badge ${
                      item.status === 'SCHEDULED' ? 'badge-info' :
                      item.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    Specialization: {item.doctor?.specialization || 'General Physician'}
                  </p>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={15} color="var(--primary)" /> {date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={15} color="var(--primary)" /> {time}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {item.meetingLink && item.status !== 'CANCELLED' && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      <Video size={16} /> Join Video Call
                    </a>
                  )}

                  {item.prescription && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedPrescription(item.prescription!)}
                    >
                      <FileText size={16} /> View Prescription
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Prescription Modal */}
      {selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <button
              onClick={() => setSelectedPrescription(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} color="var(--text-muted)" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
              <CheckCircle2 size={24} />
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>Digital Medical Prescription</h2>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Diagnosis Summary</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedPrescription.diagnosis}</div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Prescribed Medicines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedPrescription.medicines.map((med, idx) => (
                <div key={idx} style={{ background: 'white', border: '1px solid var(--border-light)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{med.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dosage: {med.dosage}</div>
                  </div>
                  <span className="badge badge-warning">{med.duration}</span>
                </div>
              ))}
            </div>

            {selectedPrescription.instructions && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Special Instructions</span>
                <p style={{ fontSize: '0.9rem', background: '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>{selectedPrescription.instructions}</p>
              </div>
            )}

            <button
              className="btn btn-accent"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => alert(`Downloading prescription PDF from ${selectedPrescription.pdfUrl}`)}
            >
              <Download size={16} /> Download Signed Prescription PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
