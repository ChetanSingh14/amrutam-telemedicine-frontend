import React, { useState, useEffect } from 'react';
import { Doctor } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { AppRoutes } from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { currentUser, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'DOCTOR' && activeTab === 'explore') {
        setActiveTab('doctor-portal');
      } else if (currentUser.role === 'ADMIN' && activeTab === 'explore') {
        setActiveTab('admin');
      }
    } else {
      setActiveTab('explore');
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout('Logged out successfully.');
    setActiveTab('explore');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedDoctor(doctor);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', color: 'var(--primary-dark)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #ccfbf1', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 600 }}>Securing session & validating credentials...</p>
      </div>
    );
  }

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
        <AppRoutes activeTab={activeTab} onSelectDoctor={handleSelectDoctor} />
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
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
