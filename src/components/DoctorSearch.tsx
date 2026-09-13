import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Doctor } from '../types';
import { Search, Filter, Star, Clock, Award, CheckCircle, Calendar } from 'lucide-react';

interface DoctorSearchProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctors', {
        params: {
          search: search || undefined,
          specialization: specialization || undefined
        }
      });
      setDoctors(res.data.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Hero Banner */}
      <div className="glass-card" style={{ padding: '3rem 2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.95), rgba(15, 118, 110, 0.95))', color: 'white' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.75rem' }}>
          Consult Verified Ayurvedic & General Specialists
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '650px', marginBottom: '2rem' }}>
          Experience holistic healthcare with 100,000+ instant consultations, real-time doctor availability, and instant digital prescriptions.
        </p>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '0.75rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', minWidth: '240px' }}>
            <Search color="var(--text-muted)" size={20} />
            <input
              type="text"
              placeholder="Search doctor by name or symptom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--text-dark)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
            <Filter color="var(--text-muted)" size={18} />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{ border: 'none', outline: 'none', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)' }}
            >
              <option value="">All Specializations</option>
              <option value="Ayurveda">Ayurveda</option>
              <option value="Dermatology">Dermatology</option>
              <option value="General Physician">General Physician</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>

          <button className="btn btn-accent" onClick={fetchDoctors}>
            Search Doctors
          </button>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Top Available Specialists</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading specialists...
        </div>
      ) : doctors.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No doctors found matching criteria</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try clearing filters or searching for general physician.</p>
        </div>
      ) : (
        <div className="grid-container">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {doctor.name}
                      {doctor.isVerified && <CheckCircle size={18} color="var(--primary)" />}
                    </h3>
                    <p style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      {doctor.specialization} • {doctor.qualification}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>
                    <Star size={14} fill="#b45309" />
                    {doctor.rating}
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doctor.bio || 'Experienced practitioner providing holistic consultations and personalized treatment plans.'}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Award size={16} color="var(--primary)" /> {doctor.experienceYears} Years Exp.
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={16} color="var(--primary)" /> Instant Slots
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Consultation Fee</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>₹{doctor.consultationFee}</span>
                </div>
                <button className="btn btn-primary" onClick={() => onSelectDoctor(doctor)}>
                  <Calendar size={16} /> Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
