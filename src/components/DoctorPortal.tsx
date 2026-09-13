import React, { useState, useEffect } from 'react';
import { BookingService } from '../services/booking.service';
import { DoctorService } from '../services/doctor.service';
import { PrescriptionService } from '../services/prescription.service';
import { Consultation } from '../types';
import { Plus, Calendar, Clock, FilePlus, CheckCircle, Video, X } from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slotMsg, setSlotMsg] = useState<string | null>(null);

  // Prescription Modal state
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [medicines, setMedicines] = useState<Array<{ name: string; dosage: string; duration: string }>>([]);
  const [rxMsg, setRxMsg] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getMyBookings();
      setConsultations(data || []);
    } catch (err) {
      console.error('Failed to load doctor consultations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlotMsg(null);
    try {
      await DoctorService.addAvailabilitySlot(
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString()
      );
      setSlotMsg('✅ Availability slot published successfully!');
      setStartTime('');
      setEndTime('');
    } catch (err: any) {
      setSlotMsg(`❌ ${err.response?.data?.message || 'Failed to create slot.'}`);
    }
  };

  const handleAddMedicine = () => {
    if (medName && medDosage && medDuration) {
      setMedicines([...medicines, { name: medName, dosage: medDosage, duration: medDuration }]);
      setMedName('');
      setMedDosage('');
      setMedDuration('');
    }
  };

  const handleIssuePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation || medicines.length === 0) return;

    try {
      await PrescriptionService.createPrescription({
        consultationId: selectedConsultation.id,
        diagnosis,
        medicines
      });
      setRxMsg('✅ Prescription issued and consultation completed!');
      setTimeout(() => {
        setSelectedConsultation(null);
        fetchConsultations();
      }, 1200);
    } catch (err: any) {
      setRxMsg(`❌ ${err.response?.data?.message || 'Failed to issue prescription.'}`);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar color="var(--primary)" /> Doctor Clinical Studio
      </h2>

      {/* Publish Slot Section */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={20} color="var(--primary)" /> Add Doctor Availability Time Slot
        </h3>

        {slotMsg && (
          <div style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', background: '#e0f2fe', fontSize: '0.9rem' }}>
            {slotMsg}
          </div>
        )}

        <form onSubmit={handleCreateSlot} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Start Date & Time</label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>End Date & Time</label>
            <input
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            <Plus size={16} /> Publish Availability Slot
          </button>
        </form>
      </div>

      {/* Consultations List */}
      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Patient Appointment Queue</h3>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading appointment queue...</div>
      ) : consultations.length === 0 ? (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No patient appointments scheduled yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {consultations.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.15rem' }}>Patient: {item.patient?.profile?.fullName || 'Registered Patient'}</h4>
                  <span className="badge badge-info">{item.status}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Notes: {item.notes || 'Routine health consultation'}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {item.meetingLink && (
                  <a href={item.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <Video size={16} /> Launch Video Room
                  </a>
                )}

                {item.status !== 'COMPLETED' && (
                  <button className="btn btn-accent" onClick={() => setSelectedConsultation(item)}>
                    <FilePlus size={16} /> Issue Prescription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Prescription Modal */}
      {selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <button onClick={() => setSelectedConsultation(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} color="var(--text-muted)" />
            </button>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Issue Digital Prescription</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              For Patient: <strong>{selectedConsultation.patient?.profile?.fullName || 'Patient'}</strong>
            </p>

            {rxMsg && <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{rxMsg}</div>}

            <form onSubmit={handleIssuePrescription}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Diagnosis Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild Allergic Rhinitis / Pitta Imbalance"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Add Medicines</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="text" placeholder="Medicine Name" value={medName} onChange={(e) => setMedName(e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                  <input type="text" placeholder="Dosage (1-0-1)" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} style={{ width: '120px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                  <input type="text" placeholder="Duration (5 days)" value={medDuration} onChange={(e) => setMedDuration(e.target.value)} style={{ width: '120px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                  <button type="button" className="btn btn-secondary" onClick={handleAddMedicine}>Add</button>
                </div>

                {medicines.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
                    {medicines.map((m, idx) => (
                      <div key={idx} style={{ background: 'white', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{m.name}</strong> ({m.dosage})</span>
                        <span style={{ color: 'var(--text-muted)' }}>{m.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} type="submit">
                <CheckCircle size={16} /> Save & Issue Signed Prescription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
