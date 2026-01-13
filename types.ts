
export enum Module {
  DASHBOARD = 'DASHBOARD',
  PATIENTS = 'PATIENTS',
  APPOINTMENTS = 'APPOINTMENTS',
  CONSULTATION = 'CONSULTATION',
  PHARMACY = 'PHARMACY',
  BILLING = 'BILLING',
  AI_CLINIC = 'AI_CLINIC',
  SETTINGS = 'SETTINGS'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  lastVisit: string;
  history: string[];
  allergies: string[];
  philhealthId?: string;
  isSeniorCitizen: boolean;
  isPWD: boolean;
  hmoProvider?: string;
  address: {
    barangay: string;
    city: string;
    province: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  time: string;
  date: string;
  // Fix: Added 'Vaccination' to match usage in AppointmentsView.tsx selection options
  type: 'Checkup' | 'Follow-up' | 'Procedure' | 'Consultation' | 'Vaccination';
  // Fix: Added 'In Progress' to resolve type overlap error in DashboardView.tsx (line 103)
  status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  expiry: string;
  price: number;
  isGeneric: boolean;
}
