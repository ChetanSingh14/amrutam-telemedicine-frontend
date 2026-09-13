import React from 'react';
import { User } from '../types';
import { Stethoscope, Calendar, UserCheck, Shield, LogIn, LogOut, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  return (
    <nav className="navbar">
      <a href="#" className="brand-logo" onClick={() => setActiveTab('explore')}>
        <div className="brand-icon">
          <HeartHandshake size={24} />
        </div>
        <span>Amrutam Care</span>
      </a>

      <div className="nav-menu">
        <button
          className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <Stethoscope size={18} />
          Find Doctors
        </button>

        {currentUser && (
          <button
            className={`nav-link ${activeTab === 'my-bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bookings')}
          >
            <Calendar size={18} />
            My Bookings
          </button>
        )}

        {currentUser?.role === 'DOCTOR' && (
          <button
            className={`nav-link ${activeTab === 'doctor-portal' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctor-portal')}
          >
            <UserCheck size={18} />
            Doctor Studio
          </button>
        )}

        {currentUser?.role === 'ADMIN' && (
          <button
            className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <Shield size={18} />
            Admin Panel
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              👋 {currentUser.profile?.fullName || currentUser.email}
              <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
                {currentUser.role}
              </span>
            </span>
            <button className="btn btn-secondary" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuth}>
            <LogIn size={16} /> Login / Register
          </button>
        )}
      </div>
    </nav>
  );
};
