import React from 'react';
import { User } from '../types';
import { ROUTE_REGISTRY } from '../routes/navigation.config';
import { LogIn, LogOut, HeartHandshake } from 'lucide-react';

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
        {ROUTE_REGISTRY.filter((route) => route.showInNavbar).map((route) => {
          // Check role visibility
          if (route.allowedRoles) {
            if (!currentUser) return null;
            if (!route.allowedRoles.includes(currentUser.role)) return null;
          }

          const Icon = route.icon;
          const isActive = activeTab === route.id;

          return (
            <button
              key={route.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(route.id)}
            >
              <Icon size={18} />
              {route.label}
            </button>
          );
        })}
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
