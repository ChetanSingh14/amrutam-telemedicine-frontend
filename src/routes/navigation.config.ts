import React from 'react';
import { DoctorSearchPage } from '../pages/DoctorSearchPage';
import { PatientBookingsPage } from '../pages/PatientBookingsPage';
import { DoctorPortalPage } from '../pages/DoctorPortalPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { Role } from '../types';
import { Stethoscope, Calendar, UserCheck, Shield, LucideIcon } from 'lucide-react';

export interface RouteDefinition {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  icon: LucideIcon;
  allowedRoles?: Role[]; // undefined = accessible publicly
  showInNavbar?: boolean;
}

export const ROUTE_REGISTRY: RouteDefinition[] = [
  {
    id: 'explore',
    label: 'Find Doctors',
    component: DoctorSearchPage,
    icon: Stethoscope,
    showInNavbar: true,
  },
  {
    id: 'my-bookings',
    label: 'My Bookings',
    component: PatientBookingsPage,
    icon: Calendar,
    allowedRoles: ['PATIENT', 'DOCTOR', 'ADMIN'],
    showInNavbar: true,
  },
  {
    id: 'doctor-portal',
    label: 'Doctor Studio',
    component: DoctorPortalPage,
    icon: UserCheck,
    allowedRoles: ['DOCTOR'],
    showInNavbar: true,
  },
  {
    id: 'admin',
    label: 'Admin Control',
    component: AdminDashboardPage,
    icon: Shield,
    allowedRoles: ['ADMIN'],
    showInNavbar: true,
  },
];
