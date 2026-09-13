export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  profile?: {
    fullName: string;
    phone?: string;
    gender?: string;
    dob?: string;
  };
  doctor?: {
    id: string;
    specialization: string;
    qualification: string;
    experienceYears: number;
    consultationFee: number;
    rating: number;
    isVerified: boolean;
  };
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  bio?: string;
  consultationFee: number;
  rating: number;
  isVerified: boolean;
  availableSlots?: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  version: number;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  doctor?: Doctor;
  patient?: { profile?: { fullName: string } };
  slot?: AvailabilitySlot;
  prescription?: Prescription;
  payment?: { amount: number; status: string };
}

export interface Prescription {
  id: string;
  consultationId: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    duration: string;
    frequency?: string;
  }>;
  instructions?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface SystemAnalytics {
  totalRegisteredUsers: number;
  totalVerifiedDoctors: number;
  totalConsultationsBooked: number;
  totalPlatformRevenue: number;
  generatedAt: string;
}
