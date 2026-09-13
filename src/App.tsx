import React, { useState, useEffect } from 'react';
import { User, Doctor } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DoctorSearch } from './components/DoctorSearch';
import { BookingModal } from './components/BookingModal';
import { PatientBookings } from './components/PatientBookings';
import { DoctorPortal } from './components/DoctorPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { api } from './api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('amrutam_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => setCurrentUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('amrutam_token');
          setCurrentUser(null);
        });
    }
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    localStorage.setItem('amrutam_token', token);
    setCurrentUser(user);
    if (user.role === 'DOCTOR') {
      setActiveTab('doctor-portal');
    } else if (user.role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('explore');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('amrutam_token');
    setCurrentUser(null);
    setActiveTab('explore');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedDoctor(doctor);
  };

  return (
    <div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {bookingSuccessMsg && (
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '1rem 5%', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', borderBottom: '1px solid #bbf7d0' }}>
          {bookingSuccessMsg}
        </div>
      )}

      <main style={{ paddingBottom: '4rem' }}>
        {activeTab === 'explore' && (
          <DoctorSearch onSelectDoctor={handleSelectDoctor} />
        )}

        {activeTab === 'my-bookings' && (
          <PatientBookings />
        )}

        {activeTab === 'doctor-portal' && (
          <DoctorPortal />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <BookingModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onSuccess={() => {
          setBookingSuccessMsg('🎉 Consultation booked successfully! You can view it in My Bookings.');
          setTimeout(() => setBookingSuccessMsg(null), 5000);
          setActiveTab('my-bookings');
        }}
      />
    </div>
  );
};

export default App;
