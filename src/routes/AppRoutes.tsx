import React from 'react';
import { ROUTE_REGISTRY } from './navigation.config';
import { Doctor } from '../types';
import { useAuth } from '../context/AuthContext';

interface AppRoutesProps {
  activeTab: string;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ activeTab, onSelectDoctor }) => {
  const { currentUser } = useAuth();

  const currentRoute = ROUTE_REGISTRY.find((route) => route.id === activeTab) || ROUTE_REGISTRY[0];

  // Role authorization check
  if (currentRoute.allowedRoles && currentUser) {
    if (!currentRoute.allowedRoles.includes(currentUser.role)) {
      return (
        <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }} className="glass-card">
          <h2 style={{ color: '#b91c1c', marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Your account role (<strong>{currentUser.role}</strong>) does not have permission to view this view.
          </p>
        </div>
      );
    }
  }

  const PageComponent = currentRoute.component;

  return (
    <PageComponent onSelectDoctor={onSelectDoctor} />
  );
};
